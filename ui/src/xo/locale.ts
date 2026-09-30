export const XO_LOCALES = ["mn", "en"] as const;
export type XoLocale = (typeof XO_LOCALES)[number];
export const XO_LOCALE_STORAGE_KEY = "xo.locale";
export const XO_DEFAULT_LOCALE: XoLocale = "mn";

export function isXoLocale(value: unknown): value is XoLocale {
  return typeof value === "string" && (XO_LOCALES as readonly string[]).includes(value);
}

function readStoredLocale(): XoLocale | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const stored = localStorage.getItem(XO_LOCALE_STORAGE_KEY);
    return isXoLocale(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function resolveLocale(): XoLocale {
  const stored = readStoredLocale();
  if (stored) return stored;
  const fromEnv: unknown = import.meta.env.VITE_XO_DEFAULT_LOCALE;
  if (isXoLocale(fromEnv)) return fromEnv;
  return XO_DEFAULT_LOCALE;
}

export function setLocale(locale: XoLocale): void {
  try {
    localStorage.setItem(XO_LOCALE_STORAGE_KEY, locale);
  } catch {
    // localStorage хаалттай байсан ч хуудсыг дахин ачаална
  }
  if (typeof window !== "undefined") window.location.reload();
}

export function localeTag(locale: XoLocale = resolveLocale()): "mn-MN" | "en-US" {
  return locale === "mn" ? "mn-MN" : "en-US";
}

export function applyDocumentLang(locale: XoLocale): void {
  if (typeof document === "undefined") return;
  document.documentElement.lang = locale;
}
