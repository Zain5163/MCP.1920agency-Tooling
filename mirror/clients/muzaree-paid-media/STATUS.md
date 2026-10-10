# Muzaree Meta Ads — status

_Updated 2026-10-08._ Read this first in any new chat about Muzaree ads.

**2026-10-09 (chat):** 8 Oct cost PKR 1,686/purchase (8,431 spent, 5 sales) on the new campaign's first day.
Ad B "price-drop-espresso" switched OFF (1,995 for 1 sale, link CTR 0.70%). Owner's cap: **PKR 5,000/day total**;
budget cuts applied on the owner's yes and read back: new campaign ad set **2,000**, Rebuild **3,000** = **PKR 5,000/day**.
AdsPilot ceiling for Muzaree lowered to 5,500/day.
**Client's answers (2026-10-09):** retailer 4% tax + 2.1%, courier 400+, **30% refused**, cost 3,500 incl. packaging.
Break-even ≈ PKR 920/purchase (single pair at 6,000), ≈ 1,300 at today's average order. Ad C ("from PKR 3,499", below cost) switched OFF.
New lines in MEDIA-BUYING-RULES.md: target 500–700, loss line 1,000, scale ≤ 700.
**9-month decline diagnosed:** `research/2026-10-09-nine-month-decline.md` (add-to-cart rate −41% is the biggest cause, then CPM +36%, CTR −25%).
**Standby account:** `Muzaree2.0` act_1618264903076196 (client's MUZAREE business, same card), in AdsPilot as `muzaree2`, ceiling 1,000/day. Pixel not yet shared to it (client's Business settings). Checks now every 4 hours (`Muzaree-Ads-Check`).

**2026-10-09 21:25 (chat):** today PKR 5,851 for 2 sales (2,925 each). Ad **A "colour-picker" switched OFF**
(since launch ~4,840 for 3 sales, ~1,610 each; over the 1,000 loss line; overrode its 3-day learning hold).
The new ad set (2,000/day) now runs D, G, H (Chelsea), which A had starved. Rebuild unchanged (7-day ~980/sale).

**2026-10-09 22:xx:** Meta rankings for the proven "Images Only" ad: quality ABOVE average, engagement ABOVE average,
**conversion rate BELOW average (bottom 35%)**: people like and click it but buy less than for competing ads. Likely causes:
its "Up to 70% OFF" (store max 57%) and the store's add-to-cart drop. Replace with the true-price Chelsea posters (round 2).
Per-ad reports now show impressions, rankings and UNTESTED (AdsPilot 8c805ed).

**2026-10-09 23:00 check** (`reports/2026-10-09-2300-check.md`): today PKR 6,240 for 3 (2,080 each). The cap rule fired (URGENT flagged) but no budget change: budgets already total 5,000 and none is allowed before 12 Oct.
"Video Only [10+]" (Rebuild) was switched OFF 21:37 PKT by AdsPilot, so **Rebuild now runs only Images Only** (the last ad; protected). New ad set runs D, G, H only, all with 0 sales since launch (D 431, G 385, H 188). No stop-loss fired.

**2026-10-10 01:00 check** (`reports/2026-10-10-0100-check.md`): delivery OK, budgets 5,000, no changes since 23:00, no stop-loss fired.
**Images Only 3-day (7–9 Oct) is now 1,659/purchase (9,953 for 6), over the 1,300 break-even**; it is protected only as Rebuild's last running ad. A replacement in Rebuild (round 2) is now urgent.

**2026-10-10 03:00 check** (`reports/2026-10-10-0300-check.md`): delivery OK, budgets 5,000, no changes, no stop-loss fired. Today PKR ~530 / 0 sales (Images Only 510). **Test ad set barely delivering (~20 in 3 h)**; recheck at 07:00.

**2026-10-10 05:00 check** (`reports/2026-10-10-0500-check.md`): delivery OK, budgets 5,000, no changes, no stop-loss fired. Today PKR ~628 / 0 sales (Images Only 592). Test ad set still only ~PKR 35 in 5 h (D 12, G 22, H 2); check its delivery/learning state at 11:00.

**2026-10-10 07:00 check** (`reports/2026-10-10-0700-check.md`): delivery OK, budgets 5,000, no changes, no stop-loss fired. Today PKR ~689 / 0 sales (Images Only 645). **Test ad set failed the delivery test: PKR ~44 in 7 h** (D 19, G 23, H 2; threshold 300). Diagnose it at 11:00.

