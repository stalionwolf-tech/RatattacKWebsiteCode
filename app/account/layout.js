'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { ScrollingBackdrop } from '@/components/site/ScrollingBackdrop';
import { AtmosphereBackground } from '@/components/site/AtmosphereBackground';
import { FilmGrain, Scanlines } from '@/components/site/CinematicFX';
import { CartDrawer } from '@/components/store/CartDrawer';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/components/auth/AuthProvider';
import { User, UserCircle, Package, Heart, Boxes, MapPin, CreditCard, ShieldCheck, Settings, LogOut } from 'lucide-react';

const LINKS = [
  { href: '/account',           label: 'Overview',        icon: User },
  { href: '/account/profile',   label: 'Profile',         icon: UserCircle },
  { href: '/account/orders',    label: 'Orders',          icon: Package },
  { href: '/account/wishlist',  label: 'Wishlist',        icon: Heart },
  { href: '/account/vault',     label: 'Vault',           icon: Boxes },
  { href: '/account/addresses', label: 'Addresses',       icon: MapPin },
  { href: '/account/payment',   label: 'Payment Methods', icon: CreditCard },
  { href: '/account/security',  label: 'Security',        icon: ShieldCheck },
  { href: '/account/settings',  label: 'Settings',        icon: Settings },
];

function InitialAvatar({ user }) {
  const initials = `${(user?.firstName?.[0] || '').toUpperCase()}${(user?.lastName?.[0] || '').toUpperCase()}` || 'R';
  if (user?.avatar) {
    return <img src={user.avatar} alt="" className="w-full h-full object-cover" />;
  }
  return (
    <div className="w-full h-full bg-gradient-to-br from-red-800 via-red-700 to-amber-700 flex items-center justify-center font-cinzel text-white text-sm">
      {initials}
    </div>
  );
}

function Shell({ children }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const points = user?.points ?? 0;
  const nextTierAt = user?.nextTierAt ?? 500;
  const pctToNextTier = Math.min(100, (points / nextTierAt) * 100);

  const handleLogout = async () => {
    try { await logout(); toast.info('Signed out. The vault seals behind you.'); }
    catch { /* ignored */ }
  };

  return (
    <div className="relative min-h-screen bg-black text-neutral-100 overflow-x-hidden">
      <ScrollingBackdrop />
      <AtmosphereBackground />
      <FilmGrain />
      <Scanlines />
      <Navbar />
      <CartDrawer />

      <main className="relative z-10 container mx-auto px-6 pt-32 md:pt-40 pb-20">
        <div className="mb-10">
          <div className="text-red-500 tracking-[0.5em] text-[10px] uppercase mb-3 font-cinzel">The Order</div>
          <h1 className="font-cinzel text-4xl md:text-6xl font-bold text-white">Account</h1>
        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-8 items-start">
          <aside className="glass-panel frame-corners rounded-xl p-4 lg:sticky lg:top-24">
            <div className="flex items-center gap-3 px-2 py-3 mb-3 border-b border-neutral-900">
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-red-700/70 flex-shrink-0">
                <InitialAvatar user={user} />
              </div>
              <div className="min-w-0">
                <div className="font-cinzel text-white text-sm truncate">{user?.displayName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Horde Member'}</div>
                <div className="text-[10px] uppercase tracking-widest text-red-500 font-cinzel">{user?.hordeRank || 'Initiate'}</div>
              </div>
            </div>

            <div className="px-2 mb-4">
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-neutral-500 font-cinzel mb-1.5">
                <span>{points} pts</span><span>{nextTierAt}</span>
              </div>
              <div className="h-1.5 rounded-full bg-neutral-900 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-700 via-red-500 to-amber-500" style={{ width: `${pctToNextTier}%` }} />
              </div>
              <div className="text-[9px] uppercase tracking-widest text-neutral-500 font-cinzel mt-1.5">Next: {user?.nextTier || 'Cutthroat'}</div>
            </div>

            <nav className="space-y-1">
              {LINKS.map((l) => {
                const active = pathname === l.href || (l.href !== '/account' && pathname?.startsWith(l.href));
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-premium ${active ? 'bg-red-950/40 text-white' : 'text-neutral-300 hover:bg-red-950/30 hover:text-white'}`}
                  >
                    <l.icon className={`w-4 h-4 ${active ? 'text-red-400' : 'text-red-500'}`} /> {l.label}
                  </Link>
                );
              })}
            </nav>

            <button
              onClick={handleLogout}
              className="mt-3 w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-neutral-400 hover:bg-red-950/30 hover:text-red-300 transition-premium border-t border-neutral-900 pt-3"
            >
              <LogOut className="w-4 h-4 text-red-500" /> Sign out
            </button>
          </aside>

          <div className="space-y-6">{children}</div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function AccountLayout({ children }) {
  return (
    <AuthGuard>
      <Shell>{children}</Shell>
    </AuthGuard>
  );
}
