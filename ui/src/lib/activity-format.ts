import type { Agent } from "@paperclipai/shared";
import { i18n } from "@/i18n";
import { tx } from "@/i18n/xo";
import type { CompanyUserProfile } from "./company-members";
import { formatReviewPolicyValue } from "./review-policy";

type ActivityDetails = Record<string, unknown> | null | undefined;

type ActivityParticipant = {
  type: "agent" | "user";
  agentId?: string | null;
  userId?: string | null;
};

type ActivityIssueReference = {
  id?: string | null;
  identifier?: string | null;
  title?: string | null;
};

interface ActivityFormatOptions {
  agentMap?: Map<string, Agent>;
  userProfileMap?: Map<string, CompanyUserProfile>;
  currentUserId?: string | null;
}

const ACTIVITY_ROW_VERBS: Record<string, () => string> = {
  "issue.created": () => tx("created"),
  "issue.updated": () => tx("updated"),
  "issue.read_marked": () => tx("read"),
  "issue.read_unmarked": () => tx("marked unread"),
  "issue.checked_out": () => tx("checked out"),
  "issue.released": () => tx("released"),
  "issue.comment_added": () => tx("commented on"),
  "issue.comment_cancelled": () => tx("cancelled a queued comment on"),
  "issue.queued_comment_edited": () => tx("edited a queued comment on"),
  "issue.queued_comments_reordered": () => tx("reordered queued comments on"),
  "issue.queued_comment_discarded": () => tx("discarded a queued comment on"),
  "issue.comment_deleted": () => tx("deleted a comment on"),
  "issue.attachment_added": () => tx("attached file to"),
  "issue.attachment_removed": () => tx("removed attachment from"),
  "issue.document_created": () => tx("created document for"),
  "issue.document_updated": () => tx("updated document on"),
  "issue.document_locked": () => tx("locked document on"),
  "issue.document_unlocked": () => tx("unlocked document on"),
  "issue.document_deleted": () => tx("deleted document from"),
  "issue.monitor_scheduled": () => tx("scheduled monitor on"),
  "issue.monitor_triggered": () => tx("triggered monitor for"),
  "issue.monitor_cleared": () => tx("cleared monitor on"),
  "issue.monitor_skipped": () => tx("skipped monitor for"),
  "issue.monitor_exhausted": () => tx("exhausted monitor on"),
  "issue.monitor_recovery_wake_queued": () => tx("queued monitor recovery for"),
  "issue.monitor_recovery_issue_created": () => tx("created monitor recovery for"),
  "issue.monitor_escalated_to_board": () => tx("escalated monitor for"),
  "issue.commented": () => tx("commented on"),
  "issue.deleted": () => tx("deleted"),
  "issue.successful_run_handoff_required": () => tx("flagged missing next step on"),
  "issue.successful_run_handoff_resolved": () => tx("recorded next step chosen on"),
  "issue.successful_run_handoff_escalated": () => tx("escalated missing next step on"),
  "issue.accepted_plan_decomposition_updated": () => tx("updated accepted-plan decomposition on"),
  "issue.recovery_action_opened": () => tx("opened a recovery action on"),
  "issue.recovery_action_resolved": () => tx("resolved the recovery action on"),
  "issue.recovery_action_escalated": () => tx("escalated the recovery action on"),
  "agent.created": () => tx("created"),
  "agent.updated": () => tx("updated"),
  "agent.paused": () => tx("paused"),
  "agent.resumed": () => tx("resumed"),
  "agent.error_cleared": () => tx("cleared error on"),
  "agent.terminated": () => tx("terminated"),
  "agent.key_created": () => tx("created API key for"),
  "agent.budget_updated": () => tx("updated budget for"),
  "agent.runtime_session_reset": () => tx("reset session for"),
  "heartbeat.invoked": () => tx("invoked heartbeat for"),
  "heartbeat.cancelled": () => tx("cancelled heartbeat for"),
  "heartbeat.output_stale_source_resolved": () => tx("system-folded stale run on"),
  "heartbeat.output_stale_recovery_recursion_refused": () => tx("refused recovery-on-recovery for"),
  "approval.created": () => tx("requested approval"),
  "approval.approved": () => tx("approved"),
  "approval.rejected": () => tx("rejected"),
  // Interaction outcomes (PAP-16506). An agent may now resolve one — including a
  // review of its own work — so these must read as outcomes in the feed instead
  // of falling through to the raw "issue thread interaction accepted" action id.
  // `details.interactionKind` sharpens the wording; see INTERACTION_OUTCOME_LABELS.
  "issue.thread_interaction_created": () => tx("asked for a decision on"),
  "issue.thread_interaction_accepted": () => tx("accepted the request on"),
  "issue.thread_interaction_rejected": () => tx("rejected the request on"),
  "issue.thread_interaction_answered": () => tx("answered the request on"),
  "issue.thread_interaction_withdrawn": () => tx("withdrew the request on"),
  "issue.thread_interaction_cancelled": () => tx("cancelled the request on"),
  "issue.thread_interaction_skipped": () => tx("skipped the request on"),
  "issue.thread_interaction_expired": () => tx("expired the request on"),
  "issue.thread_interaction_item_verdicts_submitted": () => tx("submitted verdicts on"),
  "issue.stalled_review_decided": () => tx("recorded a review verdict on"),
  "project.created": () => tx("created"),
  "project.updated": () => tx("updated"),
  "project.deleted": () => tx("deleted"),
  "goal.created": () => tx("created"),
  "goal.updated": () => tx("updated"),
  "goal.deleted": () => tx("deleted"),
  "cost.reported": () => tx("reported cost for"),
  "cost.recorded": () => tx("recorded cost for"),
  "company.created": () => tx("created organization"),
  "company.updated": () => tx("updated organization"),
  "company.archived": () => tx("archived"),
  "company.reactivated": () => tx("reactivated"),
  "company.budget_updated": () => tx("updated budget for"),
  "audit.exported": () => tx("exported the agent audit log for"),
  "tool_app.connected": () => tx("connected"),
  "tool_app.oauth_connected": () => tx("connected credentials for"),
  "tool_app.oauth_failed": () => tx("failed to connect credentials for"),
  "tool_app.oauth_access_finalized": () => tx("finished credential access for"),
  "tool_app.finished": () => tx("finished setup for"),
  "tool_app.reconnected": () => tx("reconnected"),
  "tool_connection.created": () => tx("created"),
  "tool_connection.updated": () => tx("updated"),
  "tool_connection.archived": () => tx("removed"),
  "tool_connection.catalog_refresh": () => tx("refreshed actions for"),
  "tool_connection.installs_synced": () => tx("changed agent installs for"),
  "tool_connection.install_access_extended": () => tx("extended agent access for"),
  "tool_connection.grant_audience_replaced": () => tx("changed human access for"),
  "tool_connection.grant_added": () => tx("added credentials to"),
  "tool_connection.grant_revoked": () => tx("revoked credentials from"),
  "tool_connection.grant_delegated": () => tx("delegated credentials for"),
  "tool_connection.grant_delegation_revoked": () => tx("revoked credential delegation for"),
};

