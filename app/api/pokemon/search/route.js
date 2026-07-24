import { NextResponse } from 'next/server';

// Search runs on demand — never cache the response.
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const TCG_ENDPOINT = 'https://api.pokemontcg.io/v2/cards';

/**
 * Build a Lucene query for the Pokémon TCG API.
 *
 * IMPORTANT: quoted phrase queries (name:"charizard") make the API return
 * HTTP 500, so we NEVER quote. Instead we escape Lucene special characters,
 * split the search term into tokens, and match each token as a wildcard
 * (name:*token*). Multiple tokens are ANDed, so "charizard vmax" becomes
 * `name:*charizard* name:*vmax*`.
 */
function buildQuery(term) {
  const tokens = term
    .trim()
    .split(/\s+/)
    .map((t) => t.replace(/([+\-&|!(){}[\]^"~?:\\/*])/g, '\\$1')) // escape Lucene specials
    .filter(Boolean);

  if (tokens.length === 0) return '';
  return tokens.map((t) => `name:*${t}*`).join(' ');
}

/**
 * Fetch with retry/backoff. The keyless Pokémon TCG API intermittently
 * returns 429/500/502/503/504 and occasional network errors, which would
 * otherwise surface to the user as "no results". Retrying recovers from
 * these transient failures.
 */
async function fetchWithRetry(url, headers, attempts = 3) {
  let lastError = null;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { headers, signal: AbortSignal.timeout(8000) });
      if (res.ok) return res;
      // Retry transient server/rate-limit errors; fail fast on 4xx (except 429).
      if (res.status === 429 || res.status >= 500) {
        lastError = new Error(`Upstream ${res.status}`);
      } else {
        return res; // non-retryable (e.g. 400) — let caller handle the body
      }
    } catch (err) {
      lastError = err;
    }
    // Exponential-ish backoff: 400ms, 900ms, ...
    if (i < attempts - 1) {
      await new Promise((r) => setTimeout(r, 400 + i * 500));
    }
  }
  throw lastError || new Error('Request failed');
}

function normalize(card) {
  return {
    id: card.id,
    name: card.name,
    image: card.images?.small || card.images?.large || '',
    set: {
      name: card.set?.name || 'Unknown Set',
      id: card.set?.id || '',
    },
    cardNumber: card.number || '',
    rarity: card.rarity || '',
    hp: card.hp || '',
    types: card.types || [],
    artist: card.artist || '',
  };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const term = (searchParams.get('q') || '').trim();

  if (term.length < 2) {
    return NextResponse.json({ cards: [] });
  }

  const q = buildQuery(term);
  if (!q) {
    return NextResponse.json({ cards: [] });
  }

  // URLSearchParams handles all encoding (spaces, wildcards, escapes, accents).
  const params = new URLSearchParams({
    q,
    pageSize: '20',
    orderBy: 'name',
  });
  const url = `${TCG_ENDPOINT}?${params.toString()}`;

  // An API key is optional but dramatically raises the rate limit and
  // stability. It is read ONLY from the environment — never hardcoded.
  const headers = { Accept: 'application/json' };
  if (process.env.POKEMON_TCG_API_KEY) {
    headers['X-Api-Key'] = process.env.POKEMON_TCG_API_KEY;
  }

  try {
    const res = await fetchWithRetry(url, headers);

    if (!res.ok) {
      let message = `Search failed (${res.status})`;
      try {
        const body = await res.json();
        message = body?.error?.message || body?.message || message;
      } catch {
        /* ignore non-JSON error bodies */
      }
      return NextResponse.json({ cards: [], error: message }, { status: 502 });
    }

    const data = await res.json();
    const raw = Array.isArray(data.data) ? data.data : [];

    // Rank results so the closest name matches appear first.
    const lower = term.toLowerCase();
    const cards = raw
      .map(normalize)
      .sort((a, b) => {
        const an = a.name.toLowerCase();
        const bn = b.name.toLowerCase();
        const aExact = an === lower ? 0 : an.startsWith(lower) ? 1 : 2;
        const bExact = bn === lower ? 0 : bn.startsWith(lower) ? 1 : 2;
        if (aExact !== bExact) return aExact - bExact;
        return an.localeCompare(bn);
      })
      .slice(0, 20);

    return NextResponse.json({ cards });
  } catch (err) {
    const message =
      err?.name === 'TimeoutError'
        ? 'The card database timed out. Please try again.'
        : 'Could not reach the card database. Please try again.';
    return NextResponse.json({ cards: [], error: message }, { status: 502 });
  }
}
