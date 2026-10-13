// /app-marketing — Reddit ad landing page for software developers who need more installs.
// Focus layout (no nav, no footer links) because this is an ad destination.
import { ArrowRight, Check, Code2, Download, Megaphone, Rocket, Search, BarChart3, Zap, Terminal } from "lucide-react";
import { Link } from "react-router-dom";
import { BookButton } from "@/components/cta/Actions";
import { CallLink } from "@/components/site/CallLink";
import { ProofStats } from "@/components/blocks/Proof";
import { StripeProof } from "@/components/blocks/Proof";
import { BookingSection } from "@/components/blocks/Sales";
import { FAQList } from "@/components/blocks/Basics";
import { PACKAGES, usd } from "@/content/pricing";
import { CLIENTS } from "@/content/clients";
import { SITE, BOOKING } from "@/config/site";
import { APP_MARKETING_PAINS, APP_MARKETING_SERVICES, APP_MARKETING_FAQS } from "@/content/app-marketing";
import { cn } from "@/lib/utils";

const SERVICE_ICONS = [Code2, Search, Megaphone, Search, Rocket, BarChart3] as const;

export default function AppMarketing() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-clip pt-24 sm:pt-32" aria-label="App marketing for developers">
        <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 glow-turbo" aria-hidden />
        <div className="container-x relative">
          <div className="hero-rise relative z-10 mx-auto max-w-3xl text-center">
            <p className="chip mx-auto">CEO Turbo for software developers</p>
            <h1 className="mt-5 text-[32px] font-bold leading-[1.02] sm:text-[44px] md:text-6xl lg:text-[68px]">
              <span className="text-chrome-grad">You built the app.</span>{" "}
              <span className="text-turbo-grad">We'll get it installed.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              You spent months writing code. Now it sits in the App Store with 47 downloads. Marketing is a different stack — and you shouldn't have to learn it. We handle the website, the ads, the store listing and the launch so you can keep shipping.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <BookButton note="App marketing hero" prefill="I'm a software developer and need help marketing my app" className="w-full sm:w-auto">
                Get my free growth plan <ArrowRight className="h-4 w-4" aria-hidden />
              </BookButton>
              <CallLink location="app marketing hero" icon className="text-sm font-semibold text-chrome transition-colors hover:text-foreground" />
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Terminal className="h-4 w-4 text-turbo" aria-hidden /> Dev-friendly, zero BS
              </span>
              <span className="flex items-center gap-1.5">
                <Download className="h-4 w-4 text-turbo" aria-hidden /> iOS, Android, SaaS, web apps
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-turbo" aria-hidden /> First campaigns in 2 weeks
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* PAIN POINTS */}
      <section className="section" aria-labelledby="pains">
        <div className="container-x">
          <h2 id="pains" className="h-section text-center">Sound familiar?</h2>
          <p className="lede mx-auto mt-4 text-center">You can architect a distributed system but can't get 100 installs. It's not a you problem — marketing is a different discipline.</p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {APP_MARKETING_PAINS.map((p) => (
              <li key={p.title} className="panel p-5 sm:p-6">
                <h3 className="text-lg font-semibold sm:text-xl">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section className="section border-t border-border" aria-labelledby="services">
        <div className="container-x">
          <p className="text-sm font-medium text-turbo">What we build for you</p>
          <h2 id="services" className="h-section mt-2">
            You write the code. <span className="text-turbo-grad">We do the marketing.</span>
          </h2>
          <p className="lede">Everything from your landing page to your ad campaigns — set up properly, tracked end to end, and managed by someone who knows what r/SideProject and Hacker News actually are.</p>
          <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl bg-border sm:grid-cols-2 lg:grid-cols-3">
            {APP_MARKETING_SERVICES.map((s, i) => {
              const Icon = SERVICE_ICONS[i];
              return (
                <li key={s.title} className="flex flex-col bg-background p-5 sm:p-6">
                  <Icon className="h-5 w-5 text-turbo" aria-hidden />
                  <h3 className="mt-3 text-lg font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </li>
              );
            })}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <BookButton note="App marketing services" prefill="I'm a developer — tell me which services my app needs">
              Tell me what my app needs
            </BookButton>
            <span className="text-sm text-muted-foreground">Free call · {BOOKING.length} · no pitch deck</span>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="pb-8" aria-label="Results at a glance">
        <div className="container-x">
          <ProofStats />
        </div>
      </section>

      <section className="pb-12 sm:pb-16" aria-label="Payments to CEO Turbo">
        <div className="container-x">
          <StripeProof
            compact
            title="We've marketed 20+ products. Here's the receipt."
            lede={`This is CEO Turbo's own Stripe — what businesses and creators paid us. ${CLIENTS.length} client sites live, from artists to SaaS. People don't keep paying for something that doesn't work.`}
          />
        </div>
      </section>

      {/* PRICING SNAPSHOT */}
      <section className="section border-t border-border" aria-labelledby="pricing">
        <div className="container-x">
          <h2 id="pricing" className="h-section">Clear prices. No "let's hop on a call to discuss."</h2>
          <p className="lede">One setup fee to build everything. Monthly only where ongoing work keeps paying off. Your Brand Boost call tells you exactly which pieces you need.</p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-3">
            {PACKAGES.map((p) => (
              <li key={p.id} className={cn("panel flex flex-col p-5 sm:p-6", p.popular && "ring-1 ring-turbo/60")}>
                {p.popular && <span className="mb-3 inline-flex w-fit rounded-full bg-turbo px-3 py-1 text-xs font-bold text-background">Best for most devs</span>}
                <h3 className="text-lg font-semibold">{p.name.split(" — ")[0]}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.popular ? "Landing page, ASO, ads, tracking — the whole stack" : p.id === "pkg-start" ? "Fix what you already have" : "Own your category"}</p>
                <p className="mt-4 font-display text-3xl font-bold tracking-tight text-chrome-grad sm:text-4xl">{usd(p.price)}</p>
                <p className="mt-1 text-xs text-muted-foreground">one-time setup</p>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link to="/pricing" className="btn-chrome">
              See full pricing breakdown <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* DEVELOPER-SPECIFIC TRUST */}
      <section className="section border-t border-border" aria-labelledby="why-us">
        <div className="container-x">
          <h2 id="why-us" className="h-section">Why devs work with us</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { t: "We speak both languages", b: "Our founder writes code and runs ad campaigns. You won't have to explain what an API is." },
              { t: "No fluff, no buzzwords", b: "We don't say 'synergize your brand equity.' We say: here's the landing page, here's the ad, here's the cost per install." },
              { t: "We know where devs hang out", b: "Reddit, Hacker News, Product Hunt, Indie Hackers, Discord servers, dev Twitter. We've been there. We run campaigns there." },
              { t: "Tracking from day one", b: "GA4, Meta Pixel, Reddit Pixel, UTM parameters, server-side events — installed properly, not duct-taped." },
              { t: "You own everything", b: "Your ad accounts, your analytics, your website code. If you leave, it's all yours. No lock-in." },
              { t: "Real proof, not mockups", b: `${CLIENTS.length} live client sites, real ad dashboards and our own Stripe receipts. Scroll up.` },
            ].map((x) => (
              <li key={x.t} className="panel p-5">
                <Check className="h-5 w-5 text-turbo" aria-hidden />
                <h3 className="mt-3 font-display text-lg font-bold">{x.t}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{x.b}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <FAQList faqs={APP_MARKETING_FAQS} title="Questions devs ask us" />

      {/* BOOKING */}
      <BookingSection
        note="App marketing page"
        title="Get your app's growth plan. 6 taps, then a free call."
        prefill="I'm a software developer and need help marketing my app"
      />
    </>
  );
}
