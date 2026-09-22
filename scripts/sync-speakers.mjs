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

/**
 * Strips metadata that varies between renders, so the same image produces the same bytes.
 *
 * Sessionize's CDN stamps a PNG `tIME` chunk with the moment it rendered the file, so a sync on
 * a new day rewrote every photo with no visual change — permanent diff noise, and a commit that
 * says a speaker's portrait changed when it did not. JPEG APPn segments carry the same hazard
 * (and any EXIF the speaker's own camera left behind), so they go too.
 */
function stripVolatileMetadata(buf) {
  const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (buf.subarray(0, 8).equals(PNG_SIG)) {
    const drop = new Set(["tIME", "tEXt", "iTXt", "zTXt"]);
    const out = [buf.subarray(0, 8)];
    let pos = 8;
    while (pos + 8 <= buf.length) {
      const len = buf.readUInt32BE(pos);
      const type = buf.subarray(pos + 4, pos + 8).toString("latin1");
      const end = pos + 12 + len;
      if (!drop.has(type)) out.push(buf.subarray(pos, end));
      pos = end;
      if (type === "IEND") break;
    }
    return Buffer.concat(out);
  }
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    const out = [buf.subarray(0, 2)];
    let pos = 2;
    while (pos + 4 <= buf.length) {
      if (buf[pos] !== 0xff) break;
      const marker = buf[pos + 1];
      if (marker === 0xda) {
        out.push(buf.subarray(pos)); // start of scan: copy the rest verbatim
        break;
      }
      const len = buf.readUInt16BE(pos + 2);
      const isMetadata = (marker >= 0xe0 && marker <= 0xef) || marker === 0xfe;
      if (!isMetadata) out.push(buf.subarray(pos, pos + 2 + len));
      pos += 2 + len;
    }
    return Buffer.concat(out);
  }
  return buf;
}

/** Download a speaker photo locally: no third-party dependency for faces on event day. */
async function localPhoto(sp) {
  if (!sp.profilePicture) return "";
  const ext = (extname(new URL(sp.profilePicture).pathname) || ".jpg").toLowerCase();
  const rel = `assets/speakers/${sp.id}${ext}`;
  const dest = join("public", rel);
  const r = await fetch(sp.profilePicture);
  if (!r.ok) die(`photo for ${sp.fullName} returned ${r.status}`);
  const bytes = stripVolatileMetadata(Buffer.from(await r.arrayBuffer()));
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
