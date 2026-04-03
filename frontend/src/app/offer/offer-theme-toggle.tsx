"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme-context";

export function OfferThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="pointer-events-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 hover:border-[var(--accent)]"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--bg)",
        color: "var(--text-muted)",
      }}
      aria-label={isDark ? "Светлая тема" : "Тёмная тема"}
    >
      {isDark ? <Sun size={20} strokeWidth={1.5} /> : <Moon size={20} strokeWidth={1.5} />}
    </button>
  );
}
