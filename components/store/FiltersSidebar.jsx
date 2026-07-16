'use client';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { CATEGORIES, RARITIES, BRANDS, POKEMON_SETS } from '@/lib/products';

function FilterGroup({ title, children }) {
  return (
    <div className="border-b border-neutral-900 pb-5 mb-5 last:border-b-0 last:mb-0 last:pb-0">
      <h4 className="font-cinzel text-[11px] uppercase tracking-[0.3em] text-red-500 mb-3">{title}</h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Radio({ label, value, active, onClick, count }) {
  return (
    <button
      onClick={() => onClick(value)}
      className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md text-left text-sm transition-premium ${
        active ? 'bg-red-950/60 border border-red-800 text-white' : 'text-neutral-400 hover:bg-red-950/30 hover:text-white border border-transparent'
      }`}
    >
      <span className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${active ? 'bg-red-500 shadow-[0_0_8px_rgba(220,38,38,0.8)]' : 'bg-neutral-700'}`} />
        {label}
      </span>
      {typeof count === 'number' && <span className="text-[10px] text-neutral-500">{count}</span>}
    </button>
  );
}

export function FiltersSidebar({ state, setState, priceMax = 400, resultCount = 0 }) {
  const set = (patch) => setState((s) => ({ ...s, ...patch }));
  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-panel frame-corners rounded-xl p-5 md:p-6 sticky top-24"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-cinzel text-lg text-white">Filters</h3>
        <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-cinzel">{resultCount} results</span>
      </div>

      <FilterGroup title="Category">
        {CATEGORIES.map((c) => (
          <Radio key={c} label={c} value={c} active={state.category === c} onClick={(v) => set({ category: v })} />
        ))}
      </FilterGroup>

      <FilterGroup title="Price">
        <div className="px-1">
          <Slider
            value={[state.priceMin ?? 0, state.priceMax ?? priceMax]}
            min={0}
            max={priceMax}
            step={5}
            onValueChange={([mn, mx]) => set({ priceMin: mn, priceMax: mx })}
            className="my-4"
          />
          <div className="flex justify-between text-xs text-neutral-400 font-cinzel">
            <span>${state.priceMin ?? 0}</span>
            <span>${state.priceMax ?? priceMax}+</span>
          </div>
        </div>
      </FilterGroup>

      <FilterGroup title="Availability">
        <Radio label="All"          value={null}         active={!state.availability}                onClick={(v) => set({ availability: v })} />
        <Radio label="In Stock"     value="in_stock"     active={state.availability === 'in_stock'}   onClick={(v) => set({ availability: v })} />
        <Radio label="Low Stock"    value="low_stock"    active={state.availability === 'low_stock'}  onClick={(v) => set({ availability: v })} />
        <Radio label="Coming Soon"  value="coming_soon"  active={state.availability === 'coming_soon'} onClick={(v) => set({ availability: v })} />
      </FilterGroup>

      <FilterGroup title="Pokémon Set">
        <Radio label="All" value={null} active={!state.pokemonSet} onClick={(v) => set({ pokemonSet: v })} />
        {POKEMON_SETS.map((s) => (
          <Radio key={s} label={s} value={s} active={state.pokemonSet === s} onClick={(v) => set({ pokemonSet: v })} />
        ))}
      </FilterGroup>

      <FilterGroup title="Rarity">
        <Radio label="All" value={null} active={!state.rarity} onClick={(v) => set({ rarity: v })} />
        {RARITIES.map((r) => (
          <Radio key={r} label={r} value={r} active={state.rarity === r} onClick={(v) => set({ rarity: v })} />
        ))}
      </FilterGroup>

      <FilterGroup title="Brand">
        <Radio label="All" value={null} active={!state.brand} onClick={(v) => set({ brand: v })} />
        {BRANDS.map((b) => (
          <Radio key={b} label={b} value={b} active={state.brand === b} onClick={(v) => set({ brand: v })} />
        ))}
      </FilterGroup>

      <button
        onClick={() => setState({ category: 'All', priceMin: 0, priceMax: priceMax, availability: null, rarity: null, brand: null, pokemonSet: null })}
        className="w-full mt-2 text-xs uppercase tracking-[0.3em] text-neutral-400 hover:text-red-400 font-cinzel py-2 transition-colors"
      >
        Reset All
      </button>
    </motion.aside>
  );
}
