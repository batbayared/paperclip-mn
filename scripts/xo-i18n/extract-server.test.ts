import { describe, expect, it } from "vitest";
import { extractServerMessages, placeholdersOf } from "./extract-server";

const keys = (src: string, file = "server/src/routes/x.ts") => extractServerMessages(src, file).map((m) => m.key);

describe("extractServerMessages", () => {
  it("collects the first argument of HttpError helpers", () => {
    expect(keys(`throw notFound("Issue not found"); throw conflict("Busy", { a: 1 });`)).toEqual([
      "Issue not found",
      "Busy",
    ]);
  });

  it("turns template expressions into named placeholders", () => {
    expect(keys('throw conflict(`A company skill with slug "${slug}" already exists.`);')).toEqual([
      'A company skill with slug "{{slug}}" already exists.',
    ]);
    expect(keys("throw badRequest(`Bad ${input.kind} for ${items.length + 1}`);")).toEqual([
      "Bad {{kind}} for {{value}}",
    ]);
  });

  it("collects error strings passed to res.json", () => {
    expect(keys(`res.status(404).json({ error: "Agent not found" }); other({ error: "skip me" });`)).toEqual([
      "Agent not found",
    ]);
  });

  it("collects budget reasons only in services/budgets.ts", () => {
    const src = `const r = { reason: "Budget exceeded" };`;
    expect(keys(src, "server/src/services/budgets.ts")).toEqual(["Budget exceeded"]);
    expect(keys(src)).toEqual([]);
  });

  it("collects both branches of a conditional message", () => {
    expect(keys(`throw unprocessable(a ? "First" : "Second");`)).toEqual(["First", "Second"]);
  });

  it("ignores helpers called without a string", () => {
    expect(keys(`throw notFound(); throw badRequest(message);`)).toEqual([]);
  });
});

describe("placeholdersOf", () => {
  it("lists placeholders sorted", () => {
    expect(placeholdersOf("{{b}} and {{a}} and {{b}}")).toEqual(["a", "b"]);
  });
});
