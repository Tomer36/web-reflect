import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["he", "ar", "en"],
  defaultLocale: "he",
  // Static export can't run the locale-negotiating proxy/middleware, so
  // every locale needs an explicit path segment — "/" itself redirects
  // to "/he/" via .htaccess (see public/.htaccess) instead.
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
