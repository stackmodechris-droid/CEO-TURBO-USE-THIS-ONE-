// @vitest-environment node
import { describe, it, expect } from "vitest";
import { isPrivateIp, normalizeUrl, fetchPage } from "../../api/_lib/fetch-page.js";
import { parseHtml, blockedAiBots, scoreChecks, platformFor } from "../../api/_lib/audit.js";
import { cleanLead, isBot } from "../../api/_lib/leads.js";
import { buildEvent, hashedUser, cleanAttribution, requestSignals, withSignals } from "../../api/_lib/meta-capi.js";
import { buildTiktokEvent } from "../../api/_lib/tiktok-events.js";
import { quizFields } from "../../api/lead.js";
import { validSignature, parseBooking } from "../../api/cal-webhook.js";
import { validSignature as shopifySig, parseOrder } from "../../api/shopify-webhook.js";
import { createHash, createHmac } from "node:crypto";

const sha = (v: string) => createHash("sha256").update(v).digest("hex");

describe("Meta Conversions API payload", () => {
  it("normalizes and hashes personal data the way Meta requires", () => {
    const u = hashedUser({ email: "  Jo@Example.COM ", phone: "(404) 555-0123", name: "Jo Ann Smith", city: "Atlanta" });
    expect(u.em).toEqual([sha("jo@example.com")]);
    expect(u.ph).toEqual([sha("14045550123")]);
    expect(u.fn).toEqual([sha("jo")]);
    expect(u.ln).toEqual([sha("ann smith")]);
    expect(u.ct).toEqual([sha("atlanta")]);
  });

  it("keeps the browser event id for de-duplication and passes fbp/fbc unhashed", () => {
    const e = buildEvent({ eventName: "Lead", eventId: "generate_lead_abc", url: "https://www.ceoturbo.com/free-audit", user: { email: "a@b.co" }, attribution: { fbp: "fb.1.1.2", fbclid: "XYZ" }, ip: "1.2.3.4", userAgent: "UA" });
    expect(e).toMatchObject({ event_name: "Lead", event_id: "generate_lead_abc", action_source: "website", user_data: { fbp: "fb.1.1.2", client_ip_address: "1.2.3.4", client_user_agent: "UA" } });
    expect(e.user_data.fbc).toMatch(/^fb\.1\.\d+\.XYZ$/);
    expect(JSON.stringify(e)).not.toContain("a@b.co");
  });

  it("drops unknown attribution keys", () => {
    expect(cleanAttribution({ gclid: "g1", evil: "x", fbp: 3 })).toEqual({ gclid: "g1" });
  });
});

describe("Cal.com booking webhook", () => {
  const body = JSON.stringify({ triggerEvent: "BOOKING_CREATED", payload: { uid: "u1", attendees: [{ name: "Jo", email: "JO@x.co" }], responses: { attendeePhoneNumber: { value: "+14045550123" } }, metadata: { source: "Ad page hero", fbp: "fb.1.2.3", junk: "x" } } });

  it("rejects missing or forged signatures", () => {
    expect(validSignature(body, undefined, "s3cret")).toBe(false);
    expect(validSignature(body, "deadbeef", "s3cret")).toBe(false);
    expect(validSignature(body, createHmac("sha256", "other").update(body).digest("hex"), "s3cret")).toBe(false);
    expect(validSignature(body, createHmac("sha256", "s3cret").update(body).digest("hex"), "")).toBe(false);
    expect(validSignature(body, createHmac("sha256", "s3cret").update(body).digest("hex"), "s3cret")).toBe(true);
  });

  it("reads the booker and our tracking metadata", () => {
    expect(parseBooking(JSON.parse(body))).toMatchObject({ uid: "u1", name: "Jo", email: "jo@x.co", phone: "+14045550123", source: "Ad page hero", attribution: { fbp: "fb.1.2.3" } });
  });
});

