/**
 * Product catalog + collections + reviews.
 *
 * Shape mirrors Shopify Storefront API so this file is the single point
 * of change when live data is wired in. All UI components read only from
 * the shapes returned here.
 */

export const COLLECTIONS = [
  { slug: 'pokemon-tcg',        title: 'Pokémon TCG',        productTypes: ['Booster Box', 'Elite Trainer Box', 'Booster Pack', 'Single', 'Mystery Pack'] },
  { slug: 'booster-boxes',      title: 'Booster Boxes',      productTypes: ['Booster Box'] },
  { slug: 'elite-trainer-boxes',title: 'Elite Trainer Boxes',productTypes: ['Elite Trainer Box'] },
  { slug: 'booster-packs',      title: 'Booster Packs',      productTypes: ['Booster Pack'] },
  { slug: 'singles',            title: 'Singles',            productTypes: ['Single'] },
  { slug: 'accessories',        title: 'Accessories',        productTypes: ['Accessory'] },
  { slug: 'merch',              title: 'Merch',              productTypes: ['Merchandise'] },
  { slug: 'mystery-packs',      title: 'Mystery Packs',      productTypes: ['Mystery Pack'] },
  { slug: 'new-arrivals',       title: 'New Arrivals',       filter: 'newArrivals' },
  { slug: 'sale',               title: 'Sale',               filter: 'onSale' },
  { slug: 'best-sellers',       title: 'Best Sellers',       filter: 'bestSellers' },
];

export const CATEGORIES = ['All', 'Booster Box', 'Elite Trainer Box', 'Booster Pack', 'Single', 'Mystery Pack', 'Accessory', 'Merchandise'];
export const RARITIES   = ['Common', 'Uncommon', 'Rare', 'Ultra Rare', 'Legendary', 'Mythic'];
export const BRANDS     = ['Pokémon TCG', 'RatAttacK', 'Ultra Pro'];
export const POKEMON_SETS = ['Scarlet & Violet', 'Journey Together', 'Crown Zenith', 'Obsidian Flames', 'Paradox Rift', 'Temporal Forces'];

export const SORT_OPTIONS = [
  { value: 'featured',   label: 'Featured' },
  { value: 'newest',     label: 'Newest' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'popular',    label: 'Popularity' },
  { value: 'best',       label: 'Best Selling' },
];

function deriveAvailability(p) {
  if (!p.availableForSale) return 'coming_soon';
  if (p.totalInventory === 0) return 'coming_soon';
  if (p.totalInventory <= 5) return 'low_stock';
  return 'in_stock';
}

function P(input) {
  const currency = input.currency || 'USD';
  const now = Date.now();
  const createdAt = input.createdAt || '2026-01-01T00:00:00Z';
  const daysOld = Math.max(1, (now - new Date(createdAt).getTime()) / 86_400_000);
  const p = {
    id: `gid://shopify/Product/${input.handle}`,
    handle: input.handle,
    slug: input.handle,
    title: input.title,
    vendor: input.vendor || 'RatAttacK',
    productType: input.productType,
    brand: input.brand || input.vendor || 'RatAttacK',
    pokemonSet: input.pokemonSet || null,
    rarity: input.rarity || null,
    tags: input.tags || [],
    collections: input.collections || [],
    description: input.description,
    features: input.features || [],
    specifications: input.specifications || [],
    shipping: input.shipping || 'Ships within 2 business days from the US. Tracked shipping worldwide.',
    returns: input.returns || '30-day returns on sealed & unused items. Singles are final sale unless graded product is misrepresented.',
    createdAt,
    isNew: daysOld <= 30,
    salesCount: input.salesCount ?? 0,
    availableForSale: input.availableForSale ?? true,
    totalInventory: input.totalInventory ?? 20,
    rating: input.rating ?? 4.6,
    reviewCount: input.reviewCount ?? 24,
    priceRange: {
      minVariantPrice: { amount: String(input.price), currencyCode: currency },
      maxVariantPrice: { amount: String(input.price), currencyCode: currency },
    },
    compareAtPrice: input.compareAtPrice ? { amount: String(input.compareAtPrice), currencyCode: currency } : null,
    featuredImage: { url: input.image || null, altText: input.title, sigil: input.sigil, accent: input.accent },
    hoverImage:    { url: input.hoverImage || null, altText: input.title + ' alternate', sigil: input.hoverSigil || input.sigil, accent: input.hoverAccent || input.accent },
    images: (input.images || [
      { url: input.image || null,      sigil: input.sigil, accent: input.accent, variant: 'front' },
      { url: input.hoverImage || null, sigil: input.hoverSigil || input.sigil, accent: input.hoverAccent || input.accent, variant: 'back' },
      { url: null,                     sigil: input.sigil, accent: input.accent, variant: 'detail' },
    ]).map((im, i) => ({ altText: `${input.title} view ${i + 1}`, ...im })),
    variants: input.variants || [
      { id: `${input.handle}-default`, title: 'Default', price: { amount: String(input.price), currencyCode: currency }, availableForSale: input.availableForSale ?? true, quantityAvailable: input.totalInventory ?? 20 },
    ],
    promo: input.promo || null,
  };
  p.availability = deriveAvailability(p);
  p.isOnSale = !!p.compareAtPrice && Number(p.compareAtPrice.amount) > Number(p.priceRange.minVariantPrice.amount);
  return p;
}

