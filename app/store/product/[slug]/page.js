import { notFound } from 'next/navigation';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { ScrollingBackdrop } from '@/components/site/ScrollingBackdrop';
import { AtmosphereBackground } from '@/components/site/AtmosphereBackground';
import { FilmGrain, Scanlines } from '@/components/site/CinematicFX';
import { CartDrawer } from '@/components/store/CartDrawer';
import { ProductDetail } from '@/components/store/ProductDetail';
import { getProductByHandleLive, getAllProductsLive } from '@/lib/shopify';
import { Toaster } from '@/components/ui/sonner';
import { RecentlyViewed } from '@/components/store/RecentlyViewed';
import { RecordRecentlyViewed } from '@/components/store/RecordRecentlyViewed';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { product } = await getProductByHandleLive(slug);
  if (!product) return { title: 'Product — RatAttacK' };
  return { title: `${product.title} — RatAttacK Store`, description: (product.description || '').slice(0, 160) };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const { product } = await getProductByHandleLive(slug);
  if (!product) notFound();

  // Live siblings by productType from Shopify only.
  const { products: pool } = await getAllProductsLive({ first: 20 });
  let related = pool.filter((p) => p.handle !== slug && p.productType === product.productType).slice(0, 4);
  if (related.length < 4) {
    const filler = pool.filter((p) => p.handle !== slug && !related.some((r) => r.handle === p.handle));
    related = [...related, ...filler].slice(0, 4);
  }

  // Reviews come from Shopify eventually (via metafields or 3rd-party app).
  // For now, expose an empty review shape so the UI renders cleanly.
  const reviews = { average: 0, total: 0, breakdown: [0,0,0,0,0], items: [] };

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
        <RecordRecentlyViewed handle={product.handle} />
        <ProductDetail product={product} related={related} reviews={reviews} />
        <RecentlyViewed excludeHandle={product.handle} />
      </main>

      <Footer />
    </div>
  );
}
