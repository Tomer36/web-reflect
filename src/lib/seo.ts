import type { Metadata } from "next";
import { siteConfig } from "./site-config";
import { defaultLocale, href, localeInfo, locales, type Locale, type Messages } from "./i18n";

export const abs = (path: string) => new URL(path, siteConfig.url).href;

/** Title, description, canonical, hreflang (+ x-default), Open Graph and Twitter tags for one page. */
export function pageMetadata(
  locale: Locale,
  path: string,
  t: Messages,
  page: { title: string; description: string },
): Metadata {
  const url = abs(href(locale, path));
  const image = { url: abs("/og-image.jpg"), width: 1200, height: 630, alt: t.meta.ogAlt };
  return {
    title: page.title,
    description: page.description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(locales.map((code) => [code, abs(href(code, path))])),
        "x-default": abs(href(defaultLocale, path)),
      },
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: page.title,
      description: page.description,
      url,
      locale: localeInfo[locale].og,
      alternateLocale: locales.filter((code) => code !== locale).map((code) => localeInfo[code].og),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [image],
    },
    icons: {
      icon: { url: "/favicon.png", type: "image/png", sizes: "96x96" },
      apple: "/apple-touch-icon.png",
    },
    formatDetection: { telephone: false },
  };
}

// ---------- schema.org ----------

const businessId = `${siteConfig.url}/#business`;

/** One name, address and phone for the whole site. */
export function businessSchema(locale: Locale, t: Messages) {
  const address = siteConfig.address;
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": businessId,
    name: siteConfig.name,
    description: t.meta.home.description,
    url: abs(href(locale, "/")),
    logo: abs("/apple-touch-icon.png"),
    image: abs("/og-image.jpg"),
    telephone: siteConfig.phoneE164,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      ...(address ? { streetAddress: address[locale] } : {}),
      addressCountry: siteConfig.country,
    },
    areaServed: siteConfig.country,
    availableLanguage: ["he", "ar", "en"],
    ...(siteConfig.social.length ? { sameAs: siteConfig.social.map((s) => s.url) } : {}),
  };
}

export function serviceSchema(locale: Locale, service: { name: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: abs(href(locale, service.path)),
    inLanguage: locale,
    areaServed: siteConfig.country,
    provider: { "@id": businessId },
  };
}

export function breadcrumbSchema(locale: Locale, items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(href(locale, item.path)),
    })),
  };
}