**2026-10-10 10:55 check** (`reports/2026-10-10-1055-check.md`): **DID NOT RUN.** The AdsPilot `social-publisher` MCP timed out on connect, so no account data was read and nothing was switched off. The 11:00 run must fix or confirm the connection first.

**2026-10-10 11:15 daily run** (`reports/2026-10-10.md`): `social-publisher` connected again (10:55 URGENT cleared). No stop-loss fired, nothing switched off, no change in the account since 9 Oct 21:37 PKT.
3 d (7–9 Oct) **1,650/purchase** (18,147 for 11, ROAS 4.08×): over break-even. 7 d 1,176 (31,761 for 27, 6.61×). 9 Oct: 6,600 for 4.
Images Only 7 d 1,059 (> 1,000 rule) and "Up to 70% OFF" both fire; protected as Rebuild's last ad. **Rebuild 3 d 1,700: proposed −20% (3,000 → 2,400) for 12 Oct** in PENDING-APPROVALS.
Test ad set still barely delivering (PKR 120 by 11:00); round 2 is now the critical path. `verify_campaign` not permitted in this session.

**2026-10-10 13:00 check** (`reports/2026-10-10-1300-check.md`): delivery OK, budgets 5,000, no changes since 9 Oct 21:37, no stop-loss fired. Today PKR ~1,229 / 0 sales (Images Only 1,011, CTR 1.92%). Test ad set PKR ~217 (D 151, G 60, H 6): picking up slowly. Recheck at 19:00.

## Plan for 10–16 Oct 2026 (owner asked 2026-10-09; budget stays PKR 5,000/day)

| When | What | Needs |
|---|---|---|
| Fri 10 Oct | Build AdsPilot `add_ads_to_ad_set` (+ reuse of videos already in the account): round 2 must go into the running ad set, not a third one | Claude |
| Fri 10 Oct | Round-2 ads written and checked against live prices: (1) "video 3" re-run with corrected text (no "Mid Summer Sale"), (2) "Winner Video Ad 7" re-run (no "Flat 50% OFF"), (3) Chelsea boots 5,999 winter video/carousel, (4) E Shaadi suede loafers. Only items priced ≥ PKR 5,599 | Owner's yes on the summary |
| Sat 11 Oct | Judge ad A after 09:47 (auto: off if > PKR 1,000/purchase with ≥ 3,000 spent). Launch round 2 into ad set `120252245878390346` on the owner's yes | Owner's yes |
| Sun 12 – Tue 14 | Round 2 learns; 4-hourly checks cut any ad at PKR 2,100 with no sale | Automatic |
| Mon 13 Oct | Weekly `diagnose_account_trend` | Automatic |
| Wed 15 Oct | Budget decision inside the 5,000: shift +20% toward the campaign at ≤ PKR 700/purchase for 3 days | Owner's yes |
| By 20 Oct | 11.11 two-pair bundle ads drafted; live 28 Oct | Client's yes on the bundle |

Live store prices (muzaree.com, 2026-10-09): items at 3,499 (woven black, Peshawari ×2), 3,999 (woven brown),
4,599 (horsebit) are at or below break-even before any ad cost (a single pair needs ~PKR 4,600 at 30% refused):
never advertise them. Safe: suede loafers 5,599–8,999, Chelsea boots 5,999–6,599 (all sizes in stock).
Discounts run 27–57%: "up to 50% off" is true for some items, "flat 50% off" is not.

**Latest daily run:** 2026-10-10, `reports/2026-10-10.md`. 7 d PKR 1,176/purchase (3 d 1,650; 9 Oct 1,650), nothing switched off; Rebuild −20% proposed for 12 Oct. Previous: 2026-10-09, `reports/2026-10-09.md`; rules-table conflict (450/500 vs 700/1,000) waiting for the owner (task `Muzaree-Ads-Daily`, daily 11:00 PKT). Rules: `MEDIA-BUYING-RULES.md`. Waiting for a yes: `PENDING-APPROVALS.md`.

## The account

