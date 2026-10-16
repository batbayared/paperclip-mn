import { describe, expect, it } from "vitest";
import en from "./en.json";
import keepEn from "./keep-en.json";
import mn from "./mn.json";

// Ү6 7.10-д нэмсэн helper (labels.ts) ба Wave 1 файлуудын гар tx / XoTrans түлхүүрүүд
// (task бүрээс төлөөлөх түлхүүр; T1 transform-ын мөрийг check хамгаална).
const Y6_7_10_KEYS: string[] = [
  // Task 1: labels.ts, attention/decision
  "{{brand}} bundled",
  "{{brand}} workspace",
  "{{brand}}'s read-only default harness instructions for Skills Studio runs.",
  "Initial version",
  "Selection confirmation requested",
  "Questions need answers",
  // Task 3: pipeline тохиргоо
  "Parent: {{pipelineName}}",
  "Grandparent: {{pipelineName}}",
  "Ancestor {{depth}}: {{pipelineName}}",
  "Stage",
  "Items wait here while work happens. An agent or a person moves them forward.",
  "The final step. Items that reach here are finished.",
  // Task 4: workspace дэлгэрэнгүй, чадварын багц
  "Update {{label}} to the newest default?",
  "Reset {{label}} to the shipped default?",
  "Reset {{label}}",
  "You've edited this. Your changes are kept until you reset.",
  "XO shipped a newer default.",
  // Task 5: frontmatter
  "{{n}} issue",
  "{{n}} issues",
  "Metadata key {{n}}",
  "SKILL.md needs a name.",
  "Use lowercase letters, numbers and hyphens.",
  // Task 6: орчны хувьсагч
  "Bind {{name}}",
  "Edited: {{names}}",
  "Add variable",
  "Browse secrets",
  "Create & bind",
  "this variable",
  // Task 7: routine-ийн үлдэгдэл
  "replay {{seconds}}s",
  "{{n}} active",
  "Next fire {{time}}",
  "Not scheduled",
  "No runs yet",
  // Task 8: репозитор, сонгогч
  "Remove {{fullName}}",
  "No responsible found.",
  "Search models...",
  "No models found.",
  // Task 11: pipeline item-ийн үйл явдал, харьцангуй цаг
  "Finished {{time}}",
  "Started {{time}}",
  "Queued {{time}}",
  "never",
  "Item added.",
  "Stage automation re-run requested.",
  "Moved to another stage",
];

const PLACEHOLDER = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;
function placeholders(s: string): string[] {
  return [...s.matchAll(PLACEHOLDER)].map((m) => m[1]).sort();
}

const MN = mn as Record<string, string>;
const EN = en as Record<string, string>;
const KEEP = new Set(keepEn as string[]);

describe("Ү6 7.10 каталогийн түлхүүрүүд", () => {
  it("en ба mn-д бүгд байна, en утга = түлхүүр", () => {
    for (const key of Y6_7_10_KEYS) {
      expect(en, `en: ${key}`).toHaveProperty([key]);
      expect(mn, `mn: ${key}`).toHaveProperty([key]);
      expect(EN[key], key).toBe(key);
    }
  });

  it("mn утга орчуулагдсан", () => {
    for (const key of Y6_7_10_KEYS) {
      if (KEEP.has(key)) continue;
      expect(MN[key], key).not.toBe(EN[key]);
    }
  });

  it("placeholder en/mn ижил", () => {
    for (const key of Y6_7_10_KEYS) {
      const enPh = placeholders(key).filter((p) => p !== "count");
      const mnPh = placeholders(MN[key] ?? "").filter((p) => p !== "count");
      expect(mnPh, key).toEqual(enPh);
    }
  });

  it("mn утгад «Paperclip» литерал байхгүй", () => {
    const offenders = Object.entries(MN)
      .filter(([, value]) => value.includes("Paperclip"))
      .map(([key]) => key);
    expect(offenders).toEqual([]);
  });

  it("нэр томьёо: stage «үе шат», pipeline «пайплайн», Board «Удирдах зөвлөл»", () => {
    expect(MN["Stage"]).toBe("Үе шат");
    expect(MN["Moved to another stage"]).toContain("үе шат");
    expect(MN["Stage automation re-run requested."]).toMatch(/^Үе шат/);
    expect(MN["Pipeline name"]).toContain("Пайплайн");
    expect(MN["Not scheduled"]).toBe("Товлоогүй");
    const bareStage = Object.entries(MN)
      .filter(([key]) => /\bstages?\b/i.test(key))
      .filter(([, value]) => /(^|[^а-яёөү])[Шш]ат/.test(value.replace(/[Үү]е шат/g, "")))
      .map(([key]) => key);
    expect(bareStage).toEqual([]);
    const tuz = Object.entries(MN)
      .filter(([, value]) => value.includes("ТУЗ"))
      .map(([key]) => key);
    expect(tuz).toEqual([]);
  });
});
