// POST /api/cal-webhook — Cal.com → "Booking created" webhook.
// 1) Sends Meta a server-side "Schedule" (de-duplicated with the browser event via book_<uid>),
//    so booked calls count even when the Pixel is blocked by an ad blocker or iOS.
// 2) Adds the booking to the leads Google Sheet.
// Setup: Cal.com → Settings → Developer → Webhooks → New: URL https://ceoturbo.com/api/cal-webhook,
// trigger "Booking Created", secret = CAL_WEBHOOK_SECRET (same value in Vercel).
import { createHmac, timingSafeEqual } from "node:crypto";
import { send } from "./_lib/http.js";
import { forwardLead } from "./_lib/leads.js";
import { buildEvent, cleanAttribution, sendMetaEvents } from "./_lib/meta-capi.js";

async function readRaw(req, limit = 200_000) {
  if (typeof req.body === "string") return req.body;
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > limit) throw new Error("too-large");
  }
  return raw;
}

/** Cal.com signs the raw body: x-cal-signature-256 = hex HMAC-SHA256(secret, body). */
export function validSignature(raw, signature, secret) {
  if (!secret || typeof signature !== "string") return false;
  const expected = createHmac("sha256", secret).update(raw).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature.trim());
  return a.length === b.length && timingSafeEqual(a, b);
}

const val = (v) => (v && typeof v === "object" && "value" in v ? v.value : v);
const str = (v, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Pulls the booker and our tracking metadata out of a Cal.com webhook payload. */
export function parseBooking(body) {
  const p = body?.payload ?? {};
  const att = Array.isArray(p.attendees) ? p.attendees[0] ?? {} : {};
  const r = p.responses ?? {};
  const meta = p.metadata ?? {};
  return {
    uid: str(p.uid, 120),
    name: str(att.name || val(r.name)),
    email: str(att.email || val(r.email)).toLowerCase(),
    // The booking form's "Phone Number" question is stored as aiAgentCallPhoneNumber.
    phone: str(att.phoneNumber || val(r.attendeePhoneNumber) || val(r.aiAgentCallPhoneNumber) || val(r.phone), 40),
    startTime: str(p.startTime, 40),
    endTime: str(p.endTime, 40),
    timeZone: str(att.timeZone, 60),
    meetingLink: str(p.metadata?.videoCallUrl || p.videoCallData?.url || (/^https?:/.test(p.location || "") ? p.location : ""), 300),
    title: str(p.title || p.eventTitle),
    notes: str(val(r.notes) || p.description, 500),
    source: str(meta.source, 80),
    page: str(meta.page, 120),
    attribution: cleanAttribution(meta),
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, { error: "method" });
  }
  let raw;
  try {
    raw = await readRaw(req);
  } catch {
    return send(res, 413, { error: "body" });
  }
  if (!validSignature(raw, req.headers["x-cal-signature-256"], process.env.CAL_WEBHOOK_SECRET)) return send(res, 401, { error: "signature" });

  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return send(res, 400, { error: "json" });
  }
  // Cal.com's "Ping test" and other triggers: acknowledge, do nothing.
  if (body.triggerEvent !== "BOOKING_CREATED") return send(res, 200, { ok: true, ignored: body.triggerEvent || "ping" });

  const b = parseBooking(body);
  const [capi, sheet] = await Promise.all([
    sendMetaEvents([
      buildEvent({
        eventName: "Schedule",
        eventId: b.uid ? `book_${b.uid}` : undefined,
        eventTime: body.createdAt,
        url: `https://ceoturbo.com${b.page || "/brand-boost"}`,
        user: { email: b.email, phone: b.phone, name: b.name },
        attribution: b.attribution,
        customData: { content_name: b.title || "Brand Boost call", lead_source: b.source || "cal.com" },
      }),
    ]),
    forwardLead({ type: "booking", name: b.name, email: b.email, phone: b.phone, startTime: b.startTime, endTime: b.endTime, timeZone: b.timeZone, meetingLink: b.meetingLink, event: b.title, notes: b.notes, source: b.source, page: b.page, uid: b.uid, ...b.attribution }),
  ]);
  return send(res, 200, { ok: true, meta: !!capi.sent, sheet: !!sheet.stored });
}
