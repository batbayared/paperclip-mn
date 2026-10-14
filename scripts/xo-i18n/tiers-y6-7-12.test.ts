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
    file: "ui/src/components/DevRestartBanner.tsx",
    keys: [
      "Restart Required",
      "Restart Paperclip now?",
      "{{n}} live runs",
      "Restart <code>pnpm dev:once</code> after the active work is safe to interrupt",
    ],
  },
  {
    file: "ui/src/components/IssueRunLedger.tsx",
    keys: ["+{{n}} more", "{{n}} older items not shown"],
  },
];

describe("Ү6 7.12 T1 файлууд (dev баннер, гүйлтийн бүртгэлийн үлдэгдэл)", () => {
  it.each(CASES)("$file T1-д байна, мөрүүдийг барина, гараар үлдэгдэлгүй", ({ file, keys }) => {
    expect(XO_TRANSFORM_FILES).toContain(file);
    const result = transformSource(read(file), file);
    const extracted = result.strings.map((s) => s.key);
    for (const key of keys) expect(extracted).toContain(key);
    expect(result.manual).toEqual([]);
  });
});
