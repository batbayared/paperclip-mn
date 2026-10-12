import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
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
});
