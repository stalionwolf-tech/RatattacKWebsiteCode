'use client';
import { motion } from 'framer-motion';

export function Logo({ size = 'md', showText = true }) {
  const sizes = {
    sm: { box: 'w-9 h-9', text: 'text-lg' },
    md: { box: 'w-11 h-11', text: 'text-xl' },
    lg: { box: 'w-14 h-14', text: 'text-2xl' },
  };
  const s = sizes[size];
  return (
    <div className="flex items-center gap-3">
      <motion.div
        whileHover={{ rotate: -8, scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300 }}
        className={`${s.box} relative flex items-center justify-center rounded-md bg-gradient-to-br from-red-900 via-red-700 to-red-950 border border-red-800/70 shadow-[0_0_20px_rgba(220,38,38,0.4)]`}
      >
        <svg viewBox="0 0 64 64" className="w-3/4 h-3/4 text-red-100 drop-shadow-[0_0_6px_rgba(0,0,0,0.8)]" fill="currentColor" aria-hidden="true">
          {/* Stylized rat skull + crossed blades */}
          <path d="M32 6c-9 0-16 6.5-16 15 0 4 1.6 7.4 4.2 9.9-.7 1.6-1.2 3.3-1.2 5.1 0 5 3.5 9 8 9.7v3.6c0 1.7 1.4 3.2 3.2 3.2h3.6c1.7 0 3.2-1.4 3.2-3.2v-3.6c4.5-.8 8-4.7 8-9.7 0-1.8-.5-3.5-1.2-5.1C46.4 28.4 48 25 48 21c0-8.5-7-15-16-15zm-8 20a2.5 2.5 0 110-5 2.5 2.5 0 010 5zm16 0a2.5 2.5 0 110-5 2.5 2.5 0 010 5zM32 34c-2 0-3.5-1-3.5-2.2S30 29.6 32 29.6s3.5 1 3.5 2.2S34 34 32 34z"/>
          <path d="M9 55l5-5 3 3-5 5-3-3zm46 0l-5-5-3 3 5 5 3-3z" opacity="0.85"/>
        </svg>
      </motion.div>
      {showText && (
        <div className={`${s.text} font-cinzel font-black tracking-widest leading-none`}>
          <span className="text-white">Rat</span><span className="text-red-500 text-glow">AttacK</span>
        </div>
      )}
    </div>
  );
}
