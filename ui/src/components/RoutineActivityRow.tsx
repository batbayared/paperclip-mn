import { useState } from "react";
import { ChevronRight } from "lucide-react";
import type { ActivityEvent } from "@paperclipai/shared";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { xoLocaleTime } from "@/xo/date-format";
import { i18n } from "@/i18n";
import { tx } from "@/i18n/xo";
import { xoRoutineRunSourceLabel, xoStatusLabel, xoTriggerKindLabel } from "@/xo/labels";

export type RoutineActivityEvent = Pick<ActivityEvent, "id" | "action" | "details" | "createdAt">;

function formatTime(value: string | Date): string {
  try {
    return xoLocaleTime(new Date(value), [], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return String(value);
  }
}

function summarizeDetails(details: Record<string, unknown> | null | undefined): string {
  if (!details) return "";
  const entries = Object.entries(details).slice(0, 3);
  return entries
    .map(([key, value]) => `${detailKeyLabel(key)}: ${detailValueLabel(key, value)}`)
    .join(" · ");
}

function isMn(): boolean {
  return (i18n.resolvedLanguage ?? i18n.language ?? "").startsWith("mn");
}

// routine.* activity details-ийн мэдэгдэж буй түлхүүр (server/src/routes/routines.ts, services/routines.ts).
function detailKeyLabel(key: string): string {
  const english = key.replaceAll("_", " ");
  if (!isMn()) return english;
  switch (key) {
    case "title": return tx("Title");
    case "source": return tx("Source");
    case "status": return tx("Status");
    case "kind": return tx("Kind");
    case "reason": return tx("Reason");
    default: return english;
  }
}

// source = ROUTINE_RUN_SOURCES, kind = ROUTINE_TRIGGER_KINDS, status = ROUTINE_RUN_STATUSES,
// reason = routine.run_skipped-ийн шалтгаан. en дээр formatDetailValue-тай ижил гаралт.
function detailValueLabel(key: string, value: unknown): string {
  const english = formatDetailValue(value);
  if (!isMn() || typeof value !== "string") return english;
  switch (key) {
    case "source": return xoRoutineRunSourceLabel(value);
    case "kind": return xoTriggerKindLabel(value);
    case "status": return xoStatusLabel(value, value);
    case "reason":
      switch (value) {
        case "paused": return tx("Paused");
        case "no_external_activity": return tx("No external activity");
        case "worktree_execution_cutoff": return tx("Worktree execution cutoff");
        default: return english;
      }
    default: return english;
  }
}

function formatDetailValue(value: unknown): string {
  if (value === null) return "null";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.length === 0 ? "[]" : value.map(formatDetailValue).join(", ");
  try {
    return JSON.stringify(value);
  } catch {
    return "[unserializable]";
  }
}

/** Activity log row with an expandable JSON payload (§3.7). */
export function RoutineActivityRow({ event }: { event: RoutineActivityEvent }) {
  const [expanded, setExpanded] = useState(false);
  const hasPayload = event.details != null && Object.keys(event.details).length > 0;

  return (
    <div className="border-b border-border/60 last:border-b-0">
      <button
        type="button"
        disabled={!hasPayload}
        onClick={() => setExpanded((value) => !value)}
        className={cn(
          "flex w-full items-center gap-3 px-1 py-2 text-left text-xs",
          hasPayload ? "hover:bg-accent/30" : "cursor-default",
        )}
      >
        <span className="w-12 shrink-0 font-mono text-muted-foreground/70">
          {formatTime(event.createdAt)}
        </span>
        <Badge variant="outline" className="shrink-0 font-mono">
          {event.action}
        </Badge>
        <span className="min-w-0 flex-1 truncate text-muted-foreground">
          {summarizeDetails(event.details)}
        </span>
        {hasPayload ? (
          <ChevronRight
            className={cn(
              "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform",
              expanded && "rotate-90",
            )}
          />
        ) : null}
      </button>
      {expanded && hasPayload ? (
        <pre className="mx-1 mb-2 overflow-x-auto rounded-md bg-neutral-950 p-3 font-mono text-xs text-neutral-200">
          {JSON.stringify(event.details, null, 2)}
        </pre>
      ) : null}
    </div>
  );
}
