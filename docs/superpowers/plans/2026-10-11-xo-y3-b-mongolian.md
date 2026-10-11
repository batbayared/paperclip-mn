# XO Ү3-Б: Монгол хэл (агентын харилцаа, onboarding, серверийн мессеж) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** XO-г шинээр суулгасан хэрэглэгч эхний минутаас эхлэн агентуудтай монголоор харилцаж, onboarding-ийн мэндчилгээ/асуулт/бриф монголоор гарч, серверээс ирэх түгээмэл алдааны мессеж UI дээр монголоор харагддаг болгох.

**Architecture:** Гурван давхарга. (L3) Шинэ `interactionLanguage` instance тохиргоо (`"mn" | "en"`, default `"mn"`) heartbeat-ээр wake payload руу дамжиж, adapter-utils prompt-д монгол хэлний заавар нэмнэ. (Onboarding) Англи asset файлуудыг хөндөлгүй хажууд нь `*.mn.*` хувилбар нэмж, ачаалагч locale-оор сонгоно. (L2) Серверийн мессежийг babel-аар каталог болгон гаргаж (`server-en.json`), UI талд `translateServerMessage()` нь `ApiError`/`AuthApiError` үүсэх үед монгол руу хөрвүүлнэ. Сервер өөрөө locale мэдэхгүй хэвээр.

**Tech Stack:** TypeScript, zod, Express, vitest, React 19 + i18next (`tx()`), @babel/parser + @babel/traverse, Playwright.

## Global Constraints

- Ажлын хавтас: `~/dev/paperclip-mn`, салбар `xo-main` (эсвэл түүнээс салгасан feature салбар). Bash бүр: `export PATH="$HOME/dev/bin:$HOME/.nvm/versions/node/v24.16.0/bin:$PATH" && cd ~/dev/paperclip-mn && …`.
- Upstream англи asset файлууд (`server/src/onboarding-assets/first-task/*.md|json`) болон тэдгээрийн англи тестүүдийг ӨӨРЧЛӨХГҮЙ. Монгол нь зөвхөн `*.mn.*` хувилбараар орно.
- `interactionLanguage` дутуу (undefined/null) ирвэл бүх газар англи зан төлөв (= upstream) хадгалагдана. Зөвхөн яг `"mn"` утга монгол руу шилжүүлнэ. Ингэснээр mock-той upstream тестүүд өөрчлөлтгүй ногоон үлдэнэ.
- Монгол текстэд брэнд "XO". Код, командын нэр, API талбар, tool нэр (`ask_user_questions`, `request_checkbox_confirmation`, `instructionsBundle.files`, `GET /api/openapi.json` гэх мэт), option id (`interview`, `task`) англиар үлдэнэ.
- UI i18n: `tx(key)`; англи түлхүүр = англи утга; `{{brand}}` нь default хувьсагч. `ui/src/i18n/xo/en.json` ба `mn.json` түлхүүр, placeholder ижил байх (parity.test.ts).
- Git: `git add .superpowers/` болон `git add -A` хориотой, файлыг нэрээр нь нэм. Commit trailer: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Push хийхээс өмнө ED-ээс зөвшөөрөл ав, мөн `find .git/refs -name '* 2*'` хоосон байх ёстой. Upstream paperclipai руу PR хийхгүй.
- Нууц үг, нэвтрэлт, `claude auth login`/`codex login` ажиллуулахгүй. Credential файл, Keychain уншихгүй.

---

## File Structure

| Файл | Үүрэг | Task |
|---|---|---|
| `packages/shared/src/validators/instance.ts` | `interactionLanguage` zod enum | 1 |
| `packages/shared/src/types/instance.ts` | төрөл | 1 |
| `server/src/services/instance-settings.ts` | normalize + default | 1 |
| `server/src/__tests__/instance-settings-service.test.ts` | normalize тест | 1 |
| `server/src/services/heartbeat.ts` | payload руу дамжуулах | 1 |
| `packages/adapter-utils/src/server-utils.ts` (+ `.test.ts`) | prompt дахь монгол заавар | 1 |
| `ui/src/pages/InstanceExperimentalSettings.tsx` (+ `.test.tsx`) | "Agent interaction language" карт | 1 |
| `server/src/onboarding-assets/first-task/*.mn.*` (6 шинэ файл) | монгол asset | 2 |
| `server/src/services/onboarding-first-task-assets.ts` (+ `.test.ts`) | locale-тэй ачаалагч | 2 |
| `server/src/services/onboarding-greeting.ts` | locale дамжуулах | 2 |
| `server/src/routes/issues.ts`, `server/src/routes/agents.ts` | дуудагчид locale өгөх | 2 |
| `tests/release-smoke/docker-auth-onboarding.spec.ts` | монгол мэндчилгээ хүлээх | 2, 3 |
| `ui/src/components/OnboardingWizard.tsx` | үлдсэн ~25 мөрийг `tx()` | 3 |
| `ui/src/i18n/xo/en.json`, `mn.json` | wizard + тохиргооны түлхүүр | 1, 3 |
| `tests/e2e/conference-room-typing-intro.spec.ts`, `tests/e2e/planning-mode-visual-verification.spec.ts` | гарчгийн тогтмол | 3 |
| `scripts/xo-i18n/extract-server.ts` (+ `.test.ts`) | серверийн мессеж ялгагч | 4 |
| `scripts/xo-i18n/cli.ts` | `extract --server`, `check --server` | 4 |
| `ui/src/i18n/xo/server-en.json`, `server-mn.json`, `server-tier1.json` | серверийн каталог | 4 |
| `ui/src/xo/serverMessage.ts` (+ `.test.ts`) | `translateServerMessage()` | 5 |
| `ui/src/api/client.ts`, `ui/src/api/auth.ts` | hook | 5 |
| `docs/xo/SYNC.md` | S-set шинэчлэл | 6 |

---

### Task 1: L3 — `interactionLanguage` тохиргоо (settings → heartbeat → prompt → UI)

**Files:**
- Modify: `packages/shared/src/validators/instance.ts:72`
- Modify: `packages/shared/src/types/instance.ts:92-98`
- Modify: `server/src/services/instance-settings.ts:254`, `:295`
- Test: `server/src/__tests__/instance-settings-service.test.ts`
- Modify: `server/src/services/heartbeat.ts:7593`, `:8096`, `:20389`
- Modify: `packages/adapter-utils/src/server-utils.ts:814`, `:1868`, `:2556`
- Test: `packages/adapter-utils/src/server-utils.test.ts:1258`
- Modify: `ui/src/pages/InstanceExperimentalSettings.tsx`
- Test: `ui/src/pages/InstanceExperimentalSettings.test.tsx`
- Modify: `ui/src/i18n/xo/en.json`, `ui/src/i18n/xo/mn.json`

**Interfaces:**
- Produces: `InstanceExperimentalSettings.interactionLanguage: "mn" | "en"` (default `"mn"`); wake payload талбар `interactionLanguage?: "mn" | "en"`; `PaperclipWakeNormalized.interactionLanguage: "mn" | "en" | null`. Task 2 нь `instanceSettings.getExperimental()`-ээс энэ талбарыг уншина.

- [ ] **Step 1: Normalize-ийн бүтэлгүйтэх тест бич**

`server/src/__tests__/instance-settings-service.test.ts`-д "defaults enableSimplifiedEnglishInteractions…" тестийн дараа нэм:

```ts
  it("defaults interactionLanguage to mn and keeps an explicit en", () => {
    expect(normalizeExperimentalSettings(undefined).interactionLanguage).toBe("mn");
    expect(normalizeExperimentalSettings({}).interactionLanguage).toBe("mn");
    expect(normalizeExperimentalSettings({ interactionLanguage: "en" }).interactionLanguage).toBe("en");
    const patched = applyExperimentalSettingsPatch({}, { interactionLanguage: "en" });
    expect(normalizeExperimentalSettings(JSON.parse(JSON.stringify(patched))).interactionLanguage).toBe("en");
  });
```

- [ ] **Step 2: Тест унахыг шалга**

Run: `pnpm --filter @paperclipai/server exec vitest run src/__tests__/instance-settings-service.test.ts -t interactionLanguage`
Expected: FAIL (`expected undefined to be "mn"`).

- [ ] **Step 3: Schema, төрөл, normalize-д талбар нэм**

`packages/shared/src/validators/instance.ts` — `enableSimplifiedEnglishInteractions` мөрийн доор:

```ts
  // XO: language agents use with the user. "mn" = Mongolian (XO default).
  interactionLanguage: z.enum(["mn", "en"]).default("mn"),
```

`packages/shared/src/types/instance.ts` — `enableSimplifiedEnglishInteractions: boolean;`-ийн доор:

```ts
  /** XO: language agents use for user-facing interactions. Default "mn". */
  interactionLanguage: "mn" | "en";
```

`server/src/services/instance-settings.ts` — 254-р мөрийн доор:

```ts
      interactionLanguage: parsed.data.interactionLanguage ?? "mn",
```

мөн 295 орчмын defaults объектод `enableSimplifiedEnglishInteractions: false,`-ийн доор:

```ts
      interactionLanguage: "mn",
```

(`patchInstanceExperimentalSettingsSchema` нь shape-аас автоматаар partial үүсгэдэг тул нэмэлт өөрчлөлт хэрэггүй. `InstanceFeatureKey` нь зөвхөн boolean түлхүүр авдаг тул feature catalog-д бичилт хэрэггүй.)

- [ ] **Step 4: Тест давахыг шалга**

Run: `pnpm --filter @paperclipai/server exec vitest run src/__tests__/instance-settings-service.test.ts && pnpm --filter @paperclipai/shared exec vitest run src/feature-catalog.test.ts`
Expected: PASS.

- [ ] **Step 5: Prompt render-ийн бүтэлгүйтэх тест бич**

`packages/adapter-utils/src/server-utils.test.ts`-д 1258-р мөрийн тестийн дараа:

