import { useEffect, useMemo, useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronRight, ScrollText } from "lucide-react";
import { Link } from "@/lib/router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/StatusBadge";
import { cn } from "@/lib/utils";
import { queryKeys } from "@/lib/queryKeys";
import {
  toolsApi,
  type ToolAuditOutcome,
  type ToolAuditWindow,
  type ToolGatewayActivityEvent,
} from "@/api/tools";
import { agentsApi } from "@/api/agents";
import { AgentSelect } from "@/components/AgentMultiSelect";
import { ToolsPageHeader, LoadingState, ErrorState, RelativeTime } from "./shared";
import { tx } from "@/i18n/xo";
import { xoBrandVars } from "@/xo/labels";
import { XoTrans } from "@/xo/XoTrans";

const PAGE_SIZE = 50;
const ALL = "__all";

/** Outcome chip vocabulary (spec §4C / §5): Allowed · Blocked · Asked first · Failed · Waiting. */
const OUTCOME_STATUS: Record<ToolAuditOutcome, string> = {
  allowed: "allowed",
  blocked: "denied",
  asked_first: "require-approval",
  waiting: "deferred",
  failed: "failed",
  unknown: "unchecked",
};

function outcomeLabel(outcome: string): string {
  switch (outcome) {
    case ALL: return tx("All outcomes");
    case "allowed": return tx("Allowed");
    case "blocked": return tx("Blocked");
    case "asked_first": return tx("Asked first");
    case "waiting": return tx("Waiting");
    case "failed": return tx("Failed");
    default: return tx("Recorded");
  }
}

const OUTCOME_FILTERS: string[] = [ALL, "allowed", "blocked", "asked_first", "waiting", "failed"];

const WINDOW_FILTERS: ToolAuditWindow[] = ["all", "1h", "24h", "7d", "30d"];

function windowLabel(value: ToolAuditWindow): string {
  switch (value) {
    case "1h": return tx("Last 1 hour");
    case "24h": return tx("Last 24 hours");
    case "7d": return tx("Last 7 days");
    case "30d": return tx("Last 30 days");
    default: return tx("All time");
  }
}

function detailString(details: Record<string, unknown> | null, key: string): string | undefined {
  const v = details?.[key];
  return typeof v === "string" && v.trim().length > 0 ? v : undefined;
}

