# XO хаалтын тайлан

## Ү0 хаалт

- 2026-10-05 — 10-11, локал instance (pnpm dev:once), компани CMP. ED onboarding, CEO агент («Удирдагч агент», claude_local) үүсгэж, маягтад монголоор хариулсан.
- claude_local: 2026-10-11 ED CMP-1-д монгол comment бичсэн → run 398d0214 (issue_reopened_via_comment, contextSnapshot.issueId = CMP-1) succeeded, 16 мин, 3.71$ (subscription_included). Агент батлагдсан төлөвлөгөөг хэрэгжүүлж 4 claude_local агент hire хийж, CMP-2…5 task үүсгэсэн. Тэдгээрийн 5 run бүгд succeeded, CMP-1/2/3/5 done, CMP-4 in_review. Агентын 6 comment бүгд монгол. Run log-д cross_issue алдаа 0.
- codex_local: 2026-10-11 «Codex туршигч» (adapterConfig default) үүсгэж CMP-6 оноов → run f9920dda (issue_assigned) 45 сек-д succeeded, biller chatgpt (subscription_included), монгол comment бичиж CMP-6-г done болгосон. Usage-д model «unknown» гэж бүртгэгдсэн.
- Ажиглалт (Ү3-д засах нэр дэвшигч):
  - Agent JWT нууц onboarding-д байхгүй: PAPERCLIP_AGENT_JWT_SECRET ба BETTER_AUTH_SECRET аль аль нь байхгүй бол server зөвхөн WARN хэвлээд агентад PAPERCLIP_API_KEY өгөхгүй, агент API-д 401 авна. ED ~/.paperclip/instances/default/.env-д нууц бичиж шийдсэн.
  - Issue-гүй run: UI-ийн Run now (on-demand) run-ийн contextSnapshot-д issueId байхгүй. Ийм run-ийн comment/PATCH 403 cross_issue_influence_run_context_required авна. Мөн тийм run-ийн үүсгэсэн батлах картыг хүлээн авахад continuation шалгалт (execution-continuation.ts L120–144) source run-ийг олохгүй тул шинэ run setup_failed continuation_source_context_missing-ээр унаж, issue blocked болно. Тойрох зам: хүний comment blocked issue-г далд дахин нээж агентыг issue-тэй сэрээнэ (issues.ts L2294–2325).
  - acpx session race: нэг агентын зэрэгцээ хоёр manual run нэг persistent session бичлэг дээр ажиллаж, tmp нэр (pid + Date.now()) давхцаж бичлэг эвдэрсэн; closeBackendSession sessionOptions-гүй spawn хийж «node: not found». Stale бичлэгийг гараар зөөж шийдсэн.
  - Порт fallback: 3100 завгүй үед server чимээгүйхэн 3101 дээр асдаг («Requested port is busy; using next free port»), хоёр server зэрэг ажиллаж болно.
- **Төлөв: хаагдсан (2026-10-11).** claude_local ба codex_local хоёул issue-тэй heartbeat-ээр монгол хариу өгсөн; ED хүлээн зөвшөөрсөн.

## Ү1 хаалт

- 2026-09-30, commit fd105a9e2. Browser (dev, 1280px): Sidebar монголоор (Хянах самбар, Ирсэн, Даалгаврууд, Төслүүд, Агентууд, Аудит), хэл сэлгэгч хоёр тийш ажиллав (`lang` ба `xo.locale` mn↔en), Ө/Ү/Ё InterVariable-аар зөв харагдана, console-д i18n алдаагүй.
- Ногоон: ui typecheck; ui vitest 605 файл / 6319 тест; `xo:i18n:test` 45 тест; `xo:i18n:check` OK (keys=27); `pnpm --filter @paperclipai/ui build`.
- Нээлттэй: root `pnpm build` нь `packages/paperclip-runner`-ийн `cargo` шаардлагаар унана (Rust суугаагүй, upstream). `pnpm test:e2e` 136 passed / 78 skipped / 6 failed: 5 нь `execution-recovery/recovery.spec.ts` (CLI гаралтын ANSI код regex-ийг эвддэг), 1 нь `smoke-lab.shared.ts:316` (server catalog). Upstream d554c4789 дээр ижил 6 тест ижил assertion-оор унасан (2026-09-30 суурь шалгалт), XO-оос хамааралгүй. ED 2026-09-30-нд Ү1-ийг UI build + e2e дүнгээр хүлээн зөвшөөрсөн.
- Ү2-т нэмэх англи текст: MobileBottomNav (New Task), command palette, onboarding, dashboard картууд, Tasks хуудас.

## Ү2 хаалт