```ts
  it("renders the mongolian interaction directive only when interactionLanguage is mn", () => {
    const payload = {
      reason: "issue_commented",
      issue: {
        id: "issue-1",
        identifier: "XO-1",
        title: "Interaction language",
        description: null,
        descriptionTruncated: false,
        status: "in_progress",
      },
      commentWindow: { requestedCount: 0, includedCount: 0, missingCount: 0 },
      comments: [],
      fallbackFetchNeeded: false,
    };

    expect(renderPaperclipWakePrompt(payload)).not.toContain("in Mongolian");
    expect(renderPaperclipWakePrompt({ ...payload, interactionLanguage: "en" })).not.toContain("in Mongolian");

    const mn = { ...payload, interactionLanguage: "mn", simplifiedEnglishInteractions: true };
    const fresh = renderPaperclipWakePrompt(mn);
    expect(fresh).toContain("in Mongolian (Cyrillic script)");
    // Mongolian wins over the simplified-English experiment.
    expect(fresh).not.toContain("ASD-STE100");
    expect(renderPaperclipWakePrompt(mn, { resumedSession: true })).toContain("in Mongolian (Cyrillic script)");
    expect(JSON.parse(stringifyPaperclipWakePayload(mn) ?? "{}")).toMatchObject({ interactionLanguage: "mn" });
  });
```

- [ ] **Step 6: Тест унахыг шалга**

Run: `pnpm --filter @paperclipai/adapter-utils exec vitest run src/server-utils.test.ts -t mongolian`
Expected: FAIL (`expected … to contain "in Mongolian (Cyrillic script)"`).

- [ ] **Step 7: adapter-utils-ийг хэрэгжүүл**

Төрөлд (814 орчим, `simplifiedEnglishInteractions: boolean;`-ийн доор):

```ts
  // XO: "mn" adds the Mongolian interaction directive; null = upstream behaviour.
  interactionLanguage: "mn" | "en" | null;
```

Normalize-д (1868 орчим, `simplifiedEnglishInteractions: asBoolean(...)`-ийн доор):

```ts
    interactionLanguage:
      payload.interactionLanguage === "mn" ? "mn" : payload.interactionLanguage === "en" ? "en" : null,
```

Render-д (2556) одоогийн `if (normalized.simplifiedEnglishInteractions) {` блокийг бүхэлд нь ингэж соль:

```ts
  if (normalized.interactionLanguage === "mn") {
    lines.push(
      "- interaction language: write everything the user reads — comments, documents, request_confirmation, ask_user_questions, suggest_tasks, checkbox prompts and options — in Mongolian (Cyrillic script). Keep code, commands, file paths, API field names, tool names and technical identifiers in English.",
    );
  } else if (normalized.simplifiedEnglishInteractions) {
    lines.push(
      "- interaction language (experimental): write every user interaction you post (request_confirmation, ask_user_questions, suggest_tasks, checkbox prompts and options, and any other content rendered inside an interaction block) in ASD-STE100 Simplified Technical English. In each interaction, briefly tell the user what information they need to make the decision and what happens for each choice. This applies only to interaction content — write your thinking, comments, documents, and other responses in your usual style.",
    );
  }
```

`stringifyPaperclipWakePayload` нь normalized объектыг сериалчилдаг эсэхийг шалга: хэрэв талбаруудыг гараар жагсаадаг бол `interactionLanguage`-ийг `simplifiedEnglishInteractions`-ийн хажууд нэм.

- [ ] **Step 8: adapter-utils тест бүхэлдээ давахыг шалга**

Run: `pnpm --filter @paperclipai/adapter-utils exec vitest run src/server-utils.test.ts`
Expected: PASS (upstream "simplified-english" тест мөн давна: payload-д `interactionLanguage` байхгүй тул `null`).

- [ ] **Step 9: Heartbeat-ээр дамжуул**

`server/src/services/heartbeat.ts`:

7593 орчим input төрөлд:
```ts
  interactionLanguage?: "mn" | "en";
```

8096 орчим payload-д (`simplifiedEnglishInteractions: …,`-ийн доор). Талбар байхгүй үед payload-ийн хэлбэр upstream-тэй ижил үлдэхийн тулд spread хэрэглэнэ:
```ts
    ...(input.interactionLanguage ? { interactionLanguage: input.interactionLanguage } : {}),
```

20389 орчим дуудлагад (`simplifiedEnglishInteractions: …,`-ийн доор):
```ts
        interactionLanguage: experimentalInstanceSettings.interactionLanguage,
```

Run: `pnpm --filter @paperclipai/server exec tsc --noEmit -p . && pnpm --filter @paperclipai/server exec vitest run src/__tests__ -t "wake payload|heartbeat"`
Expected: typecheck цэвэр; heartbeat тестүүд PASS. Хэрэв `toEqual`-аар payload-ийг яг таг харьцуулдаг тест `interactionLanguage: "mn"` нэмэлт талбараас болж унавал тухайн тестийн mock `getExperimental`-д `interactionLanguage` байгаа эсэхийг шалгаад хүлээгдэх объектод `interactionLanguage: "mn"` нэм (энэ бол зориуд хийсэн зан төлөв).

- [ ] **Step 10: UI картын бүтэлгүйтэх тест бич**

`ui/src/pages/InstanceExperimentalSettings.test.tsx`:

Selector-уудын хажууд:
```ts
const INTERACTION_LANGUAGE_TOGGLE_SELECTOR =
  'button[aria-label="Toggle Mongolian agent interaction language"]';
```

97 орчмын fixture-д `enableSimplifiedEnglishInteractions: false,`-ийн доор:
```ts
    interactionLanguage: "mn",
```

Decisions тестийн дараа:
```ts
  it("renders and patches the agent interaction language toggle", async () => {
    await renderPage();

    expect(container.textContent).toContain("Agent interaction language");

    const toggle = container.querySelector<HTMLButtonElement>(INTERACTION_LANGUAGE_TOGGLE_SELECTOR);
    expect(toggle?.getAttribute("aria-checked")).toBe("true");

    await act(async () => {
      toggle?.click();
    });
    await flushReact();

    expect(mockInstanceSettingsApi.updateExperimental).toHaveBeenCalledWith({
      interactionLanguage: "en",
    });
  });
```

Run: `pnpm --filter @paperclipai/ui exec vitest run src/pages/InstanceExperimentalSettings.test.tsx -t "interaction language"`
Expected: FAIL (toggle олдохгүй).

- [ ] **Step 11: Картыг хэрэгжүүл**

`ui/src/pages/InstanceExperimentalSettings.tsx` — `ExperimentalToggleCard` функцийн доор шинэ компонент (энэ тохиргоо boolean биш тул `settingKey: InstanceFeatureKey` шаардлагыг хангахгүй, тусдаа карт):

```tsx
function InteractionLanguageCard({
  checked,
  onCheckedChange,
  disabled,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled: boolean;
}) {
  return (
    <Card className="block bg-transparent p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5">
          <h3 className="text-sm font-semibold">{tx("Agent interaction language")}</h3>
          <p className="max-w-2xl text-sm text-muted-foreground">
            {tx("When on, agents write comments, questions, confirmations and documents for the user in Mongolian. Code, commands and technical names stay in English. Turn off to use English.")}
          </p>
        </div>
        <ToggleSwitch
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          aria-label="Toggle Mongolian agent interaction language"
        />
      </div>
    </Card>
  );
}
```

`ToggleSwitch`-ийн aria prop-ын нэрийг `ExperimentalToggleCard` дотор хэрхэн дамжуулж байгаатай яг ижил болго (тэнд `aria-label={ariaLabel}` эсвэл өөр нэр байвал түүнийг хэрэглэ).

234 орчмын утга уншдаг хэсэгт:
```ts
  const interactionLanguageMongolian = experimentalQuery.data?.interactionLanguage !== "en";
```

437-р мөрийн "Simplified English Interactions" картын ӨМНӨ:
```tsx
        <InteractionLanguageCard
          checked={interactionLanguageMongolian}
          onCheckedChange={(checked) =>
            toggleMutation.mutate({ interactionLanguage: checked ? "mn" : "en" })
          }
          disabled={toggleMutation.isPending}
        />
```

`toggleMutation`-ийн mutationFn параметрийн төрөл `Partial<Record<InstanceFeatureKey, boolean>>` маягаар хязгаарлагдсан бол `PatchInstanceExperimentalSettings` болгож өргөтгө (optimistic update хэсэг spread ашигладаг тул өөр өөрчлөлт хэрэггүй).

`ui/src/i18n/xo/en.json` ба `mn.json`-д (цагаан толгойн дарааллаар):

en.json:
```json
  "Agent interaction language": "Agent interaction language",
  "When on, agents write comments, questions, confirmations and documents for the user in Mongolian. Code, commands and technical names stay in English. Turn off to use English.": "When on, agents write comments, questions, confirmations and documents for the user in Mongolian. Code, commands and technical names stay in English. Turn off to use English.",
```

mn.json:
```json
  "Agent interaction language": "Агентын харилцааны хэл",
  "When on, agents write comments, questions, confirmations and documents for the user in Mongolian. Code, commands and technical names stay in English. Turn off to use English.": "Асаалттай үед агентууд хэрэглэгчид зориулсан сэтгэгдэл, асуулт, баталгаажуулалт, баримтаа монголоор бичнэ. Код, команд, техникийн нэр англиар үлдэнэ. Англи хэл ашиглах бол унтраа.",
```

- [ ] **Step 12: UI тест ба parity давахыг шалга**

Run: `pnpm --filter @paperclipai/ui exec vitest run src/pages/InstanceExperimentalSettings.test.tsx src/i18n/xo/parity.test.ts && pnpm xo:i18n:check`
Expected: PASS.

- [ ] **Step 13: Commit**

