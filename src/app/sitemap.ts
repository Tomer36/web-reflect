import type { MetadataRoute } from "next";
import { defaultLocale, href, locales } from "@/lib/i18n";
import { abs } from "@/lib/seo";
import { projects, services } from "@/lib/site-config";

export const dynamic = "force-static";

// Locale-independent paths of every page.
const paths = [
  "/",
  "/services",
  ...services.map((service) => `/services/${service.slug}`),
  "/portfolio",
  ...projects.map((project) => `/portfolio/${project.slug}`),
  "/about",
  "/contact",
  "/accessibility",
  "/privacy-policy",
  "/terms-of-use",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: abs(href(locale, path)),
      alternates: {
        languages: {
          ...Object.fromEntries(locales.map((code) => [code, abs(href(code, path))])),
          "x-default": abs(href(defaultLocale, path)),
        },
      },
    })),
  );
}
