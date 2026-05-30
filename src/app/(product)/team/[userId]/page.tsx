"use client";
import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCan } from "@/lib/use-can";
import TeamMemberDetail from "@/components/team/team-member-detail";

export default function TeamMemberPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params);
  const can = useCan("team.view");
  const router = useRouter();
  useEffect(() => {
    if (!can) {
      toast.error("Your role can't access this page");
      router.replace("/dashboard");
    }
  }, [can, router]);
  if (!can) return null;
  return <TeamMemberDetail userId={userId} />;
}
