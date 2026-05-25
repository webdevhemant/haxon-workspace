"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FileText, Kanban, Grid3X3, Users, Star, ArrowRight, Filter, Sparkles } from "lucide-react";
import { Topbar, Breadcrumb, IconBtn } from "@/components/layout/topbar";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useAppStore } from "@/store/app-store";
import { USERS } from "@/data/dummy-users";
import { greet, formatDate } from "@/lib/utils";
import * as Tooltip from "@radix-ui/react-tooltip";

function StatCard({ label, value, delta, icon, color }: {
  label: string; value: string; delta?: string; icon: React.ReactNode; color: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: color + "15", color }}>
          {icon}
        </span>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
      <div className="text-2xl font-bold tracking-tight mb-1">{value}</div>
      {delta && <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{delta} <span className="text-gray-400 font-normal">vs last week</span></div>}
    </div>
  );
}

function DocCard({ doc, onClick, idx }: { doc: import("@/types").Doc; onClick: () => void; idx: number }) {
  const user = USERS.find((u) => u.id === doc.lastEditedBy);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
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
          <div className="text-xs text-gray-400 truncate">{doc.folder} · {doc.type === "wiki" ? "Wiki" : "Doc"}</div>
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

function ActivityRow({ item, idx }: { item: import("@/types").ActivityItem; idx: number }) {
  const user = USERS.find((u) => u.id === item.userId);
  const isRecent = idx < 2;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }}
      className={`flex items-start gap-2.5 py-2.5 ${idx < 7 ? "border-b border-gray-100 dark:border-gray-800" : ""}`}>
      <div className="relative flex-shrink-0">
        <UserAvatar user={user} size={30} />
        <span className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-center justify-center${isRecent ? " animate-pulse" : ""}`}>
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

export default function DashboardView() {
  const router = useRouter();
  const { docs, activity, user, activeWorkspaceId, workspaces, openModal } = useAppStore();
  const recent = docs.filter((d) => d.workspaceId === activeWorkspaceId).slice(0, 6);
  const ws = workspaces.find((w) => w.id === activeWorkspaceId);

  const quickActions = [
    { icon: <FileText className="w-4 h-4" />, label: "New Doc", desc: "Blank canvas", color: "#3B82F6", onClick: () => router.push(`/workspace/${activeWorkspaceId}/doc/d1`) },
    { icon: <Kanban className="w-4 h-4" />, label: "New Board", desc: "Kanban project", color: "#F97316", onClick: () => router.push(`/workspace/${activeWorkspaceId}/board/b1`) },
    { icon: <Grid3X3 className="w-4 h-4" />, label: "New Grid", desc: "Structured tracker", color: "#10B981", onClick: () => router.push(`/workspace/${activeWorkspaceId}/grid/sprint`) },
    { icon: <Users className="w-4 h-4" />, label: "Invite Member", desc: "Add to workspace", color: "#8B5CF6", onClick: () => openModal({ type: "invite" }) },
  ];

  return (
    <div className="flex flex-col h-full min-h-0">
      <Topbar
        left={<Breadcrumb items={[{ label: ws?.name ?? "" }, { label: "Dashboard" }]} />}
        right={
          <>
            <IconBtn icon={<Filter className="w-3.5 h-3.5" />} tooltip="Filter" />
            <IconBtn icon={<ArrowRight className="w-3.5 h-3.5" />} tooltip="Share" />
          </>
        }
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left: main content, full-width, scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Header */}
          <div className="mb-4">
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              className="text-xs text-gray-400 font-medium mb-1.5 uppercase tracking-wide">{formatDate()}</motion.div>
            <h1 className="text-2xl font-bold tracking-tight">{greet()}, {user.name.split(" ")[0]}.</h1>
            <p className="text-gray-500 mt-1.5 text-sm">
              You have <strong className="text-gray-900 dark:text-white">3 docs</strong> waiting for review and{" "}
              <strong className="text-gray-900 dark:text-white">2 cards</strong> due this week.
            </p>
          </div>

          {/* AI briefing */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50/50 dark:from-orange-950/20 dark:to-amber-950/10 border border-orange-100 dark:border-orange-900/40 rounded-xl p-3 mb-5 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1">
              <div className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-0.5">Haxon AI · Daily briefing</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-2">
                Diego updated the <strong className="text-gray-900 dark:text-white">Sync Engine RFC</strong> with the new conflict resolution model — looks ready for your review.
                The team also moved 3 cards into <strong className="text-gray-900 dark:text-white">In Progress</strong> this morning.
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-lg hover:bg-orange-600 transition-colors">Summarize changes</button>
                <button className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors">Dismiss</button>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-4 gap-2.5 mb-5">
            {quickActions.map((q) => (
              <Tooltip.Provider key={q.label} delayDuration={300}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                      onClick={q.onClick}
                      className="flex items-center gap-3 p-3 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-left hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-sm transition-all group">
                      <span className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                        style={{ background: q.color + "15", color: q.color }}>
                        {q.icon}
                      </span>
                      <div>
                        <div className="text-sm font-semibold">{q.label}</div>
                        <div className="text-xs text-gray-400">{q.desc}</div>
                      </div>
                    </motion.button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content className="bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg z-50" side="bottom" sideOffset={4}>
                      {q.desc}
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            ))}
          </div>

          {/* Recent docs */}
          <div className="flex items-center justify-between mb-3">
            <div className="font-bold text-base tracking-tight">Recent</div>
            <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2.5 mb-6">
            {recent.map((d, i) => (
              <DocCard key={d.id} doc={d} idx={i}
                onClick={() => router.push(`/workspace/${d.workspaceId}/doc/${d.id}`)} />
            ))}
          </div>

          {/* Stats */}
          <div className="font-bold text-base tracking-tight mb-3">This week</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <StatCard label="Docs" value="48" delta="+12" icon={<FileText className="w-3.5 h-3.5" />} color="#3B82F6" />
            <StatCard label="Active boards" value="6" delta="+1" icon={<Kanban className="w-3.5 h-3.5" />} color="#F97316" />
            <StatCard label="Team members" value="12" delta="+2" icon={<Users className="w-3.5 h-3.5" />} color="#8B5CF6" />
            <StatCard label="Storage" value="4.2 GB" icon={<Grid3X3 className="w-3.5 h-3.5" />} color="#10B981" />
          </div>
        </div>

        {/* Right: persistent activity panel */}
        <div className="w-72 flex-shrink-0 border-l border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
            <div className="font-bold text-sm tracking-tight">Activity</div>
            <IconBtn icon={<Filter className="w-3.5 h-3.5" />} tooltip="Filter activity" />
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-1">
            {activity.slice(0, 8).map((a, i) => (
              <ActivityRow key={a.id} item={a} idx={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