```bash
git add packages/shared/src/validators/instance.ts packages/shared/src/types/instance.ts server/src/services/instance-settings.ts server/src/__tests__/instance-settings-service.test.ts server/src/services/heartbeat.ts packages/adapter-utils/src/server-utils.ts packages/adapter-utils/src/server-utils.test.ts ui/src/pages/InstanceExperimentalSettings.tsx ui/src/pages/InstanceExperimentalSettings.test.tsx ui/src/i18n/xo/en.json ui/src/i18n/xo/mn.json
git commit -m "feat(xo): interactionLanguage setting drives Mongolian agent interactions

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Onboarding-ийн монгол asset ба locale-тэй ачаалагч

**Files:**
- Create: `server/src/onboarding-assets/first-task/greeting.mn.md`
- Create: `server/src/onboarding-assets/first-task/opening-question.mn.json`
- Create: `server/src/onboarding-assets/first-task/brief.mn.md`
- Create: `server/src/onboarding-assets/first-task/proposal-confirmation.mn.md`
- Create: `server/src/onboarding-assets/first-task/proposal-plan.mn.md`
- Create: `server/src/onboarding-assets/first-task/chief-of-staff/AGENTS.mn.md`
- Modify: `server/src/services/onboarding-first-task-assets.ts`
- Modify: `server/src/services/onboarding-greeting.ts`
- Modify: `server/src/routes/issues.ts:11672`, `:11935-11984`
- Modify: `server/src/routes/agents.ts:2721`
- Test: `server/src/services/onboarding-first-task-assets.test.ts`
- Modify: `tests/release-smoke/docker-auth-onboarding.spec.ts:253-255`

**Interfaces:**
- Consumes: `InstanceExperimentalSettings.interactionLanguage` (Task 1).
- Produces:
  - `export type OnboardingLocale = "mn" | "en";`
  - `export function resolveOnboardingLocale(settings: { interactionLanguage?: unknown } | null | undefined): OnboardingLocale`
  - `OnboardingFirstTaskPlaceholders` нэмэлт талбар `locale?: OnboardingLocale`
  - `buildOnboardingFirstTaskOpeningQuestion(locale?: OnboardingLocale)`
  - `buildOnboardingFirstTaskBrief({ usePlanProposal, locale? })`
  - `renderOnboardingGreeting({ agentName, organizationName, locale? })`

- [ ] **Step 1: Бүтэлгүйтэх тест бич**

`server/src/services/onboarding-first-task-assets.test.ts`-ийн import-д `resolveOnboardingLocale` нэмээд файлын төгсгөлд:

```ts
describe("mongolian onboarding variants", () => {
  it("resolves the locale only from an explicit mn setting", () => {
    expect(resolveOnboardingLocale({ interactionLanguage: "mn" })).toBe("mn");
    expect(resolveOnboardingLocale({ interactionLanguage: "en" })).toBe("en");
    expect(resolveOnboardingLocale({})).toBe("en");
    expect(resolveOnboardingLocale(undefined)).toBe("en");
  });

  it("renders the mongolian greeting with and without a name", async () => {
    expect(await renderOnboardingFirstTaskGreeting({ agentName: "Бат", locale: "mn" })).toBe(
      "XO-д тавтай морил! Би Бат, таны анхны агент хамтрагч. Хэрхэн эхлэхээ сонгоорой, үлдсэнийг нь би хариуцъя.",
    );
    expect(await renderOnboardingFirstTaskGreeting({ agentName: null, locale: "mn" })).toBe(
      "XO-д тавтай морил! Би таны анхны агент хамтрагч. Хэрхэн эхлэхээ сонгоорой, үлдсэнийг нь би хариуцъя.",
    );
  });

  it("builds the mongolian opening question with the fixed ids", async () => {
    const payload = await buildOnboardingFirstTaskOpeningQuestion("mn");
    const question = payload.questions[0];
    expect(question.id).toBe(ONBOARDING_FIRST_TASK_OPENING_QUESTION_ID);
    expect(question.prompt).toBe("Юу хийхийг хүсэж байна вэ?");
    expect(payload.submitLabel).toBe("Үргэлжлүүлэх");
    expect(question.options.map((o) => o.id)).toEqual([
      ONBOARDING_FIRST_TASK_OPENING_INTERVIEW_OPTION_ID,
      ONBOARDING_FIRST_TASK_OPENING_TASK_OPTION_ID,
    ]);
  });

  it("builds the mongolian brief with the selected proposal step", async () => {
    const confirmation = await buildOnboardingFirstTaskBrief({ usePlanProposal: false, locale: "mn" });
    expect(confirmation).toContain("Энэ бол хэрэглэгчийн XO дахь анхны ажил");
    expect(confirmation).toContain("request_confirmation");
    expect(confirmation).not.toContain("{{proposalStep}}");
    const plan = await buildOnboardingFirstTaskBrief({ usePlanProposal: true, locale: "mn" });
    expect(plan).toContain("энгийн ажлыг ч төлөвлөгөөний замаар");
  });

  it("uses the mongolian persona and organization fallback", async () => {
    const persona = await renderChiefOfStaffPersona({ agentName: "Бат", organizationName: null, locale: "mn" });
    expect(persona).toContain("Чи Бат, танай байгууллага-ын штабын дарга");
    expect(persona).toContain("paperclip-create-agent");
  });

  it("falls back to the english file when a mongolian variant is missing", async () => {
    // README.md has no .mn variant; english callers keep the english text.
    expect(await renderOnboardingFirstTaskGreeting({ agentName: "Ada" })).toContain("Welcome to Paperclip!");
  });
});
```

Run: `pnpm --filter @paperclipai/server exec vitest run src/services/onboarding-first-task-assets.test.ts`
Expected: FAIL (`resolveOnboardingLocale is not a function`).

- [ ] **Step 2: Монгол asset файлуудыг үүсгэ**

`greeting.mn.md` (нэргүй үед `{{agentName}}, ` хасагдаж "Би таны…" болно):
```markdown
XO-д тавтай морил! Би {{agentName}}, таны анхны агент хамтрагч. Хэрхэн эхлэхээ сонгоорой, үлдсэнийг нь би хариуцъя.
```

`opening-question.mn.json`:
```json
{
  "prompt": "Юу хийхийг хүсэж байна вэ?",
  "submitLabel": "Үргэлжлүүлэх",
  "options": [
    {
      "id": "interview",
      "label": "Надаас асууж тодруулаад, төлөвлөгөө болон түүнийг хэрэгжүүлэх агентын баг санал болго.",
      "description": "Таны бүтээж буй зүйлийн талаар хэдэн асуулт, дараа нь таны батлах товч төлөвлөгөө ба түүнийг гүйцэтгэх баг."
    },
    {
      "id": "task",
      "label": "Надад хийлгэх ажил байна",
      "description": "Тайлбарлаад өгөөрэй, би хэрхэн гүйцэтгэхийг санал болгоно.",
      "freeText": true
    }
  ]
}
```

`brief.mn.md`:
```markdown
Энэ бол хэрэглэгчийн XO дахь анхны ажил. Чиний үүрэг: хэрэглэгч юу хүсэж байгааг ойлгоод цааш явах замыг санал болгох. Мэндчилгээ болон нээлтийн асуултын карт аль хэдийн нийтлэгдсэн. Карт хоёр сонголт санал болгосон: "Надаас асууж тодруулаад, төлөвлөгөө болон түүнийг хэрэгжүүлэх агентын баг санал болго." (option `interview`) эсвэл "Надад хийлгэх ажил байна" (option `task`, текст талбартай). Хэрэглэгч тэр картад хариулсан (хариулт wake payload-д бий) эсвэл хариулахын оронд мессеж бичсэн тул чи ажиллаж байна. Өөрийгөө дахин бүү танилцуул, нээлтийн картыг дахин бүү нийтэл.

Хэрэглэгчтэй бүх харилцаагаа монголоор бич. Tool нэр, option id, код англиар үлдэнэ.

Энэ дарааллаар ажилла.

1. Хэрэглэгчийн сонгосон замаар яв.

   - `interview` → 3–4 асуулттай НЭГ ask_user_questions карт нийтэл: байгууллага юу хийдэг, эхлээд юунд хүрэхийг хүсэж байгаа, хязгаарлалт (хугацаа, төсөв, хэрэгсэл), "дууссан" гэдэг нь юу вэ. Таамаглахгүй, асуу. Картаас өмнө өөр юу ч бүү нийтэл. Хариултууд 2-р алхмын төлөвлөгөө ба багийн зам руу хөтөлнө.

   - `task` → хэрэглэгчийн бичсэн текст бол ажил. Санал гаргахад хангалттай тодорхой бол шууд 2-р алхам руу ор. Тодорхойгүй бол түүний мессежид тохирсон 2–3 асуулттай НЭГ ask_user_questions карт нийтэл (тодорхой зорилго, хязгаарлалт, "дууссан" гэдэг нь юу вэ), дараа нь 2-р алхам руу ор.

   - Картад хариулахын оронд мессеж бичсэн бол түүнийг `task` зам гэж үз.

2. Шийдэхгүй, санал болго. Одоо мэдэж байгаа зүйлээсээ замаа сонго:

   - Төлөвлөгөө ба/эсвэл баг хүсэж байвал → товч `plan` баримт бич (зорилго, арга барил, баг: ажилтан бүр нэг мөр — нэр, үүрэг, хариуцлага; дараагийн ажлууд). Дараа нь төлөвлөгөөг чиглэсэн НЭГ request_checkbox_confirmation нийтэл: ажилтан бүр, дараагийн ажил бүр тусдаа option, анхдагчаар чагтлагдсан, тус бүр тогтвортой id-тай. Картын мессежийг нэг хоёр мөрөөр бичээд баруун талын самбар дахь Төлөвлөгөө рүү заа.

{{proposalStep}}

3. Хүлээ. Карт батлагдах хүртэл юу ч бүү хий. Өөрчлөлт хүсвэл засаад дахин баталгаажуул. Батлагдсан картгүйгээр ажилтан авах эсвэл ажил үүсгэхийг энэ ажил дээр хэзээ ч зөвшөөрөхгүй.

4. Батлагдсаны дараа зөвхөн батлагдсаныг гүйцэтгэ: чагтлагдсан агентуудыг ажилд ав, чагтлагдсан ажлуудыг үүсгэж даалга, эсвэл ганц ажлыг өөрөө хийгээд үр дүнг энэ ажил дээр баримт болгон нийтэл.
```

`proposal-confirmation.mn.md` (эхэнд 3 зай):
```markdown
   - Нэг зүйлийг одоо хийлгэхийг хүсэж байвал → НЭГ request_confirmation нийтэл: юу хийх, хэрэглэгч юу авах (боломжтой бол хэзээ гэдгийг) хэдхэн мөрөөр. Төлөвлөгөөний баримт хэрэггүй.
