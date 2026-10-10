// Meta Pixel. Set VITE_META_PIXEL_ID in Vercel (Settings → Environment Variables) and redeploy.
// Loads after the page is interactive so it never slows first paint; PageView fires on every route.
type Fbq = ((...args: unknown[]) => void) & { callMethod?: (...a: unknown[]) => void; queue: unknown[]; loaded: boolean; version: string; push: unknown };

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;
let started = false;

export function startPixel() {
  if (!PIXEL_ID || started || typeof window === "undefined") return;
  started = true;
  const w = window as unknown as { fbq?: Fbq; _fbq?: Fbq };
  if (w.fbq) return;
  const n = function (...args: unknown[]) {
    if (n.callMethod) n.callMethod(...args);
    else n.queue.push(args);
  } as Fbq;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];
  w.fbq = w._fbq = n;
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);
  n("init", PIXEL_ID);
  n("track", "PageView");
}

export function pixelPageView() {
  (window as unknown as { fbq?: Fbq }).fbq?.("track", "PageView");
}
