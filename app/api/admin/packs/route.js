import { NextResponse } from 'next/server';
import { listPacks, createPack } from '@/lib/mystery-packs';
import { ConfigError } from '@/lib/mongo';

export const dynamic = 'force-dynamic';

const CONFIG_HELP =
  'MongoDB has not been configured yet. Please add MONGO_URL and DB_NAME to your environment variables.';

/**
 * Map any thrown error to a JSON response. Configuration problems become a
 * friendly 503; everything else is a 500. We NEVER let the handler throw,
 * so the client always receives JSON (never an HTML error page).
 */
function errorResponse(e) {
  if (e instanceof ConfigError) {
    console.error('[MysteryPack] Configuration error:', e.message);
    return NextResponse.json(
      { success: false, configError: true, error: CONFIG_HELP, detail: e.message },
      { status: 503 },
    );
  }
  console.error('[MysteryPack] Request failed:', e?.message || e);
  return NextResponse.json(
    { success: false, error: e?.message || 'Unexpected server error.' },
    { status: 500 },
  );
}

/**
 * Admin endpoints for the Mystery Pack Manager.
 * Access is enforced by middleware (requires an allowed admin session).
 */
export async function GET() {
  try {
    const packs = await listPacks();
    return NextResponse.json({ success: true, packs });
  } catch (e) {
    return errorResponse(e);
  }
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const pack = await createPack(body);
    return NextResponse.json({ success: true, pack });
  } catch (e) {
    return errorResponse(e);
  }
}
