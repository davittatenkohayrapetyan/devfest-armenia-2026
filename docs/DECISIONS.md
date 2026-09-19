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

## ADR-008 · 2026-09-19 · Standalone deployment (path superseded by ADR-011)

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

## ADR-009 · 2026-09-19 · Speakers are synced on demand, not fetched at runtime

**Decision:** `public/content/speakers.json` is written by a job Davit runs —
`npm run sync:speakers`, DF-50 — which reads
`https://sessionize.com/api/v2/2d3htmgm/view/All`. The site never calls Sessionize at runtime.
Supersedes the delivery mechanism in ADR-004; DF-23 and DF-24 are cancelled.

**Why:** Davit's call, 19 September. A runtime fetch makes every page view depend on a third
party being up, including on event day, and it publishes whatever Sessionize holds at the
moment a visitor loads the page. A job makes publishing deliberate: he runs it when the data is
ready to be public, reviews the diff, and commits it.

**What ADR-004 keeps:** the field shape. `speakers.json` still mirrors Sessionize's records, so
the card component never has to change. That was always the valuable half of ADR-004.

**Consequence:** DF-24's "snapshot as offline fallback" is meaningless under this model — the
snapshot is the only source. Speaker images are downloaded locally by the same job rather than
hotlinked, so the site carries no third-party dependency for faces either. Talks and the agenda
stay out until explicitly asked for; the sync writes `sessions: []` deliberately, not
accidentally.

## ADR-010 · 2026-09-19 · Button labels are sized to the WCAG large-text threshold

**Decision:** `.btn` labels are `1.1875rem` (19px) at weight `700`. The DevFest kit blue
`#4285f4` stays exactly as it is.

**Why:** White on `#4285f4` is **3.56:1**. WCAG AA requires 4.5:1 for normal-size text but 3:1
for large text — 18.66px bold or larger. At 16px/500 the primary button failed; at 19px/700 it
passes, and it passes because the text genuinely is more legible, which is the reason the
threshold exists. Not a loophole.

**Alternative rejected:** `#1a73e8`, Google's own accessible blue, gives 4.6:1 and would have
been the cleaner number. It is not in the DevFest 2026 kit. Constraint 2 makes the kit the only
design system, and ADR-003 exists because a partner or "accessible variant" colour adopted as an
exception becomes a second palette within weeks. A typographic fix costs nothing and sets no
precedent; a colour exception sets one that others will cite.

**Cost:** Buttons are visually heavier, and on a narrow phone the two hero CTAs wrap to separate
lines rather than sitting side by side. Acceptable on a page whose primary job is to get people
to click one of them.

**Consequence:** Do not reduce `.btn` font-size or weight without re-measuring. Dropping either
below the threshold silently reintroduces an AA failure that no test in this repo would catch.

## ADR-011 · 2026-09-19 · The site lives at `devfest.am/2026`, so the base path is `/2026/`

**Decision:** Deploy to `https://devfest.am/2026`, matching `devfest.am/2025`.
`VITE_BASE_PATH` is `/2026/`, **not** `/`. Supersedes the path half of ADR-008; the rest of
ADR-008 — standalone, not a WordPress install — still holds.

**Why ADR-008 was wrong on this point:** "standalone" was read as "at a domain root". It is not.
The site is standalone in that it does not live inside WordPress, but it is still served from a
subfolder of `devfest.am`, one per year. Built with base `/`, every asset would have requested
`/assets/...` and 404'd at `/2026/`.

**How the mistake is prevented from recurring:** `build:deploy` derives the base path from
`VITE_SITE_URL`'s own pathname rather than taking a second variable that could disagree with it,
and then verifies that every asset reference in the built `index.html` actually starts with that
base. A build whose paths do not match its origin fails instead of shipping.

**Consequence — `robots.txt`:** it is only honoured at an origin root, so the copy at
`devfest.am/2026/robots.txt` will be ignored by crawlers. The `Sitemap:` line must be added to
the `robots.txt` at `devfest.am`'s root instead. The deploy build prints this reminder whenever
the base path is not `/`. The sitemap itself is fine where it is.

## ADR-012 · 2026-09-19 · Cookieless analytics, off unless configured

**Decision:** Plausible, loaded via the `script.outbound-links` variant, enabled only when
`VITE_ANALYTICS_DOMAIN` is set. Davit's call, 19 September, closing DF-18.

**Why:** The site needs three numbers — page views, *Register* clicks, *Submit a talk* clicks.
Plausible is cookieless and stores no personal data, so no consent banner is required. That
matters more than it sounds: this is a landing page whose entire job is one click, and a consent
dialog in front of it costs conversions on top of the compliance work. The outbound-links
variant counts the two CTAs without any custom event code, because both go off-site.

**GA4 rejected:** free and familiar, and it would fit existing GDG reporting, but it sets
cookies and processes personal data. That means a banner, a processor agreement, and a worse
first impression, in exchange for funnels and session detail that nobody will read for a
one-page event site.

**How it is wired:** a Vite plugin injects the tag at build time into `index.html` only. No
variable set means no tag at all — so local builds, preview builds and the container all run
clean, and there is nothing to "remember to turn off". The internal board view never receives
it, which was checked, not assumed.

**Consequence:** registration and submission totals still come from the GDG platform and
Sessionize; this measures the site's contribution to them, not attendance. If it is ever swapped
for self-hosted Umami, set `VITE_ANALYTICS_SRC` — no code change needed.
