import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { publishProduct, ShopifyError, type InventoryItem } from '@/lib/shopify';

/**
 * POST /api/admin/shopify/publish
 *
 * Creates a real Shopify product from an inventory item. Fully server-side:
 * Shopify credentials never reach the browser. All Shopify logic lives in
 * lib/shopify.ts. This route only handles auth, validation, and shaping the
 * response.
 *
 * Already gated by middleware.js (matcher includes /api/admin/:path*), but we
 * re-verify the admin session here as defense-in-depth.
 */
export async function POST(request: Request) {
  // ---- Verify admin session ----------------------------------------------
  const session = await auth();
  const sessionUser = session?.user as { email?: string; isAdmin?: boolean } | undefined;
  if (!sessionUser) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
  }
  if (!sessionUser.isAdmin) {
    return NextResponse.json(
      { error: 'Forbidden. Your account is not an authorized admin.' },
      { status: 403 },
    );
  }

  // ---- Parse body ---------------------------------------------------------
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { card, condition, quantity, price, trackInventory } = body ?? {};

  // ---- Validate before touching Shopify -----------------------------------
  if (!card?.name) {
    return NextResponse.json({ error: 'A Pokémon card must be selected.' }, { status: 400 });
  }
  const priceNumber = Number(price);
  if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
    return NextResponse.json(
      { error: 'Price is required and must be greater than 0.' },
      { status: 400 },
    );
  }
  const quantityNumber = Number(quantity);
  if (!Number.isFinite(quantityNumber) || quantityNumber < 0) {
    return NextResponse.json(
      { error: 'Quantity must be 0 or greater.' },
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

  // ---- Publish ------------------------------------------------------------
  try {
    const result = await publishProduct(item);
    return NextResponse.json(result);
  } catch (err) {
    const message =
      err instanceof ShopifyError
        ? err.message
        : err instanceof Error
          ? err.message
          : 'Unexpected error while publishing to Shopify.';
    // Full server-side logging for debugging.
    console.log('[v0] Shopify publish error:', message);
    if (err instanceof Error && err.stack) console.log('[v0] Stack:', err.stack);

    const isConfig = message.includes('not configured');
    return NextResponse.json({ error: message }, { status: isConfig ? 500 : 502 });
  }
}
