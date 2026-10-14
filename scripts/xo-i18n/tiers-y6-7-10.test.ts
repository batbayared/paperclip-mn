import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { XO_TRANSFORM_FILES } from "./tiers";
import { transformSource } from "./transform";

function read(rel: string): string {
  return readFileSync(fileURLToPath(new URL(`../../${rel}`, import.meta.url)), "utf8");
}

const FILE = "ui/src/components/BootstrapPendingPage.tsx";

describe("Ү6 7.10 админгүй эхний тохиргооны дэлгэц", () => {
  it("T1-д байна, мөрүүдийг барина, гараар үлдэгдэлгүй", () => {
    expect(XO_TRANSFORM_FILES).toContain(FILE);
    const result = transformSource(read(FILE), FILE);
    const extracted = result.strings.map((s) => s.key);
    for (const key of [
      "Finish setting up this {{brand}}",
      "Run this command on the host that runs {{brand}} to print a one-time first-admin invite URL:",
      "Sign in / Create account",
      "Wrong account? <link>Switch account</link>.",
    ]) {
      expect(extracted).toContain(key);
    }
    expect(result.manual).toEqual([]);
  });
});

const CASES: Array<{ file: string; keys: string[] }> = [
  {
    file: "ui/src/pages/PipelineSettings.tsx",
    keys: ["{{brand}} could not save the stage.", "{{name}}, {{count}} warning", "Approved items move to"],
  },
  {
    file: "ui/src/pages/ExecutionWorkspaceDetail.tsx",
    keys: ["{{brand}} created a run using this execution workspace.", "Port {{port}} is assigned to multiple services: {{names}}.", "Worktree setup", "Not scheduled"],
  },
  {
    file: "ui/src/components/BuiltInBundlePanel.tsx",
    keys: ["Update {{label}} to the newest default?", "Reset {{label}} to the shipped default?", "Paperclip shipped a newer default."],
  },
  {
    file: "ui/src/components/FrontmatterPanel.tsx",
    keys: ["SKILL.md needs a name.", "Expected a list — edit in YAML.", "Add frontmatter", "Frontmatter YAML"],
  },
  {
    file: "ui/src/components/environment-variables-editor/index.tsx",
    keys: ["Imported {{count}} variable", "New: {{names}}", "Removed: {{names}}"],
  },
  {
    file: "ui/src/components/environment-variables-editor/Row.tsx",
    keys: ["Duplicate name", "This secret no longer exists — runs will fail until you rebind.", "v{{v}}"],
  },
  {
    file: "ui/src/components/environment-variables-editor/SecretPicker.tsx",
    keys: ["Browse secrets", "Missing secret ({{secretId}})", "Select secret…"],
  },
  {
    file: "ui/src/components/environment-variables-editor/CreateSecretPopover.tsx",
    keys: ["Create & bind", "Value is required", "this variable"],
  },
  {
    file: "ui/src/components/RepositoryEditor.tsx",
    keys: ["Private repository", "Remove {{fullName}}", "Add GitHub repo"],
  },
];

describe("Ү6 7.10 T1 файлууд (pipeline, workspace, чадварын багц, орчны хувьсагч, репозитор)", () => {
  it.each(CASES)("$file T1-д байна, мөрүүдийг барина, гараар үлдэгдэлгүй", ({ file, keys }) => {
    expect(XO_TRANSFORM_FILES).toContain(file);
    const result = transformSource(read(file), file);
    const extracted = result.strings.map((s) => s.key);
    for (const key of keys) expect(extracted).toContain(key);
    expect(result.manual).toEqual([]);
  });
});
