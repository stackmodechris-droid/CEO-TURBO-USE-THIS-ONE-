import { Link } from "react-router-dom";
import { ArrowRight, Check, MapPin, Search, Star, Megaphone, Globe } from "lucide-react";
import { BookButton, ShopCardsButton } from "@/components/cta/Actions";
import { ReviewCard3D } from "@/components/visuals/ReviewVisuals";
import { ProofStats, GSCProof, WorkGrid, StripeProof, FeaturedResult, AdResultsGrid, AdGallery } from "@/components/blocks/Proof";
import { SiteWall } from "@/components/visuals/SiteWall";
import { ADS } from "@/content/ads";
import { AD_TOTALS, money } from "@/content/results";
import { Founder, BookingSection, ServiceGrid } from "@/components/blocks/Sales";
import { SectionHeader, FAQList } from "@/components/blocks/Basics";
import { HOME_FAQS } from "@/content/faqs";
import { CALL_FIRST_SLUGS } from "@/content/services";
import { SHOP_PATH, SETUP_PATH } from "@/content/review-cards";
import { CLIENTS } from "@/content/clients";
import { REVIEW_CARD, fromPriceLabel, money2, packSavings } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Money model, top to bottom:
 * 1. Attract — a review card anyone can buy for the price of lunch.
 * 2. Core — the free setup & growth call where we get the business found (GBP, indexing, SEO/AEO/GEO, ads).
 * In-person office / PC / POS work is its own funnel and only gets a short "we're a real company" strip here.
 */
