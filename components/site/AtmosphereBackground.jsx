'use client';
import { useEffect, useRef } from 'react';

// Layered animated fog + ember background.
// - Two SVG blob layers drift horizontally at different speeds (fog).
// - Canvas layer renders rising embers with flicker + drift.

export function AtmosphereBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const w = () => canvas.width / dpr;
    const h = () => canvas.height / dpr;

    // Embers: rising sparks with drift + flicker
    const emberCount = Math.min(90, Math.floor(window.innerWidth / 18));
    const embers = Array.from({ length: emberCount }).map(() => ({
      x: Math.random() * w(),
      y: h() + Math.random() * h(),
      size: Math.random() * 1.6 + 0.4,
      speedY: Math.random() * 0.7 + 0.25,
      speedX: (Math.random() - 0.5) * 0.4,
      phase: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.7 + 0.25,
      hue: Math.random() > 0.35 ? 0 : 22,
      flicker: Math.random() * 0.03 + 0.008,
      life: Math.random(),
    }));

    // Dust motes (slower, smaller, off-white)
    const dustCount = 30;
    const dust = Array.from({ length: dustCount }).map(() => ({
      x: Math.random() * w(),
      y: Math.random() * h(),
      size: Math.random() * 0.8 + 0.2,
      speedX: (Math.random() - 0.5) * 0.15,
      speedY: (Math.random() - 0.3) * 0.15,
      opacity: Math.random() * 0.25 + 0.05,
    }));

    let t = 0;
    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w(), h());

      // Embers
      for (const p of embers) {
        p.y -= p.speedY;
        p.x += p.speedX + Math.sin((p.y + p.phase) * 0.02) * 0.4;
        p.opacity += (Math.random() - 0.5) * p.flicker;
        p.opacity = Math.max(0.1, Math.min(0.95, p.opacity));

        if (p.y < -20) {
          p.y = h() + 20;
          p.x = Math.random() * w();
        }

        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5);
        glow.addColorStop(0, `hsla(${p.hue}, 90%, 60%, ${p.opacity})`);
        glow.addColorStop(0.4, `hsla(${p.hue}, 85%, 50%, ${p.opacity * 0.5})`);
        glow.addColorStop(1, `hsla(${p.hue}, 85%, 50%, 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2);
        ctx.fill();

        // core spark
        ctx.fillStyle = `hsla(${p.hue + 10}, 95%, 75%, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // Dust motes
      for (const d of dust) {
        d.x += d.speedX;
        d.y += d.speedY;
        if (d.x < -5) d.x = w() + 5;
        if (d.x > w() + 5) d.x = -5;
        if (d.y < -5) d.y = h() + 5;
        if (d.y > h() + 5) d.y = -5;

        ctx.fillStyle = `rgba(200, 190, 175, ${d.opacity})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      {/* Volumetric fog layers (SVG blobs) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -bottom-40 -left-40 w-[80vw] h-[60vh] opacity-25 animate-fog-drift-slow"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(180,60,60,0.5), rgba(80,20,20,0.2) 40%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div className="absolute -bottom-20 right-0 w-[70vw] h-[55vh] opacity-20 animate-fog-drift-fast"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(80,80,100,0.4), rgba(40,40,60,0.15) 40%, transparent 70%)',
            filter: 'blur(70px)',
          }}
        />
        <div className="absolute top-1/4 left-1/3 w-[50vw] h-[40vh] opacity-15 animate-fog-drift-slow"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(180,90,90,0.35), transparent 60%)',
            filter: 'blur(80px)',
            animationDelay: '-8s',
          }}
        />
      </div>

      {/* Ember canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ mixBlendMode: 'screen' }}
        aria-hidden="true"
      />
    </>
  );
}
