---
edition: 1
planned: Thursday 2026-10-08, 12:00 PKT
status: draft
headline: What my own tool caught in my own ad account
sources:
  - AI-Automation/Social-Publisher/PROJECT-LOG.md: 2026-09-30 first live campaign; 2026-10-02 Meta performance team; 2026-10-02 Facebook Page tokens; 2026-10-02 posting to every Page
note: Paste into LinkedIn's article editor under the newsletter. Cover image optional (the newsletter logo is fine). Check every number against the log before publishing.
---

# What my own tool caught in my own ad account

Welcome to the first edition.

For the last few weeks I've been building something next to running 1920 Agency.
The short version: it connects the AI you already use, Claude or ChatGPT, to your
social accounts and your ad accounts, and gives it the knowledge of an experienced
media buyer. It can plan, write, launch and read results. It cannot spend a rupee
without you approving the exact plan and the exact cost.

It doesn't have a name yet. When it does, you'll hear it here first.

Every week I'll write down what I built, what broke, and one lesson you can use
in your own marketing, whether or not you ever use the tool.

## The first live campaign looked great. It wasn't.

On 30 September it launched its first real campaign on our own Meta account. A
small traffic campaign, PKR 500 a day, on purpose.

The headline number was a 13.5% click-through rate. Anyone would screenshot that.

Then I built the part that reads results the way a senior media buyer does: by
placement, by audience, and clicks against people who actually reached the page.
It found two things:

- **97% of the spend went to Audience Network**, Meta's network of third-party apps
  and sites.
- **Only 20% of the 243 clicks ever loaded the page.**

So the beautiful click-through rate was mostly accidental taps in other people's
apps. The ad wasn't working; the number was.

And the cause was mine. The campaign had been set to optimise for link clicks.
Meta finds the people and the places a goal asks for: ask for clicks and it finds
clickers. Traffic campaigns now optimise for landing page views by default, which
counts only people whose page actually loaded.

**The lesson:** on a traffic campaign, put link clicks next to landing page views
before you believe the click-through rate. If most clicks never become a visit,
check the placement breakdown before you touch the creative.

## Two quieter catches

**My Facebook and Instagram connections had silently stopped working.** Meta had
withdrawn the posting permissions from the login, and every check still said
"ready", because it only looked at expiry dates. The monitor now asks Meta itself,
every run, whether each connection still works, and flags it the moment it doesn't.

**"Post to Facebook" had become dangerous.** After reconnecting, 35 Facebook Pages
were connected, most of them clients'. Posting to "Facebook" would have meant all
35. Now, when a platform has more than one account, a post has to name which one,
or it is refused.

Neither is glamorous. Both are the kind of thing that costs an agency a client.

## What's next

Next week: what the first campaign actually cost and returned, read from Meta, and
how the approval step works when an AI wants to spend money.

If someone on your team runs ads with AI tools, forward this to them.

Talk next Thursday,
Zain
