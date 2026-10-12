import { useLocation } from "react-router-dom";
import { BookButton, ShopCardsButton } from "@/components/cta/Actions";
import { fromPriceLabel } from "@/config/site";
import { SHOP_PATH } from "@/content/review-cards";

/** Sticky bottom bar on phones: the two money actions are always one tap away. The shop page has its own buy bar. */
export function MobileActionBar({ focus = false }: { focus?: boolean }) {
  const { pathname } = useLocation();
  if (pathname === SHOP_PATH) return null;
  if (focus)
    return (
      <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/90 px-3 pt-3 backdrop-blur-xl sm:hidden">
        <BookButton note="Ad page mobile bar" className="w-full !py-3.5 !text-base">
          Get my free plan — 5 quick taps
        </BookButton>
      </div>
    );
  return (
    <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/90 px-3 pt-3 backdrop-blur-xl sm:hidden">
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <BookButton note="Mobile bar" className="!py-3 !text-sm">
          {pathname === "/brand-boost" ? "Answer 5 quick questions" : "Get my free plan"}
        </BookButton>
        <ShopCardsButton variant="chrome" className="!px-4 !py-3 !text-sm">
          Review cards {fromPriceLabel}
        </ShopCardsButton>
      </div>
    </div>
  );
}
