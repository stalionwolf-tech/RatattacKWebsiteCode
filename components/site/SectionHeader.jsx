'use client';
import { motion } from 'framer-motion';

export function SectionHeader({ eyebrow, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
      className="text-center max-w-3xl mx-auto mb-14 relative"
    >
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, letterSpacing: '0.6em' }}
          whileInView={{ opacity: 1, letterSpacing: '0.4em' }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-red-500 tracking-[0.4em] text-xs font-semibold uppercase mb-4 font-cinzel"
        >
          ✦ {eyebrow} ✦
        </motion.div>
      )}
      <h2 className="font-cinzel text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-wide relative inline-block">
        {title}
        <motion.span
          initial={{ x: '-110%', opacity: 0 }}
          whileInView={{ x: '110%', opacity: [0, 1, 0] }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, delay: 0.4, ease: 'easeInOut' }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.35) 50%, transparent 60%)',
            mixBlendMode: 'overlay',
          }}
        />
      </h2>
      <div className="divider-ornate max-w-sm mx-auto w-full mb-6">
        <span className="text-red-500/80">◆</span>
      </div>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-neutral-400 text-base md:text-lg leading-relaxed"
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}
