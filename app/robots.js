// Next.js Metadata API robots endpoint → served at /robots.txt (HTTP 200).
// Defaults to the production domain; honors NEXT_PUBLIC_BASE_URL when set.
const SITE_URL = (process.env.NEXT_PUBLIC_BASE_URL || 'https://ratattacktcg.com').replace(/\/$/, '');

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
