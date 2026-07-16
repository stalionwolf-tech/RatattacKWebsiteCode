'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { AlertOctagon, RefreshCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GlobalError({ error, reset }) {
  useEffect(() => { if (process.env.NODE_ENV === 'development') console.error(error); }, [error]);
  return (
    <div className="relative min-h-screen bg-black text-neutral-100 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.15),transparent_60%)]" />
      <div className="relative z-10 max-w-lg w-full mx-6 text-center border border-red-900/60 bg-black/70 backdrop-blur-xl rounded-2xl p-10">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-950/40 border border-red-800/70 flex items-center justify-center text-red-400">
          <AlertOctagon className="w-9 h-9" />
        </div>
        <div className="text-red-500 tracking-[0.5em] text-[10px] uppercase mb-3 font-cinzel">Rift Detected</div>
        <h1 className="font-cinzel text-3xl md:text-4xl font-bold text-white mb-3">The vault trembles.</h1>
        <p className="text-neutral-400 mb-6">Something torn a page in the runeforge. Try again, or return to the safety of home.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button onClick={() => reset()} className="h-11 px-5 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-900">
            <RefreshCcw className="w-4 h-4 mr-2" /><span className="font-cinzel tracking-widest uppercase text-xs">Try Again</span>
          </Button>
          <Button asChild variant="outline" className="h-11 px-5 border-red-800/60 bg-black/40 hover:bg-red-950/40">
            <Link href="/"><Home className="w-4 h-4 mr-2" /><span className="font-cinzel tracking-widest uppercase text-xs">Home</span></Link>
          </Button>
        </div>
        {process.env.NODE_ENV === 'development' && error?.message ? (
          <pre className="mt-6 p-3 text-[10px] text-left text-amber-300 bg-black/60 rounded overflow-x-auto">{error.message}</pre>
        ) : null}
      </div>
    </div>
  );
}
