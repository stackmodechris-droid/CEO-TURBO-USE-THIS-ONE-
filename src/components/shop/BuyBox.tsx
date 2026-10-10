import { useEffect, useId, useRef, useState, type FormEvent, type MouseEvent, type TouchEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, Check, ChevronLeft, ChevronRight, Loader2, Lock, Search, ShieldCheck, Smartphone, Truck, Zap, Repeat } from "lucide-react";
import { REVIEW_CARD, checkoutHref, hasCheckout, money2, packSavings, type ReviewPack, type ReviewStyle } from "@/config/site";
import { GALLERY, INCLUDED, PRODUCT_POINTS, SETUP_PATH } from "@/content/review-cards";
import { TiltCard } from "@/components/visuals/ReviewVisuals";
import { BookButton } from "@/components/cta/Actions";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { googleSearchUrl, rememberBusiness } from "@/lib/review-link";
import { track } from "@/lib/cal";
import { cn } from "@/lib/utils";

const POINT_ICONS = [Smartphone, Zap, Repeat, BadgeCheck];

function addBusinessDays(from: Date, days: number) {
  const d = new Date(from);
  let left = days;
  while (left > 0) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) left--;
  }
  return d;
}
const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

/** The product listing: gallery, options, business lookup and buy button — styled like a Shopify PDP. */
export function BuyBox({ business, onBusiness }: { business: string; onBusiness: (v: string) => void }) {
  const [styleId, setStyleId] = useState<ReviewStyle["id"]>("blue");
  const [packId, setPackId] = useState<ReviewPack["id"]>("2");
  const [img, setImg] = useState(0);
  const [eta, setEta] = useState<string | null>(null);
  const [orderOpen, setOrderOpen] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const buyRef = useRef<HTMLAnchorElement>(null);
  const touchX = useRef<number | null>(null);
  const uid = useId();

  const style = REVIEW_CARD.styles.find((s) => s.id === styleId)!;
  const pack = REVIEW_CARD.packs.find((p) => p.id === packId)!;
  const live = hasCheckout(pack);
  const perCard = pack.price / pack.qty;

  // Delivery estimate depends on today's date, so it's computed in the browser only.
  useEffect(() => {
    const now = new Date();
    setEta(`${fmt(addBusinessDays(now, REVIEW_CARD.shipping.minDays))} – ${fmt(addBusinessDays(now, REVIEW_CARD.shipping.maxDays))}`);
  }, []);

  // Sticky buy bar on phones once the main button scrolls away.
  useEffect(() => {
    const el = buyRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 80), { threshold: 0, rootMargin: "-72px 0px 0px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const pickStyle = (s: ReviewStyle) => {
    setStyleId(s.id);
    setImg(s.image);
  };
  const go = (dir: number) => setImg((i) => (i + dir + GALLERY.length) % GALLERY.length);
  const onTouchStart = (e: TouchEvent) => (touchX.current = e.touches[0].clientX);
  const onTouchEnd = (e: TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  const onBuy = (e: MouseEvent<HTMLAnchorElement>) => {
    rememberBusiness(business);
    track(live ? "card_checkout" : "order_request_open", { value: pack.price, currency: REVIEW_CARD.currency, style: style.id, pack: pack.id });
    if (live) return;
    e.preventDefault();
    setOrderOpen(true);
  };
  const buyHref = live ? checkoutHref(pack, style.id) : "#order";
  const item = GALLERY[img];

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        {/* Gallery */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="group relative aspect-square overflow-hidden rounded-3xl ring-1 ring-white/10" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            {item.tilt ? (
              <div key={img} className="img-in absolute inset-0 grid place-items-center bg-[radial-gradient(70%_70%_at_50%_40%,hsl(var(--turbo)/0.35),transparent_70%),linear-gradient(180deg,hsl(218_32%_11%),hsl(220_38%_5%))] p-[14%]">
                <TiltCard src={item.src} alt={item.alt} priority className="w-full" />
              </div>
            ) : (
              <div key={img} className="img-in absolute inset-0 grid place-items-center bg-white p-[6%]">
                <img src={item.src} alt={item.alt} width={item.w} height={item.h} className="max-h-full w-auto object-contain transition-transform duration-500 group-hover:scale-[1.04]" decoding="async" />
              </div>
            )}
            <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">NFC + QR</span>
            <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur transition-opacity hover:bg-black/80 focus-visible:opacity-100 group-hover:opacity-100">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next photo" className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur transition-opacity hover:bg-black/80 focus-visible:opacity-100 group-hover:opacity-100">
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5 lg:hidden" aria-hidden>
              {GALLERY.map((_, i) => (
                <span key={i} className={cn("h-1.5 rounded-full transition-all", i === img ? "w-5 bg-turbo" : "w-1.5 bg-black/30")} />
              ))}
            </div>
          </div>
          <div className="mt-3 grid grid-cols-5 gap-2 sm:gap-3">
            {GALLERY.map((g, i) => (
              <button key={g.src + i} type="button" onClick={() => setImg(i)} aria-label={`Show photo ${i + 1}: ${g.alt}`} aria-current={i === img} className={cn("aspect-square overflow-hidden rounded-xl bg-white ring-2 transition-all duration-200 hover:-translate-y-0.5", i === img ? "ring-turbo" : "ring-transparent opacity-70 hover:opacity-100")}>
                <img src={g.thumb} alt="" width={200} height={200} loading="lazy" decoding="async" className={cn("h-full w-full object-contain", g.tilt && "bg-[#0b1018] p-1.5")} />
              </button>
            ))}
          </div>
        </div>

        {/* Buy panel */}
        <div>
          <p className="chip">CEO Turbo · Google review cards</p>
          <h1 className="mt-4 text-[34px] font-bold leading-[1.02] sm:text-5xl">
            Google Review Tap Card <span className="text-turbo-grad">— tap, review, done.</span>
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">
            Customers tap their phone on the card and your Google review form opens. No searching for your listing, no app — “I'll leave you a review” becomes a review before they walk out.
          </p>

          <div className="mt-6 flex flex-wrap items-end gap-x-4 gap-y-2">
            <p className="font-display text-4xl font-bold tabular-nums">{money2(pack.price)}</p>
            <p className="pb-1 text-sm text-muted-foreground">
              {pack.qty > 1 ? `${money2(perCard)} per card · ` : ""}
              {REVIEW_CARD.shipping.free ? REVIEW_CARD.shipping.label : REVIEW_CARD.shipping.processing}
            </p>
            {packSavings(pack) > 0 && <span className="mb-1 rounded-full bg-emerald-400/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">You save {money2(packSavings(pack))}</span>}
          </div>

          <ul className="mt-6 grid grid-cols-2 gap-2">
            {PRODUCT_POINTS.map((p, i) => {
              const Icon = POINT_ICONS[i];
              return (
                <li key={p.title} className="rounded-2xl bg-white/[0.03] p-3 ring-1 ring-white/5">
                  <Icon className="h-4 w-4 text-turbo" aria-hidden />
                  <p className="mt-2 text-sm font-semibold leading-tight">{p.title}</p>
                  <p className="mt-1 text-xs leading-snug text-muted-foreground">{p.body}</p>
                </li>
              );
            })}
          </ul>

          {/* Style */}
          <div className="mt-7">
            <div className="flex items-baseline justify-between">
              <p id={`${uid}-style`} className="text-xs font-semibold uppercase tracking-[0.14em] text-chrome">Card style</p>
              <p className="text-sm text-muted-foreground">{style.label}</p>
            </div>
            <div role="radiogroup" aria-labelledby={`${uid}-style`} className="mt-3 grid grid-cols-2 gap-2">
              {REVIEW_CARD.styles.map((s) => (
                <button key={s.id} type="button" role="radio" aria-checked={styleId === s.id} onClick={() => pickStyle(s)} className="opt">
                  <span className="h-9 w-9 shrink-0 rounded-lg ring-1 ring-white/20" style={{ background: s.swatch }} aria-hidden />
                  <span className="text-sm font-semibold">{s.label}</span>
                  {styleId === s.id && <Check className="ml-auto h-4 w-4 text-turbo" aria-hidden />}
                </button>
              ))}
            </div>
          </div>

          {/* Pack */}
          <div className="mt-6">
            <p id={`${uid}-pack`} className="text-xs font-semibold uppercase tracking-[0.14em] text-chrome">How many?</p>
            <div role="radiogroup" aria-labelledby={`${uid}-pack`} className="mt-3 grid gap-2">
              {REVIEW_CARD.packs.map((p) => {
                const save = packSavings(p);
                return (
                  <button key={p.id} type="button" role="radio" aria-checked={packId === p.id} onClick={() => setPackId(p.id)} className="opt !py-3">
                    <span className={cn("grid h-5 w-5 shrink-0 place-items-center rounded-full ring-2", packId === p.id ? "ring-turbo" : "ring-white/25")} aria-hidden>
                      {packId === p.id && <span className="h-2.5 w-2.5 rounded-full bg-turbo" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                        {p.label}
                        {save > 0 && <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">Save {money2(save)}</span>}
                        {p.id === "5" && <span className="rounded-full bg-[hsl(var(--ignite)/0.15)] px-2 py-0.5 text-[11px] font-semibold text-[hsl(var(--ignite-hot))]">Best value</span>}
                      </span>
                      <span className="block text-xs text-muted-foreground">{p.note}</span>
                    </span>
                    <span className="text-right">
                      <span className="block font-display text-base font-bold tabular-nums">{money2(p.price)}</span>
                      {p.qty > 1 && <span className="block text-[11px] text-muted-foreground">{money2(p.price / p.qty)}/card</span>}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Business lookup */}
          <div className="mt-6 rounded-2xl bg-white/[0.03] p-4 ring-1 ring-white/5">
            <label htmlFor={`${uid}-biz`} className="text-sm font-semibold">
              Which business is it for? <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <div className="relative mt-2">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <input id={`${uid}-biz`} className="field pl-10" value={business} onChange={(e) => onBusiness(e.target.value)} onBlur={() => rememberBusiness(business)} placeholder="Type your Google business name" maxLength={100} autoComplete="organization" />
            </div>
            {business.trim().length > 1 ? (
              <p className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground animate-step">
                <span className="inline-flex items-center gap-1 text-emerald-300">
                  <Check className="h-3.5 w-3.5" aria-hidden /> Taps will open {business.trim()}'s review form
                </span>
                <a href={googleSearchUrl(business)} target="_blank" rel="noopener noreferrer" className="font-semibold text-turbo underline-offset-2 hover:underline">
                  Find it on Google ↗
                </a>
              </p>
            ) : (
              <p className="mt-2 text-xs text-muted-foreground">We'll personalize your setup guide and preview below.</p>
            )}
          </div>

          {/* Summary + buy */}
          <div id="buy" className="mt-6 rounded-2xl p-4 ring-1 ring-white/10 sm:p-5" style={{ background: "linear-gradient(180deg, hsl(218 30% 10%), hsl(220 34% 7%))" }}>
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-muted-foreground">
                {style.label} · {pack.label}
              </span>
              <span className="font-display text-lg font-bold tabular-nums">{money2(pack.price)}</span>
            </div>
            <ul className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2">
              {INCLUDED.map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-turbo" aria-hidden />
                  <span className="text-foreground/85">{t}</span>
                </li>
              ))}
            </ul>
            <a ref={buyRef} href={buyHref} onClick={onBuy} rel="noopener" className="btn-ignite btn-shine mt-5 w-full !py-4 !text-base">
              {live ? "Buy now" : "Order now"} — {money2(pack.price)} <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <p className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
              <Truck className="mt-0.5 h-4 w-4 shrink-0 text-chrome" aria-hidden />
              <span>
                {eta ? (
                  <>
                    Order today, get it <span className="font-semibold text-foreground">{eta}</span>.{" "}
                  </>
                ) : null}
                {REVIEW_CARD.shipping.processing}. {REVIEW_CARD.shipping.free && REVIEW_CARD.shipping.label}.
              </span>
            </p>
            <p className="mt-2 flex items-start gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-chrome" aria-hidden />
              {REVIEW_CARD.guarantee}
            </p>
            <p className="mt-2 flex items-start gap-2 text-xs text-muted-foreground">
              <Lock className="mt-0.5 h-4 w-4 shrink-0 text-chrome" aria-hidden />
              {live ? "Secure checkout by Stripe. We never see your card number." : "We confirm your order and text or email you a secure payment link — nothing is charged until you pay."}
            </p>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            <Link to={SETUP_PATH} className="font-semibold text-turbo underline-offset-4 hover:underline">
              See the 5-minute setup guide
            </Link>{" "}
            · Questions?{" "}
            <BookButton variant="link" note="Review cards — question" prefill="I have a question about the Google review cards." className="!inline !font-semibold">
              Book a quick call
            </BookButton>
          </p>
        </div>
      </div>

      {/* Sticky mobile buy bar */}
      <div className={cn("pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/90 px-3 pt-3 backdrop-blur-xl transition-transform duration-300 lg:hidden", showBar ? "translate-y-0" : "translate-y-full")} aria-hidden={!showBar}>
        <div className="flex items-center gap-3">
          <img src="/img/review-cards/card-blue-thumb.webp" alt="" width={44} height={44} className="h-11 w-11 shrink-0 rounded-lg bg-white object-contain" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{pack.label} · {style.label}</p>
            <p className="text-xs text-muted-foreground">{money2(pack.price)} · {REVIEW_CARD.shipping.free ? "free shipping" : REVIEW_CARD.shipping.processing}</p>
          </div>
          <a href={buyHref} onClick={onBuy} tabIndex={showBar ? 0 : -1} rel="noopener" className="btn-ignite !px-5 !py-3 !text-sm">
            {live ? "Buy now" : "Order"}
          </a>
        </div>
      </div>

      <OrderDialog open={orderOpen} onOpenChange={setOrderOpen} pack={pack} style={style} business={business} />
    </>
  );
}

/** Shown while a pack has no checkout link yet: captures the order so it can be invoiced. */
function OrderDialog({ open, onOpenChange, pack, style, business }: { open: boolean; onOpenChange: (v: boolean) => void; pack: ReviewPack; style: ReviewStyle; business: string }) {
  const [f, setF] = useState({ name: "", email: "", phone: "", business: "", company_site: "" });
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [err, setErr] = useState("");
  const opened = useRef(0);
  const uid = useId();

  useEffect(() => {
    if (open) {
      opened.current = Date.now();
      setF((x) => ({ ...x, business: x.business || business }));
      if (state !== "done") setState("idle");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (f.name.trim().length < 2) return setErr("Enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(f.email.trim())) return setErr("Enter a valid email.");
    const digits = f.phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15) return setErr("Enter a valid phone number.");
    setErr("");
    setState("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, type: "order-request", product: REVIEW_CARD.name, style: style.label, pack: pack.label, total: money2(pack.price), elapsedMs: Date.now() - opened.current, page: window.location.pathname }),
      });
      if (!res.ok) throw new Error(String(res.status));
      track("order_request", { value: pack.price, currency: REVIEW_CARD.currency, style: style.id, pack: pack.id });
      rememberBusiness(f.business);
      setState("done");
    } catch {
      setState("error");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92dvh] max-w-md overflow-y-auto rounded-3xl border-white/10 bg-[hsl(220_34%_6%)] p-6 sm:p-7">
        {state === "done" ? (
          <div className="py-4 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-400/15">
              <Check className="h-7 w-7 text-emerald-300" />
            </span>
            <DialogTitle className="mt-4 text-2xl font-bold">Order received</DialogTitle>
            <DialogDescription className="mt-2 leading-relaxed text-muted-foreground">
              We'll text or email your secure payment link for {pack.label} ({style.label}, {money2(pack.price)}) shortly. Your cards ship as soon as it's paid.
            </DialogDescription>
            <Link to={SETUP_PATH} onClick={() => onOpenChange(false)} className="btn-chrome mt-6">
              Preview the setup guide
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <DialogTitle className="text-2xl font-bold">Order your review cards</DialogTitle>
            <DialogDescription className="mt-1 text-sm text-muted-foreground">
              {pack.label} · {style.label} · <span className="font-semibold text-foreground">{money2(pack.price)}</span>
              {REVIEW_CARD.shipping.free ? " · free shipping" : ""}
            </DialogDescription>
            <div className="mt-5 grid gap-3">
              {(
                [
                  ["name", "Your name", "name", "text"],
                  ["email", "Email", "email", "email"],
                  ["phone", "Mobile phone", "tel", "tel"],
                  ["business", "Business name", "organization", "text"],
                ] as const
              ).map(([k, label, ac, type]) => (
                <div key={k}>
                  <label htmlFor={`${uid}-${k}`} className="mb-1.5 block text-xs font-medium text-chrome">
                    {label}
                  </label>
                  <input id={`${uid}-${k}`} type={type} className="field" value={f[k]} onChange={(e) => setF((x) => ({ ...x, [k]: e.target.value }))} autoComplete={ac} maxLength={k === "email" ? 200 : 100} />
                </div>
              ))}
              <label className="hidden" aria-hidden>
                Company site
                <input tabIndex={-1} autoComplete="off" value={f.company_site} onChange={(e) => setF((x) => ({ ...x, company_site: e.target.value }))} />
              </label>
            </div>
            {err && (
              <p className="mt-3 text-sm font-medium text-[#ff8080]" role="alert">
                {err}
              </p>
            )}
            {state === "error" && (
              <p className="mt-3 text-sm text-[#ff8080]" role="alert">
                Couldn't send that. Check your connection and try again.
              </p>
            )}
            <button type="submit" disabled={state === "sending"} className="btn-ignite btn-shine mt-5 w-full !py-4">
              {state === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Send my order — {money2(pack.price)}
            </button>
            <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
              Nothing is charged now. We'll contact you by email, call or text to confirm and send a secure payment link.{" "}
              <Link to="/privacy-policy" className="underline underline-offset-2">
                Privacy
              </Link>{" "}
              ·{" "}
              <Link to="/shipping-returns" className="underline underline-offset-2">
                Shipping &amp; returns
              </Link>
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
