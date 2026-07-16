'use client';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeader } from './SectionHeader';
import { IconHorde, IconBolt, IconShield } from './MedievalIcons';
import { SITE_CONFIG } from '@/lib/config';

const PERKS = [
  { Icon: IconHorde, label: 'Active Community' },
  { Icon: IconBolt, label: 'Live Squad-Ups' },
  { Icon: IconShield, label: 'Loot & Giveaways' },
];

export function CommunitySection() {
  return (
    <section id="community" className="relative py-28 md:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(88,101,242,0.08),transparent_60%)]" />

      <div className="container mx-auto px-6 relative z-10">
        <SectionHeader
          eyebrow="The Horde"
          title="Join the Discord"
          description="Squad up. Trade loot rumors. Suffer together. Rise together. The Discord is where the raids get planned and the memes get born."
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
          className="max-w-5xl mx-auto glass-panel frame-corners rounded-2xl p-8 md:p-14 relative overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-red-600/20 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl" />

          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/60 border border-red-800/50 mb-6">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-300 font-cinzel">Online • Active Now</span>
              </div>
              <h3 className="font-cinzel text-3xl md:text-5xl font-bold text-white mb-5 leading-tight">
                Enter the <span className="text-red-500 text-glow">Rat's Nest</span>
              </h3>
              <p className="text-neutral-400 mb-8 leading-loose text-base md:text-lg">
                A gathering hall for goblins, knights, and everyone in between. Voice channels, LFG for extractions, patch talk, giveaways, and a memes shrine.
              </p>
              <div className="space-y-3 mb-10">
                {PERKS.map((p) => (
                  <div key={p.label} className="flex items-center gap-4 text-neutral-200 group">
                    <div className="w-9 h-9 rounded-md flex items-center justify-center bg-red-950/50 border border-red-900/60 text-red-500 group-hover:border-red-600 group-hover:text-red-400 transition-premium">
                      <p.Icon size={20} />
                    </div>
                    <span className="text-sm md:text-base font-medium">{p.label}</span>
                  </div>
                ))}
              </div>
              <Button
                asChild
                size="lg"
                className="btn-glow-red bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 h-14 px-10 border border-red-900 glow-red animate-pulse-glow transition-premium"
              >
                <a href={SITE_CONFIG.discord} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5 mr-3" />
                  <span className="font-cinzel tracking-widest uppercase text-sm">Join the Discord</span>
                </a>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { num: '4.2K', label: 'Members' },
                { num: '380', label: 'Online' },
                { num: '24/7', label: 'Chatter' },
                { num: '∞', label: 'Cursed Loot' },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-6 rounded-lg border border-red-900/40 bg-black/50 backdrop-blur-sm hover:border-red-700 transition-premium"
                >
                  <div className="font-cinzel text-3xl md:text-5xl font-black text-white text-glow mb-2 leading-none">{s.num}</div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-cinzel">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
