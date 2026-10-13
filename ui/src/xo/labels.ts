// XO: upstream-ийн модулийн түвшний англи шошгыг render үед орчуулна.
// tx()-ийн аргумент бүр литерал байх ёстой — extract зөвхөн литералыг хураадаг.
import { i18n } from "@/i18n";
import { tx } from "@/i18n/xo";
import { issueFilterLabel } from "@/lib/issue-filters";

export function xoLabel(english: string): string {
  switch (english) {
    case "Use API key instead": return tx("Use API key instead");
    case "Use subscription instead": return tx("Use subscription instead");
    case "Subscription": return tx("Subscription");
    case "Create your first agent": return tx("Create your first agent");
    case "Connect a model": return tx("Connect a model");
    case "Review": return tx("Review");
    case "Name your organization": return tx("Name your organization");
    case "Make changes and run work": return tx("Make changes and run work");
    case "Draft a plan before acting": return tx("Draft a plan before acting");
    case "Answer questions only, no changes": return tx("Answer questions only, no changes");
    default: return english;
  }
}

function normalizeStatus(status: string): string {
  const s = status.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return s === "to_do" ? "todo" : s === "canceled" ? "cancelled" : s;
}

export function xoStatusLabel(status: string, english: string): string {
  if (!(i18n.resolvedLanguage ?? i18n.language ?? "").startsWith("mn")) return english;
  switch (normalizeStatus(status)) {
    case "backlog": return tx("Backlog");
    case "todo": return tx("Todo");
    case "in_progress": return tx("In Progress");
    case "in_review": return tx("In Review");
    case "done": return tx("Done");
    case "cancelled": return tx("Cancelled");
    case "blocked": return tx("Blocked");
    default: return english;
  }
}

// task-chat-attachments.ts-ийн файлын төрөл. "Archive" түлхүүр каталогт «Архивлах»
// үйл үгтэй тул файлын төрөлд тусдаа түлхүүр хэрэглэнэ; en дээр guard англиар буцаана.
export function xoFileKindLabel(english: string): string {
  if (!(i18n.resolvedLanguage ?? i18n.language ?? "").startsWith("mn")) return english;
  switch (english) {
    case "Archive": return tx("Archive (file type)");
    case "Audio": return tx("Audio");
    case "Code": return tx("Code");
    case "Doc": return tx("Doc");
    case "File": return tx("File");
    case "Log": return tx("Log");
    case "Patch": return tx("Patch");
    case "Sheet": return tx("Sheet");
    case "Text": return tx("Text");
    case "Video": return tx("Video");
    default: return english;
  }
}

// RichWorkProductCard-ийн PR статусын «Open». "Open" түлхүүр каталогт «Нээх» (товчны
// үйл үг) тул статусын тэмдэгт тусдаа түлхүүр хэрэглэнэ; en дээр guard англиар буцаана.
export function xoWorkProductStatusLabel(english: string): string {
  if (!(i18n.resolvedLanguage ?? i18n.language ?? "").startsWith("mn")) return english;
  switch (english) {
    case "Open": return tx("Open (PR status)");
    default: return english;
  }
}

// completed-activity-summary.ts-ийн хураангуй шошго. Түлхүүр нь англи тексттэй ижил
// тул en дээр tx() түлхүүрээ буцаана, guard хэрэггүй.
export function xoActivityLabel(english: string): string {
  switch (english) {
    case "Ran commands": return tx("Ran commands");
    case "Searched files": return tx("Searched files");
    case "Read files": return tx("Read files");
    case "Edited files": return tx("Edited files");
    case "Searched the web": return tx("Searched the web");
    case "Worked on a plan": return tx("Worked on a plan");
    case "Requested input": return tx("Requested input");
    case "Worked with agents": return tx("Worked with agents");
    case "Reviewed safety": return tx("Reviewed safety");
    case "Worked with images": return tx("Worked with images");
    case "Waited": return tx("Waited");
    case "Used connected tools": return tx("Used connected tools");
    case "Used tools": return tx("Used tools");
    case "Worked with artifacts": return tx("Worked with artifacts");
    case "Managed context": return tx("Managed context");
    case "Checked memory": return tx("Checked memory");
    case "Checked model settings": return tx("Checked model settings");
    case "Worked in review mode": return tx("Worked in review mode");
    case "Ran hooks": return tx("Ran hooks");
    case "Received a provider update": return tx("Received a provider update");
    case "Worked on files": return tx("Worked on files");
    case "Referenced files": return tx("Referenced files");
    case "Added resources": return tx("Added resources");
    case "Checked files": return tx("Checked files");
    case "Thought through the task": return tx("Thought through the task");
    case "Activity stopped": return tx("Activity stopped");
    case "Recorded usage": return tx("Recorded usage");
    default: return english;
  }
}

// IssuesList-ийн огнооны тусгаарлагч (task-date-groups.ts, issueAgeSeparatorLabel): label
// хувьсагчаар дамждаг тул transform ороохгүй. Түлхүүр нь англи тексттэй ижил.
export function xoDateGroupLabel(english: string): string {
  switch (english) {
    case "Today": return tx("Today");
    case "Yesterday": return tx("Yesterday");
    case "Earlier": return tx("Earlier");
    case "Older than a day": return tx("Older than a day");
    case "Older than a week": return tx("Older than a week");
    default: return english;
  }
}

