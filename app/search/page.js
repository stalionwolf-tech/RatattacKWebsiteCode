import { Suspense } from 'react';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { ScrollingBackdrop } from '@/components/site/ScrollingBackdrop';
import { AtmosphereBackground } from '@/components/site/AtmosphereBackground';
import { FilmGrain, Scanlines } from '@/components/site/CinematicFX';
import { CartDrawer } from '@/components/store/CartDrawer';
import { SearchClient } from '@/components/store/SearchClient';
import { Toaster } from '@/components/ui/sonner';
import { getAllProductsLive } from '@/lib/shopify-storefront';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Search — RatAttacK',
  description: 'Search the RatAttacK vault for Pokémon TCG, singles, merch and more.',
};

export default async function SearchPage({ searchParams }) {
  const sp = await searchParams;
  const q = (sp?.q || '').toString();
  const { products } = await getAllProductsLive({ first: 100 });

  return (
    <div className="relative min-h-screen bg-black text-neutral-100 overflow-x-hidden">
      <ScrollingBackdrop />
      <AtmosphereBackground />
      <FilmGrain />
      <Scanlines />
      <Navbar />
      <CartDrawer />
      <Toaster theme="dark" position="bottom-right" />

      <main className="relative z-10 container mx-auto px-6 pt-32 md:pt-40 pb-20">
        <Suspense fallback={null}>
          <SearchClient initialQuery={q} allProducts={products} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
