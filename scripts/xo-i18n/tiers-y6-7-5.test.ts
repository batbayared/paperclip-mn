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
    file: "ui/src/components/InteractionGovernancePanel.tsx",
    keys: ["Interaction governance", "Kind", "Default policy", "Cap", "Default resolver audience for {{kindLabel}}"],
  },
  {
    file: "ui/src/components/IssueThreadInteractionCard.tsx",
    keys: ["Approved", "Withdrawn", "Accept drafts", "No reason provided.", "{{hiddenChildCount}} follow-on tasks hidden in preview"],
  },
  {
    file: "ui/src/pages/Secrets.tsx",
    keys: ["Secrets", "Secret created", "Rotate failed", "Delete failed", "Vault: {{vault}}"],
  },
  {
    file: "ui/src/components/AgentContextualSidebar.tsx",
    keys: ["Activity", "Budgets", "Secrets & variables", "{{name}} navigation", "Loading audit links…"],
  },
  {
    file: "ui/src/pages/audit/AuditHub.tsx",
    keys: ["Audit", "Select an organization to view Audit."],
  },
  {
    file: "ui/src/pages/audit/AuditRuns.tsx",
    keys: ["Routine runs", "No runs yet.", "Clear filters", "{{minutes}}m {{seconds}}s"],
  },
  {
    file: "ui/src/pages/audit/CompanyActivity.tsx",
    keys: ["Activity", "Select an organization to view activity."],
  },
  {
    file: "ui/src/pages/ProjectWorkspaceDetail.tsx",
    keys: ["Configuration", "Loading workspace…", "Back to workspaces", "Workspace not found for this project."],
  },
];

describe("Ү6 7.5 T1 файлууд", () => {
  it.each(CASES)("$file T1-д байна, мөрүүдийг барина, гараар үлдэгдэлгүй", ({ file, keys }) => {
    expect(XO_TRANSFORM_FILES).toContain(file);
    const result = transformSource(read(file), file);
    const extracted = result.strings.map((s) => s.key);
    for (const key of keys) expect(extracted).toContain(key);
    expect(result.manual).toEqual([]);
  });
});
