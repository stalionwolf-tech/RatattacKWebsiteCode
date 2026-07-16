import { SITE_CONFIG } from '@/lib/config';

// The sitemap fetches Shopify products at request time. Mark explicitly dynamic
// so Vercel doesn't attempt to prerender it during the build phase.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Prefer NEXT_PUBLIC_BASE_URL, fall back to production domain constant.
const SITE_URL = (process.env.NEXT_PUBLIC_BASE_URL || 'https://ratattack.gg').replace(/\/$/, '');

// Static routes we always want indexed.
const ROUTES = [
  { path: '/',        priority: 1.0, changefreq: 'weekly' },
  { path: '/store',   priority: 0.9, changefreq: 'daily' },
  { path: '/faq',     priority: 0.6, changefreq: 'monthly' },
  { path: '/shipping',priority: 0.4, changefreq: 'yearly' },
  { path: '/returns', priority: 0.4, changefreq: 'yearly' },
  { path: '/cookies', priority: 0.3, changefreq: 'yearly' },
  { path: '/privacy', priority: 0.3, changefreq: 'yearly' },
  { path: '/terms',   priority: 0.3, changefreq: 'yearly' },
  { path: '/login',   priority: 0.2, changefreq: 'yearly' },
  { path: '/signup',  priority: 0.2, changefreq: 'yearly' },
];

export default async function sitemap() {
  const now = new Date().toISOString();
  const base = ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changefreq,
    priority: r.priority,
  }));

  // Dynamically include Shopify products when available.
  let productEntries = [];
  try {
    const { getAllProductsLive } = await import('@/lib/shopify');
    const { products } = await getAllProductsLive({ first: 100 });
    productEntries = products.map((p) => ({
      url: `${SITE_URL}/store/product/${p.handle}`,
      lastModified: p.createdAt || now,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
  } catch { /* Shopify unreachable — skip product entries */ }

  return [...base, ...productEntries];
}
