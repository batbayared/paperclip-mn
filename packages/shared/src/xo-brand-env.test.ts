import { describe, expect, it } from "vitest";
import {
  applyXoEnvAliases,
  brandEnvSuffix,
  isBrandRuntimeEnvKey,
  mirrorPaperclipEnvToXo,
  readBrandEnv,
} from "./xo-brand-env.js";

describe("brandEnvSuffix", () => {
  it("strips the PAPERCLIP_ and XO_ prefixes", () => {
    expect(brandEnvSuffix("PAPERCLIP_API_URL")).toBe("API_URL");
    expect(brandEnvSuffix("XO_API_URL")).toBe("API_URL");
  });

  it("returns null for other keys", () => {
    expect(brandEnvSuffix("PATH")).toBeNull();
    expect(brandEnvSuffix("PAPERCLIPAI_CMD")).toBeNull();
    expect(brandEnvSuffix("XOX")).toBeNull();
  });
});

describe("isBrandRuntimeEnvKey", () => {
  it("accepts both prefixes", () => {
    expect(isBrandRuntimeEnvKey("PAPERCLIP_AGENT_ID")).toBe(true);
    expect(isBrandRuntimeEnvKey("XO_AGENT_ID")).toBe(true);
    expect(isBrandRuntimeEnvKey("HOME")).toBe(false);
  });
});

describe("readBrandEnv", () => {
  it("prefers XO_ over PAPERCLIP_", () => {
    expect(readBrandEnv("HOME", { XO_HOME: "/x", PAPERCLIP_HOME: "/p" })).toBe("/x");
  });

  it("falls back to PAPERCLIP_ when XO_ is missing or blank", () => {
    expect(readBrandEnv("HOME", { PAPERCLIP_HOME: "/p" })).toBe("/p");
    expect(readBrandEnv("HOME", { XO_HOME: "  ", PAPERCLIP_HOME: "/p" })).toBe("/p");
  });

  it("returns undefined when neither is set", () => {
    expect(readBrandEnv("HOME", {})).toBeUndefined();
  });
});

describe("applyXoEnvAliases", () => {
  it("copies XO_X onto PAPERCLIP_X and XO wins", () => {
    const env: Record<string, string | undefined> = {
      XO_HOME: "/x",
      PAPERCLIP_HOME: "/p",
      XO_INSTANCE_ID: "dev",
    };
    applyXoEnvAliases(env);
    expect(env.PAPERCLIP_HOME).toBe("/x");
    expect(env.PAPERCLIP_INSTANCE_ID).toBe("dev");
  });

  it("skips XO-native keys and blank values", () => {
    const env: Record<string, string | undefined> = {
      XO_I18N_TRANSFORM: "1",
      XO_SCREENSHOTS: "1",
      XO_PORT: " ",
    };
    applyXoEnvAliases(env);
    expect(Object.keys(env).sort()).toEqual(["XO_I18N_TRANSFORM", "XO_PORT", "XO_SCREENSHOTS"]);
  });

  it("leaves PAPERCLIP_-only env untouched", () => {
    const env: Record<string, string | undefined> = { PAPERCLIP_HOME: "/p" };
    applyXoEnvAliases(env);
    expect(env).toEqual({ PAPERCLIP_HOME: "/p" });
  });
});

describe("mirrorPaperclipEnvToXo", () => {
  it("adds XO_X for each PAPERCLIP_X without mutating the input", () => {
    const input = { PAPERCLIP_API_URL: "http://a", PATH: "/bin" };
    const out = mirrorPaperclipEnvToXo(input);
    expect(out).toEqual({ PAPERCLIP_API_URL: "http://a", XO_API_URL: "http://a", PATH: "/bin" });
    expect(input).toEqual({ PAPERCLIP_API_URL: "http://a", PATH: "/bin" });
  });

  it("overwrites a stale XO_X with the PAPERCLIP_X value", () => {
    const out = mirrorPaperclipEnvToXo({ PAPERCLIP_TASK_ID: "new", XO_TASK_ID: "old" });
    expect(out.XO_TASK_ID).toBe("new");
  });
});

describe("native XO keys", () => {
  it("are not brand runtime keys", () => {
    expect(isBrandRuntimeEnvKey("XO_I18N_TRANSFORM")).toBe(false);
    expect(isBrandRuntimeEnvKey("XO_SCREENSHOTS")).toBe(false);
    expect(isBrandRuntimeEnvKey("XO_HOME")).toBe(true);
  });
});

describe("mirrorPaperclipEnvToXo blank values", () => {
  it("does not copy blank PAPERCLIP_ values", () => {
    const out = mirrorPaperclipEnvToXo({ PAPERCLIP_HOME: "  ", PAPERCLIP_RUN_ID: "r1" });
    expect(out.XO_HOME).toBeUndefined();
    expect(out.XO_RUN_ID).toBe("r1");
  });
});
