import { useEffect, useRef, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileActionBar } from "./MobileActionBar";
import { FloatingBookButton } from "./FloatingBookButton";
import { QuizModalHost } from "@/components/quiz/QuizModalHost";
import { BookingModalHost } from "@/components/booking/BookingModalHost";
import { startSpotlight } from "@/lib/spotlight";
import { pageFor, NOT_FOUND_META } from "@/seo/pages";
import { applyHead } from "@/seo/head";
import { loadCal } from "@/lib/cal";
import { startPixel, pixelPageView } from "@/lib/pixel";
import { gtmPageView } from "@/lib/gtm";
import { startUet } from "@/lib/uet";
import { startTiktok, tiktokPageView } from "@/lib/tiktok";
import { startReddit, redditPageView } from "@/lib/reddit";
import { startClarity } from "@/lib/clarity";

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const first = useRef(true);

  // Head tags are prerendered; only update them on client-side navigation.
  useEffect(() => {
    const meta = pageFor(pathname.replace(/\/$/, "") || "/") ?? NOT_FOUND_META;
    if (first.current) {
      first.current = false;
      if (!document.title) applyHead(meta); // dev server has no prerendered head
      return;
    }
    applyHead(meta);
    // `instant`: the page sets scroll-behavior: smooth, which would otherwise animate a slow scroll-up on every page change.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    pixelPageView();
    tiktokPageView();
    redditPageView();
    gtmPageView(pathname);
  }, [pathname]);

  // Warm up the booking embed on the visitor's first interaction, so the first "Book" tap
  // opens fast without the embed weighing on initial load (or on PageSpeed lab scores).
  // Meta Pixel loads once the page is idle (ad clicks still get their PageView).
  useEffect(() => {
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: object) => number }).requestIdleCallback;
    const start = () => {
      startPixel();
      startUet();
      startTiktok();
      startReddit();
      startClarity();
      startSpotlight();
    };
    if (ric) ric(start, { timeout: 2500 });
    else setTimeout(start, 1500);
  }, []);

  useEffect(() => {
    const events = ["pointerdown", "scroll", "keydown", "touchstart"] as const;
    const start = () => {
      events.forEach((e) => window.removeEventListener(e, start));
      void loadCal();
    };
    events.forEach((e) => window.addEventListener(e, start, { once: true, passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, start));
  }, []);

  return (
    <>
      <Header />
      {/* overflow-x-clip: edge-sliding animations (the review-card phone) never make phones scroll sideways; clip keeps sticky working. */}
      <main id="main" className="overflow-x-clip">
        {children}
      </main>
      <Footer />
      <MobileActionBar />
      <FloatingBookButton />
      <QuizModalHost />
      <BookingModalHost />
    </>
  );
}
