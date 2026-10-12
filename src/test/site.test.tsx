import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PAGES } from "@/seo/pages";
import { CLIENTS } from "@/content/clients";
import { ADS } from "@/content/ads";
import { AD_RESULTS, AD_TOTALS } from "@/content/results";
import { GUIDES } from "@/content/guides";
import { AUDIENCES } from "@/content/audiences";
import { SERVICES } from "@/content/services";
import { CSP } from "@/config/headers";
import { DEFAULT_UET_TAG_ID } from "@/lib/uet";
import { DEFAULT_CLARITY_ID } from "@/lib/clarity";
import { BOOKING, REVIEW_CARD, SITE, packSavings, packPath } from "@/config/site";
import { merchantFeed, feedItems } from "@/seo/feed";
import { reviewCardProduct, organization, founder } from "@/seo/schema";
import { Footer } from "@/components/site/Footer";
import { findVariant } from "@/lib/shopify";
import { BookButton, ShopCardsButton } from "@/components/cta/Actions";
import { checkReviewLink } from "@/lib/review-link";
import { ALL_PRICES, PRICING_FAQS, pricesFor, usd } from "@/content/pricing";
import { HOME_FAQS, BOOK_FAQS } from "@/content/faqs";
import { BrandBoostQuiz } from "@/components/quiz/BrandBoostQuiz";
import { AUDIENCES as QUIZ_AUDIENCES, BUDGETS, CAL_GOAL_OPTIONS, calGoal, moneyMove, EMPTY_ANSWERS, GOALS, BLOCKERS, STAGES, QUIZ_STEPS, labelOf } from "@/content/quiz";

const pub = (p: string) => path.resolve(__dirname, "../../public", p.replace(/^\//, ""));
const paths = new Set(PAGES.map((p) => p.path));

describe("page registry (SEO)", () => {
  it("has unique paths, titles and descriptions", () => {
    expect(paths.size).toBe(PAGES.length);
    expect(new Set(PAGES.map((p) => p.title)).size).toBe(PAGES.length);
    expect(new Set(PAGES.map((p) => p.description)).size).toBe(PAGES.length);
  });

  it("keeps titles and descriptions within snippet length", () => {
    for (const p of PAGES) {
      expect(p.title.length, p.path).toBeLessThanOrEqual(65);
      expect(p.description.length, p.path).toBeLessThanOrEqual(155);
    }
  });

  it("gives every indexable page structured data", () => {
    for (const p of PAGES.filter((x) => !x.noindex)) expect(p.schema.length, p.path).toBeGreaterThan(2);
  });

  it("has a page for every client, service, audience and guide", () => {
    CLIENTS.forEach((c) => expect(paths.has(`/portfolio/${c.slug}`)).toBe(true));
    SERVICES.forEach((s) => expect(paths.has(`/services/${s.slug}`)).toBe(true));
    AUDIENCES.forEach((a) => expect(paths.has(`/${a.slug}`)).toBe(true));
    GUIDES.forEach((g) => expect(paths.has(g.path ?? `/guides/${g.slug}`)).toBe(true));
  });

  it("only links guides to pages that exist", () => {
    for (const g of GUIDES) for (const r of g.related) expect(paths.has(r.to), `${g.slug} → ${r.to}`).toBe(true);
  });
});

describe("favicon (Google results)", () => {
  const html = readFileSync(path.resolve(__dirname, "../../index.html"), "utf8");
  it("links a crawlable icon set on every page", () => {
    expect(html).toMatch(/rel="icon"[^>]*favicon\.ico/);
    expect(html).toMatch(/rel="icon"[^>]*favicon-48\.png[^>]*sizes="48x48"|sizes="48x48"[^>]*favicon-48\.png/);
    expect(html).toMatch(/rel="apple-touch-icon"/);
    for (const f of ["favicon.ico", "favicon-48.png", "icon-192.png", "icon-512.png", "apple-touch-icon.png"]) expect(existsSync(pub(f)), f).toBe(true);
  });
  it("ships favicon.ico with 16, 32 and 48 px images, and the 48 px PNG is a multiple of 48", () => {
    const ico = readFileSync(pub("favicon.ico"));
    const sizes = Array.from({ length: ico.readUInt16LE(4) }, (_, i) => ico[6 + i * 16]);
    expect(sizes).toEqual([16, 32, 48]);
    const png = readFileSync(pub("favicon-48.png"));
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([48, 48]);
  });
  it("does not block crawlers from the icons", () => {
    expect(readFileSync(pub("robots.txt"), "utf8")).not.toMatch(/Disallow:\s*\/(favicon|icon)/);
  });
});

describe("assets", () => {
  it("has screenshots for every client", () => {
    for (const c of CLIENTS) {
      expect(existsSync(pub(`/img/work/${c.slug}.webp`)), c.slug).toBe(true);
      expect(existsSync(pub(`/img/work/${c.slug}-640.webp`)), c.slug).toBe(true);
    }
  });

  it("has every ad creative, dashboard and share image", () => {
    ADS.forEach((a) => expect(existsSync(pub(`/img/ads/${a.slug}.webp`)), a.slug).toBe(true));
    AD_RESULTS.forEach((r) => expect(existsSync(pub(r.image)), r.key).toBe(true));
    PAGES.filter((p) => p.ogImage).forEach((p) => expect(existsSync(pub(p.ogImage!.split("?")[0])), p.path).toBe(true));
  });
});

describe("reported numbers", () => {
  it("matches the Meta dashboards", () => {
    expect(AD_TOTALS.leads).toBe(147);
    expect(AD_TOTALS.leadSpend).toBeCloseTo(1103.43, 2);
    expect(AD_TOTALS.lowestCpl).toBe(4.31);
  });
});

describe("security headers", () => {
  it("vercel.json ships the same CSP the preview server tests", () => {
    const vercel = JSON.parse(readFileSync(path.resolve(__dirname, "../../vercel.json"), "utf8"));
    const csp = vercel.headers[0].headers.find((h: { key: string }) => h.key === "Content-Security-Policy").value;
    expect(csp).toBe(CSP);
  });
});

describe("conversion buttons", () => {
  it("booking button is a real, crawlable Cal.com link", () => {
    render(
      <MemoryRouter>
        <BookButton>Book</BookButton>
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: "Book" })).toHaveAttribute("href", BOOKING.url);
  });

  it("review card button links to the store", () => {
    render(
      <MemoryRouter>
        <ShopCardsButton>Shop</ShopCardsButton>
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: "Shop" })).toHaveAttribute("href", "/google-review-cards");
  });
});

