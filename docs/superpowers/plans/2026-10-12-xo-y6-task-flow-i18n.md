# Ү6 7.1 даалгаврын урсгалын орчуулга Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** mn хэл дээр даалгаврын жагсаалт, шинэ даалгаврын цонх, даалгаврын шинж чанар, task chat (composer, turn, run pill, activity) болон issue chat-ын харагдах англи мөрүүдийг монгол болгох.

**Architecture:** Файлыг scripts/xo-i18n/tiers.ts T1-д нэмж, JSX текст ба allowlist атрибутыг Babel transform-оор орчуулна. Transform барихгүй мөрийг (return, дуудлагын аргумент, холимог JSX, template-ийн олон тоо) upstream файлд тодорхой tx() дуудлагаар солино. Давтагддаг хэсгийг XO-ийн өмч болох ui/src/xo/*-д helper болгоно: mnTimeAgo (time-ago.ts), олон тоо ба хугацааны текст (run-text.ts), файлын төрөл ба activity шошго (labels.ts).

**Tech Stack:** React 19 + Vite, i18next (ns "xo", tx() = ui/src/i18n/xo.ts), Babel transform (scripts/xo-i18n/transform.ts, ui/vite.config.ts дахь xoI18nTransformPlugin), vitest, pnpm.

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
- Хамрах хүрээнээс гадуур (Ү6/T2): TweakPanel, motion-tokens, task-chat-states, task-chat-fixtures, task-chat-attachments (файлын төрлийн шошгыг render үед `xoFileKindLabel()`-ээр орчуулна, файлыг өөрчлөхгүй), RunTranscriptView, routine-run-display, DesignGuide.
- Үг сонголт (заавал): run «ажиллагаа»; runner «гүйцэтгэгч»; board «Удирдах зөвлөл»; sub-task «дэд даалгавар»; revision «хувилбар»; steering «чиглүүлэлт»; Auto/Plan/Ask mode «Авто/Төлөвлөх/Асуух горим»; provider «үйлчилгээ үзүүлэгч»; tokens «токен»; агент «агент»; нэр үг «Байгууллага»; статус: backlog «Нөөц», todo «Хийх», in_progress «Хийгдэж буй», in_review «Хянагдаж буй», done «Дууссан», cancelled «Цуцалсан», blocked «Саатсан».
- Дагавар: хувьсагч + тогтмол нэр үг + дагавар («{{label}} хэсгийг хураах»); эгшгийн зохицлын helper бичихгүй. Хугацааг хаалтаар өгнө: «Амжилтгүй болсон ({{duration}})».
- Олон тоо: `n === 1 ? tx("… {{n}} item") : tx("… {{n}} items")` хэлбэрээр тусдаа литерал түлхүүр сонгоно. Interpolation хувьсагчийг `count` гэж нэрлэхгүй (i18next-ийн plural тааруулалттай мөргөлдөнө); `n`, `shown`, `total` гэх мэт нэр хэрэглэ.
- `{{placeholder}}` бүрэлдэхүүн en ба mn утгад яг ижил байх ёстой (parity.test.ts, cli.ts:278 шалгана).

## Механизмын тэмдэглэл (хэрэгжүүлэгчид)

- Каталогийн түлхүүр = англи текст. Шинэ mn утга оруулах дараалал: `pnpm xo:i18n:extract` → `pnpm xo:i18n:todo <prefix>` (mn==en түлхүүрүүд JSON-оор гарна) → scratch JSON бичих → `pnpm xo:i18n:merge <file.json>` → `pnpm xo:i18n:check`. Scratch JSON-г repo-д commit хийхгүй (`/private/tmp/xo-y6-tN.json`).
- T1 transform нь JSX текст, allowlist attribute/prop (title, label, placeholder, description, aria-label, alt, …), функц доторх `label:`/`title:`, энгийн template, conditional салбар, `??`/`||` баруун талыг барина. Барихгүй: return string, const initializer, модулийн түвшний Record/массив, дуудлагын аргумент (`parts.push(...)`, `setError(...)`), `page + 1` мэт нийлмэл илэрхийлэл. Холимог тохиолдол "гараар:" гэж check-д унана.
- T1 файлд tx-ийг шууд дуудвал `import { tx } from "@/i18n/xo";`-г өөрөө нэм (transform зөвхөн өөрөө засвар хийсэн үед import нэмдэг, байгаа import-ыг давхардуулахгүй — transform.ts:573-612).
- T1 бус ui/src/**/*.ts(x) доторх `tx("literal")` дуудлага extract-д автоматаар орно; `tx(variable)` орохгүй.
- Тест дотор mn утга шалгах: `await i18n.changeLanguage("mn")`, afterEach-д `await i18n.changeLanguage("en")` (ui/src/i18n/xo.test.ts загвар).
- Тестийн орчны locale нь "en". `localeTag()` (ui/src/xo/locale.ts:37) нь `resolveLocale()`-оор localStorage-ийн `XO_LOCALE_STORAGE_KEY`-г уншдаг: mn шалгахдаа `localStorage.setItem(XO_LOCALE_STORAGE_KEY, "mn")`, afterEach-д `localStorage.removeItem(XO_LOCALE_STORAGE_KEY)` (ui/src/xo/locale.test.ts загвар).
- T1 transform нь vite plugin (ui/vite.config.ts-ийн `xoI18nTransformPlugin`); unit тестэд tier-ээр орчуулагдсан JSX текстийг mn гэж шалгахгүй. Гараар бичсэн tx() ба helper-ийн mn утгыг л тестэл.
- Inline markup-тай өгүүлбэр (`<span>` дотор үг) бол `XoTrans`-ыг ашигла: `import { XoTrans } from "@/xo/XoTrans";`, `<XoTrans i18nKey="… <b>Word</b> …" components={{ b: <span className="font-medium" /> }} />`. mn утга ижил `<b>` тэмдэгтэй байна.
- Locale guard: en дээр англи текстийг өөрчлөхгүйн тулд түлхүүр нь англи текстээс өөр helper (`tx("Archive (file type)")`) эхэндээ `if (!(i18n.resolvedLanguage ?? i18n.language ?? "").startsWith("mn")) return english;` шалгана (`import { i18n } from "@/i18n";`). Түлхүүр = англи текст бол guard хэрэггүй (en дээр tx(key) = key).
- mn дээр англиар үлдэх ёстой түлхүүрийг (жишээ "id", "PR") ui/src/i18n/xo/keep-en.json-д нэм; todo жагсаалтаас тэд арилна.
- Merge хийхдээ зөвхөн тухайн task-ийн `pnpm xo:i18n:todo` гаралтад гарсан түлхүүрийг scratch JSON-д оруул. Каталогт аль хэдийн байгаа түлхүүрийг `grep -F '"Literal"' ui/src/i18n/xo/en.json`-ээр шалгаад, байгаа бол дахин бүү бич. Аль хэдийн байгаа: "Instructions" «Заавар», "No answer" «Хариулаагүй», "Archive" «Архивлах» (үйл үг; файлын төрөлд "Archive (file type)" түлхүүр).
- Task бүрийн төгсгөлд `pnpm xo:i18n:check` гаралтад тухайн task-ийн файлын "гараар:" мөр нэг ч үлдэхгүй. Үлдвэл тэр мөрийг tx()-ээр ороож засна.

## File Structure

| Файл | Үүрэг | Task |
|---|---|---|
| scripts/xo-i18n/tiers.ts (XO) | «// Ү6 7.1 даалгаврын урсгал» бүлэг | 1-7 |
| ui/src/xo/time-ago.ts (шинэ, XO) | `mnTimeAgo(seconds)` | 1 |
| ui/src/xo/time-ago.test.ts (шинэ, XO) | mnTimeAgo-ийн тест | 1 |
| ui/src/lib/timeAgo.ts | mn үед mnTimeAgo руу дамжуулах | 1 |
| ui/src/lib/timeAgo.test.ts (шинэ) | en/mn тест | 1 |
| ui/src/components/IssuesList.tsx, IssueFiltersPopover.tsx, IssueColumns.tsx, MobileBottomNav.tsx | T1 + гар tx | 1 |
| docs/xo/glossary.md (XO) | Ү6 7.1-ийн шинэ нэр томьёо | 1 |
| ui/src/components/NewIssueDialog.tsx, issue-properties/helpers.ts | T1 + гар tx/XoTrans | 2 |
| ui/src/lib/work-mode-meta.ts (+ тест) | T1 + titleForPendingWorkMode гар tx | 2 |
| ui/src/components/issue-properties/IssueProperties.tsx, IssuePropertiesArtifactsTab.tsx, IssuePropertiesPlansTab.tsx, external-object-rows.tsx, relation-controls.tsx | T1 + гар tx | 3 |
| ui/src/components/issue-properties/property-picker.tsx | гар tx (T1-д нэмэхгүй) | 3 |
| ui/src/xo/labels.ts (+ тест) (XO) | MODE_DESCRIPTION case, `xoFileKindLabel()` (Task 4), `xoActivityLabel()` (Task 5) | 4, 5 |
| ui/src/components/task-chat/TaskChatComposer.tsx, RichInput, CompactInteractionCard, InteractionCard, ProtocolCard, ProtocolActivityRow, QueuedMessages, BlockerLinks, PausedTakeover, Bubble | T1 + гар tx | 4 |
| ui/src/xo/run-text.ts (шинэ, XO) (+ тест) | олон тоо ба хугацааны текст | 5 |
| ui/src/lib/issue-chat-messages.ts | formatDurationWords (Task 5); runDurationLabel, waitingText гар tx (export хийхгүй), 865, 938, 1108-1112 (Task 7) | 5, 7 |
| ui/src/components/task-chat/TaskChatRunnerTurn, LiveRunPill, Turn, RunnerActivityGroup, StatusPill, UsageReadout, ActivityPhase, transcript-adapter.ts, completed-activity-summary.ts | T1 + гар tx | 5 |
| ui/src/components/task-chat/RichWorkProductCard, RunnerGoalWidget, TaskChatBubbleActions, DescriptionBubble, Marker, PlanPreviewCard, PlanView, ProjectCreatedCard, SystemNotice, ToolCard, TurnStatusIsland, TaskMessageScroller, task-chat-adapter.ts; ui/src/components/TaskChatThread.tsx | T1 + гар tx | 6 |
| ui/src/components/task-chat/TaskChatThreadView.tsx | label харьцуулалтыг tx-тэй (T1-д нэмэхгүй) | 6 |
| ui/src/components/IssueChatThread.tsx, CommentThread.tsx | T1 + гар tx + XoTrans | 7 |
| ui/src/pages/IssueDetail.tsx | stopRunLabel гар tx | 7 |
| ui/src/i18n/xo/en.json, mn.json (XO) | шинэ түлхүүр ба mn утга | 1-7 |
| ui/src/i18n/xo/keep-en.json (XO) | "{{brand}}" | 7 |
| docs/xo/SYNC.md, docs/xo/PROGRESS.md (XO) | upstream файлын бүртгэл, төлөв | 8 |

---

### Task 1: Даалгаврын жагсаалт, timeAgo, глоссари

**Files:**
- Modify: `scripts/xo-i18n/tiers.ts` (`// Хуудсууд` мөрийн өмнө шинэ бүлэг)
- Modify: `ui/src/components/IssuesList.tsx:616-632, 2488-2491` (+ import)
- Modify: `ui/src/components/IssueFiltersPopover.tsx:99-100` (+ import)
- Create: `ui/src/xo/time-ago.ts`, `ui/src/xo/time-ago.test.ts`
- Modify: `ui/src/lib/timeAgo.ts`
- Create: `ui/src/lib/timeAgo.test.ts`
- Modify: `docs/xo/glossary.md` (`## Sidebar-ын 27 түлхүүр` мөрийн өмнө)
- Modify: `ui/src/i18n/xo/en.json`, `mn.json`

**Interfaces:**
- Consumes: `tx(key, options)` (ui/src/i18n/xo.ts), `localeTag()` ба `XO_LOCALE_STORAGE_KEY` (ui/src/xo/locale.ts).
- Produces: `export function mnTimeAgo(seconds: number): string` (ui/src/xo/time-ago.ts). Каталогт `"{{n}} tokens"` түлхүүр (Task 5 дахин ашиглана).

- [ ] **Step 1: tiers.ts-д бүлэг нэмэх**

`// Хуудсууд` мөрийн өмнө:

```ts
  // Ү6 7.1 даалгаврын урсгал
  "ui/src/components/IssuesList.tsx",
  "ui/src/components/IssueFiltersPopover.tsx",
  "ui/src/components/IssueColumns.tsx",
  "ui/src/components/MobileBottomNav.tsx",
```

Дараагийн task-ууд энэ бүлгийн төгсгөлд мөр нэмнэ.

- [ ] **Step 2: Failing check-ийг харах**

Run: `pnpm xo:i18n:extract; pnpm xo:i18n:check`
Expected: FAIL (шинэ түлхүүрүүд mn==en). Эдгээр 4 файлын "гараар:" мөрийг тэмдэглэ.

- [ ] **Step 3: mnTimeAgo-ийн failing тест**

`ui/src/xo/time-ago.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { mnTimeAgo } from "./time-ago";

describe("mnTimeAgo", () => {
  it.each([
    [0, "саяхан"],
    [59, "саяхан"],
    [300, "5 мин өмнө"],
    [10800, "3 ц өмнө"],
    [172800, "2 өдрийн өмнө"],
    [604800, "1 долоо хоногийн өмнө"],
    [1814400, "3 долоо хоногийн өмнө"],
    [5184000, "2 сарын өмнө"],
  ])("%i секунд → %s", (seconds, expected) => {
    expect(mnTimeAgo(seconds)).toBe(expected);
  });
});
```

`ui/src/lib/timeAgo.test.ts`:

```ts
import { afterEach, describe, expect, it } from "vitest";
import { XO_LOCALE_STORAGE_KEY } from "@/xo/locale";
import { timeAgo } from "./timeAgo";

afterEach(() => {
  localStorage.removeItem(XO_LOCALE_STORAGE_KEY);
});

describe("timeAgo", () => {
  it("keeps the English short form in en", () => {
    expect(timeAgo(new Date(Date.now() - 300_000))).toBe("5m ago");
  });

  it("uses the Mongolian form in mn", () => {
    localStorage.setItem(XO_LOCALE_STORAGE_KEY, "mn");
    expect(timeAgo(new Date(Date.now() - 300_000))).toBe("5 мин өмнө");
  });
});
```

Run: `pnpm exec vitest run ui/src/xo/time-ago.test.ts ui/src/lib/timeAgo.test.ts`
Expected: FAIL (`./time-ago` модуль алга; mn тест "5m ago" буцаана).

- [ ] **Step 4: mnTimeAgo ба timeAgo hook**

`ui/src/xo/time-ago.ts`:

```ts
// XO: timeAgo()-ийн Монгол хувилбар. Гаралт Intl.RelativeTimeFormat("mn-MN")-тэй ижил,
// браузерын ICU-ээс хамаарахгүйн тулд загварыг шууд бичсэн.
const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;

export function mnTimeAgo(seconds: number): string {
  if (seconds < MINUTE) return "саяхан";
  if (seconds < HOUR) return `${Math.floor(seconds / MINUTE)} мин өмнө`;
  if (seconds < DAY) return `${Math.floor(seconds / HOUR)} ц өмнө`;
  if (seconds < WEEK) return `${Math.floor(seconds / DAY)} өдрийн өмнө`;
  if (seconds < MONTH) return `${Math.floor(seconds / WEEK)} долоо хоногийн өмнө`;
  return `${Math.floor(seconds / MONTH)} сарын өмнө`;
}
```

`ui/src/lib/timeAgo.ts`: файлын эхэнд

```ts
import { localeTag } from "@/xo/locale";
import { mnTimeAgo } from "@/xo/time-ago";
```

`timeAgo()` дотор `const seconds = Math.round((now - then) / 1000);` мөрийн дараа:

```ts
  if (localeTag() === "mn-MN") return mnTimeAgo(seconds);
```

Бусад мөрийг өөрчлөхгүй.

Run: `pnpm exec vitest run ui/src/xo/time-ago.test.ts ui/src/lib/timeAgo.test.ts`
Expected: PASS.

- [ ] **Step 5: Transform барихгүй мөрүүдийг tx() болгох**

IssuesList.tsx-д `import { tx } from "@/i18n/xo";` нэм (байхгүй бол). 616-624-ийн гурван span-ийн агуулга:

```tsx
            <span className="font-medium text-foreground">
              {tx("{{done}}/{{total}} done", { done: summary.doneCount, total: summary.totalCount })}
            </span>
            <span className="text-muted-foreground">
              {tx("{{n}} in progress", { n: summary.inProgressCount })}
            </span>
            <span className="text-muted-foreground">
              {tx("{{n}} blocked", { n: summary.blockedCount })}
            </span>
```

627-632-ийн title ба tokens:

```tsx
                  title={tx("{{runs}} across {{tasks}}", {
                    runs:
                      costSummary.runCount === 1
                        ? tx("{{n}} run", { n: costSummary.runCount.toLocaleString() })
                        : tx("{{n}} runs", { n: costSummary.runCount.toLocaleString() }),
                    tasks:
                      costSummary.issueCount === 1
                        ? tx("{{n}} sub-task", { n: costSummary.issueCount })
                        : tx("{{n}} sub-tasks", { n: costSummary.issueCount }),
                  })}
                >
                  {tx("{{n}} tokens", { n: formatTokens(totalTokens) })}
```

2488-2491 орчмын нөхцөлт текст:

