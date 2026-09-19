// Produces a dist/ for the hosting provider, with the internal board view left out.
//
// /implementation-progress is unlinked and noindex, which is fine for the local container but
// is not a reason to publish it. This build omits the entry point and deletes the board data
// it reads, then proves both are absent rather than assuming it.
//
// Usage: npm run build:deploy
import { execFileSync } from "node:child_process";
import { existsSync, rmSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { readFileSync } from "node:fs";

const DIST = "dist";
const FORBIDDEN = ["implementation-progress", "board.json", "progress-"];

// Invoke the tools' JS entrypoints directly rather than `npm run build`: Node cannot
// execFile a .cmd shim on Windows without a shell, and going direct also skips the prebuild
// hook, so the board data is never generated for a deploy build in the first place.
const run = (script, args) =>
  execFileSync(process.execPath, [script, ...args], {
    stdio: "inherit",
    env: { ...process.env, OMIT_PROGRESS: "1" },
  });

// Absolute URLs are baked into the HTML and sitemap at build time, so the domain has to be
// right here — not fixed up afterwards. Refuse rather than ship a social card that 404s.
const site = process.env.VITE_SITE_URL;
if (!site || /localhost|127\.0\.0\.1/.test(site)) {
  console.error("Deploy build refused: VITE_SITE_URL is not a deployable origin.");
  console.error(`  current value: ${site ?? "(unset)"}`);
  console.error("  Set it to the real domain, e.g.");
  console.error("    VITE_SITE_URL=https://devfest.am/2026 npm run build:deploy");
  console.error("  It is baked into og:image, og:url, canonical and sitemap.xml.");
  process.exit(1);
}
console.log(`Origin: ${site}`);

// Regenerate the SEO files under THIS origin. Skipping prebuild means public/robots.txt and
// public/sitemap.xml are whatever the last local build left there — localhost — and Vite
// copies public/ verbatim, so stale files would ship alongside correct HTML.
console.log("Generating robots.txt and sitemap.xml...");
run("scripts/build-seo.mjs", []);

console.log("Type-checking...");
run("node_modules/typescript/bin/tsc", ["--noEmit"]);
console.log("Building without the internal board view...");
run("node_modules/vite/bin/vite.js", ["build"]);

// prebuild regenerates public/content/board.json, and Vite copies public/ verbatim, so the
// data file arrives in dist even though nothing renders it. Remove it.
const boardJson = join(DIST, "content", "board.json");
if (existsSync(boardJson)) {
  rmSync(boardJson);
  console.log("Removed dist/content/board.json");
}
const progressDir = join(DIST, "implementation-progress");
if (existsSync(progressDir)) {
  rmSync(progressDir, { recursive: true });
  console.log("Removed dist/implementation-progress/");
}

// Verify. A deploy build that silently kept the page would be worse than no script at all.
const files = [];
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else files.push(full);
  }
})(DIST);

const leaked = files.filter((f) => FORBIDDEN.some((bad) => relative(DIST, f).includes(bad)));

// Any file that still points at a dev origin means something was copied rather than rebuilt.
const stale = files
  .filter((f) => /\.(html|xml|txt|json|js|css)$/.test(f))
  .filter((f) => /localhost|127\.0\.0\.1/.test(readFileSync(f, "utf8")));
const referenced = files
  .filter((f) => /\.(html|js|css|json|xml|txt)$/.test(f))
  .filter((f) => readFileSync(f, "utf8").includes("implementation-progress"));

if (leaked.length || referenced.length || stale.length) {
  console.error("Deploy build failed verification:");
  for (const f of leaked) console.error(`  present: ${f}`);
  for (const f of referenced) console.error(`  references the internal page: ${f}`);
  for (const f of stale) console.error(`  still points at a dev origin: ${f}`);
  process.exit(1);
}

const bytes = files.reduce((n, f) => n + statSync(f).size, 0);
console.log(
  `\nDeploy build OK — ${files.length} files, ${(bytes / 1024 / 1024).toFixed(2)} MB in ${DIST}/`,
);
console.log("Serve the contents of dist/ at the domain root (standalone, ADR-008).");
