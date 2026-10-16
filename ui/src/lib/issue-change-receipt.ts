import { xoLocaleDateTime } from "@/xo/date-format";
import { i18n } from "@/i18n";
import { tx } from "@/i18n/xo";
import { xoRoutineHistoryValueLabel, xoStatusLabel } from "@/xo/labels";
import type { IssueChangeReceiptEntry } from "@paperclipai/shared";
import { formatReviewPolicyValue } from "./review-policy";

/**
 * Read + format the field-level change receipts carried on an `issue.updated`
 * activity event (the open cross-task write design (audit), built on the field-change receipts the API already records).
 *
 * Every issue PATCH — agent and board alike — must leave an auditable record of
 * who changed what, when, and under which authorization. The server writes that
 * receipt; this module turns it into something a human can scan in the activity
 * stream without opening the audit log.
 *
 * The server already drops `updatedAt` and truncates long text (flagging it with
 * `updated: true`), so this module renders what it is given rather than
 * re-deciding what is interesting.
 */

/** Field names whose raw ids carry no meaning in a scannable summary. */
/** XO: field labels resolved at call time (never tx at module level). */
function knownFieldLabel(field: string): string | null {
  switch (field) {
    case "assigneeAgentId":
      return tx("Assignee");
    case "assigneeUserId":
      return tx("Assignee (user)");
    case "responsibleUserId":
      return tx("Responsible user");
    case "blockedByIssueIds":
      return tx("Blockers");
    case "labelIds":
      return tx("Labels");
    case "parentId":
      return tx("Parent");
    case "projectId":
      return tx("Project");
    case "goalId":
      return tx("Goal");
    case "workMode":
      return tx("Work mode");
    case "reviewPolicy":
      return tx("Who can approve");
    case "billingCode":
      return tx("Billing code");
    case "checkoutRunId":
      return tx("Checkout run");
    case "executionRunId":
      return tx("Execution run");
    case "hiddenAt":
      return tx("Hidden");
    case "startedAt":
      return tx("Started");
    case "completedAt":
      return tx("Completed");
    case "cancelledAt":
      return tx("Cancelled");
    case "requestDepth":
      return tx("Request depth");
    case "sourceTrust":
      return tx("Source trust");
    case "executionPolicy":
      return tx("Execution policy");
    case "executionWorkspaceId":
      return tx("Execution workspace");
    case "projectWorkspaceId":
      return tx("Project workspace");
    default:
      return null;
  }
}

/** Human label for a changed field, e.g. `assigneeAgentId` → "Assignee". */
export function issueChangeFieldLabel(field: string): string {
  const known = knownFieldLabel(field) ?? xoBaseFieldLabel(field);
  if (known) return known;
  // camelCase / snake_case → "Sentence case".
  const spaced = field
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .toLowerCase()
    .trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

// XO: mn-д л ашиглагдана; en дээр доорх camelCase fallback байт ижил хэвээр.
function xoIsMn(): boolean {
  return (i18n.resolvedLanguage ?? i18n.language ?? "").startsWith("mn");
}

function xoBaseFieldLabel(field: string): string | null {
  if (!xoIsMn()) return null;
  switch (field) {
    case "status": return tx("Status");
    case "priority": return tx("Priority");
    case "title": return tx("Title");
    case "description": return tx("Description");
    default: return null;
  }
}

/** XO: issue-ийн enum утга (ISSUE_STATUSES, ISSUE_PRIORITIES, ISSUE_WORK_MODES). */
function xoEnumValueLabel(field: string | undefined, value: string, english: string): string {
  if (!xoIsMn()) return english;
  switch (field) {
    case "status": return xoStatusLabel(value, english);
    case "priority": return xoRoutineHistoryValueLabel(value);
    case "workMode":
      switch (value) {
        case "standard": return tx("Auto mode");
        case "planning": return tx("Plan mode");
        case "ask": return tx("Ask mode");
        case "skill_test": return tx("Skill test");
        default: return english;
      }
    default: return english;
  }
}

const VALUE_PREVIEW_BUDGET = 72;

/**
 * Render one side of a change for display. Never returns an empty string, so a
 * receipt row always reads as "from → to" rather than trailing into nothing.
 */
export function formatIssueChangeValue(
  value: unknown,
  options: { resolveAgentLabel?: (id: string) => string | null | undefined;
    resolveUserLabel?: (id: string) => string | null | undefined;
    field?: string } = {},
): string {
  // `reviewPolicy` is nullable-by-default: a cleared column means "anyone can
  // approve", not "no value" (PAP-16506), so it resolves before the null branch.
  if (options.field === "reviewPolicy") return formatReviewPolicyValue(value);
  if (value === null || value === undefined || value === "") return tx("none");
  if (typeof value === "boolean") return value ? tx("yes") : tx("no");
  if (typeof value === "number") return String(value);

  if (Array.isArray(value)) {
    if (value.length === 0) return tx("none");
    const strings = value.filter((entry): entry is string => typeof entry === "string");
    if (strings.length !== value.length) return tx("{{n}} items", { n: value.length });
    return strings.length <= 3
      ? strings.map((id) => shortenId(id)).join(", ")
      : tx("{{n}} items", { n: strings.length });
  }

  if (value instanceof Date) return xoLocaleDateTime(value);

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return tx("none");
    // Ids resolve to names when the directory is loaded; otherwise they shorten.
    const resolved = options.field?.toLowerCase().includes("agent")
      ? options.resolveAgentLabel?.(trimmed)
      : options.field?.toLowerCase().includes("user")
        ? options.resolveUserLabel?.(trimmed)
        : null;
    if (resolved) return resolved;
    if (isIsoTimestamp(trimmed)) return xoLocaleDateTime(new Date(trimmed));
    if (looksLikeId(trimmed)) return shortenId(trimmed);
    const humanized = trimmed.includes(" ") ? trimmed : trimmed.replace(/_/g, " ");
    return truncate(xoEnumValueLabel(options.field, trimmed, humanized));
  }

  // Objects (execution policy, workspace settings) are structural — the receipt
  // records that they moved, and the audit log holds the full value.
  return tx("updated");
}

