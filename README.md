# Web Reflect

Website of Web Reflect (web-reflect.com). Next.js (App Router) with Hebrew, Arabic and English, shipped as a fully static export — plain HTML/CSS/JS, no server required.

The design follows the hostinger.com marketing site, in the Web Reflect blue (`--brand-fill` `#2f5fd6`, a darker shade of the logo blue `#407bff`, because white text on the logo blue is only 3.8:1): a dark navy hero and closing call-to-action band, pale blue tinted sections, bold 800-weight display headings, accent-coloured icon tiles (blue, pink, green, orange, yellow), cards that lift on hover, a scrolling promo strip above the header and a dark multi-column footer.

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

## Deploy

Every push to `main` deploys automatically: [.github/workflows/deploy.yml](.github/workflows/deploy.yml) runs lint and the full build, then uploads `out/` to the hosting over FTP (only changed files are sent). A failed check stops the deploy, so the live site stays as it was. It can also be run by hand from the Actions tab (Deploy → Run workflow).

It needs these repository secrets (Settings → Secrets and variables → Actions): `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`, and optionally `FTP_SERVER_DIR` (default `public_html/`). Without them the site is built but not uploaded.

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

All tokens are in `src/app/globals.css` (`:root`, `[data-theme="dark"]` and the high-contrast override). The dark bands (`--hero-bg`, `--night`) are the same in both themes.

| Pair (light theme) | Contrast |
| --- | --- |
| white on `--brand-fill` `#2f5fd6` | 5.6 |
| `--brand` on `--surface-muted` `#f4f7ff` / `--brand-soft` `#e6eeff` | 5.2 / 4.8 |
| `--ink` `#13265e` (headings) on white | 14.4 |
| `--text-muted` `#5a6175` on white | 6.3 |
| `--on-night-muted` `#c3d3f5` on `#13265e` | 10.2 |
| `--text-faint` on white | 3.4 — icons only, never text |

Home page text added with this design that still needs review (all three languages): `site.promo` (ticker), `home.hero.headline|highlight|trust`, `home.why`, `home.faq` (also emitted as FAQPage JSON-LD). The stat card counts projects, clients, services and languages straight from `site-config.ts`, so it never shows a number that is not true.
