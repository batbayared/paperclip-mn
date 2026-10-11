# XO Ү3-В: Гадагш дуудлагагүй default, dev JWT, acpx 0.13.1, issue-гүй run Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** XO-г env хувьсагчгүйгээр асаахад Paperclip-ийн дэд бүтэц (telemetry.paperclip.ing, pages.paperclip.ing, AWS ingest, npm registry шалгалт) руу нэг ч дуудлага гарахгүй, dev горимд агентын JWT нууц өөрөө үүсдэг, acpx 0.13.1 дээр ганц хувилбараар ажилладаг, issue-гүй "Run now" run 403 ба continuation алдаагаар унахгүй болгох.

**Architecture:** Гадагш дуудлага бүрийн default-ыг "идэвхгүй" болгож, зөвхөн тохиргоонд `true` гэж тодорхой бичсэн үед асаана. Env kill-switch-үүд (`PAPERCLIP_TELEMETRY_DISABLED`, `DO_NOT_TRACK`, CI, `PAPERCLIP_UPDATE_CHECK=0`) хэвээр давамгайлна. Dev JWT нууцыг зөвхөн dev runner шинэ XO файлаар үүсгэнэ, production эхлэл хөндөгдөхгүй. acpx-ийн `inheritProcessEnv` нь 0.13.1-д `spawnEnvironment` болсон тул нэг мөрийн солилтоор env алдагдал, typecheck, close замын "node: not found" гурвыг зэрэг засна. Issue-гүй run-ийн хоёр засвар upstream-ийн fail-closed тестийг өөрчилдөг тул ED-ийн шийдвэрийн цэгтэй.

**Tech Stack:** TypeScript, zod, Express, drizzle-orm, embedded Postgres (vitest), vitest 4.1.11, pnpm 9.15.4, node --test, acpx 0.13.1, dotenv.

## Global Constraints

- Ажлын хавтас: `~/dev/paperclip-mn`, салбар `xo-main` (эсвэл түүнээс салгасан feature салбар). Bash бүр: `export PATH="$HOME/dev/bin:$HOME/.nvm/versions/node/v24.16.0/bin:$PATH" && cd ~/dev/paperclip-mn && …`.
- XO-ийн default: paperclip.ing болон AWS ingest руу чиглэсэн гадагш дуудлага бүр тохиргоонд тодорхой асаагаагүй бол унтраалттай.
- Env kill-switch-үүд (`PAPERCLIP_TELEMETRY_DISABLED=1`, `DO_NOT_TRACK=1`, CI хувьсагчид, `PAPERCLIP_UPDATE_CHECK=0`) тохиргоонд `enabled: true` байсан ч давамгайлна.
- Upstream файлын засвар хамгийн бага байна. Хөндсөн upstream файл бүр `docs/xo/SYNC.md`-ийн Ү3-В хүснэгтэд бичигдэнэ.
- ED-ийн орчинд `PAPERCLIP_TELEMETRY_DISABLED=1` тавигдсан. Telemetry-ийн тест бүр энэ хувьсагчийг stub хийх эсвэл устгах ёстой, эс бөгөөс тест худлаа ногоон эсвэл худлаа улаан гарна.
- Git: `git add .superpowers/` болон `git add -A` хориотой, файлыг нэрээр нь нэм. Commit trailer: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Push хийхээс өмнө ED-ээс зөвшөөрөл ав, мөн `find .git/refs -name '* 2*'` хоосон байх ёстой. Upstream paperclipai руу PR хийхгүй.
- Нууц үг, нэвтрэлт, `claude auth login`/`codex login` ажиллуулахгүй. Credential файл, Keychain уншихгүй. Үүсгэсэн JWT нууцын утгыг лог, чат, commit-д хэзээ ч хэвлэхгүй.

---

## File Structure

| Файл | Үүрэг | Task |
|---|---|---|
| `packages/shared/src/telemetry/config.ts` | telemetry-г opt-in болгох | 1 |
| `packages/shared/src/config-schema.ts` | `telemetry.enabled`, `updates.checkEnabled` default `false` | 1, 2 |
| `packages/shared/src/telemetry/config.test.ts` (шинэ, XO) | resolveTelemetryConfig ба schema default тест | 1, 2 |
| `server/src/config.ts` | `telemetryEnabled`, `announcementsEnabled` default `false` | 1, 2 |
| `server/src/config.telemetry.test.ts` (шинэ, XO) | loadConfig default тест | 1, 2 |
| `cli/src/commands/configure.ts`, `onboard.ts`, `worktree-lib.ts` | шинэ config-д `telemetry.enabled: false` бичих | 1 |
| `cli/src/__tests__/telemetry.test.ts` | kill-switch env цэвэрлэх, config-гүй үед унтраалттай | 1 |
| `README.md`, `packages/shared/src/telemetry/README.md` | telemetry opt-in баримт | 1 |
| `server/src/services/feedback-share-client.ts` (+ `__tests__/feedback-share-client.test.ts`) | URL-гүй үед client үүсгэхгүй | 2 |
| `cli/src/update-notice.ts` (+ `__tests__/update-notice.test.ts`) | npm шинэчлэлийн шалгалт opt-in | 2 |
| `doc/ANNOUNCEMENTS.md` | announcements opt-in баримт | 2 |
| `server/src/dev-agent-jwt-secret.ts` (шинэ, XO) | dev JWT нууц үүсгэх, хадгалах | 3 |
| `server/src/__tests__/dev-agent-jwt-secret.test.ts` (шинэ, XO) | тест | 3 |
| `scripts/dev-runner.ts` | ensureDevAgentJwtSecret дуудах | 3 |
| `packages/adapter-utils/package.json`, `package.json`, `pnpm-lock.yaml`, `patches/acpx@0.12.0.patch` (устгах) | acpx 0.13.1 | 4 |
| `scripts/acpx-patch-packaging.test.mjs` | 0.12.0-ийн шалгалтыг хасах | 4 |
| `packages/adapter-utils/src/acpx-engine/execute.ts` (+ `execute.test.ts`) | `spawnEnvironment` | 4 |
| `packages/adapter-utils/src/acpx-engine/remote-spawn-smoke.test.ts` | тайлбар дахь patch хувилбар | 4 |
| `server/src/services/cross-issue-influence-limit.ts` (+ `__tests__/cross-issue-influence-limit.test.ts`) | D1: issue-гүй run-ийг cap-аар тоолох | 5 |
| `server/src/services/execution-continuation.ts` (+ `.test.ts`) | D2: interaction нэрлэсэн issue-гүй run-ийг эх болгох | 5 |
| `docs/xo/ops-notes.md` (шинэ, XO) | порт fallback-ийн тэмдэглэл | 6 |
| `docs/xo/SYNC.md` | Ү3-В upstream файлын хүснэгт | 6 |

---

### Task 1: Telemetry-г default-аар унтраах

**Files:**
- Modify: `packages/shared/src/telemetry/config.ts:80`
- Modify: `packages/shared/src/config-schema.ts:102-104`
- Create: `packages/shared/src/telemetry/config.test.ts`
- Modify: `server/src/config.ts:368`
- Create: `server/src/config.telemetry.test.ts`
- Modify: `cli/src/commands/configure.ts:76-78`, `cli/src/commands/onboard.ts:712-714`, `cli/src/commands/worktree-lib.ts:285-287`
- Modify: `cli/src/__tests__/telemetry.test.ts` (beforeEach, шинэ тест)
- Modify: `README.md:493-508`, `packages/shared/src/telemetry/README.md`

**Interfaces:**
- Consumes: байхгүй.
- Produces: `resolveTelemetryConfig(fileConfig?: { enabled?: boolean } & TelemetryConfigOverrides): TelemetryConfig` нь `fileConfig?.enabled === true` үед л `enabled: true` буцаана. `telemetryConfigSchema.parse({}).enabled === false`. `loadConfig().telemetryEnabled` config-гүй үед `false`. Task 2 ижил тестийн файлуудад нэмэлт тохиолдол бичнэ.

- [ ] **Step 1: Shared-ийн бүтэлгүйтэх тестийг бич**

`packages/shared/src/telemetry/config.test.ts`:

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { telemetryConfigSchema } from "../config-schema.js";
import { resolveTelemetryConfig } from "./config.js";

const KILL_SWITCHES = [
  "PAPERCLIP_TELEMETRY_DISABLED",
  "DO_NOT_TRACK",
  "CI",
  "CONTINUOUS_INTEGRATION",
  "BUILD_NUMBER",
  "GITHUB_ACTIONS",
  "GITLAB_CI",
];

