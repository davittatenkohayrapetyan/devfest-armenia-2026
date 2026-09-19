// Rewrites public/content/speakers.json from Sessionize. Run on demand: npm run sync:speakers
//
// Publishing is deliberate (ADR-009): the site never calls Sessionize at runtime, so a visitor
// sees what was reviewed and committed, not whatever the API held at page load. Run it, read
// the diff, commit it.
//
// Talks are deliberately NOT published — `sessions` is emitted empty. Turning that on is
// DF-51, which has to resolve speaker.sessions (numeric ids in this endpoint) against the
// top-level sessions array. Do not shortcut that here.
import { writeFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

const EMBED_ID = "2d3htmgm";
const ENDPOINT = `https://sessionize.com/api/v2/${EMBED_ID}/view/All`;
const OUT = "public/content/speakers.json";
const IMG_DIR = "public/assets/speakers";

const die = (msg) => {
  console.error(`Speaker sync failed: ${msg}`);
  console.error("speakers.json left unchanged.");
  process.exit(1);
};

console.log(`Fetching ${ENDPOINT}`);
const res = await fetch(ENDPOINT).catch((e) => die(`request failed — ${e.message}`));
if (!res.ok) die(`${res.status} ${res.statusText}`);

const data = await res.json().catch(() => die("response was not JSON"));
if (!Array.isArray(data.speakers)) die("payload has no speakers array");
// An empty upstream would silently wipe the site's speaker section. Refuse it.
if (data.speakers.length === 0) die("upstream returned zero speakers");

const sessions = new Map((data.sessions ?? []).map((s) => [String(s.id), s]));

// Keep only speakers whose sessions are all Accepted. The endpoint appears to return accepted
// entries only — assert it rather than trust it, and say so when something is dropped.
const kept = [];
for (const sp of data.speakers) {
  const theirs = (sp.sessions ?? []).map((id) => sessions.get(String(id))).filter(Boolean);
  const rejected = theirs.filter((s) => s.status !== "Accepted");
  if (theirs.length > 0 && rejected.length === theirs.length) {
    console.log(`  skipped ${sp.fullName} — no accepted sessions`);
    continue;
  }
  if (rejected.length) console.log(`  note: ${sp.fullName} has ${rejected.length} non-accepted session(s)`);
  kept.push(sp);
}

mkdirSync(IMG_DIR, { recursive: true });

/** Download a speaker photo locally: no third-party dependency for faces on event day. */
async function localPhoto(sp) {
  if (!sp.profilePicture) return "";
  const ext = (extname(new URL(sp.profilePicture).pathname) || ".jpg").toLowerCase();
  const rel = `assets/speakers/${sp.id}${ext}`;
  const dest = join("public", rel);
  const r = await fetch(sp.profilePicture);
  if (!r.ok) die(`photo for ${sp.fullName} returned ${r.status}`);
  const bytes = Buffer.from(await r.arrayBuffer());
  // Only write when the bytes differ, so a rerun leaves the working tree clean.
  if (!existsSync(dest) || !readFileSync(dest).equals(bytes)) {
    writeFileSync(dest, bytes);
    console.log(`  photo ${rel} (${Math.round(bytes.length / 1024)} KB)`);
  }
  return rel;
}

const out = [];
for (const sp of kept.sort((a, b) => a.fullName.localeCompare(b.fullName))) {
  out.push({
    id: sp.id,
    fullName: sp.fullName.trim(),
    tagLine: (sp.tagLine ?? "").trim(),
    bio: (sp.bio ?? "").trim(),
    profilePicture: await localPhoto(sp),
    links: (sp.links ?? []).map((l) => ({
      title: l.title,
      url: l.url,
      linkType: l.linkType,
    })),
    // DF-51 fills this in. Empty is a decision, not an oversight.
    sessions: [],
  });
}

writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n", "utf8");
console.log(`\nWrote ${out.length} speakers to ${OUT}`);
console.log("Talks were not published — that is DF-51.");
console.log("Review the diff, then run the three checks before committing.");
