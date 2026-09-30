import { describe, expect, it } from "vitest";

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
