import { afterEach, describe, expect, it, vi } from "vitest";
import {
  mnDate, mnDateTime, mnRelative, mnShortDate, mnShortDateTime,
  mnTime, xoLocaleDate, xoLocaleDateTime, xoLocaleTime, xoZonedDateTime,
} from "./date-format";
import { XO_LOCALE_STORAGE_KEY } from "./locale";

const sample = new Date(2026, 8, 7, 13, 2, 54);
const morning = new Date(2026, 0, 3, 9, 5, 4);

describe("mn огнооны формат (ICU-гүй)", () => {
  it("огноо", () => {
    expect(mnDate(sample)).toBe("2026 оны 9-р сарын 7");
    expect(mnShortDate(morning)).toBe("1-р сарын 3");
  });

  it("огноо ба цаг", () => {
    expect(mnDateTime(sample)).toBe("2026 оны 9-р сарын 7 13:02");
    expect(mnDateTime(sample, true)).toBe("2026 оны 9-р сарын 7 13:02:54");
    expect(mnDateTime(morning)).toBe("2026 оны 1-р сарын 3 9:05");
    expect(mnShortDateTime(morning)).toBe("1-р сарын 3 9:05");
  });

  it("хүчингүй огноо en замтай адил «Invalid Date»", () => {
    const bad = new Date("not-a-date");
    expect(mnDate(bad)).toBe("Invalid Date");
    expect(mnShortDate(bad)).toBe("Invalid Date");
    expect(mnDateTime(bad)).toBe("Invalid Date");
    expect(mnShortDateTime(bad)).toBe("Invalid Date");
  });

  it("харьцангуй хугацаа", () => {
    expect(mnRelative(5, "minute")).toBe("5 мин өмнө");
    expect(mnRelative(3, "hour")).toBe("3 ц өмнө");
    expect(mnRelative(2, "day")).toBe("2 өдрийн өмнө");
  });
});

