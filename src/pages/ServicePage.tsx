import { Breadcrumbs, DirectAnswer, FAQList, SectionHeader } from "@/components/blocks/Basics";
import { OfficeIntake } from "@/components/blocks/OfficeIntake";
import { PriceBox } from "@/components/blocks/PriceBlocks";
import { AdGallery, AdResultsGrid, WorkGrid } from "@/components/blocks/Proof";
import { Reveal } from "@/components/blocks/Reveal";
import { BookingSection, ReviewCardPromo, ServiceGrid } from "@/components/blocks/Sales";
import { BookButton } from "@/components/cta/Actions";
import { SCENES, SearchScene } from "@/components/visuals/Scenes";
import { SITE } from "@/config/site";
import { ADS } from "@/content/ads";
import { AUDIENCES } from "@/content/audiences";
import { clientBySlug } from "@/content/clients";
import { priceLabel, pricesFor } from "@/content/pricing";
import { SETUP_AREAS } from "@/content/service-areas";
import { CALL_FIRST_SLUGS, serviceBySlug, SERVICES } from "@/content/services";
import { Check, MessageSquare, Phone, X } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import NotFound from "./NotFound";

const CAL_URL = "https://cal.com/stackmodechris/ceo-turbo-office-studio-setup";

export default function ServicePage() {
  const { slug = "" } = useParams();
  const s = serviceBySlug(slug);
  if (!s) return <NotFound />;

  const path = `/services/${s.slug}`;
  const work = (s.proof?.clientSlugs ?? []).map(clientBySlug).filter((c): c is NonNullable<typeof c> => Boolean(c));
  const isAds = ["meta-ads", "google-ads", "tiktok-ads", "x-ads"].includes(s.slug);
  const isHomeOffice = CALL_FIRST_SLUGS.includes(s.slug);
  const isOfficeTransform = s.slug === "office-transformation";
  const showCal = isHomeOffice && s.slug !== "home-office-setup";
  const calLink = (loc: string, cls: string) => (
    <a href={CAL_URL} target="_blank" rel="noopener noreferrer" data-cal-location={`${s.slug}-${loc}`} className={cls}>
      Book online
    </a>
  );
  const Scene = s.slug === "seo-aeo-geo" ? SearchScene : s.slug === "google-business-profile" ? SCENES.local : s.slug === "email-marketing" || s.slug === "tiktok-ads" ? SCENES.shopify : s.slug === "social-media-optimization" || s.slug === "x-ads" ? SCENES.artist : SearchScene;
  const note = `Service: ${s.name}`;
  const prefill = `Interested in ${s.name}.`;
  const prices = pricesFor(s.slug);

  return (
    <>
      <section className="relative overflow-hidden pt-28 sm:pt-32">
        <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden />
        <div className="pointer-events-none absolute -top-32 left-0 h-[520px] w-[820px] glow-turbo" aria-hidden />
        <div className="container-x relative">
          <Breadcrumbs items={[{ name: "Services", path: "/services" }, { name: s.name, path }]} />
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="hero-rise">
              <p className="chip">{s.outcome}</p>
              <h1 className="mt-5 text-4xl font-bold leading-[1.02] sm:text-6xl">{s.h1}</h1>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {isHomeOffice || isOfficeTransform ? (
                  <>
                    <a href={SITE.phone.href} data-call-location={`${s.slug}-hero`} className="btn-ignite flex items-center justify-center gap-2">
                      <Phone className="h-4 w-4" />
                      Call {SITE.phone.display}
                    </a>
                    <a href={`sms:${SITE.phone.e164}?&body=${encodeURIComponent(isOfficeTransform ? "Hi, I'd like a quote for an office build-out." : `Hi, I'd like a quote for ${s.short.toLowerCase()}.`)}`} data-call-location={`${s.slug}-hero-text`} className="btn-chrome flex items-center justify-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Text for a quote
                    </a>
                    {showCal && calLink("hero", "btn-chrome flex items-center justify-center gap-2")}
                  </>
                ) : (
                  <BookButton note={note} prefill={prefill}>Book a free call about {s.short}</BookButton>
                )}
                <a href="#included" className="btn-chrome">
                  What's included
                </a>
              </div>
            </div>
            {isHomeOffice ? <OfficeIntake service={s.slug} /> : <Scene className="h-auto w-full" />}
          </div>
          <DirectAnswer label={`What is ${s.short}?`}>{s.answer}</DirectAnswer>
        </div>
      </section>

      <section id="included" className="section" aria-labelledby="included-title">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div>
            <h2 id="included-title" className="h-section">
              What's included
            </h2>
            <ul className="mt-8 space-y-4">
              {s.includes.map((i) => (
                <li key={i} className="flex gap-3 leading-relaxed">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-turbo" aria-hidden />
                  {i}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="h-section">Who it's best for</h2>
            <ul className="mt-8 space-y-4">
              {s.bestFor.map((b) => (
                <li key={b} className="panel px-5 py-4">
                  {b}
                </li>
              ))}
            </ul>
            {s.notFor && (
              <p className="mt-6 flex gap-3 text-sm leading-relaxed text-muted-foreground">
                <X className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <span>
                  <strong className="text-foreground">Not for:</strong> {s.notFor}
                </span>
              </p>
            )}
            <p className="mt-8 text-sm text-muted-foreground">
              Works for:{" "}
              {AUDIENCES.filter((a) => s.audiences.includes(a.category)).map((a, i, arr) => (
                <span key={a.slug}>
                  <Link to={`/${a.slug}`} className="text-turbo underline underline-offset-4">
                    {a.plural}
                  </Link>
                  {i < arr.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
          </div>
        </div>
      </section>

      <section className="section border-t border-border" aria-labelledby="process">
        <div className="container-x">
          <SectionHeader title={<span id="process">How it works</span>} />
          <ol className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {s.process.map((p, i) => (
              <li key={p.title} className="panel p-6 transition duration-300 hover:-translate-y-1 hover:border-turbo/60">
                <span className="font-display text-sm font-bold text-turbo">Step {i + 1}</span>
                <h3 className="mt-2 text-xl font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-14 grid items-start gap-8 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">How much does {s.short} cost?</h2>
              <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
                {prices.length ? `${prices.map((p) => `${p.name}: ${priceLabel(p)}`).join(". ")}.` : "Priced by scope."} Need more than one piece? A package covers it for less — pay once for setup, and monthly only where the work keeps paying off.{isAds ? " Ad spend is paid directly to the platform from your own ad account, never marked up." : ""}
              </p>
              {isHomeOffice || isOfficeTransform ? (
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <a href={SITE.phone.href} data-call-location={`${s.slug}-pricing`} className="btn-ignite inline-flex items-center justify-center gap-2">
                    <Phone className="h-4 w-4" />
                    Call for a flat quote
                  </a>
                  {showCal && calLink("pricing", "btn-chrome inline-flex items-center justify-center")}
                </div>
              ) : (
                <BookButton note={`${note} — pricing`} className="mt-6">
                  Which do I need? Get my free plan
                </BookButton>
              )}
            </div>
            <PriceBox items={prices} />
          </div>
        </div>
      </section>

      {(s.proof?.resultKeys?.length || work.length > 0) && (
        <section className="section border-t border-border" aria-labelledby="proof">
          <div className="container-x">
            <SectionHeader title={<span id="proof">Proof</span>} lede={s.proof?.resultKeys ? "Real dashboards from client campaigns." : "Client sites where this work is live."} />
            <div className="mt-10">{s.proof?.resultKeys ? <AdResultsGrid keys={s.proof.resultKeys} /> : <WorkGrid clients={work} />}</div>
            {s.slug === "meta-ads" && (
              <div className="mt-14">
                <AdGallery ads={ADS.slice(0, 8)} />
              </div>
            )}
          </div>
        </section>
      )}

      {s.slug === "google-business-profile" && (
        <section className="section border-t border-border" aria-label="Google review cards">
          <div className="container-x">
            <ReviewCardPromo title="A great profile needs reviews. Make them one tap." />
          </div>
        </section>
      )}

      {isHomeOffice && (
        <section className="section border-t border-border" aria-labelledby="areas">
          <div className="container-x">
            <SectionHeader title={<span id="areas">Areas We Serve</span>} lede="We serve the entire Atlanta metro area within a 50-mile radius, plus extended service up to 2 hours from Duluth for larger projects." />
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {SETUP_AREAS.map((r, i) => (
                <Reveal key={r.region} delay={i * 70}>
                <div className="panel p-5 transition hover:-translate-y-0.5 hover:border-turbo/60">
                  <h3 className="text-lg font-semibold">{r.region}</h3>
                  {r.note && <p className="mt-1 text-xs text-turbo">{r.note}</p>}
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {r.cities.map((c) => (
                      <li key={c} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                </Reveal>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted-foreground">Don't see your city? If you're within about two hours of Duluth, call {SITE.phone.display} and we'll tell you the same day.</p>
          </div>
        </section>
      )}

      <FAQList faqs={s.faqs} title={`${s.short} questions`} />

      <section className="pb-8" aria-labelledby="more">
        <div className="container-x">
          <h2 id="more" className="text-2xl font-bold">
            Other services
          </h2>
          <div className="mt-6">
            <ServiceGrid slugs={SERVICES.filter((x) => x.slug !== s.slug).slice(0, 5).map((x) => x.slug)} />
          </div>
        </div>
      </section>

      {isHomeOffice || isOfficeTransform ? (
        <section className="section border-t border-border pb-28 md:pb-16" aria-labelledby="call-now">
          <div className="container-x text-center">
            <h2 id="call-now" className="h-section">{isOfficeTransform ? "Ready to transform your office space?" : "Ready to get your workspace set up?"}</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{isOfficeTransform ? "Call or text for a free consultation and quote. We'll assess your space, discuss your needs, and give you a transparent one-time price." : "Call or text and we'll confirm your price and a time that works. Seniors and accessibility needs welcome."}</p>
            <a href={SITE.phone.href} data-call-location={`${s.slug}-footer`} className="btn-ignite mt-6 inline-flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Call {SITE.phone.display}
            </a>
            {showCal && calLink("footer", "btn-chrome mt-6 ml-3 inline-flex items-center gap-2")}
          </div>
        </section>
      ) : (
        <BookingSection note={note} prefill={prefill} />
      )}
    </>
  );
}