describe("audit fetcher safety", () => {
  it("blocks private, loopback and cloud-metadata addresses", () => {
    for (const ip of ["127.0.0.1", "10.0.0.5", "172.16.3.4", "192.168.1.1", "169.254.169.254", "100.64.0.1", "0.0.0.0", "::1", "fd00::1", "fe80::1", "::ffff:127.0.0.1"]) expect(isPrivateIp(ip), ip).toBe(true);
    for (const ip of ["8.8.8.8", "76.76.21.21", "2606:4700::1111"]) expect(isPrivateIp(ip), ip).toBe(false);
  });

  it("only accepts normal public website URLs", () => {
    expect(normalizeUrl("joesplumbing.com")?.href).toBe("https://joesplumbing.com/");
    for (const bad of ["localhost:3000", "http://127.0.0.1", "ftp://x.com", "https://user:pw@x.com", "https://x.com:8080", "file:///etc/passwd", "intranet", "printer.local"]) expect(normalizeUrl(bad), bad).toBeNull();
  });

  it("refuses hostnames that resolve to private addresses", async () => {
    const res = await fetchPage("http://127.0.0.1.nip.io/", { timeoutMs: 4000 });
    expect(res.ok).toBe(false);
  });
});

describe("audit parsing and scoring", () => {
  const html = `<!doctype html><html><head><title>Plumber in Atlanta, GA | Joe's Plumbing</title>
    <meta name="description" content="Licensed Atlanta plumber for leaks, water heaters and drains. Same-day service, upfront prices. Call (404) 555-0123.">
    <meta name="viewport" content="width=device-width"><link rel="canonical" href="https://joes.example/">
    <script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"Plumber","name":"Joe's Plumbing","sameAs":["https://facebook.com/joes"]},{"@type":"FAQPage"}]}</script>
    </head><body><h1>Atlanta plumbing</h1><h2>Do you do same-day?</h2><img src="a.jpg" alt="van"><img src="b.jpg">
    <a href="tel:+14045550123">Call</a><a href="https://g.page/r/abc/review">Review us</a></body></html>`;

  it("reads titles, schema, headings and links", () => {
    const h = parseHtml(html);
    expect(h.title).toBe("Plumber in Atlanta, GA | Joe's Plumbing");
    expect(h.types).toEqual(expect.arrayContaining(["Plumber", "FAQPage"]));
    expect(h.sameAs).toEqual(["https://facebook.com/joes"]);
    expect(h.h1).toHaveLength(1);
    expect(h.images).toBe(2);
    expect(h.imagesWithAlt).toBe(1);
    expect(h.anchors).toContain("tel:+14045550123");
  });

  it("detects AI crawlers blocked in robots.txt", () => {
    expect(blockedAiBots("User-agent: *\nAllow: /")).toEqual([]);
    expect(blockedAiBots("User-agent: GPTBot\nUser-agent: PerplexityBot\nDisallow: /\n\nUser-agent: *\nAllow: /")).toEqual(["GPTBot", "PerplexityBot"]);
    expect(blockedAiBots("User-agent: *\nDisallow: /")).toContain("OAI-SearchBot");
    expect(blockedAiBots("User-agent: *\nDisallow: /admin")).toEqual([]);
  });

  it("scores pass/warn/fail by weight", () => {
    const { scores, overall } = scoreChecks(
      [
        { cat: "seo", weight: 2, status: "pass" },
        { cat: "seo", weight: 2, status: "fail" },
        { cat: "geo", weight: 1, status: "warn" },
      ] as never,
      ["seo", "geo"],
    );
    expect(scores).toEqual({ seo: 50, geo: 50 });
    expect(overall).toBe(50);
  });

  it("recognises social and link-in-bio hosts", () => {
    expect(platformFor("www.instagram.com")).toBe("Instagram");
    expect(platformFor("linktr.ee")).toBe("Linktree");
    expect(platformFor("joesplumbing.com")).toBeNull();
  });
});

describe("lead validation", () => {
  it("requires a name, valid email and real phone number", () => {
    expect(cleanLead({ name: "Jo", email: "jo@example.com", phone: "(404) 555-0123" }).lead).toMatchObject({ name: "Jo", phone: "(404) 555-0123" });
    expect(cleanLead({ name: "Jo", email: "nope", phone: "4045550123" }).error).toBe("email");
    expect(cleanLead({ name: "Jo", email: "jo@example.com", phone: "123" }).error).toBe("phone");
    expect(cleanLead({ name: "", email: "jo@example.com", phone: "4045550123" }).error).toBe("name");
  });

  it("flags honeypot fills and instant submits as bots", () => {
    expect(isBot({ company_site: "http://spam" })).toBe(true);
    expect(isBot({ elapsedMs: 200 })).toBe(true);
    expect(isBot({ elapsedMs: 9000 })).toBe(false);
  });
});

