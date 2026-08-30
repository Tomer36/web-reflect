import { useTranslations } from "next-intl";
import { SiteLogo } from "./SiteLogo";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 py-10 text-center sm:flex-row sm:justify-between sm:px-8 sm:text-start">
        <SiteLogo className="h-6 w-auto" />
        <p className="font-mono-ui text-xs text-muted">
          © {year} Web Reflect — {t("rights")}
        </p>
      </div>
    </footer>
  );
}
