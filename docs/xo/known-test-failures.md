# Мэдэгдэж буй тестийн алдаа (B1, B3)

Шалгасан огноо: 2026-10-22, салбар xo-main, macOS (Darwin 27), Node 24.16.0.
Энэ файл XO-ийн өөрчлөлтөөс үүдээгүй, засахгүйгээр үлдээсэн алдааг жагсаана.
Доорх файлуудын аль нэгийг ч ef898baf0..HEAD хооронд XO-ийн commit хөндөөгүй
(шалгасан: git log ef898baf0..HEAD -- <файл>).

## Тест хэрхэн ажиллуулах вэ

Тестийг заавал репогийн root-оос ажиллуулна. server/ эсвэл cli/ дотроос
ажиллуулбал paperclip-skill-utils.test.ts, paperclip-issue-update-helper.test.ts
зэрэг path.resolve("skills/...") ашигладаг тест cwd буруу тул худлаа унана.

```bash
# Сервер (CI-тэй адил, serial)
pnpm exec vitest run --exclude '**/dist/**' --project @paperclipai/server --no-file-parallelism --maxWorkers=1
# CLI
pnpm exec vitest run --exclude '**/dist/**' --project paperclipai
# Бүтэн ажиллагаа
pnpm test:run
```

## Үр дүн (2026-10-22)

| Suite | Нийт | Унасан | Шалтгаан |
|---|---|---|---|
| CLI (paperclipai) | 495 | 14 | бүгд A (macOS TMPDIR symlink) |
| Server | 15050 | 15 + 1 файл | A: 10, B: 3, C: 1, D: 1, E: 1 файл |

## A. macOS-ийн TMPDIR symlink (/var → /private/var)

macOS дээр os.tmpdir() нь /var/folders/... буцаадаг, энэ нь /private/var/folders/...
руу заасан symlink. Upstream код (packages/shared/src/worktree-seed-source.ts
ба бусад) замыг realpath-аар каноник болгодог, эсвэл "Registered source Paperclip
config must be a canonical path and cannot use a symlink alias" гэж татгалздаг.
Тест харин os.tmpdir()-ийн каноник бус замтай харьцуулдаг. Upstream CI Linux дээр
ажилладаг тул /tmp symlink биш, алдаа гардаггүй.

Нотолгоо: TMPDIR-ийг каноник замаар өгөхөд бүгд давна.

```bash
TMPDIR=$(python3 -c 'import os,tempfile;print(os.path.realpath(tempfile.gettempdir()))') \
  pnpm exec vitest run --exclude '**/dist/**' --project paperclipai cli/src/__tests__/worktree.test.ts
```

Хамаарах тест:

- cli/src/__tests__/worktree.test.ts: 14 тест ("uses the repo-local config for the current worktree", "ensure-seeded seeds once and fast-exits on the verified manifest", "managed ensure-seeded ..." 5 хувилбар, "reserves distinct ports for postgres-mode siblings under a custom worktree parent" гэх мэт).
- server/src/__tests__/company-skills.test.ts: "finds bounded skill roots under supported workspace paths", "includes explicitly selected skills from non-standard folders".
- server/src/__tests__/execution-workspace-runtime-control-conflict.test.ts: 4 тест (422-ийн оронд 200/500 хүлээдэг).
- server/src/__tests__/workspace-instance-cleanup.test.ts: "stops embedded Postgres before deleting the instance root".
- server/src/__tests__/workspace-runtime.test.ts: "records teardown and cleanup operations when a recorder is provided", "reuses a registered legacy worktree that already has the branch checked out".
- server/src/__tests__/worktree-seed-server-spawn.test.ts: "re-derives an ambient-instance manifest written before provisioning".

Яагаад засаагүй: алдаа орчноос үүдэлтэй, upstream кодын хүлээлт зөв. Тестийг
realpath(os.tmpdir()) болгож засах нь upstream-д явуулах PR-ын ажил, XO fork-д
хийвэл upstream sync бүрд зөрчил үүсгэнэ. Орон нутагт дээрх TMPDIR-ээр ажиллуул.

## B. Cursor-ийн remote sandbox тест: exit 127

- server/src/__tests__/cursor-local-execute.test.ts: "prefers ~/.local/bin/cursor-agent for remote sandbox execution when using the default command", "keeps explicit command overrides for remote sandbox execution".
- server/src/__tests__/cursor-local-adapter-environment.test.ts: "prefers ~/.local/bin/cursor-agent for remote sandbox probes when using the default command".

