// Fails the build if AUA brand colours leak into the stylesheet or components.
// Rationale in docs/DECISIONS.md ADR-003. Change deliberately, not as a workaround.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const FORBIDDEN = [
  ["#003b5c", "AUA navy"],
  ["#fc4c02", "AUA orange"],
];

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const offences = [];
for (const file of walk("src")) {
  const text = readFileSync(file, "utf8").toLowerCase();
  for (const [hex, name] of FORBIDDEN) {
    if (text.includes(hex)) offences.push(`${file}: ${hex} (${name})`);
  }
}

if (offences.length) {
  console.error("Brand guard failed — partner colours must not be CSS values:");
  for (const o of offences) console.error("  " + o);
  console.error("\nSee docs/BRAND.md. Google DevFest palette leads.");
  process.exit(1);
}
console.log("Brand guard passed.");
