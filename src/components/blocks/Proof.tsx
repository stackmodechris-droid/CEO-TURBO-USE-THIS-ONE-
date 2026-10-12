import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check } from "lucide-react";
import { BookButton } from "@/components/cta/Actions";
import { CLIENTS, CATEGORY_LABEL, domainOf, type Category, type Client } from "@/content/clients";
import { AD_RESULTS, AD_TOTALS, GSC, APPLIANCE_KING_PAGE, FEATURED_RESULT, money, type AdResult } from "@/content/results";
import type { AdCreative } from "@/content/ads";
import { cn } from "@/lib/utils";

export function ProofStats() {
  const stats = [
    { value: String(CLIENTS.length), label: "client websites live right now" },
    { value: String(AD_TOTALS.leads), label: `Meta leads at ${money(AD_TOTALS.avgCpl)} average` },
    { value: money(AD_TOTALS.lowestCpl), label: "lowest cost per lead" },
    { value: GSC.impressions, label: "Google impressions on stackmode.net" },
  ];
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-border md:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-background/95 p-5 sm:p-6">
          <dt className="sr-only">{s.label}</dt>
          <dd className="font-display text-3xl font-bold tracking-tight text-chrome-grad sm:text-4xl">{s.value}</dd>
          <dd className="mt-1 text-sm text-muted-foreground">{s.label}</dd>
        </div>
      ))}
    </dl>
  );
}

export function BrowserShot({ client, eager = false, large = false }: { client: Client; eager?: boolean; large?: boolean }) {
  return (
    <div className="overflow-hidden rounded-xl bg-[#0b0f16] ring-1 ring-white/10">
      <div className="flex items-center gap-1.5 border-b border-white/5 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="ml-2 truncate text-[11px] text-muted-foreground">{domainOf(client.url)}</span>
      </div>
      <img
        src={large ? `/img/work/${client.slug}.webp` : `/img/work/${client.slug}-640.webp`}
        srcSet={`/img/work/${client.slug}-640.webp 640w, /img/work/${client.slug}-960.webp 960w, /img/work/${client.slug}.webp 1600w`}
        sizes={large ? "(min-width: 1200px) 1150px, calc(100vw - 32px)" : "(min-width: 1024px) 360px, (min-width: 640px) 45vw, calc(100vw - 32px)"}
        alt={`${client.name} ${client.industry.toLowerCase()} website homepage, designed and built by CEO Turbo`}
        width={1600}
        height={1000}
        loading={eager ? "eager" : "lazy"}
        {...(eager ? ({ fetchpriority: "high" } as Record<string, string>) : {})}
        decoding="async"
        className="aspect-[16/10] w-full object-cover object-top"
      />
    </div>
  );
}

