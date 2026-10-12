import { afterEach, expect, it } from "vitest";
import { i18n } from "@/i18n";
import { answerError } from "./QuestionForm";

afterEach(async () => {
  await i18n.changeLanguage("en");
});

const question = (extra: Record<string, unknown> = {}) =>
  ({ id: "q1", prompt: "Q", required: true, answerMode: "text", ...extra }) as Parameters<
    typeof answerError
  >[0];

it("mn дээр шаардлагатай асуултын алдаа монгол", async () => {
  await i18n.changeLanguage("mn");
  expect(answerError(question(), undefined)).toBe("Энэ асуултад заавал хариулна.");
});

it("mn дээр хувьсагчтай алдаа монгол", async () => {
  await i18n.changeLanguage("mn");
  const q = question({ required: false, textValidation: { minLength: 5 } });
  expect(answerError(q, { text: "ab" } as never)).toBe("Хамгийн багадаа 5 тэмдэгт оруулна уу.");
  const n = question({ required: false, textValidation: { inputType: "integer" } });
  expect(answerError(n, { text: "1.5" } as never)).toBe("Зөв бүхэл тоо оруулна уу.");
});

it("en дээр англи хэвээр", () => {
  expect(answerError(question(), undefined)).toBe("This question is required.");
  const q = question({ required: false, textValidation: { maxLength: 1 } });
  expect(answerError(q, { text: "ab" } as never)).toBe("Enter no more than 1 characters.");
});
