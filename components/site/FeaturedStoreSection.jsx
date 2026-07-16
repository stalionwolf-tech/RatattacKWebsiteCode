'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeader } from './SectionHeader';
import { ProductCard } from '@/components/store/ProductCard';
import { PRODUCTS } from '@/lib/products';

// Preview the first six products from the real store catalog.
const FEATURED = PRODUCTS.slice(0, 6);

export function FeaturedStoreSection() {
  return (
    <section id="store" className="relative py-28 md:py-40">
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.08),transparent_55%)]" />

      <div className="container mx-auto px-6 relative z-10">
        <SectionHeader
          eyebrow="Featured Store"
          title="Collect. Open. Conquer."
          description="Browse featured Pokémon TCG products, RatAttacK merchandise, and exclusive collectibles. Click any card to view details."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 max-w-7xl mx-auto">
          {FEATURED.map((p, i) => (
            <ProductCard key={p.handle} product={p} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-14"
        >
          <Button
            asChild
            size="lg"
            className="btn-glow-red bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 h-12 px-8 border border-red-900 glow-red transition-premium"
          >
            <Link href="/store">
              <span className="font-cinzel tracking-widest uppercase text-sm">Enter the Vault</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
