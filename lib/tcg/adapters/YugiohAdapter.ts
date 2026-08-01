/**
 * Yu-Gi-Oh! adapter — wraps the YGOPRODeck API (https://db.ygoprodeck.com/api/v7).
 *
 * Fuzzy search uses the `fname` parameter:
 *   https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=<query>
 *
 * A single-card lookup uses `id`. All responses are normalized into the shared
 * `NormalizedCard` model so the rest of the app never sees YGOPRODeck's shape.
 */

import type { GameAdapter, NormalizedCard } from '@/lib/tcg/types';

const YGO_ENDPOINT = 'https://db.ygoprodeck.com/api/v7/cardinfo.php';

interface RawYugiohSet {
  set_name?: string;
  set_code?: string;
  set_rarity?: string;
  set_price?: string;
}

interface RawYugiohImage {
  id?: number;
  image_url?: string;
  image_url_small?: string;
}

interface RawYugiohPrice {
  cardmarket_price?: string;
  tcgplayer_price?: string;
  ebay_price?: string;
  amazon_price?: string;
}

interface RawYugiohCard {
  id: number;
  name: string;
  type?: string;
  frameType?: string;
  desc?: string;
  atk?: number;
  def?: number;
  level?: number;
  race?: string;
  attribute?: string;
  archetype?: string;
  card_sets?: RawYugiohSet[];
  card_images?: RawYugiohImage[];
  card_prices?: RawYugiohPrice[];
}

async function fetchWithTimeout(url: string): Promise<Response> {
  return fetch(url, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(8000),
  });
}

/** Best-effort numeric price from YGOPRODeck's stringified prices. */
function extractPrice(card: RawYugiohCard): number | undefined {
  const p = card.card_prices?.[0];
  if (!p) return undefined;
  const candidates = [p.tcgplayer_price, p.cardmarket_price, p.ebay_price, p.amazon_price];
  for (const raw of candidates) {
    const n = Number(raw);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return undefined;
}

export const YugiohAdapter: GameAdapter<RawYugiohCard> = {
  id: 'yugioh',
  label: 'Yu-Gi-Oh!',

  normalize(card: RawYugiohCard): NormalizedCard {
    const firstSet = card.card_sets?.[0];
    const image =
      card.card_images?.[0]?.image_url_small || card.card_images?.[0]?.image_url || '';

    return {
      id: String(card.id),
      game: 'yugioh',
      name: card.name,
      image,
      set: firstSet?.set_name || 'Unknown Set',
      rarity: firstSet?.set_rarity || '',
      number: firstSet?.set_code || String(card.id),
      marketPrice: extractPrice(card),
      metadata: {
        type: card.type || '',
        attribute: card.attribute || '',
        level: typeof card.level === 'number' ? card.level : undefined,
        atk: typeof card.atk === 'number' ? card.atk : undefined,
        def: typeof card.def === 'number' ? card.def : undefined,
        archetype: card.archetype || '',
        setNames: Array.from(
          new Set((card.card_sets || []).map((s) => s.set_name).filter(Boolean) as string[]),
        ),
      },
    };
  },

  async search(query: string): Promise<NormalizedCard[]> {
    const term = query.trim();
    if (term.length < 2) return [];

    const url = `${YGO_ENDPOINT}?fname=${encodeURIComponent(term)}&num=20&offset=0`;

    let res: Response;
    try {
      res = await fetchWithTimeout(url);
    } catch (err) {
      if (err instanceof Error && err.name === 'TimeoutError') {
        throw new Error('The card database timed out. Please try again.');
      }
      throw new Error('Could not reach the card database. Please try again.');
    }

    // YGOPRODeck returns 400 with `{ error: "No card matching your query" }`
    // when nothing is found — that's an empty result, not a failure.
    if (res.status === 400) return [];

    if (!res.ok) {
      let message = `Search failed (${res.status})`;
      try {
        const body = await res.json();
        message = body?.error || message;
      } catch {
        /* ignore */
      }
      // A "no results" error should surface as an empty list, not an error.
      if (/no card matching/i.test(message)) return [];
      throw new Error(message);
    }

    const data = await res.json();
    const raw: RawYugiohCard[] = Array.isArray(data.data) ? data.data : [];

    const lower = term.toLowerCase();
    return raw
      .map((c) => this.normalize(c))
      .sort((a, b) => {
        const an = a.name.toLowerCase();
        const bn = b.name.toLowerCase();
        const aExact = an === lower ? 0 : an.startsWith(lower) ? 1 : 2;
        const bExact = bn === lower ? 0 : bn.startsWith(lower) ? 1 : 2;
        if (aExact !== bExact) return aExact - bExact;
        return an.localeCompare(bn);
      })
      .slice(0, 20);
  },

  async getCard(id: string): Promise<NormalizedCard | null> {
    if (!id) return null;
    const url = `${YGO_ENDPOINT}?id=${encodeURIComponent(id)}`;
    let res: Response;
    try {
      res = await fetchWithTimeout(url);
    } catch {
      throw new Error('Could not reach the card database. Please try again.');
    }
    if (res.status === 400) return null;
    if (!res.ok) throw new Error(`Lookup failed (${res.status})`);
    const data = await res.json();
    const raw: RawYugiohCard[] = Array.isArray(data.data) ? data.data : [];
    if (raw.length === 0) return null;
    return this.normalize(raw[0]);
  },
};