```tsx
                  : remainingIssueRowCount > 0
                    ? tx("Rendering {{shown}} of {{total}} tasks", {
                        shown: Math.min(renderedIssueRowLimit, filtered.length),
                        total: filtered.length,
                      })
                    : tx("Scroll to load more tasks")}
```

IssueFiltersPopover.tsx 99-100 (+ `import { tx } from "@/i18n/xo";`):

```tsx
        placeholder={tx("Search {{label}}...", { label: label.toLowerCase() })}
        aria-label={tx("Search {{label}}", { label: label.toLowerCase() })}
```

Step 2-т тэмдэглэсэн бусад "гараар:" мөрийг ижил аргаар tx()-д ороо.

- [ ] **Step 6: Каталог**

Run: `pnpm xo:i18n:extract; pnpm xo:i18n:todo ui/src/components/Issue; pnpm xo:i18n:todo ui/src/components/MobileBottomNav`

Гаралтын түлхүүрүүдийг `/private/tmp/xo-y6-t1.json`-д mn утгатай бич. Доорх утгуудыг заавал ашигла:

```json
{
  "{{done}}/{{total}} done": "{{done}}/{{total}} дууссан",
  "{{n}} in progress": "{{n}} хийгдэж буй",
  "{{n}} blocked": "{{n}} саатсан",
  "{{runs}} across {{tasks}}": "{{tasks}} дээр нийт {{runs}}",
  "{{n}} run": "{{n}} ажиллагаа",
  "{{n}} runs": "{{n}} ажиллагаа",
  "{{n}} sub-task": "{{n}} дэд даалгавар",
  "{{n}} sub-tasks": "{{n}} дэд даалгавар",
  "{{n}} tokens": "{{n}} токен",
  "Rendering {{shown}} of {{total}} tasks": "Харуулж буй даалгавар: {{shown}} / {{total}}",
  "Scroll to load more tasks": "Илүү олон даалгавар ачаалахын тулд гүйлгэнэ үү",
  "Search {{label}}...": "Хайх: {{label}}...",
  "Search {{label}}": "Хайх: {{label}}",
  "Reset defaults": "Анхны тохиргоонд буцаах",
  "status, id, updated": "төлөв, id, шинэчилсэн"
}
```

Үлдсэн түлхүүрийг Global Constraints-ийн үг сонголтоор орчуул. todo-д гараагүйг файлд бүү оруул.

Run: `pnpm xo:i18n:merge /private/tmp/xo-y6-t1.json && pnpm xo:i18n:check`
Expected: PASS, эдгээр 4 файлын "гараар:" мөр үгүй.

- [ ] **Step 7: Глоссари**

docs/xo/glossary.md-ийн `## Sidebar-ын 27 түлхүүр` мөрийн өмнө:

```markdown
## Ү6 7.1-д нэмсэн (ED хянах)

| en | mn | Тэмдэглэл |
|---|---|---|
| run | ажиллагаа | агентын нэг гүйлт |
| runner | гүйцэтгэгч | |
| board | Удирдах зөвлөл | «Interrupted by board» |
| sub-task | дэд даалгавар | |
| revision | хувилбар | Plan/Artifact |
| steering | чиглүүлэлт | |
| Auto/Plan/Ask mode | Авто/Төлөвлөх/Асуух горим | work mode |
| provider | үйлчилгээ үзүүлэгч | загварын үйлчилгээ |

```

- [ ] **Step 8: Тест**

Run: `pnpm exec vitest run ui/src/xo/time-ago.test.ts ui/src/lib/timeAgo.test.ts ui/src/components/IssuesList.test.tsx ui/src/components/IssueFiltersPopover.test.tsx ui/src/components/IssueColumns.test.tsx ui/src/i18n/xo/parity.test.ts && pnpm xo:i18n:test && (cd ui && pnpm exec tsc --noEmit)`
Expected: PASS (en дээр tx(key) = key тул upstream тестүүд өөрчлөлтгүй давна).

- [ ] **Step 9: Commit**

```bash
git add scripts/xo-i18n/tiers.ts ui/src/components/IssuesList.tsx ui/src/components/IssueFiltersPopover.tsx ui/src/xo/time-ago.ts ui/src/xo/time-ago.test.ts ui/src/lib/timeAgo.ts ui/src/lib/timeAgo.test.ts docs/xo/glossary.md ui/src/i18n/xo/en.json ui/src/i18n/xo/mn.json
git commit -m "feat(xo): translate task list, filters and relative time

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Шинэ даалгаврын цонх, ажлын горим

**Files:**
- Modify: `scripts/xo-i18n/tiers.ts` (Ү6 7.1 бүлгийн төгсгөлд)
- Modify: `ui/src/components/NewIssueDialog.tsx:1798, 1886, 2284` (+ import)
- Modify: `ui/src/lib/work-mode-meta.ts:81-89` (+ import)
- Modify: `ui/src/lib/work-mode-meta.test.ts`
- Modify: `ui/src/i18n/xo/en.json`, `mn.json`

**Interfaces:**
- Consumes: `tx`, `XoTrans` (ui/src/xo/XoTrans.tsx, props `{ i18nKey; values?; components? }`), `i18n` (ui/src/i18n).
- Produces: каталогт `"(optional)"` түлхүүр (Task 3 дахин ашиглана); "Auto mode"/"Plan mode"/"Ask mode" mn утга.

- [ ] **Step 1: tiers.ts-д нэмэх**

Ү6 7.1 бүлгийн сүүлийн мөрийн дараа:

```ts
  "ui/src/components/NewIssueDialog.tsx",
  "ui/src/components/issue-properties/helpers.ts",
  "ui/src/lib/work-mode-meta.ts",
```

- [ ] **Step 2: Failing check-ийг харах**

Run: `pnpm xo:i18n:extract; pnpm xo:i18n:check`
Expected: FAIL. Эдгээр 3 файлын "гараар:" мөрийг тэмдэглэ.

- [ ] **Step 3: work-mode-meta-ийн failing тест**

ui/src/lib/work-mode-meta.test.ts-ийн импортыг:

```ts
import { afterEach, describe, expect, it } from "vitest";
import { i18n } from "@/i18n";
import { tx } from "@/i18n/xo";

import { nextWorkMode, titleForPendingWorkMode, workModeMetaList } from "./work-mode-meta";

afterEach(async () => {
  await i18n.changeLanguage("en");
});
```

болгож, describe дотор нэм:

```ts
  it("translates pending work mode tooltips in mn", async () => {
    await i18n.changeLanguage("mn");
    expect(titleForPendingWorkMode("standard")).toBe("Энэ илгээлтэд авто горим. Солихын тулд дарна уу.");
    expect(titleForPendingWorkMode("planning")).toBe("Энэ илгээлтэд төлөвлөх горим идэвхтэй. Солихын тулд дарна уу.");
    expect(titleForPendingWorkMode("ask")).toBe(
      "Энэ илгээлтэд асуух горим. Солихын тулд дарна уу. Хариуцагч энэ урсгалд хариулна; хэрэгжүүлэх ажил хийхгүй.",
    );
    expect(workModeMetaList().map((mode) => tx(mode.label))).toEqual(["Авто горим", "Төлөвлөх горим", "Асуух горим"]);
  });
```

Run: `pnpm exec vitest run ui/src/lib/work-mode-meta.test.ts`
Expected: FAIL (англи текст буцна).

- [ ] **Step 4: Transform барихгүй мөрүүдийг tx() болгох**

work-mode-meta.ts-д `import { tx } from "@/i18n/xo";` нэмж, titleForPendingWorkMode-ийг:

```ts
export function titleForPendingWorkMode(mode: IssueWorkMode): string {
  if (mode === "ask") {
    return tx("Ask mode for this submission. Click to change. The responsible will answer in this thread; no implementation work.");
  }
  if (mode === "planning") {
    return tx("Plan mode is on for this submission. Click to change.");
  }
  return tx("Auto mode for this submission. Click to change.");
}
```

`workModeMetaList()` доторх `label:` утгыг transform барина, гараар бүү өөрчил.

NewIssueDialog.tsx (+ `import { tx } from "@/i18n/xo";`, `import { XoTrans } from "@/xo/XoTrans";`):

1798:

```tsx
                      <div className="text-xs font-medium text-foreground">{tx("Instructions")} <span className="font-normal text-muted-foreground">{tx("(optional)")}</span></div>
```

1886:

```tsx
                  {tx("Reusing {{name}} from {{source}}.", {
                    name: selectedReusableExecutionWorkspace.name,
                    source: selectedReusableExecutionWorkspace.branchName ?? tx("existing execution workspace"),
                  })}
```

2284 орчмын `<span className="leading-snug">` агуулга:

```tsx
            <span className="leading-snug">
              <XoTrans
                i18nKey="Assigning implies executable intent - leave status as <b>Backlog</b> only to deliberately park this. The assignee will not be woken until status moves to <b>Todo</b> or <b>In Progress</b>."
                components={{ b: <span className="font-medium" /> }}
              />
            </span>
```

Step 2-т тэмдэглэсэн бусад "гараар:" мөрийг tx()-д ороо.

- [ ] **Step 5: Каталог**

Run: `pnpm xo:i18n:extract; pnpm xo:i18n:todo ui/src/components/NewIssueDialog; pnpm xo:i18n:todo ui/src/components/issue-properties/helpers; pnpm xo:i18n:todo ui/src/lib/work-mode-meta`

`/private/tmp/xo-y6-t2.json`. Доорх утгуудыг заавал ашигла:

```json
{
  "Auto mode": "Авто горим",
  "Plan mode": "Төлөвлөх горим",
  "Ask mode": "Асуух горим",
  "Auto mode for this submission. Click to change.": "Энэ илгээлтэд авто горим. Солихын тулд дарна уу.",
  "Plan mode is on for this submission. Click to change.": "Энэ илгээлтэд төлөвлөх горим идэвхтэй. Солихын тулд дарна уу.",
  "Ask mode for this submission. Click to change. The responsible will answer in this thread; no implementation work.": "Энэ илгээлтэд асуух горим. Солихын тулд дарна уу. Хариуцагч энэ урсгалд хариулна; хэрэгжүүлэх ажил хийхгүй.",
  "(optional)": "(заавал биш)",
  "Reusing {{name}} from {{source}}.": "{{source}} салбараас {{name}} ажлын талбарыг дахин ашиглаж байна.",
  "existing execution workspace": "одоо байгаа гүйцэтгэлийн ажлын талбар",
  "Assigning implies executable intent - leave status as <b>Backlog</b> only to deliberately park this. The assignee will not be woken until status moves to <b>Todo</b> or <b>In Progress</b>.": "Хариуцагч оноох нь ажлыг гүйцэтгэх зорилготойг илэрхийлнэ. Ажлыг зориуд хойшлуулах бол л төлвийг <b>Нөөц</b> хэвээр үлдээ. Төлөв <b>Хийх</b> эсвэл <b>Хийгдэж буй</b> болох хүртэл хариуцагчийг сэрээхгүй."
}
```

"Instructions" каталогт байгаа (`grep -F '"Instructions"' ui/src/i18n/xo/en.json`), дахин бүү бич. Үлдсэнийг үг сонголтоор орчуул. todo-д гараагүйг файлд бүү оруул.

Run: `pnpm xo:i18n:merge /private/tmp/xo-y6-t2.json && pnpm xo:i18n:check`
Expected: PASS, эдгээр 3 файлын "гараар:" мөр үгүй.

- [ ] **Step 6: Тест**

Run: `pnpm exec vitest run ui/src/lib/work-mode-meta.test.ts ui/src/components/NewIssueDialog.test.tsx ui/src/i18n/xo/parity.test.ts && pnpm xo:i18n:test && (cd ui && pnpm exec tsc --noEmit)`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add scripts/xo-i18n/tiers.ts ui/src/components/NewIssueDialog.tsx ui/src/lib/work-mode-meta.ts ui/src/lib/work-mode-meta.test.ts ui/src/i18n/xo/en.json ui/src/i18n/xo/mn.json
git commit -m "feat(xo): translate new task dialog and work mode copy

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Даалгаврын шинж чанарын самбар

**Files:**
- Modify: `scripts/xo-i18n/tiers.ts` (Ү6 7.1 бүлгийн төгсгөлд)
- Modify: `ui/src/components/issue-properties/IssueProperties.tsx:831-835, 1206, 1860, 1873, 2945` (+ import)
- Modify: `ui/src/components/issue-properties/IssuePropertiesArtifactsTab.tsx:221, 294, 312, 450` (+ import)
- Modify: `ui/src/components/issue-properties/IssuePropertiesPlansTab.tsx:83-88` (+ import)
- Modify: `ui/src/components/issue-properties/property-picker.tsx:50` (+ import)
- Modify: `ui/src/i18n/xo/en.json`, `mn.json`

**Interfaces:**
- Consumes: `tx`; `localeTag()` (ui/src/xo/locale.ts:37, `"mn-MN"` эсвэл `"en-US"` буцаана); Task 2-ын `"(optional)"` түлхүүр.
- Produces: дараагийн task-д шинэ интерфэйс өгөхгүй.

`property-picker.tsx`-ийг tier-д бүү нэм. Энэ файлд зөвхөн нэг гар засвар бий, cli.ts нь tier-ээс гадуурх файлын `tx("...")` дуудлагыг `harvestExplicitKeys`-ээр цуглуулдаг.

- [ ] **Step 1: tiers.ts-д нэмэх**

Ү6 7.1 бүлгийн сүүлийн мөрийн дараа:

```ts
  "ui/src/components/issue-properties/IssueProperties.tsx",
  "ui/src/components/issue-properties/IssuePropertiesArtifactsTab.tsx",
  "ui/src/components/issue-properties/IssuePropertiesPlansTab.tsx",
  "ui/src/components/issue-properties/external-object-rows.tsx",
  "ui/src/components/issue-properties/relation-controls.tsx",
```

- [ ] **Step 2: Failing check-ийг харах**

Run: `pnpm xo:i18n:extract; pnpm xo:i18n:check`
Expected: FAIL. Эдгээр 5 файлын "гараар:" мөрийг тэмдэглэ.

- [ ] **Step 3: IssueProperties.tsx**

Импортын блокийн төгсгөлд (63-р мөрийн `timeAgo` импортын дараа) `import { tx } from "@/i18n/xo";` нэм.

831 (`const summary = ...`):

```ts
      const summary = details.length > 0 ? tx("Override · {{details}}", { details: details.join(" · ") }) : tx("Override · adapter options");
```

835 (`<span>`-ий `title`):

```tsx
          title={tx("Task-level model override — replaces the agent's primary model for this issue.") + (details.length > 0 ? ` (${details.join(" · ")})` : "")}
```

1206:

```tsx
          {tx("Instructions")} <span className="font-normal text-muted-foreground">{tx("(optional)")}</span>
```

1860:

```tsx
        placeholder={stageType === "review" ? tx("Search reviewers...") : tx("Search approvers...")}
```

1873 (`No {stageType === "review" ? "reviewers" : "approvers"}` агуулгыг бүхэлд нь солино):

```tsx
          {stageType === "review" ? tx("No reviewers") : tx("No approvers")}
```

2945:

```tsx
                    title={tx("Archived by {{name}} · {{date}}", { name: archivedByName, date: formatDateTime(issue.archivedAt) })}
```

- [ ] **Step 4: Artifacts, Plans, property-picker**

IssuePropertiesArtifactsTab.tsx: импортын блокийн төгсгөлд (40-р мөрийн `useLocation` импортын дараа) `import { tx } from "@/i18n/xo";`.

221:

```tsx
{tx("Rev {{n}}", { n: reviewDoc.latestRevisionNumber ?? 1 })}
```

294 ба 312 (хоёулаа `Rev ${doc.latestRevisionNumber ?? 1}`):

```tsx
{tx("Rev {{n}}", { n: doc.latestRevisionNumber ?? 1 })}
```

450:

```ts
agent?.name ?? tx("Run {{id}}", { id: group.runId.slice(0, 8) })
```

IssuePropertiesPlansTab.tsx: импортын блокийн төгсгөлд (10-р мөрийн `useLocation` импортын дараа):

```ts
import { tx } from "@/i18n/xo";
import { localeTag } from "@/xo/locale";
```

83-88-ын template-ийг бүхэлд нь солино:

```tsx
            {tx("Revision {{n}} · updated {{date}}", {
              n: planDocument.latestRevisionNumber ?? 1,
              date: new Date(planDocument.updatedAt).toLocaleString(localeTag(), {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              }),
            })}
```

property-picker.tsx: импортын блокийн төгсгөлд (6-р мөрийн `PropertyRow` импортын дараа) `import { tx } from "@/i18n/xo";`.

50:

```tsx
        aria-label={tx("Edit {{label}}", { label: label.toLowerCase() })}
