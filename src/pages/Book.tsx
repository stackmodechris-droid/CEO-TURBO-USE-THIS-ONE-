// Ad landing page (Meta / instant-form thank-you screen) and the post-booking confirmation.
// Focus layout: no menu, no footer links — every click goes to the calendar.
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Check, X, CalendarCheck, Search, Target, FileText } from "lucide-react";
import { BOOKING, SITE } from "@/config/site";
import { BOOK_FAQS } from "@/content/faqs";
import { AD_TOTALS, money } from "@/content/results";
import { CLIENTS } from "@/content/clients";
import { BookingSection, BrandBoostSteps, Founder, VideoPitch } from "@/components/blocks/Sales";
import { ProofStats, AdResultsGrid, WorkGrid } from "@/components/blocks/Proof";
import { FAQList, SectionHeader } from "@/components/blocks/Basics";
import { BookButton, ShopCardsButton } from "@/components/cta/Actions";
import { trackBooked } from "@/lib/cal";

const SHOWCASE = ["mor-handy", "kingstone-landscaping", "bigzo"];

export default function Book() {
  return (
    <>
      <section className="relative overflow-hidden pt-24 sm:pt-32">
        <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 glow-ignite opacity-70" aria-hidden />
        <div className="container-x relative grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="hero-rise">
            <p className="chip">Free Brand Boost call · {BOOKING.length} · founder-led</p>
            <h1 className="mt-5 text-[38px] font-bold leading-[1.02] sm:text-6xl">
              <span className="text-chrome-grad">Want more customers, reviews or listeners</span> <span className="text-turbo-grad">in the next 30 days?</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Book a free 30-minute Brand Boost call. {SITE.founder.name} looks at your website, Google profile, reviews and ads with you — live — and hands you the fixes that will bring in the most customers fastest. Keep the plan either way.
            </p>
            <ul className="mt-6 grid max-w-xl gap-2.5 text-[15px] sm:grid-cols-2">
              {["No pitch deck, no pressure", "A fixed price if you want help", "Real results, real dashboards", "Video or phone — your choice"].map((t) => (
                <li key={t} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-turbo" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <BookButton note="Ad page hero" className="btn-shine !px-7 !py-4 !text-base">
                Pick my free call time
              </BookButton>
              <a href="#results" className="text-sm font-semibold text-turbo underline-offset-4 hover:underline">
                See the results first
              </a>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {AD_TOTALS.leads} Meta leads at {money(AD_TOTALS.avgCpl)} average · {CLIENTS.length} client sites live · Christopher runs every call himself, so weekly spots are limited
            </p>
          </div>
          <VideoPitch note="Ad page video" />
        </div>
        <div className="container-x relative mt-16">
          <ProofStats />
        </div>
      </section>

      <section className="section" aria-labelledby="get">
        <div className="container-x">
          <SectionHeader center title={<span id="get">What will you walk away with?</span>} lede="Thirty minutes. Three things you can act on the same day — with or without us." />
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              { icon: Search, title: "Where you're invisible", body: "How you show up on Google, Maps and social right now — and where customers are slipping to competitors." },
              { icon: Target, title: "Your #1 money move", body: "The single change that would bring in the most calls, sales or listeners fastest. Not a 40-item to-do list." },
              { icon: FileText, title: "A fixed-price plan", body: "If you want us to do it, a written scope and price. If not, you keep the plan and do it yourself." },
            ].map((c) => (
              <li key={c.title} className="panel p-6">
                <c.icon className="h-6 w-6 text-turbo" aria-hidden />
                <h3 className="mt-4 text-xl font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="results" className="section scroll-mt-20 border-t border-border" aria-labelledby="proof">
        <div className="container-x">
          <SectionHeader title={<span id="proof">Does this actually work?</span>} lede={`These are unedited Meta Ads Manager dashboards from client campaigns: ${AD_TOTALS.leads} leads for ${money(AD_TOTALS.leadSpend)} total.`} />
          <div className="mt-12">
            <AdResultsGrid keys={["ryan-pool", "stackmode-repair", "bigzo"]} />
          </div>
          <h3 className="mt-16 text-2xl font-bold">Sites we built that bring in customers</h3>
          <div className="mt-8">
            <WorkGrid clients={CLIENTS.filter((c) => SHOWCASE.includes(c.slug))} />
          </div>
          <div className="mt-12 text-center">
            <BookButton note="Ad page after proof">I want results like these</BookButton>
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="fit">
        <div className="container-x">
          <SectionHeader center title={<span id="fit">Is this call for you?</span>} lede="We keep calls for people we can actually help. Be honest with yourself here." />
          <div className="mx-auto mt-12 grid max-w-4xl gap-5 md:grid-cols-2">
            <div className="panel p-6">
              <p className="font-semibold text-turbo">Book if you are…</p>
              <ul className="mt-4 space-y-3 text-[15px]">
                {["A local business that wants more calls and 5-star reviews", "An artist who wants more listeners, fans or bookings", "A store owner who wants traffic that actually buys", "Ready to invest in growth once you see the plan"].map((t) => (
                  <li key={t} className="flex gap-3">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-turbo" aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="panel p-6">
              <p className="font-semibold text-muted-foreground">Probably not a fit if you…</p>
              <ul className="mt-4 space-y-3 text-[15px] text-muted-foreground">
                {["Want overnight results with zero budget", "Can't take on more customers right now", "Just want someone to agree with you"].map((t) => (
                  <li key={t} className="flex gap-3">
                    <X className="mt-0.5 h-5 w-5 shrink-0 opacity-60" aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="next">
        <div className="container-x">
          <SectionHeader title={<span id="next">What happens after you book?</span>} />
          <div className="mt-10">
            <BrandBoostSteps />
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-label="Founder">
        <div className="container-x">
          <Founder />
        </div>
      </section>

      <BookingSection note="Ad page — inline calendar" title="Pick your time. Spots open up weekly and go fast." />
      <FAQList faqs={BOOK_FAQS} title="Still on the fence?" />
    </>
  );
}

export function Booked() {
  useEffect(() => trackBooked("redirect"), []);
  return (
    <section className="relative overflow-hidden pb-24 pt-28 sm:pt-36">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[520px] w-[900px] -translate-x-1/2 glow-turbo opacity-70" aria-hidden />
      <div className="container-x relative max-w-2xl text-center">
        <CalendarCheck className="mx-auto h-14 w-14 text-turbo" aria-hidden />
        <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl">You're booked. Here's how to get the most from your call.</h1>
        <p className="mt-5 text-lg text-muted-foreground">Check your email for the calendar invite. To make the 30 minutes count:</p>
        <ol className="mx-auto mt-8 max-w-lg space-y-4 text-left">
          {[
            "Add the call to your calendar now and show up a minute early.",
            "Have your website, Google profile and social links handy.",
            "Know your number: how many more customers or listeners do you want a month?",
          ].map((t, i) => (
            <li key={t} className="panel flex gap-4 p-4">
              <span className="font-display text-xl font-bold text-turbo">{i + 1}</span>
              <span>{t}</span>
            </li>
          ))}
        </ol>
        <p className="mt-10 text-muted-foreground">While you wait — want more Google reviews right away?</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <ShopCardsButton />
          <Link to="/results" className="btn-chrome">
            See client results
          </Link>
        </div>
      </div>
    </section>
  );
}
