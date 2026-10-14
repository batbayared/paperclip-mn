import { useEffect } from "react";
import { tx } from "@/i18n/xo";
import { useBreadcrumbs } from "../context/BreadcrumbContext";
import { NewAgentSetup } from "../components/new-agent/NewAgentSetup";

export function NewAgent() {
  const { setBreadcrumbs } = useBreadcrumbs();
  useEffect(() => {
    setBreadcrumbs([
      { label: tx("Agents"), href: "/agents" },
      { label: tx("New agent") },
    ]);
  }, [setBreadcrumbs]);
  return <NewAgentSetup />;
}
