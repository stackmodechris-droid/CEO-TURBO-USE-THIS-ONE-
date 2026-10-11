import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Globe, Mail, MapPin, Megaphone, Search, UserRound, Music2 } from "lucide-react";
import { SERVICES, type Service } from "@/content/services";
import { AUDIENCES } from "@/content/audiences";
import { clientsIn } from "@/content/clients";
import { SITE, BOOKING, PITCH_VIDEO, fromPriceLabel } from "@/config/site";
import { BookButton } from "@/components/cta/Actions";
import { SCENES } from "@/components/visuals/Scenes";
import { ReviewCard3D } from "@/components/visuals/ReviewVisuals";
import { SETUP_PATH, SHOP_PATH } from "@/content/review-cards";
import { mountInlineBooking } from "@/lib/cal";
import { track } from "@/lib/track";

const SERVICE_ICON: Record<Service["icon"], typeof Globe> = {
  search: Search,
  layout: Globe,
  meta: Megaphone,
  google: Search,
  tiktok: Music2,
  x: Megaphone,
  pin: MapPin,
  profile: UserRound,
  mail: Mail,
};

const SCENE_FOR = { artist: SCENES.artist, "local-business": SCENES.local, shopify: SCENES.shopify } as const;

/** “Who are you?” — routes each visitor to the page written for them. */
export function PathPicker() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {AUDIENCES.map((a) => {
        const Scene = SCENE_FOR[a.slug];
        const count = clientsIn(a.category).length;
        return (
          <Link key={a.slug} to={`/${a.slug}`} className="panel group relative flex flex-col overflow-hidden p-6 transition-shadow hover:shadow-[0_0_0_1px_hsl(var(--turbo)/0.6),0_30px_60px_-30px_hsl(var(--turbo)/0.5)]">
            <Scene className="mb-4 h-auto w-full" />
            <p className="text-sm text-muted-foreground">{a.eyebrow}</p>
            <h3 className="mt-1 text-2xl font-bold leading-tight">{a.h1.split(" — ")[0]}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.pains[0].body}</p>
            <span className="mt-auto flex items-center justify-between gap-3 pt-6 text-sm font-semibold">
              <span className="inline-flex items-center gap-2 text-turbo">
                See how we help {a.plural}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
              {count > 0 && <span className="whitespace-nowrap font-normal text-muted-foreground">{count} sites built</span>}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export function ServiceGrid({ slugs }: { slugs?: string[] }) {
  const list = slugs ? slugs.map((s) => SERVICES.find((x) => x.slug === s)!).filter(Boolean) : SERVICES;
  return (
    <ul className="grid gap-px overflow-hidden rounded-2xl bg-border sm:grid-cols-2 lg:grid-cols-3">
      {list.map((s) => {
        const Icon = SERVICE_ICON[s.icon];
        return (
          <li key={s.slug} className="bg-background">
            <Link to={`/services/${s.slug}`} className="group flex h-full flex-col p-6 transition-colors hover:bg-white/[0.025]">
              <Icon className="h-5 w-5 text-turbo" aria-hidden />
              <h3 className="mt-4 text-lg font-semibold tracking-tight">{s.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.outcome}</p>
              <span className="mt-auto pt-5 text-sm font-medium text-foreground/70 group-hover:text-turbo">
                How it works <span aria-hidden>›</span>
              </span>
            </Link>
          </li>
        );
      })}
      <li className="bg-background">
        <Link to={SHOP_PATH} className="group flex h-full flex-col p-6 transition-colors hover:bg-white/[0.025]">
          <span className="text-sm font-semibold text-ignite">From {fromPriceLabel}</span>
          <h3 className="mt-3 text-lg font-semibold tracking-tight">Google review tap cards</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Customers tap their phone and your Google review form opens.</p>
          <span className="mt-auto pt-5 text-sm font-medium text-foreground/70 group-hover:text-turbo">
            Shop review cards <span aria-hidden>›</span>
          </span>
        </Link>
      </li>
    </ul>
  );
}

export function BrandBoostSteps() {
  const steps = [
    { title: "Book the free call", body: `Pick a time that suits you. ${BOOKING.length}, on video or phone.` },
    { title: "We audit you live", body: "Website, Google profile, socials and ads — we show you exactly what's costing you customers." },
    { title: "Get a fixed plan", body: "A written scope and price. Say yes and we start building; say no and keep the plan." },
  ];
  return (
    <ol className="grid gap-5 md:grid-cols-3">
      {steps.map((s, i) => (
        <li key={s.title} className="panel p-6">
          <span className="font-display text-sm font-bold text-turbo">Step {i + 1}</span>
          <h3 className="mt-2 text-xl font-semibold">{s.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}

/** Promo for the Google review card store, used on the homepage and local-business page. */
export function ReviewCardPromo({ headingLevel = "h2", title = "Turn “I'll leave you a review” into a review." }: { headingLevel?: "h1" | "h2"; title?: string }) {
  const H = headingLevel;
  const points = [
    "Customers tap their phone — your Google review form opens",
    "Works on every iPhone XS+ and NFC Android phone",
    "No app for customers, no subscription",
    "Program it yourself in minutes with our setup guide",
  ];
  return (
    <div className="grid items-center gap-12 lg:grid-cols-2">
      <div className="relative mx-auto w-full max-w-[420px]">
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-turbo/20 blur-3xl" aria-hidden />
        <ReviewCard3D tap className="w-full max-w-[340px]" />
      </div>
      <div>
        <p className="text-sm font-medium text-turbo">Google review cards · from {fromPriceLabel}</p>
        <H className={H === "h1" ? "mt-2 text-4xl font-bold leading-[1.02] sm:text-6xl" : "h-section mt-2"}>{title}</H>
        <p className="lede">Most customers mean to review you and forget. Put a tap card where they pay and the review happens before they walk out — more stars, more trust, more calls.</p>
        <ul className="mt-6 space-y-3">
          {points.map((p) => (
            <li key={p} className="flex items-start gap-3 text-[15px]">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-turbo" aria-hidden />
              {p}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link to={SHOP_PATH} className="btn-ignite btn-shine">
            Shop review cards <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link to={SETUP_PATH} className="text-sm font-semibold text-turbo underline-offset-4 hover:underline">
            How setup works
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Founder() {
  return (
    <div className="grid items-center gap-10 md:grid-cols-[0.8fr_1.2fr]">
      <img src={SITE.founder.image} alt={`${SITE.founder.name} (${SITE.founder.alternateName}), founder of CEO Turbo`} width={720} height={539} loading="lazy" decoding="async" className="aspect-[4/3] w-full rounded-2xl object-cover ring-1 ring-white/10" />
      <div>
        <p className="text-sm font-medium text-turbo">Who you'll talk to</p>
        <h2 className="h-section mt-2">{SITE.founder.name}</h2>
        <p className="mt-1 text-chrome">Founder of CEO Turbo · known online as {SITE.founder.alternateName}</p>
        <p className="lede">
          I left a career in tech and finance to help people make more money. I've built 50+ websites, including every client site on this page, and I run the Brand Boost calls myself.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <BookButton note="Founder section">Book a call with Christopher</BookButton>
          <Link to="/about" className="btn-chrome">
            My story
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Closing CTA with the calendar mounted inline once it scrolls near the viewport. */
export function BookingSection({
  title = "Pick a time. We'll show you what's costing you customers.",
  note,
  prefill,
}: {
  title?: string;
  note?: string;
  prefill?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "loading" | "ready" | "failed">("idle");
  const id = "brand-boost-inline";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        setState("loading");
        mountInlineBooking(id, note, prefill).then((ok) => setState(ok ? "ready" : "failed"));
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [note, prefill]);

  return (
    <section id="book" className="section relative overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 glow-ignite opacity-50" aria-hidden />
      <div className="container-x relative">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-medium text-ignite">Free Brand Boost call · {BOOKING.length}</p>
            <h2 className="h-section mt-2">{title}</h2>
            <ul className="mt-6 space-y-3 text-[15px]">
              {["A live look at your site, Google profile, socials and ads", "The one change that would bring the most customers fastest", "A fixed price if you want us to do it — no obligation"].map((t) => (
                <li key={t} className="flex gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-turbo" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-muted-foreground">
              Calendar not loading?{" "}
              <a href={BOOKING.url} target="_blank" rel="noopener" className="text-turbo underline underline-offset-4">
                Book on Cal.com
              </a>
            </p>
          </div>
          <div ref={ref} className="panel relative min-h-[560px] overflow-hidden p-2">
            {state !== "ready" && (
              <div className="absolute inset-0 grid place-items-center p-8 text-center">
                <div>
                  <p className="text-muted-foreground">{state === "failed" ? "The calendar didn't load." : "Loading available times…"}</p>
                  <BookButton note={note} prefill={prefill} className="mt-4">
                    Open the booking calendar
                  </BookButton>
                </div>
              </div>
            )}
            <div id={id} className="relative h-full min-h-[560px] w-full overflow-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}


/** Founder video in a phone frame. Nothing downloads until the visitor taps play. */
export function VideoPitch({ note, className }: { note: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const play = () => {
    setPlaying(true);
    track("video_play", { source: note });
    requestAnimationFrame(() => void ref.current?.play());
  };
  return (
    <figure className={`relative mx-auto w-full max-w-[300px] ${className ?? ""}`}>
      <div className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-turbo/25 blur-3xl" aria-hidden />
      <div className="relative overflow-hidden rounded-[2.2rem] border-[6px] border-[#1a1f29] bg-black shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08)]">
        <video
          ref={ref}
          src={playing ? PITCH_VIDEO.src : undefined}
          poster={PITCH_VIDEO.poster}
          width={PITCH_VIDEO.width}
          height={PITCH_VIDEO.height}
          controls={playing}
          playsInline
          preload="none"
          className="aspect-[9/16] w-full object-cover"
          aria-label={PITCH_VIDEO.title}
        />
        {!playing && (
          <button type="button" onClick={play} className="group absolute inset-0 grid place-items-center bg-gradient-to-t from-black/70 via-black/10 to-transparent" aria-label={`Play video: ${PITCH_VIDEO.title}`}>
            <span className="grid h-20 w-20 place-items-center rounded-full bg-ignite text-white shadow-[0_0_0_10px_rgba(255,107,26,0.25)] transition-transform group-hover:scale-110">
              <Play className="ml-1 h-8 w-8 fill-current" aria-hidden />
            </span>
            <span className="absolute inset-x-0 bottom-5 px-5 text-center text-sm font-semibold text-white">Watch: how to get more customers in 2026 · 1:22</span>
          </button>
        )}
      </div>
    </figure>
  );
}
