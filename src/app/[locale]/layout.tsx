import { setRequestLocale } from "next-intl/server";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBar } from "@/components/MobileBar";
import { AccessibilityWidget } from "@/components/AccessibilityWidget";
import { Consent } from "@/components/Consent";
import { SiteLogo } from "@/components/SiteLogo";
import { JsonLd } from "@/components/PageHead";
import { getDict, href, localeInfo, localeParams, locales, toLocale } from "@/lib/i18n";
import { businessSchema } from "@/lib/seo";
import { siteConfig, whatsappLink } from "@/lib/site-config";
import "../globals.css";

export const generateStaticParams = localeParams;

// Self-hosted fonts: only the files this language needs are preloaded.
const FONTS = {
  he: ["heebo-hebrew", "heebo-latin"],
  ar: ["noto-sans-arabic", "heebo-latin"],
  en: ["heebo-latin"],
};

// Applies saved accessibility choices before the page paints (see AccessibilityWidget).
const A11Y_BOOT = `try{var a=JSON.parse(localStorage.getItem("a11y-preferences")||"{}"),c=document.documentElement.classList;a.textScale&&c.add("a11y-text-scale-"+a.textScale);a.highContrast&&c.add("a11y-high-contrast");a.underlineLinks&&c.add("a11y-underline-links");a.stopAnimations&&c.add("a11y-stop-animations")}catch(e){}`;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = toLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getDict(locale);

  const links = [
    { path: "/", label: t.nav.home },
    { path: "/services", label: t.nav.services },
    { path: "/portfolio", label: t.nav.portfolio },
    { path: "/about", label: t.nav.about },
    { path: "/contact", label: t.nav.contact },
  ];
  const languages = locales.map((code) => ({
    code,
    label: localeInfo[code].label,
    name: t.nav.languages[code],
  }));

  return (
    <html lang={locale} dir={localeInfo[locale].dir} suppressHydrationWarning>
      <head>
        {FONTS[locale].map((name) => (
          <link
            key={name}
            rel="preload"
            href={`/fonts/${name}.woff2`}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        ))}
        <script dangerouslySetInnerHTML={{ __html: A11Y_BOOT }} />
        <JsonLd data={businessSchema(locale, t)} />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <a className="skip-link" href="#main">
            {t.nav.skip}
          </a>
          <Header
            locale={locale}
            logo={<SiteLogo />}
            links={links}
            languages={languages}
            ctaHref={whatsappLink(t.wa.general)}
            labels={{
              cta: t.nav.cta,
              main: t.nav.main,
              openMenu: t.nav.openMenu,
              closeMenu: t.nav.closeMenu,
              language: t.nav.language,
              theme: t.nav.theme,
            }}
          />
          <main id="main">{children}</main>
          <Footer locale={locale} t={t} />
          <MobileBar t={t} />
          {/* Optional Google Analytics 4 behind a consent banner; nothing is rendered unless NEXT_PUBLIC_GA4_ID is set. */}
          {siteConfig.gaId && (
            <Consent
              gaId={siteConfig.gaId}
              labels={{ ...t.consent, privacy: t.nav.privacy }}
              privacyHref={href(locale, "/privacy-policy")}
            />
          )}
          <AccessibilityWidget labels={t.a11y} statementHref={href(locale, "/accessibility")} />
        </ThemeProvider>
      </body>
    </html>
  );
}
