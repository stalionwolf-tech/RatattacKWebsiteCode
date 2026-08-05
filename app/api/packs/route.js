import { NextResponse } from 'next/server';
import { getActivePack, getArchivePacks } from '@/lib/mystery-packs';

export const dynamic = 'force-dynamic';

/**
 * Public read endpoint for the Mystery Pack page.
 * Returns the currently ACTIVE production run plus the public archive.
 * Draft runs are never exposed here.
 */
export async function GET() {
  try {
    const active = await getActivePack();
    const archive = await getArchivePacks(active?.id);
    return NextResponse.json({ active: active || null, archive });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
