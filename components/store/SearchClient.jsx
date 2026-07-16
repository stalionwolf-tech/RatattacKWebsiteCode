'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search as SearchIcon, X, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/store/ProductCard';
import { EmptyStore } from '@/components/store/EmptyStore';
import { DISCORD_INVITE_URL } from '@/lib/config';

export function SearchClient({ initialQuery = '', allProducts = [] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(initialQuery);

  // Sync URL when the query stabilises (debounced).
  useEffect(() => {
    const t = setTimeout(() => {
      const current = params.get('q') || '';
      if (q === current) return;
      const next = new URLSearchParams(Array.from(params.entries()));
      if (q) next.set('q', q); else next.delete('q');
      router.replace(`/search${next.toString() ? `?${next.toString()}` : ''}`);
    }, 250);
    return () => clearTimeout(t);
  }, [q]); // eslint-disable-line react-hooks/exhaustive-deps

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const needle = q.trim().toLowerCase();
    return allProducts.filter((p) => {
      const hay = [
        p.title, p.description, p.vendor, p.productType, p.rarity, p.pokemonSet,
        ...(p.tags || []),
      ].filter(Boolean).map((s) => String(s).toLowerCase()).join(' | ');
      return hay.includes(needle);
    });
  }, [q, allProducts]);

  const suggestions = useMemo(() => {
    if (q.trim() || !allProducts.length) return [];
    const types = new Set();
    for (const p of allProducts) if (p.productType) types.add(p.productType);
    return Array.from(types).slice(0, 8);
  }, [q, allProducts]);

  return (
    <>
      <div className="mb-8">
        <div className="text-red-500 tracking-[0.5em] text-[10px] uppercase mb-3 font-cinzel inline-flex items-center gap-2">
          <SearchIcon className="w-3 h-3" /> Search the Vault
        </div>
        <h1 className="font-cinzel text-4xl md:text-5xl font-bold text-white">Search</h1>
      </div>

      <div className="relative max-w-2xl mb-10">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 pointer-events-none" />
        <Input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search booster boxes, singles, merch…"
          className="pl-12 pr-12 h-14 bg-black/60 border-neutral-800 focus:border-red-600 text-base"
        />
        {q ? (
          <button onClick={() => setQ('')} aria-label="Clear" className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-red-400">
            <X className="w-4 h-4" />
          </button>
        ) : null}
      </div>

      {q.trim() ? (
        results.length ? (
          <>
            <p className="text-sm text-neutral-400 mb-4 font-cinzel tracking-widest uppercase text-[10px]">
              {results.length} result{results.length === 1 ? '' : 's'} for “<span className="text-red-400">{q}</span>”
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {results.map((p, i) => (
                <ProductCard key={p.handle} product={p} index={i} />
              ))}
            </div>
          </>
        ) : (
          <EmptyStore
            eyebrow="No matches"
            title="Nothing Found in the Archives"
            message={`Nothing matched “${q}”. Try a different set, product type, or browse the collections.`}
            ctas={[
              { href: '/store',           label: 'Browse Store',  variant: 'primary' },
              { href: DISCORD_INVITE_URL, label: 'Join Discord',  variant: 'ghost', external: true },
            ]}
          />
        )
      ) : allProducts.length ? (
        <div>
          {suggestions.length ? (
            <div className="mb-8">
              <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-cinzel mb-3 inline-flex items-center gap-2"><Sparkles className="w-3 h-3" /> Try browsing</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button key={s} onClick={() => setQ(s)} className="px-3 py-1.5 rounded-full text-xs border border-red-900/60 bg-black/40 hover:bg-red-950/40 hover:border-red-600 text-neutral-300 hover:text-white transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-cinzel mb-3">All products</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {allProducts.slice(0, 12).map((p, i) => (
              <ProductCard key={p.handle} product={p} index={i} />
            ))}
          </div>
          {allProducts.length > 12 ? (
            <div className="text-center mt-8">
              <Link href="/store" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-panel border border-red-900/60 hover:border-red-600/80 text-neutral-200 hover:text-white transition-colors">
                <span className="font-cinzel tracking-widest uppercase text-xs">See all products</span>
              </Link>
            </div>
          ) : null}
        </div>
      ) : (
        <EmptyStore
          eyebrow="Nothing to Search Yet"
          title="The Archives Are Empty"
          message="No products are listed in the vault yet. Return once the merchant has added inventory."
          ctas={[
            { href: '/',            label: 'Return Home',   variant: 'primary' },
            { href: '/#community',  label: 'Join Discord',  variant: 'ghost' },
          ]}
        />
      )}
    </>
  );
}
