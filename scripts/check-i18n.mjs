// Fails if messages/he.json, ar.json and en.json do not have exactly the same keys
// (arrays must also have the same length, so no language is missing a list item).
import { readFileSync } from "node:fs";
import path from "node:path";

const dir = path.resolve(import.meta.dirname, "..", "messages");
const locales = ["he", "ar", "en"];

function keys(value, prefix = "", into = new Set()) {
  if (Array.isArray(value)) {
    into.add(`${prefix}[length=${value.length}]`);
    value.forEach((item, i) => keys(item, `${prefix}[${i}]`, into));
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) keys(v, prefix ? `${prefix}.${k}` : k, into);
  } else {
    into.add(prefix);
    if (typeof value !== "string" || !value.trim()) into.add(`${prefix} <-- empty or not a string`);
  }
  return into;
}

const sets = Object.fromEntries(
  locales.map((l) => [l, keys(JSON.parse(readFileSync(path.join(dir, `${l}.json`), "utf8")))]),
);
const all = new Set(locales.flatMap((l) => [...sets[l]]));
let problems = 0;
for (const key of [...all].sort()) {
  const missing = locales.filter((l) => !sets[l].has(key));
  if (missing.length) {
    problems++;
    console.error(`✗ ${key}  — missing in: ${missing.join(", ")}`);
  }
}
if (problems) {
  console.error(`\ncheck:i18n failed: ${problems} key(s) differ between the message files.`);
  process.exit(1);
}
console.log(`check:i18n ok: ${sets.he.size} keys, identical in ${locales.join(", ")}.`);
