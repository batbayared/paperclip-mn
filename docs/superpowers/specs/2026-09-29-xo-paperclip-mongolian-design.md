# XO: Paperclip-ийн монгол бүтээгдэхүүн — дизайны баримт

Огноо: 2026-09-29. Статус: гурван дизайны хэсэг бүгд батлагдсан (1/3 хүрээ ба upstream стратеги, 2/3 апп-ын монголчлол, 3/3 вэбсайт ба пилот deploy).

## 1. Зорилго ба хүрээ

Paperclip (MIT, paperclipai/paperclip) нээлттэй эхийн агент удирдлагын системийг суурь болгон **XO** брэндтэй монгол бүтээгдэхүүн гаргана. Апп-ын интерфэйс монголоор, маркетингийн вэбсайт монголоор, эхний 1-2 пилот харилцагчид өөрийн Mac дээрээс хаалттай сүлжээгээр хүргэнэ. Агент адаптеруудаас Claude Code ба Codex-ийг эхэлж бүрэн ажиллагаатай болгоно.

Хамаарахгүй: docs/CLI/SDK-ийн орчуулга (англи хэвээр), олон нийтэд нээлттэй SaaS deploy, төлбөрийн систем, шинэ функц нэмэх, upstream-ийн package/env/CLI нэршлийг өөрчлөх.

## 2. Батлагдсан шийдвэрүүд

| Асуулт | Шийдвэр |
|---|---|
| Брэнд | XO (өөрийн брэнд; Paperclip-ийн лого, бичвэр, гэрчлэл ашиглахгүй; MIT мэдэгдэл хэвээр) |
| Суурь хувилбар | tag v2026.916.1 (commit d554c4789), салбар xo-main; сар бүр дараагийн release tag-тай sync |
| Байршил | ~/dev/paperclip-mn (iCloud Desktop-оос гадуур) |
| Апп-ын орчуулга | Жинхэнэ i18n (i18next суурь дээр), шатлалтай T1/T2/T3 |
| Хувиргалтын арга | A: build үед Vite plugin (эх .tsx хөндөхгүй) |
| Server мессеж | Server хөндөхгүй, клиент талын толь бичиг |
| Агентын хэл | Инстансын тохиргоо interactionLanguage (mn/en) → prompt мөр |
| Вэбсайт | Astro статик сайт, тусдаа repo xo-site, өөрийн монгол бичвэр |
| Сайтын hosting, домэйн | Vercel; танай домэйны дэд домэйн (жишээ xo.ateamgpt.com) |
| Пилот deploy | D1: Tailscale хаалттай, authenticated + private, embedded Postgres, таны Mac |
| Telemetry | XO build-д анхдагчаар унтраалттай |

## 3. Үе шатууд

| Үе | Агуулга | Дуусах шалгуур |
|---|---|---|
| Ү0 | Суулгах, ажиллуулах, адаптер холбох | localhost:3100 нээгдэнэ; Claude Code ба Codex адаптер тус бүр нэг даалгавар амжилттай гүйцэтгэнэ |
| Ү1 | Суурь: repo/remotes, brand төв тохиргоо, i18n суурь (mn locale, хэл сонгогч, анхдагч mn), build-time transform plugin, хамгаалалт (telemetry off) | Апп XO нэртэй; хэл сонгогч ажиллана; transform нэг файл дээр туршигдсан; en/mn parity тест ногоон |
| Ү2 | T1 орчуулга: пилотын цөм хуудсууд | T1 хуудсууд бүрэн монгол; тест ногоон; T1 файлд орчуулагдаагүй мөр 0 (xo:i18n:check) |
| Ү3 | Server мессежийн толь бичиг, агентын хэл (L2, L3) | T1 урсгалын API алдаа/мэдэгдэл монголоор; агент монгол даалгаврыг монголоор тайлагнана |
| Ү4 | XO вэбсайт (Astro) | 6 хуудас, 375px-д зөв, https домэйн дээр deploy-той |
| Ү5 | Пилот deploy | Гадаад төхөөрөмжөөс нэвтэрнэ; 24 цаг тасралтгүй; backup бий; 1-2 харилцагч онбординг |
| Ү6 | T2/T3 орчуулга, sync процесс тогтмолжуулах, upstream PR (боломжтой хэсэгт) | Тасралтгүй |

