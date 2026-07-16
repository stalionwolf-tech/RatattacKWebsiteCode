import Link from 'next/link';
import { ChevronLeft, Shield, Cookie, Mail, ShieldCheck, Lock } from 'lucide-react';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { ScrollingBackdrop } from '@/components/site/ScrollingBackdrop';
import { AtmosphereBackground } from '@/components/site/AtmosphereBackground';
import { FilmGrain, Scanlines } from '@/components/site/CinematicFX';
import { SITE_CONFIG, DISCORD_INVITE_URL } from '@/lib/config';

export const metadata = {
  title: 'Privacy Policy — RatAttacK',
  description: 'How RatAttacK collects, uses, and protects your data across the storefront and community.',
};

const SECTIONS = [
  { id: 'overview', icon: Shield, title: 'Overview', body: `RatAttacK (“RatAttacK”, “we”, “us”) operates ratattack.gg and its associated storefront. This policy explains what data we collect, why we collect it, and how you can control it. By using our site you consent to the practices described here. This is a plain-English summary intended to be readable — it is not a substitute for jurisdiction-specific legal counsel.` },
  { id: 'what-we-collect', icon: Lock, title: 'What we collect', body: `We collect only the data required to fulfill your orders and improve the site: account details (name, email, shipping address, phone), order and payment metadata processed by Shopify’s hosted checkout (we never see your full card number), community interactions on our Discord and YouTube channels (which are governed by those platforms’ own policies), and anonymous analytics such as pages viewed, referrers, and device type.` },
  { id: 'how-we-use', icon: ShieldCheck, title: 'How we use your data', body: `We use your data to process and ship orders, respond to support requests, send optional marketing (only if you opt in), operate loyalty features such as points and rewards, and monitor site security and abuse. We do not sell your personal data. We do not share it with advertisers outside of the analytics providers listed below.` },
  { id: 'shopify-payments', icon: Lock, title: 'Payments & Shopify', body: `All payments are processed by Shopify Checkout. Card details are transmitted directly from your browser to Shopify’s PCI‑DSS certified servers — they never touch RatAttacK infrastructure. Shopify’s privacy practices are governed by shopify.com/legal/privacy. Please review them if you have concerns.` },
  { id: 'cookies', icon: Cookie, title: 'Cookies & local storage', body: `We use a small set of cookies and localStorage keys to remember your cart, wishlist, ambient audio preferences, and (when you opt in) analytics. You can clear these at any time from your browser settings. Disabling essential cookies may prevent the cart and account features from working.` },
  { id: 'your-rights', icon: Shield, title: 'Your rights', body: `Depending on your jurisdiction (GDPR, CCPA, etc.), you have the right to access, correct, export, or delete your personal data. To exercise any of these rights, email us at ${SITE_CONFIG.email?.support || 'support@ratattack.gg'} and we will respond within 30 days.` },
  { id: 'children', icon: Shield, title: "Children's data", body: `RatAttacK is not directed at children under 13. We do not knowingly collect data from anyone under 13. If you believe a child has provided us data, contact us and we will delete it.` },
  { id: 'changes', icon: Shield, title: 'Changes to this policy', body: `We may update this policy from time to time. Material changes will be posted here with an updated “Last revised” date. Continued use of the site after changes constitutes acceptance.` },
  { id: 'contact', icon: Mail, title: 'Contact', body: `Questions? Reach the RatAttacK Order at ${SITE_CONFIG.email?.support || 'support@ratattack.gg'} or via our Discord: ${DISCORD_INVITE_URL}.` },
];

export default function PrivacyPage() {
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
          <h1 className="font-cinzel text-4xl md:text-6xl font-bold text-white">Privacy Policy</h1>
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
