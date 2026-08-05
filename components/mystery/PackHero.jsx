'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Maximize2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

const STATUS_META = {
  active: { label: 'Active', dot: 'bg-emerald-400', text: 'text-emerald-300', ring: 'border-emerald-700/60' },
  soldout: { label: 'Sold Out', dot: 'bg-amber-400', text: 'text-amber-300', ring: 'border-amber-700/60' },
  archived: { label: 'Archived', dot: 'bg-red-400', text: 'text-red-300', ring: 'border-red-700/60' },
  draft: { label: 'Draft', dot: 'bg-neutral-400', text: 'text-neutral-300', ring: 'border-neutral-700/60' },
};

export function PackHero({ pack }) {
  const [open, setOpen] = useState(false);
  const status = STATUS_META[pack.status] || STATUS_META.draft;
  const artwork = pack.packArtwork || '/mystery/rmp-2026-001.png';

  return (
    <section className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:gap-12 md:py-24">
      {/* Artwork */}
      <div className="order-1 flex justify-center md:order-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group relative outline-none"
          aria-label="Open large pack preview"
        >
          {/* Crimson ambient glow */}
          <div
            aria-hidden
            className="absolute left-1/2 top-1/2 -z-10 h-[110%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/25 blur-3xl"
          />
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={artwork || '/placeholder.svg'}
              alt={`${pack.name} (${pack.runId}) pack artwork`}
              className="h-auto w-[260px] rounded-xl border border-red-900/40 shadow-[0_25px_60px_-15px_rgba(220,38,38,0.6)] md:h-[450px] md:w-auto"
            />
            <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5" />
          </motion.div>
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-red-900/60 bg-black/70 px-2.5 py-1 text-[10px] uppercase tracking-widest text-neutral-300 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
            <Maximize2 className="h-3 w-3" /> Enlarge
          </span>
        </button>
      </div>

      {/* Copy */}
      <div className="order-2 text-center md:order-1 md:text-left">
        <span
          className={`inline-flex items-center gap-2 rounded-full border ${status.ring} bg-black/40 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] ${status.text}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
          {status.label} · {pack.runId}
        </span>
        <h1 className="mt-5 font-cinzel text-4xl font-bold leading-tight text-white md:text-6xl">
          <span className="gradient-text">{pack.name}</span>
        </h1>
        {pack.description ? (
          <p className="mx-auto mt-5 max-w-md text-pretty text-base leading-relaxed text-neutral-400 md:mx-0">
            {pack.description}
          </p>
        ) : null}
        <div className="mt-7 flex flex-wrap justify-center gap-6 md:justify-start">
          {pack.productionSize ? (
            <HeroStat label="Production Size" value={pack.productionSize} />
          ) : null}
          {pack.chaseOdds ? <HeroStat label="Chase Odds" value={pack.chaseOdds} /> : null}
          {pack.chaseValue ? <HeroStat label="Est. Chase Value" value={pack.chaseValue} /> : null}
        </div>
      </div>

      {/* Large preview */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl border-red-900/40 bg-black/95 p-4">
          <DialogTitle className="sr-only">{pack.name} full artwork</DialogTitle>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={artwork || '/placeholder.svg'}
            alt={`${pack.name} full artwork`}
            className="mx-auto max-h-[80vh] w-auto rounded-lg"
          />
        </DialogContent>
      </Dialog>
    </section>
  );
}

function HeroStat({ label, value }) {
  return (
    <div>
      <p className="font-cinzel text-2xl font-bold text-white">{value}</p>
      <p className="mt-0.5 text-[11px] uppercase tracking-[0.16em] text-neutral-500">{label}</p>
    </div>
  );
}
