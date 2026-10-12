// CEO Turbo service pricing: the ONE place prices live. The /pricing page, every service page's price
// box, the FAQs, JSON-LD offers (Google + AI assistants) and llms.txt all read from here, so a price
// is never different in two places. Change a number here and rebuild.
//
// Model: pay once to set something up properly, then a monthly plan only for the things that need
// ongoing work to keep paying off (website care, SEO/AEO/GEO, ads, email). Everything is an add-on —
// clients pick only what they need. Ad spend is always paid by the client straight to the platform.

export type PriceItem = {
  id: string;
  name: string;
  price: number;
  /** "once" = one-time setup fee, "month" = monthly plan. */
  billing: "once" | "month";
  /** "from" pricing: the starting point of a range. */
  from?: boolean;
  /** Service page this belongs to (/services/<slug>). */
  service?: string;
  summary: string;
  includes: string[];
  popular?: boolean;
};

export const PRICING_TERMS = {
  contract: "No long-term contracts. Monthly plans are month to month — cancel with 30 days' notice.",
  payment: "Setup fees are paid 50% to start and 50% at launch. Monthly plans are billed on the same day each month.",
  adSpend: "Ad spend is paid by you, directly to Meta, Google, Microsoft or TikTok, from your own ad account — we never mark it up.",
  ownership: "You own your website, domain, ad accounts, pixel data, content and email list. If you leave, it all stays yours.",
  results: "SEO, AEO and GEO compound: most clients see movement in 30–90 days and the biggest gains after 3–6 months. Nobody can honestly guarantee a #1 ranking, and we won't.",
} as const;

export const SETUP: PriceItem[] = [
  {
    id: "gbp-setup",
    name: "Google Business Profile setup & optimization",
    price: 297,
    billing: "once",
    service: "google-business-profile",
    summary: "Your free Google listing, set up to win the map pack and turn searches into calls.",
    includes: ["Claim & verification help", "Primary + secondary categories, services and service area", "Keyword-rich description and business details", "10 optimized photos and logo/cover", "Q&A, review link and review QR code", "First 4 Google posts written for you"],
    popular: true,
  },
  {
    id: "social-setup",
    name: "Social profile setup & optimization",
    price: 197,
    billing: "once",
    service: "social-media-optimization",
    summary: "Up to 3 profiles (Instagram, Facebook, TikTok, YouTube or LinkedIn) that make people trust you and click.",
    includes: ["Bios that say what you do and who for", "Profile photo, cover and highlight covers", "Link-in-bio page with booking and review links", "Name, category and contact details consistent everywhere"],
  },
  {
    id: "visibility-foundation",
    name: "SEO, AEO & GEO foundation",
    price: 497,
    billing: "once",
    service: "seo-aeo-geo",
    summary: "The technical groundwork that lets Google rank you and ChatGPT, Gemini and Perplexity name you.",
    includes: ["Technical SEO fixes: speed, indexing, titles, headings", "Schema markup (LocalBusiness, Service, FAQ, Product)", "AI crawler access and an llms.txt file", "Listings and citations cleaned up so your name, address and phone match", "Google Search Console + Bing Webmaster Tools set up"],
  },
  {
    id: "tracking-setup",
    name: "Ads & tracking setup",
    price: 397,
    billing: "once",
    service: "meta-ads",
    summary: "Ad accounts and conversion tracking set up right, so every dollar is measured and the platforms learn who buys.",
    includes: ["Meta Pixel + Conversions API", "Google Ads, GA4 and Tag Manager conversions", "Microsoft (Bing) UET and TikTok Pixel", "Lead, booking and purchase events with de-duplication", "Google Merchant Center for product stores"],
  },
  {
    id: "email-setup",
    name: "Email & SMS setup",
    price: 497,
    billing: "once",
    service: "email-marketing",
    summary: "An email/SMS system that brings customers back and asks for reviews on autopilot.",
    includes: ["Platform setup (Klaviyo, Mailchimp or similar) and domain sending", "Branded email template", "3 automated flows: welcome, review request, win-back", "Signup form on your site"],
  },
];

