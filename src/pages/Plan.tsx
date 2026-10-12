// /plan — the 5-step tutorial page Christopher scrolls in the 9:16 Meta ad (face on top, this page below).
// One idea per screen, a real number on almost every screen, and the step rail so viewers always know where
// they are. Focus layout (no menu): every click goes to the quiz/call or the review-card store.
import { ArrowDown, ArrowUpRight, Megaphone, MapPin, Phone, Search, Sparkles, Star, X } from "lucide-react";
import { SITE } from "@/config/site";
import { AD_RESULTS, AD_TOTALS, APPLIANCE_KING_PAGE, GSC, STRIPE, money } from "@/content/results";
import { CLIENTS } from "@/content/clients";
import { ADS } from "@/content/ads";
import { AdGallery, AdResultsGrid, StripeProof } from "@/components/blocks/Proof";
import { BookingSection } from "@/components/blocks/Sales";
import { BookButton, ShopCardsButton } from "@/components/cta/Actions";
import { CallLink } from "@/components/site/CallLink";
import { CountUp } from "@/components/visuals/CountUp";
import { StepHead, StepRail, Stat, Tick, useActiveStep } from "@/components/blocks/Tutorial";
import { SearchScene } from "@/components/visuals/Scenes";
import { SiteWall } from "@/components/visuals/SiteWall";
import { TapDemo } from "@/components/visuals/ReviewVisuals";
import { cn } from "@/lib/utils";

const SOURCE = "Plan page";

const PLAN_STEPS = [
  { id: "found", label: "Get found", title: "Get found on Google, Maps & ChatGPT" },
  { id: "social", label: "Look worth it", title: "Fix your social profiles" },
  { id: "trust", label: "Be trusted", title: "Google Business Profile, Trustpilot & reviews" },
  { id: "ads", label: "Turn on ads", title: "Run Meta + Google Search ads aimed by your data" },
  { id: "ceo", label: "Talk to the CEO", title: "Get your plan from the founder" },
] as const;

