import { NextResponse } from 'next/server';
import { subscribeToNewsletter } from '@/lib/shopify-storefront';

export const dynamic = 'force-dynamic';

/**
 * POST /api/newsletter
 * Body: { email: "user@example.com" }
 *
 * Subscribes the email in Shopify Admin as a customer with SUBSCRIBED marketing
 * consent. Customer then appears in Shopify Admin → Customers → filter by
 * "Email subscribers" and you can send campaigns via Shopify Email (built-in,
 * free up to 10k emails/month).
 */
export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body?.email || '').trim();
    if (!email) {
      return NextResponse.json({ ok: false, error: 'Email is required.' }, { status: 400 });
    }
    const result = await subscribeToNewsletter(email);
    return NextResponse.json(result);
  } catch (err) {
    const message = err?.message || 'Subscription failed.';
    const isValidation = /valid email|required/i.test(message);
    return NextResponse.json({ ok: false, error: message }, { status: isValidation ? 400 : 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    note: 'POST { email } to subscribe. Subscribers land in Shopify Admin → Customers.',
  });
}
