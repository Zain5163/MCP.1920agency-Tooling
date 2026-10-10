# LinkedIn Content System: Project Context

Last updated: 2026-10-03

## Purpose

A content system for **Rana Zain Usman's personal LinkedIn profile**: 2–3 posts
a day aimed at marketers, social media managers, CEOs/founders and agency owners.
It builds anticipation for the AI marketing tool he is building (build in
public, no name yet) alongside genuinely useful content on paid ads, social media
management, SEO and AI automation.

## Audience

Marketers and media buyers, social media managers, SMB CEOs and founders, and
agency owners (likely first customers), in Pakistan, the Gulf, the UK and the EU.
Details in `STRATEGY.md` section 2.

## Files

| File | What it is |
|---|---|
| `STRATEGY.md` | Positioning, audiences, pillars, cadence and slots, formats, hooks, CTA ladder, 6-week arc, rules, sources |
| `CALENDAR.md` | 2026-10-02 to 2026-10-15, 36 posts with slot, pillar, format, title and status. Its status column and its "Nothing here is scheduled or published" line date from before the 2026-10-02 approval: the drafts' `status:` and `POSTS-LOG.md` are the current record |
| `drafts\` | 18 full drafts for 2026-10-02 to 2026-10-08, `YYYY-MM-DD-slot.md`: 11 `status: scheduled`, 7 `status: draft` (see Current state) |
| `assets\<draft>\` | Rendered visuals (added 2026-10-02): `spec.json` (the slide text, taken from the draft) plus `image.png`, or `slide-NN.png` + `carousel.pdf`. Re-render with `node render.mjs <spec.json>` in `AI-Automation\Social-Render`. None posted yet |
| `AUTOMATION-SPEC.md` | Spec for the daily drafting job (Task Scheduler → PowerShell → headless Claude). **Built** on 2026-10-01 as `AI-Automation\LinkedIn-Content-Ops`, which also holds the approval and scheduling step. Partly stale: its section 8 schedules through `schedule_post`, but the built step uses the Social-Publisher CLI (`--publish --at`) |
| `POSTS-LOG.md` | A line for each post scheduled on 2026-10-02, and a `PUBLISHED` line with the URN once a post is confirmed. Nothing writes to it automatically when a post goes out. 48h metrics to come |

## Current state (2026-10-03)

Drafting, approval and scheduling live in `AI-Automation\LinkedIn-Content-Ops` (its
`PROJECT-CONTEXT.md` explains both steps). The AdsPilot-Worker task in
`AI-Automation\Social-Publisher` publishes what was scheduled.

- **11 text posts are approved and queued.** The owner approved them on 2026-10-02
  between 09:36 and 09:37 with `approve-linkedin-posts.cmd`
  (`LinkedIn-Content-Ops\logs\approve-2026-10-02.txt`). Slots: 10-02 MID, 10-03 MID,
  10-04 PM, 10-05 MID, 10-06 AM, MID and PM, 10-07 AM, 10-08 AM, MID and PM.
- **The first one is live:** 10-02 MID published 2026-10-02 15:30:11 PKT as
  `urn:li:share:7511734273188626432` (`POSTS-LOG.md`). The other 10 wait for their
  slots. Nothing writes a publish back to `POSTS-LOG.md` or to the draft, which is why
  the 10-02 MID draft still says `status: scheduled`.
- **A queued post cannot be edited.** Its text was fixed when it was approved, so editing
  a `status: scheduled` draft changes nothing, and scheduling it again would post it
  twice. To stop one, cancel it on the Social-Publisher dashboard's Scheduled page before
  its slot.
- **7 drafts are still `status: draft`.** The 2026-10-02 approval run could schedule
  text posts only: the images and PDFs were rendered, and the approval step learned to
  schedule them, later the same day.
  - `2026-10-02-pm` (text + image, quote card): **not approved, and it did not go out.** On 2026-10-03 the owner chose to move it to **Sunday 2026-10-04 AM (09:00)**: it is now `drafts6-10-04-am.md` (same image, `moved_from:` in its frontmatter), waiting for his y.
    Its slot has passed, and the approval step offers only drafts dated today or later,
    so it will not be offered again.
  - `2026-10-05-am` (text + image, checklist card) and the three carousels
    (`2026-10-03-pm`, `2026-10-05-pm`, `2026-10-07-pm`): waiting for the owner's review.
    The next approval run can schedule them with their image or PDF.
  - `2026-10-04-mid` (founder story): has an `[OWNER: …]` gap that only he can fill, and
    the approval step refuses it until then.
  - `2026-10-07-mid` (60-second video): not recorded yet. Video is posted by hand.
- **The daily drafter is holding.** The LinkedIn-Content-Drafts task (07:00) writes
  nothing while 6 or more drafts are `status: draft`. It held on 2026-10-02 with 18, and
  7 remain, including the moved image post `2026-10-04-am` until it is approved.
- **Two publishing paths are unproven.** A scheduled image post and a LinkedIn document
  post are built in Social-Publisher and unit-tested, but neither has gone out for real.
  A scheduled document also needs the media bucket to accept PDFs, which has not been
  checked. Watch the first of each: the CLI output on the review screen, the worker at
  its slot, then the post on LinkedIn (for a carousel, its pages and the title above
  them). Posting by hand stays the fallback, and the week-2 poll must be posted by hand.
- The week-2 results post (2026-10-09 MID) needs real numbers from Meta. The campaign was planned to run until 2026-10-07, but the owner paused it on 2026-10-01 (Social-Publisher `WAITING-LIST.md` #10), so the calendar's "what PKR ~3,500 bought" must follow the real spend.
- **Visuals rendered 2026-10-02** in the personal-brand style (`assets\`), none posted yet: a quote card for 10-02 PM and a numbered checklist card for 10-05 AM (no tick and no Ads Manager mock-up), plus PDF carousels for 10-03 PM (6), 10-05 PM (7) and 10-07 PM (6). Those five drafts carry `image:` or `document:` + `document_title:` in their frontmatter, and nothing else in them changed. The designed cards replace the drafts' optional real screenshots, so they need the owner's OK, which is his "y". The 10-07 PM title was 64 characters, over the 58 LinkedIn's composer is reported to allow; on 2026-10-03 it was shortened to `Meta "code 10" errors: stop guessing, ask 3 questions` (53), with the same meaning. The post's title comes from the draft; the PDF's own metadata, from `assets\2026-10-07-pm\spec.json`, keeps the old wording until it is re-rendered.

## Decisions

1. **Cadence:** Mon–Thu 3 posts (AM 09:00, MID 15:30, PM 22:00 PKT). Fri–Sun 2 posts (MID, PM). 18 a week.
2. **A 14-day kill test:** if 3-post days show median impressions more than 30% below 2-post days, drop to 2 a day. Third-party data says same-day posts cannibalise each other. That is unverified.
3. **The product is never named** ("what I'm building" / "the tool") until the owner finalises the name.
4. **The arc moves on milestones, not dates.** The name reveal waits for a final name. The waitlist waits for a page. Launch waits for the product being able to onboard someone outside 1920 Agency.
5. **No links in post bodies.** Links go in the Featured section, except on the reveal or launch post.
6. **Facts only from project logs or the owner.** Every draft cites its sources in frontmatter.
7. **The headless job never gets posting tools.** Drafting is automated. Approval and scheduling are not.

## Source locations

- Facts: `AI-Automation\Social-Publisher\PROJECT-LOG.md`, `STATUS.md`, `docs\product\roadmap.md`, `docs\decisions\0006`, `docs\decisions\0008`, `docs\research\2026-09-30-competitors.md`
- SEO material: `AI-Automation\SEO-Ops\PLAYBOOK.md`, `README.md`
- Brand: `Websites\Zain-Personal-Branding\PROJECT-CONTEXT.md` (dark teal and aqua glass, Geist type, outcome-led copy) for carousel and image design
- Drafting, approval and scheduling: `AI-Automation\LinkedIn-Content-Ops` (`Run-LinkedInDrafts.ps1`, `Approve-LinkedInPosts.ps1`, `logs\`)
- Publishing: `AI-Automation\Social-Publisher`, run by the server's worker loop since 2026-10-09 (the PC task AdsPilot-Worker is disabled, a fallback only)
- Automation model: `AI-Automation\SEO-Ops\Run-DailySEO.ps1`

## Risks

- **Overclaiming.** Only Meta can launch. Nobody outside 1920 Agency can use the tool yet, and customers need Meta App Review first (decision 0005). Posts must not imply availability.
- **Frequency.** 18 posts a week may lower reach per post (unverified). There is a test and a kill rule.
- **Voice.** 18 drafts in one style can read as AI-written, and LinkedIn reportedly suppresses generic AI text. The owner should edit each one in his own words.
- **Confidential details.** Screenshots can leak account, campaign or pixel IDs or client names. Redact them. The ad token reaches client accounts, and none are ever named.
- **Stale facts.** Algorithm figures are third-party and change. Re-check every 90 days. Image-model and Meta details in the drafts carry `check_before_posting` notes.
- **Pixel post (10-05 AM).** The log says the Ads Manager box may still show unticked. The draft avoids claiming it is ticked. Confirm before posting.
- **Queued posts need this PC awake.** The AdsPilot-Worker task does not wake the PC, and nothing skips a late post, so a slot that passes while the PC sleeps or is off goes out as soon as the PC is back on.

## Next actions

1. Owner: update the LinkedIn headline, About and Featured section to match the three themes (STRATEGY section 1).
2. Owner: run `approve-linkedin-posts.cmd` (`AI-Automation\LinkedIn-Content-Ops`) for the drafts still waiting: 10-03 PM, 10-05 AM, 10-05 PM and 10-07 PM, and 10-04 MID once its gap is filled. A draft is offered only while its date is today or later.
3. Owner: approve the moved image post `2026-10-04-am` before Sunday 09:00 (decided 2026-10-03: moved, not dropped).
4. Owner: record the 10-07 MID video and post it by hand.
5. After each slot: confirm the post went out (`list_posts` or the dashboard) and add its URN to `POSTS-LOG.md`. Watch the first image post and the first carousel closely.
6. Before 10-09: read the campaign's real results from Meta (paused since 2026-10-01) and write the 10-09 MID post from them.
7. Week 2: the daily drafting task writes drafts two days ahead (the first, for 10-09, on 10-07) once fewer than 6 are waiting. The week-2 poll is posted by hand.
8. After 14 days: fill POSTS-LOG metrics and run the cadence kill test. Adjust the slots.
9. Before arc week 4: the owner finalises the product name.

## 2026-10-07 drafting run (for 2026-10-09)

- Drafted `drafts\2026-10-09-pm.md` (P2, landing page views vs link clicks) and a substitute
  `drafts\2026-10-09-mid.md` (P3, how the AI drafting of these posts is gated). Both `status: draft`.
- The P5 results post is still not written: no results read from Meta, campaign paused 2026-10-01.
- The Social-Publisher `PROJECT-LOG.md` could not be read (permission denied), so no new
  build-in-public facts were used. Grant read access for the next run.
- Calendar repeats to fix before drafting: 10-10 MID ("no AI model of its own") repeats 10-03 MID;
  10-15 PM (daily vs monthly caps) repeats 10-06 PM and 10-07 AM.
- `INBOX.md` created (one line per draft).

## 2026-10-08 drafting run (for 2026-10-10)

- Drafted `drafts\2026-10-10-mid.md` (P3 substitute: the order to let AI into a marketing team,
  read → draft → prepare → act with approval, closing with a stage-2 question) and
  `drafts\2026-10-10-pm.md` (P2, B2B Meta lead forms, written as text instead of a document so it
  can be scheduled). Both `status: draft`.
- The calendar's 10-10 MID ("no AI model of its own") was not written because it repeats 10-03 MID.
- The Social-Publisher folder (PROJECT-LOG, decisions, ROADMAP) still could not be read (permission
  not granted), so neither post uses new product facts. The lead-form post rests on third-party web
  write-ups; its `check_before_posting` lists what to confirm in Ads Manager and against the Meta
  playbook ("three custom questions at most").
- Newsletter edition 1 is still `status: draft`, so neither post carries a subscribe line.

## Newsletter (2026-10-05)

Weekly LinkedIn newsletter **Before It Has a Name**: form text, logo (`newsletter/logo-300.png`),
rhythm and the five subscribe lines in `newsletter/NEWSLETTER.md`; edition 1 drafted in
`newsletter/editions/edition-01.md` for Thursday 2026-10-08 12:00 PKT. The owner creates the
newsletter and publishes each edition by hand (no API for articles). Posts carry the subscribe
line only after edition 1 is published (STRATEGY section 7).