describe("review card store", () => {
  it("prices packs so bigger packs always save money", () => {
    const [one, ...rest] = REVIEW_CARD.packs;
    expect(packSavings(one)).toBe(0);
    for (const p of rest) expect(p.price / p.qty).toBeLessThan(one.price);
  });

  it("maps every pack to its Shopify variant, and refuses to guess", () => {
    const v = (pack: string) => ({ id: `gid://shopify/ProductVariant/${pack}`, availableForSale: true, price: { amount: "1" }, selectedOptions: [{ name: "Pack", value: pack }] });
    const variants = ["1 card", "2 cards", "5-Pack"].map(v);
    expect(REVIEW_CARD.packs.map((p) => findVariant(variants, p)?.variant.id)).toEqual(["gid://shopify/ProductVariant/1 card", "gid://shopify/ProductVariant/2 cards", "gid://shopify/ProductVariant/5-Pack"]);
    expect(findVariant([{ ...v("x"), selectedOptions: [{ name: "Title", value: "Default Title" }] }], REVIEW_CARD.packs[0])).toBeNull();
  });

  it("feeds Google/Microsoft Merchant Center one item per variant at the page price", () => {
    const items = feedItems();
    expect(items).toHaveLength(REVIEW_CARD.packs.length);
    expect(new Set(items.map((i) => i.id)).size).toBe(items.length);
    for (const i of items) {
      expect(i.title.length).toBeLessThanOrEqual(150);
      expect(existsSync(pub(new URL(i.image).pathname))).toBe(true);
    }
    const xml = merchantFeed();
    expect(xml).toContain('xmlns:g="http://base.google.com/ns/1.0"');
    expect(xml).toContain(`<g:link>https://www.ceoturbo.com${packPath("5")}</g:link>`);
    expect(xml).toContain("<g:price>39.99 USD</g:price>");
    expect(xml).not.toMatch(/&(?!amp;|lt;|gt;|quot;)/);
  });

  it("describes the product as a ProductGroup with a priced offer per variant", () => {
    const p = reviewCardProduct() as { "@type": string; hasVariant: { sku: string; image: string; offers: { price: string; url: string } }[] };
    expect(p["@type"]).toBe("ProductGroup");
    expect(p.hasVariant).toHaveLength(REVIEW_CARD.packs.length);
    for (const v of p.hasVariant) {
      expect(Number(v.offers.price)).toBeGreaterThan(0);
      expect(v.offers.url).toMatch(/^https:\/\/www\.ceoturbo\.com\/google-review-cards\?pack=\d$/);
      expect(existsSync(pub(new URL(v.image).pathname))).toBe(true);
    }
  });

  it("only accepts direct Google review links", () => {
    expect(checkReviewLink("https://g.page/r/CabcDEF123/review")).toMatchObject({ ok: true, url: "https://g.page/r/CabcDEF123/review" });
    expect(checkReviewLink("g.page/r/CabcDEF123/review/")).toMatchObject({ ok: true });
    expect(checkReviewLink("https://search.google.com/local/writereview?placeid=ChIJ123")).toMatchObject({ ok: true });
    expect(checkReviewLink("https://g.page/r/CabcDEF123")).toMatchObject({ ok: false, kind: "fixable", url: "https://g.page/r/CabcDEF123/review" });
    expect(checkReviewLink("https://maps.app.goo.gl/xyz")).toMatchObject({ ok: false, kind: "profile" });
    expect(checkReviewLink("https://example.com")).toMatchObject({ ok: false, kind: "invalid" });
  });
});

