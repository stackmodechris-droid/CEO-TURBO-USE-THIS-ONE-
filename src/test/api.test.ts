// @vitest-environment node
import { describe, it, expect } from "vitest";
import { isPrivateIp, normalizeUrl, fetchPage } from "../../api/_lib/fetch-page.js";
import { parseHtml, blockedAiBots, scoreChecks, platformFor } from "../../api/_lib/audit.js";
import { cleanLead, isBot } from "../../api/_lib/leads.js";

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
