import { afterEach, describe, expect, it } from "vitest";
import { i18n } from "@/i18n";
import { tx } from "@/i18n/xo";
import en from "./en.json";
import keepEn from "./keep-en.json";
import mn from "./mn.json";

// Ү6 7.8-д нэмсэн helper (labels.ts) ба T1 файлуудын гар tx / XoTrans түлхүүрүүд (Wave 0–1 commit-уудаас;
// T1 transform-ын мөрийг check хамгаална).
const Y6_7_8_KEYS: string[] = [
  "Missing {{refs}}",
  "Routine",
  "Show {{n}} older…",
  "Restore this revision",
  "Saved {{time}} by {{actor}}",
  "enabled",
  "disabled",
  "board",
  "agent",
  "system",
  "Unassigned",
  "No project",
  "{{first}} and {{second}}",
  "{{items}}, and {{last}}",
  "{{n}} key",
  "{{n}} keys",
  "{{n}} secret ref",
  "{{n}} secret refs",
  "{{n}} key added",
  "{{n}} keys added",
  "{{n}} key removed",
  "{{n}} keys removed",
  "{{n}} key changed",
  "{{n}} keys changed",
  "Env added ({{key}})",
  "Env removed ({{key}})",
  "Env {{key}} binding kind",
  "Env {{key}} secret",
  "Env {{key}} version",
  "Env {{key}} value",
  "(none)",
  "Trigger removed ({{name}})",
  "Trigger added ({{name}})",
  "Trigger {{name}}",
  "Search agents...",
  "No agents found.",
  "Search projects...",
  "No projects found.",
  "Trigger: {{name}}",
  "No variables yet. Add a {{token}} in the title or instructions to create one.",
  "Run",
  "runs immediately",
  "if the previous run is still active",
  "Every day at {{time}}",
  "Every weekday at {{time}}",
  "Every weekend at {{time}}",
  "Every {{day}} at {{time}}",
  "Every {{days}} and {{last}} at {{time}}",
  "Every {{n}} minutes",
  "Every {{n}} hours at :{{mm}}",
  "Every hour at :{{mm}}",
  "Day {{n}} of every month at {{time}}",
  "Webhook URL copied",
  "Webhook secret copied",
  "Failed to copy webhook url",
  "Failed to copy webhook secret",
  "Moved \"{{title}}\" to {{folder}}.",
  "Moved \"{{title}}\" to folder.",
  "Overview",
  "Schedule",
  "Variables",
  "Secrets",
  "Delivery",
  "Runs",
  "Activity",
  "Version history",
  "schedule",
  "webhook",
  "none",
  "Expect a shared bearer token in the Authorization header.",
  "Expect an HMAC SHA-256 signature over the request using the shared secret.",
  "Accept GitHub-style X-Hub-Signature-256 header (HMAC over raw body, no timestamp).",
  "No authentication — the webhook URL itself acts as a shared secret.",
  "queued",
  "would be coalesced",
  "would be skipped",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "the title",
  "the description",
  "the project",
  "the default agent",
  "the priority",
  "the concurrency policy",
  "the catch-up policy",
  "the advanced run policy",
  "the activity gate scope",
  "the variables",
  "the secrets",
  "the routine",
  "Title",
  "Priority",
  "Status",
  "Default agent",
  "Project",
  "Concurrency",
  "Catch-up",
  "Env",
  "Detected from `<ph/>` placeholders in the title and instructions.",
  "Use `<ph/>` placeholders in the title or instructions to prompt for inputs when the routine runs.",
  "Type <code/> anywhere in the title or instructions. {{brand}} detects each placeholder, lists it under <variables>Variables</variables>, and prompts for a value before each run.",
  "Variables are auto-detected from <code/> in the title & instructions. The variable name is read-only — rename by editing the placeholder.",
  "Routine secrets apply to every task this routine creates. They override matching keys in project and agent env. <mono>{{prefix}}</mono> names are reserved.",
];

const PLACEHOLDER = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;
function placeholders(s: string): string[] {
  return [...s.matchAll(PLACEHOLDER)].map((m) => m[1]).sort();
}
function baseKey(key: string): string {
  return key.replace(/_(one|other)$/, "");
}

const MN = mn as Record<string, string>;
const EN = en as Record<string, string>;
const KEEP = new Set(keepEn as string[]);

afterEach(async () => {
  await i18n.changeLanguage("en");
});

describe("Ү6 7.8 каталогийн түлхүүрүүд", () => {
  it("en ба mn-д бүгд байна", () => {
    for (const key of Y6_7_8_KEYS) {
      expect(en, `en: ${key}`).toHaveProperty([key]);
      expect(mn, `mn: ${key}`).toHaveProperty([key]);
    }
  });

  it("mn утга орчуулагдсан", () => {
    for (const key of Y6_7_8_KEYS) {
      if (KEEP.has(key)) continue;
      expect(MN[key], key).not.toBe(EN[key]);
    }
  });

  it("placeholder en/mn ижил", () => {
    for (const key of Y6_7_8_KEYS) {
      const enPh = placeholders(baseKey(key)).filter((p) => p !== "count");
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

  it("литерал хаалт: en render «{{placeholder}}»-ийг байт ижил хадгална", async () => {
    await i18n.changeLanguage("en");
    expect(
      tx("No variables yet. Add a {{token}} in the title or instructions to create one.", {
        token: "{{placeholder}}",
      }),
    ).toBe("No variables yet. Add a {{placeholder}} in the title or instructions to create one.");
  });

  it("литерал хаалт: mn render «{{placeholder}}»-ийг хадгална", async () => {
    await i18n.changeLanguage("mn");
    const out = tx("No variables yet. Add a {{token}} in the title or instructions to create one.", {
      token: "{{placeholder}}",
    });
    expect(out).toContain("{{placeholder}}");
    expect(out).not.toContain("No variables yet");
  });
});
