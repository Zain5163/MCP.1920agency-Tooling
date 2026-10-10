# Muzaree — media-buying rules

The rules the daily run (`Run-MuzareeDaily.ps1`) and any chat session apply to
Muzaree's Meta ad account. Written 2026-10-08 from the owner's brief: *raise
sales, scale the account, bring cost per sale down to PKR 500–700, manage it
daily, full authority.*

Methods come from AdsPilot's own `meta-account-manager` skill (built 2026-10-08
from dated online research, `research/2026-10-08-meta-ecommerce-strategy.md`),
the `meta-ads` and `meta-performance` playbooks, and the `ad-creative`, `offers` and
`cro` skills. Read those for the reasoning; this file holds the numbers for this account.

## The account

| | |
|---|---|
| AdsPilot account | `account: "muzaree"` on every ads tool (`act_144042365972084`, PKR) |
| Pixel | `1407317194096683`, optimise for **Purchase** |
| Spend ceiling (AdsPilot) | PKR 10,000/day, 300,000/month, set in `~/.social-publisher/ad-accounts.json` |
| What we advertise | Muzaree footwear only. Never the replica-brand watches (policy risk) |

## Targets

| | Value | Why |
|---|---|---|
| **Target cost per purchase** | **PKR 500–700** (single pair); ≤ 1,200 with a two-pair bundle live | Profit maths below (client's answers 2026-10-09): break-even ~920 single pair, ~1,300 at today's average order |
| Loss line | PKR 1,000 single pair; PKR 2,000 with a bundle | Above it after learning, the ad set loses money |
| Average order (Sep–Oct) | about PKR 7,344 (≈1.2 pairs) | A 10× return on ad spend still leaves little: tax, product cost and delivery take most of each sale |
| Baseline when we took over | PKR 1,351 (1–5 Oct), 1,398 (Sep) | What "better" is measured against |
| Break-even | About PKR 920 (single pair at 6,000) to 1,300 (today's average order), at 30% refused parcels | Client's answers, 2026-10-09 |
| **Daily budget cap** | **PKR 5,000 across the whole account** (AdsPilot ceiling set to 5,500/day, 165,000/month) | Owner, 2026-10-09: results are not consistent yet; no more until they are. Proven ads get most of it; tests stay small |
| Check frequency | Every 4 hours (task `Muzaree-Ads-Check`, 03/07/15/19/23) plus the 11:00 daily report | Owner, 2026-10-09: be vigilant and proactive |

## Structure (research, 2026-10-08)

- **Two ad sets at most** across the account until it makes 50+ purchases a week (it
  makes about 28–56). Today: "Rebuild Campaign" (2 ads) and the new Chelsea-led
  campaign (6 ads). No new campaigns or ad sets; new creative goes into the new ad set.
- **Hold "Rebuild Campaign" at PKR 3,321/day** while the new ad set learns. No +20% on
  it (withdrawn 2026-10-08). After 7 days of the new ad set, move budget in 20% steps
  toward whichever ad set has the lower cost per purchase, and plan to consolidate into one.
- Highest volume bidding. No cost cap until cost per purchase has been stable for 2+ weeks.

## Creative volume

- Target **8–12 genuinely different concepts** live (Meta treats look-alike ads as one).
  Today 6 new + 2 old. Round 2 to build this week: E "Shaadi season", F "Look closer",
  plus 2–4 new formats (a short captioned video from real product footage, a native
  "notes"-style text post, a real-review post if the business supplies real reviews).
- Expect about 1 real winner in 20 new ads. That is normal.

## Cash on delivery

- Ask the owner for the courier return / refused-delivery rate. Until then, report
  cost per purchase and note that cost per **delivered** order is higher (at 25%
  returns, PKR 600 per order is PKR 800 per delivered order).
- Recommend order confirmation by WhatsApp or call before dispatch.
- Since March 2026 Meta counts click-through attribution on link clicks only (default
  7-day click, 1-day engage-through, 1-day view); Meta and Shopify will not match.

## Profit maths (client's answers, 2026-10-09; replaces the 2026-10-08 estimates)

| | Value | Source |
|---|---|---|
| Product cost | **PKR 3,500 per pair, packaging included** (box 160, shopper bag 20) | Client, 2026-10-09 |
| Selling price | PKR 5,500–6,500 per pair | Client |
| Average order | PKR 7,344 (about 1.2 pairs) | Meta pixel, last 30 days |
| Tax | **4% government tax** (retailer rate, not 18%) **+ 2.1% separate** (likely the courier's COD deduction) | Client, 2026-10-09 |
| Courier | **PKR 400+ per parcel** (Lahore courier; may cost more outside Lahore). Modelled as paid by the store | Client, 2026-10-09 |
| Refused / returned COD parcels | **30%** | Client, 2026-10-09 |
| A refused parcel costs | ~PKR 980: courier both ways (2 × 400) + packaging lost (180). The pair returns to stock | Assumption: ask whether the courier charges for returns |

**Most the ads can pay per purchase (what Meta reports) and still break even:**

| Order | Profit per delivered order | 30% refused (now) | 20% refused | 15% refused |
|---|---|---|---|---|
| Single pair at 5,500 | 1,264 | 591 | 816 | 928 |
| Single pair at 6,000 | 1,734 | **920** | 1,191 | 1,327 |
| Single pair at 6,500 | 2,204 | 1,248 | 1,567 | 1,726 |
| Average order today, 7,344 | 2,296 | **1,313** | 1,641 | 1,805 |
| Two-pair bundle 10,999 | 2,928 | 1,756 | 2,146 | 2,342 |
| **Two-pair bundle 11,998 (2 × 5,999)** | **3,866** | **2,412** | 2,897 | 3,139 |
| Cheapest model at 3,499 | **−614** | **loses money at any ad cost** | | |

Not yet counted: staff, Shopify and app fees, couriers outside Lahore charging more.

**What it means:**
- At today's order size the account breaks even at about **PKR 1,300 per purchase**; for a
  single pair at 6,000, about **PKR 920**. The 3-day average (~860–1,000) is slightly
  profitable; the new campaign's first day (1,649) lost money.
- **Never advertise the PKR 3,499 models** (cost 3,500 before courier and tax). Ad C
  "from PKR 3,499" was switched off 2026-10-09. Ask the client to raise those prices to at
  least ~PKR 5,500, or stop selling them on COD.
- **Biggest levers, in order:** (1) a two-pair bundle: break-even goes from ~1,300 to
  ~2,400 per purchase; (2) fewer refused parcels: 30% → 20% adds ~PKR 270–330 per order
  (confirm every order by phone/WhatsApp before dispatch; small prepaid discount);
  (3) cost per purchase.

**Decision lines (30% refused, single-pair offers):**
- **Target: PKR 500–700 per purchase** (keeps about a third to half of each order's profit).
- **Loss line: PKR 1,000 per purchase** after learning (3 days). Above it, cut or move budget.
- **Scale (+20%) only at or under PKR 700** for 3+ days.
- With a two-pair bundle live: target ≤ 1,200, loss line 2,000.
- Report cost per purchase **and** average order value every day.

Tax research, kept for reference: `research/2026-10-08-pakistan-ecommerce-tax-and-costs.md`
(couriers withhold ~4% of COD orders; retailer vs manufacturer rates). Not tax advice.

## Next six weeks (event-calendar skill, 2026-10-08)

| When | Event | What we do | Launch by |
|---|---|---|---|
| Now to Feb, peak Nov–Jan | **Winter + wedding (shaadi) season** | Chelsea boots lead; bring ad E "Shaadi season, sorted" forward into round 2 now (was mid-November) | Now |
| 9 Nov | Iqbal Day | Respectful post only, no discount hook | — |
| **11 Nov** (Daraz 11.11 runs ~10–21 Nov) | **11.11** | An 11.11 offer (client decides: bundle, free delivery, % off); shoppers compare with Daraz | **28 Oct** |
| **27 Nov** | **White Friday** | Biggest sale moment of the year in PK; the bundle offer fits best | **5–12 Nov** |
| **12 Dec** | **12.12** | Year-end clearance on slow colours and sizes | **28 Nov** |
| 16–31 Dec | Post-peak | Ad prices fall (~10% late Dec 2025): cheaper retargeting | — |
| 25 Dec | Quaid-e-Azam Day | Respectful tribute post, not a hard sell | — |

Lead time: creative ready a week before the launch-by date, so ads have left learning by the peak.
Rising ad prices from late October to mid-December: start event ads early at a steady
budget rather than late at a high one.

## Proposals for the business (owner to take to the client)

1. **Two-pair bundle**, e.g., "any 2 pairs for PKR 11,499" (price is the client's call). Ideal as the 11.11 and White Friday offer.
0. **Ask the accountant: retailer (~4% withheld at COD) or manufacturer (18%)?** It roughly doubles or halves what each sale can afford.
2. **Order confirmation** by WhatsApp or call before dispatch, and push the 10% prepaid discount.
3. **Free delivery only on bundles** (raise the threshold above one pair's price).
4. Lead ads with pairs priced PKR 6,000+, and the bundle.

## This account's baselines (computed 2026-10-08 from Meta history)

Judge every funnel step against these, not against generic benchmarks. Method:
`structure-and-metrics.md` in the meta-account-manager skill.

| Step | Best month (Feb 2026) | Last 30 days (to 5 Oct) |
|---|---|---|
| Cost per purchase | 636 | 1,413 |
| CPM | 251 | 345 |
| Link CTR | 2.34% | 1.74% |
| Cost per link click | 10.7 | 19.8 |
| Landing page views ÷ clicks | 78% | 79% |
| Add to cart ÷ landing page views | 5.9% | 3.5% |
| Checkout ÷ add to cart | 77% | 86% |
| Purchase ÷ checkout | 47% | 59% |
| Average order | — | PKR 7,344 |

The break is at the hook (CTR, CPC) and at add-to-cart (offer and store), not at checkout.

**Proven winners to carry forward** (90 days, by cost per purchase): "Winner | Video Ad 7"
(PKR 607, 9 sales), "Images [10+] | 13 Sept 26" (743), "Rebuild → video 3" (1,024). Videos and
multi-image ads beat single statics. Round 2 must include video: reuse these videos
(they are in the account's media library) with today's prices.

**CBO or ABO here:** one live ad set per campaign today, so they are the same. Test round 2
with ABO, or with Meta's Creative Testing inside the live ad set. When two ad sets have each
proven a cost per purchase under the current scale line (Profit maths), combine them into one CBO campaign to scale.

## Daily checks, in this order

1. **Account health.** Payment failed or account restricted, any ad rejected, pixel
   silent over 24 hours. Any of these goes first in the report, marked URGENT.
2. **Yesterday and the last 3 and 7 days** for the account and each active campaign:
   spend, purchases, cost per purchase, return on ad spend, frequency, CTR, and
   landing-page views per click.
3. **Each ad**, against the rules below.
4. **What changed** (`get_ad_activity`, 3 days), so a swing is not blamed on an ad
   when a budget edit, a payment failure or a re-review caused it.

## Structure (owner + research, 2026-10-09)

| Campaign | Role | Budget/day | Ads |
|---|---|---|---|
| Rebuild Campaign `120250837670440346` (campaign budget) | **SCALE**: proven ads only | PKR 3,000 | The proven poster, remakes of past winners at today's prices (flexible ads: several images/videos + 5 texts + 5 headlines), graduates from TEST by post ID. 6–10 ads at most |
| SALES chelsea-led `120252245878200346`, ad set `120252245878390346` (ad-set budget) | **TEST**: new concepts | PKR 2,000 | One asset per ad (so the winner is visible), 5 texts + 5 headlines, 3–4 new concepts per batch, a new batch every 3–4 days |

- **Graduate** a test ad with 3+ purchases at ≤ PKR 700: add it to SCALE using its post ID (keeps likes and comments).
- When TEST has a graduate, move to SCALE 3,500 / TEST 1,500 (≈ 70/30). Total stays PKR 5,000.
- Flexible multi-creative ads go in SCALE (they hide which asset won); single-asset ads in TEST.

## Decisions

### Stop-losses: act at once, at any check, no 3-day wait (owner, 2026-10-09)

The owner rejected watching a losing ad for days ("not just wait all day or lose all of our budget").
These apply from launch, using numbers **since the ad started** unless stated. Switching off needs no approval.

| Stop-loss | Action |
|---|---|
| **Test campaign** ad spent **≥ PKR 1,200 with 0 purchases** (2× target; research 2026-10-09) | **Switch the ad off** |
| Scaling campaign ad spent **≥ PKR 1,800 with 0 purchases** (≈ 2× break-even for a single pair) | **Switch the ad off** |
| Ad spent **≥ PKR 2,600 at over PKR 1,300 per purchase** (over break-even at today's average order) | **Switch the ad off** |
| Ad spent **≥ PKR 1,200 today, 0 purchases today, link CTR under 1.0%** | **Switch the ad off** |
| Ad shows a price below cost, a discount the store does not have, or an expired offer | **Switch the ad off** and queue a corrected version |
| The account is over PKR 5,000 today **and** over PKR 1,300 per purchase today by 19:00 | Flag URGENT with the numbers; propose the cut (budget changes need approval) |

Intraday, only switch ads off. Budget changes and structure edits are batched once a day at the 11:00 run
(intraday edits and on/off toggling disturb delivery; the last 48 hours of purchases are provisional).

Exceptions: never the **last** running ad in an ad set; the proven ad ("Images Only [10+]") only when its
3-day cost is over PKR 1,300. Purchases arrive up to 7 days after a click, so a day that looks bad at
19:00 often improves; the stop-losses are set wide enough for that.

### Slower decisions (3 days of data)

The rules below need 3 days or PKR 2,100 of spend (3 × target): purchases can arrive up to 7 days
after the click, and the last two days always look worse than they will.

| Situation (7-day numbers unless stated) | Action | Approval? |
|---|---|---|
| Ad spent ≥ PKR 2,100 and 0 purchases, and is 3+ days old (≈3.5× target, 1.5× today's average: research says 2–3× target, raised because the account still averages PKR 1,350) | **Switch the ad off** | No: stopping spend never waits |
| Ad spent ≥ PKR 3,000 at over PKR 1,000 per purchase (2× the loss line) | **Switch the ad off** | No |
| Ad set at or under the **scale line** (PKR 450 single pair; 700 with a bundle live) over 3 days, ≥ 5 purchases, out of learning, no budget change in the last 3 days | **Propose +20% budget** | **Yes** |
| Ad set still at or under the scale line after 7 days | Propose +20% again (never a bigger jump) | **Yes** |
| Ad set over the **loss line** (PKR 500 single pair; 1,000 with a bundle) for 3 days after learning | Propose −20%, or moving its budget to the winner; say plainly it is losing money | **Yes** |
| Ad frequency over 3, or CTR down 20%+ week on week | Queue a fresh version of the **same angle** (new hook or image) beside it | **Yes** (new ads) |
| An angle wins (lowest cost per purchase with enough spend) | Make 2–3 new ads on that angle for the next round | **Yes** |
| In learning, or too little data | **Wait. Change nothing.** | — |

Never:
- switch off the **last** running ad in an ad set;
- change a budget by more than 20% at once, or twice within 3 days;
- edit a running ad's text or image (it restarts learning): launch a new ad beside it;
- narrow targeting as a fix (the creative does the targeting);
- go around the AdsPilot spend ceiling.

## Creative pipeline

- Round 1 (live from Oct 2026): ads D, G, H (Chelsea boots), A, B, C (loafers). See `STATUS.md`.
- Round 2, ready: `campaigns/2026-10-06-six-angles/refresh-round2.json`. E "Shaadi season,
  sorted." (use from mid-November) and F "Look closer.".
- Every new ad uses a real Muzaree product photo, the store's live price, and only
  claims the store makes (Cash on Delivery, Easy Exchange, 10% off for advance
  payment). Check prices on muzaree.com before reusing a creative: a sale price
  that changed makes the ad wrong.
- Chelsea boots are the lead product through winter (Oct–Feb). Loafers are the
  year-round base.

## What the business must fix (blocks the PKR 600 target as much as the ads do)

Listed in `STATUS.md` under "Website problems": contradictory free-delivery limits,
a stale "AZADI SALE" banner, template claims ($100 shipping, 30-day refunds, 3000+
reviews), and coupon codes shown publicly. Add-to-cart fell from 5.9% of visitors
(Feb) to 3.5% (Sep). Repeat this in the report until it is fixed.

## Report

Each daily run writes `reports/YYYY-MM-DD.md`:

1. **Headline:** yesterday, 3-day and 7-day spend, purchases, cost per purchase
   against PKR 600, and return on ad spend. One sentence on whether it is working.
2. **Done today:** every ad switched off, with its numbers and the rule that fired.
3. **Waiting for your yes:** each proposal, with the exact tool call it needs. These
   are also added to `PENDING-APPROVALS.md`.
4. **Watch:** anything near a rule but not over it.
5. **Urgent**, at the top when present: payment, rejection, pixel, site down.

Plain words, real numbers only, and no proposal described as done.
