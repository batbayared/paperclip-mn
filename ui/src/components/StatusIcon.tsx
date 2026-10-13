import { useState } from "react";
import type { IssueBlockerAttention } from "@paperclipai/shared";
import { cn } from "../lib/utils";
import { StatusGlyph, type StatusGlyphSize } from "./StatusGlyph";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { tx } from "@/i18n/xo";
import { xoStatusLabel } from "@/xo/labels";

const allStatuses = ["backlog", "todo", "in_progress", "in_review", "done", "cancelled", "blocked"];

function statusLabel(status: string): string {
  return xoStatusLabel(status, status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()));
}

interface StatusIconProps {
  status: string;
  blockerAttention?: IssueBlockerAttention | null;
  onChange?: (status: string) => void;
  className?: string;
  showLabel?: boolean;
  /** Glyph size (PAP-243a). Default `md` (16px); lists/detail/mentions use `lg` (20px). */
  size?: StatusGlyphSize;
}

function blockedAttentionLabel(blockerAttention: IssueBlockerAttention | null | undefined) {
  if (!blockerAttention || blockerAttention.state === "none") return xoStatusLabel("blocked", "Blocked");

  if (blockerAttention.reason === "active_child") {
    const n = blockerAttention.coveredBlockerCount;
    if (n === 1 && blockerAttention.sampleBlockerIdentifier) {
      return tx("Blocked · waiting on active sub-task {{identifier}}", { identifier: blockerAttention.sampleBlockerIdentifier });
    }
    return n === 1
      ? tx("Blocked · waiting on {{n}} active sub-task", { n })
      : tx("Blocked · waiting on {{n}} active sub-tasks", { n });
  }

  if (blockerAttention.reason === "active_dependency") {
    const n = blockerAttention.coveredBlockerCount;
    if (n === 1 && blockerAttention.sampleBlockerIdentifier) {
      return tx("Blocked · covered by active dependency {{identifier}}", { identifier: blockerAttention.sampleBlockerIdentifier });
    }
    return n === 1
      ? tx("Blocked · covered by {{n}} active dependency", { n })
      : tx("Blocked · covered by {{n}} active dependencies", { n });
  }

  if (blockerAttention.reason === "stalled_review") {
    const n = blockerAttention.stalledBlockerCount;
    const leaf = blockerAttention.sampleStalledBlockerIdentifier ?? blockerAttention.sampleBlockerIdentifier;
    if (n === 1 && leaf) return tx("Blocked · review stalled on {{identifier}}", { identifier: leaf });
    if (n === 1) return tx("Blocked · review stalled with no clear next step");
    return tx("Blocked · {{n}} reviews stalled with no clear next step", { n });
  }

  if (blockerAttention.reason === "attention_required") {
    const n = blockerAttention.attentionBlockerCount || blockerAttention.unresolvedBlockerCount;
    const covered = blockerAttention.coveredBlockerCount;
    if (covered > 0) {
      return n === 1
        ? tx("Blocked · {{n}} blocker needs attention; {{covered}} covered by active work", { n, covered })
        : tx("Blocked · {{n}} blockers need attention; {{covered}} covered by active work", { n, covered });
    }
    return n === 1
      ? tx("Blocked · {{n}} blocker needs attention", { n })
      : tx("Blocked · {{n}} blockers need attention", { n });
  }

  return xoStatusLabel("blocked", "Blocked");
}

/**
 * Task/issue status indicator — renders the unified, color-blind-safe
 * {@link StatusGlyph} (one distinct shape per status). With `onChange` it also
 * acts as a status picker (popover). This one component drives every standalone
 * status surface: list, kanban, detail header, properties row + picker flyout,
 * sub-task / blocked-by pills, blocked inbox, quicklook, sibling nav, filters,
 * search, columns, dashboard.
 *
 * A "covered" blocked task (waiting on active work) maps to the `in_queue`
 * glyph — the blocked shape recoloured blue — while the full blocked reason
 * still rides on the accessible label.
 */
export function StatusIcon({ status, blockerAttention, onChange, className, showLabel, size = "md" }: StatusIconProps) {
  const [open, setOpen] = useState(false);
  const isCoveredBlocked = status === "blocked" && blockerAttention?.state === "covered";
  const ariaLabel = status === "blocked" ? blockedAttentionLabel(blockerAttention) : statusLabel(status);
  const glyphStatus = isCoveredBlocked ? "in_queue" : status;

  const glyph = (
    <StatusGlyph
      status={glyphStatus}
      size={size}
      className={cn(onChange && !showLabel && "cursor-pointer", className)}
      title={ariaLabel}
    />
  );

  if (!onChange) {
    return showLabel ? (
      <span className="inline-flex items-center gap-1.5">
        {glyph}
        <span className="text-sm">{statusLabel(status)}</span>
      </span>
    ) : (
      glyph
    );
  }

  const trigger = showLabel ? (
    <button
      type="button"
      aria-label={tx("Change status (current: {{label}})", { label: ariaLabel })}
      className="inline-flex min-h-5 items-center gap-1.5 cursor-pointer hover:bg-accent/50 rounded px-1 -mx-1 py-0.5 transition-colors"
    >
      {glyph}
      <span className="text-sm">{statusLabel(status)}</span>
    </button>
  ) : (
    <button
      type="button"
      data-slot="icon-button"
      aria-label={tx("Change status (current: {{label}})", { label: ariaLabel })}
      className="inline-flex cursor-pointer items-center justify-center rounded-sm focus-visible:outline-none focus-visible:ring-(length:--rad-3) focus-visible:ring-ring"
    >
      {glyph}
    </button>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-40 p-1" align="start">
        {allStatuses.map((s) => (
          <Button
            key={s}
            variant="ghost"
            size="sm"
            className={cn("w-full justify-start gap-2 text-xs", s === status && "bg-accent")}
            onClick={() => {
              onChange(s);
              setOpen(false);
            }}
          >
            <StatusIcon status={s} size="lg" />
            {statusLabel(s)}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
