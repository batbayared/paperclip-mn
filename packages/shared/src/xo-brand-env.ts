// XO брэнд: XO_* орчны хувьсагч үндсэн, PAPERCLIP_* нөөц (spec §10.1).
const XO_PREFIX = "XO_";
const LEGACY_PREFIX = "PAPERCLIP_";

type Env = Record<string, string | undefined>;

// XO-ийн өөрийн хувьсагч: PAPERCLIP_ хослолгүй, alias хийхгүй.
export const XO_NATIVE_ENV_KEYS: ReadonlySet<string> = new Set(["XO_I18N_TRANSFORM", "XO_SCREENSHOTS"]);

export function brandEnvSuffix(key: string): string | null {
  if (key.startsWith(LEGACY_PREFIX)) return key.slice(LEGACY_PREFIX.length) || null;
  if (key.startsWith(XO_PREFIX)) return key.slice(XO_PREFIX.length) || null;
  return null;
}

export function isBrandRuntimeEnvKey(key: string): boolean {
  return brandEnvSuffix(key) !== null;
}

export function readBrandEnv(name: string, env: Env = process.env): string | undefined {
  const xo = env[XO_PREFIX + name];
  if (xo !== undefined && xo.trim() !== "") return xo;
  return env[LEGACY_PREFIX + name];
}

// Процесс эхлэхэд: XO_X байвал PAPERCLIP_X-ийг дарж бичнэ, ингэснээр
// PAPERCLIP_* уншдаг одоогийн код XO утгыг авна.
export function applyXoEnvAliases(env: Env = process.env): void {
  for (const [key, value] of Object.entries(env)) {
    if (!key.startsWith(XO_PREFIX) || XO_NATIVE_ENV_KEYS.has(key)) continue;
    if (value === undefined || value.trim() === "") continue;
    env[LEGACY_PREFIX + key.slice(XO_PREFIX.length)] = value;
  }
}

// Агентын child env: PAPERCLIP_X бүрд XO_X хуулбар нэмнэ.
export function mirrorPaperclipEnvToXo<T extends Env>(env: T): T {
  const out: Env = { ...env };
  for (const [key, value] of Object.entries(env)) {
    if (!key.startsWith(LEGACY_PREFIX) || value === undefined) continue;
    out[XO_PREFIX + key.slice(LEGACY_PREFIX.length)] = value;
  }
  return out as T;
}
