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
| DF-01 | Create `devfest-armenia-2026` repo on GitHub, push scaffold | done | Davit | 20 Sep | Pushed 19 Sep, CI green on first run |
| DF-02 | Vite + TS + Tailwind skeleton building clean | done | Davit | 20 Sep | Scaffolded |
| DF-03 | Design tokens from DevFest 2026 kit in `style.css` | done | Davit | 20 Sep | See BRAND.md |
| DF-04 | JSON content model + loader + types | done | Davit | 21 Sep | `src/content.ts` |
| DF-05 | Docker + compose on port 3026 | done | Davit | 21 Sep | `docker compose up -d` |
| DF-06 | CI: build + content schema validation + brand-color guard | done | Davit | 22 Sep | Fails on AUA hex in CSS |
| DF-07 | Hero key art — decorative elements from the 2024 site | done | Davit | 22 Sep | ADR-007. Kit headers unobtainable |
| DF-08 | DevFest lockup in the hero | done | Davit | 22 Sep | ADR-007. `{ DevFest }` mark from the 2024 site, no year in it |
| DF-09 | Source GDG Yerevan logo SVG | todo | Davit | 22 Sep | Generic GDG mark in place as interim — the 2024 site had no Yerevan lockup |
| DF-10 | Review v1 on phone via :3026 | todo | Davit | 24 Sep | `http://<lan-ip>:3026`, container left up after each task. Needs DF-07/08/09 |
| DF-42 | Commit `package-lock.json`, switch CI to `npm ci` with node cache | done | Davit | 22 Sep | Dockerfile switched too — see log |
| DF-45 | 2025 photos as hero and CFP backgrounds | done | Davit | 22 Sep | Two photos, downscaled, EXIF stripped |
| DF-46 | Re-cut hero art if the 2026 kit becomes available | todo | Davit | 10 Oct | ADR-007 runs on 2024-vintage assets |
| DF-47 | Generate `board.json` from `BOARD.md` at build time | todo | Davit | 28 Sep | Internal, not launch-blocking. See brief |
| DF-48 | Board view at `/implementation-progress` | todo | Davit | 28 Sep | Needs DF-47. Unlinked page. See brief |
| DF-43 | Add `.dockerignore` | todo | Davit | 24 Sep | Build hygiene, not a bug — see log. Low priority |

## Phase 1 — Content and launch (25–30 Sep)

| ID | Task | Status | Owner | Due | Notes |
|---|---|---|---|---|---|
| DF-11 | Request AUA/ACSE assets: SVG, reversed mark, building photo, brand rules | cancelled | — | — | Nothing to request — AUA has only the two PNGs already in the repo |
| DF-12 | Venue section — name, address, map link, no photo | todo | Davit | 26 Sep | Rescoped, unblocked. See brief |
| DF-13 | Swap AUA PNG for SVG in collaboration strip | cancelled | — | — | No SVG exists; the 2130×610 navy PNG is the master |
| DF-14 | Confirm logo lockup arrangement with GDG regional lead | cancelled | — | — | Davit is the GDG Yerevan organizer; the call is his and he has made it |
| DF-15 | Final About / CFP copy review | todo | Davit | 26 Sep | |
| DF-44 | Document the neutral ramp in BRAND.md | todo | Davit | 26 Sep | Three greys in `style.css` are not in the palette table — see log |
| DF-16 | OG image, meta tags, sitemap, robots.txt | todo | Davit | 28 Sep | |
| DF-17 | Decide deployment target and `VITE_BASE_PATH` | todo | Davit | 26 Sep | WP subfolder vs standalone. Blocks DF-20 |
| DF-18 | Analytics | todo | Davit | 28 Sep | Which tool? |
| DF-19 | Accessibility pass: contrast, focus, reduced motion, keyboard | todo | Davit | 29 Sep | Must include text-on-photo contrast in the two new bands |
| DF-20 | Public deploy | todo | Davit | 30 Sep | Needs DF-17 |
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
| DF-28 | Two-track agenda section | todo | Davit | 5 Nov | `tracks.json` has no type, loader or schema check yet — add them |
| DF-29 | Sessionize GridSmart embed + theme overrides | todo | Davit | 5 Nov | Only embed retained |
| DF-30 | Workshop section if workshops are accepted | todo | Davit | 5 Nov | Limited number |
| DF-31 | Partner logos final — all tiers | todo | GDG team | 7 Nov | |
| DF-32 | Organizers section | todo | Davit | 7 Nov | `organizers.json` has no type, loader or schema check yet — add them |

