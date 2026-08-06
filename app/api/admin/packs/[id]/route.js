import { NextResponse } from 'next/server';
import { getPackById, updatePack, deletePack } from '@/lib/mystery-packs';
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

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const pack = await getPackById(id);
    if (!pack) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, pack });
  } catch (e) {
    return errorResponse(e);
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const pack = await updatePack(id, body);
    if (!pack) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, pack });
  } catch (e) {
    return errorResponse(e);
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const ok = await deletePack(id);
    if (!ok) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, ok: true });
  } catch (e) {
    return errorResponse(e);
  }
}
