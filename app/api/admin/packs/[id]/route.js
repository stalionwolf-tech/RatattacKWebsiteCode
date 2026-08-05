import { NextResponse } from 'next/server';
import { getPackById, updatePack, deletePack } from '@/lib/mystery-packs';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const pack = await getPackById(id);
    if (!pack) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ pack });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const pack = await updatePack(id, body);
    if (!pack) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ pack });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const ok = await deletePack(id);
    if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
