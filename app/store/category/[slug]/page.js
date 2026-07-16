import { notFound } from 'next/navigation';
import { Navbar } from '@/components/site/Navbar';
import { Footer } from '@/components/site/Footer';
import { ScrollingBackdrop } from '@/components/site/ScrollingBackdrop';
import { AtmosphereBackground } from '@/components/site/AtmosphereBackground';
import { FilmGrain, Scanlines } from '@/components/site/CinematicFX';
import { CartDrawer } from '@/components/store/CartDrawer';
import { CategoryClient } from '@/components/store/CategoryClient';
import { EmptyStore } from '@/components/store/EmptyStore';
import { getCollectionProductsLive } from '@/lib/shopify';
import { getCollectionMetaLive } from '@/lib/shopify-extras';
import { DISCORD_INVITE_URL } from '@/lib/config';
import { Toaster } from '@/components/ui/sonner';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const meta = await getCollectionMetaLive(slug);
  return { title: meta ? `${meta.title} — RatAttacK Store` : 'Collection — RatAttacK' };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;

  // Collection metadata + its products, both from Shopify.
  const [meta, { products, empty, collectionFound }] = await Promise.all([
    getCollectionMetaLive(slug),
    getCollectionProductsLive(slug, { first: 100 }),
  ]);

  // If Shopify has no such collection at all, 404.
  if (!meta && collectionFound === false) notFound();

  const collection = meta || { slug, handle: slug, title: slug.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase()), description: '' };

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
                { href: '/store',           label: 'Back to Store', variant: 'primary' },
                { href: DISCORD_INVITE_URL, label: 'Join Discord',  variant: 'ghost', external: true },
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
