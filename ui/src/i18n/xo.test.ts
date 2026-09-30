import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { i18n } from "./index";
import { tx } from "./xo";

beforeAll(() => {
  i18n.addResourceBundle(
    "en",
    "xo",
    {
      Search: "Search",
      "Welcome to {{brand}}.": "Welcome to {{brand}}.",
      "Sign in to app.example: now": "Sign in to app.example: now",
      "{{count}} total event_one": "{{count}} total event",
      "{{count}} total event_other": "{{count}} total events",
    },
    true,
    true,
  );
  i18n.addResourceBundle(
    "mn",
    "xo",
    {
      Search: "Хайх",
      "Welcome to {{brand}}.": "{{brand}}-д тавтай морил.",
      "Sign in to app.example: now": "app.example руу нэвтрэх: одоо",
      "{{count}} total event_one": "Нийт {{count}} үйл явдал",
      "{{count}} total event_other": "Нийт {{count}} үйл явдал",
    },
    true,
    true,
  );
});

afterEach(async () => {
  await i18n.changeLanguage("en");
});

describe("tx", () => {
  it("returns the key when no translation exists", () => {
    expect(tx("No such key")).toBe("No such key");
  });

  it("translates from the xo namespace", async () => {
    await i18n.changeLanguage("mn");
    expect(tx("Search")).toBe("Хайх");
  });

  it("interpolates the brand by default", () => {
    expect(tx("Welcome to {{brand}}.")).toBe("Welcome to XO.");
  });

  it("treats dots and colons in keys literally", async () => {
    await i18n.changeLanguage("mn");
    expect(tx("Sign in to app.example: now")).toBe("app.example руу нэвтрэх: одоо");
  });

  it("selects plural forms by count", async () => {
    expect(tx("{{count}} total event", { count: 1 })).toBe("1 total event");
    expect(tx("{{count}} total event", { count: 5 })).toBe("5 total events");
    await i18n.changeLanguage("mn");
    expect(tx("{{count}} total event", { count: 1 })).toBe("Нийт 1 үйл явдал");
  });
});
