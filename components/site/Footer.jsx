'use client';
import { motion } from 'framer-motion';
import { Youtube, MessageCircle, Twitch, Twitter, Instagram, Github, Mail, ArrowUp } from 'lucide-react';
import { Logo } from './Logo';
import { SITE_CONFIG } from '@/lib/config';

// Inline TikTok icon (lucide-react has no TikTok glyph).
const TiktokIcon = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.72a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.15Z"/>
  </svg>
);

const ALL_SOCIALS = [
  { Icon: Youtube,       href: SITE_CONFIG.youtube,   label: 'YouTube',   color: 'hover:text-red-500' },
  { Icon: MessageCircle, href: SITE_CONFIG.discord,   label: 'Discord',   color: 'hover:text-indigo-400' },
  { Icon: Twitch,        href: SITE_CONFIG.twitch,    label: 'Twitch',    color: 'hover:text-purple-400' },
  { Icon: Twitter,       href: SITE_CONFIG.twitter,   label: 'Twitter',   color: 'hover:text-sky-400' },
  { Icon: Instagram,     href: SITE_CONFIG.instagram, label: 'Instagram', color: 'hover:text-pink-400' },
  { Icon: TiktokIcon,    href: SITE_CONFIG.tiktok,    label: 'TikTok',    color: 'hover:text-white' },
  { Icon: Github,        href: SITE_CONFIG.github,    label: 'GitHub',    color: 'hover:text-white' },
];
const SOCIALS = ALL_SOCIALS.filter((s) => !!s.href);

const NAV_LINKS = [
  { label: 'Home',      href: '/#top' },
  { label: 'Videos',    href: '/#videos' },
  { label: 'Store',     href: '/store' },
  { label: 'Community', href: '/#community' },
  { label: 'About',     href: '/#about' },
  { label: 'Contact',   href: '/#contact' },
];

const CONNECT_LINKS = [
  { label: 'YouTube', href: SITE_CONFIG.youtube, external: true },
  { label: 'Discord', href: SITE_CONFIG.discord, external: true },
  { label: 'Email',   href: `mailto:${SITE_CONFIG.email}`, external: false },
];

function BackToTop() {
  return (
    <motion.button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      whileHover={{ y: -3, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400 }}
      aria-label="Back to top"
      className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-panel border border-red-900/60 hover:border-red-600/80 text-neutral-200 hover:text-white transition-premium"
    >
      <ArrowUp className="w-4 h-4 text-red-500 group-hover:-translate-y-0.5 transition-transform" />
      <span className="font-cinzel tracking-[0.3em] uppercase text-[10px]">Back to Top</span>
    </motion.button>
  );
}

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

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-neutral-950/80 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(220,38,38,0.1),transparent_70%)]" />

      <div className="container mx-auto px-6 pt-16 pb-8 relative z-10">
        {/* Back to top ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-14"
        >
          <BackToTop />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2 space-y-5"
          >
            <Logo size="lg" />
            <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-md">
              RatAttacK creates cinematic gaming content, competitive gameplay, and an active community built around great games, unforgettable moments, and the love of collecting.
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
                  <s.Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <h4 className="font-cinzel text-sm uppercase tracking-[0.3em] text-red-500 mb-5">Navigation</h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="relative inline-block text-neutral-400 hover:text-white text-sm transition-colors group"
                  >
                    <span className="relative z-10">{l.label}</span>
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-red-500 group-hover:w-full transition-all duration-500 shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Connect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h4 className="font-cinzel text-sm uppercase tracking-[0.3em] text-red-500 mb-5">Connect</h4>
            <ul className="space-y-3">
              {CONNECT_LINKS.filter((l) => !!l.href && !l.href.endsWith(':')).map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target={l.external ? '_blank' : undefined}
                    rel={l.external ? 'noopener noreferrer' : undefined}
                    className="relative inline-block text-neutral-400 hover:text-white text-sm transition-colors group"
                  >
                    <span className="relative z-10">{l.label}</span>
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-red-500 group-hover:w-full transition-all duration-500 shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                  </a>
                </li>
              ))}
              {/* Future social placeholders — shown greyed-out when not configured */}
              {['Twitter', 'Instagram', 'TikTok'].filter((name) => {
                const key = name.toLowerCase();
                return !SITE_CONFIG[key];
              }).map((name) => (
                <li key={name} className="text-neutral-600 text-sm italic">{name} — soon</li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="mt-14 pt-6 border-t border-neutral-900/80">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-neutral-500 order-2 md:order-1">
              © {new Date().getFullYear()} RatAttacK. All Rights Reserved.
            </p>
            <div className="flex items-center gap-6 order-1 md:order-2">
              <a href="#privacy" className="text-xs text-neutral-500 hover:text-red-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="text-xs text-neutral-500 hover:text-red-400 transition-colors">
                Terms of Service
              </a>
              <div className="hidden md:block text-xs text-neutral-700 font-cinzel tracking-[0.3em] uppercase">
                ✦ Forged in Darkness ✦
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
