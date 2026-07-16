import { notFound } from 'next/navigation';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { ScrollingBackdrop } from '@/components/site/ScrollingBackdrop';
import { AtmosphereBackground } from '@/components/site/AtmosphereBackground';
import { FilmGrain, Scanlines } from '@/components/site/CinematicFX';
import { CartDrawer } from '@/components/store/CartDrawer';
import { CategoryClient } from '@/components/store/CategoryClient';
import { getCollection, getProductsForCollection, COLLECTIONS } from '@/lib/products';
import { Toaster } from '@/components/ui/sonner';

export async function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const c = getCollection(slug);
  return { title: c ? `${c.title} — RatAttacK Store` : 'Collection — RatAttacK' };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();
  const products = getProductsForCollection(slug);

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
        <CategoryClient collection={collection} initialProducts={products} />
      </main>

      <Footer />
    </div>
  );
}
