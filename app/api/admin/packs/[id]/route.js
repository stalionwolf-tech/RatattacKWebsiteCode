import { NextResponse } from 'next/server';
import { getPackById, updatePack, deletePack } from '@/lib/mystery-packs';
import { ConfigError, classifyMongoError } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

const CONFIG_HELP =
  'MongoDB has not been configured yet. Please add MONGO_URL and DB_NAME to your environment variables.';

/**
 * Map any thrown error to a structured JSON response. Configuration problems
 * become a friendly 503; connection problems are classified (category +
 * recommended fix). We NEVER let the handler throw, so the client always
 * receives JSON (never an HTML error page).
 */
function errorResponse(e) {
  if (e instanceof ConfigError) {
    console.error('[MysteryPack] Configuration error:', e.message);
    return NextResponse.json(
      { success: false, configError: true, category: 'configuration', error: CONFIG_HELP, detail: e.message },
      { status: 503 },
    );
  }
  const info = classifyMongoError(e);
  console.error(`[MysteryPack] Request failed (${info.category}): ${info.message}`);
  return NextResponse.json(
    {
      success: false,
      category: info.category,
      error: info.message,
      recommendation: info.recommendation,
      detail: info.details,
    },
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
