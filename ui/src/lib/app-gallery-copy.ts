import { i18n } from "@/i18n";
import { tx } from "@/i18n/xo";
import { xoBrandVars } from "@/xo/labels";
/**
 * Prosumer copy for the Apps surface (PAP-10856).
 *
 * The P1a gallery manifest carries developer-flavoured taglines and credential
 * labels (e.g. "Connect Zapier-hosted MCP actions", "Zapier MCP token"). Those
 * strings would fail the vocabulary gate from PAP-10827 — no "MCP", "server",
 * "profile", "policy", "gateway", or "transport" anywhere on this surface. So
 * the UI never renders the raw manifest copy directly: it looks up plain copy
 * here, and `sanitizeProsumerCopy` is a final backstop for any free-text we do
 * surface (app names, fallback taglines).
 */

/** Words that must never appear in prosumer-facing copy on the Apps surface. */
const BANNED_WORDS = [
  "mcp",
  "server",
  "profile",
  "policy",
  "gateway",
  "transport",
  "stdio",
  "endpoint",
];

const BANNED_RE = new RegExp(`\\b(${BANNED_WORDS.join("|")})s?\\b`, "gi");

/**
 * Strip banned vocabulary from a free-text string as a last-resort backstop.
 * Prefer curated copy below; this only protects against manifest text we can't
 * fully control (e.g. a newly added gallery app with no curated entry yet).
 */
export function sanitizeProsumerCopy(text: string): string {
  return text
    .replace(BANNED_RE, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([.,])/g, "$1")
    .trim();
}

export interface AppCopy {
  /** Two short lines for the gallery card (M2). */
  tagline: string;
  /** Single line for the connect step header (M3b). */
  short: string;
}

/**
 * Curated prosumer copy keyed by gallery key. Taken from the M-series wires
 * (https://happy-grove-jzyc.here.now/). Apps without an entry fall back to a
 * generic, gate-safe line.
 */
const APP_COPY: Record<string, () => AppCopy> = {
  zapier: () => ({
    tagline: tx("Reach 9,000+ apps your team already uses."),
    short: tx("Reach 9,000+ apps from your agents."),
  }),
  github: () => ({
    tagline: tx("Read code and pull requests, comment on issues."),
    short: tx("Read code and pull requests, comment on issues."),
  }),
  slack: () => ({
    tagline: tx("Send and read messages in your team's channels."),
    short: tx("Send and read messages in your channels."),
  }),
  notion: () => ({
    tagline: tx("Read and update pages in your workspace."),
    short: tx("Read and update pages in your workspace."),
  }),
  posthog: () => ({
    tagline: tx("Explore product usage, errors, flags, and experiments."),
    short: tx("Sign in with PostHog. Project pinning and access controls are optional."),
  }),
  linear: () => ({
    tagline: tx("Create, update and read tickets."),
    short: tx("Create, update and read tickets."),
  }),
  "google-sheets": () => ({
    tagline: tx("Read and update selected spreadsheets."),
    short: tx("Read spreadsheets or update the files you choose."),
  }),
  gmail: () => ({
    tagline: tx("Read mail and create drafts for your review."),
    short: tx("Read mail and create drafts for your review."),
  }),
  "google-drive": () => ({
    tagline: tx("Find, read, and create files in Drive."),
    short: tx("Find, read, and create files in Drive."),
  }),
  "google-docs": () => ({
    tagline: tx("Read and update documents."),
    short: tx("Read and update documents."),
  }),
  "google-slides": () => ({
    tagline: tx("Read and update presentations."),
    short: tx("Read and update presentations."),
  }),
  "google-calendar": () => ({
    tagline: tx("Review calendars and manage events."),
    short: tx("Review calendars and manage events."),
  }),
  "google-chat": () => ({
    tagline: tx("Read conversations and send messages."),
    short: tx("Read conversations and send messages."),
  }),
  "google-people": () => ({
    tagline: tx("Look up contacts and people in your directory."),
    short: tx("Look up contacts and people in your directory."),
  }),
  "google-workspace-search": () => ({
    tagline: tx("Search across your Google workspace."),
    short: tx("Search across your Google workspace."),
  }),
  hubspot: () => ({
    tagline: tx("Look up contacts and update deal stages."),
    short: tx("Look up contacts and update deal stages."),
  }),
  intercom: () => ({
    tagline: tx("Read and reply to customer conversations."),
    short: tx("Read and reply to customer conversations."),
  }),
  figma: () => ({
    tagline: tx("Read files and post comments on frames."),
    short: tx("Read files and post comments on frames."),
  }),
  stripe: () => ({
    tagline: tx("Read customers, invoices, and payouts."),
    short: tx("Read customers, invoices, and payouts."),
  }),
  context7: () => ({
    tagline: tx("Look up up-to-date docs for your libraries."),
    short: tx("Look up up-to-date docs for your libraries."),
  }),
};

function genericCopy(): AppCopy {
  return {
    tagline: tx("Give your agents access to this app."),
    short: tx("Give your agents access to this app."),
  };
}

/** Curated, gate-safe copy for a gallery app. */
export function appCopyFor(key: string, fallbackTagline?: string | null): AppCopy {
  const curated = APP_COPY[key];
  if (curated) return curated();
  if (fallbackTagline) {
    const cleaned = sanitizeProsumerCopy(fallbackTagline);
    if (cleaned) return { tagline: cleaned, short: cleaned };
  }
  return genericCopy();
}

