import { NextResponse } from 'next/server';
import { getPackById } from '@/lib/mystery-packs';

export const dynamic = 'force-dynamic';

/**
 * Public read endpoint for a single production run (archive "View Details").
 * Draft runs are hidden from the public.
 */
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const pack = await getPackById(id);
    if (!pack || pack.status === 'draft') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ pack });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
