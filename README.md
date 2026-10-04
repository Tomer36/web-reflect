# Web Reflect

Website of Web Reflect (web-reflect.com). Next.js (App Router) with Hebrew, Arabic and English, shipped as a fully static export — plain HTML/CSS/JS, no server required.

The design follows the same language as the Top Cosmetics landing page and CRM (Hostinger hPanel style): soft tinted canvas, white cards, one soft shadow, compact buttons, outlined icons.

## Stack

- Next.js 16 (App Router, Turbopack), static export (`output: "export"`)
- Tailwind CSS v4 (design tokens and component classes are in `src/app/globals.css`)
- next-intl for the three languages (`he` default, `ar`, `en`; every URL starts with the language: `/he`, `/ar/services`, …). `/` redirects to `/he` via `.htaccess`.
- No cookies, no trackers and no third-party requests by default. Fonts are self-hosted (`public/fonts`).

## Commands

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # writes the static site to out/ and checks it
npm run check:i18n   # fails if he/ar/en message files do not have identical keys
npm run check:pages  # checks every page in out/ (run by the build)
npm run images       # regenerates public/img from content/ (run by dev and build)
```

`npm run build` runs, in order: `check:i18n` → `images` → `next build` → `scripts/fix-export.mjs` → `check:pages`. If a check fails the build fails.

`check:pages` verifies for every built page: `lang`/`dir`, canonical, hreflang for he/ar/en/x-default, that the page exists in all three languages, the language-switcher targets, that no internal link leads into another language or to a missing page, no text in the wrong script, one `h1`, heading order, image alt text, unique titles and descriptions, JSON-LD, and that the page is in `sitemap.xml`.

## Where things live

| What | Where |
| --- | --- |
| Phone, WhatsApp, email, address, opening hours, social profiles, analytics ID | `src/lib/site-config.ts` |
| List of services, projects and clients (order, icon, status) | `src/lib/site-config.ts` |
| All text | `messages/he.json`, `messages/ar.json`, `messages/en.json` |
| Design tokens and all styles | `src/app/globals.css` |
| `<html>`, fonts, header, footer, mobile bar, accessibility menu | `src/app/[locale]/layout.tsx` |
| Titles, descriptions, canonical, hreflang, Open Graph, JSON-LD | `src/lib/seo.ts` |
| Pages | `src/app/[locale]/` |
| `sitemap.xml`, `robots.txt` | `src/app/sitemap.ts`, `src/app/robots.ts` |
| Original images (never shipped) | `content/` |
| `.htaccess`, fonts | `public/` |

Pages (each in three languages): home, `/services` + one page per service, `/portfolio` + one page per project, `/about`, `/contact`, `/accessibility`, `/privacy-policy`, `/terms-of-use`.

The home page only previews; each preview links to the full page, and no sentence is used on two pages. Every service page shares one template (`services/[slug]/page.tsx`), as does every project page (`portfolio/[slug]/page.tsx`) and every legal page (`components/LegalPage.tsx`).

## Content still to supply

- **Draft text.** These keys were written for this build and need review (all three languages): `services.items.*.short|lead|intro|includes|fit`, `portfolio.items.*.lead|overview|features`, `about.lead|story|process`, `home.about`, every `cta` / `itemCta` block except `home.cta`, `contact.lead|brief`, `legal.accessibility`, `site.tagline`, `meta.*` titles and descriptions, `wa.*`.
- **Address, opening hours, social profiles** — fill in `address`, `hours` and `social` in `src/lib/site-config.ts`. The contact page shows the navigation tile, the hours card (grouped by identical hours, with an "open now" badge in Israel time) and one card per social profile only once they are filled in.
- **Project screenshots** — see below.
- The legal texts are not legal advice. If analytics is switched on, the privacy policy must be updated (it currently says no analytics is used).

## Images

Originals live in `content/` and are never copied to `out/`. `scripts/build-images.mjs` writes small WebP files to `public/img/` and a manifest to `src/generated/images.json` (both git-ignored).

- **Project screenshots**: drop JPG/PNG/WebP files into `content/portfolio/<project-slug>/` (for example `content/portfolio/custom-crm/01-dashboard.png`). File-name order is display order. The project page then shows a gallery; with no files it shows none.
- **Client logos**: `content/clients/<key>.*`, where `<key>` matches `clients` in `site-config.ts` and `about.clients.items` in the message files.
- **Logo**: `content/brand/`. The header uses the dark-text version on the light theme and the white-text version on the dark theme.

## Adding a service or a project

1. Add a line to `services` or `projects` in `src/lib/site-config.ts`.
2. Add a block with the same slug under `services.items` / `portfolio.items` in **all three** message files.
3. `npm run check:i18n`.

## Colours

`--brand` is a darker shade of the logo blue (`#407bff`), because white text on the logo blue is only 3.8:1.

| Pair (light theme) | Contrast |
| --- | --- |
| white on `--brand` `#2f5fd6` | 5.63 |
| `--brand` on `--canvas` / `--brand-soft` | 5.25 / 5.02 |
| `--brand-dark` `#2247a8` on `--brand-soft` | 7.39 |
| `--text` on `--canvas` | 15.55 |
| `--text-muted` on white / canvas | 6.04 / 5.63 |
| `--text-faint` on white | 3.30 — icons only, never text |

The dark theme redefines the same tokens (all text pairs are above 7:1). Light is the default; the header button switches, and the choice is kept in the browser.

## Analytics (optional)

Off by default: with no ID, the built pages contain no analytics code, set no cookies and show no banner.

To turn it on, build with `NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX` (for example in `.env.local`). Visitors then see a consent banner, Google Analytics loads only after they accept, and a "cookie settings" link appears in the footer.

## Deploying to Hostinger (or any shared/static hosting)

`npm run build` produces a fully static site in `out/` — no Node.js needed on the server.

**1. Build:**

```bash
npm install
npm run build
```

**2. Upload.** Copy the *contents* of `out/` (not the folder itself) to your domain's document root (`public_html`) via File Manager or FTP. This includes `out/.htaccess` — make sure your FTP client shows hidden/dotfiles, or it'll get skipped silently.

To update the live site later, rebuild and re-upload the contents of `out/`.

### Why the `.htaccess` looks the way it does

Next.js's static export writes each route as a flat file (e.g. `he.html`) *and* a same-named directory of internal prefetch data (e.g. `he/`) side by side. Apache's default behavior is to redirect a bare `/he` request to `/he/` because a directory of that name exists, which then 404s (no `index.html` in there) before the rewrite rule that maps `/he` → `he.html` ever runs. `public/.htaccess` disables that auto-redirect (`DirectorySlash Off`) and rewrites clean URLs to their `.html` file directly. If you ever hand-edit it, keep both pieces — dropping either one breaks every route except the homepage redirect.

The same rule serves the inner pages (`/he/services/web-apps` → `he/services/web-apps.html`). The `.htaccess` was not changed in the redesign.

### Why `scripts/fix-export.mjs` exists

When the site is built on Windows, Next.js writes the router's prefetch files into nested folders (`__next.$d$locale/about/__PAGE__.txt`) while the browser asks for flat names (`__next.$d$locale.about.__PAGE__.txt`), so every prefetch returns 404. The script renames them after the build. On macOS/Linux it does nothing.
