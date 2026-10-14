import type { ToolCatalogEntry } from "@paperclipai/shared";
import { tx } from "@/i18n/xo";

export type ActionPermissionSummary = {
  allowedCount: number;
  askFirstCount: number;
  offCount: number;
};

export function summarizeActionPermissions(
  entries: ToolCatalogEntry[],
  enabledIds: Set<string>,
  askFirstIds: Set<string>,
): ActionPermissionSummary {
  let allowedCount = 0;
  let askFirstCount = 0;
  let offCount = 0;

  for (const entry of entries) {
    if (!enabledIds.has(entry.id)) {
      offCount += 1;
    } else if (askFirstIds.has(entry.id)) {
      askFirstCount += 1;
    } else {
      allowedCount += 1;
    }
  }

  return { allowedCount, askFirstCount, offCount };
}

export function formatActionPermissionSummary(summary: ActionPermissionSummary): string {
  const { allowedCount, askFirstCount, offCount } = summary;
  return [
    allowedCount === 1
      ? tx("Allowed for {{n}} action", { n: allowedCount })
      : tx("Allowed for {{n}}", { n: allowedCount }),
    askFirstCount === 1
      ? tx("Ask first for {{n}} action", { n: askFirstCount })
      : tx("Ask first for {{n}}", { n: askFirstCount }),
    offCount === 1
      ? tx("Off for {{n}} action", { n: offCount })
      : tx("Off for {{n}}", { n: offCount }),
  ].join(" · ");
}
