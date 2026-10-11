// One event layer for every ad platform.
//
// Every call pushes a GA4-style event (with a unique event_id) to the dataLayer, where Google Tag
// Manager (GTM-KRPRZ67Z) routes it to Google Ads (docs/gtm-container.json), and sends the same event to
// GA4 through the direct Google tag (src/lib/ga.ts). Microsoft UET and
// the Meta Pixel are fired from code below, so do NOT add UET or Meta tags in GTM (double counting).
// The Meta Pixel gets the matching standard event with the same id as eventID, so the server-side
// Conversions API copy (api/_lib/meta-capi.js) is de-duplicated instead of double counted.

import { gaEvent } from "@/lib/ga";
import { uetEvent } from "@/lib/uet";

type Fn = (...args: unknown[]) => void;
type Win = Window & { dataLayer?: unknown[]; fbq?: Fn };

export type UserData = { email?: string; phone?: string; name?: string };
export type Item = { item_id: string; item_name: string; item_variant?: string; price: number; quantity: number };
export type Ecommerce = { currency: string; value: number; items: Item[] };

/** dataLayer event → Meta event. `custom` events go through trackCustom. */
const META: Record<string, { name: string; custom?: boolean }> = {
  view_item: { name: "ViewContent" },
  add_to_cart: { name: "AddToCart" },
  begin_checkout: { name: "InitiateCheckout" },
  generate_lead: { name: "Lead" },
  book_call: { name: "Schedule" },
  booking_open: { name: "BookingOpen", custom: true },
  audit_start: { name: "AuditStart", custom: true },
  audit_complete: { name: "AuditComplete", custom: true },
};

/** CEO Turbo's Meta Pixel (Events Manager → Data sources). VITE_META_PIXEL_ID overrides it. */
export const DEFAULT_PIXEL_ID = "3232222473609236";
export const PIXEL_ID = () => (import.meta.env.VITE_META_PIXEL_ID as string | undefined) || DEFAULT_PIXEL_ID;

