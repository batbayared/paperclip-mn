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
    case "Decide now": return tx("Decide now");
    case "New today": return tx("New today");
    case "Earlier": return tx("Earlier");
    case "Status": return tx("Status");
    case "Priority": return tx("Priority");
    case "Responsible": return tx("Responsible");
    case "Project": return tx("Project");
    case "Workspace": return tx("Workspace");
    case "Parent Task": return tx("Parent Task");
    case "None": return tx("None");
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
    case "active": return tx("Active");
    case "idle": return tx("Idle");
    case "paused": return tx("Paused");
    case "running": return tx("Running");
    case "error": return tx("Error");
    case "pending_approval": return tx("Pending approval");
    case "terminated": return tx("Terminated");
    case "queued": return tx("Queued");
    case "scheduled_retry": return tx("Scheduled retry");
    case "succeeded": return tx("Succeeded");
    case "interrupted": return tx("Interrupted");
    case "failed": return tx("Failed");
    case "timed_out": return tx("Timed out");
    case "revision_requested": return tx("Revision requested");
    case "approved": return tx("Approved");
    case "rejected": return tx("Rejected");
    case "planned": return tx("Planned");
    case "achieved": return tx("Achieved");
    case "completed": return tx("Completed");
    case "pending": return tx("Pending");
    case "draft": return tx("Draft");
    case "accepted": return tx("Accepted");
    case "answered": return tx("Answered");
    case "expired": return tx("Expired");
    case "withdrawn": return tx("Withdrawn");
    case "declined": return tx("Declined");
    case "deferred": return tx("Deferred");
    case "disabled": return tx("Disabled");
    case "archived": return tx("Archived");
    case "deleted": return tx("Deleted");
    case "executed": return tx("Executed");
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
    case "Markdown": return tx("Markdown");
    case "Patch": return tx("Patch");
    case "Sheet": return tx("Sheet");
    case "Text": return tx("Text");
    case "Video": return tx("Video");
    default: return english;
  }
}

