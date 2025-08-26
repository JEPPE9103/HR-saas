export type Locale = "en" | "sv";

let current: Locale = "sv";
export function setLocale(l: Locale){ current = l; }
export function t(key: string, fallback?: string){
  // Minimal stub; extend with dictionaries as needed
  return fallback ?? key;
}


