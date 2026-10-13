# Ү3-Б үлдэгдэл (монгол UI) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ү3-Б-ийн тооллогод (.superpowers/sdd/y3b-leftovers-inventory.md) үлдсэн англи мөрүүд, монгол дагаврын алдаа, IssueDetail 404-ийг controller-ийн шийдвэрийн хүрээнд засах.

**Architecture:** Модулийн түвшний англи Record/массивыг upstream файлд задлахгүй, XO-д хамаарах шинэ ui/src/xo/labels.ts helper-ээр render үед tx() дуудна (upstream засвар нэг дуудлага). T1-д байхгүй QuestionForm, PropertiesPanel-ийг tiers.ts-д нэмж, transform барьж чадахгүй мөрийг тодорхой tx()-ээр орчуулна. Дагаврын алдааг зөвхөн mn.json-ийн утгаар (түлхүүр өөрчлөхгүй) bcc78e7f9-ийн загвараар засна.

**Tech Stack:** React 19 + Vite, i18next (ns "xo", tx() = ui/src/i18n/xo.ts), Babel transform (scripts/xo-i18n/transform.ts), vitest, pnpm.

## Global Constraints

- mn UI бүрэн монгол; брэнд XO.
- Upstream diff хамгийн бага: upstream компонент засахаас өмнө tiers.ts T1-д файл нэмэх эсвэл каталогт түлхүүр нэмэхийг сонго. Засварласан upstream файл бүр docs/xo/SYNC.md-д бүртгэгдэнэ (tiers.ts, ui/src/xo/*, ui/src/i18n/xo/* нь XO-ийн өмч).
- en зан төлөв өөрчлөгдөхгүй (en дээр харагдах англи текст яг хэвээр).
- Ногоон байх ёстой: `pnpm xo:i18n:check`, ui тестүүд `ui/src/i18n/xo/parity.test.ts`, `upstream-locale.test.ts`, `ui/src/i18n/xo.test.ts`, `locale-validation.test.ts`, `scripts/xo-i18n/*.test.ts` (`pnpm xo:i18n:test`).
- `pnpm xo:brand-scan` baseline-аас өсөхгүй.
- `git add -A` / `git add .` хориотой; `.superpowers/`-ийг хэзээ ч нэмэхгүй. Файлыг нэрээр нь нэмнэ.
- Commit trailer: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Bash дуудлага бүр: `export PATH="$HOME/dev/bin:$HOME/.nvm/versions/node/v24.16.0/bin:$PATH" && cd ~/dev/paperclip-mn && …`
- vitest-ийг repo root-оос ажиллуулна (`pnpm exec vitest run <path>`); багцын tsc: `cd ui && pnpm exec tsc --noEmit`.
- Push зөвхөн ED зөвшөөрсний дараа, `find .git/refs -name '* 2*'` хоосон байхад. Upstream PR үгүй.
- Хамрах хүрээнээс гадуур (Ү6/T2): CompanySkills, SkillStudio, issue-properties/IssueProperties, IssueThreadInteractionCard (QuestionForm-ын мөрөөс бусад); Task 11 glossary нэмэлт.
- Үг сонголт (заавал): Subscription → «Захиалга»; Use API key instead → «Оронд нь API түлхүүр ашиглах»; нэр үг «Байгууллага»; статус: backlog «Нөөц», todo «Хийх», in_progress «Хийгдэж буй», in_review «Хянагдаж буй», done «Дууссан», cancelled «Цуцалсан», blocked «Саатсан».
- Дагавар: хувьсагч + тогтмол нэр үг + дагавар («{{label}} хэсгийг хураах»); эгшгийн зохицлын helper бичихгүй.
- `{{placeholder}}` бүрэлдэхүүн en ба mn утгад яг ижил байх ёстой (parity.test.ts, cli.ts:278 шалгана).

## Механизмын тэмдэглэл (хэрэгжүүлэгчид)

- Каталогийн түлхүүр = англи текст. Шинэ mn утга оруулах дараалал: `pnpm xo:i18n:extract` → `pnpm xo:i18n:todo <prefix>` (mn==en түлхүүрүүд JSON-оор гарна) → scratch JSON бичих → `pnpm xo:i18n:merge <file.json>` → `pnpm xo:i18n:check`. Scratch JSON-г repo-д commit хийхгүй (`/private/tmp/...` эсвэл scratchpad).
- T1 transform нь JSX текст, allowlist attribute/prop (title, label, placeholder, description, aria-label, alt, …), энгийн template, conditional салбар, `??`/`||` баруун талыг барина. Барихгүй: return string, модулийн түвшний Record/массив, allowlist-д байхгүй prop (attachAriaLabel), setError(...) аргумент, `page + 1` мэт нийлмэл илэрхийлэл. Холимог тохиолдол "гараар:" гэж check-д унана.
- T1 файлд tx-ийг шууд дуудвал `import { tx } from "@/i18n/xo";`-г өөрөө нэм (transform зөвхөн өөрөө засвар хийсэн үед import нэмдэг, байгаа import-ыг давхардуулахгүй — transform.ts:573-612).
- T1 бус ui/src/**/*.ts(x) доторх `tx("literal")` дуудлага extract-д автоматаар орно; `tx(variable)` орохгүй.
- Тест дотор mn утга шалгах: `await i18n.changeLanguage("mn")`, afterEach-д `await i18n.changeLanguage("en")` (ui/src/i18n/xo.test.ts загвар).

## File Structure

| Файл | Үүрэг | Task |
|---|---|---|
| ui/src/xo/labels.ts (шинэ, XO) | xoLabel(), xoStatusLabel() — тогтмол англи шошгыг render үед tx()-ээр орчуулах | 1 |
| ui/src/xo/labels.test.ts (шинэ, XO) | helper-ийн en/mn тест | 1 |
| ui/src/components/onboarding/CredentialModeLink.tsx | LINK_LABEL-г xoLabel()-ээр | 2 |
| ui/src/components/onboarding/ModelSourceTiles.tsx | CREDENTIAL_TAG_LABEL-г xoLabel()-ээр | 2 |
| ui/src/components/onboarding/Stepper.tsx | алхмын aria-label-г xoLabel()-ээр | 2 |
| scripts/xo-i18n/tiers.ts (XO) | QuestionForm, PropertiesPanel-ийг T1-д | 3 |
| ui/src/components/task-chat/QuestionForm.tsx | transform барихгүй мөрүүдийг tx() | 3 |
| ui/src/components/SidebarCompanyMenu.tsx, .production.tsx | switcherNoun-г tx() | 4 |
| ui/src/pages/Costs.tsx, Costs.production.tsx | scope нэр үгийг орчуулах | 4 |
| StatusIcon.tsx, StatusBadge.tsx, KanbanBoard.tsx, ActivityCharts.tsx, ActivityFeed.tsx, NewIssueDialog.tsx | статус шошгыг xoStatusLabel() | 4 |
| ui/src/i18n/xo/mn.json (XO) | шинэ орчуулга, дагаврын засвар | 1-6 |
| ui/src/i18n/xo/suffix.test.ts (шинэ, XO) | засагдсан дагавар буцаж ирэхгүйг хамгаалах | 5 |
| ui/src/pages/IssueDetail.tsx | 404 үед «Даалгавар олдсонгүй» | 6 |
| ui/src/pages/IssueDetail.test.tsx | 404 тест | 6 |
| docs/xo/SYNC.md, PROGRESS (docs/xo) | upstream файлын бүртгэл, төлөв | 7 |

---

### Task 1: XO шошгын helper (labels.ts)

**Files:**
- Create: `ui/src/xo/labels.ts`
- Test: `ui/src/xo/labels.test.ts`
- Modify: `ui/src/i18n/xo/en.json`, `ui/src/i18n/xo/mn.json` (extract + merge)

**Interfaces:**
- Produces: `export function xoLabel(english: string): string` — мэдэгдэх англи шошго бол tx(литерал), бусад үед english-ийг өөрчлөхгүй буцаана. `export function xoStatusLabel(status: string, english: string): string` — mn үед статусын монгол нэр, mn биш эсвэл үл мэдэгдэх статус бол english-ийг яг буцаана (en зан төлөв хэвээр).

- [ ] **Step 1: Failing test бичих**

```ts
// ui/src/xo/labels.test.ts
import { afterEach, describe, expect, it } from "vitest";
import { i18n } from "@/i18n";
import { xoLabel, xoStatusLabel } from "./labels";

afterEach(async () => {
  await i18n.changeLanguage("en");
});

describe("xoLabel", () => {
  it("en дээр англи текстийг хэвээр буцаана", () => {
    expect(xoLabel("Subscription")).toBe("Subscription");
    expect(xoLabel("Some unknown label")).toBe("Some unknown label");
  });

  it("mn дээр мэдэгдэх шошгыг орчуулна", async () => {
    await i18n.changeLanguage("mn");
    expect(xoLabel("Subscription")).toBe("Захиалга");
    expect(xoLabel("Use API key instead")).toBe("Оронд нь API түлхүүр ашиглах");
    expect(xoLabel("Use subscription instead")).toBe("Оронд нь захиалга ашиглах");
    expect(xoLabel("Create your first agent")).not.toBe("Create your first agent");
    expect(xoLabel("Connect a model")).not.toBe("Connect a model");
    expect(xoLabel("Review")).toBe("Хянах");
    expect(xoLabel("Name your organization")).toBe("Байгууллагаа нэрлэх");
    expect(xoLabel("Some unknown label")).toBe("Some unknown label");
  });
});

describe("xoStatusLabel", () => {
  it("en дээр дуудагчийн англи шошгыг яг буцаана", () => {
    expect(xoStatusLabel("todo", "To Do")).toBe("To Do");
    expect(xoStatusLabel("in_review", "In Review")).toBe("In Review");
  });

  it("mn дээр статусыг орчуулна (enum ба англи шошгын аль алинаас)", async () => {
    await i18n.changeLanguage("mn");
    expect(xoStatusLabel("backlog", "Backlog")).toBe("Нөөц");
    expect(xoStatusLabel("todo", "To Do")).toBe("Хийх");
    expect(xoStatusLabel("Todo", "Todo")).toBe("Хийх");
    expect(xoStatusLabel("in_progress", "In Progress")).toBe("Хийгдэж буй");
    expect(xoStatusLabel("In Review", "In Review")).toBe("Хянагдаж буй");
    expect(xoStatusLabel("done", "Done")).toBe("Дууссан");
    expect(xoStatusLabel("cancelled", "Cancelled")).toBe("Цуцалсан");
    expect(xoStatusLabel("blocked", "Blocked")).toBe("Саатсан");
    expect(xoStatusLabel("running", "running")).toBe("running");
  });
});
```

- [ ] **Step 2: Унахыг шалгах**

Run: `pnpm exec vitest run ui/src/xo/labels.test.ts`
Expected: FAIL — `Failed to resolve import "./labels"`.

- [ ] **Step 3: Helper бичих**

```ts
// ui/src/xo/labels.ts
// XO: upstream-ийн модулийн түвшний англи шошгыг render үед орчуулна.
// tx()-ийн аргумент бүр литерал байх ёстой — extract зөвхөн литералыг хураадаг.
import { i18n } from "@/i18n";
import { tx } from "@/i18n/xo";

export function xoLabel(english: string): string {
  switch (english) {
    case "Use API key instead": return tx("Use API key instead");
    case "Use subscription instead": return tx("Use subscription instead");
    case "Subscription": return tx("Subscription");
    case "Create your first agent": return tx("Create your first agent");
    case "Connect a model": return tx("Connect a model");
    case "Review": return tx("Review");
    case "Name your organization": return tx("Name your organization");
    default: return english;
  }
}

function normalizeStatus(status: string): string {
  const s = status.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return s === "to_do" ? "todo" : s === "canceled" ? "cancelled" : s;
}

export function xoStatusLabel(status: string, english: string): string {
  if (!(i18n.resolvedLanguage ?? i18n.language ?? "").startsWith("mn")) return english;
  switch (normalizeStatus(status)) {
    case "backlog": return tx("Backlog");
    case "todo": return tx("Todo");
    case "in_progress": return tx("In Progress");
    case "in_review": return tx("In Review");
    case "done": return tx("Done");
    case "cancelled": return tx("Cancelled");
    case "blocked": return tx("Blocked");
    default: return english;
  }
}
```

- [ ] **Step 4: Каталог шинэчлэх**

Run: `pnpm xo:i18n:extract && pnpm xo:i18n:todo ui/src/xo`
Expected: шинэ mn==en түлхүүрүүд (жишээ нь "Use API key instead", "Use subscription instead", "Review", "Name your organization", "Backlog", "Todo", "In Progress", "In Review", "Cancelled"). "Subscription", "Done", "Blocked", "Create your first agent", "Connect a model" аль хэдийн орчуулагдсан.

Scratch файл `/private/tmp/xo-y3b-left-t1.json` бичих (todo-д гарсан түлхүүрээр л):

```json
{
  "Use API key instead": "Оронд нь API түлхүүр ашиглах",
  "Use subscription instead": "Оронд нь захиалга ашиглах",
  "Review": "Хянах",
  "Name your organization": "Байгууллагаа нэрлэх",
  "Backlog": "Нөөц",
  "Todo": "Хийх",
  "In Progress": "Хийгдэж буй",
  "In Review": "Хянагдаж буй",
  "Cancelled": "Цуцалсан"
}
```

Run: `pnpm xo:i18n:merge /private/tmp/xo-y3b-left-t1.json && pnpm xo:i18n:check`
Expected: check PASS. "Done"→«Дууссан», "Blocked"→«Саатсан» хэвээр байгааг `grep -n '"Done"\|"Blocked"' ui/src/i18n/xo/mn.json`-ээр нягтал.

- [ ] **Step 5: Тест давахыг шалгах**

Run: `pnpm exec vitest run ui/src/xo/labels.test.ts ui/src/i18n/xo/parity.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add ui/src/xo/labels.ts ui/src/xo/labels.test.ts ui/src/i18n/xo/en.json ui/src/i18n/xo/mn.json
git commit -m "feat(xo): add label helpers for module-level English labels

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Onboarding шошго (CredentialModeLink, ModelSourceTiles, Stepper)

**Files:**
- Modify: `ui/src/components/onboarding/CredentialModeLink.tsx:62,84` (+ import)
- Modify: `ui/src/components/onboarding/ModelSourceTiles.tsx:57` (+ import)
- Modify: `ui/src/components/onboarding/Stepper.tsx:118` (+ import)
- Test: `ui/src/components/onboarding/CredentialTag.xo.test.tsx` (шинэ)

**Interfaces:**
- Consumes: `xoLabel(english: string): string` (Task 1, `@/xo/labels`).

- [ ] **Step 1: Failing test**

```tsx
// ui/src/components/onboarding/CredentialTag.xo.test.tsx
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
```

- [ ] **Step 2: Унахыг шалгах**

Run: `pnpm exec vitest run ui/src/components/onboarding/CredentialTag.xo.test.tsx`
Expected: FAIL — mn тест "Subscription" агуулсан. (motion/react-ийн AnimatePresence SSR-д унавал CredentialTag-ийн оронд `xoLabel`-ийн тест хангалттай гэж үзээд энэ тестийг хасч, Step 6-ийн browser шалгалтад найдна.)

- [ ] **Step 3: Call site засах**

CredentialModeLink.tsx — import нэмэх (бусад import-ын дараа):

```ts
import { xoLabel } from "@/xo/labels";
```

мөр 62: `{LINK_LABEL[sizerMode]}` → `{xoLabel(LINK_LABEL[sizerMode])}`
мөр 84: `{LINK_LABEL[mode]}` → `{xoLabel(LINK_LABEL[mode])}`

ModelSourceTiles.tsx — import нэмэх:

```ts
import { xoLabel } from "@/xo/labels";
```

мөр 57: `{CREDENTIAL_TAG_LABEL[mode]}` → `{xoLabel(CREDENTIAL_TAG_LABEL[mode])}`

Stepper.tsx — import нэмэх:

```ts
import { xoLabel } from "@/xo/labels";
```

мөр 118:

```tsx
            aria-label={labels[segment - 1] ? xoLabel(labels[segment - 1]) : `Step ${segment}`}
```

(`Step ${segment}` template-ийг T1 transform өмнөх шигээ барина; "Step {{segment}}" түлхүүр аль хэдийн байгаа.)

- [ ] **Step 4: Шалгах**

Run: `pnpm exec vitest run ui/src/components/onboarding && pnpm xo:i18n:check && (cd ui && pnpm exec tsc --noEmit)`
Expected: бүгд PASS; check-д "гараар:" мөр шинээр гарахгүй.

- [ ] **Step 5: Commit**

```bash
git add ui/src/components/onboarding/CredentialModeLink.tsx ui/src/components/onboarding/ModelSourceTiles.tsx ui/src/components/onboarding/Stepper.tsx ui/src/components/onboarding/CredentialTag.xo.test.tsx
git commit -m "fix(xo): translate onboarding credential and step labels

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: QuestionForm ба PropertiesPanel-ийг T1-д

**Files:**
- Modify: `scripts/xo-i18n/tiers.ts` (`// Хуудсууд` хэсгийн өмнө шинэ бүлэг)
- Modify: `ui/src/components/task-chat/QuestionForm.tsx:64-100,418,434,452,494,601,674` (+ import)
- Modify: `ui/src/i18n/xo/en.json`, `mn.json`
- Test: `ui/src/components/task-chat/QuestionForm.xo.test.ts` (шинэ)

**Interfaces:**
- Consumes: байхгүй. Produces: байхгүй (дотоод засвар).

- [ ] **Step 1: tiers.ts-д нэмэх**

`// Хуудсууд` мөрийн өмнө:

```ts
  // Ү3-Б үлдэгдэл
  "ui/src/components/task-chat/QuestionForm.tsx",
  "ui/src/components/PropertiesPanel.tsx",
```

- [ ] **Step 2: Failing check-ийг харах**

Run: `pnpm xo:i18n:extract; pnpm xo:i18n:check`
Expected: FAIL — QuestionForm-ын шинэ орчуулаагүй түлхүүрүүд ба/эсвэл "гараар:" мөр (494-р мөрийн `{page + 1} of {…}`). Гарсан "гараар:" мөрийг тэмдэглэж ав.

- [ ] **Step 3: Failing unit test (answerError)**

answerError export хийгдсэн эсэхийг `grep -n "function answerError" ui/src/components/task-chat/QuestionForm.tsx`-ээр шалга. Export-гүй бол тест бичихгүй, Step 7-ийн browser шалгалтад шилжүүл. Export-той бол:

```ts
// ui/src/components/task-chat/QuestionForm.xo.test.ts
import { afterEach, expect, it } from "vitest";
import { i18n } from "@/i18n";
import { answerError } from "./QuestionForm";

afterEach(async () => {
  await i18n.changeLanguage("en");
});

it("mn дээр шаардлагатай асуултын алдаа монгол", async () => {
  await i18n.changeLanguage("mn");
  const question = { id: "q1", prompt: "Q", required: true } as Parameters<typeof answerError>[0];
  expect(answerError(question, undefined as never)).toBe("Энэ асуултад заавал хариулна.");
});
```

(answerError-ийн бодит гарын үсгийг файлаас уншаад `question`, хариултын аргументыг тааруул.)

- [ ] **Step 4: Transform барихгүй мөрүүдийг tx() болгох**

Файлын эхэнд import нэмэх:

```ts
import { tx } from "@/i18n/xo";
```

answerError доторх return-ууд (64-100):

```ts
return tx("This question is required.");
return tx("Enter a custom answer.");
return tx("Enter at least {{minLength}} characters.", { minLength });
return tx("Enter no more than {{maxLength}} characters.", { maxLength });
return tx("This question has an unsupported validation pattern.");
return tx("Use the requested format.");
// `Enter a valid ${inputType}.` — inputType нь зөвхөн "number" | "integer":
return inputType === "integer" ? tx("Enter a valid integer.") : tx("Enter a valid number.");
return tx("Enter a value of at least {{minimum}}.", { minimum });
return tx("Enter a value no greater than {{maximum}}.", { maximum });
```

мөр 418:

```ts
setError(tx("Question {{n}} needs an answer before you can send.", { n: invalidIndex + 1 }));
```

мөр 434, 452:

```ts
setError(tx("The answers could not be submitted."));
setError(tx("The questions could not be cancelled."));
```

(Хэрэв эх нь `err instanceof Error ? err.message : "…"` хэлбэртэй бол зөвхөн англи литералыг tx()-д ороо.)

мөр 494: `{page + 1} of {questionSet.questions.length}` →

```tsx
{tx("{{page}} of {{total}}", { page: page + 1, total: questionSet.questions.length })}
```

мөр 601, 674 (attachAriaLabel prop allowlist-д байхгүй): template-ийг tx()-ээр солих. Жишээ (бодит template-ийг уншаад англи үгийг нь хадгал):

```tsx
attachAriaLabel={tx("Attach files to answer for {{prompt}}", { prompt: question.prompt })}
```

- [ ] **Step 5: Каталог**

Run: `pnpm xo:i18n:extract && pnpm xo:i18n:todo ui/src/components/task-chat/QuestionForm.tsx && pnpm xo:i18n:todo ui/src/components/PropertiesPanel.tsx`

`/private/tmp/xo-y3b-left-t3.json`-д todo-д гарсан бүх түлхүүрийг орчуул. Доорх утгуудыг заавал ашигла:

```json
{
  "This question is required.": "Энэ асуултад заавал хариулна.",
  "Enter a custom answer.": "Өөрийн хариултаа оруулна уу.",
  "Enter at least {{minLength}} characters.": "Хамгийн багадаа {{minLength}} тэмдэгт оруулна уу.",
  "Enter no more than {{maxLength}} characters.": "{{maxLength}} тэмдэгтээс ихгүй оруулна уу.",
  "This question has an unsupported validation pattern.": "Энэ асуултын шалгах загварыг дэмжихгүй байна.",
  "Use the requested format.": "Шаардсан хэлбэрээр оруулна уу.",
  "Enter a valid integer.": "Зөв бүхэл тоо оруулна уу.",
  "Enter a valid number.": "Зөв тоо оруулна уу.",
  "Enter a value of at least {{minimum}}.": "Хамгийн багадаа {{minimum}} утга оруулна уу.",
  "Enter a value no greater than {{maximum}}.": "{{maximum}}-ээс ихгүй утга оруулна уу.",
  "Question {{n}} needs an answer before you can send.": "Илгээхээс өмнө {{n}}-р асуултад хариулна уу.",
  "The answers could not be submitted.": "Хариултуудыг илгээж чадсангүй.",
  "The questions could not be cancelled.": "Асуултуудыг цуцалж чадсангүй.",
  "{{page}} of {{total}}": "{{total}}-аас {{page}}",
  "No answer": "Хариулаагүй",
  "Question pagination": "Асуултын хуудаслалт",
  "Previous question": "Өмнөх асуулт",
  "Next question": "Дараагийн асуулт",
  "Write an answer": "Хариулт бичих",
  "Write your answer": "Хариултаа бичнэ үү",
  "Filter choices": "Сонголт шүүх",
  "Filter choices for {{prompt}}": "Сонголт шүүх: {{prompt}}",
  "Other": "Бусад",
  "Type your answer": "Хариултаа бичнэ үү",
  "Skip": "Алгасах",
  "Submit answers": "Хариулт илгээх"
}
```

(«{{maximum}}-ээс» нь тоо тул тоон дагаврыг зөвшөөрнө — "{{spend}} of {{budget}}"-ийн загвартай ижил. Аль хэдийн орчуулагдсан түлхүүрийг merge дарж бичихгүйн тулд todo-д гараагүйг файлд бүү оруул.)

Run: `pnpm xo:i18n:merge /private/tmp/xo-y3b-left-t3.json && pnpm xo:i18n:check`
Expected: PASS, "гараар:" мөр үгүй.

- [ ] **Step 6: Тест**

Run: `pnpm exec vitest run ui/src/components/task-chat ui/src/components/PropertiesPanel.test.tsx ui/src/i18n/xo/parity.test.ts && pnpm xo:i18n:test && (cd ui && pnpm exec tsc --noEmit)`
Expected: PASS (en тестүүд англи хэвээр, учир нь en дээр tx(key) = key).

- [ ] **Step 7: Commit**

```bash
git add scripts/xo-i18n/tiers.ts ui/src/components/task-chat/QuestionForm.tsx ui/src/i18n/xo/en.json ui/src/i18n/xo/mn.json
git add ui/src/components/task-chat/QuestionForm.xo.test.ts  # Step 3-т үүссэн бол
git commit -m "feat(xo): translate QuestionForm and PropertiesPanel

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Байгууллага сонгогч, төсвийн scope, статус шошго

**Files:**
- Modify: `ui/src/components/SidebarCompanyMenu.tsx:278`, `ui/src/components/SidebarCompanyMenu.production.tsx:282`
- Modify: `ui/src/pages/Costs.tsx:944`, `ui/src/pages/Costs.production.tsx:915`
- Modify: `ui/src/components/StatusIcon.tsx:10-12`, `ui/src/components/KanbanBoard.tsx:133-135`, `ui/src/components/StatusBadge.tsx:38`, `ui/src/components/ActivityCharts.tsx:291`, `ui/src/components/ActivityFeed.tsx:674`, `ui/src/components/NewIssueDialog.tsx:271` (buildStatusOptions)
- Test: `ui/src/xo/labels.test.ts` (Task 1) хүрэлцэнэ; нэмэлт: `ui/src/components/StatusIcon.xo.test.tsx`

**Interfaces:**
- Consumes: `xoStatusLabel(status: string, english: string): string` (Task 1).

- [ ] **Step 1: Failing test (StatusIcon)**

StatusIcon-ийн export-ыг шалга (`grep -n "^export" ui/src/components/StatusIcon.tsx`), дараа нь:

```tsx
// ui/src/components/StatusIcon.xo.test.tsx
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
```

(StatusIcon-д заавал prop байвал StatusIcon.test.tsx дахь render-ийн props-ыг хуул.)

Run: `pnpm exec vitest run ui/src/components/StatusIcon.xo.test.tsx`
Expected: FAIL — "In Review" агуулсан.

- [ ] **Step 2: Статусын call site (en-д яг хуучин текст)**

StatusIcon.tsx ба KanbanBoard.tsx — import нэмж, helper-ийн биеийг:

```ts
import { xoStatusLabel } from "@/xo/labels";

function statusLabel(status: string): string {
  return xoStatusLabel(status, status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()));
}
```

StatusBadge.tsx:38:

```tsx
      {label ?? xoStatusLabel(status, status.replace(/[_-]/g, " "))}
