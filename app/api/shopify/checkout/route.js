import { NextResponse } from 'next/server';
import { createCheckoutCart, shopifyEnabled } from '@/lib/shopify-storefront';

export const dynamic = 'force-dynamic';

/**
 * POST /api/shopify/checkout
 * Body: { lines: [{ merchandiseId: 'gid://shopify/ProductVariant/xxx', quantity: 1 }, ...] }
 * Returns: { checkoutUrl, cartId, totalQuantity }
 */
export async function POST(request) {
  try {
    if (!shopifyEnabled) {
      return NextResponse.json({ ok: false, error: 'Shopify integration not configured on the server.' }, { status: 503 });
    }
    const body = await request.json().catch(() => ({}));
    const lines = Array.isArray(body?.lines) ? body.lines : [];
    const cart = await createCheckoutCart(lines);
    return NextResponse.json({
      ok: true,
      cartId: cart.id,
      checkoutUrl: cart.checkoutUrl,
      totalQuantity: cart.totalQuantity,
      subtotal: cart.cost?.subtotalAmount || null,
    });
  } catch (err) {
    const message = err?.message || 'Unknown error';
    // 422 for user-facing (mock items in cart), 500 for internal
    const status = message.includes('No Shopify-live merchandise') ? 422 : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    shopifyEnabled,
    note: 'POST { lines: [{ merchandiseId, quantity }] } to receive a checkoutUrl.',
  });
}
