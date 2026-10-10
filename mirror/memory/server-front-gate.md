---
name: server-front-gate
description: Hetzner server 37.27.148.217 has a front gate (/opt/gate, AI-Automation/Server-Gate); each project owns one sites/<domain>.caddy file
metadata:
  type: project
---

Since 2026-10-09 one Caddy at `/opt/gate` (source `AI-Automation/Server-Gate`) serves every domain on the Hetzner
server: raptordownloader.com (+ api., www.) and mcp.1920agency.com (AdsPilot). Each project owns exactly one file in
`/opt/gate/sites/` (Raptor: `site/deploy/gate/raptordownloader.caddy`, uploaded by release.sh; AdsPilot:
`Social-Publisher/deploy/caddy/mcp.1920agency.com.caddy`) and its own Docker network the gate joins
(`deploy_internal`, `adspilot_edge`). Reload: `cd /opt/gate && docker compose exec -T caddy caddy reload --config /etc/caddy/Caddyfile`.

**Why:** the owner wants the gate "outside" so future sites never edit another project's files (the AdsPilot
session had edited Raptor's Caddyfile to go live).
**How to apply:** a new site adds its own sites file and network ([[free-video-downloader-project]],
[[adspilot-project]]); never put another domain into a project's own files; certificates live in `deploy_caddy_data`.
