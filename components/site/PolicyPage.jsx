'use client';
import Link from 'next/link';
import {
  ChevronLeft,
  // Icon set exposed to policy pages via string keys — avoids passing
  // React component functions across the server/client boundary.
  Shield, ShieldCheck, ShieldAlert, Cookie, Mail, Lock, Info,
  Scroll, Gavel, ShoppingBag, Ban, RefreshCw, HelpCircle, Package,
  Truck, Timer, Globe2, MapPin, AlertTriangle, ClockAlert, Check,
  Server, Settings, ToggleRight, Trash2, CreditCard, MessageSquare,
} from 'lucide-react';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { ScrollingBackdrop } from '@/components/site/ScrollingBackdrop';
import { AtmosphereBackground } from '@/components/site/AtmosphereBackground';
import { FilmGrain, Scanlines } from '@/components/site/CinematicFX';

const ICONS = {
  shield: Shield, shieldCheck: ShieldCheck, shieldAlert: ShieldAlert,
  cookie: Cookie, mail: Mail, lock: Lock, info: Info,
  scroll: Scroll, gavel: Gavel, shoppingBag: ShoppingBag, ban: Ban,
  refreshCw: RefreshCw, helpCircle: HelpCircle, package: Package,
  truck: Truck, timer: Timer, globe2: Globe2, mapPin: MapPin,
  alertTriangle: AlertTriangle, clockAlert: ClockAlert, check: Check,
  server: Server, settings: Settings, toggleRight: ToggleRight,
  trash2: Trash2, creditCard: CreditCard, messageSquare: MessageSquare,
};

/**
 * Shared cinematic layout for informational / policy pages.
 * Same visual language as /privacy and /terms.
 */
export function PolicyPage({ eyebrow = 'The Order', title, revised, sections = [], sidebarTitle = 'Sections' }) {
  return (
    <div className="relative min-h-screen bg-black text-neutral-100 overflow-x-hidden">
      <ScrollingBackdrop />
      <AtmosphereBackground />
      <FilmGrain />
      <Scanlines />
      <Navbar />

      <main className="relative z-10 container mx-auto px-6 pt-32 md:pt-40 pb-20">
        <Link href="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-neutral-400 hover:text-red-400 font-cinzel transition-colors mb-6">
          <ChevronLeft className="w-4 h-4" /> Home
        </Link>

        <div className="mb-10">
          <div className="text-red-500 tracking-[0.5em] text-[10px] uppercase mb-3 font-cinzel">{eyebrow}</div>
          <h1 className="font-cinzel text-4xl md:text-6xl font-bold text-white">{title}</h1>
          {revised ? <p className="text-neutral-400 mt-3">Last revised: {revised}</p> : null}
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">
          <aside className="lg:sticky lg:top-28 glass-panel frame-corners rounded-xl p-4">
            <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-cinzel mb-3 px-2">{sidebarTitle}</div>
            <nav className="space-y-1">
              {sections.map((s) => (
                <a key={s.id} href={`#${s.id}`} className="block px-2 py-1.5 rounded hover:bg-red-950/30 text-neutral-300 hover:text-red-300 text-sm font-cinzel transition-colors">
                  {s.title}
                </a>
              ))}
            </nav>
          </aside>

          <div className="space-y-6">
            {sections.map((s) => {
              const Icon = typeof s.icon === 'string' ? ICONS[s.icon] : null;
              return (
                <section key={s.id} id={s.id} className="glass-panel frame-corners rounded-xl p-6 md:p-8 scroll-mt-32">
                  <div className="flex items-center gap-3 mb-4">
                    {Icon ? <span className="w-9 h-9 rounded-full bg-red-950/60 border border-red-800 flex items-center justify-center text-red-400"><Icon className="w-4 h-4" /></span> : null}
                    <h2 className="font-cinzel text-xl text-white">{s.title}</h2>
                  </div>
                  <div className="text-neutral-300 leading-relaxed space-y-3">
                    {typeof s.body === 'string' ? <p className="whitespace-pre-line">{s.body}</p> : s.body}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
