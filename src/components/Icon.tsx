import {
  Accessibility,
  AppWindow,
  ArrowLeft,
  Check,
  ChevronLeft,
  Clock,
  FileStack,
  Globe,
  LayoutDashboard,
  Link2,
  Mail,
  MapPin,
  Menu,
  Moon,
  Navigation,
  Phone,
  ShoppingCart,
  Smartphone,
  Sun,
  Users,
  Workflow,
  X,
  ZoomIn,
  type LucideIcon,
} from "lucide-react";

// Outlined line icons, 1.5 stroke, everywhere on the site.
const ICONS = {
  accessibility: Accessibility,
  app: AppWindow,
  arrow: ArrowLeft,
  cart: ShoppingCart,
  check: Check,
  chevron: ChevronLeft,
  clock: Clock,
  close: X,
  dashboard: LayoutDashboard,
  files: FileStack,
  globe: Globe,
  link: Link2,
  mail: Mail,
  menu: Menu,
  moon: Moon,
  navigate: Navigation,
  phone: Phone,
  pin: MapPin,
  smartphone: Smartphone,
  sun: Sun,
  users: Users,
  workflow: Workflow,
  zoom: ZoomIn,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS | "whatsapp" | "instagram" | "facebook" | "linkedin" | "github";

// Brand marks are not part of lucide; drawn here in the same outlined style.
const BRAND_PATHS: Record<string, React.ReactNode> = {
  whatsapp: (
    <>
      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </>
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </>
  ),
  facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  github: (
    <>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </>
  ),
};

export function Icon({ name, size = 20, className }: { name: IconName; size?: number; className?: string }) {
  const cls = className ? `icon ${className}` : "icon";
  if (name in BRAND_PATHS) {
    return (
      <svg
        className={cls}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {BRAND_PATHS[name]}
      </svg>
    );
  }
  const Lucide = ICONS[name as keyof typeof ICONS];
  return <Lucide className={cls} size={size} strokeWidth={1.5} aria-hidden="true" />;
}
