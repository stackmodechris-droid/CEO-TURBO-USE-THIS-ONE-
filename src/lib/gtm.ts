// Google Tag Manager (GTM-KRPRZ67Z). Loaded from code instead of an inline <script> so the site's
// Content-Security-Policy can keep blocking inline scripts. GTM routes the dataLayer events from
// src/lib/track.ts to Google Ads (GA4 is the direct Google tag in src/lib/ga.ts; UET and Meta fire from
// code) — see docs/gtm-container.json.
import { gaPageView } from "@/lib/ga";

export const GTM_ID = "GTM-KRPRZ67Z";

export function startGtm() {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: unknown[]; __gtm?: boolean };
  if (w.__gtm) return;
  w.__gtm = true;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(s);
}

/** Client-side route change → GA4 page_view (direct tag) and the dataLayer "virtual_page_view" for GTM. */
export function gtmPageView(path: string) {
  const w = window as unknown as { dataLayer?: unknown[] };
  gaPageView(path);
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: "virtual_page_view", page_path: path, page_location: window.location.href, page_title: document.title });
}
