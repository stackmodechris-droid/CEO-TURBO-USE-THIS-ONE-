// POST /api/lead — Brand Boost quiz leads, review card order requests (fallback when Shopify checkout
// is unreachable) and any other simple lead form.
import { cleanLead, forwardLead, isBot, scoreLead } from "./_lib/leads.js";
import { readJson, send, clientIp, rateLimited, sameOrigin, isJson } from "./_lib/http.js";
import { buildEvent, cleanAttribution, requestSignals, sendMetaEvents, withSignals } from "./_lib/meta-capi.js";
import { buildTiktokEvent, sendTiktokEvents } from "./_lib/tiktok-events.js";

const text = (v, max) => (typeof v === "string" ? v.replace(/[\u0000-\u001f\u007f<>]/g, " ").trim().slice(0, max) : "");

/** The quiz answers kept for the "Call Quiz Leads" sheet tab (exported for tests). */
export function quizFields(body) {
  return {
    quizId: text(body.quizId, 60),
    audience: text(body.audience, 60),
    stage: text(body.stage, 60),
    goal: text(body.goal, 80),
    blockers: text(body.blockers, 300),
    budget: text(body.budget, 40),
    timeline: text(body.timeline, 40),
    website: text(body.website, 200),
    move: text(body.move, 120),
  };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return send(res, 405, { error: "method" });
  }
  if (!sameOrigin(req)) return send(res, 403, { error: "origin" });
  if (!isJson(req)) return send(res, 415, { error: "content-type" });
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

  const type = text(body.type, 30) || "order-request";
  const quiz = type === "brand-boost-quiz" ? quizFields(body) : null;
  const signals = requestSignals(req, res);
  const attr = withSignals(cleanAttribution(body.attribution), signals);
  const eventId = text(body.eventId, 120);
  const value = Number(body.value) > 0 ? Math.min(Number(body.value), 100000) : 0;
  const url = `https://www.ceoturbo.com${text(body.page, 120) || "/"}`;
  const ip = signals.ip || clientIp(req);
  const user = { email: lead.email, phone: lead.phone, name: lead.name, externalId: text(body.visitorId, 60) || quiz?.quizId || undefined };

  const capi = sendMetaEvents([
    buildEvent({
      eventName: "Lead",
      eventId,
      url,
      user,
      attribution: attr,
      ip,
      userAgent: req.headers["user-agent"],
      customData: {
        lead_source: type,
        ...(quiz ? { content_name: "Brand Boost quiz", content_category: [quiz.audience, quiz.stage].filter(Boolean).join(" · ") } : {}),
        ...(value ? { value, currency: "USD" } : {}),
      },
    }),
  ]);
  const tiktok = sendTiktokEvents([
    buildTiktokEvent({ event: "Lead", eventId, url, user, attribution: attr, ip, userAgent: req.headers["user-agent"], properties: { content_name: quiz ? "Brand Boost quiz" : type, ...(value ? { value, currency: "USD" } : {}) } }),
  ]);
  const { stored } = await forwardLead({
    type,
    ...lead,
    ...(quiz ?? {}),
    ...(quiz ? scoreLead(quiz) : {}),
    product: text(body.product, 120),
    style: text(body.style, 40),
    pack: text(body.pack, 40),
    total: text(body.total, 20),
    note: text(body.note, 500),
    page: text(body.page, 120),
    eventId,
    ...attr,
  });
  await Promise.all([capi, tiktok]);
  return send(res, 200, { ok: true, stored: !!stored });
}
