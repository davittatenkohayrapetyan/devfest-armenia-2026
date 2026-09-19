# Brand Rules

## Hierarchy

Google DevFest branding leads. This is a DevFest event; ACSE at AUA is a collaborating
institution, not a second brand identity for the site.

## Palette — the only source of color

From the official DevFest 2026 asset kit.

| Token | Hex | Use |
|---|---|---|
| `--df-blue` | `#4285f4` | Primary action, links |
| `--df-green` | `#34a853` | Confirmation, track B |
| `--df-yellow` | `#f9ab00` | Highlight, countdown |
| `--df-red` | `#ea4335` | Deadline, track A |
| `--df-surface-light` | `#f0f0f0` | Light surface, collaboration strip |
| `--df-surface-dark` | `#1e1e1e` | Dark surface |
| pastels | `#c3ecf6` `#ccf6c5` `#ffe7a5` `#f8d8d8` | Section tints |
| halftones | `#57caff` `#5cdb6d` `#ffd427` `#ff7daf` | Emphasis, key art |

## Forbidden as CSS values

| Hex | What it is | Why |
|---|---|---|
| `#003b5c` | AUA navy | Partner brand. Lives only inside the logo file. |
| `#fc4c02` | AUA orange | Sits between DevFest red and yellow; reads as an error. |

CI greps `src/` for these and fails the build. If a legitimate need appears, change the
guard deliberately with a note in the comments log — do not work around it.

## Logo placement

- **Hero:** DevFest Armenia lockup alone. Generate it from the kit's editable-location
  asset by replacing "Editable Location" with "Armenia". Keep ample clear space.
- **Collaboration strip:** its own band below the hero. GDG Yerevan and AUA ACSE side by
  side, equal optical weight, on `--df-surface-light` in both themes.
- **Partners:** separate section, tiered, never combined with the DevFest lockup.

Never build a custom DevFest + AUA combined lockup. The kit asks organizers to use the
provided lockups as designed.

## Aligning the two marks

Both marks in the strip use the **same** CSS height, because both files are now pure artwork.
`aua-acse-strip.png` is `aua-acse-navy.png` with its empty canvas trimmed (1700x192 from
2130x610) — no pixel of the mark is altered, only surrounding emptiness removed. Its height is
therefore the height of the word "AUA", which matches the GDG chevron (239px of 240px) to
within half a percent.

The trim also fixes spacing. CSS `gap` spaces image *boxes*, not artwork, so while AUA carried
~68% internal padding an equal gap pushed its ink about 33px further from the `×` than GDG's.
Clear space around the mark is now expressed as layout gap, where it is visible and
adjustable. `aua-acse-navy.png` is retained untouched as the master.

The two marks are separated by a `×`, decorative and `aria-hidden`. Only GDG Yerevan is
labelled, with "Organized by"; the label is positioned out of flow so the two marks stay
centred on the same line rather than the labelled one sitting lower.

AUA's lockup is roughly 3.5:1; GDG Yerevan's is closer to square. Align by **optical
cap-height of the letterforms**, not by bounding box — matching container heights makes
AUA look oversized. The strip sets a fixed cap-height and lets widths fall where they land.

## DevFest and GDG Yerevan logo files

| File | Source | Use |
|---|---|---|
| `devfest-armenia-lockup.svg` | Derived — see below | Hero. Light-on-dark only |
| `devfest-lockup.svg` | `devfest.am/2024` | The `{ DevFest }` mark alone, dark ink, for light surfaces |
| `gdg-yerevan.png` | Supplied by Davit, 19 Sep | Collaboration strip |
| `gdg-yerevan-square.png` | Supplied by Davit, 19 Sep | Stacked variant, for square placements |

`devfest-armenia-lockup.svg` was built from `devfest-lockup.svg` by recolouring the wordmark
to `#FFFFFF` — the 2024 file is `#1E1E1E`, which is invisible on the hero scrim — and setting
"Armenia 2026" **inside the braces**, on a second line under "DevFest".

That slot is not improvised. In the 2024 mark the braces span y 0–66 while the letters occupy
only y 0.6–33.7, leaving a deliberate empty band inside the brackets: it is the editable
location slot the kit's lockup is built around. The line is Roboto Bold at 22.5 units with
1.5 units of tracking, optically centred at (116.1, 48.8) in the 232×67 viewBox, and
**converted to outlines** — so the lockup carries no font dependency and renders identically
inlined or through `<img>`. There is no live text in the file: to change the wording,
regenerate from `devfest-lockup.svg` rather than editing it.

The GDG Yerevan files were supplied as RGB on white. The white was keyed to alpha so they sit
on the strip without a visible box. They are PNG, not vector — if an SVG ever appears, prefer it.

## AUA logo files

| File | Source | Colors | Use |
|---|---|---|---|
| `aua-acse-navy.png` | 2130×610, transparent | `#003b5c` | Master, retained untouched |
| `aua-acse-strip.png` | 1700×192, derived | `#003b5c` | Collaboration strip. Master with empty canvas trimmed |
| `aua-acse-color.png` | 512×147, transparent | `#003b5c` + `#fc4c02` | Standalone placements only |

These two files are AUA's complete asset set for this event — confirmed 19 September. There
is no SVG and no reversed/white knockout, and none are coming, so do not design a placement
that needs one. The navy master at 2130×610 covers 2x at the strip's rendered size, which is
why the missing vector costs nothing here.
Do not apply `filter: invert()` or `brightness(0) invert(1)` — that alters the partner's
mark and mangles the two-color version.

## Typography

Google Sans is the DevFest face but is not publicly licensed. Use Roboto from Google Fonts
with a Google Sans first in the stack so it resolves where available:

```css
font-family: "Google Sans", "Roboto", system-ui, sans-serif;
```
