import { NextResponse } from 'next/server';
import { getAllProductsLive, shopifyEnabled } from '@/lib/shopify-storefront';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const url = new URL(request.url);
  const first = Math.min(100, Number(url.searchParams.get('first') || 50));
  try {
    const { products, source } = await getAllProductsLive({ first });
    return NextResponse.json({ ok: true, source, count: products.length, shopifyEnabled, products });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
