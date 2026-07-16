import { notFound } from 'next/navigation';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { ScrollingBackdrop } from '@/components/site/ScrollingBackdrop';
import { AtmosphereBackground } from '@/components/site/AtmosphereBackground';
import { FilmGrain, Scanlines } from '@/components/site/CinematicFX';
import { CartDrawer } from '@/components/store/CartDrawer';
import { CategoryClient } from '@/components/store/CategoryClient';
import { EmptyStore } from '@/components/store/EmptyStore';
import { getCollection } from '@/lib/products';
import { getCollectionProductsLive } from '@/lib/shopify';
import { Toaster } from '@/components/ui/sonner';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const c = getCollection(slug);
  return { title: c ? `${c.title} — RatAttacK Store` : 'Collection — RatAttacK' };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const { products, empty } = await getCollectionProductsLive(slug, { first: 48 });

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
            <EmptyStore
              eyebrow={collection.title}
              title="Nothing In This Chamber Yet"
              message={`No products are currently listed in the ${collection.title} collection. Check back soon — items are added as raids conclude.`}
              ctas={[
                { href: '/store',         label: 'Back to Store', variant: 'primary' },
                { href: '/#community',    label: 'Join Discord',  variant: 'ghost' },
              ]}
            />
          </div>
        ) : (
          <CategoryClient collection={collection} initialProducts={products} />
        )}
      </main>

      <Footer />
    </div>
  );
}
