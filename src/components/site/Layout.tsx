import { useEffect, useRef, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileActionBar } from "./MobileActionBar";
import { QuizModalHost } from "@/components/quiz/QuizModalHost";
import { startSpotlight } from "@/lib/spotlight";
import { pageFor, NOT_FOUND_META } from "@/seo/pages";
import { applyHead } from "@/seo/head";
import { loadCal } from "@/lib/cal";
import { startPixel, pixelPageView } from "@/lib/pixel";
import { gtmPageView } from "@/lib/gtm";
import { startUet } from "@/lib/uet";
import { startTiktok, tiktokPageView } from "@/lib/tiktok";
import { startClarity } from "@/lib/clarity";

/** Ad landing pages: no menu or footer links to leak clicks — one job, one button. */
const FOCUS_PATHS = new Set(["/book", "/booked"]);

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const first = useRef(true);
  const focus = FOCUS_PATHS.has(pathname.replace(/\/$/, ""));

  // Head tags are prerendered; only update them on client-side navigation.
  useEffect(() => {
    const meta = pageFor(pathname.replace(/\/$/, "") || "/") ?? NOT_FOUND_META;
    if (first.current) {
      first.current = false;
      if (!document.title) applyHead(meta); // dev server has no prerendered head
      return;
    }
    applyHead(meta);
    window.scrollTo(0, 0);
    pixelPageView();
    tiktokPageView();
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
      <Header focus={focus} />
      <main id="main">{children}</main>
      <Footer focus={focus} />
      <MobileActionBar focus={focus} />
      <QuizModalHost />
    </>
  );
}
