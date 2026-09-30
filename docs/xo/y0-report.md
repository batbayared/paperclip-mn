# XO хаалтын тайлан

## Ү0 хаалт

Task 0 (onboarding, heartbeat) ED байлцахаар хойшилсон. Task 0 энэ хэсгийг бөглөнө.

## Ү1 хаалт

- 2026-09-30, commit fd105a9e2. Browser (dev, 1280px): Sidebar монголоор (Хянах самбар, Ирсэн, Даалгаврууд, Төслүүд, Агентууд, Аудит), хэл сэлгэгч хоёр тийш ажиллав (`lang` ба `xo.locale` mn↔en), Ө/Ү/Ё InterVariable-аар зөв харагдана, console-д i18n алдаагүй.
- Ногоон: ui typecheck; ui vitest 605 файл / 6319 тест; `xo:i18n:test` 45 тест; `xo:i18n:check` OK (keys=27); `pnpm --filter @paperclipai/ui build`.
- Нээлттэй: root `pnpm build` нь `packages/paperclip-runner`-ийн `cargo` шаардлагаар унана (Rust суугаагүй, upstream). `pnpm test:e2e` 136 passed / 78 skipped / 6 failed: 5 нь `execution-recovery/recovery.spec.ts` (CLI гаралтын ANSI код regex-ийг эвддэг), 1 нь `smoke-lab.shared.ts:316` (server catalog). Upstream d554c4789 дээр ижил 6 тест ижил assertion-оор унасан (2026-09-30 суурь шалгалт), XO-оос хамааралгүй. ED 2026-09-30-нд Ү1-ийг UI build + e2e дүнгээр хүлээн зөвшөөрсөн.
- Ү2-т нэмэх англи текст: MobileBottomNav (New Task), command palette, onboarding, dashboard картууд, Tasks хуудас.

## Ү2 хаалт

- 2026-09-30. Каталог: 1568 түлхүүр, keep-en 13, гараар шийдсэн тохиолдол 73 (Task 11 Step 4). Ногоон: xo:i18n:check OK (keys=1568); ui vitest 605 файл / 6319 тест.
- Build хаалга: root pnpm build ба server-ийн build нь packages/paperclip-runner-ийн cargo шаардаж унана (cargo суулгахгүй гэж ED шийдсэн). Үүний оронд pnpm -r --no-bail --filter '!@paperclipai/paperclip-runner' --filter '!@paperclipai/server' build (40 багц, exit 0), server-д tsc --noEmit (exit 0), pnpm --filter @paperclipai/ui build (exit 0). Ү1-д ED UI build-ийг хүлээн зөвшөөрсөн.
- E2E (pnpm test:e2e, system Chrome, порт 3199): 137 passed / 79 skipped / 7 failed. Шинэ xo-mn.spec.ts 2 тест ногоон, xo-screenshots.spec.ts 1 skipped (XO_SCREENSHOTS=1 үед 1 passed, 11 PNG).
- 7 унасан тестийн тайлбар:
  - recovery.spec.ts x5: upstream-д мөн унадаг (baseline d554c4789). CLI test-drive URL-ийг pc.cyan-аар ANSI кодтой хэвлэдэг тул spec-ийн regex таарахгүй, 60 секундэд timeout болно. XO-оос хамааралгүй, засаагүй.
  - smoke-lab.shared.ts:316 (P5-P7): бүтэн ажиллуулалтад унана, тусад нь ажиллуулбал XO ба baseline хоёуланд нь тэнцнэ. Дараалалаас хамаарсан, XO-ийн өөрчлөлтийн шалтгаан нотлогдоогүй.
  - agent-chat.spec.ts:557 (Star товчны opacity): бүтэн ажиллуулалтад нэг удаа унасан, тусад нь 3/3 тэнцсэн. Flake гэж үзэв.
- CompanyEnvironments.test.tsx flake: HEAD дээр 5/5, baseline дээр 5/5 тэнцсэн.
- multi-user-authenticated.spec.ts: newContext нь storageState өвлөдөггүй тул xo.locale=en-г test.use ба newContext-д тогтоосон. Энэ spec тусгай authenticated instance шаарддаг тул ажиллуулаагүй.
- Олон тооны хэлбэр (plural) шалгалт: CompanyImport, CompanyExport, IssueDetail, Costs(.production) бүгд transform-оор боловсрогдсон, засвар шаардлагагүй.
- Build a new organization текст d554c4789-д зөвхөн upstream spec-үүдэд байдаг, ui/src-д байхгүй тул орчуулагдахгүй. Spec-ийг хөндөөгүй.
- Хүлээгдэж буй (pending ED): 11 дэлгэцийн зургийг ED өөрөө хараад дизайн, Монгол текстийн таслалт, фонтыг батлах. Зам: ~/dev/xo-screenshots/.
- **Төлөв: нээлттэй.** Хаалт хаагдахын өмнө ED шийдэх зүйл: (1) 11 PNG-ийн зөвшөөрөл; (2) spec §17-ийн pnpm build-ийн оронд cargo-гүй build-ийг хүлээн зөвшөөрөх; (3) 7 улаан e2e-г дээрх тайлбартай хүлээн зөвшөөрөх (recovery x5 upstream baseline-д мөн унадаг; smoke-lab:316 дараалалаас хамаарна, Ү1-д baseline-ийн бүтэн ажиллуулалтад мөн унасан; agent-chat:557 flake).
