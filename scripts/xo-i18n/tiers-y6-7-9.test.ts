import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { XO_TRANSFORM_FILES } from "./tiers";
import { transformSource } from "./transform";

function read(rel: string): string {
  return readFileSync(fileURLToPath(new URL(`../../${rel}`, import.meta.url)), "utf8");
}

const CASES: Array<{ file: string; keys: string[] }> = [
  {
    file: "ui/src/pages/CompanySkills.tsx",
    keys: ["Filters: {{activeFilterCount}}", "{{brand}} could not validate this skill as Agent Skills markdown. Install at your own risk.", "{{parts}} across {{n}} workspaces."],
  },
  {
    file: "ui/src/pages/SkillStudio.tsx",
    keys: ["Select an organization to open Skill Studio.", "{{name}} is now editable in the {{brand}} workspace.", "Fork skill"],
  },
  {
    file: "ui/src/pages/skills/ImportSkillsFromProjectDialog.tsx",
    keys: ["Import skills from project", "{{n}} skills imported as references from {{project}}.", "No projects match \"{{filter}}\"."],
  },
  {
    file: "ui/src/components/folders/SkillFolderTree.tsx",
    keys: ["Skill folders", "Folder actions for {{label}}", "Move here"],
  },
  {
    file: "ui/src/components/SkillsContextualSidebar.tsx",
    keys: ["Installed", "Discover", "Author"],
  },
  {
    file: "ui/src/pages/agent-skills/AgentSkillsTab.tsx",
    keys: ["{{brand}} cannot manage skills for this adapter yet. Manage them in the adapter directly.", "Beta · {{release}}", "Search skills"],
  },
  {
    file: "ui/src/pages/agent-skills/AgentSkillRow.tsx",
    keys: ["Read-only", "Enable {{name}}"],
  },
  {
    file: "ui/src/pages/agent-skills/AgentSkillReleasePicker.tsx",
    keys: ["Default — current (recommended)", "Skill release"],
  },
  {
    file: "ui/src/components/skill-studio/AgentsUsingSkillDialog.tsx",
    keys: ["{{n}} agents use this skill", "Agents using {{name}}", "{{count}} version behind latest"],
  },
  {
    file: "ui/src/components/skill-studio/ForkSkillDialog.tsx",
    keys: ["Create copy & switch {{n}} agents", "Edit a copy of {{name}}", "Create another copy"],
  },
  {
    file: "ui/src/components/skill-studio/SkillPolicySurfaces.tsx",
    keys: ["Dismiss"],
  },
  {
    file: "ui/src/components/skill-studio/SkillProvenance.tsx",
    keys: ["Forked from {{label}}", "Edit a copy instead"],
  },
];

describe("Ү6 7.9 T1 файлууд", () => {
  it.each(CASES)("$file T1-д байна, мөрүүдийг барина, гараар үлдэгдэлгүй", ({ file, keys }) => {
    expect(XO_TRANSFORM_FILES).toContain(file);
    const result = transformSource(read(file), file);
    const extracted = result.strings.map((s) => s.key);
    for (const key of keys) expect(extracted).toContain(key);
    expect(result.manual).toEqual([]);
  });
});
