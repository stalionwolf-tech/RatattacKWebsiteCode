import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { ScrollingBackdrop } from '@/components/site/ScrollingBackdrop';
import { AtmosphereBackground } from '@/components/site/AtmosphereBackground';
import { FilmGrain, Scanlines } from '@/components/site/CinematicFX';
import { CartDrawer } from '@/components/store/CartDrawer';
import { StoreHomeClient } from '@/components/store/StoreHomeClient';
import { COLLECTIONS, CURRENT_PROMOS, getProductsForCollection as mockGetProductsForCollection } from '@/lib/products';
import { getAllProductsLive } from '@/lib/shopify';
import { Toaster } from '@/components/ui/sonner';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Store — RatAttacK',
  description: 'Pokémon TCG, RatAttacK merchandise, and exclusive collectibles. Collect. Open. Conquer.',
};

export default async function StorePage() {
  const featuredCollections = COLLECTIONS.filter((c) =>
    ['booster-boxes','elite-trainer-boxes','singles','merch','mystery-packs','accessories'].includes(c.slug)
  );

  // Try Shopify first; automatically falls back to mock inventory if empty/error.
  const { products: livePool, source } = await getAllProductsLive({ first: 50 });

  // When source is 'shopify' we don't know the mock collection slug on each item,
  // so derive shelves purely by product-type + tags.
  const featured    = livePool.slice(0, 8);
  const newArrivals = source === 'shopify'
    ? livePool.filter((p) => p.isNew).slice(0, 8)
    : mockGetProductsForCollection('new-arrivals').slice(0, 8);
  const bestSellers = source === 'shopify'
    ? [...livePool].sort((a, b) => (b.salesCount ?? 0) - (a.salesCount ?? 0)).slice(0, 8)
    : mockGetProductsForCollection('best-sellers').slice(0, 8);
  const recent = [...livePool].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')).slice(0, 8);

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