```

`proposal-plan.mn.md` (эхэнд 3 зай):
```markdown
   - Нэг зүйлийг одоо хийлгэхийг хүсэж байвал → энгийн ажлыг ч төлөвлөгөөний замаар яв: товч `plan` баримт бич (зорилго, арга барил, юу гаргаж өгөх) ба түүнийг чиглэсэн НЭГ request_checkbox_confirmation нийтэл. Ажлыг өөрийг нь болон нэмэлт дараагийн ажлыг option болго.
```

`chief-of-staff/AGENTS.mn.md`:
```markdown
# Үүрэг

Чи {{agentName}}, {{organizationName}}-ын штабын дарга. Чи энэ байгууллагыг үүсгэсэн хүнд тайлагнадаг бөгөөд түүний гол харилцагч. Хэрэглэгч юу хүсэж байгааг ойлгож, хүсэлтийг нь биелүүлж, цаашдын ажлыг санал болгож зохицуул.

# Хэрэглэгчтэй ажиллах

- Хэрэглэгчтэй үргэлж монголоор харилц. Код, команд, файлын зам, API талбар, tool нэр англиар үлдэнэ.
- Ярианы өнгөөр бич. Тодорхой хүсэлтийг шууд биелүүл; хэрэглэгчийн шийдвэр шаардах сонголтыг санал болго.
- Тодорхой зүйл хүсвэл (бриф, төлөвлөгөө, roadmap, танилцуулга) жинхэнэ үр дүн гарга: хянаж үзэхээр холбогдох ажил дээр баримт болгон хадгал.

# Чатын дэг

- Чиний нийтэлсэн бүхнийг хэрэглэгч уншина. Товч, хэрэглэгчид зориулж бич.
- Хариултаар эхэл. Tool дуудлага, API алхам, өөрийн бодлыг хэзээ ч бүү тайлбарла.
- Зөвхөн ашигтай ажлыг саатуулж буй бодит тодорхойгүй байдлын талаар асуу. Хариуцлагыг хэрэглэгчийн өөрийнх нь үгээр хүлээн ав; зохиомол ажлын ангилал бүү шаард. Тусгай бүтцийн үүрэг хэрэггүй бол `general` хэрэглэ.
- Оролт хэрэгтэй үед operational API reference-ийн дагуу нэг `ask_user_questions` карт хадгалаад ажлыг `in_review` болго. Хадгалсан хүлээгдэж буй харилцаа хүлээх замыг бүрдүүлнэ; зөвхөн текстээр асуусан асуулт бүрдүүлэхгүй. Агентын хувьд board/user unblock owner тохируулах гэж бүү оролд.

# Ажилтан авах ба даалгах

Хэрэглэгч агент ажилд авах эсвэл ажил үүсгэхийг шууд хүссэн бол тэр хүсэлт нь тухайн үйлдлийг зөвшөөрнө. Тэр хүрээнд дахин зөвшөөрөл асуулгүй гүйцэтгэ. Өөрөө санал болгож буй нэмэлт ажилтан, ажлын хувьд эхлээд юу үүсэхийг нэрлэсэн request_confirmation эсвэл checkbox карт ашигла. Санал болгох ажилтан нэг мөр: нэр, үүрэг, хариуцлага. Компанийн албан ёсны батлах шат шууд хүссэн ажилтныг оролцуулаад бүх ажилтанд хамаарна.

Ажилтан авахаасаа өмнө `paperclip-create-agent`-ийг унш. Managed instructions-ийг `instructionsBundle.files`-аар, массив биш зам → файлын агуулга гэсэн record хэлбэрээр өг; хуучирсан `adapterConfig.promptTemplate` талбар бүү хэрэглэ. Хүсээгүй эсвэл давтагдах ажилд шаардлагагүй бол timer heartbeat-ийг унтраалттай байлга.

HTTP 201 хариу бол амжилт; body нь `{"agent": …, "approval": …}`. Агентыг бэлэн гэж мэдээлэхээсээ өмнө компанийн батлалт хүлээж буй эсэхийг шалга. Нэг run доторх яг ижил давталт байгаа агентыг буцаана (HTTP 200, `idempotent: true`); өөрчлөгдсөн payload эсвэл дараагийн run давхардал үүсгэж болно. Амжилтын дараа дахин бүү илгээ. Үр дүн тодорхойгүй бол (timeout, хариу алдагдсан, серверийн алдаа) дахин оролдохоос өмнө компанийн агентуудын жагсаалтыг аваад үр дүнг тулга.

Үүсгэхээс өмнөх validation-ы баталгаатай татгалзал агент үүсгээгүй. Хүссэн нэр, хариуцлага, хүрээ ижил хэвээр бол анхны зөвшөөрлийн хүрээнд буруу талбаруудыг засаарай; зөвхөн payload засахын тулд дахин баталгаажуулалт бүү хүс. Хэлбэрийг засахдаа validation алдаа ба `GET /api/openapi.json`-ийг ашигла. Энэ үл хамаарах зүйл зөвхөн баталгаатай validation алдаанд хамаарна; тодорхойгүй үр дүн, эрх/батлалтын татгалзалд хамаарахгүй. Operational skill-ийн хязгаартай write retry тоог баримтал.
```

(Тест дэх "танай байгууллага-ын" нь organization fallback-ийг шууд оруулсны үр дүн. Монгол дүрмийн хувьд "-ын" залгавар fallback-тай таарахгүй ч жинхэнэ байгууллагын нэртэй ("Акме-ын") үед ойлгомжтой; ED хүсвэл дараа нь найруулна.)

- [ ] **Step 3: Ачаалагчийг хэрэгжүүл**

`server/src/services/onboarding-first-task-assets.ts`:

`OnboardingFirstTaskPlaceholders`-ийн дээр:
```ts
// XO: Mongolian variants live next to the upstream files as name.mn.ext. The
// upstream English files stay untouched; a missing variant falls back to them.
export type OnboardingLocale = "mn" | "en";

export function resolveOnboardingLocale(
  settings: { interactionLanguage?: unknown } | null | undefined,
): OnboardingLocale {
  return settings?.interactionLanguage === "mn" ? "mn" : "en";
}
```

Interface-д:
```ts
export interface OnboardingFirstTaskPlaceholders {
  agentName?: string | null;
  organizationName?: string | null;
  locale?: OnboardingLocale;
}
```

`loadFirstTaskAsset`-ийг соль:
```ts
function localizedAssetPath(relativePath: string, locale: OnboardingLocale): string {
  if (locale !== "mn") return relativePath;
  const dot = relativePath.lastIndexOf(".");
  return `${relativePath.slice(0, dot)}.mn${relativePath.slice(dot)}`;
}

async function loadFirstTaskAsset(relativePath: string, locale: OnboardingLocale = "en"): Promise<string> {
  if (locale === "mn") {
    try {
      return await fs.readFile(resolveFirstTaskAssetUrl(localizedAssetPath(relativePath, locale)), "utf8");
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    }
  }
  return fs.readFile(resolveFirstTaskAssetUrl(relativePath), "utf8");
}
```

`fillFirstTaskPlaceholders`-д fallback-ийг locale-оор:
```ts
  { agentName, organizationName, locale }: OnboardingFirstTaskPlaceholders,
  …
  const orgFallback = locale === "mn" ? "танай байгууллага" : "your organization";
  out = out.split("{{organizationName}}").join(org && org.length > 0 ? org : orgFallback);
```

Builder-уудад locale дамжуул:
```ts
export async function renderOnboardingFirstTaskGreeting(placeholders: OnboardingFirstTaskPlaceholders): Promise<string> {
  const template = await loadFirstTaskAsset("greeting.md", placeholders.locale);
  return fillFirstTaskPlaceholders(template, placeholders).trim();
}

export async function buildOnboardingFirstTaskOpeningQuestion(
  locale: OnboardingLocale = "en",
): Promise<AskUserQuestionsPayload> {
  const raw = await loadFirstTaskAsset("opening-question.json", locale);
  // …үлдсэн нь өөрчлөгдөхгүй
}

export async function buildOnboardingFirstTaskBrief(options: {
  usePlanProposal: boolean;
  locale?: OnboardingLocale;
}): Promise<string> {
  const [brief, proposal] = await Promise.all([
    loadFirstTaskAsset("brief.md", options.locale),
    loadFirstTaskAsset(options.usePlanProposal ? "proposal-plan.md" : "proposal-confirmation.md", options.locale),
  ]);
  // …үлдсэн нь өөрчлөгдөхгүй
}

export async function renderChiefOfStaffPersona(placeholders: OnboardingFirstTaskPlaceholders): Promise<string> {
  const template = await loadFirstTaskAsset("chief-of-staff/AGENTS.md", placeholders.locale);
  return fillFirstTaskPlaceholders(template, placeholders);
}
```

`server/src/services/onboarding-greeting.ts`:
```ts
import { renderOnboardingFirstTaskGreeting, type OnboardingLocale } from "./onboarding-first-task-assets.js";

export async function renderOnboardingGreeting(input: {
  agentName?: string | null;
  organizationName?: string | null;
  locale?: OnboardingLocale;
}): Promise<string> {
  return renderOnboardingFirstTaskGreeting({
    agentName: input.agentName,
    organizationName: input.organizationName,
    locale: input.locale,
  });
}
```

- [ ] **Step 4: Тест давахыг шалга**

Run: `pnpm --filter @paperclipai/server exec vitest run src/services/onboarding-first-task-assets.test.ts src/services/onboarding-greeting.test.ts`
Expected: PASS (англи тестүүд ч өөрчлөлтгүй давна).

- [ ] **Step 5: Дуудагчдыг холбо**

`server/src/routes/issues.ts` — import-д `resolveOnboardingLocale` нэм (`./../services/onboarding-first-task-assets.js`-ээс, файлд аль хэдийн байгаа import мөрөнд). 11672 орчим:
```ts
          const experimental = await instanceSettings.getExperimental();
          onboardingFirstTaskDescription = await buildOnboardingFirstTaskBrief({
            usePlanProposal: experimental.enableFirstTaskPlanProposal === true,
            locale: resolveOnboardingLocale(experimental),
          });
