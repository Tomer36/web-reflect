import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SiteLogo } from "./SiteLogo";

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const year = new Date().getFullYear();
  const legalLabels = {
    en: { navigation: "Legal links", privacy: "Privacy Policy", terms: "Terms of Use" },
    he: { navigation: "קישורים משפטיים", privacy: "מדיניות פרטיות", terms: "תנאי שימוש" },
    ar: { navigation: "روابط قانونية", privacy: "سياسة الخصوصية", terms: "شروط الاستخدام" },
  }[locale] ?? { navigation: "Legal links", privacy: "Privacy Policy", terms: "Terms of Use" };

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 py-10 text-center sm:flex-row sm:justify-between sm:px-8 sm:text-start">
        <SiteLogo className="h-6 w-auto" />
        <div className="flex flex-col items-center gap-2 sm:items-end">
          <nav aria-label={legalLabels.navigation} className="flex gap-4 text-xs">
            <Link href="/privacy-policy" className="text-muted transition-colors hover:text-foreground">{legalLabels.privacy}</Link>
            <Link href="/terms-of-use" className="text-muted transition-colors hover:text-foreground">{legalLabels.terms}</Link>
          </nav>
          <p className="font-mono-ui text-xs text-muted">© {year} Web Reflect — {t("rights")}</p>
        </div>
      </div>
    </footer>
  );
}
