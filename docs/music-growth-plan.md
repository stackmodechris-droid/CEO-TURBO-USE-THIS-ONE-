# Artists & producers: growth plan (Oct 2026)

What's built, what the data actually says, what to launch first, and what needs your decision.

## 1. What the data says (read this before spending more)

Google Ads, last 30 days (read from the connected account on 2026-10-14):

| Campaign | Spend | Impressions | Clicks | Conversions |
|---|---|---|---|---|
| CEO Turbo \| Calls \| US Niche (contains the Artists ad group) | $6.78 | 21 | 5 | 0 |
| Review Cards \| Search \| US | $0 | 0 | 0 | 0 |

"How to get more spotify listeners" (phrase) is the best-performing keyword you have: a very high click rate for a tiny sample. It is **not yet proven**, because there are no conversions and only a handful of clicks. Treat it as a strong early signal worth a dedicated budget, not a result.

**Scaling rule (so you double down without guessing):**
1. Give the keyword its own campaign (done below) so its budget is controlled separately.
2. Run it about 2 weeks or about 100 clicks, whichever comes first, before judging it.
3. If cost per Lead or Booked call is at or under your target, raise the daily budget 20% every 3 days. If it has 100 clicks and 0 leads, fix the page or the offer before adding money. Don't add budget to fix a conversion problem.
4. Nothing counts as winning until it has produced a Lead or a Booked call in Google Ads → Goals → Conversions.

## 2. What was built

| Piece | Where | Notes |
|---|---|---|
| Artist page, refreshed | `/artist` | Adds "turn your videos into ads", shows and tours, paid features and sessions, and a clear price section |
| Producers page (new) | `/producers` | Landing page for beat-selling searches. In the header menu, footer and sitemap |
| Price section on both pages | `src/content/pricing.ts` | Reads the one price list, so it can't drift from `/pricing` |
| Google Ads upload (paused) | `docs/ads/google-ads-upload-music.csv` | 2 campaigns, 7 ad groups, 39 phrase keywords, 188 negatives, 7 responsive search ads |
| Microsoft Ads upload (paused) | `docs/ads/microsoft-ads-upload-music.csv` | Same structure, `utm_source=bing`, campaign names end in `\| Microsoft` |
| Chrome audit prompt | `docs/claude-chrome-campaign-audit-prompt.md` | Paste into Claude in Chrome to check every campaign |

**Campaigns in the files**

| Campaign | Budget/day | Ad groups | Lands on |
|---|---|---|---|
| CEO Turbo \| Music \| Artists | $10 | Spotify Listeners (your winning keyword and close variants), Music Promotion, Artist Website, Shows & Booking | `/artist` |
| CEO Turbo \| Music \| Producers | $5 | Sell Beats, Beat Promotion, Producer Website | `/producers` |

All rows are **Paused**. Bids are Manual CPC, max $2.00, matching your existing campaigns. The playbook settings in `docs/ads-launch-playbook.md` section 3 still apply after import: turn off Search Partners and Display, set location to "people in", switch off AI Max / final URL expansion / auto-created assets / auto-apply, and set only Booked call + Lead as Primary goals.

**Who the keywords target:** producers and artists searching for *how to grow*, not artists searching to *buy* beats. A "buy beats" search is a customer for your client, not for you, so those terms are negatives. The "Sell Beats" ads describe the search ads you'd run for a producer client, but the campaigns here advertise your agency to producers.

**Launch order**
1. Google Ads Editor → import the Google CSV. Review, then enable one campaign at a time.
2. Microsoft Advertising → **Import from Google Ads** (fastest) or import the Microsoft CSV. Set ad distribution to **Search only**, and "people in" for location.
3. Run the Claude-in-Chrome audit prompt before turning anything on.

## 3. Pricing: is it competitive and fair?

Benchmarks found online (these are rough and vary by source; confirm before quoting them):

