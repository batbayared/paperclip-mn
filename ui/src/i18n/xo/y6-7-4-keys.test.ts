import { describe, expect, it } from "vitest";
import en from "./en.json";
import mn from "./mn.json";

// Ү6 7.4-т нэмсэн/хэрэглэсэн түлхүүрүүд (scratch t1/t3/t4/t5-аас).
const Y6_7_4_KEYS: string[] = [
  // Task 1
  "Unavailable",
  "Commit unavailable",
  "Change status unavailable",
  "Clean checkout",
  "staged",
  "unstaged",
  "untracked",
  "Local changes present ({{parts}})",
  "Local changes present",
  "Health unavailable",
  "Latest (Rev {{n}})",
  "No activity",
  "just now",
  "{{n}} min ago",
  "1 hr ago",
  "{{n}} hr ago",
  "yesterday",
  "{{n}} days ago",
  "last week",
  "{{n}} weeks ago",
  "This week",
  "Whenever",
  // Task 3
  "Idle",
  "Pending approval",
  "Terminated",
  "Succeeded",
  "Revision requested",
  "Planned",
  "Achieved",
  "CEO",
  "CTO",
  "CMO",
  "CFO",
  "Security",
  "Engineer",
  "Designer",
  "PM",
  "QA",
  "DevOps",
  "Researcher",
  "Timer",
  "Assignment",
  "On-demand",
  "Automation",
  "Trace expired",
  "Raw tracing enabled",
  "Trace captured",
  "Trace incomplete",
  "Trace truncated",
  "Trace deleted",
  "Trace requested",
  "Trace off",
  "Assign Task",
  "Run Heartbeat",
  "Waiting for transcript...",
  "No persisted transcript for this run.",
  "Repair this agent's reporting chain before assigning tasks or starting runs",
  // Task 4
  "Run now",
  "Pause",
  "Pause anyway",
  "Clear error",
  "Clear error and return agent to idle",
  "Exact provider traffic will be captured for future runs and retained for up to 24 hours.",
  "Raw tracing on",
  "Capture exact provider traffic for this run (expires after 24 hours)",
  "Run with provider trace",
  "Duplicate Agent",
  "Copy Agent ID",
  "Reset Sessions",
  "Terminate",
  "Joining...",
  "Join",
  "Leave",
  "Join {{name}}",
  "Leave {{name}}",
  "No transcript yet.",
  "Workspace ID",
  "Local path",
  "Repo",
  // DecisionTriageStrip
  "When to decide",
];

// mn утга нь англитай ижил байж болох түлхүүрүүд (оноосон нэр).
const SAME_IN_MN = new Set<string>(["DevOps"]);

const PLACEHOLDER = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;
function placeholders(s: string): string[] {
  return [...s.matchAll(PLACEHOLDER)].map((m) => m[1]).sort();
}

describe("Ү6 7.4 каталогийн түлхүүрүүд", () => {
  it("en ба mn-д бүгд байна", () => {
    for (const key of Y6_7_4_KEYS) {
      expect(en, `en: ${key}`).toHaveProperty([key]);
      expect(mn, `mn: ${key}`).toHaveProperty([key]);
    }
  });

  it("mn утга орчуулагдсан", () => {
    for (const key of Y6_7_4_KEYS) {
      if (SAME_IN_MN.has(key)) continue;
      expect((mn as Record<string, string>)[key], key).not.toBe((en as Record<string, string>)[key]);
    }
  });

  it("placeholder en/mn ижил", () => {
    for (const key of Y6_7_4_KEYS) {
      expect(placeholders((mn as Record<string, string>)[key] ?? ""), key).toEqual(placeholders(key));
    }
  });
});