describe("XO telemetry defaults", () => {
  beforeEach(() => {
    for (const key of KILL_SWITCHES) vi.stubEnv(key, "");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("is off when no file config is given", () => {
    expect(resolveTelemetryConfig().enabled).toBe(false);
    expect(resolveTelemetryConfig({}).enabled).toBe(false);
  });

  it("is on only when the config says enabled: true", () => {
    expect(resolveTelemetryConfig({ enabled: true }).enabled).toBe(true);
    expect(resolveTelemetryConfig({ enabled: false }).enabled).toBe(false);
  });

  it("lets env kill-switches beat enabled: true", () => {
    vi.stubEnv("PAPERCLIP_TELEMETRY_DISABLED", "1");
    expect(resolveTelemetryConfig({ enabled: true }).enabled).toBe(false);
    vi.stubEnv("PAPERCLIP_TELEMETRY_DISABLED", "");
    vi.stubEnv("DO_NOT_TRACK", "1");
    expect(resolveTelemetryConfig({ enabled: true }).enabled).toBe(false);
  });

  it("parses a missing telemetry block as disabled", () => {
    expect(telemetryConfigSchema.parse({}).enabled).toBe(false);
  });
});
```

- [ ] **Step 2: Тестийг ажиллуулж FAIL харах**

Run: `cd packages/shared && npx vitest run src/telemetry/config.test.ts`
Expected: FAIL. "is off when no file config is given" ба "parses a missing telemetry block as disabled" хоёр `expected true to be false` гэж унана.

- [ ] **Step 3: Shared-ийг засах**

`packages/shared/src/telemetry/config.ts:80`:

```ts
  if (fileConfig?.enabled !== true) {
    return { enabled: false, ...caps };
  }
```

`packages/shared/src/config-schema.ts:102-104` дахь `telemetryConfigSchema`-д зөвхөн default-ыг солино:

```ts
export const telemetryConfigSchema = z.object({
  enabled: z.boolean().default(false),
}).passthrough().prefault({});
```

(Хэрэв мөрийн бусад хэсэг өөр бичигдсэн бол зөвхөн `.default(true)`-г `.default(false)` болго.)

- [ ] **Step 4: Shared тестийг ажиллуулж PASS харах**

Run: `cd packages/shared && npx vitest run src/telemetry`
Expected: PASS. `client.test.ts:122-140` дахь caps тест мөн ногоон.

- [ ] **Step 5: Серверийн бүтэлгүйтэх тестийг бич**

`server/src/config.telemetry.test.ts`:

```ts
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { loadConfig } from "./config.js";

let root: string;

function writeConfig(extra: Record<string, unknown>): string {
  const configPath = path.join(root, ".paperclip", "config.json");
  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  fs.writeFileSync(configPath, JSON.stringify({
    $meta: { version: 1, updatedAt: "2026-10-11T00:00:00.000Z", source: "configure" },
    database: {
      mode: "embedded-postgres",
      embeddedPostgresDataDir: path.join(root, "runtime", "db"),
      embeddedPostgresPort: 54329,
      backup: { enabled: true, intervalMinutes: 60, retentionDays: 30, dir: path.join(root, "runtime", "backups") },
    },
    logging: { mode: "file", logDir: path.join(root, "runtime", "logs") },
    server: {
      deploymentMode: "local_trusted",
      exposure: "private",
      host: "127.0.0.1",
      port: 3100,
      allowedHostnames: [],
      serveUi: true,
    },
    auth: { baseUrlMode: "auto", disableSignUp: false },
    storage: {
      provider: "local_disk",
      localDisk: { baseDir: path.join(root, "runtime", "storage") },
      s3: { bucket: "paperclip", region: "us-east-1", prefix: "", forcePathStyle: false },
    },
    secrets: {
      provider: "local_encrypted",
      strictMode: false,
      localEncrypted: { keyFilePath: path.join(root, "runtime", "secrets", "master.key") },
    },
    ...extra,
  }, null, 2));
  return configPath;
}

function isolate(configPath: string) {
  vi.stubEnv("PAPERCLIP_CONFIG", configPath);
  vi.stubEnv("PAPERCLIP_PUBLIC_URL", "");
  vi.stubEnv("PAPERCLIP_AUTH_PUBLIC_BASE_URL", "");
  vi.stubEnv("PAPERCLIP_MANAGED_RUNTIME_PUBLIC_URL", "");
  vi.stubEnv("BETTER_AUTH_URL", "");
  vi.stubEnv("BETTER_AUTH_BASE_URL", "");
  vi.stubEnv("PAPERCLIP_AUTH_BASE_URL_MODE", "");
  vi.stubEnv("PAPERCLIP_ALLOWED_HOSTNAMES", "");
  vi.stubEnv("PAPERCLIP_DEPLOYMENT_MODE", "local_trusted");
  vi.stubEnv("PAPERCLIP_DEPLOYMENT_EXPOSURE", "private");
  vi.stubEnv("PAPERCLIP_BIND", "loopback");
  vi.stubEnv("HOST", "127.0.0.1");
  vi.stubEnv("PAPERCLIP_ANNOUNCEMENTS_ENABLED", "");
}

beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), "paperclip-xo-config-"));
});

afterEach(() => {
  vi.unstubAllEnvs();
  fs.rmSync(root, { recursive: true, force: true });
});

describe("XO server config defaults", () => {
  it("disables telemetry when the config file is missing", () => {
    isolate(path.join(root, "missing.json"));
    expect(loadConfig().telemetryEnabled).toBe(false);
  });

  it("disables telemetry when the config has no telemetry block", () => {
    isolate(writeConfig({}));
    expect(loadConfig().telemetryEnabled).toBe(false);
  });

  it("enables telemetry only with telemetry.enabled: true", () => {
    isolate(writeConfig({ telemetry: { enabled: true } }));
    expect(loadConfig().telemetryEnabled).toBe(true);
  });
});
```

- [ ] **Step 6: Серверийн тестийг ажиллуулж FAIL харах**

Run: `cd server && npx vitest run src/config.telemetry.test.ts`
Expected: FAIL. Эхний тест `expected true to be false` гэж унана. Хоёр дахь нь schema засварын ачаар аль хэдийн PASS байж болно. Гурав дахь нь PASS.

- [ ] **Step 7: Серверийн config-ийг засах**

`server/src/config.ts:368`:

```ts
    telemetryEnabled: fileConfig?.telemetry?.enabled ?? false,
```

- [ ] **Step 8: Серверийн тестийг ажиллуулж PASS харах**

Run: `cd server && npx vitest run src/config.telemetry.test.ts src/__tests__/chat-webhook-public-url.test.ts`
Expected: PASS (бүх тест).

- [ ] **Step 9: CLI тестийг бүтэлгүйтэх байдлаар засах**

`cli/src/__tests__/telemetry.test.ts`-ийн `beforeEach` дотор CI давталтын дараа хоёр мөр нэм:

```ts
    delete process.env.PAPERCLIP_TELEMETRY_DISABLED;
    delete process.env.DO_NOT_TRACK;
```

`describe("cli telemetry", …)`-ийн төгсгөлд шинэ тест нэм:

```ts
  it("is disabled when no config file exists", async () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "paperclip-cli-telemetry-"));
    process.env.PAPERCLIP_HOME = path.join(root, "home");
    process.env.PAPERCLIP_INSTANCE_ID = "telemetry-test";

    const { initTelemetryFromConfigFile } = await import("../telemetry.js");
    const client = initTelemetryFromConfigFile(path.join(root, "missing.json"));

    expect(client).toBeNull();
    expect(fs.existsSync(path.join(root, "home", "instances", "telemetry-test", "telemetry", "state.json"))).toBe(false);
  });
```

- [ ] **Step 10: CLI тестийг ажиллуулах**

Run: `cd cli && npx vitest run src/__tests__/telemetry.test.ts`
Expected: Task 1-ийн Step 3 аль хэдийн хийгдсэн тул PASS (3 тест). Kill-switch-ийг устгаагүй бол "creates telemetry state only after the first event is tracked" ED-ийн орчинд унадаг байсан. Одоо ногоон байх ёстой.

- [ ] **Step 11: CLI-ийн шинэ config бичигчдийг засах**

`cli/src/commands/configure.ts:76-78` ба `cli/src/commands/onboard.ts:712-714`:

```ts
    telemetry: {
      enabled: false,
    },
```

`cli/src/commands/worktree-lib.ts:286`:

```ts
      enabled: source?.telemetry?.enabled ?? false,
```

- [ ] **Step 12: Баримтыг засах**

`README.md`-ийн "## Telemetry" хэсгийн "Telemetry is **enabled by default** …" өгүүлбэр ба хүснэгтийг (`:503-508`) дараахаар соль:

```md
In XO, telemetry is **disabled by default**. Nothing is sent unless you opt in by setting `telemetry.enabled: true` in your Paperclip config. Even with that setting, any of the following still turns it off:

