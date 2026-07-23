/**
 * Shopify Admin API integration.
 *
 * ALL Shopify logic lives here — authentication, token caching, product
 * creation, image upload, variant + inventory management, and error handling.
 * Nothing in this file may run in the browser: it reads secrets from the
 * environment and must only be imported by server code (route handlers).
 *
 * Credentials (server-only environment variables):
 *   - SHOPIFY_SHOP           e.g. "my-store.myshopify.com" (or just "my-store")
 *   - SHOPIFY_CLIENT_ID      the app's Client ID from the Shopify Dev Dashboard
 *   - SHOPIFY_CLIENT_SECRET  the app's Client Secret
 *
 * Authentication uses Shopify's **client credentials grant**, which exchanges
 * the Client ID/Secret for a short-lived (24h) Admin API access token. Tokens
 * are cached in module scope and refreshed automatically before expiry, so we
 * do not authenticate on every request. This grant only works for apps and
 * stores within the same Shopify organization.
 */

const API_VERSION = '2024-10';

/** Error carrying the exact Shopify-provided message so callers can surface it. */
export class ShopifyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ShopifyError';
  }
}

/* -------------------------------------------------------------------------- */
/*  Configuration                                                             */
/* -------------------------------------------------------------------------- */

interface ShopifyConfig {
  shop: string; // normalized "my-store.myshopify.com"
  clientId: string;
  clientSecret: string;
}

function getConfig(): ShopifyConfig {
  const rawShop = process.env.SHOPIFY_SHOP?.trim();
  const clientId = process.env.SHOPIFY_CLIENT_ID?.trim();
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET?.trim();

  const missing: string[] = [];
  if (!rawShop) missing.push('SHOPIFY_SHOP');
  if (!clientId) missing.push('SHOPIFY_CLIENT_ID');
  if (!clientSecret) missing.push('SHOPIFY_CLIENT_SECRET');
  if (missing.length > 0) {
    throw new ShopifyError(
      `Shopify is not configured. Missing environment variable(s): ${missing.join(', ')}.`,
    );
  }

  // Normalize the shop to a bare myshopify hostname.
  let shop = rawShop!.replace(/^https?:\/\//, '').replace(/\/+$/, '');
  if (!shop.includes('.')) shop = `${shop}.myshopify.com`;

  return { shop, clientId: clientId!, clientSecret: clientSecret! };
}

/* -------------------------------------------------------------------------- */
/*  Authentication + token cache                                              */
/* -------------------------------------------------------------------------- */

interface CachedToken {
  token: string;
  /** epoch ms when we should stop trusting the token */
  expiresAt: number;
  /** the shop the token belongs to (guards against env changes) */
  shop: string;
}

// Module-scoped cache. Persists across warm serverless invocations.
let cachedToken: CachedToken | null = null;

/** Refresh a bit early so an in-flight request never uses an expired token. */
const TOKEN_EXPIRY_BUFFER_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Return a valid Admin API access token, authenticating via the client
 * credentials grant only when there is no fresh cached token.
 */
async function getAccessToken(forceRefresh = false): Promise<string> {
  const { shop, clientId, clientSecret } = getConfig();

  const now = Date.now();
  if (
    !forceRefresh &&
    cachedToken &&
    cachedToken.shop === shop &&
    cachedToken.expiresAt > now
  ) {
    return cachedToken.token;
  }

  console.log('[v0] Authenticating with Shopify...');

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials',
  });

  let res: Response;
  try {
    res = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body,
      cache: 'no-store',
    });
  } catch (err) {
    throw new ShopifyError(
      `Network error while authenticating with Shopify: ${
        err instanceof Error ? err.message : 'unknown error'
      }`,
    );
  }

  const text = await res.text();

  if (!res.ok) {
    // 401 -> bad client id/secret; 404 -> wrong shop; 400 -> wrong org/grant.
    let detail = text.slice(0, 500);
    try {
      const parsed = JSON.parse(text);
      detail = parsed.error_description || parsed.error || detail;
    } catch {
      /* keep raw text */
    }
    throw new ShopifyError(
      `Shopify authentication failed (${res.status} ${res.statusText}): ${detail}`,
    );
  }

  let json: { access_token?: string; expires_in?: number };
  try {
    json = JSON.parse(text);
  } catch {
    throw new ShopifyError('Shopify authentication returned a non-JSON response.');
  }

  if (!json.access_token) {
    throw new ShopifyError('Shopify authentication succeeded but returned no access token.');
  }

  // Default to 24h if Shopify omits expires_in.
  const expiresInMs = (json.expires_in ? json.expires_in * 1000 : 24 * 60 * 60 * 1000);
  cachedToken = {
    token: json.access_token,
    expiresAt: now + expiresInMs - TOKEN_EXPIRY_BUFFER_MS,
    shop,
  };

  console.log('[v0] Authentication successful.');
  return cachedToken.token;
}

