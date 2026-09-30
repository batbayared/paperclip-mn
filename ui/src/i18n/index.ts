import i18n, { type InitOptions, type TOptions } from "i18next";
import { initReactI18next, useTranslation as useReactI18nextTranslation } from "react-i18next";

import { BRAND } from "@/xo/brand";
import { applyDocumentLang, resolveLocale } from "@/xo/locale";
import { DEFAULT_LOCALE, i18nextResources, supportedLocales } from "./locales";
import xoEn from "./xo/en.json";
import xoMn from "./xo/mn.json";

const xoLocale = resolveLocale();

const i18nextOptions: InitOptions = {
  resources: i18nextResources,
  lng: xoLocale,
  fallbackLng: DEFAULT_LOCALE,
  supportedLngs: supportedLocales,
  defaultNS: "translation",
  interpolation: { escapeValue: false, defaultVariables: { brand: BRAND.name } },
  returnObjects: false,
  initAsync: false,
};

void i18n.use(initReactI18next).init(i18nextOptions).catch((error: unknown) => {
  console.error("Failed to initialize i18next", error);
});

i18n.addResourceBundle("en", "xo", xoEn, true, true);
i18n.addResourceBundle("mn", "xo", xoMn, true, true);
applyDocumentLang(xoLocale);

export function t(key: string, options: TOptions = {}) {
  return i18n.t(key, options);
}

export const useTranslation = useReactI18nextTranslation;
export { i18n };
