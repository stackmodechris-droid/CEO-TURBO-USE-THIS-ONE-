# Custom company t-shirts — store, dropship flow, tracking, ads

Page: **https://www.ceoturbo.com/custom-company-t-shirts** (`src/pages/CompanyShirts.tsx`, designer in `src/components/shirts/`).
Shopify product: **Custom Company T-Shirts With Your Logo** — id `15418511327467`, handle `custom-company-t-shirts`, 96 variants, published to every sales channel (Online Store, Buy Button, Shop, Facebook & Instagram, Google & YouTube, Microsoft).

## How an order flows

1. The buyer uploads a logo, picks sleeves / color / placement / back print, sets a quantity per size and taps **Order**.
2. The browser renders the **print file** (transparent PNG: 2400 × 3200 px = 12" × 16" at 200 DPI for front/back, 1200 × 1200 px = 4" × 4" at 300 DPI for the left chest) and a mockup JPEG, and posts them to `/api/shirt-design`.
3. `/api/shirt-design` forwards them to the leads Apps Script, which saves the files in the Google Drive folder **CEO Turbo Shirt Designs** and adds a row to the **Shirt Designs** tab (preview image, Drive links, sizes, text, ad source). Status = *Designed*.
4. The buyer goes to Shopify checkout. Every cart line carries `Design ID`, `Placement`, `Print file` (Drive link), `Front text`, `Back text`.
5. When it's paid, Shopify's *Order payment* webhook (`/api/shopify-webhook`, already set up for review cards) adds a row to **Shirt Orders** (Status *New*) and flips the design row to *Paid* with the order number.
6. **You dropship it:** open the *Shirt Orders* row → open the print file → place the order with your print partner (below) using the sizes column and the buyer's ship-to address → set Status *Sent to printer* and paste the printer order # and tracking. Mark the Shopify order fulfilled with the tracking number.

Designs that never get paid stay on *Shirt Designs* as *Designed* — that's your abandoned-cart list (the ad source columns show which ad brought them).

## One-time setup (≈15 minutes)

