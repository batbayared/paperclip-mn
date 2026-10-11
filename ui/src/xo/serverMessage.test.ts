import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { XO_LOCALE_STORAGE_KEY } from "./locale";
import { translateServerMessage } from "./serverMessage";

describe("translateServerMessage", () => {
  beforeEach(() => localStorage.setItem(XO_LOCALE_STORAGE_KEY, "mn"));
  afterEach(() => localStorage.removeItem(XO_LOCALE_STORAGE_KEY));

  it("translates an exact message", () => {
    expect(translateServerMessage("Issue not found")).toBe("Ажил олдсонгүй");
  });

  it("translates a templated message and keeps the value", () => {
    expect(translateServerMessage('A company skill with slug "seo-audit" already exists.')).toBe(
      '"seo-audit" slug-тай компанийн skill аль хэдийн байна.',
    );
  });

  it("returns unknown messages unchanged", () => {
    expect(translateServerMessage("Something only upstream says")).toBe("Something only upstream says");
  });

  it("returns the original when the locale is en", () => {
    localStorage.setItem(XO_LOCALE_STORAGE_KEY, "en");
    expect(translateServerMessage("Issue not found")).toBe("Issue not found");
  });
});
