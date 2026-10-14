import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { XO_TRANSFORM_FILES } from "./tiers";
import { transformSource } from "./transform";

function read(rel: string): string {
  return readFileSync(fileURLToPath(new URL(`../../${rel}`, import.meta.url)), "utf8");
}

const CASES: Array<{ file: string; keys: string[] }> = [
  { file: "ui/src/pages/apps/chat/ChatEndpointSetup.tsx", keys: ["Connection setup progress", "Choose agent"] },
  { file: "ui/src/pages/apps/chat/ChatEndpointDetail.tsx", keys: ["Settings", "Access"] },
  { file: "ui/src/pages/apps/chat/EmailEndpointSetup.tsx", keys: ["Access", "API key"] },
  { file: "ui/src/pages/apps/chat/PhotonConnectStep.tsx", keys: ["Connect iMessage Photon", "Photon dashboard"] },
  { file: "ui/src/pages/apps/chat/ChatIdentityConfirm.tsx", keys: ["This identity link is unavailable", "Checking identity link…"] },
  { file: "ui/src/pages/apps/connection-owner.tsx", keys: ["Board", "Board member"] },
  { file: "ui/src/pages/apps/app-detail/ActivityPanel.tsx", keys: ["Recent activity", "No activity yet."] },
  { file: "ui/src/pages/apps/app-detail/AdvancedPanel.tsx", keys: ["Reconnect", "Replace the stored credential."] },
  { file: "ui/src/pages/apps/app-detail/IdentitiesSection.tsx", keys: ["GitHub identity", "Dedicated GitHub account"] },
  { file: "ui/src/pages/apps/app-detail/PermissionsPanel.tsx", keys: ["Which agents can use this connection?", "Saving…"] },
  { file: "ui/src/pages/apps/app-detail/ReviewPanel.tsx", keys: ["Review", "Waiting for your OK"] },
  { file: "ui/src/pages/apps/app-detail/ServicesPanel.tsx", keys: ["Couldn't connect {{name}}", "Finish connecting {{name}} in Composio"] },
  { file: "ui/src/pages/apps/app-detail/SetupPanel.tsx", keys: ["Agents", "Actions"] },
  { file: "ui/src/pages/apps/app-detail/TestPanel.tsx", keys: ["Test {{title}}", "Loading agents…"] },
  { file: "ui/src/pages/apps/app-detail/action-permission-summary.ts", keys: ["Allowed for {{n}} action", "Allowed for {{n}}"] },
  { file: "ui/src/pages/apps/AppDetail.tsx", keys: ["App", "{{appName}} connected"] },
  { file: "ui/src/pages/apps/AppNotConnected.tsx", keys: ["App", "Connectors"] },
  { file: "ui/src/pages/apps/AppsReview.tsx", keys: ["Connectors", "Review"] },
  { file: "ui/src/pages/apps/ComposioProvenanceChip.tsx", keys: ["via Vercel Connect", "Credentials managed by Vercel Connect"] },
  { file: "ui/src/pages/apps/Connections.tsx", keys: ["Not connected", "Paused"] },
  { file: "ui/src/pages/apps/PaperclipCloudOAuthHandoff.tsx", keys: ["Sign-in couldn’t continue", "Preparing secure sign-in"] },
  { file: "ui/src/pages/apps/ReviewQueueCard.tsx", keys: ["Waiting for your OK", "Allowed once"] },
  { file: "ui/src/pages/apps/UnverifiedServerBadge.tsx", keys: ["Unverified server"] },
  { file: "ui/src/pages/apps/gateways/CopyableGatewayUrl.tsx", keys: ["Gateway URL copied", "Copy failed"] },
  { file: "ui/src/pages/apps/gateways/GatewaysList.tsx", keys: ["Connectors", "Gateways"] },
  { file: "ui/src/pages/apps/gateways/EditGatewayDialog.tsx", keys: ["Gateway updated", "Gateway was not updated"] },
  { file: "ui/src/pages/apps/gateways/NewGatewayDialog.tsx", keys: ["Gateway created", "Gateway was not created"] },
  { file: "ui/src/pages/apps/gateways/GatewayDetail.tsx", keys: ["Connectors", "Gateways"] },
  { file: "ui/src/pages/apps/gateways/ConnectClientDialog.tsx", keys: ["Available this session", "Token issued"] },
  { file: "ui/src/pages/apps/gateways/panels/GatewayAdvancedPanel.tsx", keys: ["Gateway archived", "{{name}} is no longer reachable."] },
  { file: "ui/src/pages/apps/gateways/panels/OverviewPanel.tsx", keys: ["Copied", "Copy failed"] },
  { file: "ui/src/pages/apps/gateways/panels/AppsToolsPanel.tsx", keys: ["App", "Tools"] },
  { file: "ui/src/pages/apps/gateways/panels/TokensPanel.tsx", keys: ["Active", "Expiring"] },
  { file: "ui/src/pages/apps/gateways/panels/GatewayActivityPanel.tsx", keys: ["Allowed", "Blocked"] },
  { file: "ui/src/components/ai-connections/AiConnectionIdentity.tsx", keys: ["Company shared", "Personal · {{name}}"] },
  { file: "ui/src/components/ai-connections/AiConnectionManagement.tsx", keys: ["Choose a managed connection"] },
  { file: "ui/src/components/ai-connections/AiConnectionPicker.tsx", keys: ["AI connection", "Loading AI connections"] },
  { file: "ui/src/components/ai-connections/AiConnectionAuth.tsx", keys: ["Connect {{name}}", "Use connection"] },
  { file: "ui/src/components/ai-connections/ManagedAiConnectionDetails.tsx", keys: ["Personal", "Company shared"] },
  { file: "ui/src/components/ai-connections/AiConnectionCredentialStep.tsx", keys: ["Connection name", "Sign-in environment"] },
  { file: "ui/src/components/ai-connections/AiConnectionAccountControls.tsx", keys: ["AI account settings", "Personal default"] },
  { file: "ui/src/components/ai-connections/AiConnectionField.tsx", keys: ["Adopt Connections for {{agentName}}", "Not connected"] },
  { file: "ui/src/components/chat/AgentChannelsPanel.tsx", keys: ["Channels", "Connect a channel"] },
  { file: "ui/src/components/chat/ExternallyConnectedTaskBanner.tsx", keys: ["Waiting for file consent", "Sent to channel"] },
  { file: "ui/src/features/connections/ConnectionIntentInteractionBody.tsx", keys: ["{{serviceName}} connected", "This agent can now use the connection."] },
  { file: "ui/src/pages/tools/AdvancedToolsRoute.tsx", keys: ["Loading…", "Advanced setup is for administrators"] },
  { file: "ui/src/pages/tools/GatewaysTab.tsx", keys: ["{{n}} tool allowed", "{{n}} tools allowed"] },
  { file: "ui/src/pages/tools/McpConfigHelpDialog.tsx", keys: ["Get help creating an MCP config", "Ask an agent for an MCP config"] },
  { file: "ui/src/pages/tools/PasteConfigTab.tsx", keys: ["Key", "Runs in your workspace"] },
  { file: "ui/src/pages/tools/ProfilesTab.tsx", keys: ["Tool name", "Risk level"] },
  { file: "ui/src/pages/tools/SmokeLabTab.tsx", keys: ["not run", "Remote HTTP · OAuth"] },
  { file: "ui/src/pages/tools/ToolsAccess.tsx", keys: ["Paste a config", "Gateways"] },
  { file: "ui/src/pages/tools/connection-dialogs.tsx", keys: ["Tool catalog — {{name}}", "Could not create connection"] },
  { file: "ui/src/pages/tools/shared.tsx", keys: ["unknown", "low"] },
  { file: "ui/src/pages/tools/profiles/ProfileActionDialog.tsx", keys: ["Archive profile", "Archive"] },
  { file: "ui/src/pages/tools/profiles/ProfileDetail.tsx", keys: ["Profile updated", "Could not update profile"] },
  { file: "ui/src/pages/tools/profiles/ProfileDetailRoute.tsx", keys: ["Company", "Apps"] },
  { file: "ui/src/pages/tools/profiles/ProfileWizard.tsx", keys: ["Name", "Choose tools"] },
  { file: "ui/src/pages/tools/profiles/ProfileWizardRoute.tsx", keys: ["Organization", "Apps"] },
  { file: "ui/src/pages/tools/profiles/ProfilesIndex.tsx", keys: ["{{name}} (copy)", "Profile duplicated"] },
  { file: "ui/src/pages/tools/profiles/ToolsAdminGate.tsx", keys: ["Loading…", "Access profiles are for administrators"] },
  { file: "ui/src/pages/tools/profiles/WizardToolsStep.tsx", keys: ["Loading tools…", "App connections are coming soon"] },
];

describe("Ү6 7.14 T1 файлууд (апп, чатын холболт, гарц, AI холболт, хэрэгсэл, профайл)", () => {
  it.each(CASES)("$file T1-д байна, мөрүүдийг барина, гараар үлдэгдэлгүй", ({ file, keys }) => {
    expect(XO_TRANSFORM_FILES).toContain(file);
    const result = transformSource(read(file), file);
    const extracted = result.strings.map((s) => s.key);
    for (const key of keys) expect(extracted).toContain(key);
    expect(result.manual).toEqual([]);
  });
});