```

ActivityCharts.tsx:291:

```tsx
      <ChartLegend items={statusOrder.map(s => ({ color: statusColors[s] ?? "var(--hex-6b7280)", label: xoStatusLabel(s, statusLabels[s] ?? s) }))} />
```

ActivityFeed.tsx:674 (`{label}` → value-ээр биш англи шошгоор нормчилно; "All" нь статус биш тул english буцна, түүнийг "All" түлхүүрээр каталогт байгаа эсэхийг шалга):

```tsx
                    {xoStatusLabel(label, label)}
```

NewIssueDialog.tsx — buildStatusOptions-ийн `return [ … ];`-г:

```ts
  return [
    /* …байгаа элементүүд өөрчлөгдөхгүй… */
  ].map((option) => ({ ...option, label: xoStatusLabel(option.value, option.label) }));
```

(Массивыг `const options = [...]` болгож `return options.map(...)` бичиж болно; төрөл `ReadonlyArray<{ value; label; color; description? }>` хэвээр.) `description: "Executable - assignee will be woken"` мэт тайлбар энэ даалгаврын хүрээнд орохгүй — SYNC.md-д үлдэгдэл гэж тэмдэглэ.

- [ ] **Step 3: switcherNoun**

SidebarCompanyMenu.tsx:278 (T1, tx-ийг шууд дуудаж байгаа тул import нэм):

```ts
import { tx } from "@/i18n/xo";
// …
  const switcherNoun = tx("organization");
