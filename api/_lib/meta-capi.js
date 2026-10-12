// Meta Conversions API: server-side copies of the browser Pixel events. Same event_id as the
// browser event, so Meta de-duplicates them and keeps whichever arrives with better match data.
// Needs META_CAPI_TOKEN (Events Manager → your pixel → Settings → Conversions API → Generate access token).
import { createHash } from "node:crypto";
import paramBuilder from "capi-param-builder-nodejs";

const { ParamBuilder } = paramBuilder;

export const DEFAULT_PIXEL_ID = "3232222473609236";
const GRAPH = process.env.META_GRAPH_VERSION || "v24.0";

const sha256 = (v) => createHash("sha256").update(v).digest("hex");
const clean = (v, max = 300) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Meta wants lowercase, trimmed values hashed; phones as digits with country code. */
export function hashedUser({ email, phone, name, city, externalId } = {}) {
  const out = {};
  const em = clean(email).toLowerCase();
  if (em) out.em = [sha256(em)];
  let ph = clean(phone).replace(/\D/g, "");
  if (ph.length === 10) ph = `1${ph}`;
  if (ph) out.ph = [sha256(ph)];
  const [first, ...rest] = clean(name).toLowerCase().split(/\s+/).filter(Boolean);
  if (first) out.fn = [sha256(first)];
  if (rest.length) out.ln = [sha256(rest.join(" "))];
  const ct = clean(city).toLowerCase().replace(/[^a-z]/g, "");
  if (ct) out.ct = [sha256(ct)];
  if (externalId) out.external_id = [sha256(String(externalId))];
  return out;
}

/** Builds one CAPI event (exported for tests). */
export function buildEvent({ eventName, eventId, eventTime, url, user, attribution = {}, ip, userAgent, customData }) {
  const fbp = clean(attribution.fbp, 200);
  let fbc = clean(attribution.fbc, 300);
  const fbclid = clean(attribution.fbclid, 250);
  if (!fbc && fbclid) fbc = `fb.1.${Date.now()}.${fbclid}`;
  return {
    event_name: eventName,
    event_time: Math.floor((eventTime ? new Date(eventTime).getTime() : Date.now()) / 1000),
    ...(eventId ? { event_id: String(eventId).slice(0, 120) } : {}),
    action_source: "website",
    ...(url ? { event_source_url: url } : {}),
    user_data: {
      ...hashedUser(user),
      ...(fbp ? { fbp } : {}),
      ...(fbc ? { fbc } : {}),
      ...(ip && ip !== "unknown" ? { client_ip_address: ip } : {}),
      ...(userAgent ? { client_user_agent: String(userAgent).slice(0, 400) } : {}),
    },
    ...(customData ? { custom_data: customData } : {}),
  };
}

/** Sends events to Meta. Never throws; a missing token just skips (logged once per call). */
export async function sendMetaEvents(events) {
  const token = process.env.META_CAPI_TOKEN;
  const pixel = process.env.META_PIXEL_ID || process.env.VITE_META_PIXEL_ID || DEFAULT_PIXEL_ID;
  if (!token) {
    console.warn("[capi] META_CAPI_TOKEN not set — server-side event skipped");
    return { sent: false };
  }
  try {
    const res = await fetch(`https://graph.facebook.com/${GRAPH}/${pixel}/events?access_token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: events, ...(process.env.META_TEST_EVENT_CODE ? { test_event_code: process.env.META_TEST_EVENT_CODE } : {}) }),
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) console.error("[capi] Meta responded", res.status, await res.text().catch(() => ""));
    return { sent: res.ok };
  } catch (e) {
    console.error("[capi] failed", e?.message);
    return { sent: false };
  }
}

/** Ad click ids / UTMs posted by the browser (src/lib/track.ts attribution()). */
export function cleanAttribution(a) {
  if (!a || typeof a !== "object") return {};
  const keys = ["fbp", "fbc", "fbclid", "gclid", "gbraid", "wbraid", "msclkid", "ttclid", "ttp", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "landing"];
  return Object.fromEntries(keys.map((k) => [k, clean(a[k], 300).replace(/[\u0000-\u001f<>]/g, "")]).filter(([, v]) => v));
}

/**
 * Meta's Conversions API Parameter Builder (capi-param-builder-nodejs), run on the browser's own request:
 * reads _fbp/_fbc from the request cookies (or builds _fbc from an fbclid on the page URL in the Referer)
 * and picks the best client IP (IPv6 first). Values are returned exactly as Meta wants them; the cookies it
 * recommends are set on the response so later events reuse the same ids. Never throws.
 */
export function requestSignals(req, res) {
  try {
    const builder = new ParamBuilder(["ceoturbo.com", "localhost"]);
    const cookies = builder.processRequestFromContext(req) || [];
    if (res && cookies.length) {
      res.setHeader(
        "Set-Cookie",
        cookies.map((c) => `${c.name}=${c.value}; Max-Age=${c.maxAge}; Path=/; SameSite=Lax; Secure${c.domain && !/localhost/.test(c.domain) ? `; Domain=${c.domain}` : ""}`),
      );
    }
    return { fbp: builder.getFbp() || "", fbc: builder.getFbc() || "", ip: builder.getClientIpAddress() || "" };
  } catch (e) {
    console.warn("[capi] param builder failed", e?.message);
    return { fbp: "", fbc: "", ip: "" };
  }
}

/** Browser-posted attribution, with the Parameter Builder's fbp/fbc filling any gaps. */
export function withSignals(attr, signals) {
  return { ...attr, ...(attr.fbp ? {} : signals.fbp ? { fbp: signals.fbp } : {}), ...(attr.fbc ? {} : signals.fbc ? { fbc: signals.fbc } : {}) };
}
