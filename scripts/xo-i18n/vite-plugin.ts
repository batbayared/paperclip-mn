import { XO_TRANSFORM_FILES } from "./tiers";
import { transformSource } from "./transform";

/** Vite-ийн Plugin төрлийг импортлохгүй (vite нь ui/-ийн devDependency); бүтцээр нь зарлана. */
export interface XoI18nPlugin {
  name: string;
  enforce: "pre";
  transform(code: string, id: string): { code: string; map: string | null } | null;
}

export function xoI18nTransformPlugin(): XoI18nPlugin {
  const enabled = process.env.XO_I18N_TRANSFORM !== "0";
  const targets = XO_TRANSFORM_FILES.map((rel) => ({ rel, suffix: `/${rel}` }));
  return {
    name: "xo-i18n-transform",
    enforce: "pre",
    transform(code, id) {
      if (!enabled) return null;
      const file = id.split("?")[0].replace(/\\/g, "/");
      const target = targets.find((t) => file.endsWith(t.suffix));
      if (!target) return null;
      let result: ReturnType<typeof transformSource>;
      try {
        result = transformSource(code, target.rel);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        throw new Error(`xo-i18n-transform: ${target.rel}: ${msg}`, { cause: err });
      }
      if (!result.changed) return null;
      return { code: result.code, map: result.map?.toString() ?? null };
    },
  };
}