// XO: upstream хүснэгтэд байхгүй, хэрэглэгчид харагдах action-ын үйл үг. Зөвхөн mn дээр
// ашиглагдана; en дээр upstream fallback (action.replace) байт ижил хэвээр үлдэнэ.
// Нэр нь мөрөнд харагддаг entity (issue, agent, project)-ийн mn утга «…:»-аар төгсөнө.
const XO_ACTIVITY_ROW_VERBS: Record<string, () => string> = {
  "routine.created": () => tx("created routine"),
  "routine.updated": () => tx("updated routine"),
  "routine.revision_created": () => tx("saved a routine revision"),
  "routine.revision_restored": () => tx("restored a routine revision"),
  "routine.run_triggered": () => tx("ran routine"),
  "routine.run_skipped": () => tx("skipped a routine run"),
  "routine.trigger_created": () => tx("added a routine trigger"),
  "routine.trigger_updated": () => tx("updated a routine trigger"),
  "routine.trigger_deleted": () => tx("removed a routine trigger"),
  "routine.trigger_secret_rotated": () => tx("rotated a routine trigger secret"),
  "routine.document_annotation_comment_added": () => tx("commented on a routine document"),
  "routine.document_annotation_thread_created": () => tx("started a comment thread on a routine document"),
  "routine.document_annotation_thread_resolved": () => tx("resolved a comment thread on a routine document"),
  "routine.document_annotation_thread_reopened": () => tx("reopened a comment thread on a routine document"),
  "company.skill_created": () => tx("created skill"),
  "company.skill_updated": () => tx("updated skill"),
  "company.skill_deleted": () => tx("deleted skill"),
  "company.skill_renamed": () => tx("renamed skill"),
  "company.skill_forked": () => tx("forked skill"),
  "company.skill_reset": () => tx("reset skill"),
  "company.skill_file_updated": () => tx("updated a skill file"),
  "company.skill_file_deleted": () => tx("deleted a skill file"),
  "company.skill_version_created": () => tx("saved a skill version"),
  "company.skill_starred": () => tx("starred skill"),
  "company.skill_unstarred": () => tx("unstarred skill"),
  "company.skill_comment_created": () => tx("commented on skill"),
  "company.skill_comment_updated": () => tx("edited a comment on skill"),
  "company.skill_comment_deleted": () => tx("deleted a comment on skill"),
  "company.skill_policy_replaced": () => tx("updated skill policy"),
  "company.skill_policy_reset": () => tx("reset skill policy"),
  "company.skill_audited": () => tx("audited skill"),
  "company.skill_catalog_installed": () => tx("installed a skill from the catalog"),
  "company.skill_update_installed": () => tx("installed a skill update"),
  "company.skills_imported": () => tx("imported skills"),
  "company.skills_scanned": () => tx("scanned skills"),
  "company.skill_test_input_created": () => tx("added a skill test input"),
  "company.skill_test_input_updated": () => tx("updated a skill test input"),
  "company.skill_test_input_deleted": () => tx("deleted a skill test input"),
  "company.skill_test_run_created": () => tx("started a skill test run"),
  "company.skill_test_run_completed": () => tx("completed a skill test run"),
  "company.skill_test_run_cancelled": () => tx("cancelled a skill test run"),
  "company.skill_test_run_deleted": () => tx("deleted a skill test run"),
  "company.skill_test_run_template_created": () => tx("created a skill test template"),
  "company.skill_test_run_template_updated": () => tx("updated a skill test template"),
  "company.skill_test_run_template_deleted": () => tx("deleted a skill test template"),
  "company_member.updated": () => tx("updated a member"),
  "company_member.access_updated": () => tx("updated member access"),
  "company_member.permissions_updated": () => tx("updated member permissions"),
  "company_member.archived": () => tx("archived a member"),
  "secret.created": () => tx("created secret"),
  "secret.updated": () => tx("updated secret"),
  "secret.deleted": () => tx("deleted secret"),
  "secret.rotated": () => tx("rotated secret"),
  "secret.binding.created": () => tx("linked a secret"),
  "secret.proposal.created": () => tx("proposed a secret"),
  "secret.proposal.approved": () => tx("approved a secret proposal"),
  "secret.proposal.rejected": () => tx("rejected a secret proposal"),
  "secret.proposal.denied": () => tx("denied a secret proposal"),
  "secret.remote_import.completed": () => tx("imported secrets"),
  "folder.created": () => tx("created folder"),
  "folder.updated": () => tx("updated folder"),
  "folder.deleted": () => tx("deleted folder"),
  "folder.moved": () => tx("moved folder"),
  "folder.item_moved": () => tx("moved an item to a folder"),
  "decision.created": () => tx("created a decision"),
  "decision.cancelled": () => tx("cancelled a decision"),
  "decision.dismissed": () => tx("dismissed a decision"),
  "decision.expired": () => tx("marked a decision expired"),
  "decision_queue.created": () => tx("created a decision queue"),
  "decision_queue.updated": () => tx("updated a decision queue"),
  "decision_queue_item.added": () => tx("added an item to a decision queue"),
  "decision_queue_item.removed": () => tx("removed an item from a decision queue"),
  "decision_retention.archived": () => tx("archived a decision"),
  "decision_retention.auto_archived": () => tx("auto-archived a decision"),
  "decision_retention.keep_updated": () => tx("changed decision retention"),
  "decision_training.created": () => tx("added a decision training example"),
  "decision_training.deleted": () => tx("deleted a decision training example"),
  "decision_training.exported": () => tx("exported decision training data"),
  "decision_training.notes_updated": () => tx("updated decision training notes"),
  "decision_triage.updated": () => tx("updated decision triage"),
  "approval.comment_added": () => tx("commented on an approval"),
  "approval.resubmitted": () => tx("resubmitted an approval"),
  "approval.revision_requested": () => tx("requested changes on an approval"),
  "agent.approved": () => tx("approved hiring"),
  "agent.deleted": () => tx("deleted"),
  "agent.hire_created": () => tx("requested to hire"),
  "agent.config_rolled_back": () => tx("rolled back the configuration of"),
  "agent.instructions_bundle_updated": () => tx("updated instructions for"),
  "agent.instructions_file_updated": () => tx("updated an instructions file for"),
  "agent.instructions_file_deleted": () => tx("deleted an instructions file for"),
  "agent.instructions_path_updated": () => tx("changed the instructions path for"),
  "agent.key_revoked": () => tx("revoked API key for"),
  "agent.permissions_updated": () => tx("updated permissions for"),
  "agent.skills_synced": () => tx("synced skills for"),
  "environment.created": () => tx("created environment"),
  "environment.updated": () => tx("updated environment"),
  "environment.deleted": () => tx("deleted environment"),
  "environment.custom_image_setup.started": () => tx("started custom image setup"),
  "environment.custom_image_setup.finished": () => tx("finished custom image setup"),
  "environment.custom_image_setup.cancelled": () => tx("cancelled custom image setup"),
  "environment.custom_image_template.disabled": () => tx("disabled a custom image template"),
  "environment.custom_image_template.relinked": () => tx("relinked a custom image template"),
  "environment.custom_image_template.rolled_back": () => tx("rolled back a custom image template"),
  "environment.lease_acquired": () => tx("acquired an environment lease"),
  "environment.lease_released": () => tx("released an environment lease"),
  "execution_workspace.updated": () => tx("updated an execution workspace"),
  "execution_workspace.reopened": () => tx("reopened an execution workspace"),
  "project.repositories_updated": () => tx("updated repositories for"),
  "project.workspace_created": () => tx("created a workspace for"),
  "project.workspace_updated": () => tx("updated a workspace for"),
  "project.workspace_deleted": () => tx("deleted a workspace from"),
  "label.created": () => tx("created label"),
  "label.deleted": () => tx("deleted label"),
  "invite.created": () => tx("created an invite"),
  "invite.revoked": () => tx("revoked an invite"),
  "join.approved": () => tx("approved a join request"),
  "join.rejected": () => tx("rejected a join request"),
  "budget.policy_upserted": () => tx("updated budget policy"),
  "budget.incident_resolved": () => tx("resolved a budget incident"),
  "budget.soft_threshold_crossed": () => tx("crossed the soft budget threshold"),
  "budget.hard_threshold_crossed": () => tx("crossed the hard budget limit"),
  "issue.assigned": () => tx("assigned"),
  "issue.checkout": () => tx("checked out"),
  "issue.comment.created": () => tx("commented on"),
  "issue.document.updated": () => tx("updated document on"),
  "issue.document_upserted": () => tx("updated document on"),
  "issue.document_restored": () => tx("restored document on"),
  "issue.child_created": () => tx("created a sub-task under"),
  "issue.work_product_created": () => tx("added a work product to"),
  "issue.work_product_updated": () => tx("updated a work product on"),
  "issue.work_product_deleted": () => tx("removed a work product from"),
  "issue.inbox_archived": () => tx("archived from inbox"),
  "issue.inbox_unarchived": () => tx("restored to inbox"),
  "issue.approval_linked": () => tx("linked an approval to"),
  "issue.approval_unlinked": () => tx("unlinked an approval from"),
  "issue.document_annotation_comment_added": () => tx("commented on a document in"),
  "issue.document_annotation_thread_created": () => tx("started a document comment thread on"),
  "issue.document_annotation_thread_resolved": () => tx("resolved a document comment thread on"),
  "issue.relations.updated": () => tx("updated relations on"),
  "issue.watchdog_created": () => tx("added a watchdog to"),
  "issue.watchdog_removed": () => tx("removed the watchdog from"),
  "issue.tree_hold_created": () => tx("paused the task tree under"),
  "issue.tree_hold_released": () => tx("resumed the task tree under"),
  "issue.admin_force_release": () => tx("force-released"),
  "issue.conversation_opened": () => tx("opened a conversation on"),
  "issue.connection_intent_connected": () => tx("connected an app for"),
  "issue.connection_intent_declined": () => tx("declined an app connection for"),
  "issue.scheduled_retry_retry_now": () => tx("retried now"),
  "issue.thread_interaction_updated": () => tx("updated the request on"),
  "issue.interaction_cancelled": () => tx("cancelled the request on"),
  "pipeline.case_document_restored": () => tx("restored a case document"),
  "pipeline.stage_automation_env_updated": () => tx("updated stage automation environment"),
  "chat_endpoint.created": () => tx("created a chat connector"),
  "chat_endpoint.updated": () => tx("updated a chat connector"),
  "chat_endpoint.paused": () => tx("paused a chat connector"),
  "chat_endpoint.resumed": () => tx("resumed a chat connector"),
  "chat_endpoint.reconnected": () => tx("reconnected a chat connector"),
  "tool_profile.created": () => tx("created a tool profile"),
  "tool_profile.updated": () => tx("updated a tool profile"),
  "tool_profile.deleted": () => tx("deleted a tool profile"),
  "tool_profile.duplicated": () => tx("duplicated a tool profile"),
  "tool_policy.created": () => tx("created a tool policy"),
  "tool_policy.updated": () => tx("updated a tool policy"),
  "tool_policy.deleted": () => tx("deleted a tool policy"),
  "tool_policy.duplicated": () => tx("duplicated a tool policy"),
  "tool_policy.reordered": () => tx("reordered tool policies"),
  "smoke_lab.fixtures_installed": () => tx("installed Smoke Lab fixtures"),
  "smoke_lab.reset": () => tx("reset Smoke Lab"),
  "smoke_lab.run_created": () => tx("started a Smoke Lab run"),
  "smoke_lab.run_updated": () => tx("updated a Smoke Lab run"),
  "smoke_lab.services_started": () => tx("started Smoke Lab services"),
  "smoke_lab.services_stopped": () => tx("stopped Smoke Lab services"),
  "smoke_lab.step_recorded": () => tx("recorded a Smoke Lab step"),
  "instance.settings.updated": () => tx("updated instance settings"),
  "instance.settings.general_updated": () => tx("updated general instance settings"),
  "instance.settings.experimental_updated": () => tx("updated experimental instance settings"),
};

