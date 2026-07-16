/**
 * ------------------------------------------------------------
 * RatAttacK — Store UI helpers ONLY.
 *
 * All product/collection/filter data now comes exclusively from Shopify
 * via /app/lib/shopify.js. This file holds ONLY presentation constants and
 * pure formatters. If you find yourself adding a product name, price, or
 * collection here, stop and add it in Shopify Admin instead.
 * ------------------------------------------------------------
 */

// Price formatter — pure utility, no product data.
export function formatPrice(amount, currency = 'USD', locale = 'en-US') {
  const n = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (!Number.isFinite(n)) return '—';
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(n);
}

// UI tint metadata used by ProductCard / ProductDetail / wishlist to color the
// availability pill. Purely presentational — the availability VALUE itself
// comes from Shopify (`availableForSale` / `totalInventory`).
export const AVAILABILITY_META = {
  in_stock:    { label: 'In Stock',     tint: 'text-emerald-400', bg: 'bg-emerald-950/40', ring: 'ring-emerald-800/40' },
  low_stock:   { label: 'Low Stock',    tint: 'text-amber-400',   bg: 'bg-amber-950/40',   ring: 'ring-amber-800/40'   },
  coming_soon: { label: 'Coming Soon',  tint: 'text-red-400',     bg: 'bg-red-950/40',     ring: 'ring-red-800/40'     },
  sold_out:    { label: 'Sold Out',     tint: 'text-neutral-400', bg: 'bg-neutral-900/60', ring: 'ring-neutral-800/40' },
};

// UI sort options for storefront listing pages. Purely a label → key mapping;
// the actual sorting is done in the client component.
export const SORT_OPTIONS = [
  { value: 'featured',   label: 'Featured' },
  { value: 'newest',     label: 'Newest' },
  { value: 'price-asc',  label: 'Price — Low to High' },
  { value: 'price-desc', label: 'Price — High to Low' },
  { value: 'popular',    label: 'Most Popular' },
  { value: 'best',       label: 'Best Sellers' },
];

// Marketing / promo strip (e.g. "Free shipping over $150"). Pure UI content,
// NOT product data. Move to Shopify metaobjects if you want editors to update.
export const CURRENT_PROMOS = [
  { id: 'p-ship',  badge: 'Free Shipping',      title: 'Ships free over $150',    description: 'Every U.S. order above $150 ships with tracked priority mail — no extra rune required.', href: '/shipping',        accent: 'from-red-950/60' },
  { id: 'p-drop',  badge: 'Weekly Drops',       title: 'Fresh drops every Friday', description: 'New sealed product and singles hit the vault Fridays at 20:00 UTC. First raiders get first picks.', href: '/store',           accent: 'from-amber-950/60' },
  { id: 'p-horde', badge: 'Rat Horde',          title: 'Discord gets first dibs',  description: 'Join the horde on Discord to hear about restocks, giveaways, and vault-only singles before anyone else.', href: '/#community', accent: 'from-neutral-900/60' },
];

// -----------------------------------------------------------
// Backward-compat null-safe helpers.
// Some legacy call-sites (cart/wishlist/account enrichment) call these to
// decorate an item with rich mock data. Now that Shopify is the only source,
// they simply return null and the caller falls back to whatever fields the
// item itself already carries (image sigil/accent, title, price stored in cart).
// -----------------------------------------------------------
export function getProductByHandle() { return null; }
export function getCollection()      { return null; }
