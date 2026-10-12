import { describe, expect, it } from "vitest";
import mn from "./mn.json";

const FIXED: Record<string, string> = {
  "{{label}} actions": "{{label}} хэсгийн үйлдлүүд",
  "Collapse {{label}}": "{{label}} хэсгийг хураах",
  "Expand {{label}}": "{{label}} хэсгийг дэлгэх",
  "New task in {{label}}": "Шинэ даалгавар: {{label}}",
  "{{scope}} budgets": "{{scope}} түвшний төсөв",
  "Resume the agent to generate this {{noun}}.": "Агентыг үргэлжлүүлбэл энэ {{noun}} үүснэ.",
};

describe("mn дагавар (Ү3-Б үлдэгдэл)", () => {
  it.each(Object.entries(FIXED))("%s нь хувьсагчид дагавар залгахгүй", (key, value) => {
    const actual = (mn as Record<string, string>)[key];
    expect(actual).toBe(value);
    expect(actual).not.toMatch(/\}\}-[а-яөүё]/);
  });
});
