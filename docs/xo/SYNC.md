# Upstream sync (сар бүр)

Зарчим: зөвхөн stable tag (`vYYYY.MMDD.N`), beta/nightly хэзээ ч биш. Merge-ийг xo-main дээр хийнэ, rebase хийхгүй (xo-main нийтлэгдсэн).

1. Шинэ tag харах:
   `git fetch upstream --tags && git tag --list 'v2026.*' --sort=-version:refname | head -5`
2. Сүүлийн stable tag-ийг сонго (beta дагавартайг алгас): `TAG=v2026.XXXX.N`
3. Хуулбар ref шалгах: `find .git/refs -name '* 2*'` → хоосон.
4. Merge: `git merge --no-ff "$TAG" -m "chore(xo): sync upstream $TAG"`
5. Зөрчил гарвал зөвхөн S-set файлуудад (docs/superpowers/plans/2026-09-29-xo-paperclip-mongolian.md "Нийтлэг хязгаарлалт") гарна:
   `ui/src/i18n/index.ts`, `ui/src/lib/utils.ts`, `SidebarAccountMenu*.tsx`, `ui/index.html`,
   `site.webmanifest`, `BreadcrumbContext.tsx`, `Auth.tsx`, `ui/vite.config.ts`, `ui/vitest.config.ts`,
   `docs/docs.json`, `tests/e2e/playwright.config.ts`, `package.json`, `.gitignore`, `server/src/config.ts`.
   Upstream-ийн шинэ хувилбарыг авч XO-ийн мөрүүдийг дахин нэм.
   Ү2-оос хойш мөн доорх «Ү2-д нэмэгдсэн файлууд» хэсгийн файлууд (`tx()`/`XoTrans` нэмсэн мөрүүд).
   Мөн доорх «Upstream хавтас дахь XO файлууд» ба «Lockfile» хэсгийн файлууд.
6. Толь шинэчлэх: `pnpm xo:i18n:extract && pnpm xo:i18n:check` → шинэ/өөрчлөгдсөн түлхүүрийг `ui/src/i18n/xo/mn.json`-д орчуул, `check` OK болтол.
6а. Серверийн толь: `pnpm xo:i18n:extract:server && pnpm xo:i18n:check:server` (Tier-1 серверийн мессеж орчуулагдсан эсэх).
6б. Брэнд скан: `pnpm xo:brand-scan`. Унавал upstream шинэ "Paperclip" мөр оруулсан: хэрэглэгчид харагдах бол XO болго эсвэл каталогоор дамжуул; зөвшөөрөгдөх бол `node scripts/xo-brand/scan.mjs --update`.
6в. Upstream шинэ `startsWith("PAPERCLIP_")` шүүлтүүр эсвэл `".paperclip"` гэрийн замыг нэмсэн эсэхийг шалга: `git diff <өмнөх-tag>..<шинэ-tag> | grep -n 'startsWith("PAPERCLIP_")\|homedir(), ".paperclip"'`. Олдвол isBrandRuntimeEnvKey / resolveDefaultBrandHomeDir руу шилжүүл.
7. Шалгалт: `pnpm --filter @paperclipai/ui typecheck && (cd ui && pnpm exec vitest run) && pnpm build && pnpm test:e2e`
8. Таг: `git tag "xo-$TAG" && git push origin xo-main "xo-$TAG"` (ED зөвшөөрсний дараа).
9. `docs/xo/SYNC.md`-ийн доорх түүхэнд мөр нэм.

## Ү2-д нэмэгдсэн файлууд

Task 11-д `tx()`/`XoTrans` нэмсэн upstream файлууд (толь бичгийн commit-оос хойш өөрчлөгдсөн `ui/src`, XO-ийн өөрийн `ui/src/xo/`, `ui/src/i18n/xo/` хасагдсан):

