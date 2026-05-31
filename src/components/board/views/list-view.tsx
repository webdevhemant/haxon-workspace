"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronDown, ChevronRight } from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { PriorityBadge } from "@/components/ui/priority-badge";
import { USERS } from "@/data/dummy-users";
import { useCan } from "@/lib/use-can";
import type { Board, Card } from "@/types";
import { PRIORITY_CONFIG, PRIORITY_OPTIONS } from "../constants";
import { CardDetailModal } from "../card-detail-modal";

type ListFlatCard = Card & { colId: string; colName: string; colColor: string };

export function BoardListView({ board }: { board: Board }) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [openCard, setOpenCard] = useState<{ card: Card; colId: string } | null>(null);
  const canEdit = useCan("board.edit");

  const toggleGroup = (key: string) => setCollapsed((c) => ({ ...c, [key]: !c[key] }));

  const allCards: ListFlatCard[] = board.columns.flatMap((col) =>
    col.cards.map((card) => ({ ...card, colId: col.id, colName: col.name, colColor: col.color })),
  );

  const groups = PRIORITY_OPTIONS.map((priority) => ({
    priority,
    config: PRIORITY_CONFIG[priority],
    cards: allCards.filter((c) => (c.priority ?? "None") === priority),
  })).filter((g) => g.cards.length > 0);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="w-full space-y-3">
        {groups.map(({ priority, config, cards }) => {
          const isOpen = collapsed[priority] !== true;
          return (
            <div
              key={priority}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden"
              style={{ borderLeft: `3px solid ${config.color}` }}
            >
              <button
                onClick={() => toggleGroup(priority)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <span className="font-semibold text-sm flex-1 text-left" style={{ color: config.color }}>{config.label}</span>
                <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded">{cards.length}</span>
                {isOpen
                  ? <ChevronDown className="w-4 h-4 text-gray-400" />
                  : <ChevronRight className="w-4 h-4 text-gray-400" />
                }
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.18 }} className="overflow-hidden">
                    <div className="border-t border-gray-100 dark:border-gray-800">
                      {cards.map((card, i) => {
                        const assignee = USERS.find((u) => u.id === card.assigneeId);
                        return (
                          <motion.div
                            key={card.id}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                            onClick={() => setOpenCard({ card, colId: card.colId })}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-pointer border-b border-gray-50 dark:border-gray-800 last:border-0 transition-colors"
                          >
                            <input type="checkbox" disabled={!canEdit} className="rounded border-gray-300 dark:border-gray-600 flex-shrink-0 disabled:cursor-not-allowed disabled:opacity-50" onClick={(e) => e.stopPropagation()} />
                            <span className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{card.title}</span>
                            <span
                              className="text-[10px] font-medium px-1.5 py-0.5 rounded-md hidden sm:inline-block flex-shrink-0"
                              style={{ background: card.colColor + "20", color: card.colColor }}
                            >
                              {card.colName}
                            </span>
                            {card.tags && card.tags.length > 0 && (
                              <div className="hidden md:flex gap-1 flex-shrink-0">
                                {card.tags.slice(0, 2).map((t) => (
                                  <span key={t} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-[10px] text-gray-500 rounded">{t}</span>
                                ))}
                              </div>
                            )}
                            <PriorityBadge priority={card.priority} />
                            {card.dueDate && card.dueDate !== "—" && (
                              <span className="text-[10px] text-gray-400 hidden sm:flex items-center gap-0.5 flex-shrink-0">
                                <Calendar className="w-2.5 h-2.5" /> {card.dueDate}
                              </span>
                            )}
                            {assignee && <UserAvatar user={assignee} size={22} />}
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
        {groups.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">No cards found</div>
        )}
      </div>
      {openCard && (
        <CardDetailModal
          card={openCard.card} colId={openCard.colId} boardId={board.id}
          open onClose={() => setOpenCard(null)}
        />
      )}
    </div>
  );
}
