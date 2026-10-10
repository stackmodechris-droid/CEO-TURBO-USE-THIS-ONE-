// POST /api/lead — review card order requests (used until a checkout link is configured)
// and any other simple lead form.
import { cleanLead, forwardLead, isBot } from "./_lib/leads.js";
import { readJson, send, clientIp, rateLimited, sameOrigin } from "./_lib/http.js";

const text = (v, max) => (typeof v === "string" ? v.replace(/[\u0000-\u001f\u007f<>]/g, " ").trim().slice(0, max) : "");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, { error: "method" });
  }
  if (!sameOrigin(req)) return send(res, 403, { error: "origin" });
  if (rateLimited(`lead:${clientIp(req)}`, 5, 10 * 60_000)) return send(res, 429, { error: "rate" });

  let body;
  try {
    body = await readJson(req);
  } catch {
    return send(res, 400, { error: "body" });
  }
  if (isBot(body)) return send(res, 400, { error: "invalid" });

  const { lead, error } = cleanLead(body);
  if (error) return send(res, 400, { error });

  const { stored } = await forwardLead({
    type: text(body.type, 30) || "order-request",
    ...lead,
    product: text(body.product, 120),
    style: text(body.style, 40),
    pack: text(body.pack, 40),
    total: text(body.total, 20),
    note: text(body.note, 500),
    page: text(body.page, 120),
  });
  return send(res, 200, { ok: true, stored: !!stored });
}