function detailStringArray(details: Record<string, unknown> | null, key: string): string[] {
  const v = details?.[key];
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

function detailRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function detailNumber(details: Record<string, unknown> | null, key: string): number | undefined {
  const value = details?.[key];
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function formattedArguments(details: Record<string, unknown> | null): string | undefined {
  const summary = detailRecord(details?.argumentsSummary);
  const serialized = typeof summary?.summary === "string" ? summary.summary : undefined;
  if (!serialized) return undefined;
  try {
    return JSON.stringify(JSON.parse(serialized), null, 2);
  } catch {
    return serialized;
  }
}

function lifecycleSummary(event: ToolGatewayActivityEvent): string | null {
  if (!event.lifecycleType) return null;
  const who = event.actorDisplayName ?? event.agentDisplayName ?? tx("Someone");
  const app = event.appDisplayName ?? event.connectionDisplayName ?? tx("this app");
  const count = detailNumber(event.details, "count") ?? 0;
  const added = detailNumber(event.details, "added") ?? 0;
  const removed = detailNumber(event.details, "removed") ?? 0;
  switch (event.lifecycleType) {
    case "app_connected":
      return tx("{{who}} connected {{app}}", { who, app });
    case "app_paused":
      return tx("{{who}} paused {{app}}", { who, app });
    case "app_resumed":
      return tx("{{who}} resumed {{app}}", { who, app });
    case "reconnected":
      return tx("{{who}} reconnected {{app}}", { who, app });
    case "disconnected":
      return tx("{{who}} disconnected {{app}}", { who, app });
    case "allowlist_changed":
      if (added > 0 && removed === 0) {
        return added === 1
          ? tx("{{who}} added {{n}} allowed item in {{app}}", { who, n: added, app })
          : tx("{{who}} added {{n}} allowed items in {{app}}", { who, n: added, app });
      }
      if (removed > 0 && added === 0) {
        return removed === 1
          ? tx("{{who}} removed {{n}} allowed item in {{app}}", { who, n: removed, app })
          : tx("{{who}} removed {{n}} allowed items in {{app}}", { who, n: removed, app });
      }
      return tx("{{who}} updated the allowlist for {{app}}", { who, app });
    case "actions_quarantined":
      return count === 1
        ? tx("{{n}} new action needs review in {{app}}", { n: count, app })
        : tx("{{n}} new actions need review in {{app}}", { n: count, app });
    default:
      return tx("{{who}} updated {{app}}", { who, app });
  }
}

/** Plain-words "why" for the row expander, keyed off the reason code. */
function plainReason(event: ToolGatewayActivityEvent): string {
  if (event.lifecycleType) return tx("This connection change was recorded in the app's activity history.");
  const code = detailString(event.details, "reasonCode");
  if (code === "permitted_connections_not_installed") {
    return tx("Permitted connections were not installed, so their tools were not added to this run.");
  }
  switch (event.normalizedOutcome) {
    case "allowed":
      return tx("Allowed by your rules.");
    case "blocked":
      if (code === "rate_limited") return tx("Blocked because it ran too many times in a short window.");
      if (code?.includes("secret")) return tx("Blocked to keep a sensitive value from leaving.");
      return tx("Blocked by a rule.");
    case "asked_first":
      return tx("Held for someone to approve before it could run.");
    case "waiting":
      return tx("Waiting — the app it needs wasn't ready yet.");
    case "failed":
      return tx("The app was allowed to run it, but returned an error.");
    default:
      return tx("Recorded by {{brand}}.", xoBrandVars());
  }
}

/** Compact monospace fact row inside the Details collapse. */
function DetailFact({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex gap-2">
      <span className="w-28 shrink-0 text-muted-foreground">{label}</span>
      <span className={cn("min-w-0 break-all text-foreground", mono && "font-mono text-(length:--text-micro)")}>{value}</span>
    </div>
  );
}

function OutcomeChip({ outcome }: { outcome: ToolAuditOutcome }) {
  const status = OUTCOME_STATUS[outcome] ?? OUTCOME_STATUS.unknown;
  return <StatusBadge status={status} label={outcomeLabel(outcome)} />;
}

function ActivityRow({
  event,
  ruleNamesById,
}: {
  event: ToolGatewayActivityEvent;
  ruleNamesById: Map<string, string>;
}) {
  const [open, setOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const who = event.agentDisplayName ?? tx("An agent");
  const action = event.toolDisplayName ?? tx("an action");
  const app = event.appDisplayName ?? event.connectionDisplayName ?? event.applicationDisplayName ?? null;
  const lifecycle = lifecycleSummary(event);
  const rawTool = detailString(event.details, "tool") ?? detailString(event.details, "toolName");

  const issueId = detailString(event.details, "issueId");
  const runId = event.runId ?? detailString(event.details, "runId");
  const agentId = event.agentId ?? detailString(event.details, "agentId");
  const reasonCode = detailString(event.details, "reasonCode") ?? event.action.replace("tool_gateway.", "");
  const matchedRuleId = detailStringArray(event.details, "matchedPolicyIds").find((id) => ruleNamesById.has(id));
  const matchedRuleName = matchedRuleId ? ruleNamesById.get(matchedRuleId) : undefined;
  const argumentsText = formattedArguments(event.details);
  const execution = detailRecord(event.details?.execution);
  const request = detailRecord(execution?.request);
  const response = detailRecord(execution?.response);
  const transport = detailString(execution, "transport");
  const requestMethod = detailString(request, "httpMethod");
  const endpoint = detailString(request, "endpoint");
  const mcpMethod = detailString(request, "mcpMethod");
  const requestId = detailString(request, "requestId");
  const httpStatus = detailNumber(response, "httpStatus");
  const contentType = detailString(response, "contentType");
  const responseBytes = detailNumber(response, "bodySizeBytes");
  const upstreamRequestId = detailString(response, "upstreamRequestId");
  const permittedNotInstalledCount = detailNumber(event.details, "permittedNotInstalledCount");
  const permittedNotInstalledConnections = Array.isArray(event.details?.permittedNotInstalledConnections)
    ? event.details.permittedNotInstalledConnections
      .map(detailRecord)
      .filter((connection): connection is Record<string, unknown> => connection !== null)
    : [];
  const isRuntimeMcpDeliveryDiagnostic = reasonCode === "permitted_connections_not_installed";

  return (
    <li className="text-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start gap-2.5 px-4 py-3 text-left hover:bg-accent/50"
      >
        {open ? (
          <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        )}
        <span className="min-w-0 flex-1">
          {lifecycle ? (
            <span className="block text-foreground">{lifecycle}</span>
          ) : isRuntimeMcpDeliveryDiagnostic ? (
            <span className="block text-foreground">
              {(permittedNotInstalledCount ?? permittedNotInstalledConnections.length) === 1 ? (
                <XoTrans
                  i18nKey="<who>{{who}}</who>'s run received 0 MCP servers — <n>{{n}}</n> permitted connection not installed"
                  values={{ who, n: permittedNotInstalledCount ?? permittedNotInstalledConnections.length }}
                  components={{ who: <span className="font-medium" />, n: <span className="font-medium" /> }}
                />
              ) : (
                <XoTrans
                  i18nKey="<who>{{who}}</who>'s run received 0 MCP servers — <n>{{n}}</n> permitted connections not installed"
                  values={{ who, n: permittedNotInstalledCount ?? permittedNotInstalledConnections.length }}
                  components={{ who: <span className="font-medium" />, n: <span className="font-medium" /> }}
                />
              )}
            </span>
          ) : (
            <span className="block text-foreground">
              {app ? (
                <XoTrans
                  i18nKey="<who>{{who}}</who> used <action>{{action}}</action> in <app>{{app}}</app>"
                  values={{ who, action, app }}
                  components={{ who: <span className="font-medium" />, action: <span className="font-medium" />, app: <span className="font-medium" /> }}
                />
              ) : (
                <XoTrans
                  i18nKey="<who>{{who}}</who> used <action>{{action}}</action>"
                  values={{ who, action }}
                  components={{ who: <span className="font-medium" />, action: <span className="font-medium" /> }}
                />
              )}
            </span>
          )}
        </span>
        <span className="flex shrink-0 items-center gap-2 whitespace-nowrap">
          {event.lifecycleType ? null : <OutcomeChip outcome={event.normalizedOutcome} />}
          <span className="text-xs text-muted-foreground">
            · <RelativeTime value={event.createdAt} />
          </span>
        </span>
      </button>

      {open ? (
        <div className="space-y-3 border-t border-border bg-muted/30 px-4 py-3 pl-10 text-sm">
          <p className="text-foreground">
            {plainReason(event)}
            {matchedRuleName ? (
              <>
                {" "}
                <span className="font-medium">{matchedRuleName}</span>
              </>
            ) : null}
          </p>

          <div className="flex flex-wrap gap-3 text-xs">
            {issueId ? (
              <Link to={`/issues/${issueId}`} className="text-primary hover:underline">
                View task
              </Link>
            ) : null}
            {runId && agentId ? (
              <Link to={`/agents/${agentId}/runs/${runId}`} className="text-primary hover:underline">
                View run
              </Link>
            ) : null}
          </div>

          <div>
            <button
              type="button"
              onClick={() => setDetailsOpen((v) => !v)}
              className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              {detailsOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
              Details
            </button>
            {detailsOpen ? (
              <div className="mt-2 space-y-1.5 text-xs">
                {rawTool ? <DetailFact label="Action name" value={rawTool} mono /> : null}
                <DetailFact label="Reason code" value={reasonCode} mono />
                <DetailFact label="Actor type" value={event.actorType ?? "—"} />
                {runId ? <DetailFact label="Run ID" value={runId} mono /> : null}
                {transport ? <DetailFact label="Transport" value={transport} mono /> : null}
                {requestMethod && endpoint ? <DetailFact label="HTTP request" value={`${requestMethod} ${endpoint}`} mono /> : null}
                {mcpMethod ? <DetailFact label="MCP method" value={mcpMethod} mono /> : null}
                {requestId ? <DetailFact label="Request ID" value={requestId} mono /> : null}
                {request ? <DetailFact label="Dispatched" value={request.dispatched === true ? tx("Yes") : tx("No")} /> : null}
                {httpStatus !== undefined ? <DetailFact label="HTTP status" value={String(httpStatus)} mono /> : null}
                {contentType ? <DetailFact label="Content type" value={contentType} mono /> : null}
                {responseBytes !== undefined ? <DetailFact label="Response size" value={tx("{{n}} bytes", { n: responseBytes })} /> : null}
                {upstreamRequestId ? <DetailFact label="Upstream ID" value={upstreamRequestId} mono /> : null}
                {isRuntimeMcpDeliveryDiagnostic ? (
                  <>
                    <DetailFact label="Delivered MCP servers" value="0" mono />
                    {permittedNotInstalledConnections.map((connection) => {
                      const connectionId = detailString(connection, "id");
                      const connectionName = detailString(connection, "name") ?? tx("Unnamed connection");
                      return connectionId ? (
                        <div key={connectionId} className="flex gap-2">
                          <span className="shrink-0 text-muted-foreground">Not installed</span>
                          <Link to={`/apps/${connectionId}/permissions`} className="font-medium text-primary hover:underline">
                            {connectionName}
                          </Link>
                        </div>
                      ) : null;
                    })}
                  </>
                ) : null}
                {argumentsText ? (
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Parameters (redacted)</span>
                    <pre className="whitespace-pre-wrap break-words rounded-md border border-border bg-background p-3 font-mono text-xs text-foreground">
                      {argumentsText}
                    </pre>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </li>
  );
}

export function AuditTab({ companyId }: { companyId: string }) {
  const [app, setApp] = useState<string>(ALL);
  const [agent, setAgent] = useState<string>(ALL);
  const [outcome, setOutcome] = useState<string>(ALL);
  const [windowKey, setWindowKey] = useState<ToolAuditWindow>("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  // Debounce the search box so each keystroke doesn't fire a server request.
  useEffect(() => {
    const id = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(id);
  }, [searchInput]);

  const apps = useQuery({
    queryKey: queryKeys.tools.applications(companyId),
    queryFn: () => toolsApi.listApplications(companyId),
  });
  const agents = useQuery({
    queryKey: queryKeys.agents.list(companyId),
    queryFn: () => agentsApi.list(companyId),
  });
  // Map matched rule IDs to their humanized names for the row "why" link.
  const policies = useQuery({
    queryKey: queryKeys.tools.policies(companyId),
    queryFn: () => toolsApi.listPolicies(companyId),
  });
  const ruleNamesById = useMemo(
    () => new Map((policies.data?.policies ?? []).map((p) => [p.id, p.name])),
    [policies.data],
  );

  const filters = {
    app: app === ALL ? undefined : app,
    agent: agent === ALL ? undefined : agent,
    outcome: outcome === ALL ? undefined : outcome,
    window: windowKey,
    search: search || undefined,
  };
  const hasActiveFilters =
    app !== ALL || agent !== ALL || outcome !== ALL || windowKey !== "all" || search.length > 0;

  const activity = useInfiniteQuery({
    queryKey: queryKeys.tools.activity(companyId, {
      app: filters.app,
      agent: filters.agent,
      outcome: filters.outcome,
      window: filters.window,
      search: filters.search,
    }),
    queryFn: ({ pageParam }) =>
      toolsApi.listActivity(companyId, { ...filters, limit: PAGE_SIZE, cursor: pageParam ?? undefined }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  const events = useMemo(
    () => activity.data?.pages.flatMap((page) => page.events) ?? [],
    [activity.data],
  );

  const clearFilters = () => {
    setApp(ALL);
    setAgent(ALL);
    setOutcome(ALL);
    setWindowKey("all");
    setSearchInput("");
    setSearch("");
  };

  return (
    <div className="space-y-4">
      <ToolsPageHeader
        title="Activity"
        description="What your agents actually did with your apps, newest first. Each line is one decision — allowed, blocked, asked first, waiting, or failed."
      />

      <div className="flex flex-wrap items-center gap-2">
        <Select value={app} onValueChange={setApp}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="App" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All apps</SelectItem>
            {(apps.data?.applications ?? []).map((a) => (
              <SelectItem key={a.id} value={a.id}>
                {a.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <AgentSelect
          agents={[{ id: ALL, name: tx("All agents") }, ...(agents.data ?? [])]}
          value={agent}
          onChange={setAgent}
          triggerClassName="w-40"
        />
        <Select value={outcome} onValueChange={setOutcome}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {OUTCOME_FILTERS.map((o) => (
              <SelectItem key={o} value={o}>
                {outcomeLabel(o)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={windowKey} onValueChange={(v) => setWindowKey(v as ToolAuditWindow)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {WINDOW_FILTERS.map((o) => (
              <SelectItem key={o} value={o}>
                {windowLabel(o)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Search activity…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="max-w-xs"
        />
        {hasActiveFilters ? (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        ) : null}
      </div>

      {activity.isLoading ? (
        <LoadingState />
      ) : activity.error ? (
        <ErrorState error={activity.error} onRetry={() => activity.refetch()} />
      ) : events.length === 0 ? (
        hasActiveFilters ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
              <ScrollText className="h-10 w-10 text-muted-foreground/40" />
              <div>
                <p className="text-sm font-medium text-foreground">No activity matches these filters</p>
                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                  Try a wider time window or different filters.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
              <ScrollText className="h-10 w-10 text-muted-foreground/40" />
              <div>
                <p className="text-sm font-medium text-foreground">Nothing here yet</p>
                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                  As soon as your agents start using connected apps, what they do shows up here.
                </p>
              </div>
            </CardContent>
          </Card>
        )
      ) : (
        <Card>
          <CardContent className="px-0 py-0">
            <ul className="divide-y divide-border">
              {events.map((event) => (
                <ActivityRow key={event.id} event={event} ruleNamesById={ruleNamesById} />
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {activity.hasNextPage ? (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => activity.fetchNextPage()}
            disabled={activity.isFetchingNextPage}
          >
            {activity.isFetchingNextPage ? "Loading…" : "Load more"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
