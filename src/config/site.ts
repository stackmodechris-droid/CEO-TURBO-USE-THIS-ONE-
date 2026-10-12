// Single source of truth for links, prices and business facts.
// Change a value here and every page, CTA, schema block and sitemap picks it up.

export const SITE = {
  name: "CEO Turbo",
  url: "https://www.ceoturbo.com",
  tagline: "More customers, more reviews, more listeners.",
  description:
    "CEO Turbo builds websites, ads, Google Business Profiles and AI-search visibility for artists, local service businesses and Shopify stores — plus NFC Google review cards that make leaving a review a one-tap job.",
  founder: {
    name: "Christopher Robinson",
    alternateName: "StackmodeChris",
    jobTitle: "Founder & CEO",
    image: "/img/brand/christopher-robinson.webp",
    /** Christopher's personal profiles (Person schema). */
    sameAs: [
      "https://www.youtube.com/@ChristopherRobinson-CEO",
      "https://x.com/ChristopherRCEO",
      "https://www.instagram.com/christopherrobinsonceo/",
      "https://www.tiktok.com/@stackmodechris___",
      "https://www.linkedin.com/in/stackmodechris/",
      "https://stackmode.net",
    ],
  },
  /** Call or text the company. `href` is what every tel: link uses. */
  phone: {
    display: "(470) 502-9543",
    e164: "+14705029543",
    href: "tel:+14705029543",
  },
  email: "ceoturbo@proton.me",
  /** Site-ownership codes. Paste the content value from each service's "meta tag" option; empty = no tag. */
  verification: {
    /** Meta Business Settings → Brand Safety → Domains → Meta-tag method (facebook-domain-verification). */
    meta: "",
    /** Microsoft Merchant Center / Bing Webmaster (msvalidate.01). */
    microsoft: "",
    /** Google Search Console / Merchant Center HTML-tag method. */
    google: "",
  },
  address: {
    streetAddress: "8735 Dunwoody Place #12143",
    addressLocality: "Atlanta",
    addressRegion: "GA",
    postalCode: "30350",
    addressCountry: "US",
  },
  logo: "/img/brand/ceo-turbo-logo.png",
  ogImage: "/og/ceoturbo.jpg",
  /** CEO Turbo's own profiles (Organization schema + the social icons). */
  social: [
    { network: "instagram", label: "Instagram", href: "https://www.instagram.com/ceoturbo_/" },
    { network: "facebook", label: "Facebook", href: "https://www.facebook.com/profile.php?id=61595439263484" },
    { network: "youtube", label: "YouTube", href: "https://www.youtube.com/@CEOTurbo7" },
    { network: "x", label: "X", href: "https://x.com/CEO_Turbo" },
    { network: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/showcase/ceoturbo" },
    { network: "pinterest", label: "Pinterest", href: "https://www.pinterest.com/ceoturbo/" },
  ],
  sameAs: [
    "https://www.instagram.com/ceoturbo_/",
    "https://www.facebook.com/profile.php?id=61595439263484",
    "https://www.youtube.com/@CEOTurbo7",
    "https://x.com/CEO_Turbo",
    "https://www.linkedin.com/showcase/ceoturbo",
    "https://www.pinterest.com/ceoturbo/",
  ],
} as const;

/** Brand Boost = the agency growth call. Cal.com handles scheduling. */
export const BOOKING = {
  calLink: "stackmodechris/ceoturbo-brandboost",
  url: "https://cal.com/stackmodechris/ceoturbo-brandboost",
  namespace: "brandboost",
  name: "Brand Boost call",
  length: "30 min",
} as const;

/** Founder video used on the homepage, Brand Boost and ad landing pages. */
export const PITCH_VIDEO = {
  src: "/media/brand-boost.mp4",
  poster: "/media/brand-boost-poster.webp",
  title: "How to get more customers for your business in 2026",
  description: "Christopher Robinson of CEO Turbo explains how businesses get found on Google, Maps and AI assistants — and turn that attention into customers.",
  duration: "PT1M22S",
  width: 540,
  height: 960,
} as const;

/**
 * The Google review card (NFC, NTAG215) — shipped blank from Atlanta, programmed by the buyer.
 * Checkout runs on Shopify: the site's own buy box creates a Shopify cart through the
 * Storefront API and sends the buyer to Shopify checkout (src/lib/shopify.ts).
 * Variant ids are looked up by option value, so the Shopify product needs one option
 * "Pack" with values "1 card" / "2 cards" / "5 cards" — see docs/shopify-listing.md.
 */
export const SHOPIFY = {
  domain: "uweee2-sc.myshopify.com",
  /** Public Storefront API token (safe in the browser; it can only read products and create carts). */
  storefrontToken: "3f8f3d3f7a28ffdf9423ef07ce7e1c8e",
  productId: "15410641502443",
  apiVersion: "2025-07",
} as const;

export type ReviewPack = { id: "1" | "2" | "5"; qty: number; price: number; label: string; note: string; shopifyOption: string; popular?: boolean };

const REVIEW_PACKS: ReviewPack[] = [
  { id: "1", qty: 1, price: 24.99, label: "1 card", note: "Your front counter", shopifyOption: "1 card" },
  { id: "2", qty: 2, price: 39.99, label: "2 cards", note: "Counter + door, or shop + truck", shopifyOption: "2 cards", popular: true },
  { id: "5", qty: 5, price: 79.99, label: "5 cards", note: "Every station, chair or location", shopifyOption: "5 cards" },
];

export const REVIEW_CARD = {
  name: "Google Review Tap Card",
  fullName: "NFC Google Review Card",
  sku: "CT-NFC-REVIEW",
  currency: "USD",
  /** One double-sided card: white matte "Review Us On Google" front, black NFC back. */
  finish: "White front · black back",
  image: "/img/review-cards/feed-white.jpg",
  packs: REVIEW_PACKS,
  specs: {
    chip: "NTAG215 NFC chip",
    memory: "504 bytes user memory",
    material: "Waterproof PVC, matte finish",
    size: "85.5 × 54 mm (credit-card size), 0.76 mm thick",
  },
  shipping: {
    free: true,
    label: "Free US shipping",
    processing: "Ships in 1–2 business days from Atlanta, GA",
    delivery: "Arrives 2–5 business days after it ships (USPS)",
    /** Total business days from order to doorstep, used for the "get it by" estimate. */
    minDays: 3,
    maxDays: 7,
  },
  guarantee: "Not right for you, or the card won't program or tap? Return it new and unused within 5 days of delivery for a refund. No restocking fee.",
  returnDays: 5,
} as const;


export const fromPrice = Math.min(...REVIEW_CARD.packs.map((p) => p.price));
export const fromPriceLabel = `$${fromPrice.toFixed(2)}`;
export const money2 = (n: number) => `$${n.toFixed(2)}`;
export const packSavings = (p: ReviewPack) => Math.max(0, +(p.qty * REVIEW_CARD.packs[0].price - p.price).toFixed(2));
/** Merchant feed / ad link that opens the product page with this variant preselected. */
export const packPath = (pack: ReviewPack["id"]) => `/google-review-cards?pack=${pack}`;
/** SKU shared by Shopify, the Merchant feed, JSON-LD and ad events (CT-NFC-REVIEW-2 …). */
export const packSku = (p: ReviewPack) => `${REVIEW_CARD.sku}-${p.qty}`;

/** Google review link setup: the free app buyers use to write their link to the card. */
export const NFC_APP = {
  name: "NFC Tools",
  ios: "https://apps.apple.com/us/app/nfc-tools/id1252962749",
  android: "https://play.google.com/store/apps/details?id=com.wakdev.wdnfc",
} as const;
