# Handover → Task and Board Manager

Written 19 September 2026. This document defines a **role**, not a task. The session
holding it owns task creation, tracking and board hygiene for this repo. It does not
implement features.

Read `docs/HANDOVER.md` first for project context, then this.

---

## 1. Why this role exists

Multiple sessions with no shared memory will work on this repo between now and
21 November. The board is the only thing that survives between them. Its job is to make
context loss cheap — not to produce process.

That sets the bar for everything below: **if a tracking activity does not change what the
next session does, do not do it.** No burndown charts, no status narratives, no
reformatting. A single maintainer with a hard date does not need ceremony; he needs a
board that is true.

## 2. Scope

**Owns**

- Creating, phrasing, splitting and closing tasks
- Board state: status, owners, due dates, dependencies, the comments log
- The risk register
- Dependency and critical-path integrity
- Flagging stalls, blockers and date pressure

**Does not own**

- Writing feature code, styles or content
- Brand decisions — `docs/BRAND.md` is settled, not a negotiation
- Architecture decisions — propose an ADR, do not decide one
- Anything requiring a human relationship (see §8)

If implementation work is genuinely trivial and unblocks a task, do it and say so in the
comments log. Otherwise write the task and stop.

## 3. Tracking system — settled

**Resolved 19 September 2026. Do not re-open this.** Davit chose `docs/BOARD.md` as the
authoritative tracker; GitHub Issues are not used for `DF-xx` status. `gh` is not installed
on the build machine, this is a one-maintainer project, and the risk register and comments
log have no good home in Issues anyway. Reasoning is in ADR-006.

`scripts/bootstrap-issues.sh` was deleted as part of implementing that decision, so there is
no half-migration path left to take by accident. If Issues are ever opened on the repo, they
are for external bug reports only.

## 4. Task authoring standard

Every task is written for a session that knows nothing. The demonstrated template is in
this conversation's DF-01 brief; the shape is:

| Section | Purpose |
|---|---|
| Context | What the project is, which docs to read first |
| Goal | One sentence |
| Steps | Numbered, verifiable |
| Constraints | What not to do, and why |
| Definition of done | Checkable without judgement |
| Commit message | Prefixed with the task ID |

Two rules that matter more than the template:

**Constraints usually deserve more words than steps.** The likely failure is not getting
the mechanics wrong — it is a helpful session inventing placeholder speakers, or
"fixing" the brand guard when it fires. Both are quiet damage that passes review.

**Never write a task whose definition of done requires taste.** "Make the hero look
better" is not a task. "Replace the hero background with the 1440×500 kit header, verify
at 390px and 1440px" is.

### Sizing

One task = one session = one commit, ideally under two hours. If a task has an "and" in
its goal sentence, split it. DF-07 through DF-09 are correctly sized. DF-33 (day-of mode)
was not — split on 19 September into DF-33, DF-40 and DF-41.

## 5. Board conventions

- IDs are `DF-xx`, sequential, **never reused**. A cancelled task stays as a row with
  status `cancelled` and a one-line reason.
- Statuses: `todo` · `doing` · `blocked` · `review` · `done` · `cancelled`
- `blocked` requires a named blocker — a task ID or a person — and a follow-up date. A
  blocked row with neither is a bug in the board.
- `review` means a human must look, not that work remains.
- Every status change to `blocked`, `cancelled` or `done` gets a comments-log entry.
  Routine `todo → doing` does not.
- Update "Last updated" at the top whenever the board changes.

### Comments log

Newest first, `### YYYY-MM-DD · DF-XX · author`. Record what a future session would
otherwise have to rediscover: a check that failed and why, a version pin that was needed,
a doc that contradicted the code, an option considered and rejected. Do not log progress
narration.

## 6. Dependencies and critical path

Current known edges:

```
DF-17 (base path) ─────► DF-20 (public deploy)
DF-22 (embed ID) ──────► DF-23 ──► DF-24, DF-25
DF-07, DF-08, DF-09 ───► DF-10 (phone review)
DF-28 (agenda) ────────► DF-33 (now/next)
```

The critical path to launch runs DF-01 → DF-07/08/09 → DF-17 → DF-20, targeting a public
site by **30 September**. Everything after that is content layered onto a live page.

**There are currently no external waits.** DF-11 and DF-14 were cancelled on 19 September
once it was established that AUA has no further assets and that Davit, as the GDG Yerevan
organizer, is himself the brand approver. If a new dependency on someone outside the project
appears, it gets a row and a follow-up date the day it appears — those are the items that
silently consume a week.

## 7. Cadence

Weekly, and at any handover:

1. Any `doing` item older than three days — is it actually blocked?
2. Any `blocked` item past its follow-up date — escalate to Davit by name.
3. Does the critical path still clear 30 September? If not, say so plainly and propose
   what to cut, not just that it is late.
4. New risks to register.
5. Dates that have moved.

Two fixed checkpoints:

- **14 October** — CFP closes. Verify DF-27 (CFP block auto-hides) the same day. Phase 2
  opens.
- **21 November** — event. Phase 4 items must be `done`, not `review`.

## 8. Escalate, never attempt

These need a person, and a session that tries to work around them causes real damage:

| Item | Why |
|---|---|
| Partner and sponsor content | Commercial relationships |
| Speaker selection | Programme decision, not a tracking decision |
| Deployment target (DF-17) | Depends on infrastructure only Davit knows |

If one of these blocks the critical path, the correct output is a clearly worded message
Davit can send, plus a board row with a follow-up date.

## 9. Known gap worth tracking now

The content model was justified on the grounds that a co-organizer could publish without a
developer. That is true of the file format but false of the workflow — it still requires
clone, commit, push. If content publishing is genuinely to be delegated in October, that
is unbuilt work: a CMS-backed JSON source, or a GitHub web-editor flow on a protected
branch.

Tracked as **DF-39**, decision date 9 October, with a brief on the board. It is a decision
task, not an implementation task: "status quo, Davit publishes" is a legitimate answer and
retires R-5. What is not acceptable is discovering the answer during
speaker-announcement week.

## 10. Standing constraints

Inherited from `CLAUDE.md` and non-negotiable. The manager enforces them in task text:

1. `#003b5c` and `#fc4c02` are never CSS values; never weaken `check:brand`.
2. The Google DevFest 2026 palette is the only design system.
3. No combined DevFest + AUA lockup.
4. The collaboration strip stays `#f0f0f0` in both themes; no filters on a partner's mark.
5. Never invent content — empty states are the deliverable until 14 October.
6. No ACSE building photo on the site at all; never source one from `cse.aua.am`.
7. No Sessionize wiring until the embed ID is known. It is not the CFP slug.

Any task that would breach one of these is malformed. Rewrite it.