export const PRODUCTS = [
  P({ handle: 'scarlet-violet-booster-box', title: 'Scarlet & Violet Booster Box', productType: 'Booster Box', vendor: 'Pokémon TCG', brand: 'Pokémon TCG', pokemonSet: 'Scarlet & Violet', rarity: 'Ultra Rare', tags: ['booster-box','sealed'], collections: ['pokemon-tcg','booster-boxes','best-sellers'], price: 149.99, compareAtPrice: 179.99, totalInventory: 18, rating: 4.9, reviewCount: 187, salesCount: 320, sigil: 'coin', accent: 'crimson', hoverSigil: 'crown', hoverAccent: 'gold', createdAt: '2026-05-01T00:00:00Z', description: 'Sealed 36-pack Scarlet & Violet booster box. A cornerstone box for collectors and drafters alike.', features: ['36 booster packs','Guaranteed rare per pack','Factory sealed','Authentic English print'], specifications: [['Packs',36],['Cards per Pack',10],['Language','English'],['Sealed','Yes']] }),
  P({ handle: 'journey-together-elite-trainer-box', title: 'Journey Together Elite Trainer Box', productType: 'Elite Trainer Box', vendor: 'Pokémon TCG', brand: 'Pokémon TCG', pokemonSet: 'Journey Together', rarity: 'Rare', tags: ['elite-trainer-box'], collections: ['pokemon-tcg','elite-trainer-boxes','new-arrivals'], price: 59.99, totalInventory: 12, rating: 4.7, reviewCount: 92, salesCount: 140, sigil: 'chalice', accent: 'amber', hoverSigil: 'crown', hoverAccent: 'gold', createdAt: '2026-06-15T00:00:00Z', description: 'Journey Together ETB includes 9 packs, 65 sleeves, energies, damage counters, and an exclusive foil promo.', features: ['9 booster packs','65 card sleeves','Foil promo card','Energy + damage counters'], specifications: [['Packs',9],['Sleeves',65],['Promo','Foil']] }),
  P({ handle: 'ratattack-mystery-pack', title: 'RatAttacK Mystery Pack', productType: 'Mystery Pack', vendor: 'RatAttacK', tags: ['mystery','exclusive'], collections: ['mystery-packs','new-arrivals'], price: 29.99, totalInventory: 4, rating: 4.8, reviewCount: 56, salesCount: 210, sigil: 'skull', accent: 'crimson-dark', hoverSigil: 'coin', hoverAccent: 'crimson', createdAt: '2026-06-01T00:00:00Z', description: 'Hand-curated pack from the Rat\'s hoard. Every pack contains a mix of holos, promos, and at least one card valued above pack price.', features: ['5–10 cards','1 guaranteed holo','Value floor above pack cost','Curated by RatAttacK'], specifications: [['Cards','5–10'],['Guaranteed','1 Holo']] }),
  P({ handle: 'crown-zenith-booster-bundle', title: 'Crown Zenith Booster Bundle', productType: 'Booster Pack', vendor: 'Pokémon TCG', brand: 'Pokémon TCG', pokemonSet: 'Crown Zenith', rarity: 'Rare', tags: ['booster-bundle'], collections: ['pokemon-tcg','booster-packs','best-sellers'], price: 39.99, compareAtPrice: 49.99, totalInventory: 24, rating: 4.6, reviewCount: 74, salesCount: 180, sigil: 'crown', accent: 'gold', hoverSigil: 'chalice', hoverAccent: 'amber', createdAt: '2026-03-20T00:00:00Z', description: 'Bundle of 6 Crown Zenith packs featuring Galarian Gallery cards.', features: ['6 booster packs','Galarian Gallery pulls'], specifications: [['Packs',6],['Set','Crown Zenith']] }),
  P({ handle: 'charizard-vault-single', title: 'Charizard — Vault Grade Single', productType: 'Single', vendor: 'Pokémon TCG', brand: 'Pokémon TCG', pokemonSet: 'Obsidian Flames', rarity: 'Legendary', tags: ['single','charizard','graded'], collections: ['pokemon-tcg','singles','best-sellers'], price: 349.00, compareAtPrice: 429.00, totalInventory: 1, rating: 5.0, reviewCount: 41, salesCount: 60, sigil: 'skull', accent: 'crimson', hoverSigil: 'crown', hoverAccent: 'gold', createdAt: '2026-05-18T00:00:00Z', description: 'Vault-grade Charizard single. Sleeved, top-loaded, insured. Exact card in photos.', features: ['Exact card in photos','Sleeved + top loaded','Insured tracked shipping'], specifications: [['Set','Obsidian Flames'],['Condition','NM'],['Language','English']] }),
  P({ handle: 'ratattack-hoodie', title: 'RatAttacK Sigil Hoodie', productType: 'Merchandise', vendor: 'RatAttacK', tags: ['apparel','hoodie'], collections: ['merch','new-arrivals'], price: 54.99, totalInventory: 0, availableForSale: false, rating: 4.9, reviewCount: 12, salesCount: 40, sigil: 'shield', accent: 'crimson-dark', hoverSigil: 'skull', hoverAccent: 'crimson', createdAt: '2026-06-10T00:00:00Z', description: 'Heavyweight midnight-black hoodie with embroidered RatAttacK sigil.', features: ['Heavyweight cotton blend','Embroidered sigil','Interior branded tag'], specifications: [['Material','80% Cotton / 20% Poly'],['Weight','450 gsm']] }),
  P({ handle: 'ratattack-mouse-pad', title: 'RatAttacK XL Desk Mat', productType: 'Merchandise', vendor: 'RatAttacK', tags: ['accessory','desk'], collections: ['merch','new-arrivals'], price: 24.99, totalInventory: 0, availableForSale: false, rating: 4.7, reviewCount: 8, salesCount: 32, sigil: 'scroll', accent: 'neutral', hoverSigil: 'shield', hoverAccent: 'crimson-dark', createdAt: '2026-06-11T00:00:00Z', description: 'Extra-large 900×400mm desk mat with stitched edges.', features: ['900×400×4mm','Stitched edges','Non-slip rubber base'], specifications: [['Dimensions','900×400×4mm']] }),
  P({ handle: 'ultra-pro-sleeves-100', title: 'Ultra Pro Card Sleeves — 100ct', productType: 'Accessory', vendor: 'Ultra Pro', brand: 'Ultra Pro', tags: ['sleeves'], collections: ['accessories'], price: 4.99, totalInventory: 45, rating: 4.5, reviewCount: 320, salesCount: 900, sigil: 'scroll', accent: 'neutral', hoverSigil: 'shield', hoverAccent: 'neutral', createdAt: '2026-02-11T00:00:00Z', description: 'Standard matte card sleeves — 100 count.', features: ['Standard size','Matte finish','100 count'], specifications: [['Count',100],['Finish','Matte']] }),
  P({ handle: 'top-loaders-25', title: 'Rigid Top-Loaders — 25ct', productType: 'Accessory', vendor: 'Ultra Pro', brand: 'Ultra Pro', tags: ['top-loader'], collections: ['accessories'], price: 6.99, totalInventory: 30, rating: 4.7, reviewCount: 210, salesCount: 550, sigil: 'shield', accent: 'neutral', hoverSigil: 'scroll', hoverAccent: 'neutral', createdAt: '2026-02-11T00:00:00Z', description: 'Ultra-clear rigid top-loaders 3×4”, 25 count.', features: ['3×4 inch','Ultra clear','25 count'], specifications: [['Size','3×4 in'],['Count',25]] }),
  P({ handle: 'obsidian-flames-booster-box', title: 'Obsidian Flames Booster Box', productType: 'Booster Box', vendor: 'Pokémon TCG', brand: 'Pokémon TCG', pokemonSet: 'Obsidian Flames', rarity: 'Ultra Rare', tags: ['booster-box'], collections: ['pokemon-tcg','booster-boxes','sale'], price: 139.99, compareAtPrice: 169.99, totalInventory: 8, rating: 4.8, reviewCount: 130, salesCount: 260, sigil: 'skull', accent: 'crimson-dark', hoverSigil: 'coin', hoverAccent: 'crimson', createdAt: '2026-05-08T00:00:00Z', description: 'Sealed Obsidian Flames booster box. Charizard ex chase.', features: ['36 packs','Charizard ex chase','Factory sealed'], specifications: [['Packs',36]] }),
  P({ handle: 'paradox-rift-booster-pack', title: 'Paradox Rift Booster Pack', productType: 'Booster Pack', vendor: 'Pokémon TCG', brand: 'Pokémon TCG', pokemonSet: 'Paradox Rift', rarity: 'Rare', tags: ['booster-pack'], collections: ['pokemon-tcg','booster-packs'], price: 4.49, totalInventory: 60, rating: 4.4, reviewCount: 44, salesCount: 720, sigil: 'chalice', accent: 'purple', hoverSigil: 'crown', hoverAccent: 'purple', createdAt: '2026-05-22T00:00:00Z', description: 'Single Paradox Rift pack — 10 cards, 1 rare+ guaranteed.', features: ['10 cards','1 rare guaranteed'], specifications: [['Cards',10]] }),
  P({ handle: 'temporal-forces-etb', title: 'Temporal Forces Elite Trainer Box', productType: 'Elite Trainer Box', vendor: 'Pokémon TCG', brand: 'Pokémon TCG', pokemonSet: 'Temporal Forces', rarity: 'Rare', tags: ['etb'], collections: ['pokemon-tcg','elite-trainer-boxes'], price: 54.99, totalInventory: 10, rating: 4.6, reviewCount: 66, salesCount: 130, sigil: 'crown', accent: 'gold', hoverSigil: 'chalice', hoverAccent: 'amber', createdAt: '2026-04-30T00:00:00Z', description: 'Elite Trainer Box for Temporal Forces.', features: ['9 packs','Foil promo','65 sleeves'], specifications: [['Packs',9],['Sleeves',65]] }),
  P({ handle: 'pikachu-illustrator-single', title: 'Pikachu Illustrator — Reprint', productType: 'Single', vendor: 'Pokémon TCG', brand: 'Pokémon TCG', pokemonSet: 'Journey Together', rarity: 'Mythic', tags: ['single','pikachu'], collections: ['pokemon-tcg','singles','new-arrivals'], price: 199.00, totalInventory: 3, rating: 4.9, reviewCount: 18, salesCount: 45, sigil: 'crown', accent: 'gold', hoverSigil: 'coin', hoverAccent: 'crimson', createdAt: '2026-06-19T00:00:00Z', description: 'Officially licensed Illustrator reprint. Sleeved and top-loaded.', features: ['Sleeved','Top-loaded','Certificate included'], specifications: [['Language','English'],['Condition','NM']] }),
  P({ handle: 'ratattack-enamel-pin', title: 'RatAttacK Sigil Enamel Pin', productType: 'Merchandise', vendor: 'RatAttacK', tags: ['pin','accessory'], collections: ['merch','new-arrivals'], price: 14.99, totalInventory: 25, rating: 4.9, reviewCount: 22, salesCount: 90, sigil: 'shield', accent: 'crimson', hoverSigil: 'skull', hoverAccent: 'crimson-dark', createdAt: '2026-06-12T00:00:00Z', description: 'Hard enamel pin featuring the crimson RatAttacK sigil.', features: ['Hard enamel','Butterfly clutch','40mm'], specifications: [['Size','40mm'],['Backing','Butterfly']] }),
  P({ handle: 'binder-9pocket', title: '9-Pocket Zip Binder', productType: 'Accessory', vendor: 'Ultra Pro', brand: 'Ultra Pro', tags: ['binder'], collections: ['accessories'], price: 29.99, totalInventory: 22, rating: 4.7, reviewCount: 88, salesCount: 200, sigil: 'scroll', accent: 'neutral', hoverSigil: 'shield', hoverAccent: 'neutral', createdAt: '2026-03-01T00:00:00Z', description: '9-pocket zip binder holds 360 cards. Padded cover, YKK zipper.', features: ['9-pocket pages','360 cards','YKK zipper'], specifications: [['Pockets',9],['Capacity','360 cards']] }),
  P({ handle: 'ratattack-tee', title: 'RatAttacK Crest T-Shirt', productType: 'Merchandise', vendor: 'RatAttacK', tags: ['tshirt','apparel'], collections: ['merch','new-arrivals','sale'], price: 29.99, compareAtPrice: 34.99, totalInventory: 14, rating: 4.8, reviewCount: 34, salesCount: 110, sigil: 'shield', accent: 'crimson', hoverSigil: 'crown', hoverAccent: 'gold', createdAt: '2026-06-05T00:00:00Z', description: 'Midweight black t-shirt with a subtle RatAttacK crest print.', features: ['100% cotton','Ring-spun','Screen printed'], specifications: [['Material','100% Cotton']] }),
];