describe("Brand Boost quiz", () => {
  it("renders the first question server-side with tappable answers", () => {
    render(
      <MemoryRouter>
        <BrandBoostQuiz source="test" primary />
      </MemoryRouter>,
    );
    expect(screen.getByText("What do you do?")).toBeInTheDocument();
    for (const a of QUIZ_AUDIENCES) expect(screen.getByRole("button", { name: new RegExp(a.label) })).toBeInTheDocument();
  });

  it("only prefills Cal.com with values the booking form accepts", () => {
    for (const byStage of Object.values(GOALS)) for (const goals of Object.values(byStage)) for (const g of goals) expect(CAL_GOAL_OPTIONS).toContain(calGoal(g.key));
    expect(BUDGETS.every((b) => b.value > 0)).toBe(true);
  });

  it("always has a money move for every audience and goal", () => {
    for (const [audience, byStage] of Object.entries(GOALS))
      for (const [stage, goals] of Object.entries(byStage))
        for (const g of goals) {
          const m = moneyMove({ ...EMPTY_ANSWERS, audience: audience as never, stage: stage as never, goal: g.key });
          expect(m.title.length, `${audience}/${stage}/${g.key}`).toBeGreaterThan(5);
          expect(m.points.length).toBe(3);
        }
  });

  it("asks starting vs growing second, with questions that change by answer", () => {
    expect(QUIZ_STEPS.slice(0, 3)).toEqual(["audience", "stage", "goal"]);
    for (const a of QUIZ_AUDIENCES) {
      expect(STAGES[a.id].map((s) => s.id)).toEqual(["start", "grow"]);
      expect(GOALS[a.id].start.length).toBeGreaterThanOrEqual(4);
      expect(BLOCKERS[a.id].start.length).toBeGreaterThanOrEqual(4);
      expect(GOALS[a.id].start).not.toEqual(GOALS[a.id].grow);
      expect(BLOCKERS[a.id].start).not.toEqual(BLOCKERS[a.id].grow);
      for (const s of ["start", "grow"] as const) for (const g of GOALS[a.id][s]) expect(labelOf.goal(a.id, g.key, s)).toBe(g.label);
    }
    expect(STAGES.artist[1].sub).toMatch(/listeners/);
    const starter = moneyMove({ ...EMPTY_ANSWERS, audience: "local", stage: "start", goal: "launch" });
    const grower = moneyMove({ ...EMPTY_ANSWERS, audience: "local", stage: "grow", goal: "calls" });
    expect(starter.title).not.toEqual(grower.title);
  });
});

