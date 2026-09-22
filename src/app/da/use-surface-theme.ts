"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";
const key = "da-surface-theme";
const changed = "da-surface-theme-change";
function subscribe(callback: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  window.addEventListener("storage", callback);
  window.addEventListener(changed, callback);
  media.addEventListener("change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(changed, callback);
    media.removeEventListener("change", callback);
  };
}
export function useSurfaceTheme(fallback: Theme, followSystem = false): [Theme, (theme: Theme) => void] {
  const theme = useSyncExternalStore(subscribe, () => {
    let saved: string | null = null;
    try { saved = window.localStorage.getItem(key); } catch { /* Storage can be unavailable. */ }
    if (saved === "light" || saved === "dark") return saved;
    return followSystem && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : fallback;
  }, () => fallback);
  return [theme, (next) => {
    try { window.localStorage.setItem(key, next); } catch { return; }
    window.dispatchEvent(new Event(changed));
  }];
}
