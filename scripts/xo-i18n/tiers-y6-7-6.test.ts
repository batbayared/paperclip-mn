import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { XO_TRANSFORM_FILES } from "./tiers";
import { transformSource } from "./transform";

function read(rel: string): string {
  return readFileSync(fileURLToPath(new URL(`../../${rel}`, import.meta.url)), "utf8");
}

const CASES: Array<{ file: string; keys: string[] }> = [
  {
    file: "ui/src/pages/secrets/ImportFromVaultDialog.tsx",
    keys: ["Imported", "Conflict", "Skipped", "{{n}}s ago"],
  },
  {
    file: "ui/src/pages/secrets/proposal-review.tsx",
    keys: ["no fingerprint", "Fingerprint copied", "Reason given by the agent"],
  },
  {
    file: "ui/src/pages/secrets/UserSecretDefinitionsTab.tsx",
    keys: ["Definition updated", "Definition removed", "New user secret"],
  },
  {
    file: "ui/src/pages/secrets/SetMyUserSecretDialog.tsx",
    keys: ["No definition selected", "Value saved", "Set your value"],
  },
  {
    file: "ui/src/pages/secrets/MyUserSecretsTab.tsx",
    keys: ["Value cleared", "Could not clear value", "Failed to load your secrets: {{message}}"],
  },
  {
    file: "ui/src/pages/secrets/ProposalsTab.tsx",
    keys: ["no expiry", "expires in {{hours}}h", "Couldn’t load proposals. Try again."],
  },
  {
    file: "ui/src/pages/secrets/MissingUserSecretsBanner.tsx",
    keys: ["Set your user secrets", "Set value", "Manage all my secrets"],
  },
  {
    file: "ui/src/components/folders/FolderControls.tsx",
    keys: ["Unfiled", "New folder", "Folder actions for {{name}}"],
  },
  {
    file: "ui/src/components/AttentionQueueRow.tsx",
    keys: ["1 hour", "Next week", "See more", "Collapse decision"],
  },
  {
    file: "ui/src/pages/InstanceGeneralSettings.tsx",
    keys: ["General", "Failed to update general settings.", "Loading general settings..."],
  },
];

describe("Ү6 7.6 T1 файлууд", () => {
  it.each(CASES)("$file T1-д байна, мөрүүдийг барина, гараар үлдэгдэлгүй", ({ file, keys }) => {
    expect(XO_TRANSFORM_FILES).toContain(file);
    const result = transformSource(read(file), file);
    const extracted = result.strings.map((s) => s.key);
    for (const key of keys) expect(extracted).toContain(key);
    expect(result.manual).toEqual([]);
  });
});
