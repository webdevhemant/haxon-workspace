"use client";
import { cn } from "@/lib/utils";
import type { User } from "@/types";
import { UserHoverCard } from "./user-hover-card";

type AvatarUser =
  | Pick<User, "initials" | "color" | "name">
  | Pick<User, "id" | "initials" | "color" | "name" | "email" | "role">;

interface Props {
  user?: AvatarUser | null;
  size?: number;
  className?: string;
  hoverCard?: boolean;
}

export function UserAvatar({ user, size = 32, className, hoverCard = true }: Props) {
  if (!user) return null;
  const avatar = (
    <div
      className={cn("inline-flex items-center justify-center rounded-full font-semibold text-white flex-shrink-0 select-none", className)}
      style={{ width: size, height: size, background: user.color, fontSize: size * 0.38 }}
      title={user.name}
    >
      {user.initials}
    </div>
  );
  if (hoverCard && isFullUser(user)) {
    return <UserHoverCard user={user}>{avatar}</UserHoverCard>;
  }
  return avatar;
}

function isFullUser(u: Props["user"]): u is User {
  if (!u) return false;
  return Boolean((u as User).id) && Boolean((u as User).email) && Boolean((u as User).role);
}

export function AvatarGroup({ users, size = 28, max = 4 }: { users: Pick<User, "initials" | "color" | "name">[]; size?: number; max?: number }) {
  const visible = users.slice(0, max);
  const extra = users.length - max;
  return (
    <div className="flex">
      {visible.map((u, i) => (
        <div key={i} style={{ marginLeft: i === 0 ? 0 : -size * 0.3, zIndex: visible.length - i }}>
          <UserAvatar user={u} size={size} className="ring-2 ring-white dark:ring-gray-900" />
        </div>
      ))}
      {extra > 0 && (
        <div
          className="inline-flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold ring-2 ring-white dark:ring-gray-900"
          style={{ width: size, height: size, fontSize: size * 0.32, marginLeft: -size * 0.3 }}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}
