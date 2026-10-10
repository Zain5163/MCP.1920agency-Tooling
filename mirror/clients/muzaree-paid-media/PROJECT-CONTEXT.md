# Muzaree Paid-Media Automation — Project Context

## Objective

Create an approval-gated data and automation platform connecting Shopify, Meta Ads, and TikTok Ads through self-hosted n8n.

## Current state

**2026-10-06: Meta ads work started through AdsPilot (AI-Automation/Social-Publisher). See
`STATUS.md` for the audit, the prepared six-angle campaign and the next steps.** Nothing has
been created or changed in the ad account yet. The n8n platform below is still planning only.

## Required planning deliverables

1. Architecture and recommended low-cost/self-hosted stack
2. Normalized cross-channel data model
3. Workflow map and ETL schedule
4. Required credentials and minimum scopes
5. Safety and human-approval boundaries
6. Implementation phases
7. First working read-only monitoring version

## Requested capabilities

- Central normalized database
- Scheduled Shopify, Meta Ads, and TikTok Ads ETL
- Campaign, ad set, ad, creative, and product-profitability monitoring
- Funnel diagnostics and creative-fatigue detection
- Rule-based alerts and approval-gated actions
- Operational dashboard
- Yesterday, 3-day, and 7-day comparisons for spend, purchases, CPA, revenue, ROAS, CPM, CTR, CPC, landing-page views, add-to-cart, checkout, and frequency

## Safety rule

Do not make live ad-account, budget, campaign, creative, publishing, or spend changes without explicit user approval at action time.

## Related project

The optimized storefront package is stored separately under `..\..\Websites\Muzaree-Shopify`.

