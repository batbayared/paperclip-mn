import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { XO_TRANSFORM_FILES } from "./tiers";
import { transformSource } from "./transform";

function read(rel: string): string {
  return readFileSync(fileURLToPath(new URL(`../../${rel}`, import.meta.url)), "utf8");
}

const CASES: Array<{ file: string; keys: string[] }> = [
  { file: "ui/src/pages/CompanySkills.production.tsx", keys: ["skills.sh managed", "Skills Store"] },
  { file: "ui/src/components/AppConnectionSidebar.production.tsx", keys: ["All apps"] },
  { file: "ui/src/components/AppsSidebar.production.tsx", keys: ["Connectors"] },
  { file: "ui/src/components/routine-sections/editable-sections.production.tsx", keys: ["Coalesce if active"] },
  { file: "ui/src/pages/OrgChart.production.tsx", keys: ["Org Chart"] },
  { file: "ui/src/pages/RoutineDetail.production.tsx", keys: ["Triggers", "History"] },
  { file: "ui/src/pages/Routines.production.tsx", keys: ["Recent Runs"] },
  { file: "ui/src/pages/audit/AuditFeed.production.tsx", keys: ["All actions"] },
  { file: "ui/src/pages/audit/CompanyActivity.production.tsx", keys: ["Activity"] },
  { file: "ui/src/pages/Artifacts.tsx", keys: ["Artifacts", "Images"] },
  { file: "ui/src/components/artifacts/ArtifactCard.tsx", keys: ["Image", "Document"] },
  { file: "ui/src/components/artifacts/ArtifactGroupCard.tsx", keys: ["{{count}} artifacts"] },
  { file: "ui/src/pages/apps/Browse.tsx", keys: ["Connectors", "Setup incomplete"] },
  { file: "ui/src/components/IssueRecoveryActionCard.tsx", keys: ["Missing Disposition"] },
  { file: "ui/src/components/FinanceTimelineCard.tsx", keys: ["Recent financial events"] },
  { file: "ui/src/components/side-panel/SidePanelFrame.tsx", keys: ["Side panel"] },
];

describe("Ү6 7.13 T1 файлууд (Streamlined UI, хөтчийн шалгалтын олдвор)", () => {
  it.each(CASES)("$file T1-д байна, мөрүүдийг барина, гараар үлдэгдэлгүй", ({ file, keys }) => {
    expect(XO_TRANSFORM_FILES).toContain(file);
    const result = transformSource(read(file), file);
    const extracted = result.strings.map((s) => s.key);
    for (const key of keys) expect(extracted).toContain(key);
    expect(result.manual).toEqual([]);
  });
});
