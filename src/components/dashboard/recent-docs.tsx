"use client";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import type { Doc } from "@/types";
import { DocCard } from "./doc-card";

export function RecentDocs({ docs }: { docs: Doc[] }) {
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <div className="font-bold text-base tracking-tight">Recent</div>
        <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1">
          View all <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2.5 mb-6">
        {docs.map((d, i) => (
          <DocCard
            key={d.id}
            doc={d}
            idx={i}
            onClick={() => router.push(`/workspace/${d.workspaceId}/doc/${d.id}`)}
          />
        ))}
      </div>
    </>
  );
}
