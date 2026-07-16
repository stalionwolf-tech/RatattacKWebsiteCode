'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { ProductCard } from '@/components/store/ProductCard';
import { useRecentlyViewed } from '@/lib/account-hooks';

/**
 * Renders the visitor's recently viewed products. Fetches live product data
 * for each stored handle via the public /api/shopify/products/[handle] proxy
 * (which itself falls through to a 404 when Shopify is empty).
 * Renders nothing while the list is empty — no placeholders.
 */
export function RecentlyViewed({ excludeHandle, title = 'Recently Viewed', limit = 6 }) {
  const { handles } = useRecentlyViewed();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const list = handles.filter((h) => h !== excludeHandle).slice(0, limit);
      if (!list.length) { setProducts([]); return; }
      const results = await Promise.all(list.map(async (h) => {
        try {
          const res = await fetch(`/api/shopify/products/${encodeURIComponent(h)}`);
          if (!res.ok) return null;
          const data = await res.json();
          return data?.product || null;
        } catch { return null; }
      }));
      if (!cancelled) setProducts(results.filter(Boolean));
    })();
    return () => { cancelled = true; };
  }, [handles, excludeHandle, limit]);

  if (!products.length) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="container mx-auto px-6 py-16 md:py-24"
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="w-8 h-8 rounded-full bg-red-950/40 border border-red-800 flex items-center justify-center text-red-400"><Clock className="w-4 h-4" /></span>
        <h2 className="font-cinzel text-xl md:text-2xl text-white">{title}</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.map((p, i) => (
          <ProductCard key={p.handle} product={p} index={i} />
        ))}
      </div>
    </motion.section>
  );
}
