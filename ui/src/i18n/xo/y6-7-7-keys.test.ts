import { describe, expect, it } from "vitest";
import en from "./en.json";
import mn from "./mn.json";

// Ү6 7.7-д нэмсэн helper ба T1 биш файлын гар tx түлхүүрүүд (scratch t1, t5, t6-аас; T1 файлын мөрийг check хамгаална).
const Y6_7_7_KEYS: string[] = [
  "Last 7 days",
  "This month",
  "Type",
  "Severity",
  "Newest first",
  "Oldest first",
  "Tomorrow",
  "{{count}} option",
  "{{count}} options",
  "{{count}} question",
  "{{count}} questions",
  "{{count}} suggested task",
  "{{count}} suggested tasks",
  "{{count}} item to verdict",
  "{{count}} items to verdict",
  "Blocked by {{identifier}} {{title}}",
  "Blocked by {{title}}",
  "Blocked by {{identifier}}",
  "{{percent}}% of budget used (${{observed}} / ${{limit}})",
  "Local trusted",
  "Authenticated private",
  "Authenticated public",
  "Authenticated {{exposure}}",
  "{{count}} decided",
  "{{count}} approved",
  "{{count}} rejected",
  "{{count}} deferred",
  "Verdicts expired after comment",
  "Verdicts expired after target changed",
  "Verdicts expired",
  "Skipped interaction",
  "Withdrawn interaction",
  "Expired when issue closed",
  "Cancelled when addressee was deleted",
  "Accepted {{created}} of {{total}} tasks",
  "Accepted 1 task",
  "Accepted {{count}} tasks",
  "Rejected 1 task",
  "Rejected {{count}} tasks",
  "Suggested 1 task",
  "Suggested {{count}} tasks",
  "Confirmed request",
  "Selected “{{label}}”",
  "Declined request",
  "Confirmation expired after comment",
  "Confirmation expired after target changed",
  "Confirmation expired",
  "Requested confirmation",
  "Confirmed 1 of {{total}} options",
  "Confirmed {{selected}} of {{total}} options",
  "Declined selection",
  "Selection expired after comment",
  "Selection expired after target changed",
  "Selection expired",
  "Requested a selection from 1 option",
  "Requested a selection from {{count}} options",
  "{{serviceName}} connected",
  "{{serviceName}} declined",
  "{{serviceName}} request superseded",
  "{{serviceName}} request expired",
  "Connect {{serviceName}}",
  "Answered 1 question",
  "Answered {{count}} questions",
  "Cancelled 1 question",
  "Cancelled {{count}} questions",
  "Question expired after comment",
  "Questions expired after comment",
  "Question expired",
  "Asked 1 question",
  "Asked {{count}} questions",
  "Other: {{text}}",
  "You are not in this card's resolver audience.",
  "You do not have permission to respond to this card.",
  "This request is no longer waiting for a decision.",
  "{{reason}} Try again.",
  "Couldn't submit. Try again.",
];

const PLACEHOLDER = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;
function placeholders(s: string): string[] {
  return [...s.matchAll(PLACEHOLDER)].map((m) => m[1]).sort();
}

const MN = mn as Record<string, string>;
const EN = en as Record<string, string>;

describe("Ү6 7.7 каталогийн түлхүүрүүд", () => {
  it("en ба mn-д бүгд байна", () => {
    for (const key of Y6_7_7_KEYS) {
      expect(en, `en: ${key}`).toHaveProperty([key]);
      expect(mn, `mn: ${key}`).toHaveProperty([key]);
    }
  });

  it("mn утга орчуулагдсан", () => {
    for (const key of Y6_7_7_KEYS) {
      expect(MN[key], key).not.toBe(EN[key]);
    }
  });

  it("placeholder en/mn ижил", () => {
    for (const key of Y6_7_7_KEYS) {
      expect(placeholders(MN[key] ?? ""), key).toEqual(placeholders(key));
    }
  });

  it("mn утгад «Paperclip» литерал байхгүй", () => {
    const offenders = Object.entries(MN)
      .filter(([, value]) => value.includes("Paperclip"))
      .map(([key]) => key);
    expect(offenders).toEqual([]);
  });
});
