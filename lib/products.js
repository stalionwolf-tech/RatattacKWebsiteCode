/**
 * Product data & query helpers.
 *
 * Shape mirrors Shopify Storefront API `Product` node so we can swap this
 * module for a live GraphQL client later without touching the UI.
 */

export const CATEGORIES = [
  'All',
  'Booster Box',
  'Elite Trainer Box',
  'Booster Pack',
  'Single',
  'Mystery Pack',
  'Accessory',
  'Merchandise',
];

export const SORT_OPTIONS = [
  { value: 'featured',      label: 'Featured' },
  { value: 'price-asc',     label: 'Price: Low to High' },
  { value: 'price-desc',    label: 'Price: High to Low' },
  { value: 'title-asc',     label: 'Name: A → Z' },
  { value: 'title-desc',    label: 'Name: Z → A' },
  { value: 'newest',        label: 'Newest' },
];

/**
 * Availability is derived from `totalInventory` so the UI logic stays the
 * same when live Shopify inventory numbers arrive.
 */
function deriveAvailability(p) {
  if (!p.availableForSale) return 'coming_soon';
  if (p.totalInventory === 0) return 'coming_soon';
  if (p.totalInventory <= 5) return 'low_stock';
  return 'in_stock';
}

function P(input) {
  const currency = input.currency || 'USD';
  const p = {
    id: `gid://shopify/Product/${input.handle}`,
    handle: input.handle,
    title: input.title,
    vendor: input.vendor || 'RatAttacK',
    productType: input.productType,
    tags: input.tags || [],
    description: input.description,
    features: input.features || [],
    shipping: input.shipping || 'Ships within 2 business days from the US. Tracked shipping worldwide.',
    createdAt: input.createdAt || '2026-01-01T00:00:00Z',
    availableForSale: input.availableForSale ?? true,
    totalInventory: input.totalInventory ?? 20,
    // Shopify shape
    priceRange: {
      minVariantPrice: { amount: String(input.price), currencyCode: currency },
      maxVariantPrice: { amount: String(input.price), currencyCode: currency },
    },
    compareAtPrice: input.compareAtPrice ? { amount: String(input.compareAtPrice), currencyCode: currency } : null,
    featuredImage: {
      // Artwork rendered client-side via ProductArtwork based on `sigil` + `accent`.
      // When Shopify data arrives, replace with url from CDN.
      url: null,
      altText: input.title,
      sigil: input.sigil,
      accent: input.accent,
    },
    images: (input.images || [
      { sigil: input.sigil, accent: input.accent, variant: 'front' },
      { sigil: input.sigil, accent: input.accent, variant: 'back' },
      { sigil: input.sigil, accent: input.accent, variant: 'detail' },
    ]).map((im, i) => ({ url: null, altText: `${input.title} view ${i + 1}`, ...im })),
    variants: input.variants || [
      {
        id: `gid://shopify/ProductVariant/${input.handle}-default`,
        title: 'Default',
        price: { amount: String(input.price), currencyCode: currency },
        availableForSale: input.availableForSale ?? true,
        quantityAvailable: input.totalInventory ?? 20,
      },
    ],
  };
  p.availability = deriveAvailability(p);
  return p;
}

