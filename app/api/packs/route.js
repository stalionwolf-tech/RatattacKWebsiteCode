import { NextResponse } from 'next/server';
import { getActivePack, getArchivePacks, defaultSeed } from '@/lib/mystery-packs';

export const dynamic = 'force-dynamic';

/**
 * Public read endpoint for the Mystery Pack page.
 * Returns the currently ACTIVE production run plus the public archive.
 * Draft runs are never exposed here.
 *
 * If the database is unavailable (e.g. MONGO_URL not configured), we fall
 * back to the built-in default run so the public page always renders, and we
 * still respond with JSON (never an HTML error page).
 */
export async function GET() {
  try {
    const active = await getActivePack();
    const archive = await getArchivePacks(active?.id);
    return NextResponse.json({ active: active || null, archive });
  } catch (e) {
    console.error('[MysteryPack] Public read failed, using default seed:', e?.message || e);
    return NextResponse.json({ active: defaultSeed(), archive: [], fallback: true });
  }
}
