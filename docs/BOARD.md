# Tracking Board — DevFest Armenia 2026

**Last updated:** 2026-09-19

This board is the authoritative record of task status (ADR-006). There is no second
tracker — do not mirror rows into GitHub Issues.

Status key: `todo` · `doing` · `blocked` · `review` · `done` · `cancelled`
IDs are stable and never reused. Keep rows terse; reasoning goes in the
[Comments log](#comments-log) at the bottom, newest first. Tasks needing more than a row
have a brief in [Task briefs](#task-briefs).

---

## Critical path

```
DF-01 ──► DF-07, DF-08, DF-09 ──► DF-10 (phone review)
DF-17 (base path) ──────────────► DF-20 (public deploy, 30 Sep)
DF-22 (embed ID) ──► DF-23 ──► DF-24, DF-25
```

Target: public site by **30 September**. As of 19 September there are no external waits
left: DF-11 and DF-14 were cancelled, so nothing on the path to launch depends on a reply
from outside the project. DF-17 is the last open gate on DF-20 and it is Davit's own
infrastructure decision.

## Phase 0 — Foundation (20–24 Sep)

| ID | Task | Status | Owner | Due | Notes |
|---|---|---|---|---|---|
| DF-01 | Create `devfest-armenia-2026` repo on GitHub, push scaffold | todo | Davit | 20 Sep | Public, MIT. Needs the remote URL; `gh` is not installed, use plain git |
| DF-02 | Vite + TS + Tailwind skeleton building clean | done | Davit | 20 Sep | Scaffolded |
| DF-03 | Design tokens from DevFest 2026 kit in `style.css` | done | Davit | 20 Sep | See BRAND.md |
| DF-04 | JSON content model + loader + types | done | Davit | 21 Sep | `src/content.ts` |
| DF-05 | Docker + compose on port 3026 | done | Davit | 21 Sep | `docker compose up -d` |
| DF-06 | CI: build + content schema validation + brand-color guard | done | Davit | 22 Sep | Fails on AUA hex in CSS |
| DF-07 | Download DevFest 2026 landing-page headers (2650/1440/640×500) | todo | Davit | 22 Sep | From brand deck |
| DF-08 | Create DevFest Armenia lockup from editable-location asset | todo | Davit | 22 Sep | Google Drawings |
| DF-09 | Source GDG Yerevan logo SVG | todo | Davit | 22 Sep | |
| DF-10 | Review v1 on phone via :3026 | todo | Davit | 24 Sep | Port-forward. Needs DF-07/08/09 |
| DF-42 | Commit `package-lock.json`, switch CI to `npm ci` with node cache | todo | Davit | 22 Sep | Lockfile already generated locally, untracked — see log |

## Phase 1 — Content and launch (25–30 Sep)

| ID | Task | Status | Owner | Due | Notes |
|---|---|---|---|---|---|
| DF-11 | Request AUA/ACSE assets: SVG, reversed mark, building photo, brand rules | cancelled | — | — | Nothing to request — AUA has only the two PNGs already in the repo |
| DF-12 | Venue section — name, address, map link, no photo | todo | Davit | 26 Sep | Rescoped, unblocked. See brief |
| DF-13 | Swap AUA PNG for SVG in collaboration strip | cancelled | — | — | No SVG exists; the 2130×610 navy PNG is the master |
| DF-14 | Confirm logo lockup arrangement with GDG regional lead | cancelled | — | — | Davit is the GDG Yerevan organizer; the call is his and he has made it |
| DF-15 | Final About / CFP copy review | todo | Davit | 26 Sep | |
| DF-16 | OG image, meta tags, sitemap, robots.txt | todo | Davit | 28 Sep | |
| DF-17 | Decide deployment target and `VITE_BASE_PATH` | todo | Davit | 26 Sep | WP subfolder vs standalone. Blocks DF-20 |
| DF-18 | Analytics | todo | Davit | 28 Sep | Which tool? |
| DF-19 | Accessibility pass: contrast, focus, reduced motion, keyboard | todo | Davit | 29 Sep | |
| DF-20 | Public deploy | todo | Davit | 30 Sep | Needs DF-14, DF-17 |
| DF-21 | Announce site on GDG Community platform and socials | todo | Davit | 30 Sep | |

## Phase 2 — Speakers (15–25 Oct)

| ID | Task | Status | Owner | Due | Notes |
|---|---|---|---|---|---|
| DF-22 | Retrieve Sessionize embed ID for 2026 | todo | Davit | 10 Oct | Not the CFP slug |
| DF-23 | Wire `loadSpeakers()` to Sessionize API | todo | Davit | 16 Oct | Swap data source only |
| DF-24 | Build-time speaker JSON snapshot as offline fallback | todo | Davit | 16 Oct | |
| DF-25 | Verify 9+ compact grid state with real data | todo | Davit | 20 Oct | ~20 expected |
| DF-26 | Speaker announcement social assets | todo | GDG team | 20 Oct | Templates in brand deck |
| DF-27 | Hide CFP block after 14 Oct — verify | todo | Davit | 15 Oct | Date-aware. Checkpoint task |
| DF-39 | Decide how content gets published in October | todo | Davit | 9 Oct | Decision task — see brief |

## Phase 3 — Agenda (1–10 Nov)

| ID | Task | Status | Owner | Due | Notes |
|---|---|---|---|---|---|
| DF-28 | Two-track agenda section | todo | Davit | 5 Nov | |
| DF-29 | Sessionize GridSmart embed + theme overrides | todo | Davit | 5 Nov | Only embed retained |
| DF-30 | Workshop section if workshops are accepted | todo | Davit | 5 Nov | Limited number |
| DF-31 | Partner logos final — all tiers | todo | GDG team | 7 Nov | |
| DF-32 | Organizers section | todo | Davit | 7 Nov | |

## Phase 4 — Day of (21 Nov)

| ID | Task | Status | Owner | Due | Notes |
|---|---|---|---|---|---|
| DF-33 | Day-of mode: live "now / next" from the agenda data | todo | Davit | 17 Nov | Rescoped — see log 19 Sep. Needs DF-28 |
| DF-40 | Practical info card: wifi, rooms, catering, emergency contact | todo | Davit | 18 Nov | Content from GDG team |
| DF-41 | Floor plan section | todo | Davit | 18 Nov | Needs a plan image from AUA |
| DF-34 | PWA offline verified on real devices | todo | Davit | 19 Nov | Needs HTTPS tunnel (ADR-005) |
| DF-35 | Feedback form link | todo | Davit | 20 Nov | |

## Phase 5 — Post-event

| ID | Task | Status | Owner | Due | Notes |
|---|---|---|---|---|---|
| DF-36 | Thank-you hero | todo | Davit | 24 Nov | |
| DF-37 | Photo gallery | todo | Davit | 28 Nov | 2025 had Google Photos proxy |
| DF-38 | Archive site, retrospective notes | todo | Davit | 5 Dec | Feeds 2027 |

---

## Task briefs

Only for tasks a row cannot carry. Everything else is self-evident from its row.

### DF-12 · Venue section — remove the pending-photo path

**Context.** `docs/BRAND.md` for the asset inventory. The venue section already renders
name, detail, address and a map link. It also carries a placeholder branch waiting for a
licensed ACSE building photo. That photo is never arriving — AUA's complete asset set is the
two PNG lockups in `public/assets/logos/` — so the branch is permanent dead code that reads
like unfinished work.

**Goal.** Make the photo-less venue section the finished state rather than a pending one.

**Steps.**
1. In `src/main.ts`, delete the `photo` conditional in `venue()` (around line 175) and the
   `<!-- DF-12: ... -->` placeholder comment with it. Render the section directly.
2. Remove `photo: string | null` from the `venue` type in `src/content.ts`.
3. Remove `"photo": null` from `public/content/event.json`.
4. Run all three checks.

**Constraints.** Do not substitute another image — not a stock photo of a different
building, not a map screenshot, not an image from `cse.aua.am`. A text venue block with a
map link is the deliverable. Do not delete the venue section itself, and do not touch the
`mapUrl`.

**Definition of done.** No occurrence of `photo` under `src/` or in `event.json`; the venue
section still renders name, detail, address and the Maps button; all three checks pass.

**Commit message.** `DF-12: venue section ships without a building photo`

---

### DF-39 · Decide how content gets published in October

**Context.** Read `docs/HANDOVER.md`, then `docs/TASK-MANAGEMENT.md` §9. ADR-001 moved
content into `public/content/*.json` so that publishing a speaker would not require a
developer. That is true of the file *format* and false of the *workflow*: publishing still
means clone, commit, push. Nobody has confirmed that a co-organizer will actually do that.

**Goal.** Decide, and record as an ADR, how speaker and partner content reaches the live
site in October.

**Steps.**
1. Establish who will publish content in October — Davit alone, or a co-organizer.
2. If Davit alone: record the ADR as "status quo, git workflow", close this task, and
   retire R-5 from the risk register. No code changes.
3. If a co-organizer: choose between (a) GitHub web editor on a protected branch with CI
   validation as the gate, (b) a CMS-backed JSON source, (c) a forms-to-JSON bridge.
4. Record the choice as ADR-007 with its cost.
5. If the choice is not status quo, create the implementation tasks with due dates before
   **16 October** — DF-23's date, when speakers land.

**Constraints.** Do not build anything under this task; it is a decision. Do not weaken
`validate:content` or `check:brand` to make a publishing path easier — those guards are the
reason a non-developer can be trusted to edit content at all. Do not add a runtime admin UI
to a statically served site.

**Definition of done.** ADR-007 exists in `docs/DECISIONS.md`; if it is not status quo,
every follow-on task has a board row with an owner and a due date before 16 October.

**Decision date: 9 October.** Retrofitting this during speaker-announcement week will not
go well.

**Commit message.** `DF-39: record ADR-007, content publishing workflow`

---

## Risk register

| ID | Risk | Impact | Mitigation |
|---|---|---|---|
| R-3 | Fewer than ~20 accepted talks | Two tracks become unfillable | Monitor submissions weekly from 1 Oct; extend CFP if thin |
| R-4 | Sessionize API shape changes | Speakers section breaks | DF-24 snapshot fallback |
| R-5 | Content edits still require git, so they still require a developer | Bottleneck on one person in the busiest weeks | The JSON model and CI validation cover the format only; the workflow is unsolved. DF-39, decide by 9 Oct |
| R-6 | AUA colors leak into the design system | Brand drift | CI guard in DF-06 |
| R-7 | Repo exists only on Davit's machine | Total loss of scaffold, docs and history | DF-01 — push to GitHub. Open since 19 Sep; the only mitigation is doing it |

**Closed.** IDs are not reused.

- **R-1** (ACSE assets delayed) — closed 19 Sep. There is nothing outstanding to be delayed:
  the two PNGs in the repo are AUA's complete set. The venue section ships without a photo.
- **R-2** (lockup violates the GDG brand guide) — closed 19 Sep. Davit is the GDG Yerevan
  organizer; the separate-strip arrangement is his call and he has made it.

---

## Comments log

Newest first. Format: `### YYYY-MM-DD · DF-XX · author`

### 2026-09-19 · DF-11, DF-12, DF-13 · Claude Code (task manager)
Davit: AUA has only the two PNG lockups already sitting in `public/assets/logos/` — no SVG,
no reversed/white mark, and no building photo available to license. DF-11 is therefore
cancelled, because there is nothing left to ask for, and DF-13 goes with it, because there
is no vector to swap to. The 2130×610 navy PNG is the master and is comfortably large enough
for 2x at the strip's rendered size, so the PNG is the permanent answer, not a stopgap.
DF-12 is rescoped rather than cancelled: the venue section still ships, as name, address and
a map link. Its `photo` field and placeholder branch come out so that a future session does
not read them as unfinished work and go looking for an image. The rule against lifting a
photo from `cse.aua.am` stays in CLAUDE.md — it is now permanent, not a wait.

### 2026-09-19 · DF-14 · Claude Code (task manager)
Cancelled at Davit's direction: he is the GDG Yerevan organizer, so the lockup arrangement is
his to approve and he has approved it. Also removed from §8 of the role charter, which had
listed it under escalate-never-attempt — that entry assumed the approver was someone else,
and leaving it would have had a future session emailing for permission Davit already holds.
DF-20 no longer has an approval dependency; DF-17 is the only remaining gate on the deploy.

### 2026-09-19 · DF-42 · Claude Code (task manager)
New. Running the mandatory checks needed `npm install`, which revealed there is no
committed lockfile and CI runs `npm install`, not `npm ci`, against caret ranges. So the
versions CI resolves are not the versions that passed locally, and a transitive release
between now and November can turn a green build red with no commit to blame it on — during
the week the site has to go live. The generated `package-lock.json` is sitting untracked in
the working tree; it is left for this task rather than smuggled into a docs commit. Local
run today was clean: brand guard, content validation and `tsc --noEmit && vite build` all
passed, 89 packages, vite 5.4.21.

### 2026-09-19 · DF-11, DF-14 · Claude Code (task manager)
Both are external waits on the critical path and neither has been sent. Drafted both
messages in `docs/OUTREACH.md` so the remaining work is a human pressing send, not
composing one from scratch. Chase dates set: 25 Sep for ACSE, 26 Sep for the regional lead.
DF-12 and DF-13 were `blocked` with a named blocker but no follow-up date, which the role
charter calls a bug in the board — both now carry 26 Sep.

**Superseded the same day.** Both tasks were cancelled once Davit confirmed the asset
situation and his own role — see the two entries above. `docs/OUTREACH.md` was deleted with
them; the drafts were for requests that no longer need making. Kept as a row here because
the reasoning explains why the file existed for an afternoon.

### 2026-09-19 · DF-33 · Claude Code (task manager)
Split. "Live now/next, wifi, floor plan" was three unrelated deliverables in one row: one
needs agenda data and date logic, one needs copy from the GDG team, one needs an image from
AUA. Bundled, the whole row would have stalled on whichever dependency arrived last — on
19 November. DF-33 keeps the now/next behaviour; DF-40 takes practical info; DF-41 takes the
floor plan. Dates pulled to 17–18 Nov because day-of work that lands the night before
cannot be tested on a real phone.

### 2026-09-19 · DF-39 · Claude Code (task manager)
New. `docs/TASK-MANAGEMENT.md` §9 flags a gap that is easy to miss because the code looks
finished: ADR-001's premise is that a co-organizer can publish content without a developer,
but the workflow is still clone/commit/push. Either that premise is dropped or it is built,
and the decision has to land before DF-23 on 16 October. Written as a decision task, not an
implementation task — the answer may well be "status quo", which is a legitimate outcome and
retires R-5.

### 2026-09-19 · ADR-006 · Claude Code (task manager)
Tracker resolved: the board stays authoritative, GitHub Issues are not used for `DF-xx`.
`gh` turned out not to be installed on the build machine, which weakened the original case
for Issues. Deleted `scripts/bootstrap-issues.sh` rather than leaving it — a bootstrap
script sitting in the repo is an invitation to half-migrate, and a half-migrated tracker is
worse than either option. Also set `core.fileMode=false` locally: extracting the tarball on
Windows showed all three scripts as modified when only their permission bits had changed.

### 2026-09-19 · DF-06 · Davit
Added a brand-color guard to CI rather than relying on review discipline. It greps
`src/**` for the AUA hex values and fails the build. The failure mode it prevents —
a partner's palette slowly becoming the site's palette — is gradual and easy to miss in
a diff.

### 2026-09-19 · DF-04 · Davit
Content model settled as runtime-fetched JSON rather than build-time imports. Slightly
worse for initial paint, decisively better for the actual constraint: content changes are
frequent between now and November and should not require a rebuild or TypeScript
knowledge.

### 2026-09-19 · DF-23 · Davit
`speakers.json` is deliberately shaped to Sessionize's `view/Speakers` response —
`fullName`, `tagLine`, `bio`, `profilePicture`, `links[]`, `sessions[]`. Writing the card
component against that shape now means October's integration is a data-source change, not
a component rewrite.

### 2026-09-19 · DF-11 · Davit
Asset request must go out this week. The building photo cannot be taken from `cse.aua.am`
— it is ACSE's copyrighted asset and this is a co-branded site. Requesting: vector logo,
reversed/white mark, brand usage rules, licensed high-res building photo.

### 2026-09-19 · DF-03 · Davit
Google palette leads; AUA navy and orange never appear as CSS values. AUA orange
`#fc4c02` sits between DevFest red `#ea4335` and yellow `#f9ab00` and would read as an
error rather than a choice. The collaboration strip uses `#f0f0f0` — already in the Google
palette — as a fixed light background in both themes, which also resolves dark-mode
contrast for the navy mark.
