import { describe, expect, it } from "vitest";
import { XO_TRANSFORM_FILES } from "./tiers";

describe("Ү6 7.3 T1 нэмэлт", () => {
  it("RunTranscriptView T1-д байна", () => {
    expect(XO_TRANSFORM_FILES).toContain("ui/src/components/transcript/RunTranscriptView.tsx");
  });
});
