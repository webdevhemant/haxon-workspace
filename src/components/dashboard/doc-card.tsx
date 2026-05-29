"use client";
import { motion } from "framer-motion";
import { UserAvatar } from "@/components/ui/user-avatar";
import { USERS } from "@/data/dummy-users";
import type { Doc } from "@/types";

export function DocCard({
  doc,
  onClick,
  idx,
}: {
  doc: Doc;
  onClick: () => void;
  idx: number;
}) {
  const user = USERS.find((u) => u.id === doc.lastEditedBy);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05, duration: 0.4 }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      onClick={onClick}
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3.5 cursor-pointer hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-md hover:shadow-black/5 transition-all"
    >
      <div className="flex items-start gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-base flex-shrink-0">
          {doc.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm truncate">{doc.title}</div>
          <div className="text-xs text-gray-400 truncate">
            {doc.folder} · {doc.type === "wiki" ? "Wiki" : "Doc"}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          {user && <UserAvatar user={user} size={16} />}
          <span>{doc.lastEditedAt}</span>
        </div>
      </div>
    </motion.div>
  );
}
