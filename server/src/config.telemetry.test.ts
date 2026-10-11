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
