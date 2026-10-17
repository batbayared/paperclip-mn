import { describe, expect, it } from "vitest";
import { sanitizeRuntimeServiceBaseEnv } from "./workspace-runtime.js";

describe("sanitizeRuntimeServiceBaseEnv", () => {
  it("drops parent XO_* as well as PAPERCLIP_* keys", () => {
    const out = sanitizeRuntimeServiceBaseEnv({
      PATH: "/bin",
      PAPERCLIP_HOME: "/p",
      XO_HOME: "/x",
      XO_INSTANCE_ID: "dev",
    });
    expect(out.PATH).toBe("/bin");
    expect(out.PAPERCLIP_HOME).toBeUndefined();
    expect(out.XO_HOME).toBeUndefined();
    expect(out.XO_INSTANCE_ID).toBeUndefined();
  });

  it("keeps native XO_ keys", () => {
    const out = sanitizeRuntimeServiceBaseEnv({ XO_I18N_TRANSFORM: "1", XO_HOME: "/x" });
    expect(out.XO_I18N_TRANSFORM).toBe("1");
    expect(out.XO_HOME).toBeUndefined();
  });
});
