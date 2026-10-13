// /app-marketing: landing page for software developers (Reddit, Hacker News and search traffic).
// Focus layout (no nav/footer links, see Layout.tsx FOCUS_PATHS) because this is an ad destination: one job, one form.
import { ArrowRight, Check, Code2, Search, Megaphone, BarChart3, Rocket, Store, X } from "lucide-react";
import { Link } from "react-router-dom";
import { CallLink } from "@/components/site/CallLink";
import { ProofStats, StripeProof } from "@/components/blocks/Proof";
import { FAQList } from "@/components/blocks/Basics";
import { DevIntake } from "@/components/dev/DevIntake";
import { PACKAGES, usd } from "@/content/pricing";
import { DEV_PAINS, DEV_STEPS, DEV_SERVICES, DEV_WONT, DEV_FAQS, DEV_VIDEO } from "@/content/app-marketing";
import { SITE } from "@/config/site";
import { cn } from "@/lib/utils";

const SERVICE_ICONS = [Code2, BarChart3, Megaphone, Search, Rocket, Store] as const;

export default function AppMarketing() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-clip pt-24 sm:pt-28" aria-label="Marketing for software developers">
        <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 glow-turbo" aria-hidden />
        <div className="container-x relative">
          <div className="hero-rise relative z-10 grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="chip">For indie devs and small teams</p>
              <h1 className="mt-5 text-[34px] font-bold leading-[1.02] sm:text-5xl lg:text-[60px]">
                <span className="text-chrome-grad">You shipped it.</span> <span className="text-turbo-grad">Now get it installed.</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Distribution is a different stack from the one you write in. We handle the landing page, the tracking, the ads and the launch plan, so you can keep shipping. Plain talk, real numbers, no growth-hacking cringe.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a href="#intake" className="btn-ignite btn-shine w-full sm:w-auto">
                  Get my free growth plan <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
                <CallLink location="app marketing hero" icon className="min-h-[44px] items-center text-sm font-semibold text-chrome transition-colors hover:text-foreground" />
              </div>
              <ul className="mt-6 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                {["Tracking installed before any ad spend", "You own your ad accounts and analytics", "Weekly reports on cost per install", "No fake reviews, no bots, no lock-in"].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-none text-turbo" aria-hidden /> {t}
                  </li>
                ))}
              </ul>
            </div>
            <figure className="mx-auto w-full max-w-[360px] lg:max-w-none">
              <img
                src="/img/devs/more-installs.webp"
                srcSet="/img/devs/more-installs-560.webp 560w, /img/devs/more-installs.webp 1000w"
                sizes="(min-width: 1024px) 380px, 90vw"
                width={1000}
                height={1250}
                alt="Cartoon of two ticket windows. The dev who posts once has one person in line. The dev with CEO Turbo has a huge queue. Headline: More users. More installs."
                className="w-full rounded-2xl border border-border bg-[#f1ead5] shadow-2xl"
                {...({ fetchpriority: "high" } as Record<string, string>)}
                decoding="async"
              />
              <figcaption className="mt-2 text-center text-xs text-muted-foreground">A joke, but the point is real: one post is not a distribution channel.</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* WHY IT STALLS */}
      <section className="section" aria-labelledby="pains">
        <div className="container-x">
          <h2 id="pains" className="h-section text-center">Why good apps stall at a handful of users</h2>
          <p className="lede mx-auto mt-4 text-center">It's rarely the code. It's distribution, measurement and message, and all three are fixable.</p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {DEV_PAINS.map((p) => (
              <li key={p.title} className="panel p-5 sm:p-6">
                <h3 className="text-lg font-semibold sm:text-xl">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 27-SECOND EXPLAINER (loads on tap, captions are burned in so it works muted) */}
      <section className="pb-4" aria-label="27-second explainer">
        <div className="container-x">
          <figure className="mx-auto w-full max-w-[420px]">
            <video
              controls
              playsInline
              preload="none"
              poster={DEV_VIDEO.poster}
              width={DEV_VIDEO.width}
              height={DEV_VIDEO.height}
              className="w-full rounded-2xl border border-border bg-[#f1ead5]"
              aria-label={DEV_VIDEO.title}
            >
              <source src={DEV_VIDEO.src} type="video/mp4" />
            </video>
            <figcaption className="mt-2 text-center text-xs text-muted-foreground">27 seconds. Illustration, not real data.</figcaption>
          </figure>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section border-t border-border" aria-labelledby="how">
        <div className="container-x">
          <p className="text-sm font-medium text-turbo">How it works</p>
          <h2 id="how" className="h-section mt-2">
            Measure first. <span className="text-turbo-grad">Then spend.</span>
          </h2>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DEV_STEPS.map((s) => (
              <li key={s.n} className="panel p-5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-turbo font-display text-base font-bold text-background">{s.n}</span>
                <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="section border-t border-border" aria-labelledby="services">
        <div className="container-x">
          <h2 id="services" className="h-section">
            You write the code. <span className="text-turbo-grad">We do the distribution.</span>
          </h2>
          <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl bg-border sm:grid-cols-2 lg:grid-cols-3">
            {DEV_SERVICES.map((s, i) => {
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
        </div>
      </section>

      {/* WHO'S BEHIND IT + WHAT WE WON'T DO */}
      <section className="section border-t border-border" aria-labelledby="why-us">
        <div className="container-x grid gap-8 lg:grid-cols-2">
          <div>
            <h2 id="why-us" className="h-section">Built by someone who ships</h2>
            <p className="lede">
              {SITE.founder.name} builds software and websites himself. He made{" "}
              <a href="https://stackmode.net" className="font-semibold text-turbo underline-offset-4 hover:underline" rel="noopener">StackFinder</a>, launched free software of his own, and has built sites that rank on page one for the searches their owners care about. So when we say "set up tracking" or "write the creative", it's from having done it for products like yours.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              The ad results below are from small businesses and an artist, not app installs. Same machinery: creative, tracking and weekly optimization. We'll show you what we'd expect for your product on the call, and we won't invent numbers.
            </p>
            <Link to="/results" className="mt-5 inline-flex min-h-[44px] items-center gap-1.5 font-semibold text-turbo underline-offset-4 hover:underline">
              See the dashboards <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <div className="panel p-5 sm:p-6">
            <h3 className="font-display text-xl font-bold">What we won't do</h3>
            <ul className="mt-4 space-y-3">
              {DEV_WONT.map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
                  <X className="mt-0.5 h-4 w-4 flex-none text-[#ff8080]" aria-hidden /> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* PROOF */}
      <section className="pb-8" aria-label="Results at a glance">
        <div className="container-x">
          <ProofStats />
        </div>
      </section>
      <section className="pb-12 sm:pb-16" aria-label="Payments to CEO Turbo">
        <div className="container-x">
          <StripeProof compact title="The receipts are real." lede="This is CEO Turbo's own Stripe: what businesses and creators paid us. People don't keep paying for something that doesn't work." />
        </div>
      </section>

      {/* PRICING */}
      <section className="section border-t border-border" aria-labelledby="pricing">
        <div className="container-x">
          <h2 id="pricing" className="h-section">Published prices. No "let's hop on a call to discuss."</h2>
          <p className="lede">One setup fee builds the foundation. Ad spend is separate and paid by you, straight to the platforms. Store-listing work is scoped on the call.</p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-3">
            {PACKAGES.map((p) => (
              <li key={p.id} className={cn("panel flex flex-col p-5 sm:p-6", p.popular && "ring-1 ring-turbo/60")}>
                {p.popular && <span className="mb-3 inline-flex w-fit rounded-full bg-turbo px-3 py-1 text-xs font-bold text-background">Most complete</span>}
                <h3 className="text-lg font-semibold">{p.name.split(" — ")[0]}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.summary}</p>
                <p className="mt-4 font-display text-3xl font-bold tracking-tight text-chrome-grad sm:text-4xl">{usd(p.price)}</p>
                <p className="mt-1 text-xs text-muted-foreground">one-time setup</p>
              </li>
            ))}
          </ul>
          <Link to="/pricing" className="btn-chrome mt-6">
            See the full breakdown <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>

      {/* INTAKE */}
      <section id="intake" className="section border-t border-border scroll-mt-20" aria-labelledby="intake-title">
        <div className="container-x mx-auto max-w-3xl">
          <h2 id="intake-title" className="h-section">Get your free growth plan</h2>
          <p className="lede">Five quick answers, then a free 30-minute call. I'll read them first, so we spend the time on your app.</p>
          <div className="mt-8">
            <DevIntake />
          </div>
        </div>
      </section>

      <FAQList faqs={DEV_FAQS} title="Questions devs ask us" />
    </>
  );
}
