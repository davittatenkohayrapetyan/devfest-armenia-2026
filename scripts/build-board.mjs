// Generates public/content/board.json from docs/BOARD.md.
//
// The board is the only tracker (ADR-006). This script reads it and never writes to it, so
// the page DF-48 renders cannot drift from the file a human edits. The output is a build
// artifact and is gitignored — a committed copy would be a second source of truth.
//
// Fails loudly on a malformed row rather than emitting a half-parsed board: a progress page
// that quietly drops tasks is worse than no progress page.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const SRC = "docs/BOARD.md";
const OUT = "public/content/board.json";

const md = readFileSync(SRC, "utf8");
const lines = md.split(/\r?\n/);
const errors = [];

/** Split a markdown table row into trimmed cells. */
const cells = (line) =>
  line
    .split("|")
    .slice(1, -1)
    .map((c) => c.trim());

const lastUpdated = md.match(/^\*\*Last updated:\*\*\s*(.+)$/m)?.[1]?.trim();
if (!lastUpdated) errors.push("could not find the Last updated line");

const STATUSES = ["todo", "doing", "blocked", "review", "done", "cancelled"];

const tasks = [];
const phases = [];
let phase = null;
let section = null;
const risks = [];
const risksClosed = [];
const comments = [];
let comment = null;

for (const line of lines) {
  const h2 = line.match(/^##\s+(.*)$/);
  if (h2) {
    const title = h2[1].trim();
    if (/^Phase\s/.test(title)) {
      // "Phase 1 — Content and launch (25–30 Sep)"
      const m = title.match(/^(Phase\s+\d+)\s*[—-]\s*([^(]+?)(?:\s*\((.+)\))?$/);
      phase = {
        id: m?.[1] ?? title,
        name: m?.[2]?.trim() ?? title,
        window: m?.[3]?.trim() ?? null,
      };
      phases.push(phase);
      section = "tasks";
    } else if (/^Risk register/i.test(title)) section = "risks";
    else if (/^Comments log/i.test(title)) section = "comments";
    else if (/^Task briefs/i.test(title)) section = "briefs";
    else section = null;
    continue;
  }

  if (section === "tasks" && /^\|\s*DF-/.test(line)) {
    const c = cells(line);
    if (c.length !== 6) {
      errors.push(`task row has ${c.length} cells, expected 6: ${line.trim()}`);
      continue;
    }
    const [id, task, status, owner, due, notes] = c;
    if (!STATUSES.includes(status)) {
      errors.push(`${id}: unknown status "${status}"`);
      continue;
    }
    tasks.push({
      id,
      task,
      status,
      owner: owner === "—" ? null : owner,
      due: due === "—" ? null : due,
      notes,
      phase: phase?.id ?? null,
      phaseName: phase?.name ?? null,
    });
    continue;
  }

  if (section === "risks") {
    if (/^\|\s*R-/.test(line)) {
      const c = cells(line);
      if (c.length !== 4) {
        errors.push(`risk row has ${c.length} cells, expected 4: ${line.trim()}`);
        continue;
      }
      risks.push({ id: c[0], risk: c[1], impact: c[2], mitigation: c[3] });
      continue;
    }
    // "- **R-1** (ACSE assets delayed) — closed 19 Sep. ..."
    const closed = line.match(/^-\s+\*\*(R-\d+)\*\*\s*(.*)$/);
    if (closed) {
      risksClosed.push({ id: closed[1], note: closed[2].replace(/^\((.*?)\)\s*/, "$1 ").trim() });
      continue;
    }
  }

  if (section === "comments") {
    // "### 2026-09-19 · DF-11, DF-14 · Claude Code (task manager)"
    const head = line.match(/^###\s+(\d{4}-\d{2}-\d{2})\s*·\s*(.+?)\s*·\s*(.+)$/);
    if (head) {
      comment = { date: head[1], ids: head[2].split(",").map((s) => s.trim()), author: head[3], body: "" };
      comments.push(comment);
      continue;
    }
    if (comment) comment.body += (comment.body ? "\n" : "") + line;
  }
}

if (tasks.length === 0) errors.push("no task rows parsed — has the board format changed?");

if (errors.length) {
  console.error(`Board parse failed (${SRC}):`);
  for (const e of errors) console.error("  " + e);
  process.exit(1);
}

for (const c of comments) c.body = c.body.trim();

const byStatus = Object.fromEntries(
  STATUSES.map((s) => [s, tasks.filter((t) => t.status === s).length]),
);

const board = {
  generatedFrom: SRC,
  lastUpdated,
  totals: { tasks: tasks.length, ...byStatus },
  phases: phases.map((p) => ({ ...p, taskIds: tasks.filter((t) => t.phase === p.id).map((t) => t.id) })),
  tasks,
  risks,
  risksClosed,
  comments,
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(board, null, 2) + "\n", "utf8");

const summary = STATUSES.filter((s) => byStatus[s]).map((s) => `${byStatus[s]} ${s}`).join(", ");
console.log(`Board generated: ${tasks.length} tasks (${summary}), ${risks.length} open risks, ${comments.length} log entries.`);
