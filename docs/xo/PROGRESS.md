# XO ахицын бүртгэл

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
| 8 SYNC.md ба бүртгэл | энэ commit |

### Шалгалтын үр дүн (Task 8)

- xo:i18n:check OK, keys=2329, «гараар:» мөр байхгүй.
- xo:i18n:test 2 файл, 54 тест; xo:i18n:typecheck цэвэр.
- vitest 224 файл, 2684 тест; ui tsc цэвэр.
- brand-scan 161 файл, 586 hit (baseline-тэй тэнцүү).

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
- ui/src/lib/task-date-groups.ts «Yesterday»/«Earlier» бүлгийн шошго.
- Шүүлтүүрийн түргэн сонголт ба төлвийн сонголтууд (All, Active, Backlog, Done …).
- Шинж чанарын самбарын «Properties» гарчиг, «Board»/«None» fallback.
- Огноо, цагийн формат («Oct 12, 2026, 9:38 AM»).
- sr-only «Open YB-3: …» мөрийн шошго, «Change status (current: …)» aria-label.
- RichWorkProductCard.tsx PR статус chip «Нээх» → «Нээлттэй» байх ёстой (тусдаа түлхүүр).

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