function xoActivityRowVerb(action: string): string | undefined {
  if (!(i18n.resolvedLanguage ?? i18n.language ?? "").startsWith("mn")) return undefined;
  return XO_ACTIVITY_ROW_VERBS[action]?.();
}

const ISSUE_ACTIVITY_LABELS: Record<string, () => string> = {
  "issue.created": () => tx("created the issue"),
  "issue.updated": () => tx("updated the issue"),
  "issue.checked_out": () => tx("checked out the issue"),
  "issue.released": () => tx("released the issue"),
  "issue.comment_added": () => tx("added a comment"),
  "issue.comment_cancelled": () => tx("cancelled a queued comment"),
  "issue.queued_comment_edited": () => tx("edited a queued comment"),
  "issue.queued_comments_reordered": () => tx("reordered queued comments"),
  "issue.queued_comment_discarded": () => tx("discarded a queued comment"),
  "issue.comment_deleted": () => tx("deleted a comment"),
  "issue.feedback_vote_saved": () => tx("saved feedback on an AI output"),
  "issue.attachment_added": () => tx("added an attachment"),
  "issue.attachment_removed": () => tx("removed an attachment"),
  "issue.document_created": () => tx("created a document"),
  "issue.document_updated": () => tx("updated a document"),
  "issue.document_locked": () => tx("locked a document"),
  "issue.document_unlocked": () => tx("unlocked a document"),
  "issue.document_deleted": () => tx("deleted a document"),
  "issue.monitor_scheduled": () => tx("scheduled a monitor"),
  "issue.monitor_triggered": () => tx("triggered a monitor"),
  "issue.monitor_cleared": () => tx("cleared a monitor"),
  "issue.monitor_skipped": () => tx("skipped a monitor"),
  "issue.monitor_exhausted": () => tx("exhausted a monitor"),
  "issue.monitor_recovery_wake_queued": () => tx("queued a monitor recovery wake"),
  "issue.monitor_recovery_issue_created": () => tx("created a monitor recovery issue"),
  "issue.monitor_escalated_to_board": () => tx("escalated a monitor to the board"),
  "issue.deleted": () => tx("deleted the issue"),
  "issue.successful_run_handoff_required": () => tx("Run finished without a clear next step"),
  "issue.successful_run_handoff_resolved": () => tx("Next step chosen"),
  "issue.successful_run_handoff_escalated": () => tx("Run finished without a next step - recovery escalated"),
  "issue.cross_issue_influence_cap_rejected": () => tx("hit the per-run cross-task write cap"),
  "issue.cross_issue_influence_observed": () => tx("made a cross-task write"),
  "issue.attribution_spoof_rejected": () => tx("tried to choose its own responsible user"),
  "issue.recovery_action_opened": () => tx("Opened a source-scoped recovery action"),
  "issue.recovery_action_resolved": () => tx("Resolved the recovery action"),
  "issue.recovery_action_escalated": () => tx("Escalated the recovery action"),
  "issue.accepted_plan_decomposition_updated": () => tx("updated the accepted-plan decomposition"),
  "agent.created": () => tx("created an agent"),
  "agent.updated": () => tx("updated the agent"),
  "agent.paused": () => tx("paused the agent"),
  "agent.resumed": () => tx("resumed the agent"),
  "agent.error_cleared": () => tx("cleared the agent error"),
  "agent.terminated": () => tx("terminated the agent"),
  "heartbeat.invoked": () => tx("invoked a heartbeat"),
  "heartbeat.cancelled": () => tx("cancelled a heartbeat"),
  "heartbeat.output_stale_source_resolved": () => tx("System folded a stale run"),
  "heartbeat.output_stale_recovery_recursion_refused": () => tx("Refused recovery-on-recovery escalation"),
  "approval.created": () => tx("requested approval"),
  "approval.approved": () => tx("approved"),
  "approval.rejected": () => tx("rejected"),
  "issue.thread_interaction_created": () => tx("asked for a decision"),
  "issue.thread_interaction_accepted": () => tx("accepted the request"),
  "issue.thread_interaction_rejected": () => tx("rejected the request"),
  "issue.thread_interaction_answered": () => tx("answered the request"),
  "issue.thread_interaction_withdrawn": () => tx("withdrew the request"),
  "issue.thread_interaction_cancelled": () => tx("cancelled the request"),
  "issue.thread_interaction_skipped": () => tx("skipped the request"),
  "issue.thread_interaction_expired": () => tx("expired the request"),
  "issue.thread_interaction_item_verdicts_submitted": () => tx("submitted verdicts on the request"),
  "issue.stalled_review_decided": () => tx("recorded a review verdict"),
};