| Method               | How                                                     |
| -------------------- | ------------------------------------------------------- |
| Environment variable | `PAPERCLIP_TELEMETRY_DISABLED=1`                        |
| Standard convention  | `DO_NOT_TRACK=1`                                        |
| CI environments      | Automatically disabled when `CI=true`                   |
| Config file          | Omit `telemetry.enabled` or set it to `false`           |
```

`packages/shared/src/telemetry/README.md`-ийн эхний гарчгийн доор нэг догол нэм:

```md
> **XO note:** XO ships telemetry off. `resolveTelemetryConfig()` returns `enabled: true` only when the config file sets `telemetry.enabled: true`, and the env kill-switches (`PAPERCLIP_TELEMETRY_DISABLED=1`, `DO_NOT_TRACK=1`, CI) still override it.
```

- [ ] **Step 13: Хамаарах бүх тестийг ажиллуулах**

Run:
```bash
cd packages/shared && npx vitest run src/telemetry src/config-schema && cd ../../cli && npx vitest run src/__tests__/telemetry.test.ts src/__tests__/configure.test.ts src/__tests__/onboard.test.ts src/__tests__/worktree.test.ts
```
Expected: PASS. Файлын нэр олдохгүй бол `ls cli/src/__tests__ | grep -E 'configure|onboard|worktree'`-оор жинхэнэ нэрийг олж ажиллуул. `readme-contract.test.ts` мөн ногоон.

- [ ] **Step 14: Commit**

```bash
git add packages/shared/src/telemetry/config.ts packages/shared/src/config-schema.ts packages/shared/src/telemetry/config.test.ts packages/shared/src/telemetry/README.md server/src/config.ts server/src/config.telemetry.test.ts cli/src/commands/configure.ts cli/src/commands/onboard.ts cli/src/commands/worktree-lib.ts cli/src/__tests__/telemetry.test.ts README.md
git commit -m "feat(xo): make telemetry opt-in by default

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Announcements, шинэчлэлийн шалгалт, feedback share-ийг default-аар унтраах

**Files:**
- Modify: `packages/shared/src/config-schema.ts:106-108`
- Modify: `packages/shared/src/telemetry/config.test.ts` (Task 1-д үүссэн)
- Modify: `server/src/config.ts:369`
- Modify: `server/src/config.telemetry.test.ts` (Task 1-д үүссэн)
- Modify: `server/src/services/feedback-share-client.ts:5,18-23`
- Modify: `server/src/__tests__/feedback-share-client.test.ts:17-48` ба `:50` орчмын тест
- Modify: `cli/src/update-notice.ts:10`
- Modify: `cli/src/__tests__/update-notice.test.ts`
- Modify: `doc/ANNOUNCEMENTS.md:9`

**Interfaces:**
- Consumes: Task 1-ийн `config.test.ts` ба `config.telemetry.test.ts` дахь `isolate()`, `writeConfig()` туслахууд.
- Produces: `createFeedbackTraceShareClientFromConfig(config: { feedbackExportBackendUrl?: string; feedbackExportBackendToken?: string }): FeedbackTraceShareClient | undefined`. `loadConfig().announcementsEnabled` нь `PAPERCLIP_ANNOUNCEMENTS_ENABLED === "true"` үед л `true`. `isUpdateNoticeEnabled(configPath?: string): boolean` нь config-д `updates.checkEnabled: true` үед л `true`. `updatesConfigSchema.parse({}).checkEnabled === false`.

- [ ] **Step 1: Бүтэлгүйтэх тестүүдийг бич**

`packages/shared/src/telemetry/config.test.ts`-ийн import-ыг өргөтгө:

```ts
import { telemetryConfigSchema, updatesConfigSchema } from "../config-schema.js";
```

`describe` дотор нэм:

```ts
  it("parses a missing updates block as check disabled", () => {
    expect(updatesConfigSchema.parse({}).checkEnabled).toBe(false);
  });
```

`server/src/config.telemetry.test.ts`-ийн `describe` дотор нэм:

```ts
  it("disables announcements unless PAPERCLIP_ANNOUNCEMENTS_ENABLED=true", () => {
    isolate(path.join(root, "missing.json"));
    expect(loadConfig().announcementsEnabled).toBe(false);
    vi.stubEnv("PAPERCLIP_ANNOUNCEMENTS_ENABLED", "true");
    expect(loadConfig().announcementsEnabled).toBe(true);
  });
```

`server/src/__tests__/feedback-share-client.test.ts:17-48`-ийн "defaults to telemetry.paperclip.ing when no backend url is configured" тестийг бүхэлд нь дараахаар соль:

```ts
  it("returns undefined and never calls fetch when no backend url is configured", () => {
    const client = createFeedbackTraceShareClientFromConfig({
      feedbackExportBackendUrl: undefined,
      feedbackExportBackendToken: undefined,
    });

    expect(client).toBeUndefined();
    expect(fetch).not.toHaveBeenCalled();
  });
```

Дараагийн тестүүд (`:50` "wraps the feedback trace payload as gzip+base64 json before upload" болон бусад) тодорхой URL өгдөг. Тэдгээрт `await client.uploadTraceBundle(` гэсэн мөрийг `await client!.uploadTraceBundle(` болго.

`cli/src/__tests__/update-notice.test.ts`-ийн "throttles registry checks for 24 hours" тестийг дараахаар соль, мөн шинэ тест нэм:

```ts
  it("is off when no config file exists", () => {
    expect(isUpdateNoticeEnabled(path.join(root, "missing.json"))).toBe(false);
  });
  it("throttles registry checks for 24 hours", async () => {
    const configPath = path.join(root, "config.json"); fs.writeFileSync(configPath, JSON.stringify({ updates: { checkEnabled: true } }));
    const cachePath = path.join(root, "cache.json"); const fetchImpl = vi.fn(async () => new Response(JSON.stringify({ "dist-tags": { latest: "99.0.0" } }), { status: 200 }));
    expect(await checkForUpdateNotice({ configPath, cachePath, now: 1000, fetchImpl })).toBe("99.0.0");
    expect(await checkForUpdateNotice({ configPath, cachePath, now: 2000, fetchImpl })).toBe("99.0.0");
    expect(fetchImpl).toHaveBeenCalledOnce();
  });
```

- [ ] **Step 2: Тестүүдийг ажиллуулж FAIL харах**

Run:
```bash
cd packages/shared && npx vitest run src/telemetry/config.test.ts; cd ../../server && npx vitest run src/config.telemetry.test.ts src/__tests__/feedback-share-client.test.ts; cd ../cli && npx vitest run src/__tests__/update-notice.test.ts
```
Expected: FAIL. `checkEnabled` `expected true to be false`; `announcementsEnabled` `expected true to be false`; feedback `expected { uploadTraceBundle: … } to be undefined`; update-notice "is off when no config file exists" `expected true to be false`.

- [ ] **Step 3: Хэрэгжүүлэх**

`packages/shared/src/config-schema.ts:106-108` дахь `updatesConfigSchema`-д `checkEnabled: z.boolean().default(true)`-г дараахаар соль:

```ts
  checkEnabled: z.boolean().default(false),
```

`server/src/config.ts:369`:

```ts
    announcementsEnabled: process.env.PAPERCLIP_ANNOUNCEMENTS_ENABLED === "true",
```

`server/src/services/feedback-share-client.ts`: `:5` дахь `const DEFAULT_FEEDBACK_EXPORT_BACKEND_URL = "https://telemetry.paperclip.ing";` мөрийг устга. `:18-23` дахь factory-гийн эхэнд URL шалгалт тавьж, буцах төрлийг өргөтгө. Factory-гийн бие хэсэгт өмнө нь `DEFAULT_FEEDBACK_EXPORT_BACKEND_URL` руу унадаг байсан `baseUrl`-ыг шууд ашигла:

```ts
export function createFeedbackTraceShareClientFromConfig(
  config: Pick<Config, "feedbackExportBackendUrl" | "feedbackExportBackendToken">,
): FeedbackTraceShareClient | undefined {
  // XO (Ү3-В): no implicit upload to telemetry.paperclip.ing. Sharing is
  // available only when an operator configures a backend URL.
  const baseUrl = config.feedbackExportBackendUrl?.trim();
  if (!baseUrl) return undefined;
  // …factory-гийн үлдсэн хэсэг өөрчлөлтгүй, baseUrl-ыг ашиглана
}
```

Factory-гийн параметрийн төрөл файлд өөрөөр бичигдсэн бол түүнийг хэвээр үлдээ, зөвхөн буцах төрөл ба эхний гурван мөрийг өөрчил. `server/src/index.ts:798` дахь `shareClient: createFeedbackTraceShareClientFromConfig(config)` нь `shareClient?: FeedbackTraceShareClient` (`server/src/routes/feedback.ts:118`) руу ордог, `:1792-1793` дээр undefined-ийг аль хэдийн боловсруулдаг тул өөрчлөлт шаардахгүй.

