// Cal.com embed loader. The script loads on idle (or on first click) so it never
// competes with the page's first paint, and every booking opens as an on-page modal.
import { BOOKING } from "@/config/site";
import { attribution, track, trackBooked } from "@/lib/track";

export { track, trackBooked };

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

const UI = {
  theme: "dark",
  layout: "month_view",
  cssVarsPerTheme: { dark: { "cal-brand": "#ff6b1a" }, light: { "cal-brand": "#ff6b1a" } },
};

/** Namespaces: the site-wide modal/inline calendar, and the quiz's calendar (no repeated event details). */
export const QUIZ_NS = "brandboostquiz";
const inited = new Set<string>();

/**
 * The booking app lives on app.cal.com (where embed.js is served from). The embed only reveals the
 * calendar iframe once it hears from this origin, so a cal.com origin here leaves a blank box.
 */
export const CAL_ORIGIN = "https://app.cal.com";

/** Calendar iframe status per namespace, from Cal's linkReady / linkFailed embed events. */
type LinkStatus = "ready" | "failed";
const linkListeners = new Map<string, Set<(s: LinkStatus) => void>>();

export function onLinkStatus(ns: string, fn: (s: LinkStatus) => void) {
  const set = linkListeners.get(ns) ?? new Set();
  linkListeners.set(ns, set);
  set.add(fn);
  return () => void set.delete(fn);
}

/** Resolves false if the booking page reports it failed (wrong link, event hidden); true once it shows times or after `ms`. */
function waitForLink(ns: string, ms: number) {
  return new Promise<boolean>((resolve) => {
    const off = onLinkStatus(ns, (s) => done(s === "ready"));
    const timer = setTimeout(() => done(true), ms);
    function done(ok: boolean) {
      clearTimeout(timer);
      off();
      resolve(ok);
    }
  });
}

function initNamespace(ns: string) {
  const Cal = window.Cal!;
  if (inited.has(ns)) return;
  inited.add(ns);
  Cal("init", ns, { origin: CAL_ORIGIN });
  Cal.ns[ns]("ui", { ...UI, hideEventTypeDetails: ns === QUIZ_NS });
  for (const [action, status] of [["linkReady", "ready"], ["linkFailed", "failed"]] as const)
    Cal.ns[ns]("on", { action, callback: () => linkListeners.get(ns)?.forEach((fn) => fn(status)) });
  // Real bookings (not just calendar opens) are the conversion the ad platforms should optimize for.
  Cal.ns[ns]("on", {
    action: "bookingSuccessfulV2",
    callback: (e: { detail?: { data?: Record<string, unknown> } }) => {
      const d = e?.detail?.data ?? {};
      const uid = typeof d.uid === "string" ? d.uid : undefined;
      trackBooked("embed", uid, bookerFrom(d));
    },
  });
}

/** Forgets a failed embed load (blocked request, offline blip) so the next attempt starts clean instead of staying broken until a page refresh. */
function resetCal() {
  ready = null;
  inited.clear();
  document.querySelectorAll(`script[src="${EMBED_SRC}"]`).forEach((s) => s.remove());
  delete (window as unknown as Record<string, unknown>).Cal;
}

/** Resolves true once the Cal.com embed is usable. A failed load is not cached: calling again retries. */
export function loadCal(ns: string = BOOKING.namespace): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (!ready) {
    ready = new Promise((resolve) => {
      bootstrap();
      initNamespace(BOOKING.namespace);
      const script = document.querySelector<HTMLScriptElement>(`script[src="${EMBED_SRC}"]`);
      if (!script) {
        resetCal();
        return resolve(false);
      }
      script.addEventListener("load", () => resolve(true), { once: true });
      script.addEventListener(
        "error",
        () => {
          resetCal();
          resolve(false);
        },
        { once: true },
      );
    });
  }
  const current = ready;
  if (window.Cal) initNamespace(ns);
  return current;
}

/** loadCal that gives up after `ms`, so a stalled network shows the fallback button instead of a spinner forever. */
export const loadCalWithin = (ns: string, ms = 6000) => Promise.race([loadCal(ns), new Promise<boolean>((r) => setTimeout(() => r(false), ms))]);

/**
 * source  → hidden booking metadata (which button/page drove the booking)
 * prefill → visible "notes" text the visitor sees and can edit; only for real intent
 * person  → name / email / phone the visitor already typed (so they don't type them twice)
 * fields  → booking-form fields by slug (the hidden quiz answers on the Cal.com event)
 * meta    → extra booking metadata, read by api/cal-webhook.js
 */