describe("xoLocale* wrapper (mn)", () => {
  afterEach(() => {
    localStorage.removeItem(XO_LOCALE_STORAGE_KEY);
    vi.restoreAllMocks();
  });

  it("mnTime цаг:минут, секундтэй хувилбар", () => {
    expect(mnTime(sample)).toBe("13:02");
    expect(mnTime(sample, true)).toBe("13:02:54");
    expect(mnTime(morning)).toBe("9:05");
    expect(mnTime(new Date(NaN))).toBe("Invalid Date");
  });

  it("mn үед ICU-гүй гар формат, toLocale* дуудахгүй", () => {
    localStorage.setItem(XO_LOCALE_STORAGE_KEY, "mn");
    const spyString = vi.spyOn(Date.prototype, "toLocaleString");
    const spyDate = vi.spyOn(Date.prototype, "toLocaleDateString");
    const spyTime = vi.spyOn(Date.prototype, "toLocaleTimeString");
    expect(xoLocaleDateTime(sample)).toBe("2026 оны 9-р сарын 7 13:02");
    expect(xoLocaleDateTime(sample, undefined, { dateStyle: "medium", timeStyle: "short" })).toBe("2026 оны 9-р сарын 7 13:02");
    expect(xoLocaleDateTime(sample, "en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })).toBe("2026 оны 9-р сарын 7 13:02:54");
    expect(xoLocaleDate(sample)).toBe("2026 оны 9-р сарын 7");
    expect(xoLocaleDate(sample, undefined, { month: "short", day: "numeric" })).toBe("9-р сарын 7");
    expect(xoLocaleDate(sample, "en-US", { year: "numeric", month: "short", day: "numeric" })).toBe("2026 оны 9-р сарын 7");
    expect(xoLocaleTime(sample)).toBe("13:02:54");
    expect(xoLocaleTime(sample, [], { hour: "2-digit", minute: "2-digit" })).toBe("13:02");
    expect(xoLocaleTime(sample, undefined, { hour: "2-digit", minute: "2-digit" })).toBe("13:02");
    expect(xoLocaleTime(sample, "en-US", { hour12: false })).toBe("13:02:54");
    expect(xoLocaleTime(morning, "en-US", { hour12: false })).toBe("9:05:04");
    expect(xoLocaleTime(sample, "en-US", { timeStyle: "short" })).toBe("13:02");
    expect(xoLocaleTime(sample, "en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })).toBe("13:02:54");
    expect(spyString).not.toHaveBeenCalled();
    expect(spyDate).not.toHaveBeenCalled();
    expect(spyTime).not.toHaveBeenCalled();
  });

  it("mn үед хүчингүй огноо «Invalid Date»", () => {
    localStorage.setItem(XO_LOCALE_STORAGE_KEY, "mn");
    const bad = new Date(NaN);
    expect(xoLocaleDateTime(bad)).toBe("Invalid Date");
    expect(xoLocaleDate(bad)).toBe("Invalid Date");
    expect(xoLocaleTime(bad)).toBe("Invalid Date");
  });

  it("mn: жилгүй, сартай options → богино огноо+цаг", () => {
    localStorage.setItem(XO_LOCALE_STORAGE_KEY, "mn");
    expect(
      xoLocaleDateTime(sample, undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
    ).toBe("9-р сарын 7 13:02");
    expect(
      xoLocaleDateTime(sample, undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short" }),
    ).toBe("9-р сарын 7 13:02");
  });

  it("mn: dateStyle ба жилтэй options урт хэвээр", () => {
    localStorage.setItem(XO_LOCALE_STORAGE_KEY, "mn");
    expect(xoLocaleDateTime(sample, undefined, { dateStyle: "medium", timeStyle: "short" })).toBe("2026 оны 9-р сарын 7 13:02");
    expect(xoLocaleDateTime(sample, undefined, { year: "numeric", month: "2-digit", day: "2-digit" })).toBe("2026 оны 9-р сарын 7 13:02");
  });

  it("mn: timeZone UTC → UTC огноо", () => {
    localStorage.setItem(XO_LOCALE_STORAGE_KEY, "mn");
    const utcMidnight = new Date("2026-10-13T00:00:00.000Z");
    expect(xoLocaleDate(utcMidnight, undefined, { month: "short", day: "numeric", timeZone: "UTC" })).toBe("10-р сарын 13");
    expect(xoLocaleDateTime(utcMidnight, undefined, { timeZone: "UTC" })).toBe("2026 оны 10-р сарын 13 0:00");
  });

  it("mn: xoZonedDateTime цагийн бүсээр хөрвүүлнэ", () => {
    localStorage.setItem(XO_LOCALE_STORAGE_KEY, "mn");
    expect(xoZonedDateTime(new Date("2026-10-13T06:54:00.000Z"), "Asia/Ulaanbaatar")).toBe("2026 оны 10-р сарын 13 14:54");
  });
});

describe("xoLocale* wrapper (en)", () => {
  afterEach(() => vi.restoreAllMocks());

  it("аргументгүй дуудлага яг хуучнаараа дамжина", () => {
    const spy = vi.spyOn(Date.prototype, "toLocaleString").mockReturnValue("EN-DT");
    expect(xoLocaleDateTime(sample)).toBe("EN-DT");
    expect(spy).toHaveBeenCalledWith();
  });

  it("locales ба options дамжина", () => {
    const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    const spyDate = vi.spyOn(Date.prototype, "toLocaleDateString").mockReturnValue("EN-D");
    const spyTime = vi.spyOn(Date.prototype, "toLocaleTimeString").mockReturnValue("EN-T");
    expect(xoLocaleDate(sample, "en-US", opts)).toBe("EN-D");
    expect(spyDate).toHaveBeenCalledWith("en-US", opts);
    expect(xoLocaleTime(sample, [], { hour: "2-digit" })).toBe("EN-T");
    expect(spyTime).toHaveBeenCalledWith([], { hour: "2-digit" });
    expect(xoLocaleDate(sample, undefined, opts)).toBe("EN-D");
    expect(spyDate).toHaveBeenLastCalledWith(undefined, opts);
  });

  it("en: богино options-ийн дуудлага хэвээр", () => {
    const spy = vi.spyOn(Date.prototype, "toLocaleString");
    const opts = { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" } as const;
    xoLocaleDateTime(sample, undefined, opts);
    expect(spy).toHaveBeenCalledWith(undefined, opts);
  });

  it("en: xoZonedDateTime null буцаана", () => {
    expect(xoZonedDateTime(new Date(), "UTC")).toBeNull();
  });
});
