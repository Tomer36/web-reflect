"use client";

import { useEffect, useRef, useState } from "react";

// Says whether the business is open right now (Israel time) and marks today's
// row in the list that follows. Rendered empty in the static HTML, because the
// answer depends on when the page is opened.
export function OpenBadge({
  hours,
  openLabel,
  closedLabel,
}: {
  hours: Record<string, [string, string]>;
  openLabel: string;
  closedLabel: string;
}) {
  const [open, setOpen] = useState<boolean | null>(null);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    try {
      const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Jerusalem",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      }).formatToParts(new Date());
      const get = (type: string) => parts.find((p) => p.type === type)!.value;
      const day = get("weekday").slice(0, 2).toLowerCase();
      const now = `${get("hour")}:${get("minute")}`;
      const today = hours[day];
      ref.current?.parentElement?.querySelectorAll<HTMLElement>("li[data-days]").forEach((row) => {
        row.classList.toggle("is-today", row.dataset.days!.split(" ").includes(day));
      });
      // Depends on the visitor's clock, so it can only be known after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(!!today && now >= today[0] && now < today[1]);
    } catch {}
  }, [hours]);

  return (
    <p ref={ref} className={open ? "open-badge is-open" : "open-badge"} hidden={open === null}>
      {open === null ? "" : open ? openLabel : closedLabel}
    </p>
  );
}
