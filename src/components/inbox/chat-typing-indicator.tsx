"use client";
import { motion } from "framer-motion";
import { UserAvatar } from "@/components/ui/user-avatar";
import { USERS } from "@/data/dummy-users";

export function ChatTypingIndicator({ userIds }: { userIds: string[] }) {
  if (userIds.length === 0) return null;
  const users = userIds
    .map((id) => USERS.find((u) => u.id === id))
    .filter((u): u is NonNullable<typeof u> => Boolean(u));

  const label =
    users.length === 1
      ? `${users[0].name.split(" ")[0]} is typing`
      : users.length === 2
        ? `${users[0].name.split(" ")[0]} and ${users[1].name.split(" ")[0]} are typing`
        : `${users.length} people are typing`;

  return (
    <div className="flex items-center gap-2 px-4 py-1.5 text-[11.5px] text-gray-500 dark:text-gray-400">
      {users.slice(0, 2).map((u) => (
        <UserAvatar key={u.id} user={u} size={16} />
      ))}
      <span>{label}</span>
      <span className="flex items-center gap-0.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="inline-block w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </span>
    </div>
  );
}
