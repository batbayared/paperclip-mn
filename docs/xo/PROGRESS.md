# XO ахицын бүртгэл

## Ү6 7.17 Tier-гүй үлдсэн .tsx ба .ts-ийн англи UI мөр (2026-10-14)

Зорилго: tier-д ороогүй 21 .tsx бүрэлдэхүүн болон tier-гүй .ts helper-үүдийн хэрэглэгчид харагдах англи мөрийг орчуулах.

BASE e42211749.

| Хэсэг | Агуулга |
|---|---|
| Хүрээ | tiers.ts «// Ү6 7.17» блокт 21 .tsx; scripts/xo-i18n/tiers-y6-7-17.test.ts. .ts файлуудыг tier-д нэмээгүй (модулийн түвшний label-ыг transform ороох эрсдэлтэй), tx-ийг гараар тавьсан |
| .tsx manual | AgentBubbleActionRow, OutputFeedbackButtons, PipelineLivenessBanner → XoTrans; ExecutionParticipantPicker, ProjectRepositoryInput → tx |
| task-chat | tool-taxonomy xoExactCopy()/xoActionCopy(), toolActivityEnglishRunningLabel() (англи харьцуулалтад); task-chat-activity-presentation-ийн running/completed/failed/interrupted шошго; native-run-events, transcriptPresentation fallback |
| lib | workspace-access-state (thunk), status-card-state statusCardLifecycleLabel(), review-policy, pipeline-liveness, pipeline-item-detail, interrupt-handoff, inbox, issue-filters |
| Хайлт, adapter | search-filters searchSortLabel() + chip загвар, search-query-parser, adapter-display-registry тайлбар, paperclip-runner шошго ({{brand}}), generic-mcp-connect |
| Каталог | +468 түлхүүр (11309); «https://-ээр» хэлбэр locale-validation-д унасан тул mn утгыг дахин бичсэн |
| Шалгалт | xo:i18n check OK (11309), xo:i18n:test 438, UI 6585, tsc цэвэр, brand 487/150 |

Үлдэгдэл (шийдвэргүй, мэдээллийн чанартай):
- ui/src/lib/tool-installs.ts INSTALLED_HINT ашиглагдаагүй код байсан тул ED-ийн шийдвэрээр устгасан.
- Pipelines.tsx targetStageName-ийн fallback humanizePipelineItemStatus-ийг ашигладаг (зөвхөн дэлгэц).
- adapter-display-registry-д adapter-ийн бүтээгдэхүүний нэр англиар.
- Inbox-ийн mn эрэмбэлэлт орчуулсан шошгоор localeCompare хийнэ.
- completed-activity-summary.ts-ийн хураангуй шошго, task-chat-states.ts (зөвхөн lab) хөндөөгүй.

## Ү6 7.16 7.15-ын үлдэгдэл: хяналтын хугацаа, frontmatter шошго (2026-10-14)

Зорилго: 7.15-ын дараа үлдсэн хяналтын (monitor) хугацааны бичвэр ба импорт/экспортын frontmatter шошгыг орчуулах.

BASE 69d230b2e.

| Хэсэг | Агуулга |
|---|---|
| Хүрээ | tiers.ts «// Ү6 7.16» блокт lib/issue-monitor.ts; scripts/xo-i18n/tiers-y6-7-16.test.ts |
| issue-monitor | хугацааны нэгж, «in/overdue by/ago/now» tx-ээр; monitorEtaPhase() нэмсэн. Орчуулсан мөрийг англи литералтай харьцуулдаг 3 газар (IssueProperties, IssueBlockedNotice, IssueScheduledRetryCard) засагдсан |
| IssueProperties | хяналт/дахин оролдлогын мөрүүд (Cleared, checking momentarily…, Pending schedule, Retry/Continuation …) tx |
| frontmatter | CompanyImport, CompanyExport FrontmatterCard → frontmatterFieldLabel(); PackageFileTree дахин экспортолсон |
| Каталог | +15 түлхүүр; «due now» mn → «одоо» (баннерын өгүүлбэрт тохируулсан) |
| Шалгалт | xo:i18n check OK (10845), xo:i18n:test 417, UI 6585, tsc цэвэр, brand 505/152; 3110 mn/en хоёуланд функцийн гаралт шалгасан |

Үлдэгдэл (шийдвэргүй, мэдээллийн чанартай):
- ExternallyConnectedTaskBanner: «Unnamed attachment» дэлгэц дээр tx-тэй; сервер рүү очих payload-ын утга англиар үлдэнэ.
- ui/src/lib/tool-installs.ts INSTALLED_HINT ашиглагдаагүй код, устгаагүй.
- Пайплайны {{noun}} хэрэглэгчийн өгөгдөл; TEAMS_*_COMMAND_DESCRIPTION англиар (ED шийдвэр).

## Ү6 7.15 Tier-гүй үлдэгдэл, 2-р шат: пайплайн, агент, plugin, ажлын талбар, issue/case (2026-10-14)

Зорилго: 7.14-ийн дараа tier-гүй үлдсэн pages, components, adapters-ийг орчуулах.

BASE 2c6c90260. ED шийдвэр (2026-10-14): хадгалагддаг анхдагч нэр («My … subscription/API/account») болон AI_PROVIDERS-ийн subscription нэрийг орчуулна (бүтээгдэхүүний нэр Латинаар); TEAMS_*_COMMAND_DESCRIPTION англиар; хөгжүүлэгчийн туршилтын хуудас, IssueChatLongThreadPerf хасагдсан хэвээр.

| Хэсэг | Агуулга |
|---|---|
| Хүрээ | tiers.ts «// Ү6 7.15» блокт 206 файл; scripts/xo-i18n/tiers-y6-7-15.test.ts |
| Каталог | merge t1–t9; ганц/олон тооны 16 хос _one/_other болсон |
| Helper засвар | ai-connections/model.ts aiSubscriptionName(); agent-config-primitives (help → getter); FileTree frontmatterFieldLabel; lib/pipeline-breakdown.ts (хураангуй өгүүлбэр, механизмын жагсаалт, joinWithAnd «ба»); xo/labels.ts xoRunActionLabel() (WorkspaceRuntimeControls-ийн «Run» товч → «Ажиллуулах», en-д guard) |
| Хөтчөөр олдсон | NewAgent breadcrumb, PluginPage breadcrumb ба маршрутын зөрчлийн мэдэгдэл, CompanySettingsNav-ийн табууд (production Layout) |
| Нэр томьёо | skill → «ур чадвар» (7.15-ийн 3 утга засагдсан, y6-7-9-keys.test) |
| keep-en (+47) | бүтээгдэхүүний нэр, JSON жишээ, зам, үйлдлийн системийн нэр, Claim secret, OK, Debounce, Worktree, XO, {{sentence}}. г.м. |
| Брэнд | SystemNotice tone.label → tone.labelClass; TrustPresetSection-д XoTrans доторх {{brand}}-ийг {{product}} болгосон (глобал defaultVariables brand-ийг дарахгүй тул) |

Түлхүүр: 10831 (+2690).

### Шалгалтын үр дүн

- Gates (2026-10-14): xo:i18n:check OK keys=10831 (untranslated 0, manual 0), xo:i18n:test 415, ui tsc 0 алдаа, xo:brand-scan OK (baseline 552 / 160, одоо 505 / 152). vitest ui/src 6583 / 6585: y6-7-9-keys (skill) засагдаж давсан; CompanyEnvironments.test.tsx (хөндөөгүй файл) ачааллын үед унаж, дангаар давсан.
- Хөтчийн шалгалт (3110, mn): /YB/agents/new, company/settings/instance/plugins, adapters. Латин үсгээр бүтээгдэхүүний нэр, plugin-ийн манифестийн тайлбар (серверийн өгөгдөл) л үлдсэн. Pipelines хуудас энэ instance-д dashboard руу шилждэг тул хөтчөөр шалгаагүй. en горимд adapters англи хэвээр.

### Үлдэгдэл

- IssueMonitorBanner-ийн {{eta}}/{{time}} (lib/issue-monitor) англиар.
- CompanyImport, CompanyExport, PackageFileTree frontmatterFieldLabel-ийг хэрэглээгүй.
- ExternallyConnectedTaskBanner «Unnamed attachment» серверт илгээгддэг тул англиар.
- lib/tool-installs.ts INSTALLED_HINT ашиглагдахгүй болсон (устгаагүй).
- Pipeline-ийн хэсгийн нэр ({{noun}}) хэрэглэгчийн тохируулсан англи үг хэвээр.

## Ү6 7.14 Tier-гүй үлдэгдэл, 1-р шат: apps, tools, холболт (2026-10-14)

Зорилго: 7.13-ын тооллогоор tier-гүй үлдсэн файлуудаас apps, tools, холболтын хэсгийг орчуулах.

Төлөвлөгөө: docs/superpowers/plans/2026-10-14-xo-y6-7-14-apps-tools.md. BASE 732c337e9.

ED шийдвэр (2026-10-14): хөгжүүлэгчийн туршилтын 11 хуудсыг (DesignGuide, *UxLab, TaskChatLab, fixtures/, connect-flow-preview-main) хасна. Үлдсэнийг хоёр шатанд: 7.14 = pages/apps, pages/tools, components/chat, components/ai-connections, features/connections; 7.15 = бусад pages, components, adapters (~2000 түлхүүр).

| Хэсэг | Агуулга |
|---|---|
| Хүрээ | tiers.ts «// Ү6 7.14» блокт 62 файл; scripts/xo-i18n/tiers-y6-7-14.test.ts |
| Каталог | merge t1–t9 (алгассан түлхүүр 0). en шинэ түлхүүр identity, 32 _one/_other plural нь эх англи утгатай |
| Нэр томьёо | identity → «таниулбар» (Identifier → «Таних тэмдэг» хэвээр). Давхцсан 11 түлхүүрийн сонголт: Gateway created «Гарц үүслээ», Token issued «Токен олголоо», Token revoked «Токеныг хүчингүй болголоо», Profile updated «Профайлыг шинэчиллээ», Organization default «Байгууллагын анхдагч», Client snippets «Клиентийн жишээ код» г.м. |
| keep-en (+18) | {{durationMs}}ms, {{latencyMs}}ms, agentmail.to, Application / Client ID, Application ID, Authorization, Authorization header, Bot User OAuth Token, Directory / Tenant ID, Endpoint URL, Events API, Header, ID: {{id}}, Interactivity, p{{priority}}, Project ID, Server ID, Signing Secret |
| Helper засвар | gateway-helpers.ts (scope, owner, tools тоо, attention), ai-connections/model.ts (аргын шошго, төлөв, binding асуудал; aiConnectionStatusLabel), app-tabs.ts (табын шошго tx, баримтын гарчиг «Permissions» засагдсан) |
| Брэнд | Түлхүүрт «Paperclip» литералтай 3 мөрийн mn утгад {{brand}} биш «XO» (parity.test) |

