import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, MapPin, Smartphone, Star, X } from "lucide-react";
import { BuyBox } from "@/components/shop/BuyBox";
import { TapDemo } from "@/components/visuals/ReviewVisuals";
import { Breadcrumbs, FAQList, SectionHeader } from "@/components/blocks/Basics";
import { BookButton } from "@/components/cta/Actions";
import { COMPARE, RULES, SETUP_PATH, SHOP_FAQS, SHOP_PATH, USES } from "@/content/review-cards";
import { NFC_APP, fromPriceLabel } from "@/config/site";
import { recallBusiness } from "@/lib/review-link";

const STEPS = [
  { icon: Smartphone, title: "Customer taps", body: "They hold their phone near the card at checkout. No app, no camera, no searching." },
  { icon: Star, title: "Your review form opens", body: "Google's own “rate and review” screen for your business, ready for stars." },
  { icon: MapPin, title: "You climb the map", body: "More fresh reviews build trust with the next customer — and Google uses reviews in local ranking." },
];

export default function ReviewCards() {
  const [business, setBusiness] = useState("");
  useEffect(() => setBusiness((b) => b || recallBusiness()), []);

  return (
    <>
      <section className="relative overflow-clip pt-24 sm:pt-28">
        <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden />
        <div className="pointer-events-none absolute -top-40 right-0 h-[520px] w-[820px] glow-turbo" aria-hidden />
        <div className="container-x relative">
          <Breadcrumbs items={[{ name: "Google review cards", path: SHOP_PATH }]} />
          <BuyBox business={business} onBusiness={setBusiness} />
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="how">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader kicker="How it works" title={<span id="how">One tap. Five stars. Ten seconds.</span>} lede={`Here's exactly what your customer sees${business.trim() ? ` at ${business.trim()}` : ""} — the review form opens before the moment passes.`} />
            <ol className="mt-8 space-y-5">
              {STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-turbo/10 ring-1 ring-turbo/30">
                    <s.icon className="h-5 w-5 text-turbo" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-body text-lg font-semibold tracking-normal">
                      {i + 1}. {s.title}
                    </h3>
                    <p className="mt-1 leading-relaxed text-muted-foreground">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <a href="#buy" className="btn-ignite btn-shine mt-8">
              Get my review cards — from {fromPriceLabel}
            </a>
          </div>
          <TapDemo business={business} />
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="why">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end">
            <SectionHeader kicker="Why it matters" title={<span id="why">More reviews means more calls.</span>} />
            <p className="text-lg leading-relaxed text-muted-foreground">
              People compare star ratings and review counts before they pick who to call — and{" "}
              <a href="https://support.google.com/business/answer/7091" target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-4 hover:text-turbo">
                Google says
              </a>{" "}
              review count and score factor into local ranking. The problem isn't that customers won't review you. It's that nobody makes it easy at the right moment.
            </p>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-border sm:grid-cols-2 lg:grid-cols-3 sm:max-lg:[&>*:last-child:nth-child(odd)]:col-span-2 lg:[&>*:last-child:nth-child(3n+1)]:col-span-3 lg:[&>*:last-child:nth-child(3n+2)]:col-span-2">
            {USES.map((u) => (
              <div key={u.where} className="group bg-background p-6 transition-colors hover:bg-white/[0.025]">
                <p className="font-semibold">{u.where}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{u.why}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="compare">
        <div className="container-x">
          <SectionHeader title={<span id="compare">Tap card vs. just asking</span>} lede="Most customers mean it when they say they'll leave a review. The card closes the gap between meaning it and doing it." />
          <div className="mt-10 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-white/[0.02] text-muted-foreground">
                  <th className="px-5 py-4 font-medium" />
                  <th className="px-5 py-4 font-semibold text-foreground">Review tap card</th>
                  <th className="px-5 py-4 font-medium">“Please review us”</th>
                  <th className="px-5 py-4 font-medium">Paper QR sign</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map(([k, a, b, c]) => (
                  <tr key={k} className="border-b border-border/60 last:border-0">
                    <th scope="row" className="px-5 py-4 font-medium">
                      {k}
                    </th>
                    <td className="px-5 py-4 font-semibold text-turbo">{a}</td>
                    <td className="px-5 py-4 text-muted-foreground">{b}</td>
                    <td className="px-5 py-4 text-muted-foreground">{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="setup">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeader kicker="When it arrives" title={<span id="setup">Program it yourself in about 2 minutes.</span>} lede={`Copy your review link from Google Business Profile, open the free ${NFC_APP.name} app, write the link to the card. Our guide shows every tap — and checks your link for you.`} />
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={SETUP_PATH} className="btn-chrome">
                Open the setup guide <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
          <ol className="grid gap-3">
            {["Find your review link in Google Business Profile", `Download ${NFC_APP.name} (free, iPhone & Android)`, "Write → Add a record → URL → paste → hold the card to your phone", "Tap to test — then stick it by the register"].map((t, i) => (
              <li key={t} className="panel flex items-center gap-4 p-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-turbo/10 font-display text-sm font-bold text-turbo">{i + 1}</span>
                <span className="text-[15px]">{t}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="rules">
        <div className="container-x grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeader kicker="Play by Google's rules" title={<span id="rules">Reviews that stick.</span>} lede="Fake or incentivized reviews get removed — and can get a profile suspended. The card is built for the honest way to grow." />
          <ul className="grid gap-3">
            {RULES.map((r) => (
              <li key={r.text} className="flex items-start gap-3 rounded-2xl bg-white/[0.02] p-4 ring-1 ring-white/5">
                {r.ok ? <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" aria-label="Do" /> : <X className="mt-0.5 h-5 w-5 shrink-0 text-[#ff6b6b]" aria-label="Don't" />}
                <span className="text-[15px] leading-relaxed">{r.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="more">
        <div className="container-x">
          <div className="cta-glow relative overflow-hidden rounded-3xl p-7 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.3fr_auto] lg:items-center">
              <div>
                <p className="text-sm font-semibold text-[hsl(var(--ignite-hot))]">Reviews are step one</p>
                <h2 id="more" className="h-section mt-2">
                  Want the calls that come with them?
                </h2>
                <p className="lede">
                  We set up and optimize Google Business Profiles, build sites that turn searches into calls, and get you named in AI answers. See where you stand free, or talk it through with Christopher.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <BookButton note="Review cards — agency upsell" prefill="I bought / I'm looking at review cards and want help getting more customers from Google.">
                  Book a free growth call
                </BookButton>
                <Link to="/free-audit" className="btn-chrome">
                  Run my free visibility audit
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQList faqs={SHOP_FAQS} title="Review card questions" />

      <p className="container-x pb-10 text-xs leading-relaxed text-muted-foreground">
        Google and the Google logo are trademarks of Google LLC. CEO Turbo is not affiliated with, sponsored or endorsed by Google. The businesses that hand the card to every happy customer get the most reviews. See{" "}
        <Link to="/shipping-returns" className="underline underline-offset-2">
          shipping &amp; returns
        </Link>
        .
      </p>
    </>
  );
}
