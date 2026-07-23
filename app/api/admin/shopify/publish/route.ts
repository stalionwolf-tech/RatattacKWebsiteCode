import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { publishProduct, type InventoryItem } from '@/lib/shopify';

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

    const { card, condition, quantity, price, trackInventory } = body ?? {};

    // ---- 4. Validate before touching Shopify ------------------------------
    if (!card?.name) {
      return NextResponse.json(
        { success: false, error: 'A Pokémon card must be selected.' },
        { status: 400 },
      );
    }
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

    const item: InventoryItem = {
      name: card.name,
      set: card.set?.name,
      cardNumber: card.cardNumber ? String(card.cardNumber) : undefined,
      rarity: card.rarity || undefined,
      condition: condition || 'Unspecified',
      quantity: Math.floor(quantityNumber),
      price: priceNumber,
      imageUrl: card.image || undefined,
      trackInventory: Boolean(trackInventory),
    };

    // ---- 5. Authenticate + create product ---------------------------------
    console.log('[v0] Authenticating');
    console.log('[v0] Creating product');
    const result = await publishProduct(item);

    console.log('[v0] Done');
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    // Never let an exception escape without structured JSON.
    // Use safe property checks instead of `instanceof` — the right-hand side of
    // `instanceof` can be undefined at runtime (e.g. a bundling/import issue),
    // which itself throws "Right-hand side of 'instanceof' is not an object".
    console.log('[v0] Shopify publish caught error. typeof:', typeof error, 'value:', error);

    const message =
      error && typeof error === 'object' && 'message' in error
        ? String((error as { message: unknown }).message)
        : String(error);

    const stack =
      error && typeof error === 'object' && 'stack' in error
        ? String((error as { stack: unknown }).stack)
        : undefined;

    console.log('[v0] Shopify publish failed:', message);
    if (stack) console.log('[v0] Stack:', stack);

    return NextResponse.json(
      {
        success: false,
        error: message,
        stack: process.env.NODE_ENV === 'development' ? stack : undefined,
      },
      { status: 500 },
    );
  }
}
