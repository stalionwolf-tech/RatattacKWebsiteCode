'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Flame, Star, Clock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ProductCard } from './ProductCard';
import { SearchDropdown } from './SearchDropdown';
import { ProductArtwork } from './ProductArtwork';

function SectionTitle({ eyebrow, title, icon: Icon, cta }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-8">
      <div>
        {eyebrow && (
          <div className="text-red-500 tracking-[0.4em] text-[10px] uppercase mb-2 font-cinzel flex items-center gap-2">
            {Icon && <Icon className="w-3.5 h-3.5" />} {eyebrow}
          </div>
        )}
        <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-white tracking-wide">{title}</h2>
      </div>
      {cta && (
        <Link href={cta.href} className="hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-neutral-400 hover:text-red-400 font-cinzel transition-colors">
          {cta.label} <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  );
}

function Row({ children }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">{children}</div>;
}

export function StoreHomeClient({ featuredCollections, featured, newArrivals, bestSellers, recent, promos }) {
  const [email, setEmail] = useState('');

  const subscribe = async (e) => {
    e.preventDefault();
    if (!email.includes('@')) { toast.error('Please enter a valid email.'); return; }
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        if (data.alreadySubscribed) toast.info('You’re already in the horde. See you at the drop.');
        else toast.success('Welcome to the Rat Horde. Check your inbox for a rune.');
        setEmail('');
      } else {
        toast.error(data?.error || 'Subscription failed. Please try again.');
      }
    } catch (err) {
      toast.error(err?.message || 'Network error. Please try again.');
    }
  };

  return (
    <>
      {/* Hero banner */}
      <section className="relative pt-36 md:pt-48 pb-16 md:pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/70 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="text-red-500 tracking-[0.5em] text-[10px] md:text-xs font-semibold uppercase mb-4 font-cinzel">✦ The Vault ✦</div>
          <h1 className="font-cinzel text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-wide mb-5">
            <span className="gradient-text text-glow">Store</span>
          </h1>
          <div className="divider-ornate max-w-sm mx-auto mb-6"><span className="text-red-500">◆</span></div>
          <p className="font-cinzel text-lg md:text-2xl text-neutral-200 tracking-[0.1em] mb-3">Collect. Open. Conquer.</p>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-neutral-400 leading-relaxed mb-8">
            Pokémon TCG sealed product, singles, mystery packs, accessories, and RatAttacK merchandise — curated from the Rat’s hoard.
          </p>
          <div className="max-w-md mx-auto">
            <SearchDropdown />
          </div>
        </div>
      </section>

      {/* Promotions strip */}
      <section className="container mx-auto px-6 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {promos.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`glass-panel frame-corners rounded-lg p-5 bg-gradient-to-br ${p.accent} to-transparent`}
            >
              <div className="text-[10px] uppercase tracking-[0.4em] text-red-400 font-cinzel mb-2">{p.badge}</div>
              <h3 className="font-cinzel text-lg text-white mb-1">{p.title}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed mb-3">{p.description}</p>
              <Link href={p.href} className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-red-400 hover:text-red-300 font-cinzel transition-colors">
                Shop now <ArrowRight className="w-3 h-3" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Collections */}
      <section className="container mx-auto px-6 mb-20">
        <SectionTitle eyebrow="Featured" title="Collections" icon={Sparkles} cta={{ href: '/store/category/pokemon-tcg', label: 'All Collections' }} />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {featuredCollections.map((c, i) => (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <Link href={`/store/category/${c.slug}`} className="group block relative aspect-square rounded-lg overflow-hidden glass-panel frame-corners hover:border-red-600/70 card-lift">
                <ProductArtwork product={{ productType: c.title, sigil: ['coin','chalice','skull','crown','shield','scroll'][i % 6], accent: ['crimson','amber','crimson-dark','gold','crimson','neutral'][i % 6] }} />
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/95 via-black/40 to-transparent">
                  <div className="font-cinzel text-xs md:text-sm text-white text-center tracking-wide group-hover:text-red-300 transition-colors">{c.title}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-6 mb-20">
        <SectionTitle eyebrow="Editors' Picks" title="Featured Products" icon={Star} cta={{ href: '/store/category/pokemon-tcg', label: 'View all' }} />
        <Row>{featured.map((p, i) => <ProductCard key={p.handle} product={p} index={i} />)}</Row>
      </section>

      {/* New Arrivals */}
      <section className="container mx-auto px-6 mb-20">
        <SectionTitle eyebrow="Fresh from the Forge" title="New Arrivals" icon={Sparkles} cta={{ href: '/store/category/new-arrivals', label: 'View all' }} />
        <Row>{newArrivals.map((p, i) => <ProductCard key={p.handle} product={p} index={i} />)}</Row>
      </section>

      {/* Best Sellers */}
      <section className="container mx-auto px-6 mb-20">
        <SectionTitle eyebrow="Fan Favorites" title="Best Sellers" icon={Flame} cta={{ href: '/store/category/best-sellers', label: 'View all' }} />
        <Row>{bestSellers.map((p, i) => <ProductCard key={p.handle} product={p} index={i} />)}</Row>
      </section>

      {/* Recently Added */}
      <section className="container mx-auto px-6 mb-20">
        <SectionTitle eyebrow="Just In" title="Recently Added" icon={Clock} />
        <Row>{recent.slice(0, 4).map((p, i) => <ProductCard key={p.handle} product={p} index={i} />)}</Row>
      </section>

      {/* Newsletter */}
      <section className="container mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass-panel frame-corners rounded-2xl p-8 md:p-12 max-w-4xl mx-auto text-center relative overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-red-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-amber-600/10 rounded-full blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/60 border border-red-800/60 mb-5">
              <Mail className="w-3.5 h-3.5 text-red-400" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-300 font-cinzel">Ravens & Runes</span>
            </div>
            <h3 className="font-cinzel text-3xl md:text-4xl font-bold text-white mb-3">Join the Newsletter</h3>
            <p className="text-neutral-400 text-sm md:text-base mb-6 max-w-lg mx-auto">Restock alerts, promo codes, and early access to drops before they hit the vault.</p>
            <form onSubmit={subscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="knight@darklands.com"
                className="bg-black/60 border-neutral-800 focus:border-red-600 h-12"
              />
              <Button type="submit" className="h-12 px-6 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-900 btn-glow-red glow-red">
                <span className="font-cinzel tracking-widest uppercase text-xs">Subscribe</span>
              </Button>
            </form>
          </div>
        </motion.div>
      </section>
    </>
  );
}
