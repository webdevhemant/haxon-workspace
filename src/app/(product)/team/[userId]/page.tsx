import TeamMemberDetail from "@/components/team/team-member-detail";

export default async function TeamMemberPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  return <TeamMemberDetail userId={userId} />;
}