```

Step 2-т тэмдэглэсэн бусад "гараар:" мөрийг (external-object-rows, relation-controls орно) tx()-д ороо.

- [ ] **Step 5: Каталог**

Run: `pnpm xo:i18n:extract; pnpm xo:i18n:todo ui/src/components/issue-properties/`

`/private/tmp/xo-y6-t3.json`. Доорх утгуудыг заавал ашигла:

```json
{
  "Override · {{details}}": "Дарж тохируулсан · {{details}}",
  "Override · adapter options": "Дарж тохируулсан · адаптерын тохиргоо",
  "Task-level model override — replaces the agent's primary model for this issue.": "Даалгаврын түвшний загварын тохиргоо. Энэ даалгаварт агентын үндсэн загварыг орлоно.",
  "Search reviewers...": "Хянагч хайх...",
  "Search approvers...": "Батлагч хайх...",
  "No reviewers": "Хянагчгүй",
  "No approvers": "Батлагчгүй",
  "Archived by {{name}} · {{date}}": "Архивласан: {{name}} · {{date}}",
  "Rev {{n}}": "Хувилбар {{n}}",
  "Revision {{n}} · updated {{date}}": "Хувилбар {{n}} · шинэчилсэн {{date}}",
  "Edit {{label}}": "{{label}} талбарыг засах"
}
```

"Instructions", "Run {{id}}" каталогт байгаа, "(optional)"-ийг Task 2 нэмсэн. Гурвыг нь дахин бүү бич. Үлдсэнийг үг сонголтоор орчуул. todo-д гараагүйг файлд бүү оруул.

Run: `pnpm xo:i18n:merge /private/tmp/xo-y6-t3.json && pnpm xo:i18n:check`
Expected: PASS, эдгээр 5 файлын "гараар:" мөр үгүй.

- [ ] **Step 6: Тест**

Run: `pnpm exec vitest run ui/src/components/IssueProperties.test.tsx ui/src/components/issue-properties/IssuePropertiesDocumentAnnotations.test.tsx ui/src/components/issue-properties/IssuePropertiesMarkdownWorkProduct.test.tsx ui/src/i18n/xo/parity.test.ts && pnpm xo:i18n:test && (cd ui && pnpm exec tsc --noEmit)`
Expected: PASS. en дээр `tx` түлхүүрээ буцаадаг тул одоогийн англи assertion өөрчлөгдөхгүй.

- [ ] **Step 7: Commit**

```bash
git add scripts/xo-i18n/tiers.ts ui/src/components/issue-properties/IssueProperties.tsx ui/src/components/issue-properties/IssuePropertiesArtifactsTab.tsx ui/src/components/issue-properties/IssuePropertiesPlansTab.tsx ui/src/components/issue-properties/property-picker.tsx ui/src/i18n/xo/en.json ui/src/i18n/xo/mn.json
git commit -m "feat(xo): translate task properties panel

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Step 4-т external-object-rows эсвэл relation-controls-ийг гараар засвал тэдгээрийг ч нэрээр нь нэм.

---

### Task 4: Task chat composer ба картууд

**Files:**
- Modify: `scripts/xo-i18n/tiers.ts` (Ү6 7.1 бүлгийн төгсгөлд)
- Modify: `ui/src/xo/labels.ts` (xoLabel-д 3 case, шинэ `xoFileKindLabel`)
- Modify: `ui/src/xo/labels.test.ts`
- Modify: `ui/src/components/task-chat/TaskChatComposer.tsx:307-321, 636-642, 1385-1391, 1495` (+ import)
- Modify: `ui/src/components/task-chat/TaskChatCompactInteractionCard.tsx:416, 433-436` (+ import)
- Modify: `ui/src/components/task-chat/TaskChatBubble.tsx:284, 299, 331, 335` (+ import)
- Modify: `ui/src/components/task-chat/TaskChatProtocolCard.tsx:443-445` (+ import)
- Modify: `ui/src/i18n/xo/en.json`, `mn.json`

**Interfaces:**
- Consumes: `tx`, `i18n`, одоо байгаа `xoLabel(english: string): string` ба `xoStatusLabel` (ui/src/xo/labels.ts).
- Produces: `xoFileKindLabel(english: string): string` (ui/src/xo/labels.ts). en дээр аргументаа буцаана, mn дээр файлын төрлийн шошгыг орчуулна, товчлолыг (PDF, JSON…) хэвээр үлдээнэ. Task 5 энэ файлд `xoActivityLabel` нэмнэ.

task-chat-attachments.ts-ийг бүү өөрчил. Шошгыг render үед `xoFileKindLabel`-ээр орчуулна.

- [ ] **Step 1: tiers.ts-д нэмэх**

Ү6 7.1 бүлгийн сүүлийн мөрийн дараа:

```ts
  "ui/src/components/task-chat/TaskChatComposer.tsx",
  "ui/src/components/task-chat/TaskChatRichInput.tsx",
  "ui/src/components/task-chat/TaskChatCompactInteractionCard.tsx",
  "ui/src/components/task-chat/TaskChatInteractionCard.tsx",
  "ui/src/components/task-chat/TaskChatProtocolCard.tsx",
  "ui/src/components/task-chat/TaskChatProtocolActivityRow.tsx",
  "ui/src/components/task-chat/TaskChatQueuedMessages.tsx",
  "ui/src/components/task-chat/TaskChatBlockerLinks.tsx",
  "ui/src/components/task-chat/TaskChatPausedTakeover.tsx",
  "ui/src/components/task-chat/TaskChatBubble.tsx",
```

- [ ] **Step 2: Failing check-ийг харах**

Run: `pnpm xo:i18n:extract; pnpm xo:i18n:check`
Expected: FAIL. Эдгээр 10 файлын "гараар:" мөрийг тэмдэглэ.

- [ ] **Step 3: labels-ийн failing тест**

ui/src/xo/labels.test.ts-ийн импортыг:

```ts
import { xoFileKindLabel, xoLabel, xoStatusLabel } from "./labels";
```

болгож, `describe("xoLabel", ...)` дотор нэм:

```ts
  it("mn дээр ажлын горимын тайлбарыг орчуулна", async () => {
    await i18n.changeLanguage("mn");
    expect(xoLabel("Make changes and run work")).toBe("Өөрчлөлт хийж, ажил гүйцэтгэх");
    expect(xoLabel("Draft a plan before acting")).toBe("Ажиллахаас өмнө төлөвлөгөө боловсруулах");
    expect(xoLabel("Answer questions only, no changes")).toBe("Зөвхөн асуултад хариулна, өөрчлөлт хийхгүй");
  });
```

Файлын төгсгөлд нэм:

```ts
describe("xoFileKindLabel", () => {
  it("en дээр англи шошгыг хэвээр буцаана", () => {
    expect(xoFileKindLabel("Archive")).toBe("Archive");
    expect(xoFileKindLabel("Doc")).toBe("Doc");
    expect(xoFileKindLabel("PDF")).toBe("PDF");
  });

  it("mn дээр файлын төрлийг орчуулж, товчлолыг хэвээр үлдээнэ", async () => {
    await i18n.changeLanguage("mn");
    expect(xoFileKindLabel("Archive")).toBe("Архив");
    expect(xoFileKindLabel("Audio")).toBe("Аудио");
    expect(xoFileKindLabel("Code")).toBe("Код");
    expect(xoFileKindLabel("Doc")).toBe("Баримт");
    expect(xoFileKindLabel("File")).toBe("Файл");
    expect(xoFileKindLabel("Log")).toBe("Лог");
    expect(xoFileKindLabel("Patch")).toBe("Патч");
    expect(xoFileKindLabel("Sheet")).toBe("Хүснэгт");
    expect(xoFileKindLabel("Text")).toBe("Текст");
    expect(xoFileKindLabel("Video")).toBe("Видео");
    expect(xoFileKindLabel("PDF")).toBe("PDF");
    expect(xoFileKindLabel("JSON")).toBe("JSON");
  });
});
```

Run: `pnpm exec vitest run ui/src/xo/labels.test.ts`
Expected: FAIL (`xoFileKindLabel` export байхгүй).

- [ ] **Step 4: labels.ts**

`xoLabel`-ийн switch-д `case "Name your organization"`-ийн дараа:

```ts
    case "Make changes and run work": return tx("Make changes and run work");
    case "Draft a plan before acting": return tx("Draft a plan before acting");
    case "Answer questions only, no changes": return tx("Answer questions only, no changes");
```

Файлын төгсгөлд:

```ts
// task-chat-attachments.ts-ийн файлын төрөл. "Archive" түлхүүр каталогт «Архивлах»
// үйл үгтэй тул файлын төрөлд тусдаа түлхүүр хэрэглэнэ; en дээр guard англиар буцаана.
export function xoFileKindLabel(english: string): string {
  if (!(i18n.resolvedLanguage ?? i18n.language ?? "").startsWith("mn")) return english;
  switch (english) {
    case "Archive": return tx("Archive (file type)");
    case "Audio": return tx("Audio");
    case "Code": return tx("Code");
    case "Doc": return tx("Doc");
    case "File": return tx("File");
    case "Log": return tx("Log");
    case "Patch": return tx("Patch");
    case "Sheet": return tx("Sheet");
    case "Text": return tx("Text");
    case "Video": return tx("Video");
    default: return english;
  }
}
```

- [ ] **Step 5: Transform барихгүй мөрүүдийг tx() болгох**

TaskChatComposer.tsx: импортын блокийн төгсгөлд (76-р мөрийн `TaskChatPausedTakeover` импортын дараа):

```ts
import { tx } from "@/i18n/xo";
import { xoFileKindLabel, xoLabel } from "@/xo/labels";
```

307-321 `modePlaceholder`:

```ts
function modePlaceholder(mode: IssueWorkMode, agentName: string, mobile: boolean): string {
  if (mobile) {
    if (mode === "planning") return tx("Plan with {{agent}}…", { agent: agentName });
    if (mode === "ask") return tx("Ask {{agent}}…", { agent: agentName });
    return tx("Message {{agent}}…", { agent: agentName });
  }
  switch (mode) {
    case "planning":
      return tx("Plan with {{agent}} — shapes the plan doc, no code changes…", { agent: agentName });
    case "ask":
      return tx("Ask {{agent}} a question — read-only, nothing runs…", { agent: agentName });
    default:
      return tx("Message {{agent}} — describe what you want done…", { agent: agentName });
  }
}
```

636-642:

```ts
  const assigneeLabel =
    reassignOptions?.find((o) => o.id === assigneeValue)?.label ?? tx("Unassigned");
  const assigneeName =
    assigneeLabel === "Unassigned" || assigneeLabel === tx("Unassigned") ? tx("the agent") : assigneeLabel;
  const effectivePlaceholder = queuedEdit
    ? tx("Edit queued message…")
    : (placeholder ?? modePlaceholder(pendingMode, assigneeName, mobile));
```

1385-1391:

```tsx
                        {attachment.status === "uploading"
                          ? tx("Uploading…")
                          : attachment.status === "error"
                            ? (attachment.error ?? tx("Upload failed"))
                            : [xoFileKindLabel(kind.label), sizeLabel]
                                .filter(Boolean)
                                .join(" · ")}
```

1495:

```tsx
                            {xoLabel(MODE_DESCRIPTION[m.value] ?? "")}
```

TaskChatCompactInteractionCard.tsx: импортын блокийн төгсгөлд (67-р мөрийн `TaskChatRichInput` импортын дараа) `import { tx } from "@/i18n/xo";`.

416 (`Answer: {values.length > 0 ? values.join(", ") : "No answer"}`):

```tsx
                {tx("Answer: {{answer}}", { answer: values.length > 0 ? values.join(", ") : tx("No answer") })}
```

433-436 (`Answer:{" "}` ба дараагийн тернарийг бүхэлд нь):

```tsx
            {tx("Answer: {{answer}}", {
              answer: selectedLabels.length > 0 ? selectedLabels.join(", ") : tx("No options selected"),
            })}
```

TaskChatBubble.tsx: импортын блокийн төгсгөлд (34-р мөрийн `task-chat-model` импортын дараа):

```ts
import { tx } from "@/i18n/xo";
import { xoFileKindLabel } from "@/xo/labels";
```

284:

```tsx
                  aria-label={ref.name ? tx("Open {{name}}", { name: ref.name }) : tx("Open image {{n}}", { n: index + 1 })}
```

299:

```tsx
                aria-label={tx("Open {{n}} more screenshots", { n: imageRefs.length - 3 })}
```

331:

```tsx
                      {size ? `${xoFileKindLabel(kind.label)} · ${size}` : xoFileKindLabel(kind.label)}
```

335:

```tsx
                    aria-label={tx("Open {{name}}", { name: ref.name })}
```

TaskChatProtocolCard.tsx: импортын блокийн төгсгөлд (49-р мөрийн `RichWorkProductCard` импортын дараа) `import { tx } from "@/i18n/xo";`.

443-445:

```tsx
              {expanded
                ? tx("Show fewer files")
                : tx("Show {{n}} more files", { n: item.files.length - 3 })}
```

Step 2-т тэмдэглэсэн бусад "гараар:" мөрийг tx()-д ороо.

- [ ] **Step 6: Каталог**

Run: `pnpm xo:i18n:extract; pnpm xo:i18n:todo ui/src/components/task-chat/ ui/src/xo/labels`

`/private/tmp/xo-y6-t4.json`. Доорх утгуудыг заавал ашигла:

```json
{
  "Make changes and run work": "Өөрчлөлт хийж, ажил гүйцэтгэх",
  "Draft a plan before acting": "Ажиллахаас өмнө төлөвлөгөө боловсруулах",
  "Answer questions only, no changes": "Зөвхөн асуултад хариулна, өөрчлөлт хийхгүй",
  "Archive (file type)": "Архив",
  "Audio": "Аудио",
  "Code": "Код",
  "Doc": "Баримт",
  "File": "Файл",
  "Log": "Лог",
  "Patch": "Патч",
  "Sheet": "Хүснэгт",
  "Text": "Текст",
  "Video": "Видео",
  "Plan with {{agent}}…": "Төлөвлөх: {{agent}}…",
  "Ask {{agent}}…": "Асуух: {{agent}}…",
  "Message {{agent}}…": "Мессеж: {{agent}}…",
  "Plan with {{agent}} — shapes the plan doc, no code changes…": "Төлөвлөх: {{agent}}. Төлөвлөгөөний баримтыг боловсруулна, код өөрчлөхгүй…",
  "Ask {{agent}} a question — read-only, nothing runs…": "Асуух: {{agent}}. Зөвхөн уншина, юу ч ажиллахгүй…",
  "Message {{agent}} — describe what you want done…": "Мессеж: {{agent}}. Юу хийлгэхийг тайлбарлана уу…",
  "Unassigned": "Хариуцагчгүй",
  "the agent": "агент",
  "Edit queued message…": "Дараалалд буй мессежийг засах…",
  "Uploading…": "Байршуулж байна…",
  "Upload failed": "Байршуулалт амжилтгүй",
  "Answer: {{answer}}": "Хариулт: {{answer}}",
  "No options selected": "Сонголт хийгээгүй",
  "Open {{name}}": "{{name}} нээх",
  "Open image {{n}}": "{{n}}-р зургийг нээх",
  "Open {{n}} more screenshots": "Өөр {{n}} дэлгэцийн зураг нээх",
  "Show fewer files": "Цөөн файл харуулах",
  "Show {{n}} more files": "Өөр {{n}} файл харуулах"
}
```

"No answer" каталогт байгаа (`grep -F '"No answer"' ui/src/i18n/xo/en.json`), дахин бүү бич. Үлдсэнийг үг сонголтоор орчуул. todo-д гараагүйг файлд бүү оруул.

Run: `pnpm xo:i18n:merge /private/tmp/xo-y6-t4.json && pnpm xo:i18n:check`
Expected: PASS, эдгээр 10 файлын "гараар:" мөр үгүй.

- [ ] **Step 7: Тест**

Run: `pnpm exec vitest run ui/src/xo/labels.test.ts ui/src/components/task-chat/TaskChatComposer.test.tsx ui/src/components/task-chat/TaskChatBubble.test.tsx ui/src/components/task-chat/TaskChatInteractionCard.test.tsx ui/src/components/task-chat/TaskChatProtocolCard.test.tsx ui/src/components/task-chat/TaskChatQueuedMessages.test.tsx ui/src/components/task-chat/task-chat-attachments.test.ts ui/src/i18n/xo/parity.test.ts && pnpm xo:i18n:test && (cd ui && pnpm exec tsc --noEmit)`
Expected: PASS. en дээр `tx` түлхүүрээ буцаадаг тул одоогийн англи assertion өөрчлөгдөхгүй.

- [ ] **Step 8: Commit**

