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
import { BOOKING, REVIEW_CARD, packSavings, packPath } from "@/config/site";
import { merchantFeed, feedItems } from "@/seo/feed";
import { reviewCardProduct } from "@/seo/schema";
import { findVariant } from "@/lib/shopify";
import { BookButton, ShopCardsButton } from "@/components/cta/Actions";
import { checkReviewLink } from "@/lib/review-link";

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
    expect(AD_TOTALS.leads).toBe(105);
    expect(AD_TOTALS.leadSpend).toBeCloseTo(841.26, 2);
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
    expect(xml).toContain(`<g:link>https://ceoturbo.com${packPath("5")}</g:link>`);
    expect(xml).toContain("<g:price>39.99 USD</g:price>");
    expect(xml).not.toMatch(/&(?!amp;|lt;|gt;|quot;)/);
  });

  it("describes the product as a ProductGroup with a priced offer per variant", () => {
    const p = reviewCardProduct() as { "@type": string; hasVariant: { sku: string; image: string; offers: { price: string; url: string } }[] };
    expect(p["@type"]).toBe("ProductGroup");
    expect(p.hasVariant).toHaveLength(REVIEW_CARD.packs.length);
    for (const v of p.hasVariant) {
      expect(Number(v.offers.price)).toBeGreaterThan(0);
      expect(v.offers.url).toMatch(/^https:\/\/ceoturbo\.com\/google-review-cards\?pack=\d$/);
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