`cli/src/update-notice.ts:10`:

```ts
  try { const raw = JSON.parse(fs.readFileSync(resolveConfigPath(configPath), "utf8")) as { updates?: { checkEnabled?: boolean } }; return raw.updates?.checkEnabled === true; } catch { return false; }
```

`doc/ANNOUNCEMENTS.md:9`:

```md
- XO: announcements are off by default. `PAPERCLIP_ANNOUNCEMENTS_ENABLED=true` enables fetching and display.
```

- [ ] **Step 4: Тестүүдийг ажиллуулж PASS харах**

Run:
```bash
cd packages/shared && npx vitest run src/telemetry; cd ../../server && npx vitest run src/config.telemetry.test.ts src/__tests__/feedback-share-client.test.ts src/__tests__/server-startup-feedback-export.test.ts; cd ../cli && npx vitest run src/__tests__/update-notice.test.ts
```
Expected: PASS. `server-startup-feedback-export.test.ts:387` factory-г mock хийдэг тул нөлөөлөгдөхгүй.

- [ ] **Step 5: Typecheck**

Run: `pnpm --filter @paperclipai/shared typecheck && pnpm --filter paperclipai typecheck`
Expected: алдаагүй дуусна. Сервер талын typecheck-ийг Task 7-д хийнэ.

- [ ] **Step 6: Commit**

```bash
git add packages/shared/src/config-schema.ts packages/shared/src/telemetry/config.test.ts server/src/config.ts server/src/config.telemetry.test.ts server/src/services/feedback-share-client.ts server/src/__tests__/feedback-share-client.test.ts cli/src/update-notice.ts cli/src/__tests__/update-notice.test.ts doc/ANNOUNCEMENTS.md
git commit -m "feat(xo): make announcements, update checks and feedback sharing opt-in

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Dev агентын JWT нууцыг автоматаар үүсгэх

**Files:**
- Create: `server/src/dev-agent-jwt-secret.ts`
- Create: `server/src/__tests__/dev-agent-jwt-secret.test.ts`
- Modify: `scripts/dev-runner.ts:16` (import), `:57`-ийн дараа (дуудлага)

**Interfaces:**
- Consumes: `updateEnvFileContents(contents: string, entries: Record<string, string>, options: { valueEncoding: "minimal" })` ба `writeEnvFileAtomicallyIfChanged(filePath: string, previousContents: string | null, nextContents: string)` (`@paperclipai/shared/env-file`, 0600 горимоор tmp+rename хийж бичдэг). `resolvePaperclipEnvPath(overrideConfigPath?: string): string` (`server/src/paths.ts:32`).
- Produces: `ensureDevAgentJwtSecret(env: NodeJS.ProcessEnv, envFilePath?: string): { created: boolean; envPath: string }`.

Үндэслэл: өөрчлөлт зөвхөн dev runner ба шинэ XO файлд хүрнэ. `server/src/index.ts` болон production эхлэл хөндөгдөхгүй. Dev runner-ийн хүүхэд процесс `...process.env`-ээс (`scripts/dev-runner.ts:170`) env авдаг тул `process.env`-д тавьсан утга серверт хүрнэ.

- [ ] **Step 1: Бүтэлгүйтэх тестийг бич**

`server/src/__tests__/dev-agent-jwt-secret.test.ts`:

```ts
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { ensureDevAgentJwtSecret } from "../dev-agent-jwt-secret.ts";

const tempRoots = new Set<string>();

afterEach(() => {
  for (const root of tempRoots) fs.rmSync(root, { recursive: true, force: true });
  tempRoots.clear();
});

function envPathIn(prefix: string): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  tempRoots.add(root);
  return path.join(root, ".env");
}

describe("ensureDevAgentJwtSecret", () => {
  it("creates and persists a 64-hex secret with mode 0600", () => {
    const envPath = envPathIn("xo-jwt-create-");
    const env: NodeJS.ProcessEnv = {};

    const result = ensureDevAgentJwtSecret(env, envPath);

    expect(result).toEqual({ created: true, envPath });
    expect(env.PAPERCLIP_AGENT_JWT_SECRET).toMatch(/^[0-9a-f]{64}$/);
    expect(fs.readFileSync(envPath, "utf8")).toContain(`PAPERCLIP_AGENT_JWT_SECRET=${env.PAPERCLIP_AGENT_JWT_SECRET}`);
    expect(fs.statSync(envPath).mode & 0o777).toBe(0o600);
  });

  it("reuses an existing value from the file without rewriting it", () => {
    const envPath = envPathIn("xo-jwt-reuse-");
    const existing = "a".repeat(64);
    fs.writeFileSync(envPath, `PAPERCLIP_AGENT_JWT_SECRET=${existing}\n`, { mode: 0o600 });
    const before = fs.statSync(envPath).mtimeMs;
    const env: NodeJS.ProcessEnv = {};

    const result = ensureDevAgentJwtSecret(env, envPath);

    expect(result.created).toBe(false);
    expect(env.PAPERCLIP_AGENT_JWT_SECRET).toBe(existing);
    expect(fs.statSync(envPath).mtimeMs).toBe(before);
  });

  it("skips when PAPERCLIP_AGENT_JWT_SECRET is already set", () => {
    const envPath = envPathIn("xo-jwt-env-");
    const env: NodeJS.ProcessEnv = { PAPERCLIP_AGENT_JWT_SECRET: "from-env" };

    expect(ensureDevAgentJwtSecret(env, envPath).created).toBe(false);
    expect(env.PAPERCLIP_AGENT_JWT_SECRET).toBe("from-env");
    expect(fs.existsSync(envPath)).toBe(false);
  });

  it("skips when BETTER_AUTH_SECRET is set", () => {
    const envPath = envPathIn("xo-jwt-better-auth-");
    const env: NodeJS.ProcessEnv = { BETTER_AUTH_SECRET: "auth-secret" };

    expect(ensureDevAgentJwtSecret(env, envPath).created).toBe(false);
    expect(env.PAPERCLIP_AGENT_JWT_SECRET).toBeUndefined();
    expect(fs.existsSync(envPath)).toBe(false);
  });

  it("preserves other lines in the .env file", () => {
    const envPath = envPathIn("xo-jwt-preserve-");
    fs.writeFileSync(envPath, "PORT=3110\nPAPERCLIP_INSTANCE_ID=y3b-test\n", { mode: 0o600 });
    const env: NodeJS.ProcessEnv = {};

    ensureDevAgentJwtSecret(env, envPath);

    const contents = fs.readFileSync(envPath, "utf8");
    expect(contents).toContain("PORT=3110");
    expect(contents).toContain("PAPERCLIP_INSTANCE_ID=y3b-test");
    expect(contents).toMatch(/^PAPERCLIP_AGENT_JWT_SECRET=[0-9a-f]{64}$/m);
  });
});
```

- [ ] **Step 2: Тестийг ажиллуулж FAIL харах**

Run: `cd server && npx vitest run src/__tests__/dev-agent-jwt-secret.test.ts`
Expected: FAIL, `Failed to load url ../dev-agent-jwt-secret.ts` (файл байхгүй).

- [ ] **Step 3: Хэрэгжүүлэх**

`server/src/dev-agent-jwt-secret.ts`:

```ts
// XO (Ү3-В): dev-only helper. `pnpm dev` used to start without an agent JWT
// secret, so local agents could not authenticate. Production startup does not
// call this; operators there must set the secret themselves.
import { randomBytes } from "node:crypto";
import fs from "node:fs";
import { parse } from "dotenv";
import { updateEnvFileContents, writeEnvFileAtomicallyIfChanged } from "@paperclipai/shared/env-file";
import { resolvePaperclipEnvPath } from "./paths.js";

const KEY = "PAPERCLIP_AGENT_JWT_SECRET";