- `ui/src/components/ApprovalPayload.tsx`
- `ui/src/components/OnboardingWizard.tsx`
- `ui/src/components/onboarding/SavedProviderKeySelect.tsx`
- `ui/src/components/ui/command.tsx`
- `ui/src/hooks/useComposerStop.ts`
- `ui/src/hooks/useDateRange.ts`
- `ui/src/hooks/useRetryNowMutation.ts`
- `ui/src/lib/activity-format.ts`
- `ui/src/lib/agent-setup-fields.ts`
- `ui/src/lib/announcement-preview.ts`
- `ui/src/lib/app-gallery-copy.ts`
- `ui/src/lib/built-in-agent-toast.ts`
- `ui/src/pages/AgentDetail.production.tsx`
- `ui/src/pages/AgentDetail.tsx`
- `ui/src/pages/ApprovalDetail.tsx`
- `ui/src/pages/CompanyAccess.tsx`
- `ui/src/pages/CompanyEnvironments.tsx`
- `ui/src/pages/CompanyExport.tsx`
- `ui/src/pages/CompanyImport.tsx`
- `ui/src/pages/CompanySettingsPluginPage.tsx`
- `ui/src/pages/Costs.production.tsx`
- `ui/src/pages/Costs.tsx`
- `ui/src/pages/Dashboard.tsx`
- `ui/src/pages/Inbox.tsx`
- `ui/src/pages/InstanceExperimentalSettings.tsx`
- `ui/src/pages/IssueDetail.tsx`
- `ui/src/pages/Projects.tsx`
- `ui/src/pages/Search.tsx`
- `ui/src/pages/WhatNeedsMe.tsx`

Нэмэлт тэмдэглэл: `scripts/xo-i18n/transform.ts`-ийн allowlist-д `message`, `action`, `subtitle` нэмэгдсэн (энэ файл XO-ийн өөрийнх тул upstream merge-д нөлөөгүй).

## Upstream хавтас дахь XO файлууд

Fork-ийн өөрийн хавтас (`ui/src/xo/`, `ui/src/i18n/xo/`, `scripts/xo-i18n/`, `docs/xo/`, `tests/e2e/xo-*.spec.ts`, `docs/superpowers/`)-аас гадуур XO-ийн өөрчилсөн буюу нэмсэн бусад upstream зам. `git diff --name-status d554c4789..HEAD`-ээр баталгаажуулсан.

Өөрчилсөн (M):

- `.gitignore`, `package.json`, `docs/docs.json`
- `ui/index.html`, `ui/public/site.webmanifest`, `ui/vite.config.ts`, `ui/vitest.config.ts`, `ui/src/i18n/index.ts`
- `ui/src/lib/utils.ts`, `ui/src/context/BreadcrumbContext.tsx`, `ui/src/context/BreadcrumbContext.test.tsx`, `ui/src/pages/Auth.tsx`
- `ui/src/components/SidebarAccountMenu.tsx`, `ui/src/components/SidebarAccountMenu.production.tsx`
- `ui/src/components/BreadcrumbBar.tsx`, `ui/src/components/BreadcrumbBar.test.tsx` (Ү2 fix: mobile compact header нь орчуулсан "Tasks" шошгыг мөн таних)
- `tests/e2e/playwright.config.ts`
- `tests/e2e/multi-user-authenticated.spec.ts` (ED 2026-10-01-нд S-set-д нэмсэн: default локал mn тул `EN_STORAGE_STATE` + `test.use` нэмж `browser.newContext()`-д дамжуулсан)

Нэмсэн (A), upstream хавтас дотор:

- `ui/src/i18n/locales/mn.json` (upstream өөрөө `mn.json` нийтэлбэл add/add зөрчил гарна)
- `ui/src/i18n/xo.ts`, `ui/src/i18n/xo.test.ts`
- `ui/src/lib/utils.locale.test.ts`

Sync бүрд `ThemeToggle`-ийг `ui/src/xo/XoLocaleMenuAction.tsx`-ийн markup-тай дахин харьцуул: XO-ийн цэсийн үйлдэл нь ThemeToggle-ийн markup-ийг санаатайгаар давхардуулдаг, upstream ThemeToggle өөрчлөгдвөл гараар дагуулна.

## Ү3-Б-д хөндсөн upstream файлууд

Ү3-Б (харилцааны хэл, серверийн мессеж, onboarding locale) `bbadaf2c9..HEAD`-д хөндсөн upstream замууд. Sync-д зөрчил гарвал upstream-ийн хувилбарыг аваад XO-ийн мөрүүдийг дахин нэм.

