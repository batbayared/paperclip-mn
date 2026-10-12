import serverMn from "@/i18n/xo/server-mn.json";
import { BRAND } from "./brand";
import { resolveLocale } from "./locale";

// Сервер locale мэдэхгүй тул англиар хариулна; UI нь server-mn.json-оор
// монгол руу хөрвүүлнэ. Орчуулгагүй мессеж англиараа үлдэнэ.
const catalog = serverMn as Record<string, string>;

interface TemplateEntry {
  pattern: RegExp;
  names: string[];
  translation: string;
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const templates: TemplateEntry[] = Object.entries(catalog)
  .filter(([key]) => key.includes("{{"))
  .map(([key, translation]) => {
    const names: string[] = [];
    const source = key
      .split(/(\{\{\w+\}\})/)
      .map((part) => {
        const match = /^\{\{(\w+)\}\}$/.exec(part);
        if (!match) return escapeRegExp(part);
        names.push(match[1]);
        return "(.+?)";
      })
      .join("");
    return { pattern: new RegExp(`^${source}$`), names, translation };
  });

// Upstream server англи мессежид "Paperclip" гэж бичдэг; UI дээр XO гэж харуулна.
// X-Paperclip-Run-Id, @paperclipai зэрэг тодорхойлогчид хүрэхгүй.
const LEGACY_BRAND_RE = /(?<![\w-])Paperclip(?![\w-])/g;

function translateCatalog(message: string): string {
  if (resolveLocale() !== "mn") return message;
  if (Object.hasOwn(catalog, message)) return catalog[message];
  for (const entry of templates) {
    const match = entry.pattern.exec(message);
    if (!match) continue;
    const values = new Map<string, string>();
    entry.names.forEach((name, index) => {
      if (!values.has(name)) values.set(name, match[index + 1]);
    });
    return entry.translation.replace(/\{\{(\w+)\}\}/g, (_, name: string) => values.get(name) ?? "");
  }
  return message;
}

export function translateServerMessage(message: string): string {
  return translateCatalog(message).replace(LEGACY_BRAND_RE, BRAND.name);
}
