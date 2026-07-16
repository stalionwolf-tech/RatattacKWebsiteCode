'use client';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Eye, Clock, Youtube } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectionHeader } from './SectionHeader';

const VIDEOS = [
  {
    id: 'dQw4w9WgXcQ',
    title: 'Rat Ambush! Dark and Darker Solo Chaos',
    game: 'Dark and Darker',
    views: '124K',
    duration: '14:22',
    thumb: 'https://images.unsplash.com/photo-1636075600968-b78421da91c2?crop=entropy&cs=srgb&fm=jpg&q=85',
  },
  {
    id: 'dQw4w9WgXcQ',
    title: 'Tarkov Extraction Nightmare — The Longest 3 Minutes',
    game: 'Escape from Tarkov',
    views: '89K',
    duration: '22:07',
    thumb: 'https://images.unsplash.com/photo-1657465141082-2f0b05096648?crop=entropy&cs=srgb&fm=jpg&q=85',
  },
  {
    id: 'dQw4w9WgXcQ',
    title: 'Guarding the Loot Room Like a Feral Knight',
    game: 'Dark and Darker',
    views: '212K',
    duration: '18:44',
    thumb: 'https://images.unsplash.com/photo-1573932925621-4a07d654bf77?crop=entropy&cs=srgb&fm=jpg&q=85',
  },
];

function TiltCard({ video, index }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, sx: 50, sy: 50 });

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({
      x: (y - 0.5) * -10,
      y: (x - 0.5) * 12,
      sx: x * 100,
      sy: y * 100,
    });
  };
  const reset = () => setTilt({ x: 0, y: 0, sx: 50, sy: 50 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: [0.19, 1, 0.22, 1] }}
      style={{ perspective: 1200 }}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: 'spring', stiffness: 250, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="h-full"
      >
        <Card className="group relative overflow-hidden glass-panel hover:border-red-600/70 transition-colors duration-500 cursor-pointer h-full">
          <a href={`https://youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer" className="block">
            <div className="relative aspect-video overflow-hidden">
              <img
                src={video.thumb}
                alt={video.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.4s] ease-out saturate-75 group-hover:saturate-100 contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

              {/* Spotlight cursor */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{
                  background: `radial-gradient(circle at ${tilt.sx}% ${tilt.sy}%, rgba(220,38,38,0.35), transparent 40%)`,
                }}
              />

              {/* Duration */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/80 backdrop-blur-sm rounded text-xs text-neutral-200 border border-neutral-800">
                <Clock className="w-3 h-3" /> {video.duration}
              </div>

              {/* Game tag */}
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-red-900/90 backdrop-blur-sm rounded text-[10px] uppercase tracking-widest text-red-100 border border-red-700 font-cinzel">
                {video.game}
              </div>

              {/* Play overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  className="w-16 h-16 rounded-full bg-red-600/90 flex items-center justify-center glow-red-strong"
                >
                  <Play className="w-7 h-7 text-white fill-white ml-1" />
                </motion.div>
              </div>
            </div>

            <div className="p-5">
              <h3 className="font-cinzel text-lg font-semibold text-white group-hover:text-red-400 transition-colors line-clamp-2 leading-snug mb-3">
                {video.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-neutral-500">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> {video.views} views
                </span>
                <span className="w-1 h-1 rounded-full bg-neutral-700" />
                <span>RatAttacK</span>
              </div>
            </div>
          </a>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export function VideosSection() {
  return (
    <section id="videos" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.08),transparent_50%)] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <SectionHeader
          eyebrow="Featured"
          title="Latest Raids"
          description="Fresh chaos from the crypts, castles, and extraction points. Watch, laugh, and learn how NOT to survive."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VIDEOS.map((v, i) => <TiltCard key={i} video={v} index={i} />)}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-14"
        >
          <Button
            asChild
            size="lg"
            className="btn-glow-red bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 h-12 px-8 border border-red-900 glow-red"
          >
            <a href="https://youtube.com/@RatAttacK" target="_blank" rel="noopener noreferrer">
              <Youtube className="w-5 h-5 mr-2" /> See All Videos
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
