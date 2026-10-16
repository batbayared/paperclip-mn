// XO: upstream-ийн модулийн түвшний англи шошгыг render үед орчуулна.
// tx()-ийн аргумент бүр литерал байх ёстой — extract зөвхөн литералыг хураадаг.
import { i18n } from "@/i18n";
import { tx } from "@/i18n/xo";
import { BRAND } from "@/xo/brand";
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
    case "received": return tx("Received");
    case "coalesced": return tx("Coalesced");
    case "skipped": return tx("Skipped");
    case "issue_created": return tx("Issue created");
    case "suspended": return tx("Suspended");
    case "limited": return tx("Limited");
    case "usage_limited": return tx("Usage limited");
    case "complete": return tx("Complete");
    case "ready": return tx("Ready");
    case "warning": return tx("Warning");
    case "coming_soon": return tx("Coming soon");
    case "verifying": return tx("Verifying");
    case "attention": return tx("Needs attention");
    case "revoked": return tx("Revoked");
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

// WorkspaceRuntimeControls-ийн «Run» товч: глобал "Run" түлхүүр нэр үг («Ажиллагаа») тул
// үйл үгийн контексттой түлхүүр хэрэглэж, en дээр guard англиар буцаана.
export function xoRunActionLabel(): string {
  if (!(i18n.resolvedLanguage ?? i18n.language ?? "").startsWith("mn")) return "Run";
  return tx("Run (action)");
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

/** RoutineDetail SECTION_TITLES (Ү6 7.8). */
export function xoRoutineSectionLabel(english: string): string {
  if (!(i18n.resolvedLanguage ?? i18n.language ?? "").startsWith("mn")) return english;
  switch (english) {
    case "Overview": return tx("Overview");
    case "Schedule": return tx("Schedule");
    case "Variables": return tx("Variables");
    case "Secrets": return tx("Secrets");
    case "Delivery": return tx("Delivery");
    case "Runs": return tx("Runs");
    case "Activity": return tx("Activity");
    case "Version history": return tx("Version history");
    default: return english;
  }
}

/** editable-sections triggerKinds — en дээр raw kind (жижиг үсгээр) хэвээр. */
export function xoTriggerKindLabel(kind: string): string {
  if (!(i18n.resolvedLanguage ?? i18n.language ?? "").startsWith("mn")) return kind;
  switch (kind) {
    case "schedule": return tx("schedule");
    case "webhook": return tx("webhook");
    default: return kind;
  }
}

/** Webhook signing mode нэр: bearer / hmac_sha256 / github_hmac латинаар үлдэнэ, зөвхөн none орчуулна. */
export function xoSigningModeLabel(mode: string): string {
  if (!(i18n.resolvedLanguage ?? i18n.language ?? "").startsWith("mn")) return mode;
  switch (mode) {
    case "none": return tx("none");
    default: return mode;
  }
}

/** editable-sections signingModeDescriptions — mode түлхүүрээр англи өгүүлбэр эсвэл орчуулга. */
export function xoSigningModeDescription(mode: string): string {
  switch (mode) {
    case "bearer": return tx("Expect a shared bearer token in the Authorization header.");
    case "hmac_sha256": return tx("Expect an HMAC SHA-256 signature over the request using the shared secret.");
    case "github_hmac": return tx("Accept GitHub-style X-Hub-Signature-256 header (HMAC over raw body, no timestamp).");
    case "none": return tx("No authentication — the webhook URL itself acts as a shared secret.");
    default: return "";
  }
}

/** cron-fires DISPOSITION_LABEL. */
export function xoFireDispositionLabel(english: string): string {
  if (!(i18n.resolvedLanguage ?? i18n.language ?? "").startsWith("mn")) return english;
  switch (english) {
    case "queued": return tx("queued");
    case "would be coalesced": return tx("would be coalesced");
    case "would be skipped": return tx("would be skipped");
    default: return english;
  }
}

/** cron-readable DOW_NAMES. */
export function xoWeekdayName(english: string): string {
  if (!(i18n.resolvedLanguage ?? i18n.language ?? "").startsWith("mn")) return english;
  switch (english) {
    case "Sunday": return tx("Sunday");
    case "Monday": return tx("Monday");
    case "Tuesday": return tx("Tuesday");
    case "Wednesday": return tx("Wednesday");
    case "Thursday": return tx("Thursday");
    case "Friday": return tx("Friday");
    case "Saturday": return tx("Saturday");
    default: return english;
  }
}

/** RoutineDetail dirtyFields ба RoutineHistoryTab ConflictBanner-ийн «the …» шошго (mn-д артикльгүй нэр үг). */
export function xoRoutineDirtyFieldLabel(english: string): string {
  if (!(i18n.resolvedLanguage ?? i18n.language ?? "").startsWith("mn")) return english;
  switch (english) {
    case "the title": return tx("the title");
    case "the description": return tx("the description");
    case "the project": return tx("the project");
    case "the default agent": return tx("the default agent");
    case "the priority": return tx("the priority");
    case "the concurrency policy": return tx("the concurrency policy");
    case "the catch-up policy": return tx("the catch-up policy");
    case "the advanced run policy": return tx("the advanced run policy");
    case "the activity gate scope": return tx("the activity gate scope");
    case "the variables": return tx("the variables");
    case "the secrets": return tx("the secrets");
    case "the routine": return tx("the routine");
    default: return english;
  }
}

/** RoutineHistoryTab-ын тогтмол field шошго (snapshot мөр ба diff). */
export function xoRoutineHistoryFieldLabel(english: string): string {
  if (!(i18n.resolvedLanguage ?? i18n.language ?? "").startsWith("mn")) return english;
  switch (english) {
    case "Title": return tx("Title");
    case "Priority": return tx("Priority");
    case "Status": return tx("Status");
    case "Default agent": return tx("Default agent");
    case "Project": return tx("Project");
    case "Concurrency": return tx("Concurrency");
    case "Catch-up": return tx("Catch-up");
    case "Env": return tx("Env");
    case "Variables": return tx("Variables");
    default: return english;
  }
}

/** CompanySkills SOURCE_FILTER_LABELS (Ү6 7.9). */
export function xoSkillSourceFilterLabel(english: string): string {
  if (!(i18n.resolvedLanguage ?? i18n.language ?? "").startsWith("mn")) return english;
  switch (english) {
    case "All": return tx("All");
    case "Organization": return tx("Organization");
    case "Bundled": return tx("Bundled");
    case "Optional": return tx("Optional");
    case "External": return tx("External");
    default: return english;
  }
}

/** CompanySkills DISCOVERY_SORT_LABELS (Ү6 7.9). */
export function xoSkillDiscoverySortLabel(english: string): string {
  if (!(i18n.resolvedLanguage ?? i18n.language ?? "").startsWith("mn")) return english;
  switch (english) {
    case "Most agents": return tx("Most agents");
    case "Most stars": return tx("Most stars");
    case "Most forks": return tx("Most forks");
    case "Recently updated": return tx("Recently updated");
    case "Alphabetical": return tx("Alphabetical");
    default: return english;
  }
}

/** skill-folder-tree reservedRootLabel / «Organization» угтвар — зөвхөн харагдах газарт; key-д англиар. */
export function xoSkillReservedRootLabel(english: string): string {
  if (!(i18n.resolvedLanguage ?? i18n.language ?? "").startsWith("mn")) return english;
  switch (english) {
    case "My Skills": return tx("My Skills");
    case "Projects": return tx("Projects");
    case "Bundled": return tx("Bundled");
    case "Organization": return tx("Organization");
    default: return english;
  }
}

/** skill-policy-denial PLATFORM_TITLES — кодоор; мэдэгдэхгүй код эсвэл en дээр fallback. */
export function xoSkillPolicyDenialTitle(code: string, fallback: string): string {
  if (!(i18n.resolvedLanguage ?? i18n.language ?? "").startsWith("mn")) return fallback;
  switch (code) {
    case "skill_authentication_required": return tx("Sign in to manage skills.");
    case "skill_company_boundary_denied": return tx("This skill belongs to another organization.");
    case "skill_workspace_boundary_denied": return tx("This skill source is outside an allowed workspace.");
    case "skill_source_validation_failed": return tx("This skill source failed validation.");
    case "skill_unsafe_content_blocked": return tx("This skill contains unsafe content.");
    case "skill_secret_handling_blocked": return tx("This skill exposes a secret value.");
    case "skill_actor_restricted": return tx("This action isn't available for the current actor.");
    default: return fallback;
  }
}

/** skill-policy-denial PLATFORM_REMEDIATIONS — кодоор; серверийн remediation-д хэрэглэхгүй. */
export function xoSkillPolicyDenialRemediation(code: string, fallback: string): string {
  if (!(i18n.resolvedLanguage ?? i18n.language ?? "").startsWith("mn")) return fallback;
  switch (code) {
    case "skill_authentication_required": return tx("Sign in and try again.");
    case "skill_company_boundary_denied": return tx("Open the skill from the organization that owns it.");
    case "skill_workspace_boundary_denied": return tx("Import from a configured {{brand}} workspace or the organization managed-skill directory.", xoBrandVars());
    case "skill_source_validation_failed": return tx("Fix the flagged source and retry.");
    case "skill_unsafe_content_blocked": return tx("Remove the fetch-and-execute or unsafe pattern before saving.");
    case "skill_secret_handling_blocked": return tx("Remove the secret value before saving.");
    case "skill_actor_restricted": return tx("Retry from an account with access to this action.");
    default: return fallback;
  }
}

function xoIsMn(): boolean {
  return (i18n.resolvedLanguage ?? i18n.language ?? "").startsWith("mn");
}

/** Функц доторх брэндийг {{brand}} болгосон tx-д: en горимд BASE-ийн upstream нэр хэвээр. */
export function xoBrandVars(): { brand: string } {
  return { brand: xoIsMn() ? BRAND.name : "XO" };
}

/** company-skills sourceLabel — зөвхөн серверийн тогтмол хоёр утга; бусад (owner/repo, зам) хэвээр. */
export function xoSkillSourceLabel(english: string): string {
  switch (english) {
    case "Paperclip bundled": return tx("{{brand}} bundled");
    case "Paperclip workspace": return tx("{{brand}} workspace");
    default: return english;
  }
}

/** company-skills хувилбарын label — серверийн "Initial version"; хэрэглэгчийн label хэвээр. */
export function xoSkillVersionLabel(english: string): string {
  if (!xoIsMn()) return english;
  switch (english) {
    case "Initial version": return tx("Initial version");
    default: return english;
  }
}

/** Skills Studio анхдагч туршилтын загварын нэр ба тайлбар (сервер seed). */
export function xoSkillTestTemplateText(english: string): string {
  if (english === "Paperclip's read-only default harness instructions for Skills Studio runs.") {
    return tx("{{brand}}'s read-only default harness instructions for Skills Studio runs.");
  }
  if (!xoIsMn()) return english;
  switch (english) {
    case "Default test template": return tx("Default test template");
    default: return english;
  }
}

/** attention.ts interactionLabel() — харилцан үйлдлийн төрлийн англи шошго. */
export function xoAttentionInteractionLabel(english: string): string {
  if (!xoIsMn()) return english;
  switch (english) {
    case "Confirmation requested": return tx("Confirmation requested");
    case "Selection confirmation requested": return tx("Selection confirmation requested");
    case "Questions need answers": return tx("Questions need answers");
    case "Suggested tasks need a decision": return tx("Suggested tasks need a decision");
    case "Item verdicts need a decision": return tx("Item verdicts need a decision");
    case "Interaction needs a decision": return tx("Interaction needs a decision");
    default: return english;
  }
}

const ATTENTION_WHY_NOW_SUFFIX = " on an issue thread.";

/** attention.ts whyNow = `${interactionLabel(kind)} on an issue thread.` — бусад whyNow хэвээр. */
export function xoAttentionWhyNow(english: string): string {
  if (!xoIsMn() || !english.endsWith(ATTENTION_WHY_NOW_SUFFIX)) return english;
  const prefix = english.slice(0, -ATTENTION_WHY_NOW_SUFFIX.length);
  const label = xoAttentionInteractionLabel(prefix);
  if (label === prefix) return english;
  return tx("{{label}} on an issue thread.", { label });
}

/** decision-queues.ts DECISION_QUEUE_SEEDS — гарчиг, тайлбар, дүрмийн тайлбар. Хэрэглэгчийн дараалал хэвээр. */
export function xoDecisionQueueSeedText(english: string): string {
  if (!xoIsMn()) return english;
  switch (english) {
    case "PRs": return tx("PRs");
    case "Plans": return tx("Plans");
    case "Questions": return tx("Questions");
    case "Pull-request and merge decisions detected from issue work products.":
      return tx("Pull-request and merge decisions detected from issue work products.");
    case "Attention items whose issue has a pull_request work product.":
      return tx("Attention items whose issue has a pull_request work product.");
    case "Plan revisions waiting for confirmation.": return tx("Plan revisions waiting for confirmation.");
    case "Pending request_confirmation interactions bound to the issue's plan document.":
      return tx("Pending request_confirmation interactions bound to the issue's plan document.");
    case "Structured questions waiting for a board response.":
      return tx("Structured questions waiting for a board response.");
    case "Pending ask_user_questions interactions.": return tx("Pending ask_user_questions interactions.");
    default: return english;
  }
}

/** ROUTINE_RUN_SOURCES: schedule / manual / api / webhook — api латинаар үлдэнэ. en дээр raw. */
export function xoRoutineRunSourceLabel(source: string): string {
  if (!xoIsMn()) return source;
  switch (source) {
    case "manual": return tx("manual");
    default: return xoTriggerKindLabel(source);
  }
}

/** `trigger.label ?? trigger.kind`-ийн орлуулга: label байхгүй эсвэл kind-тай тэнцүү бол kind-ийг орчуулна. */
export function xoRoutineTriggerLabel(label: string | null | undefined, kind: string): string {
  if (label == null || label === kind) return xoTriggerKindLabel(kind);
  return label;
}

/** RoutineHistoryTab snapshot утгууд: priority, status, concurrency/catch-up policy (зай эсвэл доогуур зураастай). */
export function xoRoutineHistoryValueLabel(value: string): string {
  if (!xoIsMn()) return value;
  switch (value.replaceAll(" ", "_")) {
    case "low": return tx("Low");
    case "medium": return tx("Medium");
    case "high": return tx("High");
    case "critical": return tx("Critical");
    case "active": return tx("Active");
    case "paused": return tx("Paused");
    case "archived": return tx("Archived");
    case "coalesce_if_active": return tx("Coalesce if active");
    case "always_enqueue": return tx("Always enqueue");
    case "skip_if_active": return tx("Skip if active");
    case "skip_missed": return tx("Skip missed");
    case "enqueue_missed_with_cap": return tx("Enqueue missed with cap");
    default: return value;
  }
}

const ROUTINE_TRIGGER_SUMMARY_RE = /^(Created|Updated|Deleted) (\S+) trigger$/;
const ROUTINE_RESTORED_SUMMARY_RE = /^Restored from revision (\d+)$/;

/** routines.ts revision changeSummary — серверийн тогтмол утгууд; хэрэглэгчийн бичсэн тайлбар хэвээр. */
export function xoRoutineChangeSummary(summary: string): string {
  if (!xoIsMn()) return summary;
  switch (summary) {
    case "Created routine": return tx("Created routine");
    case "Updated routine": return tx("Updated routine");
    case "Rotated webhook trigger secret": return tx("Rotated webhook trigger secret");
  }
  const trigger = ROUTINE_TRIGGER_SUMMARY_RE.exec(summary);
  if (trigger) {
    const kind = xoTriggerKindLabel(trigger[2]);
    switch (trigger[1]) {
      case "Created": return tx("Created {{kind}} trigger", { kind });
      case "Updated": return tx("Updated {{kind}} trigger", { kind });
      case "Deleted": return tx("Deleted {{kind}} trigger", { kind });
    }
  }
  const restored = ROUTINE_RESTORED_SUMMARY_RE.exec(summary);
  if (restored) return tx("Restored from revision {{number}}", { number: restored[1] });
  return summary;
}

/** company-skills.ts editableReason — серверийн тогтмол утгууд. */
export function xoSkillEditableReason(reason: string): string {
  if (reason === "Bundled Paperclip skills are read-only.") return tx("Bundled {{brand}} skills are read-only.");
  if (!xoIsMn()) return reason;
  switch (reason) {
    case "Skills.sh-managed skills are read-only.": return tx("Skills.sh-managed skills are read-only.");
    case "Remote GitHub skills are read-only. Fork or import locally to edit them.":
      return tx("Remote GitHub skills are read-only. Fork or import locally to edit them.");
    case "URL-based skills are read-only. Save them locally to edit them.":
      return tx("URL-based skills are read-only. Save them locally to edit them.");
    case "This skill source is read-only.": return tx("This skill source is read-only.");
    default: return reason;
  }
}

const ATTENTION_PLAN_APPROVAL_PREFIX = "Plan approval - ";

/** attention.ts subject.title — «Plan approval - <issue title>» угтвар ба interactionLabel; issue-ийн гарчиг хэвээр. */
export function xoAttentionTitle(title: string): string {
  if (!xoIsMn()) return title;
  if (title.startsWith(ATTENTION_PLAN_APPROVAL_PREFIX)) {
    return tx("Plan approval - {{title}}", { title: title.slice(ATTENTION_PLAN_APPROVAL_PREFIX.length) });
  }
  return xoAttentionInteractionLabel(title);
}

// Task chat-ийн файлын үйлдэл (TaskChatProtocolCard, TaskChatProtocolActivityRow).
export function xoFileOperationLabel(operation: string): string {
  switch (operation) {
    case "create": return tx("create");
    case "modify": return tx("modify");
    case "delete": return tx("delete");
    case "rename": return tx("rename");
    case "mode_change": return tx("mode change");
    default: return operation.replaceAll("_", " ");
  }
}

// IssueWorkProductType-ийн жижиг үсгийн шошго (ArtifactsPanel, TaskChatThread). en дээр түүхий утга.
export function xoWorkProductTypeLabel(type: string): string {
  const english = type.replaceAll("_", " ");
  if (!xoIsMn()) return english;
  switch (type) {
    case "preview_url": return tx("preview url");
    case "runtime_service": return tx("runtime service");
    case "pull_request": return tx("pull request");
    case "branch": return tx("branch");
    case "commit": return tx("commit");
    case "artifact": return tx("artifact");
    case "document": return tx("document");
    default: return english;
  }
}

// ChatFileTransferPhase (ChatEndpointDetail). en дээр түүхий утга.
export function xoFileTransferPhaseLabel(phase: string): string {
  const english = phase.replaceAll("_", " ");
  if (!xoIsMn()) return english;
  switch (phase) {
    case "consent_pending": return tx("consent pending");
    case "consent_sending": return tx("consent sending");
    case "consent_unknown": return tx("consent unknown");
    case "awaiting_consent": return tx("awaiting consent");
    case "upload_pending": return tx("upload pending");
    case "uploading": return tx("uploading");
    case "upload_unknown": return tx("upload unknown");
    case "file_info_pending": return tx("file info pending");
    case "file_info_sending": return tx("file info sending");
    case "file_info_unknown": return tx("file info unknown");
    case "delivered": return tx("delivered");
    case "declined": return tx("declined");
    case "expired": return tx("expired");
    case "cancelled": return tx("cancelled");
    case "conflict": return tx("conflict");
    default: return english;
  }
}

// StatusCardDetailDrawer-ийн changeKind (status-card-update-engine). en дээр түүхий утга.
export function xoStatusCardChangeKindLabel(changeKind: string): string {
  const english = changeKind.replace(/_/g, " ");
  if (!xoIsMn()) return english;
  switch (changeKind) {
    case "removed": return tx("removed from the query");
    case "status": return tx("status changed");
    case "assignee": return tx("assignee changed");
    case "human_comment": return tx("new human comment");
    case "updated": return tx("updated");
    default: return english;
  }
}