describe("Shopify order webhook", () => {
  const body = JSON.stringify({ id: 1 });
  it("verifies the base64 HMAC signature", () => {
    expect(shopifySig(body, createHmac("sha256", "s").update(body).digest("base64"), "s")).toBe(true);
    expect(shopifySig(body, createHmac("sha256", "x").update(body).digest("base64"), "s")).toBe(false);
    expect(shopifySig(body, undefined, "s")).toBe(false);
    expect(shopifySig(body, createHmac("sha256", "s").update(body).digest("base64"), "")).toBe(false);
  });
  it("maps an order and its ad click ids to the sheet record", () => {
    const r = parseOrder({ id: 9, name: "#1001", email: "A@B.com", total_price: "49.00", currency: "USD", financial_status: "paid", line_items: [{ title: "Card", quantity: 2 }], note_attributes: [{ name: "gclid", value: "g1" }, { name: "Business name", value: "Joe" }] });
    expect(r).toMatchObject({ type: "shopify-order", orderId: "9", email: "a@b.com", quantity: 2, total: "49.00 USD", gclid: "g1", business: "Joe" });
  });
});

describe("Brand Boost quiz lead", () => {
  it("keeps only the known quiz answers, trimmed and tag-free", () => {
    const q = quizFields({ quizId: "q_1", audience: "Local service business", goal: "More calls & bookings", blockers: "Hard to find on Google, <script>", budget: "$500 to $2,000", timeline: "Within 30 days", website: " mor.com ", move: "Turn searches into phone calls", evil: "x" });
    expect(q).toEqual({ quizId: "q_1", audience: "Local service business", goal: "More calls & bookings", blockers: "Hard to find on Google,  script", budget: "$500 to $2,000", timeline: "Within 30 days", website: "mor.com", move: "Turn searches into phone calls" });
  });

  it("reads quiz answers from booking metadata when the hidden booking fields are empty", () => {
    const b = parseBooking({ payload: { uid: "u2", attendees: [{ name: "Al", email: "al@x.co" }], responses: {}, metadata: { quizId: "q_9", businessName: "Mor Handy", goalLabel: "More calls & bookings", budgetLabel: "$5,000+", blockers: "No time", timeline: "ASAP — this week", leadValue: "900", ttclid: "tt1" } } });
    expect(b).toMatchObject({ quizId: "q_9", businessName: "Mor Handy", goal: "More calls & bookings", budget: "$5,000+", blockers: "No time", timeline: "ASAP — this week", value: 900, attribution: { ttclid: "tt1" } });
  });
});

describe("Meta Parameter Builder (server)", () => {
  it("reads _fbp, builds _fbc from the page's fbclid and prefers the IPv6 client address", () => {
    const headers: Record<string, string | string[]> = {};
    const req = { headers: { host: "www.ceoturbo.com", cookie: "_fbp=fb.1.1700000000000.123", referer: "https://www.ceoturbo.com/brand-boost?fbclid=AbC", "x-forwarded-for": "2606:4700::1111, 10.0.0.1" }, url: "/api/lead", method: "POST", socket: { remoteAddress: "1.2.3.4" } };
    const sig = requestSignals(req, { setHeader: (k: string, v: string[]) => (headers[k] = v) });
    expect(sig.fbp.startsWith("fb.1.1700000000000.123")).toBe(true);
    expect(sig.fbc).toMatch(/^fb\.1\.\d+\.AbC/);
    expect(sig.ip.startsWith("2606:4700::1111")).toBe(true);
    expect(String(headers["Set-Cookie"])).toContain("_fbc=");
  });

  it("never overrides ids the browser already sent", () => {
    expect(withSignals({ fbp: "browser" }, { fbp: "server", fbc: "c", ip: "" })).toEqual({ fbp: "browser", fbc: "c" });
  });
});

describe("TikTok Events API payload", () => {
  it("hashes email/phone (E.164) and passes click ids unhashed with the shared event id", () => {
    const e = buildTiktokEvent({ event: "Lead", eventId: "generate_lead_x", url: "https://www.ceoturbo.com/brand-boost", user: { email: " A@B.co ", phone: "(404) 555-0123" }, attribution: { ttclid: "TT", ttp: "P" }, ip: "1.2.3.4" });
    expect(e).toMatchObject({ event: "Lead", event_id: "generate_lead_x", user: { email: sha("a@b.co"), phone: sha("+14045550123"), ttclid: "TT", ttp: "P", ip: "1.2.3.4" }, page: { url: "https://www.ceoturbo.com/brand-boost" } });
  });
});
