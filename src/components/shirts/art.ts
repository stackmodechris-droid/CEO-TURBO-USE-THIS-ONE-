// Turns a customer's logo + text into the print file (transparent PNG at print resolution) and the
// preview shown on the mockup. The preview is the print file at low resolution, so what they see is
// exactly what gets printed.
import ART from "@/content/shirt-art.json";

export type Placement = "chest" | "front" | "back";
export type ArtInput = {
  logo: HTMLImageElement | HTMLCanvasElement | null;
  /** Big line under the logo (company name), "" for none. */
  text: string;
  /** Small line (website, phone, slogan), "" for none. */
  subtext: string;
  ink: string;
  /** Logo width as a share of the print area, 0.3–1. */
  logoScale: number;
  /** QR code modules (true = dark), printed under the text in the ink color. */
  qr?: boolean[][] | null;
};

/** Print-area size in pixels at 300 DPI (what DTF gang-sheet printers ask for): 12" × 16" front/back, 4" × 4" chest. */
export const PRINT_PX: Record<Placement, { w: number; h: number; inches: string }> = {
  front: { w: 3600, h: 4800, inches: '12" × 16"' },
  back: { w: 3600, h: 4800, inches: '12" × 16"' },
  chest: { w: 1200, h: 1200, inches: '4" × 4"' },
};

export const AREAS = ART.areas as Record<Placement, { x: number; y: number; w: number; h: number }>;

const FONT = '"Inter Variable", "Inter", "Arial Black", Arial, sans-serif';

/** Shrinks a line until it fits the width (long company names). */
function fitText(ctx: CanvasRenderingContext2D, text: string, weight: number, size: number, maxW: number) {
  let s = size;
  ctx.font = `${weight} ${s}px ${FONT}`;
  while (s > 8 && ctx.measureText(text).width > maxW) {
    s *= 0.92;
    ctx.font = `${weight} ${s}px ${FONT}`;
  }
  return s;
}

/** Draws the design into a canvas of the given size. Layout: logo on top, then the two text lines. */
export function drawArt(canvas: HTMLCanvasElement, input: ArtInput, w: number, h: number) {
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, w, h);
  const text = input.text.trim();
  const sub = input.subtext.trim();
  const square = w === h;
  // Text sizes are relative to the width so the preview and the print file match.
  const titleSize = w * (square ? 0.16 : 0.12);
  const subSize = w * (square ? 0.085 : 0.055);
  const gap = w * 0.04;

  const qr = input.qr?.length ? input.qr : null;
  // Quiet zone of 2 modules around the code so phones can find its edges.
  const qrSize = qr ? Math.round(w * (square ? 0.5 : 0.36)) : 0;
  const qrRoom = qr ? qrSize + gap : 0;

  let logoW = 0;
  let logoH = 0;
  const logo = input.logo;
  if (logo) {
    const lw = "naturalWidth" in logo ? logo.naturalWidth : logo.width;
    const lh = "naturalHeight" in logo ? logo.naturalHeight : logo.height;
    const textRoom = (text ? titleSize * 1.25 + gap : 0) + (sub ? subSize * 1.3 + gap * 0.5 : 0) + qrRoom;
    const maxW = w * Math.min(1, Math.max(0.2, input.logoScale));
    const maxH = Math.max(h * 0.25, (square ? h : h * 0.7) - textRoom);
    const k = Math.min(maxW / lw, maxH / lh);
    logoW = lw * k;
    logoH = lh * k;
  }

  ctx.fillStyle = input.ink;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  const blockH = logoH + (logo && (text || sub) ? gap : 0) + (text ? titleSize * 1.1 : 0) + (sub ? (text ? gap * 0.5 : 0) + subSize * 1.15 : 0) + (qr && (logo || text || sub) ? gap : 0) + qrSize;
  // Chest prints are centered in their box; front and back prints start near the collar.
  let y = square ? Math.max(0, (h - blockH) / 2) : 0;
  if (logo) {
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(logo, (w - logoW) / 2, y, logoW, logoH);
    y += logoH + (text || sub ? gap : 0);
  }
  if (text) {
    const s = fitText(ctx, text.toUpperCase(), 800, titleSize, w * 0.98);
    ctx.fillText(text.toUpperCase(), w / 2, y);
    y += s * 1.1 + (sub ? gap * 0.5 : 0);
  }
  if (sub) {
    const s = fitText(ctx, sub, 600, subSize, w * 0.98);
    ctx.fillText(sub, w / 2, y);
    y += s * 1.15;
  }
  if (qr) {
    if (logo || text || sub) y += gap;
    const n = qr.length;
    const cell = qrSize / (n + 4);
    const x0 = (w - qrSize) / 2 + cell * 2;
    const y0 = y + cell * 2;
    for (let r = 0; r < n; r++)
      for (let c = 0; c < n; c++) if (qr[r][c]) ctx.fillRect(Math.floor(x0 + c * cell), Math.floor(y0 + r * cell), Math.ceil(cell), Math.ceil(cell));
  }
  return canvas;
}

