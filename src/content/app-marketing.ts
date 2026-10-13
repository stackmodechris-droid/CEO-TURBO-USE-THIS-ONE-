// Content for /app-marketing, the Reddit ad landing page for software developers.
// Rule for this file: every claim is either true on its face, comes from a data file (results.ts, pricing.ts,
// clients.ts), or is a plain description of what we do. No made-up install counts, launch wins or guarantees.
import type { FAQ } from "@/content/services";

/** The explainer clip (HyperFrames render, 4:5, burned-in captions so it works muted). */
export const DEV_VIDEO = {
  src: "/media/dev-the-line.mp4",
  poster: "/media/dev-the-line-poster.webp",
  title: "Why does he get all the users? (a cartoon about developer distribution)",
  description: "A 27-second cartoon: two developers, one line of installs. Why a launch plan with tracking beats posting once. Illustration, not real data.",
  duration: "PT27S",
  width: 1080,
  height: 1350,
  uploadDate: "2026-10-13",
} as const;

export const DEV_PAINS = [
  {
    title: "You posted once and got a spike, then silence",
    body: "A Show HN or a Reddit post is a lottery ticket, not a channel. It sends a day of traffic, then the graph goes flat and you're back to shipping to nobody.",
  },
  {
    title: "You ran ads and can't tell what worked",
    body: "Spend went out and a few installs came in, but you can't say which ad, which audience or which page did it. Without events and UTMs wired up first, ad spend is a guess.",
  },
  {
    title: "Your store page or landing page doesn't sell",
    body: "People land, skim for five seconds and leave. The listing explains your architecture instead of the one problem the app solves for them.",
  },
  {
    title: "Marketing is a different stack and you'd rather ship",
    body: "Keywords, creative, bidding, attribution. It's learnable, but every hour on it is an hour not spent on the product. That's the trade you're already making.",
  },
] as const;

export const DEV_STEPS = [
  { n: "1", title: "Audit (free call)", body: "30 minutes, live. We look at your listing, site, analytics and any ads, and name the one change most likely to move installs. You keep the plan either way." },
  { n: "2", title: "Instrument", body: "Before any spend: GA4, Tag Manager, Meta Pixel + Conversions API, Reddit and TikTok pixels, UTMs and click ids. Events for visit, signup and install or activation, tested live." },
  { n: "3", title: "Launch", body: "A landing page that explains the app in five seconds, plus ad creative that reads like a post, not an ad, on the platform your users actually use." },
  { n: "4", title: "Iterate weekly", body: "Cost per install and cost per activated user, not clicks. Cut what doesn't work, put the budget behind what does." },
] as const;

export const DEV_SERVICES = [
  { title: "Landing page that converts", body: "One page, one job: explain the app, show it working, send people to install or sign up. Fast, mobile-first, built around your product and not a template." },
  { title: "Tracking and attribution", body: "Know which channel drives installs and signups. Pixels, server-side events, UTMs and click ids, installed once and checked end to end." },
  { title: "Paid ads where devs are", body: "Reddit, Meta, TikTok and Google. We write the creative, build the campaigns and manage them. You pay the platforms directly from your own ad accounts." },
  { title: "SEO, AEO and GEO", body: "Get found when people search your category or ask ChatGPT and Perplexity for a tool like yours: structured data, answer-ready pages, indexing and AI-crawler access." },
  { title: "Launch plan", body: "A sequenced plan for Reddit, Hacker News, Product Hunt and Indie Hackers: what to post, when, and how to answer comments. We help you write it. We never astroturf." },
  { title: "Store listing review", body: "Title, subtitle, keywords, screenshots and description reviewed against how people search the App Store and Play Store. Scoped on the call." },
] as const;

export const DEV_WONT = [
  "Fake reviews, bots, incentivized installs or vote rings. They get apps removed.",
  "Guarantee installs, rankings or revenue. Nobody honest can.",
  "Build your app or touch your codebase. You ship the product.",
  "Lock you in. Your ad accounts, analytics and website code stay yours.",
] as const;

export const DEV_FAQS: FAQ[] = [
  { q: "Do you build the app too?", a: "No. You build the product. We handle what happens after it ships: the landing page, ads, tracking, listing and launch plan." },
  { q: "What kinds of products do you work with?", a: "iOS and Android apps, SaaS and web apps, browser extensions, CLI tools, open-source projects and games. If a person can install it or sign up for it, we can market it." },
  { q: "Do you need access to my repo or my users' data?", a: "No. We need access to your analytics, ad accounts and store listing, and you own all of them. We recommend privacy-respecting analytics and you decide what gets installed. We don't resell data." },
  { q: "Will Reddit devs hate an ad?", a: "Not if it reads like a post. They punish hype and reward specifics, so the creative is plain and honest, comments stay on, and we reply to them. If your product isn't a fit for Reddit, we'll tell you and point you to a better channel." },
  { q: "Do you guarantee installs or rankings?", a: "No, and be wary of anyone who does. We give you realistic numbers for your market on the call and report cost per install and cost per activated user every week." },
  { q: "What does it cost?", a: "Setup packages are on the pricing page and start at the Turbo Start price shown below. Ad spend is separate and paid directly to the platforms from your own accounts, so we never mark it up. Store-listing work is scoped on the call." },
  { q: "What is the free call?", a: "A 30-minute live review of your listing, site, analytics and ads. You get the one change we'd make first and a fixed-price plan from our published prices. You keep it whether or not you hire us." },
];
