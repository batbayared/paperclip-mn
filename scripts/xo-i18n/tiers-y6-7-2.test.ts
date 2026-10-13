import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { XO_TRANSFORM_FILES } from "./tiers";
import { transformSource } from "./transform";

function read(rel: string): string {
  return readFileSync(fileURLToPath(new URL(`../../${rel}`, import.meta.url)), "utf8");
}

const CASES: Array<{ file: string; keys: string[] }> = [
  {
    file: "ui/src/components/IssueRow.tsx",
    keys: [
      "Archive",
      "Mark as read",
      "Open {{identifier}}: {{title}}",
      "{{label}} — {{detail}}. Open the source task to act.",
      "{{label}} — open the source task to act.",
    ],
  },
  {
    file: "ui/src/components/task-side-panel/TaskSidePanel.tsx",
    keys: [
      "Tasks",
      "Properties",
      "Could not load all tasks",
      "{{taskCount}} total",
      "Task documents",
      "Recent workspace files",
      "Open a new tab",
    ],
  },
];

describe("Ү6 7.2 T1 файлууд", () => {
  it.each(CASES)("$file T1-д байна, мөрүүдийг барина, гараар үлдэгдэлгүй", ({ file, keys }) => {
    expect(XO_TRANSFORM_FILES).toContain(file);
    const result = transformSource(read(file), file);
    const extracted = result.strings.map((s) => s.key);
    for (const key of keys) expect(extracted).toContain(key);
    expect(result.manual).toEqual([]);
  });
});