/**
 * `issue.stalled_review_decided` carries the verb the actor chose, so the line
 * names the verdict ("approved the review") rather than the generic action.
 * Mirrors `StalledReviewDecisionAction` in shared.
 */
const STALLED_REVIEW_DECISION_LABELS: Record<string, () => string> = {
  approve: () => tx("approved the review"),
  request_changes: () => tx("requested changes on the review"),
  send_back: () => tx("sent the review back to work"),
};

/**
 * `issue.thread_interaction_accepted` / `_rejected` fire for *every* interaction
 * kind, not only for a review. A task suggestion or a question is accepted, not
 * approved, so the kind on the event picks the verb. Kinds absent from a map
 * keep the neutral "accepted the request" wording from the tables above, which
 * is also the fallback for an event that carries no kind.
 */
const INTERACTION_ACCEPTED_LABELS: Record<string, () => string> = {
  request_confirmation: () => tx("approved the request"),
  request_checkbox_confirmation: () => tx("approved the request"),
  suggest_tasks: () => tx("accepted the task suggestions"),
  ask_user_questions: () => tx("accepted the answers"),
};

const INTERACTION_REJECTED_LABELS: Record<string, () => string> = {
  request_confirmation: () => tx("rejected the request"),
  request_checkbox_confirmation: () => tx("rejected the request"),
  suggest_tasks: () => tx("declined the task suggestions"),
  ask_user_questions: () => tx("declined the questions"),
};

