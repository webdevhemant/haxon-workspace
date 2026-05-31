"use client";
import { use } from "react";
import { useRequireCapability } from "@/lib/use-require-capability";
import TeamMemberDetail from "@/components/team/team-member-detail";

export default function TeamMemberPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params);
  const allowed = useRequireCapability("team.view");
  if (!allowed) return null;
  return <TeamMemberDetail userId={userId} />;
}