export const WEBSITES: PriceItem[] = [
  {
    id: "site-artist",
    name: "Artist website",
    price: 997,
    billing: "once",
    service: "website-design",
    summary: "A home for your music that grows your fanbase — not just a link in bio.",
    includes: ["Up to 5 pages: home, music, shows, about, contact", "Release / pre-save page", "Fan email & SMS signup", "Spotify, Apple Music and YouTube embeds", "SEO so you own your name on Google"],
  },
  {
    id: "site-launch",
    name: "Launch website",
    price: 1497,
    billing: "once",
    service: "website-design",
    summary: "A fast, mobile-first site for local service businesses that makes the phone ring.",
    includes: ["Up to 5 pages", "Tap-to-call, quote and booking buttons", "Reviews, job photos and service area", "On-page SEO + schema", "Lead form that sends to your phone and email"],
    popular: true,
  },
  {
    id: "site-growth",
    name: "Growth website",
    price: 2997,
    billing: "once",
    service: "website-design",
    summary: "For businesses ready to dominate their area: more pages, more keywords, more leads.",
    includes: ["Up to 12 pages", "A page for every service and city you serve", "Online booking or estimate request", "Blog / answer pages built for Google and AI answers", "Full conversion tracking"],
  },
  {
    id: "site-shopify",
    name: "Shopify store",
    price: 3497,
    billing: "once",
    service: "website-design",
    summary: "A Shopify store built to convert, with the tracking ads need to scale.",
    includes: ["Theme setup and custom design", "Up to 25 products with SEO titles and descriptions", "Checkout, shipping, tax and payments", "Reviews, upsells and email capture", "Merchant Center + Shopping feed"],
  },
];

export const MONTHLY: PriceItem[] = [
  {
    id: "website-care",
    name: "Website Care",
    price: 97,
    billing: "month",
    service: "website-design",
    summary: "Your site stays fast, secure and up to date — without you thinking about it.",
    includes: ["Hosting management and SSL", "Security, software and plugin updates", "Daily backups and uptime monitoring", "Speed and Core Web Vitals checks", "Up to 1 hour of edits each month"],
  },
  {
    id: "seo-local",
    name: "Local Visibility (SEO, AEO & GEO)",
    price: 497,
    billing: "month",
    service: "seo-aeo-geo",
    summary: "Climb Google and the map pack, and get named in AI answers — every month.",
    includes: ["1 location", "Weekly Google Business Profile posts", "2 answer-ready articles or service pages a month", "Citation building and review-reply help", "Rank + AI answer tracking with a monthly report"],
    popular: true,
  },
  {
    id: "seo-growth",
    name: "Growth Visibility (SEO, AEO & GEO)",
    price: 997,
    billing: "month",
    service: "seo-aeo-geo",
    summary: "For competitive markets, multiple locations or national reach.",
    includes: ["Up to 3 locations", "4 articles or landing pages a month", "Link building and digital PR", "Competitor tracking", "Everything in Local Visibility"],
  },
  {
    id: "ads-management",
    name: "Ads management — first platform",
    price: 597,
    billing: "month",
    service: "meta-ads",
    summary: "Meta, Google, Microsoft, TikTok or X ads that bring leads and sales, managed weekly.",
    includes: ["Campaign strategy, targeting and budgets", "4 new ad creatives a month", "Landing page and lead follow-up advice", "Weekly optimization", "Monthly report in plain English"],
    popular: true,
  },
  {
    id: "ads-additional",
    name: "Each additional ad platform",
    price: 297,
    billing: "month",
    service: "google-ads",
    summary: "Add Google, Microsoft, TikTok or X on top of your first platform.",
    includes: ["Same weekly management", "Shared creative and reporting", "Budget moved to whatever performs best"],
  },
  {
    id: "email-monthly",
    name: "Email & SMS marketing",
    price: 397,
    billing: "month",
    service: "email-marketing",
    summary: "Regular campaigns that turn past customers and fans into repeat sales.",
    includes: ["2 campaigns a month, written and designed", "Flow tuning and A/B tests", "List growth and clean-up", "Monthly report"],
  },
];

export const ALL_PRICES = [...SETUP, ...WEBSITES, ...MONTHLY];

export const usd = (n: number) => `$${n.toLocaleString("en-US")}`;
/** Formatted price of one item by id — used in FAQ text so copy can never drift from the price list. */
export const price = (id: string) => {
  const item = [...SETUP, ...WEBSITES, ...MONTHLY].find((p) => p.id === id);
  if (!item) throw new Error(`Unknown price id ${id}`);
  return usd(item.price);
};
export const priceLabel = (p: PriceItem) => `${p.from ? "from " : ""}${usd(p.price)}${p.billing === "month" ? "/mo" : " one-time"}`;
export const perDay = (monthly: number) => `about $${Math.round((monthly * 12) / 365)} a day`;