```

SidebarCompanyMenu.production.tsx:282:

```ts
  const switcherNoun = isCloud ? tx("organization") : tx("company");
```

mn: "organization" → «байгууллага» (байгаа), "company" → «байгууллага» (шийдвэр 5; todo-д гарвал merge хий). "Open {{currentName}} {{switcherNoun}} switcher" г.м. утгууд дагаваргүй тул өөрчлөхгүй.

- [ ] **Step 4: Төсвийн scope**

Costs.tsx:944:

```tsx
                          {tx("{{scope}} budgets", { scope: scopeType === "company" ? tx("organization") : scopeType === "agent" ? tx("agent") : tx("project") })}
```

Costs.production.tsx:915 (T1; `{scopeType} budgets` нь "{{scopeType}} budgets" түлхүүр болж англи enum орж байсан):

```tsx
                        <h2 className="text-lg font-semibold capitalize">{tx("{{scope}} budgets", { scope: scopeType === "company" ? tx("organization") : scopeType === "agent" ? tx("agent") : tx("project") })}</h2>
```

Файлд `import { tx } from "@/i18n/xo";` байхгүй бол нэм. "{{scopeType}} budgets" нь extract-д orphan болж хасагдана.

- [ ] **Step 5: Каталог**

Run: `pnpm xo:i18n:extract && pnpm xo:i18n:todo ui/src`
`/private/tmp/xo-y3b-left-t4.json`:

```json
{
  "company": "байгууллага",
  "project": "төсөл"
}
```

(todo-д гарсан бусад шинэ түлхүүр байвал нэм.) "{{scope}} budgets"-ийн утгыг Task 5 засна.

Run: `pnpm xo:i18n:merge /private/tmp/xo-y3b-left-t4.json && pnpm xo:i18n:check`
Expected: PASS.

- [ ] **Step 6: Тест**

Run: `pnpm exec vitest run ui/src/components/StatusIcon.xo.test.tsx ui/src/components/StatusBadge.test.tsx ui/src/components/SidebarCompanyMenu.test.tsx ui/src/components/Sidebar.test.tsx ui/src/xo && (cd ui && pnpm exec tsc --noEmit)`
Expected: PASS (en тестүүдийн англи текст өөрчлөгдөөгүй).

- [ ] **Step 7: Commit**

```bash
git add ui/src/components/SidebarCompanyMenu.tsx ui/src/components/SidebarCompanyMenu.production.tsx ui/src/pages/Costs.tsx ui/src/pages/Costs.production.tsx ui/src/components/StatusIcon.tsx ui/src/components/KanbanBoard.tsx ui/src/components/StatusBadge.tsx ui/src/components/ActivityCharts.tsx ui/src/components/ActivityFeed.tsx ui/src/components/NewIssueDialog.tsx ui/src/components/StatusIcon.xo.test.tsx ui/src/i18n/xo/en.json ui/src/i18n/xo/mn.json
git commit -m "fix(xo): translate status labels, switcher noun and budget scopes

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Монгол дагаврын засвар (label, scope, noun)

