"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCan } from "@/lib/use-can";
import RolesSettings from "@/components/settings/roles-settings";

export default function RolesPage() {
  const can = useCan("settings.roles.view");
  const router = useRouter();
  useEffect(() => {
    if (!can) {
      toast.error("Your role can't access this page");
      router.replace("/dashboard");
    }
  }, [can, router]);
  if (!can) return null;
  return <RolesSettings />;
}
