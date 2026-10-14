# Custom company t-shirts — we print, press and ship them ourselves

Page: **https://www.ceoturbo.com/custom-company-t-shirts** (`src/pages/CompanyShirts.tsx`, designer in `src/components/shirts/`).
Shopify product: **Custom Company T-Shirts With Your Logo** — id `15418511327467`, handle `custom-company-t-shirts`, 96 variants (Style × Color × Size), published to every sales channel.
No print-on-demand company: every order is a **DTF transfer heat-pressed in Atlanta** and shipped by us.

## How an order flows

1. The buyer uploads a logo, picks sleeves / color / placement / back print, sets a quantity per size and taps **Order**.
2. The browser renders the **print file** — a transparent PNG at **300 DPI** (3600 × 4800 px = 12" × 16" for front/back, 1200 × 1200 px = 4" × 4" for the left chest; it steps down only if the logo is huge) — plus a mockup JPEG, and posts them to `/api/shirt-design`.
3. The leads Apps Script saves them in the Google Drive folder **CEO Turbo Shirt Designs** and adds a row to the **Shirt Designs** tab (preview, Drive links, sizes, text, ad source). Status *Designed*.
4. Shopify checkout. Every cart line carries `Design ID`, `Placement`, `Print file` (Drive link), `Front text`, `Back text`.
5. Paid → the *Order payment* webhook adds a row to **Shirt Orders** (Status *New*) and marks the design *Paid*.
6. **You make it** (below), then set Status *Transfers ordered → Pressed & packed → Shipped*, paste the tracking number, and mark the Shopify order fulfilled (Shopify emails the buyer).

Designs left at *Designed* = abandoned carts. The ad-source columns show which ad brought them — call or text them.

## Making the shirts (daily routine)

1. **Morning:** filter *Shirt Orders* → Status *New*. For each row open the print file and note the quantity (sizes column).
2. **Gang sheet:** upload the PNGs to your DTF printer's gang-sheet builder. Width: about **11"** for a center-front logo (10" for S/M-heavy orders), **3.5"** for a left chest, **11–12"** for a back print. Copies = number of shirts. Order before their same-day cutoff → Status *Transfers ordered*.
   - Use an **Atlanta DTF shop with same-day pickup or next-day shipping** — the page promises "pressed and shipped in 2–3 business days".
3. **Press:** follow the transfer maker's card. Typical cotton settings: **300–325°F, 10–15 s, medium-firm pressure**, peel hot or cold as they say, then re-press 5–10 s with parchment. Center front: top of the print about **3"** below the collar (about 4 finger-widths). Left chest: about 3.5" down from the shoulder seam, 4" from center.
4. **Pack and ship:** fold, poly mailer, packing slip (Shopify → order → Print packing slip). Buy the label in Shopify (Shopify Shipping = discounted USPS Ground Advantage) → Status *Shipped*.

**One-time kit (≈ $400–700):** 16" × 20" heat press (clamshell or swing-away, $250–500), Teflon sheet + parchment, heat tape, tape measure / shirt ruler, poly mailers 10" × 13" and 14.5" × 19", optional 4" × 6" thermal label printer (~$100).

**Blanks** (wholesale account at S&S Activewear, SanMar or Jiffy Shirts — Atlanta has same/next-day warehouse delivery): Gildan **64000** Softstyle (short) and **64400** Softstyle long sleeve, in Black, White, Navy, Sport Grey. Starter stock: Black and Navy in M, L, XL (the sizes that sell most), about 5 dozen. Order the rest per order.

## Profit per order (estimates — check your real supplier prices)

| | 1 shirt | 12 shirts (10% off) | 24 shirts (15% off) |
| --- | --- | --- | --- |
| Revenue (short sleeve, front) | $27.99 | $302.29 | $570.99 |
| Blanks (~$4 each) | $4 | $48 | $96 |
| DTF transfers (~$2.50 big front) | $2.50 | $30 | $60 |
| Mailer + USPS label (free shipping) | ~$6 | ~$15 | ~$22 |
| Shopify payments (2.9% + 30¢) | $1.11 | $9.07 | $16.86 |
| **Profit before ads** | **≈ $14** | **≈ $200** | **≈ $376** |

That's about **$14–17 a shirt**, compared with about $8–11 with Printful/Printify. Long sleeve ($34.99, blank ~$7–8) lands about the same per shirt. A back print (+$8 for the buyer) costs you about $2.50 in transfer, so it's roughly $5.50 extra profit. Left-chest-only transfers cost about 40¢, so those orders are the most profitable.

## Microsoft Ads (the only ad channel for shirts)