«Байгууллага-г хураах» нь эндээс гарч байна: Sidebar.tsx:240 `label="Org"` → «Байгууллага» + "Collapse {{label}}" → «{{label}}-г хураах» (SidebarSection.tsx:163).

**Files:**
- Modify: `ui/src/i18n/xo/mn.json` (зөвхөн утга)
- Test: `ui/src/i18n/xo/suffix.test.ts` (шинэ)

- [ ] **Step 1: Failing test**

```ts
// ui/src/i18n/xo/suffix.test.ts
import { describe, expect, it } from "vitest";
import mn from "./mn.json";

const FIXED: Record<string, string> = {
  "{{label}} actions": "{{label}} хэсгийн үйлдлүүд",
  "Collapse {{label}}": "{{label}} хэсгийг хураах",
  "Expand {{label}}": "{{label}} хэсгийг дэлгэх",
  "New task in {{label}}": "Шинэ даалгавар: {{label}}",
  "{{scope}} budgets": "{{scope}} түвшний төсөв",
  "Resume the agent to generate this {{noun}}.": "Агентыг үргэлжлүүлбэл энэ {{noun}} үүснэ.",
};

describe("mn дагавар (Ү3-Б үлдэгдэл)", () => {
  it.each(Object.entries(FIXED))("%s нь хувьсагчид дагавар залгахгүй", (key, value) => {
    const actual = (mn as Record<string, string>)[key];
    expect(actual).toBe(value);
    expect(actual).not.toMatch(/\}\}-[а-яөүё]/);
  });
});
```

