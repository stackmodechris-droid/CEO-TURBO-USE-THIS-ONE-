import { Fragment, useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { Logo } from "./Logo";
import { BookButton } from "@/components/cta/Actions";
import { SITE, fromPriceLabel } from "@/config/site";
import { CallLink } from "./CallLink";
import { REVIEWS_AD_PATH } from "@/content/review-cards";
import { cn } from "@/lib/utils";

type Item = { to: string; label: string; sub?: string; group?: string };
type Menu = { label: string; to: string; items: Item[]; wide?: boolean };

// Two dropdowns plus Pricing: the five things we sell, and the proof. Everything else lives in the footer.
const CORE_SERVICES: Item[] = [
  { to: "/services/google-ads", label: "Google & Microsoft Ads", sub: "Search ads that make the phone ring" },
  { to: "/services/meta-ads", label: "Meta Ads", sub: "Facebook & Instagram lead ads" },
  { to: "/services/google-business-profile", label: "Google Business Profile", sub: "Show up in Google Maps" },
  { to: "/services/social-media-optimization", label: "Social media", sub: "Profiles that turn lookers into callers" },
  { to: "/services/conversion-tracking", label: "Call & booking tracking", sub: "Know which ads bring customers" },
  { to: "/book", label: "Free 30-min call", sub: "Pick a time, no forms first" },
];

const MENUS: Menu[] = [
  { label: "Services", to: "/services", items: CORE_SERVICES },
  {
    label: "Results",
    to: "/results",
    items: [
      { to: "/results", label: "Ad results", sub: "Real dashboards, real cost per lead" },
      { to: "/portfolio", label: "Our work", sub: "Live client websites we built" },
      { to: "/about", label: "About Christopher", sub: "Who you'll work with" },
    ],
  },
];

const linkCls = ({ isActive }: { isActive: boolean }) =>
  cn("whitespace-nowrap rounded-lg px-2 py-2 text-[13px] font-medium transition-colors hover:bg-white/5 hover:text-foreground xl:px-2.5 xl:text-sm", isActive ? "text-foreground" : "text-muted-foreground");

export function Header({ focus = false }: { focus?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-colors duration-300", open ? "bg-background" : scrolled ? "bg-background/95 backdrop-blur-xl shadow-[0_1px_0_hsl(var(--border))]" : "bg-gradient-to-b from-background/90 to-transparent")}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-card focus:px-4 focus:py-2">
        Skip to content
      </a>
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Logo onNavigate={() => setOpen(false)} />

        {!focus && (
          <nav aria-label="Main" className="hidden items-center gap-0.5 lg:flex">
            {MENUS.map((m) => (
              <Dropdown key={m.label} menu={m} active={m.items.some((i) => i.to === pathname)} />
            ))}
            <NavLink to="/pricing" className={linkCls}>
              Pricing
            </NavLink>
          </nav>
        )}

        <div className="flex items-center gap-2">
          <CallLink location={focus ? "ad page header" : "header"} icon className="hidden min-h-[44px] px-2 text-sm font-semibold text-chrome transition-colors hover:text-foreground lg:inline-flex" />
          <CallLink location={focus ? "ad page header icon" : "header icon"} className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-foreground ring-1 ring-white/10 hover:bg-white/5 lg:hidden">
            <Phone className="h-[18px] w-[18px]" aria-hidden />
            <span className="sr-only">Call {SITE.name} at {SITE.phone.display}</span>
          </CallLink>
          {pathname === REVIEWS_AD_PATH ? (
            <a href="#buy" className="btn-ignite whitespace-nowrap !px-4 !py-2.5 !text-sm">
              Get cards<span className="hidden sm:inline"> · {fromPriceLabel}</span>
            </a>
          ) : (
            <BookButton note={focus ? "Ad page header" : "Header"} className={cn("!px-4 !py-2.5 !text-sm", focus ? "inline-flex" : "hidden sm:inline-flex")}>
              Book a free call
            </BookButton>
          )}
          {!focus && (
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-foreground lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>

      {open && !focus && (
        <div id="mobile-menu" className="container-x h-[calc(100dvh-4rem)] overflow-y-auto pb-32 pt-2 lg:hidden">
          <div className="grid gap-2">
            <Link to="/book" onClick={() => setOpen(false)} className="btn-ignite justify-between !px-4 !py-4 !text-lg">
              Book a free 30-min call
              <span aria-hidden>›</span>
            </Link>
            <CallLink location="mobile menu" icon className="panel flex items-center gap-2 px-4 py-4 text-lg font-semibold">
              Call {SITE.phone.display}
            </CallLink>
          </div>
          <Link to="/" onClick={() => { setOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="mt-6 block px-1 py-2 text-base font-medium">
            Home
          </Link>
          {MENUS.map((m) => (
            <details key={m.label} className="group border-t border-border py-1 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between px-1 py-3 text-base font-medium">
                {m.label}
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden />
              </summary>
              <div className="grid gap-1 pb-3">
                {m.items.map((i, idx) => (
                  <Fragment key={i.to + i.label}>
                  {i.group && i.group !== m.items[idx - 1]?.group && <p className="px-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-turbo">{i.group}</p>}
                  <Link to={i.to} onClick={() => setOpen(false)} className="rounded-xl bg-white/[0.03] px-3 py-3.5 text-sm font-medium">
                    {i.label}
                  </Link>
                  </Fragment>
                ))}
              </div>
            </details>
          ))}
        </div>
      )}
    </header>
  );
}

function Dropdown({ menu, active }: { menu: Menu; active: boolean }) {
  return (
    <div className="group relative">
      <Link to={menu.to} className={cn("flex items-center gap-1 whitespace-nowrap rounded-lg px-2 py-2 text-[13px] font-medium transition-colors hover:bg-white/5 hover:text-foreground xl:px-2.5 xl:text-sm", active ? "text-foreground" : "text-muted-foreground")}>
        {menu.label} <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" aria-hidden />
      </Link>
      <div className={cn("invisible absolute left-1/2 top-full -translate-x-1/2 pt-2 opacity-0 transition-all duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100", menu.wide ? "w-[560px] max-w-[calc(100vw-2rem)]" : "w-[300px]")}>
        <div className={cn("grid max-h-[75vh] gap-1 overflow-y-auto rounded-2xl border border-white/10 bg-[hsl(218_33%_7%)] p-2 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.8)]", menu.wide && "dropdown-scroll grid-cols-2")}>
          {menu.items.map((i, idx) => (
            <Fragment key={i.to + i.label}>
              {i.group && i.group !== menu.items[idx - 1]?.group && <p className="col-span-2 px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-turbo">{i.group}</p>}
              <Link to={i.to} className="rounded-xl px-3 py-2.5 transition-colors hover:bg-white/10 focus-visible:bg-white/10">
                <span className="block text-sm font-semibold text-foreground">{i.label}</span>
                {i.sub && <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">{i.sub}</span>}
              </Link>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
