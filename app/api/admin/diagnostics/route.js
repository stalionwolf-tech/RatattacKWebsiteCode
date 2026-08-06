import { NextResponse } from 'next/server';
import { clientPromise, classifyMongoError, getConnectionInfo, ConfigError } from '@/lib/mongodb';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Admin-only MongoDB diagnostics (protected by middleware). Always returns
 * structured JSON with a step-by-step report. Uses the SAME minimal client as
 * the rest of the app — a bare `new MongoClient(uri)` with NO custom TLS
 * options — so the diagnostics reflect real connection behaviour.
 */
async function runDiagnostics() {
  const started = Date.now();
  const info = getConnectionInfo();
  const steps = [];

  // 1. Environment variables present.
  const hasUri = Boolean(process.env.MONGO_URL);
  steps.push({
    label: 'Environment variables',
    pass: hasUri,
    category: hasUri ? undefined : 'configuration',
    recommendation: hasUri ? undefined : 'Add MONGO_URL (and optionally DB_NAME) to your environment variables.',
  });

  if (!hasUri) {
    return {
      success: false,
      category: 'configuration',
      recommendation: 'Add MONGO_URL (and optionally DB_NAME) to your environment variables, then redeploy.',
      host: null,
      dbName: info.dbName,
      driverVersion: info.driverVersion,
      durationMs: Date.now() - started,
      steps,
    };
  }

  let topCategory = null;
  let topRecommendation = null;

  try {
    // 2. Connect (driver negotiates TLS automatically).
    const client = await clientPromise();
    steps.push({ label: 'Connect + TLS handshake', pass: true });

    // 3. Ping.
    await client.db(info.dbName).command({ ping: 1 });
    steps.push({ label: 'Ping deployment', pass: true });

    // 4. Auth check.
    await client.db(info.dbName).command({ connectionStatus: 1 });
    steps.push({ label: 'Authentication', pass: true });

    // 5. Read.
    await client.db(info.dbName).listCollections().toArray();
    steps.push({ label: 'Read (list collections)', pass: true });
  } catch (err) {
    const c = classifyMongoError(err);
    topCategory = c.category;
    topRecommendation = c.recommendation;
    steps.push({
      label: 'Connect + TLS handshake',
      pass: false,
      category: c.category,
      recommendation: c.recommendation,
    });
  }

  const success = steps.every((s) => s.pass);
  return {
    success,
    category: success ? undefined : topCategory,
    recommendation: success ? undefined : topRecommendation,
    host: info.host,
    dbName: info.dbName,
    driverVersion: info.driverVersion,
    durationMs: Date.now() - started,
    steps,
  };
}

export async function POST() {
  try {
    const report = await runDiagnostics();
    return NextResponse.json(report, { status: 200 });
  } catch (err) {
    const info = err instanceof ConfigError
      ? { category: 'configuration', message: err.message, recommendation: 'Add MONGO_URL to your environment.', details: err.message }
      : classifyMongoError(err);
    return NextResponse.json(
      {
        success: false,
        category: info.category,
        recommendation: info.recommendation,
        steps: [],
      },
      { status: 200 },
    );
  }
}

export async function GET() {
  return POST();
}
