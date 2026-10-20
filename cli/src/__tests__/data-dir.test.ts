import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { applyDataDirOverride } from "../config/data-dir.js";
import { resolvePaperclipHomeDir } from "../config/home.js";

const ORIGINAL_ENV = { ...process.env };

describe("applyDataDirOverride", () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    delete process.env.PAPERCLIP_HOME;
    delete process.env.PAPERCLIP_CONFIG;
    delete process.env.PAPERCLIP_CONTEXT;
    delete process.env.PAPERCLIP_INSTANCE_ID;
    for (const key of ["XO_HOME", "XO_CONFIG", "XO_CONTEXT", "XO_INSTANCE_ID"]) delete process.env[key];
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it("sets PAPERCLIP_HOME and isolated default config/context paths", () => {
    const home = applyDataDirOverride({
      dataDir: "~/paperclip-data",
      config: undefined,
      context: undefined,
    }, { hasConfigOption: true, hasContextOption: true });

    const expectedHome = path.resolve(os.homedir(), "paperclip-data");
    expect(home).toBe(expectedHome);
    expect(process.env.PAPERCLIP_HOME).toBe(expectedHome);
    expect(process.env.PAPERCLIP_CONFIG).toBe(
      path.resolve(expectedHome, "instances", "default", "config.json"),
    );
    expect(process.env.PAPERCLIP_CONTEXT).toBe(path.resolve(expectedHome, "context.json"));
    expect(process.env.PAPERCLIP_INSTANCE_ID).toBe("default");
  });

  it("uses the provided instance id when deriving default config path", () => {
    const home = applyDataDirOverride({
      dataDir: "/tmp/paperclip-alt",
      instance: "dev_1",
      config: undefined,
      context: undefined,
    }, { hasConfigOption: true, hasContextOption: true });

    expect(home).toBe(path.resolve("/tmp/paperclip-alt"));
    expect(process.env.PAPERCLIP_INSTANCE_ID).toBe("dev_1");
    expect(process.env.PAPERCLIP_CONFIG).toBe(
      path.resolve("/tmp/paperclip-alt", "instances", "dev_1", "config.json"),
    );
  });

  it("does not override explicit config/context settings", () => {
    process.env.PAPERCLIP_CONFIG = "/env/config.json";
    process.env.PAPERCLIP_CONTEXT = "/env/context.json";

    applyDataDirOverride({
      dataDir: "/tmp/paperclip-alt",
      config: "/flag/config.json",
      context: "/flag/context.json",
    }, { hasConfigOption: true, hasContextOption: true });

    expect(process.env.PAPERCLIP_CONFIG).toBe("/env/config.json");
    expect(process.env.PAPERCLIP_CONTEXT).toBe("/env/context.json");
  });

  it("only applies defaults for options supported by the command", () => {
    applyDataDirOverride(
      {
        dataDir: "/tmp/paperclip-alt",
      },
      { hasConfigOption: false, hasContextOption: false },
    );

    expect(process.env.PAPERCLIP_HOME).toBe(path.resolve("/tmp/paperclip-alt"));
    expect(process.env.PAPERCLIP_CONFIG).toBeUndefined();
    expect(process.env.PAPERCLIP_CONTEXT).toBeUndefined();
  });

  it("--data-dir beats an ambient XO_HOME by also setting XO_*", () => {
    process.env.XO_HOME = "/a";
    process.env.XO_INSTANCE_ID = "ambient";

    applyDataDirOverride(
      { dataDir: "/b" },
      { hasConfigOption: true, hasContextOption: true },
    );

    expect(process.env.XO_HOME).toBe(path.resolve("/b"));
    expect(process.env.PAPERCLIP_HOME).toBe(path.resolve("/b"));
    expect(resolvePaperclipHomeDir()).toBe(path.resolve("/b"));
    expect(process.env.XO_INSTANCE_ID).toBe(process.env.PAPERCLIP_INSTANCE_ID);
    expect(process.env.XO_CONFIG).toBe(process.env.PAPERCLIP_CONFIG);
    expect(process.env.XO_CONTEXT).toBe(process.env.PAPERCLIP_CONTEXT);
  });
});

describe("applyDataDirOverride with XO_ overrides", () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    delete process.env.PAPERCLIP_CONFIG;
    delete process.env.PAPERCLIP_CONTEXT;
    delete process.env.XO_CONFIG;
    delete process.env.XO_CONTEXT;
  });

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it("keeps an explicit XO_CONFIG instead of deriving one from --data-dir", () => {
    process.env.XO_CONFIG = "/custom/xo-config.json";
    applyDataDirOverride({ dataDir: "/tmp/xo-data" }, { hasConfigOption: true });
    expect(process.env.XO_CONFIG).toBe("/custom/xo-config.json");
    expect(process.env.PAPERCLIP_CONFIG).toBeUndefined();
  });

  it("keeps an explicit legacy PAPERCLIP_CONFIG when XO_CONFIG is unset", () => {
    process.env.PAPERCLIP_CONFIG = "/legacy/config.json";
    applyDataDirOverride({ dataDir: "/tmp/xo-data" }, { hasConfigOption: true });
    expect(process.env.PAPERCLIP_CONFIG).toBe("/legacy/config.json");
    expect(process.env.XO_CONFIG).toBeUndefined();
  });

  it("keeps an explicit XO_CONTEXT", () => {
    process.env.XO_CONTEXT = "/custom/xo-context.json";
    applyDataDirOverride({ dataDir: "/tmp/xo-data" }, { hasContextOption: true });
    expect(process.env.XO_CONTEXT).toBe("/custom/xo-context.json");
    expect(process.env.PAPERCLIP_CONTEXT).toBeUndefined();
  });
});
