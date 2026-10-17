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
6в. Upstream шинэ `startsWith("PAPERCLIP_")` шүүлтүүр эсвэл `".paperclip"` гэрийн замыг нэмсэн эсэхийг шалга: `git diff <өмнөх-tag>..<шинэ-tag> | grep -n 'startsWith("PAPERCLIP_")\|homedir(), ".paperclip"'`. Олдвол isBrandRuntimeEnvKey / resolveDefaultBrandHomeDir руу шилжүүл. Мөн шинэ `".paperclip-worktrees"` литерал → `resolveDefaultBrandWorktreesDir()`; schema-ийн шинэ `"~/.paperclip/instances/default/` анхдагч → `"~/.xo/instances/default/`.
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

## Ү6 7.11-д хөндсөн upstream файлууд

7.10-ын «Үлдэгдэл»-ийг хаасан. Тэмдэглэгээ 7.5-ын хүснэгттэй ижил. BASE d36e28452. ED шийдвэр (2026-10-14): Х1 Activity-д зөвхөн хэрэглэгчид харагдах action орчуулна, дотоод action англи fallback; Х2 серверийн changeSummary / editableReason / «Plan approval - {title}» → labels.ts helper; Х3 брэнд baseline-д labels.ts 3 → 4 (ED зөвшөөрсөн).

| Файл | Өөрчлөлт |
|---|---|
| ui/src/features/connections/ConnectionSetupFlow.tsx | T1; connectionStepLabel(), genericAuthModeHint() switch, XoTrans, {{brand}}; «Install Paperclip» түлхүүр GitHub-ийн алдаатай тааруулахаар литерал хэвээр |
| ui/src/components/IssuePlanDecompositionsSection.tsx | T1 |
| ui/src/components/ActiveAgentsPanel.tsx | T1; title / emptyMessage анхдагч утга render үед tx |
| ui/src/components/ActivityCharts.tsx | T1; priorityLabel() |
| ui/src/components/SmokeLabDashboardCard.tsx | T1; healthLabel() |
| ui/src/components/ActivityRow.tsx | T1; System / Board / Unknown actor tx |
| ui/src/pages/audit/AuditFeed.tsx | T1; actionDomainLabel, entityTypeLabel, userProfileLabel |
| ui/src/pages/tools/AuditTab.tsx | T1; outcomeLabel, windowLabel, XoTrans 4 өгүүлбэр |
| ui/src/components/IssueRunLedger.tsx | T1; модулийн хүснэгтийг render-үеийн функц болгосон; сервер рүү илгээх reason ба throw Error англиар |
| ui/src/components/CommentAttributionChip.tsx | T1 |
| ui/src/lib/activity-format.ts | XO_ACTIVITY_ROW_VERBS (176 action), xoActivityRowVerb guard (en-д fallback) |
| ui/src/lib/recovery-display.ts | recoveryChipLabel tx (6 шошго) |
| ui/src/lib/pipeline-item-detail.ts | system actor mn-д BRAND.name, en-д «Paperclip» |
| ui/src/pages/InstanceExperimentalSettings.tsx | footnote / aria-label гар tx (31); брэндтэй 2 aria-label locale guard |
| ui/src/pages/DashboardLive.tsx | emptyMessage tx |
| ui/src/components/BootstrapPendingPage.tsx | <link> tag → <anchor> (react-i18next-д link нь void элемент) |
| RoutineHistoryTab, CompanySkills, SkillStudio, AttentionQueueRow, DecisionShelf, WhatNeedsMe, DecisionQueuePage | серверийн шошгыг labels.ts helper-ээр буулгасан |

Хөндөгдөөгүй: серверийн код, *.production.tsx.