## Phase 4 — Day of (21 Nov)

| ID | Task | Status | Owner | Due | Notes |
|---|---|---|---|---|---|
| DF-33 | Day-of mode: live "now / next" from the agenda data | todo | Davit | 17 Nov | Rescoped — see log 19 Sep. Needs DF-28 |
| DF-40 | Practical info card: wifi, rooms, catering, emergency contact | todo | Davit | 18 Nov | Content from GDG team |
| DF-41 | Floor plan section | todo | Davit | 18 Nov | External: ask AUA for a floor plan by 1 Nov |
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

### DF-01 · Push the scaffold to GitHub

**Context.** Read `CLAUDE.md`, then `docs/HANDOVER.md`. This repo exists only on Davit's
machine — three local commits, no remote, never pushed, CI never run. That is R-7 on the
risk register and it is the reason this task is first. The GitHub repo was created in
advance and is empty (HANDOVER §2).

**Goal.** Get `main` onto GitHub with CI green.

**Steps.**
1. Confirm the remote URL with Davit. The scaffold assumed
   `davittatenkohayrapetyan/devfest-armenia-2026` — do not guess if it does not match.
2. `git remote add origin <url>` — `gh` is not installed on this machine, so use plain git
   over HTTPS or SSH.
3. Run all three checks locally first: `npm run check:brand`, `npm run validate:content`,
   `npm run build`. They passed on 19 Sep; if one fails now, stop and log why before pushing.
4. `git push -u origin main`.
5. Watch the CI run on GitHub. It runs the same three checks on `ubuntu-latest` with Node 20.
   If it fails where local passed, that difference is the finding — record it in the comments
   log, do not paper over it.
6. `docker compose up -d --build`, confirm the site serves on `http://localhost:3026`, then
   `docker compose down`.
7. Set DF-01 to `done` on the board, close R-7 in the risk register with a one-line reason,
   update "Last updated", and add a comments-log entry — §5 requires one for any move to
   `done`, whether or not anything surprising happened.

**Constraints.** Do not re-initialize the repo, squash, amend or rebase — the scaffold's
three commits are the project's history and the handover says explicitly to preserve them.
Do not force-push. Do not commit `package-lock.json`; it is untracked on purpose and belongs
to DF-42, so stage files by name rather than `git add -A`. Do not fix CI's `npm install` here
either — also DF-42. If a check fails, fix the code, never the check; `check:brand` firing
means an AUA hex reached a CSS value and the fix is always in the CSS.

**Definition of done.** `git log origin/main` shows all three scaffold commits plus this
task's board update; the CI badge on the default branch is green; `curl -sI localhost:3026`
returned 200 while the container was up; DF-01 reads `done`.

**Commit message.** `DF-01: push scaffold, verify CI and :3026`

---

### DF-44 · Document the neutral ramp in BRAND.md

**Context.** Constraint 2 says the DevFest 2026 palette is the only design system and that
no colour outside it may be introduced. `src/style.css` nonetheless defines three neutrals
that `docs/BRAND.md`'s palette table does not list: `--surface: #ffffff`,
`--ink-muted: #5f6368`, and dark-mode `--surface-alt: #262626`. A page needs neutrals, so
this is almost certainly a documentation gap rather than brand drift — but as it stands the
guard doc and the stylesheet disagree, and the next person to add a grey has no rule to
follow.

**Goal.** Make `BRAND.md` the complete account of every colour in the stylesheet.

**Steps.**
1. Check whether the DevFest 2026 kit specifies neutrals. If it does, adopt its values.
2. If it does not, add a "Neutrals" table to `BRAND.md` listing the three in use, each with
   its purpose, and state that no further greys may be added without an entry there.
3. Confirm `#5f6368` on `#ffffff` and `#9aa0a6` on `#1e1e1e` both clear 4.5:1 for body text,
   since DF-19 will otherwise find it later.

**Constraints.** Do not add new colours while documenting the existing ones. Do not touch
the two forbidden AUA hexes or relax `check:brand`. If a token turns out to fail contrast,
record it for DF-19 rather than restyling the site under this task.

**Definition of done.** Every colour literal in `src/style.css` appears in a `BRAND.md`
table; the contrast figures for muted ink in both themes are written down.

