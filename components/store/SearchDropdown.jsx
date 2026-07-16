'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { ProductArtwork } from './ProductArtwork';
import { formatPrice } from '@/lib/products';

/**
 * Search dropdown — fetches all live Shopify products once on first focus,
 * then filters in-memory as the user types. Zero hardcoded product data.
 */
export function SearchDropdown({ compact = false, onNavigate }) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef(null);

  const load = async () => {
    if (loaded) return;
    try {
      const res = await fetch('/api/shopify/products?first=100');
      if (!res.ok) return;
      const data = await res.json();
      setProducts(data?.products || []);
    } catch { /* ignore */ }
    finally { setLoaded(true); }
  };

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return [];
    return products.filter((p) => {
      const hay = [p.title, p.productType, p.vendor, p.rarity, p.pokemonSet, ...(p.tags || [])]
        .filter(Boolean).map((s) => String(s).toLowerCase()).join(' | ');
      return hay.includes(needle);
    }).slice(0, 6);
  }, [q, products]);

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
          onChange={(e) => { setQ(e.target.value); setOpen(true); load(); }}
          onFocus={() => { setOpen(true); load(); }}
          placeholder="Search products…"
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
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-neutral-950/95 backdrop-blur-xl border border-red-900/40 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden z-50"
          >
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
                <li className="border-t border-neutral-900">
                  <Link onClick={nav} href={`/search?q=${encodeURIComponent(q)}`} className="block px-4 py-2.5 text-center text-[10px] uppercase tracking-widest font-cinzel text-neutral-400 hover:text-red-400">
                    See all results →
                  </Link>
                </li>
              </ul>
            ) : (
              <div className="p-6 text-center text-sm text-neutral-500">{loaded ? `No matches for “${q}”.` : 'Searching…'}</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
