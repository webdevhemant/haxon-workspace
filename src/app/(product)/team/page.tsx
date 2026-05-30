"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCan } from "@/lib/use-can";
import TeamView from "@/components/team/team-view";

export default function TeamPage() {
  const can = useCan("team.view");
  const router = useRouter();
  useEffect(() => {
    if (!can) {
      toast.error("Your role can't access this page");
      router.replace("/dashboard");
    }
  }, [can, router]);
  if (!can) return null;
  return <TeamView />;
}
