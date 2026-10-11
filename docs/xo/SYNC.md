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
