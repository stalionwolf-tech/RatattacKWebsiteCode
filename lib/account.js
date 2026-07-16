/**
 * ------------------------------------------------------------
 * RatAttacK — Account helpers (SHAPES + LABELS only, no fake data).
 *
 * All customer data (orders, addresses, payment methods, wishlist) now
 * lives per-user in localStorage (see /app/lib/account-hooks.js) or comes
 * from Shopify Customer Accounts when that integration is wired.
 *
 * NEVER add fake customers, fake orders, or fake purchases here.
 * If a display needs data the user doesn't have yet, render an empty state.
 * ------------------------------------------------------------
 */

// UI tint mapping for order status pills. Purely presentational — the actual
// order STATE comes from Shopify Customer Accounts.
export const STATUS_TINT = {
  DELIVERED:  { label: 'Delivered',  bg: 'bg-emerald-950/50', text: 'text-emerald-300', ring: 'ring-emerald-700/50' },
  IN_TRANSIT: { label: 'In Transit', bg: 'bg-amber-950/50',   text: 'text-amber-300',   ring: 'ring-amber-700/50'   },
  PROCESSING: { label: 'Processing', bg: 'bg-red-950/50',     text: 'text-red-300',     ring: 'ring-red-700/50'     },
  PAID:       { label: 'Paid',       bg: 'bg-neutral-900/60', text: 'text-neutral-200', ring: 'ring-neutral-700/50' },
  CANCELLED:  { label: 'Cancelled',  bg: 'bg-neutral-900/60', text: 'text-neutral-500', ring: 'ring-neutral-800/50' },
};

export const STATUS_LABEL = {
  DELIVERED: 'Delivered',
  IN_TRANSIT: 'In Transit',
  PROCESSING: 'Processing',
  PAID: 'Paid',
  CANCELLED: 'Cancelled',
};