export function ensureDevAgentJwtSecret(
  env: NodeJS.ProcessEnv,
  envFilePath: string = resolvePaperclipEnvPath(),
): { created: boolean; envPath: string } {
  if (env[KEY]?.trim() || env.BETTER_AUTH_SECRET?.trim()) return { created: false, envPath: envFilePath };

  const previous = fs.existsSync(envFilePath) ? fs.readFileSync(envFilePath, "utf8") : null;
  const existing = previous ? parse(previous)[KEY]?.trim() : undefined;
  if (existing) {
    env[KEY] = existing;
    return { created: false, envPath: envFilePath };
  }

  const secret = randomBytes(32).toString("hex");
  const next = updateEnvFileContents(previous ?? "", { [KEY]: secret }, { valueEncoding: "minimal" });
  writeEnvFileAtomicallyIfChanged(envFilePath, previous, next);
  env[KEY] = secret;
  return { created: true, envPath: envFilePath };
}
```

`writeEnvFileAtomicallyIfChanged` эцэг хавтсыг үүсгэдэггүй бол бичихээс өмнө `fs.mkdirSync(path.dirname(envFilePath), { recursive: true });` нэм (`node:path` import-той). Тест temp хавтсанд бичдэг тул энэ нь зөвхөн шинэ instance-д хэрэгтэй.

`scripts/dev-runner.ts:16` дахь `bootstrapDevRunnerWorktreeEnv` import-ын доор:

```ts
import { ensureDevAgentJwtSecret } from "../server/src/dev-agent-jwt-secret.ts";
```

`isWorktreeSeedPending` блок (`:52-57`) дууссаны дараа:

```ts
const devAgentJwtSecret = ensureDevAgentJwtSecret(process.env);
if (devAgentJwtSecret.created) {
  console.log(`[paperclip] created PAPERCLIP_AGENT_JWT_SECRET in ${devAgentJwtSecret.envPath} (dev only)`);
}
```

Worktree bootstrap-ын дараа дуудах нь чухал: bootstrap `PAPERCLIP_CONFIG`-ийг тавьдаг тул `resolvePaperclipEnvPath()` зөв instance-ийн `.env`-ийг заана.

- [ ] **Step 4: Тестийг ажиллуулж PASS харах**

Run: `cd server && npx vitest run src/__tests__/dev-agent-jwt-secret.test.ts src/__tests__/dev-runner-worktree.test.ts`
Expected: PASS (5 + одоо байгаа worktree тестүүд).

- [ ] **Step 5: Commit**

```bash
git add server/src/dev-agent-jwt-secret.ts server/src/__tests__/dev-agent-jwt-secret.test.ts scripts/dev-runner.ts
git commit -m "feat(xo): auto-create the dev agent JWT secret in pnpm dev

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: adapter-utils-ийн acpx-ийг 0.13.1 болгох

**Files:**
- Modify: `packages/adapter-utils/package.json:47`
- Modify: `package.json:119` (мөр устгах)
- Delete: `patches/acpx@0.12.0.patch`
- Modify: `pnpm-lock.yaml` (`pnpm install`-ээр)
- Modify: `scripts/acpx-patch-packaging.test.mjs:52,111-114,119`
- Modify: `packages/adapter-utils/src/acpx-engine/execute.ts:4233-4236`
- Modify: `packages/adapter-utils/src/acpx-engine/execute.test.ts` (`:2118`-ийн дараа шинэ тест)
- Modify: `packages/adapter-utils/src/acpx-engine/remote-spawn-smoke.test.ts:70` (тайлбар)

**Interfaces:**
- Consumes: acpx 0.13.1-ийн `AcpRuntimeOptions.spawnEnvironment?: () => Record<string, string>` (`node_modules/acpx/dist/runtime.d.ts:327`). Patch-лагдсан `buildAgentEnvironment` нь `spawnEnvironment` undefined үед `process.env`-ийг ашигладаг. Утга бүр string байх plain object шаарддаг.
- Produces: `PaperclipAcpRuntimeOptions` (`execute.ts:190`) нь `inheritProcessEnv` биш `spawnEnvironment` дамжуулна. Бусад task үүнээс хамаарахгүй.

Тэмдэглэл: 0.13.1-ийн patch нь 0.12.0-ийн patch-ийн бүх hunk хэсгийг хамардаг. pnpm 9 хэрэглэгдээгүй patch дээр алдаа өгдөг тул 0.12.0 importer үлдэхгүй болмогц patch-ийг заавал хасна. 0.13.1-ийг аль хэдийн `server/package.json:75` ба paperclip-runner (`:163`) ашигладаг. adapter-utils нь acpx-ийг `bundleDependencies`-д (`:37-39`) жагсаадаг, энэ нь өөрчлөгдөхгүй.

- [ ] **Step 1: Бүтэлгүйтэх тестүүдийг бич**

`packages/adapter-utils/src/acpx-engine/execute.test.ts`-д "configures in-process child stderr capture without forcing verbose mode" тестийн (`:2110-2118`) дараа:

```ts
  it("hands acpx the sanitized launch environment instead of the ambient process env", async () => {
    const root = await makeTempRoot();
    const { runtimeOptions, sessionInputs } = await runExecutor({ agent: "custom", agentCommand: "node ./fake-acp.js", stateDir: path.join(root, "state") });
    const options = runtimeOptions[0] as Record<string, unknown>;
    expect(options.inheritProcessEnv).toBeUndefined();
    expect(options.spawnEnvironment).toBeTypeOf("function");
    const spawnEnv = (options.spawnEnvironment as () => Record<string, string>)();
    expect(spawnEnv).toEqual((sessionInputs[0]!.sessionOptions as { env: Record<string, string> }).env);
  });
```

Sentinel утга (жишээ нь `process.env`-д тавьсан canary байхгүй гэдгийг) шалгахгүй: host projection env-ийг хуулж болох тул тогтворгүй тест болно.

`scripts/acpx-patch-packaging.test.mjs`:
- `:52` `for (const version of ["0.12.0", "0.13.1"]) {` мөрийг `for (const version of ["0.13.1"]) {` болго.
- `:111-114` дахь `acpx@0.12.0`-ийн `assert.equal(…)` блокийг дараахаар соль:

```js
  assert.equal(rootPackage.pnpm.patchedDependencies["acpx@0.12.0"], undefined);
```

- `:119` `assert.equal(adapterUtilsPackage.dependencies.acpx, "0.12.0");` мөрийг `assert.equal(adapterUtilsPackage.dependencies.acpx, "0.13.1");` болго.

- [ ] **Step 2: Тестүүдийг ажиллуулж FAIL харах**

Run:
```bash
node --test scripts/acpx-patch-packaging.test.mjs; cd packages/adapter-utils && npx vitest run src/acpx-engine/execute.test.ts -t "sanitized launch environment"
```
Expected: FAIL. node --test дээр `"published packages preserve the patched ACPX runtime"` нь `'patches/acpx@0.12.0.patch' !== undefined` гэж унана. vitest дээр `expected false to be undefined` (`inheritProcessEnv: false` хэвээр).

- [ ] **Step 3: Хувилбар ба patch-ийг солих**

`packages/adapter-utils/package.json:47`:

```json
    "acpx": "0.13.1",
```

`package.json:119`-ийн `"acpx@0.12.0": "patches/acpx@0.12.0.patch",` мөрийг устга. `"acpx@0.13.1"` мөр хэвээр.

```bash
git rm patches/acpx@0.12.0.patch
pnpm install --prefer-offline
grep -c "acpx@0.12.0" pnpm-lock.yaml
```
Expected: `pnpm install` алдаагүй дуусна. `grep -c` нь `0` хэвлэнэ.

Хэрэв `pnpm install` "ERR_PNPM_UNUSED_PATCH" эсвэл patch хэрэглэх алдаа өгвөл зогсоож ED-д алдааны мөрийг илгээ.

- [ ] **Step 4: `spawnEnvironment` руу шилжих**

`packages/adapter-utils/src/acpx-engine/execute.ts:4233-4236` дахь тайлбарыг үлдээж, `inheritProcessEnv: false,` мөрийг солино:

```ts
          // The engine passes a complete, sanitized launch environment. ACPX
          // must not merge the Paperclip server's ambient environment back in
          // when it spawns the provider child.
          spawnEnvironment: () => ({ ...prepared.env }),
```

Энэ нэг мөр гурван зүйлийг засна. Нэгдүгээрт, 0.13.1-д `inheritProcessEnv` байхгүй тул түүнийг үл тоомсорлож орчны env-ийг нийлүүлдэг байсныг зогсооно. Хоёрдугаарт, typecheck-ийн алдааг арилгана. Гуравдугаарт, `acquireBackendCloseConnection` нь `sessionOptions` дамжуулдаггүй тул close замд PATH-гүй env-ээр "node: not found" гардаг байсныг засна: patch-лагдсан `createClient` нь `this.options.spawnEnvironment`-ийг шууд оруулна. `:4359` ба `:4397` дахь `sessionOptions: { env: prepared.env }` хэвээр үлдэнэ.

`packages/adapter-utils/src/acpx-engine/remote-spawn-smoke.test.ts:70` тайлбарт `patches/acpx@0.12.0.patch`-ийг `patches/acpx@0.13.1.patch` болго.

- [ ] **Step 5: Тестүүд ба typecheck-ийг ажиллуулж PASS харах**

Run:
```bash
node --test scripts/acpx-patch-packaging.test.mjs && cd packages/adapter-utils && npx vitest run src/acpx-engine && cd ../.. && pnpm --filter @paperclipai/adapter-utils typecheck
```
Expected: бүгд PASS, typecheck алдаагүй.

