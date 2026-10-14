import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BookButton, ShopCardsButton } from "@/components/cta/Actions";
import { Phone } from "lucide-react";
import { SITE, fromPriceLabel } from "@/config/site";
import { CallLink } from "./CallLink";
import { REVIEWS_AD_PATH, SHOP_PATH } from "@/content/review-cards";
import { SHIRTS_PATH } from "@/content/company-shirts";

/** True once the visitor has finished the quiz but not booked yet — the bar should then say "pick a time", not "answer questions". */
function usePlanReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const read = () => {
      try {
        const s = JSON.parse(localStorage.getItem("ct_quiz_v2") || "null");
        setReady(s?.step === "result" && !s.booked);
      } catch {
        setReady(false);
      }
    };
    read();
    window.addEventListener("ct:quiz-sync", read);
    window.addEventListener("ct:booked", read);
    return () => {
      window.removeEventListener("ct:quiz-sync", read);
      window.removeEventListener("ct:booked", read);
    };
  }, []);
  return ready;
}

/** Sticky bottom bar on phones: the two money actions are always one tap away. The shop pages have their own buy bars. */
export function MobileActionBar({ focus = false }: { focus?: boolean }) {
  const { pathname } = useLocation();
  const planReady = usePlanReady();
  if (pathname === SHOP_PATH || pathname === SHIRTS_PATH) return null;
  if (pathname === REVIEWS_AD_PATH)
    return (
      <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/90 px-3 pt-3 backdrop-blur-xl sm:hidden">
        <div className="flex gap-2">
          <a href="#buy" className="btn-ignite flex-1 !py-3.5 !text-base">
            Get my review cards — from {fromPriceLabel}
          </a>
          <CallLink location="review ad page mobile bar" className="grid w-12 shrink-0 place-items-center rounded-2xl text-foreground ring-1 ring-white/15 hover:bg-white/5">
            <Phone className="h-5 w-5" aria-hidden />
            <span className="sr-only">Call {SITE.name} at {SITE.phone.display}</span>
          </CallLink>
        </div>
      </div>
    );
  if (focus)
    return (
      <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/90 px-3 pt-3 backdrop-blur-xl sm:hidden">
        <div className="flex gap-2">
          <BookButton note="Ad page mobile bar" className="flex-1 !py-3.5 !text-base">
            {planReady ? "Pick my call time" : "Get my free plan — 6 quick taps"}
          </BookButton>
          <CallLink location={"ad page mobile bar"} className="grid w-12 shrink-0 place-items-center rounded-2xl text-foreground ring-1 ring-white/15 hover:bg-white/5">
          <Phone className="h-5 w-5" aria-hidden />
          <span className="sr-only">Call {SITE.name} at {SITE.phone.display}</span>
        </CallLink>
        </div>
      </div>
    );
  return (
    <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/90 px-3 pt-3 backdrop-blur-xl sm:hidden">
      <div className="flex gap-2">
        <BookButton note="Mobile bar" className="flex-1 !py-3.5 !text-base">
          {planReady ? "Pick my call time" : pathname === "/brand-boost" ? "Answer 6 quick questions" : "Get my free plan"}
        </BookButton>
        <ShopCardsButton variant="chrome" className="hidden !px-3 !py-3.5 !text-sm xs:flex">
          Cards {fromPriceLabel}
        </ShopCardsButton>
        <CallLink location="mobile bar" className="grid w-12 shrink-0 place-items-center rounded-2xl text-foreground ring-1 ring-white/15 hover:bg-white/5">
          <Phone className="h-5 w-5" aria-hidden />
          <span className="sr-only">Call {SITE.name} at {SITE.phone.display}</span>
        </CallLink>
      </div>
    </div>
  );
}