// IssueColumns.tsx-ийн баганын нэр ба тайлбар (Record initializer тул transform барихгүй).
export function xoColumnLabel(english: string): string {
  switch (english) {
    case "Status": return tx("Status");
    case "ID": return tx("ID");
    case "Responsible": return tx("Responsible");
    case "Kicked off by": return tx("Kicked off by");
    case "Project": return tx("Project");
    case "Workspace": return tx("Workspace");
    case "Parent task": return tx("Parent task");
    case "Tags": return tx("Tags");
    case "Last updated": return tx("Last updated");
    default: return english;
  }
}

export function xoColumnDescription(english: string): string {
  switch (english) {
    case "Task state chip on the left edge.": return tx("Task state chip on the left edge.");
    case "Task state icon on the leading edge.": return tx("Task state icon on the leading edge.");
    case "Ticket identifier like PAP-1009.": return tx("Ticket identifier like PAP-1009.");
    case "Task identifier like PAP-1009 on the trailing edge.": return tx("Task identifier like PAP-1009 on the trailing edge.");
    case "Responsible agent or board user.": return tx("Responsible agent or board user.");
    case "Board user or agent who created the task.": return tx("Board user or agent who created the task.");
    case "Linked project pill with its color.": return tx("Linked project pill with its color.");
    case "Execution or project workspace used for the task.": return tx("Execution or project workspace used for the task.");
    case "Parent task identifier and title.": return tx("Parent task identifier and title.");
    case "Task labels and tags.": return tx("Task labels and tags.");
    case "Latest visible activity time.": return tx("Latest visible activity time.");
    default: return english;
  }
}

// TaskChatRunnerActivityGroup-ийн зөвшөөрлийн шийдвэр (task-chat-model.ts decision:
// "allowed" | "rejected"). en дээр guard түүхий утгыг буцаана.
export function xoPermissionDecision(decision: string): string {
  if (!(i18n.resolvedLanguage ?? i18n.language ?? "").startsWith("mn")) return decision;
  switch (decision) {
    case "allowed": return tx("Allowed");
    case "rejected": return tx("Rejected");
    default: return decision;
  }
}

// IssueChatThread/CommentThread-ийн humanizeValue (статусын өөрчлөлт). en дээр upstream-тэй
// ижил гаралт: null → "None", "_" → зай. mn дээр статусыг xoStatusLabel орчуулна.
export function xoHumanizeValue(value: string | null): string {
  if (!value) return tx("None");
  return xoStatusLabel(value, value.replace(/_/g, " "));
}

// transcriptPresentation.ts-ийн describeToolInput() шошго. Харьцуулалт (d.label === "Intent")
// англиар хэвээр; зөвхөн render үед орчуулна.
export function xoToolDetailLabel(english: string): string {
  switch (english) {
    case "Command": return tx("Command");
    case "Input": return tx("Input");
    case "Intent": return tx("Intent");
    case "Path": return tx("Path");
    case "Directory": return tx("Directory");
    case "Query": return tx("Query");
    case "Target": return tx("Target");
    case "Prompt": return tx("Prompt");
    case "Pattern": return tx("Pattern");
    case "Name": return tx("Name");
    case "Paths": return tx("Paths");
    default: return english;
  }
}

// IssuesList/IssueFiltersPopover-ийн issueFilterLabel(value): статус ба зэрэглэлийн утга.
export function xoIssueFilterLabel(value: string): string {
  switch (value) {
    case "critical": return tx("Critical");
    case "high": return tx("High");
    case "medium": return tx("Medium");
    case "low": return tx("Low");
    default: return xoStatusLabel(value, issueFilterLabel(value));
  }
}

// issue-filters.ts-ийн issueQuickFilterPresets (модулийн түвшний массив).
export function xoQuickFilterLabel(english: string): string {
  switch (english) {
    case "All": return tx("All");
    case "Active": return tx("Active");
    case "Backlog": return tx("Backlog");
    case "Done": return tx("Done");
    default: return english;
  }
}

// IssueFiltersPopover-ийн INBOX_CATEGORY_OPTIONS ба INBOX_APPROVAL_STATUS_OPTIONS.
export function xoInboxFilterLabel(english: string): string {
  switch (english) {
    case "All categories": return tx("All categories");
    case "My recent tasks": return tx("My recent tasks");
    case "Join requests": return tx("Join requests");
    case "Approvals": return tx("Approvals");
    case "Failed runs": return tx("Failed runs");
    case "Alerts": return tx("Alerts");
    case "All approval statuses": return tx("All approval statuses");
    case "Needs action": return tx("Needs action");
    case "Resolved": return tx("Resolved");
    default: return english;
  }
}

// IssuesList-ийн createActionLabel/createButtonLabel. createIssueLabel-д одоо зөвхөн
// "Sub-task" ирдэг (IssueDetail.tsx); бусад утга англи template-ээр үлдэнэ.
export function xoCreateIssueLabels(createIssueLabel?: string): { action: string; button: string } {
  if (!createIssueLabel) return { action: tx("Create Task"), button: tx("New Task") };
  if (createIssueLabel === "Sub-task") return { action: tx("Create Sub-task"), button: tx("New Sub-task") };
  return { action: `Create ${createIssueLabel}`, button: `New ${createIssueLabel}` };
}

// task-side-panel-state.ts-ийн tab шошго localStorage-д англиар хадгалагддаг тул render үед орчуулна.
export function xoSidePanelTabLabel(english: string): string {
  switch (english) {
    case "Properties": return tx("Properties");
    case "Subtasks": return tx("Subtasks");
    case "Tasks": return tx("Tasks");
    case "Artifacts": return tx("Artifacts");
    case "Files": return tx("Files");
    default: return english;
  }
}