XO-ийн өмч: ui/src/xo/labels.ts (xoRoutineChangeSummary, xoSkillEditableReason, xoAttentionTitle), scripts/xo-i18n/tiers.ts (+10 файл T1), scripts/xo-brand/baseline.json (labels.ts 3 → 4; скан 566 / 161), ui/src/i18n/xo/* (keys=5894, +654; keep-en.json +4).

XO-ийн тестүүд: scripts/xo-i18n/tiers-y6-7-11.test.ts (шинэ), ui/src/i18n/xo/y6-7-11-keys.test.ts (шинэ), ui/src/xo/labels.test.ts, ui/src/lib/activity-format.test.ts, scripts/xo-i18n/tiers-y6-7-10.test.ts (anchor түлхүүр).

Gates (2026-10-14): xo:i18n:check OK 5894, xo:i18n:test 11 / 129, tsc 0, vitest ui/src 625 файл / 6582 тест, xo:brand-scan OK.

Үлдэгдэл (Ү6 7.11):
- *.production.tsx англиар.
- Хөгжүүлэлтийн «RESTART REQUIRED» баннер англиар.
- Activity-ийн дотоод action англи fallback.
- IssueRunLedger: «+{n} more», «{n} older items not shown», run.status англиар.
- company-members.ts-ийн «Board» шошго.
- en-д ConnectionSetupFlow-ийн брэнд «XO» гэж гарна (en байт ижил зарчмаас ухамсартай гажсан).

## Ү6 7.30-д хөндсөн upstream файлууд

Pipelines, routine жагсаалт, watchdog-ийн үлдэгдэл. BASE 6ac57e009.

| Файл | Өөрчлөлт |
|---|---|
| ui/src/pages/PipelineSettings.tsx | STAGE_SECTION_TITLES → stageSectionTitle(); шинэ stage-ийн нэр → tx |
| ui/src/pages/Pipelines.tsx | зураг upload-ын алдаа → tx |
| ui/src/lib/pipeline-item-detail.ts | humanizeReason: mn үед automation_not_configured |
| ui/src/pages/Routines.production.tsx | SelectItem → xoRoutineHistoryValueLabel |
| ui/src/components/RoutineList.tsx | formatRoutineRunStatus: mn үед ROUTINE_RUN_STATUSES |
| ui/src/lib/source-resolved-watchdog-fold.ts | cleanupOutcomeLabel(); en map хэвээр |

## Ү6 7.29-д хөндсөн upstream файлууд

Activity, change receipt, UserProfile, routine/secret/recovery-ийн түүхий enum. BASE 7ab43397b.

| Файл | Өөрчлөлт |
|---|---|
| ui/src/lib/activity-format.ts | humanizeValue kind (status/priority) авдаг; mn үед xoStatusLabel / xoRoutineHistoryValueLabel; user fallback → tx |
| ui/src/lib/issue-change-receipt.ts | mn үед талбарын шошго ба status/priority/workMode утга орчуулна |
| ui/src/pages/UserProfile.tsx | event.action, entityType шошго; HeroStat hint → tx |
| ui/src/components/RoutineActivityRow.tsx | detailKeyLabel, detailValueLabel |
| ui/src/components/SecretBindingPicker.tsx | secretProviderLabel; нууцын төлөв → xoStatusLabel |
| ui/src/components/IssueRecoveryActionCard.tsx | wake policy fallback-д monitor_only |
| ui/src/components/task-chat/TaskChatBubble.tsx | verificationReasonLabel; гарчиг → tx |
| ui/src/pages/PipelineSettings.tsx | locale шалгалтыг resolveLocale()-оор (tsc засвар) |

## Ү6 7.28-д хөндсөн upstream файлууд

BoardChat feed, sidebar, status card-ын үлдэгдэл. BASE e31a08ecc.

| Файл | Өөрчлөлт |
|---|---|
| ui/src/components/FeedCard.tsx | үйл үг, actor нэр, approval тодорхойлогч → tx; status → xoHumanizeValue, priority → xoRoutineHistoryValueLabel |
| ui/src/components/SidebarAgents.tsx | «Built-in agent …» template → tx-тэй хоёр бүтэн өгүүлбэр |
| ui/src/pages/StatusCards/StatusCardDetailDrawer.tsx | describeChangeKind fallback → xoStatusCardChangeKindLabel |
| ui/src/components/task-chat/TaskChatCompactInteractionCard.tsx | expirationReason → tx |

## Ү6 7.27-д хөндсөн upstream файлууд

Шүүлтүүр, routine, файл дамжуулалт, work product-ийн түүхий enum. BASE 3d1c9feb8.

| Файл | Өөрчлөлт |
|---|---|
| ui/src/components/search/SearchFilterBar.tsx | төлөв ба зэрэглэлийн шошго → xoIssueFilterLabel; humanize устгасан |
| ui/src/pages/Routines.tsx | concurrency ба catch-up SelectItem → xoRoutineHistoryValueLabel |
| ui/src/pages/audit/AuditRuns.tsx | run.source → xoRoutineRunSourceLabel; төлөвийн шүүлтүүр → xoStatusLabel |
| ui/src/pages/apps/chat/ChatEndpointDetail.tsx | fileTransfer.phase → xoFileTransferPhaseLabel |
| ui/src/components/ArtifactsPanel.tsx | wp.type → xoWorkProductTypeLabel |
| ui/src/components/TaskChatThread.tsx | work product type → xoWorkProductTypeLabel; status ба reviewState → xoStatusLabel |

## Ү6 7.26-д хөндсөн upstream файлууд

Inbox, Secrets, live update-ийн түүхий enum. BASE 3125feae8.

| Файл | Өөрчлөлт |
|---|---|
| ui/src/pages/Inbox.tsx, ui/src/pages/LegacyInbox.tsx | approvalStatusLabel → xoHumanizeValue |
| ui/src/pages/AgentDetail.tsx | workspace operation төлөвийн badge → xoStatusLabel |
| ui/src/pages/JoinRequestQueue.tsx | request.status → xoStatusLabel |
| ui/src/pages/apps/Browse.tsx | endpoint.status → xoHumanizeValue |
| ui/src/pages/Secrets.tsx | config.status (2 газар), healthStatus → xoStatusLabel; binding.target.status → xoHumanizeValue |
| ui/src/context/LiveUpdatesProvider.tsx | status ->, reopened from-ийн утга → xoHumanizeValue |
| ui/src/lib/issue-chat-messages.ts | formatStatusLabel → xoHumanizeValue |

## Ү6 7.25-д хөндсөн upstream файлууд

Төлөвийн badge-ийн түүхий enum. BASE e7db1bae9.

| Файл | Өөрчлөлт |
|---|---|
| ui/src/components/ApprovalCard.tsx | approval.status → xoHumanizeValue |
| ui/src/components/IssueWorkspaceCard.tsx | statusBadge → xoHumanizeValue |
| ui/src/components/ProjectWorkspaceSummaryCard.tsx | executionWorkspaceStatus → xoHumanizeValue |
| ui/src/components/CommentThread.tsx | formatRunStatusLabel → xoStatusLabel / xoHumanizeValue |
| ui/src/components/IssueBlockedNotice.tsx | waitingTaskStatusLabel, reopenSuppressedLeafStatus |
| ui/src/components/IssueLinkQuicklook.tsx | statusLabel → xoStatusLabel |
| ui/src/components/GoalProperties.tsx | label(): түвшин tx(), төлөв xoStatusLabel |
| ui/src/pages/CompanyAccess.tsx | member.status → xoStatusLabel |
| ui/src/components/task-chat/RunnerGoalWidget.tsx | goal.status → xoStatusLabel |
| ui/src/components/task-chat/TaskChatProtocolActivityRow.tsx | file.operation → xoFileOperationLabel |
| ui/src/components/task-chat/TaskChatProtocolCard.tsx | fileOperationText-ийг xo/labels.ts руу зөөсөн |

## Ү6 7.24-д хөндсөн upstream файлууд

Task chat протокол картын төлөв, файлын шошго. BASE aa65da4e7.

| Файл | Өөрчлөлт |
|---|---|
| ui/src/components/task-chat/TaskChatProtocolCard.tsx | statusText(), fileOperationText() helper; CardShell төлөв, run ended summary, файлын картын төрөл (File/Document/Code/Image), binary шошго tx() |

## Ү6 7.23-д хөндсөн upstream файлууд

Transcript-ын эцсийн төлөвийн enum. BASE 008db712f.

| Файл | Өөрчлөлт |
|---|---|
| ui/src/components/transcript/RunTranscriptView.tsx | runStateText(), dispositionText() helper; run_result шошго tx("result · {{disposition}}"), run_terminal текст орчуулагдсан enum-аар |

## Ү6 7.22-д хөндсөн upstream файлууд

RunTranscriptView-ийн үйл явдлын шошго. BASE 3231a8480.

| Файл | Өөрчлөлт |
|---|---|
| ui/src/components/transcript/RunTranscriptView.tsx | eventLabelText() helper: render үед terminal/init/result шошгыг tx(); block.label-ийн түүхий утга харьцуулалт, React key-д хэвээр |

## Ү6 7.21-д хөндсөн upstream файлууд

Жижиг үсгийн ганц үгт шошго. BASE e364db727.

| Файл | Өөрчлөлт |
|---|---|
| ui/src/components/{CaseFieldsPanel, FrontmatterPanel}.tsx, ui/src/components/environment-variables-editor/Row.tsx | aria/placeholder tx(); CaseFieldsPanel tx import |
| ui/src/pages/{BoardChat, PipelineSettings}.tsx, ui/src/pages/tools/SmokeLabTab.tsx | aria/placeholder tx() |

## Ү6 7.20-д хөндсөн upstream файлууд

Хөтчийн шүүрдлэгийн aria үлдэгдэл. BASE 238fd1e6a.

| Файл | Өөрчлөлт |
|---|---|
| ui/src/components/ui/breadcrumb.tsx | aria tx("breadcrumb") |
| ui/src/components/MarkdownEditor.tsx | mdxEditorTranslation(), MDXEditor translation prop |

## Ү6 7.19-д хөндсөн upstream файлууд

7.18-ийн үлдэгдэл. BASE 6eacdef8d.

| Файл | Өөрчлөлт |
|---|---|
| ui/src/components/{CommentThread, IssuesList, IssueFieldChangeReceipt}.tsx, ui/src/pages/{Inbox, LegacyInbox, Pipelines, IssueDetail}.tsx | fallback шошго tx(); IssueDetail wake warning тоогоор 2 түлхүүр |
| ui/src/components/BlockedReasonChip.tsx | aria tx(), severityWord() helper |
| ui/src/components/task-chat/TaskChatSystemNotice.tsx | aria tx() |
| ui/src/xo/labels.ts | xoBrandVars() нэмсэн (XO-ийн файл) |

## Ү6 7.18-д хөндсөн upstream файлууд

Tier-гүй .ts helper, 7.17-ийн үлдэгдэл. BASE 3446eee56.

| Файл | Өөрчлөлт |
|---|---|
| ui/src/components/{ExternalObjectPill, ExternalObjectStatusSummary}.tsx | T1; шошго helper |
| ui/src/components/task-chat/{status-whimsy.ts, TaskChatThinking.tsx}, ui/src/components/transcript/native-run-events.ts, ui/src/adapters/{paperclip-runner/index.ts, transcript.ts} | tx, switch helper |
| ui/src/lib/{attention, blockedInbox, external-objects, issue-change-receipt, issue-chat-messages, system-notice-comment, system-notice-humanizer, pipeline-learnings, pipeline-references, routine-run-display, runRetryState, wait-for-stopped-runs, comment-submit-result, issue-timeline-events}.ts | Record → switch helper; tx |
| ui/src/lib/{utils, assignees, reusable-execution-workspaces, activity-format, issueDetailBreadcrumb, interaction-audience}.ts | thunk Record, tx; «You» харьцуулалт |
| ui/src/lib/{trust-policy-ui, oauthHandoff, secret-delivery, codex-reasoning-effort, company-export-selection, tool-installs, adapter-test-environment, saved-provider-credentials}.ts | tx; INSTALL_ALL_WARNING → installAllWarning() |
| ui/src/api/{agents, issues}.ts | client мессеж tx |
| ui/src/pages/apps/{connection-identity, gateways/gateway-tabs, chat/chat-setup-error, chat/github-private-key-file}.ts, ui/src/pages/tools/{tool-tabs, profiles/profile-model}.ts, ui/src/pages/StatusCards/format.ts, ui/src/plugins/bridge-init.ts | шошго helper; tx |
| ui/src/pages/{Inbox, CompanyExport, apps/Connections}.tsx, ui/src/components/{AppsSidebar, AppConnectionSidebar}(.production).tsx, ui/src/features/connections/ConnectionSetupFlow.tsx | шинэ helper-ийг дуудна |
| ui/src/components/{SidePanelTabs, SidePanelTab, ArtifactFileChip, WorkspaceFileLink, BudgetSidebarMarker, FoldCurtain, RunChatSurface, CollectionToolbar, CopyText, SearchableSelect, ReusableExecutionWorkspaceSelect}.tsx, environment-variables-editor/model.ts, ai-connections/useLocalAiLogin.ts | tx |
| ui/src/components/BlockedInboxView.tsx | board эзэмшигчийн «Board» шошго tx |
| ui/src/hooks/{useDocumentAnnotationMutations, useResourceMemberships, useRetryNowMutation, useIssueExternalObjects}.ts | toast, мессеж tx |

## Ү6 7.17-д хөндсөн upstream файлууд

Tier-гүй үлдсэн .tsx, .ts. BASE e42211749.

| Файл | Өөрчлөлт |
|---|---|
| ui/src/components/{AgentBubbleActionRow, OutputFeedbackButtons, PipelineLivenessBanner}.tsx | T1; XoTrans |
| ui/src/components/{ExecutionParticipantPicker, ProjectRepositoryInput}.tsx | T1; tx |
| ui/src/components/task-chat/{tool-taxonomy, task-chat-activity-presentation}.ts | tx switch helper; toolActivityEnglishRunningLabel() англи харьцуулалтад |
| ui/src/components/transcript/native-run-events.ts, ui/src/lib/transcriptPresentation.ts | fallback tx |
| ui/src/lib/{workspace-access-state, status-card-state, review-policy, pipeline-liveness, pipeline-item-detail, interrupt-handoff, inbox, issue-filters, search-filters, search-query-parser}.ts | Record → thunk/helper; tx |
| ui/src/pages/StatusCards/StatusCardDetailDrawer.tsx | statusCardLifecycleLabel() |
| ui/src/components/search/{SearchSortMenu, SearchFilterSheet}.tsx, ui/src/pages/Search.tsx | searchSortLabel() |
| ui/src/adapters/{adapter-display-registry.ts, paperclip-runner/index.ts} | тайлбар, шошго tx; брэнд {{brand}} |
| ui/src/pages/apps/generic-mcp-connect.ts | заавар tx |
| Tier-д нэмсэн бусад 16 .tsx (StatusIcon, FeedCard, PageTabBar г.м.) | T1 л |

## Ү6 7.16-д хөндсөн upstream файлууд

7.15-ын үлдэгдэл. BASE 69d230b2e.

| Файл | Өөрчлөлт |
|---|---|
| ui/src/lib/issue-monitor.ts | T1; хугацааны мөр tx; monitorEtaPhase() нэмсэн; formatMonitorOffset англи мөр харьцуулахаа больсон |
| ui/src/components/issue-properties/IssueProperties.tsx | monitorEtaPhase ашиглана; хяналт/дахин оролдлогын мөр tx |
| ui/src/components/{IssueBlockedNotice, IssueScheduledRetryCard}.tsx | relative === tx("now") |
| ui/src/pages/{CompanyImport, CompanyExport}.tsx | FrontmatterCard → frontmatterFieldLabel() |
| ui/src/components/PackageFileTree.tsx | frontmatterFieldLabel дахин экспорт |

## Ү6 7.15-д хөндсөн upstream файлууд

Tier-гүй үлдэгдлийн 2-р шат. BASE 2c6c90260. ED шийдвэр (2026-10-14): анхдагч холболтын нэр, AI_PROVIDERS subscription нэрийг орчуулна; TEAMS_*_COMMAND_DESCRIPTION англиар.

| Файл | Өөрчлөлт |
|---|---|
| ui/src/pages/{Pipelines, PipelineSettings, …}, components/Pipeline*, StatusCard* (14) | T1; tx, XoTrans |
| ui/src/adapters/**/config-fields, components/AgentConfigForm, new-agent/*, agent-config-primitives, AiConnectionField, AiConnectionAuth, OnboardingWizard, ConnectionSetupFlow, ConnectionIntentInteractionBody (36) | T1; анхдагч «My …» нэр tx; help → getter |
| ui/src/components/{RunnerInspector, TeamCatalog, AgentToolsTab}, pages/{PluginSettings, AdapterManager, PluginManager}, plugins/launchers, slots | T1; tx, XoTrans |
| ui/src/components/access/*, workspace, project бүрэлдэхүүн (27), FileTree | T1; frontmatterFieldLabel |
| ui/src/components/Issue*, Case*, Decision*, Task* (53) | T1; tone map-ийн «body»/«action» түлхүүрийг computed key болгосон |
| ui/src/components бусад (68): SystemNotice, TrustPresetSection г.м. | T1; tone.label → tone.labelClass; XoTrans {{product}} |
| ui/src/components/ai-connections/model.ts | aiSubscriptionName() |
| ui/src/lib/pipeline-breakdown.ts | гар tx, {{brand}} xoBrandVars(), joinWithAnd |
| ui/src/components/WorkspaceRuntimeControls.tsx | «Run» → xoRunActionLabel(), «run once» tx |
| ui/src/pages/NewAgent.tsx, pages/PluginPage.tsx, components/access/CompanySettingsNav.tsx | breadcrumb tx, XoTrans, табын шошго render үед tx |

XO-ийн өмч: scripts/xo-i18n/tiers.ts (+206 файл T1), ui/src/xo/labels.ts (xoRunActionLabel), ui/src/i18n/xo/* (keys=10831, +2690; keep-en +47).

XO-ийн тестүүд: scripts/xo-i18n/tiers-y6-7-15.test.ts (шинэ).

Gates (2026-10-14): xo:i18n:check OK 10831, xo:i18n:test 415, tsc 0; xo:brand-scan OK (baseline 552 / 160 хэвээр, одоо 505 / 152).

Үлдэгдэл (Ү6 7.15): IssueMonitorBanner {{eta}}/{{time}}; frontmatterFieldLabel-ийг CompanyImport/Export, PackageFileTree-д хэрэглээгүй; «Unnamed attachment» англиар (серверт очдог); TEAMS_*_COMMAND_DESCRIPTION англиар.

## Ү6 7.14-д хөндсөн upstream файлууд

Tier-гүй үлдэгдлийн 1-р шат. BASE 732c337e9. ED шийдвэр (2026-10-14): хөгжүүлэгчийн туршилтын хуудсыг хасна; хоёр шатанд (7.14 apps/tools/холболт, 7.15 бусад).

| Файл | Өөрчлөлт |
|---|---|
| ui/src/pages/apps/chat/{ChatEndpointSetup, ChatEndpointDetail, EmailEndpointSetup, PhotonConnectStep, ChatIdentityConfirm}.tsx | T1; функц доторх мөр tx, XoTrans; модулийн түвшний мөр → функц |
| ui/src/pages/apps/{AppDetail, AppNotConnected, AppsReview, ComposioProvenanceChip, Connections, PaperclipCloudOAuthHandoff, ReviewQueueCard}.tsx, app-detail/* (8) | T1; tx, XoTrans, _one/_other plural |
| ui/src/pages/apps/gateways/** (11), components/ai-connections/* (5 .tsx), components/chat/ExternallyConnectedTaskBanner.tsx, features/connections/ConnectionIntentInteractionBody.tsx | T1; tx, XoTrans |
| ui/src/pages/tools/*.tsx (9), tools/profiles/* (8) | T1; tx, XoTrans |
| ui/src/pages/apps/gateways/gateway-helpers.ts, components/ai-connections/model.ts, pages/apps/app-tabs.ts | гар tx; aiConnectionStatusLabel (model.ts) |

XO-ийн өмч: scripts/xo-i18n/tiers.ts (+62 файл T1), ui/src/i18n/xo/* (keys=8141, +1613; keep-en +18).

XO-ийн тестүүд: scripts/xo-i18n/tiers-y6-7-14.test.ts (шинэ).

Gates (2026-10-14): xo:i18n:check OK 8141, xo:i18n:test 209, tsc 0; xo:brand-scan OK (baseline 552 / 160 хэвээр).

Үлдэгдэл (Ү6 7.14):
- 7.15: бусад pages, components, adapters (~2000 түлхүүр).
- Хадгалагддаг анхдагч нэр («My … account», «Unnamed attachment»), TEAMS_*_COMMAND_DESCRIPTION, AI_PROVIDERS subscription нэр англиар.

## Ү6 7.13-д хөндсөн upstream файлууд

7.12-ийн үлдэгдлийг хаасан. BASE 11b6344c0. ED шийдвэр (2026-10-14): *.production.tsx оруулна; Activity-ийн дотоод action-д үйл үг; en-д функц доторх брэнд «Paperclip».

| Файл | Өөрчлөлт |
|---|---|
| ui/src/features/connections/ConnectionSetupFlow.tsx, components/IssueRunLedger.tsx, pages/tools/AuditTab.tsx | {{brand}} tx-д xoBrandVars() |
| ui/src/pages/CompanySkills.production.tsx, components/AppConnectionSidebar.production.tsx, components/AppsSidebar.production.tsx, components/routine-sections/editable-sections.production.tsx, pages/OrgChart.production.tsx, pages/RoutineDetail.production.tsx, pages/Routines.production.tsx, pages/audit/AuditFeed.production.tsx, pages/audit/CompanyActivity.production.tsx | T1; функц доторх мөр tx, модулийн Record → render үеийн функц |
| ui/src/components/SidebarAgents.production.tsx, SidebarAccountMenu.production.tsx, pages/Agents.production.tsx, Costs.production.tsx, AgentDetail.production.tsx | функц доторх мөр tx |
| ui/src/lib/activity-format.ts (+test) | XO_ACTIVITY_ROW_VERBS-д 312 action |
| ui/src/pages/Artifacts.tsx, components/artifacts/ArtifactCard.tsx, ArtifactGroupCard.tsx, pages/apps/Browse.tsx, components/IssueRecoveryActionCard.tsx, FinanceTimelineCard.tsx, side-panel/SidePanelFrame.tsx | T1; prop/функц доторх мөр tx, XoTrans |
| ui/src/lib/recovery-lineage.ts, lib/app-gallery-copy.ts | гар tx; localizedAppDescription (mn-д л) |
| ui/src/pages/Inbox.tsx, components/IssuesList.tsx, pages/AgentDetail.tsx, pages/InstanceGeneralSettings.tsx, pages/Costs.tsx | aria/prop tx, XoTrans |

XO-ийн өмч: ui/src/xo/labels.ts (xoBrandVars), scripts/xo-i18n/tiers.ts (+16 файл T1), ui/src/i18n/xo/* (keys=6528, +614).

XO-ийн тестүүд: scripts/xo-i18n/tiers-y6-7-13.test.ts (шинэ), ui/src/xo/labels.test.ts (xoBrandVars).

Gates (2026-10-14): xo:i18n:check OK 6528, xo:i18n:test 147, tsc 0; xo:brand-scan OK 552 / 160 (ED-ийн зөвшөөрлөөр --update; labels.ts 4 → 5 en «Paperclip» литерал, бусад файл буурсан).

Үлдэгдэл (Ү6 7.13):
- Tier-д ороогүй 312 файл (~4134 түлхүүр): PROGRESS.md-ийн 7.13 тооллого.
- issue-monitor formatMonitorOffset-ийн «in 3m» / «3m ago» англиар.
- Загвар, case-д ороогүй холбогчийн манифестын тайлбар англиар.

## Ү6 7.12-д хөндсөн upstream файлууд

7.11-ийн үлдэгдлийг хаасан. BASE 1252e0d74. ED шийдвэр (2026-10-14): *.production.tsx хүрээнээс гадуур; нэр томьёог Claude засаж тайлагнана (PROGRESS.md-ийн 7.12 хүснэгт).

| Файл | Өөрчлөлт |
|---|---|
| ui/src/components/DevRestartBanner.tsx | T1; describeReason, live run ганц/олон тоо, confirm, alert гар tx; XoTrans <code>; «Restart Paperclip now?» түлхүүр литерал (mn-д XO) |
| ui/src/components/IssueRunLedger.tsx | statusLabel → xoStatusLabel; тоолууртай 2 мөр tx |
| ui/src/lib/company-members.ts | local-board «Board» нэр tx (fallbackUserLabel, baseMemberLabel) |
| ui/src/components/SidebarAccountMenu.tsx | local-board «Board» нэр tx |

Хөндөгдөөгүй: серверийн код, *.production.tsx (SidebarAccountMenu.production.tsx-ийн «Board» англиар).

XO-ийн өмч: scripts/xo-i18n/tiers.ts (+1 файл T1), ui/src/i18n/xo/* (keys=5914, +20; mn.json-д нэр томьёоны 4 засвар).

XO-ийн тестүүд: scripts/xo-i18n/tiers-y6-7-12.test.ts (шинэ).

Gates (2026-10-14): xo:i18n:check OK 5914, xo:i18n:test 12 / 131, tsc 0, xo:brand-scan OK 566 / 161; vitest ui/src-ийн timeout-аар унасан тестүүд тусад нь давсан.

Үлдэгдэл (Ү6 7.12):
- *.production.tsx англиар.
- Activity-ийн дотоод action англи fallback.
- en-д ConnectionSetupFlow-ийн брэнд «XO» гэж гарна (7.11-ээс).

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
| `packages/shared/src/home-paths.ts` | А2 | resolveDefaultBrandWorktreesDir(): XO_WORKTREES_DIR > ~/.xo-worktrees; хуучин ~/.paperclip-worktrees байвал fallback · conflict: upstream-ийг аваад `.paperclip-worktrees` литералыг resolveDefaultBrandWorktreesDir() руу шилжүүл |
| `packages/shared/src/config-schema.ts` | А2 | schema-ийн анхдагч зам `~/.paperclip/instances/default/...` → `~/.xo/instances/default/...` (хэрэглэгчийн config-д тодорхой бичсэн зам хэвээр) · conflict: upstream-ийг аваад анхдагч литералыг `~/.xo/`-д буцаа |
| `packages/shared/src/config-schema.test.ts, cli/src/__tests__/home-paths.test.ts` | А2 | шинэ анхдагч замд тааруулсан · conflict: upstream-ийг аваад хүлээгдэх замыг `~/.xo`-д засна |
| `cli/src/config/data-dir.ts` | А2 | `--data-dir` нь XO_CONFIG/XO_CONTEXT-ийг мөн тохируулна (PAPERCLIP_* хамт) · conflict: XO_* тохируулалтыг дахин нэм |
| `cli/src/commands/client/context.ts, cli/src/commands/client/common.ts` | А2 | контекст/config замыг readBrandEnv-ээр уншина (XO_CONTEXT, XO_CONFIG) · conflict: process.env.PAPERCLIP_* шууд уншсан мөрийг readBrandEnv руу буцаа |
| `cli/src/commands/routines.ts` | А2 | help текстэд `~/.xo` · conflict: upstream-ийг аваад текстийг дахин солино |
| `cli/src/commands/worktree.ts` | А2 | help текст `~/.xo`; worktree гэрийн анхдагч resolveDefaultBrandWorktreesDir() · conflict: `.paperclip-worktrees` литерал, `~/.paperclip` help текстийг дахин солино |
| `cli/src/commands/worktree-lib.ts` | А2 | worktree гэрийн анхдагч ~/.xo-worktrees, хуучин нь fallback · conflict: resolveDefaultBrandWorktreesDir() ашигла |
| `cli/src/__tests__/data-dir.test.ts` | А2 | XO_CONFIG/XO_CONTEXT шалгалт нэмсэн · conflict: upstream тестийг аваад XO_ нэмэлтийг дахин нэм |
| `server/src/home-paths.ts` | А2 | worktree гэр: resolveDefaultBrandWorktreesDir() · conflict: зөрчилд upstream + XO дуудлага |
| `server/src/worktree-config.ts` | А2 | worktree гэрийн анхдагч брэнд-мэдрэмтгий · conflict: зөрчилд upstream + XO дуудлага |
| `server/src/dev-runner-worktree.ts` | А2 | worktree гэр XO_WORKTREES_DIR-ийг readBrandEnv-ээр хүндэтгэнэ · conflict: readBrandEnv дуудлагыг буцаа |
| `server/src/__tests__/dev-runner-worktree.test.ts` | А2 | XO_WORKTREES_DIR тест · conflict: upstream-ийг аваад дахин нэм |
| `server/src/services/workspace-instance-cleanup.ts` | А2 | цэвэрлэгээний worktree гэр брэнд-мэдрэмтгий · conflict: зөрчилд upstream + XO дуудлага |
| `server/src/services/effective-run-config-fingerprints.ts` | А2 | хоосон утгатай ба XO_-ээр эхэлсэн орчны түлхүүрийг брэнд шүүлтүүрт зөв авна (Ү3-А2 Task 4) · conflict: isBrandRuntimeEnvKey дуудлагыг буцаа |
| `scripts/provision-worktree.sh` | А2 | worktree гэрийн анхдагч ~/.xo-worktrees · conflict: XO_WORKTREES_DIR/хуучин fallback-ийг буцаа |
| `scripts/backup-db.sh, scripts/measure-issue-chat-long-thread.mjs, scripts/screenshot.cjs` | А2 | auth.json ба backup-ийг брэнд гэрээс (XO_HOME > PAPERCLIP_HOME > ~/.xo > ~/.paperclip) уншина · conflict: upstream-ийг аваад гэрийн зам тооцоог дахин нэм |

Ү3-А2 (брэнд үлдэгдэл) нэмэлт: `packages/shared/src/xo-brand-env.ts`, түүний тест, `server/src/services/xo-brand-filters.test.ts`, `*.xo.test.ts` нь XO-ийн өөрийн файл тул хүснэгтэд ороогүй. **Fingerprint:** Ү3-А2 Task 4 (хоосон утгыг mirror-оос алгасах, XO_ эх түлхүүрийг шүүлтүүрт хадгалах) effective-run-config fingerprint-ийг ганц удаа өөрчилнө; upgrade-ийн дараа одоо ажиллаж буй run нэг удаа fingerprint таарахгүй гэж харагдаж болно.

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
- Англиар үлдсэн (хүрээнээс гадуур): SkillFolderTree.tsx ба reservedRootLabel (7.9-д) — хэрэгжсэн (Ү6 7.9); ModeBadge.tsx («Local trusted» / «Authenticated …») — хэрэгжсэн (Ү6 7.7); MyUserSecretsTab ба UserSecretDefinitionsTab дахь {definition.status} enum — хэрэгжсэн (Ү6 7.7, xoStatusLabel).
- Ү6 7.7-д шилжүүлсэн: issue-thread-interactions summary, interaction-resolution-error — хэрэгжсэн (Ү6 7.7).
- «by» одоо ерөнхий каталогийн түлхүүр («санал гаргасан:»); өөр газар дахин ашиглавал утга буруу гарна.
- en түлхүүр «Could not approved / rejected / sent for revision» upstream-ийн дүрмийн алдааг хадгална; en гаралт байт ижил байхын тулд засаагүй.
- AttentionQueueRow.tsx-ийн SNOOZE_PRESETS (L76-81) модулийн түвшинд tx() дууддаг. i18n синхрон эхэлдэг, locale солиход хуудас дахин ачаалагддаг тул хүлээн зөвшөөрсөн.
- Browser шалгалт (3110, mn, 2026-10-13): нууц утгын 4 таб (Нууц утгууд / Миний нууц утгууд / Нийлүүлэгчийн сангууд / Саналууд), «Хавтсаар / Жагсаалтаар» товч, хоосон төлөвүүд Монгол. Инстанцын тохиргоо (байгууллагын тохиргоонд embedded) Монгол; «Paperclip Labs» нэр, dev тэмдэглэл, «Local trusted» (ModeBadge) шийдвэрийн дагуу англиар. /decisions дээр AttentionQueueRow-ийн эх сурвалжийн шошго («Шийдвэр хүссэн») ба snooze сонголт (Өнөөдөр / Энэ долоо хоногт / Хэзээ ч болно) Монгол. Хүрээнээс гадуур англиар үлдсэн (7.7-д): WhatNeedsMe шүүлтүүр («N decisions», All/Today/Yesterday…), DecisionTriageStrip («Pick date», «Snooze», «Queue», «Ask agent for recommendation»), lib/attention.ts («N questions — …») — хэрэгжсэн (Ү6 7.7); Routines.tsx ба Skills хуудас («New folder» нь Routines.tsx:961-ээс) — 7.8 / 7.9-д; Skills хуудас — хэрэгжсэн (Ү6 7.9). FolderControls-ын хавтасны rail ба compact interaction card-ыг өгөгдөлгүйгээс browser-т харуулж чадаагүй; unit тестээр баталгаажсан.

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
- Skills хуудас, SkillFolderTree.tsx, reservedRootLabel — хэрэгжсэн (Ү6 7.9).
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
- Skills хуудас, SkillFolderTree.tsx, reservedRootLabel — хэрэгжсэн (Ү6 7.9).
- Routine run.source / run.status badge ба шүүлтүүрийн «any» англиар; xoStatusLabel-д routine-ийн төлөв байхгүй.
- Routines.tsx-ийн breadcrumb «Recent Runs» (createIssueDetailLocationState-ийн аргумент) англиар.
- InlineEntitySelector-ийн searchPlaceholder / emptyMessage бусад газарт (CommentThread, IssueProperties, RepositoryEditor, ConnectionSetupFlow) англиар.
- Техникийн утгууд «plain (set)», «secret_ref → …», «latest», «replay Ns» англиар.
- relativeTime() mn-д англиар гарвал «Saved … by …» өгүүлбэрт хоёр хэл холилдоно.
- RoutineVariablesEditor-ийн тусламжийн цонхонд en гаралт «Paperclip detects» → «XO detects» болсон (T1 брэнд дүрэм); en байт ижил байх зарчмаас ухамсартай гажсан.
- Browser шалгалт (2026-10-14, 3110, restart хийгээгүй, HMR): туршилтын «Туршилт 7.8» routine үүсгэж, хуваарийн идэвхжүүлэгч нэмэв. mn: жагсаалт, үүсгэх цонх («Агент: / төсөл: / хавтас:»), triggers (cron тайлбар «Өдөр бүр 10:00 цагт», цаг 00–23), overview, variables («{{placeholder}}» хаалт зөв), delivery (бодлого, «Дараагийн 5 идэвхжилт», «нэгтгэгдэнэ / дараалалд орно»), history («хув. N», талбарын шошго) Монголоор гарсан. en: triggers (12 цаг AM/PM), delivery англи хэвээр. Англиар үлдсэн (үлдэгдэл): толгойн «Draft» төлөвийн тэмдэг; RoutineOverview L178 «No runs yet» (JSX attribute доторх ternary, T1 барьдаггүй); secrets хэсгийн орчны хувьсагчийн засварлагч («No environment variables», «Add variable»); history-ийн enum утгууд (medium, paused, coalesce if active, skip missed, SCHEDULE); серверийн өгөгдөл: идэвхжүүлэгчийн анхдагч label «schedule», changeSummary, activity event нэрс.

## Ү6 7.9-д хөндсөн upstream файлууд

7.8-ын «Үлдэгдэл»-ийн Skills хэсгийг (Streamlined хувилбар) хаасан: /YB/skills (Суулгасан / Олох / Бүтээх табууд, шүүлтүүр, эрэмбэ, суулгах ба импортын урсгал), хавтасны мод ба reservedRootLabel, хажуу самбар, Чадварын студи, төслөөс импортлох цонх, агентын чадварын таб ба гаргалт сонгогч, skill-studio цонхнууд, lib/skill-policy-denial.ts-ийн клиент текст. tiers.ts-д 12 файл T1 болж нэмэгдсэн. Тэмдэглэгээ 7.5-ын хүснэгттэй ижил. BASE 9282a6b0c. ED шийдвэр: Х1 нэг давалгаа; Х2 зөвхөн Streamlined хувилбар (CompanySkills.production.tsx англиар); Х3 skill-policy-denial-ийн клиент текстийг орчуулна, серверийн error.message англиар. Нэр томьёо: Skill Studio «Чадварын студи», Fork «Салаалах» (forked «салаалсан», Forked from «Салаалсан эх:»), release «гаргалт» («Бета гаргалт»), табууд «Суулгасан / Олох / Бүтээх», Star «Од» («Одтой», «…одоор тэмдэглэх»), Move «шилжүүлэх», Optional «Заавал биш», Trust «Итгэмжлэл», core «үндсэн», actor «гүйцэтгэгч», managed-skill directory «удирддаг чадварын хавтас», Most forks «Хамгийн олон салаатай». Import-ын бичлэгийг mn каталог даяар «импортлосон / Импортлож» болгож нэгтгэв (19 + 2 утга); ганц breadcrumb «Студи» ба «Студийн цэс» хэвээр.

| Файл | Өөрчлөлт |
|---|---|
| ui/src/pages/CompanySkills.tsx | T1; эх сурвалжийн шүүлтүүр xoSkillSourceFilterLabel, олох эрэмбэ xoSkillDiscoverySortLabel; суулгах / импорт / устгах / шинэчлэх алдааны toast гар tx; хавтас руу зөөх toast «Moved "{{title}}" to {{folder}}.», нэргүй хавтас ба «Unfiled»-д тусдаа литерал; агентын тоо ба workspace-ийн тоо ганц / олон тооны тусдаа литерал; давхардсан түлхүүрийн анхааруулга XoTrans (<code>); managed шошго (GitHub / URL / Folder / Catalog / skills.sh / {{brand}} managed); «Paperclip workspace» → «{{brand}} workspace» (en «XO» болсон) |
| ui/src/pages/SkillStudio.tsx | T1; window.confirm (файл солих, файл устгах «Delete {{path}}?», оролт хаях, загвар устгах) гар tx; toast «Couldn't …»; «Placeholders: <list/>.» XoTrans; «Restore as v{{revisionNumber}}»; хувилбарын label «Restore of vN» const restoreLabel болгож салгасан, англиар (хадгалагдах өгөгдөл) |
| ui/src/lib/skill-studio.ts | гар tx (T1 биш): туршилтын товчны reason («Pick an agent to run», «A run is already in progress» гэх мэт), Test task expired / deleted / unavailable, «Unknown editor» |
| ui/src/pages/skills/ImportSkillsFromProjectDialog.tsx | T1; эх сурвалжийн төрөл (git / local / folder / remote), «Request failed: {{status}}», импортын toast «{{n}} skill(s) imported as references from {{project}}.» ганц / олон тусдаа литерал; SKILL.md хайлтын тайлбар, «Import from path or URL» товч, «No files were copied.» XoTrans |
| ui/src/components/folders/SkillFolderTree.tsx | T1; RailHeading-д createTitle prop («New organization folder» литерал, `New ${label.toLowerCase()} folder`-ийн оронд); root шошго xoSkillReservedRootLabel; «Move to Organization» / «Move to My Skills» тусдаа литерал; «Unfiled» |
| ui/src/components/folders/skill-folder-tree.ts | гар tx (T1 биш): reservedRootLabel ба breadcrumb шошго xoSkillReservedRootLabel-ээр, key-д англиар |
| ui/src/components/SkillsContextualSidebar.tsx | T1 (эх код өөрчлөгдөөгүй, зөвхөн tiers.ts-д) |
| ui/src/pages/agent-skills/AgentSkillsTab.tsx | T1; materialization тэмдэглэл, adapter / ACP / OpenClaw / Runner мессеж «Paperclip» → «{{brand}}» (en «XO» болсон); «Beta · {{release}}»; «<b>{{key}}</b> is enabled but missing…» XoTrans; Kept in workspace / Applied on next run / Tracked only |
| ui/src/pages/agent-skills/AgentSkillRow.tsx | T1; aria-label «Enable / Disable {{name}}» тусдаа литерал |
| ui/src/pages/agent-skills/AgentSkillReleasePicker.tsx | T1; модулийн DEFAULT_LABEL-ийг render доторх tx болгосон; «{{name}} · released {{date}}», «Release» fallback |
| ui/src/pages/agent-skills/agent-skill-source.ts | гар tx (T1 биш): «Local folder», «Catalog», «Paperclip managed» → «{{brand}} managed» (en «XO managed») |
| ui/src/lib/skill-policy-denial.ts | гар tx (T1 биш): DEFAULT_*_REMEDIATION тогтмолыг хассан, функц доторх литерал; «{{action}} is restricted by your organization policy.»; PLATFORM_TITLES / PLATFORM_REMEDIATIONS Record англиар үлдэж, буцаах цэгт xoSkillPolicyDenialTitle / xoSkillPolicyDenialRemediation (кодоор); серверийн remediation ба error.message хөндөгдөөгүй |
| ui/src/components/skill-studio/AgentsUsingSkillDialog.tsx | T1; «{{n}} agent(s) use(s) this skill» ганц / олон тусдаа литерал; «Latest (v{{revision}})», «v{{revision}}»; InlineEntitySelector loadingMessage / searchPlaceholder / emptyMessage гар tx |
| ui/src/components/skill-studio/ForkSkillDialog.tsx | T1; «Create copy & switch {{n}} agent(s)» ганц / олон тусдаа литерал, «Create copy» |
| ui/src/components/skill-studio/SkillPolicySurfaces.tsx | T1 (эх код өөрчлөгдөөгүй, зөвхөн tiers.ts-д) |
| ui/src/components/skill-studio/SkillProvenance.tsx | T1; «This skill lives in <path>{{location}}</path>…» XoTrans; «the original skill», «the project working tree» fallback |
| ui/src/lib/skill-fork.ts | гар tx (T1 биш): эх сурвалжийн тайлбар (a URL / the catalog / a local path / its source); агентын тоо «No agents …», «{{n}} agent(s) currently use(s) this skill» ганц / олон тусдаа литерал |

Хөндөгдөөгүй: ui/src/pages/skills/skills-navigation.ts, ui/src/pages/agent-skills/agent-skill-filter.ts, ui/src/lib/skill-create.ts (анхдагч skill агуулга агентад очдог тул англиар), ui/src/pages/CompanySkills.production.tsx (Х2).

XO-ийн өмч: ui/src/xo/labels.ts (xoSkillSourceFilterLabel, xoSkillDiscoverySortLabel, xoSkillReservedRootLabel, xoSkillPolicyDenialTitle, xoSkillPolicyDenialRemediation шинэ), scripts/xo-i18n/tiers.ts (12 файл T1), ui/src/i18n/xo/* (keys=4706, +662; keep-en.json +9: «· v{{revisionNumber}}», «git», «GitHub», «SKILL.md», «Slug», «v{{packageVersion}}», «v{{revision}}», «v{{revisionNumber}}», «v{{version}}»).

Шинэ XO-ийн тестүүд: ui/src/i18n/xo/y6-7-9-keys.test.ts (242 гар түлхүүр ба каталог даяарх шалгалт), scripts/xo-i18n/tiers-y6-7-9.test.ts (12), ui/src/xo/labels.test.ts (5 helper-ийн mn describe).

Үлдэгдэл (Ү6 7.9):
- CompanySkills.production.tsx англиар үлдэнэ (ED шийдвэр Х2).
- Серверээс ирэх мессеж (toast-ийн error.message, skill-policy-denial-ийн серверийн remediation) англиар үлдэнэ (ED шийдвэр Х3).
- Хадгалагдах ба агентад очих өгөгдөл англиар: skill-create.ts-ийн анхдагч skill агуулга, хувилбарын label «Restore of vN» (SkillStudio restoreLabel), хуулбарын анхдагч нэр «{name} copy».
- «Slug» ба «Agent Skills markdown» латинаар үлдсэн.
- Суулгалт ба хувилбарын тооны _one / _other mn утга ижил (зөвшөөрөгдөх).
- en гаралтад брэнд солигдсон (T1 брэнд дүрэм): AgentSkillsTab-ийн мессежүүд, «Paperclip managed» → «XO managed» (agent-skill-source.ts, CompanySkills.tsx), «Paperclip workspace» → «XO workspace»; en байт ижил байх зарчмаас ухамсартай гажсан.
- Browser шалгалт (2026-10-14, 3110, ED-ийн зөвшөөрлөөр нэг удаа асаасан, HMR): mn: /YB/skills (Суулгасан чадварууд, эрэмбэ «Хамгийн олон агенттай», «Шинэ хавтас», «8 чадвар», «Зохиогч:», «Ямар ч агентад идэвхжүүлээгүй»), Олох таб («Эх үүсвэр / Бүгд», «Суулгах боломжтой», «Заавал биш»), чадварын дэлгэрэнгүй («Чадварын студид нээх», «суулгалт / Од / Салаалах», Тойм / Файлууд / Хувилбарууд / Агентууд / Тухай, «Ангилаагүй», «Замыг хуулах / Шилжүүлэх»), салаалах хуудас («Чадвар салаалах», «Салаалж буй чадвар: …», «Салаа үүсгэх»), студи (сонгогч «Чадвар сонгох / САЯХАН ШИНЭЧИЛСЭН», засварлагч «Хувилбарын түүх», «Оролт болгон хадгалах», «ТУРШИЛТЫН АЖИЛЛАГААНУУД»), агентын чадварын таб («8-аас 0 идэвхтэй», «Зөвхөн хянагдана», «Сангаас авах боломжтой») Монголоор гарсан. en: дэлгэрэнгүй хуудас англиар хэвээр. Шалгалтын явцад олдож засагдсан: CompanySkills.tsx-ийн байршлын карт ба хавтасны тэмдэг «Unfiled» (ternary доторх мөр, T1 барьдаггүй) → tx("Unfiled"). Англиар үлдсэн (үлдэгдэл): серверийн sourceLabel «Paperclip bundled / Paperclip workspace», хувилбарын label «Initial version», туршилтын загварын нэр «Default test template» (серверийн өгөгдөл); FrontmatterPanel.tsx («Frontmatter», «Fields», «N issues», нийтлэг компонент, хүрээнээс гадуур); студийн хавтасны гарчиг «root» (SkillPaneTitle folder="root"); анхдагч салааны нэр «… Fork» (серверт хадгалагдах өгөгдөл). Release picker-ийг Process адаптер удирддаггүй тул browser-т харуулж чадаагүй; unit тестээр баталгаажсан.

## Ү6 7.10-д хөндсөн upstream файлууд

7.8 ба 7.9-ийн «Үлдэгдэл»-ийг хаасан: серверээс ирэх шошгыг клиент талд labels.ts helper-ээр буулгах, routines / skills / secrets / pipeline / workspace хуудсын англи үлдэгдэл, «Updated <time>» маягийн холимог өгүүлбэр (13 файл), InlineEntitySelector-ийн текст. tiers.ts-д 10 файл T1 болж нэмэгдсэн (BootstrapPendingPage өмнө нь c76922936-д). Тэмдэглэгээ 7.5-ын хүснэгттэй ижил. BASE c76922936. ED шийдвэр (2026-10-14): Х1 серверийн шошгыг клиент талд буулгана, танигдаагүй утга англиар буцна, серверийн код хөндөхгүй; Х2 *.production.tsx хүрээнээс гадуур; Х3 техникийн утга латинаар (keep-en +17); Х4 брэнд baseline-д labels.ts-ийн 3 мөр (ED зөвшөөрсөн). Нэр томьёо: Board «Удирдах зөвлөл» (каталогийн утга), stage «үе шат»; «New stage» анхдагч нэр англиар (хадгалагдах өгөгдөл).

| Файл | Өөрчлөлт |
|---|---|
| ui/src/components/BootstrapPendingPage.tsx | T1 (c76922936) |
| ui/src/pages/PipelineSettings.tsx | T1; «New stage» анхдагч нэр англиар (хадгалагдах өгөгдөл) |
| ui/src/pages/ExecutionWorkspaceDetail.tsx | T1; routines таб |
| ui/src/components/BuiltInBundlePanel.tsx | T1 |
| ui/src/components/FrontmatterPanel.tsx | T1 |
| ui/src/components/environment-variables-editor/index.tsx | T1 |
| ui/src/components/environment-variables-editor/Row.tsx | T1 |
| ui/src/components/environment-variables-editor/SecretPicker.tsx | T1 |
| ui/src/components/environment-variables-editor/CreateSecretPopover.tsx | T1 |
| ui/src/components/RepositoryEditor.tsx | T1; InlineEntitySelector-ийн prop гар tx |
| ui/src/pages/Secrets.tsx | гар утасны таб tx("proposals"), en «proposals» хэвээр |
| «Updated <time>» холимог өгүүлбэр (13 файл) | tx("Updated {{time}}", { time: relativeTime(…) }); relativeTime() өмнө нь mn-д орчуулагдсан |
| InlineEntitySelector дуудагчид (CommentThread, IssueProperties, RepositoryEditor гэх мэт) | noneLabel / searchPlaceholder / emptyMessage / loadingMessage гар tx (transform-ын allowlist-д байхгүй) |
| Routines / Skills / attention / decision queue файлууд | серверийн шошгыг labels.ts helper-ээр буулгасан, танигдаагүй утга англиар |

Хөндөгдөөгүй: серверийн код, *.production.tsx (Х2).

XO-ийн өмч: ui/src/xo/labels.ts (xoStatusLabel өргөтгөл; xoRoutineRunSourceLabel, xoRoutineTriggerLabel, xoRoutineHistoryValueLabel, xoSkillSourceLabel, xoSkillVersionLabel, xoSkillTestTemplateText, xoAttentionInteractionLabel, xoAttentionWhyNow, xoDecisionQueueSeedText шинэ), scripts/xo-i18n/tiers.ts (+10 файл T1), scripts/xo-brand/baseline.json (577/161 → 579/162: labels.ts-д 3 мөр нэмэгдсэн, серверийн мөртэй харьцуулах түлхүүр, ED зөвшөөрсөн; 5 файлд буурсан), ui/src/i18n/xo/* (keys=5240, +534; нэгтгэсэн t1 22, t3 179, t4 123, t5 24, t6 68, t7 14, t8 24, t11 54, t12 1; keep-en.json +17).

XO-ийн тестүүд: scripts/xo-i18n/tiers-y6-7-10.test.ts (нэмэлт), ui/src/xo/labels.test.ts (шинэ helper-ийн describe).

Gates (2026-10-14): xo:i18n:check OK 5240, xo:i18n:test 10 / 119, tsc 0, vitest (en) ui/src 624 файл / 6571 тест (эхний ажиллуулалтад нэг flaky тест унаж, дахин ажиллуулахад давсан), xo:brand-scan OK.

Үлдэгдэл (Ү6 7.10):
- ConnectionSetupFlow.tsx (4231 мөр, ~170 мөр текст) tiers-д ороогүй, англиар.
- *.production.tsx англиар үлдэнэ (Х2).
- InstanceExperimentalSettings-ийн бусад картын footnote / ariaLabel англиар.
- Жижиг хэллэг «Owner:», «revision N», «Remote revision N» англиар.
- Pipeline event-ийн actor «Paperclip» өөрчлөгдөөгүй.
- Серверээс ирэх мессеж (error.message) англиар.
- Агентад очих текст англиар.
- «Plan approval - {title}» seed текст буулгагдаагүй.
- Хөтчийн шалгалт (3110, mn, 2026-10-14): /YB/routines жагсаалт, дэлгэрэнгүй, түүх, /YB/skills ба студи (үндсэн хавтас; Frontmatter, YAML Латинаар), Нууц утгууд, Ирсэн, Шийдвэрүүд Монголоор. Жагсаалтын «All routines» (allLabel, FolderIconHeader) ба RoutineList-ийн archived/draft/paused шошгыг tx/xoStatusLabel-оор засав (en-д жижиг үсэг хэвээр). en-д нэг удаа харьцуулав: «All routines», «draft» англиар, кирилл зөвхөн өгөгдөлд. Pipeline тохиргоо (туршилтын gate унтраалттай) ба execution workspace (өгөгдөлгүй) хөтчөөр шалгагдаагүй, тестээр хамрагдсан. Шинэ үлдэгдэл: серверийн editableReason («Bundled Paperclip skills are read-only.» гэх мэт 4 утга), хянах самбарын «AGENTS / View all runs / Succeeded / Failed / Other», туршилтын бусад картын тайлбар.

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
