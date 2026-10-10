// Builds the Google review card product images and share images from the supplier
// photos in scripts/review-cards/. Run with: node scripts/review-card-assets.mjs
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const SRC = path.resolve("scripts/review-cards");
const OUT = path.resolve("public/img/review-cards");
const OG = path.resolve("public/og");
await mkdir(OUT, { recursive: true });

const src = (f) => path.join(SRC, f);
const webp = { quality: 86, effort: 6 };

// 1) Gallery photos — kept on their white studio background, like a real product listing.
const gallery = {
  "tap-review": "tap-review.png",
  "front-back": "front-back.png",
  "card-blue": "card-blue.png",
  "blue-black": "blue-black.png",
};
for (const [name, file] of Object.entries(gallery)) {
  await sharp(src(file)).flatten({ background: "#ffffff" }).webp(webp).toFile(path.join(OUT, `${name}.webp`));
  await sharp(src(file)).flatten({ background: "#ffffff" }).resize({ width: 200 }).webp({ quality: 80 }).toFile(path.join(OUT, `${name}-thumb.webp`));
}

// 2) Transparent cut-out of the blue card for the 3D tilt hero (rounded corners masked).
const box = { left: 31, top: 41, width: 388, height: 386 };
const radius = 30;
const mask = Buffer.from(
  `<svg width="${box.width}" height="${box.height}"><rect x="0" y="0" width="${box.width}" height="${box.height}" rx="${radius}" ry="${radius}" fill="#fff"/></svg>`,
);
const cutout = await sharp(src("card-blue.png"))
  .flatten({ background: "#ffffff" })
  .extract(box)
  .composite([{ input: mask, blend: "dest-in" }])
  .png()
  .toBuffer();
await sharp(cutout).webp({ ...webp, alphaQuality: 100 }).toFile(path.join(OUT, "card-blue-cutout.webp"));

// 3) Share images (1200×630) for the shop and the free audit.
const W = 1200;
const H = 630;
const bg = (accent) =>
  Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g1" cx="78%" cy="30%" r="55%"><stop offset="0" stop-color="${accent}" stop-opacity=".45"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient>
    <radialGradient id="g2" cx="5%" cy="110%" r="60%"><stop offset="0" stop-color="#ff6b1a" stop-opacity=".28"/><stop offset="1" stop-color="#ff6b1a" stop-opacity="0"/></radialGradient>
    <pattern id="grid" width="56" height="56" patternUnits="userSpaceOnUse"><path d="M56 0H0V56" fill="none" stroke="#fff" stroke-opacity=".05"/></pattern>
  </defs>
  <rect width="100%" height="100%" fill="#05070b"/>
  <rect width="100%" height="100%" fill="url(#grid)"/>
  <rect width="100%" height="100%" fill="url(#g1)"/>
  <rect width="100%" height="100%" fill="url(#g2)"/>
</svg>`);

const text = (lines, sub, cta) =>
  Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="chrome" x1="0" y1="0" x2="0" y2="1"><stop offset=".1" stop-color="#fff"/><stop offset="1" stop-color="#9aa8b8"/></linearGradient>
    <linearGradient id="turbo" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1a9fff"/><stop offset=".5" stop-color="#6cc6ff"/><stop offset="1" stop-color="#ffb347"/></linearGradient>
    <linearGradient id="btn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9a3d"/><stop offset="1" stop-color="#ff6b1a"/></linearGradient>
  </defs>
  <text x="70" y="96" font-family="Avenir Next, Helvetica Neue, Arial" font-weight="700" font-size="28" fill="#fff">CEO <tspan fill="#1a9fff">Turbo</tspan></text>
  ${lines
    .map(
      (l, i) =>
        `<text x="66" y="${205 + i * 80}" font-family="Avenir Next, Helvetica Neue, Arial" font-weight="700" font-size="78" letter-spacing="-2.5" fill="url(#${i === lines.length - 1 ? "turbo" : "chrome"})">${l}</text>`,
    )
    .join("")}
  <text x="70" y="${205 + lines.length * 80 + 10}" font-family="Avenir Next, Helvetica Neue, Arial" font-weight="600" font-size="27" fill="#c8d3df">${sub}</text>
  <rect x="70" y="500" width="${cta.length * 15.5 + 60}" height="68" rx="16" fill="url(#btn)"/>
  <text x="100" y="545" font-family="Avenir Next, Helvetica Neue, Arial" font-weight="700" font-size="26" fill="#140700">${cta}</text>
</svg>`);

const shadow = (w, h) =>
  Buffer.from(`<svg width="${w + 160}" height="${h + 160}" xmlns="http://www.w3.org/2000/svg"><defs><filter id="b"><feGaussianBlur stdDeviation="30"/></filter></defs><rect x="80" y="110" width="${w}" height="${h}" rx="40" fill="#1a9fff" fill-opacity=".55" filter="url(#b)"/></svg>`);

// Shop share image: tilted card + headline
{
  const card = await sharp(cutout).resize({ width: 420 }).rotate(-8, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const meta = await sharp(card).metadata();
  const glow = await sharp(shadow(meta.width - 60, meta.height - 60)).png().toBuffer();
  await sharp(bg("#1a9fff"))
    .composite([
      { input: glow, left: 700, top: 20 },
      { input: card, left: 740, top: 70 },
      { input: text(["More 5-star", "Google reviews."], "Tap. Review. Done. NFC + QR review cards.", "Shop review cards"), left: 0, top: 0 },
    ])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(OG, "review-cards.jpg"));
}

// Free audit share image: score gauge + headline
{
  const gauge = Buffer.from(`<svg width="420" height="420" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="arc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff6b1a"/><stop offset="1" stop-color="#1a9fff"/></linearGradient></defs>
    <circle cx="210" cy="210" r="170" fill="#0b1018" stroke="#1b2532" stroke-width="28"/>
    <circle cx="210" cy="210" r="170" fill="none" stroke="url(#arc)" stroke-width="28" stroke-linecap="round" stroke-dasharray="${2 * Math.PI * 170 * 0.42} 2000" transform="rotate(-90 210 210)"/>
    <text x="210" y="225" text-anchor="middle" font-family="Avenir Next, Helvetica Neue, Arial" font-weight="700" font-size="120" fill="#fff">42</text>
    <text x="210" y="280" text-anchor="middle" font-family="Avenir Next, Helvetica Neue, Arial" font-weight="600" font-size="26" fill="#9aa8b8">visibility score</text>
  </svg>`);
  const chips = Buffer.from(`<svg width="420" height="60" xmlns="http://www.w3.org/2000/svg">
    ${["SEO", "AEO", "GEO"].map((l, i) => `<rect x="${i * 140}" y="0" width="124" height="52" rx="26" fill="#0b1018" stroke="#2a3646"/><text x="${i * 140 + 62}" y="34" text-anchor="middle" font-family="Avenir Next, Helvetica Neue, Arial" font-weight="700" font-size="22" fill="${["#ff6b1a", "#ffb347", "#1a9fff"][i]}">${l}</text>`).join("")}
  </svg>`);
  await sharp(bg("#1a9fff"))
    .composite([
      { input: gauge, left: 720, top: 70 },
      { input: chips, left: 728, top: 510 },
      { input: text(["Is Google &amp; AI", "sending you", "customers?"], "Free SEO, AEO &amp; GEO report in 60 seconds.", "Run my free audit"), left: 0, top: 0 },
    ])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(OG, "free-audit.jpg"));
}

console.log("review card images + share images written");