/* -------------------------------------------------------------------------- */
/*  GraphQL transport                                                         */
/* -------------------------------------------------------------------------- */

interface ShopifyUserError {
  field?: string[] | null;
  message: string;
}

/**
 * Execute an Admin GraphQL operation. Automatically retries once with a fresh
 * token if the first attempt is rejected as unauthorized (expired/revoked).
 */
async function shopifyGraphQL<T>(
  query: string,
  variables: Record<string, unknown>,
  { retryOnAuthError = true }: { retryOnAuthError?: boolean } = {},
): Promise<T> {
  const { shop } = getConfig();
  const token = await getAccessToken();

  const endpoint = `https://${shop}/admin/api/${API_VERSION}/graphql.json`;

  let res: Response;
  try {
    res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token,
        Accept: 'application/json',
      },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store',
    });
  } catch (err) {
    throw new ShopifyError(
      `Network error contacting Shopify: ${
        err instanceof Error ? err.message : 'unknown error'
      }`,
    );
  }

  // Expired/revoked token -> refresh once and retry.
  if (res.status === 401 && retryOnAuthError) {
    console.log('[v0] Access token rejected (401). Refreshing and retrying...');
    cachedToken = null;
    await getAccessToken(true);
    return shopifyGraphQL<T>(query, variables, { retryOnAuthError: false });
  }

  if (res.status === 429) {
    throw new ShopifyError('Shopify rate limit exceeded. Please try again in a moment.');
  }

  const text = await res.text();

  if (!res.ok) {
    throw new ShopifyError(
      `Shopify API request failed (${res.status} ${res.statusText}): ${text.slice(0, 500)}`,
    );
  }

  let json: { data?: T; errors?: Array<{ message: string }> };
  try {
    json = JSON.parse(text);
  } catch {
    throw new ShopifyError(`Shopify returned a non-JSON response: ${text.slice(0, 500)}`);
  }

  if (json.errors?.length) {
    throw new ShopifyError(json.errors.map((e) => e.message).join(' | '));
  }

  if (!json.data) {
    throw new ShopifyError('Shopify returned an empty response.');
  }

  return json.data;
}

/** Collapse a mutation's userErrors into a single thrown error with exact messages. */
function throwOnUserErrors(errors: ShopifyUserError[] | undefined, step: string) {
  if (errors && errors.length > 0) {
    const detail = errors
      .map((e) => (e.field?.length ? `${e.field.join('.')}: ${e.message}` : e.message))
      .join(' | ');
    throw new ShopifyError(`${step}: ${detail}`);
  }
}

/* -------------------------------------------------------------------------- */
/*  Public API: create a product from an inventory item                       */
/* -------------------------------------------------------------------------- */

export interface InventoryItem {
  name: string;
  set?: string;
  cardNumber?: string;
  rarity?: string;
  condition: string;
  quantity: number;
  price: string | number;
  imageUrl?: string;
  trackInventory?: boolean;
}

export interface PublishResult {
  success: true;
  productId: string; // GraphQL GID
  productAdminId: string; // numeric id
  handle: string;
  adminUrl: string; // Shopify admin product page
  storeUrl: string; // public/online-store product page
}

/**
 * Create a single Shopify product representing one inventory item, including
 * image upload, a priced variant, and inventory tracking.
 */
