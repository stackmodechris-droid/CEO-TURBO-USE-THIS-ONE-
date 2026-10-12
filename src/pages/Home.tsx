import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { BookButton } from "@/components/cta/Actions";
import { AuditHero } from "@/components/audit/AuditHero";
import { SiteWall } from "@/components/visuals/SiteWall";
import { SearchScene } from "@/components/visuals/Scenes";
import { ProofStats, StripeProof, FeaturedResult, WorkGrid, AdResultsGrid, AdGallery, GSCProof } from "@/components/blocks/Proof";
import { PathPicker, ServiceGrid, ReviewCardPromo, BrandBoostSteps, Founder, BookingSection, VideoPitch } from "@/components/blocks/Sales";
import { SectionHeader, FAQList } from "@/components/blocks/Basics";
import { HOME_FAQS } from "@/content/faqs";
import { ADS } from "@/content/ads";
import { AD_TOTALS, money } from "@/content/results";
import { CLIENTS } from "@/content/clients";

export default function Home() {
  return (
    <>
      {/* HERO — brand promise first; the free check is the zero-risk first step, the call is the money step. */}
      <AuditHero
        source="Home hero"
        eyebrow="CEO Turbo · Review products + growth for businesses & artists"
        title={
          <>
            <span className="text-chrome-grad">We will help you get more customers,</span> <span className="text-turbo-grad">more reviews &amp; more listeners.</span>
          </>
        }
        lede="Websites, ads, Google profiles and tap-to-review cards that turn strangers into paying customers and fans. Start free: see exactly how people find you — and where you're losing them — in 60 seconds."
        points={[
          <><span className="font-semibold">Free check:</span> <span className="text-muted-foreground">how you show up on Google &amp; Maps</span></>,
          <><span className="font-semibold">Brand Boost:</span> <span className="text-muted-foreground">a free 30-min call and a fixed plan</span></>,
          <><span className="font-semibold">Review cards:</span> <span className="text-muted-foreground">one tap = one Google review</span></>,
          <><span className="font-semibold">Real proof:</span> <span className="text-muted-foreground">{AD_TOTALS.leads} leads at {money(AD_TOTALS.avgCpl)} each</span></>,
        ]}
        footer={
          <>
            {CLIENTS.length} client sites live · founder-led ·{" "}
            <BookButton variant="link" note="Home hero — skip audit" className="!inline">
              or book your free Brand Boost call
            </BookButton>
          </>
        }
      />
      <div className="relative mt-14 sm:mt-16">
        <SiteWall />
      </div>

      <section className="pb-8" aria-label="Results at a glance">
        <div className="container-x">
          <ProofStats />
        </div>
      </section>

      <section className="pb-16" aria-label="Payments to CEO Turbo">
        <div className="container-x">
          <StripeProof compact />
        </div>
      </section>

      <section className="pb-16" aria-label="Featured client result">
        <div className="container-x">
          <FeaturedResult />
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="why">
        <div className="container-x grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHeader
              kicker="Watch first · 82 seconds"
              title={<span id="why">Why aren't more customers finding you?</span>}
              lede="It's rarely your work. It's that people search, compare and decide before they ever call — and if your site, Google profile and reviews don't win that moment, the business down the street does. Christopher explains how to fix it in 2026."
            />
            <ul className="mt-6 space-y-3 text-[15px]">
              {["Show up when people search for what you do", "Look like the obvious choice once they find you", "Turn that attention into calls, sales and fans"].map((t) => (
                <li key={t} className="flex gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-turbo" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <BookButton note="Home video section">Get my free Brand Boost call</BookButton>
              <Link to="/brand-boost" className="inline-flex min-h-[44px] items-center text-sm font-semibold text-turbo underline-offset-4 hover:underline">
                What happens on the call?
              </Link>
            </div>
          </div>
          <VideoPitch note="Home video" />
        </div>
      </section>

      <section className="section" aria-labelledby="who">
        <div className="container-x">
          <SectionHeader title={<span id="who">Are you an artist, a local business or an online store?</span>} lede="An artist, a plumber and a Shopify store need different things. Pick yours and see exactly what we'd do — and the work we've already done for people like you." />
          <div className="mt-12">
            <PathPicker />
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-label="Google review cards">
        <div className="container-x">
          <ReviewCardPromo title="Want more 5-star Google reviews without asking twice?" />
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="work">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeader title={<span id="work">Want proof? Here are {CLIENTS.length} live sites we built.</span>} lede="Every screenshot below is a real client site we designed and built. Each case study shows the decisions that make it convert." />
            <Link to="/portfolio" className="btn-chrome shrink-0">
              See all {CLIENTS.length} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-12">
            <WorkGrid limit={6} clients={[...CLIENTS].sort((a, b) => order(a.slug) - order(b.slug))} />
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="ads">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeader
              title={<span id="ads">What if every lead cost you about {money(AD_TOTALS.avgCpl)}?</span>}
              lede={`${AD_TOTALS.leads} leads across ${AD_TOTALS.campaigns} Meta campaigns for ${money(AD_TOTALS.leadSpend)} total — ${money(AD_TOTALS.avgCpl)} a lead on average. These are the unedited dashboards.`}
            />
            <Link to="/results" className="btn-chrome shrink-0">
              All results <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-12">
            <AdResultsGrid keys={["ryan-pool", "stackmode-repair", "bigzo"]} />
          </div>
          <h3 className="mt-20 text-2xl font-bold">The creatives behind them</h3>
          <p className="mt-2 max-w-2xl text-muted-foreground">Designed in-house for each client: one hook, one offer, one action.</p>
          <div className="mt-8">
            <AdGallery ads={ADS.slice(0, 8)} />
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="ai">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader
              title={<span id="ai">Can customers find you on Google — and in ChatGPT?</span>}
              lede="Your buyers now ask ChatGPT, Perplexity and Google's AI Overviews who to hire. SEO gets you ranked, AEO gets your answer quoted, GEO gets you trusted enough to be named. We do all three."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/services/seo-aeo-geo" className="btn-chrome">
                How SEO, AEO &amp; GEO work
              </Link>
              <Link to="/guides/seo-vs-aeo-vs-geo" className="inline-flex items-center gap-1.5 px-2 py-3 text-sm font-semibold text-turbo">
                Read the plain-English guide <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <SearchScene className="h-auto w-full" />
        </div>
        <div className="container-x mt-14">
          <GSCProof />
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="services">
        <div className="container-x">
          <SectionHeader title={<span id="services">What do you need help with first?</span>} lede="Use one service or all of them. On the Brand Boost call we'll tell you which one moves the needle first." />
          <div className="mt-12">
            <ServiceGrid />
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="how">
        <div className="container-x">
          <SectionHeader title={<span id="how">How does the Brand Boost work?</span>} lede="Three steps, and the first one is free. Most people know their next move by the end of the call." />
          <div className="mt-12">
            <BrandBoostSteps />
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-label="Founder">
        <div className="container-x">
          <Founder />
        </div>
      </section>

      <FAQList faqs={HOME_FAQS} title="Questions before you book?" />
      <BookingSection note="Home — booking section" title="Ready to get more customers this month? Pick a time." />
    </>
  );
}

// Lead the homepage grid with the strongest, most varied work.
const FEATURED = ["mor-handy", "7uvhavin", "beyond-labels-gifts", "phoenix-freedom-firearms", "bigzo", "kingstone-landscaping"];
const order = (slug: string) => {
  const i = FEATURED.indexOf(slug);
  return i === -1 ? 99 : i;
};
