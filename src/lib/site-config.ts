// Everything about the business that is not translated text.
// Keep name, phone and address identical to the Google Business Profile.

export type DayKey = "su" | "mo" | "tu" | "we" | "th" | "fr" | "sa";

export type Hours = { day: DayKey; open: string; close: string } | { day: DayKey; open: null };

export type Social = {
  key: "instagram" | "facebook" | "linkedin" | "github";
  /** Shown on the card, e.g. "Instagram" */
  name: string;
  /** Shown under the name, e.g. "@webreflect" */
  handle: string;
  url: string;
};

export const siteConfig = {
  url: "https://web-reflect.com",
  name: "Web Reflect",
  email: "support@web-reflect.com",
  phoneDisplay: "054-676-2760",
  phoneE164: "+972546762760",
  phoneHref: "tel:+972546762760",
  whatsappHref: "https://wa.me/972546762760",
  country: "IL",

  // Not supplied yet. The contact page shows each block only when it is filled in.
  // address: { he: "…", ar: "…", en: "…", mapsUrl: "https://maps.google.com/?q=…", wazeUrl: "https://waze.com/ul?…" }
  address: null as null | { he: string; ar: string; en: string; mapsUrl: string; wazeUrl?: string },
  // One line per day, e.g. { day: "su", open: "09:00", close: "18:00" } or { day: "sa", open: null }
  hours: [] as Hours[],
  social: [] as Social[],

  // Google Analytics 4. Empty = no analytics code and no consent banner in the build.
  gaId: process.env.NEXT_PUBLIC_GA4_ID ?? "",
};

export function whatsappLink(message: string) {
  return `${siteConfig.whatsappHref}?text=${encodeURIComponent(message)}`;
}

// The order here is the order on the site. Text for each slug is under
// services.items / portfolio.items in messages/*.json.
export const services = [
  { slug: "web-apps", icon: "app" },
  { slug: "websites", icon: "globe" },
  { slug: "systems", icon: "workflow" },
] as const;

export const projects = [
  { slug: "ecommerce-platform", icon: "cart", status: "inProgress", service: "websites" },
  { slug: "collections-system", icon: "users", status: "live", service: "web-apps" },
  { slug: "custom-crm", icon: "dashboard", status: "live", service: "web-apps" },
  { slug: "digital-menu", icon: "smartphone", status: "live", service: "websites" },
  { slug: "document-automation", icon: "files", status: "live", service: "systems" },
] as const;

// key = file name in content/clients/ and key under about.clients.items
export const clients = [
  { key: "okal", dark: false },
  { key: "bakery", dark: false },
  { key: "topcosmetics", dark: false },
  { key: "cali-armor", dark: true },
] as const;

export type ServiceSlug = (typeof services)[number]["slug"];
export type ProjectSlug = (typeof projects)[number]["slug"];