| | |
|---|---|
| Ad account | **Muzaree** `act_144042365972084`, PKR, Asia/Karachi, card Mastercard *0834 |
| How we reach it | Client account shared into the 1920 Agency business; AdsPilot's system-user token reads and manages it |
| Page / Instagram | `778648892002721` / `17841476929259542` |
| Pixel | `1407317194096683` "MUZAREE's pixel_current", firing (last event 2026-10-05 23:56) |
| Store | muzaree.com (Shopify). Footwear is Muzaree's own brand; most watches carry replica-brand names |

## Audit, 2026-10-06 (read-only, Meta API)

**The account is profitable.** Last 90 days: PKR 566,813 spent, 419 purchases, ROAS 4.74×,
cost per purchase about PKR 1,350, average order about PKR 6,400. Every month since January
was between 3.5× and 8.1×.

**Why it feels like "sometimes good, mostly nothing":**

1. **Small daily numbers swing a lot.** At 4–8 purchases a day, a day with 1 and a day with 12
   are both normal (September ranged from 1 to 12 on similar spend). Judge by the week.
2. **Spend was cut by about 60% on 30 Sep.** The card failed ("Payment Needed" from 01:09 to
   17:36), and right after that Rana Rashid Rajput paused the 18 Sep and 21 Sep campaigns. Only
   "Rebuild Campaign" is left, at PKR 3,321/day (it was about PKR 9,000/day across the account).
   Since then ROAS has been strong (7.8×, 4.3×, 9.6×, 11.1×) but on half the volume.
3. **One ad carries the whole account.** "Images Only [10+] | 12 Sep 26" took 47% of 90-day
   spend and about 85% of the last 7 days, at frequency 3.1. When it tires, sales drop.
4. **Testing was split too thin.** The 18 Sep and 21 Sep campaigns ran 13+ ad sets on about
   PKR 550/day each; none could get out of Meta's learning phase.
5. **All the creative looks the same** (dark luxury poster, "50% OFF"). With creative this
   similar, Meta keeps showing it to the same people.

**Other findings:**

- 🔴 **The live winning ad shows an AI drafting note to customers.** One of its text variants ends:
  *"Notice I'm deliberately not mentioning a specific price here. That allows the same ad to send
  people to the collection without creating a mismatch…"* The same ad has a headline
  "Beige Suede Loafers | Rs. 4,599", but the store now charges PKR 5,599. Some headlines say
  "up to 60% off"; the biggest discount in the store is 57%.
- Two watch ads are **disapproved** (Feb 2026). Replica-brand watches are a policy risk; keep
  ads to the Muzaree footwear brand.
- "Instagram post: NewYear GIVEAWAY" (Dec 2025) still shows ACTIVE. It spent nothing in 90 days;
  switch it off for tidiness.
- Placements, 30 days: Facebook Feed 6.1×, Instagram Stories 7.2×, Instagram Feed 5.5×,
  Instagram Reels 4.4×, **Facebook Reels 3.2× (weakest)**. Not worth excluding yet.
- Buyers are about 95% men. 25–34 and 18–24 bring most sales; 35–44 men cost the most per purchase.
- About half the spend lands from 19:00 to 01:00 Pakistan time.

## Target and evidence (owner, 2026-10-06)

**Target: PKR 500–700 per purchase** (now about 1,350). The owner left structure, angles
and budget to Claude.

The target has been hit before: **February 2026, PKR 636 per purchase**. Nearly all of it came
from Chelsea boots: "chalsea Sales Ad -3" spent PKR 132,194 for 220 purchases at PKR 601, and
two sister ads did PKR 539–549. What they had: **Chelsea boots in winter, one clear price
("Every pair only Rs. 4,499, No Extra Charges")**, and dark product posters. Images saved in
`reference/feb-chelsea-winners/`. Those old ads link to `/collections/bags`, which now
redirects to `/collections/shoes`.

Monthly funnel: add-to-cart rate fell from 5.9% of page views (Feb) to 3.5% (Sep), and
cost per 1,000 impressions rose from PKR 251 to 342. Average order rose from about PKR 5,200 to 7,000+.
Reaching PKR 600 needs both a stronger offer or creative **and** a store that converts better.

Cost caps were tried and starved (Chelsea CPR: PKR 4,133 spent in total; Loafers CPR550:
PKR 2,049). AdsPilot cannot set cost caps anyway. Lowest cost plus strong creative is the route.

