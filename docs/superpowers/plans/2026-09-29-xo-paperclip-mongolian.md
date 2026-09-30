# XO — Paperclip-ийг монгол хэлээр гаргах хэрэгжүүлэлтийн төлөвлөгөө

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Зорилго:** Paperclip v2026.916.1 дээр суурилсан, XO брэндтэй, монгол хэлтэй, Claude Code + Codex адаптертай, пилот хэрэглэгчид хаалттай сүлжээгээр хүрэх бүрэн ажиллагаатай бүтээгдэхүүн гаргах.

**Архитектур:** Upstream кодыг аль болох хөндөхгүй. Орчуулгын түлхүүр нь англи текст өөрөө; build үед Vite plugin (Babel + magic-string) заасан .tsx файлуудын англи мөрийг `tx("…")` дуудлагаар сольж, `ui/src/i18n/xo/{en,mn}.json` толийг CLI-ээр гаргана. Хэл сонголт localStorage `xo.locale` дээр, формат Intl (mn-MN / en-US) дээр, брэнд `ui/src/xo/brand.ts` нэг цэгт байна. Серверийн мессеж (Ү3), вэбсайт (Ү4), пилот deploy (Ү5) тус тусдаа үе шат.

**Технологи:** pnpm 9.15.4 monorepo, Node 24.16.0 (nvm), Vite 8 + React 19 + Tailwind v4, i18next 26.4.0 + react-i18next 17.0.12, Vitest 4, Playwright 1.62, @babel/parser + @babel/traverse + magic-string (шинэ root devDeps), Python fontTools (фонт шалгалт).

Spec: `docs/superpowers/specs/2026-09-29-xo-paperclip-mongolian-design.md` (commit 464c5b3d1).

---

## Нийтлэг хязгаарлалт (spec §2, §4, §5-аас; task бүрд хамаарна)

- Брэнд нэр: **XO**. Дүрсийн лого ED өгөх хүртэл текст лого (`XoLockup`).
- Суурь: upstream tag **v2026.916.1** (commit d554c4789), салбар **xo-main**, хавтас **~/dev/paperclip-mn**. Upstream-ийг сар бүр зөвхөн stable tag-аар татна; nightly/beta хэзээ ч биш.
- Node **>= 24.11.0** (суусан v24.16.0, nvm), pnpm **9.15.4** (`~/dev/bin/pnpm` wrapper). Rust native runner идэвхгүй (`enableNativeRunner=false`).
- Адаптер: **claude_local** ба **codex_local** л. Агентын heartbeat/task ажиллуулах бүрд ED байлцаж зөвшөөрнө (ED-ийн Claude/Codex нэвтрэлт, токен зарцуулна).
- i18n: одоо байгаа i18next суурь дээр, **T1/T2/T3** шатлалтай. T1 = Ү2-т бүрэн монгол. Түлхүүр = англи текст, namespace **"xo"**, `keySeparator:false`, `nsSeparator:false`.
- Орчуулгын хэв маяг: "та" хүндэтгэлийн хэлбэр, товчлуур богино тушаал хэлбэрээр ("Хадгалах", "Болих"), техникийн нэр (API key, token, heartbeat, Claude Code, Codex, GitHub) хэвээр, `{{placeholder}}` бүр хэвээр, `_one`/`_other` хоёулаа байна.
- Мөнгөн дүн "$" хэвээр (spec §9.5). Огноо/тоо mn-MN эсвэл en-US Intl.
- Хувилбар өөрчлөх файлын хүрээ (S-set): `ui/src/i18n/index.ts`, `ui/src/lib/utils.ts`, `ui/src/components/SidebarAccountMenu.tsx`, `ui/src/components/SidebarAccountMenu.production.tsx`, `ui/index.html`, `ui/public/site.webmanifest`, `ui/src/context/BreadcrumbContext.tsx` (+ test), `ui/src/pages/Auth.tsx`, `ui/vite.config.ts`, `ui/vitest.config.ts`, `docs/docs.json`, `tests/e2e/playwright.config.ts`, `package.json` (root), `.gitignore`, `server/src/config.ts` (Ү3, 1 мөр). Ү2-д нэмэгдэнэ (Task 11): Step 4-т гараар шийдсэн T1 `.tsx` файлууд ба Step 5-ын 8 `.ts` туслах файл (`ui/src/lib/activity-format.ts`, `ui/src/lib/built-in-agent-toast.ts`, `ui/src/hooks/useComposerStop.ts`, `ui/src/hooks/useRetryNowMutation.ts`, `ui/src/lib/agent-setup-fields.ts`, `ui/src/lib/announcement-preview.ts`, `ui/src/lib/app-gallery-copy.ts`, `ui/src/hooks/useDateRange.ts`) — Task 11 Step 15 эдгээрийг `docs/xo/SYNC.md`-ийн «Ү2-д нэмэгдсэн файлууд» хэсэгт жагсаана. Бусад upstream файлыг хөндөхгүй.
- Fork-ийн өөрийн хавтас (upstream-тэй зөрчилдөхгүй): `ui/src/xo/`, `ui/src/i18n/xo/`, `scripts/xo-i18n/`, `docs/xo/`, `tests/e2e/xo-*.spec.ts`.
- Хөндөхгүй: `@paperclipai/*` package нэр, `PAPERCLIP_*` env, DB нэр, CLI (`paperclipai`), MCP нэр, user-agent, theme localStorage түлхүүр `paperclip.theme`.
- Telemetry: анхдагчаар унтраалттай (Ү3).
- Вэбсайт: Astro 5 + Tailwind v4, тусдаа repo **xo-site**, Vercel, дэд домэйн **xo.ateamgpt.com** (Ү4).
- Deploy: **D1** — ED-ийн Mac, Tailscale, `authenticated` + `private`, `tailscale serve` :443 → 127.0.0.1:3100 (Ү5).
- Үүрэг: API түлхүүр, нууц үг, GitHub/Vercel/Tailscale/Tally бүртгэл, DNS-ийг **ED өөрөө** оруулна. Claude хэзээ ч нууц үг, түлхүүр оруулахгүй, бүртгэл үүсгэхгүй.
- Git: commit бүр `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>` trailer-тэй. Push хийхийн өмнө `find .git/refs -name '* 2*'` хоосон байхыг шалгана (iCloud-ийн " 2" хуулбар).
- Тест хаалга (spec §17): task бүрийн төгсгөлд заасан тест ногоон; Ү1 төгсгөлд `pnpm --filter @paperclipai/ui typecheck`, `cd ui && pnpm exec vitest run`, `pnpm build`, `pnpm test:e2e` ногоон (Task 10 Step 8); Ү2 төгсгөлд `pnpm xo:i18n:check` OK + `pnpm build && pnpm test:e2e` ногоон (Task 12).

---

## Ажлын орчин (task бүрийн эхэнд)

Bash-ийн cwd дуудлага бүрийн дараа `~/Desktop/ClaudeCode ED` руу буцдаг тул команд бүрийг `cd ~/dev/paperclip-mn && …` хэлбэрээр бич. Node/pnpm-ийг PATH-д нэм:

```bash
export PATH="$HOME/dev/bin:$HOME/.nvm/versions/node/v24.16.0/bin:$PATH"
cd ~/dev/paperclip-mn && node -v && pnpm -v && git branch --show-current && git status --short | head -5
```

Хүлээгдэх гаралт:

```
v24.16.0
9.15.4
xo-main
```

(status хоосон.) Доорх бүх командыг энэ PATH экспортын дараа ажиллуулна; товчлохын тулд команд бүрд экспортыг давтахгүй.

Хэрэгтэй хэрэгслүүд:

- tsx: `node cli/node_modules/tsx/dist/cli.mjs <файл.ts>` (root-д tsx суугаагүй).
- UI-ийн нэг тест: `cd ~/dev/paperclip-mn/ui && pnpm exec vitest run <зам>`.
- UI typecheck: `cd ~/dev/paperclip-mn && pnpm --filter @paperclipai/ui typecheck`.
- UI build: `cd ~/dev/paperclip-mn && pnpm --filter @paperclipai/ui build`.
- Dev server: `.claude/launch.json` дахь **paperclip-mn** тохиргоо (`pnpm dev:once`, порт 3100). Кодын өөрчлөлт бүрийн дараа server-ийг зогсоож дахин эхлүүлнэ (`dev:once` watch хийдэггүй).
- zsh-д glob-ыг заавал хашилтад бич (`'server/src/config*.test.ts'`), эс бөгөөс "no matches found" алдаагаар команд тасарна.

---

## Файлын бүтэц

Шинээр үүсгэх:

| Файл | Үүрэг |
|---|---|
| `docs/xo/y0-report.md` | Ү0 хаалтын тайлан (Task 0) |
| `docs/xo/SYNC.md` | Сар бүрийн upstream sync зан үйл (Task 1) |
| `scripts/xo-i18n/check-font.py` | Inter фонтын кирилл бүрэн байдлын шалгалт (Task 2) |
| `ui/src/xo/brand.ts` | Брэндийн нэг цэг `BRAND` (Task 3) |
| `ui/src/xo/XoLockup.tsx` | Текст лого SVG (Task 3) |
| `ui/src/i18n/locales/mn.json` + `ui/src/i18n/xo/upstream-locale.test.ts` | Upstream-ийн 3 түлхүүрийн монгол орчуулга ба parity тест (Task 4) |
| `ui/src/xo/locale.ts` + `locale.test.ts` | Хэл сонголт: унших, хадгалах, тэмдэг, document lang (Task 5) |
| `ui/src/i18n/xo.ts` + `xo.test.ts` | `tx()` wrapper, `XO_NS` (Task 5) |
| `ui/src/i18n/xo/en.json`, `mn.json`, `keep-en.json` | XO толь ба англиар үлдээх түлхүүрийн жагсаалт (Task 5, дараа нь CLI бичнэ) |
| `ui/src/xo/XoTrans.tsx` + `XoTrans.test.tsx` | Дотор нь JSX-тэй мөрийн орчуулга (Task 5) |
| `ui/src/lib/utils.locale.test.ts` | mn-MN формат тест (Task 6) |
| `ui/src/xo/XoLocaleMenuAction.tsx` + `XoLocaleMenuAction.test.tsx` | Хэл сэлгэгч цэсний мөр ба тест (Task 7) |
| `scripts/xo-i18n/transform.ts` + `transform.test.ts` | Babel codemod: string → `tx()` (Task 8) |
| `scripts/xo-i18n/vitest.config.ts`, `tsconfig.json` | scripts-ийн тест/typecheck тохиргоо (Task 8) |
| `scripts/xo-i18n/tiers.ts` | Transform хийх файлын жагсаалт (Task 9, Task 11-д өргөтгөнө) |
| `scripts/xo-i18n/cli.ts` | extract / check / emit / todo / merge (Task 9) |
| `ui/src/i18n/xo/parity.test.ts` | en/mn түлхүүр, placeholder тэнцүү (Task 9) |
| `scripts/xo-i18n/vite-plugin.ts` | Build үеийн transform (Task 10) |
| `docs/xo/glossary.md` | Нэр томьёоны толь, ED батална (Task 11) |
| `docs/xo/screenshot-review.md` | ED-ийн дэлгэцийн хяналтын тэмдэглэл (Task 11) |
| `tests/e2e/xo-mn.spec.ts`, `tests/e2e/xo-screenshots.spec.ts` | Монгол UI-ийн e2e ба дэлгэцийн зураг (Task 12) |

Өөрчлөх (S-set): дээрх "Нийтлэг хязгаарлалт"-д жагсаасан файлууд, тухайн task-д мөрийн дугаартай.

---

## ED-ээс авах оролт (spec §19)

| Хэзээ | Юу | Хэрэглэх газар |
|---|---|---|
| Task 0 | ED өөрөө onboarding хийж, Claude Code ба Codex-ээр нэг нэг даалгавар ажиллуулна | Ү0 хаалт |
| Task 1 | GitHub-д `paperclip-mn` repo: зам A public fork (зөвлөнө) эсвэл зам B private хоосон repo; GitHub хэрэглэгчийн нэр | remote origin |
| Task 2 | Inter-д кирилл дутуу бол Noto Sans woff2 татах зөвшөөрөл | фонт fallback |
| Task 3 | Дүрсийн лого SVG (заавал биш; байхгүй бол текст лого) | XoLockup |
| Task 11 | `docs/xo/glossary.md`-г батлах; дэлгэцийн зураг хянах | орчуулга |
| Ү4 | Vercel бүртгэл, DNS CNAME `xo.ateamgpt.com`, Tally form | вэбсайт |
| Ү5 | Tailscale бүртгэл, API түлхүүрүүд, админ нууц үг, пилот хэрэглэгчийн имэйл | deploy |

---

## Даалгаврын тойм

| # | Даалгавар | Үе шат |
|---|---|---|
| 0 | Ү0 хаалт: onboarding, Claude Code + Codex-ээр нэг нэг даалгавар, тайлан | Ү0 |
| 1 | Repo: fork, remote, SYNC.md | Ү1 |
| 2 | Inter фонтын кирилл шалгалт | Ү1 |
| 3 | Брэнд XO: brand.ts, XoLockup, title/manifest/breadcrumb/Auth/docs | Ү1 |
| 4 | Upstream locale `mn.json` | Ү1 |
| 5 | XO i18n runtime: locale.ts, tx(), XoTrans, index.ts | Ү1 |
| 6 | Формат: utils.ts Intl mn-MN/en-US | Ү1 |
| 7 | Хэл сэлгэгч: XoLocaleMenuAction, account цэс (2 файл) | Ү1 |
| 8 | Codemod transform.ts (TDD) | Ү1 |
| 9 | tiers.ts + CLI extract/check/emit/todo/merge + parity test + Sidebar орчуулга | Ү1 |
| 10 | Vite plugin + e2e англи storageState + build + browser шалгалт → Ү1 хаалт | Ү1 |
| 11 | T1 бүрэн орчуулга: glossary, tiers, 7 багц, гар засвар | Ү2 |
| 12 | e2e: xo-mn.spec, xo-screenshots.spec → Ү2 хаалт | Ү2 |
| — | Ү3 (сервер мессеж L2, interactionLanguage L3, telemetry), Ү4 (xo-site), Ү5 (D1 deploy), Ү6 (T2/T3, sync) — тойм | Ү3–Ү6 |

---

## Ү0 — Хаалт

### Task 0: Ү0 хаалт — onboarding, хоёр адаптераар нэг нэг даалгавар, тайлан

**Files:**
- Create: `docs/xo/y0-report.md`

**Interfaces:**
- Consumes: `.claude/launch.json` дахь `paperclip-mn` тохиргоо (порт 3100).
- Produces: `docs/xo/y0-report.md` — Ү1-ийг эхлүүлэх зөвшөөрлийн баримт. Кодын өөрчлөлт байхгүй.

Энэ task бүхэлдээ **ED байлцаж** гүйцэтгэнэ: onboarding-ийн маягт, API түлхүүр, агентын heartbeat бүгд ED-ийн гараар. Claude зөвхөн server асаах, шалгах, тайлан бичих.

- [ ] **Step 1: Server асаах**

`preview_start` хэрэгслээр `paperclip-mn` тохиргоог асаа (Bash-аар биш). Хүлээгдэх: браузерын tab `http://localhost:3100` дээр нээгдэнэ; `preview_logs`-д `listening` эсвэл `http://localhost:3100` мөр гарна.

- [ ] **Step 2: Health шалгах**

```bash
curl -s http://localhost:3100/api/health
```

Хүлээгдэх гаралт: `"ok"` ба `"2026.916.1"` хоёулаа агуулсан JSON (жишээ `{"status":"ok","version":"2026.916.1",...}`). Хэрэв `version` талбар өөр нэртэй бол `git describe --tags` = `v2026.916.1` гэдгийг тайланд бич.

- [ ] **Step 3: ED onboarding хийнэ**

ED браузерт `http://localhost:3100/onboarding` нээж байгууллага үүсгэн, **claude_local** адаптертай агент нэмнэ (нэвтрэлт нь ED-ийн Claude Code login). Claude юу ч оруулахгүй. Дууссаны дараа:

```bash
curl -s http://localhost:3100/api/companies | head -c 600
```

Хүлээгдэх: нэг байгууллагатай JSON массив (`"issuePrefix"` талбартай).

- [ ] **Step 4: Claude Code-оор нэг даалгавар**

ED тухайн агентад нэг жижиг даалгавар (issue) үүсгэж хариуцуулаад heartbeat-ийг гараар ажиллуулна. Claude зөвхөн ажиглана: `preview_logs` дээр heartbeat эхэлж дууссан мөрүүд, UI дээр issue-гийн төлөв өөрчлөгдсөн эсэх. Issue-гийн ID (жишээ `ABC-1`), run-ийн үр дүн (амжилттай/алдаа), алдааны текстийг тэмдэглэ.

- [ ] **Step 5: Codex-оор нэг даалгавар**

ED **codex_local** адаптертай хоёр дахь агент нэмж (Codex login ED-ийнх), мөн адил нэг issue + heartbeat. Ижил зүйлсийг тэмдэглэ.

- [ ] **Step 6: Тайлан бичих**

`docs/xo/y0-report.md`:

```markdown
# Ү0 хаалтын тайлан

- Огноо: 2026-MM-DD
- Хувилбар: v2026.916.1 (d554c4789), салбар xo-main
- Орчин: macOS, Node v24.16.0, pnpm 9.15.4, порт 3100, dev:once

## Адаптерын туршилт

| Адаптер | Агент | Issue | Heartbeat үр дүн | Тэмдэглэл |
|---|---|---|---|---|
| claude_local | <нэр> | <ID> | амжилттай / алдаа | |
| codex_local | <нэр> | <ID> | амжилттай / алдаа | |

## Ажиглалт

- (UI дээр гарсан онцлог, удаашрал, ойлгомжгүй мөр)

## Нээлттэй асуудал

- (Ү1-ээс өмнө шийдэх шаардлагатай зүйл; байхгүй бол "байхгүй")

## Шийдвэр

Ү1 эхлүүлэхэд бэлэн: тийм / үгүй (шалтгаан)
```

Хүснэгтийн мөр бүрийг бодит утгаар дүүргэ; `<...>` хэлбэр үлдээхгүй.

- [ ] **Step 7: Commit**

```bash
cd ~/dev/paperclip-mn && git add docs/xo/y0-report.md && git commit -q -m "docs(xo): Y0 gate report

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" && git log --oneline -1
```

Хүлээгдэх: `<sha> docs(xo): Y0 gate report`.

---

## Ү1 — Суурь ба нэг дэлгэц

### Task 1: Repo — fork, remote, SYNC.md

**Files:**
- Create: `docs/xo/SYNC.md`
- Modify: `.git/config` (remote нэр, командаар)

**Interfaces:**
- Produces: remote `upstream` = paperclipai/paperclip, remote `origin` = ED-ийн `paperclip-mn`; `docs/xo/SYNC.md`-ийн сар бүрийн зан үйл (Ү6 ашиглана).

Одоогийн байдал: `origin` = `https://github.com/paperclipai/paperclip.git`, **blob:none partial clone** (`.git` 76 MB, бүх түүхийн blob татаагүй).

- [ ] **Step 1: ED GitHub repo-гоо сонгоно (хоёр зам)**

- **A. GitHub fork (зөвлөнө):** ED GitHub дээр `paperclipai/paperclip`-ийг fork хийж нэрийг `paperclip-mn` болгоно. Public upstream-ийн fork **public** байна. Давуу тал: remote-д upstream-ийн бүх объект аль хэдийн байгаа тул push зөвхөн бидний commit-уудыг илгээнэ; Ү5-д `paperclipai install --repo` нэвтрэлтгүй ажиллана.
- **B. Private хоосон repo:** ED `paperclip-mn` нэртэй хоосон private repo үүсгэнэ (README-гүй). Push хийхийн өмнө partial clone-ыг бүтэн болгох шаардлагатай (Step 3b, хэдэн зуун MB татна).

ED-ийн GitHub нэрийг `GH_USER`-т өг.

- [ ] **Step 2: Remote-уудыг солих**

```bash
cd ~/dev/paperclip-mn && GH_USER=<ED-ийн GitHub нэр> && git remote rename origin upstream && git remote add origin "https://github.com/$GH_USER/paperclip-mn.git" && git remote -v
```

Хүлээгдэх гаралт:

```
origin	https://github.com/<GH_USER>/paperclip-mn.git (fetch)
origin	https://github.com/<GH_USER>/paperclip-mn.git (push)
upstream	https://github.com/paperclipai/paperclip.git (fetch)
upstream	https://github.com/paperclipai/paperclip.git (push)
```

`git remote rename` нь `remote.origin.partialclonefilter`/`promisor` тохиргоог `upstream` руу хамт зөөнө; шалга:

```bash
cd ~/dev/paperclip-mn && git config --get remote.upstream.partialclonefilter && git config --get remote.upstream.promisor
```

Хүлээгдэх: `blob:none` ба `true`.

- [ ] **Step 3a (зам A): iCloud хуулбар ref шалгах**

```bash
cd ~/dev/paperclip-mn && find .git/refs -name '* 2*'
```

Хүлээгдэх: хоосон гаралт. Ямар нэг мөр гарвал тэр файлыг устгаад дахин шалга (`~/.claude/memory/mistakes.md` §5).

- [ ] **Step 3b (зөвхөн зам B): partial clone-ыг бүтэн болгох**

```bash
cd ~/dev/paperclip-mn && git config --unset remote.upstream.partialclonefilter && git fetch --refetch upstream 2>&1 | tail -3 && git fsck --connectivity-only 2>&1 | tail -2
```

Хүлээгдэх: `fetch`-ийн төгсгөлд алдаагүй; `fsck` `missing` мөргүй. Дараа нь Step 3a-г мөн хий.

- [ ] **Step 4: Push (ED зөвшөөрнө)**

Push нь кодыг GitHub-д нийтэлнэ — ED "push хий" гэж баталсны дараа л:

```bash
cd ~/dev/paperclip-mn && git push -u origin xo-main 2>&1 | tail -3 && git push origin v2026.916.1 2>&1 | tail -1
```

Хүлээгдэх: `branch 'xo-main' set up to track 'origin/xo-main'.` ба таг `* [new tag]         v2026.916.1 -> v2026.916.1`.

- [ ] **Step 5: SYNC.md бичих**

`docs/xo/SYNC.md`:

```markdown
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
6. Толь шинэчлэх: `pnpm xo:i18n:extract && pnpm xo:i18n:check` → шинэ/өөрчлөгдсөн түлхүүрийг `ui/src/i18n/xo/mn.json`-д орчуул, `check` OK болтол.
7. Шалгалт: `pnpm --filter @paperclipai/ui typecheck && (cd ui && pnpm exec vitest run) && pnpm build && pnpm test:e2e`
8. Таг: `git tag "xo-$TAG" && git push origin xo-main "xo-$TAG"` (ED зөвшөөрсний дараа).
9. `docs/xo/SYNC.md`-ийн доорх түүхэнд мөр нэм.

## Ү2-д нэмэгдсэн файлууд

Task 11 (Step 4, 5) `tx()`/`XoTrans` нэмсэн upstream файлууд — Task 11 Step 15-д жагсаана.

## Түүх

| Огноо | Upstream tag | XO tag | Тэмдэглэл |
|---|---|---|---|
| 2026-09-29 | v2026.916.1 | — | суурь |
```

- [ ] **Step 6: Commit ба push**

```bash
cd ~/dev/paperclip-mn && git add docs/xo/SYNC.md && git commit -q -m "docs(xo): add upstream sync ritual

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" && git push -q origin xo-main && git log --oneline -1
```

Хүлээгдэх: `<sha> docs(xo): add upstream sync ritual`.

---

### Task 2: Inter фонтын кирилл шалгалт

**Files:**
- Create: `scripts/xo-i18n/check-font.py`
- Modify (зөвхөн дутуу бол): `ui/src/index.css:4-23`, `ui/public/fonts/` (шинэ woff2)

**Interfaces:**
- Produces: `python3 scripts/xo-i18n/check-font.py` → exit 0 = Inter-т 70 кирилл тэмдэгт бүгд байна; exit 1 = дутуу; exit 2 = fontTools/brotli суугаагүй.

`ui/public/fonts/InterVariable.woff2` (352 KB) ба `InterVariable-Italic.woff2` (388 KB) бүтэн Inter гэж таамаглаж байна; энэ task таамаглалыг баталгаажуулна. Монгол кириллд орос цагаан толгой (U+0410–U+044F, Ёё) дээр **Өө** (U+04E8/U+04E9) ба **Үү** (U+04AE/U+04AF) нэмэгдэнэ.

- [ ] **Step 1: brotli суулгах (woff2 задлахад хэрэгтэй)**

```bash
python3 -m pip install --user brotli 2>&1 | tail -1 && python3 -c "import fontTools, brotli; print(fontTools.version)"
```

Хүлээгдэх: `4.63.0` (fontTools аль хэдийн суусан; brotli шинээр).

- [ ] **Step 2: Шалгах скрипт бичих**

`scripts/xo-i18n/check-font.py`:

```python
#!/usr/bin/env python3
"""Inter woff2 фонтуудад монгол кирилл (70 code point) бүрэн байгаа эсэхийг шалгана."""
import sys
from pathlib import Path

try:
    from fontTools.ttLib import TTFont
except ImportError:
    print("fontTools олдсонгүй: python3 -m pip install --user fonttools brotli")
    sys.exit(2)

ROOT = Path(__file__).resolve().parents[2]
FONTS = [
    ROOT / "ui/public/fonts/InterVariable.woff2",
    ROOT / "ui/public/fonts/InterVariable-Italic.woff2",
]
# А–я (U+0410–U+044F) + Ёё + Үү + Өө
REQUIRED = list(range(0x0410, 0x0450)) + [0x0401, 0x0451, 0x04AE, 0x04AF, 0x04E8, 0x04E9]


def check(path: Path) -> int:
    rel = path.relative_to(ROOT)
    if not path.is_file():
        print(f"{rel}: файл олдсонгүй")
        return 1
    try:
        font = TTFont(str(path))
    except ImportError:
        print("brotli олдсонгүй: python3 -m pip install --user brotli")
        sys.exit(2)
    cmap = font.getBestCmap()
    missing = [cp for cp in REQUIRED if cp not in cmap]
    if missing:
        listed = " ".join(f"U+{cp:04X}({chr(cp)})" for cp in missing)
        print(f"{rel}: ДУТУУ {len(missing)} тэмдэгт: {listed}")
        return 1
    print(f"{rel}: OK ({len(REQUIRED)} кирилл тэмдэгт бүгд байна)")
    return 0


def main() -> int:
    status = 0
    for path in FONTS:
        status = max(status, check(path))
    return status


if __name__ == "__main__":
    sys.exit(main())
```

- [ ] **Step 3: Ажиллуулах**

```bash
cd ~/dev/paperclip-mn && python3 scripts/xo-i18n/check-font.py; echo "exit=$?"
```

Хүлээгдэх гаралт:

```
ui/public/fonts/InterVariable.woff2: OK (70 кирилл тэмдэгт бүгд байна)
ui/public/fonts/InterVariable-Italic.woff2: OK (70 кирилл тэмдэгт бүгд байна)
exit=0
```

