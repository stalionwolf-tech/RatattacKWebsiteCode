/**
 * Shopify Storefront API client + adapter.
 *
 * SOURCE OF TRUTH: The RatAttacK Shopify store (ratattack-tcg.myshopify.com).
 * If a product is not in Shopify, it is not shown on the site — no exceptions.
 *
 * Design principles:
 *  - Server-only usage (uses env vars; token stays out of client bundles).
 *  - `adaptProduct()` maps Shopify's GraphQL response into the RICH product
 *    shape the existing UI already consumes (sigil, accent, availability, etc.).
 *  - No external SDK — just fetch + GraphQL strings, per Shopify's 2025 docs.
 */

import { COLLECTIONS as MOCK_COLLECTIONS } from '@/lib/products';

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const TOKEN  = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const VERSION = process.env.SHOPIFY_API_VERSION || '2025-01';
const ENDPOINT = DOMAIN ? `https://${DOMAIN}/api/${VERSION}/graphql.json` : null;

export const shopifyEnabled = Boolean(DOMAIN && TOKEN);

// -----------------------------------------------------------
// Low-level fetch wrapper
// -----------------------------------------------------------
export async function shopifyFetch(query, variables = {}, { cache = 'no-store', revalidate } = {}) {
  if (!shopifyEnabled) throw new Error('Shopify env vars not configured');
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN,
    },
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

// -----------------------------------------------------------
// GraphQL fragments/queries/mutations
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
      id handle title descriptionHtml
      products(first: $first, after: $after) {
        pageInfo { hasNextPage endCursor }
        edges { cursor node { ${PRODUCT_FIELDS} } }
      }
    }
  }
`;

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  createdAt
  updatedAt
  cost {
    subtotalAmount { amount currencyCode }
    totalAmount { amount currencyCode }
    totalTaxAmount { amount currencyCode }
  }
  lines(first: 100) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id title
            price { amount currencyCode }
            product { handle title featuredImage { url altText } }
          }
        }
      }
    }
  }
`;

const CART_CREATE_MUTATION = `
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart { ${CART_FIELDS} }
      userErrors { field message }
    }
  }
`;

// -----------------------------------------------------------
// Adapter: Shopify Product -> internal (mock-shaped) product
// -----------------------------------------------------------
// Deterministic pixel-sigil defaults based on productType, so real Shopify
// products still get the fantasy fallback artwork when no image is set.
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

function sigilFor(productType) { return SIGIL_BY_TYPE[productType] || SIGIL_BY_TYPE.__default; }

// Parse tags of the form `sigil:crown`, `accent:gold`, `set:Journey Together`,
// `rarity:Ultra Rare`. This lets the merchant customize the pixel-art fallback
// & metadata directly from Shopify Admin without needing metafields.
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
  const priceAmount = priceMin?.amount ? Number(priceMin.amount) : 0;
  const isOnSale = compareAmount != null && compareAmount > priceAmount;

  return {
    id: node.id,
    handle: node.handle,
    slug: node.handle,
    title: node.title,
    vendor: node.vendor || 'RatAttacK',
    productType: type,
    brand: overrides.brand || node.vendor || 'RatAttacK',
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
    rating: 4.7,
    reviewCount: 0,
    priceRange: {
      minVariantPrice: { amount: String(priceAmount || 0), currencyCode: priceMin?.currencyCode || 'USD' },
      maxVariantPrice: { amount: String(priceMax?.amount || priceAmount || 0), currencyCode: priceMax?.currencyCode || 'USD' },
    },
    compareAtPrice: compareAmount != null ? { amount: String(compareAmount), currencyCode: compareMin?.currencyCode || 'USD' } : null,
    isOnSale,
    featuredImage: {
      url: featured?.url || null,
      altText: featured?.altText || node.title,
      sigil: finalSigil,
      accent: finalAccent,
    },
    hoverImage: {
      url: images[1]?.url || null,
      altText: images[1]?.altText || node.title + ' alternate',
      sigil: finalSigil,
      accent: finalAccent,
    },
    images: images.length ? images.map((im, i) => ({
      url: im.url,
      altText: im.altText || `${node.title} view ${i + 1}`,
      sigil: finalSigil,
      accent: finalAccent,
      variant: ['front','back','detail','angle','angle2','angle3'][i] || 'view',
    })) : [
      { url: null, altText: node.title, sigil: finalSigil, accent: finalAccent, variant: 'front' },
    ],
    variants,
    availability,
    promo: null,
    // Marks this as sourced from Shopify (used by cart-flow to bypass fallback)
    source: 'shopify',
  };
}

// -----------------------------------------------------------
// Read helpers — Shopify is the ONLY source of truth.
// If Shopify has no data, we return empty results (never mock).
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
  if (!shopifyEnabled) return { products: [], source: 'shopify', empty: true };
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
    return { products: [], source: 'shopify', empty: true, error: e.message };
  }
}

