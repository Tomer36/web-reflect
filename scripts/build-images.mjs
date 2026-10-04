// Turns the originals in content/ into the small files the site actually ships
// (public/img/…) and writes src/generated/images.json for the components.
// Runs before `dev` and `build`. Originals never reach out/.
//
//   content/brand/                 logo artwork
//   content/clients/               client logos (key = file name)
//   content/portfolio/<slug>/      project screenshots; file-name order is display order
import { mkdir, readdir, rm, writeFile, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const src = (...p) => path.join(root, "content", ...p);
const out = (...p) => path.join(root, "public", "img", ...p);
const RASTER = /\.(jpe?g|png|webp|avif)$/i;

await rm(out(), { recursive: true, force: true });
await mkdir(out("clients"), { recursive: true });

// --- Logo: header height is 32px, so 2x is plenty --------------------------
const logo = {};
for (const [name, file] of [
  ["light", "webreflect-light.png"],
  ["dark", "webreflect.png"],
]) {
  const info = await sharp(src("brand", file))
    .resize({ height: 72 })
    .webp({ quality: 90 })
    .toFile(out(`logo-${name}.webp`));
  logo[name] = { src: `/img/logo-${name}.webp`, width: info.width, height: info.height };
}

// Share image, touch icon and browser tab icon
const mark = await sharp(src("brand", "webreflect-light.png")).resize({ width: 720 }).png().toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#ffffff" } })
  .composite([{ input: mark, gravity: "centre" }])
  .jpeg({ quality: 85 })
  .toFile(path.join(root, "public", "og-image.jpg"));
await sharp(src("brand", "logo.jpg")).resize(180, 180).png().toFile(path.join(root, "public", "apple-touch-icon.png"));
await sharp(src("brand", "logo.jpg"))
  .resize(96, 96)
  .png({ compressionLevel: 9, palette: true })
  .toFile(path.join(root, "public", "favicon.png"));

// --- Client logos ----------------------------------------------------------
const clients = {};
for (const file of (await readdir(src("clients"))).sort()) {
  const key = path.parse(file).name;
  if (file.endsWith(".svg")) {
    await copyFile(src("clients", file), out("clients", file));
    const meta = await sharp(src("clients", file)).metadata();
    clients[key] = { src: `/img/clients/${file}`, width: meta.width, height: meta.height };
  } else if (RASTER.test(file)) {
    const info = await sharp(src("clients", file))
      .resize({ width: 320, height: 200, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(out("clients", `${key}.webp`));
    clients[key] = { src: `/img/clients/${key}.webp`, width: info.width, height: info.height };
  }
}

// --- Project screenshots ---------------------------------------------------
const portfolio = {};
if (existsSync(src("portfolio"))) {
  for (const dir of await readdir(src("portfolio"), { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    const files = (await readdir(src("portfolio", dir.name))).filter((f) => RASTER.test(f)).sort();
    if (!files.length) continue;
    await mkdir(out("portfolio", dir.name), { recursive: true });
    portfolio[dir.name] = [];
    for (const file of files) {
      const key = path.parse(file).name;
      const input = src("portfolio", dir.name, file);
      const large = await sharp(input)
        .rotate()
        .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(out("portfolio", dir.name, `${key}.webp`));
      const thumb = await sharp(input)
        .rotate()
        .resize({ width: 640, height: 427, fit: "cover", position: "top" })
        .webp({ quality: 72 })
        .toFile(out("portfolio", dir.name, `${key}-thumb.webp`));
      portfolio[dir.name].push({
        key,
        large: `/img/portfolio/${dir.name}/${key}.webp`,
        thumb: `/img/portfolio/${dir.name}/${key}-thumb.webp`,
        width: thumb.width,
        height: thumb.height,
        largeWidth: large.width,
        largeHeight: large.height,
      });
    }
  }
}

await mkdir(path.join(root, "src", "generated"), { recursive: true });
await writeFile(
  path.join(root, "src", "generated", "images.json"),
  JSON.stringify({ logo, clients, portfolio }, null, 2) + "\n",
);
const shots = Object.values(portfolio).reduce((n, list) => n + list.length, 0);
console.log(`images: logo, ${Object.keys(clients).length} client logos, ${shots} project screenshots`);
