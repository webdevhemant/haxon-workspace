"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCan } from "./use-can";
import type { Capability } from "./rbac";

interface Options {
  redirectTo?: string;
  message?: string;
}

export function useRequireCapability(
  capability: Capability,
  { redirectTo = "/dashboard", message = "Your role can't access this page" }: Options = {}
): boolean {
  const allowed = useCan(capability);
  const router = useRouter();

  useEffect(() => {
    if (!allowed) {
      toast.error(message);
      router.replace(redirectTo);
    }
  }, [allowed, router, redirectTo, message]);

  return allowed;
}