`exit=0` бол Step 4-ийг алгасаад Step 5 руу.

- [ ] **Step 4 (зөвхөн ДУТУУ бол): Noto Sans кирилл fallback**

ED-ээс татах зөвшөөрөл ав (файлын нэр, эх сурвалж, хэмжээг хэлж). Google Fonts-ийн CSS-ээс кирилл дэд багцын URL-ийг ол:

```bash
curl -sA "Mozilla/5.0" "https://fonts.googleapis.com/css2?family=Noto+Sans:wght@100..900&display=swap" | grep -B1 -A4 "/\* cyrillic \*/" | grep -o "https://[^)]*woff2"
```

Гарсан URL-ийг `ui/public/fonts/NotoSans-Cyrillic.woff2` болгож тат (`curl -sL -o …`), дараа нь `ui/src/index.css`-д одоо байгаа хоёр `@font-face`-ийн (мөр 4–18) дараа нэм:

```css
@font-face {
  font-family: "NotoSansCyrillic";
  src: url("/fonts/NotoSans-Cyrillic.woff2") format("woff2");
  font-weight: 100 900;
  font-display: swap;
  unicode-range: U+0400-04FF;
}
```

Мөр 23-ын `--font-sans`-ыг:

```css
--font-sans: "InterVariable", "NotoSansCyrillic", "Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

`unicode-range` учир латин үсэг Inter-ээр, дутуу кирилл л Noto-гоор буна.

- [ ] **Step 5: Commit**

```bash
cd ~/dev/paperclip-mn && git add scripts/xo-i18n/check-font.py ui/src/index.css ui/public/fonts && git commit -q -m "chore(xo): add Cyrillic coverage check for Inter fonts

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" && git log --oneline -1
```

Хүлээгдэх: `<sha> chore(xo): add Cyrillic coverage check for Inter fonts`. (Step 4 хийгээгүй бол index.css, fonts өөрчлөлтгүй; `git add` алдаа өгөхгүй.)

---

### Task 3: Брэнд XO — brand.ts, XoLockup, title/manifest/breadcrumb/Auth/docs

**Files:**
- Create: `ui/src/xo/brand.ts`, `ui/src/xo/XoLockup.tsx`
- Modify: `ui/index.html:2,7,8`; `ui/public/site.webmanifest`; `ui/src/context/BreadcrumbContext.tsx:70` (+ import); `ui/src/context/BreadcrumbContext.test.tsx:106-120`; `ui/src/pages/Auth.tsx:11,92,96`; `docs/docs.json:3`
- Test: `ui/src/context/BreadcrumbContext.test.tsx`

**Interfaces:**
- Produces: `BRAND` (`ui/src/xo/brand.ts`): `{ name: "XO"; fullName: string; tagline: string; siteUrl: string; supportEmail: string }` — Task 5 (`defaultVariables.brand`), Task 8-ийн codemod (`BRAND.name` → `{{brand}}`) ашиглана. `XoLockup` компонент (`ui/src/xo/XoLockup.tsx`).
- `ui/src/components/PaperclipLockup.tsx`-ийг хөндөхгүй (upstream файл); Auth.tsx л XoLockup руу шилжинэ.

- [ ] **Step 1: brand.ts**

`ui/src/xo/brand.ts`:

```ts
export const BRAND = {
  name: "XO",
  fullName: "XO — AI агентын удирдлагын систем",
  tagline: "AI агентуудаа нэг байгууллага шиг удирд",
  siteUrl: "https://xo.ateamgpt.com",
  supportEmail: "admin@ateamgpt.com",
} as const;
```

- [ ] **Step 2: XoLockup.tsx (текст лого)**

ED дүрсийн SVG өгөх хүртэл текст лого. `ui/src/xo/XoLockup.tsx`:

```tsx
import type { SVGProps } from "react";

type XoLockupProps = {
  decorative?: boolean;
  title?: string;
} & Omit<SVGProps<SVGSVGElement>, "children">;

export function XoLockup({ decorative = false, title = "XO", className, ...rest }: XoLockupProps) {
  return (
    <svg
      {...rest}
      className={className}
      viewBox="0 0 64 24"
      fill="currentColor"
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : title}
      focusable="false"
    >
      <text x="0" y="19" fontFamily="Inter, system-ui, sans-serif" fontSize="22" fontWeight="700" letterSpacing="1">
        XO
      </text>
    </svg>
  );
}
```

ED дараа нь дүрсийн лого өгвөл зөвхөн энэ файлын `<text>`-ийг path-аар солино; дуудагч талыг хөндөхгүй.

- [ ] **Step 3: index.html**

`ui/index.html` мөр 2: `<html lang="en" class="dark">` → `<html lang="mn" class="dark">`.
Мөр 7: `content="Paperclip"` → `content="XO"`. Мөр 8: `<title>Paperclip</title>` → `<title>XO</title>`.

- [ ] **Step 4: site.webmanifest**

`ui/public/site.webmanifest`: `"name": "Paperclip"` → `"name": "XO"`, `"short_name": "Paperclip"` → `"short_name": "XO"`, `"description": "AI-powered project management and agent coordination platform"` → `"description": "AI агентуудыг нэг байгууллага шиг удирдах систем"`. Бусад талбар хэвээр.

- [ ] **Step 5: Тестийг эхлээд өөрчлөх (TDD)**

`ui/src/context/BreadcrumbContext.test.tsx` мөр 106–120 дахь хүлээгдэх утгууд:

- `"Inbox • Anachronist Wiki • Paperclip"` → `"Inbox • Anachronist Wiki • XO"`
- `"PAP-3515 • Issues • Anachronist Wiki • Paperclip"` → `"PAP-3515 • Issues • Anachronist Wiki • XO"`
- `"Inbox • Paperclip"` → `"Inbox • XO"`
- `expect(buildDocumentTitle([], null)).toBe("Paperclip")` → `.toBe("XO")`
- Тестийн нэр `"builds page titles with the selected company name before Paperclip"` → `"... before XO"`.

```bash
cd ~/dev/paperclip-mn/ui && pnpm exec vitest run src/context/BreadcrumbContext.test.tsx 2>&1 | tail -6
```

Хүлээгдэх: `Tests  … 2 failed` (хоёр title тест унана).

- [ ] **Step 6: BreadcrumbContext.tsx**

`ui/src/context/BreadcrumbContext.tsx`-ийн import хэсэгт `import { BRAND } from "@/xo/brand";` нэм. Мөр 70:

```ts
  const parts = [...pageParts, ...companyPart, "Paperclip"];
```

→

```ts
  const parts = [...pageParts, ...companyPart, BRAND.name];
```

```bash
cd ~/dev/paperclip-mn/ui && pnpm exec vitest run src/context/BreadcrumbContext.test.tsx 2>&1 | tail -6
```

Хүлээгдэх: `Test Files  1 passed (1)`.

- [ ] **Step 7: Auth.tsx**

Мөр 11 `import { PaperclipLockup } from "../components/PaperclipLockup";` → доорх хоёр мөр:

```ts
import { BRAND } from "@/xo/brand";
import { XoLockup } from "@/xo/XoLockup";
```

Мөр 92 `<PaperclipLockup className="h-5 w-auto" />` → `<XoLockup className="h-5 w-auto" />`.
Мөр 96:

```tsx
{mode === "sign_in" ? "Sign in to Paperclip" : "Create your Paperclip account"}
```

→

```tsx
{mode === "sign_in" ? `Sign in to ${BRAND.name}` : `Create your ${BRAND.name} account`}
```

(Task 11-д codemod энэ template-ийг `tx("Sign in to {{brand}}")` болгоно; мөр 98–101-ийн тайлбарууд мөн тэнд орчуулагдана.)

- [ ] **Step 8: docs.json**

`docs/docs.json` мөр 3 `"name": "Paperclip"` → `"name": "XO"`.

- [ ] **Step 9: Шалгах**

```bash
cd ~/dev/paperclip-mn && pnpm --filter @paperclipai/ui typecheck 2>&1 | tail -2; grep -n "Paperclip" ui/index.html ui/public/site.webmanifest ui/src/context/BreadcrumbContext.tsx docs/docs.json; echo "grep exit=$?"
```

Хүлээгдэх: typecheck алдаагүй; grep гаралтгүй, `grep exit=1`.

- [ ] **Step 10: Commit**

```bash
cd ~/dev/paperclip-mn && git add ui/src/xo/brand.ts ui/src/xo/XoLockup.tsx ui/index.html ui/public/site.webmanifest ui/src/context/BreadcrumbContext.tsx ui/src/context/BreadcrumbContext.test.tsx ui/src/pages/Auth.tsx docs/docs.json && git commit -q -m "feat(xo): brand the app as XO

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" && git log --oneline -1
```

---

### Task 4: Upstream locale `mn.json`

**Files:**
- Create: `ui/src/i18n/locales/mn.json`, `ui/src/i18n/xo/upstream-locale.test.ts`

**Interfaces:**
- Produces: `supportedLocales` (`ui/src/i18n/locales.ts`) дотор `"mn"` — Task 5-д `lng: "mn"`, `changeLanguage("mn")` ажиллах нөхцөл. `locales.ts` нь `import.meta.glob("./locales/*.json")` учир файл нэмэхэд л бүртгэгдэнэ; `assertValidLocaleMessages` en.json-той түлхүүр/placeholder яг тэнцүү байхыг шаардана.

- [ ] **Step 1: Тест бичих**

`ui/src/i18n/xo/upstream-locale.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { validateLocaleMessages } from "../locale-validation";
import { supportedLocales } from "../locales";
import en from "../locales/en.json";
import mn from "../locales/mn.json";

describe("upstream mn locale", () => {
  it("is registered", () => {
    expect(supportedLocales).toContain("mn");
  });

  it("mirrors en.json keys and placeholders", () => {
    expect(validateLocaleMessages(mn, en)).toEqual([]);
  });
});
```

```bash
cd ~/dev/paperclip-mn/ui && pnpm exec vitest run src/i18n/xo/upstream-locale.test.ts 2>&1 | tail -4
```

Хүлээгдэх: FAIL — `Cannot find module '../locales/mn.json'`.

- [ ] **Step 2: mn.json**

`ui/src/i18n/locales/mn.json`:

```json
{
  "app": {
    "noCompanies": {
      "title": "Анхны байгууллагаа үүсгэнэ үү",
      "description": "Байгууллага үүсгэж эхэлнэ үү.",
      "newCompany": "Шинэ байгууллага"
    }
  }
}
```

```bash
cd ~/dev/paperclip-mn/ui && pnpm exec vitest run src/i18n/xo/upstream-locale.test.ts 2>&1 | tail -4
```

Хүлээгдэх: `Tests  2 passed (2)`.

- [ ] **Step 3: Commit**

```bash
cd ~/dev/paperclip-mn && git add ui/src/i18n/locales/mn.json ui/src/i18n/xo/upstream-locale.test.ts && git commit -q -m "feat(xo): add Mongolian upstream locale

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" && git log --oneline -1
```

---

### Task 5: XO i18n runtime — locale.ts, tx(), XoTrans, index.ts

**Files:**
- Create: `ui/src/xo/locale.ts`
- Create: `ui/src/xo/locale.test.ts`
- Create: `ui/src/i18n/xo/en.json`, `ui/src/i18n/xo/mn.json`, `ui/src/i18n/xo/keep-en.json`
- Create: `ui/src/i18n/xo.ts`
- Create: `ui/src/i18n/xo.test.ts`
- Create: `ui/src/xo/XoTrans.tsx`
- Create: `ui/src/xo/XoTrans.test.tsx`
- Modify: `ui/src/i18n/index.ts` (бүхэлд нь, доор эцсийн хувилбар)
- Modify: `ui/vitest.config.ts:11-14` (`test.env` нэмнэ)

**Interfaces:**
- Consumes: `BRAND.name` (`ui/src/xo/brand.ts`, Task 3); `ui/src/i18n/locales/mn.json` (Task 4) — `supportedLocales`-д `"mn"` орсон байх ёстой, эс бөгөөс i18next `lng: "mn"`-ийг хүлээж авахгүй.
- Produces (дараагийн task-ууд ашиглана):
  - `ui/src/xo/locale.ts`: `XO_LOCALES`, `type XoLocale = "mn" | "en"`, `XO_LOCALE_STORAGE_KEY = "xo.locale"`, `XO_DEFAULT_LOCALE = "mn"`, `isXoLocale(v: unknown): v is XoLocale`, `resolveLocale(): XoLocale`, `setLocale(locale: XoLocale): void`, `localeTag(locale?: XoLocale): "mn-MN" | "en-US"`, `applyDocumentLang(locale: XoLocale): void`.
  - `ui/src/i18n/xo.ts`: `XO_NS = "xo"`, `tx(key: string, options?: TOptions): string`.
  - `ui/src/xo/XoTrans.tsx`: `XoTrans({ i18nKey, values?, components? })`.
  - Толь: `ui/src/i18n/xo/en.json` (түлхүүр = Англи эх, утга = Англи эх), `mn.json` (түлхүүр = Англи эх, утга = Монгол), `keep-en.json` (санаатайгаар Англиар үлдээх түлхүүрийн массив).

Хэлний шийдвэрийн дараалал: `localStorage["xo.locale"]` → `VITE_XO_DEFAULT_LOCALE` → `"mn"`. Тестийн орчинд `VITE_XO_DEFAULT_LOCALE=en` тавьснаар одоо байгаа 6 тест ("just now", "Sep 7, 2026" гэх мэт) хэвээр ногоон байна (Task 6).

Анхаар: `ui/src/i18n/xo.ts` (модуль) ба `ui/src/i18n/xo/` (толины хавтас) зэрэгцэн оршино. Хавтсанд `index.ts` байхгүй тул `"@/i18n/xo"` импорт үргэлж `xo.ts` руу заана.

- [ ] **Step 1: Vitest орчинд Англи default тавих**

`ui/vitest.config.ts`-ийн `test` блокийг ингэж болго (файл бүхэлдээ):

```ts
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      lexical: path.resolve(__dirname, "./node_modules/lexical/dist/Lexical.mjs"),
    },
  },
  test: {
    environment: "node",
    setupFiles: ["./vitest.setup.ts"],
    env: { VITE_XO_DEFAULT_LOCALE: "en" },
  },
});
```

- [ ] **Step 2: locale-ийн унах тест бичих**

`ui/src/xo/locale.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from "vitest";
import { localeTag, resolveLocale, XO_LOCALE_STORAGE_KEY } from "./locale";

describe("resolveLocale", () => {
  afterEach(() => {
    localStorage.removeItem(XO_LOCALE_STORAGE_KEY);
    vi.unstubAllEnvs();
  });

  it("uses the test default when nothing is stored", () => {
    expect(resolveLocale()).toBe("en");
  });

  it("prefers the stored locale", () => {
    localStorage.setItem(XO_LOCALE_STORAGE_KEY, "mn");
    expect(resolveLocale()).toBe("mn");
  });

  it("ignores an unknown stored value", () => {
    localStorage.setItem(XO_LOCALE_STORAGE_KEY, "fr");
    expect(resolveLocale()).toBe("en");
  });

  it("uses VITE_XO_DEFAULT_LOCALE when nothing is stored", () => {
    vi.stubEnv("VITE_XO_DEFAULT_LOCALE", "mn");
    expect(resolveLocale()).toBe("mn");
  });

  it("falls back to mn when the env value is empty", () => {
    vi.stubEnv("VITE_XO_DEFAULT_LOCALE", "");
    expect(resolveLocale()).toBe("mn");
  });
});

describe("localeTag", () => {
  it("maps locales to BCP 47 tags", () => {
    expect(localeTag("mn")).toBe("mn-MN");
    expect(localeTag("en")).toBe("en-US");
  });
});
```

- [ ] **Step 3: Унахыг батлах**

```bash
cd ~/dev/paperclip-mn/ui && pnpm exec vitest run src/xo/locale.test.ts 2>&1 | tail -6
```

Хүлээгдэх: `Failed to resolve import "./locale"` (эсвэл `Cannot find module`) агуулсан алдаа, `Test Files  1 failed (1)`.

- [ ] **Step 4: locale.ts бичих**

`ui/src/xo/locale.ts`:

```ts
export const XO_LOCALES = ["mn", "en"] as const;
export type XoLocale = (typeof XO_LOCALES)[number];
export const XO_LOCALE_STORAGE_KEY = "xo.locale";
export const XO_DEFAULT_LOCALE: XoLocale = "mn";

export function isXoLocale(value: unknown): value is XoLocale {
  return typeof value === "string" && (XO_LOCALES as readonly string[]).includes(value);
}

function readStoredLocale(): XoLocale | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const stored = localStorage.getItem(XO_LOCALE_STORAGE_KEY);
    return isXoLocale(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function resolveLocale(): XoLocale {
  const stored = readStoredLocale();
  if (stored) return stored;
  const fromEnv: unknown = import.meta.env.VITE_XO_DEFAULT_LOCALE;
  if (isXoLocale(fromEnv)) return fromEnv;
  return XO_DEFAULT_LOCALE;
}

export function setLocale(locale: XoLocale): void {
  try {
    localStorage.setItem(XO_LOCALE_STORAGE_KEY, locale);
  } catch {
    // localStorage хаалттай байсан ч хуудсыг дахин ачаална
  }
  if (typeof window !== "undefined") window.location.reload();
}

export function localeTag(locale: XoLocale = resolveLocale()): "mn-MN" | "en-US" {
  return locale === "mn" ? "mn-MN" : "en-US";
}

export function applyDocumentLang(locale: XoLocale): void {
  if (typeof document === "undefined") return;
  document.documentElement.lang = locale;
}
```

`setLocale` хуудсыг бүхэлд нь дахин ачаалдаг: i18next-ийн `lng` нь эхлэх үед нэг удаа тогтдог, мөн `localeTag()` ашигладаг формат функцууд модулийн түвшинд кэштэй тул хамгийн найдвартай, хамгийн энгийн арга нь reload.

- [ ] **Step 5: Тест давахыг батлах**

```bash
cd ~/dev/paperclip-mn/ui && pnpm exec vitest run src/xo/locale.test.ts 2>&1 | tail -4
```

Хүлээгдэх: `Tests  6 passed (6)`.

- [ ] **Step 6: Хоосон толь үүсгэх**

```bash
cd ~/dev/paperclip-mn && mkdir -p ui/src/i18n/xo && printf '{}\n' > ui/src/i18n/xo/en.json && printf '{}\n' > ui/src/i18n/xo/mn.json && printf '[]\n' > ui/src/i18n/xo/keep-en.json && ls ui/src/i18n/xo/
```

Хүлээгдэх: `en.json  keep-en.json  mn.json` (Task 4-ийн `upstream-locale.test.ts` мөн энэ хавтсанд байна).

- [ ] **Step 7: index.ts-ийг эцсийн хувилбар болгох**

`ui/src/i18n/index.ts` бүхэлдээ:

```ts
import i18n, { type InitOptions, type TOptions } from "i18next";
import { initReactI18next, useTranslation as useReactI18nextTranslation } from "react-i18next";

import { BRAND } from "@/xo/brand";
import { applyDocumentLang, resolveLocale } from "@/xo/locale";
import { DEFAULT_LOCALE, i18nextResources, supportedLocales } from "./locales";
import xoEn from "./xo/en.json";
import xoMn from "./xo/mn.json";

const xoLocale = resolveLocale();

const i18nextOptions: InitOptions = {
  resources: i18nextResources,
  lng: xoLocale,
  fallbackLng: DEFAULT_LOCALE,
  supportedLngs: supportedLocales,
  defaultNS: "translation",
  interpolation: { escapeValue: false, defaultVariables: { brand: BRAND.name } },
  returnObjects: false,
  initAsync: false,
};

void i18n.use(initReactI18next).init(i18nextOptions).catch((error: unknown) => {
  console.error("Failed to initialize i18next", error);
});

i18n.addResourceBundle("en", "xo", xoEn, true, true);
i18n.addResourceBundle("mn", "xo", xoMn, true, true);
applyDocumentLang(xoLocale);

export function t(key: string, options: TOptions = {}) {
  return i18n.t(key, options);
}

export const useTranslation = useReactI18nextTranslation;
export { i18n };
```

Өөрчлөлт: 4 импорт нэмэгдсэн, `lng` нь `xoLocale`, `interpolation.defaultVariables.brand`, init-ийн дараа хоёр `addResourceBundle` ба `applyDocumentLang`. Upstream-ийн `translation` namespace болон `t`/`useTranslation` экспорт хэвээр (App.tsx хэрэглэдэг). `initAsync: false` тул `addResourceBundle` init-ийн шууд дараа аюулгүй.

- [ ] **Step 8: tx()-ийн унах тест бичих**

`ui/src/i18n/xo.test.ts`:

```ts
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { i18n } from "./index";
import { tx } from "./xo";

beforeAll(() => {
  i18n.addResourceBundle(
    "en",
    "xo",
    {
      Search: "Search",
      "Welcome to {{brand}}.": "Welcome to {{brand}}.",
      "Sign in to app.example: now": "Sign in to app.example: now",
      "{{count}} total event_one": "{{count}} total event",
      "{{count}} total event_other": "{{count}} total events",
    },
    true,
    true,
  );
  i18n.addResourceBundle(
    "mn",
    "xo",
    {
      Search: "Хайх",
      "Welcome to {{brand}}.": "{{brand}}-д тавтай морил.",
      "Sign in to app.example: now": "app.example руу нэвтрэх: одоо",
      "{{count}} total event_one": "Нийт {{count}} үйл явдал",
      "{{count}} total event_other": "Нийт {{count}} үйл явдал",
    },
    true,
    true,
  );
});

afterEach(async () => {
  await i18n.changeLanguage("en");
});

describe("tx", () => {
  it("returns the key when no translation exists", () => {
    expect(tx("No such key")).toBe("No such key");
  });

  it("translates from the xo namespace", async () => {
    await i18n.changeLanguage("mn");
    expect(tx("Search")).toBe("Хайх");
  });

  it("interpolates the brand by default", () => {
    expect(tx("Welcome to {{brand}}.")).toBe("Welcome to XO.");
  });

  it("treats dots and colons in keys literally", async () => {
    await i18n.changeLanguage("mn");
    expect(tx("Sign in to app.example: now")).toBe("app.example руу нэвтрэх: одоо");
  });

  it("selects plural forms by count", async () => {
    expect(tx("{{count}} total event", { count: 1 })).toBe("1 total event");
    expect(tx("{{count}} total event", { count: 5 })).toBe("5 total events");
    await i18n.changeLanguage("mn");
    expect(tx("{{count}} total event", { count: 1 })).toBe("Нийт 1 үйл явдал");
  });
});
```

- [ ] **Step 9: Унахыг батлах**

```bash
cd ~/dev/paperclip-mn/ui && pnpm exec vitest run src/i18n/xo.test.ts 2>&1 | tail -6
```

Хүлээгдэх: `Failed to resolve import "./xo"` агуулсан алдаа, `Test Files  1 failed (1)`.

- [ ] **Step 10: xo.ts бичих**

`ui/src/i18n/xo.ts`:

```ts
import type { TOptions } from "i18next";
import { i18n } from "./index";

export const XO_NS = "xo";

export function tx(key: string, options: TOptions = {}): string {
  return String(
    i18n.t(key, {
      ns: XO_NS,
      keySeparator: false,
      nsSeparator: false,
      defaultValue: key,
      ...options,
    }),
  );
}
```

`keySeparator: false` ба `nsSeparator: false` тул `"e.g. Northwind Labs"`, `"Sign in: now"` шиг цэг, хоёр цэгтэй Англи өгүүлбэр шууд түлхүүр болно. `defaultValue: key` тул орчуулга дутвал Англи эх нь харагдана (хоосон эсвэл түлхүүрийн зам биш).

- [ ] **Step 11: Тест давахыг батлах**

```bash
cd ~/dev/paperclip-mn/ui && pnpm exec vitest run src/i18n/xo.test.ts 2>&1 | tail -4
```

Хүлээгдэх: `Tests  5 passed (5)`.

- [ ] **Step 12: XoTrans-ийн унах тест бичих**

`ui/src/xo/XoTrans.test.tsx`:

```tsx
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, describe, expect, it } from "vitest";
import { i18n } from "@/i18n";
import { XoTrans } from "./XoTrans";

beforeAll(() => {
  i18n.addResourceBundle(
    "en",
    "xo",
    { "Read the <docs>docs</docs> first.": "Read the <docs>docs</docs> first." },
    true,
    true,
  );
});

describe("XoTrans", () => {
  it("renders named components inside the translated string", () => {
    const html = renderToStaticMarkup(
      <XoTrans
        i18nKey="Read the <docs>docs</docs> first."
        components={{ docs: <a href="/docs" /> }}
      />,
    );
    expect(html).toBe('Read the <a href="/docs">docs</a> first.');
  });
});
```

- [ ] **Step 13: Унахыг батлах**

```bash
cd ~/dev/paperclip-mn/ui && pnpm exec vitest run src/xo/XoTrans.test.tsx 2>&1 | tail -6
```

Хүлээгдэх: `Failed to resolve import "./XoTrans"` агуулсан алдаа, `Test Files  1 failed (1)`.

- [ ] **Step 14: XoTrans.tsx бичих**

`ui/src/xo/XoTrans.tsx`:

```tsx
import type { ReactElement } from "react";
import { Trans } from "react-i18next";
import { i18n } from "@/i18n";
import { XO_NS } from "@/i18n/xo";

type TransComponents = readonly ReactElement[] | Readonly<Record<string, ReactElement>>;

