import { afterEach, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { i18n } from "@/i18n";
import type { IssueBlockerAttention } from "@paperclipai/shared";
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

function attention(overrides: Partial<IssueBlockerAttention>): IssueBlockerAttention {
  return {
    state: "covered",
    reason: "active_child",
    unresolvedBlockerCount: 0,
    coveredBlockerCount: 0,
    stalledBlockerCount: 0,
    attentionBlockerCount: 0,
    sampleBlockerIdentifier: null,
    sampleStalledBlockerIdentifier: null,
    ...overrides,
  } as IssueBlockerAttention;
}

const cases: Array<[Partial<IssueBlockerAttention>, string, string]> = [
  [{ reason: "active_child", coveredBlockerCount: 1, sampleBlockerIdentifier: "XO-7" },
    "Blocked · waiting on active sub-task XO-7", "Саатсан · идэвхтэй дэд даалгавар хүлээж байна: XO-7"],
  [{ reason: "active_child", coveredBlockerCount: 1 },
    "Blocked · waiting on 1 active sub-task", "Саатсан · 1 идэвхтэй дэд даалгавар хүлээж байна"],
  [{ reason: "active_child", coveredBlockerCount: 3 },
    "Blocked · waiting on 3 active sub-tasks", "Саатсан · 3 идэвхтэй дэд даалгавар хүлээж байна"],
  [{ reason: "active_dependency", coveredBlockerCount: 1, sampleBlockerIdentifier: "XO-8" },
    "Blocked · covered by active dependency XO-8", "Саатсан · идэвхтэй хамаарлаар хамрагдсан: XO-8"],
  [{ reason: "active_dependency", coveredBlockerCount: 2 },
    "Blocked · covered by 2 active dependencies", "Саатсан · 2 идэвхтэй хамаарлаар хамрагдсан"],
  [{ state: "stalled", reason: "stalled_review", stalledBlockerCount: 1, sampleStalledBlockerIdentifier: "XO-9" },
    "Blocked · review stalled on XO-9", "Саатсан · хяналт зогссон: XO-9"],
  [{ state: "stalled", reason: "stalled_review", stalledBlockerCount: 1 },
    "Blocked · review stalled with no clear next step", "Саатсан · хяналт зогссон, дараагийн алхам тодорхойгүй"],
  [{ state: "stalled", reason: "stalled_review", stalledBlockerCount: 2 },
    "Blocked · 2 reviews stalled with no clear next step", "Саатсан · 2 хяналт зогссон, дараагийн алхам тодорхойгүй"],
  [{ state: "needs_attention", reason: "attention_required", attentionBlockerCount: 1 },
    "Blocked · 1 blocker needs attention", "Саатсан · 1 саатуулагч анхаарал шаардаж байна"],
  [{ state: "needs_attention", reason: "attention_required", attentionBlockerCount: 2, coveredBlockerCount: 1 },
    "Blocked · 2 blockers need attention; 1 covered by active work",
    "Саатсан · 2 саатуулагч анхаарал шаардаж байна; 1 нь идэвхтэй ажлаар хамрагдсан"],
];

it.each(cases)("en: саатлын тайлбар хэвээр (%#)", (overrides, en) => {
  const html = renderToStaticMarkup(<StatusIcon status="blocked" blockerAttention={attention(overrides)} />);
  expect(html).toContain(en);
});

it.each(cases)("mn: саатлын тайлбар монгол (%#)", async (overrides, _en, mn) => {
  await i18n.changeLanguage("mn");
  const html = renderToStaticMarkup(<StatusIcon status="blocked" blockerAttention={attention(overrides)} />);
  expect(html).toContain(mn);
});

it("mn дээр саатлын мэдээлэлгүй blocked нь «Саатсан»", async () => {
  await i18n.changeLanguage("mn");
  const html = renderToStaticMarkup(<StatusIcon status="blocked" />);
  expect(html).toContain("Саатсан");
  expect(html).not.toContain("Blocked");
});

it("mn дээр «Төлөв солих» aria-label", async () => {
  await i18n.changeLanguage("mn");
  const html = renderToStaticMarkup(<StatusIcon status="todo" onChange={() => {}} />);
  expect(html).toContain("Төлөв солих (одоогийн: Хийх)");
});

it("en дээр Change status aria-label хэвээр", () => {
  const html = renderToStaticMarkup(<StatusIcon status="todo" onChange={() => {}} />);
  expect(html).toContain("Change status (current: Todo)");
});
