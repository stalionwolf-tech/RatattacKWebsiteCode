// Google Ads configuration + conversion helper.
//
// This is intentionally separate from the GA4 setup in app/layout.js. GA4 is
// loaded via @next/third-parties/google; this module only owns the Google Ads
// conversion tag (AW-...) and a safe helper for firing conversion events.

// The single Google Ads conversion/tag ID for this site.
export const GOOGLE_ADS_ID = 'AW-18384560257';

/**
 * Fire a Google Ads conversion event.
 *
 * Safely does nothing when gtag is unavailable (e.g. server-side, in dev where
 * the tag isn't loaded, on admin routes where the tag is intentionally
 * excluded, or when an ad-blocker has removed gtag).
 *
 * NOTE: `sendTo` must be a real conversion label from Google Ads in the form
 * `AW-18384560257/XXXXXXXXXXXXXXXXXXX`. Do not call this with a placeholder —
 * wire it up once you have the actual conversion label.
 *
 * @param {string} sendTo - The `send_to` target, e.g. `AW-18384560257/AbC-D_efGh`.
 * @param {object} [params] - Optional extra params (value, currency, transaction_id, etc.).
 */
export function trackGoogleAdsConversion(sendTo, params = {}) {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;
  if (!sendTo) return;

  window.gtag('event', 'conversion', {
    send_to: sendTo,
    ...params,
  });
}
