import { useLocation } from "react-router-dom";
import { BookButton, InstallBookButton, ShopCardsButton } from "@/components/cta/Actions";
import { CALL_FIRST_SLUGS } from "@/content/services";
import { Phone } from "lucide-react";
import { SITE, fromPriceLabel } from "@/config/site";
import { CallLink } from "./CallLink";
import { REVIEWS_AD_PATH, SHOP_PATH } from "@/content/review-cards";
import { SHIRTS_PATH } from "@/content/company-shirts";
import { ARTIST_MERCH_PATH } from "@/content/artist-merch";

/** Sticky bottom bar on phones: the two money actions are always one tap away. The shop pages have their own buy bars. */
export function MobileActionBar() {
  const { pathname } = useLocation();
  if (pathname === SHOP_PATH || pathname === SHIRTS_PATH || pathname === ARTIST_MERCH_PATH) return null;
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
  if (CALL_FIRST_SLUGS.some((slug) => pathname === `/services/${slug}`))
    return (
      <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/90 px-3 pt-3 backdrop-blur-xl sm:hidden">
        <div className="flex gap-2">
          <CallLink location={`${pathname.split("/").pop()}-sticky-mobile`} className="btn-ignite flex flex-1 items-center justify-center gap-2 !py-3.5 !text-base">
            <Phone className="h-5 w-5" aria-hidden />
            Call now
          </CallLink>
          <InstallBookButton note={`${pathname.split("/").pop()}-sticky-mobile`} className="flex flex-1 items-center justify-center !py-3.5 !text-base">
            Book online
          </InstallBookButton>
        </div>
      </div>
    );
  if (pathname === "/app-marketing")
    return (
      <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/90 px-3 pt-3 backdrop-blur-xl sm:hidden">
        <div className="flex gap-2">
          <a href="#intake" className="btn-ignite flex-1 !py-3.5 !text-base">
            Get my free growth plan
          </a>
          <CallLink location="dev page mobile bar" className="grid w-12 shrink-0 place-items-center rounded-2xl text-foreground ring-1 ring-white/15 hover:bg-white/5">
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
          Book my free call
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
