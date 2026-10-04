"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useHasMounted } from "@/hooks/useHasMounted";

export function ThemeToggle({ label }: { label: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useHasMounted();

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      aria-pressed={isDark}
      className="icon-btn"
    >
      {isDark ? (
        <Sun className="icon" size={20} strokeWidth={1.5} aria-hidden="true" />
      ) : (
        <Moon className="icon" size={20} strokeWidth={1.5} aria-hidden="true" />
      )}
    </button>
  );
}
