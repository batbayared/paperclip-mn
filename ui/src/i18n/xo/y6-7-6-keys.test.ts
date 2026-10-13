import { describe, expect, it } from "vitest";
import en from "./en.json";
import mn from "./mn.json";

// Ү6 7.6-д нэмсэн helper ба T1 биш файлын гар tx түлхүүрүүд (scratch t1–t7-аас; T1 файлын мөрийг check хамгаална).
const Y6_7_6_KEYS: string[] = [
  "Decision requested",
  "Join request",
  "Recovery",
  "Task",
  "Blocked dependency",
  "Agent error",
  "1 hour",
  "4 hours",
  "Tomorrow morning",
  "Next week",
  "routines",
  "skills",
  "Choose options",
  "Review items",
  "Connect service",
  "Folder name is required.",
  "Folder name cannot contain slashes.",
  "Value set",
  "{{configured}} of {{total}} set",
  "{{n}} secret",
  "{{n}} secrets",
  "{{n}} folder",
  "{{n}} folders",
  "folders",
  "flat",
  "Open {{label}}",
  "Open plan",
  "Open plan revision {{revision}}",
  "{{selected}} selected · choose {{minimum}}–{{maximum}}",
  "{{selected}} selected · at least {{minimum}}",
  "{{selected}} selected",
  "{{selected}} of {{total}} selected",
];

// mn утга нь англитай ижил байж болох түлхүүрүүд (оноосон нэр).
const SAME_IN_MN = new Set<string>([]);

// Task 8-ын каталогийн нэр томьёоны засварууд.
const GOVERNANCE_KEY =
  "Resolved by an agent under the organization's interaction governance policy — audit-distinct from a human board resolution.";
const RUNTIME_CONFIG_KEY =
  "Project workspaces need a working directory before local commands can run, and services also need runtime config.";
const ADVANCED_RUNTIME_KEY = "Advanced runtime JSON";

const PLACEHOLDER = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;
function placeholders(s: string): string[] {
  return [...s.matchAll(PLACEHOLDER)].map((m) => m[1]).sort();
}

const MN = mn as Record<string, string>;
const EN = en as Record<string, string>;

describe("Ү6 7.6 каталогийн түлхүүрүүд", () => {
  it("en ба mn-д бүгд байна", () => {
    for (const key of Y6_7_6_KEYS) {
      expect(en, `en: ${key}`).toHaveProperty([key]);
      expect(mn, `mn: ${key}`).toHaveProperty([key]);
    }
  });

  it("mn утга орчуулагдсан", () => {
    for (const key of Y6_7_6_KEYS) {
      if (SAME_IN_MN.has(key)) continue;
      expect(MN[key], key).not.toBe(EN[key]);
    }
  });

  it("placeholder en/mn ижил", () => {
    for (const key of Y6_7_6_KEYS) {
      expect(placeholders(MN[key] ?? ""), key).toEqual(placeholders(key));
    }
  });

  it("удирдлага ба ажиллах орчны нэр томьёо", () => {
    expect(MN[GOVERNANCE_KEY]).toContain("удирдлагын");
    expect(MN[GOVERNANCE_KEY]).not.toContain("засаглал");
    expect(MN[RUNTIME_CONFIG_KEY]).toContain("ажиллах орчны тохиргоо");
    expect(MN[RUNTIME_CONFIG_KEY]).not.toContain("runtime");
    expect(MN[ADVANCED_RUNTIME_KEY]).toBe("Ажиллах орчны нарийвчилсан JSON");
  });

  it("mn утгад «Paperclip» литерал байхгүй", () => {
    const offenders = Object.entries(MN)
      .filter(([, value]) => value.includes("Paperclip"))
      .map(([key]) => key);
    expect(offenders).toEqual([]);
  });
});
