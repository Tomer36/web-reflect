// Checks every page in out/ after a build. Fails (exit 1) on the first run that finds a problem.
//
//   - <html lang> and dir match the language folder
//   - canonical, and hreflang for he / ar / en / x-default, point at the right URLs
//   - the page exists in every language
//   - the language switcher lands on the same page in the other language
//   - no internal link leads into another language, and every internal link exists
//   - no text in the wrong script (Hebrew on an Arabic page, and so on)
//   - exactly one h1, no skipped heading level, every image has alt text
//   - title and description are present and unique across the site
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const SITE = "https://web-reflect.com";
const LOCALES = { he: "rtl", ar: "rtl", en: "ltr" };
const DEFAULT = "he";
const WRONG_SCRIPT = {
  he: /[؀-ۿݐ-ݿ]/,
  ar: /[֐-׿]/,
  en: /[֐-׿؀-ۿݐ-ݿ]/,
};

const out = path.resolve(import.meta.dirname, "..", "out");
if (!existsSync(out)) {
  console.error("check:pages: out/ not found — run `npm run build` first.");
  process.exit(1);
}

function walk(dir, list = []) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walk(full, list);
    else if (name.endsWith(".html")) list.push(full);
  }
  return list;
}

// "/he/services/web-apps" → { locale: "he", path: "/services/web-apps" }
const pages = [];
for (const locale of Object.keys(LOCALES)) {
  const files = [path.join(out, `${locale}.html`), ...(existsSync(path.join(out, locale)) ? walk(path.join(out, locale)) : [])];
  for (const file of files) {
    if (!existsSync(file)) continue;
    const url = "/" + path.relative(out, file).replace(/\\/g, "/").replace(/\.html$/, "");
    pages.push({ locale, url, path: url.slice(locale.length + 1) || "/", file });
  }
}

const errors = [];
const fail = (page, message) => errors.push(`${page.url}: ${message}`);
const attr = (tag, name) => (tag.match(new RegExp(`\\s${name}="([^"]*)"`)) ?? [])[1];
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const expected = (locale, p) => `${SITE}/${locale}${p === "/" ? "" : p}`;
const exists = (url) => existsSync(path.join(out, `${url}.html`));

const titles = new Map();
const descriptions = new Map();