## Website problems found (muzaree.com, 2026-10-06)

- The delivery terms contradict each other: the top bar says "Free Shipping on orders above
  Rs 7000"; the product-page FAQ says "PKR 150, free when you spend PKR 5000 or more".
- "AZADI SALE IS LIVE" still shows (that was the 14 August sale).
- Leftover theme text, probably untrue: "Free Shipping From all orders over $100", "Return money
  within 30 days", "Gift Voucher 20% off", "★★★★★ 3000+ Reviews". It hurts trust, and Meta can
  treat misleading landing-page claims as a policy problem.
- **Coupon codes are listed publicly** in the cart popup: `december` 20% off, `lotita` 10% off.
- Shipping-estimate country list shows Australia, UK, US and others (theme default).
- Real, usable offer: "Get 10% OFF on Advance Payment" (now in ad G's copy).

## Prepared, not created (nothing is live)

**Revised 2026-10-06 (second pass): Chelsea-led.** Campaign `Muzaree_ChelseaLed_6Angles_Oct26`, same
structure as below, with ads **D, G, H (Chelsea boots) and A, B, C (loafers)**. G = "Every pair.
One price. PKR 5,999" (February's winning format, Brown and Matt Black, every size in stock).
H = "Slip on. Stand out." (Black Suede Chelsea Limited Edition, PKR 6,599, sizes 39–42). E and F
are kept in `campaigns/2026-10-06-six-angles/refresh-round2.json` for the first creative refresh.
At a PKR 600 cost per purchase, the learning floor is about PKR 4,300/day, so PKR 5,000/day is enough.

_The table below is the first pass; `plan.json` is the current plan._

New campaign **Muzaree_Footwear_6Angles_Oct26**: Sales objective, optimising for Purchase on the
Muzaree pixel. One ad set, broad Pakistan, ages 18–65, **PKR 5,000/day**, 6 ads, each with a
4:5 Feed image and a 9:16 Stories/Reels image.

| Ad | Angle | Hook | Lands on |
|---|---|---|---|
| A | Choice / identity | "Which colour are you?" (6 real colours with prices) | Loafers collection |
| B | Price anchor | "Was PKR 11,999. Now PKR 5,999." (Espresso, every size in stock) | Espresso product page |
| C | Objection: trust | "Buying shoes online shouldn't feel like a gamble." (COD, exchange) | Loafers collection |
| D | Seasonal | "Winter's here. Your boots should be too." (Chelsea boots) | Chelsea collection |
| E | Occasion | "Shaadi season, sorted." (kurta, shalwar kameez, suit) | Loafers collection |
| F | Quality / craft | "Look closer." (feature callouts) | Loafers collection |

- Plan: `campaigns/2026-10-06-six-angles/plan.json` (exact copy, URLs and files)
- Creatives: `creatives/2026-10-06-angles/out/` (12 images), rebuilt by `build.py`
- Every shoe is a real store photo. Prices are the store's own price and compare-at price on
  2026-10-06; only well-stocked colours are used. Claims (Cash on Delivery, Easy Exchange) are
  the ones Muzaree already uses in its own ads. All landing pages return 200 in about 1 second.

**Why this structure:** one broad ad set (Meta's current guidance; the creative does the targeting),
6 clearly different angles and looks, not more small ad sets. PKR 5,000 plus Rebuild at about
PKR 4,000 brings the account back to its September level (about PKR 9,000/day at 5.0× ROAS).
At about PKR 1,350 a purchase, the learning floor is about PKR 9,600/day for a single ad set, so
expect the new ad set to stay in learning for its first week. Judge it on 7 days, not on day 1.

## Next steps, in order

0. **Done 2026-10-07:** AdsPilot works on several accounts by name. Use `account: "muzaree"`
   on every ads tool (listed in `~/.social-publisher/ad-accounts.json`, Muzaree ceiling
   PKR 10,000/day and 300,000/month). Step 1 below is no longer needed; the `.env`
   default stays 1920 Agency.
1. ~~**Owner: point AdsPilot at Muzaree.**~~ (replaced by step 0) In `~/.social-publisher/.env` set
   `META_AD_ACCOUNT_ID=144042365972084`, `META_ADS_PAGE_ID=778648892002721`,
   `META_ADS_INSTAGRAM_ID=17841476929259542`, `META_PIXEL_ID=1407317194096683` (currency stays PKR).
   Back up the file first; the 1920 Agency values are account `853868739015298`, page
   `102223309294786`, pixel `731641141950428`. Then reconnect the `social-publisher` MCP (`/mcp`),
   because it reads the file once at start-up.
   (Claude's attempt to edit the file was blocked by the permission system on 2026-10-06.)
2. `review_ad_plan` with `plan.json` → `create_ad_plan` (created **paused**; needs the owner's yes
   on the exact summary) → check Meta's review with `get_campaign_status` → `activate_campaign`
   (needs the owner's yes).
3. `change_budget` on Rebuild Campaign `120250837670440346`: PKR 3,321 → **4,000** (+20%, the
   most that won't restart learning). Needs the owner's yes.
4. Fix the live winner's leftover AI note and old price, in Ads Manager or by approval. Editing
   restarts its learning, so the alternative is to wait until the new ads are delivering.
5. Fix the website problems above (needs Shopify admin, or the owner does it).
6. Ask Muzaree for its **product margin**. Break-even ROAS = 1 ÷ margin; without it "4.7×" can't
   be called profitable for certain.
7. **Day 3–5 after launch:** read `analyze_ad_performance`. Cut ads with no purchase after about
   PKR 4,000 spent; when the ad set is at or under PKR 1,350 a purchase, scale it by 20% steps.
   Then make fresh versions of the winning angle every 2–3 weeks.
8. Keep a working backup card on the account; a failed payment stopped delivery on 30 Sep.

## Log

- 2026-10-08: two create attempts failed on `instagram_actor_id`. Fix: AdsPilot now
  sends `instagram_user_id` (commit `ea69f82`); the adapters package also had to be
  rebuilt (`dist/`), which the first attempt missed. Both empty campaign shells
  (`120252243735010346`, `120252243825150346`) were checked and deleted. Daily task
  `Muzaree-Ads-Daily` registered.
- 2026-10-08: **campaign created, PAUSED**: `Muzaree_ChelseaLed_6Angles_Oct26`, id `120252244564450346`, 1 ad set, 6 ads, PKR 5,000/day. Meta previews rendered for Feed, Instagram and Stories. Next: Meta's review (get_campaign_status), then the owner's yes to activate.
- 2026-10-08: **owner spotted the new campaign's ad set optimising for LINK_CLICKS** (objective Sales, event Purchase, no goal named → AdsPilot defaulted to clicks). Never activated, 0 spend. Meta forbids changing optimisation after creation, so the campaign was deleted. AdsPilot fixed (`1f1f697`): goal follows objective, Sales/Leads optimising for clicks is refused, every campaign is read back after creation and before activation (`verify_campaign`). Next: reconnect MCP, recreate, read the verification, then ask for activation.
- 2026-10-08: **recreated** with the fixed AdsPilot: `Muzaree_Sales_ChelseaLed_Oct26`, id `120252245878200346`, PAUSED, Sales objective, optimisation explicitly OFFSITE_CONVERSIONS on Purchase. Assessment 1 passed (live prices, stock and pages re-checked; review clean; a deliberate Sales+LINK_CLICKS test plan was refused). Assessment 2 (read-back) delayed by a Meta rate limit right after upload.
- 2026-10-08: **LIVE.** `Muzaree_Sales_ChelseaLed_Oct26` (`120252245878200346`) activated at PKR 5,000/day on the owner's "launch". Assessment 2 and 3 read-backs: 41/41 each (purchase optimisation, pixel, Page, Instagram, 6 ads, pages load). Ads IN_PROCESS (Meta review) at activation. Rebuild Campaign unchanged at PKR 3,321/day. Baselines and history now in MEDIA-BUYING-RULES.md. First judgement of the new ads: not before 2026-10-11 (3 days).
- 2026-10-08 (daily check): the new campaign's 6 ads were approved 23:32 UTC 7 Oct and started delivering 8 Oct. Early spend is mostly B (espresso loafer); G has no delivery yet. The 7-day switch-off rule (> PKR 1,000/purchase) fires on "Images Only [10+]". It was **not** switched off: it is the only selling ad, and the rules say hold Rebuild while the new ad set learns. The decision is in PENDING-APPROVALS. Landing-page views per click fell from 84% to 74%; watch it.