```

11935 орчмын мэндчилгээний `try` блокийн эхэнд:
```ts
          const onboardingLocale = resolveOnboardingLocale(await instanceSettings.getExperimental());
```
`renderOnboardingGreeting({...})`-д `locale: onboardingLocale,` нэм. Нээлтийн асуултын `try` блокт locale-ийг дахин уншина (өмнөх try дотор зарласан хувьсагч харагдахгүй):
```ts
              payload: await buildOnboardingFirstTaskOpeningQuestion(
                resolveOnboardingLocale(await instanceSettings.getExperimental()),
              ),
```

`server/src/routes/agents.ts` — import-д `resolveOnboardingLocale` нэм. 2721-ийн функцийн биеийг:
```ts
    if (params.onboardingFirstAgent !== true) return undefined;
    if (params.actorType !== "board") return undefined;
    const locale = resolveOnboardingLocale(await instanceSettings.getExperimental());
    return buildOnboardingFirstAgentInstructionsBundle({
      agentName: params.agentName,
      organizationName: params.organizationName,
      locale,
    });
```

Run: `pnpm --filter @paperclipai/server exec tsc --noEmit -p . && pnpm --filter @paperclipai/server exec vitest run src/__tests__/issue-onboarding-first-task-routes.test.ts src/__tests__/agent-skills-routes.test.ts`
Expected: PASS. Эдгээр тестийн `getExperimental` mock-д `interactionLanguage` байхгүй тул `"en"` болж англи хүлээлт хэвээр үлдэнэ. `getExperimental` mock нь `undefined` буцаадаг тест байвал `resolveOnboardingLocale(undefined)` нь `"en"` өгнө.

- [ ] **Step 6: Build-д .mn файл хуулагдахыг шалга**

Run: `pnpm --filter @paperclipai/server build && ls server/dist/onboarding-assets/first-task/ server/dist/onboarding-assets/first-task/chief-of-staff/`
Expected: `greeting.mn.md`, `opening-question.mn.json`, `brief.mn.md`, `proposal-*.mn.md`, `AGENTS.mn.md` харагдана.

- [ ] **Step 7: Release-smoke хүлээлтийг шинэчил**

`tests/release-smoke/docker-auth-onboarding.spec.ts` нь locale тохируулдаггүй (UI default `mn`), шинэ суулгалтын сервер `interactionLanguage: "mn"`. 253–255:
```ts
      page.getByText("XO-д тавтай морил!").first()
    …
    await expect(page.getByText("Юу хийхийг хүсэж байна вэ?")).toBeVisible();
```
(42-р мөрийн гарчгийг Task 3 шинэчилнэ.)

- [ ] **Step 8: Commit**

```bash
git add server/src/onboarding-assets/first-task/greeting.mn.md server/src/onboarding-assets/first-task/opening-question.mn.json server/src/onboarding-assets/first-task/brief.mn.md server/src/onboarding-assets/first-task/proposal-confirmation.mn.md server/src/onboarding-assets/first-task/proposal-plan.mn.md server/src/onboarding-assets/first-task/chief-of-staff/AGENTS.mn.md server/src/services/onboarding-first-task-assets.ts server/src/services/onboarding-first-task-assets.test.ts server/src/services/onboarding-greeting.ts server/src/routes/issues.ts server/src/routes/agents.ts tests/release-smoke/docker-auth-onboarding.spec.ts
git commit -m "feat(xo): Mongolian onboarding assets selected by interactionLanguage

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: OnboardingWizard-ийн үлдсэн англи мөрүүд ба ажлын гарчиг

**Files:**
- Modify: `ui/src/components/OnboardingWizard.tsx` (277, 320, 1204, 1669, 1712, 1745, 1788-1790, 1868, 1904, 1942, 1984, 2003, 2022, 2030, 2036, 2044-2045, 2131-2132, 2211, 2260, 2267, 2729-2731, 3112-3115)
- Modify: `ui/src/i18n/xo/en.json`, `ui/src/i18n/xo/mn.json`
- Modify: `tests/e2e/conference-room-typing-intro.spec.ts:22`, `tests/e2e/planning-mode-visual-verification.spec.ts:10`, `tests/release-smoke/docker-auth-onboarding.spec.ts:42`

**Interfaces:**
- Consumes: `tx(key, options?)` from `@/i18n/xo` (файлд аль хэдийн import хийгдсэн).
- Produces: ажлын гарчиг en орчинд "XO onboarding", mn орчинд "XO-г эхлүүлэх".

- [ ] **Step 1: Мөрүүдийг `tx()`-ээр боо**

Модулийн түвшний тогтмолууд (`DEFAULT_TASK_TITLE`, `INCOMPLETE_ONBOARDING_STATE_MESSAGE`) нь import үед нэг удаа үнэлэгдэх тул функц болгоно:

```ts
// 277
const defaultTaskTitle = () => tx("{{brand}} onboarding");
// 1712
            title: defaultTaskTitle(),
// 319-320
const incompleteOnboardingStateMessage = () =>
  tx("Onboarding state is incomplete. Please restart onboarding and try again.");
```
`INCOMPLETE_ONBOARDING_STATE_MESSAGE`-ийн бүх хэрэглээг `incompleteOnboardingStateMessage()` болго (`grep -n INCOMPLETE_ONBOARDING_STATE_MESSAGE ui/src/components/OnboardingWizard.tsx`).

Үлдсэн мөр бүрт яг доорх хэлбэрийг хэрэглэ (зүүн: одоо, баруун: болох):

| Мөр | Болох |
|---|---|
| 1204 | `adapterEnvLoading ? tx("Testing connection…") : loading ? tx("Connecting…") : null` |
| 1669 | `setError(tx("Organization created, but onboarding switched to another organization."))` |
| 1745 | `err instanceof Error ? err.message : tx("Failed to launch first task")` |
| 1788-1790 | `` err instanceof Error ? tx("Could not store the API key: {{message}}", { message: err.message }) : tx("Could not store the API key.") `` |
| 1868 | `tx("Create or select an organization before testing adapter environment.")` |
| 1904 | `tx("Could not load environment settings to determine which environment to test in. Retry the test.")` |
| 1942 | `err instanceof Error ? err.message : tx("Adapter environment test failed")` |
| 1984 | `err instanceof Error ? err.message : tx("Failed to create organization")` |
| 2003 | `tx("{{brand}} Runner is not available during onboarding. Choose a legacy adapter.")` |
| 2022 | `tx("OpenCode requires an explicit model in provider/model format.")` |
| 2030 | `tx("Failed to load OpenCode models.")` |
| 2036 | `tx("OpenCode models are still loading. Please wait and try again.")` |
| 2044 | ``tx("No OpenCode models discovered. Run `opencode models` and authenticate providers.")`` |
| 2045 | `tx("Configured OpenCode model is unavailable: {{model}}", { model: selectedModelId })` |
| 2131 | `tx("The environment test failed. Fix the reported checks before you hire this agent.")` |
| 2132 | `tx("No working authentication was found. Fix the reported checks before you hire this agent.")` |
| 2211 | `err instanceof Error ? err.message : tx("Failed to create agent")` |
| 2260 | `tx("Retried with ANTHROPIC_API_KEY unset in adapter config, but the environment test is still failing.")` |
| 2267 | `tx("Failed to unset ANTHROPIC_API_KEY and retry.")` |
| 2729-2731 | `savedKeys.options.length ? tx("Choose a saved API key or enter a new one") : tx("Provide your {{provider}} API key to connect", { provider: CONNECT_SOURCE_NAMES[adapterType] ?? adapterType })` |
| 3112-3115 | `result.status === "pass" ? tx("Passed") : result.status === "warn" ? tx("Warnings") : tx("Failed")` |

- [ ] **Step 2: Каталогт түлхүүр нэм**

Run: `pnpm xo:i18n:extract`
Expected: `en.json`-д дээрх ~25 түлхүүр нэмэгдэнэ (тэдгээрийн зарим нь аль хэдийн байж болно, тэр нь хэвийн).

`ui/src/i18n/xo/mn.json`-д (байхгүй түлхүүрүүдийг л нэм):

```json
  "{{brand}} onboarding": "{{brand}}-г эхлүүлэх",
  "{{brand}} Runner is not available during onboarding. Choose a legacy adapter.": "Эхлүүлэх үед {{brand}} Runner ашиглах боломжгүй. Өмнөх adapter-уудаас сонгоно уу.",
  "Adapter environment test failed": "Adapter-ын орчны шалгалт амжилтгүй боллоо",
  "Choose a saved API key or enter a new one": "Хадгалсан API түлхүүрээ сонгох эсвэл шинээр оруулна уу",
  "Configured OpenCode model is unavailable: {{model}}": "Тохируулсан OpenCode модель олдсонгүй: {{model}}",
  "Connecting…": "Холбогдож байна…",
  "Could not load environment settings to determine which environment to test in. Retry the test.": "Аль орчинд шалгахыг тодорхойлох орчны тохиргоог ачаалж чадсангүй. Шалгалтаа дахин хийнэ үү.",
  "Could not store the API key.": "API түлхүүрийг хадгалж чадсангүй.",
  "Could not store the API key: {{message}}": "API түлхүүрийг хадгалж чадсангүй: {{message}}",
  "Create or select an organization before testing adapter environment.": "Adapter-ын орчныг шалгахаас өмнө байгууллага үүсгэх эсвэл сонгоно уу.",
  "Failed": "Амжилтгүй",
  "Failed to create agent": "Агент үүсгэж чадсангүй",
  "Failed to create organization": "Байгууллага үүсгэж чадсангүй",
  "Failed to launch first task": "Анхны ажлыг эхлүүлж чадсангүй",
  "Failed to load OpenCode models.": "OpenCode моделиудыг ачаалж чадсангүй.",
  "Failed to unset ANTHROPIC_API_KEY and retry.": "ANTHROPIC_API_KEY-г арилгаад дахин оролдож чадсангүй.",
  "No OpenCode models discovered. Run `opencode models` and authenticate providers.": "OpenCode модель олдсонгүй. `opencode models` ажиллуулж, provider-уудаа нэвтрүүлнэ үү.",
  "No working authentication was found. Fix the reported checks before you hire this agent.": "Ажиллах нэвтрэлт олдсонгүй. Энэ агентыг ажилд авахаасаа өмнө мэдээлсэн шалгалтуудыг засна уу.",
  "Onboarding state is incomplete. Please restart onboarding and try again.": "Эхлүүлэх явцын төлөв дутуу байна. Эхлүүлэх алхмыг дахин эхлүүлээд оролдоно уу.",
  "OpenCode models are still loading. Please wait and try again.": "OpenCode моделиуд ачаалж байна. Түр хүлээгээд дахин оролдоно уу.",
  "OpenCode requires an explicit model in provider/model format.": "OpenCode-д provider/model хэлбэрээр тодорхой модель заах шаардлагатай.",
  "Organization created, but onboarding switched to another organization.": "Байгууллага үүссэн ч эхлүүлэх явц өөр байгууллага руу шилжсэн байна.",
  "Passed": "Амжилттай",
  "Provide your {{provider}} API key to connect": "Холбогдохын тулд {{provider}}-ийн API түлхүүрээ оруулна уу",
  "Retried with ANTHROPIC_API_KEY unset in adapter config, but the environment test is still failing.": "Adapter-ын тохиргооноос ANTHROPIC_API_KEY-г арилгаад дахин оролдсон ч орчны шалгалт амжилтгүй хэвээр байна.",
  "Testing connection…": "Холболтыг шалгаж байна…",
  "The environment test failed. Fix the reported checks before you hire this agent.": "Орчны шалгалт амжилтгүй боллоо. Энэ агентыг ажилд авахаасаа өмнө мэдээлсэн шалгалтуудыг засна уу.",
  "Warnings": "Анхааруулга"
```

