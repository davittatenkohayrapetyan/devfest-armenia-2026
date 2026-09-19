/**
 * Internal build-progress view, rendered at /implementation-progress.
 *
 * Reads public/content/board.json, which scripts/build-board.mjs generates from
 * docs/BOARD.md (DF-47). Nothing here is hand-maintained: the board is the only tracker
 * (ADR-006), and this page is a view of it.
 *
 * Not linked from the site, not in the sitemap, noindex. See DF-48.
 */
import "./style.css";

const base = import.meta.env.BASE_URL;

type Task = {
  id: string;
  task: string;
  status: string;
  owner: string | null;
  due: string | null;
  notes: string;
  phase: string | null;
  phaseName: string | null;
};

type Totals = { tasks: number } & Record<string, number>;

type Board = {
  lastUpdated: string;
  totals: Totals;
  phases: { id: string; name: string; window: string | null; taskIds: string[] }[];
  tasks: Task[];
  risks: { id: string; risk: string; impact: string; mitigation: string }[];
  risksClosed: { id: string; note: string }[];
  comments: { date: string; ids: string[]; author: string; body: string }[];
};

const esc = (s: string): string =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

/** Minimal inline markdown: `code` and **bold**, which is all the board uses in cells. */
const md = (s: string): string =>
  esc(s)
    .replace(/`([^`]+)`/g, '<code class="prog-code">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

const STATUS_ORDER = ["done", "doing", "review", "todo", "blocked", "cancelled"];

/** Colour is never the only signal — every chip carries its status word. */
const STATUS_COLOR: Record<string, string> = {
  done: "var(--df-green)",
  doing: "var(--df-blue)",
  review: "var(--df-yellow)",
  todo: "var(--ink-muted)",
  blocked: "var(--df-red)",
  cancelled: "var(--rule)",
};

function bar(totals: Totals): string {
  const total = totals.tasks;
  const present = STATUS_ORDER.filter((s) => (totals[s] ?? 0) > 0);
  const segments = present.map((s) => {
    const n = totals[s] ?? 0;
    return `<div class="prog-seg" style="width:${(n / total) * 100}%;background:${STATUS_COLOR[s]}"
            title="${n} ${s}"></div>`;
  });
  const legend = present
    .map(
      (s) => `<li class="prog-legend-item">
        <span class="prog-dot" style="background:${STATUS_COLOR[s]}"></span>
        <strong>${totals[s]}</strong> ${s}
      </li>`,
    )
    .join("");
  return `
<div class="prog-bar" role="img"
     aria-label="${present.map((s) => `${totals[s] ?? 0} ${s}`).join(", ")}">
  ${segments.join("")}
</div>
<ul class="prog-legend">${legend}</ul>`;
}

function taskRow(t: Task): string {
  const meta = [t.owner, t.due].filter((v): v is string => Boolean(v)).map(esc).join(" · ");
  return `
<li class="prog-task${t.status === "cancelled" ? " prog-task-cancelled" : ""}">
  <div class="prog-task-head">
    <span class="prog-id">${esc(t.id)}</span>
    <span class="prog-chip" style="--chip:${STATUS_COLOR[t.status]}">${esc(t.status)}</span>
  </div>
  <p class="prog-task-name">${md(t.task)}</p>
  ${meta ? `<p class="prog-meta">${meta}</p>` : ""}
  ${t.notes ? `<p class="prog-notes">${md(t.notes)}</p>` : ""}
</li>`;
}

function phaseBlock(b: Board, phase: Board["phases"][number]): string {
  const tasks = b.tasks.filter((t) => t.phase === phase.id);
  const done = tasks.filter((t) => t.status === "done").length;
  return `
<section class="prog-phase">
  <h2 class="prog-phase-title">
    ${esc(phase.id)} — ${esc(phase.name)}
    ${phase.window ? `<span class="prog-window">${esc(phase.window)}</span>` : ""}
  </h2>
  <p class="prog-meta">${done} of ${tasks.length} done</p>
  <ul class="prog-tasks">${tasks.map(taskRow).join("")}</ul>
</section>`;
}

function render(b: Board): string {
  return `
<div class="prog-wrap">
  <header class="prog-header">
    <h1 class="prog-title">Implementation progress</h1>
    <p class="prog-meta">
      DevFest Armenia 2026 · generated from <code class="prog-code">docs/BOARD.md</code> ·
      board last updated ${esc(b.lastUpdated)}
    </p>
    ${bar(b.totals)}
  </header>

  ${b.phases.map((p) => phaseBlock(b, p)).join("")}

  <section class="prog-phase">
    <h2 class="prog-phase-title">Risks</h2>
    <ul class="prog-tasks">
      ${b.risks
        .map(
          (r) => `<li class="prog-task">
            <div class="prog-task-head"><span class="prog-id">${esc(r.id)}</span>
              <span class="prog-chip" style="--chip:var(--df-yellow)">open</span></div>
            <p class="prog-task-name">${md(r.risk)}</p>
            <p class="prog-notes"><strong>Impact:</strong> ${md(r.impact)}</p>
            <p class="prog-notes"><strong>Mitigation:</strong> ${md(r.mitigation)}</p>
          </li>`,
        )
        .join("")}
      ${b.risksClosed
        .map(
          (r) => `<li class="prog-task prog-task-cancelled">
            <div class="prog-task-head"><span class="prog-id">${esc(r.id)}</span>
              <span class="prog-chip" style="--chip:var(--rule)">closed</span></div>
            <p class="prog-notes">${md(r.note)}</p>
          </li>`,
        )
        .join("")}
    </ul>
  </section>

  <section class="prog-phase">
    <h2 class="prog-phase-title">Comments log</h2>
    <ul class="prog-log">
      ${b.comments
        .map(
          (c) => `<li class="prog-entry">
            <p class="prog-meta">${esc(c.date)} · ${c.ids.map(esc).join(", ")} · ${esc(c.author)}</p>
            <p class="prog-entry-body">${md(c.body)}</p>
          </li>`,
        )
        .join("")}
    </ul>
  </section>
</div>`;
}

async function main(): Promise<void> {
  const root = document.querySelector<HTMLDivElement>("#board")!;
  try {
    const res = await fetch(`${base}content/board.json`);
    if (!res.ok) throw new Error(`board.json: ${res.status}`);
    root.innerHTML = render((await res.json()) as Board);
  } catch (err) {
    root.innerHTML = `<div class="prog-wrap">
      <h1 class="prog-title">Board failed to load</h1>
      <p class="prog-meta">Run <code class="prog-code">npm run build:board</code>. ${esc(String(err))}</p>
    </div>`;
  }
}

void main();
