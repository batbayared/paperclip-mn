import { afterEach, describe, expect, it } from "vitest";
import { i18n } from "@/i18n";
import { tx } from "@/i18n/xo";

import { nextWorkMode, titleForPendingWorkMode, workModeMetaList } from "./work-mode-meta";

afterEach(async () => {
  await i18n.changeLanguage("en");
});

describe("work mode metadata", () => {
  it("orders issue work modes as auto, planning, then ask", () => {
    expect(workModeMetaList().map((mode) => mode.value)).toEqual(["standard", "planning", "ask"]);
    expect(workModeMetaList().map((mode) => mode.label)).toEqual(["Auto mode", "Plan mode", "Ask mode"]);
  });

  it("cycles issue work modes as auto, planning, ask, then auto", () => {
    expect(nextWorkMode("standard")).toBe("planning");
    expect(nextWorkMode("planning")).toBe("ask");
    expect(nextWorkMode("ask")).toBe("standard");
  });

  it("uses graduated tooltip copy", () => {
    expect(titleForPendingWorkMode("standard")).toBe("Auto mode for this submission. Click to change.");
    expect(titleForPendingWorkMode("planning")).toBe("Plan mode is on for this submission. Click to change.");
    expect(titleForPendingWorkMode("ask")).toBe(
      "Ask mode for this submission. Click to change. The responsible will answer in this thread; no implementation work.",
    );
  });

  it("translates pending work mode tooltips in mn", async () => {
    await i18n.changeLanguage("mn");
    expect(titleForPendingWorkMode("standard")).toBe("Энэ илгээлтэд авто горим. Солихын тулд дарна уу.");
    expect(titleForPendingWorkMode("planning")).toBe("Энэ илгээлтэд төлөвлөх горим идэвхтэй. Солихын тулд дарна уу.");
    expect(titleForPendingWorkMode("ask")).toBe(
      "Энэ илгээлтэд асуух горим. Солихын тулд дарна уу. Хариуцагч энэ урсгалд хариулна; хэрэгжүүлэх ажил хийхгүй.",
    );
    expect(workModeMetaList().map((mode) => tx(mode.label))).toEqual(["Авто горим", "Төлөвлөх горим", "Асуух горим"]);
  });
});
