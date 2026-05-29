"use client";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { USERS } from "@/data/dummy-users";
import type { ActivityItem } from "@/types";

export function ActivityRow({ item, idx }: { item: ActivityItem; idx: number }) {
  const user = USERS.find((u) => u.id === item.userId);
  const isRecent = idx < 2;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: idx * 0.03 }}
      className={`flex items-start gap-2.5 py-2.5 ${
        idx < 7 ? "border-b border-gray-100 dark:border-gray-800" : ""
      }`}
    >
      <div className="relative flex-shrink-0">
        <UserAvatar user={user} size={30} />
        <span
          className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-center justify-center${
            isRecent ? " animate-pulse" : ""
          }`}
        >
          <Star className={`w-2.5 h-2.5 ${isRecent ? "text-orange-400" : "text-gray-400"}`} />
        </span>
      </div>
      <div className="flex-1 min-w-0 text-xs leading-relaxed">
        <div className="text-gray-600 dark:text-gray-400">
          <strong className="text-gray-900 dark:text-white">{user?.name}</strong> {item.verb}{" "}
          <strong className="text-gray-900 dark:text-white">{item.target}</strong>
          {item.in && <span className="text-gray-400"> in {item.in}</span>}
        </div>
        <div className="text-gray-400 mt-0.5">{item.at}</div>
      </div>
    </motion.div>
  );
}
