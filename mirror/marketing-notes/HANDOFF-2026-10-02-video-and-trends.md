# Handoff: daily trend research and the video pipeline

**Written 2026-10-02** in the AdsPilot chat, for the owner's evening chat that
takes this on. Everything the owner asked for is here, in his words where it
matters, plus the context and constraints already known. Nothing in this file
has been built.

---

## What the owner asked for

1. **Deep research on top people in his field**: marketing, tech and
   education creators and influencers. Learn what they post, how they hook, what
   formats win, and take ideas from both marketing and tech/education.
2. **Watch every trend, every day**, on Facebook and especially YouTube (also
   TikTok and Instagram): the **editing styles and effects** creators use, and the
   **music** that is trending, to use in our own videos.
3. **Make videos**, in three modes:
   - with **his image** (a photo of him, or an AI likeness of him);
   - with **him speaking** on camera;
   - **without him**: text-based videos with a voice or music.
   He asked for advice on voice options.
4. **Compete with anyone**: follow whatever is trending and make our version.
5. **Videos about the product** (the MCP being built), especially for **YouTube
   and TikTok**.
6. **Every day**: the research and the ideas should arrive daily, like the
   other automations.

## What already exists to build on

| Thing | Where | Use |
|---|---|---|
| Personal design system (colours, Geist type, glass, social templates) | `Websites\Zain-Personal-Branding` (`source/src/lib/brand-tokens.ts`, `/design-system`) | Every visual and video title card |
| LinkedIn content system (strategy, calendar, drafts, posts log) | `Marketing-and-Content\LinkedIn-Content-System` | The research should feed its calendar and idea bank |
| Daily draft writer + approve-each-post step | `AI-Automation\LinkedIn-Content-Ops` | The pattern to copy: a scheduled job writes, the owner approves |
| Daily SEO automation | `AI-Automation\SEO-Ops` | The original pattern (Task Scheduler → headless Claude Code) |
| Publisher: Facebook, Instagram, LinkedIn live; YouTube being added 2026-10-02 | `AI-Automation\Social-Publisher` | Where finished videos get posted, with approval |
| After Effects control (Prism MCP) | connected to Claude Code | Motion graphics and editing |
| Video editing work | `Video Editing` (its own rules: nothing public, nothing restructured, nothing unasked) | Do not reorganise it |

## Rules that already apply

- **The owner approves every post** under his name. Research and drafting can be
  automatic; publishing is not.
- **The product name is not final** ("AdsPilot" is taken). No video uses a name
  until he picks one.
- **No invented results, clients, numbers or quotes.** Build-in-public facts come
  from `AI-Automation\Social-Publisher\PROJECT-LOG.md`.

## Things to check before building (known risks, not yet verified)

- **Trending music is licensed inside each app, not for us.** Business accounts
  on TikTok and Instagram are usually limited to a commercial music library, and
  a copyrighted song in a video uploaded to YouTube is likely to be claimed or
  muted by Content ID. The safe route is royalty-free or platform-library music
  chosen inside the app. Verify the current rules per platform first.
- **AI likeness and AI voice must be disclosed.** YouTube's upload API has a
  synthetic-media declaration; Meta and TikTok label AI content. A cloned voice
  of the owner, used with his consent, is fine; anyone else's is not.
- **Scraping platforms breaks their terms.** Trend research should use what the
  platforms publish (TikTok Creative Center, YouTube trending pages, Meta Ad
  Library for the EU/UK) plus web search, not automated scraping.

## Suggested shape (for the evening chat to decide)

1. A **daily research job** (07:00, like the LinkedIn drafts) that writes
   `TRENDS-YYYY-MM-DD.md`: formats, hooks, editing styles, music, what top
   creators in marketing/tech/education posted, and 3–5 ideas for us.
2. An **idea bank** that the LinkedIn calendar and video plan draw from.
3. A **video pipeline** per mode: script → voice (owner or AI) → edit (template
   in the design system, captions always) → export per platform (9:16 for
   Shorts/Reels/TikTok, 16:9 for YouTube) → approval → publish.
4. Product videos queued for YouTube and TikTok once the name is chosen.
