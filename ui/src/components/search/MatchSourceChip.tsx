import { cn } from "@/lib/utils";
import { tx } from "@/i18n/xo";

export type MatchSourceChipKind = "title" | "identifier" | "comment" | "document";

function chipStyle(kind: MatchSourceChipKind): string {
  switch (kind) {
    case "title":
      return "bg-(--chip-match-title-bg) text-(--chip-match-title-fg) border-(--chip-match-title-border)";
    case "identifier":
      return "bg-(--chip-match-identifier-bg) text-(--chip-match-identifier-fg) border-(--chip-match-identifier-border)";
    case "comment":
      return "bg-(--chip-match-comment-bg) text-(--chip-match-comment-fg) border-(--chip-match-comment-border)";
    case "document":
      return "bg-(--chip-match-document-bg) text-(--chip-match-document-fg) border-(--chip-match-document-border)";
  }
}

function chipLabel(kind: MatchSourceChipKind): string {
  switch (kind) {
    case "title":
      return tx("Title");
    case "identifier":
      return tx("Identifier");
    case "comment":
      return tx("Comment");
    case "document":
      return tx("Doc");
  }
}

export interface MatchSourceChipProps {
  kind: MatchSourceChipKind;
  count?: number;
  label?: string;
  className?: string;
}

// design-allow(pill-pattern): --chip-match-* domain token family (DESIGN.md domain tier); a
// deliberately separate chip system, not a Badge.
export function MatchSourceChip({ kind, count, label, className }: MatchSourceChipProps) {
  const text = label ?? chipLabel(kind);
  const showCount = typeof count === "number" && count > 1;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-px text-(length:--text-micro) font-medium leading-none whitespace-nowrap",
        chipStyle(kind),
        className,
      )}
      data-kind={kind}
    >
      {text}
      {showCount ? <span className="opacity-80">×{count}</span> : null}
    </span>
  );
}
