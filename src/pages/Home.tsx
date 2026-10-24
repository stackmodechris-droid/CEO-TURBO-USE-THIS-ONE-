import { Link } from "react-router-dom";
import { ArrowRight, Check, Laptop, MapPin, Megaphone, Phone, PhoneCall, Search, BarChart3, Star } from "lucide-react";
import { BookButton } from "@/components/cta/Actions";
import { CallLink } from "@/components/site/CallLink";
import { ProofStats, WorkGrid, StripeProof, FeaturedResult, AdResultsGrid, GoogleAdProof } from "@/components/blocks/Proof";
import { Founder, BookingSection, VideoPitch } from "@/components/blocks/Sales";
import { SectionHeader, FAQList } from "@/components/blocks/Basics";
import { HOME_FAQS } from "@/content/faqs";
import { CLIENTS } from "@/content/clients";
import { price } from "@/content/pricing";
import { SITE } from "@/config/site";
import { ReviewDuo } from "@/components/blocks/ReviewDuo";

/**
 * Money model, top to bottom:
 * 1. One offer — Google Ads that make the phone ring for local service businesses — backed by real dashboards.
 * 2. One action — the free 30-minute call (calendar opens in one tap), with the phone as the backup.
 * Review cards are a small add-on near the bottom; they have their own store and ad pages.
 */
