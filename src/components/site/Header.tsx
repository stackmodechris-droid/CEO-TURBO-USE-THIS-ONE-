import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { BookButton } from "@/components/cta/Actions";
import { SERVICES } from "@/content/services";
import { fromPriceLabel } from "@/config/site";
import { SHOP_PATH, SETUP_PATH } from "@/content/review-cards";
import { cn } from "@/lib/utils";

type Item = { to: string; label: string; sub?: string };
type Menu = { label: string; to: string; items: Item[]; wide?: boolean };

// Home first, then three dropdowns, then the two money links. Fewer choices = more clicks on the ones that pay.
const MENUS: Menu[] = [
  {
    label: "Who we help",
    to: "/local-business",
    items: [
      { to: "/local-business", label: "Local businesses", sub: "More calls, more 5-star reviews" },
      { to: "/artist", label: "Artists & producers", sub: "More listeners, fans and bookings" },
      { to: "/shopify", label: "Shopify & online stores", sub: "More traffic that actually buys" },
      { to: "/atlanta", label: "Atlanta businesses", sub: "Local, founder-led growth" },
    ],
  },
  {
    label: "Services",
    to: "/services",
    wide: true,
    items: [{ to: "/brand-boost", label: "Brand Boost call", sub: "Free 30-min growth plan — start here" }, { to: "/pricing", label: "Pricing", sub: "Clear prices — setup once, monthly only where it pays" }, ...SERVICES.map((s) => ({ to: `/services/${s.slug}`, label: s.short, sub: s.outcome }))],
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
    label: "Review cards",
    to: SHOP_PATH,
    items: [
      { to: SHOP_PATH, label: "Shop review cards", sub: `Tap-to-review NFC cards — from ${fromPriceLabel}` },
      { to: SETUP_PATH, label: "Card setup guide", sub: "Program your card in 5 minutes" },
      { to: "/how-to-get-more-google-reviews", label: "Get more Google reviews", sub: "The playbook that works" },
    ],
  },
];

const linkCls = ({ isActive }: { isActive: boolean }) =>
  cn("whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium transition-colors hover:bg-white/5 hover:text-foreground xl:px-3", isActive ? "text-foreground" : "text-muted-foreground");

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
        <Logo />

        {!focus && (
          <nav aria-label="Main" className="hidden items-center gap-0.5 lg:flex">
            <NavLink to="/" end className={linkCls}>
              Home
            </NavLink>
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
          <BookButton note={focus ? "Ad page header" : "Header"} className={cn("!px-4 !py-2.5 !text-sm", focus ? "inline-flex" : "hidden sm:inline-flex")}>
            Book a free call
          </BookButton>
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
            <Link to="/brand-boost" className="panel flex items-center justify-between px-4 py-4 text-lg font-semibold">
              Book a free Brand Boost call
              <span className="text-turbo" aria-hidden>›</span>
            </Link>
            <Link to="/free-audit" className="panel flex items-center justify-between px-4 py-4 text-lg font-semibold">
              Free Brand Visibility Check
              <span className="text-turbo" aria-hidden>›</span>
            </Link>
            <Link to={SHOP_PATH} className="panel flex items-center justify-between px-4 py-4 text-lg font-semibold">
              Google review cards — {fromPriceLabel}
              <span className="text-turbo" aria-hidden>›</span>
            </Link>
          </div>
          <Link to="/" className="mt-6 block px-1 py-2 text-base font-medium">
            Home
          </Link>
          {MENUS.map((m) => (
            <details key={m.label} className="group border-t border-border py-1 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between px-1 py-3 text-base font-medium">
                {m.label}
                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden />
              </summary>
              <div className="grid gap-1 pb-3">
                {m.items.map((i) => (
                  <Link key={i.to} to={i.to} className="rounded-xl bg-white/[0.03] px-3 py-3 text-sm font-medium">
                    {i.label}
                  </Link>
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
      <Link to={menu.to} className={cn("flex items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium transition-colors hover:bg-white/5 hover:text-foreground xl:px-3", active ? "text-foreground" : "text-muted-foreground")}>
        {menu.label} <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" aria-hidden />
      </Link>
      <div className={cn("invisible absolute left-1/2 top-full -translate-x-1/2 pt-2 opacity-0 transition-all duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100", menu.wide ? "w-[560px]" : "w-[300px]")}>
        <div className={cn("grid gap-1 rounded-2xl border border-white/10 bg-[hsl(218_33%_7%)] p-2 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.8)]", menu.wide && "grid-cols-2")}>
          {menu.items.map((i) => (
            <Link key={i.to} to={i.to} className="rounded-xl px-3 py-2.5 transition-colors hover:bg-white/10 focus-visible:bg-white/10">
              <span className="block text-sm font-semibold text-foreground">{i.label}</span>
              {i.sub && <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">{i.sub}</span>}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
