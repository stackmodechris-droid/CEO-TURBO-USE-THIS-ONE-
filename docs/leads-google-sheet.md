# Send leads to a Google Sheet (5 minutes, free)

Every free-check lead (`/api/audit`), booked Brand Boost call (`/api/cal-webhook`) and review-card
order request (`/api/lead`) is POSTed to the URL in the `LEADS_WEBHOOK_URL` environment variable,
together with the ad click ids and UTMs that brought the person in. Each type lands on its own tab. The simplest free option is a
Google Sheet with a tiny Apps Script. Nothing is stored on the website itself.

## 1. The sheet and script

The sheet is **FREE Lead Magnet Leads** (tabs: Free Check Leads, Booked Calls, Card Orders, already set up
with headers, filters, a Status dropdown and colors). The script that fills it is
[`docs/leads-apps-script.js`](leads-apps-script.js).

1. Open the sheet → **Extensions → Apps Script**. Delete what's there and paste the whole file.
2. On the `const SECRET = ...` line, replace the placeholder with your `LEADS_WEBHOOK_SECRET`.
3. **Deploy → New deployment → Web app**. Execute as: **Me**. Who has access: **Anyone**. Deploy and
   authorize. Copy the **Web app URL** (ends in `/exec`).
4. Changing the script later: **Deploy → Manage deployments → Edit → New version**, so the URL stays the same.

Rows are matched to columns by header name, so you can reorder or hide columns. Booked calls are
de-duplicated by Booking ID.

## Paid card orders (Shopify) → Card Orders tab

1. Shopify admin → **Settings → Notifications → Webhooks → Create webhook**.
2. Event **Order payment**, format **JSON**, URL `https://www.ceoturbo.com/api/shopify-webhook`, latest API version. Save.
3. At the top of that Webhooks page Shopify shows *"Your webhooks will be signed with ..."*. Copy that value into Vercel as `SHOPIFY_WEBHOOK_SECRET` and redeploy.
4. Orders land on **Card Orders** with the buyer, items, ship-to, total and the ad click ids from the cart. Retries never duplicate (Order ID). Meta's Purchase still comes from the Facebook & Instagram app, so this endpoint sends nothing to Meta.

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