export function XoTrans({
  i18nKey,
  values,
  components,
}: {
  i18nKey: string;
  values?: Record<string, unknown>;
  components?: TransComponents;
}) {
  return (
    <Trans
      i18n={i18n}
      ns={XO_NS}
      i18nKey={i18nKey}
      defaults={i18nKey}
      values={values}
      components={components}
      tOptions={{ keySeparator: false, nsSeparator: false }}
    />
  );
}
```

XoTrans-ийг зөвхөн Task 11-ийн "mixed-jsx" тохиолдолд (текст дотор `<a>`, `<strong>` шиг элемент орсон өгүүлбэр) гараар ашиглана. `count` prop зориуд байхгүй: олон тооны хэлбэрийг зөвхөн codemod-ын `tx(..., { count })` дуудлага удирдана (Task 11, "хоёр түлхүүртэй ternary" дүрэм).

- [ ] **Step 15: Тест давахыг батлах**

```bash
cd ~/dev/paperclip-mn/ui && pnpm exec vitest run src/xo/XoTrans.test.tsx 2>&1 | tail -4
```

Хүлээгдэх: `Tests  1 passed (1)`.

- [ ] **Step 16: UI-ийн бүх тест ба typecheck**

```bash
cd ~/dev/paperclip-mn/ui && pnpm exec vitest run 2>&1 | tail -4
```

Хүлээгдэх: `Test Files  N passed (N)`, `failed` мөр байхгүй (одоо байгаа тестүүд `VITE_XO_DEFAULT_LOCALE=en` тул Англи хэвээр).

```bash
cd ~/dev/paperclip-mn && export PATH="$HOME/dev/bin:$HOME/.nvm/versions/node/v24.16.0/bin:$PATH" && pnpm --filter @paperclipai/ui typecheck 2>&1 | tail -3
```

Хүлээгдэх: алдааны мөргүй (`error TS` байхгүй).

- [ ] **Step 17: Commit**

```bash
cd ~/dev/paperclip-mn && git add ui/vitest.config.ts ui/src/xo/locale.ts ui/src/xo/locale.test.ts ui/src/i18n/xo/en.json ui/src/i18n/xo/mn.json ui/src/i18n/xo/keep-en.json ui/src/i18n/index.ts ui/src/i18n/xo.ts ui/src/i18n/xo.test.ts ui/src/xo/XoTrans.tsx ui/src/xo/XoTrans.test.tsx && git commit -q -m "feat(xo): add XO i18n runtime (locale, tx, XoTrans)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" && git log --oneline -1
```

Хүлээгдэх: `<sha> feat(xo): add XO i18n runtime (locale, tx, XoTrans)`.

---

### Task 6: Формат — огноо, тоо, харьцангуй цагийг хэлээр нь

**Files:**
- Modify: `ui/src/lib/utils.ts:1-4` (импорт нэмнэ), `ui/src/lib/utils.ts:36-94` (`formatCents`-ээс `relativeTime` хүртэл)
- Create: `ui/src/lib/utils.locale.test.ts`

**Interfaces:**
- Consumes: `localeTag()` (`ui/src/xo/locale.ts`, Task 5).
- Produces: `formatNumber`, `formatDate`, `formatDateTime`, `formatShortDate`, `relativeTime` — нэр, гарын үсэг өөрчлөгдөхгүй; зөвхөн одоогийн хэлээр форматлана. `formatCents` (`$` + en-US) санаатайгаар хэвээр: зардал USD-ээр, Америк бичлэгээр харагдана (spec §7).

Батлагдсан Intl гаралт (Node 24, `new Date(2026, 8, 7, 13, 2, 54)`):

| Функц | mn-MN | en-US |
|---|---|---|
| formatDate | `2026 оны 9-р сарын 7` | `Sep 7, 2026` |
| formatDateTime | `2026 оны 9-р сарын 7 13:02` | `Sep 7, 2026, 1:02 PM` |
| formatDateTime includeSeconds | `2026 оны 9-р сарын 7 13:02:54` | `Sep 7, 2026, 1:02:54 PM` |
| formatShortDate | `9-р сарын 7` | `Sep 7` |
| formatNumber(1234567) | `1,234,567` | `1,234,567` |
| relativeTime −5 мин | `5 мин өмнө` | `5m ago` |
| relativeTime −3 цаг | `3 ц өмнө` | `3h ago` |
| relativeTime −2 өдөр | `2 өдрийн өмнө` | `2d ago` |
| relativeTime < 60 сек | `саяхан` | `just now` |

`Intl.RelativeTimeFormat`-ийг `numeric: "always"`-аар ашиглана: `"auto"` бол −1 өдөр `"өчигдөр"`, −2 өдөр `"уржигдар"` болж одоо байгаа `"1d ago"` хүлээлттэй тестүүд унана.

- [ ] **Step 1: Унах тест бичих**

`ui/src/lib/utils.locale.test.ts`:

```ts
import { afterEach, describe, expect, it } from "vitest";
import { XO_LOCALE_STORAGE_KEY } from "@/xo/locale";
import { formatDate, formatDateTime, formatNumber, formatShortDate, relativeTime } from "./utils";

const sample = new Date(2026, 8, 7, 13, 2, 54);

afterEach(() => {
  localStorage.removeItem(XO_LOCALE_STORAGE_KEY);
});

describe("locale-aware formats (mn)", () => {
  it("formats dates and numbers in Mongolian", () => {
    localStorage.setItem(XO_LOCALE_STORAGE_KEY, "mn");
    expect(formatDate(sample)).toBe("2026 оны 9-р сарын 7");
    expect(formatDateTime(sample)).toBe("2026 оны 9-р сарын 7 13:02");
    expect(formatDateTime(sample, { includeSeconds: true })).toBe("2026 оны 9-р сарын 7 13:02:54");
    expect(formatShortDate(sample)).toBe("9-р сарын 7");
    expect(formatNumber(1234567)).toBe("1,234,567");
  });

  it("formats relative time in Mongolian", () => {
    localStorage.setItem(XO_LOCALE_STORAGE_KEY, "mn");
    expect(relativeTime(new Date(Date.now() - 5 * 60_000))).toBe("5 мин өмнө");
    expect(relativeTime(new Date())).toBe("саяхан");
  });
});

describe("locale-aware formats (en)", () => {
  it("keeps the English output", () => {
    expect(formatDate(sample)).toBe("Sep 7, 2026");
    expect(relativeTime(new Date(Date.now() - 5 * 60_000))).toBe("5m ago");
  });
});
```

- [ ] **Step 2: Унахыг батлах**

```bash
cd ~/dev/paperclip-mn/ui && pnpm exec vitest run src/lib/utils.locale.test.ts 2>&1 | tail -8
```

Хүлээгдэх: `expected 'Sep 7, 2026' to be '2026 оны 9-р сарын 7'`, `Tests  2 failed | 1 passed (3)`.

- [ ] **Step 3: utils.ts-д импорт нэмэх**

`ui/src/lib/utils.ts`-ийн 4-р мөрний (`import type { BillingType, ... } from "@paperclipai/shared";`) дараа:

```ts
import { localeTag } from "@/xo/locale";
```

- [ ] **Step 4: Формат функцуудыг солих**

`ui/src/lib/utils.ts` дотор `export function formatCents`-ээс `relativeTime`-ийн төгсгөл хүртэлх хэсгийг (одоогийн 36–94-р мөр) дараах кодоор соль. `formatCents` ба `formatProjectBudget` өөрчлөгдөхгүй, харьцуулахад хялбар байхаар дахин бичив:

```ts
export function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString(localeTag());
}

/**
 * Format a project's budget for the projects list view (IA Phase 4 — PAP-60).
 * Monthly budgets render a `/mo` suffix; lifetime budgets show the bare amount.
 */
export function formatProjectBudget(budget: { amountCents: number; windowKind: string }): string {
  const amount = formatCents(budget.amountCents);
  return budget.windowKind === "calendar_month_utc" ? `${amount}/mo` : amount;
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString(localeTag(), {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(
  date: Date | string,
  options: { includeSeconds?: boolean } = {},
): string {
  return new Date(date).toLocaleString(localeTag(), {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    ...(options.includeSeconds ? { second: "2-digit" as const } : {}),
  });
}

export function formatShortDate(date: Date | string): string {
  return new Date(date).toLocaleString(localeTag(), {
    month: "short",
    day: "numeric",
  });
}

const JUST_NOW: Record<ReturnType<typeof localeTag>, string> = {
  "mn-MN": "саяхан",
  "en-US": "just now",
};

const relativeFormatters = new Map<string, Intl.RelativeTimeFormat>();

function relativeFormatter(tag: string): Intl.RelativeTimeFormat {
  let formatter = relativeFormatters.get(tag);
  if (!formatter) {
    formatter = new Intl.RelativeTimeFormat(tag, { numeric: "always", style: "narrow" });
    relativeFormatters.set(tag, formatter);
  }
  return formatter;
}

export function relativeTime(date: Date | string): string {
  const tag = localeTag();
  const now = Date.now();
  const then = new Date(date).getTime();
  const diffSec = Math.round((now - then) / 1000);
  if (diffSec < 60) return JUST_NOW[tag];
  const rtf = relativeFormatter(tag);
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return rtf.format(-diffMin, "minute");
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return rtf.format(-diffHr, "hour");
  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 30) return rtf.format(-diffDay, "day");
  return formatDate(date);
}
```

`relativeFormatters` кэш: `Intl.RelativeTimeFormat` үүсгэх нь үнэтэй, харин `relativeTime` урт жагсаалтын мөр бүрд дуудагддаг тул хэл тус бүрд нэг л объект үүснэ.

- [ ] **Step 5: Шинэ тест давахыг батлах**

```bash
cd ~/dev/paperclip-mn/ui && pnpm exec vitest run src/lib/utils.locale.test.ts 2>&1 | tail -4
```

Хүлээгдэх: `Tests  3 passed (3)`.

- [ ] **Step 6: Англи хүлээлттэй одоогийн тестүүд хэвээр давахыг батлах**

```bash
cd ~/dev/paperclip-mn/ui && pnpm exec vitest run src/lib/utils.date-time.test.ts src/lib/blockedInbox.test.ts src/lib/recovery-lineage.test.ts src/components/IssueRecoveryActionCard.test.tsx src/components/IssueRow.test.tsx src/components/task-chat/TaskChatMarker.test.tsx src/components/task-chat/TaskChatSystemNotice.test.tsx 2>&1 | tail -4
```

Хүлээгдэх: `Test Files  7 passed (7)`, `failed` байхгүй. Эдгээр 7 файл `"just now"`, `"5m ago"`, `"Sep 7, 2026, 1:02 PM"` гэх мэт Англи утгыг хүлээдэг; `VITE_XO_DEFAULT_LOCALE=en` (Task 5, Step 1) ба en-US narrow формат `"5m ago"` гаргадаг тул хэвээр ногоон.

- [ ] **Step 7: Typecheck ба commit**

```bash
cd ~/dev/paperclip-mn && export PATH="$HOME/dev/bin:$HOME/.nvm/versions/node/v24.16.0/bin:$PATH" && pnpm --filter @paperclipai/ui typecheck 2>&1 | tail -3
```

Хүлээгдэх: `error TS` байхгүй.

```bash
cd ~/dev/paperclip-mn && git add ui/src/lib/utils.ts ui/src/lib/utils.locale.test.ts && git commit -q -m "feat(xo): locale-aware date and number formats

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" && git log --oneline -1
```

Хүлээгдэх: `<sha> feat(xo): locale-aware date and number formats`.

---

### Task 7: Хэл сэлгэгч — XoLocaleMenuAction, хоёр account menu-д

**Files:**
- Create: `ui/src/xo/XoLocaleMenuAction.tsx`
- Create: `ui/src/xo/XoLocaleMenuAction.test.tsx`
- Modify: `ui/src/components/SidebarAccountMenu.tsx:23` (импорт), `:212` (ThemeToggle-ийн дараа)
- Modify: `ui/src/components/SidebarAccountMenu.production.tsx:22` (импорт), `:203` (ThemeToggle-ийн дараа)

**Interfaces:**
- Consumes: `resolveLocale`, `setLocale`, `XoLocale` (Task 5); `cn` (`@/lib/utils`); `Languages` icon (`lucide-react`, ThemeToggle-ийн `Sun`/`Moon`-той ижил төрлийн экспорт).
- Produces: `XoLocaleMenuAction({ className?, variant?: "menu-action" | "compact-menu-action", onAfterSelect? })` — `ThemeToggle`-ийн хоёр menu хувилбарын markup-ийг яг давтана, тиймээс account menu дотор ижил өндөр, зай, hover-той харагдана.

Бичвэрийн дүрэм: товчны шошго **зорилтот** хэлээр байна. Монгол идэвхтэй үед `"Switch to English"`, Англи идэвхтэй үед `"Монгол хэл рүү шилжих"` — хэл мэдэхгүй хэрэглэгч өөрийн хэлээ олж чадна. Энэ файл `XO_TRANSFORM_FILES` (Task 9, Task 11)-д **орохгүй**: codemod эдгээр мөрийг орчуулбал зорилго алдагдана.

- [ ] **Step 1: Унах тест бичих**

`ui/src/xo/XoLocaleMenuAction.test.tsx`:

```tsx
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { XO_LOCALE_STORAGE_KEY } from "./locale";
import { XoLocaleMenuAction } from "./XoLocaleMenuAction";

afterEach(() => {
  localStorage.removeItem(XO_LOCALE_STORAGE_KEY);
});

describe("XoLocaleMenuAction", () => {
  it("offers English while Mongolian is active", () => {
    localStorage.setItem(XO_LOCALE_STORAGE_KEY, "mn");
    expect(renderToStaticMarkup(<XoLocaleMenuAction />)).toContain("Switch to English");
  });

  it("offers Mongolian while English is active", () => {
    localStorage.setItem(XO_LOCALE_STORAGE_KEY, "en");
    expect(renderToStaticMarkup(<XoLocaleMenuAction variant="menu-action" />)).toContain(
      "Монгол хэл рүү шилжих",
    );
  });
});
```

- [ ] **Step 2: Унахыг батлах**

```bash
cd ~/dev/paperclip-mn/ui && pnpm exec vitest run src/xo/XoLocaleMenuAction.test.tsx 2>&1 | tail -6
```

Хүлээгдэх: `Failed to resolve import "./XoLocaleMenuAction"` агуулсан алдаа, `Test Files  1 failed (1)`.

- [ ] **Step 3: Компонент бичих**

`ui/src/xo/XoLocaleMenuAction.tsx`:

```tsx
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveLocale, setLocale, type XoLocale } from "./locale";

const COPY: Record<XoLocale, { label: string; description: string }> = {
  mn: { label: "Switch to English", description: "Одоогийн хэл: Монгол" },
  en: { label: "Монгол хэл рүү шилжих", description: "Current language: English" },
};

type XoLocaleMenuActionProps = {
  className?: string;
  variant?: "menu-action" | "compact-menu-action";
  onAfterSelect?: () => void;
};

export function XoLocaleMenuAction({
  className,
  variant = "compact-menu-action",
  onAfterSelect,
}: XoLocaleMenuActionProps) {
  const current = resolveLocale();
  const next: XoLocale = current === "mn" ? "en" : "mn";
  const { label, description } = COPY[current];

  const handleClick = () => {
    onAfterSelect?.();
    setLocale(next);
  };

  if (variant === "menu-action") {
    return (
      <button
        type="button"
        className={cn(
          "flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-accent/60",
          className,
        )}
        onClick={handleClick}
        aria-label={label}
      >
        <span className="mt-0.5 rounded-lg border border-border bg-background/70 p-2 text-muted-foreground">
          <Languages className="size-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium text-foreground">{label}</span>
          <span className="block text-xs text-muted-foreground">{description}</span>
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className={cn(
        "flex h-(--profile-popover-row-height) w-full items-center gap-(--profile-popover-row-gap) rounded-lg px-2.5 text-left text-(length:--text-compact) font-medium leading-(--profile-popover-label-line-height) text-foreground transition-colors hover:bg-accent",
        className,
      )}
      onClick={handleClick}
      aria-label={label}
    >
      <span className="flex size-5 shrink-0 items-center justify-center text-muted-foreground">
        <Languages className="size-4" />
      </span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
    </button>
  );
}
```

`onAfterSelect` нь `setLocale`-ээс **өмнө** дуудагдана: menu хаагдаад дараа нь хуудас reload хийнэ; урвуу дарааллаар бол reload эхэлснээс хойш state өөрчлөх гэж оролдоно.

- [ ] **Step 4: Тест давахыг батлах**

```bash
cd ~/dev/paperclip-mn/ui && pnpm exec vitest run src/xo/XoLocaleMenuAction.test.tsx 2>&1 | tail -4
```

Хүлээгдэх: `Tests  2 passed (2)`.

- [ ] **Step 5: Streamlined account menu-д залгах**

`ui/src/components/SidebarAccountMenu.tsx`, 23-р мөр `import { ThemeToggle } from "./ThemeToggle";`-ийн дараа:

```tsx
import { XoLocaleMenuAction } from "@/xo/XoLocaleMenuAction";
```

Мөн 212-р мөр (импорт нэмсний дараа 213) `<ThemeToggle variant="compact-menu-action" onAfterToggle={() => setOpen(false)} />`-ийн шууд дараа, `{deploymentMode === "authenticated" ? (`-ийн өмнө:

```tsx
              <XoLocaleMenuAction variant="compact-menu-action" onAfterSelect={() => setOpen(false)} />
```

- [ ] **Step 6: Production account menu-д залгах**

`ui/src/components/SidebarAccountMenu.production.tsx`, 22-р мөр `import { ThemeToggle } from "./ThemeToggle";`-ийн дараа:

```tsx
import { XoLocaleMenuAction } from "@/xo/XoLocaleMenuAction";
```

Мөн 203-р мөр (импорт нэмсний дараа 204) `<ThemeToggle variant="menu-action" onAfterToggle={() => setOpen(false)} />`-ийн шууд дараа:

```tsx
              <XoLocaleMenuAction variant="menu-action" onAfterSelect={() => setOpen(false)} />
```

- [ ] **Step 7: Залгалтыг шалгах**

```bash
cd ~/dev/paperclip-mn && grep -c "XoLocaleMenuAction" ui/src/components/SidebarAccountMenu.tsx ui/src/components/SidebarAccountMenu.production.tsx
```

Хүлээгдэх:

```
ui/src/components/SidebarAccountMenu.tsx:2
ui/src/components/SidebarAccountMenu.production.tsx:2
```

```bash
cd ~/dev/paperclip-mn/ui && pnpm exec vitest run src/components/SidebarAccountMenu.test.tsx src/xo 2>&1 | tail -4
```

Хүлээгдэх: `Test Files  4 passed (4)` (account menu-ийн 4 тест + locale, XoTrans, XoLocaleMenuAction).

```bash
cd ~/dev/paperclip-mn && export PATH="$HOME/dev/bin:$HOME/.nvm/versions/node/v24.16.0/bin:$PATH" && pnpm --filter @paperclipai/ui typecheck 2>&1 | tail -3
```

Хүлээгдэх: `error TS` байхгүй. Браузер дээрх ажиллагааг Task 10-ийн Step 7-д (сэлгээд `Search` ↔ `Хайх`) шалгана — тэр үед л орчуулга харагдана.

- [ ] **Step 8: Commit**

```bash
cd ~/dev/paperclip-mn && git add ui/src/xo/XoLocaleMenuAction.tsx ui/src/xo/XoLocaleMenuAction.test.tsx ui/src/components/SidebarAccountMenu.tsx ui/src/components/SidebarAccountMenu.production.tsx && git commit -q -m "feat(xo): add language switcher to account menus

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" && git log --oneline -1
```

Хүлээгдэх: `<sha> feat(xo): add language switcher to account menus`.

---

### Task 8: Codemod трансформер — scripts/xo-i18n/transform.ts

**Files:**
- Create: `scripts/xo-i18n/transform.ts`
- Create: `scripts/xo-i18n/transform.test.ts`
- Create: `scripts/xo-i18n/vitest.config.ts`
- Create: `scripts/xo-i18n/tsconfig.json`
- Modify: `package.json` (devDependencies — `pnpm add`-аар; scripts — `"paperclipai"` мөрийн өмнө 7 мөр)
- Modify: `.gitignore` (төгсгөлд 4 мөр)

**Interfaces:**
- Consumes: `@babel/parser` (`parse`), `@babel/traverse` (default export), `@babel/types`, `magic-string`. UI-ийн кодоос юу ч импортлохгүй — трансформер ui/src-ийн текстийг л уншина.
- Produces (Task 9, 10 ашиглана):
  - `transformSource(code: string, filePath: string, options?: TransformOptions): TransformResult`
  - `harvestExplicitKeys(code: string, filePath: string): ExtractedString[]`
  - `looksLikeCopy(text: string, opts?: { jsxText?: boolean }): boolean`
  - `interface ExtractedString { key: string; file: string; line: number; plural?: { one: string; other: string } }`
  - `interface ManualCase { file: string; line: number; reason: "mixed-jsx" | "template-complex"; snippet: string }`
  - `interface TransformOptions { attrAllowlist?: readonly string[]; propAllowlist?: readonly string[]; brandName?: string }`
  - `interface TransformResult { code: string; map: SourceMap | null; strings: ExtractedString[]; manual: ManualCase[]; changed: boolean }`
  - `DEFAULT_ATTR_ALLOWLIST`, `DEFAULT_PROP_ALLOWLIST` (readonly string[])
  - Root scripts: `xo:i18n:test`, `xo:i18n:typecheck`, `xo:i18n:extract`, `xo:i18n:check`, `xo:i18n:emit`, `xo:i18n:todo`, `xo:i18n:merge` (сүүлийн тав Task 9-ийн `cli.ts`-ийг дуудна — Task 9 хүртэл ажиллахгүй, зөвхөн бүртгэнэ).

Трансформерийн дүрэм (spec §7-ийн codemod):

1. **Түлхүүр = англи текст өөрөө.** `tx("Search")` — тусдаа ID байхгүй, whitespace нэг зайд шахагдана. Орчуулга `ui/src/i18n/xo/mn.json`-д тэр текстээр хайгдана.
2. **Атрибут ба обьектын талбар:** зөвхөн allowlist (`title`, `label`, `placeholder`, `description`, `aria-label`, `alt`, `lede`, `body`, `detail`, `tooltip`, `emptyText`). `className`, `href`, `to`, `variant` хэзээ ч хөндөгдөхгүй.
3. **`looksLikeCopy` шүүлт:** үсэггүй, URL/зам, жижиг үсгээр эхэлсэн нэг үг (`primary`, `sm`, `calendar_month_utc`) — хуулбар биш. JSX-ийн текстэд үсэг байвал хангалттай.
4. **JSX хүүхэд:** дараалсан текст + энгийн илэрхийлэл (`{name}`, `{user.name}`) нэг түлхүүр болно: `Welcome, {{name}}!`. Захын зай `{" "}` болж хадгалагдана. Зөвхөн хувьсагчаас бүрдсэн `{name}` хөндөгдөхгүй.
5. **Холимог JSX** (нэг эцэг дотор текст + хуулбартай элемент, жишээ `Read the <a>docs</a> first.`) — кодыг хөндөхгүй, `manual` жагсаалтад `mixed-jsx` гэж бүртгэнэ; Task 11-д гараар `XoTrans` болгоно.
6. **Алгасах tag:** `code`, `pre`, `kbd`, `samp`, `style`, `script`, `Trans`, `XoTrans` (XoTrans-ийн `i18nKey`-г бүртгэнэ, дотрыг хөндөхгүй).
7. **Template literal:** энгийн илэрхийлэл → `{{name}}` (member chain-ий сүүлийн нэр; давхцвал `name2`); `${n === 1 ? "event" : "events"}` → `_one`/`_other` хос түлхүүр, `n` → `{{count}}`; бусад тохиолдол → `template-complex` manual.
8. **Брэнд:** текст доторх `Paperclip` → `{{brand}}` (i18n init-ийн `defaultVariables.brand` бөглөнө); template доторх `BRAND.name` → `{{brand}}`, options обьектгүй.
9. **Байгаа `tx("…")` дуудлага ба `XoTrans i18nKey`** дахин ороохгүй, зөвхөн бүртгэнэ (`strings`-д орно → extract тэднийг "хоцрогдсон" гэж үзэхгүй).
10. **Импорт:** нэг ч засвар хийсэн бол `import { tx } from "@/i18n/xo";` сүүлийн import-ын дараа (import байхгүй бол файлын эхэнд) нэмнэ; аль хэдийн байвал давхардуулахгүй.
11. Vitest трансформерийг ажиллуулдаггүй (ui/vitest.config.ts-д plugin байхгүй) тул UI-ийн component тестүүд англи эхээ хэвээр хардаг.

- [ ] **Step 1: Хамаарлыг суулгах**

```bash
cd ~/dev/paperclip-mn && pnpm add -Dw @babel/parser@^7.29.8 @babel/traverse@^7.29.8 @babel/types@^7.29.8 magic-string@^0.30.21 @types/babel__traverse@^7.28.0 @types/node@^24 2>&1 | tail -12
```

Хүлээгдэх: `devDependencies:` хэсэгт зургаан `+` мөр (`+ @babel/parser 7.29.8`, `+ @babel/traverse 7.29.8`, `+ @babel/types 7.29.8`, `+ @types/babel__traverse 7.28.0`, `+ @types/node 24.13.3`, `+ magic-string 0.30.21`), төгсгөлд `Done in …`. Store-д бүгд байгаа тул сүлжээ хэрэггүй. `postinstall` (`scripts/link-plugin-dev-sdk.mjs`) алдаагүй дуусна.

- [ ] **Step 2: Тохиргооны файлууд, scripts, .gitignore**

`scripts/xo-i18n/vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["scripts/xo-i18n/**/*.test.ts"],
    environment: "node",
  },
});
```

`include` нь repo root-оос хамаарна; `pnpm` script үргэлж root дээр ажилладаг тул хангалттай.

`scripts/xo-i18n/tsconfig.json` (ui/tsconfig.json-ийн тохиргоотой ижил суурь; `jsx`, `paths` хэрэггүй):

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "types": ["node"]
  },
  "include": ["./*.ts"]
}
```

`package.json` scripts: `"paperclipai"` мөрийн дугаарыг шалга (Step 1-ийн дараа ч 35 байх ёстой):

```bash
cd ~/dev/paperclip-mn && grep -n '"paperclipai"' package.json
```

Хүлээгдэх: `35:    "paperclipai": "node cli/node_modules/tsx/dist/cli.mjs cli/src/index.ts",`. Тэр мөрийн **яг өмнө** дараах 7 мөрийг Edit хэрэгслээр оруул (мөр бүр таслалаар төгсөнө, `"paperclipai"` мөр хэвээр үлдэнэ):

```json
    "xo:i18n:test": "vitest run --config scripts/xo-i18n/vitest.config.ts",
    "xo:i18n:typecheck": "tsc -p scripts/xo-i18n/tsconfig.json",
    "xo:i18n:extract": "node cli/node_modules/tsx/dist/cli.mjs scripts/xo-i18n/cli.ts extract",
    "xo:i18n:check": "node cli/node_modules/tsx/dist/cli.mjs scripts/xo-i18n/cli.ts check",
    "xo:i18n:emit": "node cli/node_modules/tsx/dist/cli.mjs scripts/xo-i18n/cli.ts emit",
    "xo:i18n:todo": "node cli/node_modules/tsx/dist/cli.mjs scripts/xo-i18n/cli.ts todo",
    "xo:i18n:merge": "node cli/node_modules/tsx/dist/cli.mjs scripts/xo-i18n/cli.ts merge",
```

`tsx`-ийг `cli/node_modules/tsx/dist/cli.mjs`-ээс дуудах нь root-ын `"paperclipai"` script-ийн хэвшил (root-д `tsx` devDep байхгүй). Шалгах:

```bash
cd ~/dev/paperclip-mn && node -e 'const p=require("./package.json");console.log(Object.keys(p.scripts).filter(k=>k.startsWith("xo:i18n:")).length)'
```

Хүлээгдэх: `7`.

`.gitignore`-ийн төгсгөлд (emit-ийн гаралт, status.json, орчуулгын batch файлууд repo-д орохгүй):

```bash
cd ~/dev/paperclip-mn && printf '\n# XO i18n working files\nscripts/xo-i18n/.emit/\nscripts/xo-i18n/status.json\nscripts/xo-i18n/.batches/\n' >> .gitignore && tail -4 .gitignore
```

Хүлээгдэх гаралт:

```
# XO i18n working files
scripts/xo-i18n/.emit/
scripts/xo-i18n/status.json
scripts/xo-i18n/.batches/
```

- [ ] **Step 3: Унах тест бичих**

`scripts/xo-i18n/transform.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { harvestExplicitKeys, looksLikeCopy, transformSource } from "./transform";

const FILE = "ui/src/components/Example.tsx";

// body нь 5 дахь мөрөнд орно (import, хоосон, export, return, body).
const tsx = (body: string) =>
  `import { Button } from "@/components/ui/button";\n\nexport function Example() {\n  return (\n${body}\n  );\n}\n`;

describe("transformSource", () => {
  it("wraps an allow-listed string attribute and injects the import after the last import", () => {
    const result = transformSource(tsx(`<Button label="Search" />`), FILE);
    expect(result.code).toBe(
      `import { Button } from "@/components/ui/button";\nimport { tx } from "@/i18n/xo";\n\nexport function Example() {\n  return (\n<Button label={tx("Search")} />\n  );\n}\n`,
    );
    expect(result.strings).toEqual([{ key: "Search", file: FILE, line: 5 }]);
    expect(result.map).not.toBeNull();
  });

  it("wraps plain JSX text", () => {
    const result = transformSource(tsx(`<CardTitle>Finance ledger</CardTitle>`), FILE);
    expect(result.code).toContain(`<CardTitle>{tx("Finance ledger")}</CardTitle>`);
  });

  it("wraps allow-listed object properties in .ts files and prepends the import", () => {
    const input = `pushToast({ title: "Connection saved", tone: "success" });\n`;
    const result = transformSource(input, "ui/src/lib/example.ts");
    expect(result.code).toBe(
      `import { tx } from "@/i18n/xo";\npushToast({ title: tx("Connection saved"), tone: "success" });\n`,
    );
  });

  it("turns a count ternary inside a template into a plural key pair", () => {
    const body = "<span>{`${eventCount} total ${eventCount === 1 ? \"event\" : \"events\"}`}</span>";
    const result = transformSource(tsx(body), FILE);
    expect(result.code).toContain(`<span>{tx("{{count}} total event", { count: eventCount })}</span>`);
    expect(result.strings[0]).toEqual({
      key: "{{count}} total event",
      file: FILE,
      line: 5,
      plural: { one: "{{count}} total event", other: "{{count}} total events" },
    });
  });

  it("interpolates member expressions by their last segment", () => {
    const result = transformSource(tsx("<p title={`Hello ${user.name}`} />"), FILE);
    expect(result.code).toContain(`title={tx("Hello {{name}}", { name: user.name })}`);
  });

  it("uses shorthand when the variable name equals the placeholder", () => {
    const result = transformSource(tsx("<p title={`Hi ${name}`} />"), FILE);
    expect(result.code).toContain(`tx("Hi {{name}}", { name })`);
  });

  it("wraps both branches of a ternary attribute", () => {
    const result = transformSource(tsx(`<Button label={ready ? "Continue" : "Loading…"} />`), FILE);
    expect(result.code).toContain(`label={ready ? tx("Continue") : tx("Loading…")}`);
  });

  it("merges text and simple expressions into one key", () => {
    const result = transformSource(tsx(`<p>Welcome, {name}!</p>`), FILE);
    expect(result.code).toContain(`<p>{tx("Welcome, {{name}}!", { name })}</p>`);
  });

  it("reports mixed JSX as a manual case and leaves the code untouched", () => {
    const input = tsx(`<p>Read the <a href="/docs">docs</a> first.</p>`);
    const result = transformSource(input, FILE);
    expect(result.changed).toBe(false);
    expect(result.code).toBe(input);
    expect(result.manual).toEqual([
      { file: FILE, line: 5, reason: "mixed-jsx", snippet: `<p>Read the <a href="/docs">docs</a> first.</p>` },
    ]);
  });

  it("skips code-like tags", () => {
    const result = transformSource(tsx(`<code>npm install</code>`), FILE);
    expect(result.changed).toBe(false);
  });

  it("ignores attributes outside the allow-list", () => {
    const result = transformSource(tsx(`<div className="Flex items-center">Hello</div>`), FILE);
    expect(result.code).toContain(`className="Flex items-center"`);
    expect(result.code).toContain(`{tx("Hello")}`);
  });

  it("does not duplicate an existing tx import", () => {
    const input = `import { tx } from "@/i18n/xo";\n\nexport function Example() {\n  return <p title="Hello there" />;\n}\n`;
    const result = transformSource(input, FILE);
    expect(result.code.match(/import \{ tx \} from "@\/i18n\/xo";/g)).toHaveLength(1);
    expect(result.code).toContain(`title={tx("Hello there")}`);
  });

  it("replaces the brand name with the {{brand}} placeholder", () => {
    const result = transformSource(tsx(`<p>Welcome to Paperclip.</p>`), FILE);
    expect(result.code).toContain(`{tx("Welcome to {{brand}}.")}`);
    expect(result.strings[0].key).toBe("Welcome to {{brand}}.");
  });

  it("keeps a leading space as an explicit JSX space", () => {
    const result = transformSource(tsx(`<Button><Plus /> New agent</Button>`), FILE);
    expect(result.code).toContain(`<Button><Plus />{" "}{tx("New agent")}</Button>`);
  });

  it("maps BRAND.name inside templates to {{brand}} without an options object", () => {
    const result = transformSource(tsx("<h1>{`Sign in to ${BRAND.name}`}</h1>"), FILE);
    expect(result.code).toContain(`<h1>{tx("Sign in to {{brand}}")}</h1>`);
  });

  it("returns the input unchanged when nothing matches", () => {
    const input = tsx(`<div className="x" />`);
    const result = transformSource(input, FILE);
    expect(result.changed).toBe(false);
    expect(result.code).toBe(input);
    expect(result.map).toBeNull();
    expect(result.strings).toEqual([]);
  });

  it("wraps string branches of a ternary child", () => {
    const result = transformSource(tsx(`<p>{active ? "Active" : "Paused"}</p>`), FILE);
    expect(result.code).toContain(`<p>{active ? tx("Active") : tx("Paused")}</p>`);
  });

  it("leaves identifier-like attribute values alone", () => {
    const result = transformSource(tsx(`<Badge label="primary" />`), FILE);
    expect(result.changed).toBe(false);
  });
});