Run: `pnpm exec vitest run ui/src/i18n/xo/suffix.test.ts`
Expected: FAIL (6 тохиолдол).

- [ ] **Step 2: mn.json утгыг засах**

`/private/tmp/xo-y3b-left-t5.json`-д дээрх FIXED объектыг яг хуулж бичээд:

Run: `pnpm xo:i18n:merge /private/tmp/xo-y3b-left-t5.json && pnpm xo:i18n:check`

("{{scopeType}} budgets" Task 4-ийн дараа orphan болж хасагдсан байх ёстой: `grep -c '{{scopeType}} budgets' ui/src/i18n/xo/mn.json` → 0.)

- [ ] **Step 3: Тест**

Run: `pnpm exec vitest run ui/src/i18n/xo`
Expected: PASS (parity: placeholder ижил).

- [ ] **Step 4: Үлдсэн дагаврын тоо (мэдээлэл)**

Run: `grep -cE '\}\}-[а-яөүё]+' ui/src/i18n/xo/mn.json`
Expected: засварын өмнөх 52-оос бага. Үлдсэн нь ({{name}}-г, {{brand}}-д г.м.) энэ үе шатны хүрээнээс гадуур; тоог PROGRESS-д тэмдэглэ.

- [ ] **Step 5: Commit**

