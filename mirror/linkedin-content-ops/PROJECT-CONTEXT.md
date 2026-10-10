# LinkedIn Content Ops — project context

**Purpose:** 2–3 posts a day on the owner's personal LinkedIn profile (Zain
Usman), to attract marketers, social media managers, CEOs and founders and build
anticipation for the product being built in `AI-Automation\Social-Publisher`.
Started 2026-10-01 at the owner's request.

**The content** (strategy, calendar, drafts, what was posted) lives in
`Marketing-and-Content\LinkedIn-Content-System`. **This folder is only the
automation** that writes drafts and schedules approved ones, on the same pattern
as `AI-Automation\SEO-Ops`.

## How it works

```
07:00 daily  LinkedIn-Content-Drafts task (registered 2026-10-01, wakes the PC)
             → Run-LinkedInDrafts.ps1
             → headless Claude Code writes the drafts for two days ahead
               (Mon–Thu AM 09:00 / MID 15:30 / PM 22:00, Fri–Sun MID and PM)
             → Windows notification "posts ready"

you          double-click approve-linkedin-posts.cmd
             → each post shown in full: y schedule / n reject / s skip
             → y queues it through the Social-Publisher CLI (--publish --at)

the server   its worker loop publishes posts whose time has come (since 2026-10-09;
             the PC task AdsPilot-Worker is disabled and only a fallback)
```

**Owner's decision, 2026-10-01: approve every post.** Nothing reaches LinkedIn
without a "y" for that exact post. Fully automatic can be switched on later; it
was offered and deliberately not chosen.

## Files

| File | What |
|---|---|
| `config.json` | Slot times (Pakistan time), which slots each weekday, content folder, stack limit |
| `Run-LinkedInDrafts.ps1` | The daily draft writer. `-DryRun` to see what it would do |
| `Approve-LinkedInPosts.ps1` / `approve-linkedin-posts.cmd` | The review and scheduling step |
| `logs/` | One log per run, plus Claude's transcript |
| `archive/` | Rollback copies: `Approve-LinkedInPosts.2026-10-02-before-image-support.ps1` (the text-only version) and `Approve-LinkedInPosts.2026-10-02-before-document-support.ps1` (image support, documents by hand) |

## What the approval step schedules (updated 2026-10-02, documents added the same day)

| Draft `format:` | What happens |
|---|---|
| `text` | Scheduled: the post text alone (unchanged) |
| starts with `text + image`, and the draft's `image:` field names an existing .png/.jpg/.jpeg/.gif/.webp | Scheduled with `--image <path>`. The review screen shows the image path and size, and `o` opens the image before you answer |
| `text + image` with no `image:` field, or the file is missing | "Post by hand", with a note saying which |
| starts with `document` (the carousels), and the draft's `document:` field names an existing .pdf | Scheduled as a LinkedIn document post: `--document <pdf>` and the `document_title:` in a temp file passed as `--title-file`. The screen shows the PDF path and size, the title and its length, and a yellow warning when the title is over 58 characters; `o` opens the PDF before you answer. Without `document_title:` the publisher titles it with the first line of the post text, and the screen says so |
| document with no `document:` field, a missing file, or not a .pdf | "Post by hand", with the PDF path (or "file not found"), the title and the post text's length |
| video, anything else | "Post by hand" (unchanged) |

- **Why the title goes in a file.** Windows PowerShell 5.1 passes an argument
  holding double quotes to node without escaping them, so node sees it split in
  two (checked 2026-10-02: `Meta "code 10" permission errors: ...`, the 10-07 title,
  arrived as `Meta code` plus a stray argument, which the CLI refuses). No escaping
  fixes every case, because PowerShell 5.1 counts every quote when it decides
  whether to wrap an argument. A file avoids the command line, as `--text-file`
  already does for the post text.
- **The 10-07 carousel's title is 64 characters.** LinkedIn's own composer is
  reported to allow 58 for a document title and the API documents no limit, so the
  review shows a warning, not a refusal. Shortening `document_title:` is the safe
  choice; the owner decides.

- **Post text.** When the body has a `## Post text` heading, only the text under it,
  up to the next `## ` heading, is posted, so slide notes are never sent. A body
  without that heading is posted whole, exactly as before.
- **Refusals.** An `[OWNER: …]` gap anywhere in the body, a heading inside the post
  text, or an empty post text: the draft is refused until it is fixed.
- **`check_before_posting:`** is now shown on the review screen in full (the parser
  reads YAML `>` blocks; before, it showed only `>`).
