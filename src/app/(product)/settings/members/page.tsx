"use client";
import { useRequireCapability } from "@/lib/use-require-capability";
import MembersSettings from "@/components/settings/members-settings";

export default function MembersPage() {
  const allowed = useRequireCapability("settings.members.view");
  if (!allowed) return null;
  return <MembersSettings />;
}
