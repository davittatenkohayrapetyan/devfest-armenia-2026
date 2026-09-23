// Structural validation of public/content/*.json so a malformed edit fails CI
// rather than the live site.
import { readFileSync } from "node:fs";

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