export default function Home() {
  return (
    <>
      <div className="theme-soft">
      {/* HERO — who it's for, what they get, one button. */}
      <section className="relative overflow-clip pt-24 sm:pt-28 lg:pt-32" aria-labelledby="hero">
        <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 glow-turbo" aria-hidden />
        <div className="container-x relative grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-12">
          <div className="hero-rise relative z-10 min-w-0">
            <p className="chip">For local service businesses</p>
            <h1 id="hero" className="mt-4 text-[34px] font-bold leading-[1.05] sm:mt-5 sm:text-5xl md:text-6xl lg:text-[60px]">
              <span className="text-chrome-grad">More calls and bookings</span> <span className="text-turbo-grad">for your business.</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:mt-5 sm:text-lg">
              We run your Google, Microsoft and Meta ads, set up your Google Business Profile and social media, and track every call and booking.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <BookButton className="btn-shine" note="Home hero — ads call">
                Book my free 30-min call <ArrowRight className="h-4 w-4" aria-hidden />
              </BookButton>
              <CallLink location="home hero" className="btn-chrome">
                <Phone className="h-4 w-4" aria-hidden /> Call {SITE.phone.display}
              </CallLink>
            </div>
            <ul className="mt-6 grid max-w-xl grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground">
              {["No long-term contracts", "You own the ad account", "Every call & form tracked", "Founder-run, Atlanta-based"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-turbo" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0">
            <GoogleAdProof compact />
          </div>
        </div>
      </section>

      <section className="pt-14 pb-8" aria-label="Results at a glance">
        <div className="container-x">
          <ProofStats />
        </div>
      </section>

      {/* WHAT YOU GET — three things, then the price so it's never a mystery. */}
      <section className="section border-t border-border" aria-labelledby="get">
        <div className="container-x">
          <SectionHeader
            kicker="What we do for you"
            title={<span id="get">Everything that makes your phone ring, done for you.</span>}
            lede="People search, scroll and compare before they call. We put you in front of them on Google, Bing, Facebook and Instagram, and count every call and booking."
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Search, t: "Google Ads", b: "Search ads for people who need you today, with junk searches blocked.", to: "/services/google-ads" },
              { icon: BarChart3, t: "Microsoft Ads", b: "Bing and Microsoft search: cheaper clicks, many business owners.", to: "/services/google-ads" },
              { icon: Megaphone, t: "Meta Ads", b: "Facebook and Instagram lead ads with real-time leads to your phone.", to: "/services/meta-ads" },
              { icon: MapPin, t: "Google Business Profile", b: "Set up and optimized so you show up in Google Maps.", to: "/services/google-business-profile" },
              { icon: Laptop, t: "Office setup", b: "We set up your computers, Wi-Fi, desk and cameras so the workspace just works.", to: "/services/home-office-setup" },
              { icon: PhoneCall, t: "Social media", b: "Profiles cleaned up so people who check you out call you.", to: "/services/social-media-optimization" },
            ].map((x) => (
              <li key={x.t}>
                <Link to={x.to} className="panel block h-full p-5 transition hover:ring-1 hover:ring-turbo/40">
                  <x.icon className="h-5 w-5 text-turbo" aria-hidden />
                  <h3 className="mt-3 font-display text-lg font-bold">{x.t}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{x.b}</p>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-2xl text-sm text-muted-foreground">
            Setup from <span className="font-semibold text-foreground">{price("pkg-start")}</span>, then ads management from <span className="font-semibold text-foreground">{price("growth")}/mo</span>. Your ad spend goes straight to Google from your own card. No long-term contract.{" "}
            <Link to="/pricing" className="font-semibold text-turbo underline-offset-4 hover:underline">
              See all prices
            </Link>
          </p>
          <div className="mt-6">
            <BookButton note="Home — what you get">Book my free 30-min call</BookButton>
          </div>
        </div>
      </section>

      <ReviewDuo />

      {/* HOW IT WORKS — low effort for the owner. */}
      <section className="section border-t border-border" aria-labelledby="how">
        <div className="container-x">
          <SectionHeader title={<span id="how">How it works</span>} lede="You keep running your business. We handle the ads." />
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { t: "Free 30-minute call", b: `${SITE.founder.name} looks at your Google profile, website and any ads you're running, and tells you what would bring in calls. No pressure.` },
              { t: "We build and track it", b: "We set up the search campaign and the call and form tracking in your own Google Ads account." },
              { t: "Your phone rings", b: "Leads come to you directly. We tune the ads every week and show you the spend, the calls and what's next." },
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

      {/* PROOF — only real numbers and real work. */}
      <section className="section border-t border-border" aria-labelledby="proof">
        <div className="container-x">
          <SectionHeader title={<span id="proof">Real results from real service businesses.</span>} lede="Unedited Google Ads, Meta Ads Manager and Stripe screenshots." />
          <div className="mt-10">
            <GoogleAdProof />
          </div>
          <div className="mt-12">
            <FeaturedResult />
          </div>
          <div className="mt-12">
            <AdResultsGrid keys={["mor-handy-carpet", "stackmode-repair", "ryan-pool"]} />
          </div>
          <div className="mt-12">
            <StripeProof compact />
          </div>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <BookButton note="Home — after proof">I want results like these</BookButton>
            <Link to="/results" className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-turbo underline-offset-4 hover:underline">
              All results <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* VIDEO + FOUNDER — a real person, not a faceless agency. */}
      <section className="section border-t border-border" aria-labelledby="why">
        <div className="container-x grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHeader kicker="Watch first · 82 seconds" title={<span id="why">Why aren't more customers calling you?</span>} lede="People search, compare and decide before they ever call. If you're not at the top when they search, the business down the street gets the job. Christopher explains how to fix it." />
            <div className="mt-8">
              <BookButton note="Home video section">Book my free 30-min call</BookButton>
            </div>
          </div>
          <VideoPitch note="Home video" />
        </div>
      </section>

      <section className="section border-t border-border" aria-label="Founder">
        <div className="container-x">
          <Founder />
        </div>
      </section>

      <section className="section border-t border-border" aria-label="Client websites we built">
        <div className="container-x">
          <WorkGrid limit={6} clients={[...CLIENTS].sort((a, b) => order(a.slug) - order(b.slug))} />
        </div>
      </section>

      </div>

      {/* FINAL CTA */}
      <section className="section border-t border-border" aria-labelledby="final">
        <div className="container-x">
          <div className="cta-glow rounded-3xl p-8 text-center sm:p-12">
            <Star className="mx-auto h-8 w-8 text-turbo" aria-hidden />
            <h2 id="final" className="h-section mt-3">Every day you're not at the top of Google, the shop down the street gets your call.</h2>
            <p className="lede mx-auto max-w-2xl">Book a free 30-minute call. You'll leave with a clear plan, whether you hire us or not.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <BookButton note="Home — final CTA" className="btn-shine">
                Book my free 30-min call
              </BookButton>
              <CallLink location="home final CTA" className="btn-chrome">
                <Phone className="h-4 w-4" aria-hidden /> Call {SITE.phone.display}
              </CallLink>
            </div>
          </div>
        </div>
      </section>

      <div className="theme-soft">
      <FAQList faqs={HOME_FAQS} title="Questions before you call?" />
      <BookingSection note="Home — booking section" title="Want more calls and bookings? Pick a time." />
      </div>
    </>
  );
}

// Lead the homepage grid with the strongest, most varied work.
const FEATURED = ["mor-handy", "7uvhavin", "beyond-labels-gifts", "oj-junk-removal", "bigzo", "kingstone-landscaping"];
const order = (slug: string) => {
  const i = FEATURED.indexOf(slug);
  return i === -1 ? 99 : i;
};
