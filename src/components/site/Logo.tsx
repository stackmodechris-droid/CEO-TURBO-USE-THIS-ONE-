import { Link } from "react-router-dom";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 ${className}`} aria-label="CEO Turbo home">
      <img src="/img/brand/ceo-turbo-logo-sm.webp" alt="" width={56} height={32} className="h-8 w-auto" />
      <span className="font-display text-[15px] font-bold tracking-tight">
        CEO <span className="text-turbo">Turbo</span>
      </span>
    </Link>
  );
}
