import {
  codexLocalReasoningEffortsForModel,
  type CodexLocalReasoningEffort,
} from "@paperclipai/adapter-codex-local";
import { tx } from "@/i18n/xo";

// XO: labels resolve at call time so they follow the active locale (en output unchanged).
function codexReasoningEffortLabel(effort: CodexLocalReasoningEffort): string {
  switch (effort) {
    case "minimal":
      return tx("Minimal");
    case "low":
      return tx("Low");
    case "medium":
      return tx("Medium");
    case "high":
      return tx("High");
    case "xhigh":
      return tx("X-High");
    case "max":
      return tx("Max");
    case "ultra":
      return tx("Ultra");
    default:
      return effort;
  }
}

export function codexReasoningEffortOptions(
  model: string | null | undefined,
  defaultLabel = tx("Default"),
) {
  return [
    { value: "", label: defaultLabel },
    ...codexLocalReasoningEffortsForModel(model).map((value) => ({
      value,
      label: codexReasoningEffortLabel(value),
    })),
  ];
}
