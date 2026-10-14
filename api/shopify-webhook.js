// POST /api/shopify-webhook — Shopify → "Order payment" webhook.
// Adds every paid order (with the ad click ids and UTMs the site attached to the cart) to the leads
// Google Sheet: review cards on the "Card Orders" tab, custom shirts on "Shirt Orders" with their
// Design ID, sizes and print file link (the Apps Script marks the design row Paid). Meta's Purchase comes from the Facebook & Instagram
// app, so this endpoint deliberately does NOT send anything to Meta (it would double count).
// Setup: Shopify admin → Settings → Notifications → Webhooks → Create webhook:
//   Event "Order payment", format JSON, URL https://www.ceoturbo.com/api/shopify-webhook,
//   then copy the "signing secret" shown at the top of that page into Vercel as SHOPIFY_WEBHOOK_SECRET.
import { createHmac, timingSafeEqual } from "node:crypto";
import { send } from "./_lib/http.js";
import { forwardLead } from "./_lib/leads.js";

async function readRaw(req, limit = 500_000) {
  let raw = "";
  if (!req.readableEnded) {
    for await (const chunk of req) {
      raw += chunk;
      if (raw.length > limit) throw new Error("too-large");
    }
  }
  if (raw) return raw;
  if (typeof req.body === "string") return req.body;
  if (req.body && typeof req.body === "object") return JSON.stringify(req.body);
  return "";
}

/** Shopify signs the raw body: x-shopify-hmac-sha256 = base64 HMAC-SHA256(secret, body). */
export function validSignature(raw, signature, secret) {
  if (!secret || typeof signature !== "string") return false;
  const expected = createHmac("sha256", secret).update(raw).digest("base64");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature.trim());
  return a.length === b.length && timingSafeEqual(a, b);
}

const str = (v, max = 200) => (v === null || v === undefined ? "" : String(v).replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max));

/** Turns a Shopify order into the sheet record. */
export function parseOrder(o) {
  const ship = o.shipping_address ?? {};
  const bill = o.billing_address ?? {};
  const cust = o.customer ?? {};
  const notes = Object.fromEntries((Array.isArray(o.note_attributes) ? o.note_attributes : []).map((n) => [str(n?.name, 60), str(n?.value, 300)]));
  const items = (Array.isArray(o.line_items) ? o.line_items : []).map((li) => `${li.quantity || 1} x ${str(li.title, 80)}${li.variant_title ? ` (${str(li.variant_title, 60)})` : ""}`);
  const qty = (Array.isArray(o.line_items) ? o.line_items : []).reduce((n, li) => n + (Number(li.quantity) || 0), 0);
  const name = str(ship.name || bill.name || [cust.first_name, cust.last_name].filter(Boolean).join(" "), 100);
  // Custom shirts: every cart line carries the design's properties (Design ID, Print file…), see src/lib/shopify.ts.
  const lines = Array.isArray(o.line_items) ? o.line_items : [];
  const props = (li) => Object.fromEntries((Array.isArray(li?.properties) ? li.properties : []).map((p) => [str(p?.name, 60), str(p?.value, 300)]));
  const shirtLines = lines.filter((li) => props(li)["Design ID"] || /company t-shirt|artist merch/i.test(String(li?.title || "")));
  const design = shirtLines.length ? props(shirtLines[0]) : {};
  // The full address: shirts are dropshipped, so this is what gets pasted into the print partner's order.
  const shipTo = [ship.address1, ship.address2, ship.city, ship.province_code, ship.zip, ship.country_code].map((x) => str(x, 80)).filter(Boolean).join(", ");
  return {
    type: shirtLines.length ? "shirt-order" : "shopify-order",
    ...(shirtLines.length
      ? {
          designId: design["Design ID"] || notes["Design ID"] || "",
          kind: /^AM-/.test(design["Design ID"] || notes["Design ID"] || "") || shirtLines.some((li) => /artist merch/i.test(String(li?.title || ""))) ? "Artist merch" : "Company shirt",
          printFile: design["Print file"] || "",
          placement: design.Placement || "",
          frontText: design["Front text"] || "",
          backText: design["Back text"] || "",
          // "Short sleeve – Front / Black / L × 3; …" — what to submit to the print partner.
          sizes: shirtLines.map((li) => `${str(li.variant_title, 80) || str(li.title, 80)} × ${Number(li.quantity) || 1}`).join("; "),
        }
      : {}),
    orderId: str(o.id, 40),
    orderNumber: str(o.name || o.order_number, 20),
    name,
    email: str(o.email || o.contact_email || cust.email, 200).toLowerCase(),
    phone: str(o.phone || ship.phone || bill.phone || cust.phone, 30),
    business: notes["Business name"] || notes["Artist name"] || str(ship.company || bill.company, 140),
    items: items.join("; "),
    quantity: qty,
    total: `${str(o.total_price, 20)} ${str(o.currency, 5)}`.trim(),
    paymentStatus: str(o.financial_status, 30),
    shipTo,
    pack: notes.Pack || "",
    note: str(o.note, 500),
    page: notes.Landing ? "" : str(o.landing_site, 120),
    landing: notes.Landing || "",
    utm_source: notes.utm_source || "",
    utm_medium: notes.utm_medium || "",
    utm_campaign: notes.utm_campaign || "",
    utm_content: notes.utm_content || "",
    utm_term: notes.utm_term || "",
    gclid: notes.gclid || "",
    msclkid: notes.msclkid || "",
    fbclid: notes.fbclid || "",
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
  if (!validSignature(raw, req.headers["x-shopify-hmac-sha256"], process.env.SHOPIFY_WEBHOOK_SECRET)) return send(res, 401, { error: "signature" });

  let order;
  try {
    order = JSON.parse(raw);
  } catch {
    return send(res, 400, { error: "json" });
  }
  if (!order || typeof order !== "object" || !order.id) return send(res, 200, { ok: true, ignored: "no-order" });

  const { stored } = await forwardLead(parseOrder(order));
  // Shopify retries non-2xx responses, and the sheet de-duplicates by Order ID, so a failed save is retried.
  if (!stored) return send(res, 502, { error: "sheet" });
  return send(res, 200, { ok: true });
}
