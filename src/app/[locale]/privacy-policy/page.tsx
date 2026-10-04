import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { LegalPage } from "@/components/LegalPage";
import { getPrivacyPolicy } from "@/lib/legal-content";
import { routing } from "@/i18n/routing";

export const metadata: Metadata = { title: "Privacy Policy | Web Reflect" };
export default async function PrivacyPolicy({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return <LegalPage {...getPrivacyPolicy(locale)} />;
}