describe("harvestExplicitKeys", () => {
  it("collects explicit tx() keys and XoTrans i18nKey values", () => {
    const code =
      `import { tx } from "@/i18n/xo";\nimport { XoTrans } from "@/xo/XoTrans";\n\n` +
      `export const label = tx("Manual key");\n` +
      `export const node = <XoTrans i18nKey="Read <docs>docs</docs> first" components={{ docs: <a href="/docs" /> }} />;\n`;
    const keys = harvestExplicitKeys(code, "ui/src/lib/example.tsx").map((s) => s.key);
    expect(keys).toEqual(["Manual key", "Read <docs>docs</docs> first"]);
  });
});

describe("looksLikeCopy", () => {
  const cases: Array<[string, boolean]> = [
    ["Search", true],
    ["primary", false],
    ["e.g. Northwind Labs", true],
    ["/dashboard", false],
    ["https://x.y", false],
    ["", false],
    ["…", false],
    ["sm", false],
    ["Loading…", true],
    ["calendar_month_utc", false],
  ];

  it.each(cases)("%j → %s", (text, expected) => {
    expect(looksLikeCopy(text)).toBe(expected);
  });

  it("treats any lettered JSX text as copy", () => {
    expect(looksLikeCopy("abc", { jsxText: true })).toBe(true);
  });
});
```

- [ ] **Step 4: Тест унаж байгааг батлах**

```bash
cd ~/dev/paperclip-mn && pnpm xo:i18n:test 2>&1 | tail -6
```

Хүлээгдэх: `Failed to resolve import "./transform"` агуулсан алдаа, `Test Files  1 failed (1)`.

- [ ] **Step 5: Трансформерийг бичих**

`scripts/xo-i18n/transform.ts`:

```ts
import { parse, type ParserPlugin } from "@babel/parser";
import traverseImport from "@babel/traverse";
import * as babelTypes from "@babel/types";
import MagicString, { type SourceMap } from "magic-string";

// @babel/traverse ба @babel/types нь CJS: Node-ын ESM interop-оор default import нь
// module.exports обьект байж болно. Хоёр тохиолдлыг хоёуланг нь барина.
const traverse = ((traverseImport as unknown as { default?: typeof traverseImport }).default ??
  traverseImport) as typeof traverseImport;
const t = ((babelTypes as unknown as { default?: typeof babelTypes }).default ?? babelTypes) as typeof babelTypes;

export interface ExtractedString {
  key: string;
  file: string;
  line: number;
  plural?: { one: string; other: string };
}

export interface ManualCase {
  file: string;
  line: number;
  reason: "mixed-jsx" | "template-complex";
  snippet: string;
}

export interface TransformOptions {
  attrAllowlist?: readonly string[];
  propAllowlist?: readonly string[];
  brandName?: string;
}

export interface TransformResult {
  code: string;
  map: SourceMap | null;
  strings: ExtractedString[];
  manual: ManualCase[];
  changed: boolean;
}

export const DEFAULT_ATTR_ALLOWLIST: readonly string[] = [
  "title",
  "label",
  "placeholder",
  "description",
  "aria-label",
  "alt",
  "lede",
  "body",
  "detail",
  "tooltip",
  "emptyText",
];
export const DEFAULT_PROP_ALLOWLIST: readonly string[] = DEFAULT_ATTR_ALLOWLIST;

const SKIP_TAGS = new Set(["code", "pre", "kbd", "samp", "style", "script", "Trans", "XoTrans"]);
const TX_SOURCE = "@/i18n/xo";
const TX_IMPORT = `import { tx } from "${TX_SOURCE}";`;
const LETTER = /\p{L}/u;
const BRAND_MEMBER = "BRAND.name";

export function looksLikeCopy(text: string, { jsxText = false }: { jsxText?: boolean } = {}): boolean {
  const trimmed = text.trim();
  if (!LETTER.test(trimmed)) return false;
  if (jsxText) return true;
  if (/^(https?:|mailto:|\/|\.\/|\.\.\/|#)/.test(trimmed)) return false;
  const startsUpper = /^\p{Lu}/u.test(trimmed);
  if (/^[\w$./:-]+$/.test(trimmed) && !startsUpper) return false;
  return startsUpper || /\s/.test(trimmed) || /[.?!…:]$/.test(trimmed);
}

interface Ctx {
  code: string;
  file: string;
  s: MagicString;
  strings: ExtractedString[];
  manual: ManualCase[];
  handled: WeakSet<babelTypes.Node>;
  edits: number;
  attrAllow: Set<string>;
  propAllow: Set<string>;
  brandRe: RegExp;
}

type Piece =
  | { kind: "text"; text: string; start: number; end: number; line: number }
  | { kind: "simple"; node: babelTypes.Expression; src: string; start: number; end: number; line: number };

function parseSource(code: string, filePath: string) {
  const plugins: ParserPlugin[] = filePath.endsWith(".tsx") ? ["typescript", "jsx"] : ["typescript"];
  return parse(code, { sourceType: "module", plugins });
}

// Babel-ийн cleanJSXElementLiteralChild алгоритм: JSX текстийн мөр хоорондын
// зайг React-ийн харуулдаг хэлбэрт хувиргана.
function cleanJsxText(raw: string): string {
  const lines = raw.split(/\r\n|\n|\r/);
  let lastNonEmptyLine = 0;
  for (let i = 0; i < lines.length; i++) {
    if (/[^ \t]/.test(lines[i])) lastNonEmptyLine = i;
  }
  let out = "";
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].replace(/\t/g, " ");
    if (i !== 0) line = line.replace(/^ +/, "");
    if (i !== lines.length - 1) line = line.replace(/ +$/, "");
    if (!line) continue;
    if (i !== lastNonEmptyLine) line += " ";
    out += line;
  }
  return out;
}

function lineOf(node: babelTypes.Node): number {
  return node.loc?.start.line ?? 0;
}

function span(node: babelTypes.Node): { start: number; end: number } {
  return { start: node.start ?? 0, end: node.end ?? 0 };
}

function srcOf(ctx: Ctx, node: babelTypes.Node): string {
  const { start, end } = span(node);
  return ctx.code.slice(start, end);
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isSimpleExpr(node: babelTypes.Node): boolean {
  if (t.isIdentifier(node) || t.isThisExpression(node)) return true;
  if ((t.isMemberExpression(node) || t.isOptionalMemberExpression(node)) && !node.computed && t.isIdentifier(node.property)) {
    return isSimpleExpr(node.object);
  }
  return false;
}

function nameOf(node: babelTypes.Expression): string {
  if (t.isIdentifier(node)) return node.name;
  if ((t.isMemberExpression(node) || t.isOptionalMemberExpression(node)) && t.isIdentifier(node.property)) {
    return node.property.name;
  }
  return "value";
}

class Vars {
  private readonly byName = new Map<string, string>();
  private readonly bySrc = new Map<string, string>();

  reserve(name: string, src: string): string {
    const existing = this.bySrc.get(src);
    if (existing) return existing;
    let candidate = name;
    let n = 2;
    while (this.byName.has(candidate)) candidate = `${name}${n++}`;
    this.byName.set(candidate, src);
    this.bySrc.set(src, candidate);
    return candidate;
  }

  nameFor(node: babelTypes.Expression, src: string): string {
    return this.reserve(nameOf(node), src);
  }

  format(): string {
    if (this.byName.size === 0) return "";
    const parts = [...this.byName].map(([name, src]) => (name === src ? name : `${name}: ${src}`));
    return `, { ${parts.join(", ")} }`;
  }
}

function toKey(ctx: Ctx, text: string): string {
  return text.replace(ctx.brandRe, "{{brand}}").replace(/\s+/g, " ").trim();
}

function record(ctx: Ctx, key: string, line: number, plural?: { one: string; other: string }): void {
  ctx.strings.push(plural ? { key, file: ctx.file, line, plural } : { key, file: ctx.file, line });
}

function snippetOf(source: string): string {
  const first = source.split(/\r?\n/)[0].trim();
  return first.length <= 120 ? first : `${first.slice(0, 117)}...`;
}

function transformStringLiteral(ctx: Ctx, node: babelTypes.StringLiteral, wrapJsx: boolean): void {
  if (ctx.handled.has(node) || !looksLikeCopy(node.value)) return;
  ctx.handled.add(node);
  const key = toKey(ctx, node.value);
  const call = `tx(${JSON.stringify(key)})`;
  const { start, end } = span(node);
  ctx.s.update(start, end, wrapJsx ? `{${call}}` : call);
  ctx.edits++;
  record(ctx, key, lineOf(node));
}

function transformExpression(ctx: Ctx, node: babelTypes.Node | null | undefined): void {
  if (!node) return;
  if (t.isStringLiteral(node)) {
    transformStringLiteral(ctx, node, false);
    return;
  }
  if (t.isTemplateLiteral(node)) {
    transformTemplate(ctx, node);
    return;
  }
  if (t.isConditionalExpression(node)) {
    transformExpression(ctx, node.consequent);
    transformExpression(ctx, node.alternate);
    return;
  }
  if (t.isLogicalExpression(node)) {
    transformExpression(ctx, node.right);
    return;
  }
  if (
    t.isTSAsExpression(node) ||
    t.isTSSatisfiesExpression(node) ||
    t.isTSNonNullExpression(node) ||
    t.isParenthesizedExpression(node)
  ) {
    transformExpression(ctx, node.expression);
    return;
  }
  if (t.isJSXExpressionContainer(node) && !t.isJSXEmptyExpression(node.expression)) {
    transformExpression(ctx, node.expression);
  }
}

// `n === 1 ? "event" : "events"` хэлбэрийг таньж one/other хосыг буцаана.
function matchPlural(ctx: Ctx, expr: babelTypes.Node): { countExpr: string; one: string; other: string } | null {
  if (!t.isConditionalExpression(expr)) return null;
  const { test, consequent, alternate } = expr;
  if (!t.isBinaryExpression(test)) return null;
  if (!["===", "!==", "==", "!="].includes(test.operator)) return null;
  if (!t.isStringLiteral(consequent) || !t.isStringLiteral(alternate)) return null;
  const { left, right } = test;
  let countNode: babelTypes.Expression | null = null;
  if (t.isNumericLiteral(left) && left.value === 1 && t.isExpression(right) && isSimpleExpr(right)) countNode = right;
  else if (t.isNumericLiteral(right) && right.value === 1 && t.isExpression(left) && isSimpleExpr(left)) countNode = left;
  if (!countNode) return null;
  const equals = test.operator === "===" || test.operator === "==";
  return {
    countExpr: srcOf(ctx, countNode),
    one: equals ? consequent.value : alternate.value,
    other: equals ? alternate.value : consequent.value,
  };
}

function templateComplex(ctx: Ctx, node: babelTypes.TemplateLiteral): void {
  ctx.manual.push({ file: ctx.file, line: lineOf(node), reason: "template-complex", snippet: snippetOf(srcOf(ctx, node)) });
}

function transformTemplate(ctx: Ctx, node: babelTypes.TemplateLiteral): void {
  if (ctx.handled.has(node)) return;
  const chunkOf = (q: babelTypes.TemplateElement) => q.value.cooked ?? q.value.raw;
  if (!node.quasis.some((q) => LETTER.test(chunkOf(q)))) return;
  ctx.handled.add(node);

  // 1-р давталт: тоолуурын хувьсагчийг ол (нэгээс олон өөр тоолуур → гараар).
  let countExpr: string | null = null;
  for (const expr of node.expressions) {
    const plural = matchPlural(ctx, expr);
    if (!plural) continue;
    if (countExpr !== null && countExpr !== plural.countExpr) {
      templateComplex(ctx, node);
      return;
    }
    countExpr = plural.countExpr;
  }
  const vars = new Vars();
  if (countExpr !== null) vars.reserve("count", countExpr);

  // 2-р давталт: one/other түлхүүрийг угсарна.
  let one = "";
  let other = "";
  for (let i = 0; i < node.quasis.length; i++) {
    const chunk = chunkOf(node.quasis[i]);
    one += chunk;
    other += chunk;
    const expr = node.expressions[i];
    if (!expr) continue;
    const plural = matchPlural(ctx, expr);
    if (plural) {
      one += plural.one;
      other += plural.other;
      continue;
    }
    const src = srcOf(ctx, expr);
    if (src === BRAND_MEMBER) {
      one += "{{brand}}";
      other += "{{brand}}";
      continue;
    }
    if (src === countExpr) {
      one += "{{count}}";
      other += "{{count}}";
      continue;
    }
    if (t.isExpression(expr) && isSimpleExpr(expr)) {
      const placeholder = `{{${vars.nameFor(expr, src)}}}`;
      one += placeholder;
      other += placeholder;
      continue;
    }
    templateComplex(ctx, node);
    return;
  }

  const oneKey = toKey(ctx, one);
  const otherKey = toKey(ctx, other);
  const { start, end } = span(node);
  ctx.s.update(start, end, `tx(${JSON.stringify(oneKey)}${vars.format()})`);
  ctx.edits++;
  record(ctx, oneKey, lineOf(node), countExpr !== null ? { one: oneKey, other: otherKey } : undefined);
}

function collectRuns(
  ctx: Ctx,
  children: babelTypes.Node[],
): { runs: Piece[][]; complex: babelTypes.JSXExpressionContainer[] } {
  const runs: Piece[][] = [];
  const complex: babelTypes.JSXExpressionContainer[] = [];
  let run: Piece[] = [];
  const flush = () => {
    if (run.length > 0) runs.push(run);
    run = [];
  };
  for (const child of children) {
    if (t.isJSXText(child)) {
      const text = cleanJsxText(child.value);
      if (text) run.push({ kind: "text", text, ...span(child), line: lineOf(child) });
      continue;
    }
    if (t.isJSXExpressionContainer(child)) {
      const expr = child.expression;
      if (t.isJSXEmptyExpression(expr)) continue;
      if (t.isStringLiteral(expr)) {
        ctx.handled.add(expr);
        run.push({ kind: "text", text: expr.value, ...span(child), line: lineOf(child) });
        continue;
      }
      if (t.isTemplateLiteral(expr) && expr.expressions.length === 0) {
        ctx.handled.add(expr);
        const text = expr.quasis.map((q) => q.value.cooked ?? q.value.raw).join("");
        run.push({ kind: "text", text, ...span(child), line: lineOf(child) });
        continue;
      }
      if (isSimpleExpr(expr)) {
        run.push({ kind: "simple", node: expr, src: srcOf(ctx, expr), ...span(child), line: lineOf(child) });
        continue;
      }
      flush();
      complex.push(child);
      continue;
    }
    flush();
  }
  flush();
  return { runs, complex };
}

function isCopyRun(run: Piece[]): boolean {
  return run.some((piece) => piece.kind === "text" && LETTER.test(piece.text));
}

function tagNameOf(node: babelTypes.JSXElement): string {
  const name = node.openingElement.name;
  if (t.isJSXIdentifier(name)) return name.name;
  if (t.isJSXNamespacedName(name)) return `${name.namespace.name}:${name.name.name}`;
  const parts: string[] = [];
  let current: babelTypes.JSXMemberExpression | babelTypes.JSXIdentifier = name;
  while (t.isJSXMemberExpression(current)) {
    parts.unshift(current.property.name);
    current = current.object;
  }
  parts.unshift(current.name);
  return parts.join(".");
}

function elementHasCopy(node: babelTypes.JSXElement | babelTypes.JSXFragment): boolean {
  if (t.isJSXElement(node) && SKIP_TAGS.has(tagNameOf(node))) return false;
  for (const child of node.children) {
    if (t.isJSXText(child)) {
      if (LETTER.test(cleanJsxText(child.value))) return true;
      continue;
    }
    if (t.isJSXExpressionContainer(child)) {
      const expr = child.expression;
      if (t.isStringLiteral(expr) && LETTER.test(expr.value)) return true;
      if (t.isTemplateLiteral(expr) && expr.quasis.some((q) => LETTER.test(q.value.cooked ?? q.value.raw))) return true;
      continue;
    }
    if ((t.isJSXElement(child) || t.isJSXFragment(child)) && elementHasCopy(child)) return true;
  }
  return false;
}

function replaceRun(ctx: Ctx, run: Piece[]): void {
  const vars = new Vars();
  let joined = "";
  for (const piece of run) {
    if (piece.kind === "text") {
      joined += piece.text;
    } else if (piece.src === BRAND_MEMBER) {
      joined += "{{brand}}";
    } else {
      joined += `{{${vars.nameFor(piece.node, piece.src)}}}`;
    }
  }
  const key = toKey(ctx, joined);
  const leading = /^\s/.test(joined) ? '{" "}' : "";
  const trailing = /\s$/.test(joined) ? '{" "}' : "";
  const first = run[0];
  const last = run[run.length - 1];
  ctx.s.update(first.start, last.end, `${leading}{tx(${JSON.stringify(key)}${vars.format()})}${trailing}`);
  ctx.edits++;
  record(ctx, key, first.line);
}

function processChildren(ctx: Ctx, node: babelTypes.JSXElement | babelTypes.JSXFragment, skip: () => void): void {
  const { runs, complex } = collectRuns(ctx, node.children);
  const copyRuns = runs.filter(isCopyRun);
  if (copyRuns.length > 0) {
    const mixed = node.children.some(
      (child) => (t.isJSXElement(child) || t.isJSXFragment(child)) && elementHasCopy(child),
    );
    if (mixed) {
      ctx.manual.push({ file: ctx.file, line: lineOf(node), reason: "mixed-jsx", snippet: snippetOf(srcOf(ctx, node)) });
      skip();
      return;
    }
    for (const run of copyRuns) replaceRun(ctx, run);
  }
  for (const container of complex) transformExpression(ctx, container.expression);
}

function harvestXoTrans(ctx: Ctx, node: babelTypes.JSXElement): void {
  for (const attr of node.openingElement.attributes) {
    if (!t.isJSXAttribute(attr) || !t.isJSXIdentifier(attr.name, { name: "i18nKey" })) continue;
    if (t.isStringLiteral(attr.value)) record(ctx, attr.value.value, lineOf(attr));
  }
}

function visitElement(ctx: Ctx, node: babelTypes.JSXElement | babelTypes.JSXFragment, skip: () => void): void {
  if (t.isJSXElement(node)) {
    const tag = tagNameOf(node);
    if (tag === "XoTrans") {
      harvestXoTrans(ctx, node);
      skip();
      return;
    }
    if (SKIP_TAGS.has(tag)) {
      skip();
      return;
    }
  }
  processChildren(ctx, node, skip);
}

export function transformSource(code: string, filePath: string, options: TransformOptions = {}): TransformResult {
  const ctx: Ctx = {
    code,
    file: filePath,
    s: new MagicString(code),
    strings: [],
    manual: [],
    handled: new WeakSet(),
    edits: 0,
    attrAllow: new Set(options.attrAllowlist ?? DEFAULT_ATTR_ALLOWLIST),
    propAllow: new Set(options.propAllowlist ?? DEFAULT_PROP_ALLOWLIST),
    brandRe: new RegExp(`\\b${escapeRegExp(options.brandName ?? "Paperclip")}\\b`, "g"),
  };
  let lastImportEnd = 0;
  let hasTxImport = false;

  traverse(parseSource(code, filePath), {
    ImportDeclaration(path) {
      lastImportEnd = Math.max(lastImportEnd, path.node.end ?? 0);
      const importsTx = path.node.specifiers.some(
        (spec) => t.isImportSpecifier(spec) && t.isIdentifier(spec.imported, { name: "tx" }),
      );
      if (path.node.source.value === TX_SOURCE && importsTx) hasTxImport = true;
    },
    CallExpression(path) {
      const { callee, arguments: args } = path.node;
      if (t.isIdentifier(callee, { name: "tx" }) && t.isStringLiteral(args[0])) {
        ctx.handled.add(args[0]);
        record(ctx, args[0].value, lineOf(args[0]));
      }
    },
    JSXElement(path) {
      visitElement(ctx, path.node, () => path.skip());
    },
    JSXFragment(path) {
      visitElement(ctx, path.node, () => path.skip());
    },
    JSXAttribute(path) {
      const { name, value } = path.node;
      if (!t.isJSXIdentifier(name) || !ctx.attrAllow.has(name.name) || !value) return;
      if (t.isStringLiteral(value)) transformStringLiteral(ctx, value, true);
      else if (t.isJSXExpressionContainer(value)) transformExpression(ctx, value.expression);
    },
    ObjectProperty(path) {
      const { key, value, computed, shorthand } = path.node;
      if (computed || shorthand) return;
      const name = t.isIdentifier(key) ? key.name : t.isStringLiteral(key) ? key.value : null;
      if (name === null || !ctx.propAllow.has(name)) return;
      transformExpression(ctx, value);
    },
  });

  const changed = ctx.edits > 0;
  if (changed && !hasTxImport) {
    if (lastImportEnd > 0) ctx.s.appendLeft(lastImportEnd, `\n${TX_IMPORT}`);
    else ctx.s.prepend(`${TX_IMPORT}\n`);
  }
  return {
    code: changed ? ctx.s.toString() : code,
    map: changed ? ctx.s.generateMap({ hires: true, source: filePath, includeContent: true }) : null,
    strings: ctx.strings,
    manual: ctx.manual,
    changed,
  };
}

// Трансформ хийгдээгүй файлуудаас гараар бичсэн tx("…") ба XoTrans i18nKey түлхүүрийг цуглуулна.
export function harvestExplicitKeys(code: string, filePath: string): ExtractedString[] {
  const strings: ExtractedString[] = [];
  traverse(parseSource(code, filePath), {
    CallExpression(path) {
      const { callee, arguments: args } = path.node;
      if (t.isIdentifier(callee, { name: "tx" }) && t.isStringLiteral(args[0])) {
        strings.push({ key: args[0].value, file: filePath, line: lineOf(args[0]) });
      }
    },
    JSXOpeningElement(path) {
      if (!t.isJSXIdentifier(path.node.name, { name: "XoTrans" })) return;
      for (const attr of path.node.attributes) {
        if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name, { name: "i18nKey" }) && t.isStringLiteral(attr.value)) {
          strings.push({ key: attr.value.value, file: filePath, line: lineOf(attr) });
        }
      }
    },
  });
  return strings;
}
```

Хэрэгжүүлэгчид: `magic-string`-ийн `update` нь мужийг сольдог; нэг мужийг хоёр удаа солих (жишээ template-ийг бүтнээр нь солиод дотор нь дахин) `Cannot split a chunk that has already been edited` алдаа өгнө. Дээрх код үүнээс `handled` олонлог ба "текст run-ыг эцэг элемент дээр, атрибутыг тусад нь" зарчмаар зайлсхийдэг. Шинэ дүрэм нэмэхдээ энэ хязгаарлалтыг санах.

- [ ] **Step 6: Тест давж байгааг батлах**

```bash
cd ~/dev/paperclip-mn && pnpm xo:i18n:test 2>&1 | tail -6
```

Хүлээгдэх: `Test Files  1 passed (1)` ба `Tests  30 passed (30)`.

- [ ] **Step 7: Typecheck**

```bash
cd ~/dev/paperclip-mn && pnpm xo:i18n:typecheck && echo TYPECHECK_OK
```

Хүлээгдэх: `TYPECHECK_OK` (tsc 7.0.2, алдаа байхгүй).

- [ ] **Step 8: Commit**

```bash
cd ~/dev/paperclip-mn && git add package.json pnpm-lock.yaml .gitignore scripts/xo-i18n/transform.ts scripts/xo-i18n/transform.test.ts scripts/xo-i18n/vitest.config.ts scripts/xo-i18n/tsconfig.json && git commit -q -m "feat(xo): add i18n codemod transformer

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" && git log --oneline -1
```

Хүлээгдэх: `<sha> feat(xo): add i18n codemod transformer`.

---

### Task 9: i18n CLI (tiers, extract/check/emit/todo/merge), parity тест, Sidebar орчуулга

**Files:**
- Create: `scripts/xo-i18n/tiers.ts`
- Create: `scripts/xo-i18n/cli.ts`
- Create: `ui/src/i18n/xo/parity.test.ts`
- Modify: `ui/src/i18n/xo/en.json` (CLI дахин үүсгэнэ), `ui/src/i18n/xo/mn.json` (CLI + орчуулга)

**Interfaces:**
- Consumes: Task 8-ийн `transformSource(code, filePath)` → `{ code, map, strings, manual, changed }` ба `harvestExplicitKeys(code, filePath)` → `ExtractedString[]`; Task 5-ын `ui/src/i18n/xo/{en,mn,keep-en}.json`; upstream-ийн `validateLocaleMessages(candidate: unknown, englishReference: unknown): string[]` (`ui/src/i18n/locale-validation.ts:110`); Task 8-д бүртгэсэн `xo:i18n:extract|check|emit|todo|merge` скриптүүд.
- Produces (Task 10, 11, 12 ба SYNC.md ашиглана):
  - `XO_TRANSFORM_FILES: readonly string[]` — build үед `tx()`-ээр ороох файлуудын repo root-оос харьцангуй POSIX зам (`scripts/xo-i18n/tiers.ts`).
  - `scripts/xo-i18n/cli.ts`-ийн 5 горим (доорх хүснэгт).
  - `scripts/xo-i18n/status.json`, `scripts/xo-i18n/.emit/`, `scripts/xo-i18n/.batches/` — gitignore-д (Task 8 Step 2).
  - Sidebar-ын 27 түлхүүрийн монгол орчуулга `ui/src/i18n/xo/mn.json`-д.

CLI-ийн горимууд:

| Горим | Юу хийнэ | Гаралт |
|---|---|---|
| `extract` | `XO_TRANSFORM_FILES`-ийг `transformSource`-оор, `ui/src` доорх бусад `.ts/.tsx` файлыг `harvestExplicitKeys`-ээр уншиж `en.json`-г дахин үүсгэнэ (түлхүүр = англи текст; plural → `_one`/`_other`). `mn.json`-д байгаа орчуулгыг хадгалж, шинэ түлхүүрийг англиар нөхнө, en-д байхгүй болсон түлхүүрийг хаяна. `status.json` бичнэ. | `xo:i18n extract: files=N keys=N untranslated=N orphan=N manual=N` |
| `check` | `en.json` хуучирсан, `mn.json`-д дутуу, орчуулаагүй (`keep-en.json`-д ороогүй), гараар шийдэх (`manual`) тохиолдол — аль нэг байвал stderr-д мөр бүрээр бичээд exit 1. | `xo:i18n check: OK (keys=N)` эсвэл асуудлууд + `xo:i18n check: FAIL (N асуудал)` |
| `emit` | Хувиргасан кодыг `scripts/xo-i18n/.emit/<харьцангуй зам>` доор бичнэ — нүдээр хянах, diff харах зориулалттай; эх кодыг хөндөхгүй. | `xo:i18n emit: N файл → scripts/xo-i18n/.emit/` |
| `todo <prefix…>` | Замын угтвар(ууд)-тай файлуудын орчуулаагүй түлхүүрийг `{ "key": "" }` JSON хэлбэрээр stdout-д гаргана (батчийн ажлын файл). | stderr: `xo:i18n todo: N түлхүүр` |
| `merge <file.json>` | Батчийн хоосон биш утгуудыг (зөвхөн `en.json`-д байгаа түлхүүр) `mn.json`-д нэгтгэж эрэмбэлж бичнэ. | `xo:i18n merge: нэгтгэсэн=N алгассан=N` |

Sidebar-ын хоёр файлын орчуулагдах мөрүүд (Task 8-ийн дүрмээр): `Sidebar.tsx` — 25 `label="…"` атрибут + `New Task` JSX текст 2 удаа = 27 мөр; `Sidebar.production.tsx` — 23 `label` + `New Task` 2 удаа = 25 мөр. Нэгдсэн түлхүүр 27 (`Company` зөвхөн production, `Agents`/`Audit`/`Organization` зөвхөн streamlined). `badgeLabel="unread"`/`"decisions"` allowlist-д байхгүй тул хөндөгдөхгүй (Task 11 Step 5-д гараар `tx()` болгож болно).

- [ ] **Step 1: tiers.ts бичих**

`scripts/xo-i18n/tiers.ts`:

```ts
// Build үед tx()-ээр ороох файлууд: repo root-оос харьцангуй POSIX зам.
// Task 11 (Ү2) энэ жагсаалтыг T1-ийн 101 файл болгож өргөтгөнө.
export const XO_TRANSFORM_FILES: readonly string[] = [
  "ui/src/components/Sidebar.tsx",
  "ui/src/components/Sidebar.production.tsx",
];
```

- [ ] **Step 2: cli.ts бичих**

`scripts/xo-i18n/cli.ts`:

```ts
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

