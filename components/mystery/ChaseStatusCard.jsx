'use client';

import { CheckCircle2, Trophy, MapPin, CalendarDays } from 'lucide-react';

function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

export function ChaseStatusCard({ pack }) {
  const claimed = Boolean(pack.claimed);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-8 text-center ${
        claimed
          ? 'border-red-800/60 bg-gradient-to-b from-red-950/40 to-black'
          : 'border-emerald-800/60 bg-gradient-to-b from-emerald-950/30 to-black'
      }`}
    >
      <div
        aria-hidden
        className={`absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl ${
          claimed ? 'bg-red-600/30' : 'bg-emerald-500/25'
        }`}
      />
      <div className="relative">
        <div
          className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border ${
            claimed
              ? 'border-red-700/60 bg-red-950/60 text-red-300'
              : 'border-emerald-700/60 bg-emerald-950/50 text-emerald-300'
          }`}
        >
          {claimed ? <Trophy className="h-7 w-7" /> : <CheckCircle2 className="h-7 w-7" />}
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Chase Status</p>
        <p
          className={`mt-2 font-cinzel text-4xl font-bold tracking-wide ${
            claimed ? 'text-red-400' : 'text-emerald-400'
          }`}
        >
          {claimed ? 'CLAIMED' : 'ACTIVE'}
        </p>
        <p className="mx-auto mt-3 max-w-sm text-sm text-neutral-400">
          {claimed
            ? 'The Featured Chase Card for this production run has been pulled and verified.'
            : 'The Featured Chase Card is still sealed inside an unopened pack somewhere in this run.'}
        </p>

        {claimed && (pack.dateClaimed || pack.winnerLocation) ? (
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {pack.dateClaimed ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-red-900/50 bg-black/40 px-4 py-2 text-sm text-neutral-200">
                <CalendarDays className="h-4 w-4 text-red-400" />
                Claimed {formatDate(pack.dateClaimed)}
              </span>
            ) : null}
            {pack.winnerLocation ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-red-900/50 bg-black/40 px-4 py-2 text-sm text-neutral-200">
                <MapPin className="h-4 w-4 text-red-400" />
                {pack.winnerLocation}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
