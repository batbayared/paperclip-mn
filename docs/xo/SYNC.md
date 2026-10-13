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

## Ү3-Б үлдэгдэлд хөндсөн upstream файлууд

| Файл | Өөрчлөлт |
|---|---|
| ui/src/components/onboarding/CredentialModeLink.tsx | LINK_LABEL-г xoLabel()-ээр ороосон, import |
| ui/src/components/onboarding/ModelSourceTiles.tsx | CREDENTIAL_TAG_LABEL-г xoLabel()-ээр, import |
| ui/src/components/onboarding/Stepper.tsx | алхмын aria-label xoLabel(), import |
| ui/src/components/task-chat/QuestionForm.tsx | T1-д нэмсэн; answerError/setError/хуудаслалт/attachAriaLabel tx(); answerError export хийсэн (тестэд) |
| ui/src/components/PropertiesPanel.tsx | T1-д нэмсэн (кодын өөрчлөлтгүй) |
| ui/src/components/SidebarCompanyMenu.tsx | switcherNoun = tx("organization") |
| ui/src/components/SidebarCompanyMenu.production.tsx | switcherNoun tx() |
| ui/src/pages/Costs.tsx | scope нэр үгийг tx("organization")/tx("agent")/tx("project") |
| ui/src/pages/Costs.production.tsx | "{scopeType} budgets" → tx("{{scope}} budgets"); scope нэр үг tx("company")/tx("agent")/tx("project") |
| ui/src/components/StatusIcon.tsx | statusLabel → xoStatusLabel() |
| ui/src/components/KanbanBoard.tsx | statusLabel → xoStatusLabel() |
| ui/src/components/StatusBadge.tsx | анхдагч шошго xoStatusLabel() |
| ui/src/components/ActivityCharts.tsx | легенд xoStatusLabel() |
| ui/src/components/ActivityFeed.tsx | шүүлтүүрийн шошго xoStatusLabel(); "All" шүүлтүүрийг tx("All") |
| ui/src/components/NewIssueDialog.tsx | buildStatusOptions label xoStatusLabel() (description англиар үлдсэн) |
| ui/src/pages/IssueDetail.tsx | 404 үед "Task not found" |
| ui/src/pages/IssueDetail.test.tsx | 404 → "Task not found" тест нэмсэн |

