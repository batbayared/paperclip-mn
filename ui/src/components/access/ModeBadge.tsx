import type { DeploymentExposure, DeploymentMode } from "@paperclipai/shared";
import { Badge } from "@/components/ui/badge";
import { tx } from "@/i18n/xo";

export function ModeBadge({
  deploymentMode,
  deploymentExposure,
}: {
  deploymentMode?: DeploymentMode;
  deploymentExposure?: DeploymentExposure;
}) {
  if (!deploymentMode) return null;

  const exposure = deploymentExposure ?? "private";
  const label =
    deploymentMode === "local_trusted"
      ? tx("Local trusted")
      : exposure === "private"
        ? tx("Authenticated private")
        : exposure === "public"
          ? tx("Authenticated public")
          : tx("Authenticated {{exposure}}", { exposure });

  return <Badge variant="outline">{label}</Badge>;
}
