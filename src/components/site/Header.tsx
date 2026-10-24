import { Fragment, useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import { Logo } from "./Logo";
import { BookButton } from "@/components/cta/Actions";
import { SERVICES } from "@/content/services";
import { SITE, fromPriceLabel } from "@/config/site";
import { CallLink } from "./CallLink";
import { REVIEWS_AD_PATH, SHOP_PATH, SETUP_PATH } from "@/content/review-cards";
import { SHIRTS_PATH, shirtFromLabel } from "@/content/company-shirts";
import { ARTIST_MERCH_PATH, artistFromLabel } from "@/content/artist-merch";
import { cn } from "@/lib/utils";

type Item = { to: string; label: string; sub?: string; group?: string };

const SERVICE_GROUPS: Record<string, string> = {
  "home-office-setup": "Office & workspace",
  "office-transformation": "Office & workspace",
  "apartment-home-office-setup": "Office & workspace",
  "school-computer-room-setup": "Office & workspace",
  "computer-build-setup": "Tech & equipment",
  "dj-studio-setup": "Tech & equipment",
  "pos-system-setup": "Tech & equipment",
};
const groupOf = (slug: string) => SERVICE_GROUPS[slug] ?? "Marketing & growth";
const GROUP_ORDER = ["Start here", "Office & workspace", "Tech & equipment", "Marketing & growth"];
type Menu = { label: string; to: string; items: Item[]; wide?: boolean };

// Home first, then three dropdowns, then the two money links. Fewer choices = more clicks on the ones that pay.
const MENUS: Menu[] = [
  {
    label: "Who we help",
    to: "/local-business",
    items: [
      { to: "/restaurants", label: "Restaurants", sub: "DoorDash, TV menus, Maps & table review cards" },
      { to: "/salons", label: "Salons", sub: "Google profile, bookings & station review cards" },
      { to: "/barbershops", label: "Barbershops", sub: "Walk-ins, Google profile & chair review cards" },
      { to: "/local-business", label: "Local businesses", sub: "More calls, more 5-star reviews" },
      { to: "/artist", label: "Artists", sub: "More listeners, shows, features and merch" },
      { to: "/producers", label: "Producers & beatmakers", sub: "Sell more beats, custom tracks and sessions" },
      { to: "/visual-artists", label: "Painters & visual artists", sub: "Sell originals, prints and commissions" },
      { to: "/shopify", label: "Shopify & online stores", sub: "More traffic that actually buys" },
      { to: "/atlanta", label: "Atlanta businesses", sub: "Local, founder-led growth" },
      { to: "/app-marketing", label: "Software & app developers", sub: "More users & installs, zero fluff" },
    ],
  },
  {
    label: "Services",
    to: "/services",
    wide: true,
    items: [
      { to: "/brand-boost", label: "Brand Boost call", sub: "Free 30-min growth plan — start here", group: "Start here" },
      { to: "/pricing", label: "Pricing", sub: "Clear prices — setup once, monthly only where it pays", group: "Start here" },
      { to: SHIRTS_PATH, label: "Custom company t-shirts", sub: `Upload your logo, preview it, order — from ${shirtFromLabel}`, group: "Start here" },
      { to: "/restaurants", label: "Restaurant growth", sub: "DoorDash & Uber Eats setup, TV menus, Maps, table review cards", group: "Start here" },
      { to: "/app-marketing", label: "Software & app distribution", sub: "Engineered growth for developers & SaaS", group: "Start here" },
      ...SERVICES.map((s) => ({ to: `/services/${s.slug}`, label: s.short, sub: s.outcome, group: groupOf(s.slug) })),
    ].sort((a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group)),
  },
  {
    label: "Results",
    to: "/results",
    items: [
      { to: "/portfolio", label: "Our work", sub: "Live client websites we built" },
      { to: "/results", label: "Ad results", sub: "Real dashboards, real cost per lead" },
      { to: "/guides", label: "Free guides", sub: "Straight answers on growth" },
      { to: "/about", label: "About Christopher", sub: "Who you'll work with" },
    ],
  },
  {
    label: "Review stands & cards",
    to: SHOP_PATH,
    items: [
      { to: SHOP_PATH, label: "Shop review stands & cards", sub: `Tap-to-review NFC cards — from ${fromPriceLabel}` },
      { to: SHIRTS_PATH, label: "Company t-shirts", sub: `Your logo on short & long sleeves — from ${shirtFromLabel}, no minimum` },
      { to: ARTIST_MERCH_PATH, label: "Artist merch", sub: `Your cover art & tour dates on a tee — from ${artistFromLabel}, no minimum` },
      { to: SETUP_PATH, label: "Card setup guide", sub: "Program your card in 5 minutes" },
      { to: "/how-to-get-more-google-reviews", label: "Get more Google reviews", sub: "The playbook that works" },
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
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-colors duration-300", open ? "bg-background" : scrolled ? "bg-background/95 backdrop-blur-xl shadow-[0_1px_0_hsl(var(--border))]" : "bg-background/95 backdrop-blur-xl")}>
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
            <NavLink to="/free-audit" className={linkCls}>
              Free check <span className="ml-1 rounded-full bg-turbo/15 px-1.5 py-0.5 text-[10px] font-semibold text-turbo">FREE</span>
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
            <BookButton note={focus ? "Ad page header" : "Header"} className="inline-flex !px-3 !py-2.5 !text-[13px] sm:!px-4 sm:!text-sm">
              <span className="min-[400px]:hidden">Book a call</span>
              <span className="hidden min-[400px]:inline">Book a free call</span>
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
            <Link to="/free-audit" onClick={() => setOpen(false)} className="panel flex items-center justify-between px-4 py-4 text-lg font-semibold">
              Free Brand Visibility Check
              <span className="text-turbo" aria-hidden>›</span>
            </Link>
            <Link to={SHOP_PATH} onClick={() => setOpen(false)} className="panel flex items-center justify-between px-4 py-4 text-lg font-semibold">
              Review stands & cards — from {fromPriceLabel}
              <span className="text-turbo" aria-hidden>›</span>
            </Link>
            <Link to="/services/home-office-setup" onClick={() => setOpen(false)} className="panel flex items-center justify-between px-4 py-4 text-lg font-semibold">
              Office setup
              <span className="text-turbo" aria-hidden>›</span>
            </Link>
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
