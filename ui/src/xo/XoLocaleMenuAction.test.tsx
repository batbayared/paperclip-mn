import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { XO_LOCALE_STORAGE_KEY } from "./locale";
import { XoLocaleMenuAction } from "./XoLocaleMenuAction";

afterEach(() => {
  localStorage.removeItem(XO_LOCALE_STORAGE_KEY);
});

describe("XoLocaleMenuAction", () => {
  it("offers English while Mongolian is active", () => {
    localStorage.setItem(XO_LOCALE_STORAGE_KEY, "mn");
    expect(renderToStaticMarkup(<XoLocaleMenuAction />)).toContain("Switch to English");
  });

  it("offers Mongolian while English is active", () => {
    localStorage.setItem(XO_LOCALE_STORAGE_KEY, "en");
    expect(renderToStaticMarkup(<XoLocaleMenuAction variant="menu-action" />)).toContain(
      "Монгол хэл рүү шилжих",
    );
  });
});
