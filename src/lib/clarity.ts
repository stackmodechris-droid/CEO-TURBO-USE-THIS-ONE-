// Microsoft Clarity (session recordings + heatmaps for the ad landing pages). The project id is
// built in; VITE_CLARITY_ID overrides it. Form fields carry data-clarity-mask so names, emails and
// phone numbers are never recorded; see the privacy policy.
export const DEFAULT_CLARITY_ID = "ywmvopjye1";
let started = false;

export function startClarity() {
  const id = (import.meta.env.VITE_CLARITY_ID as string | undefined) || DEFAULT_CLARITY_ID;
  if (!id || started || typeof window === "undefined") return;
  started = true;
  const w = window as unknown as { clarity?: (...args: unknown[]) => void };
  w.clarity =
    w.clarity ||
    function (...args: unknown[]) {
      ((w.clarity as unknown as { q?: unknown[] }).q = (w.clarity as unknown as { q?: unknown[] }).q || []).push(args);
    };
  // No cookie banner (US audience): grant up front so sessions link across pages.
  w.clarity("consentv2", { ad_Storage: "granted", analytics_Storage: "granted" });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.clarity.ms/tag/${encodeURIComponent(id)}`;
  document.head.appendChild(s);
}
