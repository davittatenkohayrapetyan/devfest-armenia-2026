# DevFest Armenia 2026 — website

Single-page site for DevFest Armenia 2026: 21 November 2026, American University of
Armenia, Yerevan. Organized by GDG Yerevan with the Zaven P. & Sonia Akian College of
Science & Engineering (ACSE) at AUA.

Vite + TypeScript + Tailwind, served by nginx in Docker on **port 3026**.

New to this repo: read `docs/HANDOVER.md` first, then `docs/PLAN.md` and `docs/BOARD.md`.

## Commands

```bash
npm run dev                      # localhost:3025
npm run build                    # tsc --noEmit + vite build
npm run check:brand              # partner-colour guard
npm run validate:content         # JSON schema check
docker compose up -d --build     # localhost:3026
```

All three checks must pass before any commit. CI runs the same three.

## Content model

Everything on the page comes from `public/content/*.json`, fetched at runtime. Publishing
a speaker or a partner logo is a JSON edit, never a TypeScript edit. Keep it that way —
this is the constraint that ADR-001 exists to protect.

`speakers.json` uses the Sessionize API field shape (`fullName`, `tagLine`, `bio`,
`profilePicture`, `links[]`, `sessions[]`). Preserve it. The October swap replaces the
body of `loadSpeakers()` in `src/content.ts` and nothing else.

## Hard constraints

1. **`#003b5c` and `#fc4c02` are never CSS values.** These are AUA's brand colours and
   belong inside the logo image only. `check:brand` fails the build on either. If it
   fires, fix the code — never weaken, skip or bypass the guard.
2. **The Google DevFest 2026 palette is the only design system.** Blue `#4285f4`, green
   `#34a853`, yellow `#f9ab00`, red `#ea4335`, surfaces `#f0f0f0` / `#1e1e1e`, plus the
   kit's pastels and halftones. Do not introduce colours outside it.
3. **Never build a combined DevFest + AUA lockup.** The hero carries the DevFest Armenia
   lockup alone. AUA appears only in the collaboration strip below it.
4. **The collaboration strip stays `#f0f0f0` in both themes.** The AUA mark is
   single-colour navy and is unreadable on the dark surface. Do not use `filter: invert()`
   or any other transform on a partner's logo.
5. **Never invent content.** Empty `speakers.json`, `partners.json` and `organizers.json`
   are intentional. The empty states are the deliverable until the CFP closes on
   14 October 2026.
6. **The site carries no ACSE building photo.** AUA's complete asset set is the two PNG
   lockups in `public/assets/logos/`; there is no licensed photo and none is coming. Do not
   take one from `cse.aua.am` — copyrighted, and this is a co-branded site — and do not
   substitute a stock photo of a different building.
7. **Do not wire Sessionize until the embed ID is known.** It is not the CFP slug.

## Working agreement

- Scope each session to one tracked task ID.
- Work that a task reveals but does not cover gets a new tracked item, not a silent fix.
- Record anything surprising — a failed check, a needed pin, a doc that contradicts the
  code — in the comments log rather than only in the commit message.
- Commit messages start with the task ID: `DF-01: push scaffold, verify build on :3026`.

## Reference

| | |
|---|---|
| `docs/HANDOVER.md` | Session handover, full context, open items |
| `docs/PLAN.md` | Build plan and milestones |
| `docs/BOARD.md` | Task board (authoritative — ADR-006), risk register, comments log |
| `docs/TASK-MANAGEMENT.md` | Role charter for task and board management |
| `docs/BRAND.md` | Palette, logo placement, forbidden values |
| `docs/DECISIONS.md` | ADR-001 to ADR-006 |
