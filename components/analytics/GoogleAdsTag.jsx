'use client';

// Google Ads global site tag (gtag.js).
//
// Loaded on the public storefront only. Authenticated admin routes (/admin/*)
// are intentionally excluded so no advertising/conversion tracking fires from
// the admin surface. Mirrors the GA4 gating in app/layout.js: only active in
// production so dev traffic never pollutes Ads data.
//
// This is a self-contained Google Ads tag (a different product from GA4). It
// uses the standard `window.dataLayer = window.dataLayer || []` guard, so it
// never clobbers a dataLayer already created by GA4 — they share the queue.

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { GOOGLE_ADS_ID } from '@/lib/google-ads';

export function GoogleAdsTag() {
  const pathname = usePathname();

  // Exclude authenticated admin routes from advertising tracking.
  const isAdminRoute = pathname === '/admin' || pathname?.startsWith('/admin/');

  const enabled = process.env.NODE_ENV === 'production' && !isAdminRoute;

  if (!enabled) return null;

  return (
    <>
      <Script
        id="google-ads-gtag-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
      />
      <Script id="google-ads-gtag-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GOOGLE_ADS_ID}');
        `}
      </Script>
    </>
  );
}
