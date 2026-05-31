"use client";
import { useRequireCapability } from "@/lib/use-require-capability";
import IntegrationsView from "@/components/integrations/integrations-view";

export default function IntegrationsPage() {
  const allowed = useRequireCapability("integration.view", {
    message: "Your role can't access Integrations",
  });
  if (!allowed) return null;
  return <IntegrationsView />;
}
