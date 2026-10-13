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
    file: "ui/src/pages/Routines.tsx",
    keys: ["Custom routines", "Routine created", "{{brand}} could not move the selected routines."],
  },
  {
    file: "ui/src/components/RoutineList.tsx",
    keys: ["Run now", "Select {{title}}", "No default agent"],
  },
  {
    file: "ui/src/components/RoutineContextualSidebar.tsx",
    keys: ["Routine navigation", "Delivery", "Audit"],
  },
  {
    file: "ui/src/components/ManagedRoutinesList.tsx",
    keys: ["Schedule {{cronExpression}}", "Missing {{refs}}", "Reconcile"],
  },
  {
    file: "ui/src/pages/audit/RoutineAuditActivity.tsx",
    keys: ["Loading routine activity…", "No routine activity yet."],
  },
  {
    file: "ui/src/pages/RoutineDetail.tsx",
    keys: ["the title", "the concurrency policy", "{{brand}} could not save the routine."],
  },
  {
    file: "ui/src/components/RoutineSaveBar.tsx",
    keys: ["{{count}} unsaved change", "Pending changes", "Discard changes?"],
  },
  {
    file: "ui/src/components/RoutineSubSidebar.tsx",
    keys: ["Routine sections", "Triggers", "Unsaved changes"],
  },
  {
    file: "ui/src/components/RoutineOverview.tsx",
    keys: ["Manual runs only", "{{length}} active schedules", "Next run"],
  },
  {
    file: "ui/src/components/routine-sections/editable-sections.tsx",
    keys: ["Coalesce if active", "Ignore schedule windows that were missed while paused.", "{{count}} trigger", "Save this now. {{brand}} will not show the secret value again."],
  },
  {
    file: "ui/src/components/RoutineTriggerCard.tsx",
    keys: ["Trigger: {{name}}", "Signing mode", "Rotate secret"],
  },
  {
    file: "ui/src/components/ScheduleEditor.tsx",
    keys: ["Every hour", "Custom (cron)", "Every minute"],
  },
  {
    file: "ui/src/components/RoutineHistoryTab.tsx",
    keys: ["Restored revision {{restoredFromNumber}} as revision {{newNumber}}", "{{brand}} could not restore the revision.", "Restore as new revision"],
  },
  {
    file: "ui/src/components/routine-sections/operate-sections.tsx",
    keys: ["Last 24h", "Filter by source", "No runs yet. Trigger a run from the header or wait for the schedule."],
  },
  {
    file: "ui/src/components/RoutineVariablesEditor.tsx",
    keys: ["Default value", "How to prompt for inputs and which variables {{brand}} fills in automatically."],
  },
  {
    file: "ui/src/components/RoutineRunVariablesDialog.tsx",
    keys: ["Run routine", "Search agents...", "No agents found."],
  },
];

describe("Ү6 7.8 T1 файлууд", () => {
  it.each(CASES)("$file T1-д байна, мөрүүдийг барина, гараар үлдэгдэлгүй", ({ file, keys }) => {
    expect(XO_TRANSFORM_FILES).toContain(file);
    const result = transformSource(read(file), file);
    const extracted = result.strings.map((s) => s.key);
    for (const key of keys) expect(extracted).toContain(key);
    expect(result.manual).toEqual([]);
  });
});
