import { describe, expect, it } from "vitest";
import en from "./en.json";
import mn from "./mn.json";

// Ү6 7.5-д нэмсэн гар tx ба helper-ийн түлхүүрүүд (scratch t1–t6-аас; T1 transform-ын автомат мөрийг check хамгаална).
const Y6_7_5_KEYS: string[] = [
  "Anyone",
  "Anyone except creator",
  "Human only",
  "Addressed",
  "Anyone (default)",
  "No cap",
  "Runtime",
  "Governance",
  "Permissions / Trust",
  "Revisions",
  "Accepted",
  "Answered",
  "Withdrawn",
  "Declined",
  "Deferred",
  "Disabled",
  "Deleted",
  "Defer",
  "Revise…",
  "Anyone in the organization can respond — the board or any agent, including the one that asked.",
  "Anyone in the organization except the agent that created the card, and its run. Use this when the answer has to come from someone else.",
  "Only a person on the board can respond. Agents are turned away.",
  "New cards are open — the board or any agent can respond, including the one that asked.",
  "A request keeps whatever audience it asks for.",
  "New cards exclude the agent that created them, so the answer comes from someone else.",
  "New cards wait for a person on the board. Agents are turned away.",
  "Even a card that asks for Anyone is narrowed to exclude its creator.",
  "Every card of this kind waits for a person, whatever it asked for.",
  "Ask user questions",
  "Confirmations",
  "Checkbox confirmations",
  "Checkbox confirmation",
  "Item verdicts",
  "Connection requests",
  "Connection request",
  "you",
  "the addressed user",
  "the addressed agent",
  "the agent that created it",
  "Only {{addressee}} can respond.",
  "Assigned to {{addressee}}. Only a person on the board can respond — agents cannot resolve this card.",
  "Only a person on the board can respond — agents cannot resolve this card.",
  "Only {{addressee}} or a person on the board can respond.",
  "Anyone in the organization except {{creator}} can respond.",
  "Only {{addressee}} can respond",
  "Assigned to {{addressee}} · board only",
  "Only the board can respond",
  "Only {{addressee}} or the board can respond",
  "Anyone except {{creator}} can respond",
  "Anyone can respond",
  "This card runs a governed action, so it stays human-only whatever audience was requested.",
  "Organization interaction governance narrowed this from {{from}} to {{to}}.",
  "Created before Anyone became the default, so it stays restricted. A new card would be open.",
  "Failed to save interaction governance",
  "{{count}} sample_one",
  "{{count}} sample_other",
  "Coverage is counts only across {{count}} member. Secret values are never shown here._one",
  "Coverage is counts only across {{count}} member. Secret values are never shown here._other",
  "Page section",
  "Action failed",
  "Failed to start traced run",
  "Agent is not ready to duplicate",
  "Agent duplicated",
  "Failed to duplicate agent",
  "Could not duplicate agent",
  "Duplicate {{name}} as {{nextName}}?",
  "Failed to reset session",
];

// mn утга нь англитай ижил байж болох түлхүүрүүд (оноосон нэр).
const SAME_IN_MN = new Set<string>([]);

const PLACEHOLDER = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;
function placeholders(s: string): string[] {
  return [...s.matchAll(PLACEHOLDER)].map((m) => m[1]).sort();
}

describe("Ү6 7.5 каталогийн түлхүүрүүд", () => {
  it("en ба mn-д бүгд байна", () => {
    for (const key of Y6_7_5_KEYS) {
      expect(en, `en: ${key}`).toHaveProperty([key]);
      expect(mn, `mn: ${key}`).toHaveProperty([key]);
    }
  });

  it("mn утга орчуулагдсан", () => {
    for (const key of Y6_7_5_KEYS) {
      if (SAME_IN_MN.has(key)) continue;
      expect((mn as Record<string, string>)[key], key).not.toBe((en as Record<string, string>)[key]);
    }
  });

  it("placeholder en/mn ижил", () => {
    for (const key of Y6_7_5_KEYS) {
      expect(placeholders((mn as Record<string, string>)[key] ?? ""), key).toEqual(placeholders(key));
    }
  });
});
