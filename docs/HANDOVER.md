# Session Handover → Claude Code

Written 19 September 2026. Everything below was decided in a Claude chat session that had
no filesystem access. Claude Code now owns this repo, including task creation and
management.

---

## 1. What this is

The website for **DevFest Armenia 2026** — 21 November 2026, American University of
Armenia, Yerevan. Organized by GDG Yerevan in collaboration with the Zaven P. & Sonia
Akian College of Science & Engineering (ACSE) at AUA.

- 20+ speakers, three tracks plus workshops, 350+ participants expected
- CFP open 3 Sep, **closes 14 October 2026, 23:59 (UTC+04:00)**
- Registration: https://gdg.community.dev/events/details/google-gdg-yerevan-presents-devfest-armenia-2026/
- CFP: https://sessionize.com/devfest-armenia-2026/
- Chapter: https://gdg.community.dev/gdg-yerevan/

Between now and 14 October the site's primary job is **driving CFP submissions**, not
displaying an agenda that does not exist yet.

## 2. State on handover

A scaffold was built in the chat session and delivered as `devfest-armenia-2026.tar.gz`.
It is a real git repo with one commit. The GitHub repo exists and is empty. Port 3026 is
open on the local machine.

If the archive has not been extracted yet:

```bash
tar -xzf devfest-armenia-2026.tar.gz -C ~/projects
```

What is in it:

| | |
|---|---|
| Stack | Vite + TypeScript + Tailwind, Docker on :3026, nginx |
| Content | `public/content/*.json` — runtime-fetched, no rebuild needed to publish |
| Sections | Hero, collaboration strip, CFP countdown, about, speakers empty state, partners, venue, footer |
| Guards | `scripts/check-brand.mjs`, `scripts/validate-content.mjs`, both wired into CI |
| Docs | `docs/PLAN.md`, `docs/BOARD.md`, `docs/BRAND.md`, `docs/DECISIONS.md` |
| Assets | AUA ACSE logos, both transparent PNG |

Nothing has been pushed. CI has never run.

## 3. Decisions already made — do not relitigate without reason

Full reasoning in `docs/DECISIONS.md`. Summary:

- **ADR-001** Fork the 2025 stack; move content out of TypeScript into JSON. Last year
  publishing a speaker meant editing `src/main.ts`, which put one person on the critical
  path during the busiest weeks.
- **ADR-002** English only. No i18n, flat strings, `lang="en"`.
- **ADR-003** The Google DevFest palette is the only design system. AUA colours live
  inside the logo file and never in CSS.
- **ADR-004** Sessionize JSON API, not script embeds, for speakers. GridSmart embed
  retained for the day-of agenda grid only.
- **ADR-005** Port 3026; PWA verification through an HTTPS tunnel, not LAN forwarding.

## 4. Standing constraints

These apply to every task on this repo and are duplicated in `CLAUDE.md` so they load
automatically.

- **Never add `#003b5c` (AUA navy) or `#fc4c02` (AUA orange) as CSS values.** They belong
  inside the logo image only. `npm run check:brand` fails the build on either. If it
  fires, fix the code — never weaken or bypass the guard. AUA orange sits between DevFest
  red `#ea4335` and yellow `#f9ab00` and reads as an error rather than a choice.
- **Never build a combined DevFest + AUA lockup.** Google's kit asks organizers to use the
  provided lockups as designed. AUA appears in its own collaboration strip below the hero,
  never in the hero itself.
- **The collaboration strip stays `#f0f0f0` in both light and dark themes.** The AUA mark
  is single-colour navy and drops to ~1.5:1 against the dark surface. Do not solve this
  with `filter: invert()` — that alters a partner's mark.
- **Never invent content.** Empty `speakers.json` / `partners.json` / `organizers.json`
  are intentional; the empty states are the deliverable for this phase.
- **The site carries no ACSE building photo.** AUA has only the two PNG lockups already in
  the repo — no SVG, no reversed mark, no photo to license. Do not source one from
  `cse.aua.am`; it is their copyrighted asset on a co-branded site.
- **Do not wire Sessionize yet.** The 2026 embed ID is unknown and is *not* the CFP slug
  `devfest-armenia-2026` — 2025's was `fep0017x`. October work, DF-22/DF-23.

## 5. Immediate work

DF-01 is the next task: add the remote, push `main`, run all three checks, bring up
`docker compose` on :3026, verify CI goes green, then update the tracking docs and commit.

The scaffold's own commit must be preserved — do not re-initialize or squash it.

After that, in rough order: DF-07–09 (DevFest lockup, landing-page headers, GDG Yerevan
SVG), DF-12 (venue section, now that the building photo is off the table), DF-17
(deployment target, which fixes `VITE_BASE_PATH`), then launch.

DF-11 and DF-14 were cancelled on 19 September — see the board. Nothing on the path to
launch is waiting on a reply from outside the project.

## 6. Open items

| | |
|---|---|
| Sessionize embed ID | Unknown; needed before mid-October |
| Deployment target | WordPress subfolder as in 2025, or standalone? Decides `VITE_BASE_PATH` |
| Analytics | Tool not chosen |

## 7. ADR-006 — resolved 19 September: the board stays authoritative

**Decided. Do not re-raise.** Davit chose `docs/BOARD.md` as the single source of truth for
task status. GitHub Issues are not used for `DF-xx` tracking. `scripts/bootstrap-issues.sh`
has been deleted so the tracker cannot end up half-migrated. Full reasoning in
`docs/DECISIONS.md` → ADR-006.

Practical effect for any session reading this: task status is a file in this repo. Edit the
row, add a comments-log entry when something moves to `blocked`, `cancelled` or `done`, and
update "Last updated" at the top of the board.

## 8. Going forward

Claude Code creates and manages tasks from here. When a task reveals work that is not
tracked, add it as a new item rather than silently doing it — that habit is what keeps the
tracking honest once several sessions are working on the same repo.
