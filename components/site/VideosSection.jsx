'use client';
import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Eye, Clock, Youtube, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectionHeader } from './SectionHeader';
import { YOUTUBE_CHANNEL_URL } from '@/lib/constants';

function formatTimeAgo(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return 'Today';
  if (days < 2) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

function TiltCard({ video, index }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, sx: 50, sy: 50 });
  const [imgSrc, setImgSrc] = useState(video.thumbnail);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (y - 0.5) * -10, y: (x - 0.5) * 12, sx: x * 100, sy: y * 100 });
  };
  const reset = () => setTilt({ x: 0, y: 0, sx: 50, sy: 50 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.19, 1, 0.22, 1] }}
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
          <a href={video.url} target="_blank" rel="noopener noreferrer" className="block">
            <div className="relative aspect-video overflow-hidden bg-neutral-950">
              <img
                src={imgSrc}
                alt={video.title}
                loading="lazy"
                onError={() => setImgSrc(`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`)}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform saturate-75 group-hover:saturate-100 contrast-125"
                style={{ transitionDuration: '1.4s' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

              {/* Spotlight cursor */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{ background: `radial-gradient(circle at ${tilt.sx}% ${tilt.sy}%, rgba(220,38,38,0.35), transparent 40%)` }}
              />

              {video.published && (
                <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/80 backdrop-blur-sm rounded text-xs text-neutral-200 border border-neutral-800">
                  <Clock className="w-3 h-3" /> {formatTimeAgo(video.published)}
                </div>
              )}

              <div className="absolute top-3 left-3 px-2.5 py-1 bg-red-900/90 backdrop-blur-sm rounded text-[10px] uppercase tracking-widest text-red-100 border border-red-700 font-cinzel">
                RatAttacK
              </div>

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
                  <Youtube className="w-3.5 h-3.5" /> Watch on YouTube
                </span>
              </div>
            </div>
          </a>
        </Card>
      </motion.div>
    </motion.div>
  );
}

function VideoSkeleton() {
  return (
    <div className="glass-panel rounded-lg overflow-hidden">
      <div className="aspect-video bg-gradient-to-br from-neutral-900 to-neutral-950 animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-neutral-800 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-neutral-900 rounded animate-pulse w-1/2" />
      </div>
    </div>
  );
}

export function VideosSection() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch('/api/videos', { cache: 'no-store' });
        const data = await r.json();
        if (!alive) return;
        setVideos((data.videos || []).slice(0, 9));
      } catch (e) {
        if (!alive) return;
        setError('Could not load videos.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <section id="videos" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.08),transparent_50%)] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <SectionHeader
          eyebrow="Featured"
          title="Latest Raids"
          description="Fresh chaos from the crypts, castles, and extraction points. Auto-updated as new videos drop."
        />

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => <VideoSkeleton key={i} />)}
          </div>
        )}

        {!loading && videos.length === 0 && (
          <div className="max-w-xl mx-auto text-center glass-panel rounded-xl p-8">
            <Youtube className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <p className="text-neutral-300 mb-4">
              Videos will appear here once the feed connects.
              <br />
              <span className="text-neutral-500 text-sm">Head to the channel in the meantime.</span>
            </p>
            <Button asChild className="bg-red-700 hover:bg-red-600 border border-red-900">
              <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noopener noreferrer">
                <Youtube className="w-4 h-4 mr-2" /> Visit YouTube Channel
              </a>
            </Button>
          </div>
        )}

        {!loading && videos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((v, i) => <TiltCard key={v.id} video={v} index={i} />)}
          </div>
        )}

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
            <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noopener noreferrer">
              <Youtube className="w-5 h-5 mr-2" /> Subscribe on YouTube
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