export default function Home() {
  return (
    <>
      {/* HERO — the product first, the call second. */}
      <section className="relative overflow-clip pt-24 sm:pt-28 lg:pt-32" aria-labelledby="hero">
        <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 glow-turbo" aria-hidden />
        <div className="container-x relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div className="hero-rise relative z-10 min-w-0">
            <p className="chip">Google review cards · free US shipping from Atlanta</p>
            <h1 id="hero" className="mt-4 text-[34px] font-bold leading-[1.05] sm:mt-5 sm:text-5xl md:text-6xl lg:text-[64px]">
              <span className="text-chrome-grad">Stop begging for reviews.</span> <span className="text-turbo-grad">Let customers tap.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:mt-5 sm:text-lg">
              One tap on our NFC card opens your Google review form in about 3 seconds — no app, no searching your name. More 5-star reviews means a higher spot on Google Maps, more trust and more calls.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <ShopCardsButton className="btn-shine">
                Get my review cards — from {fromPriceLabel} <ArrowRight className="h-4 w-4" aria-hidden />
              </ShopCardsButton>
              <BookButton variant="chrome" note="Home hero — setup call">
                Book a free setup &amp; growth call
              </BookButton>
            </div>
            <ul className="mt-6 grid max-w-xl grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground">
              {["Pay once, no subscription", "iPhone & Android", `${REVIEW_CARD.returnDays}-day returns`, "Free setup help"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-turbo" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative mx-auto w-full max-w-[300px] sm:max-w-[400px]">
            <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-turbo/20 blur-3xl" aria-hidden />
            <ReviewCard3D tap priority className="w-full max-w-[360px]" />
          </div>
        </div>
      </section>

      <section className="pt-14 pb-8" aria-label="Results at a glance">
        <div className="container-x">
          <ProofStats />
        </div>
      </section>

      {/* HOW IT WORKS — three steps, zero effort. */}
      <section className="section border-t border-border" aria-labelledby="how">
        <div className="container-x">
          <SectionHeader title={<span id="how">How it works: 3 steps, 10 seconds.</span>} lede="No QR code hunting, no “search us on Google”, no follow-up texts nobody answers." />
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { t: "Put the card where they pay", b: "Counter, chair, front desk, check folder or service van. Program it once with our 2-minute guide — or we do it on the call." },
              { t: "Customer taps their phone", b: "Your Google review form opens instantly. No app, no typing your name, no scrolling Maps." },
              { t: "The review is posted", b: "They pick the stars and hit post while they're still happy. Ask at the right moment and most people say yes." },
            ].map((s, i) => (
              <li key={s.t} className="panel p-6">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-turbo/15 font-display font-bold text-turbo">{i + 1}</span>
                <h3 className="mt-4 font-display text-lg font-bold">{s.t}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* PRICING — real packs, real prices. */}
      <section className="section border-t border-border" aria-labelledby="packs">
        <div className="container-x">
          <SectionHeader title={<span id="packs">Pick your pack. It ships in 1–2 days.</span>} lede={`${REVIEW_CARD.shipping.label} · ${REVIEW_CARD.specs.material} · ${REVIEW_CARD.returnDays}-day returns, no restocking fee.`} />
          <ul className="mt-10 grid gap-4 sm:grid-cols-3">
            {REVIEW_CARD.packs.map((p) => (
              <li key={p.id} className={cn("relative flex flex-col rounded-3xl p-6 ring-1", p.popular ? "bg-turbo/[0.08] ring-turbo/50" : "bg-white/[0.03] ring-white/10")}>
                {p.popular && <span className="absolute -top-3 left-6 rounded-full bg-turbo px-3 py-1 text-xs font-bold text-background">Most popular</span>}
                <p className="font-semibold">{p.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{p.note}</p>
                <p className="mt-4 font-display text-4xl font-bold">{money2(p.price)}</p>
                <p className="mt-1 h-5 text-xs text-turbo">{packSavings(p) > 0 ? `Save ${money2(packSavings(p))}` : ""}</p>
                <Link to={SHOP_PATH} className={cn("mt-5", p.popular ? "btn-ignite" : "btn-chrome")}>
                  Get {p.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            New to NFC? <Link to={SETUP_PATH} className="font-semibold text-turbo underline-offset-4 hover:underline">See the 2-minute setup</Link> or <Link to="/how-to-get-more-google-reviews" className="font-semibold text-turbo underline-offset-4 hover:underline">read why reviews win more customers</Link>.
          </p>
        </div>
      </section>

      {/* VALUE LADDER — the card gets reviews, the call gets them found. */}
      <section className="section border-t border-border" aria-labelledby="ladder">
        <div className="container-x">
          <SectionHeader
            kicker="Free setup & growth call"
            title={<span id="ladder">Reviews get you chosen. We make sure you get found.</span>}
            lede="Reviews are one of the biggest signals Google uses to rank local businesses in Maps. On a free 30-minute call we set up your card with you, then show you exactly what's keeping you off page one — and fix it for you if you want."
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: MapPin, t: "Google Business Profile", b: "Set up, verified and optimized: categories, services, photos and posts so you show up in the Maps pack." },
              { icon: Search, t: "Indexing + SEO, AEO & GEO", b: "Your site indexed on Google and Bing, and written so ChatGPT, Perplexity and AI Overviews name you." },
              { icon: Megaphone, t: "Local ads that ring the phone", b: "Google, Meta and Microsoft ads with every call, form and booking tracked back to the dollar." },
              { icon: Globe, t: "A website that converts", b: "Fast, mobile-first and built to turn a Maps click into a call or a booking." },
            ].map((x) => (
              <li key={x.t} className="panel p-5">
                <x.icon className="h-5 w-5 text-turbo" aria-hidden />
                <h3 className="mt-3 font-display text-lg font-bold">{x.t}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{x.b}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <BookButton note="Home — value ladder">Book my free setup &amp; growth call</BookButton>
            <Link to="/pricing" className="inline-flex min-h-[44px] items-center text-sm font-semibold text-turbo underline-offset-4 hover:underline">
              See the done-for-you prices
            </Link>
            <Link to="/free-audit" className="inline-flex min-h-[44px] items-center text-sm font-semibold text-turbo underline-offset-4 hover:underline">
              Or run the free 60-second check
            </Link>
          </div>
        </div>
      </section>

      {/* PROOF — only real numbers and real work. */}
      <section className="section border-t border-border" aria-labelledby="proof">
        <div className="container-x">
          <SectionHeader title={<span id="proof">Real payments. Real ad results. Real sites.</span>} lede={`Unedited Stripe, ad-account and Search Console screenshots, and ${CLIENTS.length} live sites we built.`} />
          <div className="mt-10">
            <StripeProof compact />
          </div>
          <div className="mt-12">
            <FeaturedResult />
          </div>
        </div>
      </section>

      <section className="pb-16" aria-label="Client websites we built">
        <SiteWall eagerCount={0} />
      </section>

      <section className="section border-t border-border" aria-labelledby="ads">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeader
              title={<span id="ads">{AD_TOTALS.leads} leads at about {money(AD_TOTALS.avgCpl)} each.</span>}
              lede={`${AD_TOTALS.campaigns} Meta campaigns, ${money(AD_TOTALS.leadSpend)} total spend. These are the unedited dashboards.`}
            />
            <Link to="/results" className="btn-chrome shrink-0">
              All results <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <div className="mt-12">
            <AdResultsGrid keys={["ryan-pool", "stackmode-repair", "bigzo"]} />
          </div>
          <h3 className="mt-16 text-2xl font-bold">The creatives behind them</h3>
          <div className="mt-6">
            <AdGallery ads={ADS.slice(0, 8)} />
          </div>
          <div className="mt-16">
            <GSCProof />
          </div>
          <div className="mt-12">
            <WorkGrid limit={6} clients={[...CLIENTS].sort((a, b) => order(a.slug) - order(b.slug))} />
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-label="Founder">
        <div className="container-x">
          <Founder />
        </div>
      </section>

      {/* REAL COMPANY — in-person work proves we exist; it has its own pages and ads. */}
      <section className="section border-t border-border" aria-labelledby="inperson">
        <div className="container-x">
          <SectionHeader title={<span id="inperson">A real company, not just a laptop agency.</span>} lede="We also set up offices, build PCs and install POS systems in person across metro Atlanta." />
          <div className="mt-10">
            <ServiceGrid cards={false} slugs={CALL_FIRST_SLUGS} />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section border-t border-border" aria-labelledby="final">
        <div className="container-x">
          <div className="cta-glow rounded-3xl p-8 text-center sm:p-12">
            <Star className="mx-auto h-8 w-8 text-turbo" aria-hidden />
            <h2 id="final" className="h-section mt-3">Every day without reviews, the shop down the street gets your customer.</h2>
            <p className="lede mx-auto max-w-2xl">Start with a card today. When you want more, book the call and we'll help you own your area on Google.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <ShopCardsButton>Get my review cards — from {fromPriceLabel}</ShopCardsButton>
              <BookButton variant="chrome" note="Home — final CTA">
                Book a free setup call
              </BookButton>
            </div>
          </div>
        </div>
      </section>

      <FAQList faqs={HOME_FAQS} title="Questions before you order?" />
      <BookingSection note="Home — booking section" title="Want help getting more reviews and customers? Pick a time." />
    </>
  );
}

// Lead the homepage grid with the strongest, most varied work.
const FEATURED = ["mor-handy", "7uvhavin", "beyond-labels-gifts", "phoenix-freedom-firearms", "bigzo", "kingstone-landscaping"];
const order = (slug: string) => {
  const i = FEATURED.indexOf(slug);
  return i === -1 ? 99 : i;
};
