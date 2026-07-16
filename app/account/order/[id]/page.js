import { notFound } from 'next/navigation';

// No customer orders exist locally — order detail is only available once the
// customer has real Shopify orders. Any direct visit to /account/order/[id]
// resolves to a 404 to avoid rendering a fake order shell.
export const dynamic = 'force-dynamic';

export default async function OrderDetailPage() {
  notFound();
}
