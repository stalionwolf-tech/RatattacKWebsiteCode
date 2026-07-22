import Link from 'next/link';
import { ShieldX } from 'lucide-react';
import { auth } from '@/auth';
import { SignOutButton } from '@/components/admin/SignOutButton';

export const metadata = {
  title: 'Access Denied · RatAttacK',
  robots: { index: false, follow: false },
};

export default async function ForbiddenPage() {
  const session = await auth();
  const email = session?.user?.email;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 text-neutral-100">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.16),transparent_60%)]" />

      <div className="relative z-10 w-full max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-800/60 bg-red-950/50">
          <ShieldX className="h-8 w-8 text-red-500" />
        </div>

        <p className="mb-3 font-cinzel text-[11px] uppercase tracking-[0.5em] text-red-500">
          403 · Forbidden
        </p>
        <h1 className="font-cinzel text-3xl font-bold text-white md:text-4xl text-balance">
          You are not on the allow list.
        </h1>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-neutral-400 text-pretty">
          {email
            ? `The account ${email} is signed in, but it is not authorized to access the inventory command deck.`
            : 'This account is not authorized to access the inventory command deck.'}{' '}
          Contact an administrator if you believe this is a mistake.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <SignOutButton
            label="Sign out & switch account"
            className="h-11 gap-2 border-neutral-700 bg-neutral-950/60 hover:border-red-700 hover:bg-red-950/30"
          />
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-md border border-neutral-800 px-5 font-cinzel text-[11px] uppercase tracking-widest text-neutral-300 transition-colors hover:border-neutral-600 hover:text-white"
          >
            Return to site
          </Link>
        </div>
      </div>
    </main>
  );
}
