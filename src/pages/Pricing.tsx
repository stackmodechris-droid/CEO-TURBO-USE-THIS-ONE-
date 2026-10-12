import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Info, Repeat, Wrench } from "lucide-react";
import { EXAMPLE_PLANS, MONTHLY, PRICING_FAQS, PRICING_TERMS, SETUP, WEBSITES, planTotals, price, usd } from "@/content/pricing";
import { PriceCard } from "@/components/blocks/PriceBlocks";
import { StripeProof } from "@/components/blocks/Proof";
import { STRIPE } from "@/content/results";
import { fromPriceLabel } from "@/config/site";
import { SHOP_PATH } from "@/content/review-cards";
import { BookingSection } from "@/components/blocks/Sales";
import { Breadcrumbs, DirectAnswer, FAQList, SectionHeader } from "@/components/blocks/Basics";
import { BookButton } from "@/components/cta/Actions";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

/** "What is one customer worth to you?" — shows how few extra customers cover a monthly plan. */
function PaybackCalculator() {
  const id = useId();
  const [worth, setWorth] = useState(300);
  const [planId, setPlanId] = useState("seo-local");
  const plan = MONTHLY.find((p) => p.id === planId)!;
  const customers = Math.max(1, Math.ceil(plan.price / Math.max(worth, 1)));
  const yearly = worth * 12 * Math.max(customers + 2, 4);
  return (
    <div className="audit-card rounded-3xl p-6 sm:p-8">
      <h2 className="font-display text-2xl font-bold sm:text-3xl">Is it worth it? Do the math in 10 seconds.</h2>
      <p className="mt-2 text-sm text-muted-foreground">Move the slider to what one new customer (or fan) is worth to you over time.</p>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor={`${id}-worth`} className="text-sm font-medium text-chrome">
            One customer is worth: <span className="font-display text-xl font-bold text-foreground">{usd(worth)}</span>
          </label>
          <input
            id={`${id}-worth`}
            type="range"
            min={50}
            max={5000}
            step={50}
            value={worth}
            onChange={(e) => setWorth(Number(e.target.value))}
            onPointerUp={() => track("pricing_calculator", { worth, plan: planId })}
            className="mt-3 w-full accent-[hsl(var(--ignite))]"
          />
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>$50</span>
            <span>$5,000</span>
          </div>
          <fieldset className="mt-5">
            <legend className="text-sm font-medium text-chrome">Monthly plan</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {MONTHLY.filter((p) => p.id !== "ads-additional").map((p) => (
                <button key={p.id} type="button" aria-pressed={planId === p.id} onClick={() => setPlanId(p.id)} className={cn("choice !px-3 !py-2 !text-xs", planId === p.id && "choice-on")}>
                  {p.name.replace(" (SEO, AEO & GEO)", "").replace(" — first platform", "")} · {usd(p.price)}
                </button>
              ))}
            </div>
          </fieldset>
        </div>
        <div className="grid content-center rounded-2xl bg-white/[0.03] p-6 text-center ring-1 ring-white/5" aria-live="polite">
          <p className="text-sm text-muted-foreground">{plan.name} pays for itself with</p>
          <p className="mt-2 font-display text-6xl font-bold text-turbo-grad">{customers}</p>
          <p className="mt-1 text-sm font-semibold">{customers === 1 ? "extra customer a month" : "extra customers a month"}</p>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            Everything after that is profit. Just {Math.max(customers + 2, 4)} extra customers a month is about <span className="font-semibold text-foreground">{usd(yearly)}</span> a year in new revenue.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Pricing() {
  return (
    <>
      <section className="relative overflow-hidden pt-28 sm:pt-32">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-[520px] w-[900px] -translate-x-1/2 glow-ignite opacity-60" aria-hidden />
        <div className="container-x relative">
          <Breadcrumbs items={[{ name: "Pricing", path: "/pricing" }]} />
          <SectionHeader as="h1" title={<>CEO Turbo pricing: clear prices, <span className="text-turbo-grad">pick only what you need</span></>} lede="Pay once to set things up properly. Pay monthly only for the work that has to keep happening — security updates, new content for Google and AI answers, ads and email. No contracts, no hidden fees." />
          <DirectAnswer label="Pricing at a glance">
            One-time setups: Google Business Profile {price("gbp-setup")}, social profiles {price("social-setup")}, SEO/AEO/GEO foundation {price("visibility-foundation")}, ads &amp; tracking {price("tracking-setup")}, email &amp; SMS {price("email-setup")}. Websites {price("site-artist")}–{price("site-shopify")}. Monthly: Website Care {price("website-care")}, SEO/AEO/GEO from {price("seo-local")}, ads management from {price("ads-management")}, email &amp; SMS {price("email-monthly")}. Review cards from {fromPriceLabel}.
          </DirectAnswer>
          <ul className="mt-8 grid gap-3 text-sm sm:grid-cols-3">
            {[
              { icon: Wrench, t: "Setup = one-time", b: "Built once, built right. You own it." },
              { icon: Repeat, t: "Monthly = ongoing work", b: "Only where work keeps paying off." },
              { icon: Info, t: "Ad spend is separate", b: "Paid by you, straight to the platform." },
            ].map((x) => (
              <li key={x.t} className="flex items-start gap-3 rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/5">
                <x.icon className="mt-0.5 h-5 w-5 shrink-0 text-turbo" aria-hidden />
                <span>
                  <span className="block font-semibold">{x.t}</span>
                  <span className="text-muted-foreground">{x.b}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="pt-16" aria-label="Payments to CEO Turbo">
        <div className="container-x">
          <StripeProof compact title="People pay CEO Turbo every week." lede={`Not a mockup — this is our own Stripe account: ${STRIPE.payments} successful payments in the last 12 months, up from ${STRIPE.paymentsBefore} the year before.`} />
        </div>
      </section>

      <section className="section" aria-labelledby="setup">
        <div className="container-x">
          <SectionHeader title={<span id="setup">One-time setup</span>} lede="Each is an add-on. Do one, or stack the ones you need." />
          <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {SETUP.map((p) => (
              <PriceCard key={p.id} p={p} />
            ))}
          </ul>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="sites">
        <div className="container-x">
          <SectionHeader title={<span id="sites">Websites</span>} lede="Fast, mobile-first and built to rank and convert. Add Website Care to keep it secure and up to date." />
          <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {WEBSITES.map((p) => (
              <PriceCard key={p.id} p={p} />
            ))}
          </ul>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="monthly">
        <div className="container-x">
          <SectionHeader title={<span id="monthly">Monthly plans</span>} lede="For the things that need constant work to keep bringing customers. Month to month — cancel with 30 days' notice." />
          <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {MONTHLY.map((p) => (
              <PriceCard key={p.id} p={p} />
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">{PRICING_TERMS.adSpend}</p>
        </div>
      </section>

      <section className="section border-t border-border">
        <div className="container-x">
          <PaybackCalculator />
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="plans">
        <div className="container-x">
          <SectionHeader title={<span id="plans">What does a typical plan cost?</span>} lede="Common combinations, so you can picture your budget. Your call tells you exactly which pieces you need — often fewer." />
          <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {EXAMPLE_PLANS.map((plan) => {
              const t = planTotals(plan.items);
              return (
                <li key={plan.name} className="panel flex flex-col p-6">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{plan.who}</p>
                  <ul className="mt-4 space-y-2 text-sm">
                    {t.items.map((i) => (
                      <li key={i.id} className="flex justify-between gap-3">
                        <span>{i.name.replace(" (SEO, AEO & GEO)", "")}</span>
                        <span className="whitespace-nowrap text-muted-foreground">
                          {usd(i.price)}
                          {i.billing === "month" ? "/mo" : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto border-t border-border pt-4">
                    <p className="text-sm">
                      <span className="font-display text-2xl font-bold">{usd(t.setup)}</span> <span className="text-muted-foreground">to set up</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-display text-2xl font-bold">{usd(t.monthly)}</span> <span className="text-muted-foreground">/month after</span>
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <BookButton note="Pricing — plans">Get my plan &amp; exact price</BookButton>
            <Link to={SHOP_PATH} className="btn-chrome">
              Just want reviews? Cards from {fromPriceLabel}
            </Link>
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="terms">
        <div className="container-x max-w-4xl">
          <SectionHeader title={<span id="terms">The fine print, in plain English</span>} />
          <ul className="mt-8 space-y-4">
            {Object.values(PRICING_TERMS).map((t) => (
              <li key={t} className="flex gap-3 text-[15px] leading-relaxed">
                <Check className="mt-1 h-5 w-5 shrink-0 text-turbo" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FAQList faqs={PRICING_FAQS} title="Pricing questions" />
      <BookingSection note="Pricing page" title="Not sure what you need? Get your plan in 30 seconds." />
    </>
  );
}
