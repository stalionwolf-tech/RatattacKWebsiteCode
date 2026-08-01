/**
 * Pokémon TCG adapter — wraps https://api.pokemontcg.io/v2.
 *
 * This preserves the EXACT behavior the marketplace shipped with (Lucene query
 * building, retry/backoff, name-match ranking) and simply re-expresses it
 * behind the shared `GameAdapter` contract, normalizing into `NormalizedCard`.
 */

import type { GameAdapter, NormalizedCard } from '@/lib/tcg/types';

const TCG_ENDPOINT = 'https://api.pokemontcg.io/v2/cards';

interface RawPokemonCard {
  id: string;
  name: string;
  number?: string;
  rarity?: string;
  hp?: string;
  types?: string[];
  artist?: string;
  images?: { small?: string; large?: string };
  set?: { name?: string; id?: string };
  cardmarket?: { prices?: { averageSellPrice?: number; trendPrice?: number } };
  tcgplayer?: { prices?: Record<string, { market?: number; mid?: number } | undefined> };
}

/**
 * Build a Lucene query for the Pokémon TCG API.
 *
 * IMPORTANT: quoted phrase queries (name:"charizard") make the API return
 * HTTP 500, so we NEVER quote. Instead we escape Lucene special characters,
 * split the term into tokens, and match each as a wildcard (name:*token*).
 */
function buildQuery(term: string): string {
  const tokens = term
    .trim()
    .split(/\s+/)
    .map((t) => t.replace(/([+\-&|!(){}[\]^"~?:\\/*])/g, '\\$1'))
    .filter(Boolean);

  if (tokens.length === 0) return '';
  return tokens.map((t) => `name:*${t}*`).join(' ');
}

/**
 * Fetch with retry/backoff. The keyless Pokémon TCG API intermittently returns
 * 429/500/502/503/504, which would otherwise surface as "no results".
 */
async function fetchWithRetry(
  url: string,
  headers: Record<string, string>,
  attempts = 3,
): Promise<Response> {
  let lastError: unknown = null;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { headers, signal: AbortSignal.timeout(8000) });
      if (res.ok) return res;
      if (res.status === 429 || res.status >= 500) {
        lastError = new Error(`Upstream ${res.status}`);
      } else {
        return res;
      }
    } catch (err) {
      lastError = err;
    }
    if (i < attempts - 1) {
      await new Promise((r) => setTimeout(r, 400 + i * 500));
    }
  }
  throw lastError || new Error('Request failed');
}

/** Pull the best available market price from a raw Pokémon card. */
function extractPrice(card: RawPokemonCard): number | undefined {
  const cm = card.cardmarket?.prices;
  if (cm?.trendPrice) return cm.trendPrice;
  if (cm?.averageSellPrice) return cm.averageSellPrice;
  const tcg = card.tcgplayer?.prices;
  if (tcg) {
    for (const variant of Object.values(tcg)) {
      if (variant?.market) return variant.market;
      if (variant?.mid) return variant.mid;
    }
  }
  return undefined;
}

function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (process.env.POKEMON_TCG_API_KEY) {
    headers['X-Api-Key'] = process.env.POKEMON_TCG_API_KEY;
  }
  return headers;
}

export const PokemonAdapter: GameAdapter<RawPokemonCard> = {
  id: 'pokemon',
  label: 'Pokémon',

  normalize(card: RawPokemonCard): NormalizedCard {
    return {
      id: card.id,
      game: 'pokemon',
      name: card.name,
      image: card.images?.small || card.images?.large || '',
      set: card.set?.name || 'Unknown Set',
      rarity: card.rarity || '',
      number: card.number || '',
      marketPrice: extractPrice(card),
      metadata: {
        hp: card.hp || '',
        types: card.types || [],
        artist: card.artist || '',
      },
    };
  },

  async search(query: string): Promise<NormalizedCard[]> {
    const term = query.trim();
    if (term.length < 2) return [];

    const q = buildQuery(term);
    if (!q) return [];

    const params = new URLSearchParams({ q, pageSize: '20', orderBy: 'name' });
    const url = `${TCG_ENDPOINT}?${params.toString()}`;

    const res = await fetchWithRetry(url, authHeaders());
    if (!res.ok) {
      let message = `Search failed (${res.status})`;
      try {
        const body = await res.json();
        message = body?.error?.message || body?.message || message;
      } catch {
        /* ignore non-JSON error bodies */
      }
      throw new Error(message);
    }

    const data = await res.json();
    const raw: RawPokemonCard[] = Array.isArray(data.data) ? data.data : [];

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
    const url = `${TCG_ENDPOINT}/${encodeURIComponent(id)}`;
    const res = await fetchWithRetry(url, authHeaders());
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Lookup failed (${res.status})`);
    }
    const data = await res.json();
    if (!data?.data) return null;
    return this.normalize(data.data as RawPokemonCard);
  },
};
