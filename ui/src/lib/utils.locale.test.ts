import { afterEach, describe, expect, it } from "vitest";
import { XO_LOCALE_STORAGE_KEY } from "@/xo/locale";
import { formatDate, formatDateTime, formatNumber, formatShortDate, relativeTime } from "./utils";

const sample = new Date(2026, 8, 7, 13, 2, 54);

afterEach(() => {
  localStorage.removeItem(XO_LOCALE_STORAGE_KEY);
});

describe("locale-aware formats (mn)", () => {
  it("formats dates and numbers in Mongolian", () => {
    localStorage.setItem(XO_LOCALE_STORAGE_KEY, "mn");
    expect(formatDate(sample)).toBe("2026 оны 9-р сарын 7");
    expect(formatDateTime(sample)).toBe("2026 оны 9-р сарын 7 13:02");
    expect(formatDateTime(sample, { includeSeconds: true })).toBe("2026 оны 9-р сарын 7 13:02:54");
    expect(formatShortDate(sample)).toBe("9-р сарын 7");
    expect(formatNumber(1234567)).toBe("1,234,567");
  });

  it("formats relative time in Mongolian", () => {
    localStorage.setItem(XO_LOCALE_STORAGE_KEY, "mn");
    expect(relativeTime(new Date(Date.now() - 5 * 60_000))).toBe("5 мин өмнө");
    expect(relativeTime(new Date())).toBe("саяхан");
  });
});

describe("locale-aware formats (en)", () => {
  it("keeps the English output", () => {
    expect(formatDate(sample)).toBe("Sep 7, 2026");
    expect(relativeTime(new Date(Date.now() - 5 * 60_000))).toBe("5m ago");
  });
});