**ED-ийн шийдвэрийн цэг C:** typecheck эсвэл `src/acpx-engine` тестүүд `inheritProcessEnv`-ээс өөр acpx 0.13.1-ийн API өөрчлөлтөөр (жишээ нь өөр талбарын нэр, төрөл) унавал өөрөө засварлахгүй. Алдааны мөрүүдийг ED-д илгээж, "засах уу эсвэл adapter-utils-ийг 0.12.0 дээр үлдээх үү" гэж асуу.

- [ ] **Step 6: Commit**

```bash
git add packages/adapter-utils/package.json package.json pnpm-lock.yaml scripts/acpx-patch-packaging.test.mjs packages/adapter-utils/src/acpx-engine/execute.ts packages/adapter-utils/src/acpx-engine/execute.test.ts packages/adapter-utils/src/acpx-engine/remote-spawn-smoke.test.ts
git commit -m "chore(xo): move adapter-utils to acpx 0.13.1 and pass spawnEnvironment

Drops patches/acpx@0.12.0.patch now that no importer uses 0.12.0.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

(`git rm` устгалтыг аль хэдийн stage хийсэн.)

---

### Task 5: Issue-гүй "Run now" run-ийн 403 ба continuation алдаа

**Files:**
- Modify: `server/src/services/cross-issue-influence-limit.ts:112-118`
- Modify: `server/src/__tests__/cross-issue-influence-limit.test.ts` ("fails closed when the persisted run has no source issue" тест)
- Modify: `server/src/services/execution-continuation.ts:121-145`
- Modify: `server/src/services/execution-continuation.test.ts` ("rejects handoff history from a different task"-ийн дараа хоёр тест)

**Interfaces:**
- Consumes: `observeCrossIssueInfluence(db, { companyId, runId, agentId, targetIssueId, targetIssueIdentifier?, kind, now?, responsibleUserId? })` ба `buildExecutionContinuation({ db, companyId, issueId, agentId, context, summary, exposeLowTrustRaw })`, хоёул өөрчлөгдөхгүй гарын үсэгтэй.
- Produces: D1-ийн A хувилбарт `observeCrossIssueInfluence` нь issue-гүй run-д 403 шидэхгүй, `CrossIssueInfluenceDecision` буцаана (`details.sourceIssueId` нь `null`). D2-т `buildExecutionContinuation` нь interaction нэрлэсэн issue-гүй run-ийг `trigger.sourceRunId` болгон хүлээн авна.

**ED-ийн шийдвэрийн цэг D1 (Step 1-ээс өмнө асуу):** issue-гүй run (`contextSnapshot`-д `issueId`/`taskId` байхгүй) өөр issue-д бичихэд upstream зориуд fail-closed 403 (`cross_issue_influence_run_context_required`) өгдөг бөгөөд үүнийг тест хамгаалдаг.
- **A хувилбар (зөвлөмж):** issue-гүй run-ийн бичилт бүрийг cross-issue гэж тоолж, ижил run-ийн cap-д (20, enforce огнооноос хойш) хамруулна. Malformed runId, run олдохгүй, буруу agent/company, мөн route-ын `issues.ts:3891` дээрх runId-гүй agent шалгалт fail-closed хэвээр. Upstream-ийн нэг тестийг XO тестээр солино.
- **B хувилбар:** upstream-ийг хөндөхгүй. "Run now"-ийн дараа хүн тухайн issue-д сэтгэгдэл бичиж дахин нээх (`server/src/routes/issues.ts` ~2294-2326) workaround-ыг `docs/xo/ops-notes.md`-д бичээд Step 1-4-ийг алгасна.

**ED-ийн шийдвэрийн цэг D2 (Step 5-аас өмнө асуу):** continuation-ийн эх run-ийг `contextSnapshot ->> 'issueId' = issueId` шүүлтүүрээр хайдаг тул issue-гүй run эх болж чадахгүй, `continuation_source_context_missing` алдаа гарна. Санал: зөвхөн энэ issue дээрх шийдэгдсэн interaction (`triggerInteraction.sourceRunId`) тухайн run-ийг нэрлэсэн, мөн хэрэглэгчийн тодорхой continuation (`explicitUserContinuation.previousRunId`) биш үед л `issueId IS NULL` run-ийг хүлээн авна. `retryOfRunId`, `previousRunId`, `interruptedRunId` замууд issue-ээр хязгаарлагдсан хэвээр. `priorRuns` асуулга (`:222-229`) өөрчлөгдөхгүй тул issue-гүй эх run-ийн receipt дамжихгүй. Энэ нь мэдэгдэж буй хязгаарлалт. ED татгалзвал Step 5-8-ыг алгасна.

- [ ] **Step 1: D1 (A): бүтэлгүйтэх тестийг бич**

`server/src/__tests__/cross-issue-influence-limit.test.ts`-ийн "fails closed when the persisted run has no source issue" тестийг бүхэлд нь дараах хоёр тестээр соль:

```ts
  it("XO: counts an issue-less run's write against the cap", async () => {
    const fake = counterDb(0, { contextSnapshot: {} });

    await expect(observeCrossIssueInfluence(fake.db as never, {
      companyId: "22222222-2222-4222-8222-222222222222",
      runId: "11111111-1111-4111-8111-111111111111",
      agentId: "33333333-3333-4333-8333-333333333333",
      targetIssueId: "55555555-5555-4555-8555-555555555555",
      kind: "update",
      now: new Date(CROSS_ISSUE_INFLUENCE_ENFORCE_AT.getTime() - 1),
    })).resolves.toMatchObject({ count: 1, allowed: true });
    expect(fake.inserted).toHaveLength(1);
    expect((fake.inserted[0]!.details as { sourceIssueId: unknown }).sourceIssueId ?? null).toBeNull();
  });

  it("XO: rejects an issue-less run once it passes the cap after the flip", async () => {
    const fake = counterDb(CROSS_ISSUE_INFLUENCE_LIMIT, { contextSnapshot: {} });

    await expect(observeCrossIssueInfluence(fake.db as never, {
      companyId: "22222222-2222-4222-8222-222222222222",
      runId: "11111111-1111-4111-8111-111111111111",
      agentId: "33333333-3333-4333-8333-333333333333",
      targetIssueId: "55555555-5555-4555-8555-555555555555",
      kind: "update",
      now: CROSS_ISSUE_INFLUENCE_ENFORCE_AT,
    })).resolves.toMatchObject({ allowed: false, mode: "enforce" });
  });
```

- [ ] **Step 2: D1 тестийг ажиллуулж FAIL харах**

Run: `cd server && npx vitest run src/__tests__/cross-issue-influence-limit.test.ts`
Expected: FAIL, хоёр шинэ тест `cross_issue_influence_run_context_required` 403-аар reject болно.

- [ ] **Step 3: D1 (A): хэрэгжүүлэх**

`server/src/services/cross-issue-influence-limit.ts:112-118` дахь блокийг соль:

```ts
    const sourceIssueId = readRunSourceIssueId(run.contextSnapshot);
    // XO (Ү3-В D1): a "Run now" run has no source issue. Upstream fails closed
    // with 403; XO treats every write from such a run as cross-issue and lets
    // the per-run cap below bound it. Missing or mismatched runs still throw.
    if (
      sourceIssueId &&
      (sourceIssueId === input.targetIssueId ||
        (input.targetIssueIdentifier && sourceIssueId.toUpperCase() === input.targetIssueIdentifier.toUpperCase()))
    ) {
      return null;
    }
```

`details` ба `logContext` дахь `sourceIssueId` нь `null` болж бичигдэнэ. `readRunSourceIssueId` (`:37-44`) аль хэдийн `null` буцаадаг тул төрөл өөрчлөгдөхгүй.

- [ ] **Step 4: D1 тестийг ажиллуулж PASS харах**

Run: `cd server && npx vitest run src/__tests__/cross-issue-influence-limit.test.ts`
Expected: PASS. Malformed runId, run олдохгүй, буруу agent/company тестүүд fail-closed хэвээр ногоон.

- [ ] **Step 5: D2: тестүүдийг бич**

`server/src/services/execution-continuation.test.ts`-д "rejects handoff history from a different task" тестийн дараа:

```ts
    it("XO: resumes an issue-less source run named by the resolved interaction", async () => {
      const [source] = await db.select().from(heartbeatRuns).where(eq(heartbeatRuns.id, runId));
      await db.update(heartbeatRuns).set({ contextSnapshot: {} }).where(eq(heartbeatRuns.id, runId));
      try {
        expect((await build()).trigger.sourceRunId).toBe(runId);
      } finally {
        await db.update(heartbeatRuns).set({ contextSnapshot: source.contextSnapshot }).where(eq(heartbeatRuns.id, runId));
      }
    });

    it("XO: still rejects an issue-less run not named by the interaction", async () => {
      const [source] = await db.select().from(heartbeatRuns).where(eq(heartbeatRuns.id, runId));
      await db.update(heartbeatRuns).set({ contextSnapshot: {} }).where(eq(heartbeatRuns.id, runId));
      try {
        await expect(buildExecutionContinuation({ db, companyId, issueId, agentId,
          context: { interruptedRunId: runId }, summary: null, exposeLowTrustRaw: false }))
          .rejects.toThrow("continuation_source_context_missing");
      } finally {
        await db.update(heartbeatRuns).set({ contextSnapshot: source.contextSnapshot }).where(eq(heartbeatRuns.id, runId));
      }
    });