/**
 * Kind-aware wording for an interaction outcome, or `null` when the tables
 * above already say it well enough.
 */
function formatInteractionOutcomeLabel(action: string, details: ActivityDetails): string | null {
  const table = action === "issue.thread_interaction_accepted"
    ? INTERACTION_ACCEPTED_LABELS
    : action === "issue.thread_interaction_rejected"
      ? INTERACTION_REJECTED_LABELS
      : null;
  if (!table) return null;
  const kind = typeof details?.interactionKind === "string" ? details.interactionKind : null;
  return kind ? table[kind]?.() ?? null : null;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function humanizeValue(value: unknown): string {
  if (typeof value !== "string") return String(value ?? "none");
  return value.replace(/_/g, " ");
}

function isActivityParticipant(value: unknown): value is ActivityParticipant {
  const record = asRecord(value);
  if (!record) return false;
  return record.type === "agent" || record.type === "user";
}

function isActivityIssueReference(value: unknown): value is ActivityIssueReference {
  return asRecord(value) !== null;
}

function readParticipants(details: ActivityDetails, key: string): ActivityParticipant[] {
  const value = details?.[key];
  if (!Array.isArray(value)) return [];
  return value.filter(isActivityParticipant);
}

function readIssueReferences(details: ActivityDetails, key: string): ActivityIssueReference[] {
  const value = details?.[key];
  if (!Array.isArray(value)) return [];
  return value.filter(isActivityIssueReference);
}

function formatUserLabel(userId: string | null | undefined, options: ActivityFormatOptions = {}): string {
  if (!userId || userId === "local-board") return tx("Board");
  if (options.currentUserId && userId === options.currentUserId) return "You";
  const profile = options.userProfileMap?.get(userId);
  if (profile) return profile.label;
  return `user ${userId.slice(0, 5)}`;
}

function formatParticipantLabel(participant: ActivityParticipant, options: ActivityFormatOptions): string {
  if (participant.type === "agent") {
    const agentId = participant.agentId ?? "";
    return options.agentMap?.get(agentId)?.name ?? tx("agent");
  }
  return formatUserLabel(participant.userId, options);
}

function formatIssueReferenceLabel(reference: ActivityIssueReference): string {
  if (reference.identifier) return reference.identifier;
  if (reference.title) return reference.title;
  if (reference.id) return reference.id.slice(0, 8);
  return tx("task");
}

type ChangedEntityKind = "blocker" | "reviewer" | "approver";

function formatChangedEntityLabel(kind: ChangedEntityKind, labels: string[]): string {
  const n = labels.length;
  if (kind === "blocker") {
    if (n <= 0) return tx("blockers");
    if (n === 1) return tx("blocker {{name}}", { name: labels[0] });
    return tx("{{n}} blockers", { n });
  }
  if (kind === "reviewer") {
    if (n <= 0) return tx("reviewers");
    if (n === 1) return tx("reviewer {{name}}", { name: labels[0] });
    return tx("{{n}} reviewers", { n });
  }
  if (n <= 0) return tx("approvers");
  if (n === 1) return tx("approver {{name}}", { name: labels[0] });
  return tx("{{n}} approvers", { n });
}

function readNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return null;
}

