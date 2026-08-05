import { NextResponse } from 'next/server';
import { listPacks, createPack } from '@/lib/mystery-packs';

export const dynamic = 'force-dynamic';

/**
 * Admin endpoints for the Mystery Pack Manager.
 * Access is enforced by middleware (requires an allowed admin session).
 */
export async function GET() {
  try {
    const packs = await listPacks();
    return NextResponse.json({ packs });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const pack = await createPack(body);
    return NextResponse.json({ pack });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
