import {
  AlertTriangle,
  BookOpen,
  Bot,
  Box,
  Clock3,
  Database,
  FileCheck2,
  FilePenLine,
  FileText,
  GitBranch,
  ListChecks,
  PackageCheck,
  Search,
  ShieldCheck,
  TerminalSquare,
  Users,
} from "lucide-react";
import { tx } from "@/i18n/xo";
import type {
  TaskChatMaterializedResourceItem,
  TaskChatProtocolItem,
  TaskChatProviderActivityItem,
  TaskChatWorkspaceChangeItem,
  TaskChatWorkspaceFileItem,
} from "./task-chat-model";
import {
  humanizeToolName,
  isGenericToolName,
  mcpToolIdentity,
  toolActivityEnglishRunningLabel,
  toolActivityPresentation,
  type ToolIcon,
} from "./tool-taxonomy";

export interface TaskChatActivityPresentation {
  icon: ToolIcon;
  runningLabel: string;
  completedLabel: string;
  failedLabel?: string;
  interruptedLabel?: string;
  detail?: string;
}

function providerDetail(item: TaskChatProviderActivityItem, ...labels: string[]): string | undefined {
  return item.details.find((entry) => labels.includes(entry.label))?.value;
}

function meaningfulToolDetail(value: string | undefined): string | undefined {
  if (!value || isGenericToolName(value) || /^tool(?:\s+|_)call\b/i.test(value)) return undefined;
  return value;
}

export function providerActivityPresentation(item: TaskChatProviderActivityItem): TaskChatActivityPresentation {
  const detail = item.summary
    ?? providerDetail(item, "Query", "URL", "Target", "Name", "Reference", "Reason", "Summary");
  switch (item.family) {
    case "research": {
      const action = providerDetail(item, "Action")?.toLowerCase();
      if (action === "open_page") {
        return { icon: Search, runningLabel: tx("Opening a web page"), completedLabel: tx("Opened a web page"), failedLabel: tx("Couldn’t open the web page"), interruptedLabel: tx("Stopped opening the web page"), detail };
      }
      if (action === "find_in_page") {
        return { icon: Search, runningLabel: tx("Searching the page"), completedLabel: tx("Searched the page"), failedLabel: tx("Page search failed"), interruptedLabel: tx("Page search stopped"), detail };
      }
      return { icon: Search, runningLabel: tx("Searching the web"), completedLabel: tx("Searched the web"), failedLabel: tx("Web search failed"), interruptedLabel: tx("Web search stopped"), detail };
    }
    case "tool_execution": {
      const name = providerDetail(item, "Name");
      const target = providerDetail(item, "Target");
      const progress = providerDetail(item, "Progress");
      const toolInput = {
        name,
        transport: providerDetail(item, "Transport"),
        namespace: providerDetail(item, "Namespace"),
        operation: providerDetail(item, "Operation"),
        target,
        progress,
      };
      const tool = toolActivityPresentation(toolInput);
      const boundedActivity = meaningfulToolDetail(item.summary)
        ?? meaningfulToolDetail(progress)
        ?? meaningfulToolDetail(target);
      const activityIsIdentity = Boolean(
        boundedActivity && name && humanizeToolName(boundedActivity) === humanizeToolName(name),
      );
      const technicalName = name ? mcpToolIdentity(name)?.name ?? name : tool.displayName;
      const source = tool.sourceLabel
        ? `${tool.sourceLabel} · ${technicalName}`
        : name && !isGenericToolName(name) && humanizeToolName(name) !== toolActivityEnglishRunningLabel(toolInput).replace(/^Running /, "")
          ? name
          : undefined;
      return {
        icon: tool.icon,
        runningLabel: tool.runningLabel,
        completedLabel: tool.completedLabel,
        failedLabel: tool.failedLabel,
        interruptedLabel: tool.interruptedLabel,
        detail: [activityIsIdentity ? undefined : boundedActivity, source].filter(Boolean).join(" · ") || undefined,
      };
    }
    case "plan":
      return { icon: ListChecks, runningLabel: tx("Updating the plan"), completedLabel: tx("Updated the plan"), failedLabel: tx("Plan update failed"), interruptedLabel: tx("Plan update stopped"), detail };
    case "delegation": {
      const action = providerDetail(item, "Action")?.toLowerCase();
      if (action === "message") return { icon: Users, runningLabel: tx("Messaging a subagent"), completedLabel: tx("Messaged a subagent"), failedLabel: tx("Subagent message failed"), interruptedLabel: tx("Subagent message stopped"), detail };
      if (action === "resume") return { icon: Users, runningLabel: tx("Resuming a subagent"), completedLabel: tx("Resumed a subagent"), failedLabel: tx("Couldn’t resume the subagent"), interruptedLabel: tx("Subagent resume stopped"), detail };
      if (action === "close") return { icon: Users, runningLabel: tx("Closing a subagent"), completedLabel: tx("Closed a subagent"), failedLabel: tx("Couldn’t close the subagent"), interruptedLabel: tx("Subagent close stopped"), detail };
      if (action === "wait") return { icon: Users, runningLabel: tx("Waiting for subagents"), completedLabel: tx("Finished waiting for subagents"), failedLabel: tx("Subagent wait failed"), interruptedLabel: tx("Stopped waiting for subagents"), detail };
      return { icon: Users, runningLabel: tx("Starting a subagent"), completedLabel: tx("Started a subagent"), failedLabel: tx("Subagent start failed"), interruptedLabel: tx("Subagent start stopped"), detail };
    }
    case "model_identity":
      return item.eventType === "model.route.changed"
        ? { icon: Bot, runningLabel: tx("Switching models"), completedLabel: tx("Switched models"), failedLabel: tx("Model switch failed"), interruptedLabel: tx("Model switch stopped"), detail }
        : { icon: Bot, runningLabel: tx("Verifying the model"), completedLabel: tx("Verified the model"), failedLabel: tx("Model verification failed"), interruptedLabel: tx("Model verification stopped"), detail };
    case "context":
      return { icon: Database, runningLabel: tx("Compacting context"), completedLabel: tx("Compacted context"), failedLabel: tx("Context compaction failed"), interruptedLabel: tx("Context compaction stopped"), detail };
    case "artifact": {
      const viewed = item.eventType === "artifact.viewed";
      return viewed
        ? { icon: Box, runningLabel: tx("Viewing an artifact"), completedLabel: tx("Viewed an artifact"), failedLabel: tx("Couldn’t view the artifact"), interruptedLabel: tx("Artifact view stopped"), detail }
        : { icon: Box, runningLabel: tx("Generating an artifact"), completedLabel: tx("Generated an artifact"), failedLabel: tx("Artifact generation failed"), interruptedLabel: tx("Artifact generation stopped"), detail };
    }
    case "review": {
      const state = providerDetail(item, "State")?.toLowerCase();
      return state === "exited"
        ? { icon: FileCheck2, runningLabel: tx("Leaving review mode"), completedLabel: tx("Left review mode"), failedLabel: tx("Couldn’t leave review mode"), interruptedLabel: tx("Review-mode change stopped"), detail }
        : { icon: FileCheck2, runningLabel: tx("Entering review mode"), completedLabel: tx("Entered review mode"), failedLabel: tx("Couldn’t enter review mode"), interruptedLabel: tx("Review-mode change stopped"), detail };
    }
    case "hook":
      return { icon: GitBranch, runningLabel: tx("Running a hook"), completedLabel: tx("Ran a hook"), failedLabel: tx("Hook failed"), interruptedLabel: tx("Hook stopped"), detail };
    case "memory":
      return { icon: BookOpen, runningLabel: tx("Checking memory"), completedLabel: tx("Referenced memory"), failedLabel: tx("Memory lookup failed"), interruptedLabel: tx("Memory lookup stopped"), detail };
    case "safety":
      return { icon: ShieldCheck, runningLabel: tx("Reviewing safety"), completedLabel: tx("Reviewed safety"), failedLabel: tx("Safety review failed"), interruptedLabel: tx("Safety review stopped"), detail };
    case "terminal":
      return { icon: TerminalSquare, runningLabel: tx("Sending terminal input"), completedLabel: tx("Sent terminal input"), failedLabel: tx("Terminal input failed"), interruptedLabel: tx("Terminal input stopped"), detail };
    case "wait":
      return { icon: Clock3, runningLabel: tx("Waiting"), completedLabel: tx("Finished waiting"), failedLabel: tx("Wait failed"), interruptedLabel: tx("Wait stopped"), detail };
    case "provider_notice":
      return { icon: AlertTriangle, runningLabel: tx("Provider notice"), completedLabel: tx("Provider notice"), failedLabel: tx("Provider error"), interruptedLabel: tx("Provider notice"), detail };
  }
}

