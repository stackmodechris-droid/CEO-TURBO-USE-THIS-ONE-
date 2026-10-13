// Google Tag Manager (GTM-KRPRZ67Z + GTM-KH6BCWD3). Loaded from code instead of an inline <script> so the site's
// Content-Security-Policy can keep blocking inline scripts. GTM routes the dataLayer events from
// src/lib/track.ts to Google Ads (GA4 is the direct Google tag in src/lib/ga.ts; UET and Meta fire from
// code) — see docs/gtm-container.json.
import { gaPageView } from "@/lib/ga";

export const GTM_ID = "GTM-KRPRZ67Z";
/** Second container (GTM-KH6BCWD3) runs beside the first; both read the same dataLayer. Keep tags unique per container (no duplicate GA4/Ads/Meta/UET tags) or conversions double count. */
export const GTM_IDS = [GTM_ID, "GTM-KH6BCWD3"] as const;

export function startGtm() {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: unknown[]; __gtm?: boolean };
  if (w.__gtm) return;
  w.__gtm = true;
  w.dataLayer = w.dataLayer || [];
  // Push gtm.start ONCE — pushing once per container causes double session counting
  // which creates the "sessions exceed impressions" UTM discrepancy in Google Ads.
  w.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  for (const id of GTM_IDS) {
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtm.js?id=${id}`;
    // Suppress legacy Google API loader errors (apis.google.com/js/client.js?onload=_ga)
    // that come from old GTM tags — they are benign but noisy in reporting tools.
    s.onerror = () => { /* GTM script blocked by ad-blocker — non-fatal */ };
    document.head.appendChild(s);
  }
}

/** Client-side route change → GA4 page_view (direct tag) and the dataLayer "virtual_page_view" for GTM. */
export function gtmPageView(path: string) {
  const w = window as unknown as { dataLayer?: unknown[] };
  gaPageView(path);
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: "virtual_page_view", page_path: path, page_location: window.location.href, page_title: document.title });
}

