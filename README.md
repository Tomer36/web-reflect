# Web Reflect

Custom-built portfolio site for Web Reflect, replacing the previous WordPress/Elementor site. Next.js (App Router) with full Hebrew/Arabic/English support and RTL. Ships as a fully static export — plain HTML/CSS/JS, no server required.

## Stack

- Next.js 16 (App Router, Turbopack), static export (`output: "export"`)
- Tailwind CSS v4
- next-intl for i18n/RTL routing (`he` default, `en` at `/en`, `ar` at `/ar` — `/` redirects to `/he` via `.htaccess`)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content

All copy lives in `messages/{he,ar,en}.json`. Site-wide contact details (phone, WhatsApp, email) live in `src/lib/site-config.ts`.

## Editing sections

Components are under `src/components/`: `Hero`, `Services`, `Portfolio`, `Skills`, `Contact`, `Header`, `Footer`. The page itself is assembled in `src/app/[locale]/page.tsx`.

## Deploying to Hostinger (or any shared/static hosting)

`npm run build` produces a fully static site in `out/` — no Node.js needed on the server, works on any basic hosting plan (this was verified against a real local Apache instance with the exact `.htaccess` rules below, not just assumed).

**1. Build:**

```bash
npm install
npm run build
```

**2. Upload.** Copy the *contents* of `out/` (not the folder itself) to your domain's document root (`public_html`) via File Manager or FTP. This includes `out/.htaccess` — make sure your FTP client shows hidden/dotfiles, or it'll get skipped silently.

That's it — no Node.js app to configure, no environment variables, no process to restart. To update the live site later, rebuild and re-upload the contents of `out/`.

### Why the `.htaccess` looks the way it does

Next.js's static export writes each route as a flat file (e.g. `he.html`) *and* a same-named directory of internal prefetch data (e.g. `he/`) side by side. Apache's default behavior is to redirect a bare `/he` request to `/he/` because a directory of that name exists, which then 404s (no `index.html` in there) before the rewrite rule that maps `/he` → `he.html` ever runs. `public/.htaccess` disables that auto-redirect (`DirectorySlash Off`) and rewrites clean URLs to their `.html` file directly. If you ever hand-edit it, keep both pieces — dropping either one breaks every route except the homepage redirect.
