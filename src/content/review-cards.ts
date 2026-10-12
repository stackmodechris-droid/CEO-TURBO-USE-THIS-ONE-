import type { FAQ } from "./services";
import { REVIEW_CARD, NFC_APP, fromPriceLabel } from "@/config/site";

export const SHOP_PATH = "/google-review-cards";
export const SETUP_PATH = "/google-review-card-setup";
/** The review-card tutorial page filmed for ads: its header and phone bar sell cards instead of the call. */
export const REVIEWS_AD_PATH = "/get-more-reviews";

export type GalleryItem = { src: string; thumb: string; alt: string; live3d?: boolean; w: number; h: number };

const IMG = "/img/review-cards";
export const GALLERY: GalleryItem[] = [
  { src: `${IMG}/feed-white.jpg`, thumb: `${IMG}/card-3d-thumb.webp`, alt: "Double-sided NFC Google review card in 3D: white Review Us On Google front, black NFC back", live3d: true, w: 1200, h: 1200 },
  { src: `${IMG}/shop-both.jpg`, thumb: `${IMG}/shop-both-thumb.webp`, alt: "NFC Google review card front and back: white Review Us On Google side and black NFC side", w: 2048, h: 2048 },
  { src: `${IMG}/shop-tap.jpg`, thumb: `${IMG}/shop-tap-thumb.webp`, alt: "Review card next to a phone showing the review form that opens when you tap it", w: 2048, h: 2048 },
  { src: `${IMG}/shop-5.jpg`, thumb: `${IMG}/shop-5-thumb.webp`, alt: "Pack of five NFC Google review cards fanned out", w: 2048, h: 2048 },
  { src: `${IMG}/specs.webp`, thumb: `${IMG}/specs-thumb.webp`, alt: "Review card specs: white matte front, black NFC back, NTAG215 chip, 504 bytes user memory, waterproof PVC, 85.5 × 54 × 0.76 mm", w: 562, h: 682 },
  { src: `${IMG}/how-it-works.webp`, thumb: `${IMG}/how-it-works-thumb.webp`, alt: "How it works: tap phone, open review link, submit feedback", w: 590, h: 706 },
  { src: `${IMG}/size.webp`, thumb: `${IMG}/size-thumb.webp`, alt: "Card size: 85.5 mm by 54 mm, the size of a credit card", w: 576, h: 508 },
];

export const PRODUCT_POINTS = [
  { title: "iPhone & Android", body: "Every iPhone XS or newer and NFC Android phones. No app for customers." },
  { title: "One tap, 3 seconds", body: "No searching your name, no scrolling Maps — the review form just opens." },
  { title: "Pay once, reuse forever", body: "No subscription. Re-program it anytime, for any location." },
  { title: "Built to live on a counter", body: "Waterproof PVC, credit-card size, matte finish." },
];

export const INCLUDED = ["NFC Google review card(s) — white front, black back", "Step-by-step setup guide (2 minutes)", "Free review-link finder + printable QR for receipts", "Free setup call if you get stuck"];

export const USES = [
  { where: "Front counter & register", why: "Ask while they're paying and happy with the service — the tap takes ten seconds." },
  { where: "Barber chairs & salon stations", why: "Stick one at every station so each stylist can ask after the mirror reveal." },
  { where: "Restaurant tables & check folders", why: "Guests tap while they wait for the card to come back." },
  { where: "Service vans & job sites", why: "Hand it over when the job is done and the customer is looking at the result." },
  { where: "Front desks & waiting rooms", why: "Dentists, gyms, studios and clinics: one card at check-out." },
  { where: "Receipts, invoices & emails", why: "Our free setup tool also makes a QR for your review link — print it on receipts so customers can review later, too." },
];

export const COMPARE: [string, string, string, string][] = [
  ["Steps for the customer", "Tap — the form opens", "Search your name, find the listing, scroll, tap", "Open camera, scan, wait"],
  ["Catches them at the right moment", "Yes — at checkout", "They say “sure” and forget", "Only if they notice it"],
  ["App needed", "No", "No", "No"],
  ["Looks professional", "Yes — printed card", "—", "Usually a taped-up printout"],
];