function readStringArrayLength(value: unknown): number {
  if (!Array.isArray(value)) return 0;
  return value.filter((entry) => typeof entry === "string" && entry.length > 0).length;
}

function formatAcceptedPlanDecompositionDetail(details: ActivityDetails): string | null {
  if (!details) return null;
  const status = typeof details.status === "string" ? details.status : null;
  const requested = readNumber(details.requestedChildCount);
  const totalChildren = readStringArrayLength(details.childIssueIds);
  const newlyCreated = readStringArrayLength(details.newlyCreatedChildIssueIds);
  const reused = Math.max(0, totalChildren - newlyCreated);
  const parts: string[] = [];
  if (newlyCreated > 0) parts.push(tx("created {{n}} new", { n: newlyCreated }));
  if (reused > 0) parts.push(tx("reused {{n}} existing", { n: reused }));
  if (parts.length === 0 && requested !== null) parts.push(tx("{{n}} requested", { n: requested }));
  const summary = parts.length > 0 ? parts.join(", ") : null;
  if (status === "completed" && summary) return tx("decomposition completed ({{summary}})", { summary });
  if (status === "completed") return tx("decomposition completed");
  if (status === "in_flight" && summary) return tx("decomposition in flight ({{summary}})", { summary });
  return summary;
}

function formatIssueUpdatedVerb(details: ActivityDetails): string | null {
  if (!details) return null;
  const previous = asRecord(details._previous) ?? {};
  if (details.status !== undefined) {
    const from = previous.status;
    return from
      ? tx("changed status from {{from}} to {{to}} on", { from: humanizeValue(from), to: humanizeValue(details.status) })
      : tx("changed status to {{to}} on", { to: humanizeValue(details.status) });
  }
  if (details.priority !== undefined) {
    const from = previous.priority;
    return from
      ? tx("changed priority from {{from}} to {{to}} on", { from: humanizeValue(from), to: humanizeValue(details.priority) })
      : tx("changed priority to {{to}} on", { to: humanizeValue(details.priority) });
  }
  return null;
}