```

`build()` (`:126-135`) нь `{ interactionId, wakeReason: "connection_intent.resolved" }` context-той, interaction-ийн `sourceRunId` нь `runId` (`:105`).

- [ ] **Step 6: D2 тестийг ажиллуулж FAIL харах**

Run: `cd server && npx vitest run src/services/execution-continuation.test.ts`
Expected: "XO: resumes an issue-less source run named by the resolved interaction" нь `continuation_source_context_missing`-ээр FAIL. "XO: still rejects …" нь засвараас өмнө ч PASS (хамгаалалтын тест).

- [ ] **Step 7: D2: хэрэгжүүлэх**

`server/src/services/execution-continuation.ts`: `sourceRunId`-ийн тодорхойлолтын (`:123-128`) дараа нэм:

```ts
  // XO (Ү3-В D2): a "Run now" run carries no issueId. Accept it as the
  // continuation source only when the resolved interaction on this issue names
  // it. Explicit user continuations and retry/previous/interrupted ids stay
  // issue-scoped.
  const allowIssueLessSource =
    !explicitUserSource &&
    !!triggerInteraction?.sourceRunId &&
    triggerInteraction.sourceRunId === sourceRunId;
```

`sourceRun` асуулгын `where` (`:136-140`) дахь гурав дахь нөхцөлийг соль:

```ts
              allowIssueLessSource
                ? or(
                    sql`${heartbeatRuns.contextSnapshot} ->> 'issueId' = ${issueId}`,
                    sql`(${heartbeatRuns.contextSnapshot} ->> 'issueId') IS NULL`,
                  )
                : sql`${heartbeatRuns.contextSnapshot} ->> 'issueId' = ${issueId}`,
```

`or` нь `:1`-д аль хэдийн import хийгдсэн.

- [ ] **Step 8: D2 тестүүдийг ажиллуулж PASS харах**

Run: `cd server && npx vitest run src/services/execution-continuation.test.ts`
Expected: PASS. "rejects handoff history from a different task" (`:158`) ба "fails closed when required originating context is missing" (`:324` орчим) ногоон хэвээр.

- [ ] **Step 9: Commit**

```bash
git add server/src/services/cross-issue-influence-limit.ts server/src/__tests__/cross-issue-influence-limit.test.ts server/src/services/execution-continuation.ts server/src/services/execution-continuation.test.ts
git commit -m "fix(xo): let issue-less Run now runs write and resume within limits

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

ED B хувилбарыг сонгосон бол зөвхөн `docs/xo/ops-notes.md`-ийн workaround Task 6-ийн commit-д орно.

---

### Task 6: Порт fallback-ийн тэмдэглэл ба SYNC.md-ийн Ү3-В хүснэгт

**Files:**
- Create: `docs/xo/ops-notes.md`
- Modify: `docs/xo/SYNC.md` ("## Lockfile" (`:112`)-ийн өмнө шинэ хэсэг)

**Interfaces:**
- Consumes: Task 1-5-д хөндсөн файлуудын жагсаалт.
- Produces: баримт. Код өөрчлөгдөхгүй.

- [ ] **Step 1: ops-notes.md бич**

`docs/xo/ops-notes.md`:

````md
# XO ops notes

## Port fallback

If the requested port (default 3100, or `PORT`) is busy, the server does not fail. `detectPort` (`server/src/index.ts:679-683`) picks the next free port and logs:

```
Requested port is busy; using next free port (requestedPort=3100, selectedPort=3101)
```

(`server/src/index.ts:931-933`.) The UI and agents then live on `selectedPort`, so a bookmark or launch config pointing at 3100 shows a different instance or nothing.

What to do:

1. Read `selectedPort` from that log line.
2. Find what holds the requested port: `lsof -nP -iTCP:3100 -sTCP:LISTEN`.
3. Stop the stale process, or pin a free port explicitly with `PORT=3110` (as the `xo-y3b-test` launch config does).

XO keeps upstream behavior here. No code change.

## Outbound calls (Ү3-В)

XO turns off every call to Paperclip infrastructure unless the config opts in:

| Feature | Default | Opt in |
|---|---|---|
| Usage telemetry | off | `telemetry.enabled: true` in config |
| Announcements feed (pages.paperclip.ing) | off | `PAPERCLIP_ANNOUNCEMENTS_ENABLED=true` |
| npm update notice | off | `updates.checkEnabled: true` in config |
| Feedback trace sharing | off | set the feedback export backend URL |

`PAPERCLIP_TELEMETRY_DISABLED=1`, `DO_NOT_TRACK=1`, CI variables and `PAPERCLIP_UPDATE_CHECK=0` still win over the config.
````

ED D1-д B хувилбарыг сонгосон бол файлын төгсгөлд нэм:

```md
## Issue-less "Run now" writes

Upstream rejects cross-issue writes from a run that has no source issue (403 `cross_issue_influence_run_context_required`). Workaround: start the work from the issue itself, or comment on the issue to reopen it so the next run carries its issue id.
```

- [ ] **Step 2: SYNC.md-д Ү3-В хүснэгт нэм**

`docs/xo/SYNC.md`-ийн "## Lockfile" гарчгийн өмнө (D1, D2-д A/зөвшөөрсөн хувилбар сонгогдсон гэж үзэв, B бол Task 5-ийн мөрүүдийг хас):

```md
## Ү3-В-д хөндсөн upstream файлууд

Ү3-В (гадагш дуудлагагүй default, dev JWT, acpx 0.13.1, issue-гүй run) хөндсөн upstream замууд. Sync-д зөрчил гарвал upstream-ийн хувилбарыг аваад XO-ийн мөрүүдийг дахин нэм. XO-ийн шинэ файлууд (`packages/shared/src/telemetry/config.test.ts`, `server/src/config.telemetry.test.ts`, `server/src/dev-agent-jwt-secret.ts`, `server/src/__tests__/dev-agent-jwt-secret.test.ts`, `docs/xo/ops-notes.md`) энд ороогүй.

| Файл | Ү3-В | Өөрчлөлт |
|---|---|---|
| `packages/shared/src/telemetry/config.ts` | A | `enabled !== true` бол унтраах |
| `packages/shared/src/config-schema.ts` | A | `telemetry.enabled`, `updates.checkEnabled` default `false` |
| `packages/shared/src/telemetry/README.md` | A | XO тэмдэглэл |
| `server/src/config.ts` | A | `telemetryEnabled ?? false`, `announcementsEnabled === "true"` |
| `server/src/services/feedback-share-client.ts` | A | default URL хассан, URL-гүй бол `undefined` |
| `server/src/__tests__/feedback-share-client.test.ts` | A | default URL тестийг солиод `client!` |
| `cli/src/update-notice.ts` | A | `checkEnabled === true`, catch нь `false` |
| `cli/src/__tests__/update-notice.test.ts` | A | config-той throttle тест, config-гүй тест |
| `cli/src/commands/configure.ts`, `onboard.ts`, `worktree-lib.ts` | A | шинэ config-д `telemetry.enabled: false` |
| `cli/src/__tests__/telemetry.test.ts` | A | kill-switch env устгах, config-гүй тест |
| `README.md` | A | Telemetry хэсэг opt-in |
| `doc/ANNOUNCEMENTS.md` | A | `=true` opt-in |
| `scripts/dev-runner.ts` | B | `ensureDevAgentJwtSecret(process.env)` |
| `packages/adapter-utils/package.json` | C | acpx `0.13.1` |
| `package.json` | C | `acpx@0.12.0` patch хассан |
| `patches/acpx@0.12.0.patch` | C | устгасан |
| `scripts/acpx-patch-packaging.test.mjs` | C | зөвхөн 0.13.1 шалгана |
| `packages/adapter-utils/src/acpx-engine/execute.ts` | C | `inheritProcessEnv` → `spawnEnvironment` |
| `packages/adapter-utils/src/acpx-engine/execute.test.ts` | C | spawnEnvironment тест |
| `packages/adapter-utils/src/acpx-engine/remote-spawn-smoke.test.ts` | C | тайлбар |
| `server/src/services/cross-issue-influence-limit.ts` | D1 | issue-гүй run-ийг cap-аар тоолно |
| `server/src/__tests__/cross-issue-influence-limit.test.ts` | D1 | fail-closed тестийг XO тестээр солисон |
| `server/src/services/execution-continuation.ts` | D2 | interaction нэрлэсэн issue-гүй эх run |
| `server/src/services/execution-continuation.test.ts` | D2 | хоёр XO тест |

Upstream sync хийхдээ: upstream telemetry-ийн default-ыг өөрчилсөн эсвэл шинэ гадагш дуудлага (paperclip.ing, AWS ingest) нэмсэн эсэхийг `git diff <old>..upstream/master | grep -n "paperclip.ing\|amazonaws"`-аар шалгаж, шинэ дуудлагыг мөн opt-in болго.
```