// -----------------------------------------------------------
// Cart create → returns checkoutUrl (Shopify hosted)
// -----------------------------------------------------------
// Accepts an array of {merchandiseId, quantity} — must be real GID strings.
export async function createCheckoutCart(lines = []) {
  if (!shopifyEnabled) throw new Error('Shopify not configured');
  if (!Array.isArray(lines) || !lines.length) throw new Error('No lines provided');
  // Only accept real Shopify GID variant IDs — refuse mock/handle-based keys.
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

export const _mock = { MOCK_COLLECTIONS };

// -----------------------------------------------------------
// Newsletter — Shopify Admin API customerCreate (email marketing consent)
// -----------------------------------------------------------
// Uses the Admin token (server-only). Creates a Shopify customer whose
// `emailMarketingConsent.marketingState = SUBSCRIBED` — the customer then
// appears in Shopify Admin → Customers with a "Subscribed" tag, and you can
// send campaigns to them via Shopify Email (free, built-in) or any Shopify
// marketing app (Klaviyo, Omnisend, etc.).
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const ADMIN_ENDPOINT = DOMAIN ? `https://${DOMAIN}/admin/api/${VERSION}/graphql.json` : null;

const CUSTOMER_CREATE_MUTATION = `
  mutation customerCreate($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer { id email emailMarketingConsent { marketingState marketingOptInLevel } }
      userErrors { field message }
    }
  }
`;

const CUSTOMER_UPDATE_MUTATION = `
  mutation customerEmailMarketingConsentUpdate($input: CustomerEmailMarketingConsentUpdateInput!) {
    customerEmailMarketingConsentUpdate(input: $input) {
      customer { id email emailMarketingConsent { marketingState marketingOptInLevel } }
      userErrors { field message }
    }
  }
`;

const CUSTOMER_BY_EMAIL_QUERY = `
  query customerByEmail($query: String!) {
    customers(first: 1, query: $query) {
      edges { node { id email emailMarketingConsent { marketingState } } }
    }
  }
`;

async function shopifyAdminFetch(query, variables = {}) {
  if (!ADMIN_TOKEN || !ADMIN_ENDPOINT) throw new Error('Shopify Admin API not configured');
  const res = await fetch(ADMIN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ADMIN_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { throw new Error(`Shopify Admin non-JSON (${res.status}): ${text.slice(0, 200)}`); }
  if (!res.ok) throw new Error(`Shopify Admin HTTP ${res.status}: ${JSON.stringify(json)}`);
  if (json.errors?.length) throw new Error(`Shopify Admin GraphQL errors: ${JSON.stringify(json.errors)}`);
  return json.data;
}

/**
 * Subscribe an email to the RatAttacK newsletter via Shopify.
 * - If the customer does not exist: create with SUBSCRIBED consent.
 * - If they already exist and are UNSUBSCRIBED: update consent to SUBSCRIBED.
 * - If already SUBSCRIBED: return idempotently as ok.
 */
export async function subscribeToNewsletter(email) {
  if (!ADMIN_TOKEN) throw new Error('Newsletter unavailable: server not configured');
  const trimmed = String(email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) throw new Error('Please enter a valid email address.');

  // 1. Try to find an existing customer.
  let existing = null;
  try {
    const found = await shopifyAdminFetch(CUSTOMER_BY_EMAIL_QUERY, { query: `email:${trimmed}` });
    existing = found.customers?.edges?.[0]?.node || null;
  } catch (e) {
    // If the search fails we still attempt to create; Shopify will report duplicate.
    console.warn('[shopify] customerByEmail search failed:', e.message);
  }

  if (existing) {
    if (existing.emailMarketingConsent?.marketingState === 'SUBSCRIBED') {
      return { ok: true, alreadySubscribed: true, email: trimmed };
    }
    // Re-subscribe an existing customer.
    const data = await shopifyAdminFetch(CUSTOMER_UPDATE_MUTATION, {
      input: {
        customerId: existing.id,
        emailMarketingConsent: {
          marketingState: 'SUBSCRIBED',
          marketingOptInLevel: 'SINGLE_OPT_IN',
          consentUpdatedAt: new Date().toISOString(),
        },
      },
    });
    const errs = data.customerEmailMarketingConsentUpdate?.userErrors;
    if (errs?.length) throw new Error(errs.map((e) => e.message).join(' — '));
    return { ok: true, resubscribed: true, email: trimmed };
  }

  // 2. Create a new customer with marketing consent.
  const data = await shopifyAdminFetch(CUSTOMER_CREATE_MUTATION, {
    input: {
      email: trimmed,
      emailMarketingConsent: {
        marketingState: 'SUBSCRIBED',
        marketingOptInLevel: 'SINGLE_OPT_IN',
        consentUpdatedAt: new Date().toISOString(),
      },
      tags: ['newsletter', 'ratattack-site'],
    },
  });
  const errs = data.customerCreate?.userErrors;
  if (errs?.length) throw new Error(errs.map((e) => e.message).join(' — '));
  return { ok: true, created: true, email: trimmed, customerId: data.customerCreate?.customer?.id };
}
