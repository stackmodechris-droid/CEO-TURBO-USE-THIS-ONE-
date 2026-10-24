import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Nfc, QrCode, Star } from "lucide-react";
import { REVIEW_CARD, REVIEW_STAND, fromPriceLabel } from "@/config/site";
import { SHOP_PATH } from "@/content/review-cards";
import { StandRequest } from "@/components/shop/StandRequest";

/** The stand on a glow with a pulsing tap ring and floating stars (CSS only, so it costs nothing on phones). */
export function StandHero({ className = "" }: { className?: string }) {
  return (
    <div className={`stand-stage relative mx-auto aspect-[620/640] w-full max-w-[340px] ${className}`}>
      <span className="stand-orb" aria-hidden />
      <span className="stand-ring" aria-hidden />
      <span className="stand-ring stand-ring-2" aria-hidden />
      <img src={REVIEW_STAND.image} width={REVIEW_STAND.w} height={REVIEW_STAND.h} alt="White acrylic Google review stand: Rate Your Experience, tap your phone or scan the QR code" className="stand-img relative z-10 h-full w-full object-contain" loading="lazy" decoding="async" />
      {[0, 1, 2].map((i) => (
        <Star key={i} className={`stand-star stand-star-${i} text-amber-400`} fill="currentColor" aria-hidden />
      ))}
    </div>
  );
}

/** Home page block: the stand leads, the card sits beside it. */
export function ReviewDuo() {
  const [open, setOpen] = useState(false);
  return (
    <section className="section border-t border-border" aria-labelledby="duo">
      <div className="container-x">
        <p className="chip">More 5-star reviews</p>
        <h2 id="duo" className="h-section mt-3 max-w-3xl">
          Put a review stand on your counter. Customers tap or scan, then review.
        </h2>
        <p className="lede">More fresh Google reviews help you show up in Maps and win the next customer. Pick the stand for your counter, the card for stations, trucks and tables.</p>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1.25fr_1fr]">
          <div className="panel relative overflow-hidden p-6 sm:p-8">
            <span className="absolute right-4 top-4 rounded-full bg-turbo/15 px-3 py-1 text-xs font-semibold text-turbo">Best for your counter</span>
            <div className="grid items-center gap-6 sm:grid-cols-[1fr_1fr]">
              <StandHero />
              <div>
                <h3 className="font-display text-2xl font-bold">{REVIEW_STAND.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{REVIEW_STAND.tagline}</p>
                <ul className="mt-4 grid gap-2 text-sm">
                  {[
                    [Nfc, "NFC tap for iPhone and Android"],
                    [QrCode, "QR code for any phone camera"],
                    [Star, "Opens your Google review form"],
                    [Check, "Sits on the counter, no app for customers"],
                  ].map(([Icon, t]) => {
                    const I = Icon as typeof Nfc;
                    return (
                      <li key={t as string} className="flex items-center gap-2">
                        <I className="h-4 w-4 shrink-0 text-turbo" aria-hidden />
                        {t as string}
                      </li>
                    );
                  })}
                </ul>
                <button type="button" onClick={() => setOpen(true)} className="btn-ignite btn-shine mt-6 w-full sm:w-auto">
                  Get my stand <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </div>
          </div>

          <div className="panel flex flex-col p-6 sm:p-8">
            <img src="/img/review-cards/shop-both-thumb.webp" alt="NFC Google review card, white front and black back" width={160} height={160} className="mx-auto h-40 w-40 rounded-2xl object-cover" loading="lazy" decoding="async" />
            <h3 className="mt-5 font-display text-xl font-bold">{REVIEW_CARD.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">Credit-card size, one tap opens your review form. Great for chairs, stations, trucks and tables. From {fromPriceLabel}.</p>
            <Link to={SHOP_PATH} className="btn-chrome mt-auto w-full !mt-6">
              Shop review cards
            </Link>
          </div>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Not affiliated with or endorsed by Google. Never offer rewards for reviews and don't screen who you ask.</p>
      </div>
      <StandRequest open={open} onOpenChange={setOpen} />
    </section>
  );
}
