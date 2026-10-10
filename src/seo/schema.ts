// JSON-LD builders. Every node references the shared Organization/Person/WebSite
// by @id so search engines and AI systems see one consistent entity graph.
import { SITE, BOOKING, REVIEW_CARD, PITCH_VIDEO } from "@/config/site";
import { GALLERY, SHOP_PATH } from "@/content/review-cards";
import type { FAQ, Service } from "@/content/services";
import type { Client } from "@/content/clients";
import type { Guide } from "@/content/guides";
import { guidePath } from "@/content/guides";

const abs = (path: string) => (path.startsWith("http") ? path : `${SITE.url}${path}`);

export const ORG_ID = `${SITE.url}/#organization`;
export const PERSON_ID = `${SITE.url}/#founder`;
export const WEBSITE_ID = `${SITE.url}/#website`;
export const PRODUCT_ID = `${SITE.url}${SHOP_PATH}#product`;
export const AUDIT_ID = `${SITE.url}/free-audit#tool`;

export type JsonLd = Record<string, unknown>;

export const organization = (): JsonLd => ({
  "@type": ["Organization", "ProfessionalService"],
  "@id": ORG_ID,
  name: SITE.name,
  alternateName: ["CEOTurbo", "ceoturbo.com"],
  url: SITE.url,
  logo: { "@type": "ImageObject", url: abs(SITE.logo) },
  image: abs(SITE.ogImage),
  description: SITE.description,
  slogan: SITE.tagline,
  founder: { "@id": PERSON_ID },
  address: { "@type": "PostalAddress", ...SITE.address },
  areaServed: { "@type": "Country", name: "United States" },
  sameAs: SITE.sameAs,
  knowsAbout: [
    "Search engine optimization",
    "Answer engine optimization",
    "Generative engine optimization",
    "Website design",
    "Meta ads",
    "Google Ads",
    "TikTok ads",
    "Google Business Profile optimization",
    "Email marketing",
    "Google review generation",
    "NFC review cards",
    "Music artist marketing",
    "Shopify marketing",
  ],
  potentialAction: {
    "@type": "ReserveAction",
    name: `Book a ${BOOKING.name}`,
    target: { "@type": "EntryPoint", urlTemplate: BOOKING.url, actionPlatform: ["https://schema.org/DesktopWebPlatform", "https://schema.org/MobileWebPlatform"] },
  },
});

export const founder = (): JsonLd => ({
  "@type": "Person",
  "@id": PERSON_ID,
  name: SITE.founder.name,
  alternateName: SITE.founder.alternateName,
  jobTitle: SITE.founder.jobTitle,
  image: abs(SITE.founder.image),
  url: abs("/about"),
  worksFor: { "@id": ORG_ID },
  sameAs: SITE.sameAs,
  knowsAbout: ["Website design", "SEO", "AI search optimization", "Paid social advertising", "Brand growth"],
});

export const website = (): JsonLd => ({
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE.url,
  name: SITE.name,
  publisher: { "@id": ORG_ID },
  inLanguage: "en-US",
});

export const webPage = (path: string, name: string, description: string, type = "WebPage"): JsonLd => ({
  "@type": type,
  "@id": `${abs(path)}#webpage`,
  url: abs(path),
  name,
  description,
  isPartOf: { "@id": WEBSITE_ID },
  about: { "@id": ORG_ID },
  inLanguage: "en-US",
});

export const breadcrumbs = (items: { name: string; path: string }[]): JsonLd => ({
  "@type": "BreadcrumbList",
  itemListElement: [{ name: "Home", path: "/" }, ...items].map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: abs(item.path),
  })),
});

export const faqPage = (faqs: FAQ[], path: string): JsonLd => ({
  "@type": "FAQPage",
  "@id": `${abs(path)}#faq`,
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

export const service = (s: Service): JsonLd => ({
  "@type": "Service",
  "@id": `${abs(`/services/${s.slug}`)}#service`,
  name: s.name,
  serviceType: s.name,
  description: s.answer,
  provider: { "@id": ORG_ID },
  areaServed: { "@type": "Country", name: "United States" },
  url: abs(`/services/${s.slug}`),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: `${s.name} — what's included`,
    itemListElement: s.includes.map((item) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: item },
    })),
  },
});

