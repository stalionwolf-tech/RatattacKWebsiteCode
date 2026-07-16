'use client';
import { motion } from 'framer-motion';
import { Youtube, MessageCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from './Logo';

export function HeroSection() {
  return (
    <section id="top" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1657868674989-4061c2d335fb?crop=entropy&cs=srgb&fm=jpg&q=85')",
        }}
      />
      {/* Dark overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/85 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.18)_0%,transparent_60%)]" />
      <div className="absolute inset-0 animated-gradient opacity-40" />

      {/* Vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_180px_80px_rgba(0,0,0,0.9)] pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="flex flex-col items-center"
        >
          {/* Big logo */}
          <div className="mb-8 animate-float">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="w-20 h-20 md:w-28 md:h-28 relative flex items-center justify-center rounded-xl bg-gradient-to-br from-red-900 via-red-700 to-red-950 border-2 border-red-800/80 glow-red-strong">
                <svg viewBox="0 0 64 64" className="w-3/4 h-3/4 text-red-50 drop-shadow-[0_0_8px_rgba(0,0,0,0.9)]" fill="currentColor">
                  <path d="M32 6c-9 0-16 6.5-16 15 0 4 1.6 7.4 4.2 9.9-.7 1.6-1.2 3.3-1.2 5.1 0 5 3.5 9 8 9.7v3.6c0 1.7 1.4 3.2 3.2 3.2h3.6c1.7 0 3.2-1.4 3.2-3.2v-3.6c4.5-.8 8-4.7 8-9.7 0-1.8-.5-3.5-1.2-5.1C46.4 28.4 48 25 48 21c0-8.5-7-15-16-15zm-8 20a2.5 2.5 0 110-5 2.5 2.5 0 010 5zm16 0a2.5 2.5 0 110-5 2.5 2.5 0 010 5zM32 34c-2 0-3.5-1-3.5-2.2S30 29.6 32 29.6s3.5 1 3.5 2.2S34 34 32 34z"/>
                </svg>
              </div>
            </div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="font-cinzel font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-wider leading-none"
          >
            <span className="text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)]">Rat</span>
            <span className="gradient-text text-glow">AttacK</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="divider-ornate mt-6 max-w-xl mx-auto w-full"
          >
            <span className="text-red-500">✦</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="mt-6 max-w-2xl text-lg md:text-xl text-neutral-300 font-light leading-relaxed px-4"
          >
            Chaotic raids. Cursed loot. Cheap deaths and cheaper laughs.
            <br className="hidden md:block" />
            <span className="text-neutral-400">The dark fantasy gaming horde starts here.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              asChild
              size="lg"
              className="btn-glow-red group h-14 px-8 text-base bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-900 text-white glow-red animate-pulse-glow"
            >
              <a href="https://youtube.com/@RatAttacK" target="_blank" rel="noopener noreferrer">
                <Youtube className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Watch on YouTube
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="btn-glow-red group h-14 px-8 text-base bg-black/40 border-2 border-red-800/60 hover:bg-red-950/40 hover:border-red-600 text-white backdrop-blur-sm"
            >
              <a href="https://discord.gg/ratattack" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Join the Discord
              </a>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-red-500/70"
            >
              <ChevronDown className="w-8 h-8" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
