import { notFound } from 'next/navigation';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { ScrollingBackdrop } from '@/components/site/ScrollingBackdrop';
import { AtmosphereBackground } from '@/components/site/AtmosphereBackground';
import { FilmGrain, Scanlines } from '@/components/site/CinematicFX';
import { ProductDetail } from '@/components/store/ProductDetail';
import { getProductByHandle, PRODUCTS } from '@/lib/products';

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }) {
  const { handle } = await params;
  const product = getProductByHandle(handle);
  if (!product) return { title: 'Product Not Found — RatAttacK' };
  return {
    title: `${product.title} — RatAttacK Store`,
    description: (product.description || '').slice(0, 160),
  };
}

export default async function ProductPage({ params }) {
  const { handle } = await params;
  const product = getProductByHandle(handle);
  if (!product) notFound();

  return (
    <div className="relative min-h-screen bg-black text-neutral-100 overflow-x-hidden">
      <ScrollingBackdrop />
      <AtmosphereBackground />
      <FilmGrain />
      <Scanlines />
      <Navbar />

      <main className="relative z-10">
        <ProductDetail product={product} />
      </main>

      <Footer />
    </div>
  );
}
