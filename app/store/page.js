import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { ScrollingBackdrop } from '@/components/site/ScrollingBackdrop';
import { AtmosphereBackground } from '@/components/site/AtmosphereBackground';
import { FilmGrain, Scanlines } from '@/components/site/CinematicFX';
import { CartDrawer } from '@/components/store/CartDrawer';
import { StoreHomeClient } from '@/components/store/StoreHomeClient';
import { EmptyStore } from '@/components/store/EmptyStore';
import { CURRENT_PROMOS } from '@/lib/products';
import { getAllProductsLive } from '@/lib/shopify';
import { getCollectionsLive, getFeaturedProductsLive, getSaleProductsLive } from '@/lib/shopify-extras';
import { RecentlyViewed } from '@/components/store/RecentlyViewed';
import { Toaster } from '@/components/ui/sonner';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Store — RatAttacK',
  description: 'Pokémon TCG, RatAttacK merchandise, and exclusive collectibles from the RatAttacK vault.',
};

export default async function StorePage() {
  // Everything below comes exclusively from Shopify. No mock, no hardcoding.
  const [{ collections }, { products: pool }, { products: featured }, { products: onSale }] = await Promise.all([
    getCollectionsLive({ first: 20 }),
    getAllProductsLive({ first: 60 }),
    getFeaturedProductsLive({ first: 8 }),
    getSaleProductsLive({ first: 8 }),
  ]);

  const catalogEmpty = pool.length === 0;
  const newArrivals = [...pool].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')).slice(0, 8);
  const bestSellers = [...pool].sort((a, b) => (b.salesCount ?? 0) - (a.salesCount ?? 0)).slice(0, 8);

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
        {catalogEmpty ? (
          <div className="pt-24 md:pt-32">
            <EmptyStore />
          </div>
        ) : (
          <StoreHomeClient
            featuredCollections={collections}
            featured={featured}
            newArrivals={newArrivals}
            bestSellers={bestSellers}
            recent={newArrivals}
            onSale={onSale}
            promos={CURRENT_PROMOS}
          />
        )}
        <RecentlyViewed />
      </main>

      <Footer />
    </div>
  );
}