Run: `pnpm --filter @paperclipai/ui exec vitest run src/i18n/xo/parity.test.ts && pnpm xo:i18n:check`
Expected: PASS. Parity унавал `en.json`-д байгаа ч `mn.json`-д дутсан түлхүүрийг алдааны мессежээс уншиж нэм.

- [ ] **Step 3: E2E гарчгийн тогтмолуудыг шинэчил**

`playwright.config.ts` бүх e2e spec-ийг `xo.locale=en` дээр ажиллуулдаг тул:
- `tests/e2e/conference-room-typing-intro.spec.ts:22` → `const FIRST_TASK_TITLE = "XO onboarding";`
- `tests/e2e/planning-mode-visual-verification.spec.ts:10` → `const TASK_TITLE = "XO onboarding";`

Release-smoke locale тохируулдаггүй (UI default `mn`):
- `tests/release-smoke/docker-auth-onboarding.spec.ts:42` → `const FIRST_TASK_TITLE = "XO-г эхлүүлэх";`

- [ ] **Step 4: Wizard тест ба typecheck**

Run: `pnpm --filter @paperclipai/ui exec tsc --noEmit && pnpm --filter @paperclipai/ui exec vitest run src/components/OnboardingWizard`
Expected: PASS. Англи текст хүлээдэг wizard тест унавал (тест орчин `VITE_XO_DEFAULT_LOCALE=en`), en утга түлхүүртэйгээ ижил тул зөвхөн "Paperclip onboarding" → "XO onboarding", "Paperclip Runner" → "XO Runner" хүлээлттэй тестүүд л өөрчлөгдөнө. Тэдгээрийг шинэ утгаар засна.

- [ ] **Step 5: Commit**

```bash
git add ui/src/components/OnboardingWizard.tsx ui/src/i18n/xo/en.json ui/src/i18n/xo/mn.json tests/e2e/conference-room-typing-intro.spec.ts tests/e2e/planning-mode-visual-verification.spec.ts tests/release-smoke/docker-auth-onboarding.spec.ts
git commit -m "feat(xo): translate remaining onboarding wizard strings and task title

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

(Хэрэв Step 4-т wizard тест засагдсан бол тэр тест файлыг мөн нэрээр нь нэм.)

---

### Task 4: L2 — серверийн мессежийн каталог (`extract --server`, `check --server`)

**Files:**
- Create: `scripts/xo-i18n/extract-server.ts`
- Test: `scripts/xo-i18n/extract-server.test.ts`
- Modify: `scripts/xo-i18n/cli.ts`
- Create: `ui/src/i18n/xo/server-en.json` (CLI үүсгэнэ)
- Create: `ui/src/i18n/xo/server-mn.json`
- Create: `ui/src/i18n/xo/server-tier1.json`
- Modify: `package.json` (scripts)

**Interfaces:**
- Produces:
  - `export interface ServerMessage { key: string; file: string; line: number }`
  - `export function extractServerMessages(source: string, file: string): ServerMessage[]`
  - `export const STATIC_SERVER_MESSAGES: readonly string[]`
  - `export function placeholdersOf(text: string): string[]`
  - `server-en.json`: `{ "<en>": "<en>" }`, `server-mn.json`: `{ "<en>": "<mn>" }` (зөвхөн орчуулсан), `server-tier1.json`: `string[]`. Task 5 нь `server-mn.json`-ийг импортлоно.

- [ ] **Step 1: Бүтэлгүйтэх тест бич**

`scripts/xo-i18n/extract-server.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { extractServerMessages, placeholdersOf } from "./extract-server";

const keys = (src: string, file = "server/src/routes/x.ts") => extractServerMessages(src, file).map((m) => m.key);

describe("extractServerMessages", () => {
  it("collects the first argument of HttpError helpers", () => {
    expect(keys(`throw notFound("Issue not found"); throw conflict("Busy", { a: 1 });`)).toEqual([
      "Issue not found",
      "Busy",
    ]);
  });

  it("turns template expressions into named placeholders", () => {
    expect(keys('throw conflict(`A company skill with slug "${slug}" already exists.`);')).toEqual([
      'A company skill with slug "{{slug}}" already exists.',
    ]);
    expect(keys("throw badRequest(`Bad ${input.kind} for ${items.length + 1}`);")).toEqual([
      "Bad {{kind}} for {{value}}",
    ]);
  });

  it("collects error strings passed to res.json", () => {
    expect(keys(`res.status(404).json({ error: "Agent not found" }); other({ error: "skip me" });`)).toEqual([
      "Agent not found",
    ]);
  });

  it("collects budget reasons only in services/budgets.ts", () => {
    const src = `const r = { reason: "Budget exceeded" };`;
    expect(keys(src, "server/src/services/budgets.ts")).toEqual(["Budget exceeded"]);
    expect(keys(src)).toEqual([]);
  });

  it("ignores helpers called without a string", () => {
    expect(keys(`throw notFound(); throw badRequest(message);`)).toEqual([]);
  });
});

describe("placeholdersOf", () => {
  it("lists placeholders sorted", () => {
    expect(placeholdersOf("{{b}} and {{a}} and {{b}}")).toEqual(["a", "b"]);
  });
});
```

Run: `pnpm xo:i18n:test -- extract-server`
Expected: FAIL (`Cannot find module './extract-server'`).

- [ ] **Step 2: Ялгагчийг хэрэгжүүл**

`scripts/xo-i18n/extract-server.ts`:

```ts
import { parse } from "@babel/parser";
import traverseImport, { type NodePath } from "@babel/traverse";
import * as babelTypes from "@babel/types";

// @babel/traverse ба @babel/types нь CJS: transform.ts-тэй ижил default-interop.
const traverse = ((traverseImport as unknown as { default?: typeof traverseImport }).default ??
  traverseImport) as typeof traverseImport;
const t = ((babelTypes as unknown as { default?: typeof babelTypes }).default ?? babelTypes) as typeof babelTypes;

export interface ServerMessage {
  key: string;
  file: string;
  line: number;
}

const HELPERS = new Set([
  "badRequest",
  "unauthorized",
  "forbidden",
  "notFound",
  "conflict",
  "payloadTooLarge",
  "unsupportedMediaType",
  "unprocessable",
  "tooManyRequests",
]);

// Messages the server returns without a literal we can parse: the error
// handler's generic bodies and better-auth's own responses.
export const STATIC_SERVER_MESSAGES: readonly string[] = [
  "Validation error",
  "Internal server error",
  "Unauthorized",
  "Forbidden",
  "Not found",
  "Too many requests",
  "Invalid email or password",
  "User already exists. Use another email.",
  "Password too short",
];

function placeholderName(expr: babelTypes.Node): string {
  if (t.isIdentifier(expr)) return expr.name;
  if (t.isMemberExpression(expr) && t.isIdentifier(expr.property) && !expr.computed) return expr.property.name;
  return "value";
}

function messageOf(node: babelTypes.Node | undefined | null): string | null {
  if (!node) return null;
  if (t.isStringLiteral(node)) return node.value;
  if (t.isTemplateLiteral(node)) {
    let out = "";
    node.quasis.forEach((quasi, index) => {
      out += quasi.value.cooked ?? quasi.value.raw;
      const expr = node.expressions[index];
      if (expr) out += `{{${placeholderName(expr)}}}`;
    });
    return out;
  }
  return null;
}

function isInsideJsonCall(path: NodePath): boolean {
  const call = path.parentPath?.parentPath;
  if (!call || !call.isCallExpression()) return false;
  const callee = call.node.callee;
  return t.isMemberExpression(callee) && t.isIdentifier(callee.property) && callee.property.name === "json";
}

export function extractServerMessages(source: string, file: string): ServerMessage[] {
  const ast = parse(source, { sourceType: "module", plugins: ["typescript"] });
  const out: ServerMessage[] = [];
  const isBudgets = file.replace(/\\/g, "/").endsWith("services/budgets.ts");
  const push = (key: string | null, line: number | undefined) => {
    if (key && key.trim().length > 0) out.push({ key, file, line: line ?? 0 });
  };

  traverse(ast, {
    CallExpression(path) {
      const callee = path.node.callee;
      if (t.isIdentifier(callee) && HELPERS.has(callee.name)) {
        push(messageOf(path.node.arguments[0] as babelTypes.Node | undefined), path.node.loc?.start.line);
      }
    },
    ObjectProperty(path) {
      const key = path.node.key;
      const name = t.isIdentifier(key) ? key.name : t.isStringLiteral(key) ? key.value : null;
      if (name === "error" && isInsideJsonCall(path)) {
        push(messageOf(path.node.value), path.node.loc?.start.line);
      } else if (name === "reason" && isBudgets) {
        push(messageOf(path.node.value), path.node.loc?.start.line);
      }
    },
  });
  return out;
}