/**
 * Label for a single credential field on the key-paste step (M3b). The raw
 * manifest label can contain banned vocab ("Zapier MCP token"), so for the
 * common single-field case we present "Your {App} key" per the wires; multi-
 * field apps fall back to a sanitized version of the manifest label.
 */
export function credentialFieldLabel(
  appName: string,
  rawLabel: string,
  fieldCount: number,
): string {
  if (fieldCount <= 1) return tx("Your {{app}} key", { app: appName });
  const cleaned = sanitizeProsumerCopy(rawLabel);
  return cleaned || tx("Your {{app}} key", { app: appName });
}

/**
 * XO: mn горимд app definition-ий (packages/shared/src/app-definitions) англи
 * тайлбарыг орчуулна. en горимд оролтыг өөрчлөлтгүй буцаана. Брэнд нэрийг
 * \S+-ээр барьж {{brand}} болгоно; танигдаагүй текст хэвээр.
 */
export function localizedAppDescription(text: string): string {
  if (!(i18n.resolvedLanguage ?? i18n.language ?? "").startsWith("mn")) return text;
  let m = /^Connect (.+)'s provider-hosted MCP server\.$/.exec(text);
  if (m) return tx("Connect {{name}}'s provider-hosted MCP server.", { name: m[1] });
  m = /^Connect (.+) accounts for your agents\.$/.exec(text);
  if (m) return tx("Connect {{name}} accounts for your agents.", { name: m[1] });
  m = /^Let people start and continue \S+ work with an agent from (.+)\.$/.exec(text);
  if (m) return tx("Let people start and continue {{brand}} work with an agent from {{name}}.", { ...xoBrandVars(), name: m[1] });
  if (/^Message a \S+ agent from Apple Messages using Photon Cloud\. Pro supports DMs; dedicated lines also support groups\.$/.test(text)) {
    return tx("Message a {{brand}} agent from Apple Messages using Photon Cloud. Pro supports DMs; dedicated lines also support groups.", xoBrandVars());
  }
  if (/^Give agents Slack tools or let people start and continue \S+ work from Slack\.$/.test(text)) {
    return tx("Give agents Slack tools or let people start and continue {{brand}} work from Slack.", xoBrandVars());
  }
  if (/^Connect Composio so \S+ can discover and manage the toolkits in your project\.$/.test(text)) {
    return tx("Connect Composio so {{brand}} can discover and manage the toolkits in your project.", xoBrandVars());
  }
  switch (text) {
    case "Use Anthropic APIs with a restricted key.": return tx("Use Anthropic APIs with a restricted key.");
    case "Search, read, create, and copy files in Google Drive.": return tx("Search, read, create, and copy files in Google Drive.");
    case "Search contacts and directory profiles with the Google People API.": return tx("Search contacts and directory profiles with the Google People API.");
    case "Search and read Google Chat conversations and send messages.": return tx("Search and read Google Chat conversations and send messages.");
    case "Search and read Gmail messages and create drafts without enabling mail sending.": return tx("Search and read Gmail messages and create drafts without enabling mail sending.");
    case "Search a store's products and policies, and manage shopping carts.": return tx("Search a store's products and policies, and manage shopping carts.");
    case "Search Gmail, Drive, Calendar, and Chat through one read-only Google Workspace search tool.": return tx("Search Gmail, Drive, Calendar, and Chat through one read-only Google Workspace search tool.");
    case "Read calendars and manage Google Calendar events.": return tx("Read calendars and manage Google Calendar events.");
    case "Read and update pages in your Notion workspace.": return tx("Read and update pages in your Notion workspace.");
    case "Read and update Google Slides presentations.": return tx("Read and update Google Slides presentations.");
    case "Read and update Google Sheets spreadsheets.": return tx("Read and update Google Sheets spreadsheets.");
    case "Read and update Google Docs documents.": return tx("Read and update Google Docs documents.");
    case "Reach thousands of apps through your Zapier account.": return tx("Reach thousands of apps through your Zapier account.");
    case "Look up current documentation for software libraries.": return tx("Look up current documentation for software libraries.");
    case "Investigate errors, releases, and production issues.": return tx("Investigate errors, releases, and production issues.");
    case "Inspect projects, deployments, and runtime logs.": return tx("Inspect projects, deployments, and runtime logs.");
    case "Give agents repository tools or let people work with an agent from GitHub issues and pull requests.": return tx("Give agents repository tools or let people work with an agent from GitHub issues and pull requests.");
    case "Give agents email inboxes and handle each conversation as a task.": return tx("Give agents email inboxes and handle each conversation as a task.");
    case "Create, update, and read Linear issues.": return tx("Create, update, and read Linear issues.");
    case "Connect an API using a key from your provider.": return tx("Connect an API using a key from your provider.");
    case "Connect a provider using your own OAuth client.": return tx("Connect a provider using your own OAuth client.");
    case "Analyze product usage, errors, feature flags, and experiments with PostHog's hosted MCP server.": return tx("Analyze product usage, errors, feature flags, and experiments with PostHog's hosted MCP server.");
    default: return text;
  }
}
