/** Redacted presentation contracts shared with the production API. */
import type { AiProvider, AiAuthMethod, AiManagedConnectionSummary, AiConnectionBinding } from "@paperclipai/shared";
export type { AiProvider, AiAuthMethod, AiConnectionBinding } from "@paperclipai/shared";
import { tx } from "@/i18n/xo";
export type AiConnectionStatus = AiManagedConnectionSummary["status"];

export const AI_PROVIDERS: Record<
  AiProvider,
  { name: string; subscriptionName?: string; logo?: string }
> = {
  anthropic: {
    name: "Claude",
    subscriptionName: "Claude subscription",
    logo: "/brands/claude-color.svg",
  },
  openai: {
    name: "OpenAI",
    subscriptionName: "ChatGPT subscription",
    logo: "/brands/codex-color.svg",
  },
  openrouter: { name: "OpenRouter", logo: "/brands/apps/openrouter.svg" },
  xai: {
    name: "Grok",
    subscriptionName: "Grok subscription",
    logo: "/brands/adapters/grok.svg",
  },
};

export type AiConnectionSummary = Omit<AiManagedConnectionSummary, "isDefault"> & { isDefault?: boolean };

export interface AiConnectionRequirement {
  companyId: string;
  provider: AiProvider;
  method?: AiAuthMethod;
}

export const AI_CONNECTION_STATUS: Record<AiConnectionStatus, string> = {
  connected: "Connected",
  needs_attention: "Needs attention",
  expired: "Expired",
  revoked: "Revoked",
};

export function aiMethodLabel(provider: AiProvider, method: AiAuthMethod) {
  return method === "subscription"
    ? (AI_PROVIDERS[provider].subscriptionName ?? tx("Subscription unavailable"))
    : tx("API key");
}

export function matchesAiRequirement(
  connection: AiConnectionSummary,
  requirement: AiConnectionRequirement,
) {
  return (
    connection.companyId === requirement.companyId &&
    connection.provider === requirement.provider &&
    (requirement.method === undefined || connection.method === requirement.method)
  );
}

export function personalAiDefault(
  connections: AiConnectionSummary[],
  requirement: AiConnectionRequirement,
  userId: string,
) {
  // Never choose another account because the declared default is unhealthy.
  return connections.find(
    (connection) =>
      matchesAiRequirement(connection, { ...requirement, method: undefined }) &&
      connection.ownership === "personal" &&
      connection.ownerUserId === userId &&
      connection.isDefault,
  );
}

function aiConnectionStatusLabel(status: AiConnectionStatus): string {
  switch (status) {
    case "connected":
      return tx("Connected");
    case "needs_attention":
      return tx("Needs attention");
    case "expired":
      return tx("Expired");
    case "revoked":
      return tx("Revoked");
  }
}

export function aiConnectionProblem(connection?: AiConnectionSummary) {
  if (!connection)
    return tx("No connection selected. Connect an account to continue.");
  return (
    connection.unavailableReason ??
    (connection.status === "connected"
      ? null
      : tx("{{status}}. Reconnect this account to continue.", { status: aiConnectionStatusLabel(connection.status) }))
  );
}

export function bindingProblem(
  binding: AiConnectionBinding,
  requirement: AiConnectionRequirement,
  connections: AiConnectionSummary[],
  userId: string,
  _agentId: string,
) {
  if (
    binding.provider !== requirement.provider ||
    (binding.mode !== "responsible_user" && requirement.method !== undefined && binding.method !== requirement.method)
  )
    return tx("Choose a connection compatible with this provider and sign-in method.");
  if (binding.mode === "responsible_user")
    return aiConnectionProblem(
      personalAiDefault(connections, requirement, userId),
    );
  const connection = connections.find(
    (item) =>
      item.id === binding.connectionId &&
      item.grantId === binding.grantId &&
      item.method === binding.method &&
      matchesAiRequirement(item, requirement),
  );
  if (!connection)
    return tx("This connection is no longer available for this agent. Choose another connection.");
  if (binding.mode === "shared" && connection.ownership !== "shared")
    return tx("Choose a company-shared connection.");
  if (
    binding.mode === "delegated" &&
    (connection.ownership !== "personal" ||
      connection.ownerUserId !== userId)
  )
    return tx("This credential is not shared with you. Choose a connection you can use.");
  return aiConnectionProblem(connection);
}
