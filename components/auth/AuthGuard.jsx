'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

/**
 * Wraps any route/section that requires an authenticated user.
 * If the user is not signed in, redirects to /login?next=<pathname>.
 * Renders a branded loading state while the auth state is hydrating.
 */
export function AuthGuard({ children, redirectTo = '/login', fallback = null }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      const next = pathname ? `?next=${encodeURIComponent(pathname)}` : '';
      router.replace(`${redirectTo}${next}`);
    }
  }, [user, loading, pathname, router, redirectTo]);

  if (loading || !user) {
    return fallback ?? (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-neutral-400">
          <Loader2 className="w-6 h-6 animate-spin text-red-500" />
          <p className="text-[10px] uppercase tracking-[0.4em] font-cinzel">Verifying Sigil…</p>
        </div>
      </div>
    );
  }
  return children;
}
