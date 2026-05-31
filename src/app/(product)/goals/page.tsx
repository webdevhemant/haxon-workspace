"use client";
import { useRequireCapability } from "@/lib/use-require-capability";
import GoalsView from "@/components/goals/goals-view";

export default function GoalsPage() {
  const allowed = useRequireCapability("goals.view", {
    message: "Your role can't access Goals",
  });
  if (!allowed) return null;
  return <GoalsView />;
}
