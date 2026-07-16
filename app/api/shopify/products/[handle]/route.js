import { NextResponse } from 'next/server';
import { getProductByHandleLive } from '@/lib/shopify';

export const dynamic = 'force-dynamic';

export async function GET(_req, { params }) {
  const { handle } = await params;
  try {
    const { product, source } = await getProductByHandleLive(handle);
    if (!product) return NextResponse.json({ ok: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ok: true, source, product });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
