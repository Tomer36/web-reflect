import { joinList, type Locale, type Messages } from "@/lib/i18n";
import { siteConfig, type DayKey } from "@/lib/site-config";
import { OpenBadge } from "./OpenBadge";

const ORDER: DayKey[] = ["su", "mo", "tu", "we", "th", "fr", "sa"];

/** "Sunday", "יום ראשון", "الأحد" — taken from the platform, not from the message files. */
function dayName(locale: Locale, day: DayKey) {
  // 2024-01-07 is a Sunday
  const date = new Date(Date.UTC(2024, 0, 7 + ORDER.indexOf(day)));
  return new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "UTC" }).format(date);
}

// Opening hours, with days that share the same hours grouped into one row and
// an "open now / closed now" badge worked out in Israel time.
// The hours themselves are in src/lib/site-config.ts.
export function Hours({ locale, t }: { locale: Locale; t: Messages }) {
  const groups: { time: string | null; days: DayKey[] }[] = [];
  for (const h of siteConfig.hours) {
    const time = h.open ? `${h.open}–${h.close}` : null;
    const group = groups.find((g) => g.time === time);
    if (group) group.days.push(h.day);
    else groups.push({ time, days: [h.day] });
  }
  // closed days go last
  groups.sort((a, b) => Number(a.time === null) - Number(b.time === null));

  const byDay = Object.fromEntries(
    siteConfig.hours.flatMap((h) => (h.open ? [[h.day, [h.open, h.close]]] : [])),
  ) as Record<string, [string, string]>;

  return (
    <div className="hours">
      <OpenBadge hours={byDay} openLabel={t.common.openNow} closedLabel={t.common.closedNow} />
      <ul>
        {groups.map((group) => (
          <li key={group.days.join()} className={group.time ? undefined : "is-closed"} data-days={group.days.join(" ")}>
            <span className="hours-days">
              {joinList(
                locale,
                group.days.map((d) => dayName(locale, d)),
              )}
            </span>
            <span className="hours-time">{group.time ? <bdi dir="ltr">{group.time}</bdi> : t.common.closed}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
