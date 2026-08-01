/**
 * Magic: The Gathering adapter — wraps the Scryfall API (https://api.scryfall.com).
 *
 * Search is a two-step flow, exactly as the marketplace spec requests:
 *   1. `/cards/autocomplete?q=<query>` returns up to 20 candidate card names
 *      while the user types (fast, fuzzy, prefix/substring matching).
 *   2. `/cards/search?q=<query>` returns full card objects; we use it to fetch
 *      rich data for the candidate names and normalize them into the shared
 *      `NormalizedCard` model.
 *
 * A single-card lookup uses `/cards/:id`. The rest of the app never sees
 * Scryfall's response shape.
 *
 * Scryfall asks all clients to send a descriptive User-Agent and an Accept
 * header, and to keep request rates modest — both are honored below.
 */

import type { GameAdapter, NormalizedCard } from '@/lib/tcg/types';

const SCRYFALL_BASE = 'https://api.scryfall.com';

const SCRYFALL_HEADERS = {
  Accept: 'application/json',
  'User-Agent': 'RatAttacKTCG/1.0 (+https://ratattack.example)',
};

interface RawMagicImageUris {
  small?: string;
  normal?: string;
  large?: string;
  png?: string;
}

interface RawMagicPrices {
  usd?: string | null;
  usd_foil?: string | null;
  usd_etched?: string | null;
}

interface RawMagicCardFace {
  name?: string;
  mana_cost?: string;
  type_line?: string;
  oracle_text?: string;
  power?: string;
  toughness?: string;
  loyalty?: string;
  colors?: string[];
  artist?: string;
  image_uris?: RawMagicImageUris;
}

interface RawMagicCard {
  id: string;
  name: string;
  mana_cost?: string;
  cmc?: number;
  type_line?: string;
  oracle_text?: string;
  power?: string;
  toughness?: string;
  loyalty?: string;
  colors?: string[];
  color_identity?: string[];
  rarity?: string;
  set?: string;
  set_name?: string;
  collector_number?: string;
  artist?: string;
  foil?: boolean;
  nonfoil?: boolean;
  image_uris?: RawMagicImageUris;
  card_faces?: RawMagicCardFace[];
  prices?: RawMagicPrices;
}

async function fetchScryfall(url: string): Promise<Response> {
  return fetch(url, {
    headers: SCRYFALL_HEADERS,
    signal: AbortSignal.timeout(8000),
  });
}

/** Pick the best available image, falling back to the front face. */
function extractImage(card: RawMagicCard): string {
  const uris = card.image_uris || card.card_faces?.[0]?.image_uris;
  return uris?.normal || uris?.large || uris?.small || uris?.png || '';
}

