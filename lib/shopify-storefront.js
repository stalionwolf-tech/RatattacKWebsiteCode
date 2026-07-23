/**
 * ============================================================
 *  RatAttacK — Shopify service (single source of truth).
 * ============================================================
 *
 *  Shopify is the ONLY source of product/collection/inventory data
 *  used anywhere in the app. This module owns:
 *
 *    • GraphQL client (Storefront API, and Admin API for newsletter)
 *    • Product / collection / cart queries
 *    • Adapter that maps Shopify's response into the shape our UI expects
 *    • Filter option derivation from live products
 *    • Newsletter subscription via customerCreate
 *
 *  Only these environment variables are ever read (no hardcoding):
 *    - SHOPIFY_STORE_DOMAIN
 *    - SHOPIFY_STOREFRONT_PUBLIC_TOKEN  — required for products/cart
 *    - SHOPIFY_STOREFRONT_PRIVATE_TOKEN — optional; enables Admin-side ops
 *    - SHOPIFY_API_VERSION              — defaults to 2025-01
 *
 *  If Shopify returns no products, callers receive an empty array
 *  (never mock data). Pages then render polished empty states.
 * ============================================================
 */

// -----------------------------------------------------------
// Env configuration
// -----------------------------------------------------------
const DOMAIN  = process.env.SHOPIFY_STORE_DOMAIN;
// Accept both new and legacy variable names during transition.
const PUBLIC_TOKEN =
  process.env.SHOPIFY_STOREFRONT_PUBLIC_TOKEN ||
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const PRIVATE_TOKEN =
  process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN ||
  process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const VERSION = process.env.SHOPIFY_API_VERSION || '2025-01';

const STOREFRONT_ENDPOINT = DOMAIN ? `https://${DOMAIN}/api/${VERSION}/graphql.json`           : null;
const ADMIN_ENDPOINT      = DOMAIN ? `https://${DOMAIN}/admin/api/${VERSION}/graphql.json`     : null;

export const shopifyEnabled       = Boolean(DOMAIN && PUBLIC_TOKEN);
export const shopifyAdminEnabled  = Boolean(DOMAIN && PRIVATE_TOKEN);

// -----------------------------------------------------------
// Low-level fetch wrappers
// -----------------------------------------------------------
async function shopifyFetchInternal(endpoint, token, tokenHeader, query, variables = {}, opts = {}) {
  if (!endpoint || !token) throw new Error('Shopify env vars not configured');
  const { cache = 'no-store', revalidate } = opts;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', [tokenHeader]: token },
    body: JSON.stringify({ query, variables }),
    ...(revalidate !== undefined ? { next: { revalidate } } : { cache }),
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { throw new Error(`Shopify non-JSON response (${res.status}): ${text.slice(0, 200)}`); }
  if (!res.ok) throw new Error(`Shopify HTTP ${res.status}: ${JSON.stringify(json)}`);
  if (json.errors?.length) throw new Error(`Shopify GraphQL errors: ${JSON.stringify(json.errors)}`);
  return json.data;
}

export async function shopifyFetch(query, variables = {}, opts = {}) {
  return shopifyFetchInternal(STOREFRONT_ENDPOINT, PUBLIC_TOKEN, 'X-Shopify-Storefront-Access-Token', query, variables, opts);
}

export async function shopifyAdminFetch(query, variables = {}, opts = {}) {
  return shopifyFetchInternal(ADMIN_ENDPOINT, PRIVATE_TOKEN, 'X-Shopify-Access-Token', query, variables, opts);
}

// -----------------------------------------------------------
// GraphQL fragments / queries / mutations
// -----------------------------------------------------------
const PRODUCT_FIELDS = `
  id
  handle
  title
  descriptionHtml
  description
  vendor
  productType
  tags
  availableForSale
  totalInventory
  createdAt
  featuredImage { url altText width height }
  images(first: 6) { edges { node { url altText width height } } }
  priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }
  compareAtPriceRange { minVariantPrice { amount currencyCode } }
  options { name values }
  variants(first: 25) {
    edges {
      node {
        id
        title
        availableForSale
        quantityAvailable
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
        selectedOptions { name value }
      }
    }
  }
`;

