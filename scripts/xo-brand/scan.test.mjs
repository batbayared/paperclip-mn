import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { compare, countBrand, scan } from "./scan.mjs";

test("countBrand counts only the product name", () => {
  assert.equal(countBrand("Welcome to Paperclip!"), 1);
  assert.equal(countBrand("Paperclip and Paperclip"), 2);
  assert.equal(countBrand("X-Paperclip-Run-Id"), 0);
  assert.equal(countBrand("PaperclipLockup paperclipai @paperclipai/shared"), 0);
});

test("compare reports files that grew or appeared", () => {
  const regressions = compare({ "a.tsx": 2, "b.tsx": 1, "c.tsx": 1 }, { "a.tsx": 2, "b.tsx": 0 });
  assert.deepEqual(regressions, [
    { file: "b.tsx", count: 1, allowed: 0 },
    { file: "c.tsx", count: 1, allowed: 0 },
  ]);
  assert.deepEqual(compare({ "a.tsx": 1 }, { "a.tsx": 3 }), []);
});

test("scan walks ui/src and onboarding assets, skipping tests", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "xo-brand-scan-"));
  fs.mkdirSync(path.join(root, "ui/src/pages"), { recursive: true });
  fs.mkdirSync(path.join(root, "server/src/onboarding-assets/ceo"), { recursive: true });
  fs.writeFileSync(path.join(root, "ui/src/pages/A.tsx"), "<p>Paperclip</p>");
  fs.writeFileSync(path.join(root, "ui/src/pages/A.test.tsx"), "Paperclip");
  fs.writeFileSync(path.join(root, "server/src/onboarding-assets/ceo/AGENTS.md"), "Paperclip wake");
  assert.deepEqual(scan(root), {
    "server/src/onboarding-assets/ceo/AGENTS.md": 1,
    "ui/src/pages/A.tsx": 1,
  });
});
