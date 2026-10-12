import { Link, useParams } from "react-router-dom";
import { Check, X } from "lucide-react";
import { serviceBySlug, SERVICES } from "@/content/services";
import { AUDIENCES } from "@/content/audiences";
import { clientBySlug } from "@/content/clients";
import { ADS } from "@/content/ads";
import { BookButton } from "@/components/cta/Actions";
import { SearchScene, SCENES } from "@/components/visuals/Scenes";
import { WorkGrid, AdResultsGrid, AdGallery } from "@/components/blocks/Proof";
import { ServiceGrid, BookingSection, ReviewCardPromo } from "@/components/blocks/Sales";
import { SectionHeader, DirectAnswer, Breadcrumbs, FAQList } from "@/components/blocks/Basics";
import { PriceBox } from "@/components/blocks/PriceBlocks";
import { priceLabel, pricesFor } from "@/content/pricing";
import NotFound from "./NotFound";

export default function ServicePage() {
  const { slug = "" } = useParams();
  const s = serviceBySlug(slug);
  if (!s) return <NotFound />;

  const path = `/services/${s.slug}`;
  const work = (s.proof?.clientSlugs ?? []).map(clientBySlug).filter((c): c is NonNullable<typeof c> => Boolean(c));
  const isAds = ["meta-ads", "google-ads", "tiktok-ads", "x-ads"].includes(s.slug);
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
                <BookButton note={note} prefill={prefill}>Book a free call about {s.short}</BookButton>
                <a href="#included" className="btn-chrome">
                  What's included
                </a>
              </div>
            </div>
            <Scene className="h-auto w-full" />
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
              <li key={p.title} className="panel p-6">
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
              <BookButton note={`${note} — pricing`} className="mt-6">
                Which do I need? Get my free plan
              </BookButton>
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

      <BookingSection note={note} prefill={prefill} />
    </>
  );
}
