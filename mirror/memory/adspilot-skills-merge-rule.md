---
name: adspilot-skills-merge-rule
description: "Skills learned in any chat or ad account (Muzaree, TikTok, other clients) must be merged into the MCP's own skills library, deduplicated, committed, pushed and backed up"
metadata:
  node_type: memory
  type: feedback
  originSessionId: 2e482ace-b0b2-4185-962b-a49ffb3bed17
  modified: 2026-10-07T22:36:58.975Z
---

Whenever another chat or ad account produces a new skill or strategy (Meta for
Muzaree, later TikTok, Google, other clients' accounts), read it, compare it with
what the MCP's skills library and playbooks already have
(`source/apps/mcp/skills-library/adspilot/`, `playbooks/`), and merge it:
update the existing skill if it overlaps, add a new one if it is new, never keep
two versions of the same advice. Then commit, push the main repo, and run the
tooling sync.

**Why:** the owner (2026-10-08) wants every lesson from real accounts and, later,
from users' results to make the product better for all users and to support
troubleshooting; skills arrive from several chats at once.

**How to apply:** at the start of MCP/ads work, check `git log` and the skills
folder for skills other sessions added since last time. Patterns only from user
data (industry, objective, budget range, result), never one user's ads or data
shown to another. Skill/playbook changes that change advice go to the owner for
approval before shipping. See [[adspilot-project]].
