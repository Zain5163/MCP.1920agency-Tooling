#!/usr/bin/env bash
# Copies everything around the MCP that lives outside the main repo
# (AI-Automation/Social-Publisher, backed up to GitHub as MCP.1920agency) into
# this private tooling repo (MCP.1920agency-Tooling), so a rebuilt PC or a new
# chat can restore it. Then scans for secrets and, if clean, commits and pushes.
#
# Run from anywhere:  bash "D:/My AI Works/AI-Automation/MCP-Tooling/sync.sh"
# Add --no-push to stop after the commit.
#
# Never copied: ~/.social-publisher (the .env, tokens, backups), logs, node_modules.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
WS="$(cd "$HERE/../.." && pwd)"
OUT="$HERE/mirror"
mkdir -p "$OUT"

copy_dir() { # copy_dir <source dir> <name in mirror>, skipping logs and dependencies
  if [ -d "$1" ]; then
    rm -rf "${OUT:?}/$2"; mkdir -p "$OUT/$2"
    tar -C "$1" --exclude=./logs --exclude=node_modules --exclude=.env -cf - . | tar -C "$OUT/$2" -xf -
  fi
}

# Projects with no repo of their own
copy_dir "$WS/AI-Automation/LinkedIn-Content-Ops" linkedin-content-ops
copy_dir "$WS/AI-Automation/Social-Render" social-render
copy_dir "$WS/Marketing-and-Content/LinkedIn-Content-System" linkedin-content-system

# Client work operated with the product (decision D3, 2026-10-10). Its logs/ (the
# headless run transcripts) are excluded by copy_dir, like every logs folder.
copy_dir "$WS/AI-Automation/Muzaree-Paid-Media" clients/muzaree-paid-media
mkdir -p "$OUT/marketing-notes"
cp "$WS"/Marketing-and-Content/HANDOFF-*.md "$OUT/marketing-notes/" 2>/dev/null || true

# Claude's memory notes for this product (otherwise only on this PC)
MEM="$HOME/.claude/projects/d--My-AI-Works/memory"
if [ -d "$MEM" ]; then
  rm -rf "$OUT/memory"; mkdir -p "$OUT/memory"
  cp "$MEM"/adspilot-*.md "$MEM"/muzaree-*.md "$MEM"/server-front-gate.md "$MEM"/ads-objective-and-qa-rule.md "$OUT/memory/" 2>/dev/null || true
fi

# Windows scheduled tasks that run the product on this PC (restore with
# schtasks /create /tn <name> /xml <file>)
rm -rf "$OUT/scheduled-tasks"; mkdir -p "$OUT/scheduled-tasks"
for t in AdsPilot-Worker AdsPilot-Monitor AdsPilot-Refresh LinkedIn-Content-Drafts Social-Publisher-Keepalive Muzaree-Ads-Daily Muzaree-Ads-Check; do
  schtasks //query //tn "$t" //xml > "$OUT/scheduled-tasks/$t.xml" 2>/dev/null || rm -f "$OUT/scheduled-tasks/$t.xml"
done

# Refuse to commit anything that looks like a secret
PATTERN='EAA[A-Za-z0-9]{30,}|sk-[A-Za-z0-9_-]{20,}|sk_live|ghp_[A-Za-z0-9]{20,}|github_pat_|AIza[0-9A-Za-z_-]{30,}|-----BEGIN [A-Z ]*PRIVATE KEY|postgres(ql)?://[^:@/ ]+:[^@ ]{6,}@|ya29\.[A-Za-z0-9_-]{20,}|AQV[A-Za-z0-9_-]{40,}|xox[bpa]-[A-Za-z0-9-]{10,}|GOCSPX-[A-Za-z0-9_-]{10,}|phc_[A-Za-z0-9]{20,}|polar_[a-z]{2,4}_[A-Za-z0-9]{20,}'
if grep -rIlE "$PATTERN" "$OUT"; then
  echo "STOPPED: the files above look like they contain a secret. Nothing committed." >&2
  exit 1
fi

cd "$HERE"
git add -A
if git diff --cached --quiet; then echo "nothing changed"; exit 0; fi
git commit -q -m "Sync $(date +%Y-%m-%d)"
[ "${1:-}" = "--no-push" ] || git push -q origin HEAD
echo "synced and committed: $(git log --oneline -1)"
