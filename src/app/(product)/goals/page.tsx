"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCan } from "@/lib/use-can";
import GoalsView from "@/components/goals/goals-view";

export default function GoalsPage() {
  const can = useCan("goals.view");
  const router = useRouter();
  useEffect(() => {
    if (!can) {
      toast.error("Your role can't access Goals");
      router.replace("/dashboard");
    }
  }, [can, router]);
  if (!can) return null;
  return <GoalsView />;
}
