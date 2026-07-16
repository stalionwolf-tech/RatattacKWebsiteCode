'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeader } from './SectionHeader';
import { IconShield, IconChalice, IconSwords, IconRaven } from './MedievalIcons';
import { SITE_CONFIG, DISCORD_INVITE_URL } from '@/lib/config';

const FEATURES = [
  {
    Icon: IconShield,
    title: 'Squad Up',
    desc: 'Find teammates for extraction shooters, survival games, and multiplayer adventures.',
  },
  {
    Icon: IconChalice,
    title: 'Community Giveaways',
    desc: 'Win Pokémon products, RatAttacK merch, and exclusive community rewards.',
  },
  {
    Icon: IconSwords,
    title: 'Gaming Events',
    desc: 'Participate in tournaments, game nights, community challenges, and special events.',
  },
  {
    Icon: IconRaven,
    title: 'Behind the Scenes',
    desc: 'Get early access to videos, announcements, sneak peeks, and development updates.',
  },
];

// Same live-widget hook logic (kept small, no design change).
function useDiscordWidget() {
  const [state, setState] = useState({ loading: true, ok: false, presence: null, invite: null });
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const r = await fetch('/api/discord-widget', { cache: 'no-store' });
        const data = await r.json();
        if (!alive) return;
        if (data.ok) setState({ loading: false, ok: true, presence: data.presence_count, invite: data.instant_invite });
        else setState({ loading: false, ok: false, presence: null, invite: null });
      } catch {
        if (alive) setState({ loading: false, ok: false, presence: null, invite: null });
      }
    };
    load();
    const id = setInterval(load, 60000);
    return () => { alive = false; clearInterval(id); };
  }, []);
  return state;
}

export function CommunitySection() {
  const widget = useDiscordWidget();
  const inviteUrl = widget.invite || DISCORD_INVITE_URL;
  const online = widget.ok && widget.presence != null ? String(widget.presence) : '--';

  return (
    <section id="community" className="relative py-28 md:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(88,101,242,0.08),transparent_60%)]" />

      <div className="container mx-auto px-6 relative z-10">
        <SectionHeader
          eyebrow="Community"
          title="Join the Rat Horde"
          description="More than a Discord server—this is where the Rat Horde gathers. Share clips, squad up for raids, discuss games, show off Pokémon pulls, enter giveaways, and be the first to see new videos, products, and community events."
        />

        {/* Live status pill */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-10"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-red-950/50 border border-red-800/60 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-300 font-cinzel">
              {widget.loading ? (
                <span className="inline-block h-3 w-24 rounded bg-neutral-800 animate-pulse align-middle" />
              ) : (
                <>
                  <span className="text-white font-semibold">{online}</span>
                  <span className="text-neutral-400"> Ratters Online · Active Now</span>
                </>
              )}
            </span>
          </div>
        </motion.div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 max-w-6xl mx-auto">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.19, 1, 0.22, 1] }}
              whileHover={{ y: -6 }}
              className="group glass-panel frame-corners rounded-xl p-6 md:p-7 hover:border-red-600/70 card-lift cursor-default"
            >
              <div className="mb-5 text-red-500 group-hover:text-red-400 transition-premium">
                <f.Icon size={44} />
              </div>
              <h3 className="font-cinzel text-lg md:text-xl font-semibold text-white mb-2 tracking-wide">
                {f.title}
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-center mt-14"
        >
          <Button
            asChild
            size="lg"
            className="btn-glow-red bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 h-16 px-12 border-2 border-red-800 glow-red-strong animate-pulse-glow transition-premium"
          >
            <a href={inviteUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-5 h-5 mr-3" />
              <span className="font-cinzel tracking-[0.25em] uppercase text-sm md:text-base">Join the Rat Horde</span>
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
