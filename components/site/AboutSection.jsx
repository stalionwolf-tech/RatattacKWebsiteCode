'use client';
import { motion } from 'framer-motion';
import { Skull, Swords, Ghost, Users } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

const STATS = [
  { icon: Swords, label: 'Extraction Shooters', desc: 'Tarkov, Hunt: Showdown, The Cycle' },
  { icon: Skull, label: 'Dark Fantasy', desc: 'Dark and Darker, Elden Ring, Diablo' },
  { icon: Ghost, label: 'Survival Games', desc: 'DayZ, Rust, Project Zomboid' },
  { icon: Users, label: 'Multiplayer Chaos', desc: 'Squad ops & pure mayhem' },
];

export function AboutSection() {
  return (
    <section id="about" className="relative py-24 md:py-32 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1599425556060-4722189c0062?crop=entropy&cs=srgb&fm=jpg&q=85')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.08),transparent_60%)]" />

      <div className="container mx-auto px-6 relative z-10">
        <SectionHeader eyebrow="The Legend" title="About RatAttacK" />

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-5"
          >
            <p className="text-lg md:text-xl text-neutral-300 leading-relaxed">
              RatAttacK creates <span className="text-red-400 font-semibold">funny, high‑quality gaming content</span> forged in the fires of chaos.
            </p>
            <p className="text-base text-neutral-400 leading-relaxed">
              I dive into the darkest corners of <span className="text-white">Dark and Darker</span>, hustle for gear in <span className="text-white">Escape from Tarkov</span>, ambush unsuspecting knights in extraction shooters, scavenge through survival games, and get into unhinged squad ops across every multiplayer arena I can find.
            </p>
            <p className="text-base text-neutral-400 leading-relaxed">
              Expect cinematic edits, questionable tactics, and belly laughs. Sub in, sharpen your dagger, and join the horde.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {['Cinematic Edits', 'Funny Moments', 'Solo & Squad', 'Weekly Uploads'].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 text-xs uppercase tracking-wider bg-red-950/50 border border-red-900/60 text-red-300 rounded-full backdrop-blur-sm"
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
            transition={{ duration: 0.7 }}
            className="grid grid-cols-2 gap-4"
          >
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                whileHover={{ y: -4, borderColor: 'rgba(220,38,38,0.6)' }}
                transition={{ duration: 0.3 }}
                className="glass-panel rounded-lg p-5 hover:glow-red group cursor-default"
              >
                <s.icon className="w-8 h-8 text-red-500 mb-3 group-hover:scale-110 transition-transform" />
                <div className="font-cinzel font-semibold text-white text-sm md:text-base mb-1">{s.label}</div>
                <div className="text-xs text-neutral-500 leading-snug">{s.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
