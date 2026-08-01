/**
 * Shared trading-card types for the multi-game marketplace.
 *
 * Every game (Pokémon, Yu-Gi-Oh!, and any future addition) is accessed through
 * a `GameAdapter`. Each adapter is responsible for talking to ONE external API
 * and normalizing its responses into a single `NormalizedCard` shape. The rest
 * of the application — the admin dashboard, the Shopify publisher, inventory —
 * only ever sees `NormalizedCard`, so it never needs to know which API a card
 * came from.
 *
 * Adding a new game requires ONLY:
 *   1. Creating a new adapter that implements `GameAdapter`.
 *   2. Registering it in `lib/tcg/registry.ts`.
 * No UI or publishing changes are required.
 */

/** Identifier for a supported trading-card game. */
export type GameId = 'pokemon' | 'yugioh';

/** Extra, game-specific attributes carried alongside the common fields. */
export interface CardMetadata {
  // Yu-Gi-Oh! specific
  type?: string;
  attribute?: string;
  level?: number;
  atk?: number;
  def?: number;
  archetype?: string;

  // Pokémon specific
  hp?: string;
  types?: string[];
  artist?: string;

  // Common extras
  /** All set names a card appears in (Yu-Gi-Oh! cards span many sets). */
  setNames?: string[];
}

/**
 * The single, game-agnostic card model the entire application consumes.
 * Matches the marketplace's normalization contract.
 */
export interface NormalizedCard {
  /** Stable unique id used for selection + React keys. */
  id: string;
  game: GameId;
  name: string;
  image: string;
  /** Primary set name (string, not an object). */
  set: string;
  rarity: string;
  /** Card number / set code. */
  number: string;
  marketPrice?: number;
  metadata: CardMetadata;
}

/**
 * Contract every game integration must implement. Callers use only these three
 * methods, regardless of the underlying API:
 *
 *   adapter.search(query)  -> NormalizedCard[]
 *   adapter.getCard(id)    -> NormalizedCard | null
 *   adapter.normalize(raw) -> NormalizedCard
 */
export interface GameAdapter<Raw = unknown> {
  /** Machine id, e.g. "pokemon". */
  readonly id: GameId;
  /** Human label, e.g. "Pokémon". */
  readonly label: string;
  /** Fuzzy search by name/keyword. Returns normalized cards. */
  search(query: string): Promise<NormalizedCard[]>;
  /** Fetch a single card by its adapter-specific id. */
  getCard(id: string): Promise<NormalizedCard | null>;
  /** Convert one raw API object into the normalized model. */
  normalize(raw: Raw): NormalizedCard;
}

/** Descriptor used by the UI to render the game selector. */
export interface GameOption {
  id: GameId;
  label: string;
}
