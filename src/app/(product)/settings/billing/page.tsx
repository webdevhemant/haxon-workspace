"use client";
import { useRequireCapability } from "@/lib/use-require-capability";
import BillingSettings from "@/components/settings/billing-settings";

export default function BillingPage() {
  const allowed = useRequireCapability("billing.manage", {
    redirectTo: "/settings",
    message: "Only the Owner can manage billing",
  });
  if (!allowed) return null;
  return <BillingSettings />;
}
