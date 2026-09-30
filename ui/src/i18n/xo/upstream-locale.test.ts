import { describe, expect, it } from "vitest";

import { validateLocaleMessages } from "../locale-validation";
import { supportedLocales } from "../locales";
import en from "../locales/en.json";
import mn from "../locales/mn.json";

describe("upstream mn locale", () => {
  it("is registered", () => {
    expect(supportedLocales).toContain("mn");
  });

  it("mirrors en.json keys and placeholders", () => {
    expect(validateLocaleMessages(mn, en)).toEqual([]);
  });
});
