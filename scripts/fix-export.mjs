// Works around a Next.js static-export bug on Windows.
//
// The client router prefetches each page's segments from flat files such as
//   out/he/about/__next.$d$locale.about.__PAGE__.txt
// Next builds that name by replacing "/" with ".", but on Windows the path it
// starts from uses "\", so the files land in nested folders instead:
//   out/he/about/__next.$d$locale/about/__PAGE__.txt
// and every prefetch gets a 404. This script moves them to the flat name.
// On macOS/Linux the build is already correct and this does nothing.
import { readdirSync, renameSync, rmSync, statSync } from "node:fs";
import path from "node:path";

const out = path.resolve(import.meta.dirname, "..", "out");
let moved = 0;

function flatten(dir, base, prefix) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) flatten(full, base, `${prefix}.${name}`);
    else {
      renameSync(full, path.join(base, `${prefix}.${name}`));
      moved++;
    }
  }
}

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (!statSync(full).isDirectory()) continue;
    if (name.startsWith("__next.")) {
      flatten(full, dir, name);
      rmSync(full, { recursive: true });
    } else walk(full);
  }
}

walk(out);
if (moved) console.log(`fix-export: moved ${moved} prefetch files to their flat names (Windows build).`);
