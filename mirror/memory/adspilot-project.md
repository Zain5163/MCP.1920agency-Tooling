---
name: adspilot-project
description: "AdsPilot (AI-Automation/Social-Publisher) — one MCP server for social publishing, ads and marketing; where to resume and the owner's standing priorities"
metadata:
  node_type: memory
  type: project
  originSessionId: 2e482ace-b0b2-4185-962b-a49ffb3bed17
  modified: 2026-10-08T00:49:22.368Z
---

AdsPilot lives in `D:\My AI Works\AI-Automation\Social-Publisher`. Resume from
`START-HERE.md`, then `WAITING-LIST.md` (what is blocked and on whom) and the
latest entries in `PROJECT-LOG.md`. `RULES.md` holds the owner's standing rules.

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
  use it in public content until the owner picks a final name (research/2026-10-01-product-name.md).
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
  same queue safely (SKIP LOCKED).
- Shopify connector (2026-10-08): app "1920 Agency Store Connector" (org 239616792, config in
  integrations/shopify-app), dev store 1920-agency-test-store; phase 1 read tools live
  (list_shopify_stores, shopify_store_overview/products/sales/store_audit). Stores in
  ~/.social-publisher/shopify-stores.json. SHOPIFY_CONNECT_ADDRESS=23.227.38.69 in .env works
  around a dead ISP route; remove when *.myshopify.com loads. Plan:
  architecture/2026-10-08-shopify-connector-plan.md (phase 2 = writes behind approvals).
- The owner's own offline datasets (PixBundle.com etc.) and the token's reach into
  client ad accounts are deliberate; do not flag them.

Related: [[video-editing-operating-rules]]