/** Best-effort numeric market price (nonfoil first, then foil). */
function extractPrice(card: RawMagicCard): number | undefined {
  const candidates = [card.prices?.usd, card.prices?.usd_foil, card.prices?.usd_etched];
  for (const raw of candidates) {
    const n = Number(raw);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return undefined;
}

export const MagicAdapter: GameAdapter<RawMagicCard> = {
  id: 'magic',
  label: 'Magic: The Gathering',

  normalize(card: RawMagicCard): NormalizedCard {
    // Double-faced cards keep mana cost / oracle text / P/T on each face; fall
    // back to the front face when the top-level field is absent.
    const front = card.card_faces?.[0];

    return {
      id: card.id,
      game: 'magic',
      name: card.name,
      image: extractImage(card),
      set: card.set_name || card.set?.toUpperCase() || 'Unknown Set',
      rarity: card.rarity ? card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1) : '',
      number: card.collector_number || '',
      marketPrice: extractPrice(card),
      metadata: {
        manaCost: card.mana_cost || front?.mana_cost || '',
        cmc: typeof card.cmc === 'number' ? card.cmc : undefined,
        typeLine: card.type_line || front?.type_line || '',
        oracleText: card.oracle_text || front?.oracle_text || '',
        power: card.power ?? front?.power,
        toughness: card.toughness ?? front?.toughness,
        loyalty: card.loyalty ?? front?.loyalty,
        colors: card.colors || front?.colors || [],
        colorIdentity: card.color_identity || [],
        artist: card.artist || front?.artist || '',
        foil: Boolean(card.foil),
        nonfoil: Boolean(card.nonfoil),
      },
    };
  },

  async search(query: string): Promise<NormalizedCard[]> {
    const term = query.trim();
    if (term.length < 2) return [];

    // Step 1 — autocomplete for fast, fuzzy name candidates while typing.
    let names: string[] = [];
    try {
      const acRes = await fetchScryfall(
        `${SCRYFALL_BASE}/cards/autocomplete?q=${encodeURIComponent(term)}`,
      );
      if (acRes.ok) {
        const acData = await acRes.json();
        names = Array.isArray(acData?.data) ? acData.data.slice(0, 20) : [];
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'TimeoutError') {
        throw new Error('The card database timed out. Please try again.');
      }
      throw new Error('Could not reach the card database. Please try again.');
    }

    // Step 2 — pull full card data. Build one Scryfall search query from the
    // autocomplete names (falling back to the raw term) so we get rich objects
    // in a single request instead of one lookup per name.
    const scryfallQuery =
      names.length > 0
        ? names.map((n) => `!"${n.replace(/"/g, '')}"`).join(' or ')
        : term;

    let res: Response;
    try {
      res = await fetchScryfall(
        `${SCRYFALL_BASE}/cards/search?q=${encodeURIComponent(scryfallQuery)}` +
          `&unique=cards&order=name`,
      );
    } catch (err) {
      if (err instanceof Error && err.name === 'TimeoutError') {
        throw new Error('The card database timed out. Please try again.');
      }
      throw new Error('Could not reach the card database. Please try again.');
    }

    // Scryfall returns 404 with `{ object: "error" }` when nothing matches —
    // that's an empty result, not a failure.
    if (res.status === 404) return [];
    if (!res.ok) {
      let message = `Search failed (${res.status})`;
      try {
        const body = await res.json();
        message = body?.details || message;
      } catch {
        /* ignore */
      }
      throw new Error(message);
    }

    const data = await res.json();
    const raw: RawMagicCard[] = Array.isArray(data?.data) ? data.data : [];

    const lower = term.toLowerCase();
    const normalized = raw.map((c) => this.normalize(c));

    // Preserve the autocomplete ordering when we have it (most relevant first),
    // otherwise rank by name similarity to the query.
    if (names.length > 0) {
      const order = new Map(names.map((n, i) => [n.toLowerCase(), i]));
      normalized.sort((a, b) => {
        const ai = order.has(a.name.toLowerCase()) ? order.get(a.name.toLowerCase())! : 999;
        const bi = order.has(b.name.toLowerCase()) ? order.get(b.name.toLowerCase())! : 999;
        return ai - bi;
      });
    } else {
      normalized.sort((a, b) => {
        const an = a.name.toLowerCase();
        const bn = b.name.toLowerCase();
        const aRank = an === lower ? 0 : an.startsWith(lower) ? 1 : 2;
        const bRank = bn === lower ? 0 : bn.startsWith(lower) ? 1 : 2;
        if (aRank !== bRank) return aRank - bRank;
        return an.localeCompare(bn);
      });
    }

    return normalized.slice(0, 20);
  },

  async getCard(id: string): Promise<NormalizedCard | null> {
    if (!id) return null;
    let res: Response;
    try {
      res = await fetchScryfall(`${SCRYFALL_BASE}/cards/${encodeURIComponent(id)}`);
    } catch {
      throw new Error('Could not reach the card database. Please try again.');
    }
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Lookup failed (${res.status})`);
    const raw: RawMagicCard = await res.json();
    if (!raw?.id) return null;
    return this.normalize(raw);
  },
};
