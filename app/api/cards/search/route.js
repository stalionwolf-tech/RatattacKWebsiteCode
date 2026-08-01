import { NextResponse } from 'next/server';
import { getAdapter, isGameId, DEFAULT_GAME } from '@/lib/tcg/registry';

/**
 * GET /api/cards/search?game=<pokemon|yugioh>&q=<term>
 *
 * Game-agnostic search endpoint. It selects the correct `GameAdapter` from the
 * registry and returns normalized cards — the client never knows which upstream
 * API was queried. Adding a future game requires no changes to this route.
 *
 * Search runs on demand — never cache the response.
 */
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const term = (searchParams.get('q') || '').trim();
  const gameParam = searchParams.get('game') || DEFAULT_GAME;
  const game = isGameId(gameParam) ? gameParam : DEFAULT_GAME;

  if (term.length < 2) {
    return NextResponse.json({ game, cards: [] });
  }

  try {
    const adapter = getAdapter(game);
    const cards = await adapter.search(term);
    return NextResponse.json({ game, cards });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Could not reach the card database. Please try again.';
    return NextResponse.json({ game, cards: [], error: message }, { status: 502 });
  }
}
