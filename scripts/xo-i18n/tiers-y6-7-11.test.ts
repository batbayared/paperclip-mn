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
    file: "ui/src/features/connections/ConnectionSetupFlow.tsx",
    keys: ["Connect an app", "Couldn’t finish setup", "{{brand}} couldn’t start secure sign-in. Try again.", "Use an existing connection"],
  },
  {
    file: "ui/src/components/IssuePlanDecompositionsSection.tsx",
    keys: ["Plan decomposition", "Idempotent claim", "Owner: {{ownerName}}", "{{created}} of {{count}} child task created"],
  },
  {
    file: "ui/src/components/ActiveAgentsPanel.tsx",
    keys: ["No recent agent runs.", "View all runs", "Scheduled heartbeat"],
  },
  {
    file: "ui/src/components/ActivityCharts.tsx",
    keys: ["No runs yet", "recovered: {{count}} (retry succeeded)", "{{day}}: {{total}} issues"],
  },
  {
    file: "ui/src/components/SmokeLabDashboardCard.tsx",
    keys: ["All paths passing", "Integration smoke", "Run one from the Smoke Lab tab"],
  },
  {
    file: "ui/src/components/ActivityRow.tsx",
    keys: ["System", "Board", "Unknown"],
  },
];

describe("Ү6 7.11 T1 файлууд (холболтын тохиргоо, төлөвлөгөөний задаргаа, хянах самбар, activity мөр)", () => {
  it.each(CASES)("$file T1-д байна, мөрүүдийг барина, гараар үлдэгдэлгүй", ({ file, keys }) => {
    expect(XO_TRANSFORM_FILES).toContain(file);
    const result = transformSource(read(file), file);
    const extracted = result.strings.map((s) => s.key);
    for (const key of keys) expect(extracted).toContain(key);
    expect(result.manual).toEqual([]);
  });
});

const AUDIT_CASES: Array<{ file: string; keys: string[] }> = [
  {
    file: "ui/src/pages/audit/AuditFeed.tsx",
    keys: ["Agent Actions", "Export CSV", "All responsible users", "Recorded by {{brand}} — entries can't be edited. Sensitive values are never stored."],
  },
  {
    file: "ui/src/pages/tools/AuditTab.tsx",
    keys: ["All outcomes", "Asked first", "Search activity…"],
  },
  {
    file: "ui/src/components/IssueRunLedger.tsx",
    keys: ["Run ledger", "Checks after finish", "Mark false positive"],
  },
  {
    file: "ui/src/components/CommentAttributionChip.tsx",
    keys: ["Posted on behalf of {{user}}", "for {{user}}"],
  },
];

describe("Ү6 7.11 T7 аудитын файлууд", () => {
  it.each(AUDIT_CASES)("$file T1-д байна, мөрүүдийг барина, гараар үлдэгдэлгүй", ({ file, keys }) => {
    expect(XO_TRANSFORM_FILES).toContain(file);
    const result = transformSource(read(file), file);
    const extracted = result.strings.map((s) => s.key);
    for (const key of keys) expect(extracted).toContain(key);
    expect(result.manual).toEqual([]);
  });
});