function formatAssigneeName(details: ActivityDetails, options: ActivityFormatOptions): string | null {
  if (!details) return null;
  const agentId = details.assigneeAgentId;
  const userId = details.assigneeUserId;
  if (typeof agentId === "string" && agentId) {
    return options.agentMap?.get(agentId)?.name ?? tx("agent");
  }
  if (typeof userId === "string" && userId) {
    return formatUserLabel(userId, options);
  }
  return null;
}

function formatIssueUpdatedAction(details: ActivityDetails, options: ActivityFormatOptions = {}): string | null {
  if (!details) return null;
  const previous = asRecord(details._previous) ?? {};
  const parts: string[] = [];

  if (details.status !== undefined) {
    const from = previous.status;
    parts.push(
      from
        ? tx("changed the status from {{from}} to {{to}}", { from: humanizeValue(from), to: humanizeValue(details.status) })
        : tx("changed the status to {{to}}", { to: humanizeValue(details.status) }),
    );
  }
  if (details.priority !== undefined) {
    const from = previous.priority;
    parts.push(
      from
        ? tx("changed the priority from {{from}} to {{to}}", { from: humanizeValue(from), to: humanizeValue(details.priority) })
        : tx("changed the priority to {{to}}", { to: humanizeValue(details.priority) }),
    );
  }
  if (details.assigneeAgentId !== undefined || details.assigneeUserId !== undefined) {
    const assigneeName = formatAssigneeName(details, options);
    parts.push(assigneeName ? tx("made {{name}} responsible for the task", { name: assigneeName }) : tx("cleared the responsible"));
  }
  if (details.reviewPolicy !== undefined) {
    // `null` is the default ("anyone can approve"), so it must not read as
    // "changed the review policy to none" (PAP-16506).
    parts.push(tx("changed who can approve to {{policy}}", { policy: formatReviewPolicyValue(details.reviewPolicy) }));
  }
  if (details.title !== undefined) parts.push(tx("updated the title"));
  if (details.description !== undefined) parts.push(tx("updated the description"));

  return parts.length > 0 ? parts.join(", ") : null;
}

function formatStructuredIssueChange(input: {
  action: string;
  details: ActivityDetails;
  options: ActivityFormatOptions;
  forIssueDetail: boolean;
}): string | null {
  const details = input.details;
  if (!details) return null;

  if (input.action === "issue.blockers_updated") {
    const added = readIssueReferences(details, "addedBlockedByIssues").map(formatIssueReferenceLabel);
    const removed = readIssueReferences(details, "removedBlockedByIssues").map(formatIssueReferenceLabel);
    if (added.length > 0 && removed.length === 0) {
      const changed = formatChangedEntityLabel("blocker", added);
      return input.forIssueDetail ? tx("added {{changed}}", { changed }) : tx("added {{changed}} to", { changed });
    }
    if (removed.length > 0 && added.length === 0) {
      const changed = formatChangedEntityLabel("blocker", removed);
      return input.forIssueDetail ? tx("removed {{changed}}", { changed }) : tx("removed {{changed}} from", { changed });
    }
    return input.forIssueDetail ? tx("updated blockers") : tx("updated blockers on");
  }

  if (input.action === "issue.reviewers_updated" || input.action === "issue.approvers_updated") {
    const added = readParticipants(details, "addedParticipants").map((participant) => formatParticipantLabel(participant, input.options));
    const removed = readParticipants(details, "removedParticipants").map((participant) => formatParticipantLabel(participant, input.options));
    const isReviewers = input.action === "issue.reviewers_updated";
    const kind: ChangedEntityKind = isReviewers ? "reviewer" : "approver";
    if (added.length > 0 && removed.length === 0) {
      const changed = formatChangedEntityLabel(kind, added);
      return input.forIssueDetail ? tx("added {{changed}}", { changed }) : tx("added {{changed}} to", { changed });
    }
    if (removed.length > 0 && added.length === 0) {
      const changed = formatChangedEntityLabel(kind, removed);
      return input.forIssueDetail ? tx("removed {{changed}}", { changed }) : tx("removed {{changed}} from", { changed });
    }
    if (isReviewers) return input.forIssueDetail ? tx("updated reviewers") : tx("updated reviewers on");
    return input.forIssueDetail ? tx("updated approvers") : tx("updated approvers on");
  }

  return null;
}

