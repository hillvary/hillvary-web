"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

function getInitialDark() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("hillvary-admin-theme") === "dark";
}

function applyDark(isDark: boolean) {
  document.getElementById("admin-shell")?.classList.toggle("dark", isDark);
}

export function AdminThemeToggle() {
  const [dark, setDark] = useState(getInitialDark);

  // Sync the DOM class on mount to match the persisted preference — this is
  // an external-system sync, not a state update, so it belongs in an effect.
  useEffect(() => {
    applyDark(dark);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    localStorage.setItem("hillvary-admin-theme", next ? "dark" : "light");
    applyDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-border"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
