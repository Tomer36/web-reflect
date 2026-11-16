import Link from "next/link";
import { href, type Locale, type Messages } from "@/lib/i18n";
import { services, siteConfig, whatsappLink } from "@/lib/site-config";
import { Icon } from "./Icon";
import { SiteLogo } from "./SiteLogo";

// Dark footer: brand, site links, services, contact; legal links and copyright below.
export function Footer({ locale, t }: { locale: Locale; t: Messages }) {
  const year = new Date().getFullYear();
  const explore = [
    { path: "/", label: t.nav.home },
    { path: "/services", label: t.nav.services },
    { path: "/portfolio", label: t.nav.portfolio },
    { path: "/about", label: t.nav.about },
    { path: "/contact", label: t.nav.contact },
  ];
  const legal = [
    { path: "/accessibility", label: t.nav.accessibility },
    { path: "/privacy-policy", label: t.nav.privacy },
    { path: "/terms-of-use", label: t.nav.terms },
  ];

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link className="logo" href={href(locale, "/")}>
              <SiteLogo />
            </Link>
            <p>{t.site.tagline}</p>
          </div>

          <nav aria-label={t.footer.explore}>
            <p className="footer-title">{t.footer.explore}</p>
            <ul className="footer-links">
              {explore.map((item) => (
                <li key={item.path}>
                  <Link href={href(locale, item.path)}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t.footer.services}>
            <p className="footer-title">{t.footer.services}</p>
            <ul className="footer-links">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link href={href(locale, `/services/${service.slug}`)}>{t.services.items[service.slug].name}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="footer-title">{t.footer.contact}</p>
            <ul className="footer-links">
              <li>
                <a href={whatsappLink(t.wa.general)} target="_blank" rel="noopener">
                  <Icon name="whatsapp" size={18} />
                  {t.common.whatsapp}
                </a>
              </li>
              <li>
                <a href={siteConfig.phoneHref}>
                  <Icon name="phone" size={18} />
                  <span dir="ltr">{siteConfig.phoneDisplay}</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`}>
                  <Icon name="mail" size={18} />
                  <span dir="ltr">{siteConfig.email}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {year} {siteConfig.name} — {t.footer.rights}
          </p>
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
        </div>
      </div>
    </footer>
  );
}
