// Next.js Metadata API sitemap → served as valid XML at /sitemap.xml (HTTP 200).
// The sitemap fetches Shopify collections/products at request time. Mark it
// explicitly dynamic so Vercel doesn't attempt to prerender it at build time
// (which would otherwise fail the build if Shopify is briefly unreachable).
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Canonical production origin (never the *.vercel.app deployment URL).
import { SITE_URL } from '@/lib/config';

// Static routes we always want indexed.
const ROUTES = [
  { path: '/',         priority: 1.0, changefreq: 'weekly' },
  { path: '/store',    priority: 0.9, changefreq: 'daily' },
  { path: '/faq',      priority: 0.6, changefreq: 'monthly' },
  { path: '/shipping', priority: 0.4, changefreq: 'yearly' },
  { path: '/returns',  priority: 0.4, changefreq: 'yearly' },
  { path: '/cookies',  priority: 0.3, changefreq: 'yearly' },
  { path: '/privacy',  priority: 0.3, changefreq: 'yearly' },
  { path: '/terms',    priority: 0.3, changefreq: 'yearly' },
  { path: '/login',    priority: 0.2, changefreq: 'yearly' },
  { path: '/signup',   priority: 0.2, changefreq: 'yearly' },
];

export default async function sitemap() {
  const now = new Date().toISOString();

  // 1. Static pages (homepage, shop page, legal/support pages).
  const base = ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changefreq,
    priority: r.priority,
  }));

  // 2. Shopify collection pages (/store/category/[handle]).
  let collectionEntries = [];
  try {
    const { getCollectionsLive } = await import('@/lib/shopify');
    const { collections } = await getCollectionsLive({ first: 100 });
    collectionEntries = (collections || []).map((c) => ({
      url: `${SITE_URL}/store/category/${c.handle}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch {
    /* Shopify unreachable — skip collection entries */
  }

  // 3. Shopify product pages (/store/product/[handle]).
  let productEntries = [];
  try {
    const { getAllProductsLive } = await import('@/lib/shopify');
    const { products } = await getAllProductsLive({ first: 250 });
    productEntries = (products || []).map((p) => ({
      url: `${SITE_URL}/store/product/${p.handle}`,
      lastModified: p.createdAt || now,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
  } catch {
    /* Shopify unreachable — skip product entries */
  }

  return [...base, ...collectionEntries, ...productEntries];
}