export const PRODUCTS = [
  P({
    handle: 'scarlet-violet-booster-box',
    title: 'Scarlet & Violet Booster Box',
    productType: 'Booster Box',
    vendor: 'Pokémon TCG',
    tags: ['booster-box', 'sealed', 'scarlet-violet'],
    price: 149.99,
    totalInventory: 18,
    sigil: 'coin',
    accent: 'crimson',
    createdAt: '2026-05-01T00:00:00Z',
    description: 'Sealed 36-pack booster box from the Scarlet & Violet base set. Each pack contains 10 cards with a guaranteed rare or better. A cornerstone box for collectors and drafters alike.',
    features: ['36 booster packs', 'Guaranteed rare per pack', 'Factory sealed', 'Authentic English print'],
  }),
  P({
    handle: 'journey-together-elite-trainer-box',
    title: 'Journey Together Elite Trainer Box',
    productType: 'Elite Trainer Box',
    vendor: 'Pokémon TCG',
    tags: ['elite-trainer-box', 'journey-together'],
    price: 59.99,
    totalInventory: 12,
    sigil: 'chalice',
    accent: 'amber',
    createdAt: '2026-04-15T00:00:00Z',
    description: 'The Journey Together Elite Trainer Box includes 9 booster packs, 65 card sleeves, energy cards, damage counters, and an exclusive foil promo card.',
    features: ['9 booster packs', '65 card sleeves', 'Foil promo card', 'Energy + damage counters'],
  }),
  P({
    handle: 'ratattack-mystery-pack',
    title: 'RatAttacK Mystery Pack',
    productType: 'Mystery Pack',
    tags: ['mystery', 'exclusive'],
    price: 29.99,
    totalInventory: 4,
    sigil: 'skull',
    accent: 'crimson-dark',
    createdAt: '2026-06-01T00:00:00Z',
    description: 'Hand-curated mystery pack straight from the Rat\'s hoard. Every pack contains a mix of holos, promos, and at least one card valued above pack price.',
    features: ['5–10 cards', '1 guaranteed holo', 'Value floor above pack cost', 'Curated by RatAttacK'],
  }),
  P({
    handle: 'crown-zenith-booster-bundle',
    title: 'Crown Zenith Booster Bundle',
    productType: 'Booster Pack',
    vendor: 'Pokémon TCG',
    tags: ['booster-bundle', 'crown-zenith'],
    price: 39.99,
    totalInventory: 24,
    sigil: 'crown',
    accent: 'gold',
    createdAt: '2026-03-20T00:00:00Z',
    description: 'A curated bundle of 6 Crown Zenith booster packs featuring some of the most sought-after Galarian Gallery cards.',
    features: ['6 booster packs', 'Galarian Gallery pulls possible', 'Factory sealed'],
  }),
  P({
    handle: 'charizard-vault-single',
    title: 'Charizard — Vault Grade Single',
    productType: 'Single',
    vendor: 'Pokémon TCG',
    tags: ['single', 'charizard', 'graded'],
    price: 349.00,
    compareAtPrice: 429.00,
    totalInventory: 1,
    sigil: 'skull',
    accent: 'crimson',
    createdAt: '2026-05-18T00:00:00Z',
    description: 'Vault-grade Charizard single. Sleeved, top-loaded, and shipped tracked & insured. Photos taken of the exact card you receive.',
    features: ['Exact card in photos', 'Sleeved + top loaded', 'Insured tracked shipping'],
  }),
  P({
    handle: 'ratattack-hoodie',
    title: 'RatAttacK Sigil Hoodie',
    productType: 'Merchandise',
    tags: ['apparel', 'hoodie'],
    price: 54.99,
    totalInventory: 0,
    availableForSale: false,
    sigil: 'shield',
    accent: 'crimson-dark',
    createdAt: '2026-06-10T00:00:00Z',
    description: 'Heavyweight midnight-black hoodie with an embroidered crimson RatAttacK sigil on the chest and a subtle rat-crest tag inside the hem.',
    features: ['Heavyweight cotton blend', 'Embroidered sigil', 'Interior branded tag'],
  }),
  P({
    handle: 'ratattack-mouse-pad',
    title: 'RatAttacK XL Desk Mat',
    productType: 'Merchandise',
    tags: ['accessory', 'desk'],
    price: 24.99,
    totalInventory: 0,
    availableForSale: false,
    sigil: 'scroll',
    accent: 'neutral',
    createdAt: '2026-06-11T00:00:00Z',
    description: 'Extra-large 900×400mm desk mat featuring the RatAttacK skyline artwork. Stitched edges, low-friction cloth top, non-slip rubber base.',
    features: ['900×400×4mm', 'Stitched edges', 'Non-slip rubber base'],
  }),
  P({
    handle: 'ultra-pro-sleeves-100',
    title: 'Ultra Pro Card Sleeves — 100ct',
    productType: 'Accessory',
    tags: ['sleeves', 'accessory'],
    price: 4.99,
    totalInventory: 45,
    sigil: 'scroll',
    accent: 'neutral',
    createdAt: '2026-02-11T00:00:00Z',
    description: 'Standard-size matte card sleeves. 100 count. Ideal for keeping your pulls pristine in a binder or top-loader.',
    features: ['Standard size', 'Matte finish', '100 count'],
  }),
  P({
    handle: 'top-loaders-25',
    title: 'Rigid Top-Loaders — 25ct',
    productType: 'Accessory',
    tags: ['top-loader', 'accessory'],
    price: 6.99,
    totalInventory: 30,
    sigil: 'shield',
    accent: 'neutral',
    createdAt: '2026-02-11T00:00:00Z',
    description: 'Ultra-clear rigid top-loaders in 3×4”. 25 count. Perfect for shipping singles safely or displaying your favorite hits.',
    features: ['3×4 inch', 'Ultra clear', '25 count'],
  }),
  P({
    handle: 'obsidian-flames-booster-box',
    title: 'Obsidian Flames Booster Box',
    productType: 'Booster Box',
    vendor: 'Pokémon TCG',
    tags: ['booster-box', 'obsidian-flames'],
    price: 139.99,
    totalInventory: 8,
    sigil: 'skull',
    accent: 'crimson-dark',
    createdAt: '2026-05-08T00:00:00Z',
    description: 'Sealed Obsidian Flames booster box. 36 packs of 10 cards each. A fan-favorite set with strong pull rates for Charizard ex.',
    features: ['36 booster packs', 'Charizard ex chase', 'Factory sealed'],
  }),
  P({
    handle: 'paradox-rift-booster-pack',
    title: 'Paradox Rift Booster Pack',
    productType: 'Booster Pack',
    vendor: 'Pokémon TCG',
    tags: ['booster-pack', 'paradox-rift'],
    price: 4.49,
    totalInventory: 60,
    sigil: 'chalice',
    accent: 'purple',
    createdAt: '2026-05-22T00:00:00Z',
    description: 'Single Paradox Rift booster pack. 10 cards per pack including one rare or better.',
    features: ['10 cards per pack', '1 rare guaranteed', 'Factory sealed'],
  }),
  P({
    handle: 'temporal-forces-etb',
    title: 'Temporal Forces Elite Trainer Box',
    productType: 'Elite Trainer Box',
    vendor: 'Pokémon TCG',
    tags: ['elite-trainer-box', 'temporal-forces'],
    price: 54.99,
    totalInventory: 10,
    sigil: 'crown',
    accent: 'gold',
    createdAt: '2026-04-30T00:00:00Z',
    description: 'Elite Trainer Box for Temporal Forces. Includes 9 packs, foil promo, sleeves, and full accessory kit.',
    features: ['9 booster packs', 'Foil promo card', '65 sleeves'],
  }),
];

