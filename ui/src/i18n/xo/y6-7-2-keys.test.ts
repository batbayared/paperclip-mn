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
  // Task 2
  "All categories",
  "My recent tasks",
  "Join requests",
  "Failed runs",
  "All approval statuses",
  "Needs action",
  "Resolved",
  "Create Sub-task",
  // Task 3
  "Blocked · waiting on {{n}} active sub-tasks",
  "Blocked · {{n}} blocker needs attention; {{covered}} covered by active work",
  "Change status (current: {{label}})",
  "Open {{identifier}}: {{title}}",
  "{{label}} — open the source task to act.",
  "Could not load all tasks",
  "{{taskCount}} total",
  "Task documents",
  "Recent workspace files",
  "Open a new tab",
  "Revision {{n}}",
  "Recent files are temporarily unavailable.",
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
