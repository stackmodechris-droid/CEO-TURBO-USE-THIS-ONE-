import { Link, useParams } from "react-router-dom";
import { GUIDES, guideBySlug, guidePath, type Guide } from "@/content/guides";
import { AUDIENCES } from "@/content/audiences";
import { SITE } from "@/config/site";
import { BookButton } from "@/components/cta/Actions";
import { BookingSection } from "@/components/blocks/Sales";
import { Breadcrumbs, DirectAnswer, FAQList, SectionHeader } from "@/components/blocks/Basics";
import NotFound from "./NotFound";

const anchor = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const fmt = (d: string) => new Date(`${d}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

export function GuidesHub() {
  return (
    <>
      <section className="pt-28 sm:pt-32">
        <div className="container-x">
          <Breadcrumbs items={[{ name: "Guides", path: "/guides" }]} />
          <SectionHeader as="h1" title="Straight answers on growing your business" lede="Built from our own campaigns and client work, not recycled advice. Every guide starts with the answer." />
          <ul className="mt-12 grid gap-5 md:grid-cols-2">
            {GUIDES.map((g) => (
              <li key={g.slug}>
                <Link to={guidePath(g)} className="panel flex h-full flex-col p-6 transition-shadow hover:shadow-[0_0_0_1px_hsl(var(--turbo)/0.5)]">
                  <p className="text-sm text-muted-foreground">{g.readMinutes} min read</p>
                  <h2 className="mt-2 text-xl font-semibold leading-snug">{g.title}</h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{g.summary}</p>
                  <span className="mt-5 text-sm font-semibold text-turbo">Read the guide ›</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <BookingSection note="Guides hub" />
    </>
  );
}

export function GuidePage({ slugOverride }: { slugOverride?: string }) {
  const params = useParams();
  const g = guideBySlug(slugOverride ?? params.slug ?? "");
  if (!g || (!slugOverride && g.path)) return <NotFound />;
  return <GuideArticle g={g} />;
}

function GuideArticle({ g }: { g: Guide }) {
  const path = guidePath(g);
  const audience = AUDIENCES.find((a) => a.adVertical === g.audience);
  const note = `Read guide: ${g.title}`;
  return (
    <>
      <article className="pt-28 sm:pt-32">
        <header className="container-x max-w-[860px]">
          <Breadcrumbs items={[{ name: "Guides", path: "/guides" }, { name: g.title, path }]} />
          <h1 className="text-4xl font-bold leading-[1.04] sm:text-5xl">{g.title}</h1>
          <p className="mt-5 text-sm text-muted-foreground">
            By{" "}
            <Link to="/about" rel="author" className="text-foreground underline underline-offset-4 hover:text-turbo">
              {SITE.founder.name}
            </Link>{" "}
            · Updated <time dateTime={g.updated}>{fmt(g.updated)}</time> · {g.readMinutes} min read
          </p>
          <DirectAnswer>{g.summary}</DirectAnswer>
          <nav aria-label="In this guide" className="mt-8 rounded-2xl border border-border p-5">
            <p className="text-sm font-semibold">In this guide</p>
            <ol className="mt-3 grid gap-1.5 text-sm text-muted-foreground sm:grid-cols-2">
              {g.sections.map((s) => (
                <li key={s.h2}>
                  <a href={`#${anchor(s.h2)}`} className="hover:text-turbo">
                    {s.h2}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </header>

        <div className="container-x max-w-[860px] pb-8">
          {g.sections.map((s) => (
            <section key={s.h2} id={anchor(s.h2)} className="mt-14 scroll-mt-24">
              <h2 className="text-2xl font-bold leading-tight sm:text-3xl">{s.h2}</h2>
              <p className="prose-answer mt-4">{s.answer}</p>
              {s.body?.map((p) => (
                <p key={p.slice(0, 24)} className="mt-4 leading-relaxed text-muted-foreground">
                  {p}
                </p>
              ))}
              {s.bullets && (
                <ul className="mt-5 space-y-2.5">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex gap-3 leading-relaxed text-foreground/85">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-turbo" aria-hidden />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
              {s.table && (
                <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
                  <table className="w-full min-w-[560px] text-left text-sm">
                    <thead className="bg-white/[0.03]">
                      <tr>
                        {s.table.head.map((h, i) => (
                          <th key={i} className="px-4 py-3 font-semibold">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {s.table.rows.map((row) => (
                        <tr key={row[0]} className="border-t border-border">
                          {row.map((cell, i) =>
                            i === 0 ? (
                              <th key={i} scope="row" className="px-4 py-3 font-medium">
                                {cell}
                              </th>
                            ) : (
                              <td key={i} className="px-4 py-3 text-muted-foreground">
                                {cell}
                              </td>
                            ),
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ))}

          <aside className="panel mt-16 p-6 sm:p-8">
            <p className="text-sm font-medium text-turbo">Want this done for you?</p>
            <p className="mt-2 text-2xl font-bold leading-snug">We'll look at your business on a free 30-minute call and tell you what to fix first.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <BookButton note={note} />
              {audience && (
                <Link to={`/${audience.slug}`} className="btn-chrome">
                  How we help {audience.plural}
                </Link>
              )}
            </div>
          </aside>

          <div className="mt-12">
            <h2 className="text-lg font-semibold">Related</h2>
            <ul className="mt-3 space-y-2">
              {g.related.map((r) => (
                <li key={r.to}>
                  <Link to={r.to} className="text-turbo underline underline-offset-4">
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>
      {g.faqs.length > 0 && <FAQList faqs={g.faqs} />}
    </>
  );
}