```bash
git add scripts/xo-i18n/tiers.ts ui/src/xo/labels.ts ui/src/xo/labels.test.ts ui/src/components/task-chat/TaskChatComposer.tsx ui/src/components/task-chat/TaskChatCompactInteractionCard.tsx ui/src/components/task-chat/TaskChatBubble.tsx ui/src/components/task-chat/TaskChatProtocolCard.tsx ui/src/i18n/xo/en.json ui/src/i18n/xo/mn.json
git commit -m "feat(xo): translate task chat composer and cards

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Step 5-д өөр tier файлыг гараар засвал түүнийг ч нэрээр нь нэм.

---

### Task 5: Ажиллагааны явц ба хугацаа

**Files:**
- Create: `ui/src/xo/run-text.ts`
- Create: `ui/src/xo/run-text.test.ts`
- Modify: `scripts/xo-i18n/tiers.ts` (Ү6 7.1 бүлгийн төгсгөлд)
- Modify: `ui/src/xo/labels.ts` (шинэ `xoActivityLabel`)
- Modify: `ui/src/xo/labels.test.ts`
- Modify: `ui/src/lib/issue-chat-messages.ts:778-793` (+ import; tier-д нэмэхгүй)
- Modify: `ui/src/components/task-chat/TaskChatLiveRunPill.tsx:33-34, 71-72` (+ import)
- Modify: `ui/src/components/task-chat/TaskChatTurn.tsx:36-39, 49, 103-108, 207-212` (+ import)
- Modify: `ui/src/components/task-chat/transcript-adapter.ts:1755-1769` (+ import)
- Modify: `ui/src/components/task-chat/TaskChatActivityPhase.tsx:96` (+ import)
- Modify: `ui/src/components/task-chat/TaskChatStatusPill.tsx:9-22` (+ import)
- Modify: `ui/src/components/task-chat/TaskChatUsageReadout.tsx:21` (+ import)
- Modify: `ui/src/components/task-chat/completed-activity-summary.ts:123, 127` (+ import)
- Modify: `ui/src/i18n/xo/en.json`, `mn.json`

**Interfaces:**
- Consumes: `tx` (ui/src/i18n/xo.ts); `xoLabel`, `xoStatusLabel`, `xoFileKindLabel` (ui/src/xo/labels.ts, Task 4).
- Produces (ui/src/xo/run-text.ts):
  - `secondsWords(n: number): string`, `minutesWords(n: number): string`, `hoursWords(n: number): string`
  - `ranCommandsWords(n: number): string`, `calledToolsWords(n: number): string`, `toolsCountWords(n: number): string`
  - `compactDuration(ms: number): string | undefined` — "38s", "2m", "2m 5s"; 0, сөрөг, NaN бол `undefined`.
- Produces (ui/src/xo/labels.ts): `xoActivityLabel(english: string): string` — үйл ажиллагааны хураангуйн 27 шошго. Түлхүүр нь англи тексттэй ижил тул guard хэрэггүй.
- Task 7 `formatDurationWords`-ийг (энэ task-аас хойш tx-тэй) IssueChatThread-ээр дамжуулан хэрэглэнэ.

Тэмдэглэл: transcript-adapter tier-д орсноор 2105-2111-ийн `label: "Responding"` / `"Thinking"` / `"Running"` mn дээр орчуулагдана. status-whimsy.ts:74-ийн `isGenericStatusLabel` зөвхөн англи "running"/"working"-ийг танидаг тул mn дээр англи whimsy үгийн оронд орчуулсан шошго харагдана. Энэ нь зориудын үр дагавар. status-whimsy.ts-ийг бүү өөрчил.

- [ ] **Step 1: tiers.ts-д нэмэх**

Ү6 7.1 бүлгийн сүүлийн мөрийн дараа:

```ts
  "ui/src/components/task-chat/TaskChatRunnerTurn.tsx",
  "ui/src/components/task-chat/TaskChatLiveRunPill.tsx",
  "ui/src/components/task-chat/TaskChatTurn.tsx",
  "ui/src/components/task-chat/transcript-adapter.ts",
  "ui/src/components/task-chat/TaskChatRunnerActivityGroup.tsx",
  "ui/src/components/task-chat/TaskChatStatusPill.tsx",
  "ui/src/components/task-chat/TaskChatUsageReadout.tsx",
  "ui/src/components/task-chat/TaskChatActivityPhase.tsx",
  "ui/src/components/task-chat/completed-activity-summary.ts",
```

issue-chat-messages.ts-ийг бүү нэм: модулийн түвшний олон Record-той тул transform-ын хамрах хүрээ хэт өргөн болно. Зөвхөн `formatDurationWords`-ийг гараар засна.

- [ ] **Step 2: Failing check-ийг харах**

Run: `pnpm xo:i18n:extract; pnpm xo:i18n:check`
Expected: FAIL. Эдгээр 9 файлын "гараар:" мөрийг тэмдэглэ.

- [ ] **Step 3: Failing тест**

`ui/src/xo/run-text.test.ts`:

```ts
import { afterEach, describe, expect, it } from "vitest";
import { i18n } from "@/i18n";
import {
  calledToolsWords,
  compactDuration,
  hoursWords,
  minutesWords,
  ranCommandsWords,
  secondsWords,
  toolsCountWords,
} from "./run-text";

afterEach(async () => {
  await i18n.changeLanguage("en");
});

describe("compactDuration", () => {
  it("хязгаарын утгуудыг en дээр зөв форматлана", () => {
    expect(compactDuration(0)).toBeUndefined();
    expect(compactDuration(-5)).toBeUndefined();
    expect(compactDuration(Number.NaN)).toBeUndefined();
    expect(compactDuration(400)).toBe("1s");
    expect(compactDuration(38_000)).toBe("38s");
    expect(compactDuration(59_600)).toBe("1m");
    expect(compactDuration(60_000)).toBe("1m");
    expect(compactDuration(125_000)).toBe("2m 5s");
  });

  it("mn дээр орчуулна", async () => {
    await i18n.changeLanguage("mn");
    expect(compactDuration(38_000)).toBe("38 сек");
    expect(compactDuration(120_000)).toBe("2 мин");
    expect(compactDuration(125_000)).toBe("2 мин 5 сек");
  });
});

describe("тоо ширхэгийн үгс", () => {
  it("en дээр ганц ба олон тоог ялгана", () => {
    expect(secondsWords(1)).toBe("1 second");
    expect(secondsWords(2)).toBe("2 seconds");
    expect(minutesWords(1)).toBe("1 minute");
    expect(minutesWords(5)).toBe("5 minutes");
    expect(hoursWords(1)).toBe("1 hour");
    expect(hoursWords(3)).toBe("3 hours");
    expect(ranCommandsWords(1)).toBe("ran 1 command");
    expect(ranCommandsWords(4)).toBe("ran 4 commands");
    expect(calledToolsWords(1)).toBe("called 1 tool");
    expect(calledToolsWords(2)).toBe("called 2 tools");
    expect(toolsCountWords(1)).toBe("1 tool");
    expect(toolsCountWords(3)).toBe("3 tools");
  });

  it("mn дээр орчуулна", async () => {
    await i18n.changeLanguage("mn");
    expect(secondsWords(2)).toBe("2 секунд");
    expect(minutesWords(1)).toBe("1 минут");
    expect(hoursWords(3)).toBe("3 цаг");
    expect(ranCommandsWords(3)).toBe("3 команд ажиллуулсан");
    expect(calledToolsWords(1)).toBe("1 хэрэгсэл дуудсан");
    expect(toolsCountWords(4)).toBe("4 хэрэгсэл");
  });
});
```

ui/src/xo/labels.test.ts-ийн импортыг (Task 4-ийн дараах хэлбэр):

```ts
import { xoActivityLabel, xoFileKindLabel, xoLabel, xoStatusLabel } from "./labels";
```

болгож, файлын төгсгөлд нэм:

```ts
describe("xoActivityLabel", () => {
  it("en дээр англи шошгыг хэвээр буцаана", () => {
    expect(xoActivityLabel("Ran commands")).toBe("Ran commands");
    expect(xoActivityLabel("Recorded usage")).toBe("Recorded usage");
  });

  it("mn дээр мэдэгдэх шошгыг орчуулж, үл мэдэгдэхийг хэвээр үлдээнэ", async () => {
    await i18n.changeLanguage("mn");
    expect(xoActivityLabel("Ran commands")).toBe("Команд ажиллуулсан");
    expect(xoActivityLabel("Searched the web")).toBe("Вэбээс хайсан");
    expect(xoActivityLabel("Thought through the task")).toBe("Даалгаврыг бодож үзсэн");
    expect(xoActivityLabel("Something new")).toBe("Something new");
  });
});
```

Run: `pnpm exec vitest run ui/src/xo/run-text.test.ts ui/src/xo/labels.test.ts`
Expected: FAIL (`./run-text` модуль ба `xoActivityLabel` export байхгүй).

- [ ] **Step 4: run-text.ts ба xoActivityLabel**

`ui/src/xo/run-text.ts`:

```ts
// XO: ажиллагааны хугацаа ба хэрэгслийн тооны текст. tx()-ийн аргумент бүр литерал
// байх ёстой (extract зөвхөн литералыг хураадаг) тул олон тоог n === 1 салаагаар сонгоно.
// Хувьсагчийг "count" гэж бүү нэрлэ: i18next түүнийг plural дүрэм гэж ойлгоно.
import { tx } from "@/i18n/xo";

export function secondsWords(n: number): string {
  return n === 1 ? tx("{{n}} second", { n }) : tx("{{n}} seconds", { n });
}

export function minutesWords(n: number): string {
  return n === 1 ? tx("{{n}} minute", { n }) : tx("{{n}} minutes", { n });
}

export function hoursWords(n: number): string {
  return n === 1 ? tx("{{n}} hour", { n }) : tx("{{n}} hours", { n });
}

export function ranCommandsWords(n: number): string {
  return n === 1 ? tx("ran {{n}} command", { n }) : tx("ran {{n}} commands", { n });
}

export function calledToolsWords(n: number): string {
  return n === 1 ? tx("called {{n}} tool", { n }) : tx("called {{n}} tools", { n });
}

export function toolsCountWords(n: number): string {
  return n === 1 ? tx("{{n}} tool", { n }) : tx("{{n}} tools", { n });
}

/** "38s", "2m", "2m 5s" — transcript-adapter-ийн formatDurationLabel-ийн орчуулагдах хувилбар. */
export function compactDuration(ms: number): string | undefined {
  if (!Number.isFinite(ms) || ms <= 0) return undefined;
  const totalSec = Math.round(ms / 1000);
  if (totalSec < 60) return tx("{{n}}s", { n: Math.max(1, totalSec) });
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return sec === 0 ? tx("{{n}}m", { n: min }) : tx("{{min}}m {{sec}}s", { min, sec });
}
```

ui/src/xo/labels.ts-ийн төгсгөлд (Task 4-ийн `xoFileKindLabel`-ийн дараа):

```ts
// completed-activity-summary.ts-ийн хураангуй шошго. Түлхүүр нь англи тексттэй ижил
// тул en дээр tx() түлхүүрээ буцаана, guard хэрэггүй.
export function xoActivityLabel(english: string): string {
  switch (english) {
    case "Ran commands": return tx("Ran commands");
    case "Searched files": return tx("Searched files");
    case "Read files": return tx("Read files");
    case "Edited files": return tx("Edited files");
    case "Searched the web": return tx("Searched the web");
    case "Worked on a plan": return tx("Worked on a plan");
    case "Requested input": return tx("Requested input");
    case "Worked with agents": return tx("Worked with agents");
    case "Reviewed safety": return tx("Reviewed safety");
    case "Worked with images": return tx("Worked with images");
    case "Waited": return tx("Waited");
    case "Used connected tools": return tx("Used connected tools");
    case "Used tools": return tx("Used tools");
    case "Worked with artifacts": return tx("Worked with artifacts");
    case "Managed context": return tx("Managed context");
    case "Checked memory": return tx("Checked memory");
    case "Checked model settings": return tx("Checked model settings");
    case "Worked in review mode": return tx("Worked in review mode");
    case "Ran hooks": return tx("Ran hooks");
    case "Received a provider update": return tx("Received a provider update");
    case "Worked on files": return tx("Worked on files");
    case "Referenced files": return tx("Referenced files");
    case "Added resources": return tx("Added resources");
    case "Checked files": return tx("Checked files");
    case "Thought through the task": return tx("Thought through the task");
    case "Activity stopped": return tx("Activity stopped");
    case "Recorded usage": return tx("Recorded usage");
    default: return english;
  }
}
```

Эдгээр 27 шошго completed-activity-summary.ts-ийн `labels` Record (11-26), inline Record (75-92), 105, 113-116-р мөрүүдээс ирдэг. Тэнд өөр утга олдвол case нэмж, тайланд бич.

Run: `pnpm exec vitest run ui/src/xo/run-text.test.ts ui/src/xo/labels.test.ts`
Expected: en тестүүд PASS. mn тестүүд каталог орох хүртэл (Step 6) FAIL.

- [ ] **Step 5: Transform барихгүй мөрүүдийг tx() болгох**

issue-chat-messages.ts: 25-р мөрийн (`} from "./transcriptPresentation";`) дараа:

```ts
import { hoursWords, minutesWords, secondsWords } from "@/xo/run-text";
```

778-793 `formatDurationWords`:

```ts
export function formatDurationWords(ms: number | null) {
  if (ms === null || !Number.isFinite(ms) || ms <= 0) return null;
  const totalSeconds = Math.max(1, Math.round(ms / 1000));
  if (totalSeconds < 60) {
    return secondsWords(totalSeconds);
  }
  const totalMinutes = Math.round(totalSeconds / 60);
  if (totalMinutes < 60) {
    return minutesWords(totalMinutes);
  }
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (minutes === 0) {
    return hoursWords(hours);
  }
  return `${hoursWords(hours)} ${minutesWords(minutes)}`;
}
```

TaskChatLiveRunPill.tsx: 8-р мөрийн (`isTerminalRunStatus` импорт) дараа:

```ts
import { tx } from "@/i18n/xo";
import { calledToolsWords, ranCommandsWords } from "@/xo/run-text";
```

33-34:

```ts
  if (commands > 0) parts.push(ranCommandsWords(commands));
  if (other > 0) parts.push(calledToolsWords(other));
```

71-72:

```ts
  const verb = active ? tx("Working") : failed ? tx("Stopped") : tx("Worked");
  const suffix = elapsed ? tx("for {{duration}}", { duration: elapsed }) : null;
```

TaskChatTurn.tsx: 11-р мөрийн (`TaskChatAgentIdentity` импорт) дараа:

```ts
import { tx } from "@/i18n/xo";
import { toolsCountWords } from "@/xo/run-text";
```

36-39:

```ts
  if (summary.toolCount > 0) parts.push(toolsCountWords(summary.toolCount));
```

49:

```ts
  const label = summary.failed ? tx("Stopped") : tx("Worked");
```

103-108:

```tsx
            {item.continuedAfterSteering ? tx("Continued after steering · ") : ""}
            {item.summary.durationLabel
              ? item.summary.failed
                ? tx("Stopped for {{duration}}", { duration: item.summary.durationLabel })
                : tx("Worked for {{duration}}", { duration: item.summary.durationLabel })
              : item.summary.failed
                ? tx("Stopped")
                : tx("Worked")}
```

207-212:

```tsx
        {item.standaloneHeader && item.summary.durationLabel
          ? item.summary.failed
            ? tx("Stopped for {{duration}}", { duration: item.summary.durationLabel })
            : tx("Worked for {{duration}}", { duration: item.summary.durationLabel })
          : item.summary.failed
            ? tx("Stopped")
            : tx("Worked")}
```

transcript-adapter.ts: 29-р мөрийн (`} from "./tool-taxonomy";`) дараа:

```ts
import { tx } from "@/i18n/xo";
import { compactDuration } from "@/xo/run-text";
```

1755-1769:

```ts
function formatDurationLabel(ms: number): string | undefined {
  return compactDuration(ms);
}

function formatTokensLabel(tokens: number): string | undefined {
  if (!Number.isFinite(tokens) || tokens <= 0) return undefined;
  const label = tokens >= 1000 ? `${(tokens / 1000).toFixed(1)}k` : `${tokens}`;
  return tx("{{n}} tokens", { n: label });
}
```

TaskChatActivityPhase.tsx: 8-р мөрийн (`tool-taxonomy` импорт) дараа `import { tx } from "@/i18n/xo";`. 96:

```tsx
          aria-label={
            open
              ? tx("Collapse activity: {{summary}}", { summary: item.summary })
              : tx("Expand activity: {{summary}}", { summary: item.summary })
          }
```

TaskChatStatusPill.tsx: 7-р мөрийн (`motion-tokens` импорт) дараа `import { tx } from "@/i18n/xo";`. 9-22:

```ts
function elapsedLabel(ms?: number): string | null {
  if (ms == null) return null;
  const s = Math.round(ms / 1000);
  if (s < 60) return tx("{{n}}s", { n: s });
  return tx("{{min}}m {{sec}}s", { min: Math.floor(s / 60), sec: s % 60 });
}

/** Tenths-precision elapsed ("24.3s", "1m 24.3s") so the readout visibly moves. */
function liveElapsedLabel(ms?: number): string | null {
  if (ms == null) return null;
  const s = Math.max(0, ms) / 1000;
  if (s < 60) return tx("{{n}}s", { n: s.toFixed(1) });
  return tx("{{min}}m {{sec}}s", { min: Math.floor(s / 60), sec: (s % 60).toFixed(1) });
}
```

TaskChatUsageReadout.tsx: 3-р мөрийн (`task-chat-model` импорт) дараа `import { tx } from "@/i18n/xo";`. 21:

```tsx
            {used.toLocaleString()}/{contextWindowSize.toLocaleString()} {tx("ctx")} ({pct}%)
```

completed-activity-summary.ts: 8-р мөрийн (`task-chat-activity-presentation` импорт) дараа:

```ts
import { tx } from "@/i18n/xo";
import { xoActivityLabel } from "@/xo/labels";
```

123:

```ts
  const fullLabel = join(values.map((v) => xoActivityLabel(v.label)));
```

127:

```ts
        ? tx("{{items}}, and more", { items: join(values.slice(0, 2).map((v) => xoActivityLabel(v.label))) })
