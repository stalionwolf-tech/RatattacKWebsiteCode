/**
 * Game adapter registry — the single source of truth for supported games.
 *
 * This is the abstraction layer requested by the marketplace: callers do
 *
 *   getAdapter(game).search(query)
 *
 * and never touch a concrete API client. Adding a future game (Magic: The
 * Gathering, One Piece, Disney Lorcana, Flesh and Blood, ...) requires ONLY:
 *
 *   1. Write `lib/tcg/adapters/<Game>Adapter.ts` implementing `GameAdapter`.
 *   2. Add its `GameId` to `lib/tcg/types.ts`.
 *   3. Add one entry to `ADAPTERS` below.
 *
 * No UI, hook, or Shopify-publishing changes are required.
 */

import type { GameAdapter, GameId, GameOption } from '@/lib/tcg/types';
import { PokemonAdapter } from '@/lib/tcg/adapters/PokemonAdapter';
import { YugiohAdapter } from '@/lib/tcg/adapters/YugiohAdapter';

/** All registered adapters, keyed by game id. */
const ADAPTERS: Record<GameId, GameAdapter> = {
  pokemon: PokemonAdapter,
  yugioh: YugiohAdapter,
};

/** Default game shown when nothing is selected. */
export const DEFAULT_GAME: GameId = 'pokemon';

/** Type guard: is this string a supported game id? */
export function isGameId(value: unknown): value is GameId {
  return typeof value === 'string' && value in ADAPTERS;
}

/**
 * Resolve the adapter for a game. Falls back to the default game for any
 * unknown value so the UI can never crash on a bad id.
 */
export function getAdapter(game: string | GameId): GameAdapter {
  return ADAPTERS[isGameId(game) ? game : DEFAULT_GAME];
}

/** Options for rendering the game selector (order defines display order). */
export const GAME_OPTIONS: GameOption[] = [
  { id: 'pokemon', label: PokemonAdapter.label },
  { id: 'yugioh', label: YugiohAdapter.label },
];

/** Human label for a game id (e.g. for Shopify tags / descriptions). */
export function getGameLabel(game: string | GameId): string {
  return getAdapter(game).label;
}
