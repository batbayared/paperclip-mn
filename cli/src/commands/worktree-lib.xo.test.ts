import { describe, expect, it } from "vitest";
import { DEFAULT_WORKTREE_HOME } from "./worktree-lib.js";

describe("DEFAULT_WORKTREE_HOME", () => {
  it("uses the XO brand literal", () => {
    expect(DEFAULT_WORKTREE_HOME).toBe("~/.xo-worktrees");
  });
});
