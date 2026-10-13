import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Logo } from "@/components/site/Logo";

const embeds = () => document.querySelectorAll<HTMLScriptElement>('script[src="https://app.cal.com/embed/embed.js"]');

describe("Cal.com embed loader", () => {
  let loadCal: typeof import("@/lib/cal").loadCal;
  beforeEach(async () => {
    document.head.innerHTML = "";
    delete (window as unknown as Record<string, unknown>).Cal;
    vi.resetModules(); // the loader keeps module-level state
    ({ loadCal } = await import("@/lib/cal"));
  });

  it("does not stay broken after one failed load: the next call retries", async () => {
    const first = loadCal();
    embeds()[0].dispatchEvent(new Event("error"));
    expect(await first).toBe(false);

    const second = loadCal();
    expect(embeds()).toHaveLength(1);
    embeds()[0].dispatchEvent(new Event("load"));
    expect(await second).toBe(true);
  });

  type Queued = unknown[];
  const queue = (ns: string) => ((window.Cal as unknown as { ns: Record<string, { q: Queued[] }> }).ns[ns]?.q ?? []) as Queued[];
  const fire = (ns: string, action: string) =>
    queue(ns)
      .filter((a) => a[0] === "on" && (a[1] as { action: string }).action === action)
      .forEach((a) => (a[1] as { callback: () => void }).callback());

  it("points the embed at app.cal.com, where the booking app and embed.js live", () => {
    void loadCal();
    const init = queue("brandboost").find((a) => a[0] === "init");
    expect(init?.[2]).toEqual({ origin: "https://app.cal.com" });
  });

  it("reports a booking page that fails to load, so the visitor gets a working link instead of a blank box", async () => {
    document.body.innerHTML = '<div id="cal-test"></div>';
    const { mountInlineBooking, QUIZ_NS } = await import("@/lib/cal");
    const mounted = mountInlineBooking("cal-test", "test", undefined, { ns: QUIZ_NS });
    embeds()[0].dispatchEvent(new Event("load"));
    await new Promise((r) => setTimeout(r, 0));
    fire(QUIZ_NS, "linkFailed");
    expect(await mounted).toBe(false);
  });

  it("resolves true once the calendar shows times", async () => {
    document.body.innerHTML = '<div id="cal-test"></div>';
    const { mountInlineBooking, QUIZ_NS } = await import("@/lib/cal");
    const mounted = mountInlineBooking("cal-test", "test", undefined, { ns: QUIZ_NS });
    embeds()[0].dispatchEvent(new Event("load"));
    await new Promise((r) => setTimeout(r, 0));
    fire(QUIZ_NS, "linkReady");
    expect(await mounted).toBe(true);
  });

  it("shares one script between callers once it is loading", async () => {
    const a = loadCal();
    const b = loadCal("brandboostquiz");
    expect(embeds()).toHaveLength(1);
    embeds()[0].dispatchEvent(new Event("load"));
    expect(await Promise.all([a, b])).toEqual([true, true]);
  });
});

describe("header logo", () => {
  it("links home and scrolls to the top when you are already on the homepage", () => {
    let scrolled = false;
    window.scrollTo = (() => {
      scrolled = true;
    }) as typeof window.scrollTo;
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Logo />
      </MemoryRouter>,
    );
    const link = screen.getByRole("link", { name: /ceo turbo home/i });
    expect(link.getAttribute("href")).toBe("/");
    fireEvent.click(link);
    expect(scrolled).toBe(true);
  });

  it("is a normal link to / from inner pages", () => {
    render(
      <MemoryRouter initialEntries={["/pricing"]}>
        <Logo />
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: /ceo turbo home/i }).getAttribute("href")).toBe("/");
  });
});
