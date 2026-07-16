'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Filter as FilterIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductCard, ProductCardSkeleton } from './ProductCard';
import { FiltersSidebar } from './FiltersSidebar';
import { SORT_OPTIONS } from '@/lib/products';
import { deriveFilterOptions } from '@/lib/shopify-extras';

const PAGE_SIZE = 12;

export function CategoryClient({ collection, initialProducts }) {
  const [state, setState] = useState({ category: 'All', priceMin: 0, priceMax: 400, availability: null, rarity: null, brand: null, pokemonSet: null });
  const [sort, setSort] = useState('featured');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Filter option lists are derived from the Shopify products in this collection.
  const filterOptions = useMemo(() => deriveFilterOptions(initialProducts), [initialProducts]);

  const priceOf = (p) => Number(p.priceRange.minVariantPrice.amount);

  const filtered = useMemo(() => {
    let list = [...initialProducts];
    if (state.category !== 'All') list = list.filter((p) => p.productType === state.category);
    list = list.filter((p) => priceOf(p) >= state.priceMin && priceOf(p) <= state.priceMax);
    if (state.availability) list = list.filter((p) => p.availability === state.availability);
    if (state.rarity)       list = list.filter((p) => p.rarity === state.rarity);
    if (state.brand)        list = list.filter((p) => p.brand === state.brand);
    if (state.pokemonSet)   list = list.filter((p) => p.pokemonSet === state.pokemonSet);
    switch (sort) {
      case 'price-asc':  list.sort((a,b) => priceOf(a) - priceOf(b)); break;
      case 'price-desc': list.sort((a,b) => priceOf(b) - priceOf(a)); break;
      case 'newest':     list.sort((a,b) => b.createdAt.localeCompare(a.createdAt)); break;
      case 'popular':    list.sort((a,b) => (b.rating*b.reviewCount) - (a.rating*a.reviewCount)); break;
      case 'best':       list.sort((a,b) => b.salesCount - a.salesCount); break;
      default: break;
    }
    return list;
  }, [state, sort, initialProducts]);

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  return (
    <>
      {/* Header */}
      <section className="relative pt-32 md:pt-40 pb-10 md:pb-14">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/70 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <Link href="/store" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-neutral-400 hover:text-red-400 font-cinzel transition-colors mb-6">
            <ChevronLeft className="w-4 h-4" /> All Collections
          </Link>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="text-red-500 tracking-[0.4em] text-[10px] uppercase mb-2 font-cinzel">Collection</div>
              <h1 className="font-cinzel text-4xl md:text-6xl font-bold text-white tracking-wide">{collection.title}</h1>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileOpen(true)} className="lg:hidden inline-flex items-center gap-2 px-4 h-11 rounded-md border border-neutral-800 bg-black/50 text-neutral-200 hover:border-red-700 transition-premium">
                <FilterIcon className="w-4 h-4 text-red-500" />
                <span className="font-cinzel tracking-widest uppercase text-xs">Filters</span>
              </button>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-56 h-11 bg-black/50 border-neutral-800"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-neutral-950 border-neutral-800">
                  {SORT_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value} className="focus:bg-red-950/50 focus:text-red-100">{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar */}
          <div className="hidden lg:block">
            <FiltersSidebar state={state} setState={setState} priceMax={400} resultCount={filtered.length} options={filterOptions} onReset={() => setState({ category: 'All', priceMin: 0, priceMax: 400, availability: null, rarity: null, brand: null, pokemonSet: null })} />
          </div>

          {/* Grid */}
          <div>
            {filtered.length === 0 ? (
              <div className="max-w-md mx-auto text-center glass-panel rounded-2xl p-10">
                <h3 className="font-cinzel text-2xl text-white mb-2">No wares match</h3>
                <p className="text-neutral-400 text-sm mb-6">Try loosening your filters.</p>
                <Button onClick={() => setState({ category: 'All', priceMin: 0, priceMax: 400, availability: null, rarity: null, brand: null, pokemonSet: null })} className="bg-red-700 hover:bg-red-600 border border-red-900">
                  <span className="font-cinzel tracking-widest uppercase text-xs">Reset filters</span>
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 md:gap-6">
                  <AnimatePresence mode="popLayout">
                    {shown.map((p, i) => <ProductCard key={p.handle} product={p} index={i} />)}
                  </AnimatePresence>
                </div>
                {hasMore && (
                  <div className="text-center mt-12">
                    <Button onClick={() => setVisible((v) => v + PAGE_SIZE)} size="lg" className="h-12 px-10 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-900 glow-red btn-glow-red">
                      <span className="font-cinzel tracking-widest uppercase text-sm">Load More</span>
                    </Button>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-cinzel mt-3">Showing {shown.length} of {filtered.length}</div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Mobile filters overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[75] bg-black/70 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ duration: 0.4, ease: [0.19,1,0.22,1] }} className="fixed left-0 top-0 h-full w-[90%] max-w-sm z-[76] bg-neutral-950 border-r border-red-900/40 overflow-y-auto lg:hidden">
              <div className="flex items-center justify-between p-4 border-b border-red-900/30 sticky top-0 bg-neutral-950 z-10">
                <div className="font-cinzel tracking-widest uppercase text-sm">Filters</div>
                <button onClick={() => setMobileOpen(false)} className="w-9 h-9 rounded-md flex items-center justify-center text-neutral-400 hover:text-red-400"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4">
                <FiltersSidebar state={state} setState={setState} priceMax={400} resultCount={filtered.length} options={filterOptions} onReset={() => setState({ category: 'All', priceMin: 0, priceMax: 400, availability: null, rarity: null, brand: null, pokemonSet: null })} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
