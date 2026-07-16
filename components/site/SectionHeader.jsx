'use client';
import { motion } from 'framer-motion';

export function SectionHeader({ eyebrow, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7 }}
      className="text-center max-w-3xl mx-auto mb-14"
    >
      {eyebrow && (
        <div className="text-red-500 tracking-[0.4em] text-xs font-semibold uppercase mb-4 font-cinzel">
          ✦ {eyebrow} ✦
        </div>
      )}
      <h2 className="font-cinzel text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-wide">
        {title}
      </h2>
      <div className="divider-ornate max-w-sm mx-auto w-full mb-6">
        <span className="text-red-500/80">◆</span>
      </div>
      {description && (
        <p className="text-neutral-400 text-base md:text-lg leading-relaxed">{description}</p>
      )}
    </motion.div>
  );
}