function workspaceChangePresentation(item: TaskChatWorkspaceChangeItem): TaskChatActivityPresentation {
  const count = item.totals.files || item.files.length;
  const detail = count > 0 ? (count === 1 ? tx("{{n}} file", { n: count }) : tx("{{n}} files", { n: count })) : undefined;
  return { icon: FilePenLine, runningLabel: tx("Editing files"), completedLabel: tx("Edited files"), detail };
}

function workspaceFilePresentation(item: TaskChatWorkspaceFileItem): TaskChatActivityPresentation {
  return {
    icon: FileText,
    runningLabel: tx("Referencing a file"),
    completedLabel: tx("Referenced a file"),
    detail: item.line == null ? item.path : `${item.path}:${item.line}`,
  };
}

function resourcePresentation(item: TaskChatMaterializedResourceItem): TaskChatActivityPresentation {
  return {
    icon: item.resourceKind === "document" ? FileText : PackageCheck,
    runningLabel: tx("Saving a resource"),
    completedLabel: item.resourceKind === "document" ? tx("Added a document") : tx("Added a deliverable"),
    detail: item.title,
  };
}

export function protocolActivityPresentation(item: TaskChatProtocolItem): TaskChatActivityPresentation | null {
  switch (item.surface) {
    case "provider_activity": return providerActivityPresentation(item);
    case "workspace_change": return workspaceChangePresentation(item);
    case "workspace_file": return workspaceFilePresentation(item);
    case "resource": return resourcePresentation(item);
    case "runtime_request":
    case "run_result":
    case "run_terminal":
      return null;
  }
}

export function protocolActivityIsRunning(item: TaskChatProtocolItem): boolean {
  if (item.surface === "provider_activity") return item.status === "running";
  if (item.surface === "workspace_change") return !item.complete;
  return false;
}

export function protocolActivityLabel(item: TaskChatProtocolItem, presentation: TaskChatActivityPresentation): string {
  if (item.surface !== "provider_activity") {
    return protocolActivityIsRunning(item) ? presentation.runningLabel : presentation.completedLabel;
  }
  if (item.status === "failed") return presentation.failedLabel ?? tx("{{label}} · failed", { label: presentation.completedLabel });
  if (item.status === "interrupted") return presentation.interruptedLabel ?? tx("{{label}} · interrupted", { label: presentation.completedLabel });
  return item.status === "running" ? presentation.runningLabel : presentation.completedLabel;
}