export type Person = { name?: string; email?: string; phone?: string };
export type Prefill = { source?: string; prefill?: string; person?: Person; fields?: Record<string, string | undefined>; meta?: Record<string, string | number | undefined> };

const defined = (o: Record<string, unknown> = {}) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== ""));

const calConfig = ({ source, prefill, person, fields, meta }: Prefill = {}) => ({
  layout: "month_view",
  theme: "dark",
  ...(prefill ? { notes: prefill } : {}),
  ...(person?.name ? { name: person.name } : {}),
  ...(person?.email ? { email: person.email } : {}),
  ...(person?.phone ? { attendeePhoneNumber: person.phone } : {}),
  ...defined(fields),
  ...(source ? { "metadata[source]": source } : {}),
  "metadata[page]": typeof window !== "undefined" ? window.location.pathname : "",
  ...Object.fromEntries(Object.entries(defined(meta)).map(([k, v]) => [`metadata[${k}]`, String(v).slice(0, 480)])),
  // Read by api/cal-webhook.js so the server-side Meta / TikTok "Schedule" matches this browser.
  ...attributionMeta(),
});

function attributionMeta() {
  if (typeof window === "undefined") return {};
  const a = attribution();
  const keep = ["fbp", "fbc", "fbclid", "gclid", "msclkid", "ttclid", "ttp", "utm_source", "utm_campaign"] as const;
  // The visitor's browser string lets the server-side Schedule event match this browser (Meta scores ip/user agent).
  return { ...Object.fromEntries(keep.filter((k) => a[k]).map((k) => [`metadata[${k}]`, a[k]!])), ...(navigator.userAgent ? { "metadata[ua]": navigator.userAgent.slice(0, 400) } : {}) };
}

/** The Cal.com booking page itself, prefilled — used when the embed can't show. */
export function bookingPageUrl(prefill?: string, person?: Person, fields?: Prefill["fields"]) {
  const q = new URLSearchParams(defined({ name: person?.name, email: person?.email, attendeePhoneNumber: person?.phone, notes: prefill, ...fields }) as Record<string, string>);
  return `${BOOKING.url}${q.toString() ? `?${q}` : ""}`;
}

/** Opens the Brand Boost booking modal; falls back to the Cal.com page if the embed can't load. */
export async function openBooking(source?: string, prefill?: string, person?: Person, extra: Omit<Prefill, "source" | "prefill" | "person"> = {}) {
  track("booking_open", { source });
  const ns = BOOKING.namespace;
  const ok = await loadCalWithin(ns, 4000);
  const url = bookingPageUrl(prefill, person, extra.fields);
  // After the wait above, phones often block a new tab; go there in this tab instead of doing nothing.
  const fallback = () => {
    if (!window.open(url, "_blank")) window.location.assign(url);
  };
  if (!ok || !window.Cal?.ns[ns]) return fallback();
  const shown = waitForLink(ns, 15000);
  window.Cal.ns[ns]("modal", { calLink: BOOKING.calLink, config: calConfig({ source, prefill, person, ...extra }) });
  if (!(await shown)) fallback();
}

/** Inline booking calendar mounted into an element by id. Resolves false if the embed or the booking page fails. */
export async function mountInlineBooking(elementId: string, source?: string, prefill?: string, opts: { ns?: string } & Omit<Prefill, "source" | "prefill"> = {}) {
  const { ns = BOOKING.namespace, ...rest } = opts;
  const ok = await loadCalWithin(ns);
  if (!ok || !window.Cal?.ns[ns]) return false;
  const shown = waitForLink(ns, 10000);
  window.Cal.ns[ns]("inline", {
    elementOrSelector: `#${elementId}`,
    calLink: BOOKING.calLink,
    config: calConfig({ source, prefill, ...rest }),
  });
  return shown;
}

/** Best-effort booker details from the Cal.com success payload (field names vary by version). */
function bookerFrom(d: Record<string, unknown>) {
  const attendees = (d.attendees ?? (d.booking as Record<string, unknown> | undefined)?.attendees) as { email?: string; name?: string; phoneNumber?: string }[] | undefined;
  const a = Array.isArray(attendees) ? attendees[0] : undefined;
  const responses = (d.responses ?? {}) as Record<string, unknown>;
  const email = a?.email ?? (typeof responses.email === "string" ? responses.email : undefined);
  const name = a?.name ?? (typeof responses.name === "string" ? responses.name : undefined);
  const phone = a?.phoneNumber ?? (typeof responses.attendeePhoneNumber === "string" ? responses.attendeePhoneNumber : undefined);
  return email || phone ? { email, name, phone } : undefined;
}
