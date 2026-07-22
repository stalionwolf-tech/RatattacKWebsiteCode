import { Suspense } from 'react';
import { AuthCinematicLayout } from '@/components/auth/AuthCinematicLayout';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';

export const metadata = {
  title: 'Admin Sign In · RatAttacK',
  description: 'Restricted access. Authorized operators only.',
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <AuthCinematicLayout
      eyebrow="Restricted"
      title="Operator Access"
      subtitle="Sign in to reach the inventory command deck."
    >
      <Suspense fallback={null}>
        <AdminLoginForm />
      </Suspense>
    </AuthCinematicLayout>
  );
}