```

`categories` Map англи шошгоор түлхүүрлэгдсэн хэвээр, 11-26 ба 75-92-ийн Record-уудыг бүү хөнд. Зөвхөн гаралтыг орчуулна.

Step 2-т тэмдэглэсэн бусад "гараар:" мөрийг ч tx()-д ороо.

- [ ] **Step 6: Каталог**

Run: `pnpm xo:i18n:extract; pnpm xo:i18n:todo ui/src/components/task-chat/ ui/src/xo/ ui/src/lib/issue-chat-messages`

`/private/tmp/xo-y6-t5.json`. Доорх утгуудыг заавал ашигла:

```json
{
  "{{n}} second": "{{n}} секунд",
  "{{n}} seconds": "{{n}} секунд",
  "{{n}} minute": "{{n}} минут",
  "{{n}} minutes": "{{n}} минут",
  "{{n}} hour": "{{n}} цаг",
  "{{n}} hours": "{{n}} цаг",
  "ran {{n}} command": "{{n}} команд ажиллуулсан",
  "ran {{n}} commands": "{{n}} команд ажиллуулсан",
  "called {{n}} tool": "{{n}} хэрэгсэл дуудсан",
  "called {{n}} tools": "{{n}} хэрэгсэл дуудсан",
  "{{n}} tool": "{{n}} хэрэгсэл",
  "{{n}} tools": "{{n}} хэрэгсэл",
  "{{n}}s": "{{n}} сек",
  "{{n}}m": "{{n}} мин",
  "{{min}}m {{sec}}s": "{{min}} мин {{sec}} сек",
  "Working": "Ажиллаж байна",
  "Stopped": "Зогссон",
  "Worked": "Ажилласан",
  "for {{duration}}": "({{duration}})",
  "Worked for {{duration}}": "{{duration}} ажилласан",
  "Stopped for {{duration}}": "{{duration}} ажиллаад зогссон",
  "{{items}}, and more": "{{items}} болон бусад",
  "Continued after steering · ": "Чиглүүлэлтийн дараа үргэлжилсэн · ",
  "ctx": "контекст",
  "Collapse activity: {{summary}}": "Үйл ажиллагааг хураах: {{summary}}",
  "Expand activity: {{summary}}": "Үйл ажиллагааг дэлгэх: {{summary}}",
  "Running": "Ажиллаж байна",
  "Responding": "Хариулж байна",
  "Thinking": "Бодож байна",
  "Thought": "Бодсон",
  "Provider session total": "Үйлчилгээ үзүүлэгчийн сессийн нийт",
  "Token usage": "Токены хэрэглээ",
  "Ran commands": "Команд ажиллуулсан",
  "Searched files": "Файл хайсан",
  "Read files": "Файл уншсан",
  "Edited files": "Файл засварласан",
  "Searched the web": "Вэбээс хайсан",
  "Worked on a plan": "Төлөвлөгөө дээр ажилласан",
  "Requested input": "Оролт хүссэн",
  "Worked with agents": "Агентуудтай ажилласан",
  "Reviewed safety": "Аюулгүй байдлыг хянасан",
  "Worked with images": "Зурагтай ажилласан",
  "Waited": "Хүлээсэн",
  "Used connected tools": "Холбогдсон хэрэгсэл ашигласан",
  "Used tools": "Хэрэгсэл ашигласан",
  "Worked with artifacts": "Артефакттай ажилласан",
  "Managed context": "Контекст удирдсан",
  "Checked memory": "Санах ой шалгасан",
  "Checked model settings": "Загварын тохиргоо шалгасан",
  "Worked in review mode": "Хянах горимд ажилласан",
  "Ran hooks": "Hook ажиллуулсан",
  "Received a provider update": "Үйлчилгээ үзүүлэгчээс шинэчлэл ирсэн",
  "Worked on files": "Файл дээр ажилласан",
  "Referenced files": "Файлд хандсан",
  "Added resources": "Нөөц нэмсэн",
  "Checked files": "Файл шалгасан",
  "Thought through the task": "Даалгаврыг бодож үзсэн",
  "Activity stopped": "Үйл ажиллагаа зогссон",
  "Recorded usage": "Хэрэглээ бүртгэсэн"
}
```

Энэ JSON-ы бүх түлхүүрийг хадгал: xoActivityLabel ба run-text-ийн түлхүүрүүдийг harvestExplicitKeys цуглуулдаг тул todo-д гарна. todo-д гарсан боловч энд байхгүй түлхүүрийг үг сонголтоор орчуулж нэм. Каталогт өөр утгаар аль хэдийн байгаа түлхүүрийг файлаас хасаад тайланд нэрийг нь бич.

Run: `pnpm xo:i18n:merge /private/tmp/xo-y6-t5.json && pnpm xo:i18n:check`
Expected: PASS, эдгээр 9 файлын "гараар:" мөр үгүй.

- [ ] **Step 7: Тест**

Run: `pnpm exec vitest run ui/src/xo/run-text.test.ts ui/src/xo/labels.test.ts ui/src/lib/issue-chat-messages.test.ts ui/src/components/task-chat/TaskChatLiveRunPill.test.tsx ui/src/components/task-chat/TaskChatTurn.test.tsx ui/src/components/task-chat/TaskChatStatusPill.test.tsx ui/src/components/task-chat/TaskChatActivityPhase.test.tsx ui/src/components/task-chat/TaskChatRunnerTurn.test.tsx ui/src/components/task-chat/TaskChatRunnerActivityGroup.test.tsx ui/src/components/task-chat/completed-activity-summary.test.ts ui/src/components/task-chat/transcript-adapter.test.ts ui/src/components/task-chat/status-whimsy.test.ts ui/src/i18n/xo/parity.test.ts && pnpm xo:i18n:test && (cd ui && pnpm exec tsc --noEmit)`
Expected: PASS. en дээр гаралт өөрчлөгдөхгүй тул одоогийн англи assertion ногоон хэвээр.

- [ ] **Step 8: Commit**

```bash
git add scripts/xo-i18n/tiers.ts ui/src/xo/run-text.ts ui/src/xo/run-text.test.ts ui/src/xo/labels.ts ui/src/xo/labels.test.ts ui/src/lib/issue-chat-messages.ts ui/src/components/task-chat/TaskChatLiveRunPill.tsx ui/src/components/task-chat/TaskChatTurn.tsx ui/src/components/task-chat/transcript-adapter.ts ui/src/components/task-chat/TaskChatActivityPhase.tsx ui/src/components/task-chat/TaskChatStatusPill.tsx ui/src/components/task-chat/TaskChatUsageReadout.tsx ui/src/components/task-chat/completed-activity-summary.ts ui/src/i18n/xo/en.json ui/src/i18n/xo/mn.json
git commit -m "feat(xo): translate run progress and durations

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Step 5-д өөр tier файлыг гараар засвал түүнийг ч нэрээр нь нэм.

---

### Task 6: Даалгаврын чатын урсгал ба картууд

**Files:**
- Modify: `scripts/xo-i18n/tiers.ts` (Ү6 7.1 бүлгийн төгсгөлд)
- Modify: `ui/src/components/TaskChatThread.tsx:117` (+ import), `:1560-1590`, `:2745-2752`
- Modify: `ui/src/components/task-chat/TaskChatPlanPreviewCard.tsx:4` (+ import), `:150`
- Modify: `ui/src/components/task-chat/TaskChatThreadView.tsx:25` (+ import), `:313-314` (tier-д нэмэхгүй)
- Test: `ui/src/components/TaskChatThread.test.tsx`, `ui/src/components/task-chat/TaskChatPlanPreviewCard.test.tsx`
- Modify: `ui/src/i18n/xo/en.json`, `mn.json`

**Interfaces:**
- Consumes: `tx` (ui/src/i18n/xo.ts); `i18n` (ui/src/i18n, тестэд). Task 5-ын каталогт орсон "Running", "Stopped" түлхүүрийг дахин бүү нэм.
- Produces: TaskChatThread-ийн failure marker шошго tx-ээр гарна: "Approval required", "Usage limit reached", "Run cancelled", "Run interrupted", "Run timed out", "Run failed". Task 7 "Run failed", "Run cancelled", "Run timed out" түлхүүрийг энэ task-ийн mn утгаар хэрэглэнэ.

Тэмдэглэл: TaskChatThreadView.tsx:313-314 marker-ийн `label`-ийг англи тексттэй харьцуулж "Try again" товч гаргах эсэхийг шийддэг. mn дээр шошго орчуулагдсаны дараа энэ харьцуулалт таарахгүй болж товч алга болно. Тиймээс харьцуулалтыг `tx()`-тэй болгоно. Transcript-adapter, PlanPreviewCard:71, ProtocolActivityRow:285, IssueChatThread:1639-ийн label харьцуулалт provider өгөгдлөөс ирдэг тул бүү хөнд.

ui/vitest.config.ts-д transform plugin байхгүй. Тестэд зөвхөн гараар бичсэн `tx()` орчуулагдана, tier-ийн автомат орчуулга ажиллахгүй. Тиймээс mn тест нь Step 5-ын гар засварыг л шалгана.

- [ ] **Step 1: tiers.ts-д нэмэх**

Ү6 7.1 бүлгийн сүүлийн мөрийн дараа:

```ts
  "ui/src/components/task-chat/RichWorkProductCard.tsx",
  "ui/src/components/task-chat/RunnerGoalWidget.tsx",
  "ui/src/components/task-chat/TaskChatBubbleActions.tsx",
  "ui/src/components/task-chat/TaskChatDescriptionBubble.tsx",
  "ui/src/components/task-chat/TaskChatMarker.tsx",
  "ui/src/components/task-chat/TaskChatPlanPreviewCard.tsx",
  "ui/src/components/task-chat/TaskChatPlanView.tsx",
  "ui/src/components/task-chat/TaskChatProjectCreatedCard.tsx",
  "ui/src/components/task-chat/TaskChatSystemNotice.tsx",
  "ui/src/components/task-chat/TaskChatToolCard.tsx",
  "ui/src/components/task-chat/TaskChatTurnStatusIsland.tsx",
  "ui/src/components/task-chat/TaskMessageScroller.tsx",
  "ui/src/components/task-chat/task-chat-adapter.ts",
  "ui/src/components/TaskChatThread.tsx",
```

- [ ] **Step 2: Failing check-ийг харах**

Run: `pnpm xo:i18n:extract; pnpm xo:i18n:check`
Expected: FAIL. "гараар:" мөрүүдээс TaskChatPlanPreviewCard.tsx:150 (template-complex) ба TaskChatThread.tsx:2745 (mixed-jsx) гарна. Өөр мөр гарвал тэмдэглэ.

- [ ] **Step 3: Failing тестүүд**

ui/src/components/TaskChatThread.test.tsx: 10-р мөрийн (`import { TaskChatThread } from "./TaskChatThread";`) дараа:

```ts
import { i18n } from "@/i18n";
```

"explains a native provider usage limit without exposing its error code" тестийн (1093-1142) дараа:

```tsx
  it("mn дээр хэрэглээний хязгаарын шошгыг орчуулж, дахин оролдох товчийг хадгална", async () => {
    await i18n.changeLanguage("mn");
    try {
      const onRetryFailedRun = vi.fn();
      render(
        <TaskChatThread
          comments={[]}
          onAdd={async () => {}}
          issueStatus="blocked"
          onRetryFailedRun={onRetryFailedRun}
          linkedRuns={[
            {
              runId: "native-usage-limit",
              runtimeMode: "native",
              status: "failed",
              errorCode: "native_provider_usage_limit",
              agentId: "agent-1",
              agentName: "Runner",
              adapterType: "paperclip_runner",
              createdAt: "2026-08-25T18:00:00.000Z",
              startedAt: "2026-08-25T18:00:00.000Z",
              finishedAt: "2026-08-25T18:00:02.000Z",
            },
          ]}
        />,
      );

      const marker = container.querySelector(
        '[data-testid="task-chat-collapsible-marker"]',
      );
      expect(marker?.textContent).toContain("Хэрэглээний хязгаарт хүрсэн");
      expect(marker?.textContent).not.toContain("Usage limit reached");
      const disclosure = marker?.querySelector<HTMLButtonElement>(
        'button[aria-expanded="false"]',
      );
      expect(disclosure).not.toBeNull();
      flushSync(() => disclosure!.click());
      const details = container.querySelector(
        '[data-testid="task-chat-collapsible-marker-details"]',
      );
      expect(details?.textContent).toContain(
        "Загварын үйлчилгээ үзүүлэгч одоогийн хэрэглээний хязгаартаа хүрсэн.",
      );
      const retry = container.querySelector<HTMLButtonElement>(
        '[data-testid="task-chat-run-failed-try-again"]',
      );
      expect(retry).not.toBeNull();
      flushSync(() => retry!.click());
      await Promise.resolve();
      expect(onRetryFailedRun).toHaveBeenCalledWith("native-usage-limit");
    } finally {
      await i18n.changeLanguage("en");
    }
  });
```

ui/src/components/task-chat/TaskChatPlanPreviewCard.test.tsx: 7-р мөрийн (`ThemeProvider` импорт) дараа `import { i18n } from "@/i18n";`. "renders a saved revision as a Plan-pane link" тестийн дараа:

```tsx
  it("mn дээр Plan-pane холбоосын aria-label-ийг орчуулна", async () => {
    await i18n.changeLanguage("mn");
    try {
      act(() => root.render(
        <ThemeProvider>
          <TaskChatPlanPreviewCard source={{ kind: "saved", document: planDocument() }} />
        </ThemeProvider>,
      ));

      const preview = container.querySelector('[data-testid="task-chat-plan-preview"]');
      expect(preview?.getAttribute("aria-label")).toBe("Төлөвлөгөө нээх (хувилбар 4)");
    } finally {
      await i18n.changeLanguage("en");
    }
  });
```

Run: `pnpm exec vitest run ui/src/components/TaskChatThread.test.tsx ui/src/components/task-chat/TaskChatPlanPreviewCard.test.tsx -t "mn дээр"`
Expected: FAIL. Marker "Usage limit reached" гэж англиар гарна, aria-label "Open Plan revision 4" хэвээр.

- [ ] **Step 4: Transform-ын хамрах хүрээг шалгах**

Run: `pnpm xo:i18n:extract`
Expected: en.json-д Step 6-ийн хүснэгтэд байгаа transform түлхүүрүүд ("Changes requested", "Agent session goal", "Loading conversation", "{{count}} pending input" гэх мэт) нэмэгдэнэ. Код өөрчлөхгүй.

- [ ] **Step 5: Transform барихгүй мөрүүдийг tx() болгох**

TaskChatThread.tsx: 117-р мөрийн (`import { TaskChatPresentationProvider } from "@/components/task-chat/presentation-mode";`) дараа:

```ts
import { tx } from "@/i18n/xo";
```

1560-1590 (`const label =`-ээс `detail`-ийн төгсгөл хүртэл; `const` тул transform барихгүй):

```ts
        const label =
          code === "native_provider_approval_required" && source.status === "failed"
            ? tx("Approval required")
            : code === "native_provider_usage_limit" && source.status === "failed"
            ? tx("Usage limit reached")
            : source.status === "cancelled"
              ? tx("Run cancelled")
              : source.status === "interrupted"
                ? tx("Run interrupted")
                : source.status === "timed_out"
                  ? tx("Run timed out")
                  : tx("Run failed");
        const responseBoundary = sourceHasNativeResponse
          ? tx("after returning a final response")
          : tx("before returning an answer");
        const detail =
          source.status === "cancelled"
            ? tx("The run was cancelled {{responseBoundary}}.", { responseBoundary })
            : source.status === "interrupted"
              ? tx("The run was interrupted {{responseBoundary}}.", { responseBoundary })
              : code === "native_provider_approval_required"
                ? tx("This operation requires approval, but this runner has no interactive approval handler. Review the operation and update the agent's permission setting before retrying.")
                : code === "native_provider_model_rejected"
                ? tx("The provider rejected the selected model. Check the model ID and your account's access, save the agent configuration, then retry. View the run for the provider's full error.")
                : code === "native_provider_usage_limit" &&
                    source.status === "failed"
                  ? tx("The model provider has reached its current usage limit. Try again after the limit resets.")
                  : code === "provider_frame_too_large"
                    ? tx("Provider output exceeded the safe limit.")
                    : source.status === "timed_out"
                      ? tx("The runner timed out {{responseBoundary}} ({{code}}).", { responseBoundary, code })
                      : tx("The runner stopped {{responseBoundary}} ({{code}}).", { responseBoundary, code });
```

Англи өгүүлбэрийг үсэг, цэг таслалаар нь яг хадгал: en дээр гаралт өөрчлөгдөх ёсгүй, одоогийн тестүүд эдгээр өгүүлбэрийг шалгадаг.

2745-2752 (mixed-jsx, `historyError` div):

```tsx
                  {tx("Some task history could not be loaded.")}
                  <Button variant="ghost" size="sm" onClick={retryHistory}>
                    {tx("Retry")}
                  </Button>
```

TaskChatPlanPreviewCard.tsx: 4-р мөрийн (`import type { TaskChatProviderActivityItem } from "./task-chat-model";`) дараа `import { tx } from "@/i18n/xo";`. 150:

```tsx
        aria-label={ariaLabel ?? (revision == null ? tx("Open Plan") : tx("Open Plan revision {{revision}}", { revision }))}
```

71-р мөрийн `label === "Revision" || label === "Document Revision"` provider өгөгдлийг шалгадаг тул бүү хөнд.

TaskChatThreadView.tsx: 25-р мөрийн (`import { TaskChatPlanPreviewCard } from "./TaskChatPlanPreviewCard";`) дараа `import { tx } from "@/i18n/xo";`. 313-314:

```ts
              (item.label === tx("Run failed") ||
                item.label === tx("Usage limit reached")),
```

TaskChatThreadView.tsx-ийг tier-д бүү нэм: энэ task зөвхөн харьцуулалтыг засна.

Step 2-т тэмдэглэсэн бусад "гараар:" мөрийг ч tx()-д ороо.

Run: `pnpm exec vitest run ui/src/components/TaskChatThread.test.tsx ui/src/components/task-chat/TaskChatPlanPreviewCard.test.tsx`
Expected: en тестүүд PASS. mn тестүүд каталог орох хүртэл (Step 6) FAIL.

- [ ] **Step 6: Каталог**