// --- Query helpers (Shopify-shape input/output) ---

export function getAllProducts() { return PRODUCTS; }
export function getProductByHandle(handle) { return PRODUCTS.find((p) => p.handle === handle) || null; }
export function getCollection(slug) { return COLLECTIONS.find((c) => c.slug === slug) || null; }

export function getProductsForCollection(slug) {
  const c = getCollection(slug);
  if (!c) return [];
  if (c.filter === 'newArrivals') return PRODUCTS.filter((p) => p.isNew);
  if (c.filter === 'onSale')      return PRODUCTS.filter((p) => p.isOnSale);
  if (c.filter === 'bestSellers') return [...PRODUCTS].sort((a, b) => b.salesCount - a.salesCount).slice(0, 12);
  return PRODUCTS.filter((p) => p.collections.includes(slug) || (c.productTypes && c.productTypes.includes(p.productType)));
}

export function getRelatedProducts(handle, limit = 4) {
  const current = getProductByHandle(handle);
  if (!current) return [];
  const same = PRODUCTS.filter((p) => p.handle !== handle && p.productType === current.productType);
  const other = PRODUCTS.filter((p) => p.handle !== handle && p.productType !== current.productType);
  return [...same, ...other].slice(0, limit);
}

export function searchProducts(query, limit = 8) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return [];
  return PRODUCTS.filter((p) =>
    p.title.toLowerCase().includes(q) ||
    p.productType.toLowerCase().includes(q) ||
    (p.pokemonSet || '').toLowerCase().includes(q) ||
    p.tags.some((t) => t.toLowerCase().includes(q)) ||
    (p.brand || '').toLowerCase().includes(q)
  ).slice(0, limit);
}

