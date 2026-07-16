import Link from 'next/link';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { ScrollingBackdrop } from '@/components/site/ScrollingBackdrop';
import { AtmosphereBackground } from '@/components/site/AtmosphereBackground';
import { FilmGrain, Scanlines } from '@/components/site/CinematicFX';
import { User, Package, Heart, MapPin, CreditCard, Settings } from 'lucide-react';

const LINKS = [
  { href: '/account',          label: 'Overview',         icon: User },
  { href: '/account/orders',   label: 'Orders',           icon: Package },
  { href: '/wishlist',         label: 'Wishlist',         icon: Heart },
  { href: '/account/profile',  label: 'Profile & Address',icon: MapPin },
  { href: '/account/settings', label: 'Settings',         icon: Settings },
];

export default function AccountLayout({ children }) {
  return (
    <div className="relative min-h-screen bg-black text-neutral-100 overflow-x-hidden">
      <ScrollingBackdrop />
      <AtmosphereBackground />
      <FilmGrain />
      <Scanlines />
      <Navbar />

      <main className="relative z-10 container mx-auto px-6 pt-32 md:pt-40 pb-20">
        <div className="mb-10">
          <div className="text-red-500 tracking-[0.5em] text-[10px] uppercase mb-3 font-cinzel">The Order</div>
          <h1 className="font-cinzel text-4xl md:text-6xl font-bold text-white">Account</h1>
        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-8 items-start">
          <aside className="glass-panel frame-corners rounded-xl p-4 lg:sticky lg:top-24">
            <div className="px-3 py-3 mb-3 border-b border-neutral-900">
              <div className="font-cinzel text-white">Sir Ratsalot</div>
              <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-cinzel">ratsalot@ratattack.gg</div>
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
