// Rewrites public/content/speakers.json and public/content/sessions.json from Sessionize.
// Run on demand: npm run sync:speakers
//
// Publishing is deliberate (ADR-009): the site never calls Sessionize at runtime, so a visitor
// sees what was reviewed and committed, not whatever the API held at page load. Run it, read
// the diff, commit it.
//
// Text is locked, like photos (ADR-013). A submission is written for the programme committee —
// notes to reviewers, video links, private talk plans — so its raw description is never
// published. scripts/session-text.lock.json and scripts/speaker-text.lock.json hold the edited
// public text; the sync uses it verbatim and only reports when the speaker has since changed
// their submission. A session or speaker with no lock entry publishes its title or tagline
// alone, with no description or bio, until someone writes one.
//
// Schedule fields (startsAt, endsAt, roomId) are passed through exactly as Sessionize carries
// them. Nothing here invents a time or a room: no schedule upstream means none on the page.
import { createHash } from "node:crypto";
import { writeFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

const EMBED_ID = "2d3htmgm";
const ENDPOINT = `https://sessionize.com/api/v2/${EMBED_ID}/view/All`;
const OUT = "public/content/speakers.json";
const SESSIONS_OUT = "public/content/sessions.json";
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

// Programme decisions taken after Sessionize was last edited: a withdrawn talk, a talk moved into
// another's slot. Kept in the repo so a re-sync cannot quietly undo them. A move names the slot
// it takes (`slotOf`), so the time and room still come from Sessionize rather than being typed.
// Once Sessionize itself reflects a decision, the entry is reported as stale — delete it then.
const OVERRIDES = "scripts/schedule-overrides.json";
const overrides = existsSync(OVERRIDES) ? JSON.parse(readFileSync(OVERRIDES, "utf8")) : {};
const withdrawn = new Set((overrides.withdrawn ?? []).map((w) => String(w.session)));
const stale = [];
for (const id of withdrawn) if (!sessions.has(id)) stale.push(`withdrawn ${id}: no longer in Sessionize`);
for (const m of overrides.moves ?? []) {
  const talk = sessions.get(String(m.session));
  const slot = sessions.get(String(m.slotOf));
  if (!talk || !slot) {
    stale.push(`move ${m.session} → slot of ${m.slotOf}: ${!talk ? "talk" : "slot"} not in Sessionize`);
    continue;
  }
  if (!slot.startsAt) die(`move ${m.session}: the slot of ${m.slotOf} has no time yet`);
  if (talk.startsAt === slot.startsAt && talk.roomId === slot.roomId) {
    stale.push(`move ${m.session}: Sessionize already has it in that slot`);
    continue;
  }
  sessions.set(String(m.session), { ...talk, startsAt: slot.startsAt, endsAt: slot.endsAt, roomId: slot.roomId });
}
for (const id of withdrawn) sessions.delete(id);
data.sessions = (data.sessions ?? []).map((s) => sessions.get(String(s.id))).filter(Boolean);

// Two talks in one room at once means an override and Sessionize now disagree. Stop.
const byRoom = new Map();
for (const s of data.sessions.filter((x) => x.startsAt && x.roomId != null)) {
  const list = byRoom.get(s.roomId) ?? [];
  for (const o of list)
    if (s.startsAt < o.endsAt && o.startsAt < s.endsAt) die(`sessions ${o.id} and ${s.id} overlap in room ${s.roomId}`);
  byRoom.set(s.roomId, [...list, s]);
}

// Keep only speakers whose sessions are all Accepted. The endpoint appears to return accepted
// entries only — assert it rather than trust it, and say so when something is dropped.
const kept = [];
for (const sp of data.speakers) {
  const ids = (sp.sessions ?? []).map(String);
  if (ids.length > 0 && ids.every((id) => withdrawn.has(id))) {
    console.log(`  skipped ${sp.fullName} — withdrawn (${OVERRIDES})`);
    continue;
  }
  const theirs = ids.map((id) => sessions.get(id)).filter(Boolean);
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

// Photos cropped by scripts/crop-speakers.py are locked: the sync keeps the committed crop and
// never downloads over it. Delete a speaker's entry to take their Sessionize photo again.
const LOCK = "scripts/speaker-photos.lock.json";
const locked = existsSync(LOCK) ? JSON.parse(readFileSync(LOCK, "utf8")) : {};
const unlocked = [];

/** Download a speaker photo locally: no third-party dependency for faces on event day. */
async function localPhoto(sp) {
  const lock = locked[sp.id];
  if (lock) {
    if (!existsSync(join("public", lock.file))) die(`locked photo ${lock.file} for ${sp.fullName} is missing`);
    return lock.file;
  }
  unlocked.push(sp.fullName);
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

// Locked public text. The hash is over the submission as it stood when the text was written, so
// a later edit by the speaker is reported for review instead of silently ignored or published.
const readLock = (f) => (existsSync(f) ? JSON.parse(readFileSync(f, "utf8")) : {});
const sessionText = readLock("scripts/session-text.lock.json");
const speakerText = readLock("scripts/speaker-text.lock.json");
const sourceHash = (...parts) =>
  createHash("sha256").update(parts.map((p) => p ?? "").join("\n")).digest("hex").slice(0, 16);
const drifted = [];
const unwritten = [];

// Service sessions — registration, opening, panels, closing, afterparty — are written by the
// organisers in Sessionize's schedule builder and are NOT in /view/All. They only appear in the
// schedule grid, so take them from there and merge them in. Talks still come from /view/All.
const GRID = `https://sessionize.com/api/v2/${EMBED_ID}/view/GridSmart`;
console.log(`Fetching ${GRID}`);
const gridRes = await fetch(GRID).catch((e) => die(`grid request failed — ${e.message}`));
if (!gridRes.ok) die(`grid ${gridRes.status} ${gridRes.statusText}`);
const grid = await gridRes.json().catch(() => die("grid response was not JSON"));
if (!Array.isArray(grid)) die("grid payload is not an array of days");
const serviceSessions = new Map();
for (const day of grid)
  for (const room of day.rooms ?? [])
    for (const s of room.sessions ?? [])
      if (s.isServiceSession) serviceSessions.set(String(s.id), s);

const rooms = new Map((data.rooms ?? []).map((r) => [r.id, r]));
const publishedSessions = [];
for (const s of [...(data.sessions ?? []), ...serviceSessions.values()]) {
  if (s.status && s.status !== "Accepted") continue;
  const room = s.roomId != null ? rooms.get(s.roomId) : undefined;
  if (s.roomId != null && !room) die(`session ${s.id} points at unknown room ${s.roomId}`);
  let title = s.title.trim();
  let format = /\[workshop\]/i.test(title) ? "Workshop" : "Talk";
  let description = "";
  let url = null;
  const lock = sessionText[s.id];
  if (s.isServiceSession) {
    // Written by the organisers, not submitted to the committee, so published as written. A
    // description that is nothing but a link (the afterparty's map) becomes `url`, not prose.
    format = "Service";
    description = (s.description ?? "").replace(/\r\n/g, "\n").trim();
    if (/^https?:\/\/\S+$/.test(description)) [url, description] = [description, ""];
  } else if (lock) {
    ({ title, format, description } = lock);
    if (lock.sourceHash !== sourceHash(s.title, s.description)) drifted.push(`session ${s.id} "${title}"`);
  } else {
    title = title.replace(/\s*\[workshop\]\s*/i, " ").trim();
    unwritten.push(`session ${s.id} "${title}"`);
  }
  publishedSessions.push({
    id: String(s.id),
    title,
    description,
    format,
    url,
    startsAt: s.startsAt ?? null,
    endsAt: s.endsAt ?? null,
    roomId: s.roomId ?? null,
    room: room?.name ?? null,
    roomSort: room?.sort ?? null,
    isServiceSession: Boolean(s.isServiceSession),
    isPlenumSession: Boolean(s.isPlenumSession),
    speakers: (s.speakers ?? []).map(String),
  });
}
// Schedule order once there is one; title order until then. Sessionize start times are venue
// local time with no offset, so plain string comparison is the correct order.
publishedSessions.sort(
  (a, b) =>
    (a.startsAt ?? "").localeCompare(b.startsAt ?? "") ||
    (a.roomSort ?? 0) - (b.roomSort ?? 0) ||
    a.title.localeCompare(b.title),
);
const titleById = new Map(publishedSessions.map((s) => [s.id, s.title]));

const out = [];
for (const sp of kept.sort((a, b) => a.fullName.localeCompare(b.fullName))) {
  const lock = speakerText[sp.id];
  if (lock && lock.sourceHash !== sourceHash(sp.tagLine, sp.bio)) drifted.push(`speaker ${sp.fullName}`);
  if (!lock) unwritten.push(`speaker ${sp.fullName}`);
  out.push({
    id: sp.id,
    fullName: sp.fullName.trim(),
    tagLine: lock ? lock.tagLine : (sp.tagLine ?? "").trim(),
    bio: lock ? lock.bio : "",
    profilePicture: await localPhoto(sp),
    links: (sp.links ?? []).map((l) => ({
      title: l.title,
      url: l.url,
      linkType: l.linkType,
    })),
    // Resolved from the numeric ids this endpoint carries into the { id, name } shape that
    // src/content.ts declares. Only sessions that were published above.
    sessions: (sp.sessions ?? [])
      .map(String)
      .filter((id) => titleById.has(id))
      .map((id) => ({ id, name: titleById.get(id) })),
  });
}

writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n", "utf8");
writeFileSync(SESSIONS_OUT, JSON.stringify(publishedSessions, null, 2) + "\n", "utf8");
const scheduled = publishedSessions.filter((s) => s.startsAt).length;
console.log(`\nWrote ${out.length} speakers to ${OUT}`);
console.log(
  `Wrote ${publishedSessions.length} sessions to ${SESSIONS_OUT} — ${scheduled} scheduled, ${serviceSessions.size} service, ${rooms.size} rooms`,
);
if (unlocked.length)
  console.log(`Uncropped photos (${unlocked.join(", ")}): run python scripts/crop-speakers.py`);
if (unwritten.length) {
  console.log(`\nNo locked text yet — published with title or tagline only:`);
  for (const u of unwritten) console.log(`  ${u}`);
}
if (drifted.length) {
  console.log(`\nChanged on Sessionize since the text was locked — locked text kept, review it:`);
  for (const d of drifted) console.log(`  ${d}`);
}
if (stale.length) {
  console.log(`\nStale entries in ${OVERRIDES} — Sessionize has caught up, delete them:`);
  for (const s of stale) console.log(`  ${s}`);
}
console.log("Review the diff, then run the three checks before committing.");