export function queryProducts({ search = '', category = 'All', collection = null, sort = 'featured', priceMin = 0, priceMax = Infinity, availability = null, rarity = null, brand = null, pokemonSet = null } = {}) {
  let list = collection ? getProductsForCollection(collection) : [...PRODUCTS];
  if (category && category !== 'All') list = list.filter((p) => p.productType === category);
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
  list = list.filter((p) => priceOf(p) >= priceMin && priceOf(p) <= priceMax);
  if (availability) list = list.filter((p) => p.availability === availability);
  if (rarity)      list = list.filter((p) => p.rarity === rarity);
  if (brand)       list = list.filter((p) => p.brand === brand);
  if (pokemonSet)  list = list.filter((p) => p.pokemonSet === pokemonSet);
  switch (sort) {
    case 'price-asc':  list.sort((a, b) => priceOf(a) - priceOf(b)); break;
    case 'price-desc': list.sort((a, b) => priceOf(b) - priceOf(a)); break;
    case 'newest':     list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')); break;
    case 'popular':    list.sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount)); break;
    case 'best':       list.sort((a, b) => b.salesCount - a.salesCount); break;
    default: break;
  }
  return list;
}

export function formatPrice(amount, currencyCode = 'USD') {
  try { return new Intl.NumberFormat('en-US', { style: 'currency', currency: currencyCode }).format(Number(amount)); }
  catch { return `$${Number(amount).toFixed(2)}`; }
}