**Commit message.** `DF-44: document the neutral ramp in BRAND.md`

---

### DF-47 · Generate `board.json` from `BOARD.md` at build time

**Context.** Read `docs/TASK-MANAGEMENT.md` §5 for the board's conventions, then ADR-006:
`docs/BOARD.md` is the only tracker. DF-48 renders the board as a web page, and that page
must read generated data — if anyone hand-edits a JSON copy of the board, the repo has two
trackers again, which is the exact failure ADR-006 exists to prevent.

**Goal.** Produce `public/content/board.json` from `docs/BOARD.md` as a build step.

**Steps.**
1. Write `scripts/build-board.mjs`. Parse from `docs/BOARD.md`:
   - phase sections (`## Phase N — Title (dates)`) and the task rows beneath each, as
     `{ id, task, status, owner, due, notes, phase }`;
   - the risk register table, including the "Closed" list under it;
   - the comments log, split on `### YYYY-MM-DD · IDs · author`;
   - the "Last updated" date from the top.
2. Write the result to `public/content/board.json`.
3. Add `"build:board": "node scripts/build-board.mjs"` to `package.json`, and call it from
   `prebuild` and `predev` so the file is never stale and never hand-edited.
4. Add `public/content/board.json` to `.gitignore`. It is a build artifact; committing it
   would let it drift from `BOARD.md`.
5. Verify: change a status in `BOARD.md`, re-run, confirm the JSON changes.

**Constraints.** The parser reads `BOARD.md`; it never writes to it. Do not "fix" board rows
from the script. Do not commit the generated JSON. Do not inline board content into anything
under `src/` — the comments log quotes both forbidden AUA hex values, so generating a `.ts`
file from it would fail `check:brand` and tempt someone to weaken the guard; keep the data
runtime-fetched, exactly as ADR-001 does for event content. If a row is malformed, fail with
the offending line rather than emitting a half-parsed board.

**Definition of done.** `npm run build:board` writes `public/content/board.json` containing
every task row currently in `BOARD.md` with the correct count per phase; the file is
gitignored; `npm run build` regenerates it automatically; all three checks pass.

**Commit message.** `DF-47: generate board.json from BOARD.md`

---

### DF-48 · Board view at `/implementation-progress`

**Context.** Needs DF-47. Davit wants to see build progress visually, at
`/implementation-progress`, with **no link to it from anywhere on the site**.

**Goal.** A read-only page that renders the generated board.

**Steps.**
1. Add `implementation-progress/index.html` as a second Vite entry — `nginx.conf` does
   `try_files $uri $uri/ /index.html`, so a real directory with its own `index.html`
   resolves, while a client-side route would silently serve the event page instead. Wire it
   through `build.rollupOptions.input` in `vite.config.ts`, keeping `index.html` as the
   first entry.
2. Put `<meta name="robots" content="noindex,nofollow">` in its head. No OG tags.
3. Render from `board.json`: tasks grouped by phase, with status, owner, due and notes; a
   count per status; the risk register including closed risks; and the comments log.
4. Show "Last updated" and the count of tasks by status at the top, so the page answers
   "where is this project" without scrolling.
5. Verify `http://localhost:3026/implementation-progress` returns 200 and renders, and that
   the event page is unchanged.

**Constraints.** Do not link it: no nav entry, no footer link, no `sitemap.xml` entry when
DF-16 writes one, no OG tags, and do not add it to any PWA precache list. Do not duplicate
the site's content components — this page is a table, not a marketing page, and it should
not grow a hero. Use only the palette in `docs/BRAND.md`; DevFest red for a `blocked` status
is fine, but never encode status by colour alone — pair every colour with its text label,
since `done` and `blocked` must be distinguishable in greyscale and by colourblind readers.
No AUA hex values in CSS, as everywhere else.

Note for whoever builds it: unlinked is not private, and this page will be publicly
reachable once DF-20 deploys. That is acceptable here only because `BOARD.md` is already
public in the GitHub repo, so the page exposes nothing new. If the board ever starts
carrying something that is not public — a sponsor negotiation, a person's contact details —
this page becomes a disclosure and needs gating. Raise it then; do not assume obscurity.

**Definition of done.** `/implementation-progress` returns 200 in the container and lists
every task from `BOARD.md`; `grep -r "implementation-progress" src/main.ts` returns nothing;
the page carries a noindex meta; all three checks pass; the event page is byte-identical in
behaviour.

