import { afterEach, describe, expect, it, vi } from "vitest";
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

  it("formats hours and days in Mongolian", () => {
    localStorage.setItem(XO_LOCALE_STORAGE_KEY, "mn");
    expect(relativeTime(new Date(Date.now() - 3 * 3_600_000))).toBe("3 ц өмнө");
    expect(relativeTime(new Date(Date.now() - 2 * 86_400_000))).toBe("2 өдрийн өмнө");
  });

  it("does not depend on the runtime's mn ICU data", () => {
    localStorage.setItem(XO_LOCALE_STORAGE_KEY, "mn");
    const toLocaleString = vi.spyOn(Date.prototype, "toLocaleString");
    const toLocaleDateString = vi.spyOn(Date.prototype, "toLocaleDateString");
    const rtf = vi.spyOn(Intl.RelativeTimeFormat.prototype, "format");
    try {
      formatDate(sample);
      formatDateTime(sample, { includeSeconds: true });
      formatShortDate(sample);
      relativeTime(new Date(Date.now() - 5 * 60_000));
      relativeTime(new Date(Date.now() - 3 * 3_600_000));
      expect(toLocaleString).not.toHaveBeenCalled();
      expect(toLocaleDateString).not.toHaveBeenCalled();
      expect(rtf).not.toHaveBeenCalled();
    } finally {
      toLocaleString.mockRestore();
      toLocaleDateString.mockRestore();
      rtf.mockRestore();
    }
  });
});

describe("locale-aware formats (en)", () => {
  it("keeps the English output", () => {
    expect(formatDate(sample)).toBe("Sep 7, 2026");
    expect(relativeTime(new Date(Date.now() - 5 * 60_000))).toBe("5m ago");
  });
});
