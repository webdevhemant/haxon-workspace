"use client";
import { ArrowRight, Filter } from "lucide-react";
import { Topbar, Breadcrumb, IconBtn } from "@/components/layout/topbar";
import { useAppStore } from "@/store/app-store";
import { DashboardHeader } from "./dashboard-header";
import { AiBriefing } from "./ai-briefing";
import { MyTasks, type MyTask } from "./my-tasks";
import { QuickActions } from "./quick-actions";
import { RecentDocs } from "./recent-docs";
import { StatsSection } from "./stats-section";
import { BoardHealth, type BoardHealthItem } from "./board-health";
import { ActivityPanel } from "./activity-panel";

export default function DashboardView() {
  const { boards, docs, activity, user, activeWorkspaceId, workspaces } = useAppStore();
  const recent = docs.filter((d) => d.workspaceId === activeWorkspaceId).slice(0, 6);
  const ws = workspaces.find((w) => w.id === activeWorkspaceId);

  const myTasks: MyTask[] = boards
    .filter((b) => b.workspaceId === activeWorkspaceId)
    .flatMap((b) =>
      b.columns.flatMap((col) =>
        col.cards
          .filter((c) => c.assigneeId === "u1")
          .map((c) => ({
            ...c,
            boardName: b.name,
            boardEmoji: b.emoji,
            boardId: b.id,
            colName: col.name,
            colColor: col.color,
          }))
      )
    )
    .slice(0, 5);

  const boardHealth: BoardHealthItem[] = boards
    .filter((b) => b.workspaceId === activeWorkspaceId)
    .map((b) => {
      const allCards = b.columns.flatMap((c) => c.cards);
      const doneCards = b.columns.filter((c) => c.name === "Done").flatMap((c) => c.cards);
      const inProgress = b.columns.filter((c) => c.name === "In Progress").flatMap((c) => c.cards);
      return {
        id: b.id,
        name: b.name,
        emoji: b.emoji,
        workspaceId: b.workspaceId,
        total: allCards.length,
        done: doneCards.length,
        inProgress: inProgress.length,
        pct: allCards.length > 0 ? Math.round((doneCards.length / allCards.length) * 100) : 0,
      };
    });

  return (
    <div className="flex flex-col h-full min-h-0">
      <Topbar
        left={<Breadcrumb items={[{ label: ws?.name ?? "" }, { label: "Dashboard" }]} />}
        right={
          <>
            <IconBtn icon={<Filter className="w-3.5 h-3.5" />} tooltip="Filter" />
            <IconBtn icon={<ArrowRight className="w-3.5 h-3.5" />} tooltip="Share" />
          </>
        }
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <DashboardHeader userName={user.name} />
          <AiBriefing />
          <MyTasks tasks={myTasks} workspaceId={activeWorkspaceId} />
          <QuickActions workspaceId={activeWorkspaceId} />
          <RecentDocs docs={recent} />
          <StatsSection />
          <BoardHealth items={boardHealth} workspaceId={activeWorkspaceId} />
        </div>

        <ActivityPanel activity={activity} />
      </div>
    </div>
  );
}
