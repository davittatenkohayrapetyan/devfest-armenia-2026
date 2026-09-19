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

AUA's lockup is roughly 3.5:1; GDG Yerevan's is closer to square. Align by **optical
cap-height of the letterforms**, not by bounding box — matching container heights makes
AUA look oversized. The strip sets a fixed cap-height and lets widths fall where they land.

## AUA logo files

| File | Source | Colors | Use |
|---|---|---|---|
| `aua-acse-navy.png` | 2130×610, transparent | `#003b5c` | Master. Collaboration strip. |
| `aua-acse-color.png` | 512×147, transparent | `#003b5c` + `#fc4c02` | Standalone placements only |
| `aua-acse-reverse.*` | pending from ACSE | white | Dark backgrounds |

Requested from ACSE: SVG, reversed/white knockout, brand usage rules.
Do not apply `filter: invert()` or `brightness(0) invert(1)` — that alters the partner's
mark and mangles the two-color version.

## Typography

Google Sans is the DevFest face but is not publicly licensed. Use Roboto from Google Fonts
with a Google Sans first in the stack so it resolves where available:

```css
font-family: "Google Sans", "Roboto", system-ui, sans-serif;
```
