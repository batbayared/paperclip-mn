import { describe, expect, it } from "vitest";
import en from "./en.json";
import keepEn from "./keep-en.json";
import mn from "./mn.json";

// Ү6 7.11-д нэмсэн helper (labels.ts), activity үйл үг ба Wave 1 файлуудын төлөөлөх түлхүүрүүд
// (T1 transform-ын мөрийг check хамгаална).
const Y6_7_11_KEYS: string[] = [
  // Task 1: labels.ts helper-ууд
  "Created routine",
  "Updated routine",
  "Created {{kind}} trigger",
  "Restored from revision {{number}}",
  "Bundled {{brand}} skills are read-only.",
  "This skill source is read-only.",
  "Plan approval - {{title}}",
  // Task 2: activity үйл үг, actor
  "created routine",
  "ran routine",
  "created skill",
  "forked skill",
  "imported skills",
  "Board",
  "System",
  "Unknown",
  // Task 3: хянах самбар
  "No active or recent agent runs.",
  "View all runs",
  "Scheduled heartbeat",
  "recovered: {{count}} (retry succeeded)",
  "All paths passing",
  "Run one from the Smoke Lab tab",
  // Task 4: холболтын тохиргоо, төлөвлөгөөний задаргаа
  "Connect an app",
  "Couldn’t finish setup",
  "{{brand}} couldn’t start secure sign-in. Try again.",
  "Use an existing connection",
  "Plan decomposition",
  "Owner: {{ownerName}}",
  "Idempotent claim",
  // Task 7: аудит
  "Agent Actions",
  "Export CSV",
  "All responsible users",
  "Recorded by {{brand}} — entries can't be edited. Sensitive values are never stored.",
  "released an environment lease",
];

const PLACEHOLDER = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;
function placeholders(s: string): string[] {
  return [...s.matchAll(PLACEHOLDER)].map((m) => m[1]).sort();
}

const MN = mn as Record<string, string>;
const EN = en as Record<string, string>;
const KEEP = new Set(keepEn as string[]);

describe("Ү6 7.11 каталогийн түлхүүрүүд", () => {
  it("en ба mn-д бүгд байна, en утга = түлхүүр", () => {
    for (const key of Y6_7_11_KEYS) {
      expect(en, `en: ${key}`).toHaveProperty([key]);
      expect(mn, `mn: ${key}`).toHaveProperty([key]);
      expect(EN[key], key).toBe(key);
    }
  });

  it("mn утга орчуулагдсан", () => {
    for (const key of Y6_7_11_KEYS) {
      if (KEEP.has(key)) continue;
      expect(MN[key], key).not.toBe(EN[key]);
    }
  });

  it("placeholder en/mn ижил", () => {
    for (const key of Y6_7_11_KEYS) {
      const enPh = placeholders(key).filter((p) => p !== "count");
      const mnPh = placeholders(MN[key] ?? "").filter((p) => p !== "count");
      expect(mnPh, key).toEqual(enPh);
    }
  });

  it("нэр томьёо: Board «Удирдах зөвлөл», Idempotent Латинаар", () => {
    expect(MN["Board"]).toBe("Удирдах зөвлөл");
    expect(MN["Idempotent claim"]).toBe("Idempotent баталгаа");
  });
});
