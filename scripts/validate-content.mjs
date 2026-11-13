// Structural validation of public/content/*.json so a malformed edit fails CI
// rather than the live site.
import { existsSync, readFileSync } from "node:fs";

const errors = [];
const read = (f) => {
  try {
    return JSON.parse(readFileSync(`public/content/${f}`, "utf8"));
  } catch (e) {
    errors.push(`${f}: ${e.message}`);
    return null;
  }
};

const event = read("event.json");
if (event) {
  for (const k of ["name", "date", "dateLabel", "startsAt", "venue", "cta", "cfp", "about", "speakers"]) {
    if (!(k in event)) errors.push(`event.json: missing "${k}"`);
  }
  for (const k of ["register", "cfp", "chapter", "lastYear"]) {
    if (!event.cta?.[k]) errors.push(`event.json: missing cta.${k}`);
  }
  for (const k of ["name", "detail", "address", "mapUrl", "mapEmbedUrl"])
    if (!event.venue?.[k]) errors.push(`event.json: missing venue.${k}`);
  if (!event.speakers?.noteWhileCfpOpen)
    errors.push("event.json: missing speakers.noteWhileCfpOpen");
  if (event.agenda?.workshopNote !== undefined && typeof event.agenda.workshopNote !== "string")
    errors.push("event.json: agenda.workshopNote must be a string");
  if (!Array.isArray(event.social)) errors.push("event.json: social must be an array");
  else
    event.social.forEach((s, i) => {
      for (const k of ["name", "handle", "url"])
        if (!s?.[k]) errors.push(`event.json: social[${i}] missing "${k}"`);
    });
  if (event.startsAt && Number.isNaN(Date.parse(event.startsAt)))
    errors.push("event.json: startsAt is not parseable");
  if (event.startsAt && !/[+-]\d{2}:\d{2}$|Z$/.test(event.startsAt))
    errors.push("event.json: startsAt needs an explicit UTC offset, or it is read as local time");
  if (event.date && Number.isNaN(Date.parse(event.date)))
    errors.push("event.json: date is not parseable");
  if (event.cfp?.closes && Number.isNaN(Date.parse(event.cfp.closes)))
    errors.push("event.json: cfp.closes is not parseable");
}

const speakers = read("speakers.json");
if (speakers) {
  if (!Array.isArray(speakers)) errors.push("speakers.json: must be an array");
  else
    speakers.forEach((s, i) => {
      for (const k of ["id", "fullName", "tagLine", "profilePicture"])
        if (!s?.[k]) errors.push(`speakers.json[${i}]: missing "${k}"`);
    });
}

const sessions = read("sessions.json");
if (sessions) {
  if (!Array.isArray(sessions)) errors.push("sessions.json: must be an array");
  else {
    const speakerIds = new Set((Array.isArray(speakers) ? speakers : []).map((s) => s.id));
    const sessionIds = new Set();
    const local = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/;
    sessions.forEach((s, i) => {
      const at = `sessions.json[${i}]`;
      for (const k of ["id", "title", "format"]) if (!s?.[k]) errors.push(`${at}: missing "${k}"`);
      if (!["Talk", "Workshop", "Service"].includes(s?.format))
        errors.push(`${at}: format must be Talk, Workshop or Service`);
      if (typeof s?.description !== "string") errors.push(`${at}: "description" must be a string`);
      if (s?.url !== null && !/^https:\/\//.test(s?.url ?? "")) errors.push(`${at}: "url" must be null or https`);
      if (s?.format === "Service" && !s.isServiceSession) errors.push(`${at}: format Service needs isServiceSession`);
      if (!Array.isArray(s?.speakers)) errors.push(`${at}: "speakers" must be an array`);
      else
        for (const id of s.speakers)
          if (!speakerIds.has(id)) errors.push(`${at}: speaker ${id} is not in speakers.json`);
      // Times are both set or both null, venue-local with no offset (Sessionize's shape), and in
      // order. A room without a time, or the reverse, is half a schedule.
      for (const k of ["startsAt", "endsAt"])
        if (s?.[k] !== null && !local.test(s?.[k] ?? "")) errors.push(`${at}: ${k} must be null or local ISO time`);
      if ((s?.startsAt === null) !== (s?.endsAt === null)) errors.push(`${at}: startsAt and endsAt must both be set`);
      if (s?.startsAt && s?.endsAt && s.endsAt <= s.startsAt) errors.push(`${at}: ends before it starts`);
      if ((s?.room === null) !== (s?.roomId === null)) errors.push(`${at}: room and roomId must both be set`);
      if (sessionIds.has(s?.id)) errors.push(`${at}: duplicate id ${s.id}`);
      sessionIds.add(s?.id);
    });
    if (Array.isArray(speakers))
      speakers.forEach((sp, i) =>
        (sp.sessions ?? []).forEach((ref) => {
          if (!sessionIds.has(ref?.id)) errors.push(`speakers.json[${i}]: session ${ref?.id} is not in sessions.json`);
        }),
      );
  }
}

const cast = read("session-people.json");
if (cast) {
  const ids = new Set((Array.isArray(sessions) ? sessions : []).map((s) => s.id));
  for (const [id, entry] of Object.entries(cast)) {
    if (id.startsWith("_")) continue; // _note
    const at = `session-people.json["${id}"]`;
    if (!ids.has(id)) errors.push(`${at}: no such session in sessions.json`);
    if ("summary" in entry && typeof entry.summary !== "string") errors.push(`${at}: summary must be a string`);
    if (!Array.isArray(entry.people) || entry.people.length === 0) errors.push(`${at}: people must be a non-empty array`);
    else
      entry.people.forEach((p, i) => {
        for (const k of ["name", "role", "title"]) if (!p?.[k]) errors.push(`${at}.people[${i}]: missing "${k}"`);
        if (!["Moderator", "Panelist"].includes(p?.role)) errors.push(`${at}.people[${i}]: role must be Moderator or Panelist`);
        if (typeof p?.photo !== "string") errors.push(`${at}.people[${i}]: "photo" must be a string, empty if not supplied yet`);
        else if (p.photo && !existsSync(`public/${p.photo}`)) errors.push(`${at}.people[${i}]: photo ${p.photo} does not exist`);
      });
  }
}

const partners = read("partners.json");
if (partners) {
  if (!Array.isArray(partners.partners))
    errors.push("partners.json: partners must be an array");
  else
    partners.partners.forEach((p, i) => {
      for (const k of ["name", "logo"])
        if (!p?.[k]) errors.push(`partners.json.partners[${i}]: missing "${k}"`);
      // url may be empty — a partner without a link is legitimate — but the key must be
      // present and a string, so "no link yet" is a deliberate state rather than an omission.
      if (typeof p?.url !== "string")
        errors.push(`partners.json.partners[${i}]: "url" must be a string, empty if unknown`);
    });
}

read("tracks.json");

const organizers = read("organizers.json");
if (organizers) {
  if (!Array.isArray(organizers)) errors.push("organizers.json: must be an array");
  else
    organizers.forEach((o, i) => {
      for (const k of ["name", "role", "photo"])
        if (!o?.[k]) errors.push(`organizers.json[${i}]: missing "${k}"`);
      // title is optional, but if present it must be a string — an accidental number or
      // object would render as [object Object] rather than failing.
      if ("title" in (o ?? {}) && typeof o.title !== "string")
        errors.push(`organizers.json[${i}]: "title" must be a string`);
    });
}

if (errors.length) {
  console.error("Content validation failed:");
  for (const e of errors) console.error("  " + e);
  process.exit(1);
}
console.log("Content validation passed.");
