"use client";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Topbar, Breadcrumb } from "@/components/layout/topbar";
import { useAppStore } from "@/store/app-store";
import { USERS } from "@/data/dummy-users";
import { profileFor } from "@/data/dummy-team";
import { presenceFor } from "@/data/dummy-presence";
import type { User } from "@/types";
import { TeamHeader } from "./team-header";
import { TeamToolbar } from "./team-toolbar";
import { TeamMemberCard } from "./team-member-card";
import { TeamMemberRow, TeamMemberRowHeader } from "./team-member-row";
import { TeamOrgView } from "./team-org-view";
import { TeamOpenRoles } from "./team-open-roles";
import { TeamDetailDrawer } from "./team-detail-drawer";
import type { TeamRoleFilter, TeamPresenceFilter, TeamSort, TeamView } from "./constants";

const JOIN_ORDER: Record<string, number> = { u1: 0, u2: 1, u3: 2, u4: 3, u5: 4, u6: 5 };

export default function TeamView() {
  const { workspaces, activeWorkspaceId } = useAppStore();
  const ws = workspaces.find((w) => w.id === activeWorkspaceId);

  const [view, setView] = useState<TeamView>("grid");
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<TeamRoleFilter>("all");
  const [presence, setPresence] = useState<TeamPresenceFilter>("all");
  const [sort, setSort] = useState<TeamSort>("name");
  const [openUser, setOpenUser] = useState<User | null>(null);

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return USERS.filter((u) => {
      if (role !== "all" && u.role !== role) return false;
      if (presence !== "all" && presenceFor(u.id) !== presence) return false;
      if (q) {
        const p = profileFor(u.id);
        const haystack = [
          u.name, u.email, u.role,
          p?.title ?? "", p?.team ?? "", p?.location ?? "",
          ...(p?.skills ?? []),
        ].join(" ").toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [query, role, presence]);

  const sortedUsers = useMemo(() => {
    const copy = [...filteredUsers];
    copy.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "title") {
        const at = profileFor(a.id)?.title ?? "";
        const bt = profileFor(b.id)?.title ?? "";
        return at.localeCompare(bt);
      }
      if (sort === "team") {
        const at = profileFor(a.id)?.team ?? "";
        const bt = profileFor(b.id)?.team ?? "";
        return at.localeCompare(bt);
      }
      if (sort === "joined") {
        return (JOIN_ORDER[a.id] ?? 99) - (JOIN_ORDER[b.id] ?? 99);
      }
      return 0;
    });
    return copy;
  }, [filteredUsers, sort]);

  const filteredIds = new Set(sortedUsers.map((u) => u.id));

  const onMessage = (user: User) => {
    toast.success(`Opening DM with ${user.name.split(" ")[0]}…`);
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-white dark:bg-gray-950">
      <Topbar left={<Breadcrumb items={[{ label: ws?.name ?? "" }, { label: "Team" }]} />} />

      <div className="flex-1 overflow-y-auto">
        <TeamHeader />
        <TeamToolbar
          view={view}
          setView={setView}
          query={query}
          setQuery={setQuery}
          role={role}
          setRole={setRole}
          presence={presence}
          setPresence={setPresence}
          sort={sort}
          setSort={setSort}
          resultCount={sortedUsers.length}
        />

        {view === "grid" && (
          <div className="px-6 py-5 grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedUsers.map((u) => (
              <TeamMemberCard
                key={u.id}
                user={u}
                profile={profileFor(u.id)}
                onOpen={() => setOpenUser(u)}
                onMessage={() => onMessage(u)}
              />
            ))}
            {sortedUsers.length === 0 && (
              <div className="col-span-full text-center text-sm text-gray-400 py-12">
                No people match your filters.
              </div>
            )}
          </div>
        )}

        {view === "list" && (
          <div className="px-6 py-5">
            <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-gray-900">
              <TeamMemberRowHeader />
              {sortedUsers.map((u) => (
                <TeamMemberRow
                  key={u.id}
                  user={u}
                  profile={profileFor(u.id)}
                  onOpen={() => setOpenUser(u)}
                  onMessage={() => onMessage(u)}
                />
              ))}
              {sortedUsers.length === 0 && (
                <div className="text-center text-sm text-gray-400 py-12">
                  No people match your filters.
                </div>
              )}
            </div>
          </div>
        )}

        {view === "org" && (
          <TeamOrgView
            filteredUserIds={filteredIds}
            onOpen={(u) => setOpenUser(u)}
            onMessage={onMessage}
          />
        )}

        <TeamOpenRoles />
      </div>

      <TeamDetailDrawer
        user={openUser}
        profile={openUser ? profileFor(openUser.id) : undefined}
        open={Boolean(openUser)}
        onClose={() => setOpenUser(null)}
        onMessage={() => openUser && onMessage(openUser)}
      />
    </div>
  );
}
