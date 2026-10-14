import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { XO_TRANSFORM_FILES } from "./tiers";
import { transformSource } from "./transform";

function read(rel: string): string {
  return readFileSync(fileURLToPath(new URL(`../../${rel}`, import.meta.url)), "utf8");
}

const FILE = "ui/src/components/BootstrapPendingPage.tsx";

describe("Ү6 7.10 админгүй эхний тохиргооны дэлгэц", () => {
  it("T1-д байна, мөрүүдийг барина, гараар үлдэгдэлгүй", () => {
    expect(XO_TRANSFORM_FILES).toContain(FILE);
    const result = transformSource(read(FILE), FILE);
    const extracted = result.strings.map((s) => s.key);
    for (const key of [
      "Finish setting up this {{brand}}",
      "Run this command on the host that runs {{brand}} to print a one-time first-admin invite URL:",
      "Sign in / Create account",
      "Wrong account? <link>Switch account</link>.",
    ]) {
      expect(extracted).toContain(key);
    }
    expect(result.manual).toEqual([]);
  });
});