export const RULES = [
  { ok: true, text: "Ask every customer — Google wants reviews from all your customers." },
  { ok: true, text: "Reply to reviews, good and bad. It builds trust with the next customer." },
  { ok: false, text: "No discounts, freebies or contests in exchange for reviews." },
  { ok: false, text: "Don't only ask happy customers or screen people first (“review gating”)." },
  { ok: false, text: "Never write reviews for customers, or have staff and family review you." },
];

export const SHOP_FAQS: FAQ[] = [
  { q: "How does a Google review card work?", a: "The card has an NFC chip that you program with your Google review link. When a customer holds their phone near the card, the phone opens your Google review form — they pick the stars, write a line and post." },
  { q: "Do my customers need an app?", a: "No. iPhone XS and newer read NFC with no app, and so do most Android phones with NFC switched on (it's on by default on most). For older phones without NFC, our free setup tool makes a QR code for the same review link." },
  { q: "How do I set it up?", a: `You write your review link to the card once, with the free ${NFC_APP.name} app for iPhone or Android. It takes about two minutes. Our setup guide shows exactly where to find your review link in Google Business Profile and every tap in the app.` },
  { q: "Does it work for any business?", a: "Any business with a Google Business Profile — shops, restaurants, salons, barbers, contractors, auto shops, clinics, gyms and studios. If you don't have a profile yet, book a free call and we'll help you set one up." },
  { q: "Can I change the link later?", a: "Yes. Rewrite the card in the app anytime — for example if you open a second location. The only exception is if you choose to lock the card, which makes it permanent." },
  { q: "Is asking for reviews this way allowed by Google?", a: "Yes. Google encourages businesses to ask customers for reviews and provides the review link for exactly this. What's not allowed is offering incentives, asking only happy customers, or posting fake reviews. The card just makes asking quick." },
  { q: "Is there a QR code on the card?", a: "No — it's a clean NFC tap card, so it looks premium on a counter. If you also want a QR code (for receipts, invoices or customers with older phones), our free setup tool makes one for your exact review link that you can print." },
  { q: "Will it work through a phone case?", a: "Through most cases, yes. Very thick, metal or magnetic wallet cases can block NFC — the customer just slips the phone out." },
  { q: "How long does shipping take?", a: `${REVIEW_CARD.shipping.processing}, and it ${REVIEW_CARD.shipping.delivery.toLowerCase()}. ${REVIEW_CARD.shipping.free ? "Shipping is free in the US." : ""}` },
  { q: "What if my card doesn't work?", a: REVIEW_CARD.guarantee },
  { q: "What are the card specs?", a: `${REVIEW_CARD.specs.chip} with ${REVIEW_CARD.specs.memory}, ${REVIEW_CARD.specs.material.toLowerCase()}, ${REVIEW_CARD.specs.size}. White matte front with “Review Us On Google”, black back with the Google G.` },
  { q: "Is this card made by Google?", a: `No. CEO Turbo review cards are an independent product that links to your Google review page. Google is a trademark of Google LLC; we're not affiliated with or endorsed by Google. Cards start at ${fromPriceLabel}.` },
];

export const SETUP_FAQS: FAQ[] = [
  { q: "My iPhone doesn't react when I tap the card", a: "Unlock the phone and hold the top edge of the iPhone (near the camera) flat against the card for a second or two. iPhone XS and newer read cards automatically. On iPhone 7, 8 and X, open the NFC Tag Reader from Control Center first." },
  { q: "My Android phone doesn't react", a: "Make sure NFC is on: Settings → Connected devices (or Connections) → NFC. Then hold the middle of the back of the phone against the card. The screen must be unlocked." },
  { q: "The app says “Write failed”", a: "Take the phone out of a thick or metal case, hold it still on the card until it finishes, and try again. If the card was locked it can't be rewritten — contact us and we'll replace it." },
  { q: "The tap opens my Google listing, not the review form", a: "You wrote a profile or Maps link instead of the review link. Get the link from “Ask for reviews” (or “Get more reviews”) in your Business Profile — it looks like g.page/r/…/review — and write the card again." },
  { q: "Can I stick the card on metal?", a: "Metal blocks NFC. Stick it on glass, wood, plastic or a counter, or put a thin non-metal spacer between the card and the metal surface." },
  { q: "Should I lock the card?", a: "Only once you've tested it and you're sure the link is final. Locking stops anyone else rewriting it, but it's permanent — you can never change the link again." },
];
