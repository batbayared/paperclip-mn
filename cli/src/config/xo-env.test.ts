import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { applyXoEnvAliases, setBrandEnv } from "@paperclipai/shared/xo-brand-env";
import { resolvePaperclipInstanceId } from "./home.js";
import { resolveConfigPath } from "./store.js";
import { loadAgentJwtEnvFile } from "./env.js";

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe("CLI env file XO aliases", () => {
  it("aliases XO_* values loaded from an env file", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "xo-cli-env-"));
    const file = path.join(dir, ".env");
    fs.writeFileSync(file, "XO_SHIM_TEST_VALUE=from-xo\n");
    delete process.env.PAPERCLIP_SHIM_TEST_VALUE;
    delete process.env.XO_SHIM_TEST_VALUE;
    loadAgentJwtEnvFile(file);
    expect(process.env.PAPERCLIP_SHIM_TEST_VALUE).toBe("from-xo");
  });

  it("explicit --instance flag wins over ambient XO_INSTANCE_ID", () => {
    process.env.XO_INSTANCE_ID = "ambient-a";
    process.env.PAPERCLIP_INSTANCE_ID = "ambient-a";
    setBrandEnv("INSTANCE_ID", "flag-b");
    expect(resolvePaperclipInstanceId()).toBe("flag-b");
    applyXoEnvAliases();
    expect(process.env.PAPERCLIP_INSTANCE_ID).toBe("flag-b");
  });

  it("explicit --config flag wins over ambient XO_CONFIG", () => {
    process.env.XO_CONFIG = "/tmp/ambient/config.json";
    process.env.PAPERCLIP_CONFIG = "/tmp/ambient/config.json";
    setBrandEnv("CONFIG", "/tmp/flag/config.json");
    applyXoEnvAliases();
    expect(resolveConfigPath()).toBe(path.resolve("/tmp/flag/config.json"));
  });
});
