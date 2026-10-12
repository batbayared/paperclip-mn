#!/usr/bin/env node
// XO брэнд скан: хэрэглэгчид харагдах эх дахь "Paperclip" тоог baseline-тэй
// харьцуулна. Upstream синкийн дараа шинэ тохиолдол орж ирвэл exit 1.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BRAND_RE = /(?<![\w-])Paperclip(?![\w-])/g;
const ROOTS = [
  { dir: "ui/src", exts: [".ts", ".tsx"] },
  { dir: "server/src/onboarding-assets", exts: [".md"] },
];
const SKIP_FILE_RE = /\.(test|spec|stories)\.[jt]sx?$/;
const SKIP_DIRS = new Set(["node_modules", "__tests__"]);

export function countBrand(text) {
  return (text.match(BRAND_RE) ?? []).length;
}

function walk(dir, exts, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) walk(full, exts, out);
    } else if (exts.includes(path.extname(entry.name)) && !SKIP_FILE_RE.test(entry.name)) {
      out.push(full);
    }
  }
}

export function scan(repoRoot) {
  const counts = [];
  for (const { dir, exts } of ROOTS) {
    const abs = path.join(repoRoot, dir);
    if (!fs.existsSync(abs)) continue;
    const files = [];
    walk(abs, exts, files);
    for (const file of files) {
      const n = countBrand(fs.readFileSync(file, "utf8"));
      if (n > 0) counts.push([path.relative(repoRoot, file).split(path.sep).join("/"), n]);
    }
  }
  counts.sort(([a], [b]) => a.localeCompare(b));
  return Object.fromEntries(counts);
}

export function compare(current, baseline) {
  const regressions = [];
  for (const [file, count] of Object.entries(current)) {
    const allowed = baseline[file] ?? 0;
    if (count > allowed) regressions.push({ file, count, allowed });
  }
  return regressions;
}

function main() {
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
  const baselinePath = path.join(repoRoot, "scripts/xo-brand/baseline.json");
  const current = scan(repoRoot);
  const fileCount = Object.keys(current).length;
  const total = Object.values(current).reduce((sum, n) => sum + n, 0);

  if (process.argv.includes("--update")) {
    fs.writeFileSync(baselinePath, `${JSON.stringify(current, null, 2)}\n`);
    console.log(`xo-brand: baseline updated (${fileCount} files, ${total} hits)`);
    return;
  }
  if (process.argv.includes("--list")) {
    for (const [file, n] of Object.entries(current)) console.log(`${n}\t${file}`);
  }
  const baseline = fs.existsSync(baselinePath) ? JSON.parse(fs.readFileSync(baselinePath, "utf8")) : {};
  const regressions = compare(current, baseline);
  for (const r of regressions) console.error(`xo-brand: ${r.file}: ${r.count} > baseline ${r.allowed}`);
  if (regressions.length > 0) process.exit(1);
  console.log(`xo-brand: OK (${fileCount} files, ${total} hits, none above baseline)`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