```bash
git add ui/src/i18n/xo/mn.json ui/src/i18n/xo/suffix.test.ts
git commit -m "fix(xo): mn suffixes for section label, budget scope and noun

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: IssueDetail 404 — монгол «олдсонгүй»

**Оношилгоо (код уншсанаар):** IssueDetail.tsx:2999-3014 нь `getIssueDetailQueryOptions`-ыг `placeholderData`-тай дууддаг (issueDetailCache.ts:131-135). 404 үед:
- placeholder байхгүй бол React Query-ийн анхдагч retry (3 удаа, backoff ~7 сек) дуустал `isLoading` үнэн → зөвхөн skeleton;
- дараа нь мөр 6677 `error.message`-ийг жижиг улаан `<p>`-ээр харуулна (ApiError.message нь сервер мессежийн орчуулга, жишээ нь «Ажил олдсонгүй»), хуудас бараг хоосон харагдана;
- `!issue` (мөр 6678) нь зөвхөн issueId/draft байхгүй үед.
Хамгийн бага засвар: 404-ийг тусгайлан танин «Task not found» (T1 transform conditional салбарыг барина) харуулах. Retry-г өөрчлөхгүй (upstream зан төлөв), browser-ийн алхамд хугацааг тэмдэглэнэ.

**Files:**
- Modify: `ui/src/pages/IssueDetail.tsx:6677` (ApiError аль хэдийн import хийгдсэн — мөр 2548 ашигладаг)
- Test: `ui/src/pages/IssueDetail.test.tsx`

- [ ] **Step 1: Failing test**

`describe("IssueDetail", …)` дотор (1563-р мөрийн тестийн дараа):

```tsx
  it("shows a not-found message when the task returns 404", async () => {
    mockIssuesApi.get.mockRejectedValue(new ApiError("Issue not found", 404, null));

    await act(async () => {
      root.render(
        <QueryClientProvider client={queryClient}>
          <IssueDetail />
        </QueryClientProvider>,
      );
    });
    await flushReact();
    await flushReact();

    expect(container.textContent).toContain("Task not found");
  });
