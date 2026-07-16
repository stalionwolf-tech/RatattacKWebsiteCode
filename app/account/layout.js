import Link from 'next/link';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { ScrollingBackdrop } from '@/components/site/ScrollingBackdrop';
import { AtmosphereBackground } from '@/components/site/AtmosphereBackground';
import { FilmGrain, Scanlines } from '@/components/site/CinematicFX';
import { CartDrawer } from '@/components/store/CartDrawer';
import { User, Package, Heart, Boxes, MapPin, CreditCard, ShieldCheck, Settings } from 'lucide-react';
import { CUSTOMER } from '@/lib/account';

const LINKS = [
  { href: '/account',           label: 'Overview',        icon: User },
  { href: '/account/orders',    label: 'Orders',          icon: Package },
  { href: '/account/wishlist',  label: 'Wishlist',        icon: Heart },
  { href: '/account/vault',     label: 'Vault',           icon: Boxes },
  { href: '/account/addresses', label: 'Addresses',       icon: MapPin },
  { href: '/account/payment',   label: 'Payment Methods', icon: CreditCard },
  { href: '/account/security',  label: 'Security',        icon: ShieldCheck },
  { href: '/account/settings',  label: 'Settings',        icon: Settings },
];

export default function AccountLayout({ children }) {
  const pctToNextTier = Math.min(100, (CUSTOMER.points / CUSTOMER.nextTierAt) * 100);
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
                <img src={CUSTOMER.avatar} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <div className="font-cinzel text-white text-sm truncate">{CUSTOMER.firstName} {CUSTOMER.lastName}</div>
                <div className="text-[10px] uppercase tracking-widest text-red-500 font-cinzel">{CUSTOMER.hordeRank}</div>
              </div>
            </div>

            <div className="px-2 mb-4">
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-neutral-500 font-cinzel mb-1.5">
                <span>{CUSTOMER.points} pts</span><span>{CUSTOMER.nextTierAt}</span>
              </div>
              <div className="h-1.5 rounded-full bg-neutral-900 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-700 via-red-500 to-amber-500" style={{ width: `${pctToNextTier}%` }} />
              </div>
              <div className="text-[9px] uppercase tracking-widest text-neutral-500 font-cinzel mt-1.5">Next: {CUSTOMER.nextTier}</div>
            </div>

            <nav className="space-y-1">
              {LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-neutral-300 hover:bg-red-950/30 hover:text-white transition-premium">
                  <l.icon className="w-4 h-4 text-red-500" /> {l.label}
                </Link>
              ))}
            </nav>
          </aside>

          <div className="space-y-6">{children}</div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