for (const page of pages) {
  const html = readFileSync(page.file, "utf8");
  const { locale } = page;

  // lang / dir
  const htmlTag = (html.match(/<html[^>]*>/) ?? [""])[0];
  if (attr(htmlTag, "lang") !== locale) fail(page, `<html lang> is "${attr(htmlTag, "lang")}"`);
  if (attr(htmlTag, "dir") !== LOCALES[locale]) fail(page, `<html dir> is "${attr(htmlTag, "dir")}"`);

  // every language has this page
  for (const other of Object.keys(LOCALES)) {
    if (!exists(`/${other}${page.path === "/" ? "" : page.path}`)) fail(page, `missing in ${other}`);
  }

  // canonical + hreflang
  const linkTags = html.match(/<link[^>]*>/g) ?? [];
  const canonical = linkTags.filter((t) => attr(t, "rel") === "canonical").map((t) => attr(t, "href"));
  if (canonical.length !== 1 || canonical[0] !== expected(locale, page.path)) {
    fail(page, `canonical is ${JSON.stringify(canonical)}, expected ${expected(locale, page.path)}`);
  }
  const alternates = Object.fromEntries(
    linkTags.filter((t) => attr(t, "rel") === "alternate" && attr(t, "hrefLang")).map((t) => [attr(t, "hrefLang"), attr(t, "href")]),
  );
  for (const code of [...Object.keys(LOCALES), "x-default"]) {
    const want = expected(code === "x-default" ? DEFAULT : code, page.path);
    if (alternates[code] !== want) fail(page, `hreflang ${code} is ${alternates[code]}, expected ${want}`);
  }

  // title / description / social tags
  const title = decode((html.match(/<title>([^<]*)<\/title>/) ?? [])[1] ?? "");
  const metas = html.match(/<meta[^>]*>/g) ?? [];
  const meta = (key) => decode(attr(metas.find((t) => attr(t, "name") === key || attr(t, "property") === key) ?? "", "content") ?? "");
  const description = meta("description");
  if (!title) fail(page, "no <title>");
  if (!description) fail(page, "no meta description");
  for (const key of ["og:title", "og:description", "og:url", "og:image", "og:locale", "twitter:card", "twitter:title", "twitter:image"]) {
    if (!meta(key)) fail(page, `no ${key}`);
  }
  if (titles.has(title)) fail(page, `same <title> as ${titles.get(title)}: "${title}"`);
  else titles.set(title, page.url);
  if (descriptions.has(description)) fail(page, `same description as ${descriptions.get(description)}`);
  else descriptions.set(description, page.url);

  // JSON-LD parses
  for (const block of html.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g) ?? []) {
    try {
      JSON.parse(block.replace(/^<script[^>]*>|<\/script>$/g, ""));
    } catch {
      fail(page, "JSON-LD does not parse");
    }
  }
  if (!html.includes('"@type":"ProfessionalService"')) fail(page, "no ProfessionalService JSON-LD");
  if (page.path !== "/" && !html.includes('"@type":"BreadcrumbList"')) fail(page, "no BreadcrumbList JSON-LD");
  if (/^\/services\/.+/.test(page.path) && !html.includes('"@type":"Service"')) fail(page, "no Service JSON-LD");

  // the visible document, without scripts and styles
  const body = html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "");

  // language switcher
  const anchors = body.match(/<a\s[^>]*>/g) ?? [];
  const switcher = anchors.filter((t) => attr(t, "hrefLang"));
  for (const code of Object.keys(LOCALES)) {
    const want = `/${code}${page.path === "/" ? "" : page.path}`;
    const links = switcher.filter((t) => attr(t, "hrefLang") === code);
    if (!links.length) fail(page, `no switcher link for ${code}`);
    for (const t of links) if (attr(t, "href") !== want) fail(page, `switcher ${code} → ${attr(t, "href")}, expected ${want}`);
  }

  // internal links stay in this language and exist
  for (const t of anchors) {
    const target = attr(t, "href");
    if (!target || !target.startsWith("/") || attr(t, "hrefLang") || /\.[a-z0-9]+$/i.test(target)) continue;
    const clean = target.split(/[?#]/)[0];
    if (clean !== `/${locale}` && !clean.startsWith(`/${locale}/`)) fail(page, `link into another language: ${target}`);
    else if (!exists(clean)) fail(page, `broken link: ${target}`);
  }

  // wrong script — the switcher labels (elements with their own lang) are allowed
  const own = body.replace(/<a\s[^>]*\slang="[^"]*"[^>]*>[\s\S]*?<\/a>/g, "");
  const wrong = own.match(new RegExp(`.{0,30}${WRONG_SCRIPT[locale].source}.{0,30}`));
  if (wrong) fail(page, `text in the wrong script: …${wrong[0].replace(/\s+/g, " ")}…`);

  // headings and images
  const headings = [...body.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
  if (headings.filter((h) => h === 1).length !== 1) fail(page, `${headings.filter((h) => h === 1).length} <h1> elements`);
  headings.forEach((h, i) => {
    if (i && h > headings[i - 1] + 1) fail(page, `heading jumps from h${headings[i - 1]} to h${h}`);
  });
  for (const img of body.match(/<img[^>]*>/g) ?? []) {
    if (!attr(img, "alt")) fail(page, `image without alt: ${attr(img, "src")}`);
  }
}

// sitemap lists every page
const sitemap = existsSync(path.join(out, "sitemap.xml")) ? readFileSync(path.join(out, "sitemap.xml"), "utf8") : "";
if (!sitemap) errors.push("sitemap.xml is missing");
for (const page of pages) {
  if (sitemap && !sitemap.includes(`<loc>${expected(page.locale, page.path)}</loc>`)) fail(page, "not in sitemap.xml");
}
if (!existsSync(path.join(out, "robots.txt"))) errors.push("robots.txt is missing");
// Windows builds nest the router prefetch files; scripts/fix-export.mjs flattens them.
const nested = walk(out, []).length && readdirSync(path.join(out, DEFAULT)).filter((n) => n.startsWith("__next.") && statSync(path.join(out, DEFAULT, n)).isDirectory());
if (nested.length) errors.push("prefetch files are still nested (run scripts/fix-export.mjs): " + nested.join(", "));
if (!existsSync(path.join(out, ".htaccess"))) errors.push(".htaccess is missing from out/");

if (errors.length) {
  console.error(errors.map((e) => `✗ ${e}`).join("\n"));
  console.error(`\ncheck:pages failed: ${errors.length} problem(s) in ${pages.length} pages.`);
  process.exit(1);
}
console.log(`check:pages ok: ${pages.length} pages (${pages.length / 3} per language), no problems.`);
