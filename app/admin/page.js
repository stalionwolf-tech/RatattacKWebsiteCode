import { auth } from '@/auth';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export const metadata = {
  title: 'Inventory Manager · RatAttacK',
  description: 'Private inventory dashboard — search Pokémon cards and publish to Shopify.',
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await auth();
  return <AdminDashboard user={session?.user ?? null} />;
}