- 2026-09-30. Каталог: 1568 түлхүүр, keep-en 13, гараар шийдсэн тохиолдол 73 (Task 11 Step 4). Ногоон: xo:i18n:check OK (keys=1568); ui vitest 605 файл / 6319 тест.
- Build хаалга: root pnpm build ба server-ийн build нь packages/paperclip-runner-ийн cargo шаардаж унана (cargo суулгахгүй гэж ED шийдсэн). Үүний оронд pnpm -r --no-bail --filter '!@paperclipai/paperclip-runner' --filter '!@paperclipai/server' build (40 багц, exit 0), server-д tsc --noEmit (exit 0), pnpm --filter @paperclipai/ui build (exit 0). Ү1-д ED UI build-ийг хүлээн зөвшөөрсөн. Server-ийн tsc --noEmit-ийг build-ийн оронд ашиглахыг ED хараахан хүлээн зөвшөөрөөгүй (pending ED).
- E2E (pnpm test:e2e, system Chrome, порт 3199): 137 passed / 79 skipped / 7 failed. Шинэ xo-mn.spec.ts 2 тест ногоон, xo-screenshots.spec.ts 1 skipped (XO_SCREENSHOTS=1 үед 1 passed, 11 PNG).
- 7 унасан тестийн тайлбар:
  - recovery.spec.ts x5: upstream-д мөн унадаг (baseline d554c4789). CLI test-drive URL-ийг pc.cyan-аар ANSI кодтой хэвлэдэг тул spec-ийн regex таарахгүй, 60 секундэд timeout болно. XO-оос хамааралгүй, засаагүй.
  - smoke-lab.shared.ts:316 (P5-P7): бүтэн ажиллуулалтад унана, тусад нь ажиллуулбал XO ба baseline хоёуланд нь тэнцнэ. Baseline d554c4789 дээр ижил assertion-оор унах нь 2026-09-30-ны суурь шалгалтаар батлагдсан (дээрх Ү1 «Нээлттэй» мөр). Дараалалаас хамаарсан, XO-ийн өөрчлөлтийн шалтгаан нотлогдоогүй.
  - agent-chat.spec.ts:557 (Star товчны opacity): бүтэн ажиллуулалтад нэг удаа унасан, тусад нь 3/3 тэнцсэн. Flake гэж үзсэн нь нотлогдоогүй дүгнэлт: шалтгааныг тогтоогоогүй. Энэ нь Ү1-ийн 6 унасан тестээс гадна шинээр гарсан цорын ганц унасан тест.
- CompanyEnvironments.test.tsx flake: HEAD дээр 5/5, baseline дээр 5/5 тэнцсэн.
- multi-user-authenticated.spec.ts: newContext нь storageState өвлөдөггүй тул xo.locale=en-г test.use ба newContext-д тогтоосон. Энэ spec тусгай authenticated instance шаарддаг тул ажиллуулаагүй.
- Олон тооны хэлбэр (plural) шалгалт: CompanyImport, CompanyExport, IssueDetail, Costs(.production) бүгд transform-оор боловсрогдсон, засвар шаардлагагүй.
- Build a new organization текст d554c4789-д зөвхөн upstream spec-үүдэд байдаг, ui/src-д байхгүй тул орчуулагдахгүй. Spec-ийг хөндөөгүй.
- 11 дэлгэцийн зургийг (~/dev/xo-screenshots/) ED 2026-10-01-нд батласан. multi-user-authenticated.spec.ts-ийг ED мөн өдөр S-set-д нэмсэн.
- **Төлөв: хаагдсан (2026-10-01).** ED дараах гурвыг хүлээн зөвшөөрсөн: (1) 11 PNG; (2) spec §17-ийн pnpm build-ийн оронд cargo-гүй build ба server-ийн tsc --noEmit; (3) 7 улаан e2e дээрх тайлбартайгаар (recovery x5 upstream baseline-д мөн унадаг; smoke-lab:316 дараалалаас хамаарна, Ү1-д baseline-ийн бүтэн ажиллуулалтад мөн унасан; agent-chat:557 нь flake гэж нотлогдоогүй, шинэ уналт).

## Ү3 хаалт

