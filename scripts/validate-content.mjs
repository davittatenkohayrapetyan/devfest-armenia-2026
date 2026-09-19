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
  for (const k of ["name", "date", "dateLabel", "venue", "cta", "cfp", "about", "speakers"]) {
    if (!(k in event)) errors.push(`event.json: missing "${k}"`);
  }
  for (const k of ["register", "cfp", "chapter", "lastYear"]) {
    if (!event.cta?.[k]) errors.push(`event.json: missing cta.${k}`);
  }
  if (!event.speakers?.noteWhileCfpOpen)
    errors.push("event.json: missing speakers.noteWhileCfpOpen");
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
      for (const k of ["name", "logo", "url"])
        if (!p?.[k]) errors.push(`partners.json.partners[${i}]: missing "${k}"`);
    });
}

read("tracks.json");
read("organizers.json");

if (errors.length) {
  console.error("Content validation failed:");
  for (const e of errors) console.error("  " + e);
  process.exit(1);
}
console.log("Content validation passed.");
