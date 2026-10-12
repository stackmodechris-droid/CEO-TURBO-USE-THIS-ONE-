// Microsoft Clarity (session recordings + heatmaps for the ad landing pages). Loads only once
// VITE_CLARITY_ID is set in Vercel (Clarity → Settings → Setup → your Project ID), then a redeploy.
// Without it this is a no-op. Form fields carry data-clarity-mask so names, emails and phone numbers
// are never recorded; see the privacy policy.
let started = false;

export function startClarity() {
  const id = import.meta.env.VITE_CLARITY_ID as string | undefined;
  if (!id || started || typeof window === "undefined") return;
  started = true;
  const w = window as unknown as { clarity?: (...args: unknown[]) => void };
  w.clarity =
    w.clarity ||
    function (...args: unknown[]) {
      ((w.clarity as unknown as { q?: unknown[] }).q = (w.clarity as unknown as { q?: unknown[] }).q || []).push(args);
    };
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.clarity.ms/tag/${encodeURIComponent(id)}`;
  document.head.appendChild(s);
}
