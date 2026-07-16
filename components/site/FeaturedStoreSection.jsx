'use client';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SectionHeader } from './SectionHeader';
import { IconCoin, IconChalice, IconShield, IconCrown, IconSkull, IconScroll } from './MedievalIcons';

/**
 * Featured Store
 * ---------------
 * Product objects are shaped to mirror Shopify's Storefront API response
 * so we can later swap the PLACEHOLDER_PRODUCTS array for a live fetch
 * without touching the card component. Fields kept:
 *   handle, title, category (≈ productType), priceRange.min, currencyCode,
 *   availability, featuredImage.url
 */

const STATUSES = {
  in_stock:    { label: 'In Stock',    tint: 'text-emerald-300 border-emerald-800/70 bg-emerald-950/50' },
  low_stock:   { label: 'Low Stock',   tint: 'text-amber-300 border-amber-800/70 bg-amber-950/50' },
  coming_soon: { label: 'Coming Soon', tint: 'text-red-300 border-red-800/70 bg-red-950/50' },
};

const PLACEHOLDER_PRODUCTS = [
  {
    handle: 'scarlet-violet-booster-box',
    title: 'Scarlet & Violet Booster Box',
    category: 'Pokémon TCG',
    price: 149.99,
    currency: 'USD',
    availability: 'in_stock',
    Icon: IconCoin,
    accent: 'from-red-900/30 via-neutral-900 to-black',
    url: '#',
  },
  {
    handle: 'journey-together-elite-trainer-box',
    title: 'Journey Together Elite Trainer Box',
    category: 'Pokémon TCG',
    price: 59.99,
    currency: 'USD',
    availability: 'in_stock',
    Icon: IconChalice,
    accent: 'from-amber-900/25 via-neutral-900 to-black',
    url: '#',
  },
  {
    handle: 'ratattack-mystery-pack',
    title: 'RatAttacK Mystery Pack',
    category: 'Exclusive',
    price: 29.99,
    currency: 'USD',
    availability: 'low_stock',
    Icon: IconSkull,
    accent: 'from-red-950/40 via-black to-neutral-950',
    url: '#',
  },
  {
    handle: 'crown-zenith-booster-bundle',
    title: 'Crown Zenith Booster Bundle',
    category: 'Pokémon TCG',
    price: 39.99,
    currency: 'USD',
    availability: 'in_stock',
    Icon: IconCrown,
    accent: 'from-yellow-900/20 via-neutral-900 to-black',
    url: '#',
  },
  {
    handle: 'ratattack-hoodie',
    title: 'RatAttacK Hoodie',
    category: 'Merchandise',
    price: 54.99,
    currency: 'USD',
    availability: 'coming_soon',
    Icon: IconShield,
    accent: 'from-red-900/30 via-neutral-900 to-black',
    url: '#',
  },
  {
    handle: 'ratattack-mouse-pad',
    title: 'RatAttacK Mouse Pad',
    category: 'Merchandise',
    price: 24.99,
    currency: 'USD',
    availability: 'coming_soon',
    Icon: IconScroll,
    accent: 'from-neutral-800/40 via-neutral-900 to-black',
    url: '#',
  },
];

function formatPrice(n, currency = 'USD') {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(n);
  } catch {
    return `$${n.toFixed(2)}`;
  }
}

function ProductCard({ product, index }) {
  const status = STATUSES[product.availability] || STATUSES.in_stock;
  const isSoon = product.availability === 'coming_soon';
  const Icon = product.Icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.19, 1, 0.22, 1] }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Card className="group relative glass-panel frame-corners overflow-hidden hover:border-red-600/70 card-lift h-full flex flex-col">
        {/* Product image placeholder */}
        <div className={`relative aspect-[4/5] bg-gradient-to-br ${product.accent} flex items-center justify-center overflow-hidden`}>
          {/* Diagonal weave pattern */}
          <div className="absolute inset-0 opacity-25" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 22px, rgba(220,38,38,0.06) 22px, rgba(220,38,38,0.06) 24px)',
          }} />
          {/* Radial red aura */}
          <div className="absolute inset-0 opacity-40" style={{
            background: 'radial-gradient(circle at 50% 35%, rgba(220,38,38,0.2), transparent 55%)',
          }} />

          {/* Product artwork - future: <img src={product.image} /> */}
          <div className="relative text-red-800/80 group-hover:text-red-500 group-hover:scale-110 transition-premium">
            <Icon size={96} />
          </div>

          {/* Category badge (top-left) */}
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/80 backdrop-blur-sm rounded text-[10px] uppercase tracking-[0.25em] text-red-300 border border-red-900/70 font-cinzel">
            {product.category}
          </div>

          {/* Inventory badge (top-right) */}
          <div className={`absolute top-3 right-3 px-2.5 py-1 rounded text-[10px] uppercase tracking-[0.25em] font-cinzel backdrop-blur-sm border ${status.tint}`}>
            {status.label}
          </div>

          {/* Sheen on hover */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>

        {/* Meta */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-cinzel text-base md:text-lg font-semibold text-white group-hover:text-red-300 transition-colors line-clamp-2 leading-snug mb-2">
            {product.title}
          </h3>
          <div className="flex items-baseline justify-between mb-5">
            <div className="font-cinzel text-xl md:text-2xl text-red-400 text-glow">
              {formatPrice(product.price, product.currency)}
            </div>
            <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-cinzel">
              {isSoon ? 'Notify' : 'Available'}
            </div>
          </div>

          <Button
            asChild
            variant={isSoon ? 'outline' : 'default'}
            className={
              isSoon
                ? 'mt-auto border-red-800/60 bg-black/40 hover:bg-red-950/40 text-neutral-200 h-11 transition-premium'
                : 'mt-auto bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-900 text-white h-11 btn-glow-red transition-premium'
            }
          >
            <a href={product.url} target={product.url.startsWith('http') ? '_blank' : undefined} rel={product.url.startsWith('http') ? 'noopener noreferrer' : undefined}>
              <span className="font-cinzel tracking-widest uppercase text-xs">
                {isSoon ? 'Notify Me' : 'View Product'}
              </span>
            </a>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

export function FeaturedStoreSection() {
  return (
    <section id="store" className="relative py-28 md:py-40">
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.08),transparent_55%)]" />

      <div className="container mx-auto px-6 relative z-10">
        <SectionHeader
          eyebrow="Featured Store"
          title="Collect. Open. Conquer."
          description="Browse featured Pokémon TCG products, RatAttacK merchandise, and exclusive collectibles. Prices and availability shown below are placeholder data; the storefront will connect to Shopify."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 max-w-7xl mx-auto">
          {PLACEHOLDER_PRODUCTS.map((p, i) => (
            <ProductCard key={p.handle} product={p} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-14"
        >
          <div className="text-[11px] uppercase tracking-[0.35em] text-neutral-500 font-cinzel">
            ✦ Full storefront coming soon ✦
          </div>
        </motion.div>
      </div>
    </section>
  );
}