export async function publishProduct(item: InventoryItem): Promise<PublishResult> {
  const { shop } = getConfig();

  // ---- Validate ----------------------------------------------------------
  const name = item.name?.trim();
  if (!name) throw new ShopifyError('Card name is required.');

  const priceNumber = Number(item.price);
  if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
    throw new ShopifyError('Price must be greater than 0.');
  }

  const quantity = Math.floor(Number(item.quantity));
  if (!Number.isFinite(quantity) || quantity < 0) {
    throw new ShopifyError('Quantity must be 0 or greater.');
  }

  const shouldTrack = item.trackInventory !== false;

  // ---- Build product fields ----------------------------------------------
  const title = `Pokemon Card - ${name}`;

  const descriptionRows: Array<[string, string | undefined]> = [
    ['Card Name', name],
    ['Set', item.set],
    ['Card Number', item.cardNumber],
    ['Rarity', item.rarity],
    ['Condition', item.condition],
    ['Quantity', String(quantity)],
    ['Price', `$${priceNumber.toFixed(2)}`],
  ];
  const descriptionHtml = `<ul>${descriptionRows
    .filter(([, v]) => v && String(v).length > 0)
    .map(([k, v]) => `<li><strong>${escapeHtml(k)}:</strong> ${escapeHtml(String(v))}</li>`)
    .join('')}</ul>`;

  const tags = ['Pokemon', 'Pokemon Singles'];
  if (item.set) tags.push(item.set);
  if (item.condition) tags.push(item.condition);
  if (item.rarity) tags.push(item.rarity);

  const media =
    item.imageUrl && /^https?:\/\//.test(item.imageUrl)
      ? [{ originalSource: item.imageUrl, alt: name, mediaContentType: 'IMAGE' }]
      : [];

  // ---- 1) Create product --------------------------------------------------
  console.log('[v0] Creating Shopify product...');
  if (media.length) console.log('[v0] Uploading image...');

  const created = await shopifyGraphQL<{
    productCreate: {
      product: {
        id: string;
        handle: string;
        variants: { nodes: Array<{ id: string; inventoryItem: { id: string } }> };
      } | null;
      userErrors: ShopifyUserError[];
    };
  }>(
    `mutation CreateProduct($input: ProductInput!, $media: [CreateMediaInput!]) {
      productCreate(input: $input, media: $media) {
        product {
          id
          handle
          variants(first: 1) {
            nodes { id inventoryItem { id } }
          }
        }
        userErrors { field message }
      }
    }`,
    {
      input: {
        title,
        descriptionHtml,
        vendor: 'RatAttacK TCG',
        productType: 'Pokemon Singles',
        status: 'ACTIVE',
        tags,
      },
      media,
    },
  );

  throwOnUserErrors(created.productCreate.userErrors, 'Product creation failed');

  const product = created.productCreate.product;
  const variant = product?.variants.nodes[0];
  if (!product || !variant) {
    throw new ShopifyError('Shopify did not return a product or its default variant.');
  }

  // ---- 2) Price + inventory tracking on the default variant --------------
  console.log('[v0] Creating variant...');
  const variantUpdate = await shopifyGraphQL<{
    productVariantsBulkUpdate: {
      productVariants: Array<{ id: string }> | null;
      userErrors: ShopifyUserError[];
    };
  }>(
    `mutation UpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants { id price }
        userErrors { field message }
      }
    }`,
    {
      productId: product.id,
      variants: [
        {
          id: variant.id,
          price: priceNumber.toFixed(2),
          inventoryItem: { tracked: shouldTrack },
        },
      ],
    },
  );

  throwOnUserErrors(
    variantUpdate.productVariantsBulkUpdate.userErrors,
    'Variant update failed',
  );

  // ---- 3) Activate inventory at the primary location + set quantity ------
  if (shouldTrack) {
    console.log('[v0] Updating inventory...');
    const loc = await shopifyGraphQL<{ locations: { nodes: Array<{ id: string }> } }>(
      `query PrimaryLocation { locations(first: 1, query: "active:true") { nodes { id } } }`,
      {},
    );
    const locationId = loc.locations.nodes[0]?.id;
    if (locationId) {
      const activated = await shopifyGraphQL<{
        inventoryActivate: {
          inventoryLevel: { id: string } | null;
          userErrors: ShopifyUserError[];
        };
      }>(
        `mutation Activate($inventoryItemId: ID!, $locationId: ID!, $available: Int) {
          inventoryActivate(inventoryItemId: $inventoryItemId, locationId: $locationId, available: $available) {
            inventoryLevel { id }
            userErrors { field message }
          }
        }`,
        {
          inventoryItemId: variant.inventoryItem.id,
          locationId,
          available: quantity,
        },
      );
      throwOnUserErrors(
        activated.inventoryActivate.userErrors,
        'Inventory activation failed',
      );
    }
  }

  const productAdminId = product.id.split('/').pop() || product.id;
  const adminUrl = `https://${shop}/admin/products/${productAdminId}`;
  const storeUrl = `https://${shop}/products/${product.handle}`;

  console.log('[v0] Product created successfully.');
  console.log(`[v0] Product ID: ${product.id}`);
  console.log(`[v0] Admin URL: ${adminUrl}`);

  return {
    success: true,
    productId: product.id,
    productAdminId,
    handle: product.handle,
    adminUrl,
    storeUrl,
  };
}

/* -------------------------------------------------------------------------- */
/*  Utilities                                                                 */
/* -------------------------------------------------------------------------- */

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
