'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { ProductArtwork } from './ProductArtwork';
import { formatPrice, searchProducts, COLLECTIONS } from '@/lib/products';

export function SearchDropdown({ compact = false, onNavigate }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const results = useMemo(() => searchProducts(q, 6), [q]);
  const collectionMatches = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return COLLECTIONS.filter((c) => c.title.toLowerCase().includes(s)).slice(0, 4);
  }, [q]);

  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const nav = () => { setOpen(false); setQ(''); onNavigate && onNavigate(); };

  return (
    <div ref={ref} className={`relative ${compact ? 'w-full' : 'w-full max-w-md'}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search products, sets, collections…"
          className="w-full bg-black/50 border border-neutral-800 focus:border-red-600 focus:ring-red-600/30 rounded-md pl-10 pr-9 h-10 text-sm text-neutral-100 outline-none focus:ring-2 transition-premium"
          aria-label="Search the store"
        />
        {q && (
          <button onClick={() => setQ('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-red-400" aria-label="Clear">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && q && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-neutral-950/95 backdrop-blur-xl border border-red-900/40 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden z-50"
          >
            {collectionMatches.length > 0 && (
              <div className="p-3 border-b border-neutral-900">
                <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-cinzel mb-2 px-1">Collections</div>
                <div className="flex flex-wrap gap-2">
                  {collectionMatches.map((c) => (
                    <Link key={c.slug} onClick={nav} href={`/store/category/${c.slug}`} className="px-3 py-1.5 rounded-md bg-red-950/50 border border-red-900/60 text-red-300 text-xs uppercase tracking-widest font-cinzel hover:border-red-600 transition-premium">
                      {c.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {results.length > 0 ? (
              <ul className="max-h-80 overflow-y-auto">
                {results.map((p) => (
                  <li key={p.handle}>
                    <Link onClick={nav} href={`/store/product/${p.handle}`} className="flex items-center gap-3 px-3 py-2.5 hover:bg-red-950/30 transition-colors">
                      <div className="w-11 h-14 rounded overflow-hidden border border-neutral-800 flex-shrink-0">
                        <ProductArtwork product={p} size="sm" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-cinzel text-sm text-white truncate">{p.title}</div>
                        <div className="text-[10px] uppercase tracking-widest text-neutral-500">{p.productType}</div>
                      </div>
                      <div className="font-cinzel text-sm text-red-400">{formatPrice(p.priceRange.minVariantPrice.amount, p.priceRange.minVariantPrice.currencyCode)}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : collectionMatches.length === 0 && (
              <div className="p-6 text-center text-sm text-neutral-500">No matches for “{q}”.</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
