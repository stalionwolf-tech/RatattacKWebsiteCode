'use client';
import { useEffect, useRef, useState } from 'react';
import { SITE_CONFIG } from '@/lib/config';

/**
 * Custom medieval dagger cursor.
 * - SVG (retina-crisp) rendered via CSS transforms only (GPU-accelerated).
 * - Automatically disabled on touch devices and when prefers-reduced-motion.
 * - Config flag: SITE_CONFIG.ui.customCursor toggles the whole system.
 * - Falls back to the native cursor cleanly if disabled at runtime.
 */
export function CustomCursor() {
  const enabled = SITE_CONFIG.ui?.customCursor !== false;
  const [active, setActive] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [sparks, setSparks] = useState([]);
  const cursorRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const raf = useRef(0);

  // Feature-detect: pointer=fine + no coarse + no reduced-motion + flag on.
  useEffect(() => {
    if (!enabled) return;
    if (typeof window === 'undefined') return;
    const canRun =
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(pointer: coarse)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canRun) return;

    setActive(true);
    document.documentElement.classList.add('cursor-none');

    const onMove = (e) => { target.current = { x: e.clientX, y: e.clientY }; };
    const isInteractive = (el) => {
      if (!el || !el.closest) return false;
      return !!el.closest('a, button, [role="button"], input, textarea, select, label, [data-cursor-hover]');
    };
    const onOver  = (e) => setHovering(isInteractive(e.target));
    const onDown  = (e) => {
      setClicking(true);
      // Spark at blade tip — emit if not on an input to avoid interfering with typing.
      if (!e.target.closest || !e.target.closest('input, textarea, select')) {
        const id = Math.random().toString(36).slice(2);
        setSparks((s) => [...s, { id, x: target.current.x, y: target.current.y }]);
        setTimeout(() => setSparks((s) => s.filter((sp) => sp.id !== id)), 500);
      }
    };
    const onUp    = () => setClicking(false);
    const onLeave = () => { target.current = { x: -100, y: -100 }; };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup',   onUp);
    document.addEventListener('mouseleave', onLeave);

    const loop = () => {
      // Smoothly follow target for a slight lag feel.
      pos.current.x += (target.current.x - pos.current.x) * 0.35;
      pos.current.y += (target.current.y - pos.current.y) * 0.35;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    return () => {
      document.documentElement.classList.remove('cursor-none');
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup',   onUp);
      document.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf.current);
    };
  }, [enabled]);

  if (!enabled || !active) return null;

  // Compose transforms: hover rotate+scale, click stab (forward + down along blade axis)
  const rotate = hovering ? -18 : -25;
  const scale  = hovering ? 1.08 : 1;
  const stab   = clicking ? 5 : 0;

  return (
    <>
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] will-change-transform"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      >
        <div
          className="relative"
          style={{
            transform: `rotate(${rotate}deg) scale(${scale}) translate(${stab}px, ${-stab}px)`,
            transition: 'transform 140ms cubic-bezier(0.19, 1, 0.22, 1)',
          }}
        >
          {/* Crimson glow halo (hover) */}
          <div
            className="absolute inset-0 rounded-full blur-md"
            style={{
              background: hovering ? 'radial-gradient(circle, rgba(220,38,38,0.55), transparent 70%)' : 'transparent',
              transform: 'translate(-50%, -50%) scale(2.2)',
              left: 4, top: 4,
              transition: 'background 220ms ease',
            }}
          />
          {/* Dagger SVG (tip anchored at (0,0) top-left) */}
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            {/* Blade */}
            <path d="M2 2 L4 4 L14 22 L11 22 L2 4 Z" fill={hovering ? '#f87171' : '#e5e7eb'} stroke="#0a0a0a" strokeWidth="0.6" strokeLinejoin="round" />
            {/* Blade highlight */}
            <path d="M3 3 L4 4 L12 20" stroke={hovering ? '#fecaca' : '#ffffff'} strokeWidth="0.8" strokeLinecap="round" opacity="0.85" />
            {/* Crossguard */}
            <path d="M9 17 L18 22 L14 24 L11 22 Z" fill="#7f1d1d" stroke="#0a0a0a" strokeWidth="0.6" />
            {/* Grip */}
            <rect x="12" y="22" width="3" height="5" transform="rotate(-30 13 24)" fill="#3f2410" stroke="#0a0a0a" strokeWidth="0.4" />
            {/* Pommel */}
            <circle cx="18" cy="27" r="1.6" fill={hovering ? '#dc2626' : '#a16207'} stroke="#0a0a0a" strokeWidth="0.4" />
          </svg>
        </div>
      </div>

      {/* Sparks at click position */}
      {sparks.map((s) => (
        <div
          key={s.id}
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-0 z-[9998]"
          style={{ transform: `translate3d(${s.x}px, ${s.y}px, 0)` }}
        >
          <div className="cursor-spark" />
        </div>
      ))}
    </>
  );
}
