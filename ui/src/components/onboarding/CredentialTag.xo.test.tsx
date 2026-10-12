import { afterEach, describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { i18n } from "@/i18n";
import { CredentialTag } from "./ModelSourceTiles";

afterEach(async () => {
  await i18n.changeLanguage("en");
});

describe("CredentialTag (XO)", () => {
  it("en дээр Subscription хэвээр", () => {
    expect(renderToStaticMarkup(<CredentialTag mode="subscription" />)).toContain("Subscription");
  });

  it("mn дээр «Захиалга»", async () => {
    await i18n.changeLanguage("mn");
    const html = renderToStaticMarkup(<CredentialTag mode="subscription" />);
    expect(html).toContain("Захиалга");
    expect(html).not.toContain("Subscription");
  });
});
