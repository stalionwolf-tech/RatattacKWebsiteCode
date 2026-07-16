'use client';
import Link from 'next/link';
import { Skull, ArrowLeft, Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AtmosphereBackground } from '@/components/site/AtmosphereBackground';
import { ScrollingBackdrop } from '@/components/site/ScrollingBackdrop';
import { FilmGrain, Scanlines } from '@/components/site/CinematicFX';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-black text-neutral-100 overflow-x-hidden">
      <ScrollingBackdrop />
      <AtmosphereBackground />
      <FilmGrain />
      <Scanlines />
      <Navbar />

      <main className="relative z-10 container mx-auto px-6 pt-32 md:pt-40 pb-20 flex items-center justify-center min-h-[70vh]">
        <div className="max-w-2xl w-full text-center glass-panel frame-corners rounded-2xl p-10 md:p-16 relative overflow-hidden">
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-950/40 border border-red-800/70 flex items-center justify-center text-red-400 shadow-[0_0_60px_-10px_rgba(220,38,38,0.7)]">
              <Skull className="w-12 h-12" />
            </div>
            <div className="text-red-500 tracking-[0.5em] text-[10px] uppercase mb-3 font-cinzel">404 — Lost in the Fog</div>
            <h1 className="font-cinzel text-5xl md:text-7xl font-bold text-white mb-4">This Path Is Sealed.</h1>
            <p className="text-neutral-400 leading-relaxed max-w-md mx-auto mb-8">
              The scroll you sought is not in this vault. Perhaps it was moved, renamed, or claimed by another raider. Return home, browse the store, or search the archives.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="h-12 px-6 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-900 btn-glow-red glow-red">
                <Link href="/"><Home className="w-4 h-4 mr-2" /><span className="font-cinzel tracking-widest uppercase text-xs">Return Home</span></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-6 border-red-800/60 bg-black/40 hover:bg-red-950/40 hover:border-red-600 text-neutral-200">
                <Link href="/store"><Search className="w-4 h-4 mr-2" /><span className="font-cinzel tracking-widest uppercase text-xs">Enter the Vault</span></Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="h-12 px-6 text-neutral-400 hover:text-red-400">
                <a href="javascript:history.back()"><ArrowLeft className="w-4 h-4 mr-2" /><span className="font-cinzel tracking-widest uppercase text-xs">Back</span></a>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
