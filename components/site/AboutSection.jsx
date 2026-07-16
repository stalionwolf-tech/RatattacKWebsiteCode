'use client';
import { motion } from 'framer-motion';
import { SectionHeader } from './SectionHeader';
import { IconSwords, IconSkull, IconGhost, IconHorde } from './MedievalIcons';

const STATS = [
  { Icon: IconSwords, label: 'Extraction Shooters', desc: 'Escape from Tarkov · ARC Raiders · Hunt: Showdown · The next great extraction shooter' },
  { Icon: IconSkull, label: 'Dark Fantasy', desc: 'Dark and Darker · Elden Ring · Soulslikes & RPG Adventures' },
  { Icon: IconGhost, label: 'Survival Games', desc: 'Rust · DayZ · Project Zomboid · Open-world survival' },
  { Icon: IconHorde, label: 'Multiplayer Chaos', desc: 'Co-op Disasters · Clutch Moments · Questionable Decisions' },
];

export function AboutSection() {
  return (
    <section id="about" className="relative py-28 md:py-40 overflow-hidden">
      {/* Softly darkened so the scrolling pixel-art backdrop shows through */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.08),transparent_60%)]" />

      <div className="container mx-auto px-6 relative z-10">
        <SectionHeader eyebrow="Enter the Warren" title="About RatAttacK" />

        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
            className="space-y-6"
          >
            <p className="text-xl md:text-2xl text-neutral-200 leading-relaxed font-light">
              RatAttacK creates <span className="text-red-400 font-medium">unhinged &amp; adult-rated, story-driven gaming content</span> that blends high-skill gameplay, dark humor, and unforgettable moments. Every video is carefully edited to turn ordinary matches into entertaining stories filled with clutch plays, hilarious failures, and complete chaos.
            </p>
            <p className="text-base md:text-lg text-neutral-400 leading-loose">
              Whether I'm diving into the dungeons of <span className="text-white font-medium">Dark and Darker</span>, surviving the brutal world of <span className="text-white font-medium">Escape from Tarkov</span>, exploring the newest extraction shooters, or getting into ridiculous situations with friends, the goal is always the same: create videos that are genuinely fun to watch&mdash;not just gameplay.
            </p>
            <p className="text-base md:text-lg text-neutral-400 leading-loose">
              If you're here for cinematic edits, memorable moments, and a community that doesn't take itself too seriously, welcome to the <span className="text-red-400 font-medium">Rat Horde</span>.
            </p>

            <div className="flex flex-wrap gap-2 pt-4">
              {['Cinematic Edits', 'High-Skill Gameplay', 'Unhinged Comedy', 'Community Driven'].map((tag) => (
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
