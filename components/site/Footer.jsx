'use client';
import { motion } from 'framer-motion';
import { Youtube, MessageCircle, Twitch, Twitter, Instagram, Github } from 'lucide-react';
import { Logo } from './Logo';

const SOCIALS = [
  { icon: Youtube, href: 'https://www.youtube.com/channel/UCro3AjNRHR1Jbd-P2IVztFA?sub_confirmation=1', label: 'YouTube', color: 'hover:text-red-500' },
  { icon: MessageCircle, href: 'https://discord.gg/ratattack', label: 'Discord', color: 'hover:text-indigo-400' },
  { icon: Twitch, href: 'https://twitch.tv/RatAttacK', label: 'Twitch', color: 'hover:text-purple-400' },
  { icon: Twitter, href: 'https://twitter.com/RatAttacK', label: 'Twitter', color: 'hover:text-sky-400' },
  { icon: Instagram, href: 'https://instagram.com/RatAttacK', label: 'Instagram', color: 'hover:text-pink-400' },
  { icon: Github, href: 'https://github.com/', label: 'GitHub', color: 'hover:text-white' },
];

const FOOTER_LINKS = {
  Explore: [
    { label: 'Videos', href: '#videos' },
    { label: 'About', href: '#about' },
    { label: 'Community', href: '#community' },
  ],
  Shop: [
    { label: 'Pokémon TCG', href: '#tcg' },
    { label: 'Merch', href: '#merch' },
  ],
  Connect: [
    { label: 'Discord', href: 'https://discord.gg/ratattack' },
    { label: 'YouTube', href: 'https://www.youtube.com/channel/UCro3AjNRHR1Jbd-P2IVztFA?sub_confirmation=1' },
    { label: 'Contact', href: '#contact' },
  ],
};

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-red-900/30">
      {/* Animated red glow bar */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-600 to-transparent">
        <motion.div
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          className="h-full w-1/3 bg-gradient-to-r from-transparent via-red-400 to-transparent shadow-[0_0_20px_rgba(220,38,38,0.9)]"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(220,38,38,0.1),transparent_70%)]" />

      <div className="container mx-auto px-6 py-14 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-4">
            <Logo size="lg" />
            <p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
              Funny, high-quality dark fantasy gaming content. Extraction shooters, survival, and multiplayer chaos.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {SOCIALS.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  whileHover={{ y: -3, scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                  className={`w-10 h-10 rounded-lg glass-panel flex items-center justify-center text-neutral-400 ${s.color} transition-colors border border-neutral-800 hover:border-red-700/60`}
                >
                  <s.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-cinzel text-sm uppercase tracking-widest text-red-500 mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target={l.href.startsWith('http') ? '_blank' : undefined}
                      rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-neutral-400 hover:text-red-400 text-sm transition-colors"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-neutral-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} RatAttacK. All raids reserved.
          </p>
          <p className="text-xs text-neutral-600 font-cinzel tracking-widest uppercase">
            ✦ Forged in Darkness ✦
          </p>
        </div>
      </div>
    </footer>
  );
}
