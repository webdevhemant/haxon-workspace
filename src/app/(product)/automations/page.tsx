"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCan } from "@/lib/use-can";
import AutomationsView from "@/components/automations/automations-view";

export default function AutomationsPage() {
  const can = useCan("automation.view");
  const router = useRouter();
  useEffect(() => {
    if (!can) {
      toast.error("Your role can't access Automations");
      router.replace("/dashboard");
    }
  }, [can, router]);
  if (!can) return null;
  return <AutomationsView />;
}
