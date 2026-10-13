import { afterEach, describe, expect, it } from "vitest";
import { i18n } from "@/i18n";
import {
  calledToolsWords,
  compactDuration,
  hoursWords,
  minutesWords,
  ranCommandsWords,
  secondsWords,
  toolsCountWords,
} from "./run-text";

afterEach(async () => {
  await i18n.changeLanguage("en");
});

describe("compactDuration", () => {
  it("хязгаарын утгуудыг en дээр зөв форматлана", () => {
    expect(compactDuration(0)).toBeUndefined();
    expect(compactDuration(-5)).toBeUndefined();
    expect(compactDuration(Number.NaN)).toBeUndefined();
    expect(compactDuration(400)).toBe("1s");
    expect(compactDuration(38_000)).toBe("38s");
    expect(compactDuration(59_600)).toBe("1m");
    expect(compactDuration(60_000)).toBe("1m");
    expect(compactDuration(125_000)).toBe("2m 5s");
  });

  it("mn дээр орчуулна", async () => {
    await i18n.changeLanguage("mn");
    expect(compactDuration(38_000)).toBe("38 сек");
    expect(compactDuration(120_000)).toBe("2 мин");
    expect(compactDuration(125_000)).toBe("2 мин 5 сек");
  });
});

describe("тоо ширхэгийн үгс", () => {
  it("en дээр ганц ба олон тоог ялгана", () => {
    expect(secondsWords(1)).toBe("1 second");
    expect(secondsWords(2)).toBe("2 seconds");
    expect(minutesWords(1)).toBe("1 minute");
    expect(minutesWords(5)).toBe("5 minutes");
    expect(hoursWords(1)).toBe("1 hour");
    expect(hoursWords(3)).toBe("3 hours");
    expect(ranCommandsWords(1)).toBe("ran 1 command");
    expect(ranCommandsWords(4)).toBe("ran 4 commands");
    expect(calledToolsWords(1)).toBe("called 1 tool");
    expect(calledToolsWords(2)).toBe("called 2 tools");
    expect(toolsCountWords(1)).toBe("1 tool");
    expect(toolsCountWords(3)).toBe("3 tools");
  });

  it("mn дээр орчуулна", async () => {
    await i18n.changeLanguage("mn");
    expect(secondsWords(2)).toBe("2 секунд");
    expect(minutesWords(1)).toBe("1 минут");
    expect(hoursWords(3)).toBe("3 цаг");
    expect(ranCommandsWords(3)).toBe("3 команд ажиллуулсан");
    expect(calledToolsWords(1)).toBe("1 хэрэгсэл дуудсан");
    expect(toolsCountWords(4)).toBe("4 хэрэгсэл");
  });
});
