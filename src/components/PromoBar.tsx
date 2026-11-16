// Scrolling strip above the header (hostinger.com style). The list is drawn
// twice so the loop is seamless; the copy is hidden from assistive technology.
export function PromoBar({ items }: { items: string[] }) {
  const list = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined}>
      {[...items, ...items].map((item, i) => (
        <li key={i} aria-hidden={(!hidden && i >= items.length) || undefined}>
          {item}
        </li>
      ))}
    </ul>
  );
  return (
    <div className="promo-bar">
      <div className="promo-track">
        {list(false)}
        {list(true)}
      </div>
    </div>
  );
}
