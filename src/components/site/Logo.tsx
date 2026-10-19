import type { MouseEvent } from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * Always takes the visitor home. Router links ignore a click on the page you're already on,
 * so on the homepage we scroll to the top ourselves (and drop any #hash / open menu).
 */
export function Logo({ className = "", onNavigate }: { className?: string; onNavigate?: () => void }) {
  const { pathname, hash, search } = useLocation();

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onNavigate?.();
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (pathname === "/" && !hash && !search) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Link to="/" onClick={onClick} className={`group inline-flex min-h-[44px] select-none items-center gap-2.5 whitespace-nowrap ${className}`} aria-label="CEO Turbo home">
      <img src="/img/brand/ceo-turbo-logo-sm.webp" alt="CEO Turbo" width={56} height={32} decoding="async" className="h-8 w-auto object-contain transition-transform group-hover:scale-105" />
      <span className="font-display text-[16px] font-bold tracking-tight text-foreground">
        CEO <span className="text-turbo">Turbo</span>
      </span>
    </Link>
  );
}