Шалтгаан (магадлалтай): тест хуурамч cursor-agent-ийг #!/usr/bin/env node
shebang-тай бичээд, хүүхэд процессыг хязгаарлагдмал env-тэй ажиллуулдаг. Энэ
машинд node зөвхөн nvm-ээр (~/.nvm/...) суусан, /usr/local/bin эсвэл
/opt/homebrew/bin-д байхгүй тул env node-ийг олохгүй, 127 буцаана. CI-д node
системийн PATH-д байдаг. Яагаад засаагүй: орчны асуудал. Системийн PATH-д node
нэмбэл давах ёстой (баталгаажуулаагүй).

```bash
pnpm exec vitest run --exclude '**/dist/**' --project @paperclipai/server server/src/__tests__/cursor-local-execute.test.ts server/src/__tests__/cursor-local-adapter-environment.test.ts
```

## C. macOS lsof Unicode файлын нэрийг escape хийдэг

- server/src/__tests__/file-delivery-bridges.test.ts: "registers native files with API tools disabled and returns durable download receipts".

server/src/services/native-runtime/native-runner-file-handoff.ts-ийн
openedFilePath() нь darwin дээр /usr/sbin/lsof -F0n-ээр fd-ийн замыг уншдаг. lsof
Unicode тэмдэгтийг (тестийн "猫 picture.png") \xe7\x8c\xab гэж escape хийж буцаадаг
тул дараагийн realpath ENOENT өгнө. Linux дээр /proc/self/fd ашигладаг тул CI-д
гардаггүй. Яагаад засаагүй: upstream-ийн macOS-д зориулсан production кодын алдаа,
энэ ажлын хүрээнд (зөвхөн тест/config) засах боломжгүй. TMPDIR засвар нөлөөлөхгүй.

```bash
pnpm exec vitest run --exclude '**/dist/**' --project @paperclipai/server server/src/__tests__/file-delivery-bridges.test.ts
```

## D. cargo суугаагүй

- server/src/services/native-runtime/native-codex-runner.integration.test.ts: "native Codex server vertical slice" (beforeAll-д spawnSync cargo ENOENT, тест skipped гэж тоологдоод файл унана).

Тест Rust runner-ийг cargo build --release-ээр бүтээдэг. Энэ машинд cargo PATH-д
байхгүй. Яагаад засаагүй: гадаад хэрэгсэл шаарддаг. Rust toolchain суулгавал давна.

## E. Ажлын хавтас дахь commit хийгдээгүй XO баримт (зассан)

- server/src/__tests__/cli-invocation-safety.test.ts: CLI дуудлагын allowlist тест.

Тест репогийн бүх .md/.ts файлыг уншиж, allowlist-д байхгүй CLI дуудлагын мөрийг
алдаа гэж үздэг. 2026-10-22-нд гурван газар баригдаж, бүгд засагдсан:

1. .superpowers/sdd/task-5-report.md: gitignore-д орсон агентын түр тайлан.
   Тестийн SKIP_DIRS-д ".superpowers" нэмж зассан (.paperclip-runtime-ийг алгасдагтай адил).
2. docs/xo/pilot-checklist.md: env хувьсагчийг командын өмнө нэг мөрөнд бичсэн
   тул allowlist-д таарахгүй байсан. Env-ийг тусад нь export хийж зассан.
3. Энэ файл өөрөө: дээрх алдааг тайлбарлахдаа командыг ишлэлээр иш татсан нь
   тестэд баригдсан. Ишлэлийг хассан. Энд CLI командын мөрийг бүү бич.

```bash
pnpm exec vitest run --exclude '**/dist/**' --project @paperclipai/server server/src/__tests__/cli-invocation-safety.test.ts
```

## B3: бүтэн ажиллагааны timeout

- cli/src/__tests__/company-import-transfer.test.ts: "takes the chunked path for a small zip whose entries inflate past the threshold" бүтэн ажиллагаанд 5.24 сек болж vitest-ийн анхдагч 5 сек хязгаарыг давсан, дангаар нь ажиллуулахад давна (~64 MB текстийг deflate хийдэг).
  Засвар: cli/vitest.config.ts-д testTimeout: 15000 нэмсэн (server/vitest.config.ts-тэй адил).
- server/vitest.config.ts-д testTimeout 15000, hookTimeout 30000 аль хэдийн бий. 2026-10-22-ны
  серверийн бүтэн ажиллагаанд ачааллын timeout гараагүй.
- server/src/__tests__/file-resources.test.ts: "resolves and lists explicit same-company cross-project workspace folders"
  нэг удаа "socket hang up"-аар унаад, дахин ажиллуулахад давсан. Тогтмол бус (flaky)
  гэж тэмдэглэв. Давтагдвал энд нэм.
