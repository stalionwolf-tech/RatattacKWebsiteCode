'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Eye, ShoppingCart, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProductArtwork } from './ProductArtwork';
import { formatPrice, AVAILABILITY_META } from '@/lib/products';
import { useCart, useWishlist, openCartDrawer } from '@/lib/store-hooks';

function Stars({ rating = 0, size = 12 }) {
  const rounded = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1,2,3,4,5].map((i) => (
        <Star key={i} className={i <= rounded ? 'text-amber-400 fill-amber-400' : 'text-neutral-700'} style={{ width: size, height: size }} />
      ))}
    </div>
  );
}

export function ProductCard({ product, index = 0, onQuickView }) {
  const status = AVAILABILITY_META[product.availability] || AVAILABILITY_META.in_stock;
  const isSoon = product.availability === 'coming_soon';
  const price = product.priceRange.minVariantPrice;
  const compareAt = product.compareAtPrice;
  const salePct = compareAt ? Math.round((1 - Number(price.amount) / Number(compareAt.amount)) * 100) : 0;
  const [hover, setHover] = useState(false);
  const cart = useCart();
  const wish = useWishlist();
  const wished = wish.has(product.handle);

  const primaryCollection = product.collections?.[0]?.replace(/-/g, ' ');

  const handleAdd = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (isSoon) { toast.info(`We’ll ping you when ${product.title} drops.`); return; }
    cart.add(product, 1);
    toast.success(`Added “${product.title}” to cart`);
    openCartDrawer();
  };
  const handleWish = (e) => {
    e.preventDefault(); e.stopPropagation();
    const nowWished = wish.toggle(product);
    toast[nowWished ? 'success' : 'message'](nowWished ? 'Saved to wishlist' : 'Removed from wishlist');
  };
  const handleQuick = (e) => {
    e.preventDefault(); e.stopPropagation();
    onQuickView && onQuickView(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.04, 0.32), ease: [0.19, 1, 0.22, 1] }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      className="h-full"
    >
      <Link href={`/store/product/${product.handle}`} className="block h-full group">
        <Card className="relative glass-panel frame-corners overflow-hidden hover:border-red-600/70 card-lift h-full flex flex-col">
          <div className="relative aspect-[4/5] overflow-hidden">
            <AnimatePresence initial={false}>
              <motion.div
                key={hover ? 'hover' : 'primary'}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
                className="absolute inset-0"
              >
                <ProductArtwork
                  product={hover ? { ...product, sigil: product.hoverImage?.sigil || product.featuredImage?.sigil, accent: product.hoverImage?.accent || product.featuredImage?.accent, featuredImage: product.hoverImage } : product}
                />
              </motion.div>
            </AnimatePresence>

            {/* Badges (top-left stack) */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
              <span className="px-2.5 py-1 bg-black/80 backdrop-blur-sm rounded text-[10px] uppercase tracking-[0.25em] text-red-300 border border-red-900/70 font-cinzel">
                {primaryCollection || product.productType}
              </span>
              {product.isNew && (
                <span className="px-2 py-0.5 bg-amber-500 text-black rounded text-[9px] uppercase tracking-widest font-bold">New</span>
              )}
              {product.isOnSale && (
                <span className="px-2 py-0.5 bg-red-600 text-white rounded text-[9px] uppercase tracking-widest font-bold">-{salePct}%</span>
              )}
            </div>

            {/* Inventory badge (top-right) */}
            <div className={`absolute top-3 right-3 px-2.5 py-1 rounded text-[10px] uppercase tracking-[0.25em] font-cinzel backdrop-blur-sm border ${status.tint}`}>
              {status.label}
            </div>

            {/* Wishlist heart (below inventory badge) */}
            <button
              onClick={handleWish}
              aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
              className={`absolute top-14 right-3 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center border transition-premium ${wished ? 'bg-red-950/80 border-red-600 text-red-400 glow-red' : 'bg-black/60 border-neutral-800 text-neutral-300 hover:border-red-700 hover:text-red-400'}`}
            >
              <Heart className={`w-4 h-4 ${wished ? 'fill-red-500' : ''}`} />
            </button>

            {/* Quick actions overlay (bottom, fades in on hover) */}
            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
              {onQuickView && (
                <button
                  onClick={handleQuick}
                  className="flex-1 h-9 rounded-md border border-neutral-800 bg-black/60 hover:bg-red-950/40 hover:border-red-700 text-neutral-200 flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-widest font-cinzel transition-premium"
                >
                  <Eye className="w-3.5 h-3.5" /> Quick View
                </button>
              )}
              <button
                onClick={handleAdd}
                className="flex-1 h-9 rounded-md border border-red-900 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-widest font-cinzel btn-glow-red transition-premium"
              >
                <ShoppingCart className="w-3.5 h-3.5" /> {isSoon ? 'Notify' : 'Add'}
              </button>
            </div>
          </div>

          <div className="p-4 md:p-5 flex flex-col flex-1">
            <h3 className="font-cinzel text-sm md:text-base font-semibold text-white group-hover:text-red-300 transition-colors line-clamp-2 leading-snug mb-2 min-h-[2.6em]">
              {product.title}
            </h3>
            <div className="flex items-center gap-2 mb-3">
              <Stars rating={product.rating} />
              <span className="text-[10px] text-neutral-500">({product.reviewCount})</span>
            </div>
            <div className="flex items-baseline gap-2 mt-auto">
              <span className="font-cinzel text-lg md:text-xl text-red-400 text-glow">
                {formatPrice(price.amount, price.currencyCode)}
              </span>
              {compareAt && (
                <span className="text-xs text-neutral-500 line-through">
                  {formatPrice(compareAt.amount, compareAt.currencyCode)}
                </span>
              )}
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="glass-panel rounded-lg overflow-hidden h-full flex flex-col">
      <div className="aspect-[4/5] bg-gradient-to-br from-neutral-900 via-neutral-950 to-black animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-neutral-800/70 rounded animate-pulse w-4/5" />
        <div className="h-3 bg-neutral-900 rounded animate-pulse w-1/3" />
        <div className="h-6 bg-neutral-800/70 rounded animate-pulse w-1/4" />
      </div>
    </div>
  );
}

export { Stars };
