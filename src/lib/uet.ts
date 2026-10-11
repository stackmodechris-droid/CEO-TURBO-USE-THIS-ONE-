// Microsoft Advertising UET tag (Bing / Microsoft Ads conversions). Loaded from code (not GTM custom
// HTML) so the CSP can keep blocking inline scripts. Set VITE_UET_TAG_ID in Vercel
// (Microsoft Ads → Tools → UET tag → Tag ID) and redeploy; without it this is a no-op.
type Uetq = unknown[] & { push: (...a: unknown[]) => void };
const TAG_ID = import.meta.env.VITE_UET_TAG_ID as string | undefined;
let started = false;

export function startUet() {
  if (!TAG_ID || started || typeof window === "undefined") return;
  started = true;
  const w = window as unknown as { uetq?: Uetq; UET?: new (o: object) => Uetq };
  w.uetq = w.uetq || ([] as unknown as Uetq);
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://bat.bing.com/bat.js";
  s.onload = () => {
    if (!w.UET) return;
    const queued = w.uetq;
    const o = new w.UET({ ti: TAG_ID, enableAutoSpaTracking: true, q: queued });
    w.uetq = o;
    o.push("pageLoad");
  };
  document.head.appendChild(s);
}

/** Microsoft's recommended event names, so goals can be set up as "Event action equals …". */
const ACTIONS: Record<string, string> = {
  generate_lead: "submit_lead_form",
  book_call: "book_appointment",
  add_to_cart: "add_to_cart",
  begin_checkout: "begin_checkout",
  view_item: "view_item",
};

export function uetEvent(event: string, params: { value?: unknown; currency?: unknown; lead_source?: unknown }, user?: { email?: string; phone?: string }) {
  const action = ACTIONS[event];
  if (!action || typeof window === "undefined") return;
  const w = window as unknown as { uetq?: Uetq };
  w.uetq = w.uetq || ([] as unknown as Uetq);
  // Enhanced conversions: UET hashes these before sending.
  if (user?.email || user?.phone) w.uetq.push("set", { pid: { ...(user.email ? { em: user.email.trim().toLowerCase() } : {}), ...(user.phone ? { ph: user.phone.replace(/\D/g, "") } : {}) } });
  w.uetq.push("event", action, {
    ...(typeof params.lead_source === "string" ? { event_label: params.lead_source } : {}),
    ...(typeof params.value === "number" && params.value > 0 ? { revenue_value: params.value, currency: params.currency || "USD" } : {}),
  });
}