describe("pricing", () => {
  it("has unique ids and gives every service a price", () => {
    expect(new Set(ALL_PRICES.map((p) => p.id)).size).toBe(ALL_PRICES.length);
    for (const s of SERVICES) expect(pricesFor(s.slug).length, s.slug).toBeGreaterThan(0);
  });

  it("never quotes a dollar amount in FAQs that isn't on the price list", () => {
    const allowed = new Set(ALL_PRICES.map((p) => usd(p.price)));
    const text = [...PRICING_FAQS, ...HOME_FAQS, ...BOOK_FAQS].map((f) => f.a).join(" ");
    const quoted = (text.match(/\$\d{1,3}(?:,\d{3})*(?!\d|[.,]\d)/g) ?? []).filter((m) => !/^\$(10|20|300)$/.test(m));
    for (const q of quoted) expect(allowed.has(q), q).toBe(true);
  });

  it("publishes a /pricing page with the price catalog", () => {
    const p = PAGES.find((x) => x.path === "/pricing");
    expect(p && !p.noindex).toBe(true);
    expect(JSON.stringify(p!.schema)).toContain("OfferCatalog");
  });
});

describe("phone + social", () => {
  it("shows the phone number as a tap-to-call link and the brand socials as icon links", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );
    const tel = screen.getAllByRole("link", { name: /\(470\) 502-9543/ });
    expect(tel.length).toBeGreaterThan(0);
    for (const t of tel) expect(t).toHaveAttribute("href", "tel:+14705029543");
    for (const s of SITE.social) {
      const a = screen.getByRole("link", { name: `CEO Turbo on ${s.label}` });
      expect(a).toHaveAttribute("href", s.href);
      expect(a).toHaveAttribute("target", "_blank");
      expect(a.querySelector("svg")).not.toBeNull();
    }
  });

  it("puts the phone and brand profiles in Organization schema, personal ones on the founder", () => {
    const org = organization() as Record<string, unknown>;
    expect(org.telephone).toBe("+14705029543");
    expect(org.sameAs).toEqual(SITE.social.map((s) => s.href));
    expect((founder() as Record<string, unknown>).sameAs).toEqual(SITE.founder.sameAs);
  });
});

describe("Microsoft Clarity prep", () => {
  it("allows Clarity in the Content-Security-Policy and discloses it in the privacy policy", () => {
    const csp = JSON.parse(readFileSync(path.resolve(__dirname, "../../vercel.json"), "utf8")).headers[0].headers.find((h: { key: string }) => h.key === "Content-Security-Policy").value as string;
    for (const dir of ["script-src", "connect-src", "img-src"]) expect(csp.split(";").find((d) => d.trim().startsWith(dir))).toContain("clarity.ms");
    expect(readFileSync(path.resolve(__dirname, "../pages/Legal.tsx"), "utf8")).toContain("Microsoft Clarity");
  });

  it("lets the Clarity and UET loaders through the CSP", () => {
    const csp = CSP;
    const scriptSrc = csp.split(";").find((d) => d.trim().startsWith("script-src"))!;
    for (const host of ["https://*.clarity.ms", "https://bat.bing.net", "https://bat.bing.com"]) expect(scriptSrc).toContain(host);
    expect(csp.split(";").find((d) => d.trim().startsWith("connect-src"))).toContain("https://bat.bing.net");
  });

  it("has the UET tag and Clarity project ids built in", () => {
    expect(DEFAULT_UET_TAG_ID).toBe("187280408");
    expect(DEFAULT_CLARITY_ID).toBe("ywmvopjye1");
  });

  it("masks every personal-data input on the lead forms", () => {
    for (const f of ["../components/quiz/BrandBoostQuiz.tsx", "../components/audit/AuditTool.tsx"]) {
      const src = readFileSync(path.resolve(__dirname, f), "utf8");
      for (const field of ["-name`", "-email`", "-phone`"]) {
        const re = new RegExp(`<input id=\\{\\\`\\$\\{uid\\}${field.replace("`", "\\`")}[^>]*`);
        expect(src, `${f} ${field}`).toMatch(re);
      }
    }
  });
});
