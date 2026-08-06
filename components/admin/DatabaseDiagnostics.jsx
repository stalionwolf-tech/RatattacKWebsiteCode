'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Database,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  PlayCircle,
} from 'lucide-react';
import { SignOutButton } from '@/components/admin/SignOutButton';

const STATUS_STYLES = {
  pass: {
    icon: CheckCircle2,
    iconClass: 'text-emerald-400',
    ring: 'border-emerald-800/50 bg-emerald-950/20',
  },
  warn: {
    icon: AlertTriangle,
    iconClass: 'text-amber-400',
    ring: 'border-amber-800/50 bg-amber-950/20',
  },
  fail: {
    icon: XCircle,
    iconClass: 'text-red-400',
    ring: 'border-red-800/60 bg-red-950/30',
  },
};

function statusOf(step) {
  if (!step.pass) return 'fail';
  if (step.warn) return 'warn';
  return 'pass';
}

export function DatabaseDiagnostics({ user }) {
  const [report, setReport] = useState(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState(null);

  async function runDiagnostics() {
    setRunning(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/diagnostics', { method: 'POST' });
      const data = await res.json().catch(() => null);
      if (!data) {
        setError('The diagnostics endpoint returned an unreadable response.');
        setReport(null);
      } else {
        setReport(data);
      }
    } catch (e) {
      setError(e?.message || 'Failed to reach the diagnostics endpoint.');
      setReport(null);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-neutral-800/70 bg-black/40">
        <div className="mx-auto max-w-5xl px-4 md:px-8 py-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-950/60 border border-red-800/60">
            <Database className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <h1 className="font-cinzel text-2xl md:text-3xl font-bold text-white tracking-wide">
              Database Diagnostics
            </h1>
            <p className="text-sm text-neutral-400 mt-0.5">
              Verify the MongoDB connection for the Mystery Pack Manager
            </p>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/admin/packs"
              className="hidden sm:inline-flex h-10 items-center gap-2 rounded-md border border-neutral-700 bg-neutral-950/60 px-3 text-[11px] font-cinzel uppercase tracking-widest text-neutral-200 transition-colors hover:border-red-700 hover:bg-red-950/30"
            >
              <ChevronLeft className="h-4 w-4" /> Pack Manager
            </Link>
            <SignOutButton className="h-10 gap-2 border-neutral-700 bg-neutral-950/60 hover:border-red-700 hover:bg-red-950/30" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 md:px-8 py-6 md:py-8">
        {/* Run bar */}
        <div className="flex flex-col gap-4 rounded-xl border border-neutral-800/70 bg-neutral-950/40 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-cinzel text-sm uppercase tracking-widest text-neutral-300">
              Connection health check
            </p>
            <p className="mt-1 text-sm text-neutral-500">
              Runs environment, DNS, ping, read, write, collection, and latency tests.
            </p>
          </div>
          <button
            type="button"
            onClick={runDiagnostics}
            disabled={running}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-red-800/70 bg-red-950/50 px-5 font-cinzel text-xs uppercase tracking-widest text-red-100 transition-colors hover:border-red-600 hover:bg-red-900/50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {running ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Running…
              </>
            ) : (
              <>
                <PlayCircle className="h-4 w-4" /> Run Diagnostics
              </>
            )}
          </button>
        </div>

        {error ? (
          <div className="mt-6 flex items-start gap-3 rounded-lg border border-red-800/60 bg-red-950/40 px-4 py-3 text-sm text-red-200">
            <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        ) : null}

        {/* Overall summary */}
        {report ? (
          <div
            className={`mt-6 rounded-xl border p-5 ${
              report.success
                ? 'border-emerald-800/50 bg-emerald-950/20'
                : 'border-red-800/60 bg-red-950/30'
            }`}
          >
            <div className="flex items-center gap-3">
              {report.success ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              ) : (
                <XCircle className="h-6 w-6 text-red-400" />
              )}
              <div>
                <p className="font-cinzel text-lg text-white">
                  {report.success
                    ? 'All checks passed'
                    : `${report.failedCount || 1} check(s) failed`}
                </p>
                {report.category ? (
                  <p className="text-sm text-neutral-300">
                    Failure category:{' '}
                    <span className="font-mono text-red-300">{report.category}</span>
                  </p>
                ) : null}
              </div>
            </div>

            {report.recommendation ? (
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-neutral-800 bg-black/30 px-4 py-3 text-sm text-amber-200">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>
                  <span className="font-semibold">Recommended fix: </span>
                  {report.recommendation}
                </p>
              </div>
            ) : null}

            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-xs sm:grid-cols-4">
              <Meta label="Host" value={report.host || '—'} mono />
              <Meta label="Database" value={report.dbName || '—'} mono />
              <Meta label="Driver" value={report.driverVersion || '—'} mono />
              <Meta label="Duration" value={report.durationMs != null ? `${report.durationMs} ms` : '—'} />
            </dl>
          </div>
        ) : null}

        {/* Step results */}
        {report?.steps?.length ? (
          <ul className="mt-6 space-y-3">
            {report.steps.map((s) => {
              const status = statusOf(s);
              const cfg = STATUS_STYLES[status];
              const Icon = cfg.icon;
              return (
                <li
                  key={s.id}
                  className={`rounded-lg border px-4 py-3 ${cfg.ring}`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${cfg.iconClass}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-cinzel text-sm uppercase tracking-wide text-neutral-100">
                          {s.label}
                        </p>
                        {s.category ? (
                          <span className="rounded bg-black/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-red-300">
                            {s.category}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 break-words text-sm text-neutral-300">{s.info}</p>
                      {s.recommendation ? (
                        <p className="mt-1 text-xs text-amber-200/90">
                          Fix: {s.recommendation}
                        </p>
                      ) : null}
                      {s.details ? (
                        <p className="mt-1 break-words font-mono text-[11px] text-neutral-500">
                          {s.details}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : null}

        {!report && !running && !error ? (
          <p className="mt-8 text-center text-sm text-neutral-500">
            Click <span className="text-neutral-300">Run Diagnostics</span> to test the MongoDB connection.
          </p>
        ) : null}
      </main>
    </div>
  );
}

function Meta({ label, value, mono }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-widest text-neutral-500">{label}</dt>
      <dd className={`mt-0.5 truncate text-neutral-200 ${mono ? 'font-mono' : ''}`}>{value}</dd>
    </div>
  );
}
