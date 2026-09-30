import { tx } from "@/i18n/xo";
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
