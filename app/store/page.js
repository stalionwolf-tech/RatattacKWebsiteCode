import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { ScrollingBackdrop } from '@/components/site/ScrollingBackdrop';
import { AtmosphereBackground } from '@/components/site/AtmosphereBackground';
import { FilmGrain, Scanlines } from '@/components/site/CinematicFX';
import { StoreClient } from '@/components/store/StoreClient';

export const metadata = {
  title: 'Store — RatAttacK',
  description: 'Pokémon TCG, RatAttacK merchandise, and exclusive collectibles. Curated by the horde.',
};

export default function StorePage() {
  return (
    <div className="relative min-h-screen bg-black text-neutral-100 overflow-x-hidden">
      <ScrollingBackdrop />
      <AtmosphereBackground />
      <FilmGrain />
      <Scanlines />
      <Navbar />

      <main className="relative z-10">
        <StoreHero />
        <section className="container mx-auto px-6 pb-24">
          <StoreClient />
        </section>
      </main>

      <Footer />
    </div>
  );
}

function StoreHero() {
  return (
    <section className="relative pt-40 md:pt-52 pb-14 md:pb-20 text-center">
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/70 pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-red-500 tracking-[0.5em] text-[10px] md:text-xs font-semibold uppercase mb-4 font-cinzel">
          ✦ The Vault ✦
        </div>
        <h1 className="font-cinzel text-5xl md:text-7xl lg:text-8xl font-black text-white leading-none tracking-wide mb-5">
          <span className="gradient-text text-glow">Store</span>
        </h1>
        <div className="divider-ornate max-w-sm mx-auto mb-6">
          <span className="text-red-500">◆</span>
        </div>
        <p className="font-cinzel text-lg md:text-2xl text-neutral-200 tracking-[0.1em] mb-3">
          Collect. Open. Conquer.
        </p>
        <p className="max-w-2xl mx-auto text-sm md:text-base text-neutral-400 leading-relaxed">
          Pokémon TCG sealed product, singles, mystery packs, accessories, and RatAttacK merchandise — all curated from the Rat’s hoard.
        </p>
      </div>
    </section>
  );
}
