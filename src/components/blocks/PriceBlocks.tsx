// Price cards and the compact price box: the same numbers as /pricing (src/content/pricing.ts).
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { PRICING_TERMS, perDay, usd, type PriceItem } from "@/content/pricing";
import { cn } from "@/lib/utils";

export function PriceCard({ p, compact = false }: { p: PriceItem; compact?: boolean }) {
  return (
    <li className={cn("panel relative flex flex-col p-6", p.popular && "ring-1 ring-turbo/60")}>
      {p.popular && <span className="absolute -top-3 left-6 rounded-full bg-turbo px-3 py-1 text-xs font-bold text-background">Most picked</span>}
      <h3 className="text-lg font-semibold leading-snug">{p.name}</h3>
      <p className="mt-3 flex items-baseline gap-1.5">
        <span className="font-display text-4xl font-bold tracking-tight text-chrome-grad">{usd(p.price)}</span>
        <span className="text-sm text-muted-foreground">{p.billing === "month" ? "/month" : "one-time"}</span>
      </p>
      {p.billing === "month" && <p className="mt-1 text-xs text-muted-foreground">{perDay(p.price)}</p>}
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.summary}</p>
      {!compact && (
        <ul className="mt-5 space-y-2.5 text-sm">
          {p.includes.map((i) => (
            <li key={i} className="flex gap-2.5">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-turbo" aria-hidden />
              {i}
            </li>
          ))}
        </ul>
      )}
      {p.service && (
        <Link to={`/services/${p.service}`} className="mt-auto pt-5 text-sm font-medium text-turbo underline-offset-4 hover:underline">
          How it works <span aria-hidden>›</span>
        </Link>
      )}
    </li>
  );
}

/** Compact price box for service pages: the same numbers as /pricing. */
export function PriceBox({ items }: { items: PriceItem[] }) {
  if (!items.length) return null;
  return (
    <div className="panel p-6 sm:p-8">
      <p className="text-sm font-medium text-turbo">Pricing</p>
      <ul className="mt-4 divide-y divide-border">
        {items.map((p) => (
          <li key={p.id} className="flex items-baseline justify-between gap-4 py-3">
            <span className="text-[15px]">{p.name}</span>
            <span className="whitespace-nowrap font-display text-lg font-bold">
              {usd(p.price)}
              <span className="ml-1 font-body text-xs font-normal text-muted-foreground">{p.billing === "month" ? "/mo" : "one-time"}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-muted-foreground">{PRICING_TERMS.contract}</p>
      <Link to="/pricing" className="mt-3 inline-block text-sm font-semibold text-turbo underline-offset-4 hover:underline">
        See all prices <span aria-hidden>›</span>
      </Link>
    </div>
  );
}
