// Cal.com embed loader. The script loads on idle (or on first click) so it never
// competes with the page's first paint, and every booking opens as an on-page modal.
import { BOOKING } from "@/config/site";

type CalFn = ((...args: unknown[]) => void) & {
  loaded?: boolean;
  ns: Record<string, (...args: unknown[]) => void>;
  q?: unknown[];
};

declare global {
  interface Window {
    Cal?: CalFn;
  }
}

const EMBED_SRC = "https://app.cal.com/embed/embed.js";
let ready: Promise<boolean> | null = null;

/** Official Cal.com bootstrap snippet, kept verbatim in behaviour. */
function bootstrap() {
  const w = window as unknown as Record<string, unknown>;
  if (w.Cal) return;
  const d = document;
  const push = (a: { q: unknown[] }, ar: unknown) => a.q.push(ar);
  const cal = function (this: unknown, ...ar: unknown[]) {
    const self = w.Cal as CalFn & { q: unknown[] };
    if (!self.loaded) {
      self.ns = {};
      self.q = self.q || [];
      const s = d.createElement("script");
      s.src = EMBED_SRC;
      s.async = true;
      d.head.appendChild(s);
      self.loaded = true;
    }
    if (ar[0] === "init") {
      const api = function (...args: unknown[]) {
        push(api as unknown as { q: unknown[] }, args);
      } as unknown as { q: unknown[] };
      const namespace = ar[1];
      api.q = api.q || [];
      if (typeof namespace === "string") {
        self.ns[namespace] = self.ns[namespace] || (api as unknown as CalFn);
        push(self.ns[namespace] as unknown as { q: unknown[] }, ar);
        push(self, ["initNamespace", namespace]);
      } else push(self, ar);
      return;
    }
    push(self, ar);
  } as unknown as CalFn;
  w.Cal = cal;
}

export function loadCal(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (ready) return ready;
  ready = new Promise((resolve) => {
    bootstrap();
    const Cal = window.Cal!;
    Cal("init", BOOKING.namespace, { origin: "https://cal.com" });
    Cal.ns[BOOKING.namespace]("ui", {
      theme: "dark",
      hideEventTypeDetails: false,
      layout: "month_view",
      cssVarsPerTheme: { dark: { "cal-brand": "#ff6b1a" }, light: { "cal-brand": "#ff6b1a" } },
    });
    const script = document.querySelector<HTMLScriptElement>(`script[src="${EMBED_SRC}"]`);
    if (!script) return resolve(false);
    // Real bookings (not just calendar opens) are the conversion Meta should optimize for.
    Cal.ns[BOOKING.namespace]("on", { action: "bookingSuccessful", callback: () => trackBooked("embed") });
    script.addEventListener("load", () => resolve(true), { once: true });
    script.addEventListener("error", () => resolve(false), { once: true });
  });
  return ready;
}

/**
 * source  → hidden booking metadata (which button/page drove the booking)
 * prefill → visible "notes" text the visitor sees and can edit; only for real intent
 */
export type Person = { name?: string; email?: string };

const calConfig = (source?: string, prefill?: string, person?: Person) => ({
  layout: "month_view",
  theme: "dark",
  ...(prefill ? { notes: prefill } : {}),
  ...(person?.name ? { name: person.name } : {}),
  ...(person?.email ? { email: person.email } : {}),
  ...(source ? { "metadata[source]": source } : {}),
  "metadata[page]": typeof window !== "undefined" ? window.location.pathname : "",
});

/** Opens the Brand Boost booking modal; falls back to the Cal.com page if the embed can't load. */
export async function openBooking(source?: string, prefill?: string, person?: Person) {
  track("booking_open", { source });
  const ok = await Promise.race([loadCal(), new Promise<boolean>((r) => setTimeout(() => r(false), 4000))]);
  if (ok && window.Cal?.ns[BOOKING.namespace]) {
    window.Cal.ns[BOOKING.namespace]("modal", { calLink: BOOKING.calLink, config: calConfig(source, prefill, person) });
  } else {
    const q = new URLSearchParams({ ...(person?.name ? { name: person.name } : {}), ...(person?.email ? { email: person.email } : {}), ...(prefill ? { notes: prefill } : {}) });
    window.open(`${BOOKING.url}${q.toString() ? `?${q}` : ""}`, "_blank", "noopener,noreferrer");
  }
}

/** Inline booking calendar mounted into an element by id. */
export async function mountInlineBooking(elementId: string, source?: string, prefill?: string) {
  const ok = await loadCal();
  if (!ok || !window.Cal?.ns[BOOKING.namespace]) return false;
  window.Cal.ns[BOOKING.namespace]("inline", {
    elementOrSelector: `#${elementId}`,
    calLink: BOOKING.calLink,
    config: calConfig(source, prefill),
  });
  return true;
}

type Gtag = (...args: unknown[]) => void;

/** Fires to GA4 / Meta Pixel when they're installed; no-op otherwise. */
export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: Gtag; fbq?: Gtag; dataLayer?: unknown[] };
  w.gtag?.("event", event, params);
  if (event === "booking_open") w.fbq?.("trackCustom", "BookingOpen", params);
  if (event === "booking_complete") w.fbq?.("track", "Schedule", params);
  if (event === "audit_lead" || event === "order_request") w.fbq?.("track", "Lead", params);
  if (event === "card_checkout") w.fbq?.("track", "InitiateCheckout", params);
  w.dataLayer?.push({ event, ...params });
}

/** A confirmed booking, counted once per session whether it came from the embed or the /booked redirect. */
export function trackBooked(via: string) {
  try {
    if (sessionStorage.getItem("ct_booked")) return;
    sessionStorage.setItem("ct_booked", "1");
  } catch {
    /* storage blocked: still count it */
  }
  track("booking_complete", { via });
}
