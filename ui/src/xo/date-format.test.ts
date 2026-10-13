import { describe, expect, it } from "vitest";
import { mnDate, mnDateTime, mnRelative, mnShortDate, mnShortDateTime } from "./date-format";

const sample = new Date(2026, 8, 7, 13, 2, 54);
const morning = new Date(2026, 0, 3, 9, 5, 4);

describe("mn огнооны формат (ICU-гүй)", () => {
  it("огноо", () => {
    expect(mnDate(sample)).toBe("2026 оны 9-р сарын 7");
    expect(mnShortDate(morning)).toBe("1-р сарын 3");
  });

  it("огноо ба цаг", () => {
    expect(mnDateTime(sample)).toBe("2026 оны 9-р сарын 7 13:02");
    expect(mnDateTime(sample, true)).toBe("2026 оны 9-р сарын 7 13:02:54");
    expect(mnDateTime(morning)).toBe("2026 оны 1-р сарын 3 9:05");
    expect(mnShortDateTime(morning)).toBe("1-р сарын 3 9:05");
  });

  it("хүчингүй огноо en замтай адил «Invalid Date»", () => {
    const bad = new Date("not-a-date");
    expect(mnDate(bad)).toBe("Invalid Date");
    expect(mnShortDate(bad)).toBe("Invalid Date");
    expect(mnDateTime(bad)).toBe("Invalid Date");
    expect(mnShortDateTime(bad)).toBe("Invalid Date");
  });

  it("харьцангуй хугацаа", () => {
    expect(mnRelative(5, "minute")).toBe("5 мин өмнө");
    expect(mnRelative(3, "hour")).toBe("3 ц өмнө");
    expect(mnRelative(2, "day")).toBe("2 өдрийн өмнө");
  });
});
