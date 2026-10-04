"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

type Props = {
  locale: string;
  logo: React.ReactNode;
  /** path is locale-independent: "/", "/services", … */
  links: { path: string; label: string }[];
  languages: { code: string; label: string; name: string }[];
  ctaHref: string;
  labels: {
    cta: string;
    main: string;
    openMenu: string;
    closeMenu: string;
    language: string;
    theme: string;
  };
};

export function Header({ locale, logo, links, languages, ctaHref, labels }: Props) {
  const [open, setOpen] = useState(false);
  // "/he/services/web-apps" → "/services/web-apps"; "/he" → "/"
  const path = (usePathname() ?? `/${locale}`).replace(/^\/[^/]+/, "").replace(/\/$/, "") || "/";
  const to = (code: string, p: string) => `/${code}${p === "/" ? "" : p}`;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // The switcher lands on the same page in the other language. Plain links, so
  // the browser loads the new document with its own lang and dir.
  const langSwitch = (
    <div className="lang-switch" role="group" aria-label={labels.language}>
      {languages.map((lang) => (
        <a
          key={lang.code}
          href={to(lang.code, path)}
          lang={lang.code}
          hrefLang={lang.code}
          aria-label={lang.name}
          aria-current={lang.code === locale ? "true" : undefined}
        >
          <span>{lang.label}</span>
        </a>
      ))}
    </div>
  );

  return (
    <header className="site-header">
      <div className="wrap header-inner">
        <button
          type="button"
          className="icon-btn menu-toggle"
          aria-expanded={open}
          aria-controls="site-nav"
          aria-label={open ? labels.closeMenu : labels.openMenu}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <X className="icon" size={24} strokeWidth={1.5} aria-hidden="true" />
          ) : (
            <Menu className="icon" size={24} strokeWidth={1.5} aria-hidden="true" />
          )}
        </button>

        <Link className="logo" href={to(locale, "/")} onClick={() => setOpen(false)}>
          {logo}
        </Link>

        <nav className="site-nav" id="site-nav" aria-label={labels.main} data-open={open ? "" : undefined}>
          <ul>
            {links.map((link) => {
              const current = link.path === "/" ? path === "/" : path === link.path || path.startsWith(`${link.path}/`);
              return (
                <li key={link.path}>
                  <Link
                    href={to(locale, link.path)}
                    aria-current={current ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          {langSwitch}
        </nav>

        <div className="header-actions">
          {langSwitch}
          <ThemeToggle label={labels.theme} />
          <a className="btn btn-primary btn-sm" href={ctaHref} target="_blank" rel="noopener">
            {labels.cta}
          </a>
        </div>
      </div>
    </header>
  );
}
