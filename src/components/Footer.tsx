import Link from "next/link";
import { href, type Locale, type Messages } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";
import { SiteLogo } from "./SiteLogo";

// Logo, one line, legal links, one copyright line. Nothing else.
export function Footer({ locale, t }: { locale: Locale; t: Messages }) {
  const year = new Date().getFullYear();
  const legal = [
    { path: "/accessibility", label: t.nav.accessibility },
    { path: "/privacy-policy", label: t.nav.privacy },
    { path: "/terms-of-use", label: t.nav.terms },
  ];

  return (
    <footer className="site-footer">
      <div className="wrap">
        <Link className="logo" href={href(locale, "/")}>
          <SiteLogo />
        </Link>
        <p className="footer-line">{t.site.tagline}</p>
        <nav className="footer-legal" aria-label={t.nav.legal}>
          <ul>
            {legal.map((item) => (
              <li key={item.path}>
                <Link href={href(locale, item.path)}>{item.label}</Link>
              </li>
            ))}
            {siteConfig.gaId && (
              <li>
                <button type="button" data-consent-reset>
                  {t.footer.cookies}
                </button>
              </li>
            )}
          </ul>
        </nav>
        <p className="footer-copy">
          © {year} {siteConfig.name} — {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
