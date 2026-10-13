import { describe, expect, it } from "vitest";
import en from "./en.json";
import mn from "./mn.json";

// Ү6 7.3-т нэмсэн/хэрэглэсэн түлхүүрүүд. Task бүр өөрийн түлхүүрийг доор нэмнэ.
const Y6_7_3_KEYS: string[] = [
  // Task 2
  "Reappears {{date}}",
  "Reappears {{when}}",
  "soon",
  "in {{n}}m",
  "in {{n}}h",
  "in {{n}}d",
  "{{n}}m ago",
  "Next: {{dates}}.",
  "Next: {{date}}",
  "{{frames}} frames · {{bytes}} bytes · expires {{date}}",
  "This run requested sensitive provider-frame capture.",
  "{{frames}} frames · {{bytes}} · expires {{date}}",
  "Resets {{date}}",
  "resets {{date}}",
  "Updated {{date}}",
  "Promoted from low-trust on {{date}}.",
  "Promoted from low-trust.",
  "Authored by a low-trust review agent. Raw {{artifact}} is not auto-shared with higher-trust agents.",
  "Snoozed until {{date}}",
  // Task 3
  "{{n}}s ago",
  "{{n}}h ago",
  "{{n}}d ago",
  "Last checked: {{time}}",
  "Default ref",
  "{{from}} to {{to}}",
  "window capped",
  "Request details",
  "Source IP {{ip}}",
  "Last mail check: {{value}}",
  "Not checked yet",
  // Task 4
  "Parent Task",
  "Decide now",
  "New today",
  "Tool: {{name}}",
  "Args:",
  "Result:",
  // Task 5
  "Skipped — no activity since last run",
  "Skipped — routine paused",
  "Skipped — worktree execution cutoff",
  "Markdown",
  "Executing command",
  "Tool failed",
  "Waiting for result",
  "Failed with exit code {{code}}",
  "Needs approval",
  "Denied",
  "Timed out",
  "Approved",
  "Executed",
  "Verified from workspace",
  "Reported by harness",
  "Errored",
  "Executed command",
  "Collapse tool details",
  "Expand tool details",
  "Collapse command details",
  "Expand command details",
  "Collapse stdout",
  "Expand stdout",
  "Action request {{id}}",
  "Executed {{total}} commands",
  "Command failed",
  "Decision",
  "Effective",
  "Requested",
  "Provider-reported",
  "Streaming",
  "action {{status}}",
  "audit {{length}}",
  "card",
  "file reference",
  "invocation",
  "result · {{disposition}}",
  "runtime {{requestType}}",
  "workspace changes",
  "workspace diff",
  // Task 6
  "Answer details were not recorded by this older runtime.",
];

// mn утга нь англитай ижил байж болох түлхүүрүүд (оноосон нэр).
const SAME_IN_MN = new Set<string>(["Markdown"]);

const PLACEHOLDER = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;
function placeholders(s: string): string[] {
  return [...s.matchAll(PLACEHOLDER)].map((m) => m[1]).sort();
}

describe("Ү6 7.3 каталогийн түлхүүрүүд", () => {
  it("en ба mn-д бүгд байна", () => {
    for (const key of Y6_7_3_KEYS) {
      expect(en, `en: ${key}`).toHaveProperty([key]);
      expect(mn, `mn: ${key}`).toHaveProperty([key]);
    }
  });

  it("mn утга орчуулагдсан", () => {
    for (const key of Y6_7_3_KEYS) {
      if (SAME_IN_MN.has(key)) continue;
      expect((mn as Record<string, string>)[key], key).not.toBe((en as Record<string, string>)[key]);
    }
  });

  it("placeholder en/mn ижил", () => {
    for (const key of Y6_7_3_KEYS) {
      expect(placeholders((mn as Record<string, string>)[key] ?? ""), key).toEqual(placeholders(key));
    }
  });
});
