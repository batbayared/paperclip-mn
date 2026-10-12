import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  resolveDefaultBackupDir,
  resolveDefaultBrandHomeDir,
  resolveDefaultEmbeddedPostgresDir,
  resolveDefaultLogsDir,
  resolveDefaultSecretsKeyFilePath,
  resolveDefaultStorageDir,
  resolvePaperclipConfigPathForInstance,
  resolvePaperclipHomeDir,
  resolvePaperclipInstanceId,
  resolvePaperclipInstanceRoot,
} from "./home-paths.js";

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe("home path resolution", () => {
  it("resolves config and runtime data directly under the instance root", () => {
    const home = fs.mkdtempSync(path.join(os.tmpdir(), "paperclip-home-paths-"));
    process.env.PAPERCLIP_HOME = home;
    delete process.env.PAPERCLIP_INSTANCE_ID;

    const instanceRoot = path.join(home, "instances", "default");
    expect(resolvePaperclipInstanceRoot()).toBe(instanceRoot);
    expect(resolvePaperclipConfigPathForInstance()).toBe(path.join(instanceRoot, "config.json"));
    expect(resolveDefaultEmbeddedPostgresDir()).toBe(path.join(instanceRoot, "db"));
    expect(resolveDefaultBackupDir()).toBe(path.join(instanceRoot, "data", "backups"));
    expect(resolveDefaultLogsDir()).toBe(path.join(instanceRoot, "logs"));
    expect(resolveDefaultStorageDir()).toBe(path.join(instanceRoot, "data", "storage"));
    expect(resolveDefaultSecretsKeyFilePath()).toBe(path.join(instanceRoot, "secrets", "master.key"));
  });
});

describe("XO brand home resolution", () => {
  it("prefers XO_HOME over PAPERCLIP_HOME", () => {
    const xoHome = fs.mkdtempSync(path.join(os.tmpdir(), "xo-home-"));
    process.env.XO_HOME = xoHome;
    process.env.PAPERCLIP_HOME = path.join(os.tmpdir(), "should-not-be-used");
    expect(resolvePaperclipHomeDir()).toBe(xoHome);
  });

  it("prefers XO_INSTANCE_ID over PAPERCLIP_INSTANCE_ID", () => {
    process.env.XO_INSTANCE_ID = "xo-dev";
    process.env.PAPERCLIP_INSTANCE_ID = "legacy";
    expect(resolvePaperclipInstanceId()).toBe("xo-dev");
  });

  it("defaults to ~/.xo on a fresh machine", () => {
    const userHome = fs.mkdtempSync(path.join(os.tmpdir(), "xo-user-"));
    expect(resolveDefaultBrandHomeDir(userHome)).toBe(path.join(userHome, ".xo"));
  });

  it("keeps using an existing ~/.paperclip when ~/.xo is missing", () => {
    const userHome = fs.mkdtempSync(path.join(os.tmpdir(), "xo-user-"));
    fs.mkdirSync(path.join(userHome, ".paperclip"));
    expect(resolveDefaultBrandHomeDir(userHome)).toBe(path.join(userHome, ".paperclip"));
  });

  it("prefers ~/.xo when both exist", () => {
    const userHome = fs.mkdtempSync(path.join(os.tmpdir(), "xo-user-"));
    fs.mkdirSync(path.join(userHome, ".paperclip"));
    fs.mkdirSync(path.join(userHome, ".xo"));
    expect(resolveDefaultBrandHomeDir(userHome)).toBe(path.join(userHome, ".xo"));
  });
});
