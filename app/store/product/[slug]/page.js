import { notFound } from 'next/navigation';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { ScrollingBackdrop } from '@/components/site/ScrollingBackdrop';
import { AtmosphereBackground } from '@/components/site/AtmosphereBackground';
import { FilmGrain, Scanlines } from '@/components/site/CinematicFX';
import { CartDrawer } from '@/components/store/CartDrawer';
import { ProductDetail } from '@/components/store/ProductDetail';
import { getProductByHandle, getRelatedProducts, getReviewsForProduct, PRODUCTS } from '@/lib/products';
import { Toaster } from '@/components/ui/sonner';

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.handle }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = getProductByHandle(slug);
  if (!p) return { title: 'Product — RatAttacK' };
  return { title: `${p.title} — RatAttacK Store`, description: (p.description || '').slice(0, 160) };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = getProductByHandle(slug);
  if (!product) notFound();
  const related = getRelatedProducts(slug, 4);
  const reviews = getReviewsForProduct(slug);

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
        <ProductDetail product={product} related={related} reviews={reviews} />
      </main>

      <Footer />
    </div>
  );
}