File: **`docs/ads/microsoft-ads-company-shirts.csv`** — campaign **CEO Turbo | Company Shirts | Microsoft**, PAUSED, $15/day, manual CPC, US. 4 ad groups, 45 keywords × phrase + exact = 90, 35 negatives, one responsive search ad per group. UTMs: `utm_source=bing&utm_medium=cpc&utm_campaign=company_shirts&utm_content=<ad group>`.

**Import (account 189366985):** Microsoft Advertising → Tools → **Import** → **Import from file** → upload the CSV → map as a Google Ads Editor file → review → Import. Then:

1. Campaign settings → **Ad distribution: Microsoft sites and select traffic only** (untick *Audience network*).
2. Locations → "People **in** your targeted locations".
3. **Conversion goal:** campaign uses the UET goal **Purchase** (event action `purchase`, revenue varies) — it already exists on UET `187280408`; the Shopify custom pixel sends it with the order value. The designer also sends `customize_product`, `add_to_cart` and `begin_checkout`: add `begin_checkout` as a secondary goal to watch.
4. **LinkedIn profile targeting** (Microsoft only): bid **+30%** for Company size 1–10 and 11–50, and Industries Construction, Facilities Services, Consumer Services, Restaurants, Retail, Real Estate. These are the owners who buy crew shirts.
5. Auto-apply recommendations and automatically generated assets: **off**.
6. Assets: callouts *No minimum · Free US shipping · Ships in 2–3 days · 15% off 24+*; sitelink to `/google-review-cards` ("Google review cards"); call asset (470) 502-9543.
7. Bids: start at the CSV's $2.50–3.00 max CPC. After 15–30 purchases switch to **Maximize conversions** → then **Target ROAS 300%**.

**Break-even check:** at ~$2.50 a click and ~3% of clicks buying, a sale costs about $85 in ads. An average order of 6+ shirts covers that; 12+ shirts doubles it. Look at it after $300 of spend: if the average order is under 6 shirts, keep only *Company Shirts With Logo* and *Custom Work Shirts* and push the 12+ discount harder.

The Google Ads campaign built earlier (**CEO Turbo | Company Shirts | Search**, id `24358056151`) is **paused and stays paused**. It costs nothing; delete it in Google Ads if you don't want it there.

## How to beat the big shirt companies

They win on 200 identical shirts. You win on **1–50 shirts, fast**:

- **Speed:** "Ships in 2–3 days from Atlanta" vs their 1–2 weeks. It's in every ad and on the page. Keep the promise.
- **No minimum + no setup fees + live mockup:** they quote, email a proof and want 12–24 minimum.
- **Reorders:** new hires mean steady reorders. Every *Shirt Designs* row is saved, so a reorder is "same design, 2 more in L". Text past buyers every 60–90 days.
- **Bundle with what you already sell:** offer review cards on the shirt thank-you email, and shirts to every booked-call / review-card customer (they're business owners, already in your sheet).
- **Atlanta first:** later, add a Microsoft ad group targeted to a 30-mile radius around Atlanta with "Local pickup / same-day" headlines. Locals pay more for speed.

## Tracking (already live — nothing to install)

| Step | Event | Where it goes |
| --- | --- | --- |
| Page view | `view_item` (SKU `CT-TEE-SS` / `CT-TEE-LS`) | Microsoft UET `view_item`, GA4, Meta ViewContent |
| First logo upload / text | `customize_product` | UET `customize_product`, Meta CustomizeProduct, TikTok, GA4 |
| Order button | `add_to_cart` → `begin_checkout` (value = order total) | UET, GA4, Meta, TikTok, Clarity |
| Paid order | `purchase` | Shopify custom pixel → UET + GA4; Facebook & Instagram app → Meta |

## One-time setup checklist

1. **Apps Script** (required, or designs won't reach the sheet): paste the new `docs/leads-apps-script.js` (keep your real `SECRET`) → **Deploy → Manage deployments → Edit → New version → Deploy** → allow **Drive** access → run `setupSheet` once.
2. Shopify → Settings → Shipping: US rate **free** (the page promises it).
3. Team pricing is live as two automatic discounts (10% off 12+, 15% off 24+). If you change them, change `SHIRT.tiers` in `src/config/site.ts`.
4. Buy the press kit and open the blank + DTF supplier accounts.
5. Deploy the site, place one real test order (refund it), check the *Shirt Orders* row and the Microsoft **Purchase** goal, then import and enable the Microsoft campaign.

Product photos: `node scripts/shirt-images.mjs` regenerates them. Once you've pressed your first shirts, replace them with real photos — they'll sell better.
