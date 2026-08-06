import { auth } from '@/auth';
import { DatabaseDiagnostics } from '@/components/admin/DatabaseDiagnostics';

export const metadata = {
  title: 'Database Diagnostics · RatAttacK',
  description: 'Diagnose the MongoDB connection for the Mystery Pack Manager.',
  robots: { index: false, follow: false },
};

export default async function AdminDiagnosticsPage() {
  const session = await auth();
  return <DatabaseDiagnostics user={session?.user ?? null} />;
}
