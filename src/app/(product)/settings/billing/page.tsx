"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCan } from "@/lib/use-can";
import BillingSettings from "@/components/settings/billing-settings";

export default function BillingPage() {
  const can = useCan("billing.manage");
  const router = useRouter();
  useEffect(() => {
    if (!can) {
      toast.error("Only the Owner can manage billing");
      router.replace("/settings");
    }
  }, [can, router]);
  if (!can) return null;
  return <BillingSettings />;
}