`pnpm-lock.yaml` "## Lockfile" хэсгийн дүрмээр зохицуулагдана.

- [ ] **Step 3: Баримтыг шалгах**

Run: `grep -c "Ү3-В-д хөндсөн" docs/xo/SYNC.md && test -f docs/xo/ops-notes.md && echo ok`
Expected: `1` дараа нь `ok`.

- [ ] **Step 4: Commit**

```bash
git add docs/xo/ops-notes.md docs/xo/SYNC.md
git commit -m "docs(xo): record Ү3-В upstream touch points and port fallback

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Эцсийн шалгалт (typecheck, vitest, 3110 порт дээр гараар ажиллуулах)

**Files:**
- Код өөрчлөхгүй. Зөвхөн шалгана.

**Interfaces:**
- Consumes: Task 1-6-ийн бүх үр дүн.
- Produces: ED-д тайлагнах шалгалтын үр дүн.

- [ ] **Step 1: Typecheck**

Run:
```bash
pnpm --filter @paperclipai/shared typecheck && pnpm --filter paperclipai typecheck && pnpm --filter @paperclipai/adapter-utils typecheck && pnpm --filter @paperclipai/server typecheck
```
Expected: дөрөв нь алдаагүй. Серверийн typecheck нь `prepare:runner-vendor`-ийг эхэлж ажиллуулдаг. Тэр алхам Rust/cargo байхгүйгээс унавал `cd server && npx tsc --noEmit`-ээр орлуулж, үүнийг тайланд тэмдэглэ.

- [ ] **Step 2: Vitest**

Run:
```bash
cd packages/shared && npx vitest run && cd ../../cli && npx vitest run && cd ../packages/adapter-utils && npx vitest run src/acpx-engine && cd ../../server && npx vitest run src/config.telemetry.test.ts src/__tests__/feedback-share-client.test.ts src/__tests__/server-startup-feedback-export.test.ts src/__tests__/dev-agent-jwt-secret.test.ts src/__tests__/dev-runner-worktree.test.ts src/__tests__/cross-issue-influence-limit.test.ts src/services/execution-continuation.test.ts src/__tests__/chat-webhook-public-url.test.ts && cd .. && node --test scripts/acpx-patch-packaging.test.mjs
```
Expected: бүгд PASS. Унасан тест Ү3-В-ээс өмнө ч унадаг байсан эсэхийг `git stash` хийлгүйгээр `git worktree add /tmp/xo-y3v-base bcc78e7f9` дээр ажиллуулж шалгаад тайланд хоёуланг нь бич.

- [ ] **Step 3: Instance-ийн хуучин telemetry хавтсыг нөөцлөх**

```bash
mv ~/.paperclip/instances/y3b-test/telemetry ~/.paperclip/instances/y3b-test/telemetry.bak-20261011
```
Expected: алдаагүй. `ls ~/.paperclip/instances/y3b-test` дээр `telemetry` байхгүй, `telemetry.bak-20261011` байна.

- [ ] **Step 4: "xo-y3b-test"-ийг env kill-switch-гүйгээр 3110 дээр асаах**

Bash tool-ын `run_in_background`-оор ажиллуул:

```bash
env -u PAPERCLIP_TELEMETRY_DISABLED -u DO_NOT_TRACK PAPERCLIP_INSTANCE_ID=y3b-test PAPERCLIP_RUNNER_BINARY=/usr/bin/false PORT=3110 TMPDIR=/tmp pnpm dev:once > /tmp/xo-y3v-dev.log 2>&1
```

Дараа нь Monitor-оор хүлээ:

```bash
until curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3110/api/health | grep -q 200; do sleep 3; done; echo ready
```
Expected: `ready`. Лог дээр `[paperclip] created PAPERCLIP_AGENT_JWT_SECRET in …/y3b-test/.env (dev only)` мөр гарна (instance-д `.env` аль хэдийн нууцтай байсан бол гарахгүй).

- [ ] **Step 5: Гадагш дуудлага ба telemetry хавтас байхгүйг шалгах**

UI-г `http://127.0.0.1:3110` дээр нэг удаа нээ (`curl -s http://127.0.0.1:3110/ > /dev/null` хангалттай), 30 секунд хүлээгээд:

```bash
test -d ~/.paperclip/instances/y3b-test/telemetry && echo "FAIL telemetry dir" || echo "ok no telemetry dir"
grep -c "paperclip.ing" /tmp/xo-y3v-dev.log
PID=$(lsof -nP -iTCP:3110 -sTCP:LISTEN -t | head -1); lsof -nP -a -p "$PID" -iTCP -sTCP:ESTABLISHED | grep -v -E '127\.0\.0\.1|\[::1\]|localhost' | tail -n +2
grep -c '^PAPERCLIP_AGENT_JWT_SECRET=' ~/.paperclip/instances/y3b-test/.env
```
Expected:
- `ok no telemetry dir`
- `0`
- хоосон (loopback-аас өөр ESTABLISHED холболт байхгүй)
- `1`

Лог дахь `.env` зам `~/.paperclip/instances/y3b-test/.env`-ээс өөр байвал сүүлийн командыг тэр замаар ажиллуул. Нууцын утгыг хэзээ ч `cat` эсвэл `grep`-ээр хэвлэхгүй, зөвхөн `-c`.

- [ ] **Step 6: Серверийг зогсоож, тайлан бэлдэх**

Background процессыг TaskStop-оор зогсоо. `git log --oneline bcc78e7f9..HEAD` ба Step 1-5-ийн үр дүнг ED-д товч тайлагна. Push хийхгүй, ED-ийн зөвшөөрлийг хүлээ. Push-ийн өмнө `find .git/refs -name '* 2*'` хоосон байх ёстой.

---

## Self-Review

**Spec coverage:**
- A (telemetry ба Paperclip-ийн дэд бүтэц рүү гарах дуудлага default унтраалттай): Task 1 (telemetry: shared, schema, server, CLI бичигчид, баримт), Task 2 (announcements, npm update notice, feedback share telemetry.paperclip.ing), Task 6 (ops-notes хүснэгт, SYNC шалгах дүрэм), Task 7 Step 5 (бодит шалгалт).
- B (dev agent JWT secret): Task 3.
- C (acpx 0.13.1): Task 4, шийдвэрийн цэг C-тэй.
- D (issue-гүй Run now 403 ба continuation): Task 5, шийдвэрийн цэг D1, D2-той.
- E (порт fallback баримт): Task 6 Step 1.
- Эцсийн шалгалт (typecheck, vitest, 3110 гар ажиллуулалт, paperclip.ing руу юу ч хүрэхгүй, telemetry хавтас үүсэхгүй): Task 7.

**Placeholder scan:** "TBD", "TODO", "implement later" байхгүй. Task 2 Step 3-ийн feedback factory дахь "…factory-гийн үлдсэн хэсэг өөрчлөлтгүй" нь өөрчлөгдөхгүй кодыг заасан, шинэ код бүрэн бичигдсэн. Task 1 Step 13-ийн CLI тестийн файлын нэрийг `ls`-ээр баталгаажуулах заавартай.

**Name consistency:** `ensureDevAgentJwtSecret(env, envFilePath?)` Task 3-ийн Interfaces, код, тест, dev-runner дуудлагад ижил. `resolveTelemetryConfig`, `telemetryConfigSchema`, `updatesConfigSchema`, `loadConfig().telemetryEnabled`, `loadConfig().announcementsEnabled`, `createFeedbackTraceShareClientFromConfig`, `isUpdateNoticeEnabled`, `checkForUpdateNotice`, `observeCrossIssueInfluence`, `buildExecutionContinuation`, `allowIssueLessSource`, `spawnEnvironment` нь бүх task-д нэг нэрээр. Тестийн туслахууд `isolate()`, `writeConfig()` Task 1-д тодорхойлогдож Task 2-т ашиглагдана.
