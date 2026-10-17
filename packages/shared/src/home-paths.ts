import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { readBrandEnv } from "./xo-brand-env.js";

export const DEFAULT_PAPERCLIP_INSTANCE_ID = "default";
export const PAPERCLIP_CONFIG_BASENAME = "config.json";
export const PAPERCLIP_ENV_FILENAME = ".env";

const PATH_SEGMENT_RE = /^[a-zA-Z0-9_-]+$/;

export function expandHomePrefix(value: string): string {
  const branded = resolveBrandHomeLiteral(value);
  if (branded !== value) return branded;
  if (value === "~") return os.homedir();
  if (value.startsWith("~/")) return path.resolve(os.homedir(), value.slice(2));
  return value;
}

export function resolveDefaultBrandHomeDir(userHome: string = os.homedir()): string {
  const xoHome = path.resolve(userHome, ".xo");
  if (fs.existsSync(xoHome)) return xoHome;
  const legacyHome = path.resolve(userHome, ".paperclip");
  if (fs.existsSync(legacyHome)) return legacyHome;
  return xoHome;
}

export function resolveDefaultBrandWorktreesDir(userHome: string = os.homedir()): string {
  const xoDir = path.resolve(userHome, ".xo-worktrees");
  if (fs.existsSync(xoDir)) return xoDir;
  const legacyDir = path.resolve(userHome, ".paperclip-worktrees");
  if (fs.existsSync(legacyDir)) return legacyDir;
  return xoDir;
}

// Schema-ийн анхдагч "~/.xo/..." литерал: ~/.xo байхгүй, ~/.paperclip байвал хуучин хавтас руу.
// Хэрэглэгчийн бичсэн "~/.paperclip/..." замд хүрэхгүй.
const XO_HOME_LITERAL_RE = /^~\/\.xo(?=\/|$)/;
const XO_WORKTREES_LITERAL_RE = /^~\/\.xo-worktrees(?=\/|$)/;

export function resolveBrandHomeLiteral(value: string, userHome: string = os.homedir()): string {
  const worktrees = XO_WORKTREES_LITERAL_RE.exec(value);
  if (worktrees) return path.join(resolveDefaultBrandWorktreesDir(userHome), value.slice(worktrees[0].length));
  const home = XO_HOME_LITERAL_RE.exec(value);
  if (home) return path.join(resolveDefaultBrandHomeDir(userHome), value.slice(home[0].length));
  return value;
}

export function resolvePaperclipHomeDir(homeOverride?: string): string {
  const raw = homeOverride?.trim() || readBrandEnv("HOME")?.trim();
  if (raw) return path.resolve(expandHomePrefix(raw));
  return resolveDefaultBrandHomeDir();
}

export function resolvePaperclipInstanceId(instanceIdOverride?: string): string {
  const raw = instanceIdOverride?.trim() || readBrandEnv("INSTANCE_ID")?.trim() || DEFAULT_PAPERCLIP_INSTANCE_ID;
  if (!PATH_SEGMENT_RE.test(raw)) {
    throw new Error(`Invalid XO_INSTANCE_ID / PAPERCLIP_INSTANCE_ID '${raw}'.`);
  }
  return raw;
}

export function resolvePaperclipInstanceRoot(input: {
  homeDir?: string;
  instanceId?: string;
} = {}): string {
  return path.resolve(resolvePaperclipHomeDir(input.homeDir), "instances", resolvePaperclipInstanceId(input.instanceId));
}

export function resolvePaperclipInstanceConfigPath(input: {
  homeDir?: string;
  instanceId?: string;
} = {}): string {
  return path.resolve(resolvePaperclipInstanceRoot(input), PAPERCLIP_CONFIG_BASENAME);
}

export function resolvePaperclipConfigPathForInstance(input: {
  homeDir?: string;
  instanceId?: string;
} = {}): string {
  return resolvePaperclipInstanceConfigPath(input);
}

export function resolvePaperclipEnvPathForConfig(configPath: string): string {
  return path.resolve(path.dirname(configPath), PAPERCLIP_ENV_FILENAME);
}

export function resolveDefaultEmbeddedPostgresDir(input: {
  homeDir?: string;
  instanceId?: string;
} = {}): string {
  return path.resolve(resolvePaperclipInstanceRoot(input), "db");
}

export function resolveDefaultLogsDir(input: {
  homeDir?: string;
  instanceId?: string;
} = {}): string {
  return path.resolve(resolvePaperclipInstanceRoot(input), "logs");
}

export function resolveDefaultSecretsKeyFilePath(input: {
  homeDir?: string;
  instanceId?: string;
} = {}): string {
  return path.resolve(resolvePaperclipInstanceRoot(input), "secrets", "master.key");
}

export function resolveDefaultStorageDir(input: {
  homeDir?: string;
  instanceId?: string;
} = {}): string {
  return path.resolve(resolvePaperclipInstanceRoot(input), "data", "storage");
}

export function resolveDefaultBackupDir(input: {
  homeDir?: string;
  instanceId?: string;
} = {}): string {
  return path.resolve(resolvePaperclipInstanceRoot(input), "data", "backups");
}

export function resolveHomeAwarePath(value: string): string {
  return path.resolve(expandHomePrefix(value));
}