Энэ spec-ийн дараах төлөвлөгөө: Ү0-ийн үлдсэн алхам ба Ү1-Ү2 дэлгэрэнгүй; Ү3-Ү6 тоймоор, тус бүр өөрийн ээлжинд нарийвчлагдана.

## 4. Үүрэг

- Claude: код, transform plugin, орчуулгын драфт, тест, баримт, deploy скрипт.
- ED: шийдвэр, нэр томьёоны толь батлах, орчуулгын дэлгэцийн хяналт, лого SVG, API түлхүүр ба нууц үг (Claude хэзээ ч оруулахгүй), GitHub/Vercel/Tailscale/Tally бүртгэл, DNS бичлэг, пилот харилцагч.
- Пилот харилцагч: Tailscale апп суулгах, урилгаар нэвтрэх, санал хүсэлт.

## 5. Repo ба upstream стратеги

- Хоёр repo: **paperclip-mn** (fork, remotes: origin = ED-ийн GitHub, upstream = paperclipai/paperclip) ба **xo-site**. Вэбсайтыг fork дотор хийхгүй.
- XO-ийн нэмсэн бүх файл тусдаа хавтсанд (ui/src/i18n/xo/, ui/src/xo/, scripts/xo-i18n/, docs/xo/): upstream-тай давхцах гадаргуу бага.
- Гар засварын багц S (upstream-тай merge хийгдэх цөөн файл): ui/src/i18n/index.ts, ui/src/lib/utils.ts, SidebarAccountMenu.tsx ба SidebarAccountMenu.production.tsx, ui/index.html, ui/public/site.webmanifest, BreadcrumbContext.tsx, PaperclipLockup.tsx, Auth.tsx, docs/docs.json, server config-ийн telemetry анхдагч нэг мөр, L3-ийн 5 цэг.
- Sync ёслол (сар бүр): upstream-ийн дараагийн release tag татах → xo-main руу merge → S багцын зөрчил гараар → extract ажиллуулж en.json шинэчлэх → status.json-оос шинэ/өнчин түлхүүр гаргаж T1 мөрийг орчуулах → locales/mn.json-д upstream-ийн шинэ түлхүүр нэмэх → тест → xo-v<огноо> tag → пилот хост update. Nightly/beta хэзээ ч татахгүй.

## 6. Ү0 статус

- Клон, суулгац, цэвэр асаалт хийгдсэн: /api/health ok, version 2026.916.1, UI /onboarding нээгддэг.
- Native Rust runner-ийг инстансын тохиргоогоор унтраасан (enableNativeRunner=false; cargo байхгүй, диск дүүрэн). Claude Code ба Codex адаптер legacy замаар ажиллана. Rust хэрэгтэй болбол rustup + SDKROOT=$(xcrun --sdk macosx --show-sdk-path) + ~3 GB.
- Орчны тэмдэглэл: pnpm заавал 9.15.4 (~/dev/bin/pnpm wrapper), node 24 (nvm; login shell ~/.hermes/node 22-ыг түрүүлж олдог), PAPERCLIP_TELEMETRY_DISABLED=1. Dev тохиргоо Desktop төслийн .claude/launch.json дотор.
- Үлдсэн алхам (төлөвлөгөөний эхний ажил, ED-ийн нэвтрэлтээр, ED байхад): onboarding дуусгах, Claude Code адаптераар нэг, Codex адаптераар нэг даалгавар гүйцэтгэх.

## 7. Апп-ын монголчлол: олдворын дүгнэлт