const PRODUCTS_QUERY = `
  query Products($first: Int!, $after: String, $query: String, $sortKey: ProductSortKeys) {
    products(first: $first, after: $after, query: $query, sortKey: $sortKey) {
      pageInfo { hasNextPage endCursor }
      edges { cursor node { ${PRODUCT_FIELDS} } }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query ProductByHandle($handle: String!) { product(handle: $handle) { ${PRODUCT_FIELDS} } }
`;

const COLLECTION_QUERY = `
  query Collection($handle: String!, $first: Int!, $after: String) {
    collection(handle: $handle) {
      id handle title descriptionHtml image { url altText }
      products(first: $first, after: $after) {
        pageInfo { hasNextPage endCursor }
        edges { cursor node { ${PRODUCT_FIELDS} } }
      }
    }
  }
`;

const COLLECTIONS_LIST_QUERY = `
  query Collections($first: Int!) {
    collections(first: $first, sortKey: TITLE) {
      edges { node { id handle title description image { url altText } } }
    }
  }
`;

const COLLECTION_META_QUERY = `
  query CollectionMeta($handle: String!) {
    collection(handle: $handle) { id handle title description image { url altText } }
  }
`;

const FEATURED_QUERY = `
  query Featured($first: Int!) {
    collection(handle: "featured") {
      products(first: $first, sortKey: COLLECTION_DEFAULT) {
        edges { node { ${PRODUCT_FIELDS} } }
      }
    }
  }
`;

const CART_FIELDS = `
  id checkoutUrl totalQuantity createdAt updatedAt
  cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } totalTaxAmount { amount currencyCode } }
  lines(first: 100) {
    edges { node { id quantity merchandise { ... on ProductVariant {
      id title price { amount currencyCode }
      product { handle title featuredImage { url altText } }
    } } } }
  }
`;

const CART_CREATE_MUTATION = `
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) { cart { ${CART_FIELDS} } userErrors { field message } }
  }
`;

const CUSTOMER_CREATE_STOREFRONT = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer { id email acceptsMarketing }
      customerUserErrors { code field message }
    }
  }