export function WorkGrid({ clients = CLIENTS, filterable = false, limit }: { clients?: Client[]; filterable?: boolean; limit?: number }) {
  const [filter, setFilter] = useState<Category | "all">("all");
  const shown = (filter === "all" ? clients : clients.filter((c) => c.category === filter)).slice(0, limit);
  const cats = (Object.keys(CATEGORY_LABEL) as Category[]).filter((c) => clients.some((cl) => cl.category === c));

  return (
    <div>
      {filterable && (
        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter work by type">
          {(["all", ...cats] as const).map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                filter === c ? "bg-foreground text-background" : "bg-white/5 text-muted-foreground hover:text-foreground",
              )}
            >
              {c === "all" ? `All ${clients.length}` : `${CATEGORY_LABEL[c]} (${clients.filter((cl) => cl.category === c).length})`}
            </button>
          ))}
        </div>
      )}
      <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((c) => (
          <li key={c.slug} className="group">
            <Link to={`/portfolio/${c.slug}`} className="block">
              <div className="transition-transform duration-300 group-hover:-translate-y-1">
                <BrowserShot client={c} />
              </div>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-semibold">{c.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {c.industry}
                    {c.location ? ` · ${c.location.split(",")[0]}` : ""}
                  </p>
                </div>
                <span className="mt-1 shrink-0 whitespace-nowrap text-sm font-medium text-turbo opacity-80 group-hover:opacity-100">Case study</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ResultCard({ r }: { r: AdResult }) {
  const name = r.clientSlug ? (
    <Link to={`/portfolio/${r.clientSlug}`} className="hover:text-turbo">
      {r.client}
    </Link>
  ) : (
    r.client
  );
  return (
    <article className="panel flex flex-col overflow-hidden">
      <div className="p-5">
        <p className="text-sm text-muted-foreground">{name}</p>
        <h3 className="mt-0.5 text-base font-semibold tracking-tight">{r.campaign}</h3>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div>
            <p className="font-display text-2xl font-bold text-foreground">{r.count}</p>
            <p className="text-xs text-muted-foreground">{r.metric.toLowerCase()}</p>
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-turbo">{money(r.costPer)}</p>
            <p className="text-xs text-muted-foreground">per {r.metric === "Leads" ? "lead" : r.metric === "Checkouts started" ? "checkout" : "visit"}</p>
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-foreground/80">{money(r.spent)}</p>
            <p className="text-xs text-muted-foreground">spent</p>
          </div>
        </div>
        {r.peer && <p className="mt-4 rounded-lg bg-turbo/10 px-3 py-2 text-xs leading-snug text-turbo">Meta benchmark: {r.peer}</p>}
      </div>
      <a href={r.image} target="_blank" rel="noopener" className="mt-auto block border-t border-border bg-white/[0.02]">
        <img src={r.image.replace(".webp", "-600.webp")} srcSet={`${r.image.replace(".webp", "-600.webp")} 600w, ${r.image} 1100w`} sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 92vw" alt={`Meta Ads Manager dashboard: ${r.client} ${r.campaign}, ${r.count} ${r.metric.toLowerCase()} at ${money(r.costPer)} each`} loading="lazy" decoding="async" width={600} height={545} className="h-36 w-full object-cover object-top opacity-80 transition-opacity hover:opacity-100" />
        <span className="flex items-center gap-1 px-5 py-2.5 text-xs text-muted-foreground">
          View the dashboard <ArrowUpRight className="h-3 w-3" />
        </span>
      </a>
    </article>
  );
}

export function AdResultsGrid({ keys }: { keys?: string[] }) {
  const rows = keys ? AD_RESULTS.filter((r) => keys.includes(r.key)) : AD_RESULTS;
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map((r) => (
        <ResultCard key={r.key} r={r} />
      ))}
    </div>
  );
}

