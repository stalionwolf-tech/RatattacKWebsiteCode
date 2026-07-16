'use client';
import { motion } from 'framer-motion';

export function LetterboxBars() {
  return (
    <>
      <motion.div
        initial={{ y: '-100%' }}
        animate={{ y: 0 }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
        className="fixed top-0 inset-x-0 h-8 md:h-12 bg-black z-40 pointer-events-none"
        style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.9)' }}
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
        className="fixed bottom-0 inset-x-0 h-8 md:h-12 bg-black z-40 pointer-events-none"
        style={{ boxShadow: '0 -6px 20px rgba(0,0,0,0.9)' }}
      />
    </>
  );
}

export function FilmGrain() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[45] pointer-events-none opacity-[0.09] mix-blend-overlay"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        animation: 'grain 0.6s steps(5) infinite',
      }}
    />
  );
}

export function Scanlines() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[46] pointer-events-none opacity-[0.05]"
      style={{
        backgroundImage:
          'repeating-linear-gradient(0deg, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 1px, transparent 1px, transparent 3px)',
      }}
    />
  );
}
