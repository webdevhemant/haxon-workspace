"use client";
import { useState } from "react";
import { Calendar } from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { PriorityBadge } from "@/components/ui/priority-badge";
import { USERS } from "@/data/dummy-users";
import type { Board } from "@/types";
import { CardDetailModal } from "../card-detail-modal";
import { flattenBoard, type FlatCard } from "../shared";

export function BoardWorkloadView({ board }: { board: Board }) {
  const rows = flattenBoard(board);
  const byAssignee: Record<string, FlatCard[]> = {};
  rows.forEach((r) => {
    if (!byAssignee[r.assigneeId]) byAssignee[r.assigneeId] = [];
    byAssignee[r.assigneeId].push(r);
  });
  const [openCard, setOpenCard] = useState<FlatCard | null>(null);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="w-full space-y-4">
        {Object.entries(byAssignee).map(([userId, cards]) => {
          const user = USERS.find((u) => u.id === userId);
          return (
            <div key={userId} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                <UserAvatar user={user} size={28} />
                <span className="font-semibold text-sm">{user?.name ?? "Unassigned"}</span>
                <span className="text-xs text-gray-400">{cards.length} items</span>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-gray-800">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => setOpenCard(card)}
                    className="flex items-center gap-4 px-5 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-pointer transition-colors"
                  >
                    <span className="flex-1 text-sm font-medium truncate">{card.title}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded-md font-medium" style={{ background: card.colColor + "20", color: card.colColor }}>
                      {card.colName}
                    </span>
                    <PriorityBadge priority={card.priority} />
                    {card.dueDate && card.dueDate !== "—" && (
                      <span className="text-[10px] text-gray-400 flex items-center gap-0.5 flex-shrink-0">
                        <Calendar className="w-2.5 h-2.5" /> {card.dueDate}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {openCard && (
        <CardDetailModal card={openCard} colId={openCard.colId} boardId={board.id} open onClose={() => setOpenCard(null)} />
      )}
    </div>
  );
}
