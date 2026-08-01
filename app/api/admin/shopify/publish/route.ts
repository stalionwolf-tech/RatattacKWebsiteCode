import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { publishProduct, ShopifyError, type InventoryItem } from '@/lib/shopify-admin';
import { getGameLabel, isGameId, DEFAULT_GAME } from '@/lib/tcg/registry';

/**
 * POST /api/admin/shopify/publish
 *
 * Creates a real Shopify product from an inventory item. Fully server-side:
 * Shopify credentials never reach the browser.
 *
 * The ENTIRE handler is wrapped in try/catch so we ALWAYS return JSON — never
 * an empty body (which the browser reports as "Unexpected end of JSON input").
 */
export async function POST(request: Request) {
  try {
    console.log('[v0] Starting Shopify publish');

    // ---- 1. Verify required environment variables FIRST -------------------
    console.log('[v0] Loading environment variables');
    for (const key of ['SHOPIFY_CLIENT_ID', 'SHOPIFY_CLIENT_SECRET', 'SHOPIFY_SHOP'] as const) {
      if (!process.env[key]?.trim()) {
        console.log(`[v0] Missing environment variable: ${key}`);
        return NextResponse.json(
          { success: false, error: `Missing environment variable: ${key}` },
          { status: 500 },
        );
      }
    }

    // ---- 2. Verify admin session (defense-in-depth over middleware) -------
    console.log('[v0] Verifying admin session');
    const session = await auth();
    const sessionUser = session?.user as { email?: string; isAdmin?: boolean } | undefined;
    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in.' },
        { status: 401 },
      );
    }
    if (!sessionUser.isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Forbidden. Your account is not an authorized admin.' },
        { status: 403 },
      );
    }

    // ---- 3. Parse body ----------------------------------------------------
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON body.' },
        { status: 400 },
      );
    }

    const { card, game: gameFromBody, condition, quantity, price, trackInventory } = body ?? {};

    // ---- 4. Validate before touching Shopify ------------------------------
    if (!card?.name) {
      return NextResponse.json(
        { success: false, error: 'A card must be selected.' },
        { status: 400 },
      );
    }

    // Resolve the game from the explicit body field, the card itself, or the
    // default — so publishing works for every current and future game.
    const gameId = isGameId(gameFromBody)
      ? gameFromBody
      : isGameId(card?.game)
        ? card.game
        : DEFAULT_GAME;
    const gameLabel = getGameLabel(gameId);
    const priceNumber = Number(price);
    if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
      return NextResponse.json(
        { success: false, error: 'Price is required and must be greater than 0.' },
        { status: 400 },
      );
    }
    const quantityNumber = Number(quantity);
    if (!Number.isFinite(quantityNumber) || quantityNumber < 0) {
      return NextResponse.json(
        { success: false, error: 'Quantity must be 0 or greater.' },
        { status: 400 },
      );
    }

    // Support the normalized model (card.set is a string, card.number) while
    // remaining backward-compatible with the legacy Pokémon shape
    // (card.set.name, card.cardNumber).
    const setName =
      typeof card.set === 'string' ? card.set : card.set?.name || undefined;
    const cardNumber = card.number ?? card.cardNumber;
    const meta = card.metadata ?? {};

    const item: InventoryItem = {
      name: card.name,
      game: gameLabel,
      set: setName,
      cardNumber: cardNumber ? String(cardNumber) : undefined,
      rarity: card.rarity || undefined,
      condition: condition || 'Unspecified',
      quantity: Math.floor(quantityNumber),
      price: priceNumber,
      imageUrl: card.image || undefined,
      trackInventory: Boolean(trackInventory),
      metadata: {
        cardType: meta.type || undefined,
        attribute: meta.attribute || undefined,
        level: typeof meta.level === 'number' ? meta.level : undefined,
        atk: typeof meta.atk === 'number' ? meta.atk : undefined,
        def: typeof meta.def === 'number' ? meta.def : undefined,
        archetype: meta.archetype || undefined,
        hp: meta.hp || undefined,
        types: Array.isArray(meta.types) && meta.types.length ? meta.types : undefined,
        artist: meta.artist || undefined,
      },
    };

    // ---- 5. Authenticate + create product ---------------------------------
    console.log('[v0] Authenticating');
    console.log('[v0] Creating product');
    const result = await publishProduct(item);

    console.log('[v0] Done');
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    // Never let an exception escape without structured JSON.
    const message =
      error instanceof ShopifyError
        ? error.message
        : error instanceof Error
          ? error.message
          : 'Unknown error';
    console.log('[v0] Shopify publish failed:', message);
    if (error instanceof Error && error.stack) console.log('[v0] Stack:', error.stack);

    return NextResponse.json(
      {
        success: false,
        error: message,
        stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