| Alternative | Typical cost | Source |
|---|---|---|
| Beat marketplace storefront (BeatStars-type) | about $10–$20/month (their own pricing page is the source of truth) | [Beat selling platforms compared](https://orphiq.com/resources/beat-selling-platforms-compared), [producer guide](https://musicproductionwiki.com/articles/how-to-sell-beats-online) |
| Freelancer artist website | $500–$5,000 | [Merge](https://merge.rocks/blog/how-much-does-website-design-cost-in-2026-an-honest-pricing-guide), [Levitate](https://www.levitate.ai/blog-posts/average-website-design-cost-for-small-businesses-in-2026) |
| Agency artist or DJ website | $5,200–$15,950 (DJ estimate) | [Project Cost Estimator](https://projectcostestimator.com/cost/industry/dj) |
| Music marketing agency retainer | $2,000–$5,000/month (a planning figure, not a price list) | [Financial Models Lab](https://financialmodelslab.com/blogs/business-insights/music-marketing-agency) |

| CEO Turbo | Price | Verdict |
|---|---|---|
| Artist website | $997 one-time | Fair. Below most freelancers and far below agencies |
| Ads & tracking setup | $397 one-time | Fair. A sensible entry point if the artist already has a site |
| Turbo Growth (ads managed weekly, 4 creatives/month) | $597/month | Competitive. About a fifth to a third of an agency retainer, no contract |

**The gap is the low end.** A producer selling $30 beat leases can get a marketplace store for about $10–$20/month, so $997 up front is a hard ask. Two ways to close it, **your call (I haven't changed any price)**:
- Add a **Producer Starter** around **$297–$497**: beat-store page, licensing and pricing page, booking form, tracking. A producer recoups $497 in roughly 10–20 lease sales.
- Or keep prices and lead with the **$397 Ads & tracking setup** for producers who already have a store.

If you pick one, it's a single new entry in `src/content/pricing.ts`, and every page, FAQ and the llms.txt update from it.

## 4. Platforms and order

| Order | Platform | Role | Why |
|---|---|---|---|
| 1 | Google + Microsoft Search | Catch people already searching ("how to get more spotify listeners", "how to sell beats online") | Highest intent. Your winning signal is here |
| 1 | Meta (Instagram + Facebook) | Video ads from their clips | Best for artists and cheapest to test. You have artist proof (BIGZO) |
| 2 | TikTok | Same videos, vertical | Reuse the same cuts. Strong for music discovery |
| 3 | YouTube (bought inside Google Ads as a video campaign) | Shorts and in-stream from the same clips | Add after you know which videos work |
| Later | Spotify Ad Studio | Direct to listeners | Only once an artist has a release to push |

**Turning an artist's videos into ads (repeatable)**
1. Pull their top 3 videos by watch time. Skip anything with unlicensed samples or a label's copyrighted master.
2. Cut each into three versions: a 3-second hook, the 15–30 second body, a clear call to action (stream, follow, book, buy the beat).
3. Add captions (most people watch on mute), a vertical 9:16 master and a 1:1 crop.
4. Run 3 videos x 3 hooks = up to 9 ads at $5–$10/day total. After about 5 days, keep the top 2 and replace the rest.
5. Send listener ads to the artist's profile (not one song), show ads to people near the venue, beat ads to the producer's `/producers`-style page.

**Shows, tours, features, merch**
- The artist site (booking page, EPK, tour dates, fan signup) is what promoters and venues use. The ads fill the room and grow the list.
- "Book tours" is a site and promotion service, not a guarantee of bookings. The page copy says so. Keep it that way in sales calls too.
- Merch: connect the artist's store or a Shopify page to the site and email a drop to the fan list. Handle fulfilment separately.

## 5. Ads for review cards, business shirts, or both?

**Both, but as separate campaigns, and shirts first.**

- **Same buyer, different intent.** Both sell to local business owners. Shirts get searched for directly ("custom company t-shirts with logo", "company shirts no minimum") and the buyer can check out alone, with no call. Review cards are usually a "didn't know I needed it" purchase, which suits Meta and your own pages better than search.
- **Shirts have a tighter loop.** A search click becomes an order in one sitting, so you learn what works in days. Your Microsoft shirts campaign is already written (`docs/ads/microsoft-ads-company-shirts.csv`). Add Google next.
- **Review cards already have a campaign** (`Review Cards | Search | US` on Google, $0 spend; and a paused Microsoft campaign, id 571816100). Turn on whichever shows the better gross profit per order after 14 days.
- **Cross-sell instead of competing.** Anyone who buys one is the ideal buyer of the other. The post-booking page and the shop already link to review cards. Add a shirt link to the card order confirmation and a card link to the shirt order email.

**Decision rule** (I don't have your margins, so fill in the blanks): gross profit per order = price − blank − print − shipping − fees. After 30 clicks or 14 days per campaign, compare *cost per order ÷ gross profit per order*. Put the next dollar behind whichever is lower. If shirts are not dropshipped (see the open question below), their margin math is different from a partner-fulfilled one.

## 6. Open questions for you
1. **Shirts: dropship or in-house?** The site says "pressed and shipped from Atlanta in 2–3 business days." If a partner prints and ships, that wording and the delivery times need to change before Google and Microsoft ads go live. Inaccurate shipping claims can get ads disapproved.
2. **Producer price point:** do you want a $297–$497 Producer Starter (section 3)?
3. **Margins** for cards and shirts, so the decision rule in section 5 can pick a winner.
4. **Cal.com calendar:** confirm on your phone that the calendar loads from the quiz on `/book` before any of this traffic arrives.
