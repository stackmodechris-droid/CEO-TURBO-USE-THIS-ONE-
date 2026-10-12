import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { SERVICES } from "@/content/services";
import { GUIDES, guidePath } from "@/content/guides";
import { SITE, fromPriceLabel } from "@/config/site";
import { SETUP_PATH, SHOP_PATH } from "@/content/review-cards";
import { BookButton } from "@/components/cta/Actions";
import { CallLink } from "./CallLink";
import { SocialLinks } from "./SocialLinks";

export function Footer({ focus = false }: { focus?: boolean }) {
  const year = 2026;
  if (focus)
    return (
      <footer className="border-t border-border pb-28 pt-10 text-sm text-muted-foreground sm:pb-10">
        <div className="container-x flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE.name} · {SITE.address.addressLocality}, {SITE.address.addressRegion} ·{" "}
            <CallLink location="footer (ad page)" className="text-foreground hover:text-turbo" />
          </p>
          <p className="flex gap-4">
            <Link to="/privacy-policy" className="hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
          </p>
        </div>
        <p className="container-x mt-3 text-xs">This site is not part of the Facebook website or Meta Platforms, Inc. Results shown are from real client campaigns and are not a guarantee.</p>
      </footer>
    );
  return (
    <footer className="relative overflow-hidden border-t border-border pb-28 pt-20 sm:pb-12">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[900px] -translate-x-1/2 glow-turbo opacity-60" aria-hidden />
      <div className="container-x relative">
        <div className="flex flex-col items-start justify-between gap-8 border-b border-border pb-14 lg:flex-row lg:items-end">
          <p className="max-w-3xl font-display text-4xl font-bold leading-[0.95] tracking-tight sm:text-6xl">
            <span className="text-chrome-grad">More customers.</span>
            <br />
            <span className="text-chrome-grad">More reviews.</span>
            <br />
            <span className="text-turbo-grad">More listeners.</span>
          </p>
          <div className="flex flex-col gap-3">
            <BookButton note="Footer" />
            <p className="text-sm text-muted-foreground">
              Free · 30 minutes · No pitch deck · or call <CallLink location="footer cta" className="font-semibold text-foreground hover:text-turbo" />
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-14 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Growth agency for artists, local businesses and Shopify stores. Founded by {SITE.founder.name} ({SITE.founder.alternateName}).
            </p>
            <address className="mt-4 text-sm not-italic leading-relaxed text-muted-foreground">
              {SITE.address.streetAddress}
              <br />
              {SITE.address.addressLocality}, {SITE.address.addressRegion} {SITE.address.postalCode}
              <br />
              <CallLink location="footer" icon className="mt-2 font-semibold text-foreground hover:text-turbo" />
            </address>
            <SocialLinks className="mt-5" />
          </div>
          <FooterCol
            title="Who we help"
            links={[
              { to: "/artist", label: "Artists & producers" },
              { to: "/local-business", label: "Local businesses" },
              { to: "/shopify", label: "Shopify stores" },
              { to: "/atlanta", label: "Atlanta businesses" },
              { to: "/free-audit", label: "Free SEO, AEO & GEO audit" },
              { to: SHOP_PATH, label: `Google review cards — from ${fromPriceLabel}` },
              { to: SETUP_PATH, label: "Review card setup guide" },
            ]}
          />
          <FooterCol title="Services" links={SERVICES.map((s) => ({ to: `/services/${s.slug}`, label: s.short }))} />
          <FooterCol title="Guides" links={GUIDES.map((g) => ({ to: guidePath(g), label: g.metaTitle.split(" — ")[0].split(":")[0] }))} />
          <FooterCol
            title="Company"
            links={[
              { to: "/portfolio", label: "Portfolio" },
              { to: "/results", label: "Results" },
              { to: "/about", label: "About Christopher" },
              { to: "/brand-boost", label: "Brand Boost call" },
              { to: "/pricing", label: "Pricing" },
              { to: "/contact", label: "Contact" },
              { to: "/promptshop", label: "Prompt Shop" },
            ]}
          />
        </div>

        <div className="flex flex-col gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE.name}. Also from Christopher:{" "}
            <a href="https://stackmode.net" className="text-foreground underline underline-offset-4 hover:text-turbo" target="_blank" rel="noopener">
              Stackmode Academy
            </a>
          </p>
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            <li>
              <Link to="/privacy-policy" className="hover:text-foreground">Privacy</Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-foreground">Terms</Link>
            </li>
            <li>
              <Link to="/shipping-returns" className="hover:text-foreground">Shipping &amp; returns</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
