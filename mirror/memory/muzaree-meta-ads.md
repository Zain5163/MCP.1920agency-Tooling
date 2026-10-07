---
name: muzaree-meta-ads
description: "Muzaree (muzaree.com, footwear) Meta ads — account act_144042365972084, run through AdsPilot with account \"muzaree\"; resume from AI-Automation/Muzaree-Paid-Media/STATUS.md"
metadata:
  node_type: memory
  type: project
  originSessionId: ccb36a99-ea23-4ade-935f-a28b96964621
  modified: 2026-10-07T17:22:03.287Z
---

Muzaree's Meta ad account is `act_144042365972084` (PKR), a client account in the
1920 Agency business that the AdsPilot system-user token can manage. Page
778648892002721, IG 17841476929259542, pixel 1407317194096683. Resume from
`AI-Automation/Muzaree-Paid-Media/STATUS.md`.

The user spells it "Musari", "Mozari", "Muzari" or "MUZAR" by voice; all mean Muzaree.

**Why:** the owner gave full authority over Muzaree's strategy and budget
(2026-10-06), but AdsPilot still needs the owner's own yes on every create,
activate and budget change.

**How to apply:**
- Since 2026-10-07, pass `account: "muzaree"` to AdsPilot's ads tools. Accounts are
  listed in `~/.social-publisher/ad-accounts.json` (read on each call). Never switch
  the `.env` default by hand again: the owner explicitly does not want that. The
  default stays 1920 Agency.
- The owner granted Claude edit access to `~/.social-publisher/` (2026-10-07).
- Advertise the footwear only (Muzaree's own brand). Most watches carry replica-brand
  names, and Meta has disapproved watch ads in this account.
- Owner handed over daily management (2026-10-08). Scheduled task `Muzaree-Ads-Daily`
  (11:00 PKT) runs `Run-MuzareeDaily.ps1`: applies `MEDIA-BUYING-RULES.md`, may only
  switch losing ads OFF, writes `reports/`, queues everything else in
  `PENDING-APPROVALS.md` for the owner's yes.
- Target cost per purchase is PKR 500–700; it was about 1,350 on 2026-10-06.
  February's Chelsea boot ads hit about 600.

Related: [[adspilot-project]]
