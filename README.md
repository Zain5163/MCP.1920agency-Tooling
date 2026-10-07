# MCP tooling backup

Private backup (GitHub: `Zain5163/MCP.1920agency-Tooling`) of everything around
the MCP product that is **not** in its main repo
(`AI-Automation/Social-Publisher` → `Zain5163/MCP.1920agency`).

| In `mirror/` | Copied from |
|---|---|
| `linkedin-content-ops` | `AI-Automation/LinkedIn-Content-Ops` (approve and draft scripts; logs excluded) |
| `social-render` | `AI-Automation/Social-Render` (post image and carousel renderer) |
| `linkedin-content-system` | `Marketing-and-Content/LinkedIn-Content-System` (strategy, calendar, drafts, newsletter, assets) |
| `marketing-notes` | `Marketing-and-Content/HANDOFF-*.md` |
| `memory` | Claude's memory notes for this product |
| `scheduled-tasks` | Windows Task Scheduler exports (worker, monitor, refresh, keepalive, LinkedIn drafts) |

`mirror/` is a copy: edit the originals, never these. Run `bash sync.sh` after a
working session (it scans for secrets before committing, then pushes).

**Never here:** `~/.social-publisher` (the `.env`, tokens, database backups).
Those stay on this PC only (AGENTS.md); restoring from zero needs them re-entered.

**Restoring on a new PC:** clone both repos into `D:\My AI Works\AI-Automation`,
copy the `mirror/` folders back to the paths above, recreate each task with
`schtasks /create /tn <name> /xml scheduled-tasks\<name>.xml`, then follow the
main repo's `SETUP.md`.