// --- Query helpers (Shopify-shaped inputs/outputs) ---

export function getAllProducts() {
  return PRODUCTS;
}

export function getProductByHandle(handle) {
  return PRODUCTS.find((p) => p.handle === handle) || null;
}

export function getRelatedProducts(handle, limit = 4) {
  const current = getProductByHandle(handle);
  if (!current) return [];
  const sameType = PRODUCTS.filter((p) => p.handle !== handle && p.productType === current.productType);
  const others = PRODUCTS.filter((p) => p.handle !== handle && p.productType !== current.productType);
  return [...sameType, ...others].slice(0, limit);
}

export function queryProducts({ search = '', category = 'All', sort = 'featured' } = {}) {
  let list = [...PRODUCTS];
  if (category && category !== 'All') {
    list = list.filter((p) => p.productType === category);
  }
  const q = search.trim().toLowerCase();
  if (q) {
    list = list.filter((p) =>
      p.title.toLowerCase().includes(q) ||
      p.productType.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      (p.description || '').toLowerCase().includes(q)
    );
  }
  const priceOf = (p) => Number(p.priceRange.minVariantPrice.amount);
  switch (sort) {
    case 'price-asc':  list.sort((a, b) => priceOf(a) - priceOf(b)); break;
    case 'price-desc': list.sort((a, b) => priceOf(b) - priceOf(a)); break;
    case 'title-asc':  list.sort((a, b) => a.title.localeCompare(b.title)); break;
    case 'title-desc': list.sort((a, b) => b.title.localeCompare(a.title)); break;
    case 'newest':     list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')); break;
    default: break; // featured = original order
  }
  return list;
}

export function formatPrice(amount, currencyCode = 'USD') {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(Number(amount));
  } catch {
    return `$${Number(amount).toFixed(2)}`;
  }
}

export const AVAILABILITY_META = {
  in_stock:    { label: 'In Stock',    tint: 'text-emerald-300 border-emerald-800/70 bg-emerald-950/50' },
  low_stock:   { label: 'Low Stock',   tint: 'text-amber-300 border-amber-800/70 bg-amber-950/50' },
  coming_soon: { label: 'Coming Soon', tint: 'text-red-300 border-red-800/70 bg-red-950/50' },
};
