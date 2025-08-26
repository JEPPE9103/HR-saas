export type AppTheme = "light" | "dark";

const KEY = "pt-theme";

export function getTheme(): AppTheme {
  if (typeof window === "undefined") return "light";
  const t = (localStorage.getItem(KEY) as AppTheme | null) || "light";
  return t === "dark" ? "dark" : "light";
}

export function setTheme(theme: AppTheme) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, theme);
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function initTheme() {
  const t = getTheme();
  document.documentElement.dataset.theme = t;
  document.documentElement.classList.toggle("dark", t === "dark");
}


