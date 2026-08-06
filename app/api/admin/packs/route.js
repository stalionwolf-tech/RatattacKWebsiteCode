import { NextResponse } from 'next/server';
import { listPacks, createPack } from '@/lib/mystery-packs';
import { ConfigError, classifyMongoError } from '@/lib/mongo';

export const dynamic = 'force-dynamic';

const CONFIG_HELP =
  'MongoDB has not been configured yet. Please add MONGO_URL and DB_NAME to your environment variables.';

/**
 * Map any thrown error to a structured JSON response. Configuration problems
 * become a friendly 503; connection problems are classified (category +
 * recommended fix) so the client can show the exact failure instead of a
 * generic "Save failed". We NEVER let the handler throw, so the client always
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
