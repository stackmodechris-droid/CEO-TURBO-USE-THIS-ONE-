import type { FAQ } from "./services";
import { fromPriceLabel } from "@/config/site";
import { price } from "@/content/pricing";

export const HOME_FAQS: FAQ[] = [
  { q: "What does CEO Turbo do?", a: `CEO Turbo is a growth agency founded by Christopher Robinson. We build websites, run Meta, Google, TikTok and X ads, set up and optimize Google Business Profiles and social profiles, design promotional emails, and do SEO, AEO and GEO so you show up in Google and AI answers. We also sell NFC Google review cards (from ${fromPriceLabel}) that let customers leave a review with one tap.` },
  { q: "Who do you work with?", a: "Three groups: independent artists and producers, local service businesses (home services, auto, landscaping, barbers, mobile services), and Shopify or online stores. Each has its own page with the work we've done for that group." },
  { q: "What happens on the Brand Boost call?", a: "It's a free 30-minute call. We look at your website, Google profile, social profiles and ads with you, tell you the biggest thing holding back calls or sales, and lay out what we'd do. If it's a fit, you get a written scope and price. If not, you keep the advice." },
  { q: "How much do your services cost?", a: `Every service is an add-on with a published price: Google Business Profile setup ${price("gbp-setup")}, social profiles ${price("social-setup")}, websites from ${price("site-artist")}, Website Care ${price("website-care")}/mo, SEO/AEO/GEO from ${price("seo-local")}/mo and ads management from ${price("ads-management")}/mo. No long-term contracts, and ad spend goes straight to the platform from your own account. Full list at ceoturbo.com/pricing.` },
  { q: "Do you guarantee rankings or leads?", a: "No honest agency can guarantee rankings, AI recommendations or a set number of leads. We show you real results from real clients — like 147 Meta leads at about $7.50 each — and we report your numbers plainly every week." },
  { q: "Where are you based?", a: "CEO Turbo is based in Atlanta, Georgia, and works with clients across the US — currently in Georgia, Colorado and the Washington DC area." },
];

export const AUDIT_FAQS: FAQ[] = [
  { q: "What does the free audit check?", a: "It loads your website and checks the things Google and AI tools look at: titles, headings, content, mobile setup, speed, sitemap, schema markup, FAQ content, phone and location, whether AI crawlers like ChatGPT and Perplexity are blocked, llms.txt, links to your profiles, and whether you appear in open knowledge sources like Wikidata. For businesses it also scores your Google reviews and profile." },
  { q: "What's the difference between SEO, AEO and GEO?", a: "SEO gets you ranked in Google's regular results and map pack. AEO (answer engine optimization) gets your answers quoted in Google's AI Overviews and voice assistants. GEO (generative engine optimization) gets you named when people ask ChatGPT, Gemini or Perplexity who to hire or listen to." },
  { q: "Is it really free?", a: "Yes. No credit card. We ask for your name, email and phone so we can send follow-up help and, if you want, walk you through the report on a free call." },
  { q: "I don't have a website. Can I still run it?", a: "Yes. Leave the website blank — the report shows what you're missing and checks the places you can already be found." },
  { q: "Does it work for artists?", a: "Yes. Switch to Artist and it checks your site or link, whether you own your name on Google, and whether you're in the music and knowledge databases AI tools use, like MusicBrainz, Wikidata and Wikipedia." },
  { q: "What happens after the report?", a: "You can fix things yourself with the steps in the report, or book a free 30-minute call and we'll give you a fixed-price plan to fix them for you." },
];

/** Objection-handling FAQs for the ad landing page and the Brand Boost page. */
export const BOOK_FAQS: FAQ[] = [
  { q: "Is the Brand Boost call really free?", a: "Yes. It's 30 minutes, free, on video or phone. You leave with a clear plan whether you hire us or not." },
  { q: "Is this just a sales pitch?", a: "No pitch deck. We look at your website, Google profile, reviews, socials and ads with you live and tell you what's costing you customers. If you want us to fix it, you get a fixed price in writing. If not, you keep the plan." },
  { q: "How much does it cost to work with you?", a: `You only pay for what you need, and every price is on our pricing page: one-time setups from ${price("social-setup")}, websites from ${price("site-artist")}, monthly plans from ${price("website-care")}/mo. On the call we tell you which pieces will bring customers fastest for your budget — the call itself is free.` },
  { q: "I've tried ads before and wasted money. Why is this different?", a: "Most ads fail because of the offer, the page they land on or the follow-up — not the ad itself. We fix all three. Our Meta campaigns have brought in 147 leads at about $7.50 each, and you see the real dashboards before you spend a dollar." },
  { q: "I don't have a website. Should I still book?", a: "Yes. Many clients start with no site or a weak one. We'll tell you whether you need one now or whether your Google profile and reviews will bring customers faster." },
  { q: "Do you work with artists, not just businesses?", a: "Yes. For artists we focus on more listeners and fans: release pages, Spotify and YouTube growth campaigns, and owning your name on Google." },
  { q: "What should I have ready for the call?", a: "Just your website or social links and an idea of how many more customers or listeners you want. We do the digging." },
];
