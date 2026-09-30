import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it } from "vitest";
import { i18n } from "@/i18n";
import { XoTrans } from "./XoTrans";

beforeAll(() => {
  i18n.addResourceBundle(
    "en",
    "xo",
    { "Read the <docs>docs</docs> first.": "Read the <docs>docs</docs> first." },
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
});
