#!/usr/bin/env bash
# Mirror docs/BOARD.md into GitHub Issues so task comments live in one place.
# Requires: gh auth login
set -euo pipefail

REPO="${1:-davittatenkohayrapetyan/devfest-armenia-2026}"

echo "Creating labels..."
gh label create "phase-0" --repo "$REPO" --color "4285f4" --force
gh label create "phase-1" --repo "$REPO" --color "34a853" --force
gh label create "phase-2" --repo "$REPO" --color "f9ab00" --force
gh label create "phase-3" --repo "$REPO" --color "ea4335" --force
gh label create "blocked"  --repo "$REPO" --color "1e1e1e" --force
gh label create "brand"    --repo "$REPO" --color "c3ecf6" --force

echo "Creating milestones..."
for m in "Phase 0 — Foundation:2026-09-24" \
         "Phase 1 — Launch:2026-09-30" \
         "Phase 2 — Speakers:2026-10-25" \
         "Phase 3 — Agenda:2026-11-10" \
         "Phase 4 — Day of:2026-11-21"; do
  title="${m%%:*}"; due="${m##*:}"
  gh api "repos/$REPO/milestones" -f title="$title" -f due_on="${due}T23:59:59Z" \
    >/dev/null 2>&1 || echo "  milestone exists: $title"
done

create() { # id | title | labels | milestone
  gh issue create --repo "$REPO" --title "$1: $2" \
    --label "$3" --milestone "$4" \
    --body "Tracked in docs/BOARD.md as $1. Update the board row when status changes." \
    >/dev/null && echo "  $1"
}

echo "Creating open issues..."
create "DF-01" "Create GitHub repo and push scaffold"              "phase-0"         "Phase 0 — Foundation"
create "DF-07" "Download DevFest 2026 landing-page headers"        "phase-0,brand"   "Phase 0 — Foundation"
create "DF-08" "Create DevFest Armenia lockup"                     "phase-0,brand"   "Phase 0 — Foundation"
create "DF-09" "Source GDG Yerevan logo SVG"                       "phase-0,brand"   "Phase 0 — Foundation"
create "DF-10" "Review v1 on phone via :3026"                      "phase-0"         "Phase 0 — Foundation"
create "DF-11" "Request AUA/ACSE assets"                           "phase-1,brand"   "Phase 1 — Launch"
create "DF-12" "Venue section with licensed ACSE photo"            "phase-1,blocked" "Phase 1 — Launch"
create "DF-13" "Swap AUA PNG for SVG"                              "phase-1,blocked" "Phase 1 — Launch"
create "DF-14" "Confirm logo lockup with GDG regional lead"        "phase-1,brand"   "Phase 1 — Launch"
create "DF-16" "OG image, meta tags, sitemap, robots.txt"          "phase-1"         "Phase 1 — Launch"
create "DF-17" "Decide deployment target and VITE_BASE_PATH"       "phase-1"         "Phase 1 — Launch"
create "DF-19" "Accessibility pass"                                "phase-1"         "Phase 1 — Launch"
create "DF-20" "Public deploy"                                     "phase-1"         "Phase 1 — Launch"
create "DF-22" "Retrieve Sessionize embed ID"                      "phase-2"         "Phase 2 — Speakers"
create "DF-23" "Wire loadSpeakers() to Sessionize API"             "phase-2"         "Phase 2 — Speakers"
create "DF-24" "Build-time speaker snapshot fallback"              "phase-2"         "Phase 2 — Speakers"
create "DF-28" "Two-track agenda section"                          "phase-3"         "Phase 3 — Agenda"
create "DF-29" "Sessionize GridSmart embed"                        "phase-3"         "Phase 3 — Agenda"

echo "Done. Board: docs/BOARD.md"