export const reviewCardProduct = (): JsonLd => ({
  "@type": "Product",
  "@id": PRODUCT_ID,
  name: REVIEW_CARD.fullName,
  sku: REVIEW_CARD.sku,
  description:
    "An NFC + QR review card for any business with a Google Business Profile. Customers tap their phone (or scan the QR code) and your Google review form opens — no app needed. You program it once with the free NFC Tools app.",
  image: GALLERY.filter((g) => !g.tilt).map((g) => abs(g.src)),
  brand: { "@type": "Brand", name: SITE.name },
  category: "Business & Industrial > Signage",
  offers: REVIEW_CARD.packs.map((p) => ({
    "@type": "Offer",
    name: p.label,
    url: abs(SHOP_PATH),
    price: p.price.toFixed(2),
    priceCurrency: REVIEW_CARD.currency,
    eligibleQuantity: { "@type": "QuantitativeValue", value: p.qty },
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
    seller: { "@id": ORG_ID },
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingRate: { "@type": "MonetaryAmount", value: 0, currency: REVIEW_CARD.currency },
      shippingDestination: { "@type": "DefinedRegion", addressCountry: "US" },
      deliveryTime: {
        "@type": "ShippingDeliveryTime",
        handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 3, unitCode: "DAY" },
        transitTime: { "@type": "QuantitativeValue", minValue: 7, maxValue: 12, unitCode: "DAY" },
      },
    },
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      applicableCountry: "US",
      returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
      merchantReturnDays: REVIEW_CARD.returnDays,
      returnMethod: "https://schema.org/ReturnByMail",
      returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
    },
  })),
});

export const auditTool = (): JsonLd => ({
  "@type": "WebApplication",
  "@id": AUDIT_ID,
  name: "CEO Turbo Free SEO, AEO & GEO Audit",
  url: abs("/free-audit"),
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  description: "Free online audit that scores a business or artist's visibility on Google (SEO), in AI answers (AEO) and in generative AI recommendations (GEO), with a prioritized fix list.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  provider: { "@id": ORG_ID },
});

export const caseStudy = (c: Client): JsonLd => ({
  "@type": "CreativeWork",
  "@id": `${abs(`/portfolio/${c.slug}`)}#work`,
  name: `${c.name} website`,
  headline: `${c.name}: ${c.industry} website by CEO Turbo`,
  description: c.overview,
  image: abs(`/img/work/${c.slug}.webp`),
  creator: { "@id": ORG_ID },
  url: abs(`/portfolio/${c.slug}`),
  about: {
    "@type": "Organization",
    name: c.name,
    url: c.url,
    ...(c.location ? { areaServed: c.location } : {}),
  },
});

export const article = (g: Guide): JsonLd => ({
  "@type": "Article",
  "@id": `${abs(guidePath(g))}#article`,
  headline: g.title,
  description: g.metaDescription,
  abstract: g.summary,
  datePublished: g.published,
  dateModified: g.updated,
  author: { "@id": PERSON_ID },
  publisher: { "@id": ORG_ID },
  mainEntityOfPage: abs(guidePath(g)),
  image: abs(SITE.ogImage),
  inLanguage: "en-US",
});

export const itemList = (name: string, items: { name: string; path: string }[]): JsonLd => ({
  "@type": "ItemList",
  name,
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, url: abs(it.path) })),
});

/** The Brand Boost call as a named, free service — helps "CEO Turbo Brand Boost" searches resolve to us. */
export const brandBoost = (): JsonLd => ({
  "@type": "Service",
  "@id": `${SITE.url}/brand-boost#service`,
  name: "Brand Boost",
  alternateName: ["CEO Turbo Brand Boost", "Brand Boost call"],
  serviceType: "Marketing strategy consultation",
  description: "A free 30-minute growth call: CEO Turbo reviews your website, Google Business Profile, reviews, social profiles and ads live and gives you a fixed-price plan to get more customers, reviews and listeners.",
  url: abs("/brand-boost"),
  provider: { "@id": ORG_ID },
  areaServed: { "@type": "Country", name: "United States" },
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", url: abs("/brand-boost") },
});

export const video = (path: string): JsonLd => ({
  "@type": "VideoObject",
  "@id": `${abs(path)}#video`,
  name: PITCH_VIDEO.title,
  description: PITCH_VIDEO.description,
  thumbnailUrl: abs(PITCH_VIDEO.poster),
  contentUrl: abs(PITCH_VIDEO.src),
  uploadDate: "2026-10-10",
  duration: PITCH_VIDEO.duration,
  publisher: { "@id": ORG_ID },
});

export const graph = (nodes: JsonLd[]) => ({ "@context": "https://schema.org", "@graph": nodes });
export { abs };
