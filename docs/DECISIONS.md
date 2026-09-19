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