export function formatActivityVerb(
  action: string,
  details?: Record<string, unknown> | null,
  options: ActivityFormatOptions = {},
): string {
  if (action.startsWith("tool_gateway.")) {
    const rawTool = typeof details?.tool === "string"
      ? details.tool
      : typeof details?.upstreamToolName === "string"
        ? details.upstreamToolName
        : tx("an app action");
    const tool = rawTool.replace(/[._-]+/g, " ");
    const isTest = details?.source === "test";
    if (action === "tool_gateway.call_completed") {
      return isTest ? tx("tested {{tool}} on", { tool }) : tx("used {{tool}} on", { tool });
    }
    if (action === "tool_gateway.call_allowed") {
      return isTest ? tx("started a test of {{tool}} on", { tool }) : tx("was allowed to use {{tool}} on", { tool });
    }
    if (action === "tool_gateway.call_denied") return tx("was blocked from using {{tool}} on", { tool });
    if (action === "tool_gateway.approval_requested") return tx("asked to use {{tool}} on", { tool });
    if (action === "tool_gateway.session_created") return tx("opened an app session for");
    if (action === "tool_gateway.session_rejected") return tx("was blocked from opening an app session for");
    if (action === "tool_gateway.discovery") return tx("discovered app actions for");
  }

  if (action === "issue.updated") {
    const issueUpdatedVerb = formatIssueUpdatedVerb(details);
    if (issueUpdatedVerb) return issueUpdatedVerb;
  }

  if (action === "issue.stalled_review_decided") {
    const decision = typeof details?.action === "string" ? details.action : null;
    const label = decision ? STALLED_REVIEW_DECISION_LABELS[decision]?.() : null;
    if (label) return tx("{{label}} on", { label });
  }

  const outcomeLabel = formatInteractionOutcomeLabel(action, details);
  if (outcomeLabel) return tx("{{label}} on", { label: outcomeLabel });

  const structuredChange = formatStructuredIssueChange({
    action,
    details,
    options,
    forIssueDetail: false,
  });
  if (structuredChange) return structuredChange;

  return ACTIVITY_ROW_VERBS[action]?.() ?? xoActivityRowVerb(action) ?? action.replace(/[._]/g, " ");
}

export function formatIssueActivityAction(
  action: string,
  details?: Record<string, unknown> | null,
  options: ActivityFormatOptions = {},
): string {
  if (action === "issue.updated") {
    const issueUpdatedAction = formatIssueUpdatedAction(details, options);
    if (issueUpdatedAction) return issueUpdatedAction;
  }

  const structuredChange = formatStructuredIssueChange({
    action,
    details,
    options,
    forIssueDetail: true,
  });
  if (structuredChange) return structuredChange;

  if (action === "issue.accepted_plan_decomposition_updated") {
    const detail = formatAcceptedPlanDecompositionDetail(details);
    if (detail) return detail;
  }

  if (action === "issue.stalled_review_decided") {
    const decision = typeof details?.action === "string" ? details.action : null;
    const label = decision ? STALLED_REVIEW_DECISION_LABELS[decision]?.() : null;
    if (label) return label;
  }

  const outcomeLabel = formatInteractionOutcomeLabel(action, details);
  if (outcomeLabel) return outcomeLabel;

  if (action.startsWith("issue.monitor_") && details) {
    const serviceName = typeof details.serviceName === "string" && details.serviceName.trim()
      ? details.serviceName.trim()
      : null;
    const base = ISSUE_ACTIVITY_LABELS[action]?.() ?? action.replace(/[._]/g, " ");
    return serviceName ? tx("{{base}} for {{service}}", { base, service: serviceName }) : base;
  }

  if (
    (
      action === "issue.document_created" ||
      action === "issue.document_updated" ||
      action === "issue.document_locked" ||
      action === "issue.document_unlocked" ||
      action === "issue.document_deleted"
    ) &&
    details
  ) {
    const key = typeof details.key === "string" ? details.key : tx("document");
    const title = typeof details.title === "string" && details.title ? ` (${details.title})` : "";
    return `${ISSUE_ACTIVITY_LABELS[action]?.() ?? action} ${key}${title}`;
  }

  return ISSUE_ACTIVITY_LABELS[action]?.() ?? action.replace(/[._]/g, " ");
}
