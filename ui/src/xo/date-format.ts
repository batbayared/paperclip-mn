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

export function mnRelative(n: number, unit: "minute" | "hour" | "day"): string {
  if (unit === "minute") return `${n} мин өмнө`;
  if (unit === "hour") return `${n} ц өмнө`;
  return `${n} өдрийн өмнө`;
}
