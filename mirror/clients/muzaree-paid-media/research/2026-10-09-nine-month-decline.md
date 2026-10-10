# Why the account declined, Feb → Sep 2026 (diagnosis, 2026-10-09)

Source: Meta Insights, account level, monthly (`time_increment=monthly`), 1 Jan – 8 Oct 2026,
read through AdsPilot. Purchases = pixel purchases (orders placed, before refusals).

| Month | Spend | Purchases | Cost/purchase | ROAS | Avg order | CPM | Link CTR | Add to cart ÷ page views | Purchase ÷ add to cart | Frequency |
|---|---|---|---|---|---|---|---|---|---|---|
| Jan | 128,653 | 119 | 1,081 | 4.5 | 4,823 | 275 | 2.74% | 3.6% | 36% | 2.1 |
| **Feb** | 166,735 | 262 | **636** | **8.1** | 5,160 | 251 | 2.34% | **5.9%** | 36% | 2.1 |
| Mar | 97,653 | 121 | 807 | 5.9 | 4,797 | 247 | 2.46% | 4.6% | 33% | 1.8 |
| Apr | 40,452 | 28 | 1,445 | 3.5 | 5,002 | 234 | 2.72% | 3.5% | 23% | 1.9 |
| May | 65,746 | 60 | 1,096 | 5.1 | 5,563 | 292 | 2.74% | 3.5% | 34% | 2.3 |
| Jun | 71,828 | 48 | 1,496 | 4.3 | 6,444 | 344 | 2.33% | 3.0% | 42% | 2.4 |
| Jul | 138,149 | 123 | 1,123 | 5.2 | 5,809 | 325 | 1.71% | 4.8% | 44% | 2.5 |
| Aug | 199,370 | 136 | 1,466 | 4.1 | 6,005 | 314 | 1.80% | 3.5% | 43% | 2.9 |
| **Sep** | 223,639 | 160 | **1,398** | 5.0 | 7,033 | 342 | 1.76% | **3.5%** | **51%** | 2.9 |
| Oct 1–8 | 33,857 | 27 | 1,254 | 6.3 | 7,870 | 294 | 1.58% | 3.9% | 52% | 1.8 |

## The decline, decomposed (Feb → Sep: cost per purchase × 2.2)

Cost per purchase = CPM ÷ (1,000 × link CTR × page-view share × add-to-cart rate × purchase rate).

| Funnel step | Feb → Sep | Effect on cost per purchase | What it points to |
|---|---|---|---|
| **Add to cart ÷ page views** | 5.9% → 3.5% (−41%) | **× 1.7, the biggest cause** | The product page and offer: higher prices (average order +36%), fewer entry-price items, contradictory delivery terms, stale banners; and out of boot season |
| **CPM** | 251 → 342 (+36%) | × 1.36 | Costlier auctions (season, competition, more spend into the same audience) |
| **Link CTR** | 2.34% → 1.76% (−25%) | × 1.33 | Creative fatigue and sameness: one dark "50% OFF" poster style; frequency 2.1 → 2.9; one ad carried ~85% of spend |
| Purchase ÷ add to cart | 36% → 51% (+42%) | × 0.70 (improved) | Checkout is not the problem |
| Spend | 167k → 224k (+34%) | | Spend was scaled while every upstream rate fell |

1.36 × 1.33 × 1.7 ÷ 1.42 ≈ 2.2, matching 636 → 1,398.

Mitigating: the average order rose 5,160 → 7,033, so ROAS fell less (8.1 → 5.0) than cost per
purchase rose. In profit terms (break-even ≈ 1,300 per purchase at a 7,344 average order, 30%
refused), Sep was around break-even and Feb clearly profitable.

## Root causes, ranked

1. **The store converts fewer visitors into carts** (−41%). Highest leverage, mostly outside Meta:
   offer and price clarity, a two-pair bundle, delivery terms that agree everywhere, real photos and
   sizes, no stale banners.
2. **Creative wore out and looked alike** (CTR −25%, frequency up). Fix: 8–12 genuinely different
   concepts, seasonal (Chelsea boots for Oct–Feb), video and multi-image (the account's cheapest sales
   historically), refreshed every 2–3 weeks.
3. **Costlier auctions** (CPM +36%). Partly seasonal; better CTR lowers effective CPM; don't push
   spend into a tiring audience.
4. **Structure and spending**: 13+ small ad sets that never left learning; one ad carrying the account;
   spend scaled without the rates to support it. Fixed: two ad sets, PKR 5,000/day cap, 4-hourly checks.

## What has been done (Oct 2026) and what is next

Done: audit; six-angle Chelsea-led Sales campaign (purchase-optimised, verified); losing ads off
(B low CTR, C below-cost price); budget to the owner's PKR 5,000/day cap; break-even model from the
client's real costs; 4-hourly checks with switch-off rules.

Next, by impact: (1) client: two-pair bundle for 11.11/White Friday, prices above cost, order
confirmation to cut 30% refusals, store fixes (delivery terms, banners, photos); (2) round-2 creative:
proven video formats re-cut with today's prices, 8–12 concepts; (3) scale the winners +20% only at
≤ PKR 700 per purchase for 3 days.
