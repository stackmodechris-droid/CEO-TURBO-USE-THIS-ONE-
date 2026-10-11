// Google Analytics 4, installed directly as the Google tag (G-XDWPSVBW53). Loaded from code instead of
// an inline <script> so the Content-Security-Policy can keep blocking inline scripts.
// It uses its OWN data layer ("gaLayer") so it never mixes with GTM's "dataLayer": GTM still runs the
// Google Ads tags, and no GA4 tags are left in the GTM container (see docs/gtm-container.json).
export const GA_ID = "G-XDWPSVBW53";

type GaWin = Window & { gaLayer?: unknown[]; gtag?: (...args: unknown[]) => void; __ga?: boolean };

export function startGa() {
  if (typeof window === "undefined") return;
  const w = window as GaWin;
  if (w.__ga) return;
  w.__ga = true;
  w.gaLayer = w.gaLayer || [];
  // gtag.js only understands `arguments` objects, not arrays.
  w.gtag = function () {
    // eslint-disable-next-line prefer-rest-params
    w.gaLayer!.push(arguments);
  };
  w.gtag("js", new Date());
  w.gtag("config", GA_ID, { send_page_view: true });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}&l=gaLayer`;
  document.head.appendChild(s);
}

/** A GA4 event (conversion or funnel step). Safe to call before the tag has loaded. */
export function gaEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  (window as GaWin).gtag?.("event", name, params);
}

/** Client-side route change → GA4 page_view (the first load is sent by the tag itself). */
export function gaPageView(path: string) {
  gaEvent("page_view", { page_path: path, page_location: window.location.href, page_title: document.title });
}
