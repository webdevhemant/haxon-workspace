"use client";
import { useRequireCapability } from "@/lib/use-require-capability";
import TeamView from "@/components/team/team-view";

export default function TeamPage() {
  const allowed = useRequireCapability("team.view");
  if (!allowed) return null;
  return <TeamView />;
}
