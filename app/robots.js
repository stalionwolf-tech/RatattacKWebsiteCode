const SITE_URL = (process.env.NEXT_PUBLIC_BASE_URL || 'https://ratattack.gg').replace(/\/$/, '');

export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/account/', '/api/', '/cart', '/checkout', '/reset-password'] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
