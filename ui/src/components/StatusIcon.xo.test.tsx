import { afterEach, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { i18n } from "@/i18n";
import { StatusIcon } from "./StatusIcon";

afterEach(async () => {
  await i18n.changeLanguage("en");
});

it("mn дээр статусын aria-label монгол", async () => {
  await i18n.changeLanguage("mn");
  const html = renderToStaticMarkup(<StatusIcon status="in_review" />);
  expect(html).toContain("Хянагдаж буй");
  expect(html).not.toContain("In Review");
});

it("en дээр хуучин текст хэвээр", () => {
  const html = renderToStaticMarkup(<StatusIcon status="in_review" />);
  expect(html).toContain("In Review");
});
