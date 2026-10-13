import { describe, expect, it } from "vitest";
import { mnTimeAgo } from "./time-ago";

describe("mnTimeAgo", () => {
  it.each([
    [0, "саяхан"],
    [59, "саяхан"],
    [300, "5 мин өмнө"],
    [10800, "3 ц өмнө"],
    [172800, "2 өдрийн өмнө"],
    [604800, "1 долоо хоногийн өмнө"],
    [1814400, "3 долоо хоногийн өмнө"],
    [5184000, "2 сарын өмнө"],
  ])("%i секунд → %s", (seconds, expected) => {
    expect(mnTimeAgo(seconds)).toBe(expected);
  });
});
