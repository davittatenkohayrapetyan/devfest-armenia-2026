# Decision Log

Short, dated, irreversible-ish decisions. Reasoning that belongs to a single task goes in
BOARD.md's comments log instead.

## ADR-001 · 2026-09-19 · Fork the 2025 structure, refactor the content model

**Decision:** Reuse the `devfest-armenia-2025` stack (Vite + TS + Tailwind + PWA + Docker)
rather than starting fresh or adopting a framework. Move all content out of `src/main.ts`
into runtime-fetched JSON.

**Why:** The stack was proven under real event load. The content model was the actual pain
point — publishing a speaker required editing TypeScript, which put one person on the
critical path for every content change during the busiest weeks.

**Cost:** A small first-paint penalty from fetching JSON at runtime.

## ADR-002 · 2026-09-19 · English only

**Decision:** No internationalization. Flat strings, `lang="en"`.

**Why:** The audience is English-comfortable and the CFP, Sessionize and GDG platform are
all English. Retrofitting i18n later is real work, but paying for it now against an
audience that does not need it is worse.

## ADR-003 · 2026-09-19 · Google palette is the only design system

**Decision:** AUA brand colors never appear as CSS values, enforced in CI.

**Why:** Co-branded sites drift. A partner color adopted as an "accent" becomes a second
design system within weeks. The logo file carries AUA's identity; the stylesheet does not.

## ADR-004 · 2026-09-19 · Sessionize JSON API, not script embeds

**Decision:** Render speakers and sessions from
`sessionize.com/api/v2/{embedId}/view/Speakers`. Retain the GridSmart script embed only
for the day-of agenda grid.

**Why:** The 2025 embeds required CSS overrides to fight Sessionize's styling. The API
returns clean JSON and lets the cards use the DevFest design system directly.

**Consequence:** `speakers.json` must keep the Sessionize field shape so the October swap
is a data-source change, not a component rewrite.

## ADR-005 · 2026-09-19 · Dedicated port 3026, tunnel for PWA testing

**Decision:** Docker publishes on `3026`. PWA verification happens through an HTTPS tunnel,
not LAN port-forwarding.

**Why:** Service workers require a secure context. A LAN IP over plain HTTP silently skips
registration, so offline behaviour would appear to work in review and fail in production.

## ADR-006 · 2026-09-19 · `docs/BOARD.md` is the authoritative tracker

**Decision:** Task status lives in `docs/BOARD.md` and nowhere else. GitHub Issues are not
used for task tracking. `scripts/bootstrap-issues.sh` has been deleted and the board's
"mirror into Issues" pointer removed.

**Why:** Davit's call, 19 September. Three things supported it: `gh` is not installed on
the build machine, so Issues would have added a toolchain dependency before DF-01 could
even run; this is a one-maintainer project, so the threading and assignment that Issues
buys are mostly unused; and the two parts of the board with real long-term value — the
risk register and the comments log — have no good home in Issues anyway.

**Cost:** Status is not queryable from outside the repo, and issues will not auto-link to
the commits that close them. Accepted: the board is read by sessions that have the repo
checked out, which is all of them.

**Consequence:** Do not re-raise this. If Issues are ever opened on the repo, they are for
external bug reports, not for `DF-xx` tracking. The bootstrap script was removed rather
than left in place precisely so a future session cannot half-migrate the tracker — which
the role charter (§3) correctly calls worse than either option.

## ADR-007 · 2026-09-19 · Build the 2026 visual identity from GDG Yerevan's own 2024/2025 assets

**Decision:** Stop waiting on the official DevFest 2026 organizer kit. Source the hero
lockup, the GDG mark and the decorative key-art elements from `devfest.am/2024`, and the
photographic backgrounds from the DevFest Armenia 2025 archive. Davit's call, 19 September.

**Why:** The kit is behind the organizer console and was blocking DF-07, DF-08 and DF-09
indefinitely. The 2024 assets are GDG Yerevan's own prior-year files, they are already
drawn in the DevFest palette this site uses, and the wordmark carries no year — so reusing
them is closer to the brand than anything a session could construct.

**What did not change:** The palette is still the only design system, AUA colours still
never appear as CSS values, and there is still no combined DevFest + AUA lockup — the hero
carries the DevFest mark alone and AUA remains in the collaboration strip.

**Cost and consequence:** These are 2024-vintage files. If the 2026 kit specifies different
key art, the hero needs re-cutting — DF-46. `hero-image.svg` from 2024 was deliberately not
used: it has a "2024" pill baked into the artwork. Only the year-neutral elements were taken.

## ADR-008 · 2026-09-19 · Standalone deployment at the domain root

**Decision:** The site deploys standalone at a domain root, not into a WordPress subfolder as
in 2025. `VITE_BASE_PATH` stays `/`. Davit's call, 19 September, closing DF-17.

**Why:** No dependency on the WordPress install, and every asset path the site already ships
is root-relative, so the default needs no change.

**Consequence:** Deployment is a file copy. `npm run build:deploy` produces `dist/` for the
hosting provider; serve its contents at the root. That build deliberately omits the internal
board view at `/implementation-progress` and the `board.json` it reads, and fails if either
leaks. Unlinked and `noindex` are adequate for the local container; not publishing at all is
the only version of private that does not depend on obscurity.

If the target ever changes to a subfolder, set `VITE_BASE_PATH` to that path and rebuild —
nothing else needs touching, which is why the variable exists.
