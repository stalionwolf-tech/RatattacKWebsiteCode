'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Logo } from '@/components/site/Logo';

/**
 * Shared cinematic split-screen for /login, /signup, /forgot-password, /reset-password.
 * Left = brand pillar (sigil, tagline, animated embers). Right = form.
 */
export function AuthCinematicLayout({ eyebrow, title, subtitle, footerNote, children }) {
  return (
    <div className="min-h-screen bg-black text-neutral-100 relative overflow-hidden">
      {/* Full-page atmospheric backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(220,38,38,0.18),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(120,53,15,0.14),transparent_60%)]" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-screen [background-image:repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.4)_2px,rgba(255,255,255,0.4)_3px)]" />

      <div className="relative z-10 grid lg:grid-cols-2 min-h-screen">
        {/* Left — brand pillar */}
        <aside className="hidden lg:flex flex-col justify-between p-12 border-r border-red-950/50 bg-gradient-to-b from-black via-black to-red-950/20">
          <Link href="/" className="inline-flex items-center gap-3">
            <Logo size="md" />
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-md"
          >
            <div className="text-red-500 tracking-[0.5em] text-[10px] uppercase mb-4 font-cinzel inline-flex items-center gap-2">
              <Sparkles className="w-3 h-3" /> Enter the Horde
            </div>
            <h2 className="font-cinzel text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
              The Vault Awaits Only Those Who Bear the Sigil.
            </h2>
            <p className="text-neutral-400 leading-relaxed">
              Track your pulls, hoard your wishlist, follow every raid. Your Horde profile syncs orders, drops, and community proofs across every screen.
            </p>
          </motion.div>

          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-neutral-600 font-cinzel">
            <span className="w-8 h-px bg-red-900/50" /> RatAttacK TCG
          </div>
        </aside>

        {/* Right — form panel */}
        <main className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <div className="lg:hidden mb-8">
              <Link href="/" className="inline-flex"><Logo size="md" /></Link>
            </div>

            <div className="mb-8">
              {eyebrow ? (
                <div className="text-red-500 tracking-[0.5em] text-[10px] uppercase mb-3 font-cinzel">{eyebrow}</div>
              ) : null}
              <h1 className="font-cinzel text-3xl md:text-4xl font-bold text-white">{title}</h1>
              {subtitle ? <p className="text-neutral-400 mt-2">{subtitle}</p> : null}
            </div>

            <div className="glass-panel frame-corners rounded-xl p-6 md:p-8">{children}</div>

            {footerNote ? <div className="text-center mt-6 text-sm text-neutral-500">{footerNote}</div> : null}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
