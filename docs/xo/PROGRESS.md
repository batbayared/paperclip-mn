# XO ахицын бүртгэл

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
- Англиар үлдсэн (хүрээнээс гадуур): Routines (7.8), Skills, SkillFolderTree.tsx, reservedRootLabel (7.9), *.production.tsx хувилбарууд (Х2).

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
