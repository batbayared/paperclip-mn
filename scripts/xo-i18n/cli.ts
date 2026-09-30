import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

import { XO_TRANSFORM_FILES } from "./tiers";
import { harvestExplicitKeys, transformSource, type ExtractedString, type ManualCase } from "./transform";

const REPO_ROOT = fileURLToPath(new URL("../..", import.meta.url));
const XO_DIR = join(REPO_ROOT, "ui", "src", "i18n", "xo");
const EN_FILE = join(XO_DIR, "en.json");
const MN_FILE = join(XO_DIR, "mn.json");
const KEEP_EN_FILE = join(XO_DIR, "keep-en.json");
const STATUS_FILE = join(REPO_ROOT, "scripts", "xo-i18n", "status.json");
const EMIT_DIR = join(REPO_ROOT, "scripts", "xo-i18n", ".emit");
const UI_SRC = join(REPO_ROOT, "ui", "src");

type Catalog = Record<string, string>;

function readJson<T>(file: string, fallback: T): T {
  if (!existsSync(file)) return fallback;
  return JSON.parse(readFileSync(file, "utf8")) as T;
}

function writeJson(file: string, value: unknown): void {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function sortCatalog(catalog: Catalog): Catalog {
  const sorted: Catalog = {};
  for (const key of Object.keys(catalog).sort((a, b) => a.localeCompare(b, "en"))) {
    sorted[key] = catalog[key];
  }
  return sorted;
}

function toPosix(path: string): string {
  return path.split(sep).join("/");
}

function listUiSources(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      listUiSources(full, out);
    } else if (/\.tsx?$/.test(entry) && !/\.(test|stories|d)\./.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

interface ExtractResult {
  en: Catalog;
  manual: ManualCase[];
  transformed: Map<string, string>;
  byFile: Record<string, number>;
  files: string[];
  keyFiles: Map<string, Set<string>>;
}

function extractAll(): ExtractResult {
  const en: Catalog = {};
  const manual: ManualCase[] = [];
  const transformed = new Map<string, string>();
  const byFile: Record<string, number> = {};
  const keyFiles = new Map<string, Set<string>>();

  const record = (strings: ExtractedString[], rel: string): void => {
    for (const item of strings) {
      const entries: Array<[string, string]> = item.plural
        ? [
            [`${item.key}_one`, item.plural.one],
            [`${item.key}_other`, item.plural.other],
          ]
        : [[item.key, item.key]];
      for (const [catalogKey, value] of entries) {
        en[catalogKey] = value;
        const owners = keyFiles.get(catalogKey) ?? new Set<string>();
        owners.add(rel);
        keyFiles.set(catalogKey, owners);
      }
    }
    byFile[rel] = (byFile[rel] ?? 0) + strings.length;
  };

  const files: string[] = [];
  const transformSet = new Set<string>(XO_TRANSFORM_FILES);
  for (const rel of XO_TRANSFORM_FILES) {
    const abs = join(REPO_ROOT, rel);
    if (!existsSync(abs)) {
      console.error(`xo:i18n: tiers.ts дахь файл олдсонгүй: ${rel}`);
      process.exit(1);
    }
    const result = transformSource(readFileSync(abs, "utf8"), rel);
    record(result.strings, rel);
    manual.push(...result.manual);
    if (result.changed) transformed.set(rel, result.code);
    files.push(rel);
  }

  for (const abs of listUiSources(UI_SRC)) {
    const rel = toPosix(relative(REPO_ROOT, abs));
    if (transformSet.has(rel)) continue;
    const strings = harvestExplicitKeys(readFileSync(abs, "utf8"), rel);
    if (strings.length > 0) record(strings, rel);
  }

  return { en: sortCatalog(en), manual, transformed, byFile, files, keyFiles };
}

function isUntranslated(key: string, en: Catalog, mn: Catalog, keepEn: Set<string>): boolean {
  return !(key in mn) || (mn[key] === en[key] && !keepEn.has(key));
}

function runExtract(): void {
  const { en, manual, byFile, files } = extractAll();
  const previousEn = readJson<Catalog>(EN_FILE, {});
  const previousMn = readJson<Catalog>(MN_FILE, {});
  const keepEn = new Set(readJson<string[]>(KEEP_EN_FILE, []));

  const mn: Catalog = {};
  for (const key of Object.keys(en)) {
    mn[key] = previousMn[key] ?? en[key];
  }
  const orphan = Object.keys(previousEn).filter((key) => !(key in en));
  const untranslated = Object.keys(en).filter((key) => isUntranslated(key, en, mn, keepEn));

  writeJson(EN_FILE, en);
  writeJson(MN_FILE, sortCatalog(mn));
  writeJson(STATUS_FILE, {
    generatedAt: new Date().toISOString(),
    files,
    keys: Object.keys(en).length,
    untranslated,
    orphan,
    manual,
    byFile,
  });
  console.log(
    `xo:i18n extract: files=${files.length} keys=${Object.keys(en).length} untranslated=${untranslated.length} orphan=${orphan.length} manual=${manual.length}`,
  );
}

function runCheck(): void {
  const { en, manual } = extractAll();
  const currentEn = readJson<Catalog>(EN_FILE, {});
  const mn = readJson<Catalog>(MN_FILE, {});
  const keepEn = new Set(readJson<string[]>(KEEP_EN_FILE, []));
  const problems: string[] = [];

  const added = Object.keys(en).filter((key) => !(key in currentEn));
  const stale = Object.keys(currentEn).filter((key) => !(key in en));
  if (added.length > 0 || stale.length > 0) {
    problems.push(
      `en.json хуучирсан (шинэ ${added.length}, хоцрогдсон ${stale.length}): pnpm xo:i18n:extract ажиллуул`,
    );
  }
  for (const key of Object.keys(en)) {
    if (!(key in mn)) {
      problems.push(`mn.json-д байхгүй: ${key}`);
    } else if (isUntranslated(key, en, mn, keepEn)) {
      problems.push(`орчуулаагүй: ${key}`);
    }
  }
  for (const item of manual) {
    problems.push(`гараар: ${item.file}:${item.line} ${item.reason} ${item.snippet}`);
  }

  if (problems.length > 0) {
    for (const problem of problems) console.error(problem);
    console.error(`xo:i18n check: FAIL (${problems.length} асуудал)`);
    process.exit(1);
  }
  console.log(`xo:i18n check: OK (keys=${Object.keys(en).length})`);
}

function runEmit(): void {
  const { transformed } = extractAll();
  for (const [rel, code] of transformed) {
    const target = join(EMIT_DIR, rel);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, code);
  }
  console.log(`xo:i18n emit: ${transformed.size} файл → scripts/xo-i18n/.emit/`);
}

function runTodo(prefixes: string[]): void {
  if (prefixes.length === 0) usage();
  const { en, keyFiles } = extractAll();
  const mn = readJson<Catalog>(MN_FILE, {});
  const keepEn = new Set(readJson<string[]>(KEEP_EN_FILE, []));
  const todo: Catalog = {};
  for (const key of Object.keys(en)) {
    const owners = keyFiles.get(key) ?? new Set<string>();
    const inScope = [...owners].some((file) => prefixes.some((prefix) => file.startsWith(prefix)));
    if (inScope && isUntranslated(key, en, mn, keepEn)) todo[key] = "";
  }
  process.stdout.write(`${JSON.stringify(todo, null, 2)}\n`);
  console.error(`xo:i18n todo: ${Object.keys(todo).length} түлхүүр`);
}

function runMerge(file: string | undefined): void {
  if (!file) usage();
  const batchFile = resolve(file);
  if (!existsSync(batchFile)) {
    console.error(`xo:i18n merge: файл олдсонгүй: ${batchFile}`);
    process.exit(1);
  }
  const batch = readJson<Record<string, unknown>>(batchFile, {});
  const en = readJson<Catalog>(EN_FILE, {});
  const mn = readJson<Catalog>(MN_FILE, {});
  let merged = 0;
  let skipped = 0;
  for (const [key, value] of Object.entries(batch)) {
    if (key in en && typeof value === "string" && value.trim() !== "") {
      mn[key] = value;
      merged += 1;
    } else {
      skipped += 1;
    }
  }
  writeJson(MN_FILE, sortCatalog(mn));
  console.log(`xo:i18n merge: нэгтгэсэн=${merged} алгассан=${skipped}`);
}

function usage(): never {
  console.error("Хэрэглээ: cli.ts extract | check | emit | todo <path-prefix...> | merge <file.json>");
  process.exit(2);
}

const [mode, ...rest] = process.argv.slice(2);
switch (mode) {
  case "extract":
    runExtract();
    break;
  case "check":
    runCheck();
    break;
  case "emit":
    runEmit();
    break;
  case "todo":
    runTodo(rest);
    break;
  case "merge":
    runMerge(rest[0]);
    break;
  default:
    usage();
}
