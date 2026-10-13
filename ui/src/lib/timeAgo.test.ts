import { afterEach, describe, expect, it } from "vitest";
import { XO_LOCALE_STORAGE_KEY } from "@/xo/locale";
import { timeAgo } from "./timeAgo";

afterEach(() => {
  localStorage.removeItem(XO_LOCALE_STORAGE_KEY);
});

describe("timeAgo", () => {
  it("keeps the English short form in en", () => {
    expect(timeAgo(new Date(Date.now() - 300_000))).toBe("5m ago");
  });

  it("uses the Mongolian form in mn", () => {
    localStorage.setItem(XO_LOCALE_STORAGE_KEY, "mn");
    expect(timeAgo(new Date(Date.now() - 300_000))).toBe("5 мин өмнө");
  });
});
