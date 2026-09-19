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
  for (const k of ["name", "date", "dateLabel", "venue", "cta", "cfp", "about"]) {
    if (!(k in event)) errors.push(`event.json: missing "${k}"`);
  }
  for (const k of ["register", "cfp", "chapter", "lastYear"]) {
    if (!event.cta?.[k]) errors.push(`event.json: missing cta.${k}`);
  }
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
  if (!Array.isArray(partners.tiers)) errors.push("partners.json: tiers must be an array");
  else
    partners.tiers.forEach((t, i) => {
      if (!t.id || !t.label) errors.push(`partners.json.tiers[${i}]: needs id and label`);
      if (!Array.isArray(t.partners))
        errors.push(`partners.json.tiers[${i}]: partners must be an array`);
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