Түлхүүр: 8141 (+1613).

### Шалгалтын үр дүн

- Gates (2026-10-14): xo:i18n:check OK keys=8141 (untranslated 0), xo:i18n:test 209, ui tsc 0 алдаа, xo:brand-scan OK (baseline 552 / 160, одоо 522). vitest ui/src 6584 / 6585: CompanyEnvironments.test.tsx (хөндөөгүй файл) ачааллын үед нэг удаа унаж, дангаар 32 / 32 хоёр удаа давсан.
- Хөтчийн шалгалт (3110, mn): /YB/apps, /apps/chat, gateways, review, tools/profiles, tools/gateways, advanced/paste, smoke-lab, app-ийн эрхийн хуудасны гарчиг. Латин үсгээр зөвхөн бүтээгдэхүүний нэр үлдсэн. en горимд gateways, advanced/paste англи хэвээр.

### 7.15-д үлдсэн

- Бусад pages, components, adapters (~2000 түлхүүр).
- Хадгалагддаг анхдагч нэр («My … account», «Unnamed attachment») англиар.
- TEAMS_*_COMMAND_DESCRIPTION тогтмолууд англиар.
- AI_PROVIDERS-ийн бүтээгдэхүүний subscription нэр англиар.

## Ү6 7.13 7.12-ийн үлдэгдэл (2026-10-14)

Зорилго: 7.12-ийн «Үлдэгдэл» 3 зүйлийг хааж, хөтчөөр шинэ үлдэгдэл хайх.

Төлөвлөгөө: docs/superpowers/plans/2026-10-14-xo-y6-7-13-leftovers.md. BASE 11b6344c0.

ED шийдвэр (2026-10-14): *.production.tsx оруулна (өмнөх «хасах» шийдвэрийг цуцалсан). Activity-ийн дотоод action-д үйл үг нэмнэ (7.11-ийн шийдвэрийг цуцалсан). en горимд функц доторх брэнд BASE-ийн «Paperclip» хэвээр.

| Хэсэг | Агуулга |
|---|---|
| en брэнд | labels.ts xoBrandVars(): mn → XO, en → Paperclip. ConnectionSetupFlow (14), IssueRunLedger (2), AuditTab (1), Agents.production, CompanySkills.production, IssueRecoveryActionCard, app-gallery-copy |
| *.production.tsx | CompanySkills, AppConnectionSidebar, AppsSidebar, routine-sections/editable-sections, OrgChart, RoutineDetail, Routines, audit/AuditFeed, audit/CompanyActivity tiers-д (+9); SidebarAgents, SidebarAccountMenu, Agents, Costs, AgentDetail (.production) функц доторх мөр tx |
| Activity | activity-format.ts XO_ACTIVITY_ROW_VERBS-д 312 action (нийт 581); en-д fallback хэвээр |
| Хөтчийн олдвор | Artifacts, ArtifactCard, ArtifactGroupCard, apps/Browse, IssueRecoveryActionCard, FinanceTimelineCard, SidePanelFrame tiers-д (+7); recovery-lineage.ts, app-gallery-copy.ts (localizedAppDescription: mn-д манифестын тайлбарын загвар) гар tx; Inbox/IssuesList aria, AgentDetail «Adapter default», InstanceGeneralSettings dev зөвлөмж (XoTrans), Costs.tsx санхүүгийн хоосон мэдэгдэл |

Түлхүүр: 6528 (+614).

### Шалгалтын үр дүн

- Gates (2026-10-14): xo:i18n:check OK keys=6528 (untranslated 0, orphan 0), xo:i18n:test 147, ui tsc 0 алдаа, vitest ui/src 625 файл / 6585 (CompanySettings.test нэг тест ачааллын үед унаж, дангаар давсан). xo:brand-scan OK 552 / 160 (566 / 161-ээс буурсан; ED-ийн зөвшөөрлөөр --update, labels.ts 4 → 5 нь xoBrandVars-ийн en «Paperclip» литерал).
- Хөтчийн шалгалт (3110, mn): /apps, /artifacts, /activity, /activity/costs, /inbox дээр Латин үлдэгдэл бүтээгдэхүүний нэрээс өөр алга. en горимд /apps-ийн тайлбар эх англи хэвээр.

### Tier-д ороогүй файлын тооллого (дараагийн шатны шийдвэрт)

