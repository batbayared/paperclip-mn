import { describe, expect, it } from "vitest";
import { parse } from "@babel/parser";

import { harvestExplicitKeys, looksLikeCopy, transformSource } from "./transform";

const FILE = "ui/src/components/Example.tsx";

// body нь 5 дахь мөрөнд орно (import, хоосон, export, return, body).
const tsx = (body: string) =>
  `import { Button } from "@/components/ui/button";\n\nexport function Example() {\n  return (\n${body}\n  );\n}\n`;

describe("transformSource", () => {
  it("wraps an allow-listed string attribute and injects the import after the last import", () => {
    const result = transformSource(tsx(`<Button label="Search" />`), FILE);
    expect(result.code).toBe(
      `import { Button } from "@/components/ui/button";\nimport { tx } from "@/i18n/xo";\n\nexport function Example() {\n  return (\n<Button label={tx("Search")} />\n  );\n}\n`,
    );
    expect(result.strings).toEqual([{ key: "Search", file: FILE, line: 5 }]);
    expect(result.map).not.toBeNull();
  });

  it("wraps plain JSX text", () => {
    const result = transformSource(tsx(`<CardTitle>Finance ledger</CardTitle>`), FILE);
    expect(result.code).toContain(`<CardTitle>{tx("Finance ledger")}</CardTitle>`);
  });

  it("wraps allow-listed object properties in .ts files and prepends the import", () => {
    const input = `pushToast({ title: "Connection saved", tone: "success" });\n`;
    const result = transformSource(input, "ui/src/lib/example.ts");
    expect(result.code).toBe(
      `import { tx } from "@/i18n/xo";\npushToast({ title: tx("Connection saved"), tone: "success" });\n`,
    );
  });

  it("turns a count ternary inside a template into a plural key pair", () => {
    const body = "<span>{`${eventCount} total ${eventCount === 1 ? \"event\" : \"events\"}`}</span>";
    const result = transformSource(tsx(body), FILE);
    expect(result.code).toContain(`<span>{tx("{{count}} total event", { count: eventCount })}</span>`);
    expect(result.strings[0]).toEqual({
      key: "{{count}} total event",
      file: FILE,
      line: 5,
      plural: { one: "{{count}} total event", other: "{{count}} total events" },
    });
  });

  it("interpolates member expressions by their last segment", () => {
    const result = transformSource(tsx("<p title={`Hello ${user.name}`} />"), FILE);
    expect(result.code).toContain(`title={tx("Hello {{name}}", { name: user.name })}`);
  });

  it("uses shorthand when the variable name equals the placeholder", () => {
    const result = transformSource(tsx("<p title={`Hi ${name}`} />"), FILE);
    expect(result.code).toContain(`tx("Hi {{name}}", { name })`);
  });

  it("wraps both branches of a ternary attribute", () => {
    const result = transformSource(tsx(`<Button label={ready ? "Continue" : "Loading…"} />`), FILE);
    expect(result.code).toContain(`label={ready ? tx("Continue") : tx("Loading…")}`);
  });

  it("merges text and simple expressions into one key", () => {
    const result = transformSource(tsx(`<p>Welcome, {name}!</p>`), FILE);
    expect(result.code).toContain(`<p>{tx("Welcome, {{name}}!", { name })}</p>`);
  });

  it("reports mixed JSX as a manual case and leaves the code untouched", () => {
    const input = tsx(`<p>Read the <a href="/docs">docs</a> first.</p>`);
    const result = transformSource(input, FILE);
    expect(result.changed).toBe(false);
    expect(result.code).toBe(input);
    expect(result.manual).toEqual([
      { file: FILE, line: 5, reason: "mixed-jsx", snippet: `<p>Read the <a href="/docs">docs</a> first.</p>` },
    ]);
  });

  it("skips code-like tags", () => {
    const result = transformSource(tsx(`<code>npm install</code>`), FILE);
    expect(result.changed).toBe(false);
  });

  it("ignores attributes outside the allow-list", () => {
    const result = transformSource(tsx(`<div className="Flex items-center">Hello</div>`), FILE);
    expect(result.code).toContain(`className="Flex items-center"`);
    expect(result.code).toContain(`{tx("Hello")}`);
  });

  it("does not duplicate an existing tx import", () => {
    const input = `import { tx } from "@/i18n/xo";\n\nexport function Example() {\n  return <p title="Hello there" />;\n}\n`;
    const result = transformSource(input, FILE);
    expect(result.code.match(/import \{ tx \} from "@\/i18n\/xo";/g)).toHaveLength(1);
    expect(result.code).toContain(`title={tx("Hello there")}`);
  });

  it("replaces the brand name with the {{brand}} placeholder", () => {
    const result = transformSource(tsx(`<p>Welcome to Paperclip.</p>`), FILE);
    expect(result.code).toContain(`{tx("Welcome to {{brand}}.")}`);
    expect(result.strings[0].key).toBe("Welcome to {{brand}}.");
  });

  it("keeps a leading space as an explicit JSX space", () => {
    const result = transformSource(tsx(`<Button><Plus /> New agent</Button>`), FILE);
    expect(result.code).toContain(`<Button><Plus />{" "}{tx("New agent")}</Button>`);
  });

  it("maps BRAND.name inside templates to {{brand}} without an options object", () => {
    const result = transformSource(tsx("<h1>{`Sign in to ${BRAND.name}`}</h1>"), FILE);
    expect(result.code).toContain(`<h1>{tx("Sign in to {{brand}}")}</h1>`);
  });

  it("returns the input unchanged when nothing matches", () => {
    const input = tsx(`<div className="x" />`);
    const result = transformSource(input, FILE);
    expect(result.changed).toBe(false);
    expect(result.code).toBe(input);
    expect(result.map).toBeNull();
    expect(result.strings).toEqual([]);
  });

  it("wraps string branches of a ternary child", () => {
    const result = transformSource(tsx(`<p>{active ? "Active" : "Paused"}</p>`), FILE);
    expect(result.code).toContain(`<p>{active ? tx("Active") : tx("Paused")}</p>`);
  });

  it("leaves identifier-like attribute values alone", () => {
    const result = transformSource(tsx(`<Badge label="primary" />`), FILE);
    expect(result.changed).toBe(false);
  });

  it("keeps edge whitespace of ternary branches outside the key", () => {
    const result = transformSource(tsx(`<Button title={ok ? " then come back" : "Retry now "} />`), FILE);
    expect(result.code).toContain(`title={ok ? (" " + tx("then come back")) : (tx("Retry now") + " ")}`);
    expect(result.strings.map((s) => s.key)).toEqual(["then come back", "Retry now"]);
  });

  it("keeps edge whitespace of an attribute string value", () => {
    const result = transformSource(tsx(`<Button title=" Save changes" />`), FILE);
    expect(result.code).toContain(`title={" " + tx("Save changes")}`);
  });

  it("keeps trailing and inner whitespace of object property literals", () => {
    const input = `pushToast({ title: "Sign in to continue ", body: "First line.\\n  Second line." });\n`;
    const result = transformSource(input, "ui/src/lib/example.ts");
    expect(result.code).toContain(`pushToast({ title: (tx("Sign in to continue") + " "), body: tx("First line.\\n  Second line.") });`);
    expect(result.strings.map((s) => s.key)).toEqual(["Sign in to continue", "First line.\n  Second line."]);
  });

  it("keeps edge whitespace of a plural template outside the key", () => {
    const body = "<Badge label={` (${runCount} run${runCount === 1 ? \"\" : \"s\"})`} />";
    const result = transformSource(tsx(body), FILE);
    expect(result.code).toContain(`label={(" " + tx("({{count}} run)", { count: runCount }))}`);
    expect(result.strings[0]).toEqual({
      key: "({{count}} run)",
      file: FILE,
      line: 5,
      plural: { one: "({{count}} run)", other: "({{count}} runs)" },
    });
  });

  it("keeps a non-breaking space inside a JSX text key", () => {
    const result = transformSource(tsx(`<p>Pay now today</p>`), FILE);
    expect(result.strings[0].key).toBe("Pay now today");
  });

  it("leaves literal double braces untouched and records them as manual", () => {
    const input = tsx("<div><Input placeholder={`Insert {{${field.key}}}`} /><Input placeholder=\"Use {{name}} here\" /></div>");
    const result = transformSource(input, FILE);
    expect(result.changed).toBe(false);
    expect(result.code).toBe(input);
    expect(result.manual.map((m) => m.reason)).toEqual(["literal-braces", "literal-braces"]);
  });

  it("records a JSX parent with a literal brace string as manual", () => {
    const input = tsx(`<p>Type {"{{name}}"} to insert a name</p>`);
    const result = transformSource(input, FILE);
    expect(result.changed).toBe(false);
    expect(result.code).toBe(input);
    expect(result.manual).toEqual([
      { file: FILE, line: 5, reason: "literal-braces", snippet: `<p>Type {"{{name}}"} to insert a name</p>` },
    ]);
  });

  it("turns a pure plural template into a plural key pair", () => {
    const body = "<span>{`${count} ${count === 1 ? \"tool\" : \"tools\"}`}</span>";
    const result = transformSource(tsx(body), FILE);
    expect(result.code).toContain(`<span>{tx("{{count}} tool", { count })}</span>`);
    expect(result.strings[0]).toEqual({
      key: "{{count}} tool",
      file: FILE,
      line: 5,
      plural: { one: "{{count}} tool", other: "{{count}} tools" },
    });
  });

  it("merges a JSX-level count ternary into one plural key", () => {
    const result = transformSource(
      tsx(`<p>{computedCount} governed tool call{computedCount === 1 ? " was" : "s were"} blocked</p>`),
      FILE,
    );
    expect(result.code).toContain(`<p>{tx("{{count}} governed tool call was blocked", { count: computedCount })}</p>`);
    expect(result.strings).toEqual([
      {
        key: "{{count}} governed tool call was blocked",
        file: FILE,
        line: 5,
        plural: { one: "{{count}} governed tool call was blocked", other: "{{count}} governed tool calls were blocked" },
      },
    ]);
  });

  it("passes the counter to a JSX-level plural key even when the text does not show it", () => {
    const result = transformSource(tsx(`<span>Reassign {n === 1 ? "agent" : "agents"}</span>`), FILE);
    expect(result.code).toContain(`<span>{tx("Reassign agent", { count: n })}</span>`);
    expect(result.strings[0].plural).toEqual({ one: "Reassign agent", other: "Reassign agents" });
  });

  it("records two different counters in one JSX parent as manual", () => {
    const input = tsx(`<p>{a} agent{a === 1 ? "" : "s"} and {b} task{b === 1 ? "" : "s"}</p>`);
    const result = transformSource(input, FILE);
    expect(result.changed).toBe(false);
    expect(result.manual.map((m) => m.reason)).toEqual(["mixed-jsx"]);
  });

  it("records copy split by a copy-free element as manual instead of fragmenting it", () => {
    const input = tsx(`<p>Restart <code>pnpm dev:once</code> after the work is safe.</p>`);
    const result = transformSource(input, FILE);
    expect(result.changed).toBe(false);
    expect(result.code).toBe(input);
    expect(result.manual).toEqual([
      { file: FILE, line: 5, reason: "mixed-jsx", snippet: `<p>Restart <code>pnpm dev:once</code> after the work is safe.</p>` },
    ]);
  });

  it("records a copy run next to a text-carrying conditional as manual", () => {
    const input = tsx(`<p>Reuse this saved {kind === "api" ? "key" : "subscription"}</p>`);
    const result = transformSource(input, FILE);
    expect(result.changed).toBe(false);
    expect(result.manual.map((m) => m.reason)).toEqual(["mixed-jsx"]);
  });

  it("still transforms a copy run next to a text-free complex container", () => {
    const result = transformSource(tsx(`<p>Total: {formatCents(total)}</p>`), FILE);
    expect(result.code).toContain(`<p>{tx("Total:")}{" "}{formatCents(total)}</p>`);
  });

  it("produces output that parses again", () => {
    const body = [
      "<>",
      "  <Button title={ok ? \" then come back\" : \"Retry now \"} />",
      "  <Badge label={` (${runCount} run${runCount === 1 ? \"\" : \"s\"})`} />",
      "  <p>{computedCount} governed tool call{computedCount === 1 ? \" was\" : \"s were\"} blocked</p>",
      "  <p>Total: {formatCents(total)}</p>",
      "</>",
    ].join("\n");
    const result = transformSource(tsx(body), FILE);
    expect(result.changed).toBe(true);
    expect(() => parse(result.code, { sourceType: "module", plugins: ["typescript", "jsx"] })).not.toThrow();
  });
});

