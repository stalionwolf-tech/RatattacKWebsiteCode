'use client';
import { motion } from 'framer-motion';
import { MessageCircle, Users, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeader } from './SectionHeader';

const PERKS = [
  { icon: Users, label: 'Active Community' },
  { icon: Zap, label: 'Live Squad-Ups' },
  { icon: Shield, label: 'Loot & Giveaways' },
];

export function CommunitySection() {
  return (
    <section id="community" className="relative py-24 md:py-32 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1508925831690-f33f79533e7c?crop=entropy&cs=srgb&fm=jpg&q=85')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
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
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto glass-panel rounded-2xl p-8 md:p-12 relative overflow-hidden"
        >
          {/* Decorative glow */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-red-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl" />

          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/50 border border-red-800/50 mb-5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs uppercase tracking-widest text-neutral-300 font-cinzel">Online • Active Now</span>
              </div>
              <h3 className="font-cinzel text-3xl md:text-4xl font-bold text-white mb-4">
                Enter the <span className="text-red-500 text-glow">Rat's Nest</span>
              </h3>
              <p className="text-neutral-400 mb-6 leading-relaxed">
                A gathering hall for goblins, knights, and everyone in between. Voice channels, LFG for extractions, patch talk, giveaways, and a memes shrine.
              </p>
              <div className="space-y-2 mb-8">
                {PERKS.map((p) => (
                  <div key={p.label} className="flex items-center gap-3 text-neutral-300">
                    <p.icon className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span className="text-sm">{p.label}</span>
                  </div>
                ))}
              </div>
              <Button
                asChild
                size="lg"
                className="btn-glow-red bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 h-13 px-8 border border-red-900 glow-red animate-pulse-glow"
              >
                <a href="https://discord.gg/ratattack" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5 mr-2" /> Join the Discord
                </a>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { num: '4.2K', label: 'Members' },
                { num: '380', label: 'Online' },
                { num: '24/7', label: 'Chatter' },
                { num: '∞', label: 'Cursed Loot' },
              ].map((s) => (
                <div key={s.label} className="text-center p-5 rounded-lg border border-red-900/30 bg-black/40 backdrop-blur-sm">
                  <div className="font-cinzel text-3xl md:text-4xl font-black text-white text-glow mb-1">{s.num}</div>
                  <div className="text-xs uppercase tracking-widest text-neutral-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
