# DevFest Armenia 2026 — Build Plan

**Event:** 21 November 2026 · American University of Armenia, Yerevan
**Organizers:** GDG Yerevan, in collaboration with the Zaven P. & Sonia Akian College of Science & Engineering (ACSE) at AUA
**Scale:** ~300–350 attendees · ~20 speakers · 2 parallel tracks
**CFP:** opened 3 Sep 2026 · closes 14 Oct 2026, 23:59 (UTC+04:00)

---

## 1. Objective

Ship a single-page site whose primary job, between now and 14 October, is **driving CFP
submissions and registrations**. Everything else — speakers, agenda, day-of information — is
layered on as the content becomes real.

The site is deliberately built to be updated by editing JSON, not TypeScript, so publishing
a speaker or a partner logo does not require a developer.

### Success criteria

| | |
|---|---|
| Before 14 Oct | CFP call is the most prominent action on the page; countdown visible |
| Before 21 Nov | Speakers, agenda and venue information are complete and accurate |
| Throughout | Any co-organizer can publish content by editing a JSON file |
| Throughout | Google DevFest brand compliance — no local color inventions |

---

## 2. Approach

Fork the structure of `devfest-armenia-2025` (Vite + TypeScript + Tailwind + PWA + Docker),
but fix the one thing that hurt last year: content was hardcoded in `src/main.ts`.

### Content model

All copy and data lives in `public/content/*.json`, fetched at runtime:

```
public/content/
  event.json        # dates, venue, CTA URLs, copy blocks
  speakers.json     # manual now; Sessionize-shaped for a later swap
  partners.json     # tier, name, logo, url
  organizers.json   # GDG Yerevan team
  tracks.json       # two parallel tracks
```

### Sessionize strategy

Do **not** use the `<script>` embeds for speakers. Last year they required CSS overrides in
`style.css` to fight Sessionize's own styling.

Instead, `speakers.json` is shaped to match the Sessionize API response
(`https://sessionize.com/api/v2/{embedId}/view/Speakers`). The card component is written
against that type today and reads from the local file. In October, when sessions are
approved, the change is a single function — `loadSpeakers()` reads the API instead of the
file. Same component, same CSS, no refactor under deadline pressure.

Keep the GridSmart embed for the day-of agenda grid only; that one is genuinely hard to
rebuild and is not needed until early November.

**Open:** the 2026 Sessionize embed ID is not yet known. The CFP slug
(`devfest-armenia-2026`) is *not* the embed ID — 2025's was `fep0017x`. Retrieve it from
the Sessionize dashboard under Embed before wiring the API.

---

## 3. Brand rules

The Google DevFest palette leads. AUA's brand colors exist **only inside the logo image
file** and never as CSS values.

```
--df-blue   #4285f4      --df-green  #34a853
--df-yellow #f9ab00      --df-red    #ea4335
--df-surface-light #f0f0f0
--df-surface-dark  #1e1e1e
pastels: #c3ecf6 #ccf6c5 #ffe7a5 #f8d8d8
```

Forbidden as CSS values anywhere in the codebase: `#003b5c` (AUA navy), `#fc4c02`
(AUA orange). Enforced by a CI check — see `.github/workflows/ci.yml`.

Logo hierarchy:

- **Hero** — DevFest Armenia lockup only. No competing marks.
- **Collaboration strip** — a distinct band directly below the hero, on `#f0f0f0` in both
  light and dark themes. GDG Yerevan and AUA ACSE side by side at equal optical weight.
- **Everywhere else** — pure DevFest system.

The strip's fixed light background solves the dark-mode contrast problem (AUA navy on
`#1e1e1e` is ~1.5:1 and effectively invisible) using a token already in the Google palette,
rather than an invented color or a CSS filter that would alter the partner's mark.

Full detail in [BRAND.md](./BRAND.md).

---

## 4. Section order (v1)

1. Hero — lockup, date, venue, dual CTA (Register primary / Submit a talk secondary)
2. Collaboration strip — GDG Yerevan + AUA ACSE
3. Call for speakers — countdown to 14 Oct, formats, topics, selection principles
4. About — the event, the collaboration, two tracks
5. Speakers — empty state until October
6. Partners — placeholder grid + "Become a partner"
7. Venue — AUA, map, address
8. Footer — GDG Community platform, socials, Meetup migration note

Sections 3 and 5 are date-aware: the CFP block hides itself after 14 Oct, and the speakers
section switches from empty state to grid based on `speakers.json` length.

---

## 5. Local build and review

```bash
npm install
npm run dev -- --host 0.0.0.0 --port 3025   # iteration
```

```bash
docker compose up -d --build                 # review build on :3026
```

Dedicated port: **3026**.

**Known constraint:** service workers only register in a secure context. `http://localhost`
qualifies; `http://192.168.x.x:3026` from a phone does not. LAN port-forwarding will show
layout correctly but silently skip all PWA and offline behaviour. To test the PWA properly
on a phone, put a Cloudflare Tunnel or ngrok in front of the container — that also gives a
shareable HTTPS URL for co-organizers.

---

## 6. Milestones

| Window | Milestone | Gate |
|---|---|---|
| 20–24 Sep | Repo, scaffold, content model, v1 sections running on :3026 | Reviewed on phone |
| 25–30 Sep | ACSE assets, OG/SEO, deploy | Site public |
| 1–14 Oct | CFP promotion period | Submissions tracked |
| 15–25 Oct | Speakers section live, Sessionize API wired | ~20 speakers published |
| 1–10 Nov | Agenda grid, two-track schedule | GridSmart embedded |
| 21 Nov | Day-of mode: live schedule, wifi, floor plan | — |
| 22 Nov+ | Post-event: thank-you, photo gallery | — |

---

## 7. Open decisions and risks

Tracked as live items on [BOARD.md](./BOARD.md). Summary:

1. **ACSE building photo** — must be requested, not lifted from `cse.aua.am`. It is their
   copyrighted asset on a co-branded site. If it takes more than a week, ship v1 with a
   neutral hero and swap later. Do not block CFP promotion on an asset request.
2. **Logo lockup arrangement** — confirm with the GDG regional lead that a separate
   collaboration strip (rather than a combined lockup) is the correct reading of the brand
   guide. One email; far cheaper than a rebrand after launch.
3. **Reversed AUA mark** — request the white knockout version from ACSE. Not blocking
   thanks to the light strip, but it gives more layout freedom later.
4. **Sessionize embed ID** — needed before October.
5. **Deployment target** — WordPress subfolder as in 2025, or standalone? Affects
   `VITE_BASE_PATH`. Decide before the first public deploy.

Language is settled: **English only**. No locale nesting in the content model.
