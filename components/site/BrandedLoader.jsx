'use client';
import { motion } from 'framer-motion';

/**
 * Reusable branded loading screen.
 * - Uses shared atmosphere layers (fog + embers) already present in the site.
 * - Mascot idle animation: breathing (scale), tail sway (rotate), ear twitch
 *   (rotate + scaleY), random blinking (opacity dip).
 * - Crimson loading bar auto-cycles.
 * - Respects prefers-reduced-motion by falling back to a static portrait.
 */
export function BrandedLoader({ label = 'Loading', fullscreen = true }) {
  const wrapCls = fullscreen
    ? 'fixed inset-0 z-[85] flex items-center justify-center bg-black/85 backdrop-blur-sm'
    : 'w-full py-24 flex items-center justify-center';

  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className={wrapCls}
    >
      {/* Ambient tint layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.15),transparent_60%)] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-6 loader-fade-motion">
        <Mascot />

        <div className="font-cinzel tracking-[0.5em] text-xs uppercase text-neutral-200 text-glow" aria-hidden="true">
          {label}<span className="loader-dots" />
        </div>

        <div className="w-56 h-[3px] rounded-full bg-neutral-900 overflow-hidden relative">
          <div className="loader-bar absolute inset-y-0 left-0 w-1/3 rounded-full bg-gradient-to-r from-red-800 via-red-500 to-red-800 shadow-[0_0_12px_rgba(220,38,38,0.8)]" />
        </div>

        <span className="sr-only">{label}…</span>
      </div>
    </motion.div>
  );
}

function Mascot() {
  return (
    <div className="relative w-28 h-28 loader-mascot">
      {/* Halo glow */}
      <div className="absolute inset-0 rounded-full bg-red-600/40 blur-2xl scale-110 animate-pulse-glow" />
      {/* Ring */}
      <div className="absolute -inset-3 rounded-full border border-dashed border-red-600/40 loader-ring" />

      {/* Container that breathes */}
      <div className="relative w-full h-full rounded-full overflow-visible loader-breath">
        <div className="absolute inset-0 rounded-full overflow-hidden ring-2 ring-red-700/70 shadow-[0_0_30px_rgba(220,38,38,0.55)]">
          <img src="/ratattack-avatar.png" alt="" className="w-full h-full object-cover" />
          {/* Blink overlay (dark bar sweeps) */}
          <div className="loader-blink absolute inset-x-0 top-[42%] h-[10%] bg-black opacity-0" />
        </div>

        {/* Ear twitch (subtle rotate on top edge) */}
        <div className="loader-ear absolute -top-1 left-1/2 w-2 h-2 rounded-full bg-red-700/0" />

        {/* Tail sway (bottom-right protrusion behind the ring) */}
        <div className="loader-tail absolute -right-3 bottom-3 w-10 h-2 origin-left">
          <div className="h-full w-full rounded-full bg-gradient-to-r from-red-950 via-red-800 to-transparent opacity-60" />
        </div>
      </div>
    </div>
  );
}