Run: `pnpm xo:i18n:extract; pnpm xo:i18n:todo ui/src/components/task-chat/ ui/src/components/TaskChatThread`

`/private/tmp/xo-y6-t6.json`. Доорх утгуудыг заавал ашигла:

```json
{
  "Approval required": "Зөвшөөрөл шаардлагатай",
  "Usage limit reached": "Хэрэглээний хязгаарт хүрсэн",
  "Run cancelled": "Ажиллагааг цуцалсан",
  "Run interrupted": "Ажиллагаа тасалдсан",
  "Run timed out": "Ажиллагааны хугацаа хэтэрсэн",
  "Run failed": "Ажиллагаа амжилтгүй болсон",
  "after returning a final response": "эцсийн хариу буцаасны дараа",
  "before returning an answer": "хариу буцаахаас өмнө",
  "The run was cancelled {{responseBoundary}}.": "Ажиллагааг {{responseBoundary}} цуцалсан.",
  "The run was interrupted {{responseBoundary}}.": "Ажиллагаа {{responseBoundary}} тасалдсан.",
  "This operation requires approval, but this runner has no interactive approval handler. Review the operation and update the agent's permission setting before retrying.": "Энэ үйлдэлд зөвшөөрөл шаардлагатай, гэвч энэ гүйцэтгэгчид харилцан зөвшөөрөл өгөх боловсруулагч алга. Дахин оролдохоос өмнө үйлдлийг хянаж, агентын зөвшөөрлийн тохиргоог шинэчилнэ үү.",
  "The provider rejected the selected model. Check the model ID and your account's access, save the agent configuration, then retry. View the run for the provider's full error.": "Үйлчилгээ үзүүлэгч сонгосон загварыг татгалзсан. Загварын ID болон бүртгэлийнхээ эрхийг шалгаж, агентын тохиргоог хадгалаад дахин оролдоно уу. Үйлчилгээ үзүүлэгчийн алдааны бүрэн мэдээллийг ажиллагаанаас харна уу.",
  "The model provider has reached its current usage limit. Try again after the limit resets.": "Загварын үйлчилгээ үзүүлэгч одоогийн хэрэглээний хязгаартаа хүрсэн. Хязгаар шинэчлэгдсэний дараа дахин оролдоно уу.",
  "Provider output exceeded the safe limit.": "Үйлчилгээ үзүүлэгчийн гаралт аюулгүй хязгаараас хэтэрсэн.",
  "The runner timed out {{responseBoundary}} ({{code}}).": "Гүйцэтгэгчийн хугацаа {{responseBoundary}} хэтэрсэн ({{code}}).",
  "The runner stopped {{responseBoundary}} ({{code}}).": "Гүйцэтгэгч {{responseBoundary}} зогссон ({{code}}).",
  "Some task history could not be loaded.": "Даалгаврын түүхийн зарим хэсгийг ачаалж чадсангүй.",
  "Open Plan": "Төлөвлөгөө нээх",
  "Open Plan revision {{revision}}": "Төлөвлөгөө нээх (хувилбар {{revision}})",
  "Changes requested": "Өөрчлөлт хүссэн",
  "Opening": "Нээж байна",
  "Open": "Нээлттэй",
  "Draft": "Ноорог",
  "Merged": "Нэгтгэсэн",
  "Closed": "Хаалттай",
  "Down": "Унасан",
  "Unhealthy": "Хэвийн бус",
  "Agent session goal": "Агентын сессийн зорилго",
  "Session goal": "Сессийн зорилго",
  "Working now": "Одоо ажиллаж байна",
  "Type /goal followed by an objective to pursue work across turns.": "Олон ээлжид үргэлжлэх ажил эхлүүлэхийн тулд /goal гэж бичээд зорилгоо оруулна уу.",
  "tokens": "токен",
  "{{iterations}} iterations": "{{iterations}} давталт",
  "Edit goal": "Зорилго засах",
  "Pause goal": "Зорилгыг түр зогсоох",
  "Resume goal": "Зорилгыг үргэлжлүүлэх",
  "Clear goal": "Зорилгыг арилгах",
  "Replace session goal?": "Сессийн зорилгыг солих уу?",
  "Edit session goal": "Сессийн зорилгыг засах",
  "This clears the unfinished goal and starts a new goal with the objective below.": "Дуусаагүй зорилгыг арилгаж, доорх агуулгаар шинэ зорилго эхлүүлнэ.",
  "Update the objective without clearing the goal's progress.": "Зорилгын явцыг арилгалгүйгээр агуулгыг шинэчилнэ.",
  "Goal objective": "Зорилгын агуулга",
  "Replace goal": "Зорилгыг солих",
  "Save goal": "Зорилго хадгалах",
  "Copy message": "Мессеж хуулах",
  "Edit description": "Тайлбар засах",
  "Trying again...": "Дахин оролдож байна...",
  "View run": "Ажиллагааг харах",
  "Writing plan": "Төлөвлөгөө бичиж байна",
  "Waiting for the first plan step…": "Төлөвлөгөөний эхний алхмыг хүлээж байна…",
  "Open the synchronized plan to review it.": "Синк хийсэн төлөвлөгөөг нээж хянана уу.",
  "Streaming Plan preview": "Төлөвлөгөөний урьдчилсан харагдац ирж байна",
  "· rev {{revision}}": "· хув. {{revision}}",
  "{{done}}/{{length}} done": "{{done}}/{{length}} дууссан",
  "Project created: {{name}}": "Төсөл үүсгэсэн: {{name}}",
  "Project created": "Төсөл үүсгэсэн",
  "System update: {{title}}": "Системийн шинэчлэл: {{title}}",
  "Interrupted": "Тасалдсан",
  "Changed": "Өөрчилсөн",
  "Step": "Алхам",
  "Turn plan": "Ээлжийн төлөвлөгөө",
  "Within-turn checklist": "Ээлж доторх шалгах жагсаалт",
  "Scroll to latest": "Хамгийн сүүлийнх рүү гүйлгэх",
  "New session": "Шинэ сесс",
  "Earlier messages and files are still available.": "Өмнөх мессеж, файлууд хэвээр байгаа.",
  "Document · rev {{latestRevisionNumber}}": "Баримт · хув. {{latestRevisionNumber}}",
  "Agent attachment": "Агентын хавсралт",
  "Waiting to resume": "Үргэлжлүүлэхийг хүлээж байна",
  "The previous execution needs to be checked before work can continue. See the task’s execution hold for the next action. Individual checks remain in the run history.": "Ажлыг үргэлжлүүлэхээс өмнө өмнөх гүйцэтгэлийг шалгах шаардлагатай. Дараагийн алхмыг даалгаврын гүйцэтгэлийн түр зогсолтоос харна уу. Шалгалт тус бүр ажиллагааны түүхэнд хадгалагдана.",
  "Couldn't start": "Эхэлж чадсангүй",
  "Run completed": "Ажиллагаа дууссан",
  "This turn was cancelled before it returned a response.": "Энэ ээлжийг хариу буцаахаас өмнө цуцалсан.",
  "The runner returned no user-facing response.": "Гүйцэтгэгч хэрэглэгчид харагдах хариу буцаагаагүй.",
  "Runtime permission": "Ажиллах үеийн зөвшөөрөл",
  "Runtime input": "Ажиллах үеийн оролт",
  "Interrupting…": "Тасалж байна…",
  "Interrupt": "Таслах",
  "Loading conversation": "Харилцааг ачаалж байна",
  "{{count}} pending input_one": "{{count}} хүлээгдэж буй оролт",
  "{{count}} pending input_other": "{{count}} хүлээгдэж буй оролт"
}
```

"The previous execution…" түлхүүр нь ’ (U+2019) тэмдэгтэй. Түлхүүрийг кодоос яг хуулж ав. "Running" ба "Stopped"-ийг (Task 5), "Review", "Failed", "Pending", "Cancel", "Saving…", "Add a description...", "Try again", "Plan", "Retry"-г каталогт аль хэдийн байгаа тул бүү нэм. todo-д гарсан боловч энд байхгүй түлхүүрийг үг сонголтоор орчуулж нэм. Каталогт өөр утгаар аль хэдийн байгаа түлхүүрийг файлаас хасаад тайланд нэрийг нь бич.

Run: `pnpm xo:i18n:merge /private/tmp/xo-y6-t6.json && pnpm xo:i18n:check`
Expected: PASS, эдгээр 14 файлын "гараар:" мөр үгүй.

- [ ] **Step 7: Тест**

Run: `pnpm exec vitest run ui/src/components/TaskChatThread.test.tsx ui/src/components/task-chat/TaskChatPlanPreviewCard.test.tsx ui/src/components/task-chat/RunnerGoalWidget.test.tsx ui/src/components/task-chat/TaskChatDescriptionBubble.test.tsx ui/src/components/task-chat/TaskChatMarker.test.tsx ui/src/components/task-chat/TaskChatSystemNotice.test.tsx ui/src/components/task-chat/TaskChatTurnStatusIsland.test.tsx ui/src/components/task-chat/TaskMessageScroller.test.tsx ui/src/components/task-chat/task-chat-adapter.test.ts ui/src/components/task-chat/TaskChatThreadView.performance.test.tsx ui/src/i18n/xo/parity.test.ts && pnpm xo:i18n:test && (cd ui && pnpm exec tsc --noEmit)`
Expected: PASS. mn тестүүд ногоон, en дээрх одоогийн англи assertion өөрчлөгдөхгүй.

- [ ] **Step 8: Commit**

```bash
git add scripts/xo-i18n/tiers.ts ui/src/components/TaskChatThread.tsx ui/src/components/TaskChatThread.test.tsx ui/src/components/task-chat/TaskChatPlanPreviewCard.tsx ui/src/components/task-chat/TaskChatPlanPreviewCard.test.tsx ui/src/components/task-chat/TaskChatThreadView.tsx ui/src/i18n/xo/en.json ui/src/i18n/xo/mn.json
git commit -m "feat(xo): translate task chat thread and cards

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Step 5-д өөр tier файлыг гараар засвал түүнийг ч нэрээр нь нэм.

---

### Task 7: Issue chat урсгал ба сэтгэгдлийн thread

**Files:**
- Modify: `scripts/xo-i18n/tiers.ts` (Ү6 7.1 бүлгийн төгсгөлд)
- Modify: `ui/src/components/IssueChatThread.tsx:256` (+ import), `:791-798`, `:1186-1188`, `:1265-1277`, `:1748`, `:1830`, `:1859`, `:2029`, `:2310-2311`, `:2933-2939`, `:5146`, `:5159`, `:5490-5497`, `:6564-6568`
- Modify: `ui/src/components/CommentThread.tsx:28` (+ import), `:477`
- Modify: `ui/src/lib/issue-chat-messages.ts` (run-text импортын дараа + import), `runDurationLabel`, `waitingText` ×2, `"Provider activity"` (tier-д нэмэхгүй)
- Modify: `ui/src/pages/IssueDetail.tsx:2439-2440`
- Test: `ui/src/components/IssueChatThread.test.tsx`, `ui/src/lib/issue-chat-messages.test.ts`
- Modify: `ui/src/i18n/xo/en.json`, `mn.json`, `keep-en.json`

**Interfaces:**
- Consumes: `tx` (ui/src/i18n/xo.ts); `i18n` (ui/src/i18n, тестэд); `XoTrans` (`@/xo/XoTrans`, props `{ i18nKey; values?; components? }`); Task 5-ын `ranCommandsWords(n: number): string`, `calledToolsWords(n: number): string` (`@/xo/run-text`) ба Task 5-д засагдсан `formatDurationWords` (mn дээр 60000ms → «1 минут»). Task 5-ын каталогт орсон "Working", "Worked", "for {{duration}}", "Worked for {{duration}}", "Running", Task 6-ын "Run failed", "Run cancelled", "Run timed out", "Interrupt", "Copy message", "View run", "Interrupting…", Task 4-ийн "Upload failed" түлхүүрийг дахин бүү нэм.
- Produces: Issue chat-ийн ажиллагааны шошго (`runDurationLabel`), header-ийн үйл үг, хэрэгслийн тоолуур, агентын түр зогсоолтын тайлбар tx-ээр гарна. Task 8 mn дээрх browser шалгалтад эдгээр текстийг хайна.

Тэмдэглэл: `ui/src/lib/issue-chat-messages.ts`-ийг tier-д бүү нэм. Энэ нь JSX-гүй lib файл тул transform юу ч барихгүй, бүх текстийг гараар `tx()`-д оруулна. `runDurationLabel`-ийг export хийхгүй: тест нь `buildIssueChatMessages`-ээр дамжуулж шалгана.

Энэ task-д бүү хөнд (Ү6 7.2-т орно): IssueChatThread.tsx-ийн 840-842, 1121, 1146-1149, 2325-р мөрийн fallback текст ("Agent", "You", "System", "None", "Board"), `child.status`-ийн "unknown", 856-р мөрийн clipboard-ын `Result:\n…`, 1639-р мөрийн `d.label === "Intent"` харьцуулалт.

ui/vitest.config.ts-д transform plugin байхгүй. Тестэд зөвхөн гараар бичсэн `tx()` орчуулагдана, tier-ийн автомат орчуулга ажиллахгүй. Тиймээс mn тест нь Step 5-ын гар засварыг л шалгана.

- [ ] **Step 1: tiers.ts-д нэмэх**

Ү6 7.1 бүлгийн сүүлийн мөрийн (Task 6-ын `"ui/src/components/TaskChatThread.tsx",`) дараа:

```ts
  "ui/src/components/CommentThread.tsx",
  "ui/src/components/IssueChatThread.tsx",
```

- [ ] **Step 2: Failing check-ийг харах**

Run: `pnpm xo:i18n:extract; pnpm xo:i18n:check`
Expected: FAIL. "гараар:" мөрүүдээс IssueChatThread.tsx:2934 (mixed-jsx) гарна. Өөр мөр гарвал тэмдэглэ.

- [ ] **Step 3: Failing тестүүд**

ui/src/lib/issue-chat-messages.test.ts: 1-р мөрийн (`import { describe, expect, it } from "vitest";`) дараа:

```ts
import { i18n } from "@/i18n";
```

"labels pause-caused cancelled runs as paused by board" тестийн дараа:

```ts
  it("mn дээр board-ийн түр зогсоолтын шошгыг орчуулна", async () => {
    await i18n.changeLanguage("mn");
    try {
      const messages = buildIssueChatMessages({
        comments: [],
        timelineEvents: [],
        linkedRuns: [
          {
            runId: "run-paused",
            status: "cancelled",
            agentId: "agent-1",
            agentName: "CodexCoder",
            createdAt: new Date("2026-04-06T12:01:00.000Z"),
            startedAt: new Date("2026-04-06T12:01:00.000Z"),
            finishedAt: new Date("2026-04-06T12:02:00.000Z"),
            resultJson: { stopReason: "paused" },
          },
        ],
        liveRuns: [],
        transcriptsByRunId: new Map([
          [
            "run-paused",
            [
              {
                kind: "assistant",
                ts: "2026-04-06T12:01:05.000Z",
                text: "Working on it.",
              },
            ],
          ],
        ]),
        hasOutputForRun: (runId) => runId === "run-paused",
        currentUserId: "user-1",
      });

      expect(messages[0]?.metadata.custom).toMatchObject({
        chainOfThoughtLabel: "Удирдах зөвлөл түр зогсоосон (1 минут)",
        runStatus: "cancelled",
      });
    } finally {
      await i18n.changeLanguage("en");
    }
  });
```

ui/src/components/IssueChatThread.test.tsx: 44-р мөрийн (`} from "../lib/issue-chat-messages";`) дараа:

```ts
import { i18n } from "@/i18n";
```

"keeps a running chain-of-thought in the Working state between commands" тестийн дараа (ижил describe дотор, `container` нь тэр describe-ийн `beforeEach`-ээс ирнэ):

```tsx
  it("mn дээр ажиллаж буй header ба командын тоог орчуулна", async () => {
    await i18n.changeLanguage("mn");
    const root = createRoot(container);
    try {
      act(() => {
        root.render(
          <MemoryRouter>
            <IssueChatThread
              comments={[]}
              linkedRuns={[]}
              timelineEvents={[]}
              liveRuns={[
                {
                  id: "run-1",
                  issueId: "issue-1",
                  status: "running",
                  invocationSource: "comment",
                  triggerDetail: null,
                  startedAt: "2026-04-06T12:00:00.000Z",
                  finishedAt: null,
                  createdAt: "2026-04-06T12:00:00.000Z",
                  agentId: "agent-1",
                  agentName: "Agent 1",
                  adapterType: "codex_local",
                },
              ]}
              transcriptsByRunId={
                new Map([
                  [
                    "run-1",
                    [
                      {
                        kind: "tool_call",
                        ts: "2026-04-06T12:00:10.000Z",
                        name: "command_execution",
                        toolUseId: "tool-1",
                        input: { command: "pnpm test" },
                      },
                      {
                        kind: "tool_result",
                        ts: "2026-04-06T12:00:20.000Z",
                        toolUseId: "tool-1",
                        toolName: "command_execution",
                        content: "Tests passed",
                        isError: false,
                      },
                    ],
                  ],
                ])
              }
              onAdd={async () => {}}
              enableLiveTranscriptPolling={false}
            />
          </MemoryRouter>,
        );
      });

      expect(container.textContent).toContain("Ажиллаж байна");
      expect(container.textContent).toContain("1 команд ажиллуулсан");
      expect(container.textContent).not.toContain("ran 1 command");
    } finally {
      act(() => root.unmount());
      await i18n.changeLanguage("en");
    }
  });