export function placeholdersOf(text: string): string[] {
  return [...new Set([...text.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]))].sort();
}
```

Run: `pnpm xo:i18n:test -- extract-server && pnpm xo:i18n:typecheck`
Expected: PASS.

- [ ] **Step 3: CLI-д `--server` горим нэм**

`scripts/xo-i18n/cli.ts` — import-уудад:
```ts
import { extractServerMessages, placeholdersOf, STATIC_SERVER_MESSAGES } from "./extract-server";
```

Тогтмолуудын доор:
```ts
const SERVER_SRC = join(REPO_ROOT, "server", "src");
const SERVER_EN_FILE = join(XO_DIR, "server-en.json");
const SERVER_MN_FILE = join(XO_DIR, "server-mn.json");
const SERVER_TIER1_FILE = join(XO_DIR, "server-tier1.json");
```

`usage()`-ийн дээр:
```ts
function listServerSources(dir: string): string[] {
  const files: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      if (name === "__tests__" || name === "node_modules") continue;
      files.push(...listServerSources(full));
    } else if (name.endsWith(".ts") && !name.endsWith(".test.ts") && !name.endsWith(".d.ts")) {
      files.push(full);
    }
  }
  return files;
}

function buildServerCatalog(): Catalog {
  const catalog: Catalog = {};
  for (const key of STATIC_SERVER_MESSAGES) catalog[key] = key;
  for (const file of listServerSources(SERVER_SRC)) {
    const rel = toPosix(relative(REPO_ROOT, file));
    for (const message of extractServerMessages(readFileSync(file, "utf8"), rel)) {
      catalog[message.key] = message.key;
    }
  }
  return sortCatalog(catalog);
}

function runExtractServer(): void {
  const catalog = buildServerCatalog();
  writeJson(SERVER_EN_FILE, catalog);
  console.log(`server-en.json: ${Object.keys(catalog).length} мессеж`);
}

function runCheckServer(): void {
  const problems: string[] = [];
  const fresh = buildServerCatalog();
  const onDisk = readJson<Catalog>(SERVER_EN_FILE, {});
  if (JSON.stringify(fresh) !== JSON.stringify(onDisk)) {
    problems.push("server-en.json хуучирсан: pnpm xo:i18n:extract:server ажиллуул");
  }
  const mn = readJson<Catalog>(SERVER_MN_FILE, {});
  for (const key of readJson<string[]>(SERVER_TIER1_FILE, [])) {
    if (!(key in fresh)) problems.push(`Tier-1 мессеж серверт алга: ${key}`);
    if (!mn[key]) problems.push(`Tier-1 орчуулга дутуу: ${key}`);
  }
  for (const [key, value] of Object.entries(mn)) {
    if (!(key in fresh)) problems.push(`server-mn.json-д хуучирсан түлхүүр: ${key}`);
    if (placeholdersOf(key).join(",") !== placeholdersOf(value).join(",")) {
      problems.push(`Placeholder таарахгүй: ${key}`);
    }
  }
  if (problems.length > 0) {
    for (const problem of problems) console.error(`✗ ${problem}`);
    process.exit(1);
  }
  console.log(`server catalog OK: ${Object.keys(fresh).length} мессеж, ${Object.keys(mn).length} орчуулга`);
}
```

Dispatch-ийг:
```ts
  case "extract":
    if (rest.includes("--server")) runExtractServer();
    else runExtract();
    break;
  case "check":
    if (rest.includes("--server")) runCheckServer();
    else runCheck();
    break;
```

`usage()` мессежийг `"Хэрэглээ: cli.ts extract [--server] | check [--server] | emit | todo <path-prefix...> | merge <file.json>"` болго.

`package.json` scripts-д (`xo:i18n:check` мөрийн доор):
```json
    "xo:i18n:extract:server": "node cli/node_modules/tsx/dist/cli.mjs scripts/xo-i18n/cli.ts extract --server",
    "xo:i18n:check:server": "node cli/node_modules/tsx/dist/cli.mjs scripts/xo-i18n/cli.ts check --server",
```

- [ ] **Step 4: Каталог үүсгэ**

Run: `pnpm xo:i18n:extract:server && node -e "const c=require('./ui/src/i18n/xo/server-en.json');console.log(Object.keys(c).length);for(const k of ['Issue not found','Validation error','A company skill with slug \"{{slug}}\" already exists.'])console.log(k, k in c)"`
Expected: ~1700 орчим мессеж (1556 статик + 224 template-ийн давхардалгүй тоо + 9 статик); гурван түлхүүр бүгд `true`.

- [ ] **Step 5: Tier-1 жагсаалт ба монгол орчуулга бич**

`ui/src/i18n/xo/server-tier1.json`:
```json
[
  "A company skill with slug \"{{slug}}\" already exists.",
  "Agent authentication required",
  "Agent key cannot access another company",
  "Agent not found",
  "Board authentication required",
  "Board user context required",
  "Company not found",
  "Could not verify the local subscription. Run claude auth login in a terminal on the machine running Paperclip, then try Connect again.",
  "Could not verify the local subscription. Run the sign-in command shown for this connection, finish signing in, then try Connect again.",
  "Document is locked",
  "Document not found",
  "Forbidden",
  "Internal server error",
  "Invalid email or password",
  "Invite not found",
  "Issue not found",
  "Member not found",
  "Not found",
  "Password too short",
  "Plugin not found",
  "Project not found",
  "Routine not found",
  "Secret not found",
  "Skill not found",
  "Too many requests",
  "Unauthorized",
  "User already exists. Use another email.",
  "User does not have active company access",
  "Validation error"
]
```

`ui/src/i18n/xo/server-mn.json`:
```json
{
  "A company skill with slug \"{{slug}}\" already exists.": "\"{{slug}}\" slug-тай компанийн skill аль хэдийн байна.",
  "Agent authentication required": "Агентын нэвтрэлт шаардлагатай",
  "Agent key cannot access another company": "Агентын түлхүүрээр өөр компанид хандах боломжгүй",
  "Agent not found": "Агент олдсонгүй",
  "Board authentication required": "Удирдлагын нэвтрэлт шаардлагатай",
  "Board user context required": "Удирдлагын хэрэглэгчийн контекст шаардлагатай",
  "Company not found": "Компани олдсонгүй",
  "Could not verify the local subscription. Run claude auth login in a terminal on the machine running Paperclip, then try Connect again.": "Локал subscription-ийг баталгаажуулж чадсангүй. XO ажиллаж буй машины терминалд claude auth login ажиллуулаад Connect-ийг дахин дарна уу.",
  "Could not verify the local subscription. Run the sign-in command shown for this connection, finish signing in, then try Connect again.": "Локал subscription-ийг баталгаажуулж чадсангүй. Энэ холболтод харуулсан нэвтрэх командыг ажиллуулж, нэвтрэлтээ дуусгаад Connect-ийг дахин дарна уу.",
  "Document is locked": "Баримт түгжигдсэн байна",
  "Document not found": "Баримт олдсонгүй",
  "Forbidden": "Хандах эрхгүй",
  "Internal server error": "Серверийн дотоод алдаа",
  "Invalid email or password": "Имэйл эсвэл нууц үг буруу байна",
  "Invite not found": "Урилга олдсонгүй",
  "Issue not found": "Ажил олдсонгүй",
  "Member not found": "Гишүүн олдсонгүй",
  "Not found": "Олдсонгүй",
  "Password too short": "Нууц үг хэт богино байна",
  "Plugin not found": "Plugin олдсонгүй",
  "Project not found": "Төсөл олдсонгүй",
  "Routine not found": "Давтамжит ажил олдсонгүй",
  "Secret not found": "Нууц утга олдсонгүй",
  "Skill not found": "Skill олдсонгүй",
  "Too many requests": "Хүсэлт хэт олон байна. Түр хүлээгээд дахин оролдоно уу",
  "Unauthorized": "Нэвтрээгүй байна",
  "User already exists. Use another email.": "Хэрэглэгч аль хэдийн бүртгэлтэй байна. Өөр имэйл ашиглана уу.",
  "User does not have active company access": "Хэрэглэгчид идэвхтэй компанийн хандалт алга",
  "Validation error": "Оруулсан мэдээлэл буруу байна"
}
```

Run: `pnpm xo:i18n:check:server`
Expected: `server catalog OK: … мессеж, 29 орчуулга`. "Tier-1 мессеж серверт алга" гэж гарвал серверийн яг текстийг `grep -rn "<эхний үгс>" server/src` -ээр олж хоёр JSON-д ижил болго.

- [ ] **Step 6: Commit**

```bash
git add scripts/xo-i18n/extract-server.ts scripts/xo-i18n/extract-server.test.ts scripts/xo-i18n/cli.ts package.json ui/src/i18n/xo/server-en.json ui/src/i18n/xo/server-mn.json ui/src/i18n/xo/server-tier1.json
git commit -m "feat(xo): extract server messages into a translatable catalog

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: L2 — `translateServerMessage()` ба API алдааны hook

**Files:**
- Create: `ui/src/xo/serverMessage.ts`
- Test: `ui/src/xo/serverMessage.test.ts`
- Modify: `ui/src/api/client.ts:62-66`
- Modify: `ui/src/api/auth.ts:67`

**Interfaces:**
- Consumes: `ui/src/i18n/xo/server-mn.json` (Task 4), `resolveLocale()` from `@/xo/locale`.
- Produces: `export function translateServerMessage(message: string): string`

- [ ] **Step 1: Бүтэлгүйтэх тест бич**

`ui/src/xo/serverMessage.test.ts`:

