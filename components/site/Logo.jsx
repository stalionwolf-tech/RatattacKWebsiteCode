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
        className={`${s.box} relative flex items-center justify-center rounded-full overflow-hidden ring-2 ring-red-700/70 shadow-[0_0_20px_rgba(220,38,38,0.5)]`}
      >
        <img
          src="/ratattack-avatar.png"
          alt="RatAttacK"
          className="w-full h-full object-cover"
        />
      </motion.div>
      {showText && (
        <div className={`${s.text} font-cinzel font-black tracking-widest leading-none`}>
          <span className="text-white">Rat</span><span className="text-red-500 text-glow">AttacK</span>
        </div>
      )}
    </div>
  );
}
