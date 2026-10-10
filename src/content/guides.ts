import type { FAQ } from "./services";

export type GuideSection = {
  h2: string;
  /** Direct answer, 40–60 words — written to be quotable on its own. */
  answer: string;
  body?: string[];
  bullets?: string[];
  table?: { head: string[]; rows: string[][] };
};

export type Guide = {
  slug: string;
  /** Override for guides that keep a legacy URL. */
  path?: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  summary: string;
  audience: "artist" | "local" | "shopify" | "all";
  published: string;
  updated: string;
  readMinutes: number;
  sections: GuideSection[];
  faqs: FAQ[];
  related: { label: string; to: string }[];
};

export const guidePath = (g: Guide) => g.path ?? `/guides/${g.slug}`;

const DATE = "2026-10-10";

export const GUIDES: Guide[] = [
  {
    slug: "seo-vs-aeo-vs-geo",
    title: "SEO vs AEO vs GEO: what's the difference and which do you need?",
    metaTitle: "SEO vs AEO vs GEO: The Difference, Explained Simply",
    metaDescription:
      "SEO ranks you, AEO makes you quotable, GEO makes AI trust you. A plain-English breakdown with a checklist for each — and which one to start with.",
    summary:
      "SEO gets your page ranked. AEO gets a direct answer lifted from it. GEO gets your business named by AI assistants like ChatGPT and Perplexity. You need all three, in that order.",
    audience: "all",
    published: DATE,
    updated: DATE,
    readMinutes: 7,
    sections: [
      {
        h2: "What is SEO?",
        answer:
          "SEO (search engine optimization) is the work that gets a web page crawled, indexed and ranked in Google and Bing for the searches your buyers type. It covers technical health, page relevance and authority from links and mentions. SEO is the base layer: if a page isn't indexed, no answer engine or AI can use it.",
        bullets: ["Pages can be crawled and indexed", "Titles and headings match the search", "The site is fast and works on mobile", "Other trusted sites link to or mention you"],
      },
      {
        h2: "What is AEO (answer engine optimization)?",
        answer:
          "AEO is formatting content so answer engines — Google's AI Overviews and featured snippets, voice assistants and AI chat tools — can extract a clean, self-contained answer. In practice it means question-shaped headings, a 40–60 word direct answer under each, lists and tables for comparisons, and visible FAQs that match real questions.",
        body: [
          "AI systems don't read a page top to bottom like a person. They split it into chunks and score each chunk against the question. A section that only makes sense after reading the three before it scores badly. A section that answers its own heading in the first two sentences scores well.",
        ],
        bullets: ["Question-led H2s (“How much does X cost?”)", "A direct answer in the first 40–60 words of each section", "Tables for comparisons, numbered steps for processes", "Visible FAQ blocks with FAQPage schema"],
      },
      {
        h2: "What is GEO (generative engine optimization)?",
        answer:
          "GEO is earning enough trust and clarity that generative AI tools — ChatGPT, Perplexity, Gemini, Copilot, Claude — are willing to recommend or cite you. It depends on AI crawlers being able to fetch your pages, consistent business facts across the web, original data and expertise, and third-party mentions that confirm what you say about yourself.",
        bullets: [
          "Server-rendered HTML that crawlers without JavaScript can read",
          "Robots.txt that allows AI search crawlers such as OAI-SearchBot, PerplexityBot and Claude-SearchBot",
          "The same name, address, phone and profiles everywhere",
          "Original numbers only you have — your prices, results, case studies",
          "Named authors with real experience",
        ],
      },
      {
        h2: "SEO vs AEO vs GEO at a glance",
        answer:
          "SEO decides whether you're found, AEO decides whether your words are used in the answer, and GEO decides whether an AI trusts you enough to name you. They build on each other: an unindexed page can't be quoted, and an untrustworthy source won't be recommended.",
        table: {
          head: ["", "SEO", "AEO", "GEO"],
          rows: [
            ["Goal", "Rank in results", "Be the extracted answer", "Be recommended or cited by AI"],
            ["Where it shows", "Google & Bing results, map pack", "AI Overviews, snippets, voice", "ChatGPT, Perplexity, Gemini, Copilot"],
            ["Main levers", "Indexing, relevance, links", "Structure, direct answers, FAQs", "Crawl access, consistency, original data, mentions"],
            ["Measured in", "Search Console clicks & position", "Snippet and AI Overview appearances", "AI referrals and manual prompt checks"],
          ],
        },
      },
      {
        h2: "Which one should you start with?",
        answer:
          "Start with technical SEO, because nothing else works on pages that can't be crawled. Then restructure your money pages for AEO with direct answers and FAQs. GEO comes last and never really ends — it's the ongoing work of publishing original information and keeping your business facts consistent across the web.",
        body: [
          "A common mistake is chasing AI visibility on a site that is still a client-side JavaScript app. Many AI crawlers fetch the raw HTML and never run your scripts, so they see an empty page. Pre-rendering every route is often the single biggest GEO fix available.",
        ],
      },
      {
        h2: "How do you measure AI search visibility?",
        answer:
          "Track referral traffic from chatgpt.com, perplexity.ai and similar domains in your analytics, watch Search Console for impressions on longer question-style queries, and run a fixed set of prompts in each assistant every month to see whether your business is named. Treat it as a trend, not a daily number.",
      },
    ],
    faqs: [
      { q: "Is AEO replacing SEO?", a: "No. Answer engines mostly pull from pages that already rank or are at least indexed. AEO is a layer on top of SEO, not a replacement." },
      { q: "Does schema markup help with AI search?", a: "Schema makes your facts unambiguous — prices, hours, services, authors. It isn't a ranking switch, but it reduces the chance an AI misreads your page. Only mark up what's visible on the page." },
      { q: "What is llms.txt?", a: "A plain-text file at your site root that lists your key pages for language models. It's a low-effort, optional signal; adoption by AI companies varies." },
    ],
    related: [
      { label: "SEO, AEO & GEO services", to: "/services/seo-aeo-geo" },
      { label: "How to get recommended by ChatGPT", to: "/guides/how-to-get-recommended-by-chatgpt" },
      { label: "Our Search Console results", to: "/results" },
    ],
  },
  {
    slug: "facebook-ads-cost-per-lead",
    title: "How much do Facebook ads cost per lead for a local business? (Real 2026 data)",
    metaTitle: "Facebook Ads Cost Per Lead for Local Businesses — Real 2026 Data",
    metaDescription:
      "Real Meta lead-form results from 7 campaigns: $4.31 to $19.91 per lead, $8.01 average across 105 leads — and what drove the cheapest ones.",
    summary:
      "Across seven Meta lead-form campaigns we ran in July–August 2026, clients got 105 leads for $841.26 — an average of $8.01 per lead. The cheapest was $4.31 (computer repair); the most expensive was $19.91 (outlet replacement).",
    audience: "local",
    published: DATE,
    updated: DATE,
    readMinutes: 6,
    sections: [
      {
        h2: "What does a Facebook lead cost for a local service business?",
        answer:
          "In our July–August 2026 campaigns, Meta lead-form ads for local services cost between $4.31 and $19.91 per lead, averaging $8.01 across 105 leads and $841.26 in spend. Meta's own peer benchmarks on those dashboards showed median costs of $7.26 and $12.75 per lead for similar ad sets.",
        table: {
          head: ["Campaign", "Leads", "Cost per lead", "Spend"],
          rows: [
            ["Computer repair (Stackmode)", "12", "$4.31", "$51.77"],
            ["Water system (Ryan Pool Enagic)", "29", "$4.89", "$141.70"],
            ["Carpet cleaning (Mor Handy)", "13", "$5.36", "$69.72"],
            ["Appliance repair (Appliance King)", "13", "$7.36", "$95.73"],
            ["Lead form set 1 (Stackmode)", "16", "$7.48", "$119.64"],
            ["Lead form set 3 (Stackmode)", "8", "$10.50", "$84.01"],
            ["Outlet replacement (Mor Handy)", "14", "$19.91", "$278.69"],
          ],
        },
      },
      {
        h2: "Why were some leads four times cheaper than others?",
        answer:
          "The cheapest campaigns paired a specific, visual problem with a clear before-and-after and a low-commitment offer. The most expensive — outlet replacement — was a less visual, lower-urgency service shown to a broad audience. Creative and offer moved cost per lead far more than targeting did.",
        bullets: [
          "Computer repair ($4.31): “Don't buy a new computer” — a money-saving hook against a $1,200 alternative",
          "Carpet cleaning ($5.36): before/after photos of stains people recognise from their own homes",
          "Outlet replacement ($19.91): a fix people postpone, so fewer felt urgency to submit a form",
        ],
      },
      {
        h2: "Who actually filled out the forms?",
        answer:
          "Home-service leads skewed older than many owners expect. Carpet cleaning leads were 92% women, mostly 55 and over. Computer repair leads were 83% men, and 7 of the 12 were 65 or older. Water-system leads peaked at ages 55–64. Write and design your ads for the person who actually converts, not the audience you assume.",
      },
      {
        h2: "How much should a local business spend to test Facebook ads?",
        answer:
          "Our campaigns produced 8–29 leads on $52–$279 of spend. A practical test is $10–$20 per day for two to three weeks with two or three creatives, then move budget to whichever ad has the lowest cost per lead. Judge on leads that become booked jobs, not clicks or likes.",
        bullets: ["Pick one offer — a free inspection, a launch price, a first-visit discount", "Use an instant lead form with one qualifying question", "Call every lead within five minutes", "Refresh creative when cost per lead rises for a week"],
      },
      {
        h2: "Are Facebook leads good quality?",
        answer:
          "They can be, if the form filters a little. Instant forms are easy to submit, which keeps costs low but invites curiosity clicks. Adding one qualifying question — service needed, ZIP code or timeline — and calling fast usually improves the share of leads that book.",
      },
    ],
    faqs: [
      { q: "What is a good cost per lead on Facebook for home services?", a: "Under the peer medians Meta showed us — $7.26 to $12.75 — is a strong result. Our best home-service campaign hit $4.31." },
      { q: "Is Google Ads cheaper than Facebook for leads?", a: "Usually not per lead, but Google leads come from people already searching, so they often convert to jobs at a higher rate. Compare cost per booked job." },
      { q: "Where is this data from?", a: "Meta Ads Manager performance overviews for CEO Turbo client campaigns in July–August 2026. Screenshots are on our results page." },
    ],
    related: [
      { label: "See the ad dashboards", to: "/results" },
      { label: "Meta ads management", to: "/services/meta-ads" },
      { label: "Local business growth", to: "/local-business" },
    ],
  },
  {
    slug: "how-to-get-recommended-by-chatgpt",
    title: "How to get your business recommended by ChatGPT and other AI assistants",
    metaTitle: "How to Get Your Business Recommended by ChatGPT (2026)",
    metaDescription:
      "Seven steps to raise your odds of being named by ChatGPT, Perplexity and Gemini: crawl access, answer-first pages, consistent facts and original data.",
    summary:
      "AI assistants recommend businesses they can fetch, understand and verify. Make your site readable without JavaScript, answer buyer questions directly, keep your details identical everywhere, publish information only you have, and earn mentions on other sites.",
    audience: "all",
    published: DATE,
    updated: DATE,
    readMinutes: 6,
    sections: [
      {
        h2: "How does ChatGPT decide which businesses to recommend?",
        answer:
          "When a question needs current information — “best junk removal in Atlanta” — assistants with search run several web searches, pull candidate pages, read the most relevant chunks and blend them with reviews and listings. You need to appear in those searches, be readable when fetched, and look trustworthy enough to name.",
      },
      {
        h2: "Step 1: Make sure AI crawlers can read your site",
        answer:
          "Many AI crawlers download raw HTML and don't run JavaScript. If your site is a client-side app, they see a blank page. Pre-render or server-render every page, and check that robots.txt doesn't block OAI-SearchBot, ChatGPT-User, PerplexityBot or Claude-SearchBot.",
        bullets: ["View your page source — is the text there?", "Allow AI search crawlers in robots.txt", "Keep pages fast; slow pages get truncated or skipped"],
      },
      {
        h2: "Step 2: Answer buyer questions directly on your pages",
        answer:
          "Put the questions buyers actually ask as headings — what it costs, how long it takes, which areas you serve — and answer each in the first two sentences underneath. Assistants quote chunks, and a chunk that answers its own heading is the one that gets used.",
      },
      {
        h2: "Step 3: Keep your business facts identical everywhere",
        answer:
          "Use exactly the same business name, address, phone, hours and service list on your website, Google Business Profile, Bing Places, Yelp, Facebook and industry directories. Conflicting facts make an AI less confident, and less confident systems tend to recommend someone else.",
      },
      {
        h2: "Step 4: Publish information only you have",
        answer:
          "Real prices, real results, real job photos and case studies give an assistant something it can't get elsewhere. Generic advice is available everywhere; your own numbers are not. That's why our guide on Facebook lead costs uses our clients' actual dashboards.",
      },
      {
        h2: "Step 5: Add structured data that matches the page",
        answer:
          "Organization or LocalBusiness, Service, Product, FAQPage and Article schema make your facts machine-readable. Only mark up what's visible on the page — schema that contradicts the page can hurt trust rather than help it.",
      },
      {
        h2: "Step 6: Earn mentions and reviews off your site",
        answer:
          "Assistants cross-check what you say about yourself against reviews, directories, news and other sites. Steady Google reviews that mention your service and town, local press, partner pages and industry listings all act as independent confirmation.",
      },
      {
        h2: "Step 7: Check your visibility every month",
        answer:
          "Write ten prompts a buyer would use — “who's the best appliance repair in Macon?” — and run them in ChatGPT, Perplexity, Gemini and Copilot monthly. Note whether you're named and which sources are cited, then improve the pages and profiles those sources point to.",
      },
    ],
    faqs: [
      { q: "Can I pay to be recommended by ChatGPT?", a: "Organic recommendations can't be bought. Some AI products are introducing ads, which are labelled separately from organic answers." },
      { q: "How long does it take to show up in AI answers?", a: "Assistants that search the live web can pick up changes within weeks of a page being indexed. Answers drawn from training data change much more slowly." },
    ],
    related: [
      { label: "SEO vs AEO vs GEO", to: "/guides/seo-vs-aeo-vs-geo" },
      { label: "SEO, AEO & GEO services", to: "/services/seo-aeo-geo" },
      { label: "Google Business Profile checklist", to: "/guides/google-business-profile-checklist" },
    ],
  },
  {
    slug: "google-business-profile-checklist",
    title: "Google Business Profile optimization checklist (2026)",
    metaTitle: "Google Business Profile Optimization Checklist (2026)",
    metaDescription:
      "A field-by-field Google Business Profile checklist: categories, services, attributes, description, photos, posts and reviews — and why each matters.",
    summary:
      "Choose the most specific primary category, add every relevant secondary category, list all services with descriptions, turn on matching attributes, write a 750-character description, upload real photos weekly, post weekly and keep new reviews coming.",
    audience: "local",
    published: DATE,
    updated: DATE,
    readMinutes: 6,
    sections: [
      {
        h2: "Which Google Business Profile category should I choose?",
        answer:
          "Choose the most specific primary category that describes your main money-making service, then add secondary categories for every other service you genuinely offer. Check what the top three businesses in the map pack use — a missing secondary category is often why you don't appear for a whole group of searches.",
      },
      {
        h2: "What should go in the services section?",
        answer:
          "List every service you'd want to be found for, each with a two-to-three sentence description that names the service, the areas you cover and one benefit. It's one of the few text fields on your profile you fully control, and many businesses leave it empty.",
      },
      {
        h2: "Do attributes matter?",
        answer:
          "Yes. Attributes like “free estimates,” “online appointments,” “veteran-owned” or “wheelchair accessible” help Google match you to specific searches and show trust badges on your listing. If every top competitor has an attribute and you don't, treat it as a baseline requirement.",
      },
      {
        h2: "How should I write my business description?",
        answer:
          "Use the 750 characters to say what you do, who you serve, where you work and why to choose you, in plain sentences. Mention your main service and two or three towns naturally. Don't paste your website's About page or stuff keywords.",
      },
      {
        h2: "How often should I add photos and posts?",
        answer:
          "Upload three to five real photos a week — finished jobs, before-and-afters, your team and vehicles in the neighbourhoods you serve — and publish one or two posts a week. Consistency signals an active business; a burst of 50 photos once a year doesn't.",
      },
      {
        h2: "How do I get more Google reviews?",
        answer:
          "Ask every happy customer within 24 hours by text with a direct review link, follow up once after three days, and reply to every review. Encourage customers to mention the service and their town — reviews like “great furnace install in Highland Park” help both trust and relevance.",
        bullets: ["Send the link while the job is fresh", "One reminder, never more", "Reply to every review within a few days", "Never buy or gate reviews — it violates Google's policies"],
      },
      {
        h2: "Full checklist",
        answer:
          "Work through these in order: the first four are the fastest wins, the last three are ongoing habits that compound over months.",
        bullets: [
          "Verified profile with exact legal business name",
          "Specific primary category plus all relevant secondary categories",
          "Every service listed with a description",
          "All accurate attributes turned on",
          "Service area or address, hours, phone, website and booking link",
          "750-character description",
          "Logo, cover photo and at least 10 real photos",
          "Weekly photos and posts",
          "A review request routine and replies to every review",
          "The same name, address and phone on your website and directories",
        ],
      },
    ],
    faqs: [
      { q: "Can I use a virtual office address on Google Business Profile?", a: "Google's guidelines don't allow virtual offices or mailboxes as a storefront address. Service-area businesses can hide their address and list the areas they serve instead." },
      { q: "Does posting on Google Business Profile help ranking?", a: "Posts are a modest signal of activity, and they help conversion by giving searchers fresh offers and photos to look at." },
    ],
    related: [
      { label: "Google Business Profile service", to: "/services/google-business-profile" },
      { label: "Local business growth", to: "/local-business" },
      { label: "Website checklist for local businesses", to: "/guides/local-business-website-checklist" },
    ],
  },
  {
    slug: "how-to-get-more-spotify-listeners",
    title: "How to get more Spotify listeners as an independent artist",
    metaTitle: "How to Get More Spotify Listeners as an Independent Artist",
    metaDescription:
      "A practical plan to grow monthly listeners: fix your profiles, pitch every release, use pre-saves, run small ads and turn listeners into fans.",
    summary:
      "Fix your profiles so every one points to your music, release on a steady schedule, pitch each release in Spotify for Artists at least seven days early, run small ads to your artist profile, and capture fans' emails so you're not dependent on any algorithm.",
    audience: "artist",
    published: DATE,
    updated: DATE,
    readMinutes: 6,
    sections: [
      {
        h2: "What's the fastest way to get more monthly listeners?",
        answer:
          "Send consistent traffic to your artist profile rather than a single song, release regularly, and pitch every release to Spotify's editorial team through Spotify for Artists at least seven days before release day. People who save and follow you feed Release Radar and algorithmic playlists, which compounds listeners over time.",
      },
      {
        h2: "Step 1: Make every profile point to your music",
        answer:
          "Use the same artist name, photo and bio on Spotify, Apple Music, Instagram, TikTok, YouTube and your website, and make your music the first link everywhere. Fans who find you on one platform should never wonder whether they've found the right artist on another.",
        bullets: ["Claim Spotify for Artists and Apple Music for Artists", "Upload a header image and artist pick", "Link your socials inside Spotify", "Pin your latest release on every social profile"],
      },
      {
        h2: "Step 2: Release on a schedule",
        answer:
          "A single every four to eight weeks keeps you on followers' Release Radar and gives you a reason to promote. Long gaps reset momentum; consistent drops build it.",
      },
      {
        h2: "Step 3: Pitch and pre-save every release",
        answer:
          "Submit an unreleased track to Spotify editorial through Spotify for Artists at least seven days before release with genre, mood and story details. Run a pre-save link two weeks ahead so day-one streams and saves come from people who already care.",
      },
      {
        h2: "Step 4: Run small ads to your profile",
        answer:
          "Small Meta, TikTok or X campaigns aimed at fans of similar artists can bring real visitors to your profile cheaply. BIGZO's profile-growth campaign produced 165 profile and page visits for $53.59 — $0.32 each, 62% under Meta's peer median.",
      },
      {
        h2: "Step 5: Turn listeners into fans you own",
        answer:
          "Streams can disappear with an algorithm change; an email or SMS list doesn't. Use your website to collect emails with early access, merch drops or show presales, and message that list every release.",
      },
      {
        h2: "Step 6: Get your presence ready for features and labels",
        answer:
          "Blogs, playlist curators, promoters and A&Rs check you out before replying. An artist website with your story, best tracks, live footage, numbers and booking contact turns a cold pitch into a credible one.",
      },
    ],
    faqs: [
      { q: "Should I pay for playlist placements?", a: "Avoid services that guarantee streams or placements. Spotify can remove tracks with artificial streams. Ads to your own profile are a safer way to pay for reach." },
      { q: "How many monthly listeners do labels look for?", a: "There's no fixed number. Labels look at growth rate, engagement, saves-to-streams ratio and live demand as much as the headline figure." },
    ],
    related: [
      { label: "Artist growth services", to: "/artist" },
      { label: "BIGZO case study", to: "/portfolio/bigzo" },
      { label: "Social media profile optimization", to: "/services/social-media-optimization" },
    ],
  },
  {
    slug: "shopify-visitors-no-sales",
    title: "Shopify store getting visitors but no sales? 9 fixes",
    metaTitle: "Shopify Visitors But No Sales? 9 Fixes That Work",
    metaDescription:
      "Why a Shopify store gets traffic but no sales — unclear offer, weak product pages, surprise costs, wrong traffic — and nine fixes to try in order.",
    summary:
      "Most stores with traffic but no sales have a product-page problem, not a traffic problem: the offer is unclear, photos don't sell, objections go unanswered or checkout surprises the buyer. Fix the page, then the traffic.",
    audience: "shopify",
    published: DATE,
    updated: DATE,
    readMinutes: 5,
    sections: [
      {
        h2: "Why does my Shopify store get visitors but no sales?",
        answer:
          "Usually because the product page doesn't answer the buyer's questions fast enough — what it is, why it's worth the price, what's included, shipping time and returns — or because the traffic isn't the right audience. Check the page before spending more on ads.",
      },
      {
        h2: "The 9 fixes, in order",
        answer:
          "Start with the free fixes on the product page, then checkout, then traffic quality. Each one removes a reason to leave.",
        bullets: [
          "1. Say what it is and who it's for in the first line above the fold",
          "2. Show real photos and a short video of the product in use",
          "3. Put the price, options and “Add to cart” in the first screen on mobile",
          "4. List exactly what's included — box, card, warranty",
          "5. Answer shipping time, returns and sizing next to the button",
          "6. Show reviews or proof near the price, not only at the bottom",
          "7. Remove surprise costs — show shipping early",
          "8. Turn on abandoned-cart emails",
          "9. Check that ad audiences match the product's real buyer",
        ],
      },
      {
        h2: "How do I know if it's a traffic problem or a page problem?",
        answer:
          "Look at add-to-cart rate. If many people add to cart but don't buy, it's checkout or cost. If few add to cart, it's the product page or the traffic. If visitors leave within seconds, the ad and the page don't match.",
      },
      {
        h2: "What a high-converting product page looks like",
        answer:
          "Beyond Labels Gifts' necklace page is a good model: finish options shown as priced cards, everything included listed above the button, a secure-checkout note, and a floating summary that keeps “checkout” visible while the shopper browses photos.",
      },
    ],
    faqs: [
      { q: "What is a normal Shopify conversion rate?", a: "Many small stores convert somewhere between 1% and 3% of sessions, varying widely by product, price and traffic source." },
      { q: "Should I add more products to get more sales?", a: "Usually not. One well-presented best-seller with focused ads beats a large catalog nobody can browse." },
    ],
    related: [
      { label: "Shopify store growth", to: "/shopify" },
      { label: "Promotional email campaigns", to: "/services/email-marketing" },
      { label: "Beyond Labels Gifts case study", to: "/portfolio/beyond-labels-gifts" },
    ],
  },
  {
    slug: "local-business-website-checklist",
    title: "What a local business website needs to get more calls",
    metaTitle: "Local Business Website Checklist — 12 Things That Get Calls",
    metaDescription:
      "The 12 things a local service business website needs to turn visitors into calls: tap-to-call, service area, prices, proof, speed and schema.",
    summary:
      "A local website gets calls when the phone number, service and area are visible in the first screen, prices or starting prices are shown, real job photos and reviews prove the work, and the page loads fast on a phone.",
    audience: "local",
    published: DATE,
    updated: DATE,
    readMinutes: 5,
    sections: [
      {
        h2: "What should be above the fold on a local business website?",
        answer:
          "What you do, where you do it, and how to reach you — in that order. A headline naming the service and area, a tap-to-call button, a free-estimate or booking button, and one line of proof such as years in business, licensing or review count.",
      },
      {
        h2: "The 12-point checklist",
        answer:
          "Use this as a pass/fail list. Every “no” is a reason a visitor calls a competitor instead.",
        bullets: [
          "Service and city in the headline",
          "Tap-to-call button visible on mobile without scrolling",
          "A second, lower-pressure action — estimate, text or booking",
          "Starting prices or a launch offer",
          "Real job photos, ideally before and after",
          "Licensing, insurance, years in business or BBB",
          "Reviews near the call button",
          "A page for each main service",
          "Service areas listed by town",
          "Hours and response time",
          "LocalBusiness schema and a Google Business Profile link",
          "Loads in under 2.5 seconds on a phone",
        ],
      },
      {
        h2: "Examples from real local sites",
        answer:
          "BAM Sprinklers puts two phone lines and business hours in its hero. Phoenix Freedom Firearms leads with a flat $15 transfer price. ClearDump uses a $150 launch special because a new company has no reviews yet. Each answers the buyer's biggest hesitation first.",
      },
    ],
    faqs: [
      { q: "Should a local business show prices on its website?", a: "Show starting prices or typical ranges where you can. Prices filter out poor-fit leads and increase calls from people ready to buy." },
    ],
    related: [
      { label: "Website design", to: "/services/website-design" },
      { label: "Local business growth", to: "/local-business" },
      { label: "See 13 local sites we built", to: "/portfolio" },
    ],
  },
  {
    slug: "how-to-get-more-google-reviews",
    path: "/how-to-get-more-google-reviews",
    title: "How do I get more Google reviews for my business?",
    metaTitle: "How to Get More Google Reviews (Without Breaking the Rules)",
    metaDescription:
      "Ask every customer at the moment the job ends, make it one tap with your review link or an NFC card, and reply to every review. The rules and the setup.",
    summary:
      "Ask every customer at the moment they're done — at checkout or when the job's finished — and make leaving a review one step. Your Google review link (from “Ask for reviews” in Business Profile) on an NFC tap card, receipts and follow-up texts does that. Never offer incentives or ask only happy customers.",
    audience: "local",
    published: DATE,
    updated: DATE,
    readMinutes: 5,
    sections: [
      {
        h2: "Why do Google reviews matter so much?",
        answer:
          "Reviews are the first thing people compare in the map pack, and Google says review count and rating factor into local ranking. A business with more recent reviews looks safer to call, so it gets the click — even with a similar rating.",
      },
      {
        h2: "Where do I find my Google review link?",
        answer:
          "Sign in to the Google account that manages your business, search your business name on Google (or open Google Maps), then click “Ask for reviews” in your Business Profile and copy the link. It looks like g.page/r/…/review and opens the review form directly.",
      },
      {
        h2: "What's the easiest way to ask?",
        answer:
          "Ask in person at the moment the job ends, and make it one step. An NFC review card at the register lets customers tap their phone and land on your review form; a QR code does the same for any camera. Then send the same link in your receipt or follow-up text.",
        bullets: ["Ask every customer, at checkout or when you finish the job", "Use the direct review link, not your Maps listing", "Put a tap card where people pay or pick up", "Add the link to receipts, invoices and texts", "Reply to every review within a few days"],
      },
      {
        h2: "What's against Google's rules?",
        answer:
          "Offering discounts, freebies or entries in exchange for reviews; asking only customers you expect to be happy (review gating); writing reviews for customers; and reviews from staff or family. These get reviews removed and can get a profile restricted. The FTC also bans fake and incentivized reviews.",
      },
      {
        h2: "How do NFC review cards work?",
        answer:
          "An NFC review card has a small chip that stores your review link. When a customer holds their phone near it, the phone opens your Google review form — no app needed on iPhone XS and newer or on NFC-enabled Android phones. You program the card once with a free app like NFC Tools.",
      },
    ],
    faqs: [
      { q: "How many Google reviews do I need?", a: "There's no magic number — you need more recent reviews than the businesses you compete with in the map pack. Check the top three for your main search and aim to pass them." },
      { q: "Can I respond to bad reviews?", a: "Yes, and you should. Reply calmly, take it offline, and fix the issue if it's fair. Future customers read your replies as much as the review." },
      { q: "Can I ask for reviews by text or email?", a: "Yes. Send your direct review link to every customer — just don't offer anything in return or filter who gets it." },
    ],
    related: [
      { label: "Shop Google review cards", to: "/google-review-cards" },
      { label: "Review card setup guide", to: "/google-review-card-setup" },
      { label: "Google Business Profile optimization", to: "/services/google-business-profile" },
    ],
  },
];

export const guideBySlug = (slug: string) => GUIDES.find((g) => g.slug === slug);
