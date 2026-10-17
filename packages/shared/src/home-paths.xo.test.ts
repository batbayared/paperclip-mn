import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  resolveBrandHomeLiteral,
  resolveDefaultBrandWorktreesDir,
  resolvePaperclipInstanceId,
} from "./home-paths.js";

let userHome: string;

beforeEach(() => {
  userHome = fs.mkdtempSync(path.join(os.tmpdir(), "xo-home-"));
});

afterEach(() => {
  fs.rmSync(userHome, { recursive: true, force: true });
});

describe("resolveDefaultBrandWorktreesDir", () => {
  it("defaults to ~/.xo-worktrees when neither exists", () => {
    expect(resolveDefaultBrandWorktreesDir(userHome)).toBe(path.join(userHome, ".xo-worktrees"));
  });

  it("falls back to an existing ~/.paperclip-worktrees", () => {
    fs.mkdirSync(path.join(userHome, ".paperclip-worktrees"));
    expect(resolveDefaultBrandWorktreesDir(userHome)).toBe(path.join(userHome, ".paperclip-worktrees"));
  });

  it("prefers ~/.xo-worktrees when both exist", () => {
    fs.mkdirSync(path.join(userHome, ".paperclip-worktrees"));
    fs.mkdirSync(path.join(userHome, ".xo-worktrees"));
    expect(resolveDefaultBrandWorktreesDir(userHome)).toBe(path.join(userHome, ".xo-worktrees"));
  });
});

describe("resolveBrandHomeLiteral", () => {
  it("maps ~/.xo/... to the legacy home when only ~/.paperclip exists", () => {
    fs.mkdirSync(path.join(userHome, ".paperclip"));
    expect(resolveBrandHomeLiteral("~/.xo/instances/default/db", userHome)).toBe(
      path.join(userHome, ".paperclip", "instances", "default", "db"),
    );
  });

  it("maps ~/.xo/... to ~/.xo when nothing exists", () => {
    expect(resolveBrandHomeLiteral("~/.xo/instances/default/db", userHome)).toBe(
      path.join(userHome, ".xo", "instances", "default", "db"),
    );
  });

  it("maps bare ~/.xo and ~/.xo-worktrees", () => {
    fs.mkdirSync(path.join(userHome, ".paperclip-worktrees"));
    expect(resolveBrandHomeLiteral("~/.xo", userHome)).toBe(path.join(userHome, ".xo"));
    expect(resolveBrandHomeLiteral("~/.xo-worktrees/a", userHome)).toBe(
      path.join(userHome, ".paperclip-worktrees", "a"),
    );
  });

  it("leaves explicit ~/.paperclip and other paths alone", () => {
    expect(resolveBrandHomeLiteral("~/.paperclip/instances/default/db", userHome)).toBe(
      "~/.paperclip/instances/default/db",
    );
    expect(resolveBrandHomeLiteral("~/.xoxo/a", userHome)).toBe("~/.xoxo/a");
    expect(resolveBrandHomeLiteral("/abs/path", userHome)).toBe("/abs/path");
  });
});

describe("resolvePaperclipInstanceId", () => {
  it("names both env vars in the error", () => {
    expect(() => resolvePaperclipInstanceId("bad id")).toThrow("Invalid XO_INSTANCE_ID / PAPERCLIP_INSTANCE_ID 'bad id'.");
  });
});