describe("harvestExplicitKeys", () => {
  it("collects explicit tx() keys and XoTrans i18nKey values", () => {
    const code =
      `import { tx } from "@/i18n/xo";\nimport { XoTrans } from "@/xo/XoTrans";\n\n` +
      `export const label = tx("Manual key");\n` +
      `export const node = <XoTrans i18nKey="Read <docs>docs</docs> first" components={{ docs: <a href="/docs" /> }} />;\n`;
    const keys = harvestExplicitKeys(code, "ui/src/lib/example.tsx").map((s) => s.key);
    expect(keys).toEqual(["Manual key", "Read <docs>docs</docs> first"]);
  });
});

describe("looksLikeCopy", () => {
  const cases: Array<[string, boolean]> = [
    ["Search", true],
    ["primary", false],
    ["e.g. Northwind Labs", true],
    ["/dashboard", false],
    ["https://x.y", false],
    ["", false],
    ["…", false],
    ["sm", false],
    ["Loading…", true],
    ["calendar_month_utc", false],
  ];

  it.each(cases)("%j → %s", (text, expected) => {
    expect(looksLikeCopy(text)).toBe(expected);
  });

  it("treats any lettered JSX text as copy", () => {
    expect(looksLikeCopy("abc", { jsxText: true })).toBe(true);
  });
});
