import Link from 'next/link';
import { ChevronLeft, Scroll, Gavel, ShoppingBag, ShieldAlert, RefreshCw, Ban, Mail } from 'lucide-react';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { ScrollingBackdrop } from '@/components/site/ScrollingBackdrop';
import { AtmosphereBackground } from '@/components/site/AtmosphereBackground';
import { FilmGrain, Scanlines } from '@/components/site/CinematicFX';
import { SITE_CONFIG, DISCORD_INVITE_URL } from '@/lib/config';

export const metadata = {
  title: 'Terms of Service — RatAttacK',
  description: 'The pact between RatAttacK and its patrons: rules for using the site, storefront, and community channels.',
};

const SECTIONS = [
  { id: 'acceptance',    icon: Scroll,       title: 'The Pact',            body: `By entering ratattack.gg or purchasing from the storefront you agree to these Terms of Service. If you do not agree, do not use the site. These terms may change over time; continued use after changes constitutes acceptance of the new terms.` },
  { id: 'accounts',      icon: ShieldAlert,  title: 'Accounts & the Order', body: `You are responsible for keeping your credentials safe. We may suspend or terminate accounts that violate these terms, our community rules, or applicable law. RatAttacK accounts are non‑transferable.` },
  { id: 'purchases',     icon: ShoppingBag,  title: 'Purchases',            body: `Prices and availability may change without notice. Orders are confirmed only after successful payment via Shopify Checkout. Sealed product is shipped in factory‑sealed condition. Graded singles are sold as‑is; condition and grade are described honestly at listing time.` },
  { id: 'shipping',      icon: RefreshCw,    title: 'Shipping & Returns',   body: `We ship worldwide via tracked carriers. Standard shipping targets 3–5 business days in the US, longer internationally. Damaged‑in‑transit claims must be filed within 7 days of delivery. Sealed & unused product may be returned within 30 days for a refund minus shipping. Singles are final sale unless materially misrepresented.` },
  { id: 'ip',            icon: Gavel,        title: 'Intellectual Property',body: `All RatAttacK artwork, branding, and site content is © RatAttacK and its collaborators. Pokémon®, its trainers, and card artwork are trademarks of The Pokémon Company. RatAttacK is not affiliated with, endorsed by, or sponsored by Nintendo, Game Freak, or The Pokémon Company. All third‑party marks belong to their respective owners.` },
  { id: 'community',     icon: ShieldAlert,  title: 'Community conduct',    body: `Discord and YouTube behavior is governed by the RatAttacK Community Code and each platform’s ToS. Harassment, hate speech, doxxing, and illegal content result in immediate ban across all RatAttacK properties.` },
  { id: 'liability',     icon: Ban,          title: 'Liability',            body: `The site and storefront are provided “as is” without warranties of any kind beyond those required by law. RatAttacK’s maximum liability for any claim related to a purchase is limited to the amount paid for that specific order.` },
  { id: 'law',           icon: Gavel,        title: 'Governing law',        body: `These terms are governed by the laws of the United States and, where applicable, the state in which RatAttacK is incorporated. Disputes will be resolved by binding arbitration where permitted by law. If any clause is found unenforceable, the remainder stays in effect.` },
  { id: 'contact',       icon: Mail,         title: 'Contact',              body: `Legal questions? Email ${SITE_CONFIG.email?.support || 'support@ratattack.gg'}. General questions? Join the Discord: ${DISCORD_INVITE_URL}.` },
];

export default function TermsPage() {
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
          <div className="text-red-500 tracking-[0.5em] text-[10px] uppercase mb-3 font-cinzel">The Order</div>
          <h1 className="font-cinzel text-4xl md:text-6xl font-bold text-white">Terms of Service</h1>
          <p className="text-neutral-400 mt-3">Last revised: June 20, 2026</p>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">
          <aside className="lg:sticky lg:top-28 glass-panel frame-corners rounded-xl p-4">
            <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-cinzel mb-3 px-2">Sections</div>
            <nav className="space-y-1">
              {SECTIONS.map((s) => (
                <a key={s.id} href={`#${s.id}`} className="block px-2 py-1.5 rounded hover:bg-red-950/30 text-neutral-300 hover:text-red-300 text-sm font-cinzel transition-colors">
                  {s.title}
                </a>
              ))}
            </nav>
          </aside>

          <div className="space-y-6">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              return (
                <section key={s.id} id={s.id} className="glass-panel frame-corners rounded-xl p-6 md:p-8 scroll-mt-32">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-9 h-9 rounded-full bg-red-950/60 border border-red-800 flex items-center justify-center text-red-400"><Icon className="w-4 h-4" /></span>
                    <h2 className="font-cinzel text-xl text-white">{s.title}</h2>
                  </div>
                  <p className="text-neutral-300 leading-relaxed whitespace-pre-line">{s.body}</p>
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
