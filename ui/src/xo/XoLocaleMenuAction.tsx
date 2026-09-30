import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveLocale, setLocale, type XoLocale } from "./locale";

const COPY: Record<XoLocale, { label: string; description: string }> = {
  mn: { label: "Switch to English", description: "Одоогийн хэл: Монгол" },
  en: { label: "Монгол хэл рүү шилжих", description: "Current language: English" },
};

type XoLocaleMenuActionProps = {
  className?: string;
  variant?: "menu-action" | "compact-menu-action";
  onAfterSelect?: () => void;
};

export function XoLocaleMenuAction({
  className,
  variant = "compact-menu-action",
  onAfterSelect,
}: XoLocaleMenuActionProps) {
  const current = resolveLocale();
  const next: XoLocale = current === "mn" ? "en" : "mn";
  const { label, description } = COPY[current];

  const handleClick = () => {
    onAfterSelect?.();
    setLocale(next);
  };

  if (variant === "menu-action") {
    return (
      <button
        type="button"
        className={cn(
          "flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-accent/60",
          className,
        )}
        onClick={handleClick}
        aria-label={label}
      >
        <span className="mt-0.5 rounded-lg border border-border bg-background/70 p-2 text-muted-foreground">
          <Languages className="size-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium text-foreground">{label}</span>
          <span className="block text-xs text-muted-foreground">{description}</span>
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className={cn(
        "flex h-(--profile-popover-row-height) w-full items-center gap-(--profile-popover-row-gap) rounded-lg px-2.5 text-left text-(length:--text-compact) font-medium leading-(--profile-popover-label-line-height) text-foreground transition-colors hover:bg-accent",
        className,
      )}
      onClick={handleClick}
      aria-label={label}
    >
      <span className="flex size-5 shrink-0 items-center justify-center text-muted-foreground">
        <Languages className="size-4" />
      </span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
    </button>
  );
}
