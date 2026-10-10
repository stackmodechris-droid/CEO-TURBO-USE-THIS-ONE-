// Single source of truth for links, prices and business facts.
// Change a value here and every page, CTA, schema block and sitemap picks it up.

export const SITE = {
  name: "CEO Turbo",
  url: "https://ceoturbo.com",
  tagline: "More customers, more reviews, more listeners.",
  description:
    "CEO Turbo builds websites, ads, Google Business Profiles and AI-search visibility for artists, local service businesses and Shopify stores — plus NFC Google review cards that make leaving a review a one-tap job.",
  founder: {
    name: "Christopher Robinson",
    alternateName: "StackmodeChris",
    jobTitle: "Founder & CEO",
    image: "/img/brand/christopher-robinson.webp",
  },
  email: "",
  address: {
    streetAddress: "8735 Dunwoody Place #12143",
    addressLocality: "Atlanta",
    addressRegion: "GA",
    postalCode: "30350",
    addressCountry: "US",
  },
  logo: "/img/brand/ceo-turbo-logo.png",
  ogImage: "/og/ceoturbo.jpg",
  sameAs: [
    "https://www.youtube.com/@ChristopherRobinson-CEO",
    "https://x.com/ChristopherRCEO",
    "https://www.instagram.com/christopherrobinsonceo/",
    "https://www.tiktok.com/@stackmodechris___",
    "https://www.linkedin.com/in/stackmodechris/",
    "https://stackmode.net",
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
 * The Google review card (NFC tap + QR) — dropshipped, programmed by the buyer.
 *
 * checkoutUrl: paste one Stripe Payment Link per pack (Stripe → Payment Links → New).
 * In each link, turn on "Collect shipping address" and add a custom text field
 * "Business name". The site appends ?client_reference_id=<style>_<pack> so every
 * payment shows which card style was picked. While a pack's link is empty, its
 * Buy button opens an order-request form instead (lead goes to LEADS_WEBHOOK_URL).
 *
 * Check `shipping` and `guarantee` against your supplier before running ads.
 */
export type ReviewPack = { id: "1" | "2" | "5"; qty: number; price: number; label: string; note: string; checkoutUrl: string };

const REVIEW_PACKS: ReviewPack[] = [
  { id: "1", qty: 1, price: 27.99, label: "1 card", note: "Your front counter", checkoutUrl: "" },
  { id: "2", qty: 2, price: 44.99, label: "2 cards", note: "Counter + door, or shop + truck", checkoutUrl: "" },
  { id: "5", qty: 5, price: 89.99, label: "5 cards", note: "Every station, chair or location", checkoutUrl: "" },
];

export const REVIEW_CARD = {
  name: "Google Review Tap Card",
  fullName: "NFC + QR Google Review Card",
  sku: "CT-REVIEW-NFC",
  currency: "USD",
  styles: [
    { id: "blue", label: "Classic Blue", swatch: "linear-gradient(135deg,#3b7bf0 0 55%,#ffffff 55%)", image: 0 },
    { id: "black", label: "Midnight Black", swatch: "linear-gradient(135deg,#0b0b0d 0 55%,#2a2a2e 55%)", image: 4 },
  ],
  packs: REVIEW_PACKS,
  shipping: {
    free: true,
    label: "Free US shipping",
    processing: "Ships in 1–3 business days",
    delivery: "Arrives 7–12 business days after it ships",
    /** Total business days from order to doorstep, used for the "get it by" estimate. */
    minDays: 8,
    maxDays: 15,
  },
  guarantee: "If a card won't program or scan, we replace it or refund you — just tell us within 30 days of delivery.",
  returnDays: 30,
} as const;

export type ReviewStyle = (typeof REVIEW_CARD.styles)[number];

export const fromPrice = Math.min(...REVIEW_CARD.packs.map((p) => p.price));
export const fromPriceLabel = `$${fromPrice.toFixed(2)}`;
export const money2 = (n: number) => `$${n.toFixed(2)}`;
export const packSavings = (p: ReviewPack) => Math.max(0, +(p.qty * REVIEW_CARD.packs[0].price - p.price).toFixed(2));
export const hasCheckout = (p: ReviewPack) => p.checkoutUrl.length > 0;
export const checkoutHref = (p: ReviewPack, style: ReviewStyle["id"]) =>
  `${p.checkoutUrl}${p.checkoutUrl.includes("?") ? "&" : "?"}client_reference_id=${style}_${p.id}`;

/** Google review link setup: the free app buyers use to write their link to the card. */
export const NFC_APP = {
  name: "NFC Tools",
  ios: "https://apps.apple.com/us/app/nfc-tools/id1252962749",
  android: "https://play.google.com/store/apps/details?id=com.wakdev.wdnfc",
} as const;
