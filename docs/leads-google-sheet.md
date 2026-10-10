# Send leads to a Google Sheet (5 minutes, free)

Every free-audit lead and review-card order request is POSTed by `/api/audit` and `/api/lead`
to the URL in the `LEADS_WEBHOOK_URL` environment variable. The simplest free option is a
Google Sheet with a tiny Apps Script. Nothing is stored on the website itself.

## 1. Create the sheet and script

1. Create a new Google Sheet named **CEO Turbo Leads**.
2. **Extensions → Apps Script**. Delete what's there and paste:

```js
const SECRET = "change-me-to-a-long-random-string"; // same value as LEADS_WEBHOOK_SECRET

const COLUMNS = [
  "receivedAt", "type", "name", "email", "phone", "smsOptIn", "business", "what", "city", "website",
  "gbp", "reviews", "press", "score", "seo", "aeo", "geo", "reviewsScore", "topIssues",
  "product", "style", "pack", "total", "note", "page",
];

function doPost(e) {
  const data = JSON.parse(e.postData.contents || "{}");
  if (data.secret !== SECRET) return ContentService.createTextOutput("forbidden");
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) sheet.appendRow(COLUMNS);
  sheet.appendRow(COLUMNS.map((c) => (data[c] === undefined ? "" : data[c])));
  // Optional: email yourself every lead
  // MailApp.sendEmail("you@example.com", `New ${data.type} lead: ${data.business}`, JSON.stringify(data, null, 2));
  return ContentService.createTextOutput("ok");
}
```

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