- 2026-10-12, HEAD b2bc55f69 (Ү3-А брэнд, Ү3-Б L2/L3 ба үлдэгдэл, Ү3-В hardening).
- Build хаалга: root pnpm build нь packages/paperclip-runner-ийн cargo шаардаж Ү1, Ү2-ын адил унана. Ү2-д ED зөвшөөрсөн орлуулалт бүгд exit 0: pnpm -r --no-bail --filter '!@paperclipai/paperclip-runner' --filter '!@paperclipai/server' build (42 багц), server-д pnpm exec tsc --noEmit, pnpm --filter @paperclipai/ui build.
- Ү3-ын unit тест: 2026-10-02-оос хойш өөрчлөгдсөн 38 тест файлаас vitest-д хамаарах 32 файл, 641 тест давсан. xo:i18n:test 54/54; node --test (acpx-patch-packaging, xo-brand/scan) давсан.
- Шалгалт: xo:i18n:check OK (keys=1640); xo:i18n:check --server «server catalog OK: 2196 мессеж, 29 орчуулга»; xo:brand-scan OK (161 файл, 586 hit, baseline-аас өсөөгүй).
- Ү3.1 (L2/L3): Ү3-Б Task 6 Step 3-ын 5 browser сценари y3b-test:3110 дээр ec9f9e7-д давсан (wizard mn, эхний даалгаврын мэндчилгээ, API 404 «Ажил олдсонгүй», skill slug давхардлын 409 mn, interactionLanguage солих). Server давхар нэртэй байгууллагыг зөвшөөрдөг тул «давхар нэр» сценариг skill slug-аар сольсон.
- Ү3.2: «1 агент / 3 даалгавар» тест (Ү3-Б Task 6 Step 4) шинэ y3-close:3112 instance дээр давсан (2026-10-12, код b2bc55f69). Нэг claude_local агент («Туслах») CMP-1 (onboarding-ийн кофе шопын бизнес төлөвлөгөө), CMP-2 (нэрийн санал, 2 асуулттай карт), CMP-3 (баристагийн зар, 4 асуулттай карт) гурвыг дуусгаж, гурвуулаа done болсон. Агентын бичсэн бүх зүйл Монгол: мэндчилгээ, сэтгэгдэл, асуултын карт, баталгаажуулах карт, 2 баримт (plan, ajliin-zar). 1470 үгтэй гаралтад англи үг нь брэнд, ундааны нэр, URL slug-аас гадна «copy-paste», «reach», «inbox», «(done)» л байв.
  - Анхааруулга: claude_local агент хостын ~/.claude-ийг өвлөдөг. ED-ийн глобал CLAUDE.md Монгол хэл шаарддаг тул энэ тест XO-ийн interactionLanguage удирдамжийг тусгаарлаж шалгаагүй. Тусгаарлах бол тэр CLAUDE.md-гүй HOME-оор дахин ажиллуулна.
  - Апп-ын UI-д англи мөр үлдсэн (агентын гаралт биш): даалгаврын хуудсанд «Questions answered», «Working for N seconds», «run phase», «Message … — describe what you want done…», «Auto mode», «Attach image», Properties самбарын шошго; жагсаалтад «New Task», «Search tasks», «Filter/Sort/Group», «just now»; шинэ даалгаврын цонхонд «Task title», «Assignee», «Create Task», «Discard Draft». Ү6 7.1-ийн T2 багцад хамаарна.
- Ү3.3: telemetry анхдагчаар унтраалттай (Ү3-В Task 1), y3v-test:3111 дээр гарах холболтын гар шалгалт давсан (Ү3-В Task 7).
- E2E (pnpm test:e2e, PAPERCLIP_PLAYWRIGHT_CHANNEL=chrome, порт 3199, 22.4 мин): 135 passed / 79 skipped / 9 failed. Playwright-ийн chromium_headless_shell суугаагүй тул channel хувьсагчгүйгээр 117 тест browser нээж чадалгүй унана.
- 9 унасан тестийн тайлбар:
  - recovery.spec.ts:17 x5 ба smoke-lab.shared.ts:316: Ү2-ын baseline-д мөн унадаг, шалтгаан Ү2 хаалтад бичигдсэн. agent-chat.spec.ts:557 энэ удаа давсан.
  - conference-room-typing-intro.spec.ts:136, :151 ба planning-mode-visual-verification.spec.ts:33 (шинэ): «Connect» товч олдохгүй. Шалтгаан нь орчин. e2e server хостын HOME-ийг өвлөдөг, local_trusted горимд allowHostClaude идэвхтэй. Хост дээр Claude нэвтэрсэн байвал useLocalAiLogin «ready» буцааж, wizard upstream 669bd0e7a (#13499)-ийн auto-connect-оор model сонгомогц шууд Review алхам руу шилждэг. Spec-үүд хостын нэвтрэлтгүй орчныг таамагладаг. HOME-ийг хоосон хавтас болгож дахин ажиллуулахад 3/3 давсан. XO-ийн өөрчлөлттэй холбоогүй, spec-ийг хөндөөгүй.
- **Төлөв: нээлттэй.** Хаахын тулд ED хоёрыг хүлээн зөвшөөрнө: (1) дээрх 9 улаан e2e-ийн тайлбар; (2) Ү3.2-ын үр дүн хостын CLAUDE.md-ийн нөлөөтэй гэсэн анхааруулга.
