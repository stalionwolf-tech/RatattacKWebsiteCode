import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { ScrollingBackdrop } from '@/components/site/ScrollingBackdrop';
import { AtmosphereBackground } from '@/components/site/AtmosphereBackground';
import { FilmGrain, Scanlines } from '@/components/site/CinematicFX';
import { CartDrawer } from '@/components/store/CartDrawer';
import { StoreHomeClient } from '@/components/store/StoreHomeClient';
import { EmptyStore } from '@/components/store/EmptyStore';
import { COLLECTIONS, CURRENT_PROMOS } from '@/lib/products';
import { getAllProductsLive } from '@/lib/shopify';
import { Toaster } from '@/components/ui/sonner';
import { RecentlyViewed } from '@/components/store/RecentlyViewed';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Store — RatAttacK',
  description: 'Pokémon TCG, RatAttacK merchandise, and exclusive collectibles. Collect. Open. Conquer.',
};

export default async function StorePage() {
  const featuredCollections = COLLECTIONS.filter((c) =>
    ['booster-boxes','elite-trainer-boxes','singles','merch','mystery-packs','accessories'].includes(c.slug)
  );

  // Live Shopify catalog only. No mock fallback anywhere.
  const { products: pool, empty } = await getAllProductsLive({ first: 50 });

  const featured    = pool.slice(0, 8);
  const newArrivals = pool.filter((p) => p.isNew).slice(0, 8);
  const bestSellers = [...pool].sort((a, b) => (b.salesCount ?? 0) - (a.salesCount ?? 0)).slice(0, 8);
  const recent      = [...pool].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')).slice(0, 8);

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
        {empty ? (
          <div className="pt-24 md:pt-32">
            <EmptyStore />
          </div>
        ) : (
          <StoreHomeClient
            featuredCollections={featuredCollections}
            featured={featured}
            newArrivals={newArrivals}
            bestSellers={bestSellers}
            recent={recent}
            promos={CURRENT_PROMOS}
          />
        )}
        <RecentlyViewed />
      </main>

      <Footer />
    </div>
  );
}
