import { afterEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_ENV = { ...process.env };

function restoreEnv() {
  for (const key of Object.keys(process.env)) {
    if (!(key in ORIGINAL_ENV)) delete process.env[key];
  }
  Object.assign(process.env, ORIGINAL_ENV);
}

afterEach(() => {
  restoreEnv();
  vi.resetModules();
});

describe("server config XO env shim", () => {
  it("aliases XO_* onto PAPERCLIP_* when config.ts loads", async () => {
    process.env.XO_INSTANCE_ID = "xo-shim-test";
    process.env.PAPERCLIP_INSTANCE_ID = "legacy";
    vi.resetModules();
    await import("./config.js");
    expect(process.env.PAPERCLIP_INSTANCE_ID).toBe("xo-shim-test");
  });

  it("does not alias XO-native keys", async () => {
    delete process.env.PAPERCLIP_I18N_TRANSFORM;
    process.env.XO_I18N_TRANSFORM = "1";
    vi.resetModules();
    await import("./config.js");
    expect(process.env.PAPERCLIP_I18N_TRANSFORM).toBeUndefined();
  });
});