export function AdGallery({ ads }: { ads: AdCreative[] }) {
  return (
    <ul className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>li]:mb-4">
      {ads.map((a) => (
        <li key={a.slug} className="break-inside-avoid">
          <figure className="overflow-hidden rounded-xl bg-card ring-1 ring-white/10">
            <img src={`/img/ads/${a.slug}.webp`} srcSet={`/img/ads/${a.slug}-360.webp 360w, /img/ads/${a.slug}.webp 720w`} sizes="(min-width: 1024px) 270px, (min-width: 640px) 33vw, 50vw" alt={`${a.client} ad creative: ${a.hook}`} loading="lazy" decoding="async" width={720} height={a.format === "Landscape" ? 405 : a.format === "Portrait" ? 900 : 720} className="w-full" />
            <figcaption className="px-3 py-2.5 text-xs">
              <span className="font-semibold text-foreground">{a.client}</span>
              <span className="block text-muted-foreground">{a.hook}</span>
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}

export function GSCProof() {
  return (
    <figure className="panel overflow-hidden">
      <img src={GSC.image} alt="Google Search Console performance for stackmode.net: 83 clicks, 3.34K impressions, 2.5% CTR, impressions climbing after CEO Turbo's SEO, AEO and GEO work" loading="lazy" decoding="async" width={1600} height={553} className="w-full" />
      <figcaption className="grid gap-4 border-t border-border p-5 sm:grid-cols-[1fr_auto] sm:items-center">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Google Search Console, {GSC.property}, 12 months. Daily impressions were flat for most of the year, then climbed steeply once the SEO, AEO and GEO work went live.
        </p>
        <dl className="flex gap-6 text-sm">
          <div>
            <dd className="font-display text-xl font-bold">{GSC.impressions}</dd>
            <dt className="text-xs text-muted-foreground">impressions</dt>
          </div>
          <div>
            <dd className="font-display text-xl font-bold">{GSC.clicks}</dd>
            <dt className="text-xs text-muted-foreground">clicks</dt>
          </div>
          <div>
            <dd className="font-display text-xl font-bold">{GSC.ctr}</dd>
            <dt className="text-xs text-muted-foreground">CTR</dt>
          </div>
        </dl>
      </figcaption>
    </figure>
  );
}

/** Lead proof: the Appliance King result, with the two dashboards it comes from. */
export function FeaturedResult() {
  const ad = AD_RESULTS.find((r) => r.key === "appliance-king")!;
  const pg = APPLIANCE_KING_PAGE;
  const reach = [
    { v: pg.views, l: "page views" },
    { v: pg.viewers, l: "viewers" },
    { v: pg.linkClicks, l: "link clicks" },
    { v: pg.follows, l: "new follows" },
  ];
  return (
    <div className="panel overflow-hidden p-6 sm:p-8">
      <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-sm font-medium text-turbo">
            Best result · <Link to={`/portfolio/${FEATURED_RESULT.clientSlug}`} className="underline-offset-4 hover:underline">{FEATURED_RESULT.client}</Link>
          </p>
          <h2 className="h-section mt-2">{FEATURED_RESULT.headline}</h2>
          <p className="mt-2 text-xs text-muted-foreground">{FEATURED_RESULT.note}</p>
          <dl className="mt-6 grid grid-cols-3 gap-3">
            {[
              { v: String(ad.count), l: "leads from the form ad" },
              { v: money(ad.costPer), l: "per lead" },
              { v: money(ad.spent), l: "ad spend" },
            ].map((x) => (
              <div key={x.l}>
                <dd className="font-display text-3xl font-bold text-chrome-grad sm:text-4xl">{x.v}</dd>
                <dt className="mt-1 text-xs text-muted-foreground">{x.l}</dt>
              </div>
            ))}
          </dl>
          <dl className="mt-6 grid grid-cols-4 gap-3 border-t border-border pt-5">
            {reach.map((x) => (
              <div key={x.l}>
                <dd className="font-display text-xl font-bold text-turbo">{x.v}</dd>
                <dt className="text-xs text-muted-foreground">{x.l}</dt>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm font-semibold">What we set up</p>
          <ul className="mt-2 space-y-2">
            {FEATURED_RESULT.did.map((d) => (
              <li key={d} className="flex items-start gap-2 text-[15px]">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-turbo" aria-hidden /> {d}
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <BookButton />
          </div>
        </div>
        <div className="grid gap-4">
          {[
            { src: ad.image, w600: "-600", w2: "", wBig: 978, h: 492, alt: `Meta Ads Manager: Appliance King lead form, ${ad.count} leads at ${money(ad.costPer)} each, ${money(ad.spent)} spent`, label: "Meta Ads Manager" },
            { src: pg.image, w600: "-600", w2: "-900", wBig: 1290, h: 1380, alt: "Appliance King Facebook page insights: 59.4K views, 26.6K viewers, 778 link clicks, 186 follows", label: "Facebook page insights" },
          ].map((i) => (
            <a key={i.src} href={i.src} target="_blank" rel="noopener" className="block overflow-hidden rounded-xl border border-border bg-white/[0.02]">
              <img
                src={i.src.replace(".webp", `${i.w2 || i.w600}.webp`)}
                srcSet={`${i.src.replace(".webp", `${i.w600}.webp`)} 600w, ${i.w2 ? `${i.src.replace(".webp", `${i.w2}.webp`)} 900w, ` : ""}${i.src} ${i.wBig}w`}
                sizes="(min-width: 1024px) 480px, 92vw"
                alt={i.alt}
                loading="lazy"
                decoding="async"
                width={i.wBig}
                height={i.h}
                className="h-auto max-h-96 w-full object-cover object-top"
              />
              <span className="flex items-center gap-1 px-4 py-2 text-xs text-muted-foreground">
                {i.label} <ArrowUpRight className="h-3 w-3" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
