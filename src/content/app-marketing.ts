// Content for /app-marketing — the Reddit ad landing page targeting software developers.
import type { FAQ } from "@/content/services";

export const APP_MARKETING_PAINS = [
  {
    title: "You launched and nobody came",
    body: "You spent months building, shipped to the App Store or GitHub, shared on Twitter… and got 12 downloads. The app works. The marketing doesn't.",
  },
  {
    title: "Ads burn cash with zero installs",
    body: "You boosted a post or ran a quick Meta campaign. $200 gone, 3 installs. Without proper tracking, targeting and creative, ad spend is just a donation.",
  },
  {
    title: "You're competing against funded teams",
    body: "VC-backed competitors have marketing people, ad budgets and brand deals. You have code skills and a side project budget. You need leverage, not headcount.",
  },
  {
    title: "ASO, SEO and 'growth hacking' feel like buzzword soup",
    body: "You can architect a database but App Store Optimization sounds like a foreign language. You need someone who speaks both dev and marketing.",
  },
] as const;

export const APP_MARKETING_SERVICES = [
  {
    title: "Landing page that converts",
    body: "A fast, mobile-first page that explains your app in 5 seconds and sends people to install it. Not a template — built for your product.",
  },
  {
    title: "App Store Optimization (ASO)",
    body: "Keyword research, screenshots, descriptions and metadata tuned so the App Store and Play Store rank you where users actually search.",
  },
  {
    title: "Reddit, Meta & targeted ads",
    body: "Campaigns built for dev and tech audiences on Reddit, Meta, TikTok and Google. We write the creative, set up the tracking and manage the spend.",
  },
  {
    title: "SEO, AEO & GEO",
    body: "Your app shows up when people Google your category, ask ChatGPT for recommendations, or say 'best app for X' to Perplexity.",
  },
  {
    title: "Launch strategy",
    body: "Product Hunt, Hacker News, Reddit, Indie Hackers — we've run launches before. We plan the day, write the copy and coordinate the push.",
  },
  {
    title: "Tracking & attribution",
    body: "Know exactly which channel drives installs. GA4, Meta Pixel, Reddit Pixel, UTMs, deep links — wired once, reporting forever.",
  },
] as const;

export const APP_MARKETING_FAQS: FAQ[] = [
  {
    q: "Do you build the app too?",
    a: "No. You build the product — that's your superpower. We handle everything after the code is shipped: the website, the ads, the store listing, the launch and the tracking.",
  },
  {
    q: "What platforms do you support?",
    a: "iOS, Android, web apps, SaaS, browser extensions, CLI tools, open-source projects — if people can install or sign up for it, we can market it.",
  },
  {
    q: "Do you actually know Reddit, Hacker News and Product Hunt?",
    a: "Yes. Our founder comes from the dev world. We know how technical audiences think, what they respect and what makes them scroll past. No 'growth hacking' cringe.",
  },
  {
    q: "What's the free Brand Boost call?",
    a: "A 30-minute call where we audit your current marketing live — your app listing, website, ads and social presence. You get a written plan and a fixed price. No obligation.",
  },
  {
    q: "How fast will I see results?",
    a: "First campaigns go live within 2 weeks of starting. Installs depend on your market, price point and competition — we'll give you realistic numbers on the call.",
  },
  {
    q: "What does it cost?",
    a: "Setup packages start at $997 and include your landing page, store optimization and tracking. Monthly ad management from $300/mo. Exact pricing depends on what you need — the call is free.",
  },
];
