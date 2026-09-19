# Tracking Board — DevFest Armenia 2026

**Last updated:** 2026-09-19

Status key: `todo` · `doing` · `blocked` · `review` · `done`
Each task has a stable ID. Discussion goes in the [Comments log](#comments-log) at the
bottom, keyed by ID, newest first. Keep rows terse; put reasoning in the log.

To mirror this board into GitHub Issues: `./scripts/bootstrap-issues.sh`

---

## Phase 0 — Foundation (20–24 Sep)

| ID | Task | Status | Owner | Due | Notes |
|---|---|---|---|---|---|
| DF-01 | Create `devfest-armenia-2026` repo on GitHub, push scaffold | todo | Davit | 20 Sep | Public, MIT |
| DF-02 | Vite + TS + Tailwind skeleton building clean | done | Davit | 20 Sep | Scaffolded |
| DF-03 | Design tokens from DevFest 2026 kit in `style.css` | done | Davit | 20 Sep | See BRAND.md |
| DF-04 | JSON content model + loader + types | done | Davit | 21 Sep | `src/content.ts` |
| DF-05 | Docker + compose on port 3026 | done | Davit | 21 Sep | `docker compose up -d` |
| DF-06 | CI: build + content schema validation + brand-color guard | done | Davit | 22 Sep | Fails on AUA hex in CSS |
| DF-07 | Download DevFest 2026 landing-page headers (2650/1440/640×500) | todo | Davit | 22 Sep | From brand deck |
| DF-08 | Create DevFest Armenia lockup from editable-location asset | todo | Davit | 22 Sep | Google Drawings |
| DF-09 | Source GDG Yerevan logo SVG | todo | Davit | 22 Sep | |
| DF-10 | Review v1 on phone via :3026 | todo | Davit | 24 Sep | Port-forward |

## Phase 1 — Content and launch (25–30 Sep)

| ID | Task | Status | Owner | Due | Notes |
|---|---|---|---|---|---|
| DF-11 | Request AUA/ACSE assets: SVG, reversed mark, building photo, brand rules | todo | Davit | 22 Sep | Blocks DF-12, DF-13 |
| DF-12 | Venue section with licensed ACSE building photo | blocked | — | 29 Sep | Blocked by DF-11 |
| DF-13 | Swap AUA PNG for SVG in collaboration strip | blocked | — | 29 Sep | Blocked by DF-11 |
| DF-14 | Confirm logo lockup arrangement with GDG regional lead | todo | Davit | 23 Sep | Risk item |
| DF-15 | Final About / CFP copy review | todo | Davit | 26 Sep | |
| DF-16 | OG image, meta tags, sitemap, robots.txt | todo | Davit | 28 Sep | |
| DF-17 | Decide deployment target and `VITE_BASE_PATH` | todo | Davit | 26 Sep | WP subfolder vs standalone |
| DF-18 | Analytics | todo | Davit | 28 Sep | Which tool? |
| DF-19 | Accessibility pass: contrast, focus, reduced motion, keyboard | todo | Davit | 29 Sep | |
| DF-20 | Public deploy | todo | Davit | 30 Sep | |
| DF-21 | Announce site on GDG Community platform and socials | todo | Davit | 30 Sep | |

## Phase 2 — Speakers (15–25 Oct)

| ID | Task | Status | Owner | Due | Notes |
|---|---|---|---|---|---|
| DF-22 | Retrieve Sessionize embed ID for 2026 | todo | Davit | 10 Oct | Not the CFP slug |
| DF-23 | Wire `loadSpeakers()` to Sessionize API | todo | Davit | 16 Oct | Swap data source only |
| DF-24 | Build-time speaker JSON snapshot as offline fallback | todo | Davit | 16 Oct | |
| DF-25 | Verify 9+ compact grid state with real data | todo | Davit | 20 Oct | ~20 expected |
| DF-26 | Speaker announcement social assets | todo | GDG team | 20 Oct | Templates in brand deck |
| DF-27 | Hide CFP block after 14 Oct — verify | todo | Davit | 15 Oct | Date-aware |

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
| DF-33 | Day-of mode: live "now/next", wifi, floor plan | todo | Davit | 19 Nov | |
| DF-34 | PWA offline verified on real devices | todo | Davit | 19 Nov | Needs HTTPS |
| DF-35 | Feedback form link | todo | Davit | 20 Nov | |

## Phase 5 — Post-event

| ID | Task | Status | Owner | Due | Notes |
|---|---|---|---|---|---|
| DF-36 | Thank-you hero | todo | Davit | 24 Nov | |
| DF-37 | Photo gallery | todo | Davit | 28 Nov | 2025 had Google Photos proxy |
| DF-38 | Archive site, retrospective notes | todo | Davit | 5 Dec | Feeds 2027 |

---

## Risk register

| ID | Risk | Impact | Mitigation |
|---|---|---|---|
| R-1 | ACSE assets delayed | Venue section blocked, co-branding on PNG | Ship v1 with neutral hero; do not block CFP promotion |
| R-2 | Logo lockup violates GDG brand guide | Rework after launch | DF-14 — confirm with regional lead before public deploy |
| R-3 | Fewer than ~20 accepted talks | Two tracks become unfillable | Monitor submissions weekly from 1 Oct; extend CFP if thin |
| R-4 | Sessionize API shape changes | Speakers section breaks | DF-24 snapshot fallback |
| R-5 | Content edits require a developer | Bottleneck on one person | JSON content model + CI validation (DF-04, DF-06) |
| R-6 | AUA colors leak into the design system | Brand drift | CI guard in DF-06 |

---

## Comments log

Newest first. Format: `### YYYY-MM-DD · DF-XX · author`

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