XO-ийн өмч (upstream биш): ui/src/xo/labels.ts, scripts/xo-i18n/tiers.ts, ui/src/i18n/xo/*. Шинэ XO-ийн тестүүд: ui/src/xo/labels.test.ts, ui/src/i18n/xo/suffix.test.ts, ui/src/components/StatusIcon.xo.test.tsx, ui/src/components/onboarding/CredentialTag.xo.test.tsx, ui/src/components/task-chat/QuestionForm.xo.test.ts.

Үлдэгдэл:

- NewIssueDialog-ийн статусын description англиар үлдсэн.
- {{var}} дагавартай ~48 бусад mn мөр хойшлогдсон.
- IssueDetail-ийн 404 бус алдаа дээр түүхий error.message харагдсан хэвээр.
- 404 мессеж React Query-ийн retry-ийн дараа (~7 сек) гарна.

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

`pnpm-lock.yaml` "## Ү6 7.4-д хөндсөн upstream файлууд

7.3-ын «Үлдэгдэл»-ийн огноо, төлөв, үүрэг, T1 файл дахь JSX биш литералыг хаасан. tiers.ts өөрчлөгдөөгүй. Тэмдэглэгээ 7.3-ын хүснэгттэй ижил.

| Файл | Өөрчлөлт |
|---|---|
| ui/src/components/AgentActionButtons.tsx | «Run now», «Assign Task», «Pause» prop-ийн анхдагч утга; цэсний «Clear error», «Reset Sessions», «Terminate», «Duplicate Agent», «Copy Agent ID», provider trace-ийн зүйл гар tx |
| ui/src/components/AgentProperties.tsx | үүргийн шошго xoRoleLabel |
| ui/src/components/DecisionTriageStrip.tsx | «When to decide» шошго ба aria-label, DECIDE_BY_OPTIONS-ийн шошго render үед tx |
| ui/src/components/MembershipAction.tsx | «Join»/«Leave»/«Joining...»/«Leaving...» гар tx; aria «Join {{name}}» (mn «Нэгдэх: {{name}}») |
| ui/src/components/ProviderTraceStatusBadge.tsx | «Trace off» г.м. xoTraceStatusLabel |
| ui/src/components/ReportsToPicker.tsx | үүргийн шошго xoRoleLabel |
| ui/src/components/SidebarServerInfo.tsx | Intl timeStyle → xoLocaleDateTime; «Clean checkout», «Local changes present», staged/unstaged/untracked, «Health unavailable» гар tx |
| ui/src/components/SmokeLabDashboardCard.tsx | Intl timeStyle → xoLocaleDateTime |
| ui/src/components/StatusBadge.tsx | агент ба issue-ийн төлөв xoStatusLabel |
| ui/src/components/SummarySlotCard.tsx | xoLocaleDateTime; «Latest (Rev {{n}})», «Rev {{n}}» гар tx |
| ui/src/components/routine-sections/editable-sections.tsx | formatFireTime mn замд xoZonedDateTime (Intl("en-US") formatToParts → mnDateTime) |
| ui/src/components/routine-sections/editable-sections.production.tsx | дээрхтэй ижил (хос файл) |
| ui/src/components/transcript/RunTranscriptView.tsx | «Unavailable source», «Child agent», «No transcript yet.», «unknown» гар tx |
| ui/src/lib/attention.ts | decideBy шошго («Not set», «Today», «This week», «Whenever») гар tx; UTC огноо mn-д timeZone дагана (date-format.ts-ийн mnZoned) |
| ui/src/lib/issue-monitor.ts | mn салаа: «Өнөөдөр, HH:MM», богино ба бүтэн огноо mnDate/mnTime |
| ui/src/pages/AgentDetail.tsx | «Assign Task», тайлагнах шугамын засварын шалтгаан, «Waiting for transcript...», «No persisted transcript for this run.» гар tx; run source xoRunSourceLabel; үүрэг xoRoleLabel |
| ui/src/pages/AgentDetail.production.tsx | дээрхтэй ижил (хос файл) |
| ui/src/pages/Agents.tsx | үүргийн шошго xoRoleLabel |
| ui/src/pages/Agents.production.tsx | дээрхтэй ижил (хос файл) |
| ui/src/pages/OrgChart.production.tsx | үүргийн шошго xoRoleLabel |
| ui/src/pages/Pipelines.tsx | formatShortDate xoLocaleDateTime; formatPipelineActivity-ийн «just now», «{{n}} min ago», «yesterday», «No activity» г.м. гар tx |
| ui/src/pages/ProjectWorkspaceDetail.tsx | «Workspace ID», «Project», «Local path», «Repo», «None» гар tx |
| ui/src/pages/tools/SmokeLabTab.tsx | Intl timeStyle → xoLocaleDateTime |

XO-ийн өмч: ui/src/xo/date-format.ts (mnZoned, богино огнооны салаа, xoZonedDateTime), ui/src/xo/labels.ts (xoStatusLabel-д 21 төлөв, xoRoleLabel, xoRunSourceLabel, xoTraceStatusLabel), ui/src/i18n/xo/* (keys=2616; keep-en.json-д "DevOps").

Шинэ XO-ийн тестүүд: ui/src/i18n/xo/y6-7-4-keys.test.ts, ui/src/lib/issue-monitor.test.tsx (mn), ui/src/xo/date-format.test.ts ба ui/src/xo/labels.test.ts (нэмэлт).

Үлдэгдэл (Ү6 7.4): хэрэгжсэн (Ү6 7.5, доорх "Ү6 7.5-д хөндсөн upstream файлууд"). Агентын зүүн навигаци, Audit → Runs, AgentActionButtons-ийн toast ба баталгаажуулах текст, ProjectWorkspaceDetail-ийн Field шошгыг 7.5 хаасан; хаагдаагүй нь "Үлдэгдэл (Ү6 7.5)"-д.
- Ү6 7.5-д шилжүүлсэн: InteractionGovernancePanel.tsx, interaction-audience.ts, pages/Secrets.tsx-ийн статик шошго, IssueThreadInteractionCard.tsx.
- mn-д цагийн бүсийн нэр ба гараг харагдахгүй; issue-monitor-ийн mn зам display time zone-ыг үл хайхарна (UB орон нутгийн цагтай ижил тул практикт зөрөхгүй).
- editable-sections-ийн Intl("en-US") formatToParts нь mn замд тоон хэсэг авах зорилготой; en гаралт өөрчлөгдөөгүй.
- AgentActionButtons-ийн toast ба баталгаажуулах текст, ProjectWorkspaceDetail-ийн бусад Field шошго («Workspace facts», «Visibility», «Repo URL» г.м.) англиар үлдсэн.
- Үүргийн орчуулгыг (CEO, CTO, PM «Бүтээгдэхүүний менежер», QA «Чанарын хяналт» г.м.) ED шалгана.
- 7.3-ын үлдэгдлээс хэвээр: d.label === "Intent" харьцуулалт, dev-only T2 файлууд ба LegacyIssuesList.
- Browser шалгалт (7.4 дараах, tier-т ороогүй өмнөх файл): агентын хуудасны зүүн навигаци («Overview», «Instructions», «Runs», «Permissions / Trust» г.м.) ба «Overview» гарчиг; Audit хэсгийн Runs хуудас бүхэлдээ англи.

## Lockfile" хэсгийн дүрмээр зохицуулагдана.

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

## Ү6 7.1-д хөндсөн upstream файлууд

T1 = scripts/xo-i18n/tiers.ts-ийн tier-1 жагсаалтад нэмсэн (Vite transform JSX текстийг автоматаар tx()-ээр ороодог, эх кодод өөрчлөлтгүй). "гар tx" = template эсвэл холимог JSX-ийг эх кодод tx()/XoTrans-аар ороосон.

| Файл | Өөрчлөлт |
|---|---|
| ui/src/components/IssuesList.tsx | T1; гар tx (бүлгийн гарчиг, хоосон төлөвийн тоо); огнооны хуваагч xoDateGroupLabel |
| ui/src/components/IssueFiltersPopover.tsx | T1; гар tx (шүүлтүүрийн тоо) |
| ui/src/components/IssueColumns.tsx | T1; баганын нэр, тайлбар xoColumnLabel/xoColumnDescription; гар tx (Reset defaults мөр) |
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
| ui/src/components/task-chat/TaskChatComposer.tsx | T1; MODE_DESCRIPTION → xoLabel, placeholder ба хавсралтын гар tx |
| ui/src/components/task-chat/TaskChatCompactInteractionCard.tsx | T1; гар tx |
| ui/src/components/task-chat/TaskChatBubble.tsx | T1; хавсралтын төрөл xoFileKindLabel, гар tx |
| ui/src/components/task-chat/TaskChatProtocolCard.tsx | T1; гар tx |
| ui/src/components/task-chat/TaskChatRichInput.tsx, TaskChatInteractionCard.tsx, TaskChatProtocolActivityRow.tsx, TaskChatQueuedMessages.tsx, TaskChatBlockerLinks.tsx, TaskChatPausedTakeover.tsx | T1 |
| ui/src/lib/issue-chat-messages.ts | formatDurationWords, runDurationLabel, waitingText, Provider activity гар tx (T1-д ороогүй) |
| ui/src/components/task-chat/TaskChatLiveRunPill.tsx | T1; run-text helper, гар tx |
| ui/src/components/task-chat/TaskChatTurn.tsx | T1; run-text helper, гар tx |
| ui/src/components/task-chat/transcript-adapter.ts | T1; үйлдлийн шошго xoActivityLabel |
| ui/src/components/task-chat/TaskChatActivityPhase.tsx | T1; гар tx |
| ui/src/components/task-chat/TaskChatStatusPill.tsx | T1; статусын шошго tx |
| ui/src/components/task-chat/TaskChatUsageReadout.tsx | T1; гар tx |
| ui/src/components/task-chat/completed-activity-summary.ts | T1; хураангуй өгүүлбэр гар tx |
| ui/src/components/task-chat/TaskChatRunnerTurn.tsx, TaskChatRunnerActivityGroup.tsx | T1; зөвшөөрлийн шийдвэр xoPermissionDecision (RunnerActivityGroup) |
| ui/src/components/TaskChatThread.tsx | T1; алдааны шошго, runner-ийн алдааны тайлбар ба тоо гар tx |
| ui/src/components/TaskChatThread.test.tsx | mn тест нэмсэн |
| ui/src/components/task-chat/TaskChatPlanPreviewCard.tsx | T1; гар tx |
| ui/src/components/task-chat/TaskChatPlanPreviewCard.test.tsx | mn тест нэмсэн |
| ui/src/components/task-chat/TaskChatThreadView.tsx | гар tx (T1-д ороогүй) |
| ui/src/components/task-chat/RichWorkProductCard.tsx, RunnerGoalWidget.tsx, TaskChatBubbleActions.tsx, TaskChatDescriptionBubble.tsx, TaskChatMarker.tsx, TaskChatPlanView.tsx, TaskChatProjectCreatedCard.tsx, TaskChatSystemNotice.tsx, TaskChatToolCard.tsx, TaskChatTurnStatusIsland.tsx, TaskMessageScroller.tsx, task-chat-adapter.ts | T1 |
| ui/src/components/IssueChatThread.tsx | T1; гар tx, XoTrans |
| ui/src/components/IssueChatThread.test.tsx | mn тест нэмсэн |
| ui/src/components/CommentThread.tsx | T1; гар tx |
| ui/src/lib/issue-chat-messages.test.ts | mn тест нэмсэн |
| ui/src/pages/IssueDetail.tsx | гар tx (ажиллагааг зогсоох шошго) |

XO-ийн өмч (upstream биш): ui/src/xo/time-ago.ts, ui/src/xo/run-text.ts, ui/src/xo/labels.ts (xoFileKindLabel, xoActivityLabel, MODE_DESCRIPTION, xoDateGroupLabel, xoColumnLabel, xoColumnDescription, xoPermissionDecision), scripts/xo-i18n/tiers.ts, ui/src/i18n/xo/* (en.json, mn.json, keep-en.json), docs/xo/glossary.md.

Шинэ XO-ийн тестүүд: ui/src/xo/time-ago.test.ts, ui/src/xo/run-text.test.ts, ui/src/xo/labels.test.ts (нэмэлт).

Үлдэгдэл: Ү6 7.2-д хэрэгжсэн (доорх "Ү6 7.2-д хөндсөн upstream файлууд" хэсэг); үлдсэн нь "Үлдэгдэл (Ү6 7.3)" жагсаалтад.

## Ү6 7.2-д хөндсөн upstream файлууд

T1 = scripts/xo-i18n/tiers.ts-ийн tier-1 жагсаалтад нэмсэн. "гар tx" = эх кодод tx()/XoTrans-аар ороосон. "helper" = ui/src/xo/labels.ts эсвэл ui/src/xo/date-format.ts-ийн функцээр render үед орчуулсан.

| Файл | Өөрчлөлт |
|---|---|
| ui/src/components/IssueChatThread.tsx | нэрийн fallback гар tx; humanizeValue → xoHumanizeValue; хэрэгслийн шошго xoToolDetailLabel; child.status xoStatusLabel |
| ui/src/components/IssueChatThread.test.tsx | mn тест нэмсэн (resolveIssueChatHumanAuthor) |
| ui/src/components/CommentThread.tsx | humanizeValue → xoHumanizeValue |
| ui/src/components/IssuesList.tsx | бүлгийн шошго xoIssueFilterLabel, progress title xoStatusLabel, үүсгэх шошго xoCreateIssueLabels |
| ui/src/components/IssueFiltersPopover.tsx | xoInboxFilterLabel, xoQuickFilterLabel, xoIssueFilterLabel |
| ui/src/components/IssueRow.tsx | T1 |
| ui/src/components/StatusIcon.tsx | саатлын тайлбар ба "Change status" гар tx |
| ui/src/components/StatusIcon.xo.test.tsx | mn/en тест нэмсэн |
| ui/src/components/task-side-panel/TaskSidePanel.tsx | T1; tab шошго xoSidePanelTabLabel; Revision ба алдаа гар tx |
| ui/src/components/task-side-panel/TaskSidePanel.test.tsx | mn тест нэмсэн |
| ui/src/lib/utils.ts | mn үед ui/src/xo/date-format.ts руу шилжүүлсэн (ICU-гүй) |
| ui/src/lib/utils.locale.test.ts | цаг/өдөр ба ICU-гүй spy тест нэмсэн |
| ui/src/components/issue-properties/IssuePropertiesPlansTab.tsx | mn огноо mnShortDateTime |
| ui/src/components/task-chat/TaskChatComposer.tsx | /goal ба хавсралтын алдаа гар tx |
| ui/src/components/task-chat/TaskChatQueuedMessages.tsx | steering title, мэдэгдэл, алдаа гар tx |
| ui/src/components/task-chat/TaskChatBlockerLinks.tsx | const шошго гар tx |
| ui/src/components/task-chat/TaskChatProtocolCard.tsx | файлын тоо, асуултын төлөв, runtime гарчиг гар tx |
| ui/src/components/task-chat/transcript-adapter.ts | Unnamed tool, Thought for гар tx |
| ui/src/components/task-chat/tool-taxonomy.ts | Unnamed tool гар tx |
| ui/src/components/TaskChatThread.test.tsx | mn retry тест нэмсэн (M-5) |
| ui/src/components/NewIssueDialog.tsx | For/in xoNewIssueInlineLabel (M-4; каталогийн түлхүүр "For (assignee)"/"in (project picker)", mn утга «Хэнд»/«төсөл»); алдаа ба агент хайлт гар tx |
| ui/src/components/NewIssueDialog.test.tsx | paused mn тест нэмсэн |
| ui/src/components/issue-properties/IssueProperties.tsx | ажлын талбарын мэдэгдэл гар tx |
| ui/src/lib/work-mode-meta.test.ts | ask en тест нэмсэн |

XO-ийн өмч (upstream биш): ui/src/xo/labels.ts (xoHumanizeValue, xoToolDetailLabel, xoIssueFilterLabel, xoQuickFilterLabel, xoInboxFilterLabel, xoCreateIssueLabels, xoSidePanelTabLabel, xoNewIssueInlineLabel), ui/src/xo/date-format.ts, scripts/xo-i18n/tiers.ts, ui/src/i18n/xo/*.

Шинэ XO-ийн тестүүд: ui/src/xo/date-format.test.ts, ui/src/i18n/xo/y6-7-2-keys.test.ts, scripts/xo-i18n/tiers-y6-7-2.test.ts, ui/src/components/task-chat/TaskChat.y6-7-2.xo.test.tsx, ui/src/xo/labels.test.ts (нэмэлт).

Үлдэгдэл (Ү6 7.3): хэрэгжсэн (доорх "Ү6 7.3-д хөндсөн upstream файлууд"). Үлдсэн жагсаалтын ихэнхийг Ү6 7.4 хаасан (доорх "Ү6 7.4-д хөндсөн upstream файлууд"); хаагдаагүй нь "Үлдэгдэл (Ү6 7.4)"-д:

- clipboard-ын `d.label === "Intent"` харьцуулалт (IssueChatThread.tsx:1637, lib/transcriptPresentation.ts:233 — тэр цэгт шошго англи, render үед xoToolDetailLabel орчуулдаг).
- dev-only T2 (TweakPanel, motion-tokens, task-chat-states, task-chat-fixtures, DesignGuide, TaskChatLab); LegacyIssuesList.
- mn-д цагийн бүсийн нэр (Codex/ClaudeSubscriptionPanel) ба UTC огноо (attention.ts:431) харагдахгүй.
- RunTranscriptView.tsx:881 "Unavailable source".
- ProjectWorkspaceDetail.tsx:693 `workspace.cwd ?? "None"` ба :704 repoUrl-ийн `: "None"` (tx-гүй).
- Intl.DateTimeFormat timeStyle дуудлагууд (RoutineOverview.tsx:33, SidebarServerInfo.tsx:13, SmokeLabDashboardCard.tsx:29, tools/SmokeLabTab.tsx:46) toLocale* хүрээнээс гадуур тул англиар үлдсэн.
- Pipelines.tsx:4168 formatShortDate, editable-sections.tsx:836 ба editable-sections.production.tsx:846 formatFireTime нь `new Intl.DateTimeFormat(undefined, …)` тул mn-д англи формат гарна.
- Pipelines.tsx:575-585 formatPipelineActivity: «just now / min ago / weeks ago» англи, 30 хоногоос дээш үед xoLocaleDate-ээр mn огноо гарч нэг баганад хоёр хэл холилдоно.
- ui/src/xo/date-format.ts:47 xoLocaleDateTime нь year-гүй богино options (month/day/hour/minute)-ыг mn-д үл хайхарч урт «2026 оны 9-р сарын 7 13:02» хэлбэр өгнө (xoLocaleDate нь mnShortDate руу шилждэг, mnShortDateTime ашиглагдаагүй). Хамаарах газрууд: SystemNotice.tsx:104, IssueRecoveryActionCard.tsx:790 ба 893, Claude/CodexSubscriptionPanel. Мөн weekday, timeZoneName, timeStyle medium/long-ийг mn зам үл хайхарна (operate-sections.tsx:213).
- Browser шалгалт (7.3 дараах, 7.3-аас өмнөх upstream файл, XO tier-т ороогүй): InteractionGovernancePanel.tsx (компанийн тохиргооны «Interaction governance»), pages/Secrets.tsx-ийн статик шошго («Secrets», «My secrets», «New secret» г.м.), IssueThreadInteractionCard.tsx.
- Browser шалгалт (T1 файл дахь JSX биш литерал): AgentActionButtons.tsx:55/163 «Run now» ба «Assign Task»/«Pause» prop-ийн анхдагч утга, MembershipAction.tsx:29 «Join»/«Leave», StatusBadge-ийн түүхий төлөв («idle», «succeeded»), AgentDetail.tsx:238 ба .production.tsx:226 run-ийн шалтгаан «Assignment», AgentDetail.tsx:4365 ба .production.tsx:4288 «Waiting for transcript...», ProviderTraceStatusBadge.tsx:52 «Trace off», агентын үүргийн шошго «General».

## Ү6 7.3-д хөндсөн upstream файлууд

T1 = scripts/xo-i18n/tiers.ts-ийн tier-1 жагсаалтад нэмсэн. "гар tx" = эх кодод tx()/XoTrans-аар ороосон. "helper" = ui/src/xo/labels.ts эсвэл ui/src/xo/date-format.ts-ийн функцээр render үед орчуулсан. "xoLocale*" = toLocale* дуудлагыг date-format.ts-ийн wrapper-аар сольсон (en дуудлага ижил).

| Файл | Өөрчлөлт |
|---|---|
| ui/src/components/AgentBubbleActionRow.tsx | «Helpful»/«Needs work» title ба aria-label гар tx |
| ui/src/components/AgentConfigForm.tsx | xoLocaleTime (mn үед H:MM:SS, доорх тэмдэглэл) |
| ui/src/components/AttentionQueueRow.tsx | xoLocaleDateTime; «Reappears», «soon», «in Nm/h/d» гар tx |
| ui/src/components/ClaudeSubscriptionPanel.tsx | xoLocaleDateTime; «Resets {{date}}» гар tx |
| ui/src/components/CodexSubscriptionPanel.tsx | xoLocaleDateTime; «Resets {{date}}» гар tx |
| ui/src/components/DecisionTriageStrip.tsx | xoLocaleDateTime; «Snoozed until» гар tx |
| ui/src/components/EmailMessageCard.tsx | xoLocaleDateTime |
| ui/src/components/IssueChatThread.tsx | «Helpful»/«Needs work» гар tx; clipboard-ын «Tool:/Args:/Result:» угтвар гар tx |
| ui/src/components/IssueRecoveryActionCard.tsx | xoLocaleDateTime; «in Nm»/«Nm ago» гар tx |
| ui/src/components/IssuesList.tsx | group-by шошго xoLabel |
| ui/src/components/OnboardingWizard.tsx | xoLocaleTime (mn үед H:MM:SS, доорх тэмдэглэл) |
| ui/src/components/OutputFeedbackButtons.tsx | «Helpful»/«Needs work» гар tx |
| ui/src/components/ProviderQuotaCard.tsx | xoLocaleDate; «resets {{date}}» гар tx |
| ui/src/components/ProviderTraceStatusBadge.tsx | xoLocaleDateTime; frames/bytes/expires, sensitive capture болон «capture was disabled» тайлбар гар tx |
| ui/src/components/RoutineActivityRow.tsx | xoLocaleTime |
| ui/src/components/RoutineList.tsx | xoLocaleDateTime; «Never» гар tx |
| ui/src/components/RoutineOverview.tsx | xoLocaleDateTime |
| ui/src/components/RoutineTriggerCard.tsx | xoLocaleDateTime; «Next: {{date}}» гар tx |
| ui/src/components/RunnerInspector.tsx | xoLocaleDateTime; frames/expires мөр, «Download exact trace»/«Delete trace» товч гар tx |
| ui/src/components/ScheduleEditor.tsx | xoLocaleDateTime; «Next: {{dates}}.» гар tx |
| ui/src/components/SourceResolvedFoldCallout.tsx | xoLocaleDateTime |
| ui/src/components/SourceTrustBadge.tsx | xoLocaleDateTime; low-trust тайлбар гар tx |
| ui/src/components/SystemNotice.tsx | xoLocaleDateTime |
| ui/src/components/TaskChatThread.tsx | interaction.title fallback «Questions» гар tx |
| ui/src/components/access/InvitesSection.tsx | xoLocaleDateTime |
| ui/src/components/issue-properties/IssueProperties.tsx | «None» гар tx (2 газар) |
| ui/src/components/routine-sections/editable-sections.tsx | xoLocaleDateTime |
| ui/src/components/routine-sections/editable-sections.production.tsx | xoLocaleDateTime (хос файл) |
| ui/src/components/routine-sections/operate-sections.tsx | xoLocaleDate; «Earlier» гар tx; subtitle xoRunRowSubtitle |
| ui/src/components/task-chat/TaskChatCompactInteractionCard.tsx | xoLocaleDateTime («Expires» огноо, 4 газар; олон мөрт `new Date(…).toLocaleString()` дуудлага) |
| ui/src/components/task-chat/TaskChatProtocolCard.tsx | RuntimeQuestionHistory-д export нэмсэн (mn тестэд хэрэгтэй; нэг түлхүүр үг); «Answer details…» ба «pending» гар tx |
| ui/src/components/task-chat/task-chat-adapter.ts | xoLocaleTime |
| ui/src/components/task-chat/TaskChat.y6-7-2.xo.test.tsx | mn тест нэмсэн (RuntimeQuestionHistory) |
| ui/src/components/task-side-panel/TaskDocumentPanel.tsx | xoLocaleDateTime; «Revision {{n}}», «Updated {{date}}» гар tx |
| ui/src/components/timeline/WorkTimelineChart.tsx | xoLocaleDate, xoLocaleTime (en-US тогтмол locale; mn-д 24 цаг) |
| ui/src/components/transcript/RunTranscriptView.tsx | T1; төлөвийн шошго («Executing command», «Completed», «Failed with exit code» г.м.) гар tx |
| ui/src/lib/attention.ts | xoLocaleDate (timeZone: "UTC" mn-д үйлчлэхгүй, доорх «Үлдсэн») |
| ui/src/lib/issue-change-receipt.ts | xoLocaleDateTime |
| ui/src/lib/utils.locale.test.ts | xoLocale* ба mnTime-ийн тест тохируулсан |
| ui/src/pages/AgentDetail.tsx | xoLocaleTime |
| ui/src/pages/AgentDetail.production.tsx | xoLocaleTime (хос файл) |
| ui/src/pages/ApprovalDetail.tsx | xoLocaleDateTime |
| ui/src/pages/CompanyAccess.tsx | xoLocaleDateTime |
| ui/src/pages/CompanyEnvironments.tsx | xoLocaleDateTime |
| ui/src/pages/DecisionQueuePage.tsx | desk shelf шошго xoLabel (attention.ts биш; render цэг энд) |
| ui/src/pages/Inbox.tsx | огнооны хуваагч xoDateGroupLabel |
| ui/src/pages/InstanceAccess.tsx | xoLocaleDate |
| ui/src/pages/InstanceExperimentalSettings.tsx | xoLocaleDateTime |
| ui/src/pages/JoinRequestQueue.tsx | xoLocaleDateTime; «Request details», «Submitted», «Source IP» гар tx |
| ui/src/pages/PipelineSettings.tsx | xoLocaleDateTime |
| ui/src/pages/Pipelines.tsx | xoLocaleDate, xoLocaleDateTime |
| ui/src/pages/PluginSettings.tsx | xoLocaleDateTime, xoLocaleTime; «Last checked» гар tx |
| ui/src/pages/ProjectWorkspaceDetail.tsx | xoLocaleDateTime; «Default ref», «Updated», «None» гар tx |
| ui/src/pages/Secrets.tsx | xoLocaleDate, xoLocaleDateTime; «Ns/Nm/Nh/Nd ago» гар tx |
| ui/src/pages/StatusCards/ArchivedStatusCardRow.tsx | xoLocaleDate |
| ui/src/pages/Timeline.tsx | xoLocaleDateTime; run/runs олон тоо, «to», «window capped» гар tx |
| ui/src/pages/WhatNeedsMe.tsx | desk shelf шошго xoLabel (attention.ts биш; render цэг энд) |
| ui/src/pages/apps/chat/EmailEndpointSetup.tsx | xoLocaleDateTime; «Last mail check», «Not checked yet» гар tx |
| ui/src/pages/audit/AuditFeed.tsx | xoLocaleDateTime |
| ui/src/pages/audit/AuditFeed.production.tsx | xoLocaleDateTime (хос файл) |
| ui/src/pages/secrets/ImportFromVaultDialog.tsx | xoLocaleDate; «Ns/Nm/Nh/Nd ago» гар tx |
| ui/src/pages/tools/shared.tsx | xoLocaleDateTime |
| ui/src/components/SwipeToArchive.tsx | swipe арын «Archive» шошго гар tx (browser шалгалтаар илэрсэн) |
| ui/src/components/NewIssueDialog.tsx | «Хэнд» шошгоны багана mn үед w-9, en үед w-6 хэвээр (localeTag; mn текст 34px, w-6 нь 24px) |

Хазайлт ба тэмдэглэл (хэрэгжүүлэлтийн явцад гарсан):
- Desk shelf шошгыг attention.ts-д биш render цэг болох WhatNeedsMe.tsx ба DecisionQueuePage.tsx-д орчуулсан (xoLabel); энэ хоёр файл анхны планд байгаагүй.
- TaskChatProtocolCard.tsx-д RuntimeQuestionHistory-г export болгосон (upstream файлд нэг түлхүүр үг); mn тест шууд render хийхэд хэрэгтэй.
- ui/src/i18n/xo/keep-en.json-д "Markdown" нэмсэн (файлын төрлийн шошго mn-д ч Markdown хэвээр).
- mn xoLocaleTime нь options-д hour/minute/second/timeStyle аль нь ч байхгүй үед секундтэй гаргана (en-ий toLocaleTimeString-тай адил). Үр дүнд OnboardingWizard, AgentConfigForm-ийн холболт шалгасан цаг, мөн PluginSettings.tsx:425/460, AgentDetail.tsx:638/4447, AgentDetail.production.tsx:637/4370 дахь цаг mn-д H:MM:SS болсон (en-тэй адил зан төлөв).

XO-ийн өмч (upstream биш): ui/src/xo/date-format.ts (mnTime, xoLocaleDateTime, xoLocaleDate, xoLocaleTime), ui/src/xo/labels.ts (xoRunRowSubtitle, xoLabel нэмэлт, xoFileKindLabel Markdown), scripts/xo-i18n/tiers.ts (RunTranscriptView T1), ui/src/i18n/xo/* (en.json, mn.json, keep-en.json).

Шинэ XO-ийн тестүүд: ui/src/xo/date-format.test.ts (нэмэлт), ui/src/i18n/xo/y6-7-3-keys.test.ts, scripts/xo-i18n/tiers-y6-7-3.test.ts, ui/src/xo/labels.test.ts (нэмэлт).

## Ү6 7.5-д хөндсөн upstream файлууд

7.4-ийн «Үлдэгдэл»-ийн interaction самбар ба card, Secrets хуудас, агентын зүүн цэс, Audit хэсгийг хаасан. tiers.ts-д 8 файл T1 болж нэмэгдсэн. Тэмдэглэгээ 7.3-ын хүснэгттэй ижил; «XoTrans» = текст дундаа `<span>`-тай JSX-ийг XoTrans-аар ороосон.

| Файл | Өөрчлөлт |
|---|---|
| ui/src/components/AgentActionButtons.tsx | toast («Action failed», «Agent duplicated», «Could not duplicate agent»), алдааны fallback, duplicate баталгаажуулалт «Duplicate {{name}} as {{nextName}}?» гар tx |
| ui/src/components/AgentContextualSidebar.tsx | T1; бүлгийн гарчиг ба цэсний зүйл xoNavLabel; «Secrets & variables», «Agent», aria «{{name}} navigation» гар tx |
| ui/src/components/InteractionGovernancePanel.tsx | T1; policy шошго ба нөлөө xoResolverPolicyLabel/xoResolverPolicyEffect, kind xoInteractionKindLabel; тайлбарын догол XoTrans; aria ба mobile шошго гар tx |
| ui/src/components/IssueThreadInteractionCard.tsx | T1; manual засвар: олон тооны салаа тусдаа литерал, гар tx (≈78 дуудлага); «Connected/Withdrawn/Resolved by <b>{{who}}</b>» XoTrans; verdict xoVerdictLabel, kind xoInteractionKindLabel, төлөв xoStatusLabel |
| ui/src/components/PageTabBar.tsx | aria «Page section» гар tx |
| ui/src/lib/interaction-audience.ts | resolverPolicyLabel/Effect-ийг helper-ээр; audience өгүүлбэр, midSentence «you», «the addressed user/agent» гар tx; template literal → tx interpolation |
| ui/src/pages/AgentDetail.tsx | agentTabLabel (Dashboard/Configuration/Budget гар tx, бусад xoNavLabel): breadcrumb ба табын шошго; «Action failed» гар tx |
| ui/src/pages/AgentDetail.production.tsx | breadcrumb, гарчиг (h2) ба production табын шошго xoNavLabel; «Action failed» гар tx (хос файлын засвар өөр: production нь навигацийн бүтэц өөр) |
| ui/src/pages/CompanySettings.tsx | «Failed to save interaction governance» гар tx |
| ui/src/pages/ProjectWorkspaceDetail.tsx | T1; sourceTypeText helper (эх төрлийн шошго ба тайлбар; брэндийн тайлбар «{{brand}}» placeholder-тэй, брэнд literal давхардуулахгүй); баталгаажуулалт, toast, hint, хоосон төлөвийн текст гар tx |
| ui/src/pages/Secrets.tsx | T1; manual засвар, гар tx (≈58 дуудлага); 8 XoTrans (жишээ «Removes <b>{{name}}</b> from Paperclip only.»); статус xoStatusLabel |
| ui/src/pages/audit/AuditHub.tsx | T1; табын шошго ба breadcrumb xoNavLabel |
| ui/src/pages/audit/AuditRuns.tsx | T1; үргэлжлэх хугацаа «{{seconds}}s», «{{minutes}}m {{seconds}}s», «Routine run», «{{source}} run» гар tx; эх сурвалж xoRunSourceLabel |
| ui/src/pages/audit/CompanyActivity.tsx | T1 (эх код өөрчлөгдөөгүй) |

XO-ийн өмч: ui/src/xo/labels.ts (xoResolverPolicyLabel, xoResolverPolicyEffect, xoInteractionKindLabel, xoVerdictLabel, xoNavLabel), scripts/xo-i18n/tiers.ts (8 файл T1), ui/src/i18n/xo/* (keys=3237, +621; keep-en.json-д workspace commands JSON жишээ, «MY_SECRET», «PERSONAL_GH_TOKEN», «API ·», «Env ·», хувилбарын «v{{…}}» хэлбэрүүд, shell командууд).

Шинэ XO-ийн тестүүд: ui/src/i18n/xo/y6-7-5-keys.test.ts, scripts/xo-i18n/tiers-y6-7-5.test.ts, ui/src/xo/labels.test.ts (нэмэлт).

Үлдэгдэл (Ү6 7.5): Ү6 7.6 — pages/secrets/* дэд файлууд (ImportFromVaultDialog, proposal-review, UserSecretDefinitionsTab, SetMyUserSecretDialog, MyUserSecretsTab, ProposalsTab, MissingUserSecretsBanner, secret-path, user-secret-presentation), TaskChatCompactInteractionCard ба InteractionAudienceLine-ийн өөрийн текст, AttentionQueueRow. Хүлээн зөвшөөрсөн (7.4-өөс): «Intent» харьцуулалт; dev-only T2; LegacyIssuesList; mn-д цагийн бүсийн нэр ба гараг; үүргийн орчуулгыг ED шалгана.
- IssueThreadInteractionCard нь proposal-review.tsx-ийн «Reason given by the agent»-ийг рендерлэдэг тул card дотор тэр хэсэг 7.6 хүртэл англиар үлдэнэ.
- Secrets.tsx-ийн XoTrans түлхүүр «Removes <b>{{name}}</b> from Paperclip only.» брэнд literal агуулна (en render тест шаарддаг). xo:brand-scan baseline 586/161-ээс өсөхгүй эсэхийг 7.5-ын gates шалгана.
- Secrets.tsx: parentLabel !== tx("All secrets") харьцуулалт mn-д «Бүх нууц утга» нэртэй хэрэглэгчийн хавтсыг нууна (edge case); «1 candidate from», «1 sampled secret» фрагментийн үгийн дараалал эмзэг.
- IssueThreadInteractionCard: «on {{date}}» → «огноо: {{date}}» хоёр цэгтэй хэлбэр.
- interaction-audience.ts: midSentence нь «You» шошгыг англиар харьцуулдаг (одоогоор зөв, шошго өөрчлөгдвөл эмзэг); «удирдах зөвлөл» жижиг/том үсэг T1 ба гар tx-д зөрнө.
- T1 модулийн түвшний объект (`{ label: "…" }`) импортын үед нэг удаа үнэлэгдэнэ; locale солиход хуудас дахин ачаалагддаг тул практикт зөрөхгүй.
- Browser (7.5 дараах): нууц утгын хуудсын «Folders» / «Flat» товч 7.5-ын хүрээнд ороогүй (засвар 7.6: энэ товч pages/Secrets.tsx-д байдаг, FolderControls.tsx-д биш); байгууллагын тохиргооны доод хэсэг (Deployment and auth, Backup retention, AI feedback sharing, Sign out) инстанцын ерөнхий тохиргооны компонентоос ирдэг тул англиар үлдэнэ. Ү6 7.6-д.
- Эцсийн review (Minor): «interaction governance» нэг газар «засаглалын бодлого», бусад газар «удирдлага» гэж орчуулагдсан; mn утгад «runtime тохиргоо» англи үг үлдсэн. Ү6 7.6-д каталогт нэг мөрөөр засна.
- y6-7-5-keys тест mn утгыг зөвхөн en-ээс ялгаатай эсэхээр шалгана; зарим mn утга товчлол/калька («… амжилтгүй», «Нэр дэвшигч 1, эх:»).

## Ү6 7.6-д хөндсөн upstream файлууд

7.5-ын «Үлдэгдэл»-ийн pages/secrets/* дэд файлууд, хавтасны удирдлага, compact interaction card, AttentionQueueRow, инстанцын ерөнхий тохиргоог хаасан. tiers.ts-д 10 файл T1 болж нэмэгдсэн. Тэмдэглэгээ 7.5-ын хүснэгттэй ижил. BASE abbe3f85f.

| Файл | Өөрчлөлт |
|---|---|
| ui/src/components/folders/FolderControls.tsx | T1; хавтасны тоо xoFolderItemLabel; «Unfiled» → «Ангилаагүй»; хавтас устгах dialog гар tx |
| ui/src/pages/Secrets.tsx | «Folders» / «Flat» товч гар tx (mn «Хавтсаар / Жагсаалтаар») |
| ui/src/pages/secrets/SetMyUserSecretDialog.tsx | T1; шошго, баталгаажуулалт, toast гар tx |
| ui/src/pages/secrets/MyUserSecretsTab.tsx | T1; хүснэгтийн толгой, хоосон төлөв, үйлдлийн текст гар tx |
| ui/src/pages/secrets/MissingUserSecretsBanner.tsx | T1; анхааруулгын өгүүлбэр гар tx |
| ui/src/pages/secrets/secret-path.ts | замын шалгалтын алдааны мессеж гар tx |
| ui/src/pages/secrets/user-secret-presentation.tsx | төлөв ба тайлбарын шошго гар tx |
| ui/src/pages/secrets/ImportFromVaultDialog.tsx | T1; validation, төлөв, үр дүнгийн текст гар tx; «A Paperclip secret…»-ийн mn утга «XO системийн…» literal (компонент брэндийн хувьсагч дамжуулдаггүй, «{{brand}}» parity тестийг эвдсэн) |
| ui/src/pages/secrets/proposal-review.tsx | T1; «Reason given by the agent» г.м. шошго гар tx; холимог markup XoTrans; «by» → «санал гаргасан:» |
| ui/src/pages/secrets/ProposalsTab.tsx | T1; хүснэгт, шүүлтүүр, toast гар tx; XoTrans |
| ui/src/pages/secrets/UserSecretDefinitionsTab.tsx | T1; гар tx; XoTrans |
| ui/src/pages/InstanceGeneralSettings.tsx | T1; «Paperclip Labs» «{{vendor}}» хувьсагчаар дамжина; topicSummary холбох үгс орчуулагдсан; dev тэмдэглэл keep-en.json-д |
| ui/src/components/TaskChatCompactInteractionCard.tsx | kind xoCompactKindLabel; шийдвэрийн шошго гар tx |
| ui/src/components/AttentionQueueRow.tsx | T1; эх сурвалж xoAttentionSourceLabel; SNOOZE_PRESETS (L76-81) xoSnoozePresetLabel, модулийн түвшний tx() |

XO-ийн өмч: ui/src/xo/labels.ts (xoAttentionSourceLabel, xoSnoozePresetLabel, xoFolderItemLabel, xoCompactKindLabel), scripts/xo-i18n/tiers.ts (10 файл T1), ui/src/i18n/xo/* (keys=3521, +284).

Шинэ XO-ийн тестүүд: ui/src/i18n/xo/y6-7-6-keys.test.ts, scripts/xo-i18n/tiers-y6-7-6.test.ts, ui/src/xo/labels.test.ts (нэмэлт).

Нэр томьёо (7.6-аас нэгдсэн): proposal = санал, secret = нууц утга, folder = хавтас, unfiled = ангилаагүй, runtime config = ажиллах орчны тохиргоо. 7.5-ын Minor («удирдлага» / «засаглалын бодлого» зөрүү, «runtime тохиргоо») 372a9edb7-д каталогт засагдсан.

Үлдэгдэл (Ү6 7.6):
- Англиар үлдсэн (хүрээнээс гадуур): SkillFolderTree.tsx ба reservedRootLabel (7.9-д); ModeBadge.tsx («Local trusted» / «Authenticated …») — хэрэгжсэн (Ү6 7.7); MyUserSecretsTab ба UserSecretDefinitionsTab дахь {definition.status} enum — хэрэгжсэн (Ү6 7.7, xoStatusLabel).
- Ү6 7.7-д шилжүүлсэн: issue-thread-interactions summary, interaction-resolution-error — хэрэгжсэн (Ү6 7.7).
- «by» одоо ерөнхий каталогийн түлхүүр («санал гаргасан:»); өөр газар дахин ашиглавал утга буруу гарна.
- en түлхүүр «Could not approved / rejected / sent for revision» upstream-ийн дүрмийн алдааг хадгална; en гаралт байт ижил байхын тулд засаагүй.
- AttentionQueueRow.tsx-ийн SNOOZE_PRESETS (L76-81) модулийн түвшинд tx() дууддаг. i18n синхрон эхэлдэг, locale солиход хуудас дахин ачаалагддаг тул хүлээн зөвшөөрсөн.
- Browser шалгалт (3110, mn, 2026-10-13): нууц утгын 4 таб (Нууц утгууд / Миний нууц утгууд / Нийлүүлэгчийн сангууд / Саналууд), «Хавтсаар / Жагсаалтаар» товч, хоосон төлөвүүд Монгол. Инстанцын тохиргоо (байгууллагын тохиргоонд embedded) Монгол; «Paperclip Labs» нэр, dev тэмдэглэл, «Local trusted» (ModeBadge) шийдвэрийн дагуу англиар. /decisions дээр AttentionQueueRow-ийн эх сурвалжийн шошго («Шийдвэр хүссэн») ба snooze сонголт (Өнөөдөр / Энэ долоо хоногт / Хэзээ ч болно) Монгол. Хүрээнээс гадуур англиар үлдсэн (7.7-д): WhatNeedsMe шүүлтүүр («N decisions», All/Today/Yesterday…), DecisionTriageStrip («Pick date», «Snooze», «Queue», «Ask agent for recommendation»), lib/attention.ts («N questions — …») — хэрэгжсэн (Ү6 7.7); Routines.tsx ба Skills хуудас («New folder» нь Routines.tsx:961-ээс) — 7.8 / 7.9-д. FolderControls-ын хавтасны rail ба compact interaction card-ыг өгөгдөлгүйгээс browser-т харуулж чадаагүй; unit тестээр баталгаажсан.

## Ү6 7.7-д хөндсөн upstream файлууд

7.6-ын «Үлдэгдэл»-ийн шийдвэрийн хэсэг (/decisions), ModeBadge, нууц утгын status enum, interaction хураангуй ба resolution алдааг хаасан. tiers.ts-д 6 файл T1 болж нэмэгдсэн. Тэмдэглэгээ 7.5-ын хүснэгттэй ижил. BASE 9b7bb9c30. ED шийдвэр: Х1 7.7 = шийдвэрийн хэсэг ба жижиг үлдэгдэл, Routines 7.8-д, Skills 7.9-д; Х2 Routines/Skills-д зөвхөн Streamlined хувилбар; Х3 buildAnsweredQuestionsDeliveryText англиар.

| Файл | Өөрчлөлт |
|---|---|
| ui/src/components/DecisionsToolbar.tsx | T1; тоо «{{count}} decision(s)» хоёр литерал tx; SEVERITY_LABELS, огноо/group/sort шошго render үед xoDecisionOptionLabel; эх сурвалж xoAttentionSourceLabel |
| ui/src/components/DecisionDateChips.tsx | T1; огнооны chip шошго xoDecisionOptionLabel |
| ui/src/components/DecisionQueueRail.tsx | T1 (эх код өөрчлөгдөөгүй, зөвхөн tiers.ts-д) |
| ui/src/components/DecisionTriageStrip.tsx | T1; «Expires in {{mins}}m/h/d» гар tx; `Could not ${verb}` → дуудах газар бүрт бүтэн литерал; «Asked {{name}} for a recommendation»; SNOOZE_PRESETS xoSnoozePresetLabel; decide-by шошго xoDecisionOptionLabel; агент руу илгээх comment body англиар |
| ui/src/pages/DecisionQueuePage.tsx | T1; «Auto-seeding is on / off» тусдаа литерал (manual 0); бусад текст T1-ээр |
| ui/src/components/DecisionShelf.tsx | T1; curtain шошго `${xoLabel(label)} (${count})` |
| ui/src/lib/attention.ts | гар tx (T1 биш): тоо (question/option/suggested task/item to verdict) ганц ба олон тооны литерал, «Blocked by …», төсвийн «{{percent}}% of budget used …»; модулийн тогтмолууд хөндөгдөөгүй |
| ui/src/components/access/ModeBadge.tsx | «Local trusted», «Authenticated private / public» бүтэн литерал, бусад exposure «Authenticated {{exposure}}» |
| ui/src/pages/secrets/MyUserSecretsTab.tsx | {definition.status} → xoStatusLabel |
| ui/src/pages/secrets/UserSecretDefinitionsTab.tsx | {definition.status} → xoStatusLabel |
| ui/src/lib/issue-thread-interactions.ts | interaction хураангуй (decided, verdict, task, confirmation, selection, connect, question) гар tx; buildAnsweredQuestionsDeliveryText хөндөгдөөгүй (Х3) |
| ui/src/lib/interaction-resolution-error.ts | audience-denial, «no longer waiting», «{{reason}} Try again.» гар tx; серверийн мессеж тааруулах код хөндөгдөөгүй |

XO-ийн өмч: ui/src/xo/labels.ts (xoDecisionOptionLabel шинэ; xoSnoozePresetLabel-д «Tomorrow»), scripts/xo-i18n/tiers.ts (6 файл T1), ui/src/i18n/xo/* (keys=3647, +126).

Шинэ XO-ийн тестүүд: ui/src/i18n/xo/y6-7-7-keys.test.ts, scripts/xo-i18n/tiers-y6-7-7.test.ts, ui/src/xo/labels.test.ts (нэмэлт).

Үлдэгдэл (Ү6 7.7):
- Routines.tsx (Routines хуудас, «New folder» Routines.tsx:961) — хэрэгжсэн (Ү6 7.8, Streamlined).
- Skills хуудас, SkillFolderTree.tsx, reservedRootLabel → Ү6 7.9.
- *.production.tsx хувилбарууд англиар үлдэнэ; 7.8/7.9-д зөвхөн Streamlined хувилбарыг орчуулна (ED шийдвэр Х2).
- buildAnsweredQuestionsDeliveryText англиар үлдэнэ: загварт очих текст (ED шийдвэр Х3).
- DecisionTriageStrip-ээс агент руу чиглүүлэх comment body англиар үлдэнэ: агентад очих текст.
- Browser шалгалт (3110, mn, 2026-10-13, ED-ийн зөвшөөрлөөр restart): /YB/decisions дээр «N шийдвэр», шүүлтүүрийн chip (Бүгд / Өнөөдөр / Өчигдөр / Сүүлийн 7 хоног / Энэ сар / Өөрөө сонгох), shelf (Өмнөх / Шийдвэрлэсэн / Хугацаа дууссан), «Дарааллаас хасах: …» Монгол. Дарааллын хуудас (/decisions/queues/questions): «Автомат нэмэлт асаалттай», тайлбар, «Идэвхгүй болгох», «Хасах» Монгол. ModeBadge «Локал итгэмжлэгдсэн». Нууц утгын хуудас Монгол; seed-д нууц утга байхгүй тул төлвийн шошгыг unit тестээр баталсан. Англиар үлдсэн (UI хүрээнээс гадуур): дарааллын гарчиг, тайлбар, дүрмийн бичвэр («Questions», «Structured questions waiting for a board response.», «Pending ask_user_questions interactions.») серверийн автомат seed өгөгдөл; «Questions need answers» server/src/services/attention.ts:667-оос; Secrets.tsx-ийн гар утасны select-д «proposals» option (PageTabBar JSX шошготой үед value-г харуулдаг, 7.6-аас үлдсэн).

## Ү6 7.8-д хөндсөн upstream файлууд

7.7-ын «Үлдэгдэл»-ийн Routines хэсгийг (Streamlined хувилбар) хаасан: жагсаалт (/YB/routines), дэлгэрэнгүй (overview, triggers, schedule, variables, secrets, delivery, runs, activity, history), хуваарь засварлагч, хувьсагч, хадгалах самбар, хувилбарын түүх, cron тайлбар ба галлагааны урьдчилсан харагдац. tiers.ts-д 16 файл T1 болж нэмэгдсэн. Тэмдэглэгээ 7.5-ын хүснэгттэй ижил. BASE 83326f71b. ED шийдвэр: Х1 зөвхөн Streamlined хувилбар (*.production.tsx үлдэгдэлд); Х2 загвар/агентад очих текст (routine prompt, comment body) англиар; Х3 серверийн мессеж хүрээнээс гадуур. Нэр томьёо: trigger «идэвхжүүлэгч», delivery «хүргэлт», signing mode «гарын үсгийн горим», catch-up «нөхөн ажиллуулалт», concurrency / catch-up policy «зэрэгцээ ажиллагааны / нөхөн ажиллуулах бодлого», activity gate «идэвхжилийн нөхцөл», version history «хувилбарын түүх», cron англиар.

| Файл | Өөрчлөлт |
|---|---|
| ui/src/pages/Routines.tsx | T1; хавтас руу зөөх toast «Moved "{{title}}" to {{folder}}.» ба хавтасны нэргүй үеийн тусдаа литерал |
| ui/src/components/RoutineList.tsx | T1 (эх код өөрчлөгдөөгүй, зөвхөн tiers.ts-д) |
| ui/src/components/RoutineContextualSidebar.tsx | T1; гарчгийн fallback tx("Routine") |
| ui/src/components/ManagedRoutinesList.tsx | T1; «Missing {{refs}}» гар tx |
| ui/src/pages/audit/RoutineAuditActivity.tsx | T1 (эх код өөрчлөгдөөгүй, зөвхөн tiers.ts-д) |
| ui/src/pages/RoutineDetail.tsx | T1; хэсгийн гарчиг xoRoutineSectionLabel; webhook URL / secret хуулах toast (амжилт, алдаа) бүтэн литерал, бусад label англи template хэвээр |
| ui/src/components/RoutineSaveBar.tsx | T1; хадгалаагүй талбарын шошго xoRoutineDirtyFieldLabel |
| ui/src/components/RoutineSubSidebar.tsx | T1 (эх код өөрчлөгдөөгүй; NAV_GROUPS key={group.label} орчуулсан ч давтагдахгүй) |
| ui/src/components/RoutineOverview.tsx | T1 (эх код өөрчлөгдөөгүй, зөвхөн tiers.ts-д) |
| ui/src/components/routine-sections/editable-sections.tsx | T1; trigger kind xoTriggerKindLabel, signing mode xoSigningModeLabel, signingModeDescriptions Record → xoSigningModeDescription; галлагааны disposition xoFireDispositionLabel; «{{placeholder(s)}}» литерал хаалт PLACEHOLDER_TOKEN / PlaceholdersCode-оор interpolation-оос гадуур; хувьсагч ба нууц утгын тайлбар XoTrans (PAPERCLIP_* values-аар) |
| ui/src/components/RoutineTriggerCard.tsx | T1; aria-label «Trigger: {{name}}», trigger kind xoTriggerKindLabel, signing mode xoSigningModeLabel |
| ui/src/components/ScheduleEditor.tsx | T1; HOURS модулийн шошгыг хассан, render үед xoHourLabel: en 12 цаг (байт ижил), mn 24 цаг «00»–«23» (padStart); locale салаалалт (каталогийн parity тест placeholder зөрүүг хориглодог) |
| ui/src/components/RoutineHistoryTab.tsx | T1; талбарын шошго xoRoutineDirtyFieldLabel / xoRoutineHistoryFieldLabel; «Show {{n}} older…», «Saved {{time}} by {{actor}}», actor (board/agent/system), «Unassigned», «No project», «(none)», жагсаалтын холбоос «{{first}} and {{second}}» / «{{items}}, and {{last}}»; env diff (key/keys, secret ref/refs, added/removed/changed) ганц ба олон тооны тусдаа литерал; «Env …», «Trigger …» талбар, enabled/disabled гар tx |
| ui/src/components/routine-sections/operate-sections.tsx | T1; ажиллагааны гарчгийн fallback tx("Run") |
| ui/src/components/RoutineVariablesEditor.tsx | T1; «{{name}}», «{{variable_name}}» литерал хаалттай өгүүлбэр XoTrans components-оор; тусламжийн цонхонд «Paperclip detects» → «{{brand}} detects» (T1 брэнд дүрэм, en гаралт «XO detects» болсон) |
| ui/src/components/RoutineRunVariablesDialog.tsx | T1; InlineEntitySelector searchPlaceholder / emptyMessage (агент, төсөл) гар tx |
| ui/src/lib/cron-readable.ts | гар tx (T1 биш): өгүүлбэр бүр цагтайгаа бүтэн литерал (Every day / weekday / weekend / {{day}} / {{days}} and {{last}} at {{time}}, Every {{n}} minutes, Every {{n}} hours at :{{mm}}, Every hour at :{{mm}}, Day {{n}} of every month at {{time}}); гарагийн нэр xoWeekdayName |
| ui/src/lib/cron-fires.ts | гар tx (T1 биш): disposition тэмдэглэл «runs immediately», «if the previous run is still active»; throw new Error мессеж ба Intl.DateTimeFormat("en-US") хөндөгдөөгүй |

XO-ийн өмч: ui/src/xo/labels.ts (xoRoutineSectionLabel, xoTriggerKindLabel, xoSigningModeLabel, xoSigningModeDescription, xoFireDispositionLabel, xoWeekdayName, xoRoutineDirtyFieldLabel, xoRoutineHistoryFieldLabel шинэ), scripts/xo-i18n/tiers.ts (16 файл T1), ui/src/i18n/xo/* (keys=4044, +397; keep-en.json-д «API», «URL», «high, medium, low»).

Шинэ XO-ийн тестүүд: ui/src/i18n/xo/y6-7-8-keys.test.ts, scripts/xo-i18n/tiers-y6-7-8.test.ts, ui/src/xo/labels.test.ts (нэмэлт).

Үлдэгдэл (Ү6 7.8):
- *.production.tsx гурван хувилбар англиар үлдэнэ (ED шийдвэр Х1).
- ExecutionWorkspaceDetail-ийн routines таб, BuiltInBundlePanel, PipelineSettings хүрээнээс гадуур, англиар.
- Routine prompt, агентад очих текст англиар үлдэнэ (ED шийдвэр Х2).
- lib/cron-fires.ts-ийн throw new Error мессеж англиар: catch {}-д залгигдаж UI-д харагддаггүй.
- Серверээс ирэх мессеж (toast-ийн error.message) англиар үлдэнэ (ED шийдвэр Х3).
- Skills хуудас, SkillFolderTree.tsx, reservedRootLabel → Ү6 7.9.
- Routine run.source / run.status badge ба шүүлтүүрийн «any» англиар; xoStatusLabel-д routine-ийн төлөв байхгүй.
- Routines.tsx-ийн breadcrumb «Recent Runs» (createIssueDetailLocationState-ийн аргумент) англиар.
- InlineEntitySelector-ийн searchPlaceholder / emptyMessage бусад газарт (CommentThread, IssueProperties, RepositoryEditor, ConnectionSetupFlow) англиар.
- Техникийн утгууд «plain (set)», «secret_ref → …», «latest», «replay Ns» англиар.
- relativeTime() mn-д англиар гарвал «Saved … by …» өгүүлбэрт хоёр хэл холилдоно.
- RoutineVariablesEditor-ийн тусламжийн цонхонд en гаралт «Paperclip detects» → «XO detects» болсон (T1 брэнд дүрэм); en байт ижил байх зарчмаас ухамсартай гажсан.
- Browser шалгалт (2026-10-14, 3110, restart хийгээгүй, HMR): туршилтын «Туршилт 7.8» routine үүсгэж, хуваарийн идэвхжүүлэгч нэмэв. mn: жагсаалт, үүсгэх цонх («Агент: / төсөл: / хавтас:»), triggers (cron тайлбар «Өдөр бүр 10:00 цагт», цаг 00–23), overview, variables («{{placeholder}}» хаалт зөв), delivery (бодлого, «Дараагийн 5 идэвхжилт», «нэгтгэгдэнэ / дараалалд орно»), history («хув. N», талбарын шошго) Монголоор гарсан. en: triggers (12 цаг AM/PM), delivery англи хэвээр. Англиар үлдсэн (үлдэгдэл): толгойн «Draft» төлөвийн тэмдэг; RoutineOverview L178 «No runs yet» (JSX attribute доторх ternary, T1 барьдаггүй); secrets хэсгийн орчны хувьсагчийн засварлагч («No environment variables», «Add variable»); history-ийн enum утгууд (medium, paused, coalesce if active, skip missed, SCHEDULE); серверийн өгөгдөл: идэвхжүүлэгчийн анхдагч label «schedule», changeSummary, activity event нэрс.

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
