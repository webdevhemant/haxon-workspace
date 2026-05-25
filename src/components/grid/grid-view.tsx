"use client";
import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/app-store";

export default function GridView({ params }: { params: Promise<{ workspaceId: string; gridId: string }> }) {
  const { workspaceId } = use(params);
  const router = useRouter();
  const { boards, activeWorkspaceId } = useAppStore();

  useEffect(() => {
    const wsBoards = boards.filter((b) => b.workspaceId === (workspaceId || activeWorkspaceId));
    const target = wsBoards[0];
    if (target) {
      useAppStore.getState().setBoardView(target.id, "grid");
      router.replace(`/workspace/${target.workspaceId}/board/${target.id}`);
    } else {
      router.replace("/dashboard");
    }
  }, [boards, workspaceId, activeWorkspaceId, router]);

  return (
    <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
      Redirecting…
    </div>
  );
}
