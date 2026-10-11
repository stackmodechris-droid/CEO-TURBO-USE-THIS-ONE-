# Send leads to a Google Sheet (5 minutes, free)

Every free-check lead (`/api/audit`), booked Brand Boost call (`/api/cal-webhook`) and review-card
order request (`/api/lead`) is POSTed to the URL in the `LEADS_WEBHOOK_URL` environment variable,
together with the ad click ids and UTMs that brought the person in. Each type lands on its own tab. The simplest free option is a
Google Sheet with a tiny Apps Script. Nothing is stored on the website itself.

## 1. Create the sheet and script

1. Create a new Google Sheet named **CEO Turbo Leads**.
2. **Extensions → Apps Script**. Delete what's there and paste:

```js
const SECRET = "change-me-to-a-long-random-string"; // same value as LEADS_WEBHOOK_SECRET

// One tab per lead type. Tabs and header rows are created automatically on the first lead.
const TABS = {
  "Free check": ["receivedAt", "name", "email", "phone", "smsOptIn", "business", "what", "city", "website", "gbp", "reviews", "press", "score", "seo", "aeo", "geo", "reviewsScore", "topIssues", "page"],
  "Booked calls": ["receivedAt", "name", "email", "phone", "startTime", "event", "notes", "source", "page", "uid"],
  "Card orders": ["receivedAt", "name", "email", "phone", "business", "product", "style", "pack", "total", "note", "page"],
};
// Ad attribution, added to every tab so you can see which ad each lead came from.
const ATTR = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "msclkid", "fbclid", "landing"];

function tabFor(type) {
  if (type === "booking") return "Booked calls";
  if (String(type).indexOf("audit") === 0) return "Free check";
  return "Card orders";
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents || "{}");
  if (data.secret !== SECRET) return ContentService.createTextOutput("forbidden");
  const name = tabFor(data.type);
  const cols = TABS[name].concat(["type"], ATTR);
  const book = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = book.getSheetByName(name) || book.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(cols);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, cols.length).setFontWeight("bold");
  }
  sheet.appendRow(cols.map((c) => (data[c] === undefined ? "" : data[c])));
  // Optional: email yourself every lead
  // MailApp.sendEmail("you@example.com", `New ${name}: ${data.name}`, JSON.stringify(data, null, 2));
  return ContentService.createTextOutput("ok");
}
```

   Already using the older one-tab script? Paste this over it and use **Deploy → Manage deployments →
   Edit → New version** so the URL stays the same.
3. **Deploy → New deployment → Web app**. Execute as: **Me**. Who has access: **Anyone**. Deploy and
   authorize. Copy the **Web app URL** (ends in `/exec`).

## 2. Add the environment variables in Vercel

Project → Settings → Environment Variables:

| Name | Value |
| --- | --- |
| `LEADS_WEBHOOK_URL` | the `/exec` Web app URL |
| `LEADS_WEBHOOK_SECRET` | the same random string as `SECRET` above |
| `PSI_API_KEY` (optional) | a free Google PageSpeed Insights API key — adds a real mobile speed score to every audit |

Redeploy. Run a test audit on the live site and check the sheet.

## Local testing

`npm run dev` / `npm run preview` serve the same API. Without `LEADS_WEBHOOK_URL`, local leads are
written to `.leads/leads.jsonl` (git-ignored). To test the sheet locally, put the variables in
`.env.local`.

## Prefer a CRM?

Any tool that accepts a JSON webhook works the same way: Zapier / Make "Catch hook", GoHighLevel
inbound webhook, HubSpot via Zapier, n8n. Point `LEADS_WEBHOOK_URL` at it.
