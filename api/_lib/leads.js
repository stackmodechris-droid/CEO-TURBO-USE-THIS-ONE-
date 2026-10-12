// Lead capture. Leads are forwarded to LEADS_WEBHOOK_URL (a Google Sheet via Apps Script,
// Zapier, Make, n8n…). See docs/leads-google-sheet.md. Nothing is stored on this server.
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

const str = (v, max) => (typeof v === "string" ? v.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max) : "");
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,}$/i;

/** Validates and trims a lead. Returns { lead } or { error } (field name). */
export function cleanLead(body) {
  const name = str(body.name, 100);
  const email = str(body.email, 200).toLowerCase();
  const phone = str(body.phone, 30);
  const digits = phone.replace(/\D/g, "");
  if (name.length < 2) return { error: "name" };
  if (!EMAIL.test(email)) return { error: "email" };
  if (digits.length < 10 || digits.length > 15) return { error: "phone" };
  return {
    lead: {
      name,
      email,
      phone,
      business: str(body.business, 140),
      smsOptIn: body.smsOptIn === true,
    },
  };
}

const BUDGET_POINTS = [
  [/5,?000\s*\+|\$5,?000\+/i, 50],
  [/2,?000.*5,?000/i, 40],
  [/500.*2,?000/i, 25],
  [/under/i, 5],
];
const TIMELINE_POINTS = [
  [/asap|this week/i, 40],
  [/30 days/i, 30],
  [/few months/i, 10],
];

/**
 * Call-priority score (0-100) from the quiz answers: budget (up to 50), how soon (up to 40) and a website
 * to review (10). 70+ is "HOT" (call first), 45+ "Warm", otherwise "Cool". Shown on the sheet so the
 * booked-call list can be worked from the top.
 */
export function scoreLead({ budget = "", timeline = "", website = "" } = {}) {
  const pts = (table, v) => (table.find(([re]) => re.test(String(v)))?.[1]) ?? 0;
  const score = pts(BUDGET_POINTS, budget) + pts(TIMELINE_POINTS, timeline) + (String(website).trim() ? 10 : 0);
  return { score, priority: score >= 70 ? "HOT" : score >= 45 ? "Warm" : "Cool" };
}

/** A bot filled the hidden field, or submitted faster than a human could. */
export const isBot = (body) => !!str(body.company_site, 200) || (typeof body.elapsedMs === "number" && body.elapsedMs < 1500);

const csvSafe = (v) => (typeof v === "string" && /^[=+\-@\t\r]/.test(v) ? `'${v}` : v);

/** Sends the lead to the configured webhook. Never throws. */
export async function forwardLead(record) {
  const payload = Object.fromEntries(Object.entries({ ...record, receivedAt: new Date().toISOString() }).map(([k, v]) => [k, csvSafe(v)]));
  const url = process.env.LEADS_WEBHOOK_URL;
  if (!url) {
    // Local development: keep leads in a git-ignored file so the form can be tested end to end.
    if (!process.env.VERCEL) {
      try {
        const dir = path.resolve(".leads");
        await mkdir(dir, { recursive: true });
        await appendFile(path.join(dir, "leads.jsonl"), `${JSON.stringify(payload)}\n`);
        return { stored: "local-file" };
      } catch {
        return { stored: false };
      }
    }
    console.warn("[lead] LEADS_WEBHOOK_URL is not set — lead only in function logs:", JSON.stringify(payload));
    return { stored: false };
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: process.env.LEADS_WEBHOOK_SECRET || "", ...payload }),
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error("[lead] webhook responded", res.status, JSON.stringify(payload));
    return { stored: res.ok };
  } catch (e) {
    console.error("[lead] webhook failed", e?.message, JSON.stringify(payload));
    return { stored: false };
  }
}
