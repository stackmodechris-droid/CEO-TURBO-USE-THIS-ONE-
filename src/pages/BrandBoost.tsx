import { BOOKING } from "@/config/site";
import { BOOK_FAQS } from "@/content/faqs";
import { AD_TOTALS, money } from "@/content/results";
import { CLIENTS } from "@/content/clients";
import { BookingSection, BrandBoostSteps, Founder, VideoPitch } from "@/components/blocks/Sales";
import { ProofStats } from "@/components/blocks/Proof";
import { Breadcrumbs, FAQList } from "@/components/blocks/Basics";
import { BookButton } from "@/components/cta/Actions";

export default function BrandBoost() {
  return (
    <>
      <section className="relative overflow-hidden pt-28 sm:pt-32">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[520px] w-[900px] -translate-x-1/2 glow-ignite opacity-70" aria-hidden />
        <div className="container-x relative">
          <Breadcrumbs items={[{ name: "Brand Boost call", path: "/brand-boost" }]} />
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="hero-rise max-w-3xl">
            <p className="chip">Free · {BOOKING.length} · video or phone</p>
            <h1 className="mt-5 text-4xl font-bold leading-[1.02] sm:text-6xl">Brand Boost: what's costing you customers — and how do you fix it?</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              We look at your website, Google profile, social profiles and ads with you, live, and show you the single change that would bring the most customers fastest. If you want us to do the work, you get a fixed price. If not, you keep the plan.
            </p>
            <div className="mt-8">
              <BookButton note="Brand Boost page hero">Choose a time</BookButton>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {CLIENTS.length} client sites live · {AD_TOTALS.leads} Meta leads at {money(AD_TOTALS.avgCpl)} average
            </p>
          </div>
          <VideoPitch note="Brand Boost page video" />
          </div>
        </div>
      </section>
      <BookingSection note="Brand Boost page" title="When works for you? Pick a time." />
      <section className="section border-t border-border">
        <div className="container-x">
          <h2 className="h-section">What happens after you book?</h2>
          <div className="mt-10">
            <BrandBoostSteps />
          </div>
          <div className="mt-14">
            <ProofStats />
          </div>
        </div>
      </section>
      <section className="section border-t border-border">
        <div className="container-x">
          <Founder />
        </div>
      </section>
      <FAQList faqs={BOOK_FAQS} title="Questions before you book?" />
    </>
  );
}