export default function Plan() {
  const active = useActiveStep(PLAN_STEPS, "plan_step_view");
  const ak = AD_RESULTS.find((r) => r.key === "appliance-king")!;
  const pg = APPLIANCE_KING_PAGE;

  return (
    <>
      {/* HOOK — loss first, proof immediately under it. */}
      <section className="relative overflow-hidden pb-12 pt-24 sm:pb-20 sm:pt-32">
        <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 glow-ignite opacity-60" aria-hidden />
        <div className="container-x relative">
          <p className="chip">Free tutorial · 5 steps · 90 seconds</p>
          <h1 className="mt-5 max-w-4xl text-[40px] font-bold leading-[1.02] sm:text-7xl">
            <span className="text-chrome-grad">Your competitors aren't better than you.</span> <span className="text-turbo-grad">They're just easier to find.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-[18px] leading-relaxed text-muted-foreground sm:text-xl">
            Here's the exact 5-step plan we use to get businesses found on Google and ChatGPT, trusted on sight, and paid. Scroll along — it takes 90 seconds.
          </p>
          <div className="mt-8 grid max-w-3xl gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
            <div className="rounded-2xl bg-white/[0.04] px-5 py-4 ring-1 ring-white/10">
              <p className="font-display text-5xl font-bold text-turbo-grad sm:text-6xl">
                <CountUp value={STRIPE.gross} />
              </p>
              <p className="mt-1 text-sm text-muted-foreground">paid to CEO Turbo in 12 months</p>
            </div>
            <p className="text-[15px] leading-relaxed text-foreground/90">
              <span className="font-semibold">{STRIPE.payments} payments, {STRIPE.paymentsGrowth} on last year</span> — from businesses fixing exactly what you're about to see. Real Stripe screenshots below.
            </p>
          </div>
          <div className="mt-8 rounded-2xl border border-ignite/30 bg-ignite/[0.07] p-5 sm:max-w-3xl">
            <p className="text-[16px] leading-relaxed sm:text-lg">
              <span className="font-semibold text-ignite">The hard truth:</span> every day you're hard to find, a customer who was ready to pay is calling someone else. They're not choosing the best business. They're choosing the one they found and trusted first.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <BookButton note={`${SOURCE} — hook`} className="btn-shine">
              Skip ahead — get my free plan
            </BookButton>
            <a href="#found" className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-chrome hover:text-foreground">
              Show me the 5 steps <ArrowDown className="h-4 w-4 animate-bounce" aria-hidden />
            </a>
          </div>
        </div>
      </section>

      <StepRail steps={PLAN_STEPS} active={active} intro="The 5-step plan · scroll along" />

      {/* STEP 1 — website + SEO/AEO/GEO */}
      <section id="found" className="section scroll-mt-28" aria-label={PLAN_STEPS[0].title}>
        <div className="container-x grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <StepHead n={1} kicker="Get found" title={<>Show up when they search — on Google, Maps <span className="text-turbo-grad">and ChatGPT.</span></>} lede="If they can't find you, nothing else matters. We build you a fast website and optimize it three ways:" />
            <ul className="mt-6 grid gap-3">
              {[
                { icon: Search, t: "SEO", b: "rank on Google and Maps when people search “near me”" },
                { icon: Sparkles, t: "AEO", b: "become the answer Google's AI Overviews quote" },
                { icon: MapPin, t: "GEO", b: "get named when people ask ChatGPT, Gemini or Perplexity who to hire" },
              ].map((x) => (
                <li key={x.t} className="flex items-start gap-3 rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/5">
                  <x.icon className="mt-0.5 h-5 w-5 shrink-0 text-turbo" aria-hidden />
                  <span className="text-[16px]">
                    <span className="font-display font-bold">{x.t}</span> <span className="text-muted-foreground">— {x.b}</span>
                  </span>
                </li>
              ))}
            </ul>
            <dl className="mt-6 grid grid-cols-2 gap-3">
              <Stat v={GSC.impressions} l={`Google impressions on ${GSC.property}`} tone="turbo" />
              <Stat v={String(CLIENTS.length)} l="client websites live right now" />
            </dl>
          </div>
          <SearchScene className="h-auto w-full" />
        </div>
        <div className="mt-10">
          <SiteWall eagerCount={0} />
        </div>
        <p className="container-x -mt-4 text-center text-xs text-muted-foreground">Real client sites we designed and built — every one of them.</p>
      </section>

      {/* STEP 2 — social profiles */}
      <section id="social" className="section scroll-mt-28 border-t border-border" aria-label={PLAN_STEPS[1].title}>
        <div className="container-x">
          <StepHead n={2} kicker="Look worth it" title={<>They found you. Now they check your profile — <span className="text-turbo-grad">in 3 seconds.</span></>} lede="A dead Instagram or a messy Facebook page tells people you might be closed. We fix and optimize every profile so it sells for you." />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-white/[0.02] p-5 ring-1 ring-white/10">
              <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Before</p>
              <ul className="mt-3 space-y-2.5 text-[16px] text-muted-foreground">
                {["Random bio — nobody knows what you do", "No way to book or call in one tap", "No reviews, no proof, old posts", "Different name and photo on every app"].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <X className="mt-0.5 h-5 w-5 shrink-0 text-red-400/80" aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-turbo/[0.06] p-5 ring-1 ring-turbo/30">
              <p className="text-sm font-semibold uppercase tracking-wider text-turbo">After CEO Turbo</p>
              <ul className="mt-3 space-y-2.5">
                <Tick>Clear bio: what you do, where, and for who</Tick>
                <Tick>One-tap book, call and message buttons</Tick>
                <Tick>Pinned proof: reviews, results, before &amp; afters</Tick>
                <Tick>Same name, photo and links everywhere — Google and AI trust consistency</Tick>
              </ul>
            </div>
          </div>
          <div className="panel mt-8 grid items-center gap-6 p-5 sm:p-8 lg:grid-cols-[1fr_0.8fr]">
            <div>
              <p className="text-sm font-medium text-turbo">Real result · Appliance King's Facebook page (Meta insights, 2026)</p>
              <dl className="mt-4 grid grid-cols-2 gap-3">
                <Stat v={pg.views} l="page views" tone="turbo" />
                <Stat v={pg.viewers} l="people reached" />
                <Stat v={pg.linkClicks} l="link clicks" />
                <Stat v={pg.follows} l="new follows" />
              </dl>
              <p className="mt-3 text-xs text-muted-foreground">Flat all year, then up from July — when we optimized the page and launched their ads.</p>
            </div>
            <a href={pg.image} target="_blank" rel="noopener" className="block overflow-hidden rounded-xl border border-border bg-white/[0.02]">
              <img src={pg.image.replace(".webp", "-600.webp")} srcSet={`${pg.image.replace(".webp", "-600.webp")} 600w, ${pg.image.replace(".webp", "-900.webp")} 900w`} sizes="(min-width: 1024px) 420px, 92vw" alt="Appliance King Facebook page insights: 59.4K views, 26.6K viewers, 778 link clicks, 186 follows" width={1290} height={1380} loading="lazy" decoding="async" className="h-auto max-h-80 w-full object-cover object-top" />
              <span className="flex items-center gap-1 px-4 py-2 text-xs text-muted-foreground">
                Unedited screenshot <ArrowUpRight className="h-3 w-3" />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* STEP 3 — GBP, Trustpilot, reviews → review card */}
      <section id="trust" className="section scroll-mt-28 border-t border-border" aria-label={PLAN_STEPS[2].title}>
        <div className="container-x">
          <StepHead n={3} kicker="Be trusted" title={<>Reviews are the new word of mouth. <span className="text-turbo-grad">No reviews, no call.</span></>} lede="Two businesses show up. One has 9 reviews, the other has 140. Be honest — who are you calling? We set up the profiles where reviews live, then make getting them automatic." />
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              { icon: MapPin, t: "Google Business Profile", b: "Set up, verified and filled out — categories, photos, services, posts — so you show on Maps and in the local 3-pack." },
              { icon: Star, t: "Trustpilot", b: "A second, independent review profile that buyers and AI assistants check before they trust a business." },
              { icon: Sparkles, t: "Reviews = trust = money", b: "More 5-star reviews mean more clicks, more calls, a higher Maps ranking — and more mentions in AI answers." },
            ].map((c) => (
              <li key={c.t} className="panel p-5">
                <c.icon className="h-6 w-6 text-turbo" aria-hidden />
                <h3 className="mt-3 text-lg font-semibold">{c.t}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">{c.b}</p>
              </li>
            ))}
          </ul>
          <div className="cta-glow mt-10 grid items-center gap-8 rounded-3xl p-6 sm:p-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="text-sm font-semibold text-ignite">The easiest review you'll ever get</p>
              <h3 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">Hand them a card. One tap opens your Google review page.</h3>
              <ul className="mt-5 space-y-2.5">
                <Tick>No app, no link to text, no “I'll do it later”</Tick>
                <Tick>Works on iPhone and Android — tap or scan</Tick>
                <Tick>Keep it at the counter, in the truck, on the invoice</Tick>
              </ul>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <ShopCardsButton className="btn-shine" />
                <span className="text-sm text-muted-foreground">Ships from Atlanta</span>
              </div>
            </div>
            <TapDemo />
          </div>
        </div>
      </section>

      {/* STEP 4 — ads, Meta + Search */}
      <section id="ads" className="section scroll-mt-28 border-t border-border" aria-label={PLAN_STEPS[3].title}>
        <div className="container-x">
          <StepHead n={4} kicker="Turn on ads" title={<>Now we pour fuel on it — <span className="text-turbo-grad">ads aimed by your data.</span></>} lede="Ads sent to a profile nobody trusts burn money. Ads sent to a business that's found, polished and full of reviews print it. We use your tracking, your customers and your reviews to aim at the people most likely to buy." />
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="panel p-6">
              <Megaphone className="h-6 w-6 text-turbo" aria-hidden />
              <h3 className="mt-3 text-2xl font-bold">Meta ads find them.</h3>
              <p className="mt-2 text-[16px] leading-relaxed text-muted-foreground">Facebook and Instagram stop the scroll and create demand from people who weren't looking yet — but look exactly like your best customers.</p>
            </div>
            <div className="panel p-6">
              <Search className="h-6 w-6 text-turbo" aria-hidden />
              <h3 className="mt-3 text-2xl font-bold">Google Search ads catch them.</h3>
              <p className="mt-2 text-[16px] leading-relaxed text-muted-foreground">You show up the second someone types “near me” with their wallet out. They already want it — you just have to be there.</p>
            </div>
          </div>
          <p className="mt-5 rounded-2xl bg-white/[0.03] p-5 text-[16px] leading-relaxed ring-1 ring-white/5 sm:text-lg">
            <span className="font-semibold text-foreground">Why you need both:</span> <span className="text-muted-foreground">Meta fills the pipeline, Search closes the people who are ready, and both learn from the same tracking — so every dollar gets smarter instead of guessing.</span>
          </p>
          <dl className="mt-8 grid grid-cols-3 gap-3">
            <Stat small v={String(AD_TOTALS.leads)} l="leads for clients" tone="turbo" />
            <Stat small v={money(AD_TOTALS.avgCpl)} l="average per lead" />
            <Stat small v={money(AD_TOTALS.lowestCpl)} l="lowest per lead" />
          </dl>
          <p className="mt-6 text-[16px] sm:text-lg">
            <span className="font-semibold">Appliance King:</span> {ak.count} leads at {money(ak.costPer)} each from {money(ak.spent)} in ads.
          </p>
          <div className="mt-8">
            <AdResultsGrid keys={["appliance-king", "ryan-pool", "stackmode-repair"]} />
          </div>
          <h3 className="mt-14 text-2xl font-bold">Ads we designed for them</h3>
          <div className="mt-6">
            <AdGallery ads={ADS.slice(0, 4)} />
          </div>
        </div>
      </section>

      {/* PROOF OF PAYMENT */}
      <section className="pb-16" aria-label="Payments to CEO Turbo">
        <div className="container-x">
          <StripeProof compact title="Businesses don't keep paying for something that doesn't work." />
        </div>
      </section>

      {/* STEP 5 — the founder */}
      <section id="ceo" className="section scroll-mt-28 border-t border-border" aria-label={PLAN_STEPS[4].title}>
        <div className="container-x grid items-center gap-10 md:grid-cols-[0.85fr_1.15fr]">
          <img src={SITE.founder.image} alt={`${SITE.founder.name}, founder and CEO of CEO Turbo`} width={720} height={539} loading="lazy" decoding="async" className="aspect-[4/3] w-full rounded-2xl object-cover ring-1 ring-white/10" />
          <div>
            <StepHead n={5} kicker="Talk to the CEO" title={<>No account managers. <span className="text-turbo-grad">You talk to me.</span></>} />
            <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground sm:text-lg">
              I'm {SITE.founder.name}. I built every site on this page and I run every Brand Boost call myself. On a free 30-minute call I'll look at your website, Google profile, reviews, socials and ads with you — live — and tell you the one move that brings customers fastest.
            </p>
            <ul className="mt-6 space-y-2.5">
              <Tick>Free 30 minutes, video or phone</Tick>
              <Tick>Your #1 money move, not a 40-item to-do list</Tick>
              <Tick>A fixed price if you want us to do it — keep the plan either way</Tick>
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <BookButton note={`${SOURCE} — founder`} className="btn-shine">
                Get my free plan from Christopher
              </BookButton>
              <CallLink location="plan page founder" className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-chrome hover:text-foreground">
                <Phone className="h-4 w-4" aria-hidden /> Call our office: {SITE.phone.display}
              </CallLink>
            </div>
          </div>
        </div>
        <div className="container-x mt-14">
          <ol className="grid grid-cols-2 gap-2 text-center text-sm font-semibold sm:grid-cols-5">
            {["Found", "Polished", "Trusted", "Advertised", "Paid"].map((t, i) => (
              <li key={t} className={cn("rounded-xl px-3 py-3 ring-1", i === 4 ? "col-span-2 bg-ignite/15 text-ignite ring-ignite/40 sm:col-span-1" : "bg-white/[0.03] ring-white/10")}>
                {i + 1}. {t}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <BookingSection note={`${SOURCE} — booking`} title="Your plan is 6 quick taps away. Then pick a time." primary />
    </>
  );
}
