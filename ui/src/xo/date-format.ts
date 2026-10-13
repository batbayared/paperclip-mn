import { localeTag } from "./locale";

// XO: Chromium-д mn ICU өгөгдөл байхгүй тул mn огноог гараар үүсгэнэ.
// Гаралт Node-ийн mn-MN ICU-тэй ижил: цаг 0-гүй, минут ба секунд 2 оронтой.
function hm(d: Date, includeSeconds = false): string {
  const mm = String(d.getMinutes()).padStart(2, "0");
  const base = `${d.getHours()}:${mm}`;
  return includeSeconds ? `${base}:${String(d.getSeconds()).padStart(2, "0")}` : base;
}

// Хүчингүй огноонд en замтай адил «Invalid Date» буцаана («NaN оны NaN-р сарын NaN» биш).
function invalid(d: Date): boolean {
  return Number.isNaN(d.getTime());
}

export function mnShortDate(d: Date): string {
  if (invalid(d)) return String(d);
  return `${d.getMonth() + 1}-р сарын ${d.getDate()}`;
}

export function mnDate(d: Date): string {
  if (invalid(d)) return String(d);
  return `${d.getFullYear()} оны ${mnShortDate(d)}`;
}

export function mnDateTime(d: Date, includeSeconds = false): string {
  if (invalid(d)) return String(d);
  return `${mnDate(d)} ${hm(d, includeSeconds)}`;
}

export function mnShortDateTime(d: Date): string {
  if (invalid(d)) return String(d);
  return `${mnShortDate(d)} ${hm(d)}`;
}

export function mnTime(d: Date, includeSeconds = false): string {
  if (invalid(d)) return String(d);
  return hm(d, includeSeconds);
}

function isMn(): boolean {
  return localeTag() === "mn-MN";
}

// mn замд timeZone: "UTC"-г дагах: UTC хэсгүүдийг орон нутгийн Date болгож форматлана.
function mnZoned(d: Date, options?: Intl.DateTimeFormatOptions): Date {
  if (options?.timeZone !== "UTC" || invalid(d)) return d;
  return new Date(
    d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(),
    d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds(),
  );
}

// Жилгүй, сартай (dateStyle-гүй) options → богино формат.
function isShortDate(options?: Intl.DateTimeFormatOptions): boolean {
  return options?.year === undefined && options?.month !== undefined && options?.dateStyle === undefined;
}

// Upstream-ийн d.toLocaleString(locales, options) дуудлагын орлуулагч.
// mn: ICU-гүй гар формат (Chromium-д mn ICU байхгүй). en: яг хуучин дуудлага.
export function xoLocaleDateTime(
  d: Date,
  locales?: string | string[],
  options?: Intl.DateTimeFormatOptions,
): string {
  if (isMn()) {
    const z = mnZoned(d, options);
    return isShortDate(options) ? mnShortDateTime(z) : mnDateTime(z, options?.second !== undefined);
  }
  return locales === undefined && options === undefined
    ? d.toLocaleString()
    : d.toLocaleString(locales, options);
}

export function xoLocaleDate(
  d: Date,
  locales?: string | string[],
  options?: Intl.DateTimeFormatOptions,
): string {
  if (isMn()) {
    const z = mnZoned(d, options);
    return isShortDate(options) ? mnShortDate(z) : mnDate(z);
  }
  return locales === undefined && options === undefined
    ? d.toLocaleDateString()
    : d.toLocaleDateString(locales, options);
}

// en toLocaleTimeString нь hour/minute/second/timeStyle заагаагүй үед секундтэй гаргадаг.
function timeHasSeconds(options?: Intl.DateTimeFormatOptions): boolean {
  if (options?.second !== undefined) return true;
  return (
    options === undefined ||
    (options.hour === undefined &&
      options.minute === undefined &&
      options.timeStyle === undefined)
  );
}

export function xoLocaleTime(
  d: Date,
  locales?: string | string[],
  options?: Intl.DateTimeFormatOptions,
): string {
  if (isMn()) return mnTime(mnZoned(d, options), timeHasSeconds(options));
  return locales === undefined && options === undefined
    ? d.toLocaleTimeString()
    : d.toLocaleTimeString(locales, options);
}

// Цагийн бүсийн хөрвүүлэлт: mn үед гар формат (Intl "en-US"-аас зөвхөн тоон хэсэг), en үед null.
export function xoZonedDateTime(d: Date, timeZone: string): string | null {
  if (!isMn()) return null;
  if (invalid(d)) return String(d);
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone, year: "numeric", month: "numeric", day: "numeric",
    hour: "numeric", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(d);
  const pick = (t: Intl.DateTimeFormatPartTypes) => Number(parts.find((p) => p.type === t)?.value ?? "0");
  return mnDateTime(new Date(pick("year"), pick("month") - 1, pick("day"), pick("hour"), pick("minute")));
}

export function mnRelative(n: number, unit: "minute" | "hour" | "day"): string {
  if (unit === "minute") return `${n} мин өмнө`;
  if (unit === "hour") return `${n} ц өмнө`;
  return `${n} өдрийн өмнө`;
}
