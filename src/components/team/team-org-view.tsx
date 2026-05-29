"use client";
import { TEAM_PROFILES } from "@/data/dummy-team";
import { USERS } from "@/data/dummy-users";
import type { TeamMemberProfile, User } from "@/types";
import { TeamMemberCard } from "./team-member-card";

interface Props {
  filteredUserIds: Set<string>;
  onOpen: (user: User) => void;
  onMessage: (user: User) => void;
}

export function TeamOrgView({ filteredUserIds, onOpen, onMessage }: Props) {
  const groups = TEAM_PROFILES.reduce<Record<string, TeamMemberProfile[]>>((acc, p) => {
    if (!filteredUserIds.has(p.userId)) return acc;
    if (!acc[p.team]) acc[p.team] = [];
    acc[p.team].push(p);
    return acc;
  }, {});

  const order = ["Leadership", "Product", "Engineering", "Design", "Marketing"];
  const sortedGroups = Object.keys(groups).sort(
    (a, b) => order.indexOf(a) - order.indexOf(b),
  );

  if (sortedGroups.length === 0) {
    return <div className="px-6 py-10 text-center text-sm text-gray-400">No people match.</div>;
  }

  return (
    <div className="px-6 py-5 space-y-8">
      {sortedGroups.map((team) => {
        const profiles = groups[team];
        return (
          <section key={team}>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-[13px] font-semibold text-gray-900 dark:text-white tracking-tight">
                {team}
              </h3>
              <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-full px-1.5 py-0.5 tabular-nums">
                {profiles.length}
              </span>
            </div>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
              {profiles.map((p) => {
                const user = USERS.find((u) => u.id === p.userId);
                if (!user) return null;
                return (
                  <TeamMemberCard
                    key={user.id}
                    user={user}
                    profile={p}
                    onOpen={() => onOpen(user)}
                    onMessage={() => onMessage(user)}
                  />
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