ui/src дотор T1-д ороогүй, англи мөртэй 312 файл, mn-д байхгүй ~4134 түлхүүр (2026-10-14, BASE 11b6344c0). Томоос нь: DesignGuide 319, Pipelines 178, apps/chat/ChatEndpointSetup 130, InviteUxLab 103, ChatEndpointDetail 94, RunnerInspector 93, TeamCatalog 92, AgentConfigForm 72, tools/ProfilesTab 69. ui/src/pages/apps/ (36 файл, Browse-оос бусад) ба pages/tools/* бүхэлдээ tier-гүй. 7.13 зөвхөн үндсэн хуудсанд хөтчөөр олдсоныг хаасан.

## Ү6 7.12 7.11-ийн үлдэгдэл (2026-10-14)

Зорилго: 7.11-ийн үлдэгдлийг хаах: dev серверийн «RESTART REQUIRED» баннер, IssueRunLedger-ийн тоолуур ба run.status, local-board хэрэглэгчийн «Board» нэр, нэр томьёоны засвар. Серверийн код хөндөгдөөгүй. en гаралт 1252e0d74-тэй байт ижил.

Төлөвлөгөө: docs/superpowers/plans/2026-10-14-xo-y6-7-12-leftovers.md. BASE 1252e0d74.

ED шийдвэр (2026-10-14): *.production.tsx хүрээнээс гадуур хэвээр. Нэр томьёог Claude засаж, өмнө ба дараах утгыг тайлагнана.

| Хэсэг | Агуулга |
|---|---|
| DevRestartBanner | tiers «// Ү6 7.12» (+1 файл); describeReason, live run ганц/олон тоо, confirm («Restart Paperclip now?» түлхүүр литерал, mn-д XO), алдаа, « +{{n}} more», «Waiting for …», XoTrans <code>pnpm dev:once</code> |
| IssueRunLedger | statusLabel → xoStatusLabel (en-д хуучин replace), «+{{n}} more», «{{n}} older items not shown» |
| company-members.ts | fallbackUserLabel ба baseMemberLabel: local-board хэрэглэгчийн «Board» нэр mn-д «Удирдах зөвлөл» |
| SidebarAccountMenu | local-board-ийн «Board» нэр mn-д «Удирдах зөвлөл» (аватар «УЗ») |
| mn.json | нэр томьёоны 4 засвар (доор) |

Нэр томьёоны засвар (mn.json):

| Түлхүүр | Өмнө | Дараа |
|---|---|---|
| Integration smoke | Интеграцийн шалгалт | Интеграцийн шуурхай шалгалт |
| on behalf of {{responsibleLabel}} | {{responsibleLabel}}-ийн нэрийн өмнөөс | нэрийн өмнөөс: {{responsibleLabel}} |
| Acting on behalf of {{onBehalfOfLabel}} | {{onBehalfOfLabel}}-ийн нэрийн өмнөөс ажиллаж байна | Нэрийн өмнөөс ажиллаж байна: {{onBehalfOfLabel}} |
| Posted on behalf of {{user}} | {{user}}-ийн нэрийн өмнөөс нийтэлсэн | Нэрийн өмнөөс нийтэлсэн: {{user}} |

Каталогийн бусад газартай нийцүүлэхээр хэвээр үлдээсэн: «Товлосон heartbeat» (heartbeat бүх газар латинаар), «орчны түрээс» («Сэндбоксын N түрээс»-тэй ижил), «Idempotent баталгаа» (техникийн нэр томьёо), «хариуцагч оноолоо:».

Түлхүүр: 5914 (+20).

### Шалгалтын үр дүн

- Gates (2026-10-14): xo:i18n:check OK keys=5914, xo:i18n:test 12 файл / 131, ui tsc 0 алдаа, xo:brand-scan OK 566 / 161. vitest ui/src 625 файл / 6582: машины ачаалал өндөр (load 24) үед ажиллуулалт бүрт өөр 2–5 тест timeout-д унасан (IssueDetail, NewAgent, AgentConfigForm, IssueProperties, CompanySettings); тусад нь ажиллуулахад бүгд давсан, 7.12-ийн файлтай холбоогүй.
- Хөтчийн шалгалт (3110, mn): dev баннер бүхэлдээ Монголоор («ДАХИН ЭХЛҮҮЛЭХ ШААРДЛАГАТАЙ», «сервер асснаас хойш backend файлууд өөрчлөгдсөн · шинэчилсэн 4 мин өмнө», «Одоо дахин эхлүүлэх»), /YB/activity «нэрийн өмнөөс: Удирдах зөвлөл», хажуугийн цэс «УЗ Удирдах зөвлөл», даалгаврын «Үүсгэгч: Удирдах зөвлөл». en-д нэг удаа харьцуулав: баннер, «Originating Board», хажуугийн цэс «BO Board» хуучин хэвээр.
- IssueRunLedger Streamlined UI-ийн даалгаврын хуудсанд харагдаагүй; transform тест (tiers-y6-7-12.test.ts) ба unit тестээр баталгаажсан.

## Ү6 7.11 Үлдэгдэл (2026-10-14)

Зорилго: 7.10-ын «Үлдэгдэл»-ийг хаах: серверийн changeSummary / editableReason / «Plan approval - {title}»-ийг labels.ts helper-ээр буулгах, Activity бүртгэлийн хэрэглэгчид харагдах action-ууд, хянах самбар, ConnectionSetupFlow, туршилтын тохиргооны карт, аудит хуудсууд, recovery шошго. Серверийн код хөндөгдөөгүй. en гаралт d36e28452-тэй байт ижил (брэндийн гажилтыг доор бичсэн).

Төлөвлөгөө: docs/superpowers/plans/2026-10-14-xo-y6-7-11-leftovers.md. BASE d36e28452.

ED шийдвэр (2026-10-14): Х1 Activity-д зөвхөн хэрэглэгчид харагдах action-ыг орчуулна, дотоод action (test.*, auth.*, runner.*, provider_trace.*, native.*, tool_gateway.* г.м.) англи fallback-аар үлдэнэ. Х2 серверийн changeSummary, editableReason, «Plan approval - {title}» → labels.ts helper (xoRoutineChangeSummary, xoSkillEditableReason, xoAttentionTitle), танигдаагүй утга англиар. Х3 брэнд baseline-д labels.ts 3 → 4 (серверийн «Bundled Paperclip skills are read-only.» мөртэй харьцуулах литерал, ED зөвшөөрсөн). Өмнөх шийдвэр хэвээр: *.production.tsx хүрээнээс гадуур, техникийн утга латинаар, Board «Удирдах зөвлөл», stage «үе шат».

| Task | Агуулга |
|---|---|
| 1 | labels.ts-ийн 3 helper, дуудагч 7 файл |
| 2 | activity-format.ts: XO_ACTIVITY_ROW_VERBS (176 action, xoActivityRowVerb guard-аар en-д fallback), ActivityRow-ийн System / Board / Unknown actor |
| 3 | ActiveAgentsPanel, ActivityCharts, SmokeLabDashboardCard, DashboardLive |
| 4 | InstanceExperimentalSettings (31 footnote / aria-label), IssuePlanDecompositionsSection, ConnectionSetupFlow, pipeline-item-detail (actor brand) |
| 5 | tiers.ts «// Ү6 7.11» блок (+6 файл), tiers-y6-7-11.test.ts, y6-7-11-keys.test.ts, каталог |
| 7 | AuditFeed, AuditTab, IssueRunLedger, CommentAttributionChip (tiers +4), environment.lease_* үйл үг |
| 8 | recovery-display.ts-ийн recoveryChipLabel (6 шошго); BootstrapPendingPage-ийн <link> tag-ийг <anchor> болгосон |

Түлхүүр: 5894 (7.10-ын төгсгөл 5240, +654). keep-en.json +4 (Client ID, Client secret, Vercel Connect, Zapier MCP URL).

### Шалгалтын үр дүн

- Gates (2026-10-14): xo:i18n:check OK keys=5894, xo:i18n:test 11 файл / 129, ui tsc 0 алдаа, vitest ui/src 625 файл / 6582 тест, xo:brand-scan OK 566 / 161.
- Хөтчийн шалгалт (3110, mn): хянах самбар («АГЕНТУУД», «Бүх ажиллагааг харах», Амжилттай / Амжилтгүй / Бусад), туршилтын тохиргоо, чадварын read-only tooltip («XO-ийн багцад орсон чадварууд зөвхөн уншигдана.»), тогтмол ажлын түүх («Идэвхжүүлэгч үүсгэсэн: хуваарь»), Ирсэн хайрцгийн recovery шошго, /YB/activity аудит (шүүлтүүр, «CSV экспортлох», «орчны түрээсийг суллалаа», «Удирдах зөвлөл-ийн нэрийн өмнөөс») Монголоор. en-д нэг удаа харьцуулав: аудит хуудас англиар, кирилл зөвхөн өгөгдөлд.
- Хөтчийн шалгалтын явцад нэмэгдсэн хүрээ: аудит хуудсууд (Task 7), recovery шошго ба BootstrapPendingPage anchor (Task 8).

### Хязгаарлалт ба үлдэгдэл

- *.production.tsx англиар.
- Хөгжүүлэлтийн «RESTART REQUIRED» баннер англиар.
- Activity-ийн дотоод action-ууд англи fallback; аудит мөрөнд action id (issue.successful_run_handoff_escalated) ба entity төрөл (environment_lease) техникийн утгаараа харагдана.
- IssueRunLedger: «+{n} more», «{n} older items not shown», statusLabel(run.status) англиар.
- company-members.ts-ийн «Board» шошго AuditFeed-ээс бусад газар англиар гарч магадгүй; хажуу цэсний хэрэглэгчийн нэр «Board» (өгөгдөл).
- en гаралтад брэнд солигдсон: ConnectionSetupFlow-ийн {{brand}} мөрүүд en-д «XO» гэж гарна; pipeline-item-detail ба InstanceExperimentalSettings-ийн 2 aria-label locale guard-аар en-д «Paperclip» хэвээр.
- Хянах нэр томьёо: «Интеграцийн шалгалт», «Товлосон heartbeat», «хариуцагч оноолоо:», «Idempotent баталгаа», «GitHub-ийг дараах байдлаар холбох», «орчны түрээс», decision.expired, budget.soft_threshold_crossed.

## Ү6 7.10 Үлдэгдэл (2026-10-14)

Зорилго: 7.8 ба 7.9-ийн «Үлдэгдэл»-ийг хаах: серверээс ирэх шошгыг клиент талд labels.ts helper-ээр орчуулах, routines / skills / secrets / pipeline / workspace хуудсын англи үлдэгдэл, «Updated <time>» маягийн холимог өгүүлбэр, InlineEntitySelector-ийн текст. Серверийн код хөндөгдөөгүй. en гаралт c76922936-тэй байт ижил (брэндийн baseline-ийн өөрчлөлтийг доор бичсэн).

Төлөвлөгөө: docs/superpowers/plans/2026-10-14-xo-y6-7-10-leftovers.md. BASE c76922936 (5e9ee3084 + BootstrapPendingPage-ийн 7.10 commit).

ED шийдвэр (2026-10-14): Х1 серверийн шошгыг клиент талд labels.ts helper-ээр буулгана (xoStatusLabel өргөтгөл, xoRoutineRunSourceLabel, xoRoutineTriggerLabel, xoRoutineHistoryValueLabel, xoSkillSourceLabel, xoSkillVersionLabel, xoSkillTestTemplateText, xoAttentionInteractionLabel, xoAttentionWhyNow, xoDecisionQueueSeedText); танигдаагүй утга англиар буцна, серверийн код хөндөхгүй. Х2 *.production.tsx хүрээнээс гадуур. Х3 техникийн утга латинаар (keep-en +17). Х4 брэнд baseline-д labels.ts-ийн 3 мөр нэмэгдэнэ (серверийн мөртэй харьцуулах түлхүүр, ED зөвшөөрсөн).

Батлагдсан нэр томьёо: Board «Удирдах зөвлөл» (каталогийн утга), stage «үе шат». «New stage» анхдагч нэр англиар (хадгалагдах өгөгдөл).

| Task | Commit |
|---|---|
| 0 BootstrapPendingPage (эхний админы дэлгэц) | c76922936 |
| 1–10 labels.ts helper, tiers +10 файл, 13 файлын «Updated <time>», каталог, тест, SYNC.md ба бүртгэл | d36e28452 |

Түлхүүр: 5240 (7.9-ын төгсгөл 4706, 7.10-д +534). Нэгтгэсэн түлхүүр: t1 22, t3 179, t4 123, t5 24, t6 68, t7 14, t8 24, t11 54, t12 1.

Төлөв: BootstrapPendingPage commit хийсэн, бусад нь working tree-д, commit ба push хийгээгүй.

### Шалгалтын үр дүн

- Gates (2026-10-14): xo:i18n:check OK keys=5240, xo:i18n:test 10 файл / 119, ui tsc 0 алдаа, vitest (VITE_XO_DEFAULT_LOCALE=en) ui/src 624 файл / 6571 тест passed (эхний ажиллуулалтад нэг flaky тест унаж, дахин ажиллуулахад давсан), xo:brand-scan OK 579 / 162.
- keep-en.json +17 (техникийн утга латинаар).
- Хөтчийн шалгалт (3110, mn, 2026-10-14): /YB/routines жагсаалт, дэлгэрэнгүй, түүх, /YB/skills ба студи (үндсэн хавтас; Frontmatter, YAML Латинаар), Нууц утгууд, Ирсэн, Шийдвэрүүд Монголоор. Жагсаалтын «All routines» (allLabel, FolderIconHeader) ба RoutineList-ийн archived/draft/paused шошгыг tx/xoStatusLabel-оор засав (en-д жижиг үсэг хэвээр). en-д нэг удаа харьцуулав: «All routines», «draft» англиар, кирилл зөвхөн өгөгдөлд. Pipeline тохиргоо (туршилтын gate унтраалттай) ба execution workspace (өгөгдөлгүй) хөтчөөр шалгагдаагүй, тестээр хамрагдсан. Шинэ үлдэгдэл: серверийн editableReason («Bundled Paperclip skills are read-only.» гэх мэт 4 утга), хянах самбарын «AGENTS / View all runs / Succeeded / Failed / Other», туршилтын бусад картын тайлбар.

### Хязгаарлалт

- relativeTime() өмнө нь mn-д орчуулагдсан байсан; «Updated <time>» маягийн холимог өгүүлбэрийг 13 файлд tx("Updated {{time}}", …) болгож засав.
- *.production.tsx англиар (Х2).
- InlineEntitySelector-ийн noneLabel / searchPlaceholder / emptyMessage / loadingMessage prop transform-ын allowlist-д байхгүй тул гар tx.
- Secrets-ийн гар утасны таб tx("proposals"): en «proposals» хэвээр.
- Брэнд baseline 577/161 → 579/162: labels.ts-д 3 мөр нэмэгдсэн (серверийн мөртэй харьцуулах түлхүүр, ED зөвшөөрсөн), 5 файлд буурсан.
- Англиар үлдсэн (үлдэгдэл): ConnectionSetupFlow.tsx (4231 мөр, ~170 мөр текст, tiers-д ороогүй); *.production.tsx; InstanceExperimentalSettings-ийн бусад картын footnote / ariaLabel; жижиг хэллэг «Owner:», «revision N», «Remote revision N»; pipeline event-ийн actor «Paperclip»; серверийн error.message; агентад очих текст; «Plan approval - {title}» seed буулгагдаагүй.

## Ү6 7.9 — Skills (2026-10-14)

Зорилго: чадварын (skill) Streamlined UI-г монгол болгох: /YB/skills (CompanySkills.tsx: Суулгасан / Олох / Бүтээх табууд, шүүлтүүр, эрэмбэ, суулгах ба импортын урсгал), хавтасны мод (SkillFolderTree.tsx, reservedRootLabel), хажуу самбар, Чадварын студи (SkillStudio.tsx, lib/skill-studio.ts), төслөөс импортлох цонх, агентын чадварын таб ба гаргалт сонгогч, skill-studio цонхнууд (Салаалах, чадвар ашигладаг агентууд, гарал үүсэл), lib/skill-policy-denial.ts-ийн клиент текст. en гаралт 9282a6b0c-тэй байт ижил (брэндийн үл хамаарах зүйлийг доор бичсэн).

Төлөвлөгөө: docs/superpowers/plans/2026-10-14-xo-y6-7-9-skills.md. BASE 9282a6b0c.

ED шийдвэр: Х1 нэг давалгаа. Х2 зөвхөн Streamlined хувилбар, CompanySkills.production.tsx англиар. Х3 lib/skill-policy-denial.ts-ийн клиент текстийг орчуулна, серверийн error.message англиар. Х4 Skill Studio «Чадварын студи», Fork «Салаалах» (forked «салаалсан»), release «гаргалт» («Бета гаргалт»), табууд «Суулгасан / Олох / Бүтээх».

Батлагдсан нэр томьёо: Star «Од» (Starred «Одтой», tooltip «…одоор тэмдэглэх»), Move «шилжүүлэх», Forked from «Салаалсан эх:», Optional «Заавал биш», Trust «Итгэмжлэл», core «үндсэн», actor «гүйцэтгэгч», managed-skill directory «удирддаг чадварын хавтас», Most forks «Хамгийн олон салаатай». Import-ын бичлэгийг mn каталог даяар «импортлосон / Импортлож» болгож нэгтгэв (19 + 2 утга). Ганц breadcrumb «Студи» ба «Студийн цэс» хэвээр.

| Task | Commit |
|---|---|
| 1 labels.ts: xoSkillSourceFilterLabel, xoSkillDiscoverySortLabel, xoSkillReservedRootLabel, xoSkillPolicyDenialTitle, xoSkillPolicyDenialRemediation | 2fee577a7 |
| 2 CompanySkills.tsx (шүүлтүүр, эрэмбэ, toast, managed шошго, суулгах/импортын урсгал) | 601852d9c |
| 3 SkillStudio.tsx (confirm, toast, загвар, «Restore as v…»), lib/skill-studio.ts (reason текст) | 3b279aa2c |
| 4 ImportSkillsFromProjectDialog.tsx (XoTrans, импортын toast ганц/олон) | 20e1bd709 |
| 5 SkillFolderTree.tsx, skill-folder-tree.ts (reservedRootLabel, «New organization folder», «Move to …») | 88d8830bd |
| 6 AgentSkillsTab.tsx, AgentSkillRow.tsx, AgentSkillReleasePicker.tsx, agent-skill-source.ts, lib/skill-policy-denial.ts | 29be6d5bc |
| 7 AgentsUsingSkillDialog.tsx, ForkSkillDialog.tsx, SkillProvenance.tsx, lib/skill-fork.ts | a8f63a19f |
| 8 tiers.ts (12 файл T1), каталог (+662 түлхүүр), y6-7-9-keys тест, tiers-y6-7-9 тест, labels тест | 53206d6bf |
| 9 SYNC.md ба бүртгэл | энэ commit |

Түлхүүр: 4706 (7.8-ын төгсгөл 4044, 7.9-д +662).

Төлөв: Task 1–8 commit хийсэн, push хийгээгүй. Task 9: SYNC.md, PROGRESS.md, browser шалгалт хийгдсэн; шалгалтаар олдсон «Unfiled» засвар энэ commit-д.

### Шалгалтын үр дүн

- Gates (2026-10-14): xo:i18n:check OK keys=4706 (+662), xo:i18n:test 109/109 (9 файл), xo:i18n:typecheck цэвэр, xo:brand-scan 161 файл / 577 (baseline 585/161-ээс доош), ui tsc цэвэр, vitest (VITE_XO_DEFAULT_LOCALE=en) ui/src 623 файл / 6561 тест passed, vitest ui/src/i18n/xo ui/src/xo 200/200.
- keep-en.json +9: «· v{{revisionNumber}}», «git», «GitHub», «SKILL.md», «Slug», «v{{packageVersion}}», «v{{revision}}», «v{{revisionNumber}}», «v{{version}}».
- Browser шалгалт (2026-10-14, 3110, ED-ийн зөвшөөрлөөр нэг удаа асаасан, HMR): mn: /YB/skills (Суулгасан чадварууд, эрэмбэ «Хамгийн олон агенттай», «Шинэ хавтас», «8 чадвар», «Зохиогч:», «Ямар ч агентад идэвхжүүлээгүй»), Олох таб («Эх үүсвэр / Бүгд», «Суулгах боломжтой», «Заавал биш»), чадварын дэлгэрэнгүй («Чадварын студид нээх», «суулгалт / Од / Салаалах», Тойм / Файлууд / Хувилбарууд / Агентууд / Тухай, «Ангилаагүй», «Замыг хуулах / Шилжүүлэх»), салаалах хуудас («Чадвар салаалах», «Салаалж буй чадвар: …», «Салаа үүсгэх»), студи (сонгогч «Чадвар сонгох / САЯХАН ШИНЭЧИЛСЭН», засварлагч «Хувилбарын түүх», «Оролт болгон хадгалах», «ТУРШИЛТЫН АЖИЛЛАГААНУУД»), агентын чадварын таб («8-аас 0 идэвхтэй», «Зөвхөн хянагдана», «Сангаас авах боломжтой») Монголоор гарсан. en: дэлгэрэнгүй хуудас англиар хэвээр. Шалгалтын явцад олдож засагдсан: CompanySkills.tsx-ийн байршлын карт ба хавтасны тэмдэг «Unfiled» (ternary доторх мөр, T1 барьдаггүй) → tx("Unfiled"). Англиар үлдсэн (үлдэгдэл): серверийн sourceLabel «Paperclip bundled / Paperclip workspace», хувилбарын label «Initial version», туршилтын загварын нэр «Default test template» (серверийн өгөгдөл); FrontmatterPanel.tsx («Frontmatter», «Fields», «N issues», нийтлэг компонент, хүрээнээс гадуур); студийн хавтасны гарчиг «root» (SkillPaneTitle folder="root"); анхдагч салааны нэр «… Fork» (серверт хадгалагдах өгөгдөл). Release picker-ийг Process адаптер удирддаггүй тул browser-т харуулж чадаагүй; unit тестээр баталгаажсан.

### Хязгаарлалт

- CompanySkills.production.tsx англиар (Х2).
- Серверийн error.message англиар (Х3); skill-policy-denial-д серверээс ирсэн remediation-ийг орчуулахгүй, зөвхөн клиентийн анхдагч текст ба PLATFORM_TITLES / PLATFORM_REMEDIATIONS (кодоор) орчуулагдана.
- Хадгалагдах ба серверт очих өгөгдөл англиар: skill-create.ts-ийн анхдагч skill агуулга (агентад очдог), хувилбарын label «Restore of vN» (SkillStudio, const restoreLabel болгож салгасан), хуулбарын анхдагч нэр «{name} copy».
- «Slug» ба «Agent Skills markdown» латинаар үлдсэн.
- Суулгалт ба хувилбарын тооны _one / _other mn утга ижил (зөвшөөрөгдөх).
- en гаралтад брэнд солигдсон (T1 брэнд дүрэм, «Paperclip» → «{{brand}}», en «XO»): AgentSkillsTab-ийн adapter / ACP / OpenClaw мессеж, Runner тэмдэглэл, materialization тэмдэглэл; «Paperclip managed» → «XO managed» (agent-skill-source.ts, CompanySkills.tsx); CompanySkills-ийн «…in the Paperclip workspace.» → «XO workspace». en байт ижил байх зарчмаас ухамсартай гажсан.
- Эх код өөрчлөгдөөгүй: SkillsContextualSidebar.tsx ба SkillPolicySurfaces.tsx (зөвхөн tiers.ts-ээр T1), skills-navigation.ts, agent-skill-filter.ts, skill-create.ts.

## Ү6 7.8 — Routines (2026-10-14)

Зорилго: тогтмол ажлын (routine) Streamlined UI-г монгол болгох: жагсаалт (/YB/routines), дэлгэрэнгүй (/YB/routines/:id: overview, triggers, schedule, variables, secrets, delivery, runs, activity, history), хуваарь засварлагч, хувьсагч, хадгалах самбар, хувилбарын түүх, cron тайлбар (lib/cron-readable.ts), галлагааны урьдчилсан харагдац (lib/cron-fires.ts). en гаралт 83326f71b-тэй байт ижил (нэг үл хамаарах зүйлийг доор бичсэн).

Төлөвлөгөө: docs/superpowers/plans/2026-10-13-xo-y6-7-8-routines.md. BASE 83326f71b.

ED шийдвэр: Х1 зөвхөн Streamlined хувилбар, *.production.tsx үлдэгдэлд. Х2 загвар/агентад очих текст (routine prompt, comment body) англиар. Х3 серверийн мессеж хүрээнээс гадуур.

Батлагдсан нэр томьёо: trigger «идэвхжүүлэгч», delivery «хүргэлт», signing mode «гарын үсгийн горим», catch-up «нөхөн ажиллуулалт», concurrency / catch-up policy «зэрэгцээ ажиллагааны / нөхөн ажиллуулах бодлого», activity gate «идэвхжилийн нөхцөл», version history «хувилбарын түүх», cron англиар.

| Task | Commit |
|---|---|
| 1 labels.ts: routine хэсэг, trigger kind, signing mode ба тайлбар, disposition, гараг, талбарын helper-ууд | 3e9bafa1f |
| 2 RoutineDetail.tsx (хэсгийн гарчиг, хуулах toast), RoutineSaveBar.tsx (талбарын шошго) | 01e1c96ee |
| 3 Routines.tsx (зөөх toast), ManagedRoutinesList.tsx («Missing …»), RoutineContextualSidebar.tsx (Routine fallback) | 0a81da537 |
| 4 editable-sections.tsx, RoutineTriggerCard.tsx, ScheduleEditor.tsx (mn 24 цаг), cron-readable.ts, cron-fires.ts | b0d194fc0 |
| 5 RoutineHistoryTab.tsx (diff шошго, env/trigger талбар, actor), operate-sections.tsx (Run fallback) | a7626461b |
| 6 RoutineVariablesEditor.tsx (XoTrans, литерал хаалт), RoutineRunVariablesDialog.tsx (selector текст) | f0353445f |
| 7 tiers.ts (16 файл T1), каталог (+397 түлхүүр), y6-7-8-keys тест, tiers-y6-7-8 тест, labels тест | 62ba43c17 |
| 8 SYNC.md ба бүртгэл | энэ commit |

Түлхүүр: 4044 (7.7-ын төгсгөл 3647, 7.8-д +397).

Төлөв: Task 1–7 commit хийсэн, push хийгээгүй. Task 8: SYNC.md, PROGRESS.md, browser шалгалт хийгдсэн (3110 restart хийгээгүй, HMR).

### Шалгалтын үр дүн

- Gates (2026-10-14): xo:i18n:check OK keys=4044 (+397), xo:i18n:test 97/97, xo:i18n:typecheck цэвэр, xo:brand-scan 161 файл / 585 (baseline 586/161-ээс доош), ui tsc цэвэр, vitest (VITE_XO_DEFAULT_LOCALE=en) 622 файл / 6552 тест passed.
- ScheduleEditor: mn-д цагийн сонголт 24 цагийн хэлбэрээр «00»–«23» (padStart), en 12 цагийн хэлбэр (12 AM … 11 PM) хэвээр.
- Browser шалгалт (2026-10-14, 3110, restart хийгээгүй, HMR): туршилтын «Туршилт 7.8» routine үүсгэж, хуваарийн идэвхжүүлэгч нэмэв. mn: жагсаалт, үүсгэх цонх («Агент: / төсөл: / хавтас:»), triggers (cron тайлбар «Өдөр бүр 10:00 цагт», цаг 00–23), overview, variables («{{placeholder}}» хаалт зөв), delivery (бодлого, «Дараагийн 5 идэвхжилт», «нэгтгэгдэнэ / дараалалд орно»), history («хув. N», талбарын шошго) Монголоор гарсан. en: triggers (12 цаг AM/PM), delivery англи хэвээр. Англиар үлдсэн (үлдэгдэл): толгойн «Draft» төлөвийн тэмдэг; RoutineOverview L178 «No runs yet» (JSX attribute доторх ternary, T1 барьдаггүй); secrets хэсгийн орчны хувьсагчийн засварлагч («No environment variables», «Add variable»); history-ийн enum утгууд (medium, paused, coalesce if active, skip missed, SCHEDULE); серверийн өгөгдөл: идэвхжүүлэгчийн анхдагч label «schedule», changeSummary, activity event нэрс.

### Хязгаарлалт

- *.production.tsx гурван хувилбар англиар (Х1). ExecutionWorkspaceDetail-ийн routines таб, BuiltInBundlePanel, PipelineSettings хүрээнээс гадуур.
- Routine prompt ба агентад очих текст англиар (Х2); серверийн мессеж англиар (Х3). lib/cron-fires.ts-ийн throw new Error мессеж catch {}-д залгигддаг тул орчуулаагүй.
- Routine run.source / run.status badge ба шүүлтүүрийн «any» англиар; xoStatusLabel-д routine-ийн төлөв байхгүй.
- Routines.tsx-ийн breadcrumb «Recent Runs» (createIssueDetailLocationState-ийн аргумент) англиар.
- InlineEntitySelector-ийн searchPlaceholder / emptyMessage зөвхөн RoutineRunVariablesDialog-д орчуулагдсан; CommentThread, IssueProperties, RepositoryEditor, ConnectionSetupFlow-д англиар.
- Техникийн утгууд «plain (set)», «secret_ref → …», «latest», «replay Ns» англиар.
- relativeTime() mn-д англиар гарвал «Saved … by …» өгүүлбэрт хоёр хэл холилдоно.
- RoutineVariablesEditor-ийн тусламжийн цонхонд en гаралт «Paperclip detects» → «XO detects» болсон (T1 брэнд дүрэм): en байт ижил байх зарчмаас цорын ганц гажилт.
- Skills хуудас, SkillFolderTree.tsx, reservedRootLabel — хэрэгжсэн (Ү6 7.9).

## Ү6 7.7 — Шийдвэрийн хэсэг ба жижиг үлдэгдэл (2026-10-13)

Зорилго: 7.6-ын «Үлдэгдэл»-ийн шийдвэрийн хэсэг (/decisions: toolbar, огнооны chip, queue rail, triage strip, queue хуудас, shelf), lib/attention.ts, ModeBadge, нууц утгын status enum, interaction хураангуй ба resolution алдааг монгол болгох. en гаралт 9b7bb9c30-тэй байт ижил.

Төлөвлөгөө: docs/superpowers/plans/2026-10-13-xo-y6-7-7-decisions-small-leftovers.md. BASE 9b7bb9c30.

ED шийдвэр: Х1 7.7 = шийдвэрийн хэсэг ба жижиг үлдэгдэл, Routines 7.8-д, Skills 7.9-д. Х2 Routines/Skills-д зөвхөн Streamlined хувилбар, *.production.tsx үлдэгдэлд. Х3 buildAnsweredQuestionsDeliveryText англиар (загварт очих текст).

| Task | Commit |
|---|---|
| 1 labels.ts: xoDecisionOptionLabel, xoSnoozePresetLabel-д «Tomorrow» | ca0ca590c |
| 3 DecisionTriageStrip.tsx: snooze, queue, toast, expiry | c93e67b1a |
| 2 DecisionsToolbar.tsx, DecisionDateChips.tsx: тоо, шүүлтүүр, огнооны chip | ed2d35cf9 |
| 4 DecisionQueuePage.tsx (auto-seeding), DecisionShelf.tsx (curtain шошго) | 9c3084a67 |
| 5 lib/attention.ts: дэлгэрэнгүй мөрийн тоо, blocked, төсөв | 063c27b22 |
| 6 ModeBadge.tsx, MyUserSecretsTab/UserSecretDefinitionsTab status, issue-thread-interactions.ts, interaction-resolution-error.ts | cd943ec41 |
| 7 tiers.ts (6 файл T1), каталог (+126 түлхүүр), y6-7-7-keys тест, tiers-y6-7-7 тест, labels тест | 6ef3278e3 |
| 8 SYNC.md ба бүртгэл | энэ commit |

Түлхүүр: 3647 (7.6-ын төгсгөл 3521, 7.7-д +126).

Төлөв: commit хийсэн, push хийгээгүй. Browser шалгалт хийгдсэн.

### Шалгалтын үр дүн

- Gates (2026-10-13): xo:i18n:check keys=3647 (+126), xo:i18n:test 81, xo:i18n:typecheck OK, xo:brand-scan 161 файл / 586 (baseline-аас илүүгүй), ui tsc цэвэр, vitest (VITE_XO_DEFAULT_LOCALE=en) 621 файл / 6544 тест passed.
- Browser шалгалт (3110, mn, 2026-10-13, ED-ийн зөвшөөрлөөр restart): /YB/decisions дээр «N шийдвэр», шүүлтүүрийн chip (Бүгд / Өнөөдөр / Өчигдөр / Сүүлийн 7 хоног / Энэ сар / Өөрөө сонгох), shelf (Өмнөх / Шийдвэрлэсэн / Хугацаа дууссан), «Дарааллаас хасах: …» Монгол. Дарааллын хуудас (/decisions/queues/questions): «Автомат нэмэлт асаалттай», тайлбар, «Идэвхгүй болгох», «Хасах» Монгол. ModeBadge «Локал итгэмжлэгдсэн». Нууц утгын хуудас Монгол; seed-д нууц утга байхгүй тул төлвийн шошгыг unit тестээр баталсан. Англиар үлдсэн (UI хүрээнээс гадуур): дарааллын гарчиг, тайлбар, дүрмийн бичвэр («Questions», «Structured questions waiting for a board response.», «Pending ask_user_questions interactions.») серверийн автомат seed өгөгдөл; «Questions need answers» server/src/services/attention.ts:667-оос; Secrets.tsx-ийн гар утасны select-д «proposals» option (PageTabBar JSX шошготой үед value-г харуулдаг, 7.6-аас үлдсэн).

### Хязгаарлалт

- attention.ts-ийн модулийн тогтмолууд (SEVERITY_LABEL, DECIDE_BY_OPTIONS, ATTENTION_*_OPTIONS, DATE_BUCKET_LABELS, «No project») англиар үлдэж, render хийх газарт xoDecisionOptionLabel / xoLabel / xoAttentionSourceLabel-ээр орчуулагдана; label нь key ба харьцуулалтад ашиглагддаг.
- DecisionTriageStrip-ээс агент руу чиглүүлэх comment body англиар (агентад очих текст).
- buildAnsweredQuestionsDeliveryText англиар (Х3).
- DecisionQueueRail.tsx зөвхөн tiers.ts-ээр T1-д орсон, эх код өөрчлөгдөөгүй.
- Англиар үлдсэн (хүрээнээс гадуур): Routines (7.8); Skills, SkillFolderTree.tsx, reservedRootLabel (7.9) — хэрэгжсэн (Ү6 7.9); *.production.tsx хувилбарууд (Х2).

## Ү6 7.6 — нууц утгын дэд хуудас, хавтас, инстанцын тохиргоо (2026-10-13)

Зорилго: 7.5-ын «Үлдэгдэл»-ийн pages/secrets/* дэд файлууд, хавтасны удирдлага ба Folders/Flat товч, compact interaction card, AttentionQueueRow, инстанцын ерөнхий тохиргоог монгол болгох. en гаралт abbe3f85f-тэй байт ижил.

Төлөвлөгөө: docs/superpowers/plans/2026-10-13-xo-y6-7-6-secrets-folders-instance-settings.md. BASE abbe3f85f.

| Task | Commit |
|---|---|
| 1 labels.ts: xoAttentionSourceLabel, xoSnoozePresetLabel, xoFolderItemLabel, xoCompactKindLabel | 0e281ae12 |
| 5 FolderControls.tsx: хавтасны тоо, «Ангилаагүй», устгах dialog | 604b46cc8 |
| 4 Secrets.tsx (Folders/Flat), SetMyUserSecretDialog, MyUserSecretsTab, MissingUserSecretsBanner, secret-path.ts, user-secret-presentation.tsx | ed0af92aa |
| 2 ImportFromVaultDialog.tsx | d30d28237 |
| 7 InstanceGeneralSettings.tsx: «{{vendor}}» хувьсагч, topicSummary, dev тэмдэглэл keep-en | 3772d9f6a |
| 3 proposal-review.tsx, ProposalsTab.tsx, UserSecretDefinitionsTab.tsx (XoTrans) | b0b869f48 |
| 6 TaskChatCompactInteractionCard.tsx, AttentionQueueRow.tsx | 664115c21 |
| 8 tiers.ts (10 файл T1), каталог (+284 түлхүүр), y6-7-6-keys тест, tiers-y6-7-6 тест, labels тест | 372a9edb7 |
| 9 SYNC.md ба бүртгэл | энэ commit |

Түлхүүр: 3521 (7.5-ын төгсгөл 3237, 7.6-д +284).

Нэр томьёо: proposal = санал, secret = нууц утга, folder = хавтас, unfiled = ангилаагүй, runtime config = ажиллах орчны тохиргоо.

### Шалгалтын үр дүн

- Gates (2026-10-13): xo:i18n:check keys=3521 (+284), xo:i18n:test 75, xo:i18n:typecheck OK, xo:brand-scan 161 файл / 586 (baseline-аас илүүгүй), ui tsc цэвэр, vitest (VITE_XO_DEFAULT_LOCALE=en) 620 файл / 6538 тест passed.
- Browser шалгалт (3110, mn, 2026-10-13): нууц утгын 4 таб (Нууц утгууд / Миний нууц утгууд / Нийлүүлэгчийн сангууд / Саналууд), «Хавтсаар / Жагсаалтаар» товч, хоосон төлөвүүд Монгол. Инстанцын тохиргоо (байгууллагын тохиргоонд embedded) Монгол; «Paperclip Labs» нэр, dev тэмдэглэл, «Local trusted» (ModeBadge) шийдвэрийн дагуу англиар. /decisions дээр AttentionQueueRow-ийн эх сурвалжийн шошго («Шийдвэр хүссэн») ба snooze сонголт (Өнөөдөр / Энэ долоо хоногт / Хэзээ ч болно) Монгол. Хүрээнээс гадуур англиар үлдсэн (7.7-д): WhatNeedsMe шүүлтүүр («N decisions», All/Today/Yesterday…), DecisionTriageStrip («Pick date», «Snooze», «Queue», «Ask agent for recommendation»), lib/attention.ts («N questions — …»), Routines.tsx ба Skills хуудас («New folder» нь Routines.tsx:961-ээс). FolderControls-ын хавтасны rail ба compact interaction card-ыг өгөгдөлгүйгээс browser-т харуулж чадаагүй; unit тестээр баталгаажсан.

### Хязгаарлалт

- Folders/Flat товч pages/Secrets.tsx-д байдаг (FolderControls.tsx-д биш); 7.5-ын бүртгэл засагдсан. mn: «Хавтсаар / Жагсаалтаар».
- ImportFromVaultDialog: «A Paperclip secret…»-ийн mn утга «XO системийн…» literal; компонент брэндийн хувьсагч дамжуулдаггүй, «{{brand}}» parity тестийг эвдсэн.
- AttentionQueueRow.tsx-ийн SNOOZE_PRESETS (L76-81) модулийн түвшинд tx() дууддаг; i18n синхрон эхэлдэг, locale солиход хуудас дахин ачаалагддаг тул хүлээн зөвшөөрсөн.
- «by» ерөнхий каталогийн түлхүүр болсон («санал гаргасан:»); өөр газар дахин ашиглавал эрсдэлтэй.
- en «Could not approved / rejected / sent for revision» upstream-ийн дүрмийн алдааг хадгална (en гаралт байт ижил).
- Англиар үлдсэн (хүрээнээс гадуур): SkillFolderTree.tsx ба reservedRootLabel, ModeBadge.tsx («Local trusted» / «Authenticated …»), MyUserSecretsTab ба UserSecretDefinitionsTab-ийн {definition.status} enum.
- Ү6 7.7-д шилжүүлсэн: issue-thread-interactions summary, interaction-resolution-error.

## Ү6 7.5 — interaction, Secrets, агентын цэс, Audit (2026-10-13)

Зорилго: 7.4-ийн «Үлдэгдэл»-ийн interaction governance самбар ба card, interaction-audience.ts, Secrets хуудас, агентын зүүн цэс ба гарчиг, Audit хэсгийг монгол болгох. en гаралт db93223a1-тэй байт ижил.

Төлөвлөгөө: docs/superpowers/plans/2026-10-13-xo-y6-7-5-interaction-secrets-audit.md. BASE db93223a1.

| Task | Commit |
|---|---|
| 1 labels.ts: xoResolverPolicyLabel/Effect, xoInteractionKindLabel, xoVerdictLabel, xoNavLabel | 1f0c70ced |
| 5 Агентын зүүн цэс, гарчиг, Audit табууд | 20703bd32, засвар 16adf69cc |
| 2 interaction-audience.ts, InteractionGovernancePanel, CompanySettings | 0a1789f27 |
| 6 AgentActionButtons ба ProjectWorkspaceDetail | e5612605c, брэнд literal засвар deaddf6f3 |
| 4 Secrets.tsx: manual засвар, гар tx, status helper | e1c7c543a |
| 3 IssueThreadInteractionCard: manual засвар, гар tx, enum helper | 3cd13373e |
| 7 tiers.ts (8 файл T1), каталог (+621 түлхүүр), y6-7-5-keys тест, labels mn тест | f3dc49d36 |
| 8 SYNC.md ба бүртгэл | энэ commit |

Түлхүүр: 3237 (7.4-ийн төгсгөл 2616, 7.5-д +621). keep-en.json-д workspace commands JSON жишээ, «MY_SECRET», «PERSONAL_GH_TOKEN», shell командууд, хувилбарын «v{{…}}» хэлбэрүүд нэмэгдсэн.

### Шалгалтын үр дүн

- Gates (2026-10-13): xo:i18n:check keys=3237 (+621), xo:i18n:test 65/65, xo:i18n:typecheck OK, xo:brand-scan 161 файл / 586 (baseline-аас илүүгүй), ui tsc цэвэр, vitest ui/src 619 файл / 6530 тест passed.
- Эцсийн review (opus): merge-д бэлэн, Critical 0, Important 0, Minor 5 (SYNC.md «Үлдэгдэл (Ү6 7.5)»).
- Browser (3110 restart хийсний дараа, mn locale):
  - Агентын дэлгэрэнгүй: зүүн цэс (Агент / Ажиллах орчин / Засаглал / Аудит, доторх бүх холбоос), гарчиг, үйлдлийн цэс (Агентыг хувилах, Агентын ID хуулах, Сессүүдийг шинэчлэх, Ажлаас чөлөөлөх) Монгол.
  - Аудит → Ажиллагаанууд: таб, шүүлтүүр, ажиллагааны мөр, хөл тайлбар Монгол.
  - Байгууллагын тохиргоо → Харилцан үйлдлийн удирдлага: тайлбар, хүснэгтийн толгой, 6 төрөл Монгол.
  - YB-3 thread: харилцан үйлдлийн карт (асуулт, сонголт, Болих/Дараах) Монгол.
  - Нууц утгууд (/company/settings/secrets): таб, тайлбар, хоосон төлөв Монгол.
  - Үлдэгдэл: нууц утгын «Folders / Flat» товч Англи хэвээр (7.6; засвар: товч pages/Secrets.tsx-д байдаг, FolderControls.tsx-д биш); «<b>Нууц утга</b>-ыг» нөхцөл залгалт буруу (mn.json-д засагдсан). Тохиргооны доод хэсгийн инстанцын ерөнхий тохиргоо (Deployment and auth, Backup retention, AI feedback sharing, Sign out) 7.5-ын хүрээнд ороогүй тул Англи хэвээр.
  - Шалгаагүй: төслийн ажлын талбарын дэлгэрэнгүй (YB-д төсөл байхгүй), агент хувилах баталгаажуулалт (дарвал агент үүснэ).

### Хязгаарлалт

- 3110 restart: tiers.ts-д 8 файл нэмсэн тул restart шаардлагатай (ED-ийн зөвшөөрөл). 7.4 restart-гүй байсан.
- Ү6 7.6-д шилжүүлсэн: pages/secrets/* дэд файлууд (≈190 мөр, 8 manual), TaskChatCompactInteractionCard, InteractionAudienceLine, AttentionQueueRow. IssueThreadInteractionCard нь proposal-review.tsx-ийн «Reason given by the agent»-ийг рендерлэдэг тул card дотор тэр хэсэг 7.6 хүртэл англиар үлдэнэ.
- T1 модулийн түвшний объект импортын үед нэг удаа үнэлэгдэнэ; locale солиход хуудас дахин ачаалагддаг тул асуудалгүй. ProjectWorkspaceDetail-ийн сонголтыг sourceTypeText helper-ээр шийдсэн.
- mn тест хязгаар: vitest transform ажиллуулдаггүй тул T1 мөрийн mn гаралтыг unit тестээр батлахгүй; tier тест, xo:i18n:check, browser шалгалт хамгаална.
- Secrets.tsx-ийн XoTrans түлхүүр «Removes <b>{{name}}</b> from Paperclip only.» брэнд literal агуулна; brand-scan baseline-ийг gates шалгана.
- y6-7-5-keys тест mn утгыг зөвхөн en-ээс ялгаатай эсэхээр шалгана; зарим mn утга товчлол/калька хэвээр («… амжилтгүй», «Нэр дэвшигч 1, эх:»).
- Үүргийн орчуулгыг (7.4-өөс) ED шалгах хэвээр.

## Ү6 7.4 — 7.3-ын хүрээнээс гадуурх англи үлдэгдэл (2026-10-13)

Зорилго: 7.3-ын «Үлдэгдэл»-ийн огноо, агент ба ажиллагааны төлөв, үүрэг, T1 файл дахь JSX биш литералыг монгол болгох. mn огноог ICU-гүй гараар формат хийдэг; en гаралт байт хүртэл ижил (цорын ганц үл хамаарах нь xoZonedDateTime доторх Intl("en-US") formatToParts).

Төлөвлөгөө: docs/superpowers/plans/2026-10-13-xo-y6-7-4-remaining-leftovers.md. BASE 274832cc0.

| Task | Commit |
|---|---|
| 1 Огноо: mnZoned, богино огноо, xoZonedDateTime; Intl timeStyle дуудлагууд (10 файл) | 35c3679b7 |
| 2 issue-monitor-ийн mn огноо | 62238daa7 |
| 3 labels.ts: 21 төлөв, xoRoleLabel, xoRunSourceLabel, xoTraceStatusLabel; агентын хуудсууд (11 файл) | 2d2900e6a |
| 4 AgentActionButtons, MembershipAction, RunTranscriptView, ProjectWorkspaceDetail-ийн литерал | 84b0feb3e |
| нэмэлт DecisionTriageStrip «When to decide» ба шийдэх хугацааны шошго | ef4854cb3 |
| 5 Каталог (+80 түлхүүр), y6-7-4-keys тест, labels mn тест | bcc90a171 |
| 6 SYNC.md ба бүртгэл | энэ commit |

### Шалгалтын үр дүн

- xo:i18n:check OK, keys=2616 (7.3-ын төгсгөл 2536, 7.4-т +80). keep-en.json-д "DevOps" нэмсэн.
- xo:i18n:test PASS, xo:i18n:typecheck цэвэр, xo:brand-scan 161 файл/586 hit (baseline-аас дээш байхгүй), ui tsc --noEmit цэвэр.
- vitest run ui/src: 618 файл, 6525 тест. Бүтэн ажиллуулалтад ачааллын timeout-оос болж 1-5 тест унав (хоёр удаа ажиллуулахад тоо өөр). Унасан IssuesList.test.tsx дангаараа 46/46 PASS.

### Browser шалгалт (3110, restart хийгээгүй, tiers.ts өөрчлөгдөөгүй)

- /YB/agents: төлөв «Сул», үүрэг «Ерөнхий».
- Агентын хуудас: «Даалгавар оноох», «Одоо ажиллуулах» товч, шинж чанарын хүснэгт mn.
- /YB/issues: огнооны хуваагч mn, регресс байхгүй.
- Хүрээнээс гадуур илэрсэн: агентын хуудасны зүүн навигаци ба Audit → Runs хуудас англиар. SYNC.md-ийн «Үлдэгдэл (Ү6 7.4)»-д бүртгэсэн.

### Хязгаарлалт

- Ү6 7.5-д шилжүүлсэн: InteractionGovernancePanel, interaction-audience.ts, Secrets.tsx, IssueThreadInteractionCard.
- mn-д цагийн бүсийн нэр ба гараг алга; issue-monitor-ийн mn зам display time zone-ыг үл хайхарна.
- AgentActionButtons-ийн toast ба баталгаажуулах текст, ProjectWorkspaceDetail-ийн бусад Field шошго англиар үлдсэн.
- Үүргийн орчуулгыг ED шалгана (CEO, CTO, PM, QA г.м.).

## Ү6 7.2 нэр томьёоны шийдвэр (2026-10-13)

ED xo-nertomyo-sanal.md-ийн бүх саналыг батлав. mn.json-д 11 утга солигдсон, «Resume this subtree to send a message.»-ийг «дэд даалгавар» нэр томьёонд нийцүүлсэн. Шийдвэрийн бүрэн хүснэгт glossary.md-ийн «Ү6 7.2-т шийдсэн» хэсэгт.

- xo:i18n:check OK (keys=2536), xo:i18n:test 57/57, xo:i18n:typecheck цэвэр.
- Browser (3110, YB-1): шинж чанарын самбарт «Саатуулагч», «Саатуулж буй» гарсан. Түр зогссон дэд даалгавар тест өгөгдөлд байхгүй тул Subtree мөрийг dev server-ийн үйлчилж буй каталогоор шалгав (12 утга бүгд шинэ).
- «Хэнд» w-6 баганаас халж байгааг (34/24px) SYNC.md-ийн «Үлдэгдэл (Ү6 7.3)»-д бүртгэв.

## Ү6 7.3 — хэрэглэгчид харагдах үлдэгдэл (2026-10-13)

Зорилго: Ү6 7.2-ын дараа mn дээр англиар үлдсэн зүйлийг монгол болгох. toLocale* огнооны дуудлагыг ICU-гүй xoLocale* wrapper руу шилжүүлсэн (48 файл), огнооны хажуугийн шошгыг tx-ээр орчуулсан, browser шалгалтаар илэрсэн 6 зүйл (огнооны хуваагч, desk shelf, group-by, Helpful/Needs work, Questions/None, clipboard угтвар), RunTranscriptView-ийг T1 болгосон, 7.2-ын Minor #6/#7/#8-ийг хаасан.

Төлөвлөгөө: docs/superpowers/plans/2026-10-13-xo-y6-7-3-user-visible-leftovers.md. BASE 53135060b.

| Task | Commit |
|---|---|
| 1 toLocale* орлуулагч xoLocaleDateTime/Date/Time ба mnTime | 58edf5030 |
| 2 components-ийн огноо ба хажуугийн шошго (19 түлхүүр) | d12bdb277 |
| 3 pages ба lib-ийн огноо, шошго (11 түлхүүр); mn xoLocaleTime секундтэй | c6c3a7f83, 8ba99c495 |
| 4 Browser шалгалтын 6 зүйл (6 түлхүүр) | 0f355e53c |
| 5 RunTranscriptView T1, routine run subtitle, Markdown (44 түлхүүр) | daf3f5504 |
| 6 7.2 Minor #6 pending төлөв, #7 mn.json хоёр утга, #8 relativeTime тест | 4d5624628 |
| 7 SYNC.md ба бүртгэл | энэ commit |

### Эцсийн review-ийн засвар

Эцсийн review-ийн засвар (энэ commit): TaskChatCompactInteractionCard-ийн 4 «Expires» огноо xoLocaleDateTime, ProviderTraceStatusBadge/RunnerInspector/RoutineList-ийн үлдсэн 4 шошго (+4 түлхүүр), SYNC/PROGRESS-ийн залруулга. Gates: xo:i18n:check keys=2536; xo:i18n:test 57; brand-scan 161 файл/586 hit; tsc цэвэр; vitest run ui/src 617 файл, 6509 тест PASS.

### Шалгалтын үр дүн (Task 7)

- xo:i18n:check OK, keys=2532 (7.2-ын төгсгөл 2452, 7.3-д +80), «гараар:» мөр байхгүй.
- xo:i18n:test 4 файл, 57 тест PASS; xo:i18n:typecheck цэвэр.
- xo:brand-scan 161 файл, 586 hit, baseline-аас дээш байхгүй.
- ui tsc --noEmit цэвэр (exit 0).
- vitest run ui/src: 617 файл, 6509 тест PASS (7.3-ын өмнө 614 файл, 6386 тест).

### Browser шалгалт

3110 dev server-ийг ED-ийн зөвшөөрлөөр restart хийж (tiers.ts өөрчлөгдсөн), xo.locale=mn-ээр шалгасан:

- /YB/issues: огнооны хуваагч «ӨЧИГДӨР», «ӨМНӨХ»; group-by цэс бүрэн mn.
- /YB/inbox/mine: таб ба хуваагч mn. Swipe арын «Archive» англиар үлдсэнийг SwipeToArchive.tsx-д tx-ээр зассан (commit 21a3f6f6c, түлхүүр аль хэдийн байсан).
- /YB/issues/YB-3: англи мөр байхгүй.
- Ажиллагааны хуудас: transcript-ийн mn хураангуй, «Ажиллагааг шалгах», «… өмнө» огноо mn.
- 7.3-ын өөрчлөлтөөс үүссэн регресс байхгүй.

7.3-аас өмнөх, хамрах хүрээнээс гадуурх англи үлдэгдэл илэрсэн. Компанийн тохиргооны «Interaction governance», Secrets хуудасны статик шошго, AgentDetail-ийн товч ба табууд, агентын төлөв нь tier-т ороогүй файл эсвэл T1 файл дахь JSX биш литерал байна. Жагсаалтыг SYNC.md-ийн «Үлдэгдэл (Ү6 7.3)»-д нэмсэн.

### Хязгаарлалт

SYNC.md-ийн «Үлдэгдэл (Ү6 7.3)» мөрөнд бүртгэсэн үлдсэн зүйлс:

- d.label === "Intent" харьцуулалт (IssueChatThread.tsx:1637, lib/transcriptPresentation.ts:233).
- dev-only T2 файлууд (TweakPanel, motion-tokens, task-chat-states, task-chat-fixtures, DesignGuide, TaskChatLab) ба LegacyIssuesList.
- mn-д цагийн бүсийн нэр (Codex/ClaudeSubscriptionPanel) ба UTC огноо (attention.ts:431) харагдахгүй.
- RunTranscriptView.tsx:881 «Unavailable source», ProjectWorkspaceDetail.tsx:704 repoUrl-ийн «None» орчуулагдаагүй.
- Intl.DateTimeFormat timeStyle дуудлагууд (RoutineOverview, SidebarServerInfo, SmokeLabDashboardCard, tools/SmokeLabTab) англиар үлдсэн.

## Ү6 7.2 орчуулгын үлдэгдэл (xo-main)

Төлөвлөгөө: docs/superpowers/plans/2026-10-13-xo-y6-leftovers-i18n.md. BASE 580087be4.

| Task | Commit |
|---|---|
| 1 Чатын нэрийн fallback, статусын өөрчлөлт, хэрэгслийн дэлгэрэнгүй шошго | b9e7738b0 |
| 2 Даалгаврын жагсаалтын бүлэг, шүүлтүүр, үүсгэх шошго | 8e2429b5b |
| 3 IssueRow ба TaskSidePanel (T1), саатлын статусын тайлбар | a813d6ebe |
| 4 Огноо, цагийг ICU-гүйгээр mn-д форматлах | e9e5a1731 |
| 5 Task chat-ийн алдаа, дараалал, саатуулагч, протоколын карт | 6a1707b47 |
| 6 Шинэ даалгаврын цонхны «Хэнд»/«төсөл» шошго, агент хайлт, ажлын талбарын мэдэгдэл | 6ce5804f8 |
| 7 SYNC.md ба бүртгэл | энэ commit |

### Шалгалтын үр дүн (Task 7)

- xo:i18n:check OK, keys=2452, «гараар:» мөр байхгүй.
- xo:i18n:test 3 файл, 56 тест; xo:i18n:typecheck цэвэр.
- vitest (Task 7 Step 3-ын 16 зам): 230 файл, 2841 тест PASS.
- ui tsc --noEmit цэвэр (exit 0).
- brand-scan 161 файл, 586 hit (baseline-тэй тэнцүү).

### 3110 instance ба browser шалгалт

2026-10-13-нд шалгав (mn locale, viewport 1280x900). 3110-ийн Vite процесс 12:03:43-д эхэлсэн нь Task 3-ын commit a813d6ebe (14:08:08) -оос 2 цагийн өмнө. tiers.ts-ийг Vite plugin эхлэхдээ уншдаг тул IssueRow ба TaskSidePanel-ийн T1 текст restart хүртэл англи байж болзошгүй. Restart: b8b934838 дээр 14:54-д дахин асаасан (ED зөвшөөрсөн), доорх батлагдсан зүйлс restart-ын дараах. Анхаарах: restart-ын дараа upstream-ийн service worker (ui/public/sw.js, network-first) хуучин /src модулийг буцааж англи текст харуулсан; tab-д navigator.serviceWorker.getRegistrations() → unregister + caches.delete хийсний дараа л шинэ код гарсан. Хуудас бүр SW-ийг дахин бүртгэдэг тул шинэ route руу шууд очихын өмнө дахин цэвэрлэх.

- /YB/issues: «Шинэ даалгавар» (toolbar), «ӨЧИГДӨР» огнооны бүлэг, «ХИЙХ / ХЯНАГДАЖ БУЙ / ДУУССАН» толгой, sr-only «Нээх: YB-1 — …» (IssueRow T1), статусын aria «Төлөв солих (одоогийн: …)», «1 өдрийн өмнө», төлвөөр бүлэглэсэн гарчиг ба «Шинэ даалгавар: Хийх» монгол. Шүүлтүүрийн popover (Түргэн шүүлтүүд, Төлөв, Хариуцагч, Харагдах байдал) бүрэн монгол.
- /YB/inbox: таб ба шүүлтүүрийн popover монгол. «Бүх ангилал», «Зөвшөөрлийн бүх төлөв» шүүлтүүр энэ UI-д харагдсангүй.
- YB-3: хажуугийн самбарын tab «Шинж чанарууд», талбарын нэрс монгол, хоосон талбарууд «Байхгүй» (TaskSidePanel T1), огноо «2026 оны 10-р сарын 12 9:38» (date-format ажиллаж байна).
- Шинэ даалгаврын цонх: «Хэнд [Хариуцагч] төсөл [Төсөл]» мөр, товчнууд монгол.
- Issue chat, task chat-ийн хэсгүүд (системийн мөр, статусын өөрчлөлт, «… с бодсон», blocker, steer) seed өгөгдөлд байхгүй тул browser-оор батлаагүй; unit тестээр хамгаалсан.
- en шалгалт: «New Task», «9m ago», «Oct 12, 2026, 9:38 AM», «For»/«in» өмнөхтэй ижил. Дараа нь mn руу буцаасан.

### Үлдэгдэл

SYNC.md-ийн «Үлдэгдэл (Ү6 7.3)» жагсаалт:

- Task 4-т ороогүй бусад toLocale* дуудлага (~97 газар): Chromium-д mn ICU байхгүй тул англиар харагдана.
- Ү6/T2 файлууд: TweakPanel, motion-tokens, task-chat-states, task-chat-fixtures, task-chat-attachments, RunTranscriptView, routine-run-display, DesignGuide; LegacyIssuesList.
- Clipboard-ын «Tool:»/«Result:» угтвар, мөн d.label === "Intent" харьцуулалт.

Browser шалгалтаас гарсан англи үлдэгдэл (7.3):

- Inbox огнооны бүлгийн толгой «YESTERDAY»/«EARLIER» (Inbox.tsx).
- Жагсаалтын «Бүлэглэх» цэсний утгууд (Status, Responsible, Project, Workspace, Parent Task, None).
- «Helpful»/«Needs work» title ба aria (OutputFeedbackButtons, AgentBubbleActionRow, IssueChatThread).
- YB-1 асуултын картын «Questions» толгой.
- Side panel «Хяналт» → «None» (IssueProperties.tsx monitorTrigger, restart-ын дараа ч үлдсэн). «Үүсгэгч: Board» нь хэрэглэгчийн нэрийн fallback, орчуулгын асуудал биш.

Task бүрийн Minor (хураангуй):

- Task 1: xoQuickFilterLabel, xoInboxFilterLabel-ийн default нь англи fallback (brief-ийн загвар).
- Task 3: xoSidePanelTabLabel файл/документ tab-ын нэрэнд ч ажиллана; StatusIcon.xo.test-ийн Blocked салбарын 3 нь тестгүй.
- Task 4: date-format.ts mn зам хүчингүй огноонд «NaN оны NaN-р сарын NaN» гаргана (en «Invalid Date»); utils.locale.test relativeTime тест Date.now()-оос хамаарна.
- Task 5: «ирүүлээгүй» (шинэ) ба «илгээгээгүй» (хуучин) зөрүү; ProtocolCard {{status}} салбарт «pending» англиар; «Moved queued message…» mn утга «зөөсөн» гэсэн утгаа алдсан.
- Task 6: y6-7-2-keys.test-ийн ASSIGNING шалгалт mn түлхүүр байхгүй үед ч давна; «Хэнд» w-6 өргөнд багтаж байгаа эсэх нээлттэй асуулт 8.
- tool-taxonomy.ts SYNC.md-д бүртгэгдсэн.
- Өмнөх commit-ийн trailer «Claude Sonnet 5.5» гэж бичигдсэн (M-6): түүхийг дахин бичихгүй, push хийгдээгүй.

ED шийдэх нээлттэй асуулт (төлөвлөгөөний «Хязгаарлалт ба нээлттэй асуулт»):

- 3110 restart (IssueRow, TaskSidePanel-ийн T1 текст харагдахад хэрэгтэй).
- «Хэнд» w-6 өргөнд таслагдах эсэх, «төсөл» үгийг баталгаажуулах (асуулт 8).
- Нэр томьёо: шүүлт/шүүлтүүр, самбар, ажлын талбар, саатуулагч, Show less, Depth, Blocked by/Blocking, Subtree/Binding, Runtime/Steer/Interrupt, Hook, Түрээс; сул орчуулга «Файлд хандсан», «Холбогдсон хэрэгсэл ашигласан». docs/xo/glossary.md-д нэг дор шийдэх (асуулт 11, 12).
- Хувьсагчид дагавар залгасан 47 хуучин түлхүүрийн цэвэрлэгээ (асуулт 13).
- Thought for / summaryLabel хэл сэлгэхэд хуучин хэлээр үлдэнэ (reload хүртэл), зөвшөөрөх эсэх (асуулт 15).
- Push хийх эсэх ED-ийн шийдвэр.

## Ү6 7.1 даалгаврын урсгал (xo-main)

Төлөвлөгөө: docs/superpowers/plans/2026-10-12-xo-y6-task-flow-i18n.md. BASE 1a3365ef4.

| Task | Commit |
|---|---|
| 1 Даалгаврын жагсаалт, шүүлтүүр, харьцангуй цаг | 2a8f61b18 |
| 2 Шинэ даалгаврын цонх, ажлын горим | 316457ad5, f4367da87 (засвар) |
| 3 Шинж чанарын самбар | 50c294b4c, f47fa07b1 (засвар) |
| 4 Task chat composer ба карт | fcdea4d36 |
| 5 Ажиллагааны явц, хугацаа | 238d8fc31 |
| 6 Task chat thread ба карт | 20408bd72 |
| 7 Issue chat thread | e256c5cc5 |
| 8 SYNC.md ба бүртгэл | 40ecd6fd1 |
| Эцсийн review 1-ийн засвар (PR «Нээлттэй», en огнооны locale) | 0227002d3 |
| Эцсийн review 2-ын засвар (runner-ийн алдааны тайлбар, огнооны хуваагч, баганын нэр, зөвшөөрлийн шийдвэр) | энэ commit |

### Шалгалтын үр дүн (Task 8)

- xo:i18n:check OK, keys=2329, «гараар:» мөр байхгүй.
- xo:i18n:test 2 файл, 54 тест; xo:i18n:typecheck цэвэр.
- vitest 224 файл, 2684 тест; ui tsc цэвэр.
- brand-scan 161 файл, 586 hit (baseline-тэй тэнцүү).

### Шалгалтын үр дүн (эцсийн review 2-ын засвар)

- xo:i18n:check OK, keys=2360 (30 шинэ түлхүүр).
- xo:i18n:test 54 тест; xo:i18n:typecheck цэвэр; ui tsc цэвэр.
- vitest (ui): 614 файл, 6386 тест PASS. Root-ын бүрэн suite-д ui-гаас гадуурх 3 файлд 48 тест орчны шалтгаанаар унадаг (macOS /var → /private/var symlink: packages/shared worktree-seed-source; adapter-utils dist; server native-codex integration) — энэ өөрчлөлттэй холбоогүй, тэр файлууд HEAD-тэй ижил.
- brand-scan 161 файл, 586 hit (baseline-тэй тэнцүү).
- 3110 (mn, /YB/issues): огнооны хуваагч «Өчигдөр»/«Өмнөх», баганын popover «Төлөв, Дугаар, Хариуцагч, Эхлүүлсэн, Төсөл, Эцэг даалгавар, Шошго, Сүүлд шинэчилсэн» тайлбартайгаа монгол.

### 3110 instance ба browser шалгалт

2026-10-13-нд 3110-ийг e256c5cc5 дээр дахин эхлүүлсэн (instance y3b-test, mn locale).

- /YB/issues: төлөв, toolbar, харьцангуй цаг («1 өдрийн өмнө») монгол.
- Шүүлтүүрийн popover: гарчгууд монгол.
- Шинэ даалгаврын цонх: бүхэлдээ монгол, горимын цэс «Авто/Төлөвлөх/Асуух горим».
- YB-3: асуултын карт (1 / 2, Бусад, Болих, Дараах), шинж чанарын самбар монгол.
- YB-2, YB-4: composer placeholder «Мессеж: Монгол туслах. Юу хийлгэхийг тайлбарлана уу…», хүргэх зүйлийн карт монгол.
- Seed өгөгдөлд ажиллагааны мөр байхгүй тул run шошгыг («Ажилласан …», «N команд ажиллуулсан») browser-ээр батлаагүй; unit тестээр баталсан.

### Үлдэгдэл

7.2-т шилжүүлэх англи үлдэгдэл (JSX текст биш тул энэ төлөвлөгөөний хүрээнээс гадуур):

- IssuesList.tsx-ийн createButtonLabel const «New Task».
- Шүүлтүүрийн түргэн сонголт ба төлвийн сонголтууд (All, Active, Backlog, Done …).
- Шинж чанарын самбарын «Properties» гарчиг, «Board»/«None» fallback.
- Огноо, цагийн формат («Oct 12, 2026, 9:38 AM»).
- sr-only «Open YB-3: …» мөрийн шошго, «Change status (current: …)» aria-label.
- Эцсийн review 2-ын I-3: T1 файл дахь JSX биш англи литерал (жагсаалт docs/xo/SYNC.md «Үлдэгдэл (Ү6 7.2)»).
- M-4: NewIssueDialog «For»/«in» глобал түлхүүрийг контексттэй болгох; M-5: mn дээр failed run-ийн «Try again» тест.

## Ү3-Б үлдэгдэл (xo-main)

| Task | Commit |
|---|---|
| 1 label helpers (xoLabel/xoStatusLabel) | 815469d64 |
| 2 onboarding credential ба алхмын шошго | a65648f85 |
| 3 QuestionForm, PropertiesPanel | 863b9e810 |
| 4 статусын шошго, switcher noun, төсвийн scope | 63a28c446 |
| 5 section шошго, scope/noun-ийн mn дагавар | 6e710b5d6 |
| 6 алга болсон task-ын мессеж | 65695ee2c |
| 7 SYNC.md ба бүртгэл | энэ commit |

### Шалгалтын үр дүн (Task 7)

- xo:i18n:check: OK (keys=1640)
- xo:i18n:test: 2 файл, 54 тест давсан
- xo:i18n:typecheck: давсан
- vitest (ui/src/i18n, xo, onboarding, task-chat, StatusBadge, SidebarCompanyMenu, SidebarSection, Sidebar, PropertiesPanel, IssueDetail): 60 файл, 942 тест давсан
- ui tsc --noEmit: давсан
- xo:brand-scan: OK (161 файл, 586 hit, baseline-аас өссөнгүй)

### 3110 instance ба browser шалгалт

2026-10-12, y3b-test (3110, restart хийгээгүй, Vite HMR):

- /YB/issues: статус «Хийх / Хянагдаж буй / Дууссан», англи статус үлдээгүй.
- /YB/costs: «company budgets» харагдахгүй.
- Sidebar aria-label: «Y3B Тест ХХК байгууллага сонгогчийг нээх», «Байгууллага хэсгийг хураах».
- /YB/issues/YB-999999: API 404 → «Даалгавар олдсонгүй» ~7 сек дараа (retry 3). Browser pane нуугдмал үед React Query retry-г зогсоодог тул мессеж гарахгүй байж болно; энэ нь кодын алдаа биш.
- en горим (xo.locale=en): «Todo / In Review / Done», «Open … organization switcher».
- Шалгаагүй: onboarding (шинэ байгууллага үүсгэх шаардлагатай), QuestionForm (асуулттай даалгавар байхгүй). Хоёулаа unit тестээр хамрагдсан.

### Үлдэгдэл

- NewIssueDialog-ийн статусын description англиар үлдсэн.
- {{var}} дагавартай ~48 бусад mn мөр хойшлогдсон (Task 5 Step 4-ийн тооллого).
- IssueDetail-ийн 404 бус алдаа дээр түүхий error.message харагдсан хэвээр.
- 404 мессеж React Query-ийн retry-ийн дараа (~7 сек) гарна.