export const AVAILABILITY_META = {
  in_stock:    { label: 'In Stock',    tint: 'text-emerald-300 border-emerald-800/70 bg-emerald-950/50' },
  low_stock:   { label: 'Low Stock',   tint: 'text-amber-300 border-amber-800/70 bg-amber-950/50' },
  coming_soon: { label: 'Coming Soon', tint: 'text-red-300 border-red-800/70 bg-red-950/50' },
};

export const CURRENT_PROMOS = [
  { title: 'Save 15% on Booster Boxes', description: 'Sealed product for a limited time. No code required.', href: '/store/category/booster-boxes', badge: 'SALE', accent: 'from-red-900/40' },
  { title: 'New RatAttacK Merch', description: 'Fresh hoodies, tees, pins, and desk mats — forged for the horde.', href: '/store/category/merch', badge: 'NEW', accent: 'from-amber-900/40' },
  { title: 'Free shipping over $75', description: 'US orders. Tracked & insured.', href: '#', badge: 'PERK', accent: 'from-emerald-900/40' },
];

// --- Mock reviews (per product handle) ---
const REVIEW_TEMPLATES = [
  { author: 'Ratsalot',       verified: true,  rating: 5, title: 'Pulls were insane.', body: 'Cracked open the whole box on stream — hit three alt-arts. Packaging was pristine, arrived faster than expected.' },
  { author: 'GoblinRider',    verified: true,  rating: 4, title: 'Legit product.', body: 'Sealed and authentic. Would’ve given 5 stars but I wanted more chase cards.' },
  { author: 'ChaliceQueen',   verified: false, rating: 5, title: 'Solid value.', body: 'This is my third order and each one has been a great experience. Highly recommend.' },
  { author: 'DragonKnight',   verified: true,  rating: 5, title: 'Best mystery pack ever.', body: 'Way over pack cost in value. Two holos and a promo.' },
  { author: 'ObsidianMage',   verified: true,  rating: 4, title: 'Great condition.', body: 'Card was in near-mint condition as advertised. Fast tracked shipping.' },
];
export function getReviewsForProduct(handle) {
  const p = getProductByHandle(handle);
  if (!p) return { average: 0, total: 0, breakdown: [0,0,0,0,0], items: [] };
  const seed = handle.length;
  const items = REVIEW_TEMPLATES.map((t, i) => ({
    id: `${handle}-r${i}`,
    author: t.author,
    verified: t.verified,
    rating: t.rating,
    title: t.title,
    body: t.body,
    date: new Date(2026, 5, 1 + ((seed + i * 3) % 25)).toISOString(),
    helpful: 3 + ((seed + i) % 12),
    images: i === 0 ? [{ sigil: p.featuredImage.sigil, accent: p.featuredImage.accent }] : [],
  }));
  const breakdown = [5,4,3,2,1].map((star) => items.filter((r) => r.rating === star).length);
  const total = items.length;
  const average = total ? (items.reduce((s, r) => s + r.rating, 0) / total) : 0;
  return { average: Number(average.toFixed(1)), total, breakdown, items };
}
