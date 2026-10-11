// Security headers shared by vercel.json (production) and `vite preview` (local testing).
// If you add a new third-party script, iframe or API, allow its origin here.
export const CSP = [
  "default-src 'self'",
  // Tag Manager + GA4 + Google Ads, Meta Pixel, Microsoft UET
  "script-src 'self' https://app.cal.com https://cal.com https://www.googletagmanager.com https://*.googletagmanager.com https://www.google-analytics.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://www.google.com https://connect.facebook.net https://bat.bing.com",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data: blob: https:",
  "media-src 'self'",
  "frame-src https://app.cal.com https://cal.com https://*.cal.com https://www.facebook.com https://www.googletagmanager.com https://td.doubleclick.net https://bid.g.doubleclick.net",
  // + Shopify Storefront API (headless checkout)
  "connect-src 'self' https://app.cal.com https://cal.com https://*.cal.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.g.doubleclick.net https://www.google.com https://www.googleadservices.com https://pagead2.googlesyndication.com https://www.facebook.com https://connect.facebook.net https://bat.bing.com https://uweee2-sc.myshopify.com",
  "form-action 'self' https://cal.com https://app.cal.com https://www.facebook.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

export const SECURITY_HEADERS: Record<string, string> = {
  "Content-Security-Policy": CSP,
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(self)",
  "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
};
