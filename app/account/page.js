'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, Heart, Boxes, ArrowRight, Trophy, Sparkles } from 'lucide-react';
import { ProductArtwork } from '@/components/store/ProductArtwork';
import { ProductCard } from '@/components/store/ProductCard';
import { getProductByHandle } from '@/lib/products';
import { useWishlist, useRecentlyViewed } from '@/lib/store-hooks';
import { CUSTOMER, ORDERS, ACHIEVEMENTS, COMMUNITY_UPDATES, RECOMMENDED_HANDLES, STATUS_LABEL, STATUS_TINT } from '@/lib/account';

function Card({ title, cta, children }) {
  return (
    <section className="glass-panel frame-corners rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-cinzel text-lg text-white">{title}</h2>
        {cta && <Link href={cta.href} className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 hover:text-red-400 font-cinzel inline-flex items-center gap-1.5">{cta.label} <ArrowRight className="w-3 h-3" /></Link>}
      </div>
      {children}
    </section>
  );
}

export default function AccountOverview() {
  const wish = useWishlist();
  const rv = useRecentlyViewed();
  const recommended = RECOMMENDED_HANDLES.map(getProductByHandle).filter(Boolean).slice(0, 4);
  const wishItems = wish.items.map(getProductByHandle).filter(Boolean).slice(0, 4);
  const recentItems = rv.items.map(getProductByHandle).filter(Boolean).slice(0, 4);
  const activeOrder = ORDERS.find((o) => o.fulfillmentStatus === 'IN_TRANSIT') || ORDERS[0];

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Orders',       value: ORDERS.length,               icon: Package, href: '/account/orders' },
          { label: 'Wishlist',     value: wish.count || '—',           icon: Heart,   href: '/account/wishlist' },
          { label: 'Vault',        value: 3,                           icon: Boxes,   href: '/account/vault' },
          { label: 'Achievements', value: ACHIEVEMENTS.filter(a=>a.earned).length + '/' + ACHIEVEMENTS.length, icon: Trophy, href: '#achievements' },
        ].map((s) => (
          <Link key={s.label} href={s.href} className="glass-panel frame-corners rounded-lg p-5 hover:border-red-600/60 card-lift group">
            <s.icon className="w-6 h-6 text-red-500 mb-3 group-hover:scale-110 transition-transform" />
            <div className="font-cinzel text-2xl text-white leading-none mb-1">{s.value}</div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-cinzel">{s.label}</div>
          </Link>
        ))}
      </motion.div>

      {/* Active order */}
      <Card title="Current Order" cta={{ href: '/account/orders', label: 'All orders' }}>
        <Link href={`/account/order/${activeOrder.id}`} className="block glass-panel rounded-lg p-4 hover:border-red-600/60 card-lift group">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="font-cinzel text-white text-lg">{activeOrder.name}</div>
              <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-cinzel">Placed {activeOrder.processedAt} · {activeOrder.items.length} item{activeOrder.items.length===1?'':'s'}</div>
              <div className="text-[10px] uppercase tracking-widest text-neutral-400 font-cinzel mt-1.5">{activeOrder.carrier} · {activeOrder.trackingNumber}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="font-cinzel text-red-400 text-lg">${activeOrder.total.toFixed(2)}</div>
              <div className={`px-2.5 py-1 rounded text-[10px] uppercase tracking-[0.25em] font-cinzel border ${STATUS_TINT[activeOrder.fulfillmentStatus]}`}>{STATUS_LABEL[activeOrder.fulfillmentStatus]}</div>
            </div>
          </div>
        </Link>
      </Card>

      {wishItems.length > 0 && (
        <Card title="Wishlist" cta={{ href: '/account/wishlist', label: 'View all' }}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {wishItems.map((p, i) => <ProductCard key={p.handle} product={p} index={i} />)}
          </div>
        </Card>
      )}

      {recentItems.length > 0 && (
        <Card title="Recently Viewed">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {recentItems.map((p, i) => <ProductCard key={p.handle} product={p} index={i} />)}
          </div>
        </Card>
      )}

      <Card title="Recommended For You" cta={{ href: '/store', label: 'Browse store' }}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {recommended.map((p, i) => <ProductCard key={p.handle} product={p} index={i} />)}
        </div>
      </Card>

      <section id="achievements" className="glass-panel frame-corners rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4"><Trophy className="w-5 h-5 text-red-500" /><h2 className="font-cinzel text-lg text-white">Achievements</h2></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {ACHIEVEMENTS.map((a) => (
            <div key={a.key} title={a.desc} className={`glass-panel rounded-lg p-3 text-center transition-premium ${a.earned ? 'border-red-700/60 hover:border-red-500 glow-red' : 'opacity-45 grayscale'}`}>
              <div className="aspect-square rounded-md overflow-hidden mb-2 border border-red-900/40">
                <ProductArtwork product={{ sigil: a.sigil, accent: a.accent, productType: '' }} size="sm" />
              </div>
              <div className="font-cinzel text-[11px] text-white leading-tight">{a.title}</div>
              <div className="text-[9px] uppercase tracking-widest text-neutral-500 font-cinzel mt-1">{a.earned ? 'Earned' : 'Locked'}</div>
            </div>
          ))}
        </div>
      </section>

      <Card title="From the Horde" cta={{ href: '/#community', label: 'Community' }}>
        <div className="divide-y divide-neutral-900">
          {COMMUNITY_UPDATES.map((u) => (
            <div key={u.id} className="py-3 flex items-center gap-4">
              <span className="px-2 py-0.5 rounded text-[9px] uppercase tracking-widest font-cinzel border border-red-800/70 text-red-300 bg-red-950/40">{u.tag}</span>
              <div className="flex-1 text-sm text-neutral-200">{u.title}</div>
              <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-cinzel">{u.date}</div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
