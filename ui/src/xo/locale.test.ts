import { afterEach, describe, expect, it, vi } from "vitest";
import { localeTag, resolveLocale, XO_LOCALE_STORAGE_KEY } from "./locale";

describe("resolveLocale", () => {
  afterEach(() => {
    localStorage.removeItem(XO_LOCALE_STORAGE_KEY);
    vi.unstubAllEnvs();
  });

  it("uses the test default when nothing is stored", () => {
    expect(resolveLocale()).toBe("en");
  });

  it("prefers the stored locale", () => {
    localStorage.setItem(XO_LOCALE_STORAGE_KEY, "mn");
    expect(resolveLocale()).toBe("mn");
  });

  it("ignores an unknown stored value", () => {
    localStorage.setItem(XO_LOCALE_STORAGE_KEY, "fr");
    expect(resolveLocale()).toBe("en");
  });

  it("uses VITE_XO_DEFAULT_LOCALE when nothing is stored", () => {
    vi.stubEnv("VITE_XO_DEFAULT_LOCALE", "mn");
    expect(resolveLocale()).toBe("mn");
  });

  it("falls back to mn when the env value is empty", () => {
    vi.stubEnv("VITE_XO_DEFAULT_LOCALE", "");
    expect(resolveLocale()).toBe("mn");
  });
});

describe("localeTag", () => {
  it("maps locales to BCP 47 tags", () => {
    expect(localeTag("mn")).toBe("mn-MN");
    expect(localeTag("en")).toBe("en-US");
  });
});
