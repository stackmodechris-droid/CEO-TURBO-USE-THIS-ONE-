import { useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import { AuditTool, CATEGORY } from "./AuditTool";
import { cn } from "@/lib/utils";

/**
 * Lead-magnet hero: promise on the left, the audit on the right.
 * Once the report is ready it takes the full width so it reads like a real report.
 */
export function AuditHero({ title, lede, eyebrow, footer, source, points }: { title: ReactNode; lede: ReactNode; eyebrow: string; footer?: ReactNode; source: string; points?: ReactNode[] }) {
  const [wide, setWide] = useState(false);
  return (
    <section className="relative overflow-clip pt-24 sm:pt-32" aria-label="Free visibility audit">
      <div className="pointer-events-none absolute inset-0 bg-grid" aria-hidden />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[1100px] -translate-x-1/2 glow-turbo" aria-hidden />
      <div className="container-x relative">
        <div className={cn("grid items-center gap-10 lg:gap-14", wide ? "lg:grid-cols-1" : "lg:grid-cols-[1.05fr_0.95fr]")}>
          {!wide && (
            <div className="hero-rise relative z-10">
              <p className="chip">{eyebrow}</p>
              <h1 className="mt-5 text-[40px] font-bold leading-[0.98] sm:text-6xl lg:text-[68px]">{title}</h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">{lede}</p>
              <ul className="mt-6 hidden max-w-xl gap-2.5 sm:grid sm:grid-cols-2">
                {points
                  ? points.map((p, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-[15px]">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-turbo" aria-hidden />
                        <span>{p}</span>
                      </li>
                    ))
                  : Object.entries(CATEGORY).map(([k, c]) => (
                      <li key={k} className="flex items-start gap-2.5 text-[15px]">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-turbo" aria-hidden />
                        <span>
                          <span className="font-semibold">{c.short}:</span> <span className="text-muted-foreground">{c.question}</span>
                        </span>
                      </li>
                    ))}
              </ul>
              {footer && <div className="mt-6 text-sm text-muted-foreground">{footer}</div>}
            </div>
          )}
          <div id="audit" className={cn("relative z-10 scroll-mt-24", wide && "mx-auto w-full max-w-[920px]")}>
            <AuditTool source={source} onStageChange={(s) => setWide(s === "report")} />
          </div>
        </div>
      </div>
    </section>
  );
}