```ts
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { XO_LOCALE_STORAGE_KEY } from "./locale";
import { translateServerMessage } from "./serverMessage";

describe("translateServerMessage", () => {
  beforeEach(() => localStorage.setItem(XO_LOCALE_STORAGE_KEY, "mn"));
  afterEach(() => localStorage.removeItem(XO_LOCALE_STORAGE_KEY));

  it("translates an exact message", () => {
    expect(translateServerMessage("Issue not found")).toBe("Ажил олдсонгүй");
  });

  it("translates a templated message and keeps the value", () => {
    expect(translateServerMessage('A company skill with slug "seo-audit" already exists.')).toBe(
      '"seo-audit" slug-тай компанийн skill аль хэдийн байна.',
    );
  });

  it("returns unknown messages unchanged", () => {
    expect(translateServerMessage("Something only upstream says")).toBe("Something only upstream says");
  });

  it("returns the original when the locale is en", () => {
    localStorage.setItem(XO_LOCALE_STORAGE_KEY, "en");
    expect(translateServerMessage("Issue not found")).toBe("Issue not found");
  });
});
```

Run: `pnpm --filter @paperclipai/ui exec vitest run src/xo/serverMessage.test.ts`
Expected: FAIL (`Failed to resolve import "./serverMessage"`).

- [ ] **Step 2: Хэрэгжүүл**

`ui/src/xo/serverMessage.ts`:

```ts
import serverMn from "@/i18n/xo/server-mn.json";
import { resolveLocale } from "./locale";

// Сервер locale мэдэхгүй тул англиар хариулна; UI нь server-mn.json-оор
// монгол руу хөрвүүлнэ. Орчуулгагүй мессеж англиараа үлдэнэ.
const catalog = serverMn as Record<string, string>;

interface TemplateEntry {
  pattern: RegExp;
  names: string[];
  translation: string;
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const templates: TemplateEntry[] = Object.entries(catalog)
  .filter(([key]) => key.includes("{{"))
  .map(([key, translation]) => {
    const names: string[] = [];
    const source = key
      .split(/(\{\{\w+\}\})/)
      .map((part) => {
        const match = /^\{\{(\w+)\}\}$/.exec(part);
        if (!match) return escapeRegExp(part);
        names.push(match[1]);
        return "(.+?)";
      })
      .join("");
    return { pattern: new RegExp(`^${source}$`), names, translation };
  });

export function translateServerMessage(message: string): string {
  if (resolveLocale() !== "mn") return message;
  const exact = catalog[message];
  if (exact) return exact;
  for (const entry of templates) {
    const match = entry.pattern.exec(message);
    if (!match) continue;
    const values = new Map<string, string>();
    entry.names.forEach((name, index) => {
      if (!values.has(name)) values.set(name, match[index + 1]);
    });
    return entry.translation.replace(/\{\{(\w+)\}\}/g, (_, name: string) => values.get(name) ?? "");
  }
  return message;
}
```

Run: `pnpm --filter @paperclipai/ui exec vitest run src/xo/serverMessage.test.ts`
Expected: PASS.

- [ ] **Step 3: Hook-уудыг холбо**

`ui/src/api/client.ts` — import нэм: `import { translateServerMessage } from "@/xo/serverMessage";`. 62–66:
```ts
    throw new ApiError(
      translateServerMessage(
        (errorBody as { error?: string } | null)?.error ?? `Request failed: ${res.status}`,
      ),
      res.status,
      errorBody,
    );
```

`ui/src/api/auth.ts` — import нэм: `import { translateServerMessage } from "@/xo/serverMessage";`. `extractAuthError`-ийн төгсгөл:
```ts
  return new AuthApiError(translateServerMessage(message), status, payload, code);
```

`errorBody` хэвээр үлдэх тул анхны англи текстийг шаардлагатай газар `err.body`-оос уншиж болно.

- [ ] **Step 4: UI тестүүд ногоон эсэхийг шалга**

Run: `pnpm --filter @paperclipai/ui exec tsc --noEmit && pnpm --filter @paperclipai/ui exec vitest run src/api src/xo src/pages/Auth`
Expected: PASS (тест орчин `en` тул англи хүлээлттэй тестүүд өөрчлөгдөхгүй).

- [ ] **Step 5: Commit**

```bash
git add ui/src/xo/serverMessage.ts ui/src/xo/serverMessage.test.ts ui/src/api/client.ts ui/src/api/auth.ts
git commit -m "feat(xo): translate server error messages in the UI

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: SYNC.md, бүрэн шалгалт ба хаалтын шалгуур

**Files:**
- Modify: `docs/xo/SYNC.md` (S-set хүснэгт)

- [ ] **Step 1: SYNC.md S-set-д хөндсөн upstream файлуудыг нэм**

`docs/xo/SYNC.md`-ийн S-set жагсаалтад (одоо байгаа хэлбэрийг дагаж) нэм:

```markdown
| packages/shared/src/validators/instance.ts | Ү3-Б | interactionLanguage enum |
| packages/shared/src/types/instance.ts | Ү3-Б | interactionLanguage төрөл |
| server/src/services/instance-settings.ts | Ү3-Б | interactionLanguage normalize/default |
| server/src/services/heartbeat.ts | Ү3-Б | interactionLanguage payload руу |
| packages/adapter-utils/src/server-utils.ts | Ү3-Б | монгол харилцааны заавар (simplified-English-ээс түрүүлнэ) |
| ui/src/pages/InstanceExperimentalSettings.tsx | Ү3-Б | InteractionLanguageCard |
| server/src/services/onboarding-first-task-assets.ts | Ү3-Б | locale-тэй ачаалагч, *.mn.* fallback |
| server/src/services/onboarding-greeting.ts | Ү3-Б | locale дамжуулах |
| server/src/routes/issues.ts | Ү3-Б | onboarding locale (brief, greeting, opening question) |
| server/src/routes/agents.ts | Ү3-Б | onboarding persona locale |
| ui/src/api/client.ts | Ү3-Б | ApiError → translateServerMessage |
| ui/src/api/auth.ts | Ү3-Б | AuthApiError → translateServerMessage |
| ui/src/components/OnboardingWizard.tsx | Ү3-Б | үлдсэн мөрүүд tx(), гарчиг |
```

Upstream merge бүрийн дараа `pnpm xo:i18n:extract:server && pnpm xo:i18n:check:server` ажиллуулах мөрийг SYNC.md-ийн "Merge-ийн дараах алхмууд" хэсэгт нэм.

- [ ] **Step 2: Бүрэн шалгалт**

Run:
```bash
pnpm -r exec tsc --noEmit
pnpm --filter @paperclipai/shared exec vitest run
pnpm --filter @paperclipai/adapter-utils exec vitest run
pnpm --filter @paperclipai/server exec vitest run src/services/onboarding-first-task-assets.test.ts src/services/onboarding-greeting.test.ts src/__tests__/instance-settings-service.test.ts src/__tests__/issue-onboarding-first-task-routes.test.ts src/__tests__/agent-skills-routes.test.ts
pnpm --filter @paperclipai/ui exec vitest run
pnpm xo:i18n:test
pnpm xo:i18n:check
pnpm xo:i18n:check:server
```
Expected: бүгд PASS.

- [ ] **Step 3: Browser дахь 5 сценари (dev server, UI `mn`)**

Шинэ компани үүсгээд (тест компани, нууц үг шаардахгүй алхмууд) дараахыг `read_page`/`get_page_text`-ээр баталгаажуул:

1. Onboarding wizard: бүх товч, алдаа, "Холболтыг шалгаж байна…" монгол; үүссэн ажлын гарчиг "XO-г эхлүүлэх".
2. Анхны ажил: мэндчилгээ "XO-д тавтай морил! Би …", карт "Юу хийхийг хүсэж байна вэ?", сонголтууд монгол.
3. Байхгүй ажил руу орох (`/issues/<байхгүй-id>` эсвэл API-аар 404 өдөөх) → toast/алдаа "Ажил олдсонгүй". (Анхны сценари "давхардсан компанийн нэр" байсан ч компанийн нэр давтагдахыг сервер хориглодоггүй тул энэ сценариар солив.)
4. Компанийн skill-ийг байгаа slug-аар дахин үүсгэх → "\"<slug>\" slug-тай компанийн skill аль хэдийн байна."
5. Instance Settings → Experimental: "Агентын харилцааны хэл" карт асаалттай; унтраахад `interactionLanguage: "en"` хадгалагдана, дахин асаана.

Эцсийн байдлыг нэг screenshot-оор (жижигрүүлж) PROGRESS.md-д тэмдэглэ.

- [ ] **Step 4: ED-ийн 1 агент / 3 ажлын туршилт (ED гүйцэтгэнэ)**

ED: шинэ instance дээр нэг claude_local агенттай 3 ажил өгч, агентын сэтгэгдэл, асуултын карт, баримт монголоор гарч буйг шалгана. Timer wake (payload-гүй) үед монгол заавар prompt-д орохгүй гэдгийг мэдэж байх: энэ нь хүлээн зөвшөөрөгдсөн хязгаарлалт, agent persona (AGENTS.mn.md) монголоор харилцахыг аль хэдийн заадаг.

- [ ] **Step 5: Commit**

```bash
git add docs/xo/SYNC.md
git commit -m "docs(xo): record Ү3-Б touched upstream files in SYNC S-set

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

Push-ийг ED-ийн зөвшөөрлөөр, `find .git/refs -name '* 2*'` хоосон гэдгийг шалгасны дараа л хийнэ.

---

## Хязгаарлалт ба Ү3-Б-ээс гадуурх зүйлс

- Timer-ээр сэрэх (payload null) run-д монгол заавар prompt-д орохгүй; persona файл энэ цоорхойг хаана.
- "Introducing Connectors" зарлал гадаад feed-ээс ирдэг (`config.ts:369`, PAPERCLIP_ANNOUNCEMENTS_*). Ү3-В-д унтраах эсвэл орчуулахыг шийднэ.
- Tier-1-ээс гадуурх ~1700 серверийн мессеж англиар үлдэнэ; `pnpm xo:i18n:check:server` нь Tier-1-ийг л шаардана. Цааш нь давтамжаар нэмнэ.
