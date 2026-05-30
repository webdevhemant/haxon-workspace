"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCan } from "@/lib/use-can";
import IntegrationsView from "@/components/integrations/integrations-view";

export default function IntegrationsPage() {
  const can = useCan("integration.view");
  const router = useRouter();
  useEffect(() => {
    if (!can) {
      toast.error("Your role can't access Integrations");
      router.replace("/dashboard");
    }
  }, [can, router]);
  if (!can) return null;
  return <IntegrationsView />;
}
