'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IconPlay, IconChevronDown } from './MedievalIcons';
import { YOUTUBE_CHANNEL_URL, DISCORD_URL } from '@/lib/constants';

export function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.2]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-20 pb-24"
    >
      {/* Parallax bg with ken-burns */}
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1657868674989-4061c2d335fb?crop=entropy&cs=srgb&fm=jpg&q=90&w=2400')",
            filter: 'contrast(1.15) brightness(0.55) saturate(0.9)',
          }}
        />
        {/* Slow drift ken-burns */}
        <motion.div
          initial={{ scale: 1.05 }}
          animate={{ scale: 1.18 }}
          transition={{ duration: 22, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
          className="absolute inset-0"
        />
      </motion.div>

      {/* God rays SVG */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full opacity-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.25, 0.5, 0.25] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <defs>
            <linearGradient id="ray" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#ff5252" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ff5252" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points="48,0 52,0 65,100 35,100" fill="url(#ray)" />
          <polygon points="30,0 34,0 15,100 -5,100" fill="url(#ray)" opacity="0.5" />
          <polygon points="66,0 70,0 90,100 60,100" fill="url(#ray)" opacity="0.6" />
        </motion.svg>
      </div>

      {/* Mist / fog drift */}
      <motion.div
        initial={{ x: '-30%' }}
        animate={{ x: '30%' }}
        transition={{ duration: 30, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
        className="absolute -bottom-40 -inset-x-20 h-96 opacity-40 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(220,38,38,0.15), transparent 60%), radial-gradient(ellipse at 30% 60%, rgba(100,100,120,0.15), transparent 60%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.22)_0%,transparent_55%)]" />
      <div className="absolute inset-0 shadow-[inset_0_0_240px_100px_rgba(0,0,0,0.95)] pointer-events-none" />

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 container mx-auto px-6 text-center"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 3.4 }}
          className="inline-flex items-center gap-3 px-4 py-1.5 mb-8 rounded-full border border-red-800/60 bg-black/50 backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-red-300 font-cinzel">
            Dark Fantasy Gaming
          </span>
        </motion.div>

        {/* Sigil */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.5, delay: 3.0, ease: [0.19, 1, 0.22, 1] }}
          className="mb-6 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative w-36 h-36 md:w-52 md:h-52"
          >
            {/* Glow halo behind avatar */}
            <div className="absolute inset-0 rounded-full bg-red-600/40 blur-3xl scale-110 animate-pulse-glow" />
            {/* Rotating ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-3 rounded-full border border-dashed border-red-600/40"
            />
            <div className="relative w-full h-full rounded-full overflow-hidden ring-4 ring-red-700/80 shadow-[0_0_50px_rgba(220,38,38,0.7),0_0_100px_rgba(220,38,38,0.4)]">
              <img
                src="/ratattack-avatar.png"
                alt="RatAttacK"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </motion.div>

        {/* Title with mask reveal + sheen */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.4, duration: 0.6 }}
          className="font-cinzel font-black text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] tracking-wider leading-[0.9] relative inline-block"
        >
          {/* Rat */}
          <motion.span
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.1, delay: 3.5, ease: [0.19, 1, 0.22, 1] }}
            className="inline-block text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.9)]"
          >
            Rat
          </motion.span>
          {/* AttacK */}
          <motion.span
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.1, delay: 3.75, ease: [0.19, 1, 0.22, 1] }}
            className="inline-block gradient-text text-glow"
          >
            AttacK
          </motion.span>

          {/* Sheen sweep */}
          <motion.span
            initial={{ x: '-120%' }}
            animate={{ x: '120%' }}
            transition={{ duration: 1.8, delay: 4.4, ease: 'easeInOut' }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(110deg, transparent 42%, rgba(255,255,255,0.4) 50%, transparent 58%)',
              mixBlendMode: 'overlay',
            }}
          />
        </motion.h1>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.2, delay: 4.4 }}
          className="divider-ornate mt-8 max-w-lg mx-auto"
        >
          <span className="text-red-500 text-lg">✦</span>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 4.6 }}
          className="mt-6 max-w-2xl mx-auto text-lg md:text-2xl text-neutral-200 font-light leading-relaxed px-4 tracking-wide"
        >
          Chaotic raids. Cursed loot.
          <span className="text-red-400"> Cheap deaths and cheaper laughs.</span>
          <br />
          <span className="text-neutral-400 text-base md:text-lg font-cinzel uppercase tracking-[0.3em] mt-2 inline-block">
            The horde starts here.
          </span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 4.9 }}
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            asChild
            size="lg"
            className="btn-glow-red group h-16 px-10 text-base bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border-2 border-red-800 text-white glow-red-strong animate-pulse-glow relative overflow-hidden"
          >
            <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noopener noreferrer">
              <span className="mr-3 group-hover:scale-125 transition-transform"><IconPlay size={22} /></span>
              <span className="font-cinzel tracking-widest uppercase text-sm">Watch on YouTube</span>
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="btn-glow-red group h-16 px-10 text-base bg-black/50 border-2 border-red-800/60 hover:bg-red-950/60 hover:border-red-500 text-white backdrop-blur-md relative"
          >
            <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-5 h-5 mr-3 group-hover:scale-125 transition-transform" />
              <span className="font-cinzel tracking-widest uppercase text-sm">Join the Discord</span>
            </a>
          </Button>
        </motion.div>

        {/* Chapter marker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 5.5 }}
          className="mt-16 flex items-center justify-center gap-4 text-[10px] uppercase tracking-[0.5em] text-neutral-500 font-cinzel"
        >
          <div className="w-12 h-px bg-red-800/60" />
          <span>Chapter I — Enter the Dark</span>
          <div className="w-12 h-px bg-red-800/60" />
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 5.8 }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 text-red-500/70"
        >
          <span className="text-[9px] uppercase tracking-[0.4em] font-cinzel">Scroll</span>
          <IconChevronDown size={22} />
        </motion.div>
      </motion.div>
    </section>
  );
}