function truncate(value: string): string {
  const chars = Array.from(value);
  if (chars.length <= VALUE_PREVIEW_BUDGET) return value;
  return `${chars.slice(0, VALUE_PREVIEW_BUDGET).join("")}…`;
}

function isIsoTimestamp(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value) && !Number.isNaN(Date.parse(value));
}

function looksLikeId(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

function shortenId(value: string): string {
  return looksLikeId(value) ? value.slice(0, 8) : truncate(value);
}

export interface IssueChangeReceiptRow {
  field: string;
  label: string;
  from: string;
  to: string;
  /** Server flagged the values as truncated previews of long text. */
  truncated: boolean;
}

function isChangeEntry(value: unknown): value is IssueChangeReceiptEntry {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value) && "from" in (value as object) && "to" in (value as object);
}

/**
 * Parse `details.changes` off an activity event into display rows. Returns an
 * empty array for events with no receipt (older rows, non-PATCH actions), so
 * callers can render nothing without special-casing.
 */
export function readIssueChangeReceipt(
  details: Record<string, unknown> | null | undefined,
  options: Parameters<typeof formatIssueChangeValue>[1] = {},
): IssueChangeReceiptRow[] {
  const changes = details?.changes;
  if (!changes || typeof changes !== "object" || Array.isArray(changes)) return [];

  const rows: IssueChangeReceiptRow[] = [];
  for (const [field, entry] of Object.entries(changes as Record<string, unknown>)) {
    if (!isChangeEntry(entry)) continue;
    rows.push({
      field,
      label: issueChangeFieldLabel(field),
      from: formatIssueChangeValue(entry.from, { ...options, field }),
      to: formatIssueChangeValue(entry.to, { ...options, field }),
      truncated: entry.updated === true,
    });
  }
  // Stable, scannable order regardless of JSON key order (jsonb reorders keys).
  return rows.sort((a, b) => a.label.localeCompare(b.label));
}

/** Authorization reasons, as recorded by the server's write-policy decision. */
function authorizationReasonLabel(reason: string): string | null {
  switch (reason) {
    case "allow_visible_issue_write":
      return tx("default-open write on a visible task");
    case "allow_scoped_agent_write":
      return tx("scoped agent write");
    case "allow_board_actor":
      return tx("board actor");
    case "allow_self":
      return tx("own task");
    case "allow_issue_mention_grant":
      return tx("mention grant");
    case "allow_direct_parent_report":
      return tx("direct parent report");
    case "allow_low_trust_boundary":
      return tx("low-trust boundary allowance");
    case "allow_explicit_grant":
      return tx("explicit permission grant");
    case "allow_instance_admin":
      return tx("instance admin");
    case "allow_local_board":
      return tx("local board");
    case "internal_agent_write":
      return tx("internal agent write");
    default:
      return null;
  }
}

/**
 * Human phrasing for the authorization reason on a write receipt. Unknown
 * reasons degrade to their humanized code rather than disappearing — an
 * unexplained write is worse than an ugly one.
 */
export function issueAuthorizationReasonLabel(reason: string | null | undefined): string | null {
  const trimmed = reason?.trim();
  if (!trimmed) return null;
  return authorizationReasonLabel(trimmed) ?? trimmed.replace(/_/g, " ");
}
