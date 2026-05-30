"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCan } from "@/lib/use-can";
import MembersSettings from "@/components/settings/members-settings";

export default function MembersPage() {
  const can = useCan("settings.members.view");
  const router = useRouter();
  useEffect(() => {
    if (!can) {
      toast.error("Your role can't access this page");
      router.replace("/dashboard");
    }
  }, [can, router]);
  if (!can) return null;
  return <MembersSettings />;
}
