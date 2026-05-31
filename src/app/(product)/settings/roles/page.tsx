"use client";
import { useRequireCapability } from "@/lib/use-require-capability";
import RolesSettings from "@/components/settings/roles-settings";

export default function RolesPage() {
  const allowed = useRequireCapability("settings.roles.view");
  if (!allowed) return null;
  return <RolesSettings />;
}