**Commit message.** `DF-48: board view at /implementation-progress`

---

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

**Closed.** IDs are not reused.

- **R-7** (repo only on Davit's machine) — closed 19 Sep. `main` is on GitHub with all seven
  commits and CI green. Re-opens only if the remote is ever deleted.

- **R-1** (ACSE assets delayed) — closed 19 Sep. There is nothing outstanding to be delayed:
  the two PNGs in the repo are AUA's complete set. The venue section ships without a photo.
- **R-2** (lockup violates the GDG brand guide) — closed 19 Sep. Davit is the GDG Yerevan
  organizer; the separate-strip arrangement is his call and he has made it.

---

## Comments log

Newest first. Format: `### YYYY-MM-DD · DF-XX · author`

### 2026-09-19 · DF-47, DF-48 · Claude Code (task manager)
Davit asked for a visual board at `/implementation-progress`, unlinked from the site. Split
in two because the data path and the page are independently verifiable: DF-47 generates
`board.json` from `BOARD.md`, DF-48 renders it.

The split exists for a second reason. A board page fed by a hand-maintained JSON file would
be a second tracker within a week, which is what ADR-006 decided against — so the generator
is the task, and the page is downstream of it. The JSON is gitignored deliberately: a
committed artifact can drift from its source, a generated one cannot.

Two traps recorded so the implementing session does not hit them. `nginx.conf` falls back to
`/index.html` for unknown paths, so a client-side route would serve the event page at
`/implementation-progress` and look like it worked; it needs a real second Vite entry. And
the comments log quotes both forbidden AUA hex values, so generating anything under `src/`
from board text would fail `check:brand` — which is the moment someone decides the guard is
the problem. The data stays runtime-fetched.

Also flagged in DF-48: unlinked is not private. It is acceptable only because `BOARD.md` is
already public in the repo. If the board ever holds something that is not, the page needs
gating rather than obscurity.

### 2026-09-19 · DF-07, DF-08, DF-09, DF-45 · Claude Code (task manager)
Davit released the "official 2026 kit only" constraint, so the visual identity now comes
from GDG Yerevan's own prior-year assets. Recorded as ADR-007. What was actually found:

`devfest.am/2024` serves its assets as plain SVG. Taken: the `{ DevFest }` bracket lockup,
the GDG mark, and three decorative elements — all already drawn in this site's palette.
Deliberately **not** taken: `hero-image.svg`, the large key-art collage, because it has a
"2024" pill baked into the artwork. They are outlined paths with no `<text>`, so this was
only visible after rasterising them; a session that trusts filenames would have shipped a
2024 badge in the 2026 hero.

DF-09 stays open. The 2024 site used the **generic** "Google Developer Groups" logo, not a
Yerevan lockup, so that is what is in the collaboration strip now, with `alt` changed to
match rather than claiming to be something it is not. If a real GDG Yerevan lockup exists,
it should replace this.

Photos: the 2025 gallery proxies a Google Apps Script that returns a sign-in page, but the
Drive folder behind it is link-shared, so the originals are reachable directly. They are
5–16 MB at up to 9504×6336. Two were resized to 1920 wide at quality 72 — 194 KB and
145 KB — and re-encoded through `convert('RGB')`, which drops EXIF, since the originals
carry camera and potentially GPS metadata that has no business on a public site. Chosen for
being wide, dark and crowd-level. Avoided: every frame where a sponsor's stand dominates —
p14, p18 and p20 are EPAM-branded, and putting those on the 2026 site would imply a 2026
sponsorship that DF-31 has not agreed yet.

The gradient scrims over both photos are load-bearing, not decoration — they are what hold
body text at a readable contrast over an image whose luminance we do not control. Noted on
DF-19, which now has to measure them.

### 2026-09-19 · working agreement · Claude Code (task manager)
Davit reviews from his phone, so the container is now left **running** at the end of every
task rather than torn down. DF-01's brief said to bring it up, verify, then
`docker compose down`; that was treated as a verification step when it should have been the
handover state. Rule added to `CLAUDE.md`.

Two practical notes for whoever reports the URL. It must be the LAN address, not
`localhost` — a phone cannot resolve the host's loopback. The Ethernet interface is
currently `192.168.31.198`, but it is DHCP, so read it at the time rather than copying it
from a doc. And Windows classifies this network as **Public**, which would normally block
inbound 3026; it works because Docker Desktop installs its own enabled inbound allow rules
scoped to the Public profile. If a future session finds the phone cannot connect, that is
the thing to check first — the container being up is not sufficient evidence.

### 2026-09-19 · DF-02, DF-03, DF-04, DF-05 · Claude Code (task manager)
All four were marked `done` by a session with no shell, so they were claims rather than
verified facts. Checked each against the repo; all four hold, and the rows stay `done`.

DF-02: `tsc --noEmit && vite build` clean from a cold `npm ci`. DF-05: verified during DF-01
— compose up on 3026, 200 on `/`, on the hashed bundle and on `/content/event.json`.
DF-04: types and loaders exist for event, partners and speakers, the Sessionize field shape
is preserved with the October swap written out in a comment, the empty state renders the
"announced after 14 October" panel, the 9+ compact grid branch DF-25 will test already
exists, and a content load failure renders a message instead of a blank page.
DF-03: all ten kit tokens match `docs/BRAND.md` exactly. Confirmed in passing that
`.collab-strip` uses `--df-surface-light`, which the dark-mode block does not redefine — so
constraint 4 holds structurally, not just by convention.

Two gaps found, neither of them a reason to reopen a row. `tracks.json` and
`organizers.json` have no type, no loader and no structural validation — the validator only
parses them — so DF-28 and DF-32 must add those, not just build a section; noted on both
rows. And `style.css` carries three neutrals that `BRAND.md` never documents: `#ffffff`,
`#5f6368` for muted ink, and `#262626` for the dark alt surface. See DF-44.

### 2026-09-19 · DF-42 · Claude Code (task manager)
Done. `package-lock.json` committed (lockfileVersion 3, 137 entries, every `resolved` URL on
registry.npmjs.org — checked before committing, since a lockfile is exactly where a bad
registry would hide). CI now runs `npm ci` with `cache: npm` on `actions/setup-node`. The
Dockerfile went with it — `COPY package*.json` became an explicit
`COPY package.json package-lock.json` and `npm install` became `npm ci`, because a committed
lockfile that the image build ignores buys nothing. Slightly wider than the row's wording;
the alternative was reproducible CI and non-reproducible images.

Verified by deleting `node_modules` and running `npm ci` from clean (89 packages), then all
three checks, then `docker build --no-cache` (exit 0). Expect the package count to differ by
one between host and container — 89 local, 88 in the image — because esbuild's platform
binary is an optional dependency and only the matching one installs. That is correct
behaviour, not lockfile drift.

### 2026-09-19 · DF-01 · Claude Code (task manager)
Done. Remote `https://github.com/davittatenkohayrapetyan/devfest-armenia-2026`, pushed over
HTTPS with plain git. All seven commits are on `origin/main`, including the three scaffold
commits — nothing re-initialized, squashed or force-pushed. CI passed on its first run
(`e256f36`, run 35431645446), so the ubuntu-latest/Node 20 environment agrees with local on
all three checks. Container verified before teardown: `/` returned 200 with the built title,
the hashed JS bundle returned 200, and `/content/event.json` returned 200 through nginx —
that last one matters because it confirms ADR-001's runtime content fetch works in the
served image, not only under `vite dev`. One note for whoever pushes next: the Actions API
reported `total_count: 0` for several seconds after the push before the run appeared, so an
immediate check reads as "no CI" when the run is simply not registered yet.

### 2026-09-19 · DF-43 · Claude Code (task manager)
There is no `.dockerignore`, so `COPY . .` ships the host's `node_modules`, `dist` and `.git`
into the build context — about 50 MB that does not need to move. The obvious worry was
worse than that: the host `node_modules` contains `@esbuild/win32-x64`, and copying it over
the container's install looked certain to break `npm run build` inside the image. It does
not. `COPY` merges directories rather than replacing them, so the container's
`@esbuild/linux-x64` survives and esbuild resolves the correct binary at runtime. Verified
with `docker build --no-cache`: exit 0 with the host `node_modules` in the context and no
`.dockerignore` present. Recording it because the first two attempts to check this were
misleading — with layer cache warm, `docker compose build` reports success without ever
exercising the context, so a cold build is the only test that means anything here. DF-43 is
therefore build speed and image hygiene, not correctness, and should not block DF-01.

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
