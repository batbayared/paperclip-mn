import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { XO_TRANSFORM_FILES } from "./tiers";
import { transformSource } from "./transform";

function read(rel: string): string {
  return readFileSync(fileURLToPath(new URL(`../../${rel}`, import.meta.url)), "utf8");
}

const CASES: Array<{ file: string; keys: string[] }> = [
  { file: "ui/src/lib/issue-monitor.ts", keys: ["in {{duration}}", "due now", "overdue by {{duration}}", "{{duration}} ago", "{{h}}h {{m}}m"] },
  { file: "ui/src/components/issue-properties/IssueProperties.tsx", keys: ["Pending schedule", "Retry {{relative}}", "checking momentarily…"] },
];

describe("Ү6 7.16 T1 файлууд (7.15-ын үлдэгдэл)", () => {
  it.each(CASES)("$file T1-д байна, мөрүүдийг барина, гараар үлдэгдэлгүй", ({ file, keys }) => {
    expect(XO_TRANSFORM_FILES).toContain(file);
    const result = transformSource(read(file), file);
    const extracted = result.strings.map((s) => s.key);
    for (const key of keys) expect(extracted).toContain(key);
    expect(result.manual).toEqual([]);
  });
});
