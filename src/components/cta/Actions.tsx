import type { MouseEvent, ReactNode } from "react";
import { Link } from "react-router-dom";
import { BOOKING, fromPriceLabel } from "@/config/site";
import { SHOP_PATH } from "@/content/review-cards";
import { openBooking } from "@/lib/cal";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

type Variant = "ignite" | "chrome" | "link";

const variantClass: Record<Variant, string> = {
  ignite: "btn-ignite",
  chrome: "btn-chrome",
  link: "inline-flex items-center gap-1.5 font-semibold text-turbo underline-offset-4 hover:underline",
};

/**
 * Opens the Brand Boost calendar (Cal.com inline embed) in an on-page dialog, tracked as booking_open and,
 * once booked, book_call. Real href so it still works without JS and is crawlable.
 */
export function BookButton({
  children = "Book a free Brand Boost call",
  note,
  prefill,
  variant = "ignite",
  className,
}: {
  children?: ReactNode;
  /** Internal source label, stored as hidden booking metadata. */
  note?: string;
  /** Visible text for the booking form's notes field. */
  prefill?: string;
  variant?: Variant;
  className?: string;
}) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    void openBooking(note, prefill);
  };
  return (
    <a href={BOOKING.url} onClick={onClick} className={cn(variantClass[variant], className)} rel="noopener">
      {children}
    </a>
  );
}

/** Goes to the Google review card store (a real link, so it works without JS and is crawlable). */
export function ShopCardsButton({ children, variant = "ignite", className }: { children?: ReactNode; variant?: Variant; className?: string }) {
  return (
    <Link to={SHOP_PATH} onClick={() => track("shop_click")} className={cn(variantClass[variant], className)}>
      {children ?? `Review cards — from ${fromPriceLabel}`}
    </Link>
  );
}
