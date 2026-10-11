// Headless Shopify checkout: the site's own buy box, Shopify's checkout.
// Talks to the Storefront API with the public token (what the Buy Button SDK does under the hood,
// without its 100 KB script or its UI). Purchase conversions are tracked on Shopify's side —
// see docs/shopify-tracking.md.
import { SHOPIFY, type ReviewPack } from "@/config/site";
import { attribution } from "@/lib/track";

type Variant = { id: string; availableForSale: boolean; price: { amount: string }; selectedOptions: { name: string; value: string }[] };

const ENDPOINT = `https://${SHOPIFY.domain}/api/${SHOPIFY.apiVersion}/graphql.json`;

async function gql<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": SHOPIFY.storefrontToken },
    body: JSON.stringify({ query, variables }),
    signal: AbortSignal.timeout(8000),
  });
  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (!res.ok || json.errors?.length || !json.data) throw new Error(json.errors?.[0]?.message || `Shopify ${res.status}`);
  return json.data;
}

let variantsReq: Promise<Variant[]> | null = null;

/** The product's variants, fetched once (the buy box prefetches this on idle). */
export function loadVariants() {
  if (!variantsReq) {
    variantsReq = gql<{ product: { variants: { nodes: Variant[] } } | null }>(
      `query Variants($id: ID!) { product(id: $id) { variants(first: 50) { nodes { id availableForSale price { amount } selectedOptions { name value } } } } }`,
      { id: `gid://shopify/Product/${SHOPIFY.productId}` },
    )
      .then((d) => {
        if (!d.product) throw new Error("Product not published to the Buy Button / Headless channel");
        return d.product.variants.nodes;
      })
      .catch((e) => {
        variantsReq = null;
        throw e;
      });
  }
  return variantsReq;
}

const norm = (v: string) => v.toLowerCase().replace(/[^a-z0-9]/g, "");
const packNumber = (v: string) => v.match(/\d+/)?.[0];

/** Matches the Pack option value; tolerant of "2 cards" vs "2-Pack" vs "Pack of 2". */
export function findVariant(variants: Variant[], pack: ReviewPack) {
  const match = variants.find((v) => v.selectedOptions.some((o) => norm(o.value) === norm(pack.shopifyOption) || packNumber(o.value) === String(pack.qty)));
  // No matching variant (e.g. the Color/Pack variants aren't set up yet): the buy box falls back to
  // the order-request form rather than sending people to a checkout with the wrong price.
  return match ? { variant: match, quantity: 1 } : null;
}

const numericId = (gid: string) => gid.split("/").pop()!;

/**
 * Creates a Shopify cart for the chosen card and returns the checkout URL.
 * Ad click ids and UTMs ride along as cart attributes (visible on the order) and the UTMs
 * are added to the checkout URL so Shopify's own reports attribute the sale.
 */
export async function createCheckout(pack: ReviewPack, business: string) {
  const found = findVariant(await loadVariants(), pack);
  if (!found) throw new Error(`No Shopify variant for ${pack.label}`);
  const a = attribution();
  const attributes = Object.entries({
    "Business name": business.trim(),
    Pack: pack.label,
    Landing: a.landing,
    gclid: a.gclid,
    gbraid: a.gbraid,
    wbraid: a.wbraid,
    fbclid: a.fbclid,
    msclkid: a.msclkid,
    _fbp: a.fbp,
    _fbc: a.fbc,
    utm_source: a.utm_source,
    utm_medium: a.utm_medium,
    utm_campaign: a.utm_campaign,
    utm_content: a.utm_content,
    utm_term: a.utm_term,
  })
    .filter(([, v]) => v)
    .map(([key, value]) => ({ key, value: String(value).slice(0, 250) }));

  const lines = [{ merchandiseId: found.variant.id, quantity: found.quantity }];
  let url: string;
  try {
    const d = await gql<{ cartCreate: { cart: { checkoutUrl: string } | null; userErrors: { message: string }[] } }>(
      `mutation Cart($input: CartInput!) { cartCreate(input: $input) { cart { checkoutUrl } userErrors { message } } }`,
      { input: { lines, attributes } },
    );
    if (!d.cartCreate.cart) throw new Error(d.cartCreate.userErrors[0]?.message || "cartCreate failed");
    url = d.cartCreate.cart.checkoutUrl;
  } catch {
    // Cart permalink: works even if the cart mutation is blocked.
    url = `https://${SHOPIFY.domain}/cart/${numericId(found.variant.id)}:${found.quantity}`;
  }
  const u = new URL(url);
  for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const) if (a[k]) u.searchParams.set(k, a[k]!);
  if (!a.utm_source) {
    u.searchParams.set("utm_source", "ceoturbo.com");
    u.searchParams.set("utm_medium", "website");
  }
  return { url: u.toString(), variantId: numericId(found.variant.id), price: Number(found.variant.price.amount) * found.quantity, available: found.variant.availableForSale };
}
