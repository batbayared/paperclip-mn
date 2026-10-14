import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { XO_TRANSFORM_FILES } from "./tiers";
import { transformSource } from "./transform";

function read(rel: string): string {
  return readFileSync(fileURLToPath(new URL(`../../${rel}`, import.meta.url)), "utf8");
}

const CASES: Array<{ file: string; keys: string[] }> = [
  { file: "ui/src/components/AgentActionButtons.tsx", keys: [] },
  { file: "ui/src/components/AgentBubbleActionRow.tsx", keys: [] },
  { file: "ui/src/components/OutputFeedbackButtons.tsx", keys: [] },
  { file: "ui/src/components/StatusIcon.tsx", keys: [] },
  { file: "ui/src/components/MembershipAction.tsx", keys: [] },
  { file: "ui/src/pages/secrets/user-secret-presentation.tsx", keys: [] },
  { file: "ui/src/components/access/ModeBadge.tsx", keys: [] },
  { file: "ui/src/components/ExecutionParticipantPicker.tsx", keys: ["Search {{label}}..."] },
  { file: "ui/src/components/ProviderTraceStatusBadge.tsx", keys: [] },
  { file: "ui/src/components/SourceTrustBadge.tsx", keys: [] },
  { file: "ui/src/components/AgentIconPicker.tsx", keys: [] },
  { file: "ui/src/components/task-chat/TaskChatThreadView.tsx", keys: [] },
  { file: "ui/src/adapters/http/config-fields.tsx", keys: [] },
  { file: "ui/src/components/AnimatedPaperclipIcon.tsx", keys: [] },
  { file: "ui/src/components/FeedCard.tsx", keys: [] },
  { file: "ui/src/components/IssueCasesPanel.tsx", keys: [] },
  { file: "ui/src/components/PageTabBar.tsx", keys: [] },
  { file: "ui/src/components/PipelineLivenessBanner.tsx", keys: [] },
  { file: "ui/src/components/SwipeToArchive.tsx", keys: [] },
  { file: "ui/src/components/issue-properties/property-picker.tsx", keys: [] },
  { file: "ui/src/components/ProjectRepositoryInput.tsx", keys: ["Some GitHub connections could not load. Reconnect them in Apps or try again.", "Try again"] },
];

describe("Ү6 7.17 T1 файлууд (tier-гүй үлдсэн .tsx)", () => {
  it.each(CASES)("$file T1-д байна, мөрүүдийг барина, гараар үлдэгдэлгүй", ({ file, keys }) => {
    expect(XO_TRANSFORM_FILES).toContain(file);
    const result = transformSource(read(file), file);
    const extracted = result.strings.map((s) => s.key);
    for (const key of keys) expect(extracted).toContain(key);
    expect(result.manual).toEqual([]);
  });
});
