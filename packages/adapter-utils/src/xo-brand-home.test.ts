import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { resolvePaperclipInstanceRootForAdapter } from "./server-utils.js";

describe("resolvePaperclipInstanceRootForAdapter with XO env", () => {
  it("uses XO_HOME and XO_INSTANCE_ID from the given env", () => {
    const xoHome = fs.mkdtempSync(path.join(os.tmpdir(), "xo-adapter-home-"));
    const root = resolvePaperclipInstanceRootForAdapter({
      env: { XO_HOME: xoHome, PAPERCLIP_HOME: "/nope", XO_INSTANCE_ID: "xo-dev" },
    });
    expect(root).toBe(path.join(xoHome, "instances", "xo-dev"));
  });

  it("still honours PAPERCLIP_HOME alone", () => {
    const legacyHome = fs.mkdtempSync(path.join(os.tmpdir(), "xo-adapter-legacy-"));
    const root = resolvePaperclipInstanceRootForAdapter({ env: { PAPERCLIP_HOME: legacyHome } });
    expect(root).toBe(path.join(legacyHome, "instances", "default"));
  });
});