/**
 * Makes near-white pixels transparent so a JPG logo on a white box doesn't print a white square
 * on a dark shirt. Returns a new canvas; the original image is untouched.
 */
export function removeWhite(img: HTMLImageElement, threshold = 238) {
  const c = document.createElement("canvas");
  const max = 2400;
  const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
  c.width = Math.round(img.naturalWidth * k);
  c.height = Math.round(img.naturalHeight * k);
  const ctx = c.getContext("2d")!;
  ctx.drawImage(img, 0, 0, c.width, c.height);
  const data = ctx.getImageData(0, 0, c.width, c.height);
  const p = data.data;
  for (let i = 0; i < p.length; i += 4) {
    const min = Math.min(p[i], p[i + 1], p[i + 2]);
    if (min >= threshold) p[i + 3] = 0;
    // Soft edge so anti-aliased logo edges don't keep a white halo.
    else if (min > threshold - 30) p[i + 3] = Math.min(p[i + 3], Math.round(((threshold - min) / 30) * 255));
  }
  ctx.putImageData(data, 0, 0);
  return c;
}

/** True when a logo has a mostly-white border (likely a JPG with a white background). */
export function hasWhiteBackground(img: HTMLImageElement) {
  const c = document.createElement("canvas");
  c.width = 40;
  c.height = 40;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, 40, 40);
  const p = ctx.getImageData(0, 0, 40, 40).data;
  let edge = 0;
  let white = 0;
  for (let y = 0; y < 40; y++)
    for (let x = 0; x < 40; x++) {
      if (x > 1 && x < 38 && y > 1 && y < 38) continue;
      const i = (y * 40 + x) * 4;
      edge++;
      if (p[i + 3] > 200 && Math.min(p[i], p[i + 1], p[i + 2]) > 235) white++;
    }
  return white / edge > 0.8;
}

/** PNG data URL for upload, stepping the resolution down until it fits the size budget. */
export function printPng(input: ArtInput, placement: Placement, maxChars = 2_600_000) {
  const { w, h } = PRINT_PX[placement];
  const c = document.createElement("canvas");
  for (const k of [1, 0.85, 0.7, 0.55, 0.45]) {
    const url = drawArt(c, input, Math.round(w * k), Math.round(h * k)).toDataURL("image/png");
    if (url.length <= maxChars) return { url, dpi: Math.round(300 * k) };
  }
  return null;
}

/** Rasterizes the mockup SVG element to a JPEG data URL (the picture on the order sheet). */
export async function svgToJpeg(svg: SVGSVGElement, width = 900) {
  const xml = new XMLSerializer().serializeToString(svg);
  const img = new Image();
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
  await img.decode();
  const vb = svg.viewBox.baseVal;
  const c = document.createElement("canvas");
  c.width = width;
  c.height = Math.round((width * vb.height) / vb.width);
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", 0.85);
}
