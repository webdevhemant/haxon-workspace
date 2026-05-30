"use client";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Filter, Check } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Topbar, Breadcrumb, IconBtn } from "@/components/layout/topbar";
import { useAppStore } from "@/store/app-store";
import { useCurrentRole } from "@/lib/use-can";
import { DashboardHeader } from "./dashboard-header";
import { AiBriefing } from "./ai-briefing";
import { MyTasks, type MyTask } from "./my-tasks";
import { QuickActions } from "./quick-actions";
import { RecentDocs } from "./recent-docs";
import { StatsSection } from "./stats-section";
import { BoardHealth, type BoardHealthItem } from "./board-health";
import { ActivityPanel } from "./activity-panel";

type DashboardFilter = "all" | "mine" | "recent";

const DASHBOARD_FILTERS: { key: DashboardFilter; label: string; desc: string }[] = [
  { key: "all", label: "All", desc: "Show everything in this workspace" },
  { key: "mine", label: "Assigned to me", desc: "Only tasks and docs you own" },
  { key: "recent", label: "Recent 7 days", desc: "Activity from the last week" },
];

export default function DashboardView() {
  const { boards, docs, activity, user, activeWorkspaceId, workspaces } = useAppStore();
  const [filter, setFilter] = useState<DashboardFilter>("all");
  const role = useCurrentRole();
  const isGuest = role === "Guest";
  const ws = workspaces.find((w) => w.id === activeWorkspaceId);
  const recent = docs.filter((d) => d.workspaceId === activeWorkspaceId).slice(0, 6);

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
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  title="Filter dashboard"
                  className="flex items-center gap-1 h-7 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 text-xs font-medium transition-colors"
                >
                  <Filter className="w-3.5 h-3.5" />
                  {filter !== "all" && (
                    <span className="text-[10px] font-semibold text-orange-500">
                      {DASHBOARD_FILTERS.find((f) => f.key === filter)?.label}
                    </span>
                  )}
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="end"
                  sideOffset={6}
                  className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-1 w-56 z-50"
                >
                  {DASHBOARD_FILTERS.map((f) => (
                    <DropdownMenu.Item
                      key={f.key}
                      onSelect={() => setFilter(f.key)}
                      className="flex items-start gap-2 px-2 py-1.5 rounded cursor-pointer outline-none text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <span className="w-3.5 flex items-center pt-0.5">
                        {filter === f.key && <Check className="w-3 h-3 text-orange-500" />}
                      </span>
                      <span className="flex-1">
                        <span className="block text-[12.5px] font-medium">{f.label}</span>
                        <span className="block text-[10.5px] text-gray-400">{f.desc}</span>
                      </span>
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
            <IconBtn
              icon={<ArrowRight className="w-3.5 h-3.5" />}
              tooltip="Share"
              onClick={() => toast.success("Dashboard link copied")}
            />
          </>
        }
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <DashboardHeader userName={user.name} />
          <AiBriefing />
          <MyTasks tasks={myTasks} workspaceId={activeWorkspaceId} />
          {!isGuest && (
            <>
              <QuickActions workspaceId={activeWorkspaceId} />
              <RecentDocs docs={recent} />
              <StatsSection />
              <BoardHealth items={boardHealth} workspaceId={activeWorkspaceId} />
            </>
          )}
        </div>

        {!isGuest && <ActivityPanel activity={activity} />}
      </div>
    </div>
  );
}
