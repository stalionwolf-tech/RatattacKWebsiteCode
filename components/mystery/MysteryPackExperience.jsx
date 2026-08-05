'use client';

import { useMemo, useState } from 'react';
import {
  PackageOpen,
  Layers,
  Shuffle,
  Star,
  ScrollText,
  QrCode,
  Check,
  ArrowLeft,
  ImageIcon,
} from 'lucide-react';
import { PackHero } from '@/components/mystery/PackHero';
import { ChaseStatusCard } from '@/components/mystery/ChaseStatusCard';
import { PackFaq } from '@/components/mystery/PackFaq';
import { ArchiveGrid } from '@/components/mystery/ArchiveGrid';

const RANDOMIZATION_STEPS = [
  'Each RatAttacK Mystery Pack production run is assembled before launch.',
  'The Featured Chase Card is randomly inserted before every pack is sealed.',
  'All packs are mixed before being sold.',
  'No one knows which pack contains the chase.',
];

function Section({ id, icon: Icon, eyebrow, title, children }) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="mb-8 flex items-center gap-3">
        {Icon ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-900/50 bg-red-950/40 text-red-400">
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
        <div>
          {eyebrow ? (
            <p className="text-[11px] uppercase tracking-[0.24em] text-red-400/70">{eyebrow}</p>
          ) : null}
          <h2 className="font-cinzel text-2xl font-bold text-white md:text-3xl">{title}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}

function StatTile({ label, value }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-5 text-center">
      <p className="font-cinzel text-xl font-bold text-white md:text-2xl">{value || '—'}</p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-neutral-500">{label}</p>
    </div>
  );
}