1. i18next 26.4 + react-i18next суурь бий, гэхдээ 3 түлхүүр л (app.noCompanies.*) ашигладаг; .tsx-д ~5300+ хатуу англи мөр, нэмээд lib/hooks .ts-д.
2. locale-validation.ts: locale бүр en.json-той яг ижил түлхүүрийн багцтай байх ёстой, import үед throw хийнэ. Upstream-ийн 40 locale файлыг хөндөхгүй, өөрийн тусдаа namespace ашиглана.
3. Хэл сонгох механизм, хадгалалт, DB багана байхгүй.
4. Огноо/тоо формат бүгд en-US хатуу (lib/utils.ts).
5. .production.tsx 23 файл хоёулаа амьд (enableStreamlinedUi toggle): хоёуланд нь i18n.
6. ESLint байхгүй: өөрийн шалгах скрипт, ESLint нэмэхгүй.
7. Whitelabel hook байхгүй: brand.ts + S багцын гар засвар.
8. Server алдааны мессеж ~700, кодын enum байхгүй; UI 480 газар raw error.message харуулдаг.
9. i18next t() дуудлага бүрд keySeparator/nsSeparator дарж болно: байгалийн хэлний түлхүүр "xo" namespace-д ажиллана.

## 8. Гурван давхарга

| Давхарга | Юу | Хаана | Үе |
|---|---|---|---|
| L1 UI тогтмол текст | JSX текст, prop, toast, label map | ui/src/i18n/xo/{en,mn}.json | Ү1 суурь, Ү2 T1, Ү6 T2 |
| L2 Server мессеж | API алдаа, validation, approval мессеж | UI талын толь бичиг | Ү3 |
| L3 Агентын агуулга | даалгаврын тайлбар, асуулт, санал, тайлан | инстансын interactionLanguage → prompt | Ү3 |

## 9. L1: UI каталог

### 9.1 Түлхүүр
- Түлхүүр = англи эх текст: tx("Create organization"). en.json үүсгэгдэнэ (түлхүүр = утга), mn.json орчуулга.
- Тусдаа "xo" namespace. tx() wrapper (ui/src/i18n/xo.ts) t()-г ns "xo", keySeparator false, nsSeparator false, defaultValue = түлхүүртэй дуудна. Upstream-ийн nested 3 түлхүүр, 40 locale файл хэвээр.
- Placeholder: `${n} agents` → tx("{{n}} agents", {n}). Plural: `event${n===1?"":"s"}` хэв маягийг count-тай түлхүүр (i18next _one/_other).
- Brand: "Paperclip" агуулсан мөр → "{{brand}}" (interpolation.defaultVariables = BRAND.name).
- Хугарах JSX (текст дотор <a>) → <Trans ns="xo">; transform энгийн тохиолдлыг автоматаар, бусдыг жагсаалтаар гаргана.
- Upstream текст өөрчлөгдвөл түлхүүр солигдож орчуулга өнчирнө; status.json хуучин орчуулгыг сануулга болгон харуулна.

### 9.2 Хувиргалт: build үед Vite plugin (A)
- @babel/parser + visitor. Vite plugin transform hook нь .tsx модулийг санах ойд хувиргана; эх файл диск дээр өөрчлөгдөхгүй. Sync-д .tsx зөрчил 0.
- Гурван горим, нэг transform код: extract (en.json үүсгэх), check (T1 файлд орчуулагдаагүй мөр байвал унана), emit (хувиргасан файлуудыг scratch хавтас руу бичих; debug-д).
- Хамрах: JSX текст; prop allowlist (title, label, placeholder, description, aria-label, alt, lede, body, detail, tooltip, emptyText); pushToast/label map объектын ижил нэртэй талбар; template literal; хоёр литералын ternary; plural хэв маяг.
- Хасах: код/ID/className/URL/enum утга, зөвхөн тоо-тэмдэг, тестийн файл, storybook.
- lib/hooks .ts дахь мессеж: T1 жагсаалтын файлуудад л гараар tx() (~15 файл, S багцад орно).
- Хувиргалтын харагдах байдал: dev-д эх файл англи, апп монгол. Debug-д emit горим; en.json өөрөө "юу хувирсан"-ы манифест.

