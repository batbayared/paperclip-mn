import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it } from "vitest";
import { i18n } from "@/i18n";
import { XoTrans } from "./XoTrans";

beforeAll(() => {
  i18n.addResourceBundle(
    "en",
    "xo",
    {
      "Read the <docs>docs</docs> first.": "Read the <docs>docs</docs> first.",
      "Imported {{name}}.": "Imported {{name}}.",
    },
    true,
    true,
  );
});

describe("XoTrans", () => {
  it("renders named components inside the translated string", () => {
    const html = renderToStaticMarkup(
      <XoTrans
        i18nKey="Read the <docs>docs</docs> first."
        components={{ docs: <a href="/docs" /> }}
      />,
    );
    expect(html).toBe('Read the <a href="/docs">docs</a> first.');
  });

  it("renders interpolated values containing markup as text, not elements", () => {
    const html = renderToStaticMarkup(
      <XoTrans i18nKey="Imported {{name}}." values={{ name: "<strong>x</strong>" }} />,
    );
    expect(html).not.toContain("<strong>");
    expect(html).toContain("&lt;strong&gt;x&lt;/strong&gt;");
  });
});
