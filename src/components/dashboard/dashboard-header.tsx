"use client";
import { motion } from "framer-motion";
import { greet, formatDate } from "@/lib/utils";

export function DashboardHeader({ userName }: { userName: string }) {
  return (
    <div className="mb-4">
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-xs text-gray-400 font-medium mb-1.5 uppercase tracking-wide"
      >
        {formatDate()}
      </motion.div>
      <h1 className="text-2xl font-bold tracking-tight">
        {greet()}, {userName.split(" ")[0]}.
      </h1>
      <p className="text-gray-500 mt-1.5 text-sm">
        You have <strong className="text-gray-900 dark:text-white">3 docs</strong> waiting for review and{" "}
        <strong className="text-gray-900 dark:text-white">2 cards</strong> due this week.
      </p>
    </div>
  );
}
