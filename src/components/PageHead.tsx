import Link from "next/link";
import { href, type Locale, type Messages } from "@/lib/i18n";
import { whatsappLink } from "@/lib/site-config";
import { Icon, type IconName } from "./Icon";

export type Crumb = { name: string; path: string };

/** Top of every inner page: breadcrumb, one h1, a lead and (desktop only) the page's one contact button. */
export function PageHead({
  locale,
  t,
  title,
  lead,
  crumbs,
  icon,
  badge,
  waMessage,
}: {
  locale: Locale;
  t: Messages;
  title: string;
  lead?: string;
  /** Home is added automatically; the last crumb is the current page. */
  crumbs: Crumb[];
  icon?: IconName;
  badge?: React.ReactNode;
  /** Pass a message to show the contact button; omit it on pages that have none. */
  waMessage?: string;
}) {
  const trail = [{ name: t.nav.home, path: "/" }, ...crumbs];
  return (
    <section className="page-head">
      <div className="wrap">
        <nav className="breadcrumb" aria-label={t.nav.breadcrumb}>
          <ol>
            {trail.map((crumb, i) =>
              i === trail.length - 1 ? (
                <li key={crumb.path} aria-current="page">
                  {crumb.name}
                </li>
              ) : (
                <li key={crumb.path}>
                  <Link href={href(locale, crumb.path)}>{crumb.name}</Link>
                </li>
              ),
            )}
          </ol>
        </nav>
        {icon && (
          <span className="icon-badge">
            <Icon name={icon} size={26} />
          </span>
        )}
        {badge && <div>{badge}</div>}
        <h1>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
        {waMessage && (
          <div className="btn-row desktop-only">
            <a className="btn btn-primary" href={whatsappLink(waMessage)} target="_blank" rel="noopener">
              <Icon name="whatsapp" />
              {t.nav.cta}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

/** Closing block: the last contact control on a page (desktop; phones use the sticky bar). */
export function Cta({
  t,
  title,
  text,
  waMessage,
}: {
  t: Messages;
  title: string;
  text: string;
  waMessage: string;
}) {
  return (
    <section className="section">
      <div className="wrap">
        <div className="card cta">
          <div>
            <h2>{title}</h2>
            <p>{text}</p>
          </div>
          <a className="btn btn-primary desktop-only" href={whatsappLink(waMessage)} target="_blank" rel="noopener">
            <Icon name="whatsapp" />
            {t.nav.cta}
          </a>
        </div>
      </div>
    </section>
  );
}

export function StatusChip({ status, t }: { status: "live" | "inProgress"; t: Messages }) {
  return (
    <span className={status === "live" ? "status" : "status status-progress"}>
      {status === "live" ? t.common.live : t.common.inProgress}
    </span>
  );
}

export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <>
      {(Array.isArray(data) ? data : [data]).map((node, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(node).replace(/</g, "\\u003c") }}
        />
      ))}
    </>
  );
}
