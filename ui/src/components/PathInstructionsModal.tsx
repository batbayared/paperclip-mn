import { useState } from "react";
import { Apple, Monitor, Terminal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { tx } from "@/i18n/xo";
import { XoTrans } from "@/xo/XoTrans";

type Platform = "mac" | "windows" | "linux";

function getPlatforms(): { id: Platform; label: string; icon: typeof Apple }[] {
  return [
    { id: "mac", label: "macOS", icon: Apple },
    { id: "windows", label: "Windows", icon: Monitor },
    { id: "linux", label: "Linux", icon: Terminal },
  ];
}

function getInstructions(): Record<Platform, { steps: string[]; tip?: string }> {
  return {
  mac: {
    steps: [
      tx("Open Finder and navigate to the folder."),
      tx("Right-click (or Control-click) the folder."),
      tx("Hold the Option (⌥) key — \"Copy\" changes to \"Copy as Pathname\"."),
      tx("Click \"Copy as Pathname\", then paste here."),
    ],
    tip: tx("You can also open Terminal, type cd, drag the folder into the terminal window, and press Enter. Then type pwd to see the full path."),
  },
  windows: {
    steps: [
      tx("Open File Explorer and navigate to the folder."),
      tx("Click in the address bar at the top — the full path will appear."),
      tx("Copy the path, then paste here."),
    ],
    tip: tx("Alternatively, hold Shift and right-click the folder, then select \"Copy as path\"."),
  },
  linux: {
    steps: [
      tx("Open a terminal and navigate to the directory with cd."),
      tx("Run pwd to print the full path."),
      tx("Copy the output and paste here."),
    ],
    tip: tx("In most file managers, Ctrl+L reveals the full path in the address bar."),
  },
};
}

function detectPlatform(): Platform {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("mac")) return "mac";
  if (ua.includes("win")) return "windows";
  return "linux";
}

interface PathInstructionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PathInstructionsModal({
  open,
  onOpenChange,
}: PathInstructionsModalProps) {
  const [platform, setPlatform] = useState<Platform>(detectPlatform);

  const current = getInstructions()[platform];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">How to get a full path</DialogTitle>
          <DialogDescription>
            <XoTrans
              i18nKey="Paste the absolute path (e.g. <code>/Users/you/project</code>) into the input field."
              components={{ code: <code className="text-xs bg-muted px-1 py-0.5 rounded" /> }}
            />
          </DialogDescription>
        </DialogHeader>

        {/* Platform tabs */}
        <div className="flex gap-1 rounded-md border border-border p-0.5">
          {getPlatforms().map((p) => (
            <button
              key={p.id}
              type="button"
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded px-2 py-1 text-xs transition-colors",
                platform === p.id
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
              )}
              onClick={() => setPlatform(p.id)}
            >
              <p.icon className="h-3.5 w-3.5" />
              {p.label}
            </button>
          ))}
        </div>

        {/* Steps */}
        <ol className="space-y-2 text-sm">
          {current.steps.map((step, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-muted-foreground font-mono text-xs mt-0.5 shrink-0">
                {i + 1}.
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        {current.tip && (
          <p className="text-xs text-muted-foreground border-l-2 border-border pl-3">
            {current.tip}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

/**
 * Small "Choose" button that opens the PathInstructionsModal.
 * Drop-in replacement for the old showDirectoryPicker buttons.
 */
export function ChoosePathButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className={cn(
          "inline-flex items-center rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground hover:bg-accent/50 transition-colors shrink-0",
          className,
        )}
        onClick={() => setOpen(true)}
      >
        Choose
      </button>
      <PathInstructionsModal open={open} onOpenChange={setOpen} />
    </>
  );
}
