import { describe, expect, it } from "vitest";
import en from "./en.json";
import keepEn from "./keep-en.json";
import mn from "./mn.json";

// Ү6 7.9-д нэмсэн helper (labels.ts) ба Wave 1 файлуудын гар tx / XoTrans түлхүүрүүд
// (9282a6b0c..601852d9c commit-уудаас; T1 transform-ын мөрийг check хамгаална).
const Y6_7_9_KEYS: string[] = [
  "New organization folder",
  "Move to Organization",
  "Move to My Skills",
  "Unfiled",
  "{{n}} agent uses this skill",
  "{{n}} agents use this skill",
  "Failed to update agent skills.",
  "Latest (v{{revision}})",
  "Latest",
  "v{{revision}}",
  "Loading agents...",
  "Search agents...",
  "All eligible agents already have this skill.",
  "Create copy & switch {{n}} agent",
  "Create copy & switch {{n}} agents",
  "Create copy",
  "the original skill",
  "the project working tree",
  "a URL",
  "the catalog",
  "a local path",
  "its source",
  "No agents currently use this skill",
  "{{n}} agent currently uses this skill",
  "{{n}} agents currently use this skill",
  "{{action}} is restricted by your organization policy.",
  "This action is restricted by your organization policy.",
  "An organization administrator can change the skill policy to allow this.",
  "This change needs administration access.",
  "This requires organization administration access. Ask an administrator to make this change.",
  "This action is blocked by a platform safety rule.",
  "Fix the flagged issue and try again.",
  "Test task expired",
  "This skill has no files to test",
  "Pick an agent to run",
  "Add or paste input text to run",
  "Save skill edits before running",
  "A run is already in progress",
  "Test task deleted",
  "Test task unavailable",
  "Stored run snapshots are still shown. Harness documents, attachments, and work products are no longer available.",
  "Unknown editor",
  "skills.sh managed",
  "GitHub managed",
  "URL managed",
  "Folder managed",
  "{{brand}} managed",
  "Catalog managed",
  "{{n}} found",
  "{{n}} imported",
  "{{n}} updated",
  "{{n}} conflicts",
  "{{n}} skipped",
  "{{parts}} across {{n}} workspace.",
  "{{parts}} across {{n}} workspaces.",
  "core",
  "Sharing: private",
  "Sharing: organization",
  "Categories: {{categories}}",
  "Categories: none",
  "Installed skills",
  "Discover skills",
  "Skills available to this organization.",
  "Browse skills from every available source.",
  "Search installed skills",
  "Search discoverable skills",
  "Filter installed skills.",
  "Filter discoverable skills.",
  "All skills",
  "Basics",
  "Design",
  "Content",
  "Review",
  "Copied hash",
  "Copy content hash",
  "Install skill",
  "Install update",
  "Replace existing skill",
  "Installing…",
  "No agents in this organization support skills yet.",
  "required",
  "skills not supported",
  "Add to agent",
  "No agents yet.",
  "No organization skills installed.",
  "No bundled skills installed.",
  "No optional skills installed.",
  "No external skills installed.",
  "{{n}} agent attached",
  "{{n}} agents attached",
  "and {{n}} more",
  "Copied path",
  "Copy source path",
  "Skill import failed",
  "Failed to import skill source.",
  "Importing skills",
  "Refreshing project skills...",
  "Scanning project workspaces for skills...",
  "Refreshing skills list...",
  "Project skill scan failed",
  "Failed to scan project workspaces.",
  "Scanning projects for skills",
  "Failed to create skill.",
  "Skill creation failed",
  "Creating a skill",
  "Pinned to {{ref}}",
  "Update failed",
  "Failed to install skill update.",
  "Updating this skill",
  "Failed to install catalog skill.",
  "Installing this skill",
  "Filed under {{folder}}.",
  "Filed under folder.",
  "Remove failed",
  "Failed to remove skill.",
  "Removing this skill",
  "Fork skill",
  "Create a new skill",
  "Review the fork metadata and create an editable organization copy.",
  "Create an editable organization skill in the {{brand}} workspace.",
  "Moved \"{{title}}\" to {{folder}}.",
  "Moved \"{{title}}\" to folder.",
  "Moved \"{{title}}\" to Unfiled.",
  "Please try again.",
  "New skill",
  "New Skill",
  "Select skill",
  "Loading skills...",
  "Search skills...",
  "No matching skills.",
  "Discard unsaved edits and switch files?",
  "Couldn't save file",
  "Couldn't create file",
  "Couldn't delete file",
  "Skill files",
  "This skill is read-only because it comes from an external source.",
  "Make an editable copy to change it — the original stays untouched.",
  "Delete {{path}}?",
  "Add folder",
  "Add file",
  "Folder path",
  "File path",
  "Folder path is required.",
  "File path is required.",
  "A file already exists at that path.",
  "A folder already exists at that path.",
  "No files exist under that folder.",
  "SKILL.md cannot be deleted.",
  "Discard unsaved changes to this input?",
  "Couldn't save input",
  "Couldn't delete input",
  "Test inputs",
  "Loading run templates",
  "Run templates couldn't load",
  "Couldn't save template",
  "Couldn't update template",
  "Couldn't delete template",
  "No template",
  "Default test template",
  "Run templates are not ready.",
  "Selected run template is no longer available. The selection was reset.",
  "Couldn't start run",
  "Delete run template \"{{name}}\"?",
  "Loading templates...",
  "Search templates...",
  "No templates.",
  "Edit run template",
  "Duplicate built-in template",
  "Create run template",
  "Update the custom run instructions used by Skills Studio.",
  "Save reusable run instructions for Skills Studio.",
  "Agent",
  "Couldn't cancel run",
  "Run details are still loading.",
  "Couldn't re-run",
  "Couldn't delete run",
  "saved input",
  "ad-hoc paste",
  "Restore as v{{revisionNumber}}",
  "Release",
  "{{name}} · released {{date}}",
  "Default — current (recommended)",
  "Disable {{name}}",
  "Enable {{name}}",
  "Kept in workspace",
  "Applied on next run",
  "Tracked only",
  "{{brand}} cannot manage skills for custom ACP commands yet.",
  "{{brand}} cannot manage OpenClaw skills here. Visit your OpenClaw instance to manage this agent's skills.",
  "{{brand}} cannot manage skills for this adapter yet. Manage them in the adapter directly.",
  "{{brand}} Runner uses native semantic coordination and cannot attach the legacy {{brand}} operational skill.",
  "Beta · {{release}}",
  "Enabled skills are materialized into the stable {{brand}}-managed prompt bundle on the agent's next run.",
  "Local folder",
  "Catalog",
  "git",
  "local",
  "folder",
  "remote",
  "Request failed: {{status}}",
  "Unexpected error",
  "No project selected.",
  "{{n}} skill imported as references from {{project}}.",
  "the project",
  "{{n}} skills imported as references from {{project}}.",
  "Scanning {{project}} for skills…",
  "project",
  "No skills match “{{filter}}”.",
  "All",
  "Organization",
  "Bundled",
  "Optional",
  "External",
  "Most agents",
  "Most stars",
  "Most forks",
  "Recently updated",
  "Alphabetical",
  "My Skills",
  "Projects",
  "Sign in to manage skills.",
  "This skill belongs to another organization.",
  "This skill source is outside an allowed workspace.",
  "This skill source failed validation.",
  "This skill contains unsafe content.",
  "This skill exposes a secret value.",
  "This action isn't available for the current actor.",
  "Sign in and try again.",
  "Open the skill from the organization that owns it.",
  "Import from a configured {{brand}} workspace or the organization managed-skill directory.",
  "Fix the flagged source and retry.",
  "Remove the fetch-and-execute or unsafe pattern before saving.",
  "Remove the secret value before saving.",
  "Retry from an account with access to this action.",
  "This skill lives in <path>{{location}}</path>. Saves write to the project working tree and are not committed.",
  "An existing skill with key <code>{{key}}</code> is installed ({{source}}). Installing will overwrite the catalog content.",
  "An existing skill with key <code>{{key}}</code> is installed ({{source}}). Installing will replace the existing skill.",
  "Placeholders: <list/>.",
  "<b>{{key}}</b> is enabled but missing from the organization library.",
  "None of the well-known skill folders in this project's workspaces contain a <code>SKILL.md</code>. We searched {{folders}} and {{n}} other agent-harness folders.",
  "For skills in non-standard folders, use <button>Import from path or URL</button>.",
  "<b>No files were copied.</b> These skills reference the files in the project workspace — editing them in Skill Studio saves directly back to those files.",
];

