# T1 орчуулгын хяналт (Ү2, 2026-09-30)

Extract: files=102 keys=1568 (Step 3-т 1166; батчууд, App.tsx-ийг T1-д нэмсэн, Step 14-ийн allowlist өргөтгөлөөр 1568 болсон). check: OK. keep-en: 13 түлхүүр.

Шалгалт: эхний шалгалт 30bf3d28c дээр; дахин шалгалт Step 14-ийн засвар бүхий UI build дээр (агуулга нь 3e212808a-тай ижил), 2026-09-30, controller built-in browser-оор 11 маршрутыг шалгасан. Хоёр шалгалтын «Board» нь local-board хэрэглэгчийн нэр (хэрэглэгчийн өгөгдөл).

"Board" бүх маршрутад local-board хэрэглэгчийн харагдах нэр (хэрэглэгчийн өгөгдөл) тул үлдэгдэл биш.

| Маршрут | Латин үлдэгдэл (эхний шалгалт) | Засвар | T2-д үлдээсэн | Ажиглалт |
|---|---|---|---|---|
| /dashboard | Agents (H3), "No recent agent runs.", "Last 14 days", "No runs yet", "No tasks", "just now", "Command Palette", "Search for a command to run...", "Next" | "Last 14 days", command palette (command.tsx), "Next" (OnboardingWizard) засагдсан | ActiveAgentsPanel.tsx: "Agents", "No recent agent runs." | Засвараас хойш "just"/"now" dashboard дээр харагдаагүй (timeAgo.ts T2, доор) |
| /issues | "New Task", "No tasks match the current filters or search.", "Create Task" (+ palette) | palette засагдсан | IssuesList.tsx: "Create Task", "No tasks match the current filters or search." (мөн :1676 "New Task") | |
| /agents | "Create your first agent to get started.", "New Agent" | allowlist-д message, action нэмсэн (transform.ts) | байхгүй | |
| /projects | "No projects yet.", "Add Project" | allowlist (message, action) | байхгүй | |
| /goals | "No goals yet.", "Add Goal" | allowlist (message, action) | байхгүй | |
| /inbox | "Inbox zero." | allowlist (message) | байхгүй | |
| /approvals | зөвхөн palette | command.tsx | байхгүй | |
| /costs (→ /activity/costs, Audit hub) | Audit гарчиг, Costs/Activity/Runs/Budgets/Timeline табууд, санхүүгийн картын текст | Costs.tsx болон Costs.production.tsx-ийн 5 template literal tx() болсон (нэрлэсэн placeholder) | audit-navigation.ts:8-12, AuditHub.tsx: хуудасны гарчиг, табууд, санхүүгийн картын текст | Эхний ба дараах шалгалтад ижил |
| /search | Tasks, Comments, Documents, Artifacts, Agents, Projects табууд | Search.tsx (T1): SCOPE_LABELS -> scopeLabel() (tx), describeScope-д tx("All scopes") | байхгүй | SearchResultRow.tsx (T2) үр дүнгийн мөрөнд хамаарна, доор |
| /company/settings | Interaction governance, Deployment and auth, Backup retention, AI feedback sharing, Keyboard shortcuts, Sign out, "Sign out of this Paperclip instance." | байхгүй (T2) | InstanceGeneralSettings.tsx, InteractionGovernancePanel.tsx: том англи хэсгүүд | Paperclip брэндийн алдагдал, доор |
| /onboarding | "Continue" (мөн Next, Get started, Creating..., Connecting, Launching...) | OnboardingWizard.tsx FooterNav primaryLabel, loadingLabel салбар бүрд tx() | байхгүй | "Анхны агентаа үүсгэх" зөв харагдсан |

Console алдаа: аппын алдаа байхгүй (11 маршрут, дахин шалгалт). Одоогийн ачаалалтад API хүсэлт бүр 200; dev server дахин ачаалж байх үеийн ERR_CONNECTION_REFUSED мөрүүд л байсан. Ө/Ү/Ё: зөв (screenshot, onboarding "Анхны агентаа үүсгэх").

## Ү6-д (T2) үлдээсэн мөрүүд

- ui/src/pages/audit/audit-navigation.ts:8-12: табын нэрс (Costs, Activity, Runs, Budgets, Timeline) ба Audit — /costs (/activity/costs)
- ui/src/pages/audit/AuditHub.tsx: хуудасны гарчиг Audit, санхүүгийн картын текст — /costs (/activity/costs)
- ui/src/pages/InstanceGeneralSettings.tsx: Interaction governance, Deployment and auth, Backup retention, AI feedback sharing, Keyboard shortcuts, Sign out — /company/settings
- ui/src/components/InteractionGovernancePanel.tsx: interaction governance хэсгийн текст — /company/settings
- ui/src/components/IssuesList.tsx (:1676): "New Task", "Create Task", "No tasks match the current filters or search." — /issues
- ui/src/components/LegacyIssuesList.tsx, ui/src/components/task-chat/QuestionForm.tsx, ui/src/components/IssueSiblingNavigation.tsx: англи текст (Issues / interactions чиглэл; step14 тайлан маршрутыг тусад нь заагаагүй)
- ui/src/components/ActiveAgentsPanel.tsx: "Agents", "No recent agent runs." — /dashboard
- ui/src/components/MobileBottomNav.tsx: доод навигацийн шошго (гар утасны харагдац)
- ui/src/components/search/SearchResultRow.tsx: хайлтын үр дүнгийн мөр — /search
- ui/src/lib/timeAgo.ts:12: "just now" (lib/utils.ts аль хэдийн орчуулагдсан) — харьцангуй цаг үзүүлдэг маршрутууд

## Ү6-д шийдэх тэмдэглэл

- Paperclip брэндийн алдагдал: InstanceGeneralSettings.tsx дахь "Sign out of this Paperclip instance." мөрийг Ү6-д XO болгон засна.
- T1 файлуудад allowlist-д ороогүй string prop-ууд англиар харагдах магадлалтай: ariaLabel (29), hint (22), emptyMessage (7, AgentDetail), footnote (7), мөн ~10 ганц жишээ (assignLabel, copiedLabel, composerDisabledReason, createIssueLabel, headerAction, liveAccessory, instruction, sectionTitles, pauseConfirm, workActionsDisabledReason). Ү6-д ангилж шийднэ (allowlist-д нэмэх эсвэл tx() гараар).
