'use client';
import { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Generic filter sidebar. Options are supplied by the parent (which derives
 * them from live Shopify products). This component is data-agnostic — it
 * never imports catalog information directly.
 */
export function FiltersSidebar({ state, setState, onReset, options = {} }) {
  const [priceOpen, setPriceOpen] = useState(true);
  const [availabilityOpen, setAvailabilityOpen] = useState(true);
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [rarityOpen, setRarityOpen]   = useState(false);
  const [setOpen, setSetOpen]         = useState(false);
  const [brandOpen, setBrandOpen]     = useState(false);

  const set = (k) => (v) => setState((s) => ({ ...s, [k]: v }));
  const toggle = (k) => (v) => setState((s) => ({ ...s, [k]: s[k] === v ? null : v }));

  const productTypes = options.productTypes || [];
  const rarities     = options.rarities     || [];
  const sets         = options.sets         || [];
  const brands       = options.brands       || [];

  const AVAILABILITY = [
    { value: 'in_stock',    label: 'In Stock' },
    { value: 'low_stock',   label: 'Low Stock' },
    { value: 'coming_soon', label: 'Coming Soon' },
    { value: 'sold_out',    label: 'Sold Out' },
  ];

  return (
    <aside className="w-full lg:w-64 space-y-5 lg:sticky lg:top-24 lg:self-start">
      <div className="flex items-center justify-between">
        <h3 className="font-cinzel text-sm uppercase tracking-widest text-red-500">Filters</h3>
        <button onClick={onReset} className="text-[10px] text-neutral-400 hover:text-red-400 uppercase tracking-widest font-cinzel flex items-center gap-1">
          <X className="w-3 h-3" /> Reset
        </button>
      </div>

      {productTypes.length > 0 && (
        <Group title="Category" open={categoryOpen} onToggle={() => setCategoryOpen((v) => !v)}>
          {['All', ...productTypes].map((c) => (
            <FilterButton key={c} active={state.category === c} onClick={() => set('category')(c)}>{c}</FilterButton>
          ))}
        </Group>
      )}

      <Group title="Price" open={priceOpen} onToggle={() => setPriceOpen((v) => !v)}>
        <div className="px-2 py-3 space-y-2">
          <div className="flex items-center gap-2 text-xs text-neutral-400 font-cinzel">
            <span>${state.priceMin}</span> <span className="flex-1 text-center opacity-50">—</span> <span>${state.priceMax}</span>
          </div>
          <input type="range" min={0} max={500} value={state.priceMax} onChange={(e) => set('priceMax')(Number(e.target.value))} className="w-full accent-red-600" />
        </div>
      </Group>

      <Group title="Availability" open={availabilityOpen} onToggle={() => setAvailabilityOpen((v) => !v)}>
        {AVAILABILITY.map((a) => (
          <FilterButton key={a.value} active={state.availability === a.value} onClick={() => toggle('availability')(a.value)}>{a.label}</FilterButton>
        ))}
      </Group>

      {rarities.length > 0 && (
        <Group title="Rarity" open={rarityOpen} onToggle={() => setRarityOpen((v) => !v)}>
          {rarities.map((r) => <FilterButton key={r} active={state.rarity === r} onClick={() => toggle('rarity')(r)}>{r}</FilterButton>)}
        </Group>
      )}

      {sets.length > 0 && (
        <Group title="Set" open={setOpen} onToggle={() => setSetOpen((v) => !v)}>
          {sets.map((s) => <FilterButton key={s} active={state.pokemonSet === s} onClick={() => toggle('pokemonSet')(s)}>{s}</FilterButton>)}
        </Group>
      )}

      {brands.length > 0 && (
        <Group title="Brand" open={brandOpen} onToggle={() => setBrandOpen((v) => !v)}>
          {brands.map((b) => <FilterButton key={b} active={state.brand === b} onClick={() => toggle('brand')(b)}>{b}</FilterButton>)}
        </Group>
      )}
    </aside>
  );
}

function Group({ title, open, onToggle, children }) {
  return (
    <div className="glass-panel rounded-lg overflow-hidden border border-neutral-900">
      <button onClick={onToggle} className="w-full flex items-center justify-between px-4 py-3 hover:bg-red-950/20">
        <span className="text-xs uppercase tracking-widest font-cinzel text-neutral-200">{title}</span>
        <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open ? <div className="p-2 grid gap-1">{children}</div> : null}
    </div>
  );
}

function FilterButton({ active, onClick, children }) {
  return (
    <button onClick={onClick} className={`text-left px-3 py-2 rounded-md text-xs font-cinzel tracking-wide transition-colors ${active ? 'bg-red-950/50 text-red-300 border border-red-800/70' : 'text-neutral-300 hover:bg-red-950/20 hover:text-red-300'}`}>
      {children}
    </button>
  );
}
