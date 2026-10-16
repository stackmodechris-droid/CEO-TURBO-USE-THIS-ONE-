import type { Category } from "./clients";
import { price } from "./pricing";

export type FAQ = { q: string; a: string };

export type Service = {
  slug: string;
  name: string;
  /** Short label for nav/cards. */
  short: string;
  icon: "search" | "layout" | "meta" | "google" | "tiktok" | "x" | "pin" | "profile" | "mail";
  metaTitle: string;
  metaDescription: string;
  h1: string;
  /** 40–60 word direct answer: what it is, who it's for, what you get. */
  answer: string;
  outcome: string;
  bestFor: string[];
  includes: string[];
  process: { title: string; body: string }[];
  notFor?: string;
  proof?: { resultKeys?: string[]; clientSlugs?: string[] };
  audiences: Category[];
  faqs: FAQ[];
};

export const SERVICES: Service[] = [
  {
    slug: "home-office-setup",
    name: "Home office & computer setup",
    short: "Office setup",
    icon: "layout",
    metaTitle: "Home Office & Computer Setup — Atlanta Metro Area",
    metaDescription:
      "Home office, computer, desk, Wi-Fi and device setup in Atlanta, Gwinnett and Athens. From $89. Call 470-502-9543.",
    h1: "Home office and computer setup — we build your workspace so you can get to work",
    answer:
      "CEO Turbo provides complete home office and computer setup services for Atlanta metro area residents and businesses. We assemble desks and chairs, set up monitors and computers, configure internet and networks, install software, connect tablets and devices, and organize your entire workspace. Perfect for new home offices, business setups, school computer labs, and anyone who needs a professional tech workspace without the hassle.",
    outcome: "A fully functional, organized workspace ready for work or study — no tech headaches.",
    bestFor: ["People moving into new homes who need office setup", "Remote workers upgrading their home office", "Businesses setting up new office spaces", "Schools needing computer lab setup", "Seniors or anyone who isn't tech-savvy", "Disabled individuals who need accessibility setup"],
    includes: [
      "Desk, chair, and furniture assembly",
      "Computer and monitor setup and configuration",
      "Internet and Wi-Fi network setup",
      "Printer and peripheral installation",
      "Software installation (Microsoft Office, security tools, business apps)",
      "Tablet, phone, and device connection",
      "Cable management and wire organization",
      "Ergonomic workspace optimization",
      "Data transfer from old devices to new",
      "Walkthrough training so you know how to use everything",
    ],
    process: [
      { title: "Consultation", body: "We discuss your needs, space, budget, and what devices you have or need." },
      { title: "Setup", body: "We assemble furniture, install equipment, configure networks, and organize cables." },
      { title: "Configuration", body: "Software is installed, devices are connected, and everything is tested." },
      { title: "Training", body: "We walk you through your new setup so you're confident using it." },
    ],
    notFor: "Problems with an existing device or ongoing IT contracts — we specialize in new setups and installations.",
    audiences: ["local"],
    faqs: [
      { q: "What areas do you serve?", a: "We serve the entire Atlanta metro area within a 50-mile radius, including Atlanta, Decatur, Buckhead, Sandy Springs, Marietta, Smyrna, Roswell, Alpharetta, Johns Creek, Duluth, Norcross, Lawrenceville, Stone Mountain, Athens, Gwinnett County, and all surrounding cities. We also travel up to 2 hours from Duluth, Georgia for larger projects." },
      { q: "How much does home office setup cost?", a: "Our pricing is transparent and listed up front. Basic computer setup starts at $89, full home office setup with furniture assembly starts at $149, and complete business office setups start at $249. All pricing is confirmed before we begin work." },
      { q: "Do you provide the equipment?", a: "We can recommend and source equipment at your request, or we set up what you already have. You provide the furniture and devices, we handle the assembly, installation, and configuration." },
      { q: "How long does setup take?", a: "Most home office setups are completed in 2-4 hours. Larger business office setups or school computer labs may take a full day. We'll give you a time estimate during our consultation." },
      { q: "Do you offer ongoing support?", a: "We focus on setup and installation. For ongoing IT support, we can refer you to trusted partners or discuss a maintenance plan for your specific needs." },
      { q: "Can you set up Mac and iPhone devices?", a: "Yes, we support Windows PCs, Mac computers, iPhones, iPads, Android devices, and most consumer technology. We'll make sure everything works together seamlessly." },
    ],
  },
  {
    slug: "seo-aeo-geo",
    name: "SEO, AEO & GEO",
    short: "SEO · AEO · GEO",
    icon: "search",
    metaTitle: "SEO, AEO & GEO Services — Rank in Google and AI Answers",
    metaDescription:
      "Get found in Google, Bing, AI Overviews, ChatGPT and Perplexity: technical SEO, answer-first content, schema and entity signals. Book a free call.",
    h1: "SEO, AEO and GEO: get found on Google and recommended by AI",
    answer:
      "SEO gets your pages ranked in Google and Bing. AEO (answer engine optimization) structures your content so AI Overviews and assistants can lift a direct answer from it. GEO (generative engine optimization) builds the trust signals that make ChatGPT, Perplexity and Gemini comfortable recommending you. CEO Turbo does all three as one system.",
    outcome: "Show up when buyers search — and when they ask an AI who to hire.",
    bestFor: ["Local service businesses competing in the map pack", "Shopify stores that rely on paid traffic only", "Artists and creators who want their name to return their own site first"],
    includes: [
      "Technical audit: indexing, crawlability, Core Web Vitals, canonicals, robots.txt and sitemaps",
      "Pre-rendered, crawlable HTML so AI crawlers that don't run JavaScript can read every page",
      "Question-led page structure with 40–60 word direct answers under each heading",
      "Schema markup: Organization, LocalBusiness, Service, Product, FAQPage, Article, BreadcrumbList",
      "Google Search Console and Bing Webmaster Tools setup, sitemap submission and IndexNow",
      "Content plan: service pages, comparison pages and answer guides that cover the whole buying decision",
      "Entity consistency: the same name, address, phone and profiles everywhere the web describes you",
      "llms.txt and AI-crawler access rules",
    ],
    process: [
      { title: "Audit", body: "We crawl the site the way Googlebot and AI crawlers do and list every page that can't be fetched, read or indexed." },
      { title: "Fix the foundation", body: "Indexing errors, speed, schema and crawl access first — content can't rank on a site search engines can't read." },
      { title: "Build answer pages", body: "Service, comparison and question pages written so each section can stand alone as a quoted answer." },
      { title: "Measure and expand", body: "Weekly Search Console review: we push pages sitting in positions 5–20 and write new pages for the questions people are actually asking." },
    ],
    notFor: "Anyone looking for a two-week shortcut. We build rankings that last — and keep compounding every month.",
    proof: { clientSlugs: ["mor-handy", "appliance-king", "focusmode-shop"] },
    audiences: ["local", "shopify", "artist", "brand"],
    faqs: [
      { q: "What is the difference between SEO, AEO and GEO?", a: "SEO earns rankings in traditional search results. AEO formats your content so answer engines — Google AI Overviews, featured snippets, voice assistants — can extract a clean answer. GEO builds the credibility and consistency that generative AI tools need before they'll name you in a recommendation. Ranking without being quotable or trusted leaves visibility on the table." },
      { q: "How long does SEO take to work?", a: "Technical fixes and indexing improvements usually show in Search Console within 2–6 weeks. Long-tail rankings typically appear in 1–3 months. Competitive head terms can take 6 months or more. On stackmode.net, impressions climbed steeply in the months after the work started — see the Search Console graph on our results page." },
      { q: "Can you get my business recommended by ChatGPT?", a: "Yes — that's what GEO is for. We make your site easy for AI crawlers to read, structure your pages so answers are easy to quote, and make your business details match across the web: the exact signals ChatGPT, Gemini and Perplexity use to decide who to recommend." },
      { q: "Do I need SEO if I already run ads?", a: "Ads stop the moment you stop paying. Organic rankings and AI citations keep sending buyers. Most clients run ads for immediate leads while SEO compounds underneath." },
    ],
  },
  {
    slug: "website-design",
    name: "Website design",
    short: "Websites",
    icon: "layout",
    metaTitle: "Website Design That Converts — Calls, Bookings & Sales",
    metaDescription:
      "Fast, mobile-first websites for local businesses, artists and Shopify stores, with SEO, schema and booking built in. 20 live client sites to see.",
    h1: "Website design built to turn visitors into calls, bookings and sales",
    answer:
      "CEO Turbo designs and builds conversion-focused websites for local service businesses, artists and online stores. Every site is mobile-first, loads fast, ships with SEO and schema already in place, and is organised around one clear next step — a call, a booking or a checkout. Twenty client sites are live today.",
    outcome: "A site that answers the buyer's questions and makes the next step obvious.",
    bestFor: ["Businesses with an outdated or DIY site", "New businesses launching their first site", "Artists who have outgrown a link-in-bio page"],
    includes: [
      "Custom design matched to your trade and audience — not a reused template",
      "Mobile-first build with tap-to-call, booking or checkout in the first screen",
      "Service, location and FAQ pages structured for search and AI answers",
      "Schema markup, sitemap, Search Console and Bing setup",
      "Speed work: compressed images, lazy-loaded media, Core Web Vitals checks",
      "Booking, estimate or store integration",
      "Copy written from how your customers actually describe the problem",
    ],
    process: [
      { title: "Brand Boost call", body: "30 minutes on your customers, competitors and the one action the site must drive." },
      { title: "Structure and copy", body: "Page map, headlines and calls to action agreed before design starts." },
      { title: "Design and build", body: "We build, you review on a live preview link, we revise." },
      { title: "Launch and index", body: "Domain, analytics, Search Console, Bing and sitemap submission on launch day." },
    ],
    proof: { clientSlugs: ["mor-handy", "phoenix-freedom-firearms", "beyond-labels-gifts", "7uvhavin", "cleardump", "kingstone-landscaping"] },
    audiences: ["local", "shopify", "artist", "brand"],
    faqs: [
      { q: "How long does a website take?", a: "Most single-business sites go from kickoff call to launch in two to four weeks, depending on how quickly content and feedback come back. Stores with many products take longer." },
      { q: "Will I own my website?", a: "Yes. The domain, content and site belong to your business." },
      { q: "Do you build on Shopify?", a: "Yes for stores. Beyond Labels Gifts and FocusMode are examples. Service businesses usually get a faster custom build because they don't need a cart." },
      { q: "Is SEO included?", a: "The technical SEO foundation — page structure, metadata, schema, sitemap and Search Console — ships with every site. Ongoing content and ranking work is a separate SEO, AEO & GEO engagement." },
    ],
  },
  {
    slug: "meta-ads",
    name: "Meta ads (Facebook & Instagram)",
    short: "Meta ads",
    icon: "meta",
    metaTitle: "Facebook & Instagram Ads Management — Leads From $4.31",
    metaDescription:
      "Meta ads setup, creative and management for local businesses, stores and artists: 147 leads at about $7.50 each, lowest $4.31. See the dashboards.",
    h1: "Facebook and Instagram ads that bring leads, not just likes",
    answer:
      "CEO Turbo sets up and manages Meta ads on Facebook and Instagram — pixel and conversion tracking, audiences, lead forms and the ad creative itself. Across seven recent lead campaigns our clients got 147 form leads for $1,103 in total spend: about $7.50 per lead, with the best campaign at $4.31.",
    outcome: "Booked jobs and buyers from a budget you control.",
    bestFor: ["Local services that need booked jobs this month", "Stores with a product people buy on impulse", "Artists building a real listener and follower base"],
    includes: [
      "Business Manager, pixel, Conversions API and domain verification",
      "Campaign structure, audiences and budget plan",
      "Scroll-stopping ad creative — before/after, offer-led and UGC-style",
      "Instant lead forms with qualifying questions",
      "Weekly optimisation: kill losers, scale winners, refresh creative",
      "Plain-English reporting on cost per lead and cost per sale",
    ],
    process: [
      { title: "Offer", body: "We pick the one offer worth advertising — the $15 transfer, the free estimate, the first cut free." },
      { title: "Creative", body: "Two to three ad concepts, each testing a different hook." },
      { title: "Launch", body: "Tracking verified before a dollar is spent." },
      { title: "Optimise", body: "Spend shifts toward the ad and audience with the lowest cost per result." },
    ],
    proof: { resultKeys: ["ryan-pool", "stackmode-repair", "mor-handy-carpet", "appliance-king", "bigzo"] },
    audiences: ["local", "shopify", "artist", "brand"],
    faqs: [
      { q: "How much should I spend on Facebook ads?", a: "Our recent local lead campaigns spent between $52 and $279 each and produced 8–29 leads. A starting test of $10–$20 a day for two to three weeks is usually enough to see which offer and creative work before scaling." },
      { q: "What is a good cost per lead on Facebook?", a: "It depends on the service and area. In Meta's own peer benchmarks shown on our dashboards, similar ad sets had median costs of $7.26 and $12.75 per lead. Our clients' results ranged from $4.31 to $19.91." },
      { q: "Do you design the ads?", a: "Yes — every creative on this site was designed in-house. Creative is usually the biggest lever on cost per lead." },
      { q: "Do I pay the ad spend to you?", a: "No. Ad spend is billed by Meta directly to your card, in your own ad account. You keep the account, data and pixel." },
    ],
  },
  {
    slug: "google-ads",
    name: "Google ads",
    short: "Google ads",
    icon: "google",
    metaTitle: "Google Ads Management — Search, Local Services & Shopping",
    metaDescription:
      "Google Ads for local businesses and Shopify stores: search, Local Services Ads, Performance Max and Shopping, with call and conversion tracking.",
    h1: "Google ads that catch buyers at the moment they search",
    answer:
      "CEO Turbo builds and manages Google Ads for businesses that want customers who are already searching: search campaigns for service keywords, Local Services Ads where available, and Shopping or Performance Max for stores. Every campaign ships with call and conversion tracking so you can see cost per lead, not just clicks.",
    outcome: "Show up at the top of Google when someone types your service and city.",
    bestFor: ["Emergency and high-intent services (repair, removal, plumbing)", "Shopify stores with clear product search demand", "Businesses whose Meta leads are low intent"],
    includes: [
      "Keyword research by intent: emergency, price, comparison, near-me",
      "Campaign build with negative keywords from day one",
      "Ad copy and assets: sitelinks, callouts, call assets, location assets",
      "Google Business Profile and Merchant Center linking",
      "Conversion tracking for calls, forms, bookings and purchases",
      "Search-term reviews to cut wasted spend",
    ],
    process: [
      { title: "Intent map", body: "We separate ready-to-buy searches from research searches and only bid hard on the first group." },
      { title: "Landing page match", body: "Each ad group points at a page that answers that exact search." },
      { title: "Launch with tracking", body: "Calls and forms tracked before go-live." },
      { title: "Weekly pruning", body: "Search terms that waste money become negatives." },
    ],
    proof: { clientSlugs: ["appliance-king", "mor-handy", "ares-tire-and-auto"] },
    audiences: ["local", "shopify"],
    faqs: [
      { q: "Google Ads or Facebook ads — which is better?", a: "Google captures people already searching for your service, so intent is higher and clicks cost more. Meta creates demand with people who weren't searching yet, often at a lower cost per lead. Emergency services usually start on Google; visual offers and products often start on Meta. Many clients run both." },
      { q: "What are Local Services Ads?", a: "Pay-per-lead ads with the “Google Guaranteed” or “Google Screened” badge that appear above regular search ads for many home-service categories. Availability depends on your trade and area." },
      { q: "How fast do Google ads work?", a: "Search ads can generate calls within days of launch. The first two to four weeks are for learning which keywords convert; efficiency improves after that." },
    ],
  },
  {
    slug: "tiktok-ads",
    name: "TikTok ads",
    short: "TikTok ads",
    icon: "tiktok",
    metaTitle: "TikTok Ads Setup & Management — Spark Ads",
    metaDescription:
      "TikTok ads for Shopify stores, artists and consumer brands: pixel setup, Spark Ads, native creative direction and weekly optimization.",
    h1: "TikTok ads that look like TikToks — and sell like ads",
    answer:
      "CEO Turbo sets up TikTok Ads Manager, the TikTok pixel and Events API, then runs Spark Ads and in-feed campaigns built from native-looking video. It suits Shopify stores, artists promoting a release, and brands whose buyers are under 40. We direct the creative so ads feel like content, not commercials.",
    outcome: "Reach a younger audience at scale with creative that doesn't look like an ad.",
    bestFor: ["Shopify products with a visual demo", "Artists pushing a single or merch drop", "Consumer brands with founder-led content"],
    includes: [
      "TikTok Ads Manager, pixel, Events API and catalog setup",
      "Spark Ads from your organic posts or creators' posts",
      "Hook-first creative briefs and scripts",
      "Interest, behavior and lookalike audience testing",
      "Weekly creative refresh plan",
    ],
    process: [
      { title: "Hook bank", body: "We write 10–20 opening lines and test the strongest five." },
      { title: "Film or source", body: "You, a creator or existing footage — we brief it shot by shot." },
      { title: "Launch Spark Ads", body: "Boosting real posts keeps comments and social proof on the ad." },
      { title: "Refresh fast", body: "TikTok creative fatigues quickly; new variations go in weekly." },
    ],
    audiences: ["shopify", "artist", "brand"],
    faqs: [
      { q: "Do TikTok ads work for local businesses?", a: "Sometimes, for visual services with a younger customer base — barbers, detailers, food. For most home services, Google and Meta produce cheaper leads." },
      { q: "What is a Spark Ad?", a: "A Spark Ad promotes an existing organic TikTok post — yours or a creator's — so likes, comments and the profile link stay attached to the ad." },
      { q: "Do I need to film videos myself?", a: "Founder or artist-led video usually performs best, but we can brief creators or cut existing footage." },
    ],
  },
  {
    slug: "x-ads",
    name: "X (Twitter) ads",
    short: "X ads",
    icon: "x",
    metaTitle: "X (Twitter) Ads Setup — Promote Launches, Drops & Offers",
    metaDescription:
      "X (Twitter) ads for artists, creators and brands: pixel setup, promoted posts, keyword and lookalike targeting, and launch campaigns.",
    h1: "X ads for launches, drops and conversations your buyers already follow",
    answer:
      "CEO Turbo sets up X (Twitter) ads for creators, artists and brands that already have a voice on the platform: the X pixel, promoted posts, keyword and follower-lookalike targeting, and short launch campaigns timed to a release, drop or event. X works best as an amplifier for news, not as your only lead source.",
    outcome: "Put a launch in front of the people already talking about your niche.",
    bestFor: ["Artists announcing releases and shows", "Founders and creators with an active X account", "Tech, finance and sports-adjacent products"],
    includes: ["X Ads account, pixel and conversion events", "Promoted posts and follower campaigns", "Keyword, interest and follower-lookalike targeting", "Launch-week campaign calendars", "Reporting on cost per follow, click and conversion"],
    process: [
      { title: "Pick the moment", body: "A release, drop or event gives the ad a reason to exist." },
      { title: "Write native posts", body: "Short, opinionated copy that reads like the account, not an ad." },
      { title: "Target conversations", body: "Keywords and lookalikes of accounts your buyers follow." },
      { title: "Amplify winners", body: "Organic posts that already perform get the budget." },
    ],
    audiences: ["artist", "brand"],
    faqs: [
      { q: "Are X ads worth it?", a: "For timely announcements and niche communities that live on X, yes. For local home services, Google and Meta usually win." },
      { q: "Can X ads grow followers?", a: "Yes — follower campaigns target lookalikes of accounts in your niche. We measure cost per follow and how many of those followers engage afterwards." },
    ],
  },
  {
    slug: "google-business-profile",
    name: "Google Business Profile setup & optimization",
    short: "Google Business Profile",
    icon: "pin",
    metaTitle: "Google Business Profile Optimization — Rank in the Map Pack",
    metaDescription:
      "Google Business Profile setup and optimization: categories, services, attributes, photos, posts and a review system to rank in the map pack.",
    h1: "Google Business Profile optimization to rank in the map pack",
    answer:
      "Google Business Profile optimization means setting the right primary and secondary categories, filling every service, attribute and description field, posting weekly, uploading real photos and building steady review velocity. CEO Turbo sets up or fixes your profile, audits competitors in the map pack, and gives you a review and posting system you can keep running.",
    outcome: "More calls, direction requests and reviews from Google Maps.",
    bestFor: ["Any business with a service area or storefront", "Businesses missing from the map pack for their main service", "Profiles with few or old reviews"],
    includes: [
      "Profile creation or verification support",
      "Competitor category and attribute audit for your top three keywords",
      "Primary and secondary categories, services with descriptions, attributes",
      "750-character keyword-aware description",
      "Photo plan: real jobs, team, vehicles in your service area",
      "8-week post calendar with the first four weeks written",
      "Review request texts, timing and response templates",
      "NAP consistency check across major directories",
    ],
    process: [
      { title: "Competitor teardown", body: "We record every category, attribute and review pace of the businesses ranking above you." },
      { title: "Fix the gaps", body: "Missing categories and attributes are the fastest map-pack wins." },
      { title: "Fill the content", body: "Services, description, photos and first posts." },
      { title: "Review engine", body: "A simple ask-and-respond routine so reviews keep coming." },
    ],
    proof: { clientSlugs: ["oj-junk-removal", "kingstone-landscaping", "bam-sprinklers"] },
    audiences: ["local"],
    faqs: [
      { q: "How do I rank higher on Google Maps?", a: "The biggest controllable factors are the right primary category, complete services and attributes, consistent name/address/phone across the web, steady new reviews that mention your services and towns, and regular posts and photos. Proximity to the searcher also matters and can't be changed." },
      { q: "How many reviews do I need to rank in the map pack?", a: "It depends on your competitors. Our teardown counts how many reviews the top three have and how fast they're getting new ones, then sets a monthly target to catch them." },
      { q: "Should I respond to every review?", a: "Yes. Responses show activity, reassure readers and let you mention the service and area naturally." },
    ],
  },
  {
    slug: "social-media-optimization",
    name: "Social media profile optimization",
    short: "Social profiles",
    icon: "profile",
    metaTitle: "Social Media Profile Optimization — Instagram, TikTok, YouTube",
    metaDescription:
      "Instagram, TikTok, YouTube, Facebook and Spotify profile optimization: bios, links, highlights and branding that turn visitors into followers.",
    h1: "Social media profile optimization that turns visitors into followers and buyers",
    answer:
      "Social media profile optimization rewrites and redesigns your Instagram, TikTok, YouTube, Facebook and streaming profiles so a stranger understands who you are in three seconds and knows what to tap next. CEO Turbo fixes names, bios, profile images, highlights, pinned posts and links, and makes them consistent with your website.",
    outcome: "Profiles that look established and send traffic where it pays.",
    bestFor: ["Artists before a release or label pitch", "Local businesses whose Instagram is their storefront", "Coaches and personal brands"],
    includes: [
      "Search-friendly display names and handles",
      "Bios written around who you help and the next step",
      "Profile photo, banner and highlight-cover design",
      "Pinned-post and highlight strategy",
      "Link hub pointing to your site, booking, store or streams",
      "Consistent branding with your website and Google profile",
    ],
    process: [
      { title: "Audit", body: "We screenshot every profile and note what a first-time visitor sees." },
      { title: "Rewrite", body: "Names, bios and links rewritten around one action." },
      { title: "Redesign", body: "Visual assets so every profile looks like the same brand." },
      { title: "Hand-off", body: "A one-page guide so you keep it consistent." },
    ],
    proof: { clientSlugs: ["7uvhavin", "bigzo", "swole-jd"] },
    audiences: ["artist", "local", "brand", "shopify"],
    faqs: [
      { q: "Does optimizing my Instagram bio help me get found?", a: "Yes. Instagram and TikTok search use your name field and bio text. Putting what you do and where you are in those fields helps the right people find you." },
      { q: "Which platforms do you optimize?", a: "Instagram, TikTok, YouTube, Facebook, X, LinkedIn, plus Spotify for Artists and Apple Music for Artists profiles." },
    ],
  },
  {
    slug: "email-marketing",
    name: "Promotional email campaigns",
    short: "Email campaigns",
    icon: "mail",
    metaTitle: "Promotional Email Campaign Design — Flows That Sell",
    metaDescription:
      "Promotional email design and automation for Shopify stores, artists and local businesses: welcome, abandoned cart, launch and win-back flows.",
    h1: "Promotional email campaigns that turn past customers into repeat sales",
    answer:
      "CEO Turbo designs promotional emails and automated flows — welcome series, abandoned cart, launch announcements, seasonal offers and win-backs — for Shopify stores, artists and local businesses. Email reaches people who already know you, so it's usually the cheapest repeat revenue a business has. We handle design, copy, segmentation and setup.",
    outcome: "Revenue from your list every month, without paying for the click again.",
    bestFor: ["Shopify stores with abandoned carts", "Artists with fans to notify about drops and shows", "Local businesses with seasonal services"],
    includes: [
      "Platform setup: Klaviyo, Shopify Email, Mailchimp or similar",
      "Branded, mobile-first email templates",
      "Welcome, abandoned cart, post-purchase and win-back flows",
      "Launch and seasonal campaign calendars",
      "List-growth pop-ups and lead magnets",
      "Deliverability basics: domain authentication (SPF, DKIM, DMARC)",
    ],
    process: [
      { title: "Map the flows", body: "Which automated emails should fire, and when." },
      { title: "Design and write", body: "One template system, written in your voice." },
      { title: "Set up and test", body: "Triggers, segments and authentication checked." },
      { title: "Campaign calendar", body: "Launches and offers planned a month ahead." },
    ],
    proof: { clientSlugs: ["beyond-labels-gifts", "focusmode-shop"] },
    audiences: ["shopify", "artist", "local"],
    faqs: [
      { q: "What email flows should a Shopify store have first?", a: "Welcome series, abandoned cart, abandoned browse and post-purchase. Together they recover sales from visitors you already paid to get." },
      { q: "How often should I send promotional emails?", a: "Most small brands do well with one campaign a week plus automated flows. Send more around launches and holidays, and keep each email useful." },
    ],
  },
  {
    slug: "conversion-tracking",
    name: "Conversion tracking & ad rescue",
    short: "Fix my ads",
    icon: "search",
    metaTitle: "Ads Not Converting? Conversion Tracking & Ad Rescue",
    metaDescription:
      `Find out why your ads aren't converting: GA4, Tag Manager, Clarity, Meta and Google tracking audited and fixed. One-time fix ${price("conversion-rescue")}, then ${price("tracking-watch")}/mo.`,
    h1: "Ads not converting? Fix the tracking first, then stop the wasted spend",
    answer:
      "If your ads get clicks but few calls or sales, the problem is usually measurement: missing or double-counted conversions, broken pixels, no values, junk search terms. CEO Turbo audits GA4, Google Tag Manager, Microsoft Clarity, Meta Pixel and Conversions API, Google Ads and Microsoft Ads, fixes every event, sets real conversion values and tests it live, so the platforms learn who actually buys.",
    outcome: "Every dollar of ad spend measured, and the platforms learning from your real buyers.",
    bestFor: ["Businesses spending on ads with clicks but few calls, bookings or sales", "Shopify stores whose purchases don't show up in Google, Meta or Microsoft", "Agencies and freelancers who want a specialist to fix their clients' tracking"],
    includes: [
      "Audit of GA4, Google Tag Manager, Microsoft Clarity and every ad pixel",
      "Meta Pixel + Conversions API with de-duplicated events",
      "Google Ads and Microsoft Ads conversions with real values",
      "Calls, forms, bookings and purchases tracked and tested live",
      "Merchant Center product feed and policy fixes for stores",
      "A written wasted-spend fix list and a 30-minute walkthrough",
    ],
    process: [
      { title: "Audit", body: "We check every tag, pixel, conversion, feed and search term, and list what is broken or wasting spend." },
      { title: "Fix", body: "We repair and test every event, set conversion values for your business, and remove double counting." },
      { title: "Watch", body: "Optional Tracking Watch keeps it healthy and trims wasted spend each month." },
    ],
    proof: { resultKeys: ["ryan-pool", "stackmode-repair", "mor-handy-carpet", "appliance-king", "bigzo"] },
    audiences: ["local", "shopify", "artist", "brand"],
    faqs: [
      { q: "Why aren't my ads converting?", a: "The most common causes are conversions that aren't tracked or are counted twice, broken pixels or Conversions API events, no conversion values, campaigns optimizing for clicks instead of leads or sales, and search terms you never excluded. The audit finds which ones apply to you." },
      { q: "What do you set up?", a: "GA4, Google Tag Manager, Microsoft Clarity, Meta Pixel and Conversions API, Google Ads and Microsoft Ads conversions, TikTok and Reddit pixels when you use them, and Merchant Center for stores. Every event is tested live before we call it done." },
      { q: "How much does it cost?", a: "Conversion Rescue is a one-time fix, and Tracking Watch is a small monthly plan that keeps it healthy. Both prices are published on this page and on the pricing page." },
      { q: "Do I need to give you my passwords?", a: "No. You invite us as an admin or partner on your ad accounts, analytics and tag manager, and you can remove access any time." },
      { q: "Will you promise more sales?", a: "No honest agency can. What we can promise is that you will be able to see which ads, keywords and pages produce calls and sales, and that the ad platforms get accurate data to optimize with." },
    ],
  },
];

export const serviceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug);
