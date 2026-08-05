'use client';

import { ChevronRight, ImageIcon } from 'lucide-react';

const STATUS_STYLES = {
  active: 'text-emerald-300 border-emerald-800/60 bg-emerald-950/40',
  soldout: 'text-amber-300 border-amber-800/60 bg-amber-950/40',
  archived: 'text-red-300 border-red-800/60 bg-red-950/40',
  draft: 'text-neutral-300 border-neutral-700 bg-neutral-900',
};

const STATUS_LABELS = {
  active: 'Active',
  soldout: 'Sold Out',
  archived: 'Archived',
  draft: 'Draft',
};

export function ArchiveGrid({ packs = [], currentId, onSelect }) {
  if (!packs.length) return null;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {packs.map((pack) => {
        const isCurrent = pack.id === currentId;
        return (
          <button
            key={pack.id}
            type="button"
            onClick={() => onSelect(pack)}
            className={`group flex flex-col overflow-hidden rounded-2xl border text-left transition-all hover:-translate-y-1 ${
              isCurrent
                ? 'border-red-600 bg-red-950/20 shadow-[0_0_30px_-8px_rgba(220,38,38,0.5)]'
                : 'border-neutral-800 bg-neutral-950/50 hover:border-red-800/60'
            }`}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-black">
              {pack.packArtwork ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={pack.packArtwork || '/placeholder.svg'}
                  alt={`${pack.name} artwork`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-neutral-700">
                  <ImageIcon className="h-8 w-8" />
                </div>
              )}
              <span
                className={`absolute right-3 top-3 rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${
                  STATUS_STYLES[pack.status] || STATUS_STYLES.draft
                }`}
              >
                {STATUS_LABELS[pack.status] || pack.status}
              </span>
            </div>

            <div className="flex flex-1 flex-col p-4">
              <p className="font-cinzel text-lg text-white">{pack.name}</p>
              <p className="text-xs uppercase tracking-widest text-red-400/80">{pack.runId}</p>

              <dl className="mt-4 space-y-1.5 text-sm">
                <Row label="Featured Chase" value={pack.chaseName || '—'} />
                <Row label="Production Size" value={pack.productionSize || '—'} />
                <Row
                  label="Chase"
                  value={pack.claimed ? 'Claimed' : 'Active'}
                  valueClass={pack.claimed ? 'text-red-400' : 'text-emerald-400'}
                />
              </dl>

              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-neutral-300 transition-colors group-hover:text-red-400">
                View details
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function Row({ label, value, valueClass = 'text-neutral-200' }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-neutral-500">{label}</dt>
      <dd className={`text-right font-medium ${valueClass}`}>{value}</dd>
    </div>
  );
}