```

`describe("IssueAssigneePausedNotice")` дотор "offers no resume action for budget pauses" тестийн дараа:

```tsx
  it("mn дээр төсвийн түр зогсоолтын тайлбарыг орчуулна", async () => {
    await i18n.changeLanguage("mn");
    const root = createRoot(container);
    try {
      act(() => {
        root.render(
          <IssueAssigneePausedNotice
            agent={pausedAgent("budget")}
            onResume={vi.fn()}
            resuming={false}
          />,
        );
      });

      expect(container.textContent).toContain(
        "Төсвийн хатуу хязгаараар түр зогсоосон.",
      );
      expect(container.textContent).not.toContain("budget hard stop");
    } finally {
      act(() => root.unmount());
      await i18n.changeLanguage("en");
    }
  });
```

Run: `pnpm exec vitest run ui/src/components/IssueChatThread.test.tsx ui/src/lib/issue-chat-messages.test.ts -t "mn дээр"`
Expected: FAIL. Header "Working", "ran 1 command", "budget hard stop", "Paused by board after …" англиар гарна.

- [ ] **Step 4: Transform-ын хамрах хүрээг шалгах**

Run: `pnpm xo:i18n:extract`
Expected: en.json-д Step 6-ийн хүснэгтэд байгаа transform түлхүүрүүд ("Resume agent", "Delete comment?", "Jump to latest", "Leave a comment...", "New runs will not start until the agent is resumed. {{pauseDetail}}" гэх мэт) нэмэгдэнэ. Код өөрчлөхгүй.

- [ ] **Step 5: Transform барихгүй мөрүүдийг tx() болгох**

Англи өгүүлбэрийг үсэг, цэг таслалаар нь яг хадгал: en дээр гаралт өөрчлөгдөх ёсгүй, одоогийн тестүүд эдгээр өгүүлбэрийг шалгадаг.

**IssueChatThread.tsx.** 256-р мөрийн (`import { resolveCommentAttribution } from "../lib/comment-attribution";`) дараа:

```ts
import { tx } from "@/i18n/xo";
import { calledToolsWords, ranCommandsWords } from "@/xo/run-text";
import { XoTrans } from "@/xo/XoTrans";
```

791-798, `pauseDetail`:

```ts
  const pauseDetail =
    agent.pauseReason === "budget"
      ? tx("It was paused by a budget hard stop.")
      : agent.pauseReason === "import"
        ? tx("It arrived paused from an organization import — imported agents stay parked until you resume them.")
        : agent.pauseReason === "system"
          ? tx("It was paused by the system.")
          : tx("It was paused manually.");
```

1186-1188, `toolCountSummary` доторх хоёр `parts.push`-ийг (одоо `ran ${commands} command${…}` ба `called ${other} tool${…}` template) дараахаар соль:

```ts
  if (commands > 0) parts.push(ranCommandsWords(commands));
  if (other > 0) parts.push(calledToolsWords(other));
```

1265-1277, header:

```ts
  let headerVerb: string;
  let headerSuffix: string | null = null;
  if (isActive) {
    headerVerb = tx("Working");
    if (liveElapsed) headerSuffix = tx("for {{duration}}", { duration: liveElapsed });
  } else if (segmentTiming) {
    const durationMs = segmentTiming.endMs - segmentTiming.startMs;
    const durationText = formatDurationWords(durationMs);
    headerVerb = tx("Worked");
    if (durationText) headerSuffix = tx("for {{duration}}", { duration: durationText });
  } else {
    headerVerb = tx("Worked");
  }
```

1748:

```ts
    typeof value.title === "string" ? value.title : tx("Provider activity");
```

1830:

```tsx
                    {String(child.role ?? tx("Child agent"))}
```

1859:

```tsx
                    <span>{String(source.title ?? tx("Unavailable source"))}</span>
```

2029:

```ts
    queueReason === "hold" ? `⏸ ${tx("Deferred wake")}` : tx("Queued");
```

2310-2311 (default parameter, дуудах бүрд үнэлэгдэнэ):

```ts
    stopRunLabel = tx("Stop run"),
    stoppingRunLabel = tx("Stopping..."),
```

2933-2939, consent-ийн `<p>`-г бүхэлд нь:

```tsx
            <p>
              <XoTrans
                i18nKey="Choose <b>Always allow</b> to share this vote and future voted AI outputs. Choose <b>Don't allow</b> to keep this vote and future votes local."
                components={{ b: <span className="font-medium text-foreground" /> }}
              />
            </p>
```

5146 ба 5159:

```ts
                  error: tx("This file type cannot be attached here"),
```

```ts
                error: err instanceof Error ? err.message : tx("Upload failed"),
```

5490-5497, `statusLabel`:

```ts
            const statusLabel =
              attachment.status === "uploading"
                ? tx("Uploading to task")
                : attachment.status === "error"
                  ? (attachment.error ?? tx("Upload failed"))
                  : attachment.inline
                    ? tx("Inserted inline")
                    : tx("Attached to task");
```

6564-6568, `resolvedEmptyMessage`:

```ts
  const resolvedEmptyMessage =
    emptyMessage ??
    (variant === "embedded"
      ? tx("No run output yet.")
      : tx("This task conversation is empty. Start with a message below."));
```

**CommentThread.tsx.** 28-р мөрийн (`import { PluginSlotOutlet } from "@/plugins/slots";`) дараа:

```ts
import { tx } from "@/i18n/xo";
```

477:

```ts
  const actionLabel = event.followUpRequested ? tx("requested follow-up") : tx("updated this task");
```

**issue-chat-messages.ts.** Task 5-ын нэмсэн `import { hoursWords, minutesWords, secondsWords } from "@/xo/run-text";` мөрийн дараа:

```ts
import { tx } from "@/i18n/xo";
```

Мөрийн дугаар Task 5-ын импортоор +1 шилжсэн тул текстээр нь хай. `runDurationLabel` доторх `switch`-ийн `case`-уудыг (`default` хэвээр):

```ts
    case "succeeded":
      return durationText ? tx("Worked for {{duration}}", { duration: durationText }) : tx("Finished work");
    case "failed":
    case "error":
      return durationText ? tx("Failed after {{duration}}", { duration: durationText }) : tx("Run failed");
    case "timed_out":
      return durationText ? tx("Timed out after {{duration}}", { duration: durationText }) : tx("Run timed out");
    case "cancelled":
      if (isOperatorInterruptedRun(run.resultJson, run.errorCode)) {
        return durationText
          ? tx("Interrupted by board after {{duration}}", { duration: durationText })
          : tx("Interrupted by board");
      }
      if (stopReason === "paused") {
        return durationText
          ? tx("Paused by board after {{duration}}", { duration: durationText })
          : tx("Paused by board");
      }
      return durationText ? tx("Cancelled after {{duration}}", { duration: durationText }) : tx("Run cancelled");
    case "queued":
      return tx("Queued");
    case "running":
      return tx("Working...");
    default:
      return formatStatusLabel(run.status);
```

`const waitingText = hasOutput ? "" : "Run finished";` мөрийг:

```ts
  const waitingText = hasOutput ? "" : tx("Run finished");
```

`title: entry.title ?? "Provider activity",` мөрийг:

```ts
        title: entry.title ?? tx("Provider activity"),
```

Queued/Working-ийн `waitingText`-ийг:

```ts
  const waitingText =
    run.status === "queued"
      ? tx("Queued...")
      : parts.length > 0
        ? ""
        : tx("Working...");
```

**IssueDetail.tsx** (tier-д аль хэдийн байгаа, `tx` импорттой). 2439-2440:

```tsx
            stopRunLabel={tx("Pause work")}
            stoppingRunLabel={tx("Pausing...")}
```

Step 2-т тэмдэглэсэн бусад "гараар:" мөрийг ч tx()-д ороо.

Run: `pnpm exec vitest run ui/src/components/IssueChatThread.test.tsx ui/src/lib/issue-chat-messages.test.ts`
Expected: en тестүүд PASS. Header-ийн mn тест Task 5-ын каталогт тулгуурладаг тул энд PASS болж болно. Бусад mn тест каталог орох хүртэл (Step 6) FAIL.

- [ ] **Step 6: Каталог**

Run: `pnpm xo:i18n:extract; pnpm xo:i18n:todo ui/src/components/IssueChatThread ui/src/components/CommentThread ui/src/lib/issue-chat-messages ui/src/pages/IssueDetail`

`/private/tmp/xo-y6-t7.json`. Доорх утгуудыг заавал ашигла:

```json
{
  "It was paused by a budget hard stop.": "Төсвийн хатуу хязгаараар түр зогсоосон.",
  "It arrived paused from an organization import — imported agents stay parked until you resume them.": "Байгууллагын импортоос түр зогссон төлөвтэй ирсэн. Импортолсон агентууд таныг үргэлжлүүлэх хүртэл зогссон хэвээр байна.",
  "It was paused by the system.": "Систем түр зогсоосон.",
  "It was paused manually.": "Гараар түр зогсоосон.",
  "Provider activity": "Үйлчилгээ үзүүлэгчийн үйл ажиллагаа",
  "Child agent": "Дэд агент",
  "Unavailable source": "Хүрэх боломжгүй эх сурвалж",
  "Deferred wake": "Хойшлуулсан сэрээлт",
  "Stop run": "Ажиллагааг зогсоох",
  "Stopping...": "Зогсоож байна...",
  "Pause work": "Ажлыг түр зогсоох",
  "Pausing...": "Түр зогсоож байна...",
  "Choose <b>Always allow</b> to share this vote and future voted AI outputs. Choose <b>Don't allow</b> to keep this vote and future votes local.": "Энэ санал болон цаашдын саналтай AI гаралтыг хуваалцахын тулд <b>Үргэлж зөвшөөрөх</b>-ийг сонгоно уу. Энэ болон цаашдын саналыг зөвхөн энд хадгалахын тулд <b>Зөвшөөрөхгүй</b>-г сонгоно уу.",
  "This file type cannot be attached here": "Энэ төрлийн файлыг энд хавсаргах боломжгүй",
  "Uploading to task": "Даалгаварт байршуулж байна",
  "Inserted inline": "Текст дотор оруулсан",
  "Attached to task": "Даалгаварт хавсаргасан",
  "No run output yet.": "Ажиллагааны гаралт одоогоор алга.",
  "This task conversation is empty. Start with a message below.": "Энэ даалгаврын харилцаа хоосон байна. Доор мессеж бичиж эхлээрэй.",
  "Finished work": "Ажлаа дуусгасан",
  "Failed after {{duration}}": "Амжилтгүй болсон ({{duration}})",
  "Timed out after {{duration}}": "Хугацаа хэтэрсэн ({{duration}})",
  "Interrupted by board after {{duration}}": "Удирдах зөвлөл тасалсан ({{duration}})",
  "Interrupted by board": "Удирдах зөвлөл тасалсан",
  "Paused by board after {{duration}}": "Удирдах зөвлөл түр зогсоосон ({{duration}})",
  "Paused by board": "Удирдах зөвлөл түр зогсоосон",
  "Cancelled after {{duration}}": "Цуцалсан ({{duration}})",
  "Working...": "Ажиллаж байна...",
  "Queued...": "Дараалалд байна...",
  "Run finished": "Ажиллагаа дууссан",
  "New runs will not start until the agent is resumed. {{pauseDetail}}": "Агентыг үргэлжлүүлэх хүртэл шинэ ажиллагаа эхлэхгүй. {{pauseDetail}}",
  "is paused.": "түр зогссон байна.",
  "Resume agent": "Агентыг үргэлжлүүлэх",
  "Chat renderer hit an internal state error.": "Чат харуулагч дотоод төлөвийн алдаатай тулгарлаа.",
  "Showing a safe fallback transcript instead of crashing the tasks page.": "Даалгаврын хуудсыг унагахгүйн тулд аюулгүй нөөц бичлэгийг харуулж байна.",
  "No message content.": "Мессежийн агуулга алга.",
  "Unable to copy text": "Текстийг хуулж чадсангүй",
  "Result": "Үр дүн",
  "(provider-reported)": "(үйлчилгээ үзүүлэгчийн мэдээлснээр)",
  "Follow-up": "Үргэлжлүүлэх хүсэлт",
  "Interrupting...": "Тасалж байна...",
  "Sent from iMessage": "iMessage-ээс илгээсэн",
  "Sending...": "Илгээж байна...",
  "Unable to copy message": "Мессежийг хуулж чадсангүй",
  "Delete comment": "Сэтгэгдэл устгах",
  "Delete comment?": "Сэтгэгдлийг устгах уу?",
  "This will replace the comment with a deleted-comment marker.": "Сэтгэгдлийг «устгасан сэтгэгдэл» гэсэн тэмдгээр солино.",
  "Helpful": "Хэрэгтэй",
  "Needs work": "Сайжруулах шаардлагатай",
  "What could have been better?": "Юуг илүү сайн хийж болох байсан бэ?",
  "Add a short note": "Богино тэмдэглэл нэмэх",
  "Save note": "Тэмдэглэл хадгалах",
  "Save your feedback sharing preference": "Санал хүсэлт хуваалцах тохиргоогоо хадгалах",
  "Choose whether voted AI outputs can be shared with {{brand}} Labs. This answer becomes the default for future thumbs up and thumbs down votes.": "Саналтай AI гаралтыг {{brand}} Labs-тэй хуваалцах эсэхийг сонгоно уу. Энэ хариулт цаашдын эерэг, сөрөг саналын анхдагч тохиргоо болно.",
  "This vote is always saved locally.": "Энэ санал үргэлж зөвхөн энд хадгалагдана.",
  "You can change this later in Settings > General.": "Үүнийг дараа нь Тохиргоо > Ерөнхий хэсэгт өөрчилж болно.",
  "Read our terms of service": "Үйлчилгээний нөхцөлийг унших",
  "Don't allow": "Зөвшөөрөхгүй",
  "Always allow": "Үргэлж зөвшөөрөх",
  "updated this task": "энэ даалгаврыг шинэчилсэн",
  "Hide confirmation": "Баталгаажуулалтыг нуух",
  "Expired confirmation": "Хугацаа нь дууссан баталгаажуулалт",
  "No additional details.": "Нэмэлт дэлгэрэнгүй алга.",
  "Stale disposition warning": "Хуучирсан шийдвэрийн анхааруулга",
  "{{brand}}": "{{brand}}",
  "Unable to copy system notice": "Системийн мэдэгдлийг хуулж чадсангүй",
  "Unable to copy system notice link": "Системийн мэдэгдлийн холбоосыг хуулж чадсангүй",
  "Copy link": "Холбоос хуулах",
  "Copy link to system notice": "Системийн мэдэгдлийн холбоосыг хуулах",
  "Copy notice text": "Мэдэгдлийн текстийг хуулах",
  "Copy system notice": "Системийн мэдэгдлийг хуулах",
  "requested follow-up": "үргэлжлүүлэхийг хүссэн",
  "Workspace": "Ажлын талбар",
  "run": "ажиллагаа",
  "deleted this comment": "энэ сэтгэгдлийг устгасан",
  "Drop to upload": "Байршуулахын тулд энд тавина уу",
  "Images insert into the reply. Other files are added to this task.": "Зураг хариунд шууд орно. Бусад файл энэ даалгаварт нэмэгдэнэ.",
  "We couldn’t confirm whether this comment was saved. It may already be in the conversation. Review it before starting another draft.": "Энэ сэтгэгдэл хадгалагдсан эсэхийг баталж чадсангүй. Харилцаанд аль хэдийн орсон байж магадгүй. Шинэ ноорог эхлүүлэхээс өмнө шалгана уу.",
  "Review conversation": "Харилцааг шалгах",
  "Couldn’t refresh the conversation. Try reviewing it again.": "Харилцааг шинэчилж чадсангүй. Дахин шалгаж үзнэ үү.",
  "Discarding this draft does not remove any saved comment or uploaded file.": "Энэ ноорогийг хаявал хадгалсан сэтгэгдэл, байршуулсан файл устахгүй.",
  "Discard draft and start new": "Ноорогийг хаяад шинээр эхлэх",
  "Reply": "Хариулах",
  "Remove {{name}}": "{{name}}-г хасах",
  "Attach file": "Файл хавсаргах",
  "Cmd/Ctrl+. cycles modes": "Cmd/Ctrl+. горимуудыг ээлжлэн солино",
  "Responsible": "Хариуцагч",
  "Stopping…": "Зогсоож байна…",
  "Stop": "Зогсоох",
  "Stop response": "Хариуг зогсоох",
  "Posting...": "Нийтэлж байна...",
  "Send": "Илгээх",
  "No responsible selected": "Хариуцагч сонгоогүй",
  "This comment will be posted without an assignee, so no agent will be woken to act on it. Go back to pick a responsible, or send anyway.": "Энэ сэтгэгдэл хариуцагчгүй нийтлэгдэх тул ямар ч агент үүн дээр ажиллахаар сэрэхгүй. Буцаж хариуцагч сонгох эсвэл шууд илгээнэ үү.",
  "Go back": "Буцах",
  "Send anyway": "Шууд илгээх",
  "Jump to latest": "Хамгийн сүүлийнх рүү очих",
  "Legacy recovery task": "Хуучин сэргээх даалгавар",
  "Legacy recovery task. Newer recovery actions live on the source task": "Хуучин сэргээх даалгавар. Шинэ сэргээх үйлдлүүд эх даалгавар дээр байна",
  "Copy comment as markdown": "Сэтгэгдлийг markdown-аар хуулах",
  "Queued": "Дараалалд",
  "Queueing...": "Дараалалд оруулж байна...",
  "No timeline entries yet.": "Цагийн хэлхээнд бичлэг алга.",
  "Lease": "Түрээс",
  "Failure: {{failureReason}}": "Алдаа: {{failureReason}}",
  "Timeline (": "Цагийн хэлхээ (",
  "Queued Comments ({{length}})": "Дараалалд буй сэтгэгдэл ({{length}})",
  "Leave a comment...": "Сэтгэгдэл үлдээх...",
  "Attach image": "Зураг хавсаргах",
  "Comment": "Сэтгэгдэл"
}
```

Гурван түлхүүр онцгой тэмдэгттэй: "It arrived paused from an organization import — imported…" em dash (—) агуулна, "We couldn’t confirm…" ба "Couldn’t refresh…" нь ’ (U+2019) агуулна. Түлхүүрийг кодоос яг хуулж ав.

"{{brand}}"-ийн mn утга en-тэй ижил тул parity check үүнийг орчуулаагүй гэж үзнэ. `ui/src/i18n/xo/keep-en.json` массивын төгсгөлд `"{{brand}}"` нэм.

"Upload failed", "Working", "Worked", "for {{duration}}", "Worked for {{duration}}", "Running", "Run failed", "Run cancelled", "Run timed out", "Interrupt", "Copy message", "View run", "Interrupting…", "Resuming…", "Copy", "Copy failed", "Input", "Model", "Cancel", "Comment deleted", "More actions", "Dismiss", "Saving...", "Status", "Assignee", "Environment", "Provider"-ийг каталогт аль хэдийн байгаа тул бүү нэм. todo-д гарсан боловч энд байхгүй түлхүүрийг үг сонголтоор орчуулж нэм. Каталогт өөр утгаар аль хэдийн байгаа түлхүүрийг файлаас хасаад тайланд нэрийг нь бич.

Run: `pnpm xo:i18n:merge /private/tmp/xo-y6-t7.json && pnpm xo:i18n:check`
Expected: PASS, эдгээр файлын "гараар:" мөр үгүй.

- [ ] **Step 7: Тест**

Run: `pnpm exec vitest run ui/src/components/IssueChatThread.test.tsx ui/src/components/CommentThread.test.tsx ui/src/components/CommentThread.external-references.test.tsx ui/src/components/IssueChatThreadSystemNotice.test.tsx ui/src/lib/issue-chat-messages.test.ts ui/src/i18n/xo/parity.test.ts && pnpm xo:i18n:test && (cd ui && pnpm exec tsc --noEmit)`
Expected: PASS. mn тестүүд ногоон, en дээрх одоогийн англи assertion өөрчлөгдөхгүй.

- [ ] **Step 8: Commit**

```bash
git add scripts/xo-i18n/tiers.ts ui/src/components/IssueChatThread.tsx ui/src/components/IssueChatThread.test.tsx ui/src/components/CommentThread.tsx ui/src/lib/issue-chat-messages.ts ui/src/lib/issue-chat-messages.test.ts ui/src/pages/IssueDetail.tsx ui/src/i18n/xo/en.json ui/src/i18n/xo/mn.json ui/src/i18n/xo/keep-en.json
git commit -m "feat(xo): translate issue chat thread

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Step 5-д өөр tier файлыг гараар засвал түүнийг ч нэрээр нь нэм.