`;

// -----------------------------------------------------------
// Adapter: Shopify Product -> internal product shape
// -----------------------------------------------------------
const SIGIL_BY_TYPE = {
  'Booster Box':        { sigil: 'coin',    accent: 'crimson' },
  'Elite Trainer Box':  { sigil: 'chalice', accent: 'amber' },
  'Booster Pack':       { sigil: 'crown',   accent: 'gold' },
  'Single':             { sigil: 'skull',   accent: 'crimson' },
  'Mystery Pack':       { sigil: 'skull',   accent: 'crimson-dark' },
  'Accessory':          { sigil: 'scroll',  accent: 'neutral' },
  'Merchandise':        { sigil: 'shield',  accent: 'crimson-dark' },
  __default:            { sigil: 'coin',    accent: 'crimson' },
};
const sigilFor = (type) => SIGIL_BY_TYPE[type] || SIGIL_BY_TYPE.__default;

// Tags of the form `sigil:crown`, `accent:gold`, `set:Journey Together`,
// `rarity:Ultra Rare`, `brand:RatAttacK` let the merchant tune presentation
// entirely from Shopify Admin — no code changes required.
function parseTagOverrides(tags = []) {
  const map = {};
  for (const t of tags) {
    const [k, ...rest] = String(t).split(':');
    if (rest.length) map[k.trim().toLowerCase()] = rest.join(':').trim();
  }
  return map;
}

export function adaptProduct(node) {
  if (!node) return null;
  const images = node.images?.edges?.map((e) => e.node) || [];
  const featured = node.featuredImage || images[0] || null;
  const variants = (node.variants?.edges || []).map((e) => ({
    id: e.node.id,
    title: e.node.title,
    availableForSale: e.node.availableForSale,
    quantityAvailable: e.node.quantityAvailable ?? 0,
    price: { amount: String(e.node.price?.amount ?? '0'), currencyCode: e.node.price?.currencyCode || 'USD' },
    compareAtPrice: e.node.compareAtPrice ? { amount: String(e.node.compareAtPrice.amount), currencyCode: e.node.compareAtPrice.currencyCode } : null,
    selectedOptions: e.node.selectedOptions || [],
  }));
  const priceMin = node.priceRange?.minVariantPrice;
  const priceMax = node.priceRange?.maxVariantPrice;
  const compareMin = node.compareAtPriceRange?.minVariantPrice;
  const overrides = parseTagOverrides(node.tags);
  const type = node.productType || 'Merchandise';
  const { sigil, accent } = sigilFor(type);
  const finalSigil  = overrides.sigil  || sigil;
  const finalAccent = overrides.accent || accent;
  const totalInventory = node.totalInventory ?? variants.reduce((s, v) => s + (v.quantityAvailable || 0), 0);
  const availability = !node.availableForSale || totalInventory === 0 ? 'coming_soon' : (totalInventory <= 5 ? 'low_stock' : 'in_stock');
  const compareAmount = compareMin?.amount ? Number(compareMin.amount) : null;
  const priceAmount   = priceMin?.amount   ? Number(priceMin.amount)   : 0;
  const isOnSale = compareAmount != null && compareAmount > priceAmount;

  return {
    id: node.id,
    handle: node.handle,
    slug: node.handle,
    title: node.title,
    vendor: node.vendor || '',
    productType: type,
    brand: overrides.brand || node.vendor || '',
    pokemonSet: overrides.set || overrides.pokemonset || null,
    rarity: overrides.rarity || null,
    tags: node.tags || [],
    collections: [],
    description: node.description || (node.descriptionHtml ? node.descriptionHtml.replace(/<[^>]+>/g, '') : ''),
    descriptionHtml: node.descriptionHtml || '',
    features: [],
    specifications: [],
    shipping: 'Ships from RatAttacK HQ. Tracked shipping via Shopify.',
    returns: '30-day returns on sealed & unused items. Singles are final sale unless misrepresented.',
    createdAt: node.createdAt || new Date().toISOString(),
    isNew: node.createdAt ? (Date.now() - new Date(node.createdAt).getTime()) / 86_400_000 <= 30 : false,
    salesCount: 0,
    availableForSale: !!node.availableForSale,
    totalInventory,
    rating: 0,
    reviewCount: 0,
    priceRange: {
      minVariantPrice: { amount: String(priceAmount || 0), currencyCode: priceMin?.currencyCode || 'USD' },
      maxVariantPrice: { amount: String(priceMax?.amount || priceAmount || 0), currencyCode: priceMax?.currencyCode || 'USD' },
    },
    compareAtPrice: compareAmount != null ? { amount: String(compareAmount), currencyCode: compareMin?.currencyCode || 'USD' } : null,
    isOnSale,
    featuredImage: { url: featured?.url || null, altText: featured?.altText || node.title, sigil: finalSigil, accent: finalAccent },
    hoverImage:    { url: images[1]?.url || null, altText: images[1]?.altText || `${node.title} alternate`, sigil: finalSigil, accent: finalAccent },
    images: images.length ? images.map((im, i) => ({ url: im.url, altText: im.altText || `${node.title} view ${i + 1}`, sigil: finalSigil, accent: finalAccent, variant: ['front','back','detail','angle','angle2','angle3'][i] || 'view' }))
                          : [{ url: null, altText: node.title, sigil: finalSigil, accent: finalAccent, variant: 'front' }],
    variants,
    availability,
    promo: null,
    source: 'shopify',
  };
}

export function adaptCollection(c) {
  if (!c) return null;
  return {
    id: c.id,
    slug: c.handle,
    handle: c.handle,
    title: c.title,
    description: c.description || '',
    image: c.image?.url || null,
    imageAlt: c.image?.altText || c.title,
  };
}

// -----------------------------------------------------------
// Read helpers — Shopify only, no mock fallback.
// -----------------------------------------------------------
export async function getAllProductsLive({ first = 50 } = {}) {
  if (!shopifyEnabled) return { products: [], source: 'shopify', empty: true };
  try {
    const data = await shopifyFetch(PRODUCTS_QUERY, { first }, { cache: 'no-store' });
    const nodes = (data.products?.edges || []).map((e) => e.node);
    return { products: nodes.map(adaptProduct), source: 'shopify', empty: nodes.length === 0 };
  } catch (e) {
    console.warn('[shopify] getAllProductsLive failed:', e.message);
    return { products: [], source: 'shopify', empty: true, error: e.message };
  }
}

export async function getProductByHandleLive(handle) {
  if (!shopifyEnabled) return { product: null, source: 'shopify' };
  try {
    const data = await shopifyFetch(PRODUCT_BY_HANDLE_QUERY, { handle }, { cache: 'no-store' });
    return { product: data.product ? adaptProduct(data.product) : null, source: 'shopify' };
  } catch (e) {
    console.warn('[shopify] getProductByHandleLive failed:', e.message);
    return { product: null, source: 'shopify', error: e.message };
  }
}

export async function getCollectionProductsLive(handle, { first = 24 } = {}) {
  if (!shopifyEnabled) return { products: [], source: 'shopify', empty: true, collectionFound: false };
  try {
    const data = await shopifyFetch(COLLECTION_QUERY, { handle, first }, { cache: 'no-store' });
    const nodes = (data.collection?.products?.edges || []).map((e) => e.node);
    return {
      products: nodes.map(adaptProduct),
      source: 'shopify',
      empty: nodes.length === 0,
      title: data.collection?.title,
      collectionFound: !!data.collection,
    };
  } catch (e) {
    console.warn('[shopify] getCollectionProductsLive failed:', e.message);
    return { products: [], source: 'shopify', empty: true, collectionFound: false, error: e.message };
  }
}

export async function getCollectionsLive({ first = 30 } = {}) {
  if (!shopifyEnabled) return { collections: [], empty: true };
  try {
    const data = await shopifyFetch(COLLECTIONS_LIST_QUERY, { first }, { cache: 'no-store' });
    const nodes = (data.collections?.edges || []).map((e) => e.node);
    return { collections: nodes.map(adaptCollection), empty: nodes.length === 0 };
  } catch (e) {
    console.warn('[shopify] getCollectionsLive failed:', e.message);
    return { collections: [], empty: true, error: e.message };
  }
}

export async function getCollectionMetaLive(handle) {
  if (!shopifyEnabled) return null;
  try {
    const data = await shopifyFetch(COLLECTION_META_QUERY, { handle }, { cache: 'no-store' });
    return data.collection ? adaptCollection(data.collection) : null;
  } catch { return null; }
}

/**
 * Featured products — pulls from the `featured` collection when it exists,
 * otherwise falls back to newest products from the store.
 */
export async function getFeaturedProductsLive({ first = 6 } = {}) {
  if (!shopifyEnabled) return { products: [], empty: true };
  try {
    const data = await shopifyFetch(FEATURED_QUERY, { first }, { cache: 'no-store' });
    const nodes = data.collection?.products?.edges?.map((e) => e.node) || [];
    if (nodes.length) return { products: nodes.map(adaptProduct), empty: false, source: 'featured-collection' };
    const { products } = await getAllProductsLive({ first: Math.max(first, 12) });
    const newest = [...products].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')).slice(0, first);
    return { products: newest, empty: newest.length === 0, source: 'newest-fallback' };
  } catch (e) {
    console.warn('[shopify] getFeaturedProductsLive failed:', e.message);
    return { products: [], empty: true, error: e.message };
  }
}

/** Products currently on sale (Shopify compareAtPrice > current price). */
export async function getSaleProductsLive({ first = 24 } = {}) {
  const { products } = await getAllProductsLive({ first: Math.max(first, 60) });
  const onSale = products.filter((p) => p.isOnSale);
  return { products: onSale.slice(0, first), empty: onSale.length === 0 };
}

/**
 * Filter option lists derived from live products. Never hardcoded — whatever
 * tags/types/vendors your Shopify catalog carries becomes the available filters.
 */
export function deriveFilterOptions(products = []) {
  const productTypes = new Set();
  const vendors = new Set();
  const tagSet  = new Set();
  const rarities = new Set();
  const sets = new Set();
  const brands = new Set();
  for (const p of products) {
    if (p.productType) productTypes.add(p.productType);
    if (p.vendor)      vendors.add(p.vendor);
    if (p.brand)       brands.add(p.brand);
    if (p.rarity)      rarities.add(p.rarity);
    if (p.pokemonSet)  sets.add(p.pokemonSet);
    for (const t of (p.tags || [])) if (t && !t.includes(':')) tagSet.add(t);
  }
  return {
    productTypes: Array.from(productTypes).sort(),
    vendors:      Array.from(vendors).sort(),
    brands:       Array.from(brands).sort(),
    rarities:     Array.from(rarities).sort(),
    sets:         Array.from(sets).sort(),
    tags:         Array.from(tagSet).sort(),
  };
}

// -----------------------------------------------------------
// Cart create → returns real Shopify hosted checkoutUrl
// -----------------------------------------------------------
export async function createCheckoutCart(lines = []) {
  if (!shopifyEnabled) throw new Error('Shopify not configured');
  if (!Array.isArray(lines) || !lines.length) throw new Error('No lines provided');
  const valid = lines
    .filter((l) => typeof l.merchandiseId === 'string' && l.merchandiseId.startsWith('gid://shopify/ProductVariant/'))
    .map((l) => ({ merchandiseId: l.merchandiseId, quantity: Math.max(1, Math.min(99, Number(l.quantity) || 1)) }));
  if (!valid.length) throw new Error('No Shopify-live merchandise in cart. Products must exist in your Shopify store to check out.');
  const data = await shopifyFetch(CART_CREATE_MUTATION, { input: { lines: valid } });
  const payload = data.cartCreate;
  if (payload?.userErrors?.length) throw new Error(`cartCreate userErrors: ${JSON.stringify(payload.userErrors)}`);
  if (!payload?.cart?.checkoutUrl) throw new Error('cartCreate returned no checkoutUrl');
  return payload.cart;
}

// -----------------------------------------------------------
// Newsletter subscription via Storefront customerCreate
// -----------------------------------------------------------
export async function subscribeToNewsletter(email) {
  if (!shopifyEnabled) throw new Error('Newsletter unavailable: server not configured');
  const trimmed = String(email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) throw new Error('Please enter a valid email address.');

  const randomPassword =
    Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2) + 'A1!';

  const data = await shopifyFetch(CUSTOMER_CREATE_STOREFRONT, {
    input: { email: trimmed, password: randomPassword, acceptsMarketing: true },
  });
  const errs = data.customerCreate?.customerUserErrors || [];
  const taken = errs.find((e) => e.code === 'TAKEN' || /already been taken|already exists/i.test(e.message));
  if (taken) return { ok: true, alreadySubscribed: true, email: trimmed };
  if (errs.length) throw new Error(errs.map((e) => e.message).join(' — '));
  return { ok: true, created: true, email: trimmed, customerId: data.customerCreate?.customer?.id };
}
