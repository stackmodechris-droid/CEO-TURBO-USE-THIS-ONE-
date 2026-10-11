// POST /api/audit — captures the lead, runs the free SEO/AEO/GEO audit and returns the report.
import { runAudit } from "./_lib/audit.js";
import { cleanLead, forwardLead, isBot } from "./_lib/leads.js";
import { readJson, send, clientIp, rateLimited, sameOrigin } from "./_lib/http.js";
import { buildEvent, cleanAttribution, sendMetaEvents } from "./_lib/meta-capi.js";

const pick = (v, allowed) => (allowed.includes(v) ? v : "");
const text = (v, max) => (typeof v === "string" ? v.replace(/[\u0000-\u001f\u007f<>]/g, " ").trim().slice(0, max) : "");

const withTimeout = (p, ms) => Promise.race([p, new Promise((_, reject) => setTimeout(() => reject(new Error("audit-timeout")), ms))]);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, { error: "method" });
  }
  if (!sameOrigin(req)) return send(res, 403, { error: "origin" });
  if (rateLimited(`audit:${clientIp(req)}`, 6, 10 * 60_000)) return send(res, 429, { error: "rate" });

  let body;
  try {
    body = await readJson(req);
  } catch {
    return send(res, 400, { error: "body" });
  }
  if (isBot(body)) return send(res, 400, { error: "invalid" });

  const kind = body.kind === "artist" ? "artist" : "business";
  const input = {
    kind,
    name: text(body.business, 100),
    what: text(body.what, 60),
    city: text(body.city, 60),
    website: text(body.website, 300),
    gbp: pick(body.gbp, ["yes", "unsure", "no"]),
    reviews: pick(body.reviews, ["0-9", "10-49", "50-99", "100+"]),
    press: pick(body.press, ["none", "some", "lots"]),
    nameRank: pick(body.nameRank, ["top", "somewhere", "no", "unsure"]),
  };
  if (input.name.length < 2) return send(res, 400, { error: "business" });

  const { lead, error } = cleanLead({ ...body, business: input.name });
  if (error) return send(res, 400, { error });

  let report = null;
  try {
    report = await withTimeout(runAudit(input), 28_000);
  } catch (e) {
    console.error("[audit] failed", e?.message);
  }

  // Server-side Meta "Lead", de-duplicated with the browser Pixel via the shared event id.
  const attr = cleanAttribution(body.attribution);
  const capi = sendMetaEvents([
    buildEvent({
      eventName: "Lead",
      eventId: text(body.eventId, 120),
      url: `https://ceoturbo.com${text(body.page, 120) || "/free-audit"}`,
      user: { email: lead.email, phone: lead.phone, name: lead.name, city: input.city },
      attribution: attr,
      ip: clientIp(req),
      userAgent: req.headers["user-agent"],
      customData: { lead_source: "free_check", content_name: kind === "artist" ? "Artist visibility check" : "Business visibility check" },
    }),
  ]);

  const failing = report ? report.checks.filter((c) => report.top.includes(c.id)).map((c) => c.label) : [];
  await forwardLead({
    type: kind === "artist" ? "audit-artist" : "audit-business",
    ...lead,
    what: input.what,
    city: input.city,
    website: input.website,
    gbp: input.gbp,
    reviews: input.reviews,
    press: input.press,
    score: report ? report.overall : "",
    seo: report?.scores.seo ?? "",
    aeo: report?.scores.aeo ?? "",
    geo: report?.scores.geo ?? "",
    reviewsScore: report?.scores.reviews ?? "",
    topIssues: failing.join(" | "),
    page: text(body.page, 120),
    ...attr,
  });
  await capi;

  if (!report) return send(res, 503, { error: "audit" });
  return send(res, 200, { report });
}
