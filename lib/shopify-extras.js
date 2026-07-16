// -----------------------------------------------------------
// EXTENSION — collections + featured + sale (Shopify only)
// Appended to the main /app/lib/shopify.js at import time.
// -----------------------------------------------------------
import { adaptProduct, shopifyFetch, shopifyEnabled, getAllProductsLive } from '@/lib/shopify';

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

/**
 * List every public collection in the Shopify store.
 * Adding a collection in Shopify Admin makes it appear on the site with no code change.
 */
export async function getCollectionsLive({ first = 30 } = {}) {
  if (!shopifyEnabled) return { collections: [], empty: true };
  try {
    const data = await shopifyFetch(COLLECTIONS_LIST_QUERY, { first }, { cache: 'no-store' });
    const nodes = (data.collections?.edges || []).map((e) => e.node);
    return {
      collections: nodes.map((c) => ({
        id: c.id,
        slug: c.handle,
        handle: c.handle,
        title: c.title,
        description: c.description || '',
        image: c.image?.url || null,
        imageAlt: c.image?.altText || c.title,
      })),
      empty: nodes.length === 0,
    };
  } catch (e) {
    console.warn('[shopify] getCollectionsLive failed:', e.message);
    return { collections: [], empty: true, error: e.message };
  }
}

export async function getCollectionMetaLive(handle) {
  if (!shopifyEnabled) return null;
  try {
    const data = await shopifyFetch(COLLECTION_META_QUERY, { handle }, { cache: 'no-store' });
    if (!data.collection) return null;
    return {
      slug: data.collection.handle,
      handle: data.collection.handle,
      title: data.collection.title,
      description: data.collection.description || '',
      image: data.collection.image?.url || null,
    };
  } catch { return null; }
}

/**
 * Featured products — pulls from the `featured` collection when it exists in
 * Shopify, otherwise falls back to the newest products.
 */
export async function getFeaturedProductsLive({ first = 6 } = {}) {
  if (!shopifyEnabled) return { products: [], empty: true };
  try {
    const data = await shopifyFetch(`
      query Featured($first: Int!) {
        collection(handle: "featured") {
          products(first: $first, sortKey: COLLECTION_DEFAULT) {
            edges { node { id handle title availableForSale totalInventory createdAt tags productType vendor descriptionHtml description featuredImage { url altText } images(first: 4) { edges { node { url altText } } } priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } } compareAtPriceRange { minVariantPrice { amount currencyCode } } options { name values } variants(first: 10) { edges { node { id title availableForSale quantityAvailable price { amount currencyCode } compareAtPrice { amount currencyCode } selectedOptions { name value } } } } } }
          }
        }
      }`, { first }, { cache: 'no-store' });
    const nodes = data.collection?.products?.edges?.map((e) => e.node) || [];
    if (nodes.length) return { products: nodes.map(adaptProduct), empty: false, source: 'featured-collection' };
    // Fallback: newest
    const { products } = await getAllProductsLive({ first: Math.max(first, 12) });
    const newest = [...products].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')).slice(0, first);
    return { products: newest, empty: newest.length === 0, source: 'newest-fallback' };
  } catch (e) {
    console.warn('[shopify] getFeaturedProductsLive failed:', e.message);
    return { products: [], empty: true, error: e.message };
  }
}

/** Products currently on sale (compareAtPrice > current price). */
export async function getSaleProductsLive({ first = 24 } = {}) {
  const { products } = await getAllProductsLive({ first: Math.max(first, 60) });
  const onSale = products.filter((p) => p.isOnSale);
  return { products: onSale.slice(0, first), empty: onSale.length === 0 };
}

/**
 * Derive filter option lists from an array of live Shopify products.
 * Never hardcoded — the site presents whatever tags/types/vendors Shopify holds.
 */
export function deriveFilterOptions(products = []) {
  const productTypes = new Set();
  const vendors = new Set();
  const tagSet = new Set();
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
