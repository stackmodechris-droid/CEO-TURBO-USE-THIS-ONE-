// Ad landing page (Meta / instant-form thank-you screen) and the post-booking confirmation.
// Focus layout: no menu, no footer links — every click goes to the calendar.
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CalendarCheck } from "lucide-react";
import { SITE } from "@/config/site";
import { BOOK_FAQS } from "@/content/faqs";
import { AD_TOTALS, money } from "@/content/results";
import { CLIENTS } from "@/content/clients";
import { BrandBoostSteps, Founder, VideoPitch } from "@/components/blocks/Sales";
import { AdResultsGrid, StripeProof, WorkGrid } from "@/components/blocks/Proof";
import { FAQList, SectionHeader } from "@/components/blocks/Basics";
import { BoostHero, FitCheck, PriceTeaser, WalkAway } from "@/components/blocks/Boost";
import { BookButton, ShopCardsButton } from "@/components/cta/Actions";
import { trackBooked } from "@/lib/track";

const SHOWCASE = ["mor-handy", "kingstone-landscaping", "bigzo"];
const SOURCE = "Ad page";

export default function Book() {
  return (
    <>
      <BoostHero
        source={SOURCE}
        title={
          <>
            <span className="text-chrome-grad">Want more customers, reviews or listeners</span> <span className="text-turbo-grad">in the next 30 days?</span>
          </>
        }
        lede={
          <>
            Answer 6 quick questions and see your #1 money move instantly.<span className="hidden sm:inline"> Then grab a free 30-minute call — {SITE.founder.name} looks at your website, Google profile, reviews and ads with you, live.</span>
          </>
        }
      />

      <WalkAway />

      <section className="pb-16" aria-label="Payments to CEO Turbo">
        <div className="container-x">
          <StripeProof compact />
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
            <BookButton note="Ad page after proof" className="btn-shine">
              I want results like these
            </BookButton>
          </div>
        </div>
      </section>

      <FitCheck />

      <section className="section border-t border-border" aria-labelledby="next">
        <div className="container-x">
          <SectionHeader title={<span id="next">What happens after you book?</span>} />
          <div className="mt-10">
            <BrandBoostSteps />
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-label="Founder">
        <div className="container-x grid items-center gap-10 md:grid-cols-[auto_1fr]">
          <VideoPitch note="Ad page video" />
          <Founder />
        </div>
      </section>

      <PriceTeaser source={SOURCE} />
      <FAQList faqs={BOOK_FAQS} title="Still on the fence?" />

      <section className="section pt-0">
        <div className="container-x">
          <div className="cta-glow rounded-3xl p-8 text-center sm:p-12">
            <h2 className="h-section">Your plan is 30 seconds away.</h2>
            <p className="lede mx-auto">Five taps, your #1 money move, then a time that suits you.</p>
            <BookButton note="Ad page — final CTA" className="btn-shine mt-8 !px-8 !py-4 !text-base">
              Start my free plan
            </BookButton>
          </div>
        </div>
      </section>
    </>
  );
}

export function Booked() {
  // Cal.com → event → Advanced → "Redirect on booking" to https://www.ceoturbo.com/booked with
  // "Forward parameters" on, so the booking uid (dedup with the server-side event) and email arrive here.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const uid = q.get("uid") || q.get("bookingUid") || undefined;
    const email = q.get("email") || undefined;
    const name = q.get("name") || undefined;
    trackBooked("redirect", uid, email ? { email, name } : undefined);
    if (q.toString()) window.history.replaceState(null, "", window.location.pathname);
  }, []);
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