### 9.3 Файлууд
- ui/src/i18n/xo/en.json (үүсгэгдсэн), mn.json (орчуулга), status.json (орчуулагдсан/орчуулагдаагүй/өнчин), glossary.md.
- ui/src/i18n/xo.ts (tx, useTx, Trans wrapper, resolveLocale), ui/src/xo/brand.ts, ui/src/xo/format.ts.
- scripts/xo-i18n/ (transform, extract, check, emit, sync-report, extract-server).
- ui/src/i18n/locales/mn.json: upstream-ийн 3 түлхүүрийн орчуулга → locales.ts-ийн glob автоматаар бүртгэнэ, supportedLngs засахгүй. Upstream en.json-д түлхүүр нэмэгдэх бүрт mn.json-д нэмнэ (validator шаарддаг, build унаж сануулна).
- Validation: upstream-ийн validateLocaleMessages-ийг xo en↔mn хосод дахин ашиглана. Орчуулагдаагүй түлхүүр = en утга (апп унахгүй), status.json-д untranslated.

### 9.4 Хэл сонголт
- Анхдагч mn (VITE_XO_DEFAULT_LOCALE; тест/e2e-д en). Хадгалалт localStorage "xo.locale". navigator.language ашиглахгүй.
- Сонгогч: sidebar-ын хэрэглэгчийн цэс (энгийн + .production хоёр файл). document.documentElement.lang тохируулна.
- DB багана, инстансын анхдагч хэл: пилотод хэрэггүй; хүсэлт гарвал Ү6-д.

### 9.5 Формат, фонт
- utils.ts формат функцүүд одоогийн хэлээр (mn-MN / en-US); relativeTime → Intl.RelativeTimeFormat. Валют: LLM зардал USD тул "$" хэвээр, ₮ хөрвүүлэлт хийхгүй.
- Inter Variable бүтэн файл (352 KB) кирилл дэмжинэ гэж үзнэ; Өө Үү-г Ү1-ийн эхний алхамд дэлгэц дээр шалгана. Байхгүй бол Noto Sans-ийг өөрөө хостолно.

### 9.6 Шатлал
- T1 (Ү2, ~2000-2500 мөр, extraction нарийвчилна): onboarding wizard, sidebar/навигац, dashboard, companies, agents (list/new/detail), issues (list/detail/composer), goals, projects, approvals, inbox/decisions, costs, company settings, instance settings (experimental орно), auth, нийтлэг ui/ компонент (dialog, toast, empty state).
- T2 (Ү6): apps/connections, skills studio, routines, pipelines, cases, board chat, learnings, review queue, workspaces, artifacts, design guide.
- T3: docs (Mintlify), CLI, plugin SDK, MCP: англи хэвээр.

### 9.7 Орчуулгын ажлын урсгал
1. Нэр томьёоны толь (30-50 үг: organization, agent, issue, goal, approval, heartbeat, run, budget, workspace): ED хянаж батална.
2. Claude эхний хувилбар (толиор); дэлгэц дээр хянана (Playwright screenshot багц).
3. Хэв маяг: "та" хүндэтгэлийн хэлбэр; товчлуур богино тушаал ("Хадгалах", "Үүсгэх"); техник нэр (Claude Code, Codex, API, token) хэвээр.

## 10. Брэнд төв тохиргоо (Ү1)

