'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function CinematicIntro() {
  const [phase, setPhase] = useState(0); // 0: black, 1: title, 2: fade out, 3: gone

  useEffect(() => {
    // Only play once per session
    if (typeof window !== 'undefined' && sessionStorage.getItem('ratattack_intro_played')) {
      setPhase(3);
      return;
    }
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 2400);
    const t3 = setTimeout(() => {
      setPhase(3);
      try { sessionStorage.setItem('ratattack_intro_played', '1'); } catch {}
    }, 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <AnimatePresence>
      {phase < 3 && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: phase >= 2 ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden pointer-events-none"
        >
          {/* Radial ambience */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(120,20,20,0.35)_0%,transparent_60%)]" />

          {/* Red flash */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 1 ? [0, 0.6, 0] : 0 }}
            transition={{ duration: 0.6, times: [0, 0.15, 1] }}
            className="absolute inset-0 bg-red-700"
          />

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, scale: 1.2, letterSpacing: '0.3em' }}
            animate={{
              opacity: phase >= 1 ? 1 : 0,
              scale: phase >= 1 ? 1 : 1.2,
              letterSpacing: phase >= 1 ? '0.08em' : '0.3em',
            }}
            transition={{ duration: 1.6, ease: [0.19, 1, 0.22, 1] }}
            className="relative z-10 text-center flex flex-col items-center"
          >
            {/* Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.4, rotate: -20 }}
              animate={{ opacity: phase >= 1 ? 1 : 0, scale: phase >= 1 ? 1 : 0.4, rotate: 0 }}
              transition={{ duration: 1.4, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
              className="relative w-28 h-28 md:w-36 md:h-36 mb-6"
            >
              <div className="absolute inset-0 rounded-full bg-red-600/50 blur-2xl scale-125" />
              <div className="relative w-full h-full rounded-full overflow-hidden ring-4 ring-red-700 shadow-[0_0_60px_rgba(220,38,38,0.8)]">
                <img src="/ratattack-avatar.png" alt="RatAttacK" className="w-full h-full object-cover" />
              </div>
            </motion.div>

            <div className="text-red-500 tracking-[0.5em] text-[10px] md:text-xs uppercase font-cinzel mb-4 opacity-80">
              A RatAttacK Presentation
            </div>
            <div className="font-cinzel text-6xl md:text-8xl font-black text-white text-glow relative">
              <span className="text-white">Rat</span><span className="text-red-500">AttacK</span>
              {/* sheen */}
              <motion.div
                initial={{ x: '-120%' }}
                animate={{ x: phase >= 1 ? '120%' : '-120%' }}
                transition={{ duration: 1.8, delay: 0.6, ease: 'easeInOut' }}
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.35) 50%, transparent 60%)',
                  mixBlendMode: 'overlay',
                }}
              />
            </div>
          </motion.div>

          {/* Vignette */}
          <div className="absolute inset-0 shadow-[inset_0_0_240px_120px_rgba(0,0,0,1)] pointer-events-none" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
