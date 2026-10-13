import { describe, expect, it } from "vitest";
import en from "./en.json";
import mn from "./mn.json";

// Ү6 7.2-т нэмсэн/хэрэглэсэн түлхүүрүүд. Task бүр өөрийн түлхүүрийг доор нэмнэ.
const Y6_7_2_KEYS: string[] = [
  // Task 1
  "System",
  "unknown",
  "Path",
  "Directory",
  "Pattern",
  "Paths",
  "Command",
  "Intent",
];

const enCatalog = en as Record<string, string>;
const mnCatalog = mn as Record<string, string>;

describe("Ү6 7.2 каталог", () => {
  it.each(Y6_7_2_KEYS)("%s: en=key, mn орчуулагдсан", (key) => {
    expect(enCatalog[key]).toBe(key);
    expect(mnCatalog[key]).toBeDefined();
    expect(mnCatalog[key]).not.toBe(key);
  });
});