```

(Тестийн queryClient retry:false биш бол `queryClient.setDefaultOptions({ queries: { retry: false } })`-ийг render-ийн өмнө дууд.)

Run: `pnpm exec vitest run ui/src/pages/IssueDetail.test.tsx -t "not-found"`
Expected: FAIL — "Issue not found" гарч "Task not found" байхгүй.

- [ ] **Step 2: Засвар**

Мөр 6677:

```tsx
  if (error)
    return (
      <p className="text-sm text-destructive">
        {error instanceof ApiError && error.status === 404 ? "Task not found" : error.message}
      </p>
    );
```

- [ ] **Step 3: Каталог**

Run: `pnpm xo:i18n:extract && pnpm xo:i18n:todo ui/src/pages/IssueDetail.tsx`
`/private/tmp/xo-y3b-left-t6.json`:

```json
{ "Task not found": "Даалгавар олдсонгүй" }
```

Run: `pnpm xo:i18n:merge /private/tmp/xo-y3b-left-t6.json && pnpm xo:i18n:check`
Expected: PASS.

- [ ] **Step 4: Тест**

Run: `pnpm exec vitest run ui/src/pages/IssueDetail.test.tsx && (cd ui && pnpm exec tsc --noEmit)`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add ui/src/pages/IssueDetail.tsx ui/src/pages/IssueDetail.test.tsx ui/src/i18n/xo/en.json ui/src/i18n/xo/mn.json
git commit -m "fix(xo): show not-found message for missing task

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: SYNC.md, бүрэн шалгалт, browser (127.0.0.1:3110)

**Files:**
- Modify: `docs/xo/SYNC.md`
- Modify: `docs/xo/PROGRESS.md` (байхгүй бол өмнөх төлөвлөгөөний PROGRESS байрлалыг ашигла)

- [ ] **Step 1: SYNC.md-д хэсэг нэмэх** ("Ү3-Б-д хөндсөн upstream файлууд"-ын дараа)

```markdown
## Ү3-Б үлдэгдэлд хөндсөн upstream файлууд

| Файл | Өөрчлөлт |
|---|---|
| ui/src/components/onboarding/CredentialModeLink.tsx | LINK_LABEL-г xoLabel()-ээр ороосон, import |
| ui/src/components/onboarding/ModelSourceTiles.tsx | CREDENTIAL_TAG_LABEL-г xoLabel()-ээр, import |
| ui/src/components/onboarding/Stepper.tsx | алхмын aria-label xoLabel(), import |
| ui/src/components/task-chat/QuestionForm.tsx | T1-д нэмсэн; answerError/setError/хуудаслалт/attachAriaLabel tx() |
| ui/src/components/PropertiesPanel.tsx | T1-д нэмсэн (кодын өөрчлөлтгүй) |
| ui/src/components/SidebarCompanyMenu.tsx | switcherNoun = tx("organization") |
| ui/src/components/SidebarCompanyMenu.production.tsx | switcherNoun tx() |
| ui/src/pages/Costs.tsx | scope нэр үгийг tx() |
| ui/src/pages/Costs.production.tsx | "{scopeType} budgets" → tx("{{scope}} budgets") |
| ui/src/components/StatusIcon.tsx | statusLabel → xoStatusLabel() |
| ui/src/components/KanbanBoard.tsx | statusLabel → xoStatusLabel() |
| ui/src/components/StatusBadge.tsx | анхдагч шошго xoStatusLabel() |
| ui/src/components/ActivityCharts.tsx | легенд xoStatusLabel() |
| ui/src/components/ActivityFeed.tsx | шүүлтүүрийн шошго xoStatusLabel() |
| ui/src/components/NewIssueDialog.tsx | buildStatusOptions label xoStatusLabel() (description англиар үлдсэн) |
| ui/src/pages/IssueDetail.tsx | 404 үед "Task not found" |