---

### Task 8: SYNC.md, PROGRESS.md, бүрэн шалгалт, browser (127.0.0.1:3110)

**Files:**
- Modify: `docs/xo/SYNC.md` ("## Lockfile"-ийн өмнө шинэ хэсэг)
- Modify: `docs/xo/PROGRESS.md` ("# XO ахицын бүртгэл"-ийн дараа шинэ хэсэг)

**Interfaces:**
- Consumes: Task 1-7-ийн commit-ууд (SHA-г `git log --oneline <BASE>..HEAD`-ээс ав; BASE = Task 1 эхлэхээс өмнөх HEAD, controller-ийн ledger-д бичигдсэн).
- Produces: SYNC.md-ийн "Ү6 7.1" хэсэг, PROGRESS.md-ийн "Ү6 7.1" бүртгэл. Код өөрчлөхгүй.

- [ ] **Step 1: Хүснэгтийг git-тэй тулгах**

Run: `git diff --stat <BASE>..HEAD -- ui/src server packages scripts | cat`

Доорх хүснэгтэд байхгүй upstream файл (ui/src/xo/*, ui/src/i18n/xo/*, scripts/xo-i18n/*, docs/xo/*-ээс бусад) гарвал хүснэгтэд мөр нэмж, өөрчлөлтийг нэг мөрөөр бич. Хүснэгтэд байгаа боловч diff-д гараагүй файлыг хүснэгтээс хас (тухайн task төлөвлөгөөнөөс өөрөөр хэрэгжсэн гэсэн үг; тайланд нэрийг нь бич).

- [ ] **Step 2: SYNC.md-д хэсэг нэмэх** ("## Ү3-А-д хөндсөн upstream файлууд" хэсгийн дараа, "## Lockfile"-ийн өмнө)

```markdown
## Ү6 7.1-д хөндсөн upstream файлууд

T1 = scripts/xo-i18n/tiers.ts-ийн tier-1 жагсаалтад нэмсэн (Vite transform JSX текстийг автоматаар tx()-ээр ороодог, эх кодод өөрчлөлтгүй). "гар tx" = template эсвэл холимог JSX-ийг эх кодод tx()/XoTrans-аар ороосон.

| Файл | Өөрчлөлт |
|---|---|
| ui/src/components/IssuesList.tsx | T1; гар tx (бүлгийн гарчиг, хоосон төлөвийн тоо) |
| ui/src/components/IssueFiltersPopover.tsx | T1; гар tx (шүүлтүүрийн тоо) |
| ui/src/components/IssueColumns.tsx | T1 |
| ui/src/components/MobileBottomNav.tsx | T1 |
| ui/src/lib/timeAgo.ts | mn үед mnTimeAgo() руу шилжүүлсэн |
| ui/src/lib/timeAgo.test.ts | шинэ: mn ба en гаралт |
| ui/src/components/NewIssueDialog.tsx | T1; гар tx/XoTrans (горимын тайлбар, хавсралтын мөр) |
| ui/src/components/issue-properties/helpers.ts | T1 |
| ui/src/lib/work-mode-meta.ts | T1; titleForPendingWorkMode гар tx |
| ui/src/lib/work-mode-meta.test.ts | mn тест нэмсэн |
| ui/src/components/issue-properties/IssueProperties.tsx | T1; гар tx |
| ui/src/components/issue-properties/IssuePropertiesArtifactsTab.tsx | T1; гар tx |
| ui/src/components/issue-properties/IssuePropertiesPlansTab.tsx | T1; гар tx |
| ui/src/components/issue-properties/external-object-rows.tsx | T1 |
| ui/src/components/issue-properties/relation-controls.tsx | T1 |
| ui/src/components/issue-properties/property-picker.tsx | гар tx (T1-д ороогүй) |
| ui/src/components/task-chat/TaskChatComposer.tsx | MODE_DESCRIPTION → xoLabel, placeholder ба хавсралтын гар tx |
| ui/src/components/task-chat/TaskChatCompactInteractionCard.tsx | гар tx |
| ui/src/components/task-chat/TaskChatBubble.tsx | хавсралтын төрөл xoFileKindLabel, гар tx |
| ui/src/components/task-chat/TaskChatProtocolCard.tsx | гар tx |
| ui/src/components/task-chat/TaskChatRichInput.tsx, TaskChatInteractionCard.tsx, TaskChatProtocolActivityRow.tsx, TaskChatQueuedMessages.tsx, TaskChatBlockerLinks.tsx, TaskChatPausedTakeover.tsx | T1 |
| ui/src/lib/issue-chat-messages.ts | formatDurationWords, runDurationLabel, waitingText, Provider activity гар tx (T1-д ороогүй) |
| ui/src/components/task-chat/TaskChatLiveRunPill.tsx | run-text helper, гар tx |
| ui/src/components/task-chat/TaskChatTurn.tsx | run-text helper, гар tx |
| ui/src/components/task-chat/transcript-adapter.ts | үйлдлийн шошго xoActivityLabel |
| ui/src/components/task-chat/TaskChatActivityPhase.tsx | гар tx |
| ui/src/components/task-chat/TaskChatStatusPill.tsx | статусын шошго tx |
| ui/src/components/task-chat/TaskChatUsageReadout.tsx | гар tx |
| ui/src/components/task-chat/completed-activity-summary.ts | хураангуй өгүүлбэр гар tx |
| ui/src/components/task-chat/TaskChatRunnerTurn.tsx, TaskChatRunnerActivityGroup.tsx | T1 |
| ui/src/components/TaskChatThread.tsx | T1; алдааны шошго ба тоо гар tx |
| ui/src/components/TaskChatThread.test.tsx | mn тест нэмсэн |
| ui/src/components/task-chat/TaskChatPlanPreviewCard.tsx | гар tx |
| ui/src/components/task-chat/TaskChatPlanPreviewCard.test.tsx | mn тест нэмсэн |
| ui/src/components/task-chat/TaskChatThreadView.tsx | гар tx (T1-д ороогүй) |
| ui/src/components/task-chat/RichWorkProductCard.tsx, RunnerGoalWidget.tsx, TaskChatBubbleActions.tsx, TaskChatDescriptionBubble.tsx, TaskChatMarker.tsx, TaskChatPlanView.tsx, TaskChatProjectCreatedCard.tsx, TaskChatSystemNotice.tsx, TaskChatToolCard.tsx, TaskChatTurnStatusIsland.tsx, TaskMessageScroller.tsx, task-chat-adapter.ts | T1 |
| ui/src/components/IssueChatThread.tsx | T1; гар tx, XoTrans |
| ui/src/components/IssueChatThread.test.tsx | mn тест нэмсэн |
| ui/src/components/CommentThread.tsx | T1; гар tx |
| ui/src/lib/issue-chat-messages.test.ts | mn тест нэмсэн |
| ui/src/pages/IssueDetail.tsx | гар tx (ажиллагааг зогсоох шошго) |

XO-ийн өмч (upstream биш): ui/src/xo/time-ago.ts, ui/src/xo/run-text.ts, ui/src/xo/labels.ts (xoFileKindLabel, xoActivityLabel, MODE_DESCRIPTION), scripts/xo-i18n/tiers.ts, ui/src/i18n/xo/* (en.json, mn.json, keep-en.json), docs/xo/glossary.md.

Шинэ XO-ийн тестүүд: ui/src/xo/time-ago.test.ts, ui/src/xo/run-text.test.ts, ui/src/xo/labels.test.ts (нэмэлт).

Үлдэгдэл (Ү6 7.2):
- Нэрийн fallback ("Agent", "You", "System", "None", "Board", child.status "unknown").
- Clipboard-ын "Result:\n" угтвар, `d.label === "Intent"` харьцуулалт.
- Ү6/T2 файлууд: TweakPanel, motion-tokens, task-chat-states, task-chat-fixtures, task-chat-attachments, RunTranscriptView, routine-run-display, DesignGuide.
```

Step 1-ийн тулгалтаар нэмсэн/хассан мөрийг энд тусга. Файлын замыг git-ээс яг хуулж ав (дээрх task-chat хавтасны богино нэрүүд Task 4-6-ийн Files хэсэгтэй таарч байгааг шалга).

- [ ] **Step 3: Бүрэн шалгалт**

```bash
pnpm xo:i18n:check
pnpm xo:i18n:test
pnpm xo:i18n:typecheck
pnpm exec vitest run ui/src/i18n ui/src/xo ui/src/lib ui/src/components/task-chat ui/src/components/issue-properties ui/src/components/IssueChatThread.test.tsx ui/src/components/IssueChatThreadSystemNotice.test.tsx ui/src/components/TaskChatThread.test.tsx ui/src/components/CommentThread.test.tsx ui/src/components/CommentThread.external-references.test.tsx ui/src/components/NewIssueDialog.test.tsx ui/src/components/IssuesList.test.tsx ui/src/pages/IssueDetail.test.tsx
(cd ui && pnpm exec tsc --noEmit)
pnpm xo:brand-scan
```

Expected: бүгд PASS; xo:i18n:check-д эдгээр файлын "гараар:" мөр гараагүй; brand-scan-ийн hit тоо Ү3-Б үлдэгдлийн PROGRESS-д бичсэн baseline-аас (586) өсөөгүй. Нэг нь унавал PROGRESS-д бичихээс өмнө шалтгааныг тайланд бич, засвар хийхгүй (controller шийднэ).

- [ ] **Step 4: 3110 instance-ийн төлөв (зогсоохгүй, дахин эхлүүлэхгүй)**

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3110/
ps -o lstart= -p "$(lsof -ti tcp:3110 | head -1)"
git log -1 --format=%cd
```

tiers.ts бол Vite plugin-ийн T1 жагсаалт. Plugin эхлэхдээ уншдаг тул шинэ T1 файлууд HMR-ээр transform-д орохгүй байж болно (гар tx-тэй файлууд HMR-ээр орно). Процесс Task 1-ийн commit-оос өмнө эхэлсэн бол T1 текст англиар харагдах магадлалтай. Тэгвэл **controller ED-ээс restart хийх зөвшөөрөл авна**; өөрөө restart хийхгүй, PROGRESS-д "хүлээгдэж буй" гэж тэмдэглэнэ.

- [ ] **Step 5: Browser шалгалт (get_page_text / read_page, screenshot зөвхөн эцэст)**

mn locale (localStorage XO_LOCALE_STORAGE_KEY = "mn") дээр:
1. /issues жагсаалт: шинэчлэгдсэн хугацаа «… өмнө» хэлбэрээр («5 минутын өмнө», «2 цагийн өмнө»), "ago" үг байхгүй. Шүүлтүүрийн popover-ийн гарчиг ба тоо Монголоор.
2. Шинэ даалгаврын цонх: горим сонголтын тайлбар Монголоор, хавсралтын мөр.
3. Даалгаврын дэлгэрэнгүй: шинж чанарын самбар (Төлөв, Хариуцагч, Хамаарал), Artifacts ба Plans tab.
4. Issue chat: ажиллагааны мөр «Ажиллаж байна» / «Ажилласан …», «N команд ажиллуулсан», «Ажиллагаа дууссан»; хүлээгдэж буй хариултын текст; сэтгэгдлийн thread-ийн «Сэтгэгдэл үлдээх...».
5. Task chat composer: placeholder ба горимын тайлбар, хавсралтын төрөл.

T1 файлын текст англиар үлдсэн бол Step 4-ийн restart асуудал гэж тэмдэглэ, кодыг бүү өөрчил. en рүү сэлгээд 1-2 хуудсанд англи текст өмнөхтэйгээ ижил («5 minutes ago», "Working") байгааг нягтал. Эцэст mn дээрх issue chat-ийн нэг screenshot ав.

- [ ] **Step 6: PROGRESS.md-д бүртгэл нэмэх** ("# XO ахицын бүртгэл"-ийн дараа, "## Ү3-Б үлдэгдэл (xo-main)"-ийн өмнө)

Бүтэц нь "## Ү3-Б үлдэгдэл (xo-main)" хэсэгтэй ижил:
- "## Ү6 7.1 даалгаврын урсгал (xo-main)" гарчиг, "| Task | Commit |" хүснэгт (Task 1-7-ийн богино SHA ба commit гарчиг, сүүлийн мөр "| 8 SYNC.md ба бүртгэл | энэ commit |").
- "### Шалгалтын үр дүн (Task 8)": Step 3-ын команд бүрийн мөр (xo:i18n:check-ийн keys тоо, vitest-ийн файл ба тестийн тоо, brand-scan-ийн файл ба hit тоо).
- "### 3110 instance ба browser шалгалт": огноо, процесс эхэлсэн цаг, restart шаардлагатай эсэх, Step 5-ын хуудас бүрийн үр дүн.
- "### Үлдэгдэл": SYNC.md-ийн "Үлдэгдэл (Ү6 7.2)" жагсаалттай ижил, мөн ED-ийн шийдвэр хүлээж буй зүйлс.

- [ ] **Step 7: Commit**

```bash
git add docs/xo/SYNC.md docs/xo/PROGRESS.md
git commit -m "docs(xo): record Y6 7.1 upstream touches and verification

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
find .git/refs -name '* 2*'
```

Expected: find хоосон. Push хийхгүй, ED зөвшөөрөл хүлээнэ.

---

## Хязгаарлалт ба нээлттэй асуулт

- ED-ийн шийдвэр шаардлагатай: 3110 instance tiers.ts-ийн шинэ T1 файлуудыг авахгүй бол restart хийх эсэх.
- Нэрийн fallback ("Agent", "You", "System", "None", "Board", child.status "unknown") Ү6 7.2-т шилжсэн: эдгээр нь өгөгдөлтэй харьцуулагддаг эсэхийг тусад нь шалгах шаардлагатай.
- Clipboard-ын "Result:\n" угтвар ба `d.label === "Intent"` харьцуулалт Ү6 7.2-т: орчуулбал хуулсан текстийн формат ба логик өөрчлөгдөнө.
- Ү6/T2 файлууд (TweakPanel, motion-tokens, task-chat-states, task-chat-fixtures, task-chat-attachments, RunTranscriptView, routine-run-display, DesignGuide) хүрээнээс гадуур.
- issue-chat-messages.ts-ийг tier-д нэмээгүй: T1 нь энэ файлын бүх string literal-ийг хамрах эрсдэлтэй тул зөвхөн гар tx хэрэглэв.