| Файл | Ү3-Б | Өөрчлөлт |
|---|---|---|
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
| ui/src/components/IssueDocumentsSection.tsx | Ү3-Б | ApiError.originalMessage-ээр харьцуулах |
| ui/src/components/AgentActionButtons.tsx | Ү3-Б | ApiError.originalMessage-ээр харьцуулах |
| ui/src/pages/tools/shared.tsx | Ү3-Б | ApiError.originalMessage-ээр харьцуулах |
| ui/src/pages/secrets/ImportFromVaultDialog.tsx | Ү3-Б | ApiError.originalMessage-ээр харьцуулах |
| ui/src/pages/InviteLanding.tsx | Ү3-Б | ApiError.originalMessage-ээр харьцуулах |
| package.json | Ү3-Б | xo:i18n:extract:server, xo:i18n:check:server скрипт |
| tests/e2e/conference-room-typing-intro.spec.ts | Ү3-Б | mn locale-д тааруулсан |
| tests/e2e/planning-mode-visual-verification.spec.ts | Ү3-Б | mn locale-д тааруулсан |
| tests/release-smoke/docker-auth-onboarding.spec.ts | Ү3-Б | mn locale-д тааруулсан |

Upstream тестүүд (`packages/adapter-utils/src/server-utils.test.ts`, `server/src/__tests__/instance-settings-service.test.ts`, `server/src/__tests__/issue-onboarding-first-task-routes.test.ts`, `server/src/services/onboarding-first-task-assets.test.ts`, `ui/src/api/client.test.ts`, `ui/src/pages/InstanceExperimentalSettings.test.tsx`) мөн нэмэгдэл/засвартай. Шинээр нэмсэн `server/src/onboarding-assets/first-task/**/*.mn.*` файлууд upstream-д байхгүй тул зөрчилдөхгүй.

## Ү3-В-д хөндсөн upstream файлууд

Ү3-В (гадагш дуудлагагүй default, dev JWT, acpx 0.13.1, issue-гүй run) хөндсөн upstream замууд. Sync-д зөрчил гарвал upstream-ийн хувилбарыг аваад XO-ийн мөрүүдийг дахин нэм. XO-ийн шинэ файлууд (`packages/shared/src/telemetry/config.test.ts`, `server/src/config.telemetry.test.ts`, `server/src/dev-agent-jwt-secret.ts`, `server/src/__tests__/dev-agent-jwt-secret.test.ts`, `docs/xo/ops-notes.md`) энд ороогүй.

| Файл | Ү3-В | Өөрчлөлт |
|---|---|---|
| `packages/shared/src/telemetry/config.ts` | A | `enabled !== true` бол унтраах |
| `packages/shared/src/config-schema.ts` | A | `telemetry.enabled`, `updates.checkEnabled` default `false` |
| `packages/shared/src/telemetry/README.md` | A | XO тэмдэглэл |
| `server/src/config.ts` | A | `telemetryEnabled ?? false`, `announcementsEnabled === "true"` |
| `server/src/services/feedback-share-client.ts` | A | default URL хассан, URL-гүй бол `undefined` |
| `server/src/__tests__/feedback-share-client.test.ts` | A | default URL тестийг солиод `client!` |
| `cli/src/update-notice.ts` | A | `checkEnabled === true`, catch нь `false` |
| `cli/src/__tests__/update-notice.test.ts` | A | config-той throttle тест, config-гүй тест |
| `cli/src/commands/configure.ts`, `onboard.ts`, `worktree-lib.ts` | A | шинэ config-д `telemetry.enabled: false` |
| `cli/src/__tests__/telemetry.test.ts` | A | kill-switch env устгах, config-гүй тест |
| `README.md` | A | Telemetry хэсэг opt-in |
| `doc/ANNOUNCEMENTS.md` | A | `=true` opt-in |
| `scripts/dev-runner.ts` | B | `ensureDevAgentJwtSecret(process.env)` |
| `packages/adapter-utils/package.json` | C | acpx `0.13.1` |
| `package.json` | C | `acpx@0.12.0` patch хассан |
| `pnpm-workspace.yaml` | C | `acpx@0.12.0` patch хассан (patchedDependencies) |
| `patches/acpx@0.12.0.patch` | C | устгасан |
| `scripts/acpx-patch-packaging.test.mjs` | C | зөвхөн 0.13.1 шалгана |
| `packages/adapter-utils/src/acpx-engine/execute.ts` | C | `inheritProcessEnv` → `spawnEnvironment` |
| `packages/adapter-utils/src/acpx-engine/execute.test.ts` | C | spawnEnvironment тест |
| `packages/adapter-utils/src/acpx-engine/remote-spawn-smoke.test.ts` | C | тайлбар |
| `server/src/services/cross-issue-influence-limit.ts` | D1 | issue-гүй run-ийг cap-аар тоолно |
| `server/src/__tests__/cross-issue-influence-limit.test.ts` | D1 | fail-closed тестийг XO тестээр солисон |
| `server/src/services/execution-continuation.ts` | D2 | interaction нэрлэсэн issue-гүй эх run |
| `server/src/services/execution-continuation.test.ts` | D2 | таван XO тест |

