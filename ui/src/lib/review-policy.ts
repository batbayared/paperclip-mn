import { UserCheck, UserMinus, type LucideIcon } from "lucide-react";
import { ISSUE_REVIEW_POLICIES, type IssueReviewPolicy } from "@paperclipai/shared";
import { tx } from "@/i18n/xo";

/**
 * Copy for an issue's `reviewPolicy` (PAP-16506 P4).
 *
 * `in_review` means the work needs a verdict, and by default anyone with write
 * access can give it — people and agents alike, including the agent that did the
 * work. That default needs no UI at all: it is what every issue already does,
 * and there is no control for changing it. Only an agent sets the column, and
 * only the two opt-in constraints are worth showing:
 *
 * - `not_creator` — "Anyone else": the reviewer must not be the requester.
 * - `human_only` — "Human only": an agent cannot give the verdict.
 *
 * A `null` or `"anyone"` column renders nothing. Every surface that shows the
 * policy routes through {@link issueReviewPolicyBadge} so the review card, the
 * issue properties row, and the activity receipt cannot drift from each other or
 * from the server's refusal copy in `server/src/services/issue-review-policy.ts`.
 */

export interface IssueReviewPolicyBadge {
  value: IssueReviewPolicy;
  /** Badge text. */
  label: string;
  /** Tooltip — the rule the server enforces, spelled out. */
  description: string;
  Icon: LucideIcon;
}

/** Only the constrained policies are shown; `anyone` is the silent default. */
const BADGES: Partial<Record<IssueReviewPolicy, IssueReviewPolicyBadge>> = {
  not_creator: {
    value: "not_creator",
    label: "Anyone else",
    description: "Anyone except whoever asked for the review can approve it.",
    Icon: UserMinus,
  },
  human_only: {
    value: "human_only",
    label: "Human only",
    description: "Only a person can approve this review. Agents cannot give the verdict.",
    Icon: UserCheck,
  },
};

/** Mid-sentence wording for activity lines and field-change receipts. */
const VALUE_LABELS: Record<IssueReviewPolicy, string> = {
  anyone: "anyone",
  not_creator: "anyone else",
  human_only: "human only",
};

/**
 * The badge for a policy, or `null` when there is nothing to show — which is the
 * common case, since an unset column means the default "anyone can approve".
 */
export function issueReviewPolicyBadge(
  policy: IssueReviewPolicy | null | undefined,
): IssueReviewPolicyBadge | null {
  if (typeof policy !== "string") return null;
  const badge = BADGES[policy as IssueReviewPolicy];
  if (!badge) return null;
  // XO: BADGES stays English; label/description are localized at call time.
  switch (badge.value) {
    case "not_creator":
      return {
        ...badge,
        label: tx("Anyone else"),
        description: tx("Anyone except whoever asked for the review can approve it."),
      };
    case "human_only":
      return {
        ...badge,
        label: tx("Human only"),
        description: tx("Only a person can approve this review. Agents cannot give the verdict."),
      };
    default:
      return badge;
  }
}

/**
 * Mid-sentence wording for an activity line or a field-change receipt, where a
 * cleared column must read "anyone" rather than "none".
 */
export function formatReviewPolicyValue(value: unknown): string {
  if (value === null || value === undefined) return reviewPolicyValueLabel("anyone");
  if (typeof value !== "string") return reviewPolicyValueLabel("anyone");
  // Forward-compatible: a policy this build does not know reads as itself.
  return value in VALUE_LABELS
    ? reviewPolicyValueLabel(value as IssueReviewPolicy)
    : value.replace(/_/g, " ");
}

/** XO: localized mid-sentence wording; VALUE_LABELS stays the English source. */
function reviewPolicyValueLabel(policy: IssueReviewPolicy): string {
  switch (policy) {
    case "anyone":
      return tx("anyone");
    case "not_creator":
      return tx("anyone else");
    case "human_only":
      return tx("human only");
    default:
      return VALUE_LABELS[policy];
  }
}

/**
 * Read the policy off an untyped `AttentionSubject.metadata` bag. Absent or
 * unrecognised → `null`, which every consumer treats as the default.
 */
export function readIssueReviewPolicyMetadata(
  metadata: Record<string, unknown> | null | undefined,
): IssueReviewPolicy | null {
  const raw = metadata?.reviewPolicy;
  if (typeof raw !== "string") return null;
  return (ISSUE_REVIEW_POLICIES as readonly string[]).includes(raw)
    ? (raw as IssueReviewPolicy)
    : null;
}
