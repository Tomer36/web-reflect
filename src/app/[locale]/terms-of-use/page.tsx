import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/LegalPage";
import { getTermsOfUse } from "@/lib/legal-content";
import { routing } from "@/i18n/routing";

export const metadata: Metadata = { title: "Terms of Use | Web Reflect" };
export default async function TermsOfUse({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return <LegalPage {...getTermsOfUse(locale)} />;
}
