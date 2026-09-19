# DevFest Armenia 2026

Single-page site for DevFest Armenia 2026 — 21 November 2026, American University of
Armenia, Yerevan. Organized by GDG Yerevan in collaboration with the Zaven P. & Sonia
Akian College of Science & Engineering (ACSE) at AUA.

Vite · TypeScript · Tailwind · Docker.

## Documents

| | |
|---|---|
| [docs/HANDOVER.md](docs/HANDOVER.md) | Session handover — read this first |
| [docs/PLAN.md](docs/PLAN.md) | Build plan, approach, milestones |
| [docs/BOARD.md](docs/BOARD.md) | Task board, risk register, comments log |
| [docs/TASK-MANAGEMENT.md](docs/TASK-MANAGEMENT.md) | Role charter for whoever manages the board |
| [docs/BRAND.md](docs/BRAND.md) | Palette, logo placement, forbidden colours |
| [docs/DECISIONS.md](docs/DECISIONS.md) | Architecture decision records |

## Run it

```bash
npm install
npm run dev              # http://localhost:3025
```

Review build on the dedicated port:

```bash
docker compose up -d --build     # http://localhost:3026
```

Phone review: port-forward 3026. Note that service workers require a secure context, so a
LAN IP over plain HTTP will render the layout but skip all PWA behaviour. For real PWA
testing put a Cloudflare Tunnel or ngrok in front of the container.

## Editing content — no TypeScript required

Everything on the page comes from `public/content/*.json`:

| File | Holds |
|---|---|
| `event.json` | Dates, venue, CTA links, CFP details, about copy |
| `speakers.json` | Speakers. Empty array renders the "announced soon" state. |
| `partners.json` | Tiered partner logos |
| `tracks.json` | The three tracks |
| `organizers.json` | GDG Yerevan team |

Edit, commit, done. CI validates the structure, so a malformed edit fails the build rather
than the live site.

## Adding speakers in October

`speakers.json` uses the Sessionize field shape. When sessions are approved, replace the
body of `loadSpeakers()` in `src/content.ts` with the API fetch — the commented version is
right there. Nothing else changes. Tracked as DF-23.

## Brand

The Google DevFest palette is the only design system. AUA colours live inside the logo
file and never in CSS; `npm run check:brand` enforces this in CI. Read
[docs/BRAND.md](docs/BRAND.md) before touching styles.

## Tracking

The board in `docs/BOARD.md` is the only tracker (ADR-006). Task status is a row in that
file — GitHub Issues are not used for `DF-xx` work. Update the row, and add a comments-log
entry whenever something moves to `blocked`, `cancelled` or `done`.

## License

MIT
