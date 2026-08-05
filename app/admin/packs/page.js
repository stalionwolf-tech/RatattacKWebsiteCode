import { auth } from '@/auth';
import { PackManager } from '@/components/admin/PackManager';

export const metadata = {
  title: 'Mystery Pack Manager · RatAttacK',
  description: 'Create and manage RatAttacK Mystery Pack production runs.',
  robots: { index: false, follow: false },
};

export default async function AdminPacksPage() {
  const session = await auth();
  return <PackManager user={session?.user ?? null} />;
}
