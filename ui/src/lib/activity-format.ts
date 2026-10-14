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
  // XO 7.13: дотоод action-ууд
  "agent_api_key.claimed": () => tx("claimed an agent API key"),
  "agent.updated_from_join_replay": () => tx("updated from a replayed join request"),
  "ai_connection.connected": () => tx("connected an AI provider"),
  "ai_connection.default_changed": () => tx("changed the default AI provider"),
  "ai_connection.local_login_cancelled": () => tx("cancelled a local AI login"),
  "ai_connection.local_login_started": () => tx("started a local AI login"),
  "ai_connection.reconnected": () => tx("reconnected an AI provider"),
  "announcement.dismissed": () => tx("dismissed an announcement"),
  "approval.requester_wakeup_failed": () => tx("failed to wake the approval requester"),
  "approval.requester_wakeup_queued": () => tx("queued a wakeup for the approval requester"),
  "approval.review_path_wakeup_failed": () => tx("failed to wake the review path for an approval"),
  "approval.review_path_wakeup_queued": () => tx("queued a review-path wakeup for an approval"),
  "asset.created": () => tx("saved a file"),
  "auth.agent_jwt_run_header_mismatch": () => tx("sent a mismatched run header for"),
  "auth.agent_key_missing_responsible_user": () => tx("used an agent key without a responsible user"),
  "authorization.grants_updated_by_plugin": () => tx("updated permission grants via a plugin"),
  "authorization.policy_updated_by_plugin": () => tx("updated an authorization policy via a plugin"),
  "board_api_key.created": () => tx("created a Board API key"),
  "board_api_key.revoked": () => tx("revoked a Board API key"),
  "built_in_agent.duplicate_resolved": () => tx("resolved a duplicate built-in agent"),
  "built_in_agent.provision_requested": () => tx("requested provisioning for"),
  "built_in_agent.provisioned": () => tx("provisioned built-in agent"),
  "built_in_agent.reconcile": () => tx("reconciled built-in agent"),
  "built_in_agent.reset": () => tx("reset built-in agent"),
  "built_in_agent.routine_reconciled": () => tx("reconciled a built-in agent routine"),
  "built_in_agent.routine_reset": () => tx("reset a built-in agent routine"),
  "built_in_agent.routine_run_triggered": () => tx("ran the routine of"),
  "built_in_agent.routine_schedule_disabled": () => tx("disabled the routine schedule for"),
  "built_in_agent.routine_schedule_enabled": () => tx("enabled the routine schedule for"),
  "case.document_annotation_comment_added": () => tx("commented on a case document"),
  "case.document_annotation_remapped": () => tx("remapped case document comments"),
  "case.document_annotation_thread_created": () => tx("started a comment thread on a case document"),
  "case.document_annotation_thread_reopened": () => tx("reopened a comment thread on a case document"),
  "case.document_annotation_thread_resolved": () => tx("resolved a comment thread on a case document"),
  "chat_endpoint.commands_registered": () => tx("registered chat connector commands"),
  "chat_endpoint.commands_unavailable": () => tx("could not register chat connector commands"),
  "chat_endpoint.credentials_verified": () => tx("verified chat connector credentials"),
  "chat_endpoint.resources_updated": () => tx("updated chat connector resources"),
  "chat_endpoint.setup_secret_generated": () => tx("generated a chat connector setup secret"),
  "chat_endpoint.setup_secret_rotation_failed": () => tx("failed to rotate a chat connector setup secret"),
  "chat_endpoint.setup_secret_rotation_started": () => tx("started rotating a chat connector setup secret"),
  "chat_endpoint.telegram_register_commands_completed": () => tx("registered Telegram commands"),
  "chat_endpoint.telegram_register_commands_deferred": () => tx("deferred Telegram command registration"),
  "chat_endpoint.telegram_remove_endpoint_completed": () => tx("removed a Telegram connector"),
  "chat_endpoint.telegram_remove_endpoint_deferred": () => tx("deferred Telegram connector removal"),
  "chat_endpoint.telegram_stop_subscription_completed": () => tx("stopped a Telegram subscription"),
  "chat_endpoint.telegram_stop_subscription_deferred": () => tx("deferred stopping a Telegram subscription"),
  "chat_endpoint.webhook_sync_started": () => tx("started a chat connector webhook sync"),
  "chat_endpoint.webhook_synced": () => tx("synced a chat connector webhook"),
  "chat_endpoint.webhook_verified": () => tx("verified a chat connector webhook"),
  "chat.discord_command_recorded": () => tx("recorded a Discord command"),
  "chat.failed_run_retry_requested": () => tx("requested a retry of the failed run for"),
  "chat.provider_effect_cancel": () => tx("cancelled a chat delivery"),
  "chat.provider_effect_mark_delivered": () => tx("marked a chat delivery delivered"),
  "chat.provider_effect_retry_anyway": () => tx("retried a chat delivery anyway"),
  "chat.publication_cancel": () => tx("cancelled a chat publication"),
  "chat.publication_mark_delivered": () => tx("marked a chat publication delivered"),
  "chat.publication_requested": () => tx("requested a chat publication"),
  "chat.publication_retry_anyway": () => tx("retried a chat publication anyway"),
  "chat.slack_command_cancel": () => tx("cancelled via a Slack command"),
  "chat.slack_command_retry_anyway": () => tx("retried anyway via a Slack command"),
  "chat.slack_session_stop_filtered": () => tx("filtered a Slack session stop"),
  "chat.slack_session_stopped": () => tx("stopped a Slack session"),
  "company_member.updated_by_plugin": () => tx("updated a member via a plugin"),
  "company.branding_updated": () => tx("updated organization branding"),
  "company.feedback_data_sharing_updated": () => tx("updated feedback data sharing"),
  "company.imported": () => tx("imported an organization"),
  "company.onboarding_seed_applied": () => tx("applied onboarding starter data"),
  "company.skill_catalog_updated": () => tx("updated a skill from the catalog"),
  "company.skill_test_harness_issue_cleaned_up": () => tx("cleaned up the skill test task"),
  "company.team_catalog_installed": () => tx("installed a team from the catalog"),
  "company.team_catalog_previewed": () => tx("previewed a team from the catalog"),
  "composio.child_created": () => tx("created a Composio connection"),
  "composio.service_connect_started": () => tx("started connecting a Composio service"),
  "composio.service_disconnected": () => tx("disconnected a Composio service"),
  "connection_grant.audience_replaced": () => tx("changed who can use connection credentials"),
  "connection_grant.created": () => tx("added connection credentials"),
  "connection_grant.delegated": () => tx("delegated connection credentials"),
  "connection_grant.delegation_revoked": () => tx("revoked a connection credential delegation"),
  "connection_grant.revoked": () => tx("revoked connection credentials"),
  "connection_grant.updated": () => tx("updated connection credentials"),
  "connection_installs.changed": () => tx("changed connection installs"),
  "connection_token.denied": () => tx("denied a connection token"),
  "connection_token.minted": () => tx("issued a connection token"),
  "decision_queue_item.seeded": () => tx("seeded a decision queue item"),
  "decision_queue.seeded": () => tx("seeded a decision queue"),
  "decision_retention.revived": () => tx("revived an archived decision"),
  "decision_training.read": () => tx("viewed decision training data"),
  "decision.decided": () => tx("decided a decision"),
  "decision.effect_executed": () => tx("executed a decision effect"),
  "decision.effect_failed": () => tx("failed to execute a decision effect"),
  "decision.effect_skipped": () => tx("skipped a decision effect"),
  "email.connection.agent_added": () => tx("added an agent to an email connection"),
  "email.connection.created": () => tx("created an email connection"),
  "environment_lease.cleanup_retried": () => tx("retried environment lease cleanup"),
  "environment.custom_image_terminal_session_token.created": () => tx("created a custom image terminal token"),
  "environment.managed_provider_unavailable_archived": () => tx("archived an environment with an unavailable provider"),
  "environment.managed_stock_added": () => tx("added a managed stock environment"),
  "environment.managed_stock_skipped": () => tx("skipped a managed stock environment"),
  "environment.managed_stock_tracking_initialized": () => tx("started tracking a managed stock environment"),
  "environment.managed_stock_updated": () => tx("updated a managed stock environment"),
  "environment.probed": () => tx("checked an environment"),
  "environment.probed_unsaved": () => tx("checked an unsaved environment"),
  "execution_workspace.branch_reconciled": () => tx("reconciled an execution workspace branch"),
  "execution_workspace.dirty_worktree_quarantined": () => tx("quarantined an execution workspace with uncommitted changes"),
  "execution_workspace.issue_terminal_archived": () => tx("archived an execution workspace after its task closed"),
  "execution_workspace.issue_terminal_cleanup_failed": () => tx("failed to clean up an execution workspace after its task closed"),
  "execution_workspace.reopen_failed": () => tx("failed to reopen an execution workspace"),
  "execution_workspace.reopen_unconsumed": () => tx("left an execution workspace reopen unused"),
  "execution_workspace.runtime_repair": () => tx("repaired execution workspace services"),
  "execution_workspace.runtime_restart": () => tx("restarted execution workspace services"),
  "execution_workspace.runtime_run": () => tx("ran an execution workspace command"),
  "execution_workspace.runtime_start": () => tx("started execution workspace services"),
  "execution_workspace.runtime_stop": () => tx("stopped execution workspace services"),
  "execution_workspace.source_issue_reopened": () => tx("reopened the source task of an execution workspace"),
  "execution_workspace.workspace_validation_quarantined": () => tx("quarantined an execution workspace that failed validation"),
  "external_object.refresh_requested": () => tx("requested an external object refresh on"),
  "external_object.status_changed": () => tx("changed an external object status"),
  "finance_event.reported": () => tx("reported a finance event"),
  "folder.personal_ensured": () => tx("set up a personal folder"),
  "heartbeat.cancel_failed": () => tx("failed to cancel heartbeat for"),
  "heartbeat.runtime_request_resolution_queued": () => tx("queued a runtime request resolution for"),
  "heartbeat.watchdog_decision_recorded": () => tx("recorded a watchdog decision for"),
  "heartbeat.watchdog_snoozed": () => tx("snoozed the watchdog for"),
  "hire_hook.error": () => tx("hire hook errored for"),
  "hire_hook.failed": () => tx("hire hook failed for"),
  "hire_hook.succeeded": () => tx("ran the hire hook for"),
  "inbox.agent_policy_updated": () => tx("updated the inbox agent policy"),
  "inbox.dismissed": () => tx("dismissed an inbox item"),
  "inbox.restored": () => tx("restored an inbox item"),
  "inbox.snoozed": () => tx("snoozed an inbox item"),
  "instance.task_drain.started": () => tx("started draining instance tasks"),
  "instance.task_drain.stopped": () => tx("stopped draining instance tasks"),
  "invite.created_by_plugin": () => tx("created an invite via a plugin"),
  "invite.openclaw_prompt_created": () => tx("created an OpenClaw invite prompt"),
  "invite.revoked_by_plugin": () => tx("revoked an invite via a plugin"),
  "issue.approvers_updated": () => tx("updated approvers on"),
  "issue.assignment_wakeup_requested": () => tx("requested an assignment wakeup for"),
  "issue.attachment.read": () => tx("read an attachment on"),
  "issue.attribution_spoof_rejected": () => tx("rejected a spoofed attribution on"),
  "issue.blockers_resolved_wake_emitted": () => tx("woke the assignee after blockers cleared on"),
  "issue.blockers_updated": () => tx("updated blockers on"),
  "issue.checkout_lock_adopted": () => tx("took over the checkout lock on"),
  "issue.conversation_session_started": () => tx("started a conversation session on"),
  "issue.disposition_repair_escalated": () => tx("escalated a status repair for"),
  "issue.disposition_repair_fingerprint_reset": () => tx("reset the status repair fingerprint for"),
  "issue.disposition_repair_resolved": () => tx("resolved a status repair for"),
  "issue.disposition_repair_scheduled": () => tx("scheduled a status repair for"),
  "issue.document_annotation_remapped": () => tx("remapped document comments on"),
  "issue.execution_recovery_settled": () => tx("settled execution recovery for"),
  "issue.feedback_vote_saved": () => tx("saved a feedback vote on"),
  "issue.file_resource_availability": () => tx("checked file availability on"),
  "issue.file_resource_availability_denied": () => tx("was denied file availability on"),
  "issue.file_resource_content_denied": () => tx("was denied file contents on"),
  "issue.file_resource_content_read": () => tx("read file contents on"),
  "issue.file_resource_download": () => tx("downloaded a file on"),
  "issue.file_resource_download_denied": () => tx("was denied a file download on"),
  "issue.file_resource_list": () => tx("listed files on"),
  "issue.file_resource_list_denied": () => tx("was denied listing files on"),
  "issue.file_resource_resolve": () => tx("resolved a file on"),
  "issue.file_resource_resolve_denied": () => tx("was denied resolving a file on"),
  "issue.inbox_touched": () => tx("touched in inbox"),
  "issue.low_trust_output_promoted": () => tx("promoted low-trust output on"),
  "issue.queued_comment_steered": () => tx("steered with a queued comment on"),
  "issue.queued_comments_interrupted": () => tx("interrupted queued comments on"),
  "issue.review_path_recovery_queued": () => tx("queued review-path recovery for"),
  "issue.reviewers_updated": () => tx("updated reviewers on"),
  "issue.stale_lock_cleared": () => tx("cleared a stale lock on"),
  "issue.task_watchdog_fingerprint_reviewed": () => tx("reviewed the task watchdog fingerprint on"),
  "issue.task_watchdog_followups_serialized": () => tx("serialized task watchdog follow-ups on"),
  "issue.task_watchdog_triggered": () => tx("triggered the task watchdog on"),
  "issue.tree_cancel_status_updated": () => tx("updated task tree cancellation on"),
  "issue.tree_control_previewed": () => tx("previewed task tree control on"),
  "issue.tree_hold_run_interrupt_failed": () => tx("failed to interrupt a run for the task tree hold on"),
  "issue.tree_hold_run_interrupted": () => tx("interrupted a run for the task tree hold on"),
  "issue.tree_hold_wakeup_deferred": () => tx("deferred a wakeup for the task tree hold"),
  "issue.tree_restore_status_updated": () => tx("updated task tree restore on"),
  "issue.tree_restore_wakeup_requested": () => tx("requested a task tree restore wakeup for"),
  "issue.tree_resume_wake_failed": () => tx("failed to wake the resumed task tree under"),
  "issue.watchdog_updated": () => tx("updated the watchdog on"),
  "issue.workspace_preflight_blocked": () => tx("was blocked by workspace preflight on"),
  "join.request_replayed": () => tx("replayed a join request"),
  "join.requested": () => tx("requested to join"),
  "managed_agent_profile.upserted": () => tx("saved a managed agent profile"),
  "native.cancellation_dispatch_acknowledged": () => tx("acknowledged cancellation for"),
  "native.cancellation_intent_recorded": () => tx("recorded a cancellation request for"),
  "paperclip_cloud_connector.enrollment_completed": () => tx("completed {{brand}} Cloud connector enrollment"),
  "paperclip_cloud_connector.enrollment_started": () => tx("started {{brand}} Cloud connector enrollment"),
  "pipeline.case_document_created": () => tx("created a case document"),
  "pipeline.case_document_updated": () => tx("updated a case document"),
  "plugin.config.updated": () => tx("updated plugin settings"),
  "plugin.disabled": () => tx("disabled a plugin"),
  "plugin.enabled": () => tx("enabled a plugin"),
  "plugin.installed": () => tx("installed a plugin"),
  "plugin.local_folder.configured": () => tx("configured a plugin local folder"),
  "plugin.managed_agent.created": () => tx("created plugin-managed agent"),
  "plugin.managed_agent.pause_reason_backfilled": () => tx("backfilled the pause reason for"),
  "plugin.managed_agent.reset": () => tx("reset plugin-managed agent"),
  "plugin.managed_routine.created": () => tx("created a plugin-managed routine"),
  "plugin.managed_routine.reset": () => tx("reset a plugin-managed routine"),
  "plugin.managed_routine.run_triggered": () => tx("ran a plugin-managed routine"),
  "plugin.managed_routine.updated": () => tx("updated a plugin-managed routine"),
  "plugin.managed_skill.reconciled": () => tx("reconciled a plugin-managed skill"),
  "plugin.managed_skill.reset": () => tx("reset a plugin-managed skill"),
  "plugin.uninstalled": () => tx("uninstalled a plugin"),
  "plugin.upgraded": () => tx("upgraded a plugin"),
  "project.workspace_runtime_restart": () => tx("restarted workspace services for"),
  "project.workspace_runtime_run": () => tx("ran a workspace command for"),
  "project.workspace_runtime_start": () => tx("started workspace services for"),
  "project.workspace_runtime_stop": () => tx("stopped workspace services for"),
  "provider_trace.capture_requested": () => tx("requested a provider trace for"),
  "provider_trace.deleted": () => tx("deleted a provider trace for"),
  "provider_trace.downloaded": () => tx("downloaded a provider trace for"),
  "provider_trace.expired": () => tx("expired a provider trace for"),
  "provider_trace.frame_revealed": () => tx("revealed a provider trace frame for"),
  "provider_trace.metadata_listed": () => tx("listed provider trace metadata"),
  "provider_trace.redacted_viewed": () => tx("viewed a redacted provider trace for"),
  "provider_trace.workspace_diffs_reprojected": () => tx("rebuilt provider trace workspace diffs for"),
  "queue_item.added": () => tx("added a queue item"),
  "queue_item.removed": () => tx("removed a queue item"),
  "queue_item.seeded": () => tx("seeded a queue item"),
  "queue.created": () => tx("created a queue"),
  "queue.seeded": () => tx("seeded a queue"),
  "queue.updated": () => tx("updated a queue"),
  "remote_agent_profile.upserted": () => tx("saved a remote agent profile"),
  "resource_membership.joined": () => tx("joined"),
  "resource_membership.left": () => tx("left"),
  "resource_membership.starred": () => tx("starred"),
  "resource_membership.unstarred": () => tx("unstarred"),
  "routine.document_annotation_remapped": () => tx("remapped routine document comments"),
  "routine.origin_cleared": () => tx("cleared a routine origin"),
  "routine.origin_stamped": () => tx("recorded a routine origin"),
  "runner.api_called": () => tx("called the {{brand}} API from the runner on"),
  "secret_provider_config.created": () => tx("added a secret provider"),
  "secret_provider_config.default_set": () => tx("set the default secret provider"),
  "secret_provider_config.discovery_previewed": () => tx("previewed secret provider discovery"),
  "secret_provider_config.health_checked": () => tx("checked a secret provider"),
  "secret_provider_config.removed": () => tx("removed a secret provider"),
  "secret_provider_config.updated": () => tx("updated a secret provider"),
  "secret.access.listed": () => tx("listed secret access for"),
  "secret.proposal.expired": () => tx("let a secret proposal expire"),
  "secret.proposal.withdrawn": () => tx("withdrew a secret proposal"),
  "secret.remote_import.previewed": () => tx("previewed a secret import"),
  "secret.value.read": () => tx("read a secret value"),
  "sidebar_preferences.project_order_updated": () => tx("reordered sidebar projects"),
  "status_card.compile_requested": () => tx("requested a status card compile"),
  "status_card.created": () => tx("created a status card"),
  "status_card.deleted": () => tx("deleted a status card"),
  "status_card.query_written": () => tx("wrote a status card query"),
  "status_card.recompile_requested": () => tx("requested a status card recompile"),
  "status_card.refresh_requested": () => tx("requested a status card refresh"),
  "status_card.summary_written": () => tx("wrote a status card summary"),
  "status_card.updated": () => tx("updated a status card"),
  "summary_slot.generate_requested": () => tx("requested a summary"),
  "summary_slot.write": () => tx("wrote a summary"),
  "tool_access.trust_rule_created": () => tx("created a tool trust rule"),
  "tool_access.trust_rule_revoked": () => tx("revoked a tool trust rule"),
  "tool_access.trust_rule_used": () => tx("used a tool trust rule"),
  "tool_action_request.created": () => tx("requested a tool action"),
  "tool_action_request.resolved": () => tx("resolved a tool action request"),
  "tool_application.archived": () => tx("archived a tool app"),
  "tool_application.created": () => tx("created a tool app"),
  "tool_application.deleted": () => tx("deleted a tool app"),
  "tool_application.updated": () => tx("updated a tool app"),
  "tool_connection.catalog_refreshed": () => tx("refreshed a tool connection catalog"),
  "tool_connection.credential_resolution": () => tx("resolved tool connection credentials"),
  "tool_connection.health_check": () => tx("checked a tool connection"),
  "tool_connection.import_mcp_json_previewed": () => tx("previewed an MCP JSON import"),
  "tool_connection.tested": () => tx("tested a tool connection"),
  "tool_connection.webhook_processed": () => tx("processed a tool connection webhook"),
  "tool_example.installed": () => tx("installed a tool example"),
  "tool_example.smoke_run": () => tx("ran a tool example smoke test"),
  "tool_gateway.approval_resolved": () => tx("resolved a tool call approval"),
  "tool_gateway.call_deferred": () => tx("deferred a tool call"),
  "tool_gateway.call_failed": () => tx("had a tool call fail"),
  "tool_gateway.call_started": () => tx("started a tool call"),
  "tool_gateway.elicitation_requested": () => tx("asked for tool input"),
  "tool_gateway.invocation_created": () => tx("created a tool gateway call"),
  "tool_gateway.policy_decision": () => tx("recorded a tool gateway policy decision"),
  "tool_gateway.rate_limited": () => tx("hit a tool rate limit"),
  "tool_gateway.runtime_mcp_delivery": () => tx("delivered runtime MCP tools"),
  "tool_gateway.runtime_started": () => tx("started a tool runtime"),
  "tool_gateway.runtime_stopped": () => tx("stopped a tool runtime"),
  "tool_gateway.session_revoked": () => tx("revoked a tool gateway session"),
  "tool_gateway.trust_rule_created": () => tx("created a tool trust rule"),
  "tool_gateway.trust_rule_revoked": () => tx("revoked a tool trust rule"),
  "tool_gateway.trust_rule_used": () => tx("used a tool trust rule"),
  "tool_policy.disabled": () => tx("disabled a tool policy"),
  "tool_profile_binding.created": () => tx("linked a tool profile"),
  "tool_profile_binding.deleted": () => tx("unlinked a tool profile"),
  "tool_profile_entry.created": () => tx("added a tool profile entry"),
  "tool_profile_entry.deleted": () => tx("removed a tool profile entry"),
  "tool_profile_entry.updated": () => tx("updated a tool profile entry"),
  "tool_profile.bound": () => tx("linked a tool profile"),
  "tool_profile.new_tools_reviewed": () => tx("reviewed new tools in a tool profile"),
  "tool_profile.unbound": () => tx("unlinked a tool profile"),
  "tool_runtime_slot.operator_restarted": () => tx("restarted a tool runtime slot"),
  "tool_runtime_slot.operator_stopped": () => tx("manually stopped a tool runtime slot"),
  "tool_runtime_slot.started": () => tx("started a tool runtime slot"),
  "tool_runtime_slot.stopped": () => tx("stopped a tool runtime slot"),
  "tool_stdio_command_template.created": () => tx("created a local command template"),
  "tool_stdio_command_template.disabled": () => tx("disabled a local command template"),
  "tool_trust_rule.created": () => tx("created a tool trust rule"),
  "tool_trust_rule.revoked": () => tx("revoked a tool trust rule"),
  "triage.updated": () => tx("updated triage"),
  "user_secret_definition.created": () => tx("created a personal secret definition"),
  "user_secret_definition.deleted": () => tx("deleted a personal secret definition"),
  "user_secret_value.created": () => tx("saved a personal secret"),
  "user_secret_value.deleted": () => tx("deleted a personal secret"),
  "user_secret_value.rotated": () => tx("rotated a personal secret"),
  "user_secret_value.updated": () => tx("updated a personal secret"),
  "workspace_runtime.exposure_reservation_drift": () => tx("detected a workspace exposure drift"),
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
