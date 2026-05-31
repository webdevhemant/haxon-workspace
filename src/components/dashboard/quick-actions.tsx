"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FileText, Kanban, Grid3X3, Users } from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useAppStore } from "@/store/app-store";
import { useCan } from "@/lib/use-can";

export function QuickActions({ workspaceId }: { workspaceId: string }) {
  const router = useRouter();
  const openModal = useAppStore((s) => s.openModal);
  const canInvite = useCan("members.invite");

  const actions = [
    {
      icon: <FileText className="w-4 h-4" />,
      label: "New Doc",
      desc: "Blank canvas",
      color: "#3B82F6",
      onClick: () => router.push(`/workspace/${workspaceId}/doc/d1`),
    },
    {
      icon: <Kanban className="w-4 h-4" />,
      label: "New Board",
      desc: "Kanban project",
      color: "#F97316",
      onClick: () => router.push(`/workspace/${workspaceId}/board/b1`),
    },
    {
      icon: <Grid3X3 className="w-4 h-4" />,
      label: "New Grid",
      desc: "Structured tracker",
      color: "#10B981",
      onClick: () => router.push(`/workspace/${workspaceId}/grid/sprint`),
    },
    ...(canInvite
      ? [
          {
            icon: <Users className="w-4 h-4" />,
            label: "Invite Member",
            desc: "Add to workspace",
            color: "#8B5CF6",
            onClick: () => openModal({ type: "invite" }),
          },
        ]
      : []),
  ];

  return (
    <div className={`grid gap-2.5 mb-5 ${actions.length === 4 ? "grid-cols-4" : "grid-cols-3"}`}>
      {actions.map((q) => (
        <Tooltip.Provider key={q.label} delayDuration={300}>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={q.onClick}
                className="flex items-center gap-3 p-3 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md text-left hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-sm transition-all group"
              >
                <span
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                  style={{ background: q.color + "15", color: q.color }}
                >
                  {q.icon}
                </span>
                <div>
                  <div className="text-sm font-semibold">{q.label}</div>
                  <div className="text-xs text-gray-400">{q.desc}</div>
                </div>
              </motion.button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                className="bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg z-50"
                side="bottom"
                sideOffset={4}
              >
                {q.desc}
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      ))}
    </div>
  );
}
