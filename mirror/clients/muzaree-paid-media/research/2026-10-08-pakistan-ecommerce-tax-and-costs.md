# Pakistan e-commerce taxes and COD costs for an online shoe store: research (2026-10-08)

Scope: a Shopify store in Pakistan selling shoes online, mostly cash on delivery (COD), in tax year 2026-27 (the year starting 1 July 2026). What tax and courier costs come out of each order, and what changed in the Finance Act 2025 and Finance Act 2026.

**This is research, not tax advice.** Pakistani e-commerce tax changed twice in 12 months and FBR guidance is still evolving. Confirm with a Pakistani tax practitioner before relying on these numbers for filings or pricing. Every claim cites a URL and date. Where sources disagree or the law is unclear, it says so.

---

## 1. Actionable summary

1. **On every COD order, the courier deducts about 4% of the cash it collects before paying you** (more if you're not on the Active Taxpayers List):
   - **2% income tax** under section 6A / 153(2A) of the Income Tax Ordinance. This is **1% if the customer pays digitally** through a bank or payment gateway instead.
   - **2% sales tax** withheld under the Sales Tax Act (Eleventh Schedule, S. No. 8), for both COD and digital payments.
   - Sources: KPMG *A Brief of Finance Act, 2026* (July 2026); FBR *Salient Features Budget 2025-26* (June 2025); FBR Sales Tax Circular 02 of 2025-26 (2 Aug 2025).
2. **Registration is effectively mandatory.** From 1 July 2025, online marketplaces and couriers may not serve unregistered e-commerce sellers. You need at least an **NTN**, and you must be on the **Active Taxpayers List (ATL)** to get the base rates. Sources: Profit/Pakistan Today (3 Sep 2025); Dawn (5 Aug 2025).
3. **Small seller (turnover up to Rs 200 million):**
   - The 2% (or 1%) income tax withheld is a **final tax** on that income by default.
   - From **tax year 2027** (the year from 1 July 2026), you may **opt out** of the final regime when filing your return.
   - Above Rs 200 million turnover, it is **adjustable** against normal tax.
   - Source: KPMG Finance Act 2026 brief (July 2026).
4. **Sales tax for a small reseller:**
   - If you're a **retailer other than Tier-1**, or a **cottage industry**, the sales tax withheld by the courier or payment intermediary is the **final discharge** of your sales tax on those online sales. No input tax is claimed.
   - Otherwise (e.g. a **manufacturer** above the cottage threshold, or a **Tier-1 retailer**), you charge **18% standard sales tax** and adjust the 2% withheld against output tax.
   - Source: FBR Circular 02 of 2025-26 (2 Aug 2025), section 3(7A).
   - **Check for Muzaree:** is it a retailer/reseller of shoes, or does it manufacture them? This decides whether the 2% is final or whether 18% applies.
5. **The "24%" figure wasn't found in any official or reputable source** (searches on 2026-10-08). Likely a mix-up of 18% sales tax with the withholding rates. Treat it as unverified and don't use it.
6. **Budget 2026-27 (Finance Act 2026, enacted 27 June 2026, effective 1 July 2026) changes affecting this store:**
   - The Rs 200 million final/adjustable split and the opt-out described above.
   - The e-commerce withholding rates stay at 1% digital / 2% COD.
   - Advance tax on foreign payments made with **debit or credit cards** (e.g. paying Meta ads with a Pakistani card) cut **from 5% to 0.5%**.
   - Tier-1 retailer now includes retailers with turnover above Rs 200 million.
   - Source: KPMG brief (July 2026).
7. **Courier costs (indicative only; courier rate cards are mostly negotiated):**
   - Delivery: about Rs 195–330 per 1 kg parcel between cities.
   - COD fee: about Rs 50–200 per parcel, or about 1.5% of order value at some couriers.
   - Provincial sales tax on the courier's *service fee*: Punjab 16%, Sindh 15%. Whether it shows on your invoice depends on the courier.
   - **RTO** (return to origin, i.e. a COD parcel refused or not delivered): you pay forward delivery plus a return charge and earn nothing.
   - RTO rates of **18–30%** are commonly cited for Pakistan COD, with fashion at the high end.
   - Sources in section 5.
8. **What to put into "true cost per delivered order" (for AdsPilot / Muzaree reporting):**
   `(ad spend + forward shipping on all shipped orders + return charges on RTO + COD fees + PST on courier fees + 4% withheld on delivered COD value) ÷ delivered orders`.
   - Treat the 2% income tax as a cost only if it's final for you.
   - The 2% sales tax withheld is a cost if it's your final discharge, or a credit if you're in the standard 18% regime.

### Worked example (illustrative; check every input)
A delivered COD order of Rs 4,000, seller on the ATL, retailer other than Tier-1:

| Line | Amount |
|---|---|
| Income tax withheld (2%) | Rs 80 |
| Sales tax withheld (2%) | Rs 80 |
| Total withheld | **Rs 160 (4%)** |

Then add the courier delivery and COD fees (and provincial tax on those fees). An RTO parcel adds forward plus return shipping with no revenue, and no tax is withheld because no cash was collected. That last point is an inference: the withholding applies to amounts "paid or payable".

If the seller isn't on the ATL, income tax withholding reportedly doubles to 4% for COD and 2% for digital. That comes from one consultant source (Baco Consultants, 14 Sep 2026); the general Tenth Schedule doubling for non-ATL persons supports it, but verify it.

---

## 2. Registered vs unregistered: what applies

| Situation | Income tax (s. 6A / 153(2A)) | Sales tax | Practical status |
|---|---|---|---|
| **Unregistered (no NTN)** | n/a | n/a | **Couriers and marketplaces are barred from serving you** from 1 July 2025 (Profit, 3 Sep 2025; Dawn, 5 Aug 2025). Selling COD through a formal courier isn't legally available. |
| **NTN, not on ATL (non-filer)** | Higher withholding: reportedly **4% COD / 2% digital** (Baco Consultants, 14 Sep 2026; single source) | 2% withheld | Get onto the ATL by filing returns. |
| **NTN + ATL, turnover ≤ Rs 200m, retailer other than Tier-1 or cottage industry** | **2% COD / 1% digital**, final by default. From TY2027 you can opt out at filing (KPMG, Jul 2026). | **2% withheld = final discharge**, no input tax (FBR Circular 02, 2 Aug 2025) | Simplest regime. Total about 4% of COD collections. |
| **Manufacturer (not cottage) or Tier-1 retailer, sales-tax registered** | 2% / 1% withheld; adjustable if turnover > Rs 200m | **18% standard rate**; the 2% withheld is adjusted against output tax in the monthly return (FBR Circular 02) | Needs an STRN and monthly sales tax returns. |
| **Turnover > Rs 200m** | **Adjustable**, normal regime (KPMG, Jul 2026) | Tier-1 if retailer turnover > Rs 200m, so standard regime (KPMG, Jul 2026) | |

**Definitions:**
- **Cottage industry** means a *manufacturer* with turnover up to **Rs 3 million**, and the definition has extra conditions (no industrial connection, residential area, up to 10 workers). This is the 2019 amendment reported by Business Recorder. Check for later changes.
- **Retailer other than Tier-1:** Tier-1 includes national/international chains and other listed categories. From 1 July 2026 it also includes retailers with annual turnover above Rs 200 million (KPMG, Jul 2026).

---

## 3. Details

### 3.1 Federal sales tax (Sales Tax Act 1990)
- **Standard rate is 18%**, unchanged in the FY2026-27 budget. Sources: tradingeconomics.com/pakistan/sales-tax-rate (retrieved 2026-10-08); Pakistan Observer, "over 3000 items to carry 18% sales tax" (June 2026); KPMG FA2026 brief referencing "rate higher than eighteen percent" (July 2026).
- **Finance Act 2025 e-commerce measures** (FBR Circular No. 02 of 2025-26, dated 2 Aug 2025, read from the official PDF):
  - New definitions of "courier", "e-commerce", "online market place" and "payment intermediary" in section 2.
  - Couriers "have been made withholding agents".
  - Section 3(3) collection mechanism: for e-stores, the **acquiring bank** withholds on online payments. For COD, "the courier or the aggregator… delivering goods and collecting cash at the doorstep" does.
  - **Section 3(7A):** tax withheld "shall be deemed as final discharge of tax liability on behalf of cottage industry and retailers other than tier-1 retailers and no input tax against such supplies shall be allowed. For the rest of the persons, sales tax shall be chargeable under standard regime and the tax withheld… shall be adjustable."
  - **Section 14(1A)/(1B):** registration of e-commerce vendors.
  - **Section 26:** online marketplaces, payment intermediaries and couriers file monthly supplier-wise statements.
- **Rate of sales tax withholding: 2%.**
  - FBR *Salient Features Budget 2025-26*, Sales Tax: "Under the proposed regime — substituting S. No. 8 of the Eleventh Schedule — payment intermediaries… will collect sales tax on digital payments, while couriers will handle tax collection for CoD transactions. Additionally, the withholding tax rate is set to increase from 1% to 2%." (June 2025).
  - Baco Consultants confirms it as enacted: "Serial 8, Eleventh Schedule … 2%" (14 Sep 2026).
  - **Uncertainty:** the Circular doesn't restate the rate, and the enacted Schedule text wasn't read directly.
- The FBR issued a user manual for payment intermediaries, couriers and marketplaces covering PSIDs, monthly statements and credit claims. Source: ProPakistani (11 Feb 2026).
- **Finance Act 2026:** the Eleventh Schedule S. No. 4 now makes individuals and AOPs withholding agents when buying from non-active taxpayers. Not the e-commerce entry. Source: KPMG (July 2026).

### 3.2 Income tax on e-commerce receipts (Income Tax Ordinance 2001)
- **Section 6A (Division IVA, First Schedule)**, introduced by Finance Act 2025 as tax on persons receiving payment for digitally ordered goods or services delivered within Pakistan via local online platforms, "including marketplace or websites".
- Rates per KPMG FA2026 brief (July 2026):
  - "(a) Digital means or banking channel by payment intermediary: 1% of the gross amount paid or payable".
  - "(b) Cash on delivery by courier service: 2% of the gross amount paid or payable".
- **Collection:** section 153(2A). The withholding agent is the payment intermediary or courier service as defined in 153(7). Source: KPMG (July 2026) withholding table.
- **Final vs adjustable (Finance Act 2026):** "The Bill proposed treating the tax so imposed as adjustable in case of a person whose turnover in a tax year exceeds two hundred million rupees. The Act has retained this provision and further allowed persons having turnover up to two hundred million rupees to opt out of the final tax regime at the time of filing their return for tax year 2027 and onwards." Source: KPMG (July 2026).
- **Minimum tax:** e-commerce turnover appears in the section 113 minimum-tax table in the same group as Tier-1 retailers and rice and flour mills. That group is 0.25% in the table layout, but the rate is read from a PDF table and needs verification. It only matters outside the final regime. Source: KPMG (July 2026).
- **Budget proposals that were not enacted:** the June 2025 budget speech proposed tiered rates (1% under Rs 10,000; 2% for Rs 10,000–20,000; 0.25% above Rs 20,000). Source: Arab News, 12 Jun 2025. The flat 1%/2% by payment mode is what appears as enacted in the KPMG FA2026 brief. Some articles still repeat the tiered rates or category rates (2% clothing / 0.25% electronics / 1% others; Digital Rights Monitor, 16 Jun 2025). **Treat those as superseded proposals.**
- **Digital Presence Proceeds Tax** (5% on foreign vendors with a significant digital presence) was **suspended retroactively from 1 July 2025**. Source: KPMG Tax News Flash (13 Nov 2025). It's relevant to whether Meta/Google ad invoices carry an extra 5%. Per KPMG, they shouldn't under that levy.

### 3.3 Other costs relevant to ad-driven sellers
- **Paying Meta/Google ads with a Pakistani debit or credit card:** advance tax on amounts remitted abroad through cards was cut **from 5% to 0.5%** by Finance Act 2026, effective 1 July 2026. Source: KPMG brief (July 2026), Division XXVII. Banks may also add FX spread and any applicable provincial or federal levies; not researched here.
- **Provincial sales tax on services** (relevant to the *courier's* service fee and other services you buy, not to your goods sales):
  - Punjab 16% (Punjab Finance Act 2025 negative-list system).
  - Sindh 15% general rate.
  - Source: search summaries of the KPMG *A Brief of Provincial Tax Laws 2025* and the Punjab Finance Bill 2025 (July 2025). Courier-specific rates and FY2026-27 provincial changes **weren't verified**. Check your courier invoice.
- **Cash limit:** a Profit headline reports "FBR sets Rs 200,000 cash limit for retail, e-commerce CoD payments" (profit.pakistantoday.com.pk/?p=209125, 2025). The article body couldn't be retrieved (HTTP 403), so the scope and consequences are **unverified**.

---

## 4. What is uncertain or unclear

1. Whether an online-only shoe seller counts as a "retailer other than Tier-1" for the final sales tax discharge, and how a seller who manufactures (or has shoes made under its own brand) is classified. **This matters most for Muzaree.**
2. The enacted wording of Eleventh Schedule S. No. 8: the base (gross COD value including delivery charges?) and whether the 2% applies when the seller is sales-tax unregistered but NTN-registered.
3. The non-ATL rates for 6A (4%/2%) come from one consultant source.
4. Whether income tax and sales tax are withheld on the delivery charge the customer pays. "Gross amount paid or payable" suggests yes.
5. How couriers treat partial deliveries, exchanges and RTO in withholding statements. Not documented in the sources found.
6. The "24%" claim: no source found.

---

## 5. Courier COD fees and RTO in Pakistan (indicative)

**Courier rates** (Track My Order, "Pakistan Courier Rates 2026", 7 Apr 2026; figures are its own "indicative 2026 ranges based on publicly available rate information", with no primary rate cards cited):

| Courier | 1 kg intercity | COD fee | Notes |
|---|---|---|---|
| TCS | Rs 275–330 | Rs 125–200 flat, tiered by value | |
| Leopards | Rs 195–220 same province; Rs 230–260 other province | Rs 100–150 per shipment | |
| M&P | Rs 235–280 | "Rs 110+/kg" | |
| PostEx | Negotiated | Negotiated | Pays COD upfront or early |

**Other COD fee figures:**
- TCS COD at 1.5% of order value (minimum Rs 20): trackmyorder.pk TCS rates guide (2026).
- Typical courier COD charge "Rs 50–80/order": Simpaisa blog (4 Jun 2026).
- **These ranges disagree.** Use the store's own courier contract.

**RTO cost:**
- You pay forward shipping plus a return charge, and receive no cash. Track My Order (7 Apr 2026) notes the "forward shipping charge plus the return charge" but gives no figures.
- Official RTO tariffs for TCS, Leopards, PostEx, Trax and M&P **weren't publicly available** in the searches. Ask each courier for its contract RTO rate (often a flat fee or a percentage of the forward charge).

**RTO rates:**
- "COD return-to-origin (RTO) rates in Pakistan routinely hit 25–30%": Simpaisa (4 Jun 2026).
- National average about 18%, with fashion and apparel highest, and Pakistan 5–8 points above other markets: EasySell COD benchmarks (2026). This is vendor content.
- COD is about 93.7% of e-commerce transactions: Simpaisa (4 Jun 2026), citing others.

**Trax and BlueEx:** no reliable 2026 public rates found.

---

## 6. Sources (dates as published; retrieved 2026-10-08)

**Official / Big-4:**
- FBR, Circular No. 02 of 2025-26 (Sales Tax & Federal Excise), 2 Aug 2025 — https://download1.fbr.gov.pk/Docs/202584118361586CircularNO02of2025-26SalesTax&FederalExcise.pdf
- FBR, Salient Features Budget 2025-26, June 2025 — https://fbr.gov.pk/Budget2025-26/SalientFeatures/Salient-Feature.pdf
- KPMG Taseer Hadi & Co., A Brief of Finance Act, 2026, July 2026 (Act enacted 27 Jun 2026, effective 1 Jul 2026) — https://assets.kpmg.com/content/dam/kpmgsites/pk/pdf/2026/07/A%20Brief%20of%20Finance%20Act%202026.pdf.coredownload.inline.pdf
- KPMG Tax News Flash, Pakistan withholding tax for digitally ordered goods, 13 Nov 2025 — https://kpmg.com/us/en/taxnewsflash/news/2025/11/tnf-pakistan-withholding-tax-and-filing-requirements-for-digitally-ordered-goods.html
- EY Tax News, Pakistan Finance Act 2025 amendments, 11 Aug 2025 — https://taxnews.ey.com/news/2025-1675-pakistan-finance-act-2025-makes-significant-amendments
- EY, Pakistan Finance Bill 2026, 17 Jun 2026 — https://taxnews.ey.com/news/2026-1296-pakistan-introduces-comprehensive-tax-reforms-and-compliance-measures-under-finance-bill-2026 (found in search; not read in full)

**News / secondary:**
- Dawn, Procedures notified for collection of tax on digital transactions, 5 Aug 2025 — https://www.dawn.com/news/1928822
- Profit/Pakistan Today, FBR issues new rules for e-commerce seller registration, 5 Aug 2025 — https://profit.pakistantoday.com.pk/2025/08/05/fbr-issues-new-rules-for-e-commerce-seller-registration-tax-on-digital-transactions/
- Profit/Pakistan Today, Online marketplaces and couriers barred from serving unregistered sellers, 3 Sep 2025 — https://profit.pakistantoday.com.pk/2025/09/03/online-marketplaces-and-couriers-barred-from-serving-unregistered-sellers
- Profit/Pakistan Today, Rs 200,000 cash limit headline (body not retrieved) — https://profit.pakistantoday.com.pk/?p=209125
- ProPakistani, FBR makes e-commerce platforms responsible for withholding sales tax, 11 Feb 2026 — https://propakistani.pk/2026/02/11/fbr-makes-e-commerce-platforms-responsible-for-withholding-sales-tax/
- Arab News, Pakistan forms body to review e-commerce tax policy, 12 Jun 2025 (tiered proposals) — https://www.arabnews.pk/pakistan/pakistan-forms-body-to-review-e-commerce-tax-policy-after-new-budget-measures-2604294
- Digital Rights Monitor, new taxes on online shopping, 16 Jun 2025 (mixes proposals; superseded) — https://digitalrightsmonitor.pk/pakistan-rolls-out-new-taxes-on-online-shopping-digital-services-and-social-media-ads/
- Baco Consultants, E-commerce tax Pakistan 2026: 1%/2% rates, 14 Sep 2026 — https://bacoconsultants.com/blogs/e-commerce-tax-pakistan-2026-1-percent-2-percent-withholding-tax-rates
- Business Recorder, cottage industry threshold reduced to Rs 3 million (2019) — https://www.brecorder.com/news/553891
- Trading Economics, Pakistan sales tax rate — https://tradingeconomics.com/pakistan/sales-tax-rate
- Pakistan Observer, Budget 2026: over 3,000 items to carry 18% sales tax, June 2026 — https://pakobserver.net/budget-2026-from-baby-formula-milk-to-electronics-over-3000-items-to-carry-18-sales-tax/
- KPMG, A Brief of Provincial Tax Laws 2025, July 2025 (PST rates via search summary) — https://assets.kpmg.com/content/dam/kpmg/pk/pdf/2025/07/A-Brief-of-Provincial-Tax-Laws-2025.pdf

**Courier costs and RTO (vendor or blog, indicative):**
- Track My Order, Pakistan Courier Rates 2026, 7 Apr 2026 — https://trackmyorder.pk/blog/comparisons/pakistan-courier-rates-2026-tcs-leopards-mnp
- Track My Order, TCS Courier Rates 2026 — https://trackmyorder.pk/blog/guides/tcs-courier-rates-2026
- Simpaisa, Why cash on delivery is killing your e-commerce business, 4 Jun 2026 — https://www.simpaisa.com/blogs/why-cash-on-delivery-is-killing-your-e-commerce-business-and-what-to-do
- EasySell, COD return rate by product category (2026) — https://easysellapp.com/blogs/wiki/cod-return-rate-by-product-category-2026