export function MysteryPackExperience({ active, archive = [], qrMap = {} }) {
  const allPacks = useMemo(() => [active, ...archive].filter(Boolean), [active, archive]);
  const [currentId, setCurrentId] = useState(active?.id ?? archive[0]?.id ?? null);

  const current = useMemo(
    () => allPacks.find((p) => p.id === currentId) || active || archive[0] || null,
    [allPacks, currentId, active, archive],
  );

  const otherPacks = useMemo(
    () => allPacks.filter((p) => p.id !== current?.id),
    [allPacks, current],
  );

  const selectPack = (pack) => {
    setCurrentId(pack.id);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Empty state: nothing configured yet.
  if (!current) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-24 text-center">
        <PackageOpen className="mb-4 h-12 w-12 text-neutral-700" />
        <h1 className="font-cinzel text-3xl font-bold text-white">No Active Production Run</h1>
        <p className="mt-3 text-neutral-400">
          There is no mystery pack production run marked as active right now. Check back soon.
        </p>
      </div>
    );
  }

  const isViewingArchive = active && current.id !== active.id;
  const qr = qrMap[current.id];

  return (
    <>
      {isViewingArchive ? (
        <div className="border-b border-red-900/30 bg-red-950/20">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
            <p className="text-sm text-neutral-300">
              Viewing archived run <span className="font-medium text-white">{current.runId}</span>
            </p>
            <button
              type="button"
              onClick={() => selectPack(active)}
              className="inline-flex items-center gap-1.5 rounded-full border border-red-800/60 bg-black/40 px-3 py-1.5 text-xs font-medium uppercase tracking-widest text-neutral-200 hover:border-red-600"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Current run
            </button>
          </div>
        </div>
      ) : null}

      <PackHero pack={current} />

      {/* Current run stats */}
      <Section id="current-run" icon={Layers} eyebrow="Current Run" title="Production Overview">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <StatTile label="Production Run" value={current.runId} />
          <StatTile
            label="Status"
            value={
              current.claimed
                ? 'Claimed'
                : { active: 'Active', soldout: 'Sold Out', archived: 'Archived', draft: 'Draft' }[
                    current.status
                  ] || current.status
            }
          />
          <StatTile label="Production Size" value={current.productionSize} />
          <StatTile label="Featured Chase" value={current.chaseName} />
          <StatTile label="Chase Odds" value={current.chaseOdds} />
          <StatTile label="Est. Chase Value" value={current.chaseValue} />
        </div>
      </Section>

      {/* Pack contents */}
      {current.contents?.length ? (
        <Section id="contents" icon={PackageOpen} eyebrow="What's Inside" title="Pack Contents">
          <ul className="grid gap-3 sm:grid-cols-2">
            {current.contents.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-xl border border-neutral-800 bg-neutral-950/50 p-4"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-950/60 text-red-400">
                  <Check className="h-3 w-3" />
                </span>
                <span className="text-sm text-neutral-200">{item}</span>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* How randomization works */}
      <Section id="randomization" icon={Shuffle} eyebrow="Fair & Sealed" title="How Randomization Works">
        <div className="grid gap-4 md:grid-cols-4">
          {RANDOMIZATION_STEPS.map((step, i) => (
            <div
              key={i}
              className="relative rounded-xl border border-neutral-800 bg-neutral-950/50 p-5"
            >
              <span className="font-cinzel text-3xl font-bold text-red-800/50">{i + 1}</span>
              <p className="mt-2 text-sm leading-relaxed text-neutral-300">{step}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Chase card */}
      <Section id="chase-card" icon={Star} eyebrow="The Prize" title="Featured Chase Card">
        <div className="grid items-center gap-8 rounded-2xl border border-amber-900/30 bg-gradient-to-b from-amber-950/10 to-black p-6 md:grid-cols-[300px_1fr] md:p-8">
          <div className="relative mx-auto w-full max-w-[300px]">
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 -z-10 h-[90%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/20 blur-3xl"
            />
            {current.chaseImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={current.chaseImage || '/placeholder.svg'}
                alt={`${current.chaseName || 'Featured chase'} card`}
                className="mx-auto w-full rounded-xl border border-amber-700/30 shadow-[0_20px_50px_-15px_rgba(245,197,66,0.4)]"
              />
            ) : (
              <div className="flex aspect-[3/4] w-full items-center justify-center rounded-xl border border-amber-800/30 bg-black text-neutral-700">
                <ImageIcon className="h-10 w-10" />
              </div>
            )}
          </div>

          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/50 bg-amber-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
              <Star className="h-3.5 w-3.5 fill-amber-300" /> Featured Chase
            </span>
            <h3 className="mt-4 font-cinzel text-3xl font-bold text-white">
              {current.chaseName || 'To Be Revealed'}
            </h3>
            <dl className="mt-6 divide-y divide-neutral-800/70 border-y border-neutral-800/70">
              <ChaseRow label="Set" value={current.chaseSet} />
              <ChaseRow label="Card Number" value={current.chaseNumber} />
              <ChaseRow label="Estimated Value" value={current.chaseValue} highlight />
              <ChaseRow label="Odds" value={current.chaseOdds} />
            </dl>
          </div>
        </div>
      </Section>

      {/* Chase status */}
      <Section id="chase-status" icon={Star} eyebrow="Live Status" title="Is the Chase Still Out There?">
        <ChaseStatusCard pack={current} />
      </Section>

      {/* FAQ */}
      {current.faq?.length ? (
        <Section id="faq" icon={ScrollText} eyebrow="Questions" title="Frequently Asked">
          <PackFaq faq={current.faq} />
        </Section>
      ) : null}

      {/* Disclaimer */}
      {current.disclaimer ? (
        <Section id="disclaimer" icon={ScrollText} eyebrow="Legal" title="Disclaimer">
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-6">
            <p className="text-sm leading-relaxed text-neutral-400">{current.disclaimer}</p>
          </div>
        </Section>
      ) : null}

      {/* QR */}
      {qr ? (
        <Section id="qr" icon={QrCode} eyebrow="Verify" title="Scan for Details">
          <div className="flex flex-col items-center gap-5 rounded-2xl border border-neutral-800 bg-neutral-950/50 p-8 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qr || '/placeholder.svg'}
              alt={`QR code linking to ${current.runId} production details`}
              className="h-48 w-48 rounded-xl border border-neutral-800"
            />
            <p className="max-w-sm text-sm text-neutral-400">
              Scan for current production details for{' '}
              <span className="font-medium text-neutral-200">{current.runId}</span>.
            </p>
          </div>
        </Section>
      ) : null}

      {/* Archive */}
      {otherPacks.length ? (
        <Section id="archive" icon={Layers} eyebrow="The Vault" title="Other Production Runs">
          <ArchiveGrid packs={otherPacks} currentId={current.id} onSelect={selectPack} />
        </Section>
      ) : null}
    </>
  );
}

function ChaseRow({ label, value, highlight = false }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <dt className="text-xs uppercase tracking-[0.16em] text-neutral-500">{label}</dt>
      <dd className={`text-right text-sm font-medium ${highlight ? 'text-amber-300' : 'text-neutral-100'}`}>
        {value || '—'}
      </dd>
    </div>
  );
}
