---
name: adspilot-project
description: "AdsPilot (AI-Automation/Social-Publisher) — one MCP server for social publishing, ads and marketing; where to resume and the owner's standing priorities"
metadata:
  node_type: memory
  type: project
  originSessionId: 2e482ace-b0b2-4185-962b-a49ffb3bed17
  modified: 2026-10-10T09:34:01.396Z
---

AdsPilot (internal codename `adspilot`) lives in `D:\My AI Works\AI-Automation\Social-Publisher`.
Resume from `START-HERE.md` (the ecosystem map), then `STATUS.md` (the one status file;
open items stay in `WAITING-LIST.md` until it is folded in) and the latest entries in
`PROJECT-LOG.md`. `RULES.md` holds the owner's standing rules; every other document is on
a shelf under `docs/` (since 2026-10-10, decision 0011). Keep status in STATUS.md, not here.

Owner's priority order (2026-09-30): social media automation, then Meta ads,
then Google Ads, then everything else (SEO, WordPress, Business Profile, YouTube,
video editing tools, a TREG-style website).

**Why:** the owner wants one MCP that replaces a marketing team, sold to other
businesses, built so any AI client can run it.

**How to apply:**
- Never describe a campaign as live or an ad as approved when it is only created;
  verify against the real API and say which (the project's R4).
- Anything public or spending needs the owner's approval token; never supply one
  yourself.
- Licences matter because the product is sold: no-licence repos may be read for
  knowledge but not copied; TREG's licence forbids hosted/SaaS use of its code.
- "Expert by default" (decision 0008): every ad platform added must ship with a
  dated playbook, one section per goal, so any connected AI acts as a senior media
  buyer unasked. Planned networks: Google, TikTok, Microsoft, Amazon, Snapchat,
  Pinterest, LinkedIn, X, Telegram.
- "AdsPilot" is a working name only (taken by adspilot.tech and others); never
  use it in public content until the owner picks a final name (docs/research/2026-10-01-product-name.md).
- LinkedIn posts on the owner's profile: the owner approves EVERY post
  (AI-Automation/LinkedIn-Content-Ops, approve-linkedin-posts.cmd). Never schedule
  or publish one without that per-post yes.
- If `~/.social-publisher/.env` looks wrong (sandbox account, missing limits),
  compare it with its timestamped backups before acting; it was once overwritten
  by a stale editor copy (2026-10-01).
- Changing code the live publisher runs (worker every 5 min, LinkedIn posts queued):
  do risky multi-file work in a git worktree at a SHORT path (e.g. %TEMP%\spf;
  deep paths break pnpm on Windows), then fast-forward master at a quiet time,
  away from scheduled post slots (15:30 / 22:00 PKT etc.). The db and auth test
  suites hit the LIVE Supabase database: run them only in quiet windows and never
  in parallel with agents (they starved the pooler on 2026-10-02).
- The owner's plan hits session usage limits under large workflows (it happened
  twice on 2026-10-02/03): keep workflows lean and make agents commit each fix as
  soon as it passes, so an interruption never loses finished work.
- Shared packages (`source/packages/*`, e.g. adapters) are loaded from their compiled
  `dist/`, which is not in git; `apps/mcp` runs from `src/`. After changing a package's
  `src`, run its build (`npx tsc -p tsconfig.json` in that package) before reconnecting
  the MCP, or the old code keeps running (cost two failed Muzaree creates, 2026-10-08).
- Backups (since 2026-10-08): the main repo pushes to private GitHub
  `Zain5163/MCP.1920agency` (origin); everything outside it (LinkedIn-Content-Ops,
  Social-Render, LinkedIn-Content-System, memory notes, scheduled-task XML) goes
  to `Zain5163/MCP.1920agency-Tooling` via `bash AI-Automation/MCP-Tooling/sync.sh`
  (secret-scans, commits, pushes). After product work: push the main repo and run
  the sync. Never put `~/.social-publisher` (.env, tokens, DB dumps) in either.
- Another session may switch the shared repo to its own branch at any moment
  (2026-10-08 it switched to `own-skills` seconds before a merge, so the merge
  landed there). Check `git branch --show-current` right before every merge/commit.