- ui/src/xo/brand.ts: name "XO", fullName, tagline, siteUrl, supportEmail, лого компонент (SVG-г ED өгнө; түр XO үсэгтэй wordmark).
- Каталог доторх "Paperclip" → {{brand}}. Гар засвар: index.html title/meta, site.webmanifest, BreadcrumbContext дагавар, PaperclipLockup → XoLockup, Auth.tsx, docs/docs.json. Theme localStorage түлхүүр хэвээр.
- Хөндөхгүй: @paperclipai/* package нэр, PAPERCLIP_* env, DB нэр, docker volume, CLI bin paperclipai.

## 11. L2: Server мессеж (Ү3)

- Server кодыг өөрчлөхгүй. UI-ийн API client алдаа үүсгэх цэгт толь бичиг: code байвал code→mn, үгүй бол англи мессеж→mn (яг таарах); олдохгүй бол англиар дамжина.
- scripts/xo-i18n/extract-server.ts server/src-аас error:/message: литералуудыг түүж en жагсаалт гаргана; T1 урсгал (onboarding, agent/issue/approval, validation)-ын хэсгийг орчуулна.
- Таамаглал (Ү3-ын эхний алхамд шалгана): API дуудлага нэг fetch wrapper-аар дамжиж Error үүсгэдэг. Олон цэгтэй бол орчуулгыг алдаа харуулах helper (pushToast орчим) дээр хийнэ.

## 12. L3: Агентын хэл (Ү3)

- Инстансын тохиргоо interactionLanguage: "mn" | "en" (XO анхдагч mn). Simplified English Interactions механизмыг хуулна: packages/shared types/validators/feature-catalog → server instance-settings → heartbeat pass-through → adapter-utils prompt мөр → UI toggle (InstanceExperimentalSettings).
- Prompt мөрийн утга: хүнд хандсан бүх текстийг (тайлбар, асуулт, санал, зөвшөөрлийн хүсэлт, дүгнэлт) монголоор бич; код, команд, файлын зам, техник нэр өөрчлөхгүй.
- Onboarding-оос үүсдэг анхдагч агентуудын нэр/тайлбар англи хэвээр; монгол seed загвар Ү6-д сонголтоор.

## 13. Telemetry

XO build-д upstream telemetry анхдагчаар унтраалттай (server config default нэг мөр, S багцад). Шалтгаан: өөрийн брэндийн бүтээгдэхүүнээс Paperclip-ийн endpoint руу хэрэглээний өгөгдөл явуулах үндэслэлгүй.

## 14. Ү4: XO вэбсайт

- Repo xo-site: Astro 5, Tailwind v4, статик гаралт, CMS байхгүй. Брэнд токен (нэр, өнгө, tagline) site.config.ts-д; апп-ын brand.ts-тэй гараар тааруулна.
- Агуулга бүрэн монгол, өөрийн бичвэр. paperclip.ing зөвхөн бүтцийн лавлагаа (hero → 3 алхам → боломжууд → загвараас хамааралгүй → зорилгын шатлал → heartbeat → зардал → аудит → нээлттэй эх → удирдлага → FAQ → CTA). Гэрчлэл зохиохгүй; оронд нь "Пилот хөтөлбөр" хэсэг. "Тухай" хуудсанд Paperclip нээлттэй эхийн суурийг нээлттэй бичнэ.
- Хуудсууд: / Нүүр; /buteegdekhuun Бүтээгдэхүүн; /khereglee Хэрэглээ (Монгол ЖДҮ-ийн 4 хувилбар: инженерчлэл, маркетинг/контент, үйл ажиллагаа, харилцагчийн үйлчилгээ); /pilot Пилот хөтөлбөр (форм); /ekhlekh Эхлэх (суулгах, эхний агент, эхний даалгавар товч; гүнзгий баримт upstream docs руу); /tukhai Тухай ба холбоо барих (нууцлалын мэдэгдэл орно).
- Форм: Tally embed (ED бүртгэл үүсгэнэ). Deploy: Vercel; домэйн ED-ийн домэйны дэд домэйн (жишээ xo.ateamgpt.com), DNS бичлэгийг ED нэмнэ; хүртэл нь vercel.app.
- Фонт Inter (кирилл) өөрөө хостолно; гэрэл/харанхуй горим; гар утас эхэнд.
- Шалгуур: 6 хуудас бүрэн монгол; 375px-д хэвтээ гүйлтгүй; Lighthouse mobile ≥ 90 (performance, accessibility); холбоос эвдрэлгүй; форм илгээлт нэг удаа туршсан; https домэйн дээр нээгддэг.

## 15. Ү5: Пилот deploy (D1)

### 15.1 Repo-оос батлагдсан баримт
- Deployment mode local_trusted | authenticated; exposure private | public; bind loopback | lan | tailnet | custom (packages/shared/src/constants.ts).
- Нэвтрэлт Better Auth, зөвхөн имэйл + нууц үг; OIDC байхгүй. Sign-up хаах: PAPERCLIP_AUTH_DISABLE_SIGN_UP. Хэрэглэгчийг компанийн урилгаар нэмнэ.
- authenticated + private: embedded Postgres болно; эхний админ хөтчөөс "Claim this instance". Албан заавар docs/deploy/tailscale-private-access.md.
- authenticated + public (D2/D3-д): https public URL, гадаад Postgres (DATABASE_URL), эхний админ CLI-аар (paperclipai auth bootstrap-ceo), BETTER_AUTH_SECRET, proxy-той бол TRUST_PROXY=loopback.
- Managed install: paperclipai install --repo <owner/repo> --ref <tag> fork-ийг GitHub-аас татна; onboard --bind tailnet --install-service → macOS LaunchAgent; paperclipai update (backup, atomic switch, rollback); paperclipai doctor. Node ≥ 24.11.
- Backup: цаг тутам .sql.gz (7 өдөр/4 долоо хоног/1 сар); data/storage ба secrets/master.key dump-д ордоггүй; эхний backup 60 минутын дараа (тэр хүртэл health database_backup_missing).
- Төсөв: компани/агент/төслийн сарын хязгаар, 80% анхааруулга, 100% хатуу зогсоолт (server/src/services/budgets.ts). Subscription төрлийн billing зардлыг 0 гэж тайлагнаж болзошгүй.

### 15.2 Сонгосон хувилбар D1 ба хувилбарууд
- **D1 (сонгосон):** ED-ийн Mac дээр, authenticated + private, bind tailnet эсвэл loopback + tailscale serve https, embedded Postgres, LaunchAgent. Пилот хэрэглэгч Tailscale апп суулгаж tailnet-д нэгдэнэ (Personal төлөвлөгөө 3 хэрэглэгч хүртэл үнэгүй). Хамгийн бага ажил, интернетэд ил гарахгүй.
- D2 (дараагийн шат): VPS, docker compose (server + postgres:17) + Caddy https, сард 6-12 доллар. Пилот амжилттай бол Ү6-ийн дараа тусад нь төлөвлөнө.
- D3 (татгалзсан): Mac + Cloudflare Tunnel; гадаад Postgres суулгах хэрэгтэй, хамгийн их ажил.

### 15.3 D1 алхмууд
1. Урьдчилсан нөхцөл: диск ≥ 20 GB чөлөөтэй; Mac унтахгүй тохиргоо (Energy эсвэл caffeinate LaunchAgent; Mac mini зүйтэй); nvm node 24; Tailscale суулгасан (ED).
2. Fork-ийг GitHub-д push (Ү1-ийн repo алхам).
3. Release tag xo-v<огноо> → paperclipai install --repo <owner>/paperclip-mn --ref <tag> → onboard --bind tailnet --install-service.
4. Mode authenticated + private; public URL https://<mac>.<tailnet>.ts.net (tailscale serve :443 → 127.0.0.1:3100); cookie Secure.
5. Эхний админ: ED хөтчөөс claim. Пилот компани бүрд тусдаа company, урилгаар хэрэглэгч, дараа нь sign-up хаана.
6. API түлхүүр, CLI нэвтрэлтийг ED өөрөө оруулна.
7. Төсөв: пилот компани бүрд сарын хязгаар (эхлэл 20-50 доллар), 80/100% анхдагчаар.
8. Backup: цагийн dump + инстансын хавтсыг (master.key орно) өдөр бүр өөр диск/cloud руу хуулах launchd скрипт; нэг удаа сэргээх сургуулилт.
9. Мониторинг: launchd curl /api/health → лог файл; 24 цагийн дараа шалгана.

### 15.4 Шалгуур
Пилот хэрэглэгчийн төхөөрөмжөөс https URL нээгдэж нэвтэрнэ; 24 цаг health ok; backup файл бий; пилот хэрэглэгч Claude Code ба Codex адаптераар тус бүр нэг даалгавар гүйцэтгэсэн; компани А-гийн хэрэглэгч компани Б-г харахгүй (тусгаарлалтын тест, заавал).

## 16. Эрсдэл ба хариу арга

| Эрсдэл | Хариу |
|---|---|
| Upstream i18n PR хүлээж авдаггүй | Давхарга бүхэлдээ fork-д, build үед үүсгэгдэнэ; sync зөрчил бага |
| Upstream текст өөрчлөгдөж орчуулга өнчрөх | status.json тайлан; sync ёслолд "шинэ/өнчин түлхүүр" алхам |
| Агент давталтад орж зардал өсөх | Эхний өдрөөс төсвийн хатуу зогсоолт; billing 0 тайлагнах магадлалтай тул /activity/costs-ыг долоо хоног бүр гараар шалгах |
| Native runner унтраалттай, Rust байхгүй | Legacy адаптер хангалттай; хэрэгтэй болбол rustup + SDKROOT + 3 GB |
| pnpm 11 / hermes node PATH | wrapper, launch.json PATH; пилот хостод nvm 24 тодорхой заана |
| Диск 97% дүүрэн | Ү5-ийн урьдчилсан нөхцөл ≥ 20 GB |
| Mac унтах, лаптоп хаах | Energy тохиргоо/caffeinate; LaunchAgent дахин асаана |
| Нэвтрэлт имэйл баталгаажуулалтгүй | Урилгаар л нэмэх, sign-up хаах; tailnet-ээс гадуур хүрэхгүй |
| master.key dump-д байхгүй | Инстансын хавтсыг бүхэлд нь хуулах |
| Кирилл фонт | Ү1-ийн эхний шалгалт; шаардлагатай бол Noto Sans |
| Sync-ийн дараа validator унах | mn.json-д upstream түлхүүр нэмэх алхам; build өөрөө сануулна |
| L2 fetch wrapper олон цэгтэй | Толь бичгийг pushToast орчмын helper дээр шилжүүлнэ |
| Брэнд/лиценз | MIT мэдэгдэл хэвээр; Paperclip-ийн лого, бичвэр ашиглахгүй; гэрчлэл зохиохгүй |

## 17. Тест ба чанарын хаалт

- Апп: tsc + build ногоон; Vitest en↔mn parity (validator дахин ашиглана); pnpm xo:i18n:check (T1 файлд орчуулагдаагүй мөр байвал унана); upstream-ийн Playwright e2e багц en горимд ногоон; mn smoke (onboarding 1-р алхам, sidebar, нэг toast); T1 дэлгэцүүдийн screenshot жагсаалтаар нүдээр хянана.
- Ү0 хаалт: Claude Code ба Codex адаптераар нэг нэг даалгавар (ED-ийн нэвтрэлтээр, ED байхад).
- Сайт: astro build, холбоосын шалгалт, 375px, Lighthouse mobile ≥ 90, форм илгээлт.
- Deploy: §15.4 шалгуур; нэг удаагийн сэргээх сургуулилт.
- Sync ёслол: §5.

## 18. Upstream sync-д үзүүлэх нөлөө

| Хэсэг | Зөрчлийн магадлал |
|---|---|
| .tsx эх файл | 0 (хөндөөгүй) |
| S багц ~12 файл | бага, гараар |
| xo/*.json, scripts/xo-i18n, docs/xo | 0 (upstream-д байхгүй) |
| Орчуулга | текст өөрчлөгдсөн түлхүүр дахин орчуулна (status.json) |
| L3 5 цэг | дунд (heartbeat.ts, server-utils.ts том файл) |

## 19. ED-ээс ирэх оролт (хугацаа)

| Оролт | Хэзээ хэрэгтэй |
|---|---|
| GitHub repo (paperclip-mn, xo-site) үүсгэх эсвэл эрх | Ү1 эхлэл |
| Нэр томьёоны толь батлах | Ү2 эхлэл |
| Лого SVG | Ү1 (хүртэл нь түр wordmark) |
| Tally бүртгэл, Vercel төсөл, DNS бичлэг | Ү4 |
| Tailscale бүртгэл, Mac-ийн Energy тохиргоо, диск чөлөөлөх | Ү5 эхлэл |
| API түлхүүр, Claude/Codex нэвтрэлт | Ү0 сүүлийн алхам, Ү5 |
| Пилот харилцагч 1-2 | Ү5 |