export const newEventId = (prefix: string) => `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

const win = () => (typeof window === "undefined" ? null : (window as Win));

/** E.164-ish phone for Google/Microsoft enhanced conversions (US default). */
export const e164 = (phone = "") => {
  const d = phone.replace(/\D/g, "");
  if (!d) return undefined;
  return d.length === 10 ? `+1${d}` : `+${d}`;
};

const splitName = (name = "") => {
  const [first, ...rest] = name.trim().split(/\s+/);
  return { first: first || undefined, last: rest.join(" ") || undefined };
};

function metaParams(params: Record<string, unknown>, ecommerce?: Ecommerce) {
  if (!ecommerce) return params;
  return {
    ...params,
    value: ecommerce.value,
    currency: ecommerce.currency,
    content_type: "product",
    content_ids: ecommerce.items.map((i) => i.item_id),
    contents: ecommerce.items.map((i) => ({ id: i.item_id, quantity: i.quantity, item_price: i.price })),
    num_items: ecommerce.items.reduce((n, i) => n + i.quantity, 0),
  };
}

/** Lets the Meta Pixel match the visitor (advanced matching). The pixel hashes these itself. */
export function identify(user: UserData) {
  const w = win();
  const id = PIXEL_ID();
  if (!w?.fbq || !id || (!user.email && !user.phone)) return;
  const { first, last } = splitName(user.name);
  w.fbq("init", id, {
    ...(user.email ? { em: user.email.trim().toLowerCase() } : {}),
    ...(user.phone ? { ph: user.phone.replace(/\D/g, "") } : {}),
    ...(first ? { fn: first.toLowerCase() } : {}),
    ...(last ? { ln: last.toLowerCase() } : {}),
  });
}

/**
 * Fires one conversion event everywhere. Returns the event_id so a server-side copy can reuse it.
 * `user` adds enhanced-conversion data (email/phone) for Google Ads, Microsoft and Meta.
 */
export function track(event: string, params: Record<string, unknown> = {}, opts: { eventId?: string; user?: UserData; ecommerce?: Ecommerce } = {}) {
  const w = win();
  const event_id = opts.eventId ?? newEventId(event);
  if (!w) return event_id;
  w.dataLayer = w.dataLayer || [];
  const { user, ecommerce } = opts;
  if (ecommerce) w.dataLayer.push({ ecommerce: null });
  const { first, last } = splitName(user?.name);
  w.dataLayer.push({
    event,
    event_id,
    ...params,
    ...(ecommerce ? { ecommerce } : {}),
    ...(user
      ? {
          user_data: {
            ...(user.email ? { email: user.email.trim().toLowerCase() } : {}),
            ...(user.phone ? { phone_number: e164(user.phone) } : {}),
            ...(first ? { address: { first_name: first, last_name: last } } : {}),
          },
        }
      : {}),
  });
  // Don't let one lead's details ride along on later events.
  if (user) w.dataLayer.push({ user_data: undefined });

  gaEvent(event, { event_id, ...params, ...(ecommerce ?? {}) });

  uetEvent(event, { value: ecommerce?.value ?? params.value, currency: ecommerce?.currency ?? params.currency, lead_source: params.lead_source }, user);

  const meta = META[event];
  if (meta && w.fbq) {
    if (user) identify(user);
    w.fbq(meta.custom ? "trackCustom" : "track", meta.name, metaParams(params, ecommerce), { eventID: event_id });
  }
  return event_id;
}

/** A confirmed booking, counted once per booking whether it came from the embed or the /booked redirect. */
export function trackBooked(via: string, uid?: string, user?: UserData) {
  const key = `ct_booked_${uid || "session"}`;
  try {
    if (sessionStorage.getItem(key) || (!uid && sessionStorage.getItem("ct_booked_any"))) return;
    sessionStorage.setItem(key, "1");
    sessionStorage.setItem("ct_booked_any", "1");
  } catch {
    /* storage blocked: still count it */
  }
  track("book_call", { via, value: 0, currency: "USD" }, { eventId: uid ? `book_${uid}` : undefined, user });
}

// ---------------------------------------------------------------------------------------------
// Attribution: click ids + UTMs from the landing URL, kept for 90 days so leads, bookings and
// Shopify orders can be tied back to the ad that drove them.

const ATTR_KEY = "ct_attr";
const ATTR_PARAMS = ["gclid", "gbraid", "wbraid", "fbclid", "msclkid", "ttclid", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
export type Attribution = Partial<Record<(typeof ATTR_PARAMS)[number] | "landing" | "fbp" | "fbc", string>>;

const cookie = (name: string) => (typeof document === "undefined" ? undefined : document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))?.[1]);

/** Call once per page load: stores any new click ids and sets _fbc from fbclid before the pixel loads. */
export function captureAttribution() {
  const w = win();
  if (!w) return;
  const q = new URLSearchParams(w.location.search);
  const fresh: Attribution = {};
  for (const k of ATTR_PARAMS) {
    const v = q.get(k);
    if (v) fresh[k] = v.slice(0, 300);
  }
  if (fresh.fbclid && !cookie("_fbc")) {
    const fbc = `fb.1.${Date.now()}.${fresh.fbclid}`;
    document.cookie = `_fbc=${fbc}; max-age=${90 * 86400}; path=/; SameSite=Lax; Secure`;
  }
  if (!Object.keys(fresh).length) return;
  try {
    localStorage.setItem(ATTR_KEY, JSON.stringify({ ...fresh, landing: w.location.pathname, at: Date.now() }));
  } catch {
    /* ignore */
  }
}

export function attribution(): Attribution {
  let stored: Attribution & { at?: number } = {};
  try {
    stored = JSON.parse(localStorage.getItem(ATTR_KEY) || "{}");
    if (stored.at && Date.now() - stored.at > 90 * 86400_000) stored = {};
  } catch {
    /* ignore */
  }
  delete stored.at;
  const fbp = cookie("_fbp");
  const fbc = cookie("_fbc");
  return { ...stored, ...(fbp ? { fbp } : {}), ...(fbc ? { fbc } : {}) };
}
