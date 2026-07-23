import { NextResponse } from 'next/server';
import { auth } from '@/auth';

/**
 * Direct Shopify Admin GraphQL integration (no v0 Shopify integration).
 *
 * Secrets are read ONLY from the environment:
 *   - SHOPIFY_STORE_DOMAIN         e.g. "my-store.myshopify.com"
 *   - SHOPIFY_ADMIN_ACCESS_TOKEN   a private Admin API access token (shpat_...)
 *
 * This route is already protected by middleware.js (matcher: /api/admin/:path*),
 * which enforces an authenticated session whose email is on ALLOWED_ADMIN_EMAILS.
 */

const API_VERSION = '2024-10';

interface ShopifyUserError {
  field?: string[] | null;
  message: string;
}

/** Thrown with the EXACT message Shopify returned so the client can show it. */
class ShopifyError extends Error {}

function getShopifyConfig() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN?.trim();
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN?.trim();
  if (!domain || !token) {
    throw new ShopifyError(
      'Shopify is not configured. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_ADMIN_ACCESS_TOKEN in the environment.',
    );
  }
  // Normalize: allow the user to paste with or without protocol / trailing slash.
  const host = domain.replace(/^https?:\/\//, '').replace(/\/+$/, '');
  return { endpoint: `https://${host}/admin/api/${API_VERSION}/graphql.json`, token };
}

async function shopifyGraphQL<T>(
  query: string,
  variables: Record<string, unknown>,
): Promise<T> {
  const { endpoint, token } = getShopifyConfig();

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });

  const text = await res.text();

  if (!res.ok) {
    // Surface transport-level errors (401 invalid token, 404 wrong domain, 429 throttled, ...).
    throw new ShopifyError(
      `Shopify API request failed (${res.status} ${res.statusText}): ${text.slice(0, 500)}`,
    );
  }

  let json: any;
  try {
    json = JSON.parse(text);
  } catch {
    throw new ShopifyError(`Shopify returned a non-JSON response: ${text.slice(0, 500)}`);
  }

  // Top-level GraphQL errors (bad query, access-scope denied, throttling).
  if (json.errors?.length) {
    throw new ShopifyError(
      json.errors.map((e: { message: string }) => e.message).join(' | '),
    );
  }

  return json.data as T;
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

export async function POST(request: Request) {
  // Defense-in-depth: middleware already gates this, but re-check the session here.
  const session = await auth();
  const sessionUser = session?.user as { email?: string; isAdmin?: boolean } | undefined;
  if (!sessionUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!sessionUser.isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const { card, condition, quantity, price, trackInventory } = body ?? {};

  // --- Validate input ---
  if (!card?.name) {
    return NextResponse.json({ error: 'A Pokémon card must be selected.' }, { status: 400 });
  }
  const priceNumber = Number(price);
  if (!Number.isFinite(priceNumber) || priceNumber < 0) {
    return NextResponse.json({ error: 'Price must be a valid non-negative number.' }, { status: 400 });
  }
  const quantityNumber = Math.max(0, Math.floor(Number(quantity) || 0));
  const shouldTrack = Boolean(trackInventory);

  try {
    // ------------------------------------------------------------------
    // 1) Create the product (with the card image as media). Shopify creates
    //    a single default variant automatically, which we capture.
    // ------------------------------------------------------------------
    const titleParts = [card.name];
    if (card.set?.name) titleParts.push(`(${card.set.name})`);
    const title = titleParts.join(' ');

    const descriptionLines = [
      card.set?.name ? `<p><strong>Set:</strong> ${escapeHtml(card.set.name)}</p>` : '',
      card.cardNumber ? `<p><strong>Card Number:</strong> ${escapeHtml(String(card.cardNumber))}</p>` : '',
      card.rarity ? `<p><strong>Rarity:</strong> ${escapeHtml(card.rarity)}</p>` : '',
      card.hp ? `<p><strong>HP:</strong> ${escapeHtml(String(card.hp))}</p>` : '',
      card.artist ? `<p><strong>Artist:</strong> ${escapeHtml(card.artist)}</p>` : '',
      condition ? `<p><strong>Condition:</strong> ${escapeHtml(condition)}</p>` : '',
    ].filter(Boolean);

    const tags = ['Pokémon', 'Trading Card'];
    if (card.set?.name) tags.push(card.set.name);
    if (condition) tags.push(condition);
    if (card.rarity) tags.push(card.rarity);

    const media = card.image
      ? [{ originalSource: card.image, alt: card.name, mediaContentType: 'IMAGE' }]
      : [];

    const productData = await shopifyGraphQL<{
      productCreate: {
        product: {
          id: string;
          variants: { nodes: { id: string; inventoryItem: { id: string } }[] };
        } | null;
        userErrors: ShopifyUserError[];
      };
    }>(
      `mutation CreateProduct($input: ProductInput!, $media: [CreateMediaInput!]) {
        productCreate(input: $input, media: $media) {
          product {
            id
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
          descriptionHtml: descriptionLines.join(''),
          productType: 'Trading Card',
          vendor: 'RatAttacK',
          status: 'ACTIVE',
          tags,
        },
        media,
      },
    );

    throwOnUserErrors(productData.productCreate.userErrors, 'Product creation failed');

    const product = productData.productCreate.product;
    const variant = product?.variants.nodes[0];
    if (!product || !variant) {
      throw new ShopifyError('Shopify did not return a product or variant.');
    }

    // ------------------------------------------------------------------
    // 2) Update the default variant: price + inventory tracking.
    // ------------------------------------------------------------------
    const variantData = await shopifyGraphQL<{
      productVariantsBulkUpdate: {
        productVariants: { id: string }[] | null;
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
      variantData.productVariantsBulkUpdate.userErrors,
      'Variant update failed',
    );

    // ------------------------------------------------------------------
    // 3) If tracking is on, activate the inventory item at the primary
    //    location and set the on-hand quantity.
    // ------------------------------------------------------------------
    if (shouldTrack) {
      const locationData = await shopifyGraphQL<{
        locations: { nodes: { id: string }[] };
      }>(
        `query PrimaryLocation {
          locations(first: 1, query: "active:true") { nodes { id } }
        }`,
        {},
      );

      const locationId = locationData.locations.nodes[0]?.id;
      if (locationId) {
        // Activate the inventory item at this location (idempotent) and set quantity.
        const activateData = await shopifyGraphQL<{
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
            available: quantityNumber,
          },
        );

        throwOnUserErrors(
          activateData.inventoryActivate.userErrors,
          'Inventory activation failed',
        );
      }
    }

    // Extract the numeric product id from the GID for convenience.
    const numericId = product.id.split('/').pop();

    return NextResponse.json({
      success: true,
      productId: product.id,
      productAdminId: numericId,
      variantId: variant.id,
    });
  } catch (err) {
    // Return the EXACT Shopify error message (never a generic failure).
    const message =
      err instanceof Error ? err.message : 'Unexpected error while publishing to Shopify.';
    console.log('[v0] Shopify publish error:', message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

/** Minimal HTML escaping for values interpolated into descriptionHtml. */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