- Plans: Free 200 calls/month, Premium $9 (decision 0009); payment provider
  **Polar** (pays out to Pakistan via Stripe Connect Express). Hosting target
  `mcp.1920agency.com` on the Hetzner server. Decision 0010: plain Postgres only,
  daily encrypted dumps copied to `~/.social-publisher/backups`, one-command setup
  in `deploy/`, move data off Supabase (Singapore) to the Helsinki server in Phase 3.
- Server (Stage A deployed 2026-10-08): hosted MCP + worker loop run on the
  Hetzner box (`/opt/adspilot`, containers adspilot-mcp-1 / adspilot-worker-1),
  `https://mcp.1920agency.com` via Raptor's Caddy on the separate network
  `adspilot_edge` (the Caddy block and network are committed in Raptor's repo;
  Raptor's release.sh re-uploads its deploy/ folder). Release new code with
  `deploy/scripts/release.sh` from the repo (git archive; refuses pending
  migrations; `--rollback`). Steps and remaining items: `deploy/README.md` and the
  architecture doc's Phase 3 status. Both PC and server workers can drain the
  same queue safely (SKIP LOCKED). Since 2026-10-09 the SERVER does all
  scheduled work (worker loop + systemd timers: monitor 30 min, refresh, backup,
  keep-alive every 3 days); the PC tasks AdsPilot-Worker/Monitor/Refresh and
  Social-Publisher-Keepalive are disabled on purpose — don't re-enable them
  unless the server is down. Front door is the shared gate ([[server-front-gate]]).
- Shopify connector (2026-10-08): app "1920 Agency Store Connector" (org 239616792, config in
  integrations/shopify-app), dev store 1920-agency-test-store; phase 1 read tools live
  (list_shopify_stores, shopify_store_overview/products/sales/store_audit). Stores in
  ~/.social-publisher/shopify-stores.json. SHOPIFY_CONNECT_ADDRESS=23.227.38.69 in .env works
  around a dead ISP route; remove when *.myshopify.com loads. Plan:
  docs/architecture/2026-10-08-shopify-connector-plan.md. Phase 2a (products, pages, discounts) and
  2b (themes) built and verified on the dev store. Theme writes via the app need a Shopify
  exemption, so themes go through the Shopify CLI (person login, collaborator, or Theme Access
  password SHOPIFY_THEME_PASSWORD_<KEY>); drafts/backups in ~/.social-publisher/shopify-themes/.
- Hosted self-service Shopify connect (shopify_connect_store → mcp.1920agency.com/shopify/callback)
  built and committed 2026-10-08, NOT deployed; the owner will deploy from another chat using
  deploy/README.md "Shopify self-service: deploy steps" (Raptor Caddyfile route committed, cffbb2e).
  Owner decided (2026-10-08): go public once it works end to end; bill through Shopify Billing
  for now (not AdsPilot's own billing). Muzaree's store is not touched until the client gives access.
- Store design (2026-10-08): owner rejected "default Horizon + text" as amateur. Now: skill
  `shopify-store-kit` (87b7305) = tested Horizon sections/settings/example home page; web-ui-design
  hard gate = set the design system and look at 390/1440 px screenshots before showing anything.
  Screenshot script needs SHOPIFY_STOREFRONT_PASSWORD_PRACTICE in .env (owner added it); Horizon
  scrolls inside the page (phone: overflow visible + fullPage; desktop: grow the viewport).
- Phase 2c store-building tools (create product, collection, menu, policy; theme draft `from`
  another theme) committed 942e695; needs app config v6 released (new scopes publications +
  legal_policies, owner approval) and a live rehearsal on the practice store.
- The owner's own offline datasets (PixBundle.com etc.) and the token's reach into
  client ad accounts are deliberate; do not flag them.

Related: [[video-editing-operating-rules]]
- Account turnaround (2026-10-09, af13a8d): tools diagnose_account_trend (monthly funnel, best vs latest,
  steps multiply to the CPP change) and break_even_cost_per_sale (also hosted); skill account-turnaround.
  Fixes same day: get_ad_performance judges Sales on purchases; set_ad_delivery off works on ads; spend
  ceiling counts IN_PROCESS budgets.
