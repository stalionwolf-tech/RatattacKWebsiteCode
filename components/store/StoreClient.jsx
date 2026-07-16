'use client';
import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, PackageOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductCard, ProductCardSkeleton } from './ProductCard';
import { CATEGORIES, SORT_OPTIONS, queryProducts } from '@/lib/products';

const PAGE_SIZE = 8;

export function StoreClient() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('featured');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);

  // Fake a small load so skeletons breathe once on first paint
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, []);

  const results = useMemo(
    () => queryProducts({ search, category, sort }),
    [search, category, sort]
  );

  // Reset pagination when filters change
  useEffect(() => { setVisible(PAGE_SIZE); }, [search, category, sort]);

  const shown = results.slice(0, visible);
  const hasMore = visible < results.length;

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setSort('featured');
  };
  const activeFilterCount = (search ? 1 : 0) + (category !== 'All' ? 1 : 0) + (sort !== 'featured' ? 1 : 0);

  return (
    <>
      {/* Filter bar */}
      <div className="glass-panel frame-corners rounded-xl p-4 md:p-5 mb-10">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, sets, keywords…"
              className="bg-black/50 border-neutral-800 focus:border-red-600 focus:ring-red-600/30 pl-10 pr-10 h-11 transition-premium"
              aria-label="Search products"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-red-400 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category */}
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="lg:w-56 h-11 bg-black/50 border-neutral-800 focus:border-red-600 focus:ring-red-600/30 transition-premium">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-red-500" />
                <SelectValue placeholder="Category" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-neutral-950 border-neutral-800">
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c} className="focus:bg-red-950/50 focus:text-red-100">
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="lg:w-56 h-11 bg-black/50 border-neutral-800 focus:border-red-600 focus:ring-red-600/30 transition-premium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-neutral-950 border-neutral-800">
              {SORT_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value} className="focus:bg-red-950/50 focus:text-red-100">
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-neutral-900">
          <div className="text-xs uppercase tracking-[0.3em] text-neutral-500 font-cinzel">
            {loading ? (
              <span className="inline-block w-32 h-3 bg-neutral-800 animate-pulse rounded" />
            ) : (
              <><span className="text-red-400 font-semibold">{results.length}</span> {results.length === 1 ? 'Item' : 'Items'}</>
            )}
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs uppercase tracking-[0.3em] text-neutral-400 hover:text-red-400 font-cinzel flex items-center gap-2 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Clear filters ({activeFilterCount})
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : results.length === 0 ? (
        <EmptyState onClear={clearFilters} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
            <AnimatePresence mode="popLayout">
              {shown.map((p, i) => (
                <ProductCard key={p.handle} product={p} index={i} />
              ))}
            </AnimatePresence>
          </div>

          {hasMore && (
            <div className="text-center mt-12">
              <Button
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                size="lg"
                className="btn-glow-red bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 h-12 px-10 border border-red-900 glow-red transition-premium"
              >
                <span className="font-cinzel tracking-widest uppercase text-sm">Load More</span>
              </Button>
              <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-cinzel mt-3">
                Showing {shown.length} of {results.length}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

function EmptyState({ onClear }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-md mx-auto text-center glass-panel frame-corners rounded-2xl p-10"
    >
      <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-950/50 border border-red-900/60 flex items-center justify-center text-red-400">
        <PackageOpen className="w-7 h-7" />
      </div>
      <h3 className="font-cinzel text-2xl text-white mb-2">The Vault is Silent</h3>
      <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
        No products match your current filters. Try clearing them or searching for a different term.
      </p>
      <Button
        onClick={onClear}
        className="bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-900 h-11 px-6 btn-glow-red"
      >
        <span className="font-cinzel tracking-widest uppercase text-xs">Reset Filters</span>
      </Button>
    </motion.div>
  );
}
