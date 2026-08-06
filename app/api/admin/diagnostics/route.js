import { NextResponse } from 'next/server';
import { runDiagnostics, classifyMongoError } from '@/lib/mongo';

export const dynamic = 'force-dynamic';

/**
 * Admin-only MongoDB diagnostics endpoint (protected by middleware).
 * Always returns structured JSON — never a generic 500 HTML page.
 */
export async function POST() {
  try {
    const report = await runDiagnostics();
    return NextResponse.json(report, { status: report.success ? 200 : 200 });
  } catch (err) {
    // Diagnostics should never throw, but if something truly unexpected
    // happens we still return a classified, credential-free payload.
    const info = classifyMongoError(err);
    return NextResponse.json(
      {
        success: false,
        category: info.category,
        message: info.message,
        recommendation: info.recommendation,
        details: info.details,
        steps: [],
      },
      { status: 200 },
    );
  }
}

// Allow a simple GET so the page can render an initial report on load too.
export async function GET() {
  return POST();
}
