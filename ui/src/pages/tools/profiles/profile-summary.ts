import type { ToolProfileStatus, ToolProfileSummary, ToolProfileWithDetails } from "@paperclipai/shared";
import { tx } from "@/i18n/xo";

/**
 * Prosumer copy for the access-profile index (PAP-10997, AP1). Reads the
 * server-computed `summary` and renders the friendly "Allows" / "Assigned to"
 * lines the table shows. Vocabulary gate: nothing here says
 * binding/entry/selector/priority — only "tools", "apps", "agents".
 */

function toolCount(n: number): string {
  return n === 1 ? tx("{{n}} tool", { n }) : tx("{{n}} tools", { n });
}

/** "9 tools · 3 apps" / "All tools" / "All except 2 tools". */
export function allowsLabel(summary: ToolProfileSummary): string {
  if (summary.accessMode === "all_except") {
    return summary.excludedToolCount === 0
      ? tx("All tools")
      : summary.excludedToolCount === 1
        ? tx("All except {{n}} tool", { n: summary.excludedToolCount })
        : tx("All except {{n}} tools", { n: summary.excludedToolCount });
  }
  const parts = [toolCount(summary.allowedToolCount)];
  const apps = summary.allowedApplicationCount;
  if (apps > 0) {
    parts.push(apps === 1 ? tx("{{n}} app", { n: apps }) : tx("{{n}} apps", { n: apps }));
  }
  return parts.join(" · ");
}

export interface AssignedLabel {
  text: string;
  /** A profile with no assignment has no effect — the index shows a quiet hint. */
  unassigned: boolean;
}

/** "Organization default" / "2 agents" / "Not assigned yet". */
export function assignedLabel(summary: ToolProfileSummary): AssignedLabel {
  if (summary.isCompanyDefault) return { text: tx("Organization default"), unassigned: false };
  const agents = summary.appliesToAgentCount;
  if (agents > 0) {
    return {
      text: agents === 1 ? tx("{{n}} agent", { n: agents }) : tx("{{n}} agents", { n: agents }),
      unassigned: false,
    };
  }
  const assignments = summary.assignmentCount;
  if (assignments > 0) {
    return {
      text:
        assignments === 1
          ? tx("{{n}} assignment", { n: assignments })
          : tx("{{n}} assignments", { n: assignments }),
      unassigned: false,
    };
  }
  return { text: tx("Not assigned yet"), unassigned: true };
}

export const STATUS_LABEL: Record<ToolProfileStatus, string> = {
  draft: "Draft",
  active: "Active",
  disabled: "Off",
  archived: "Archived",
};

/** Display label for a profile status; STATUS_LABEL stays the English source map. */
export function statusLabel(status: ToolProfileStatus): string {
  switch (status) {
    case "draft":
      return tx("Draft");
    case "active":
      return tx("Active");
    case "disabled":
      return tx("Off");
    case "archived":
      return tx("Archived");
    default:
      return STATUS_LABEL[status] ?? status;
  }
}

export function isDraft(profile: Pick<ToolProfileWithDetails, "status">): boolean {
  return profile.status === "draft";
}
