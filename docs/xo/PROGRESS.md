# XO ахицын бүртгэл

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
