// Bottom-right "Chat With Us" button on tablets and desktops (phones have the sticky action bar). It opens
// the same tracked Cal.com inline calendar dialog as every other booking button.
import { useLocation } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { BookButton } from "@/components/cta/Actions";
import { SHOP_PATH } from "@/content/review-cards";
import { SHIRTS_PATH } from "@/content/company-shirts";
import { ARTIST_MERCH_PATH } from "@/content/artist-merch";

const HIDDEN = new Set(["/book", "/booked", SHOP_PATH, SHIRTS_PATH, ARTIST_MERCH_PATH]);

export function FloatingBookButton() {
  const { pathname } = useLocation();
  if (HIDDEN.has(pathname.replace(/\/$/, ""))) return null;
  return (
    <div className="fixed bottom-6 right-6 z-40 hidden sm:block">
      <BookButton note="Floating chat button" className="!rounded-full !px-5 !py-3 !text-sm">
        <CalendarDays className="h-4 w-4" aria-hidden />
        Chat With Us
      </BookButton>
    </div>
  );
}
