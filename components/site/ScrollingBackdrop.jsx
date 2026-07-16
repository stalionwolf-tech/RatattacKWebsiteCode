'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

/**
 * Full-page scrolling pixel-art backdrop.
 * The image is 100% viewport-wide (aspect kept), locked to the left edge.
 * As the user scrolls the page, the image translates upward so different
 * "chapters" (castle -> throne room -> crypt -> caverns -> dragon lair)
 * reveal in sync with each section.
 */
export function ScrollingBackdrop() {
  const wrapRef = useRef(null);
  const [dims, setDims] = useState({ vh: 0, imgH: 0 });

  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 22, mass: 0.5 });

  // Translate the image from 0 down to negative (imgH - vh) so we reveal it top-to-bottom
  const maxTranslate = Math.max(0, dims.imgH - dims.vh);
  const y = useTransform(smooth, [0, 1], [0, -maxTranslate]);

  useEffect(() => {
    const measure = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // Image intrinsic aspect ratio ~ 880:1878 = 0.4686
      const aspect = 880 / 1878;
      // Cover viewport width; image height derived
      const imgW = vw;
      const imgH = imgW / aspect;
      setDims({ vh, imgH });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
    >
      <motion.div
        style={{ y, width: '100%', height: dims.imgH || '100vh' }}
        className="relative will-change-transform"
      >
        <img
          src="/scroll-backdrop.png"
          alt=""
          className="w-full h-full object-cover select-none"
          style={{ imageRendering: 'pixelated' }}
          draggable={false}
        />
        {/* Very light global darkening; sections add their own tint for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/30 to-black/50" />
        {/* Subtle vignette */}
        <div className="absolute inset-0 shadow-[inset_0_0_240px_100px_rgba(0,0,0,0.7)]" />
      </motion.div>
    </div>
  );
}
