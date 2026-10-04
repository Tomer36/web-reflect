import { getMessages } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import type en from "../../messages/en.json";

export type { Locale };
export type Messages = typeof en;

export const locales = routing.locales;
export const defaultLocale = routing.defaultLocale;

export const localeInfo: Record<Locale, { dir: "rtl" | "ltr"; label: string; og: string }> = {
  he: { dir: "rtl", label: "עב", og: "he_IL" },
  ar: { dir: "rtl", label: "عر", og: "ar_IL" },
  en: { dir: "ltr", label: "EN", og: "en_US" },
};

/** Validates the [locale] segment; every page calls this first. */
export function toLocale(value: string): Locale {
  if (!hasLocale(routing.locales, value)) notFound();
  return value;
}

/** All text of one language, typed after messages/en.json. */
export async function getDict(locale: Locale): Promise<Messages> {
  return (await getMessages({ locale })) as Messages;
}

/** "/services/web-apps" → "/he/services/web-apps"; "/" → "/he" */
export function href(locale: Locale, path: string) {
  return `/${locale}${path === "/" ? "" : path}`;
}

/** Replaces {name} placeholders. */
export function fill(text: string, values: Record<string, string | number>) {
  return text.replace(/\{(\w+)\}/g, (match, key) => (key in values ? String(values[key]) : match));
}

/** "a, b and c" in the page's language. Arabic: commas, with "و" only before the last item. */
export function joinList(locale: Locale, items: string[]) {
  if (items.length < 2) return items.join("");
  if (locale === "ar") return `${items.slice(0, -1).join("، ")} و${items[items.length - 1]}`;
  return new Intl.ListFormat(locale, { style: "long", type: "conjunction" }).format(items);
}

export const localeParams = () => routing.locales.map((locale) => ({ locale }));
