'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProductArtwork } from './ProductArtwork';
import { formatPrice, AVAILABILITY_META } from '@/lib/products';

export function ProductCard({ product, index = 0 }) {
  const status = AVAILABILITY_META[product.availability] || AVAILABILITY_META.in_stock;
  const isSoon = product.availability === 'coming_soon';
  const price = product.priceRange.minVariantPrice;
  const compareAt = product.compareAtPrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.05, 0.4), ease: [0.19, 1, 0.22, 1] }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Link href={`/store/${product.handle}`} className="block h-full group">
        <Card className="relative glass-panel frame-corners overflow-hidden hover:border-red-600/70 card-lift h-full flex flex-col">
          <div className="relative aspect-[4/5] overflow-hidden">
            <div className="absolute inset-0 group-hover:scale-105 transition-transform duration-[900ms] ease-out">
              <ProductArtwork product={product} />
            </div>

            {/* Category badge */}
            <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/80 backdrop-blur-sm rounded text-[10px] uppercase tracking-[0.25em] text-red-300 border border-red-900/70 font-cinzel">
              {product.productType}
            </div>

            {/* Inventory badge */}
            <div className={`absolute top-3 right-3 px-2.5 py-1 rounded text-[10px] uppercase tracking-[0.25em] font-cinzel backdrop-blur-sm border ${status.tint}`}>
              {status.label}
            </div>

            {/* Sheen on hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </div>

          <div className="p-5 flex flex-col flex-1">
            <h3 className="font-cinzel text-base md:text-lg font-semibold text-white group-hover:text-red-300 transition-colors line-clamp-2 leading-snug mb-2">
              {product.title}
            </h3>
            <div className="flex items-baseline gap-2 mb-5">
              <span className="font-cinzel text-xl md:text-2xl text-red-400 text-glow">
                {formatPrice(price.amount, price.currencyCode)}
              </span>
              {compareAt && (
                <span className="text-xs text-neutral-500 line-through">
                  {formatPrice(compareAt.amount, compareAt.currencyCode)}
                </span>
              )}
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
              <span className="font-cinzel tracking-widest uppercase text-xs w-full text-center">
                {isSoon ? 'Notify Me' : 'View Product'}
              </span>
            </Button>
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
        <div className="h-6 bg-neutral-800/70 rounded animate-pulse w-1/3" />
        <div className="h-10 bg-neutral-900 rounded animate-pulse w-full" />
      </div>
    </div>
  );
}
