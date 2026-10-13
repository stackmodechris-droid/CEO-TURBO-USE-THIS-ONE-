import { Link } from "react-router-dom";
import { SERVICES } from "@/content/services";
import { AUDIENCES } from "@/content/audiences";
import { ServiceGrid, BookingSection, PathPicker } from "@/components/blocks/Sales";
import { SectionHeader, Breadcrumbs } from "@/components/blocks/Basics";
import { BookButton } from "@/components/cta/Actions";

export default function ServicesHub() {
  return (
    <>
      <section className="relative overflow-hidden pt-28 sm:pt-32">
        <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden />
        <div className="container-x relative">
          <Breadcrumbs items={[{ name: "Services", path: "/services" }]} />
          <SectionHeader
            as="h1"
            title="Websites, ads, SEO, AEO and GEO — under one roof"
            lede={`${SERVICES.length} services that work together: get found on Google and in AI answers, look established everywhere, and turn attention into calls, bookings and sales.`}
          />
          <div className="mt-8">
            <BookButton note="Services hub">Not sure where to start? Book a free call</BookButton>
          </div>
          <div className="mt-14">
            <ServiceGrid />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="by-type">
        <div className="container-x">
          <SectionHeader title={<span id="by-type">Or start with your type of business</span>} />
          <div className="mt-10">
            <PathPicker />
          </div>
          <div className="mt-14 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <caption className="sr-only">Which services fit which type of business</caption>
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-3 pr-4 font-medium">Service</th>
                  {AUDIENCES.map((a) => (
                    <th key={a.slug} className="px-4 py-3 font-medium">
                      {a.nav}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SERVICES.map((s) => (
                  <tr key={s.slug} className="border-b border-border/60">
                    <th scope="row" className="py-3 pr-4 font-medium">
                      <Link to={`/services/${s.slug}`} className="inline-block py-2 hover:text-turbo">
                        {s.name}
                      </Link>
                    </th>
                    {AUDIENCES.map((a) => (
                      <td key={a.slug} className="px-4 py-3 text-turbo">
                        {s.audiences.includes(a.category) ? "✓" : <span className="text-muted-foreground/40">—</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <BookingSection note="Services hub" />
    </>
  );
}