Upstream sync хийхдээ: upstream telemetry-ийн default-ыг өөрчилсөн эсвэл шинэ гадагш дуудлага (paperclip.ing, paperclip.app, paperclip.dev, AWS ingest) нэмсэн эсэхийг `git diff <old>..upstream/master | grep -n "paperclip.ing\|paperclip.app\|paperclip.dev\|amazonaws"`-аар шалгаж, шинэ дуудлагыг мөн opt-in болго.

`pnpm-lock.yaml` "## Lockfile" хэсгийн дүрмээр зохицуулагдана.

## Ү3-А-д хөндсөн upstream файлууд

Ү3-А (брэндийн нэр: XO_* орчны хувьсагч, ~/.xo гэр, `xo` CLI, onboarding текст) `db96d12e6..HEAD`-д хөндсөн upstream замууд. Sync-д зөрчил гарвал upstream-ийн хувилбарыг аваад XO-ийн мөрүүдийг дахин нэм. XO-ийн шинэ файлууд (`packages/shared/src/xo-brand-env.ts`, `scripts/xo-brand/*`, `ui/src/xo/*`, шинэ `xo-*.test.ts` болон `*.xo-env.test.ts` файлууд) энд ороогүй.

| Файл | Ү3-А | Өөрчлөлт |
|---|---|---|
| `packages/shared/src/home-paths.ts` | А | resolveDefaultBrandHomeDir: XO_HOME > PAPERCLIP_HOME > ~/.xo > ~/.paperclip |
| `packages/adapter-utils/src/server-utils.ts` | А | child env-д PAPERCLIP_X ба XO_X хоёуланг дамжуулна |
| `packages/adapter-utils/src/acpx-engine/execute.ts` | А | spawn env-д XO_X хуулбар |
| `server/src/config.ts` | А | XO_* alias унших |
| `server/src/services/plugin-local-folders.ts` | А | брэнд гэрийн зам |
| `server/src/services/workspace-runtime.ts` | А | isBrandRuntimeEnvKey шүүлтүүр |
| `server/src/services/effective-run-config-fingerprints.ts` | А | isBrandRuntimeEnvKey шүүлтүүр |
| `packages/db/scripts/clean-poisoned-claude-sessions.ts` | А | брэнд гэрийн зам |
| `cli/src/index.ts` | А | `xo` нэр, XO_ alias эхлүүлэх |
| `cli/src/config/env.ts` | А | XO_ alias |
| `cli/src/config/data-dir.ts` | А | `--data-dir` нь XO_* ба PAPERCLIP_* хоёуланг тохируулна |
| `cli/src/commands/test-drive.ts` | А | брэнд нэр |
| `cli/package.json` | А | шинэ bin `xo` (`paperclipai` хэвээр) |
| `package.json` | А | `xo:brand-scan` скрипт |
| `server/src/onboarding-assets/ceo/AGENTS.md`, `ceo/HEARTBEAT.md`, `default/AGENTS.md`, `first-task/brief.md`, `first-task/greeting.md` | А | XO_ нэр, брэнд текст |

Upstream тестүүд (`cli/src/__tests__/data-dir.test.ts`, `packages/adapter-utils/src/acpx-engine/execute.test.ts`, `packages/shared/src/home-paths.test.ts`, `server/src/services/onboarding-greeting.test.ts`, `server/src/services/onboarding-first-task-assets.test.ts`, `server/src/__tests__/issue-onboarding-first-task-routes.test.ts`) мөн засвартай.

## Lockfile

`pnpm-lock.yaml` XO-ийн dependency өөрчлөлт (root `package.json`)-өөс болж sync-д ихэвчлэн зөрчилдөнө. Гараар merge хийхгүй:

```bash
git checkout --theirs pnpm-lock.yaml && pnpm install
```

`pnpm install` нь lockfile-ийг `package.json`-уудаас дахин үүсгэнэ. Дараа нь `git add pnpm-lock.yaml`.

## Түүх

| Огноо | Upstream tag | XO tag | Тэмдэглэл |
|---|---|---|---|
| 2026-09-29 | v2026.916.1 | — | суурь |
