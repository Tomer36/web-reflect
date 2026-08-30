"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useHasMounted } from "@/hooks/useHasMounted";

export function SiteLogo({ className = "h-8 w-auto" }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const mounted = useHasMounted();

  // Default to the dark-background variant until mounted (matches the
  // site's default theme), then swap if the resolved theme is light —
  // the source logo's "WEB" text is pure white and unreadable on light.
  const src =
    mounted && resolvedTheme === "light"
      ? "/logo/webreflect-light.png"
      : "/logo/webreflect.png";

  return (
    <Image
      src={src}
      alt="Web Reflect"
      width={768}
      height={167}
      priority
      className={className}
    />
  );
}
