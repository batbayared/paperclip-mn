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
    file: "ui/src/components/DecisionsToolbar.tsx",
    keys: ["{{count}} decision", "Filter", "No workspace"],
  },
  {
    file: "ui/src/components/DecisionDateChips.tsx",
    keys: ["Custom", "From", "To"],
  },
  {
    file: "ui/src/components/DecisionQueueRail.tsx",
    keys: ["Decision queues", "Recent activity"],
  },
  {
    file: "ui/src/components/DecisionTriageStrip.tsx",
    keys: ["Expires in {{hrs}}h", "Asked {{name}} for a recommendation", "Snoozed until {{date}}", "New queue…"],
  },
  {
    file: "ui/src/pages/DecisionQueuePage.tsx",
    keys: ["Auto-seeding is on", "Auto-seeding is off", "Removed from queue", "This queue is empty."],
  },
  {
    file: "ui/src/components/DecisionShelf.tsx",
    keys: ["Kept on desk", "Idle {{count}} day", "Keep on desk"],
  },
];

describe("Ү6 7.7 T1 файлууд", () => {
  it.each(CASES)("$file T1-д байна, мөрүүдийг барина, гараар үлдэгдэлгүй", ({ file, keys }) => {
    expect(XO_TRANSFORM_FILES).toContain(file);
    const result = transformSource(read(file), file);
    const extracted = result.strings.map((s) => s.key);
    for (const key of keys) expect(extracted).toContain(key);
    expect(result.manual).toEqual([]);
  });
});