import { XO_TRANSFORM_FILES } from "./tiers";
import { harvestExplicitKeys, transformSource, type ExtractedString, type ManualCase } from "./transform";

const REPO_ROOT = fileURLToPath(new URL("../..", import.meta.url));
const XO_DIR = join(REPO_ROOT, "ui", "src", "i18n", "xo");
const EN_FILE = join(XO_DIR, "en.json");
const MN_FILE = join(XO_DIR, "mn.json");
const KEEP_EN_FILE = join(XO_DIR, "keep-en.json");
const STATUS_FILE = join(REPO_ROOT, "scripts", "xo-i18n", "status.json");
const EMIT_DIR = join(REPO_ROOT, "scripts", "xo-i18n", ".emit");
const UI_SRC = join(REPO_ROOT, "ui", "src");

type Catalog = Record<string, string>;

function readJson<T>(file: string, fallback: T): T {
  if (!existsSync(file)) return fallback;
  return JSON.parse(readFileSync(file, "utf8")) as T;
}

function writeJson(file: string, value: unknown): void {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function sortCatalog(catalog: Catalog): Catalog {
  const sorted: Catalog = {};
  for (const key of Object.keys(catalog).sort((a, b) => a.localeCompare(b, "en"))) {
    sorted[key] = catalog[key];
  }
  return sorted;
}

function toPosix(path: string): string {
  return path.split(sep).join("/");
}

function listUiSources(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      listUiSources(full, out);
    } else if (/\.tsx?$/.test(entry) && !/\.(test|stories|d)\./.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

interface ExtractResult {
  en: Catalog;
  manual: ManualCase[];
  transformed: Map<string, string>;
  byFile: Record<string, number>;
  files: string[];
  keyFiles: Map<string, Set<string>>;
}

function extractAll(): ExtractResult {
  const en: Catalog = {};
  const manual: ManualCase[] = [];
  const transformed = new Map<string, string>();
  const byFile: Record<string, number> = {};
  const keyFiles = new Map<string, Set<string>>();

  const record = (strings: ExtractedString[], rel: string): void => {
    for (const item of strings) {
      const entries: Array<[string, string]> = item.plural
        ? [
            [`${item.key}_one`, item.plural.one],
            [`${item.key}_other`, item.plural.other],
          ]
        : [[item.key, item.key]];
      for (const [catalogKey, value] of entries) {
        en[catalogKey] = value;
        const owners = keyFiles.get(catalogKey) ?? new Set<string>();
        owners.add(rel);
        keyFiles.set(catalogKey, owners);
      }
    }
    byFile[rel] = (byFile[rel] ?? 0) + strings.length;
  };

  const files: string[] = [];
  const transformSet = new Set<string>(XO_TRANSFORM_FILES);
  for (const rel of XO_TRANSFORM_FILES) {
    const abs = join(REPO_ROOT, rel);
    if (!existsSync(abs)) {
      console.error(`xo:i18n: tiers.ts дахь файл олдсонгүй: ${rel}`);
      process.exit(1);
    }
    const result = transformSource(readFileSync(abs, "utf8"), rel);
    record(result.strings, rel);
    manual.push(...result.manual);
    if (result.changed) transformed.set(rel, result.code);
    files.push(rel);
  }

  for (const abs of listUiSources(UI_SRC)) {
    const rel = toPosix(relative(REPO_ROOT, abs));
    if (transformSet.has(rel)) continue;
    const strings = harvestExplicitKeys(readFileSync(abs, "utf8"), rel);
    if (strings.length > 0) record(strings, rel);
  }

  return { en: sortCatalog(en), manual, transformed, byFile, files, keyFiles };
}

function isUntranslated(key: string, en: Catalog, mn: Catalog, keepEn: Set<string>): boolean {
  return !(key in mn) || (mn[key] === en[key] && !keepEn.has(key));
}

function runExtract(): void {
  const { en, manual, byFile, files } = extractAll();
  const previousEn = readJson<Catalog>(EN_FILE, {});
  const previousMn = readJson<Catalog>(MN_FILE, {});
  const keepEn = new Set(readJson<string[]>(KEEP_EN_FILE, []));

  const mn: Catalog = {};
  for (const key of Object.keys(en)) {
    mn[key] = previousMn[key] ?? en[key];
  }
  const orphan = Object.keys(previousEn).filter((key) => !(key in en));
  const untranslated = Object.keys(en).filter((key) => isUntranslated(key, en, mn, keepEn));

  writeJson(EN_FILE, en);
  writeJson(MN_FILE, sortCatalog(mn));
  writeJson(STATUS_FILE, {
    generatedAt: new Date().toISOString(),
    files,
    keys: Object.keys(en).length,
    untranslated,
    orphan,
    manual,
    byFile,
  });
  console.log(
    `xo:i18n extract: files=${files.length} keys=${Object.keys(en).length} untranslated=${untranslated.length} orphan=${orphan.length} manual=${manual.length}`,
  );
}

function runCheck(): void {
  const { en, manual } = extractAll();
  const currentEn = readJson<Catalog>(EN_FILE, {});
  const mn = readJson<Catalog>(MN_FILE, {});
  const keepEn = new Set(readJson<string[]>(KEEP_EN_FILE, []));
  const problems: string[] = [];

  const added = Object.keys(en).filter((key) => !(key in currentEn));
  const stale = Object.keys(currentEn).filter((key) => !(key in en));
  if (added.length > 0 || stale.length > 0) {
    problems.push(
      `en.json хуучирсан (шинэ ${added.length}, хоцрогдсон ${stale.length}): pnpm xo:i18n:extract ажиллуул`,
    );
  }
  for (const key of Object.keys(en)) {
    if (!(key in mn)) {
      problems.push(`mn.json-д байхгүй: ${key}`);
    } else if (isUntranslated(key, en, mn, keepEn)) {
      problems.push(`орчуулаагүй: ${key}`);
    }
  }
  for (const item of manual) {
    problems.push(`гараар: ${item.file}:${item.line} ${item.reason} ${item.snippet}`);
  }

  if (problems.length > 0) {
    for (const problem of problems) console.error(problem);
    console.error(`xo:i18n check: FAIL (${problems.length} асуудал)`);
    process.exit(1);
  }
  console.log(`xo:i18n check: OK (keys=${Object.keys(en).length})`);
}

function runEmit(): void {
  const { transformed } = extractAll();
  for (const [rel, code] of transformed) {
    const target = join(EMIT_DIR, rel);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, code);
  }
  console.log(`xo:i18n emit: ${transformed.size} файл → scripts/xo-i18n/.emit/`);
}

function runTodo(prefixes: string[]): void {
  if (prefixes.length === 0) usage();
  const { en, keyFiles } = extractAll();
  const mn = readJson<Catalog>(MN_FILE, {});
  const keepEn = new Set(readJson<string[]>(KEEP_EN_FILE, []));
  const todo: Catalog = {};
  for (const key of Object.keys(en)) {
    const owners = keyFiles.get(key) ?? new Set<string>();
    const inScope = [...owners].some((file) => prefixes.some((prefix) => file.startsWith(prefix)));
    if (inScope && isUntranslated(key, en, mn, keepEn)) todo[key] = "";
  }
  process.stdout.write(`${JSON.stringify(todo, null, 2)}\n`);
  console.error(`xo:i18n todo: ${Object.keys(todo).length} түлхүүр`);
}

function runMerge(file: string | undefined): void {
  if (!file) usage();
  const batchFile = resolve(file);
  if (!existsSync(batchFile)) {
    console.error(`xo:i18n merge: файл олдсонгүй: ${batchFile}`);
    process.exit(1);
  }
  const batch = readJson<Record<string, unknown>>(batchFile, {});
  const en = readJson<Catalog>(EN_FILE, {});
  const mn = readJson<Catalog>(MN_FILE, {});
  let merged = 0;
  let skipped = 0;
  for (const [key, value] of Object.entries(batch)) {
    if (key in en && typeof value === "string" && value.trim() !== "") {
      mn[key] = value;
      merged += 1;
    } else {
      skipped += 1;
    }
  }
  writeJson(MN_FILE, sortCatalog(mn));
  console.log(`xo:i18n merge: нэгтгэсэн=${merged} алгассан=${skipped}`);
}

function usage(): never {
  console.error("Хэрэглээ: cli.ts extract | check | emit | todo <path-prefix...> | merge <file.json>");
  process.exit(2);
}

const [mode, ...rest] = process.argv.slice(2);
switch (mode) {
  case "extract":
    runExtract();
    break;
  case "check":
    runCheck();
    break;
  case "emit":
    runEmit();
    break;
  case "todo":
    runTodo(rest);
    break;
  case "merge":
    runMerge(rest[0]);
    break;
  default:
    usage();
}
```

Тайлбар: `import.meta.url` ажиллана, учир нь root `package.json` `"type": "module"` тул tsx энэ файлыг ESM гэж ачаална; `REPO_ROOT` = `scripts/xo-i18n/../..`. Гаралтын мөрүүд (`xo:i18n extract: …`, `орчуулаагүй: …`) SYNC.md ба Task 11-ийн grep-д ашиглагдана — өөрчлөхгүй.

- [ ] **Step 3: Typecheck**

```bash
cd ~/dev/paperclip-mn && pnpm xo:i18n:typecheck && echo TYPECHECK_OK
```

Хүлээгдэх: `TYPECHECK_OK` (`scripts/xo-i18n/tsconfig.json`-ийн `include: ["./*.ts"]` нь `tiers.ts`, `cli.ts`-ийг хамарна).

- [ ] **Step 4: Анхны extract**

```bash
cd ~/dev/paperclip-mn && pnpm xo:i18n:extract && grep -c '":' ui/src/i18n/xo/en.json && head -4 ui/src/i18n/xo/en.json
```

Хүлээгдэх гаралт:

```
xo:i18n extract: files=2 keys=27 untranslated=27 orphan=0 manual=0
27
{
  "Activity": "Activity",
  "Agents": "Agents",
  "Artifacts": "Artifacts",
```

`manual` 0-ээс их гарвал (Sidebar-д холимог JSX байх ёсгүй) `scripts/xo-i18n/status.json`-ийн `manual` талбарыг уншиж, тухайн мөрийг Task 11 Step 4-ийн дүрмээр (`XoTrans`) засаад дахин extract хий. `keys` 27-оос зөрвөл `en.json`-д гарсан бодит түлхүүрүүдээр Step 7-ийн батчийг гүйцээ.

- [ ] **Step 5: check FAIL өгч байгааг батлах**

```bash
cd ~/dev/paperclip-mn && (pnpm xo:i18n:check 2>&1 || echo EXIT_NONZERO) | grep -E '^(орчуулаагүй: Search|xo:i18n check|EXIT_NONZERO)'
```

Хүлээгдэх гаралт:

```
орчуулаагүй: Search
xo:i18n check: FAIL (27 асуудал)
EXIT_NONZERO
```

- [ ] **Step 6: Батчийн загвар гаргах (todo)**

```bash
cd ~/dev/paperclip-mn && mkdir -p scripts/xo-i18n/.batches && pnpm -s xo:i18n:todo ui/src/components/Sidebar > scripts/xo-i18n/.batches/sidebar.json && head -3 scripts/xo-i18n/.batches/sidebar.json
```

Хүлээгдэх: stderr-д `xo:i18n todo: 27 түлхүүр`; stdout:

```
{
  "Activity": "",
  "Agents": "",
```

(`-s` нь pnpm-ийн өөрийн толгой мөрийг stdout-оос хасна — JSON цэвэр үлдэнэ.)

- [ ] **Step 7: Батчийг орчуулгаар дүүргэх**

`scripts/xo-i18n/.batches/sidebar.json`-г бүхэлд нь дараах агуулгаар солино (Task 11-ийн `docs/xo/glossary.md`-тэй нийцнэ):

```json
{
  "Activity": "Үйл ажиллагаа",
  "Agents": "Агентууд",
  "Artifacts": "Артефактууд",
  "Audit": "Аудит",
  "Cases": "Кейсүүд",
  "Company": "Компани",
  "Conference Room": "Хурлын өрөө",
  "Connectors": "Холбогчид",
  "Costs": "Зардал",
  "Dashboard": "Хянах самбар",
  "Decisions": "Шийдвэрүүд",
  "Goals": "Зорилгууд",
  "Inbox": "Ирсэн",
  "New Task": "Шинэ даалгавар",
  "Org": "Байгууллага",
  "Organization": "Байгууллага",
  "Pipelines": "Пайплайнууд",
  "Projects": "Төслүүд",
  "Routines": "Тогтмол ажлууд",
  "Search": "Хайх",
  "Settings": "Тохиргоо",
  "Skills": "Чадварууд",
  "Status": "Төлөв",
  "Tasks": "Даалгаврууд",
  "Timeline": "Цагийн хэлхээ",
  "Work": "Ажил",
  "Workspaces": "Ажлын талбарууд"
}
```

- [ ] **Step 8: Merge**

```bash
cd ~/dev/paperclip-mn && pnpm xo:i18n:merge scripts/xo-i18n/.batches/sidebar.json && grep -n '"Search"' ui/src/i18n/xo/mn.json
```

Хүлээгдэх гаралт:

```
xo:i18n merge: нэгтгэсэн=27 алгассан=0
21:  "Search": "Хайх",
```

- [ ] **Step 9: check OK**

```bash
cd ~/dev/paperclip-mn && pnpm xo:i18n:check
```

Хүлээгдэх: `xo:i18n check: OK (keys=27)`.

- [ ] **Step 10: Parity тест бичих**

`ui/src/i18n/xo/parity.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { validateLocaleMessages } from "../locale-validation";
import en from "./en.json";
import mn from "./mn.json";

describe("XO толь (xo namespace)", () => {
  it("mn.json нь en.json-тэй түлхүүр ба {{placeholder}}-оор тэнцүү", () => {
    expect(validateLocaleMessages(mn, en)).toEqual([]);
  });

  it("en.json-ийн утга нь түлхүүртэйгээ тэнцүү (plural _one/_other-оос бусад)", () => {
    const mismatched = Object.entries(en).filter(
      ([key, value]) => !/_(one|other)$/.test(key) && value !== key,
    );
    expect(mismatched).toEqual([]);
  });
});
```

Хоёр дахь тест "түлхүүр = англи текст" гэсэн Task 8-ийн 1-р дүрмийг хамгаална: хэн нэгэн `en.json`-г гараар засвал шууд илэрнэ.

- [ ] **Step 11: Parity тест ажиллуулах**

```bash
cd ~/dev/paperclip-mn/ui && pnpm exec vitest run src/i18n/xo/parity.test.ts 2>&1 | tail -6
```

Хүлээгдэх: `Test Files  1 passed (1)` ба `Tests  2 passed (2)`.

- [ ] **Step 12: emit-ийн шалгалт**

```bash
cd ~/dev/paperclip-mn && pnpm xo:i18n:emit && grep -o 'tx("' scripts/xo-i18n/.emit/ui/src/components/Sidebar.tsx | wc -l && grep -c 'import { tx } from "@/i18n/xo";' scripts/xo-i18n/.emit/ui/src/components/Sidebar.tsx && grep -c 'label={tx("Search")}' scripts/xo-i18n/.emit/ui/src/components/Sidebar.tsx
```

Хүлээгдэх гаралт (`wc -l`-ийн тоо урдаа зайтай байж болно; сүүлийн `1` = `label={tx("Search")}` мөр яг нэг удаа):

```
xo:i18n emit: 2 файл → scripts/xo-i18n/.emit/
27
1
1
```

Эх `ui/src/components/Sidebar.tsx` өөрчлөгдөөгүй: `git status --short ui/src/components/` хоосон.

- [ ] **Step 13: Git status ба commit**

```bash
cd ~/dev/paperclip-mn && git status --short
```

Хүлээгдэх (яг эдгээр 5 мөр; `.emit/`, `.batches/`, `status.json` gitignore-д тул харагдахгүй):

```
 M ui/src/i18n/xo/en.json
 M ui/src/i18n/xo/mn.json
?? scripts/xo-i18n/cli.ts
?? scripts/xo-i18n/tiers.ts
?? ui/src/i18n/xo/parity.test.ts
```

```bash
cd ~/dev/paperclip-mn && git add scripts/xo-i18n/tiers.ts scripts/xo-i18n/cli.ts ui/src/i18n/xo/en.json ui/src/i18n/xo/mn.json ui/src/i18n/xo/parity.test.ts && git commit -q -m "feat(xo): add i18n CLI and translate the sidebar

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" && git log --oneline -1
```

Хүлээгдэх: `<sha> feat(xo): add i18n CLI and translate the sidebar`.

---

### Task 10: Vite plugin — build үеийн transform, e2e хэлний тохиргоо, browser шалгалт, Ү1 хаалт

**Files:**
- Create: `scripts/xo-i18n/vite-plugin.ts`
- Modify: `ui/vite.config.ts:7-12`
- Modify: `tests/e2e/playwright.config.ts:46-51` (`use` блок)

**Interfaces:**
- Consumes: Task 9-ийн `XO_TRANSFORM_FILES`, Task 8-ийн `transformSource(code, filePath)`; Task 5-ын `XO_LOCALE_STORAGE_KEY = "xo.locale"` (localStorage түлхүүр, утга `"mn" | "en"`).
- Produces: `xoI18nTransformPlugin(): XoI18nPlugin` — Vite plugin обьект `{ name: "xo-i18n-transform", enforce: "pre", transform(code, id) }`; орчны хувьсагч `XO_I18N_TRANSFORM=0` → plugin юу ч хийхгүй (англи эх кодоор build хийх debug горим). e2e: одоо байгаа 31 spec англи UI дээр ажиллана (`storageState`-аар `xo.locale=en`), Task 12-ын `xo-mn.spec.ts` өөрөө `mn` болгоно.

Гурван зүйлийг санах:
- `scripts/xo-i18n/vite-plugin.ts` `"vite"`-ээс юу ч импортлохгүй: `vite` нь зөвхөн `ui/`-ийн devDependency тул `scripts/xo-i18n/tsconfig.json` доор олдохгүй. Plugin-ий төрлийг бүтцээр (structural) өөрөө зарлана — Vite обьектыг л шалгадаг.
- Vite `ui/vite.config.ts`-ийг esbuild-ээр bundle хийхдээ харьцангуй import-уудыг (`../scripts/xo-i18n/vite-plugin` → `./transform`, `./tiers`) дотор нь оруулж, bare package-уудыг (`@babel/*`, `magic-string`) гадна үлдээнэ; тэднийг Node `ui/`-ээс дээш явж root `node_modules`-оос олно (Task 8 Step 1-д `-w`-ээр суулгасан).
- `@vitejs/plugin-react` мөн `enforce: "pre"` тул бидний plugin массивын **эхэнд** байх ёстой — нэг enforce түвшний plugin-ууд массивын дарааллаар ажиллана; JSX-ийг React plugin хөрвүүлэхээс өмнө бид эх JSX-ийг харах хэрэгтэй. `ui/vitest.config.ts`-д plugin байхгүй тул component тестүүд англи эхээ хэвээр хардаг (Task 8-ийн 11-р дүрэм).

- [ ] **Step 1: vite-plugin.ts бичих**

`scripts/xo-i18n/vite-plugin.ts`:

```ts
import { XO_TRANSFORM_FILES } from "./tiers";
import { transformSource } from "./transform";

/** Vite-ийн Plugin төрлийг импортлохгүй (vite нь ui/-ийн devDependency); бүтцээр нь зарлана. */
export interface XoI18nPlugin {
  name: string;
  enforce: "pre";
  transform(code: string, id: string): { code: string; map: string | null } | null;
}

export function xoI18nTransformPlugin(): XoI18nPlugin {
  const enabled = process.env.XO_I18N_TRANSFORM !== "0";
  const targets = XO_TRANSFORM_FILES.map((rel) => ({ rel, suffix: `/${rel}` }));
  return {
    name: "xo-i18n-transform",
    enforce: "pre",
    transform(code, id) {
      if (!enabled) return null;
      const file = id.split("?")[0].replace(/\\/g, "/");
      const target = targets.find((t) => file.endsWith(t.suffix));
      if (!target) return null;
      const result = transformSource(code, target.rel);
      if (!result.changed) return null;
      return { code: result.code, map: result.map?.toString() ?? null };
    },
  };
}
```

`id` нь Vite-д үнэмлэхүй зам (`/Users/…/ui/src/components/Sidebar.tsx`, заримдаа `?v=…` дагавартай) тул `endsWith("/ui/src/components/Sidebar.tsx")`-ээр таарна. `map` нь magic-string `SourceMap`-ийн `toString()` — Vite JSON мөрийг хүлээн авдаг.

- [ ] **Step 2: Typecheck**

```bash
cd ~/dev/paperclip-mn && pnpm xo:i18n:typecheck && echo TYPECHECK_OK
```

Хүлээгдэх: `TYPECHECK_OK`.

- [ ] **Step 3: ui/vite.config.ts-д plugin залгах**

Одоогийн 7–12-р мөр:

```ts
import { serviceWorkerBuildIdPlugin } from "./src/lib/vite-sw-build-id";

const apiProxy = createApiProxy();

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), serviceWorkerBuildIdPlugin()],
```

Болгох (7-р мөрийн дараа нэг import нэмж, `plugins` массивын эхэнд plugin тавина):

```ts
import { serviceWorkerBuildIdPlugin } from "./src/lib/vite-sw-build-id";
import { xoI18nTransformPlugin } from "../scripts/xo-i18n/vite-plugin";

const apiProxy = createApiProxy();

export default defineConfig(({ mode }) => ({
  plugins: [xoI18nTransformPlugin(), react(), tailwindcss(), serviceWorkerBuildIdPlugin()],
```

Шалгах:

```bash
cd ~/dev/paperclip-mn && grep -n "xoI18nTransformPlugin" ui/vite.config.ts
```

Хүлээгдэх гаралт:

```
8:import { xoI18nTransformPlugin } from "../scripts/xo-i18n/vite-plugin";
13:  plugins: [xoI18nTransformPlugin(), react(), tailwindcss(), serviceWorkerBuildIdPlugin()],
```

- [ ] **Step 4: UI build**

```bash
cd ~/dev/paperclip-mn && pnpm --filter @paperclipai/ui build 2>&1 | tail -4 && grep -l "Хянах самбар" ui/dist/assets/*.js | head -1
```

Хүлээгдэх: `✓ built in …` мөр (алдаагүй), дараа нь `mn.json`-г агуулсан нэг chunk-ийн зам (`ui/dist/assets/index-….js` маягтай). `grep` юу ч олохгүй бол `mn.json` bundle-д ороогүй → Task 5-ын `ui/src/i18n/index.ts` дахь `import xoMn from "./xo/mn.json"` ба `addResourceBundle` мөрүүдийг шалга.

Debug горим (шаардлагатай үед л): `XO_I18N_TRANSFORM=0 pnpm --filter @paperclipai/ui build` — plugin идэвхгүй, sidebar англиар үлдэнэ.

- [ ] **Step 5: e2e-г англи хэлээр тогтоох (playwright.config.ts)**

Одоо байгаа 31 spec англи UI-г шалгадаг (хоёр spec sidebar-ын англи label-ийг шууд дарна) — анхдагч хэл `mn` болсон тул тэднийг `storageState`-аар `en`-д тогтооно. `tests/e2e/playwright.config.ts`-ийн 46–51-р мөрийн `use` блок:

```ts
  use: {
    baseURL: BASE_URL,
    headless: true,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
```

Болгох:

```ts
  use: {
    baseURL: BASE_URL,
    headless: true,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    // XO: одоо байгаа spec-үүд англи UI-г шалгадаг тул хэлийг en-д тогтооно (xo-mn.spec.ts өөрөө mn болгоно).
    storageState: {
      cookies: [],
      origins: [{ origin: BASE_URL, localStorage: [{ name: "xo.locale", value: "en" }] }],
    },
  },
```

`BASE_URL` тэр файлд аль хэдийн зарлагдсан (`http://127.0.0.1:${PORT}`); `"xo.locale"` нь Task 5-ын `XO_LOCALE_STORAGE_KEY`-тэй үсэг бүрээр тэнцүү байх ёстой. Шалгах:

```bash
cd ~/dev/paperclip-mn && grep -n '"xo.locale"' tests/e2e/playwright.config.ts ui/src/xo/locale.ts
```

Хүлээгдэх: хоёр файлаас тус бүр нэг мөр.

- [ ] **Step 6: Server дахин асаах**

`preview_list`-ээр `paperclip-mn`-ийн `serverId`-г олж `preview_stop`, дараа нь `preview_start { name: "paperclip-mn" }` (`dev:once` — watch байхгүй тул кодын өөрчлөлт бүрийн дараа ингэж дахин асаана). `preview_logs`-д `http://localhost:3100` мөр гарч, `curl -s http://localhost:3100/api/health`-д `"ok"` байна. dev-runner ui/dist-ийг "up-to-date" гэж дахин ашиглаж болно — Step 4-д бид шинэ bundle-ийг аль хэдийн бүтээсэн тул зөв.

- [ ] **Step 7: Browser шалгалт (текстээр, screenshot нэг л удаа)**

Бүгд built-in browser-ийн хэрэгслээр (`navigate`, `find`, `get_page_text`, `javascript_tool`, `computer`), screenshot-ийг зөвхөн сүүлийн алхамд:

1. `navigate http://localhost:3100/`. Хэрэв `/onboarding` руу шилжвэл (байгууллагагүй) Ү0-ийн байгууллагыг ол: `curl -s http://localhost:3100/api/companies | head -c 300` → `"issuePrefix":"<prefix>"` → `navigate http://localhost:3100/<prefix>/dashboard`.
2. `find "Хайх"` → нэг `link` элемент (`href` нь `/<prefix>/search`-ээр төгсөнө). `get_page_text` дотор `Хянах самбар`, `Даалгаврууд`, `Төслүүд`, `Шинэ даалгавар` байна; `Dashboard`, `Search`, `New Task` **байхгүй**.
3. `javascript_tool`: `document.documentElement.lang` → `"mn"`.
4. `read_console_messages { onlyErrors: true }` → `i18n`, `tx`, `xo` агуулсан алдаа байхгүй.
5. Хэл сэлгэх: `find "Open account menu"` → тэр товчийг `computer left_click`; `find "Switch to English"` → click (Task 7-ийн `XoLocaleMenuAction`, `setLocale("en")` → хуудас дахин ачаална); `computer wait 2`; `find "Search"` → link олдоно; `javascript_tool` `document.documentElement.lang` → `"en"`; `localStorage.getItem("xo.locale")` → `"en"`.
6. Буцаах: `find "Open account menu"` → click; `find "Монгол хэл рүү шилжих"` → click; `computer wait 2`; `find "Хайх"` → олдоно; `document.documentElement.lang` → `"mn"`.
7. `computer screenshot { scale: 0.5 }` — Ө, Ү, Ё үсгүүд (`Төслүүд`, `Үйл ажиллагаа`) Inter-ээр зөв харагдаж байгаа эсэх (Task 2-ын фонт шалгалтын бодит баталгаа). Зургийг `docs/xo/` руу хадгалахгүй — ажиглалтыг доорх хаалтын тайланд нэг мөрөөр бич.

Аль нэг алхам таарахгүй бол эх кодыг унш, зас, Step 4–6-г давт. `find "Хайх"` олдохгүй ч `Search` олдвол: plugin ажиллаагүй → `pnpm xo:i18n:emit`-ийн гаралт зөв эсэх (Task 9 Step 12), `ui/vite.config.ts`-ийн массивын дараалал, `XO_I18N_TRANSFORM` орчны хувьсагчийг шалга. `Хайх` олдсон ч `document.documentElement.lang` `mn` биш бол Task 5-ын `applyDocumentLang`.

- [ ] **Step 8: Ү1 хаалт — бүх шалгалт**

UI typecheck + бүх ui тест (англи эхээр, Task 6-гийн формат тестүүд орно):

```bash
cd ~/dev/paperclip-mn && pnpm --filter @paperclipai/ui typecheck && (cd ui && pnpm exec vitest run 2>&1 | tail -5)
```

Хүлээгдэх: typecheck алдаагүй; `Test Files  N passed (N)` — `failed` мөргүй.

XO хэрэгслүүд:

```bash
cd ~/dev/paperclip-mn && pnpm xo:i18n:test 2>&1 | tail -3 && pnpm xo:i18n:typecheck && pnpm xo:i18n:check && echo XO_TOOLS_OK
```

Хүлээгдэх: `Tests  30 passed (30)`, `xo:i18n check: OK (keys=27)`, `XO_TOOLS_OK`.

Бүтэн build ба e2e (удаан: build хэдэн минут, e2e 31 spec `workers: 1` — Bash tool-д `timeout: 600000` өг, эсвэл `run_in_background: true`-гээр ажиллуулаад лог файлыг хүлээ):

```bash
cd ~/dev/paperclip-mn && (pnpm build > "$TMPDIR/xo-build.log" 2>&1 && echo BUILD_OK) || (tail -20 "$TMPDIR/xo-build.log"; echo BUILD_FAIL)
```

Хүлээгдэх: `BUILD_OK`.

```bash
cd ~/dev/paperclip-mn && (pnpm test:e2e > "$TMPDIR/xo-e2e.log" 2>&1 && echo E2E_OK) || (tail -40 "$TMPDIR/xo-e2e.log"; echo E2E_FAIL); grep -E '^\s+[0-9]+ (passed|failed)' "$TMPDIR/xo-e2e.log"
```

Хүлээгдэх: `E2E_OK` ба `  N passed (…)` мөр, `failed` мөргүй. Унасан spec гарвал шалтгаан нь дийлэнхдээ Task 3-ын брэнд (`Paperclip` → `XO`) эсвэл Task 6-гийн формат: тухайн spec-ийн assertion-ыг унш, XO-ийн шинэ утгаар засаад (upstream-ийн spec-т XO-ийн мөр нэмэх нь S-set-ийн ердийн засвар) дахин ажиллуул. Хэл нь `en` байгааг лог дахь `xo.locale` алдаагаар биш, `storageState` мөрийг `git diff tests/e2e/playwright.config.ts`-ээр батал.

- [ ] **Step 9: Commit**

```bash
cd ~/dev/paperclip-mn && git status --short
```

Хүлээгдэх (яг эдгээр 3 мөр):

```
 M tests/e2e/playwright.config.ts
 M ui/vite.config.ts
?? scripts/xo-i18n/vite-plugin.ts
```

```bash
cd ~/dev/paperclip-mn && git add scripts/xo-i18n/vite-plugin.ts ui/vite.config.ts tests/e2e/playwright.config.ts && git commit -q -m "feat(xo): wire build-time i18n transform for the sidebar

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" && git log --oneline -1
```

Хүлээгдэх: `<sha> feat(xo): wire build-time i18n transform for the sidebar`.

**Ү1 хаалтын шалгуур (spec §17):** Sidebar монголоор, хэл сэлгэгч хоёр тийш ажиллана, `document.documentElement.lang` зөв, огноо/тоо mn-MN, брэнд XO, бүх ui тест + XO тест + build + e2e ногоон, `pnpm xo:i18n:check` OK. Эдгээр биелсэн бол `docs/xo/y0-report.md`-ийн доор `## Ү1 хаалт` хэсэг нэмж огноо, commit sha, screenshot-ийн ажиглалтыг 3–5 мөрөөр бичээд `docs(xo): Y1 gate note` гэж commit хий (trailer-тэй). Ү2 (Task 11) эхлэхээс өмнө ED `docs/xo/glossary.md`-г батлах ёстой.

---

## Ү2 — T1 бүрэн орчуулга

Ү2-ын зорилго (spec §9, §17): T1 хүрээний 101 `.tsx` файл ба 8 `.ts` туслах файлын хэрэглэгчид харагдах бүх мөр монголоор; `pnpm xo:i18n:check` OK; монгол UI-г шалгадаг e2e ногоон. Ү1-д барьсан хэрэгслээр (Task 8 codemod, Task 9 CLI, Task 10 plugin) зөвхөн **өгөгдөл** нэмнэ: `tiers.ts`-ийн жагсаалт, `mn.json`-ийн орчуулга, гараар шийдэх цөөн мөр. Шинэ механизм үүсгэхгүй.

Ү2-ын өмнөх нөхцөл: Ү1 хаалт хаагдсан (Task 10 Step 8), ED `docs/xo/glossary.md`-г баталсан (Task 11 Step 1 — энэ нь Ү2-ын эхний алхам тул ED-ийн хариу иртэл Step 2-оос цааш явахгүй).

### Task 11: T1 бүрэн орчуулга — толь бичиг, 101 файлын tiers, гараар шийдэх тохиолдол, .ts туслах файл, 7 батч, латин үлдэгдлийн шалгалт

**Files:**
- Create: `docs/xo/glossary.md`
- Create: `docs/xo/screenshot-review.md`
- Modify: `docs/xo/SYNC.md` (Task 1-д үүсгэсэн; «Ү2-д нэмэгдсэн файлууд» хэсгийг бөглөнө)
- Modify: `scripts/xo-i18n/tiers.ts` (2 файл → 101 файл)
- Modify: `ui/src/i18n/xo/en.json`, `ui/src/i18n/xo/mn.json`, `ui/src/i18n/xo/keep-en.json` (зөвхөн CLI-ээр: `extract`, `merge`; `keep-en.json` гараар)
- Modify: `check`-ийн `гараар:` мөрөнд заагдах T1 `.tsx` файлууд (mixed-jsx → `XoTrans`, template-complex → `tx()`)
- Modify: `ui/src/lib/activity-format.ts`, `ui/src/lib/built-in-agent-toast.ts`, `ui/src/hooks/useComposerStop.ts`, `ui/src/hooks/useRetryNowMutation.ts`, `ui/src/lib/agent-setup-fields.ts`, `ui/src/lib/announcement-preview.ts`, `ui/src/lib/app-gallery-copy.ts`, `ui/src/hooks/useDateRange.ts`

**Interfaces:**
- Consumes: Task 5-ын `tx(key, options?)` (`import { tx } from "@/i18n/xo";`) ба `XoTrans({ i18nKey, values?, components? })` (`import { XoTrans } from "@/xo/XoTrans";`, `count` prop байхгүй); Task 8-ийн `transformSource` дүрмүүд (mixed-jsx ба template-complex → `manual`, `Paperclip` → `{{brand}}`); Task 9-ийн CLI `extract | check | emit | todo <prefix…> | merge <file.json>` ба `XO_TRANSFORM_FILES: readonly string[]`; `keep-en.json` = санаатайгаар англиар үлдээх түлхүүрийн `string[]`; Task 10-ийн plugin (`XO_TRANSFORM_FILES`-ийн файл бүрийг build үед хувиргана — жагсаалтад файл нэмэх нь шууд build-д нөлөөлнө).
- Produces: T1-ийн бүх түлхүүр `mn.json`-д орчуулагдсан, `pnpm xo:i18n:check` → `OK`; `docs/xo/glossary.md` — Task 12, Ү3 (server мессеж), Ү6 (T2/T3) орчуулгын жишиг; `docs/xo/screenshot-review.md` — маршрут бүрийн латин үлдэгдлийн бүртгэл.

Ажлын зарчим: түлхүүр = англи эх текст (Task 8-ийн 1-р дүрэм) тул орчуулга нь зөвхөн `mn.json`-д амьдарна; `.tsx` файлын өөрчлөлт зөвхөн codemod хувиргаж чадахгүй цөөн мөрөнд (Step 4) ба `.ts` туслах файлд (Step 5). Батч бүр тусдаа commit — буруу орчуулга илэрвэл тухайн батчийг л буцаана.

- [ ] **Step 1: Толь бичиг `docs/xo/glossary.md` — ED батлах хаалт**

`docs/xo/glossary.md`-г дараах агуулгаар үүсгэнэ (Task 9-ийн Sidebar-ын 27 орчуулга энэ толийн нэг хэсэг; тэдгээрийг өөрчилбөл Task 9-ийн `mn.json` ба Task 12-ын e2e-г хамт өөрчилнө):

````markdown
# XO орчуулгын толь бичиг (glossary)

Хэрэглээ: `ui/src/i18n/xo/mn.json`-ийн орчуулга бүр энэ толийг баримтална. Толинд байхгүй нэр томьёо гарвал эхлээд энд мөр нэмж commit хийгээд дараа нь орчуулна. ED батлаагүй нэр томьёоны өөрчлөлт хүчингүй.

## Хэв маяг

- Хэрэглэгчид «та» хэлбэрээр; албан боловч хуурай биш.
- Товчлуур, цэс: үйл үгийн захирах хэлбэр, богино («Үүсгэх», «Хадгалах»; «Үүсгэнэ үү» биш).
- Техникийн нэр англиар үлдэнэ: API key → «API түлхүүр» гэхдээ API, token/токен, heartbeat, Claude Code, Codex, GitHub, URL, JSON, Slack, Discord, Telegram. Латин үлдэгдлийн шалгалт (Task 11 Step 14) зөвхөн эдгээрийг зөвшөөрнө.
- Орлуулагч (`{{name}}`, `{{count}}`, `{{brand}}`) үсэг үсгээр нь хэвээр; байрлалыг монгол өгүүлбэрийн дарааллаар зөөж болно.
- Олон тооны хос (`_one` / `_other`) хоёулаа орчуулагдана; монголд хоёр утга давхцаж болно.
- `{{brand}}` = XO. «Paperclip» гэдэг үг ямар ч орчуулгад орохгүй.
- Цэг, таслал, олон цэг, асуултын тэмдэг эх текстийнхтэй ижил тоогоор.

## Нэр томьёо

| Англи | Монгол | Тайлбар |
|---|---|---|
| organization / Org | байгууллага | «Org» товчлол ч байгууллага |
| company | компани | UI-д organization-той зэрэгцэн хэрэглэгддэг тул ялгааг хадгална |
| agent | агент | |
| task / issue | даалгавар | «issue» = даалгавар, алдаа биш |
| goal | зорилго | |
| project | төсөл | |
| approval | зөвшөөрөл | |
| heartbeat | heartbeat | техникийн нэр, орчуулахгүй |
| run | ажиллагаа | агентын нэг удаагийн гүйцэтгэл |
| budget | төсөв | |
| cost | зардал | |
| workspace | ажлын талбар | |
| execution workspace | гүйцэтгэлийн талбар | |
| inbox | ирсэн | цэсний нэр; урт хэлбэр «ирсэн зүйлс» |
| decision | шийдвэр | |
| activity | үйл ажиллагаа | |
| audit | аудит | |
| dashboard | хянах самбар | |
| routine | тогтмол ажил | |
| pipeline | пайплайн | |
| artifact | артефакт | |
| skill | чадвар | |
| connector / app | холбогч / апп | |
| settings | тохиргоо | |
| instance | инстанс | |
| member | гишүүн | |
| invite | урилга | үйл үг бол «урих» |
| sign in / sign up / sign out | нэвтрэх / бүртгүүлэх / гарах | |
| email / password | имэйл / нууц үг | |
| model | модел | AI модел |
| adapter | адаптер | |
| API key | API түлхүүр | |
| token | токен | |
| status | төлөв | |
| pending / approved / rejected | хүлээгдэж буй / зөвшөөрсөн / татгалзсан | |
| active / paused / archived | идэвхтэй / түр зогссон / архивласан | |
| Create / Save / Cancel / Delete | Үүсгэх / Хадгалах / Болих / Устгах | товчлуур |
| Continue / Back / Next / Done | Үргэлжлүүлэх / Буцах / Дараах / Дууссан | |
| search | хайх | цэсэнд «Хайх», нэр үг бол «хайлт» |
| Loading… | Ачаалж байна… | |
| error / warning / success | алдаа / анхааруулга / амжилттай | |
| new / edit / view / open / retry | шинэ / засах / харах / нээх / дахин оролдох | |
| comment | сэтгэгдэл | |
| assignee / owner | хариуцагч / эзэмшигч | |
| priority | эрэмбэ | |
| due date | дуусах хугацаа | |
| description | тайлбар | |
| title / name | гарчиг / нэр | |
| tag / label | шошго | |
| filter / sort | шүүлт / эрэмбэлэх | |
| conference room | хурлын өрөө | |
| review queue | хянах дараалал | |
| learnings | сургамж | |
| case | кейс | |
| plugin | плагин | |
| timeline | цагийн хэлхээ | |
| notification | мэдэгдэл | |
| onboarding | эхний тохиргоо | onboarding wizard = «эхний тохиргооны туслах» |
| Start Onboarding | Тохиргоог эхлүүлэх | e2e-д ашиглагдана |
| Build a new organization | Шинэ байгууллага үүсгэх | e2e-д ашиглагдана |
| Add Agent | Агент нэмэх | |
| New Organization | Шинэ байгууллага | |
| New Task | Шинэ даалгавар | Sidebar (Task 9) |
| Let's get started... | За, эхэлцгээе... | OnboardingWizard lede; `{{brand}}` хэвээр |

## Sidebar-ын 27 түлхүүр (Task 9-д орчуулсан, өөрчлөхгүй)

Activity → Үйл ажиллагаа; Agents → Агентууд; Artifacts → Артефактууд; Audit → Аудит; Cases → Кейсүүд; Company → Компани; Conference Room → Хурлын өрөө; Connectors → Холбогчид; Costs → Зардал; Dashboard → Хянах самбар; Decisions → Шийдвэрүүд; Goals → Зорилгууд; Inbox → Ирсэн; New Task → Шинэ даалгавар; Org → Байгууллага; Organization → Байгууллага; Pipelines → Пайплайнууд; Projects → Төслүүд; Routines → Тогтмол ажлууд; Search → Хайх; Settings → Тохиргоо; Skills → Чадварууд; Status → Төлөв; Tasks → Даалгаврууд; Timeline → Цагийн хэлхээ; Work → Ажил; Workspaces → Ажлын талбарууд.
````

Commit:

```bash
cd ~/dev/paperclip-mn && git add docs/xo/glossary.md && git commit -q -m "docs(xo): add translation glossary

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" && git log --oneline -1
```

Хүлээгдэх: `<sha> docs(xo): add translation glossary`.

Хаалт: файлыг ED-д (SendUserFile) өгч батлуулна. ED мөр өөрчилбөл glossary.md-г засаад дахин commit (`docs(xo): glossary changes from ED review`). ED-ийн хариу иртэл Step 2-оос цааш явахгүй.

- [ ] **Step 2: `scripts/xo-i18n/tiers.ts` — T1-ийн 101 файл**

Файлыг бүхэлд нь дараах агуулгаар солино (Task 9-ийн 2 файл эхэнд хэвээр; 101 файл бүр `~/dev/paperclip-mn`-д байгааг 2026-09-30-нд шалгасан):

```ts
// T1 — spec §9: анхны 20 минутын урсгал. Энд байгаа файл бүрийг Task 10-ийн Vite plugin
// build үед transformSource-оор хувиргана; Task 9-ийн CLI extract/check/emit ижил жагсаалтыг уншина.
// Зам: repo root-оос харьцангуй, POSIX тусгаарлагчтай. Дараалал: components → onboarding → ui → pages.
export const XO_TRANSFORM_FILES: readonly string[] = [
  // Sidebar (Task 9)
  "ui/src/components/Sidebar.tsx",
  "ui/src/components/Sidebar.production.tsx",
  // Бүрхүүл, навигаци
  "ui/src/components/BreadcrumbBar.tsx",
  "ui/src/components/BreadcrumbBar.production.tsx",
  "ui/src/components/CompanySettingsSidebar.tsx",
  "ui/src/components/CompanySettingsSidebar.production.tsx",
  "ui/src/components/EmptyState.tsx",
  "ui/src/components/Layout.tsx",
  "ui/src/components/Layout.production.tsx",
  "ui/src/components/SecondarySidebar.tsx",
  "ui/src/components/SecondarySidebar.production.tsx",
  "ui/src/components/SidebarAccountMenu.tsx",
  "ui/src/components/SidebarAccountMenu.production.tsx",
  "ui/src/components/SidebarAgentChats.tsx",
  "ui/src/components/SidebarAgents.tsx",
  "ui/src/components/SidebarAgents.production.tsx",
  "ui/src/components/SidebarCompanyMenu.tsx",
  "ui/src/components/SidebarCompanyMenu.production.tsx",
  "ui/src/components/SidebarNavItem.tsx",
  "ui/src/components/SidebarNavItem.production.tsx",
  "ui/src/components/SidebarProjects.tsx",
  "ui/src/components/SidebarRecentTasks.tsx",
  "ui/src/components/SidebarSection.tsx",
  "ui/src/components/SidebarServerInfo.tsx",
  "ui/src/components/SidebarShell.tsx",
  "ui/src/components/SidebarShell.production.tsx",
  "ui/src/components/SidebarStarredProjects.tsx",
  "ui/src/components/SidebarStarredProjects.production.tsx",
  "ui/src/components/ThemeToggle.tsx",
  "ui/src/components/ToastViewport.tsx",
  // Зөвшөөрөл
  "ui/src/components/ApprovalCard.tsx",
  "ui/src/components/ApprovalPayload.tsx",
  // Эхний тохиргоо (onboarding)
  "ui/src/components/OnboardingChat.tsx",
  "ui/src/components/OnboardingWizard.tsx",
  "ui/src/components/OnboardingWizardVariant.tsx",
  "ui/src/components/onboarding/AgentPreview.tsx",
  "ui/src/components/onboarding/ConnectModelPreview.tsx",
  "ui/src/components/onboarding/CredentialModeLink.tsx",
  "ui/src/components/onboarding/FooterNav.tsx",
  "ui/src/components/onboarding/ModelSourceTiles.tsx",
  "ui/src/components/onboarding/OnboardingPrimitives.tsx",
  "ui/src/components/onboarding/PillGuy.tsx",
  "ui/src/components/onboarding/SavedProviderKeySelect.tsx",
  "ui/src/components/onboarding/SleepingZs.tsx",
  "ui/src/components/onboarding/Stepper.tsx",
  // shadcn primitives (ихэнх нь мөргүй; байгаа цөөн мөр нь "Close", "More" зэрэг)
  "ui/src/components/ui/alert-dialog.tsx",
  "ui/src/components/ui/attachment.tsx",
  "ui/src/components/ui/avatar.tsx",
  "ui/src/components/ui/badge.tsx",
  "ui/src/components/ui/breadcrumb.tsx",
  "ui/src/components/ui/button.tsx",
  "ui/src/components/ui/card.tsx",
  "ui/src/components/ui/checkbox.tsx",
  "ui/src/components/ui/collapsible.tsx",
  "ui/src/components/ui/command.tsx",
  "ui/src/components/ui/dialog.tsx",
  "ui/src/components/ui/dropdown-menu.tsx",
  "ui/src/components/ui/input.tsx",
  "ui/src/components/ui/label.tsx",
  "ui/src/components/ui/popover.tsx",
  "ui/src/components/ui/radio-card.tsx",
  "ui/src/components/ui/resizable-panels.tsx",
  "ui/src/components/ui/scroll-area.tsx",
  "ui/src/components/ui/select.tsx",
  "ui/src/components/ui/separator.tsx",
  "ui/src/components/ui/sheet.tsx",
  "ui/src/components/ui/skeleton.tsx",
  "ui/src/components/ui/tabs.tsx",
  "ui/src/components/ui/textarea.tsx",
  "ui/src/components/ui/toggle-switch.tsx",
  "ui/src/components/ui/tooltip.tsx",
  // Хуудсууд
  "ui/src/pages/AgentDetail.tsx",
  "ui/src/pages/AgentDetail.production.tsx",
  "ui/src/pages/Agents.tsx",
  "ui/src/pages/Agents.production.tsx",
  "ui/src/pages/ApprovalDetail.tsx",
  "ui/src/pages/Approvals.tsx",
  "ui/src/pages/Auth.tsx",
  "ui/src/pages/Companies.tsx",
  "ui/src/pages/CompanyAccess.tsx",
  "ui/src/pages/CompanyEnvironments.tsx",
  "ui/src/pages/CompanyExport.tsx",
  "ui/src/pages/CompanyImport.tsx",
  "ui/src/pages/CompanySettings.tsx",
  "ui/src/pages/CompanySettingsPluginPage.tsx",
  "ui/src/pages/Costs.tsx",
  "ui/src/pages/Costs.production.tsx",
  "ui/src/pages/Dashboard.tsx",
  "ui/src/pages/DashboardLive.tsx",
  "ui/src/pages/GoalDetail.tsx",
  "ui/src/pages/Goals.tsx",
  "ui/src/pages/Inbox.tsx",
  "ui/src/pages/InstanceAccess.tsx",
  "ui/src/pages/InstanceExperimentalSettings.tsx",
  "ui/src/pages/IssueDetail.tsx",
  "ui/src/pages/Issues.tsx",
  "ui/src/pages/ProfileSettings.tsx",
  "ui/src/pages/ProjectDetail.tsx",
  "ui/src/pages/Projects.tsx",
  "ui/src/pages/Search.tsx",
  "ui/src/pages/WhatNeedsMe.tsx",
];
```

Шалгалт — 101 файл, бүгд байгаа, typecheck:

```bash
cd ~/dev/paperclip-mn && grep -c '^  "ui/src/' scripts/xo-i18n/tiers.ts && grep -o '"ui/src/[^"]*"' scripts/xo-i18n/tiers.ts | tr -d '"' | while read -r f; do [ -f "$f" ] || echo "MISSING $f"; done; pnpm xo:i18n:typecheck && echo TYPECHECK_OK
```

Хүлээгдэх гаралт:

```
101
TYPECHECK_OK
```

(`MISSING` мөр нэг ч байхгүй.)

- [ ] **Step 3: Extract — T1-ийн бүх түлхүүрийг `en.json`-д**

```bash
cd ~/dev/paperclip-mn && pnpm xo:i18n:extract 2>&1 | tail -1 && python3 -c "import json;print('mn keys', len(json.load(open('ui/src/i18n/xo/mn.json'))))"
```

Хүлээгдэх: `xo:i18n extract: files=101 keys=K untranslated=U orphan=0 manual=M` — `files=101` ба `orphan=0` заавал; `K`, `U`, `M` бодит тоо (Sidebar-ын 27-оос бусад нь бүгд орчуулаагүй тул `U = K − 27` байна). `M` (гараар шийдэх тохиолдол) Step 4-ийн ажлын хэмжээ. Гурван тоог `docs/xo/screenshot-review.md`-ийн толгойд (Step 15) бичнэ.

`en.json`-д `Paperclip` үг ганц ч байхгүй (Task 8-ийн `{{brand}}` дүрэм):

```bash
cd ~/dev/paperclip-mn && grep -c "Paperclip" ui/src/i18n/xo/en.json; grep -c "{{brand}}" ui/src/i18n/xo/en.json
```

Хүлээгдэх: `0`, дараа нь 1-ээс их тоо (OnboardingWizard lede, Dashboard гэх мэт).

- [ ] **Step 4: Гараар шийдэх тохиолдол (`manual`) — `XoTrans` ба тодорхой `tx()`**

Жагсаалт:

```bash
cd ~/dev/paperclip-mn && (pnpm -s xo:i18n:check 2>&1 || true) | grep '^гараар:' | sort
```

Мөр бүр `гараар: <файл>:<мөр> <шалтгаан> <снипет>` (Task 9-ийн `check`). Хоёр шалтгаан, хоёр засвар:

**mixed-jsx** (текст дунд JSX элемент) → `XoTrans`. Жишээ (үлгэр загвар; бодит мөрүүд `check`-ийн жагсаалтаас):

```tsx
// Өмнө
<p className="text-sm text-muted-foreground">
  Read the <a href="/docs">docs</a> first.
</p>

// Дараа (файлын толгойд: import { XoTrans } from "@/xo/XoTrans";)
<p className="text-sm text-muted-foreground">
  <XoTrans i18nKey="Read the <docs>docs</docs> first." components={{ docs: <a href="/docs" /> }} />
</p>
```

Түлхүүр = англи текст, доторх элемент нь нэрлэсэн таг (`<docs>…</docs>`); `mn.json`-д `"Read the <docs>docs</docs> first.": "Эхлээд <docs>баримт</docs> уншина уу."` гэж орчуулагдана. `components`-ийн элемент өөрөө хүүхэдгүй (`<a href="/docs" />`) — текстийг нь орчуулгаас авна. Хувьсагчтай бол `values={{ name }}` ба түлхүүрт `{{name}}`.

**template-complex** (олон илэрхийлэлтэй template literal) → тодорхой `tx()`; `count` нэртэй утга **дамжуулахгүй** (i18next-ийн олон тооны механизм ажиллаж түлхүүр олдохгүй болно), олон тоо хэрэгтэй бол хоёр түлхүүрийн ternary:

```tsx
// Өмнө
const label = `${selected} of ${total} agents selected`;
const title = `${n} agent${n === 1 ? "" : "s"} paused`;

// Дараа (файлын толгойд: import { tx } from "@/i18n/xo";)
const label = tx("{{selected}} of {{total}} agents selected", { selected, total });
const title = n === 1 ? tx("{{n}} agent paused", { n }) : tx("{{n}} agents paused", { n });
```

Засвар бүрийн дараа дахин extract; `manual=0` болтол давтана:

```bash
cd ~/dev/paperclip-mn && pnpm xo:i18n:extract 2>&1 | tail -1 && pnpm --filter @paperclipai/ui typecheck && (cd ui && pnpm exec vitest run 2>&1 | tail -3)
```

Хүлээгдэх: `… manual=0`; typecheck чимээгүй; ui тестүүд ногоон (`Test Files  N passed`). `keys` тоо Step 3-ынхаас өсөж болно (гараар нэмсэн түлхүүрүүд `harvestExplicitKeys`-ээр орж ирнэ).

Commit (өөрчилсөн файлуудыг `git status --short ui/src`-ээс авна):

```bash
cd ~/dev/paperclip-mn && git add ui/src ui/src/i18n/xo/en.json && git commit -q -m "feat(xo): resolve manual i18n cases in T1

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" && git log --oneline -1
```

Хүлээгдэх: `<sha> feat(xo): resolve manual i18n cases in T1`. Хэрэв Step 3-т `manual=0` байсан бол энэ алхмыг алгасна (commit хийхгүй).

- [ ] **Step 5: 8 `.ts` туслах файлын мөрүүд — тодорхой `tx()`**

Codemod зөвхөн `.tsx` JSX-ийг хувиргадаг; эдгээр `.ts` файлын мөрүүд UI-д toast, шошго, огнооны текстээр гардаг тул гараар `tx()` болгоно. Файл бүрийн толгойд `import { tx } from "@/i18n/xo";`. Гурван хэв маяг:

Функц дотор шууд хэрэглэгддэг мөр — шууд ороох:

```ts
// ui/src/hooks/useComposerStop.ts:18 — өмнө
err instanceof Error ? err.message : "Unable to stop. Try again.",
// дараа
err instanceof Error ? err.message : tx("Unable to stop. Try again."),

// ui/src/lib/built-in-agent-toast.ts:26 — өмнө
action: { label: "View agent", href: options.agentHref },
// дараа
action: { label: tx("View agent"), href: options.agentHref },
```

Модулийн түвшний тогтмол объект (`useRetryNowMutation.ts:25-26`, `activity-format.ts:153-154` зэрэг) — утгыг **функц** болгоно. Шалтгаан: модуль i18n init-ээс өмнө ачаалагдаж болох тул `tx()`-г import үед биш, хэрэглэх үед дуудна; `tx("…")` литерал хэвээр тул `harvestExplicitKeys` түлхүүрийг олно:

```ts
// ui/src/hooks/useRetryNowMutation.ts:25-26 — өмнө
promoted: "Retry promoted",
already_promoted: "Retry already running",
// дараа
promoted: () => tx("Retry promoted"),
already_promoted: () => tx("Retry already running"),
// хэрэглэх цэг: MESSAGES[kind] → MESSAGES[kind]()
```

Олон тоо — хоёр түлхүүрийн ternary (`count` дамжуулахгүй), огноо — Task 6-ийн `localeTag()`-тай форматлагчийг хэвээр хэрэглэнэ, зөвхөн текст хэсгийг `tx()`.

Файл бүрийг засаад:

```bash
cd ~/dev/paperclip-mn && grep -L 'from "@/i18n/xo"' ui/src/lib/activity-format.ts ui/src/lib/built-in-agent-toast.ts ui/src/hooks/useComposerStop.ts ui/src/hooks/useRetryNowMutation.ts ui/src/lib/agent-setup-fields.ts ui/src/lib/announcement-preview.ts ui/src/lib/app-gallery-copy.ts ui/src/hooks/useDateRange.ts; pnpm xo:i18n:extract 2>&1 | tail -1 && pnpm --filter @paperclipai/ui typecheck && (cd ui && pnpm exec vitest run 2>&1 | tail -3)
```

Хүлээгдэх: `grep -L` юу ч хэвлэхгүй (8 файл бүр импорттой); `xo:i18n extract: files=101 keys=K2 …` (`K2` Step 4-ийнхээс их); typecheck чимээгүй; ui тест ногоон. Хэрэв одоо байгаа unit тест англи мөрийг шууд шалгадаг бол (`expect(...).toBe("Retry promoted")`) тест `VITE_XO_DEFAULT_LOCALE=en` (Task 5, `ui/vitest.config.ts`) тул хэвээр ногоон байх ёстой — улаан бол функц болгосон утгыг дуудахаа мартсан газар.

Commit:

```bash
cd ~/dev/paperclip-mn && git add ui/src/lib ui/src/hooks ui/src/i18n/xo/en.json && git commit -q -m "feat(xo): mark helper strings for translation

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" && git log --oneline -1
```

Хүлээгдэх: `<sha> feat(xo): mark helper strings for translation`.

- [ ] **Step 6: Батч 1 — навигаци, бүрхүүл**

Батчийн зан үйл (7 батч бүрд ижил 4 үйлдэл; `todo` зөвхөн **орчуулаагүй** түлхүүрийг өгдөг тул нэг түлхүүр олон файлд байсан ч эхний батчид л орчуулагдана — дараалал чухал):

1. `todo` → `.batches/<n>-<нэр>.json` (утга бүр `""`);
2. `""` бүрийг glossary-ийн дагуу монголоор бөглөнө (хоосон утга үлдээхгүй; санаатайгаар англиар үлдээх түлхүүрийг `keep-en.json` массивт нэмж, батчаас **устгана**);
3. `merge` + parity тест;
4. commit.

```bash
cd ~/dev/paperclip-mn && pnpm -s xo:i18n:todo ui/src/components/Sidebar ui/src/components/SecondarySidebar ui/src/components/Layout ui/src/components/BreadcrumbBar ui/src/components/CompanySettingsSidebar ui/src/components/ThemeToggle > scripts/xo-i18n/.batches/1-nav.json && grep -c '": ""' scripts/xo-i18n/.batches/1-nav.json
```

Хүлээгдэх: stderr `xo:i18n todo: N түлхүүр`, дараа нь ижил `N`.

`scripts/xo-i18n/.batches/1-nav.json`-ийн `""` бүрийг бөглөнө. Дараа нь:

```bash
cd ~/dev/paperclip-mn && grep -c '": ""' scripts/xo-i18n/.batches/1-nav.json; pnpm xo:i18n:merge scripts/xo-i18n/.batches/1-nav.json && (cd ui && pnpm exec vitest run src/i18n/xo/parity.test.ts 2>&1 | tail -3)
```

Хүлээгдэх: `0`; `xo:i18n merge: нэгтгэсэн=N алгассан=0`; `Tests  2 passed (2)`. `алгассан` 0-ээс их бол батчид хоосон утга үлдсэн — бөглөөд дахин merge.

```bash
cd ~/dev/paperclip-mn && git add ui/src/i18n/xo/mn.json ui/src/i18n/xo/keep-en.json && git commit -q -m "feat(xo): translate T1 batch 1 (navigation)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" && git log --oneline -1
```

Хүлээгдэх: `<sha> feat(xo): translate T1 batch 1 (navigation)`.

- [ ] **Step 7: Батч 2 — эхний тохиргоо (onboarding)**

Glossary-ийн заавал мөрүүд энд: `Start Onboarding` → «Тохиргоог эхлүүлэх», `Build a new organization` → «Шинэ байгууллага үүсгэх», `Add Agent` → «Агент нэмэх», `New Organization` → «Шинэ байгууллага», `Let's get started...` → «За, эхэлцгээе...».

```bash
cd ~/dev/paperclip-mn && pnpm -s xo:i18n:todo ui/src/components/Onboarding ui/src/components/onboarding/ > scripts/xo-i18n/.batches/2-onboarding.json && grep -c '": ""' scripts/xo-i18n/.batches/2-onboarding.json
```

Бөглөсний дараа:

```bash
cd ~/dev/paperclip-mn && grep -c '": ""' scripts/xo-i18n/.batches/2-onboarding.json; pnpm xo:i18n:merge scripts/xo-i18n/.batches/2-onboarding.json && (cd ui && pnpm exec vitest run src/i18n/xo/parity.test.ts 2>&1 | tail -3) && grep -n '"Start Onboarding"' ui/src/i18n/xo/mn.json
```

Хүлээгдэх: `0`; `нэгтгэсэн=N алгассан=0`; `Tests  2 passed (2)`; `<мөр>:  "Start Onboarding": "Тохиргоог эхлүүлэх",`.

```bash
cd ~/dev/paperclip-mn && git add ui/src/i18n/xo/mn.json ui/src/i18n/xo/keep-en.json && git commit -q -m "feat(xo): translate T1 batch 2 (onboarding)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" && git log --oneline -1
```

Хүлээгдэх: `<sha> feat(xo): translate T1 batch 2 (onboarding)`.

- [ ] **Step 8: Батч 3 — хянах самбар, ирсэн, хайлт, нэвтрэлт, компаниуд**

```bash
cd ~/dev/paperclip-mn && pnpm -s xo:i18n:todo ui/src/pages/Dashboard ui/src/pages/Inbox ui/src/pages/Search ui/src/pages/WhatNeedsMe ui/src/pages/Auth ui/src/pages/Companies > scripts/xo-i18n/.batches/3-home.json && grep -c '": ""' scripts/xo-i18n/.batches/3-home.json
```

Бөглөсний дараа:

```bash
cd ~/dev/paperclip-mn && grep -c '": ""' scripts/xo-i18n/.batches/3-home.json; pnpm xo:i18n:merge scripts/xo-i18n/.batches/3-home.json && (cd ui && pnpm exec vitest run src/i18n/xo/parity.test.ts 2>&1 | tail -3)
```

Хүлээгдэх: `0`; `нэгтгэсэн=N алгассан=0`; `Tests  2 passed (2)`.

```bash
cd ~/dev/paperclip-mn && git add ui/src/i18n/xo/mn.json ui/src/i18n/xo/keep-en.json && git commit -q -m "feat(xo): translate T1 batch 3 (dashboard, inbox, search, auth)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" && git log --oneline -1
```

Хүлээгдэх: `<sha> feat(xo): translate T1 batch 3 (dashboard, inbox, search, auth)`.

- [ ] **Step 9: Батч 4 — даалгавар, төсөл, зорилго**

```bash
cd ~/dev/paperclip-mn && pnpm -s xo:i18n:todo ui/src/pages/Issue ui/src/pages/Project ui/src/pages/Goal > scripts/xo-i18n/.batches/4-work.json && grep -c '": ""' scripts/xo-i18n/.batches/4-work.json
```

Бөглөсний дараа:

```bash
cd ~/dev/paperclip-mn && grep -c '": ""' scripts/xo-i18n/.batches/4-work.json; pnpm xo:i18n:merge scripts/xo-i18n/.batches/4-work.json && (cd ui && pnpm exec vitest run src/i18n/xo/parity.test.ts 2>&1 | tail -3)
```

Хүлээгдэх: `0`; `нэгтгэсэн=N алгассан=0`; `Tests  2 passed (2)`.

```bash
cd ~/dev/paperclip-mn && git add ui/src/i18n/xo/mn.json ui/src/i18n/xo/keep-en.json && git commit -q -m "feat(xo): translate T1 batch 4 (issues, projects, goals)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" && git log --oneline -1
```

Хүлээгдэх: `<sha> feat(xo): translate T1 batch 4 (issues, projects, goals)`.

- [ ] **Step 10: Батч 5 — агент, зөвшөөрөл**

```bash
cd ~/dev/paperclip-mn && pnpm -s xo:i18n:todo ui/src/pages/Agent ui/src/pages/Approval ui/src/components/Approval > scripts/xo-i18n/.batches/5-agents.json && grep -c '": ""' scripts/xo-i18n/.batches/5-agents.json
```

Бөглөсний дараа:

```bash
cd ~/dev/paperclip-mn && grep -c '": ""' scripts/xo-i18n/.batches/5-agents.json; pnpm xo:i18n:merge scripts/xo-i18n/.batches/5-agents.json && (cd ui && pnpm exec vitest run src/i18n/xo/parity.test.ts 2>&1 | tail -3)
```

Хүлээгдэх: `0`; `нэгтгэсэн=N алгассан=0`; `Tests  2 passed (2)`.

```bash
cd ~/dev/paperclip-mn && git add ui/src/i18n/xo/mn.json ui/src/i18n/xo/keep-en.json && git commit -q -m "feat(xo): translate T1 batch 5 (agents, approvals)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" && git log --oneline -1
```

Хүлээгдэх: `<sha> feat(xo): translate T1 batch 5 (agents, approvals)`.

- [ ] **Step 11: Батч 6 — зардал, компанийн ба инстансын тохиргоо, профайл**

```bash
cd ~/dev/paperclip-mn && pnpm -s xo:i18n:todo ui/src/pages/Costs ui/src/pages/Company ui/src/pages/Instance ui/src/pages/ProfileSettings > scripts/xo-i18n/.batches/6-settings.json && grep -c '": ""' scripts/xo-i18n/.batches/6-settings.json
```

Бөглөсний дараа:

```bash
cd ~/dev/paperclip-mn && grep -c '": ""' scripts/xo-i18n/.batches/6-settings.json; pnpm xo:i18n:merge scripts/xo-i18n/.batches/6-settings.json && (cd ui && pnpm exec vitest run src/i18n/xo/parity.test.ts 2>&1 | tail -3)
```

Хүлээгдэх: `0`; `нэгтгэсэн=N алгассан=0`; `Tests  2 passed (2)`.

```bash
cd ~/dev/paperclip-mn && git add ui/src/i18n/xo/mn.json ui/src/i18n/xo/keep-en.json && git commit -q -m "feat(xo): translate T1 batch 6 (costs, settings)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" && git log --oneline -1
```

Хүлээгдэх: `<sha> feat(xo): translate T1 batch 6 (costs, settings)`.

- [ ] **Step 12: Батч 7 — UI primitives, хоосон төлөв, toast, туслах `.ts` файлууд**

Энэ батчид Step 5-ын `.ts` файлуудын түлхүүр (`ui/src/lib/`, `ui/src/hooks/`) орно.

```bash
cd ~/dev/paperclip-mn && pnpm -s xo:i18n:todo ui/src/components/ui/ ui/src/components/EmptyState ui/src/components/ToastViewport ui/src/lib/ ui/src/hooks/ > scripts/xo-i18n/.batches/7-primitives.json && grep -c '": ""' scripts/xo-i18n/.batches/7-primitives.json
```

Бөглөсний дараа:

```bash
cd ~/dev/paperclip-mn && grep -c '": ""' scripts/xo-i18n/.batches/7-primitives.json; pnpm xo:i18n:merge scripts/xo-i18n/.batches/7-primitives.json && (cd ui && pnpm exec vitest run src/i18n/xo/parity.test.ts 2>&1 | tail -3)
```

Хүлээгдэх: `0`; `нэгтгэсэн=N алгассан=0`; `Tests  2 passed (2)`.

```bash
cd ~/dev/paperclip-mn && git add ui/src/i18n/xo/mn.json ui/src/i18n/xo/keep-en.json && git commit -q -m "feat(xo): translate T1 batch 7 (primitives, helpers)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" && git log --oneline -1
```

Хүлээгдэх: `<sha> feat(xo): translate T1 batch 7 (primitives, helpers)`.

- [ ] **Step 13: Бүрэн шалгалт — `check` OK**

```bash
cd ~/dev/paperclip-mn && pnpm xo:i18n:check && python3 -c "import json;k=json.load(open('ui/src/i18n/xo/keep-en.json'));print('keep-en', len(k), k[:10])"
```

Хүлээгдэх: `xo:i18n check: OK (keys=K2)` (`K2` = Step 5-ын тоо); `keep-en` жагсаалт богино (техникийн нэр, брэнд нэр л; «Save», «Cancel» зэрэг энгийн үг энд байвал буруу — буцаад орчуулна). `FAIL` бол stderr-ийн мөр бүрийг (`орчуулаагүй:` → тухайн батчид нэмж merge; `гараар:` → Step 4) шийдээд дахин ажиллуулна.

- [ ] **Step 14: Build, dev server дахин эхлүүлэх, маршрут бүрийн латин үлдэгдлийн шалгалт**

Build ба dev server (Task 10 Step 6-тай ижил: `preview_list` → идэвхтэй `paperclip-mn`-ийг `preview_stop` → `preview_start` нэр `"paperclip-mn"`; `dev:once` ui bundle-ийг Task 10-ийн plugin-тэй дахин барина):

```bash
cd ~/dev/paperclip-mn && pnpm --filter @paperclipai/ui build 2>&1 | tail -2 && grep -l "Тохиргоог эхлүүлэх" ui/dist/assets/*.js | head -1
```

Хүлээгдэх: `✓ built in …`; нэг `ui/dist/assets/index-<hash>.js` зам (onboarding-ийн орчуулга bundle-д орсон).

Browser-ээр (built-in browser, `navigate` → `javascript_tool`; screenshot биш) 11 маршрут бүрд дараах скриптийг ажиллуулна. Эхлээд `http://localhost:3100/` нээхэд одоогийн компанийн хянах самбар руу шилжинэ; `location.pathname.split("/")[1]` = компанийн угтвар (`<prefix>`). Маршрутууд: `/<prefix>/dashboard`, `/<prefix>/issues`, `/<prefix>/agents`, `/<prefix>/projects`, `/<prefix>/goals`, `/<prefix>/inbox`, `/<prefix>/approvals`, `/<prefix>/costs`, `/<prefix>/search`, `/<prefix>/company/settings`, `/onboarding`.

```js
(() => {
  const allow = new Set(["XO", "API", "Claude", "Codex", "OpenAI", "Anthropic", "GitHub", "Heartbeat", "heartbeat", "URL", "JSON", "Tailscale", "Slack", "Discord", "Telegram", "Cursor", "Gemini", "OpenCode", "Ollama"]);
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const hits = new Set();
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const el = node.parentElement;
    if (!el || ["SCRIPT", "STYLE", "CODE", "PRE", "KBD"].includes(el.tagName)) continue;
    const style = getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") continue;
    for (const word of node.textContent.match(/[A-Za-z]{4,}/g) ?? []) {
      if (!allow.has(word)) hits.add(word);
    }
  }
  return [...hits].sort().join(", ");
})();
```

Хүлээгдэх: маршрут бүрд хоосон мөр, эсвэл зөвхөн хэрэглэгчийн өгөгдөл (компани, агент, даалгаврын нэр — ED-ийн демо өгөгдөл англи байж болно). Бусад үг = үлдэгдэл; шалтгаан гурвын нэг:

- түлхүүр `mn.json`-д англиар үлдсэн → `keep-en.json`-оос хас, орчуулаад `merge`;
- мөр T1 файлд байгаа ч codemod-ийн allowlist-д ороогүй атрибут (`DEFAULT_ATTR_ALLOWLIST`) — тухайн файлд тодорхой `tx()` (Step 4-ийн хэв маяг);
- мөр T1-д ороогүй файлаас (T2 компонент энэ хуудсанд рендерлэгдсэн) → `docs/xo/screenshot-review.md`-д «T2» гэж тэмдэглэнэ, Ү6-д орчуулна; T1 файлд нэмэхгүй.

Засвар бүрийн дараа: `pnpm xo:i18n:extract && pnpm xo:i18n:check` OK, `pnpm --filter @paperclipai/ui build`, dev server дахин эхлүүлж тухайн маршрутыг дахин шалгана. Console алдаа: `read_console_messages` (`onlyErrors: true`) маршрут бүрд хоосон.

Эцэст нь Ө/Ү/Ё-ийн харагдах байдалд **нэг** screenshot (`scale: 0.5`) — Task 2-ын фонт шалгалтын давхар баталгаа.

- [ ] **Step 15: `docs/xo/screenshot-review.md` ба commit**

Файлыг үүсгэнэ (тоонуудыг Step 3, 5, 13-ын бодит гаралтаас; маршрут бүрд нэг мөр):

```markdown
# T1 орчуулгын хяналт (Ү2, <огноо>)

Extract: files=101 keys=<K2> (Step 3-т <K>, гараар нэмсэн <K2−K>). check: OK. keep-en: <тоо> түлхүүр.

| Маршрут | Латин үлдэгдэл (эхний шалгалт) | Засвар | T2-д үлдээсэн | Ажиглалт |
|---|---|---|---|---|
| /dashboard | … | … | … | … |
| /issues | … | … | … | … |
| /agents | … | … | … | … |
| /projects | … | … | … | … |
| /goals | … | … | … | … |
| /inbox | … | … | … | … |
| /approvals | … | … | … | … |
| /costs | … | … | … | … |
| /search | … | … | … | … |
| /company/settings | … | … | … | … |
| /onboarding | … | … | … | … |

Console алдаа: байхгүй (11 маршрут). Ө/Ү/Ё: зөв (screenshot, Inter).

## Ү6-д (T2) үлдээсэн мөрүүд

- <файл>: <мөр> — <аль маршрутад харагдсан>
```

Хүснэгтийн `…` бүрийг бодит утгаар (үлдэгдэлгүй бол «байхгүй») бөглөнө.

Дараа нь `docs/xo/SYNC.md`-ийн «Ү2-д нэмэгдсэн файлууд» хэсгийг Task 11-д `tx()`/`XoTrans` нэмсэн upstream файлуудын жагсаалтаар солино (толь бичгийн commit-оос хойш өөрчлөгдсөн `ui/src` файлууд; XO-ийн өөрийн `ui/src/xo/`, `ui/src/i18n/xo/` хасагдана):

```bash
cd ~/dev/paperclip-mn && git diff --name-only "$(git log --format=%H --grep='docs(xo): add translation glossary' -1)"..HEAD -- ui/src ':!ui/src/i18n/xo' ':!ui/src/xo' | sed 's/^/- `/; s/$/`/'
```

Хүлээгдэх: 8 `.ts` туслах файл ба Step 4-т гараар засварласан `.tsx` файлууд, мөр бүр `- \`ui/src/...\`` хэлбэрээр; энэ гаралтыг тухайн хэсэгт буулгана (Step 4-т файл засаагүй бол яг 8 мөр).

```bash
cd ~/dev/paperclip-mn && git add docs/xo/screenshot-review.md docs/xo/SYNC.md ui/src ui/src/i18n/xo && git commit -q -m "docs(xo): T1 screenshot review

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" && git log --oneline -1 && git status --short | wc -l
```

Хүлээгдэх: `<sha> docs(xo): T1 screenshot review`; `0` (ажлын хавтас цэвэр; `.batches/`, `.emit/`, `status.json` gitignore-д). Step 14-ийн засварууд (`tx()` нэмсэн файл, `mn.json`) энэ commit-д хамт орно.

---

### Task 12: e2e — `xo-mn.spec.ts`, `xo-screenshots.spec.ts`, Ү2 хаалт

**Files:**
- Create: `tests/e2e/xo-mn.spec.ts`
- Create: `tests/e2e/xo-screenshots.spec.ts`
- Modify: `docs/xo/y0-report.md` (`## Ү2 хаалт` хэсэг нэмнэ)

**Interfaces:**
- Consumes: Task 10-ийн `tests/e2e/playwright.config.ts` (`PORT = PAPERCLIP_E2E_PORT ?? 3199`, `baseURL http://127.0.0.1:<PORT>`, бүх spec-д `storageState` → `xo.locale=en`, `testDir "."`, `testMatch "**/*.spec.ts"`, `outputDir "./test-results"`, webServer `pnpm paperclipai onboard --yes --run`); Task 5-ын `XO_LOCALE_STORAGE_KEY = "xo.locale"`, `applyDocumentLang` (`<html lang="mn">`); Task 3-ын `BRAND.name = "XO"` (`buildDocumentTitle` → `"… • XO"`); Task 9/11-ийн орчуулга: Search → Хайх, Projects → Төслүүд, Goals → Зорилгууд (Sidebar-ын хоёр хувилбарт хоёуланд нь байдаг түлхүүрүүд; `Agents` зөвхөн streamlined хувилбарт тул e2e-д ашиглахгүй); upstream-ийн бусад spec-ийн `request.post("/api/companies", { data: { name } })` → `{ id, issuePrefix, … }` хэв маяг.
- Produces: `pnpm test:e2e` дотор монгол UI-г байнга шалгадаг 2 тест; `XO_SCREENSHOTS=1` үед 11 маршрутын PNG (`tests/e2e/test-results/xo-screenshots/`, gitignore-д `test-results/`).

- [ ] **Step 1: `tests/e2e/xo-mn.spec.ts`**

```ts
import { test, expect } from "@playwright/test";

// Task 10-д playwright.config.ts бүх spec-ийг xo.locale=en болгосон; энэ файл л Монгол UI дээр ажиллана.
const ORIGIN = `http://127.0.0.1:${process.env.PAPERCLIP_E2E_PORT ?? "3199"}`;

test.use({
  storageState: {
    cookies: [],
    origins: [{ origin: ORIGIN, localStorage: [{ name: "xo.locale", value: "mn" }] }],
  },
});

test("onboarding renders in Mongolian", async ({ page }) => {
  await page.goto("/onboarding");
  await expect(page.locator("body")).toContainText(/[Ѐ-ӿ]/, { timeout: 15_000 });
  expect(await page.evaluate(() => document.documentElement.lang)).toBe("mn");
});

test("sidebar labels and document title are Mongolian", async ({ page }) => {
  const res = await page.request.post("/api/companies", { data: { name: `XO Test Co ${Date.now()}` } });
  expect(res.ok(), `create company failed ${res.status()}: ${await res.text()}`).toBe(true);
  const company = (await res.json()) as { issuePrefix: string };

  await page.goto(`/${company.issuePrefix}/dashboard`);
  await expect(page).toHaveTitle(/XO$/);
  await expect(page.locator('a[href$="/search"]').first()).toContainText("Хайх");
  await expect(page.locator('a[href$="/projects"]').first()).toContainText("Төслүүд");
  await expect(page.locator('a[href$="/goals"]').first()).toContainText("Зорилгууд");
});
```

Тайлбар: `storageState`-ийн `origin` нь config-ийн `baseURL`-тэй яг ижил байх ёстой (`127.0.0.1`, `localhost` биш) — эс бөгөөс localStorage тавигдахгүй, UI англиар гарч тест улаан болно. Кирилл regex `[Ѐ-ӿ]` — «XO» lockup латин тул `body`-г бүхэлд нь шалгана.

- [ ] **Step 2: Ажиллуулж ногоон болгох**

```bash
cd ~/dev/paperclip-mn && pnpm test:e2e xo-mn 2>&1 | tail -6
```

Хүлээгдэх (сүүлийн мөрүүдэд): `2 passed`. Улаан бол: `lang` `"en"` → `origin` буруу (дээрх тайлбар); `Хайх` олдохгүй → `mn.json`-д `Search` орчуулга алга (Task 9) эсвэл `XO_TRANSFORM_FILES`-д Sidebar байхгүй; `toHaveTitle` → Task 3-ын `BreadcrumbContext.tsx:70` `BRAND.name` болоогүй.

- [ ] **Step 3: `tests/e2e/xo-screenshots.spec.ts` (сонголттой, `XO_SCREENSHOTS=1`)**

```ts
import { test, expect } from "@playwright/test";

const ORIGIN = `http://127.0.0.1:${process.env.PAPERCLIP_E2E_PORT ?? "3199"}`;
const ROUTES = ["dashboard", "issues", "agents", "projects", "goals", "inbox", "approvals", "costs", "search", "company/settings"];
const OUT_DIR = "tests/e2e/test-results/xo-screenshots";

test.describe("XO screenshots", () => {
  test.skip(!process.env.XO_SCREENSHOTS, "XO_SCREENSHOTS=1 үед л ажиллана (docs/xo/screenshot-review.md-д зориулсан)");
  test.use({
    viewport: { width: 1280, height: 800 },
    storageState: {
      cookies: [],
      origins: [{ origin: ORIGIN, localStorage: [{ name: "xo.locale", value: "mn" }] }],
    },
  });

  test("captures T1 routes in Mongolian", async ({ page }) => {
    test.setTimeout(120_000);
    const res = await page.request.post("/api/companies", { data: { name: `XO Screens ${Date.now()}` } });
    expect(res.ok(), `create company failed ${res.status()}: ${await res.text()}`).toBe(true);
    const company = (await res.json()) as { issuePrefix: string };

    // networkidle хэрэглэхгүй: апп SSE/websocket холболт барьдаг тул хэзээ ч idle болохгүй.
    await page.goto("/onboarding");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${OUT_DIR}/onboarding.png`, fullPage: true });

    for (const route of ROUTES) {
      await page.goto(`/${company.issuePrefix}/${route}`);
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(1500);
      await page.screenshot({ path: `${OUT_DIR}/${route.replace("/", "-")}.png`, fullPage: true });
    }
  });
});
```

`page.screenshot` замын хавтсыг өөрөө үүсгэнэ; зам `pnpm test:e2e`-ийн ажлын хавтас (repo root)-оос харьцангуй.

```bash
cd ~/dev/paperclip-mn && XO_SCREENSHOTS=1 pnpm test:e2e xo-screenshots 2>&1 | tail -4 && ls tests/e2e/test-results/xo-screenshots
```

Хүлээгдэх: `1 passed`; 11 файл: `agents.png approvals.png company-settings.png costs.png dashboard.png goals.png inbox.png issues.png onboarding.png projects.png search.png`. Эдгээрийг ED-д (SendUserFile) харуулна — Task 11 Step 15-ын хүснэгтийн нүдээр нүдээр баталгаа; git-д орохгүй.

`XO_SCREENSHOTS` тавиагүй үед:

```bash
cd ~/dev/paperclip-mn && pnpm test:e2e xo-screenshots 2>&1 | tail -3
```

Хүлээгдэх: `1 skipped`.

- [ ] **Step 4: Ү2 хаалт — check OK, build, бүх e2e ногоон**

```bash
cd ~/dev/paperclip-mn && pnpm xo:i18n:check && (pnpm build > "$TMPDIR/xo-build.log" 2>&1 && echo BUILD_OK || (tail -20 "$TMPDIR/xo-build.log"; echo BUILD_FAIL)) && (pnpm test:e2e > "$TMPDIR/xo-e2e.log" 2>&1 && echo E2E_OK || (tail -40 "$TMPDIR/xo-e2e.log"; echo E2E_FAIL)); grep -E '^\s+[0-9]+ (passed|failed|skipped)' "$TMPDIR/xo-e2e.log"
```

Хүлээгдэх:

```
xo:i18n check: OK (keys=K2)
BUILD_OK
E2E_OK
  1 skipped
  N passed (…)
```

`N` = Task 10 Step 8-ын тоо + 2 (`xo-mn`). `failed` мөр байхгүй. Upstream-ийн spec улаан болбол Task 10-ийн `storageState` (`xo.locale=en`) тухайн spec-д хүрээгүй (`test.use({ storageState })`-аар өөрөө дарж бичсэн spec) — тэр spec-ийн `storageState`-д `xo.locale=en` мөрийг нэмнэ, орчуулгыг буцаахгүй.

- [ ] **Step 5: `docs/xo/y0-report.md`-д Ү2 хаалтын тэмдэглэл, commit**

```bash
cd ~/dev/paperclip-mn && cat >> docs/xo/y0-report.md <<EOF

## Ү2 хаалт

- Огноо: $(date +%F)
- T1: 101 .tsx + 8 .ts файл, xo:i18n check OK (keys=<K2>), keep-en <тоо>.
- Гараар шийдсэн тохиолдол: <M> (Task 11 Step 4). T2-д үлдээсэн мөр: docs/xo/screenshot-review.md.
- Тест: ui vitest ногоон; pnpm build OK; pnpm test:e2e <N> passed, 1 skipped (xo-screenshots).
- Дараагийн: Ү3 (server мессеж, агентын хэл, telemetry) — тусдаа төлөвлөгөө.
EOF
sed -i '' -e "s/<K2>/$(python3 -c "import json;print(len(json.load(open('ui/src/i18n/xo/en.json'))))")/" -e "s/<тоо>/$(python3 -c "import json;print(len(json.load(open('ui/src/i18n/xo/keep-en.json'))))")/" docs/xo/y0-report.md && tail -8 docs/xo/y0-report.md
```

`<M>` ба `<N>`-ийг Step 4 ба Task 11 Step 4-ийн бодит тоогоор гараар солино (`sed`-ээр тоолох боломжгүй).

```bash
cd ~/dev/paperclip-mn && grep -c '<K2>\|<тоо>\|<M>\|<N>' docs/xo/y0-report.md; git add tests/e2e/xo-mn.spec.ts tests/e2e/xo-screenshots.spec.ts docs/xo/y0-report.md && git commit -q -m "test(xo): add Mongolian UI e2e coverage

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>" && git log --oneline -1 && git status --short | wc -l
```

Хүлээгдэх: `0` (нөхөөгүй `<…>` үлдээгүй), `<sha> test(xo): add Mongolian UI e2e coverage`, `0`.

**Ү2 хаалтын шалгуур (spec §17):** `pnpm xo:i18n:check` OK; `pnpm build` OK; `pnpm test:e2e` бүгд ногоон (`xo-mn` 2 тест орсон); `docs/xo/screenshot-review.md`-ийн 11 маршрутад латин үлдэгдэл «байхгүй» эсвэл «T2» гэж тэмдэглэгдсэн; ED `XO_SCREENSHOTS=1`-ийн 11 PNG-г үзэж зөвшөөрсөн. Үүний дараа Ү3-ын дэлгэрэнгүй төлөвлөгөө (доорх тойм) бичигдэнэ.

---

## Ү3 — Гүнзгийрүүлэлт: server мессеж (L2), агентын хэл (L3), telemetry

Ү3–Ү6-г Ү2 хаалт хаагдсаны дараа тус бүрд нь тусдаа дэлгэрэнгүй төлөвлөгөөгөөр (superpowers:writing-plans, шинэ файл `docs/superpowers/plans/2026-MM-DD-xo-y3-*.md` гэх мэт) гүйцэтгэнэ. Энд хүрээ, хөндөх файл, хаалтын шалгуурыг л тогтооно — Ү2-ын бодит үр дүн (түлхүүрийн тоо, toast-ын хэв маяг, upstream-ийн дараагийн tag) эдгээрийн задаргааг өөрчилж болно.

### Ү3.1 L2 — server мессежийн толь (spec §11)

- **Хүрээ:** T1 урсгалд гардаг server-ийн `error`/`message` литералууд. Spec §11-ийн тоолол: routes-д `error` 464, `message` 34; services-д `error` 85, `message` 116; UI `error.message`-ийг 480 газар шууд харуулдаг, `pushToast` 557 удаа дуудагддаг. Бүгдийг биш — T1 урсгалын (нэвтрэх, байгууллага, даалгавар, агент, зөвшөөрөл, төсөв) 40–60 түгээмэл мессежийг л.
- **Файл (шинэ, fork-ийн хавтсанд):** `scripts/xo-i18n/extract-server.ts` — `server/src/routes/**`, `server/src/services/**`-ээс `{ error: "…" }`, `message: "…"` литералыг Task 8-ийн Babel суурьтай AST-аар түүж `ui/src/i18n/xo/server-en.json` (түлхүүр = англи мессеж) ба `server-mn.json` үүсгэнэ; Task 9-ийн CLI-д `extract --server`, `check --server` горим нэмнэ. `ui/src/xo/serverMessage.ts` — `translateServerMessage(message: string): string`: эхлээд яг таарах түлхүүр, дараа нь `{{n}}`/`{{name}}` загвартай мөрийг regex-ээр тааруулна, олдохгүй бол эх мессежээ буцаана. UI-д залгах цэг: API клиентийн алдаа үүсгэдэг нэг функц (Ү3 төлөвлөгөөнд `ui/src/api/` дотроос grep-ээр тогтооно) ба `pushToast`-ын error салбар — 480 газрыг тус тусад нь хөндөхгүй.
- **Хөндөхгүй:** server код (S-set-д server файл нэмэхгүй; Ү3.3-ын `config.ts` 1 мөр л). Server англиар үлдэж, UI орчуулна — upstream sync-д зөрчилгүй.
- **Хаалт:** Ү3 төлөвлөгөөнд жагсаасан T1 мессежүүд toast/inline алдаанд монголоор гарна (browser-ээр 5 сценари: буруу нууц үг, давхардсан байгууллагын нэр, төсөв хэтэрсэн, зөвшөөрөл татгалзсан, адаптер олдоогүй); `server-mn.json` parity тест ногоон; `pnpm xo:i18n:check --server` OK.

### Ү3.2 L3 — агентын харилцааны хэл (spec §12)

- **Санаа:** instance-ийн тохиргоо `interactionLanguage: "mn" | "en"` (анхдагч `"mn"`). Агент heartbeat бүрд adapter-ийн prompt-д "Хэрэглэгчтэй монголоор харилц; код, командын нэр, техникийн нэр томьёог англиар үлдээ" гэсэн нэг мөр нэмэгдэнэ. Codex/Claude Code хоёулаа монголоор хариулж чадна; чанарыг Ү3-т ED-тэй хамт 3 даалгавраар шалгана.
- **Механизм:** upstream-д аль хэдийн байгаа "Simplified English Interactions" туршилтын тохиргооны замыг **яг давтана**: `packages/shared/src/types/instance.ts` + `validators/instance.ts` + `feature-catalog.ts` → `server/src/services/instance-settings.ts` → `server/src/services/heartbeat.ts` (prompt-д нэмэгдэх мөр энд) → UI `ui/src/pages/InstanceExperimentalSettings.tsx` toggle; тестүүд `server/src/__tests__/instance-settings-service.test.ts`, `ui/src/pages/InstanceExperimentalSettings.test.tsx`. (2026-09-30-нд `grep -rl simplifiedEnglish packages/shared/src server/src ui/src` яг эдгээр 8 файлыг өгсөн.)
- **S-set өргөжнө:** энэ бол upstream-ийн `packages/shared`, `server/src`, adapter файлуудыг хөндөх анхны XO өөрчлөлт (spec §18). Ү3 төлөвлөгөө S-set-ийн нэмэлт файлуудыг `docs/xo/SYNC.md`-д нэмэх алхамтай байна; өөрчлөлт бүр 1–5 мөр, upstream-ийн хэв маягаар (нэмэлт талбар, нэмэлт `if`), давхар абстракцгүй.
- **Зардал:** heartbeat ажиллуулах бүрд ED байлцаж зөвшөөрнө (ED-ийн Claude/Codex нэвтрэлт, токен). Автомат heartbeat интервалыг туршилтын үед унтраана.
- **Хаалт:** toggle `mn` үед adapter prompt-д мөр орж байгааг server unit тест (heartbeat context → prompt string) батална; ED-тэй хамт 1 агент, 3 даалгавар — хариу монголоор, код англиар.

### Ү3.3 Telemetry анхдагчаар унтраалттай (spec §13)

- `server/src/config.ts:368` — `telemetryEnabled: fileConfig?.telemetry?.enabled ?? true,` → `?? false,` (1 мөр; S-set-д аль хэдийн орсон).
- Шинэ тест `server/src/config.telemetry.test.ts`: (1) файл тохиргоо байхгүй → `false`; (2) `telemetry.enabled: true` тодорхой заавал → `true` (upstream-ийн опт-ин хэвээр ажиллана).
- Commit: `feat(xo): disable telemetry by default`.

**Ү3 хаалт:** Ү3.1 + Ү3.2 + Ү3.3 тестүүд ногоон; `pnpm build && pnpm test:e2e` ногоон; `docs/xo/y0-report.md`-д `## Ү3 хаалт`.

---

## Ү4 — XO вэбсайт (spec §14)

- **Repo:** `~/dev/xo-site` (тусдаа git repo, Paperclip кодтой холбоогүй). Үүсгэх: `npm create astro@latest xo-site -- --template minimal --typescript strict --no-install --no-git`, дараа нь `git init`, Astro 5, Tailwind v4 (`@tailwindcss/vite`), Inter фонт (ui-тэй ижил `InterVariable.woff2`, Task 2-ын Ө/Ү шалгалт хэвээр хүчинтэй).
- **Агуулга — хуулбар биш, өөрийн бичвэр:** paperclip.ing-ийн бүтцийг (нүүр → бүтээгдэхүүн → хэрэглээ → эхлэх) лавлана, текст, зураг, брэндийг **авахгүй** (spec §14, §16). Бүх copy монголоор, stop-slop дүрмээр шүүнэ. `site.config.ts`: нэр "XO", tagline, холбоо барих имэйл, пилотын формын URL.
- **Хуудас (6):** `/` нүүр; `/buteegdekhuun` бүтээгдэхүүн (агентын байгууллага, зөвшөөрөл, төсөв, Claude Code + Codex); `/khereglee` хэрэглээний 3 жишээ (ateamgpt-ийн бодит кейс, ED өгнө); `/pilot` пилот хөтөлбөр + Tally форм (embed, ED-ийн Tally бүртгэл); `/ekhlekh` эхлэх заавар (Tailscale урилгаар — өөрөө суулгах биш); `/tukhai` бидний тухай (ateamgpt). Нэмэлт: OG зураг, `sitemap`, `robots.txt`, 404.
- **Deploy:** Vercel (ED-ийн бүртгэл, `vercel link` ED өөрөө), preview → production. DNS: `xo.ateamgpt.com` CNAME → Vercel (ED өөрөө оруулна). Claude Vercel/DNS-д нэвтрэхгүй, бүртгэл үүсгэхгүй.
- **Тест:** `astro check` + `astro build` ногоон; Lighthouse mobile Performance ≥ 90, Accessibility ≥ 90 (built-in browser-ийн `navigate` + Chrome DevTools биш, `npx lighthouse --preset=mobile` CLI); 6 хуудсанд Task 11 Step 9-ийн Latin-leak скрипт; 375px өргөнд хэвтээ гүйлтгүй.
- **Хаалт:** `https://xo.ateamgpt.com` 6 хуудас, Lighthouse ≥ 90, форм ED-ийн Tally-д ирнэ (ED туршина).

---

## Ү5 — Пилот deploy D1 (spec §15)

- **Урьдчилсан нөхцөл (ED-ийн Mac):** диск ≥ 20 GB чөлөөтэй; унтахгүй (`pmset -c sleep 0 disksleep 0`); nvm default 24; Tailscale суулгаж нэвтэрсэн (ED); GitHub-д fork push (ED зөвшөөрнө — нийтийн repo-гийн fork-ийг private болгож болдоггүй тул spec §15-ын А (нийтийн fork, нууц юу ч агуулахгүй) эсвэл Б (шинэ private repo руу `git push --mirror`) замын аль нэгийг ED сонгоно).
- **Release:** `git tag xo-v2026.10.<dd>` → `paperclipai install --repo <owner>/paperclip-mn --ref xo-v2026.10.<dd>` (эсвэл локал замаас) → `paperclipai onboard --bind tailnet --install-service` → тусдаа instance `~/.paperclip/instances/xo-pilot/` (demo `default`-оос тусад нь). Auth: `authenticated` + `private`. `tailscale serve --bg --https=443 http://127.0.0.1:3100`. ED эхний бүртгэлээр admin болно, дараа нь `PAPERCLIP_AUTH_DISABLE_SIGN_UP=1` — бусад хэрэглэгч зөвхөн урилгаар.
- **Харилцагч бүрд:** тусдаа company + урилга; API түлхүүрийг **ED өөрөө** UI-д оруулна; төсөв 20–50 USD, 80%/100% дохио; агентын адаптер claude_local/codex_local (ED-ийн Mac дээрх нэвтрэлт — харилцагч бүрийн зардал ED-ийн төсөвт харагдана, spec §15 эрсдэл).
- **Нөөцлөлт:** цаг тутам DB нөөц + өдөр бүр instance хавтасны бүтэн хуулбар (`master.key` орно) шифрлэгдсэн гадаад диск/iCloud-оос гадуурх байршилд; сар бүр restore drill (шинэ instance ID-д сэргээж нэвтэрч үзнэ). Эрүүл мэнд: launchd 5 минут тутам `curl /api/health`, унавал ED-д мэдэгдэл (macOS notification эсвэл Telegram — ED сонгоно).
- **Тусгаарлалтын заавал тест:** харилцагч А-гийн гишүүн Б байгууллагын даалгавар, агент, зардлыг API (`/api/companies/<B>/...` → 403/404) ба UI-аар харж чадахгүй; ED-ийн admin бүх компанийг хардаг. Тест бүр `docs/xo/pilot-checklist.md`-д огноотой.
- **Хаалт:** пилот харилцагч Tailscale-ээр нэвтэрч, өөрийн төсөвтэй 1 агентын даалгавар ажиллуулна (ED байлцана); restore drill 1 удаа амжилттай; тусгаарлалтын тест бүх мөр ногоон; `docs/xo/y0-report.md`-д `## Ү5 хаалт`.

---

## Ү6 — T2/T3 орчуулга ба тогтмол upstream sync (spec §5, §9, §18)

- **T2:** Task 11-ийн батчийн зан үйлээр (todo → орчуулга → merge → parity → commit) хэсэг хэсгээр: apps/connectors, routines, pipelines, workspaces, skills, activity/audit, artifacts, cases, decisions, timeline, status, conference room. Файл бүрийг `XO_TRANSFORM_FILES`-д нэмэхийн өмнө `pnpm xo:i18n:emit`-ээр хувиргалтыг нүдээр хянана. **T3** (advanced gateway/profiles, plugin хуудсууд, ховор тохиргоо) — пилот харилцагчийн хүсэлтээр л.
- **Сар бүрийн sync (Task 1-ийн `docs/xo/SYNC.md`):** upstream-ийн stable tag л (`git fetch upstream --tags`, `git merge v2026.M.N`); S-set-ийн зөрчлийг upstream талыг үндэс болгон гараар шийднэ; `pnpm xo:i18n:extract && pnpm xo:i18n:check` → шинэ/хоцрогдсон түлхүүрийг батчаар орчуулна; `pnpm --filter @paperclipai/ui typecheck`, ui тест, `pnpm build`, `pnpm test:e2e` ногоон → `xo-v<огноо>` tag → пилот instance шинэчлэх (`paperclipai update --ref`), нөөцлөлтийн дараа.
- **Upstream-д буцаах (сонголттой):** Task 4-ийн `ui/src/i18n/locales/mn.json` (upstream-ийн 3 түлхүүр) — upstream-ийн локал форматад яг нийцдэг тул PR болгож болно. Хэрэглэгчийн зөвшөөрлөөр л (нийтлэх үйлдэл); PR тайлбар "🤖 Generated with [Claude Code](https://claude.com/claude-code)" мөрөөр төгсөнө. `xo` namespace, брэнд, кодмод upstream-д явахгүй.
- **Хаалт:** T2 хүрээний `pnpm xo:i18n:check` OK; дараалсан 2 сарын sync тус бүр 1 ажлын өдрөөс бага хугацаанд хаагдсан; пилот харилцагч шинэчлэлтийн дараа ажиллаж байгаа.

---

## Энэ төлөвлөгөө батлагдсаны дараа

1. ED гүйцэтгэлийн горимоо сонгоно (subagent-driven эсвэл inline). Ямар ч горимд task бүрийн төгсгөлийн тест ногоон байж дараагийнх руу орно; Ү0 (Task 0) ба Ү1 хаалт (Task 10 Step 8) ED байлцахыг шаардана.
2. ED-ийн оролт (spec §19), хугацаагаар: Task 0 — Ү0 хаалт (байлцах); Task 11-ээс өмнө — `docs/xo/glossary.md` батлах; Ү3.2 — 3 даалгаврын туршилт (байлцах, токен); Ү4 — Tally, Vercel, DNS; Ү5 — GitHub owner/repo ба А/Б зам, Tailscale, API түлхүүр, нөөцлөлтийн байршил, мэдэгдлийн суваг.
3. Ү2 хаагдмагц Ү3-ын дэлгэрэнгүй төлөвлөгөөг энэ файлын Ү3 хэсгээс эхлэн бичнэ; тухайн үеийн upstream tag-ийг дахин тогтооно.
