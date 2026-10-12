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
});