XO-ийн өмч (upstream биш): ui/src/xo/labels.ts, scripts/xo-i18n/tiers.ts, ui/src/i18n/xo/*.
```

- [ ] **Step 2: Бүрэн шалгалт**

```bash
pnpm xo:i18n:check
pnpm xo:i18n:test
pnpm xo:i18n:typecheck
pnpm exec vitest run ui/src/i18n ui/src/xo ui/src/components/onboarding ui/src/components/task-chat ui/src/components/StatusBadge.test.tsx ui/src/components/SidebarCompanyMenu.test.tsx ui/src/components/SidebarSection.test.tsx ui/src/components/Sidebar.test.tsx ui/src/components/PropertiesPanel.test.tsx ui/src/pages/IssueDetail.test.tsx
(cd ui && pnpm exec tsc --noEmit)
pnpm xo:brand-scan
```

Expected: бүгд PASS; brand-scan baseline-аас өсөөгүй.

- [ ] **Step 3: 3110 instance-ийн төлөв (зогсоохгүй, дахин эхлүүлэхгүй)**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3110/
ps -o lstart= -p "$(lsof -ti tcp:3110 | head -1)"
git log -1 --format=%cd
```

3110 нь `scripts/dev-runner.ts dev`-ээр 09:31-ээс ажиллаж байгаа (Vite dev, UI HMR). UI өөрчлөлт HMR-ээр орох ёстой; tiers.ts (Vite plugin-ийн T1 жагсаалт) өөрчлөгдсөн тул QuestionForm/PropertiesPanel transform-д орохгүй байж болно. Хуудас шинэ кодыг харуулахгүй байвал (жишээ нь QuestionForm англиар) **controller ED-ээс дахин эхлүүлэх зөвшөөрөл авна** — өөрөө restart хийхгүй, үр дүнг PROGRESS-д "хүлээгдэж буй" гэж тэмдэглэ.

- [ ] **Step 4: Browser шалгалт (get_page_text / read_page, screenshot зөвхөн эцэст)**

mn locale-тэй (localStorage XO_LOCALE_STORAGE_KEY = "mn") дараах хуудсуудыг шалга:
1. Sidebar: "Байгууллага" хэсгийн хураах товчны aria-label «Байгууллага хэсгийг хураах» (`find "хураах"`), «Байгууллага-г» хаана ч байхгүй (`get_page_text`-д "-г хураах" хайх). Байгууллага сонгогчийн aria-label-д "organization" англи үг байхгүй.
2. /issues: Kanban багана, статус icon-ы aria-label «Хийх / Хийгдэж буй / Хянагдаж буй / Дууссан».
3. /costs: төсвийн гарчиг «байгууллага түвшний төсөв» г.м., "company budgets" байхгүй.
4. Байхгүй task руу (жишээ /issues/XXX-999999): «Даалгавар олдсонгүй» гарах хүртэлх хугацааг тэмдэглэ (retry ~7 сек хүлээгдэнэ).
5. Onboarding (боломжтой бол): «Захиалга», «Оронд нь API түлхүүр ашиглах».
6. QuestionForm-тэй task (байвал): «Хариулт илгээх», «{{total}}-аас {{page}}».
en рүү сэлгээд дээрхийн англи текст өмнөхтэйгээ ижил байгааг 1-2 хуудсанд нягтал.

- [ ] **Step 5: PROGRESS ба commit**

PROGRESS-д: task бүрийн commit SHA, шалгалтын үр дүн, 3110-ын төлөв (restart шаардлагатай эсэх), үлдсэн дагаврын тоо (Task 5 Step 4), NewIssueDialog description англиар үлдсэн.

```bash
git add docs/xo/SYNC.md docs/xo/PROGRESS.md
git commit -m "docs(xo): record Y3-B leftovers upstream touches and verification

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
find .git/refs -name '* 2*'
```

Push хийхгүй — ED зөвшөөрөл хүлээнэ.

---

## Хязгаарлалт ба нээлттэй асуулт

- ED-ийн шийдвэр шаардлагатай: 3110 instance tiers.ts-ийн өөрчлөлтийг авахгүй бол restart хийх эсэх.
- answerError, attachAriaLabel-ийн яг template-ийг хэрэгжүүлэгч файлаас уншиж англи үгийг хадгална (дээрх жишээ нь хэлбэр).
- {{name}}-г, {{brand}}-д зэрэг бусад ~45 дагавартай мөр хүрээнээс гадуур (шийдвэр 3: зөвхөн SidebarSection/scope/noun).
- pipeline-breakdown.ts-ийн `${noun}` өгүүлбэрүүд (T1 бус, "Paperclip will create…") хүрээнээс гадуур.
- Retry-ийн хугацааг (404 үед ~7 сек skeleton) upstream зан төлөв гэж үлдээв.
