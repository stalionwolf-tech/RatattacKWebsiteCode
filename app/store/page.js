import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { ScrollingBackdrop } from '@/components/site/ScrollingBackdrop';
import { AtmosphereBackground } from '@/components/site/AtmosphereBackground';
import { FilmGrain, Scanlines } from '@/components/site/CinematicFX';
import { CartDrawer } from '@/components/store/CartDrawer';
import { StoreHomeClient } from '@/components/store/StoreHomeClient';
import { PRODUCTS, COLLECTIONS, getProductsForCollection, CURRENT_PROMOS } from '@/lib/products';
import { Toaster } from '@/components/ui/sonner';

export const metadata = {
  title: 'Store — RatAttacK',
  description: 'Pokémon TCG, RatAttacK merchandise, and exclusive collectibles. Collect. Open. Conquer.',
};

export default function StorePage() {
  const featuredCollections = COLLECTIONS.filter((c) => ['booster-boxes','elite-trainer-boxes','singles','merch','mystery-packs','accessories'].includes(c.slug));
  const featured = PRODUCTS.slice(0, 8);
  const newArrivals = getProductsForCollection('new-arrivals').slice(0, 8);
  const bestSellers = getProductsForCollection('best-sellers').slice(0, 8);
  const recent = [...PRODUCTS].sort((a,b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 8);

  return (
    <div className="relative min-h-screen bg-black text-neutral-100 overflow-x-hidden">
      <ScrollingBackdrop />
      <AtmosphereBackground />
      <FilmGrain />
      <Scanlines />
      <Navbar />
      <CartDrawer />
      <Toaster theme="dark" position="bottom-right" />

      <main className="relative z-10">
        <StoreHomeClient
          featuredCollections={featuredCollections}
          featured={featured}
          newArrivals={newArrivals}
          bestSellers={bestSellers}
          recent={recent}
          promos={CURRENT_PROMOS}
        />
      </main>

      <Footer />
    </div>
  );
}
