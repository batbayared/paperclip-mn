// XO: Chromium-д mn ICU өгөгдөл байхгүй тул mn огноог гараар үүсгэнэ.
// Гаралт Node-ийн mn-MN ICU-тэй ижил: цаг 0-гүй, минут ба секунд 2 оронтой.
function hm(d: Date, includeSeconds = false): string {
  const mm = String(d.getMinutes()).padStart(2, "0");
  const base = `${d.getHours()}:${mm}`;
  return includeSeconds ? `${base}:${String(d.getSeconds()).padStart(2, "0")}` : base;
}

export function mnShortDate(d: Date): string {
  return `${d.getMonth() + 1}-р сарын ${d.getDate()}`;
}

export function mnDate(d: Date): string {
  return `${d.getFullYear()} оны ${mnShortDate(d)}`;
}

export function mnDateTime(d: Date, includeSeconds = false): string {
  return `${mnDate(d)} ${hm(d, includeSeconds)}`;
}

export function mnShortDateTime(d: Date): string {
  return `${mnShortDate(d)} ${hm(d)}`;
}

export function mnRelative(n: number, unit: "minute" | "hour" | "day"): string {
  if (unit === "minute") return `${n} мин өмнө`;
  if (unit === "hour") return `${n} ц өмнө`;
  return `${n} өдрийн өмнө`;
}
