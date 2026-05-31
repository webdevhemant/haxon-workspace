"use client";
import { useRequireCapability } from "@/lib/use-require-capability";
import AutomationsView from "@/components/automations/automations-view";

export default function AutomationsPage() {
  const allowed = useRequireCapability("automation.view", {
    message: "Your role can't access Automations",
  });
  if (!allowed) return null;
  return <AutomationsView />;
}
