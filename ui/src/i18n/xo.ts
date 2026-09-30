import type { TOptions } from "i18next";
import { i18n } from "./index";

export const XO_NS = "xo";

export function tx(key: string, options: TOptions = {}): string {
  return String(
    i18n.t(key, {
      ns: XO_NS,
      keySeparator: false,
      nsSeparator: false,
      defaultValue: key,
      ...options,
    }),
  );
}