1. **Apps Script** (required, or designs won't reach the sheet): open the *FREE Lead Magnet Leads* sheet → Extensions → Apps Script → paste the new `docs/leads-apps-script.js` (keep your real `SECRET`) → Save → **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**. Google asks for **Drive** permission the first time — allow it. Then run `setupSheet` once (adds the Status dropdowns/colors to the two shirt tabs).
2. **Print partner:** create a free Printful or Printify account (both dropship, no minimums, white-label packing slips). Use these blanks so the listing stays true:
   - Short sleeve: Gildan 64000 Softstyle (Printful "Unisex Basic Softstyle T-Shirt") — Black, White, Navy, Sport Grey, S–3XL.
   - Long sleeve: Gildan 64400 Softstyle long sleeve (or Gildan G240 — same colors).
   - Technique: DTG. Front print area 12" × 16", left chest 4" × 4", back 12" × 16".
   - Turn on "Use my brand" packing slips so the box says CEO Turbo.
   - Your cost is about $12–14 (short) / $17–19 (long) + about $4.75 shipping for the first shirt and about $2.40 each after. At $27.99 / $34.99 with free shipping that leaves about $8–11 per shirt before ad spend; at 24+ shirts (15% off) about $6–8.
3. **Shipping:** the page promises **free US shipping**. In Shopify → Settings → Shipping, make sure the general profile's US rate is free (it already is for review cards). If you change it, update `SHIRT.shipping` in `src/config/site.ts`.
4. **Team pricing** is live as two Shopify automatic discounts: *Team pricing: 10% off 12+ company shirts* and *15% off 24+*. Shopify applies the best one. If you change the tiers, change `SHIRT.tiers` too (the page shows them).
5. **Optional email alert:** in the Apps Script, un-comment the `MailApp.sendEmail` line for *Shirt Orders* so each paid order emails you.

## Tracking (nothing extra to install)

| Step | Event | Where it goes |
| --- | --- | --- |
| Page view | `view_item` (SKU `CT-TEE-SS` / `CT-TEE-LS`) | GA4, Meta `ViewContent` (Pixel + CAPI), TikTok, Microsoft, Reddit |
| First logo upload / text | `customize_product` | Meta `CustomizeProduct` (Pixel + CAPI), TikTok `CustomizeProduct`, Microsoft `customize_product`, GA4 |
| Order button | `add_to_cart` → `begin_checkout` (value = order total, one item per size) | all of the above + Clarity |
| Paid order | `purchase` | Shopify: Facebook & Instagram app (Meta Purchase), the custom pixel (GA4, Google Ads `purchase` label, Microsoft) — same setup as review cards |

Ad click ids and UTMs ride on the cart (order notes) and on the checkout URL, and land on the *Shirt Designs* and *Shirt Orders* rows. Optional in Meta Events Manager: rank **CustomizeProduct** under Purchase / InitiateCheckout.

## Google Ads campaign (built, PAUSED)

**CEO Turbo | Company Shirts | Search** — campaign id `24358056151`, $25/day, Maximize conversions, United States.

| Ad group | Landing page | Keywords (avg monthly US searches / avg CPC from Keyword Planner, Oct 2026) |
| --- | --- | --- |
| Company Shirts With Logo | `/custom-company-t-shirts` | company shirts with logo (4,400 / $6.37), business shirts with logo (4,400), company t shirts (1,000 / $8.28), custom company shirts (590 / $7.03), company tee shirts, personalized company shirts, corporate t shirts, shirts for employees… (15) |
| Custom Work Shirts | `/custom-company-t-shirts` | work shirts with logo, custom work shirts with logo, custom work shirts, employee t shirts, staff / crew shirts with logo… (12) |
| Logo T-Shirts No Minimum | `/custom-company-t-shirts` | custom shirts for business (2,400 / $6.08), logo on tee shirts (2,400 / $5.35), custom logo shirts (1,900 / $5.53), shirts for business (3,600 / $5.29), custom t shirts for business (720), logo t shirts no minimum… (14) |
| Long Sleeve Logo Shirts | `/custom-company-t-shirts?style=long` (opens on long sleeve) | custom long sleeve shirts with logo, long sleeve company shirts, long sleeve work shirts with logo… (8) |

35 negatives block DIY / start-a-shirt-business / templates / embroidery / polos / jobs / marketplaces.

**Before you turn it on:**
1. The tool created the keywords as **broad match**. Your other campaigns use phrase + exact — in Google Ads → Keywords, select all 49 → Edit → Change match type → **Phrase** (and add the top 10 as **Exact**) so $6 clicks only come from buyers.
2. Campaign settings → Goals → campaign-specific goal: **Purchase** only (untick Book appointment / Lead for this campaign).
3. Location options → **Presence** (people in the US), same as the other campaigns.
4. Add the shared sitelinks/callouts plus a callout set for this campaign: *No minimum*, *Free US shipping*, *15% off 24+*, *Free reprint promise*. Price asset: Short sleeve $27.99, Long sleeve $34.99.
5. Deploy the site so the page is live, place one test order, then enable.

**Math to watch:** at ~$6 a click and a 3% store conversion rate, a sale costs ~$200 in ads. That only pays when the average order is about 15+ shirts — which is why the page pushes the 12+/24+ tiers. If, after ~$300 of spend, the average order is under 10 shirts, lower the budget to the top 2 ad groups and raise bids on *company shirts with logo* / *custom work shirts with logo*.

## Next steps worth doing

- Add the shirts to the Google Merchant feed (`src/seo/feed.ts`) and run a Shopping campaign — Shopping clicks for apparel are usually cheaper than Search.
- Meta ads: the share image `public/og/company-shirts.jpg` and the product photos in `public/img/shirts/` work as creative; target small-business owners and optimize for **Purchase**.
- Regenerate the product photos any time with `node scripts/shirt-images.mjs`.