const PLACEHOLDER = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;
function placeholders(s: string): string[] {
  return [...s.matchAll(PLACEHOLDER)].map((m) => m[1]).sort();
}

// Хэрэглэгчийн өгөгдөл / нэрийн тэмдэг: файлын нэр SKILL.md, skills.sh хэрэгсэл, «Agent Skills» формат.
// Placeholder болон XoTrans шошгыг ч хасаад үлдсэн текстийг шалгана.
function visibleText(value: string): string {
  return value
    .replace(/\{\{\s*[a-zA-Z0-9_]+\s*\}\}/g, "")
    .replace(/<\/?[a-zA-Z0-9_]+\s*\/?>/g, "")
    .replace(/SKILL\.md|skills\.sh|Agent Skills/g, "");
}

const MN = mn as Record<string, string>;
const EN = en as Record<string, string>;
const KEEP = new Set(keepEn as string[]);

describe("Ү6 7.9 каталогийн түлхүүрүүд", () => {
  it("en ба mn-д бүгд байна, en утга = түлхүүр", () => {
    for (const key of Y6_7_9_KEYS) {
      expect(en, `en: ${key}`).toHaveProperty([key]);
      expect(mn, `mn: ${key}`).toHaveProperty([key]);
      expect(EN[key], key).toBe(key);
    }
  });

  it("mn утга орчуулагдсан", () => {
    for (const key of Y6_7_9_KEYS) {
      if (KEEP.has(key)) continue;
      expect(MN[key], key).not.toBe(EN[key]);
    }
  });

  it("placeholder en/mn ижил", () => {
    for (const key of Y6_7_9_KEYS) {
      const enPh = placeholders(key).filter((p) => p !== "count");
      const mnPh = placeholders(MN[key] ?? "").filter((p) => p !== "count");
      expect(mnPh, key).toEqual(enPh);
    }
  });

  it("mn утгад «Paperclip» литерал байхгүй", () => {
    const offenders = Object.entries(MN)
      .filter(([, value]) => value.includes("Paperclip"))
      .map(([key]) => key);
    expect(offenders).toEqual([]);
  });

  it("нэр томьёо: mn утгад англи «skill», «fork», «studio» үлдээгүй", () => {
    const offenders = Object.entries(MN)
      .filter(([key]) => !KEEP.has(key))
      .filter(([, value]) => /skill|fork|studio/i.test(visibleText(value)))
      .map(([key]) => key);
    expect(offenders).toEqual([]);
  });

  it("нэр томьёо: Чадварын студи, салаалах, гаргалт, табууд", () => {
    expect(MN["Select an organization to open Skill Studio."]).toContain("Чадварын студи");
    expect(MN["Open in Studio"]).toBe("Чадварын студид нээх");
    expect(MN["Fork"]).toBe("Салаалах");
    expect(MN["Forked"]).toBe("Салаалсан");
    expect(MN["Release"]).toBe("Гаргалт");
    expect(MN["Installed"]).toBe("Суулгасан");
    expect(MN["Discover"]).toBe("Олох");
    expect(MN["Author"]).toBe("Бүтээх");
  });

  it("импортлосон: «импортолсон» бичлэг каталогт үлдээгүй", () => {
    const offenders = Object.entries(MN)
      .filter(([, value]) => /импортолсон/i.test(value))
      .map(([key]) => key);
    expect(offenders).toEqual([]);
  });
});