// routine-run-display.ts-ийн SKIP_REASON_LABELS (Record initializer) ба "Run failed"-ийг render үед орчуулна.
export function xoRunRowSubtitle(english: string): string {
  switch (english) {
    case "Skipped — no activity since last run": return tx("Skipped — no activity since last run");
    case "Skipped — routine paused": return tx("Skipped — routine paused");
    case "Skipped — worktree execution cutoff": return tx("Skipped — worktree execution cutoff");
    case "Run failed": return tx("Run failed");
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

// NewIssueDialog-ийн "For [agent] in [project]" мөр (M-4). Нэг үгт "For"/"in" глобал
// түлхүүр өөр утгатай тул контексттой түлхүүр хэрэглэж, en дээр guard англиар буцаана.
export function xoNewIssueInlineLabel(english: "For" | "in"): string {
  if (!(i18n.resolvedLanguage ?? i18n.language ?? "").startsWith("mn")) return english;
  return english === "For" ? tx("For (assignee)") : tx("in (project picker)");
}

// Агентын үүрэг (AGENT_ROLE_LABELS-ийн key). en дээр guard англиар буцаана.
export function xoRoleLabel(role: string, english: string): string {
  if (!(i18n.resolvedLanguage ?? i18n.language ?? "").startsWith("mn")) return english;
  switch (role) {
    case "ceo": return tx("CEO");
    case "cto": return tx("CTO");
    case "cmo": return tx("CMO");
    case "cfo": return tx("CFO");
    case "security": return tx("Security");
    case "engineer": return tx("Engineer");
    case "designer": return tx("Designer");
    case "pm": return tx("PM");
    case "qa": return tx("QA");
    case "devops": return tx("DevOps");
    case "researcher": return tx("Researcher");
    case "general": return tx("General");
    default: return english;
  }
}

// AgentDetail-ийн sourceLabels (run.invocationSource). en дээр guard англиар буцаана.
export function xoRunSourceLabel(source: string, english: string): string {
  if (!(i18n.resolvedLanguage ?? i18n.language ?? "").startsWith("mn")) return english;
  switch (source) {
    case "timer": return tx("Timer");
    case "assignment": return tx("Assignment");
    case "on_demand": return tx("On-demand");
    case "automation": return tx("Automation");
    default: return english;
  }
}

// ProviderTraceStatusBadge-ийн шошго. Харьцуулалт англиар хэвээр; зөвхөн render үед орчуулна.
export function xoTraceStatusLabel(english: string): string {
  switch (english) {
    case "Trace expired": return tx("Trace expired");
    case "Raw tracing enabled": return tx("Raw tracing enabled");
    case "Trace captured": return tx("Trace captured");
    case "Trace incomplete": return tx("Trace incomplete");
    case "Trace truncated": return tx("Trace truncated");
    case "Trace deleted": return tx("Trace deleted");
    case "Trace requested": return tx("Trace requested");
    case "Trace off": return tx("Trace off");
    default: return english;
  }
}

export function xoResolverPolicyLabel(english: string): string {
  if (!(i18n.resolvedLanguage ?? i18n.language ?? "").startsWith("mn")) return english;
  switch (english) {
    case "Anyone": return tx("Anyone");
    case "Anyone except creator": return tx("Anyone except creator");
    case "Human only": return tx("Human only");
    case "Addressed": return tx("Addressed");
    case "Anyone (default)": return tx("Anyone (default)");
    case "No cap": return tx("No cap");
    default: return english;
  }
}

export function xoResolverPolicyEffect(english: string): string {
  if (!(i18n.resolvedLanguage ?? i18n.language ?? "").startsWith("mn")) return english;
  switch (english) {
    case "Anyone in the organization can respond — the board or any agent, including the one that asked.":
      return tx("Anyone in the organization can respond — the board or any agent, including the one that asked.");
    case "Anyone in the organization except the agent that created the card, and its run. Use this when the answer has to come from someone else.":
      return tx("Anyone in the organization except the agent that created the card, and its run. Use this when the answer has to come from someone else.");
    case "Only a person on the board can respond. Agents are turned away.":
      return tx("Only a person on the board can respond. Agents are turned away.");
    case "New cards are open — the board or any agent can respond, including the one that asked.":
      return tx("New cards are open — the board or any agent can respond, including the one that asked.");
    case "A request keeps whatever audience it asks for.": return tx("A request keeps whatever audience it asks for.");
    case "New cards exclude the agent that created them, so the answer comes from someone else.":
      return tx("New cards exclude the agent that created them, so the answer comes from someone else.");
    case "New cards wait for a person on the board. Agents are turned away.":
      return tx("New cards wait for a person on the board. Agents are turned away.");
    case "Even a card that asks for Anyone is narrowed to exclude its creator.":
      return tx("Even a card that asks for Anyone is narrowed to exclude its creator.");
    case "Every card of this kind waits for a person, whatever it asked for.":
      return tx("Every card of this kind waits for a person, whatever it asked for.");
    default: return english;
  }
}

export function xoInteractionKindLabel(english: string): string {
  if (!(i18n.resolvedLanguage ?? i18n.language ?? "").startsWith("mn")) return english;
  switch (english) {
    case "Suggested tasks": return tx("Suggested tasks");
    case "Ask user questions": return tx("Ask user questions");
    case "Confirmations": return tx("Confirmations");
    case "Confirmation": return tx("Confirmation");
    case "Checkbox confirmations": return tx("Checkbox confirmations");
    case "Checkbox confirmation": return tx("Checkbox confirmation");
    case "Item verdicts": return tx("Item verdicts");
    case "Connection requests": return tx("Connection requests");
    case "Connection request": return tx("Connection request");
    case "Plan": return tx("Plan");
    default: return english;
  }
}

export function xoVerdictLabel(english: string): string {
  if (!(i18n.resolvedLanguage ?? i18n.language ?? "").startsWith("mn")) return english;
  switch (english) {
    case "Approve": return tx("Approve");
    case "Reject": return tx("Reject");
    case "Defer": return tx("Defer");
    case "Revise…": return tx("Revise…");
    case "Approved": return tx("Approved");
    case "Rejected": return tx("Rejected");
    case "Deferred": return tx("Deferred");
    default: return english;
  }
}

export function xoNavLabel(english: string): string {
  if (!(i18n.resolvedLanguage ?? i18n.language ?? "").startsWith("mn")) return english;
  switch (english) {
    case "Agent": return tx("Agent");
    case "Runtime": return tx("Runtime");
    case "Governance": return tx("Governance");
    case "Audit": return tx("Audit");
    case "Overview": return tx("Overview");
    case "Instructions": return tx("Instructions");
    case "Skills": return tx("Skills");
    case "Harness / Runtime": return tx("Harness / Runtime");
    case "Secrets": return tx("Secrets");
    case "Secrets & variables": return tx("Secrets & variables");
    case "Tools": return tx("Tools");
    case "Channels": return tx("Channels");
    case "Permissions / Trust": return tx("Permissions / Trust");
    case "API Keys": return tx("API Keys");
    case "Revisions": return tx("Revisions");
    case "Activity": return tx("Activity");
    case "Runs": return tx("Runs");
    case "Costs": return tx("Costs");
    case "Budgets": return tx("Budgets");
    case "Timeline": return tx("Timeline");
    default: return english;
  }
}

export function xoAttentionSourceLabel(english: string): string {
  if (!(i18n.resolvedLanguage ?? i18n.language ?? "").startsWith("mn")) return english;
  switch (english) {
    case "Approval": return tx("Approval");
    case "Decision": return tx("Decision");
    case "Decision requested": return tx("Decision requested");
    case "Join request": return tx("Join request");
    case "Recovery": return tx("Recovery");
    case "Task": return tx("Task");
    case "Blocked dependency": return tx("Blocked dependency");
    case "Review": return tx("Review");
    case "Failed run": return tx("Failed run");
    case "Budget": return tx("Budget");
    case "Agent error": return tx("Agent error");
    default: return english;
  }
}

export function xoSnoozePresetLabel(english: string): string {
  if (!(i18n.resolvedLanguage ?? i18n.language ?? "").startsWith("mn")) return english;
  switch (english) {
    case "1 hour": return tx("1 hour");
    case "4 hours": return tx("4 hours");
    case "Tomorrow morning": return tx("Tomorrow morning");
    case "Tomorrow": return tx("Tomorrow");
    case "Next week": return tx("Next week");
    default: return english;
  }
}

export function xoFolderItemLabel(english: string): string {
  if (!(i18n.resolvedLanguage ?? i18n.language ?? "").startsWith("mn")) return english;
  switch (english) {
    case "routines": return tx("routines");
    case "Routines": return tx("Routines");
    case "skills": return tx("skills");
    case "Skills": return tx("Skills");
    default: return english;
  }
}

/** TaskChatCompactInteractionCard KIND_COPY; давхардсан утгыг xoInteractionKindLabel руу дамжуулна. */
export function xoCompactKindLabel(english: string): string {
  if (!(i18n.resolvedLanguage ?? i18n.language ?? "").startsWith("mn")) return english;
  switch (english) {
    case "Questions": return tx("Questions");
    case "Choose options": return tx("Choose options");
    case "Review items": return tx("Review items");
    case "Connect service": return tx("Connect service");
    case "Tasks": return tx("Tasks");
    case "Selection": return tx("Selection");
    case "Review": return tx("Review");
    case "Connection": return tx("Connection");
    default: return xoInteractionKindLabel(english);
  }
}

/** Decision queue-ийн severity / date range / group / sort шошго (attention.ts модулийн тогтмолууд). */
export function xoDecisionOptionLabel(english: string): string {
  if (!(i18n.resolvedLanguage ?? i18n.language ?? "").startsWith("mn")) return english;
  switch (english) {
    case "Critical": return tx("Critical");
    case "High": return tx("High");
    case "Medium": return tx("Medium");
    case "Low": return tx("Low");
    case "All": return tx("All");
    case "Today": return tx("Today");
    case "Yesterday": return tx("Yesterday");
    case "Last 7 days": return tx("Last 7 days");
    case "This month": return tx("This month");
    case "Custom": return tx("Custom");
    case "This week": return tx("This week");
    case "Whenever": return tx("Whenever");
    case "Earlier": return tx("Earlier");
    case "None": return tx("None");
    case "Date": return tx("Date");
    case "Type": return tx("Type");
    case "Project": return tx("Project");
    case "Severity": return tx("Severity");
    case "Newest first": return tx("Newest first");
    case "Oldest first": return tx("Oldest first");
    case "No project": return tx("No project");
    default: return english;
  }
}
