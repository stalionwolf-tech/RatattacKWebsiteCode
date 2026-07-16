'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Music, Play, Pause, X } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/config';

/**
 * Persistent ambient audio control.
 *
 * - Never autoplays; audio file is only requested after the user clicks Play.
 * - Preference (muted/unmuted + volume) is persisted in localStorage.
 * - Respects prefers-reduced-motion by disabling the pulse animation.
 * - Lives in the root <html> layout so navigation between pages does NOT
 *   interrupt playback.
 * - Graceful failure: if the audio source is missing (HTTP 404 or empty
 *   config), the control still renders but displays a subtle notice.
 */

const LS_MUTED  = 'ratattack_audio_muted';
const LS_VOLUME = 'ratattack_audio_volume';
const LS_TOUCHED = 'ratattack_audio_touched'; // has the user ever pressed Play?

export function AmbientAudioPlayer() {
  const audioRef = useRef(/** @type {HTMLAudioElement | null} */(null));
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(SITE_CONFIG.audio.defaultVolume);
  const [errored, setErrored] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // ---- Init: read saved prefs, detect reduced-motion ----
  useEffect(() => {
    setMounted(true);
    try {
      const savedMuted = localStorage.getItem(LS_MUTED);
      const savedVol   = localStorage.getItem(LS_VOLUME);
      if (savedMuted !== null) setMuted(savedMuted === '1');
      if (savedVol !== null) {
        const v = Number(savedVol);
        if (!Number.isNaN(v)) setVolume(Math.max(0, Math.min(1, v)));
      }
    } catch {}
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mq.matches);
      const on = (e) => setReducedMotion(e.matches);
      mq.addEventListener?.('change', on);
      return () => mq.removeEventListener?.('change', on);
    }
  }, []);

  // Persist prefs whenever they change (after mount).
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(LS_MUTED, muted ? '1' : '0');
      localStorage.setItem(LS_VOLUME, String(volume));
    } catch {}
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
      audioRef.current.muted  = muted;
    }
  }, [muted, volume, mounted]);

  // ---- Lazy audio element creation on first Play ----
  const ensureAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current;
    const el = new Audio();
    el.src = SITE_CONFIG.audio.ambientSrc;
    el.loop = true;
    el.preload = 'auto';
    el.crossOrigin = 'anonymous';
    el.volume = muted ? 0 : volume;
    el.muted = muted;
    el.addEventListener('error',   () => { setErrored(true); setPlaying(false); });
    el.addEventListener('ended',   () => setPlaying(false)); // shouldn't trigger due to loop
    el.addEventListener('playing', () => setPlaying(true));
    el.addEventListener('pause',   () => setPlaying(false));
    audioRef.current = el;
    return el;
  }, [muted, volume]);

  const togglePlay = async () => {
    try { localStorage.setItem(LS_TOUCHED, '1'); } catch {}
    if (errored) return;
    const el = ensureAudio();
    if (playing) {
      el.pause();
    } else {
      // Unmute if user hits Play from a muted state — they've explicitly opted in.
      if (muted) { setMuted(false); el.muted = false; el.volume = volume; }
      try { await el.play(); } catch { setErrored(true); }
    }
  };

  const toggleMute = () => {
    setMuted((m) => {
      const next = !m;
      if (audioRef.current) { audioRef.current.muted = next; audioRef.current.volume = next ? 0 : volume; }
      return next;
    });
  };

  // ---- UI ----
  if (!mounted) return null;

  const StatusIcon = errored ? VolumeX : playing ? (muted ? VolumeX : Volume2) : Music;

  return (
    <div className="fixed bottom-5 right-5 z-[70] flex flex-col items-end gap-2" aria-live="polite">
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.19, 1, 0.22, 1] }}
            className="glass-panel frame-corners rounded-xl p-4 w-72 shadow-[0_20px_60px_rgba(0,0,0,0.7)] border border-red-900/40"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="text-[9px] uppercase tracking-[0.4em] text-red-500 font-cinzel mb-0.5">Ambience</div>
                <div className="font-cinzel text-sm text-white leading-tight">{SITE_CONFIG.audio.label}</div>
              </div>
              <button onClick={() => setExpanded(false)} aria-label="Close audio panel" className="w-7 h-7 rounded-md flex items-center justify-center text-neutral-500 hover:text-red-400 hover:bg-red-950/40 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {errored ? (
              <div className="text-xs text-neutral-400 leading-relaxed py-2">
                Audio not configured. Drop a file at <code className="text-red-400">public{SITE_CONFIG.audio.ambientSrc}</code> and refresh.
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={togglePlay}
                    aria-label={playing ? 'Pause ambience' : 'Play ambience'}
                    className="flex-1 h-10 rounded-md border border-red-800/60 bg-black/50 hover:bg-red-950/40 hover:border-red-600 flex items-center justify-center gap-2 text-white transition-premium"
                  >
                    {playing ? <Pause className="w-4 h-4 text-red-400" /> : <Play className="w-4 h-4 text-red-400" />}
                    <span className="font-cinzel tracking-widest uppercase text-[10px]">{playing ? 'Pause' : 'Play'}</span>
                  </button>
                  <button
                    onClick={toggleMute}
                    aria-label={muted ? 'Unmute' : 'Mute'}
                    className={`w-10 h-10 rounded-md border flex items-center justify-center transition-premium ${muted ? 'border-neutral-800 bg-black/40 text-neutral-400' : 'border-red-800/60 bg-red-950/40 text-red-300'}`}
                  >
                    {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
                <label className="block">
                  <span className="text-[9px] uppercase tracking-[0.3em] text-neutral-500 font-cinzel">Volume</span>
                  <input
                    type="range"
                    min={0} max={1} step={0.02}
                    value={muted ? 0 : volume}
                    onChange={(e) => { const v = Number(e.target.value); setVolume(v); if (v > 0 && muted) setMuted(false); }}
                    className="w-full mt-2 accent-red-600 h-1"
                    aria-label="Volume"
                  />
                </label>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setExpanded((v) => !v)}
        aria-label="Ambient audio controls"
        aria-expanded={expanded}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1], delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative w-12 h-12 rounded-full glass-panel border flex items-center justify-center backdrop-blur-md transition-colors duration-500 ${
          playing && !muted
            ? 'border-red-600/80 text-red-300 shadow-[0_0_24px_rgba(220,38,38,0.5)]'
            : 'border-red-900/40 text-neutral-300 hover:border-red-600/70 hover:text-red-300 hover:shadow-[0_0_20px_rgba(220,38,38,0.35)]'
        }`}
      >
        {/* Pulse ring when playing (respects reduced-motion) */}
        {playing && !muted && !reducedMotion && (
          <motion.span
            className="absolute inset-0 rounded-full border border-red-500/70"
            animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
            aria-hidden="true"
          />
        )}
        <StatusIcon className="w-5 h-5" />
      </motion.button>
    </div>
  );
}
