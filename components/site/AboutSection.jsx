'use client';
import { motion } from 'framer-motion';
import { SectionHeader } from './SectionHeader';
import { IconSwords, IconSkull, IconGhost, IconHorde } from './MedievalIcons';

const STATS = [
  { Icon: IconSwords, label: 'Extraction Shooters', desc: 'Tarkov, Hunt: Showdown, The Cycle' },
  { Icon: IconSkull, label: 'Dark Fantasy', desc: 'Dark and Darker, Elden Ring, Diablo' },
  { Icon: IconGhost, label: 'Survival Games', desc: 'DayZ, Rust, Project Zomboid' },
  { Icon: IconHorde, label: 'Multiplayer Chaos', desc: 'Squad ops & pure mayhem' },
];

export function AboutSection() {
  return (
    <section id="about" className="relative py-28 md:py-40 overflow-hidden">
      {/* Softly darkened so the scrolling pixel-art backdrop shows through */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.08),transparent_60%)]" />

      <div className="container mx-auto px-6 relative z-10">
        <SectionHeader eyebrow="The Legend" title="About RatAttacK" />

        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
            className="space-y-6"
          >
            <p className="text-xl md:text-2xl text-neutral-200 leading-relaxed font-light">
              <span className="font-cinzel text-6xl md:text-7xl text-red-500 float-left leading-none mr-3 mt-1 text-glow">R</span>
              atAttacK creates <span className="text-red-400 font-medium">funny, high‑quality gaming content</span> forged in the fires of chaos.
            </p>
            <p className="text-base md:text-lg text-neutral-400 leading-loose">
              I dive into the darkest corners of <span className="text-white font-medium">Dark and Darker</span>, hustle for gear in <span className="text-white font-medium">Escape from Tarkov</span>, ambush unsuspecting knights in extraction shooters, scavenge through survival games, and get into unhinged squad ops across every multiplayer arena I can find.
            </p>
            <p className="text-base md:text-lg text-neutral-400 leading-loose">
              Expect cinematic edits, questionable tactics, and belly laughs. Sub in, sharpen your dagger, and join the horde.
            </p>

            <div className="flex flex-wrap gap-2 pt-4">
              {['Cinematic Edits', 'Funny Moments', 'Solo & Squad', 'Weekly Uploads'].map((tag) => (
                <span
                  key={tag}
                  className="px-3.5 py-1.5 text-[11px] uppercase tracking-[0.2em] bg-red-950/40 border border-red-900/60 text-red-300 rounded-full backdrop-blur-sm font-cinzel hover:bg-red-900/50 hover:border-red-700 transition-premium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
            className="grid grid-cols-2 gap-4 md:gap-5"
          >
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.19, 1, 0.22, 1] }}
                whileHover={{ y: -6 }}
                className="group glass-panel frame-corners rounded-lg p-6 hover:border-red-600/70 card-lift cursor-default"
              >
                <div className="mb-4 text-red-500 group-hover:text-red-400 transition-premium">
                  <s.Icon size={44} />
                </div>
                <div className="font-cinzel font-semibold text-white text-sm md:text-base mb-1.5 tracking-wide">{s.label}</div>
                <div className="text-[11px] md:text-xs text-neutral-500 leading-relaxed uppercase tracking-wider">{s.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