- **Where images come from.** `AI-Automation\Social-Render` renders the brand
  visuals from a spec into
  `Marketing-and-Content\LinkedIn-Content-System\assets\<draft>\`. The five week-1
  visual drafts carry the fields: `2026-10-02-pm` and `2026-10-05-am` have `image:`;
  `2026-10-03-pm`, `2026-10-05-pm` and `2026-10-07-pm` have `document:` and
  `document_title:`. The designed cards replace the drafts' optional "real
  screenshot", so the owner's "y" is his OK for the card.
- **How an image is scheduled.** The Social-Publisher CLI (`post.ts --image ...
  --at ... --publish`) uploads the file to the media bucket when you press y,
  because the worker that publishes later runs in another process and cannot read
  this PC's files. That needs the Supabase media hosting set up (SETUP.md). If it is
  not, the CLI refuses, the screen says "NOT scheduled", and the draft is unchanged.
- **Fix made at the same time.** The CLI prints its refusals on stderr. Under
  `$ErrorActionPreference = 'Stop'`, Windows PowerShell 5.1 turned the first stderr
  line into a terminating error, which ended the whole review instead of showing
  "NOT scheduled". The CLI call now runs under a local `Continue`, so the refusal is
  shown and the review moves on.
- **Verified read-only** (2026-10-02): a harness loaded only the script's functions
  (from its parsed AST) and ran them against all 18 real drafts. 234 checks passed:
  the script parses in Windows PowerShell 5.1, the file is ASCII-only, every text
  post is byte-for-byte what the old script posted, and the post text lengths match
  the visual spec (1254, 1132, 683, 959, 1013). An echo script standing in for
  post.ts confirmed the image path reaches node intact. No file changed. The
  interactive script itself was not run, and no post was scheduled.
- **Document support verified read-only** (2026-10-02, same method): 82 checks
  passed in Windows PowerShell 5.1. The script parses and is ASCII-only; 15 of the
  18 drafts plan exactly as before; the 3 carousels moved from "by hand" to
  "document" with the right PDF and title and an unchanged post text (683, 959,
  1013 characters). The script's own `Invoke-PostCli` was run against a stand-in
  `src/post.ts` that only echoes: node received exactly the arguments built, the
  post text and the title (quotes included) arrived byte for byte (SHA-256), exit
  codes came back, a stderr line did not end the run, and the temp files were
  removed. No draft, `POSTS-LOG.md` or log file changed. The interactive script was
  not run and nothing was scheduled.

## Guardrails

- The draft writer gets **WebSearch and WebFetch only**: no shell, no MCP tools,
  so it cannot reach the publisher even by mistake.
- It **holds** when 6 or more drafts are unreviewed, so missed reviews never pile
  up stale posts.
- It writes at most two days ahead.
- A slot that has already passed is offered as "15 minutes from now", never
  posted silently late.
- Over 3,000 characters is flagged on screen.
- Facts for build-in-public posts come only from the Social-Publisher project
  log. No invented numbers, clients or quotes. The product's name is not used
  until it is final.

## Risks

- Runs only while this PC is on (like SEO-Ops). The task is set to wake the PC.
- A scheduled post's text is fixed when approved; editing the draft file
  afterwards does not change what is posted.
- The LinkedIn connection's token expires; the AdsPilot-Refresh task renews it,
  and `list_accounts` shows if it needs reconnecting.
- **The scheduled image path is unproven.** What is proven (Social-Publisher
  PROJECT-LOG, 2026-09-26) is an *immediate* LinkedIn image post read from local
  disk. A *scheduled* one (the CLI uploads to the media bucket when you press y,
  then the worker fetches it over HTTPS and uploads it to LinkedIn) is built into
  the CLI and the adapter but has not been run end to end, and the y branch of this
  script with `--image` has not been run either. Watch the first image post: the CLI
  output on the review screen, then the post on LinkedIn.
- An image file changed after approval is not re-sent: the CLI uploads it when you
  press y.
- **Document posting is unproven.** The publisher's LinkedIn document path
  (Social-Publisher, built 2026-10-02) is unit-tested against LinkedIn's documented
  API only; no document has been uploaded or posted for real. A scheduled one also
  needs the media bucket to accept `application/pdf` (not checked). Watch the first
  carousel: the CLI output on the review screen, the worker log at its slot, then
  the post on LinkedIn (the PDF pages and the title above them). Posting by hand
  stays the fallback.
- A PDF changed after approval is not re-sent either: the CLI uploads it when you
  press y.

## Next actions

- After two weeks of drafts, review quality and decide whether to keep approving
  each post or move to weekly batches.
- Once the product name is chosen, add it to STRATEGY.md and the reveal posts.
- Move the approval to Slack when Slack is connected (workspace preference).
- ~~Document posting~~ Built 2026-10-02: `document:` PDFs are scheduled with their
  `document_title:`. Still to do: prove it with the first real carousel, and tell
  the draft writer (`Run-LinkedInDrafts.ps1` prompt) and the content system's
  STRATEGY.md and AUTOMATION-SPEC.md, which still say documents are posted by hand.
- Consider showing the drafts' `notes:` and `needs_owner_input:` fields on the review
  screen too (the parser now reads them in full; only `check_before_posting:` is shown).
