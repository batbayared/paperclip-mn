import { describe, expect, it } from "vitest";

import { validateLocaleMessages } from "../locale-validation";
import en from "./en.json";
import mn from "./mn.json";

describe("XO толь (xo namespace)", () => {
  it("mn.json нь en.json-тэй түлхүүр ба {{placeholder}}-оор тэнцүү", () => {
    expect(validateLocaleMessages(mn, en)).toEqual([]);
  });

  it("en.json-ийн утга нь түлхүүртэйгээ тэнцүү (plural _one/_other-оос бусад)", () => {
    const mismatched = Object.entries(en).filter(
      ([key, value]) => !/_(one|other)$/.test(key) && value !== key,
    );
    expect(mismatched).toEqual([]);
  });
});
