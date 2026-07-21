// Next.js Metadata API robots endpoint → served at /robots.txt (HTTP 200).
// Always emits the canonical production domain for Host/Sitemap (never the
// *.vercel.app deployment URL).
import { SITE_URL } from '@/lib/config';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Non-indexable, private, or transactional routes.
        disallow: ['/account/', '/api/', '/cart', '/checkout', '/reset-password'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