/** What each service page shows in its price box: setup first, then the monthly plan(s). */
export function pricesFor(service: string): PriceItem[] {
  const map: Record<string, string[]> = {
    "seo-aeo-geo": ["visibility-foundation", "seo-local", "seo-growth"],
    "website-design": ["site-artist", "site-launch", "site-growth", "site-shopify", "website-care"],
    "meta-ads": ["tracking-setup", "ads-management"],
    "google-ads": ["tracking-setup", "ads-management", "ads-additional"],
    "tiktok-ads": ["tracking-setup", "ads-management", "ads-additional"],
    "x-ads": ["tracking-setup", "ads-management", "ads-additional"],
    "google-business-profile": ["gbp-setup"],
    "social-media-optimization": ["social-setup"],
    "email-marketing": ["email-setup", "email-monthly"],
  };
  return (map[service] ?? []).map((id) => ALL_PRICES.find((p) => p.id === id)!).filter(Boolean);
}

/** Example plans: not discounted bundles, just common combinations so budgets are easy to picture. */
export const EXAMPLE_PLANS: { name: string; who: string; items: string[] }[] = [
  { name: "Get found locally", who: "A local service business starting from scratch", items: ["gbp-setup", "site-launch", "website-care", "seo-local"] },
  { name: "Leads on demand", who: "A business that wants calls this month", items: ["gbp-setup", "tracking-setup", "ads-management", "website-care"] },
  { name: "Artist growth", who: "An artist building a fanbase around releases", items: ["site-artist", "social-setup", "tracking-setup", "ads-management"] },
  { name: "Store that scales", who: "A Shopify brand ready to grow sales", items: ["site-shopify", "tracking-setup", "ads-management", "email-monthly"] },
];

export function planTotals(ids: string[]) {
  const items = ids.map((id) => ALL_PRICES.find((p) => p.id === id)!).filter(Boolean);
  return {
    items,
    setup: items.filter((i) => i.billing === "once").reduce((n, i) => n + i.price, 0),
    monthly: items.filter((i) => i.billing === "month").reduce((n, i) => n + i.price, 0),
  };
}

export const PRICING_FAQS = [
  { q: "How much does CEO Turbo cost?", a: `Every service is priced on its own, so you only pay for what you need. One-time setups: Google Business Profile ${price("gbp-setup")}, social profiles ${price("social-setup")}, SEO/AEO/GEO foundation ${price("visibility-foundation")}, ads & tracking ${price("tracking-setup")}, email & SMS ${price("email-setup")}. Websites ${price("site-artist")}–${price("site-shopify")}. Monthly plans: Website Care ${price("website-care")}, SEO/AEO/GEO from ${price("seo-local")}, ads management from ${price("ads-management")}, email & SMS ${price("email-monthly")}.` },
  { q: "Why is there a setup fee and a monthly fee?", a: "Setup is the one-time work of building something properly — a website, a Google profile, tracking. Monthly plans are only for things that need ongoing work to keep paying off: security and software updates, new content for Google and AI answers, ad optimization and email campaigns. If something doesn't need monthly work, we don't charge monthly for it." },
  { q: "Is there a contract?", a: PRICING_TERMS.contract },
  { q: "Is ad spend included in ads management?", a: PRICING_TERMS.adSpend + " Most local businesses start with $10–$20 a day." },
  { q: "Do I need Website Care if you build my site?", a: `We strongly recommend it. Websites need security patches, software updates, backups and speed checks to stay safe and keep ranking. Website Care covers all of that plus small edits for ${price("website-care")} a month — less than one hour of most developers' time.` },
  { q: "Is SEO, AEO and GEO worth it for a small business?", a: `If one new customer is worth $300 to you, Local Visibility (${price("seo-local")}/mo) pays for itself with two extra customers a month — and unlike ads, the rankings keep bringing customers after you've earned them. ${PRICING_TERMS.results}` },
  { q: "Who owns the website and accounts?", a: PRICING_TERMS.ownership },
  { q: "Can I start small?", a: "Yes. Many clients start with a Google Business Profile setup or a few review cards, see the results, then add a website, SEO or ads. Book a free Brand Boost call and we'll tell you the one thing to start with." },
];
