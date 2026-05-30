"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  Home, Inbox, Calendar, Users, ChevronRight, ChevronDown, ChevronLeft,
  Search, Plus, Sun, Moon, Settings, LogOut, MoreHorizontal,
  ChevronUp, FileText, Kanban, Zap, Plug, Target, FolderOpen,
} from "lucide-react";
import { HaxonLogo } from "@/components/ui/haxon-logo";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";
import { asRole, capabilityCount, ROLE_COLOR } from "@/lib/rbac";
import { useCan, useCurrentRole } from "@/lib/use-can";
import * as Tooltip from "@radix-ui/react-tooltip";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

function RoleChip({ role }: { role: string }) {
  const r = asRole(role);
  const color = ROLE_COLOR[r];
  const count = capabilityCount(r);
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
      style={{ background: color + "22", color }}
      title={`${count} capabilities`}
    >
      <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {r}
    </span>
  );
}

function TooltipWrap({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Tooltip.Provider delayDuration={300}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content side="right" sideOffset={6}
            className="bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg z-50">
            {label}
            <Tooltip.Arrow className="fill-gray-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

interface MenuItem {
  label: string;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
  disabledReason?: string;
}

function SItem({
  icon, label, active, onClick, depth = 0, collapsible, expanded, badge, menuItems,
}: {
  icon?: React.ReactNode; label: string; active?: boolean; onClick?: () => void;
  depth?: number; collapsible?: boolean; expanded?: boolean; badge?: string; menuItems?: MenuItem[];
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      onClick={onClick}
      className={cn(
        "group flex items-center gap-2 rounded-md text-sm cursor-pointer mb-0.5 relative select-none",
        "transition-colors duration-100",
        active
          ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100",
      )}
      style={{ paddingLeft: `${10 + depth * 14}px`, paddingRight: 8, paddingTop: 4, paddingBottom: 4 }}
    >
      {collapsible && (
        <ChevronRight className={cn("w-3 h-3 flex-shrink-0 text-gray-400 transition-transform", expanded && "rotate-90")} />
      )}
      {icon && <span className="flex-shrink-0 w-4 flex items-center justify-center">{icon}</span>}
      <span className="flex-1 truncate">{label}</span>
      {badge && !menuOpen && (
        <span className="text-[10px] bg-orange-500 text-white rounded-full px-1.5 py-0.5 font-semibold group-hover:hidden">{badge}</span>
      )}
      {menuItems && (
        <div
          className={cn(
            "absolute right-1.5 top-1/2 -translate-y-1/2 transition-opacity",
            menuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenu.Root open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenu.Trigger asChild>
              <button className="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <MoreHorizontal className="w-3 h-3" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-1 w-44 z-[100]"
                sideOffset={4}
                align="start"
              >
                {menuItems.map((item) => (
                  <DropdownMenu.Item
                    key={item.label}
                    disabled={item.disabled}
                    onSelect={item.onClick}
                    title={item.disabled ? item.disabledReason : undefined}
                    className={cn(
                      "flex items-center px-2 py-1.5 text-sm rounded cursor-pointer outline-none",
                      "data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed",
                      item.danger
                        ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                    )}
                  >
                    {item.label}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      )}
    </div>
  );
}

function SectionHeader({
  label, onAdd, addTooltip,
}: { label: string; onAdd?: () => void; addTooltip?: string }) {
  return (
    <div className="flex items-center px-2 mb-1 mt-2 group/header">
      <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest flex-1">{label}</span>
      {onAdd && (
        <TooltipWrap label={addTooltip ?? `New ${label.toLowerCase()}`}>
          <button
            onClick={onAdd}
            className="w-4 h-4 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 opacity-0 group-hover/header:opacity-100 transition-all"
          >
            <Plus className="w-3 h-3" />
          </button>
        </TooltipWrap>
      )}
    </div>
  );
}

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const {
    workspaces, activeWorkspaceId, docs, boards, favorites,
    expandedFolders, user, sidebarCollapsed,
    setActiveWorkspace, toggleSidebar, toggleFolder, logout, openModal, openCommand,
  } = useAppStore();

  const role = useCurrentRole();
  const canCreateDoc = useCan("doc.create");
  const canEditDoc = useCan("doc.edit");
  const canDeleteDoc = useCan("doc.delete");
  const canCreateBoard = useCan("board.create");
  const canEditBoard = useCan("board.edit");
  const canDeleteBoard = useCan("board.delete");

  const ws = workspaces.find((w) => w.id === activeWorkspaceId);
  const favDocs = favorites.map((id) => docs.find((d) => d.id === id)).filter(Boolean);
  const wsDocs = docs.filter((d) => d.workspaceId === activeWorkspaceId).slice(0, 8);
  const wsBoards = boards.filter((b) => b.workspaceId === activeWorkspaceId);

  const docMenuItems = (id: string, title: string): MenuItem[] => [
    {
      label: "Rename",
      onClick: () => openModal({ type: "rename", id, kind: "doc", current: title }),
      disabled: !canEditDoc,
      disabledReason: `Your role (${role}) can't edit docs`,
    },
    { label: "Duplicate", onClick: () => openModal({ type: "duplicate", id, kind: "doc", name: title }) },
    {
      label: "Delete",
      onClick: () => openModal({ type: "delete", id, kind: "doc", name: title }),
      danger: true,
      disabled: !canDeleteDoc,
      disabledReason: `Your role (${role}) can't delete docs`,
    },
  ];

  const boardMenuItems = (id: string, name: string): MenuItem[] => [
    {
      label: "Rename",
      onClick: () => openModal({ type: "rename", id, kind: "board", current: name }),
      disabled: !canEditBoard,
      disabledReason: `Your role (${role}) can't edit boards`,
    },
    {
      label: "Delete",
      onClick: () => openModal({ type: "delete", id, kind: "board", name }),
      danger: true,
      disabled: !canDeleteBoard,
      disabledReason: `Your role (${role}) can't delete boards`,
    },
  ];

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 0 : 260 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="flex-shrink-0 border-r border-gray-100 dark:border-gray-800 bg-[#FAFAFA] dark:bg-[#0F1117] flex flex-col overflow-hidden"
    >
      <div className="w-[260px] flex flex-col h-full min-h-0">
        {/* Brand */}
        <div className="px-3.5 pt-2.5 pb-1.5 flex items-center justify-between">
          <Link href="/" className="cursor-pointer">
            <HaxonLogo size={20} />
          </Link>
          <div className="flex items-center gap-1">
            <TooltipWrap label="Collapse sidebar">
              <button onClick={toggleSidebar} className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </TooltipWrap>
          </div>
        </div>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="mx-2 px-2.5 py-1.5 flex items-center gap-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-sm transition-all text-left">
              <div className="w-6 h-6 rounded-md flex items-center justify-center text-sm flex-shrink-0"
                style={{ background: ws?.color }}>
                <span>{ws?.emoji}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate text-gray-900 dark:text-white">{ws?.name}</div>
                <div className="text-[11px] flex items-center gap-1">
                  <RoleChip role={ws?.role ?? "Member"} />
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-1 w-72 z-50" sideOffset={4} align="start">
              {workspaces.map((w) => (
                <DropdownMenu.Item key={w.id} onSelect={() => { setActiveWorkspace(w.id); toast.success(`Switched to ${w.name}`); }}
                  className="flex items-center gap-2.5 px-2 py-2 rounded-md cursor-pointer outline-none text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center text-sm" style={{ background: w.color }}>{w.emoji}</div>
                  <span className="flex-1 truncate">{w.name}</span>
                  <RoleChip role={w.role} />
                </DropdownMenu.Item>
              ))}
              <DropdownMenu.Separator className="my-1 h-px bg-gray-100 dark:bg-gray-800" />
              <DropdownMenu.Item onSelect={() => router.push("/settings/roles")}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer outline-none text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                See role capabilities →
              </DropdownMenu.Item>
              <DropdownMenu.Item onSelect={() => openModal({ type: "createWorkspace" })}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer outline-none text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                <Plus className="w-3.5 h-3.5" /> Create workspace
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* Workspace stats */}
        <div className="px-3 py-1.5 flex items-center gap-3">
          {[
            { val: "48", label: "Docs" },
            { val: "6", label: "Boards" },
            { val: "12", label: "Members" },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-1 text-[10px]">
              <span className="font-semibold text-gray-700 dark:text-gray-300">{s.val}</span>
              <span className="text-gray-400">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="px-2 pb-1.5">
          <button
            onClick={openCommand}
            className="flex items-center gap-2 w-full px-2.5 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <Search className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="flex-1 text-left text-xs">Search</span>
            <span className="text-[10px] text-gray-300 dark:text-gray-600 font-mono">⌘K</span>
          </button>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto px-1.5 pb-2 min-h-0">
          <div className="mb-1">
            {[
              { icon: <Home className="w-3.5 h-3.5" />, label: "Dashboard", href: "/dashboard" },
              { icon: <Inbox className="w-3.5 h-3.5" />, label: "Inbox", badge: "3", href: "/inbox" },
              { icon: <Calendar className="w-3.5 h-3.5" />, label: "Calendar", href: "/calendar" },
              { icon: <Target className="w-3.5 h-3.5" />, label: "Goals", href: "/goals" },
              { icon: <Zap className="w-3.5 h-3.5" />, label: "Automations", href: "/automations" },
              { icon: <Plug className="w-3.5 h-3.5" />, label: "Integrations", href: "/integrations" },
              { icon: <FolderOpen className="w-3.5 h-3.5" />, label: "Files", href: "/files" },
              { icon: <Users className="w-3.5 h-3.5" />, label: "Team", href: "/team" },
            ].map((item) => (
              <SItem key={item.label} icon={item.icon} label={item.label} badge={item.badge}
                active={pathname === item.href}
                onClick={() => router.push(item.href)} />
            ))}
          </div>

          <div className="my-2 border-t border-gray-100 dark:border-gray-800" />

          {/* Favorites */}
          {favDocs.length > 0 && (
            <div className="mb-1">
              <SectionHeader label="Favorites" />
              {favDocs.map((d) => d && (
                <SItem key={d.id} icon={<span className="text-xs">{d.emoji}</span>} label={d.title}
                  active={pathname.includes(d.id)}
                  onClick={() => router.push(`/workspace/${d.workspaceId}/doc/${d.id}`)}
                  menuItems={docMenuItems(d.id, d.title)} />
              ))}
            </div>
          )}

          {/* Workspace tree */}
          <div>
            <SectionHeader
              label="Docs"
              onAdd={canCreateDoc ? () => openModal({ type: "createDoc", workspaceId: activeWorkspaceId }) : undefined}
              addTooltip="New doc"
            />
            <SItem icon={<FileText className="w-3.5 h-3.5" />} label="All docs"
              collapsible expanded={expandedFolders["w1-Docs"] ?? true}
              onClick={() => toggleFolder("w1-Docs")} />
            <AnimatePresence initial={false}>
              {(expandedFolders["w1-Docs"] ?? true) && (
                <motion.div key="docs-folder" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                  {wsDocs.map((d) => (
                    <SItem key={d.id} icon={<span className="text-xs">{d.emoji}</span>} label={d.title}
                      depth={1} active={pathname.includes(d.id)}
                      onClick={() => router.push(`/workspace/${d.workspaceId}/doc/${d.id}`)}
                      menuItems={docMenuItems(d.id, d.title)} />
                  ))}
                  {canCreateDoc && (
                    <SItem icon={<Plus className="w-3 h-3" />} label="New doc" depth={1}
                      onClick={() => openModal({ type: "createDoc", workspaceId: activeWorkspaceId })} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <SectionHeader
              label="Boards"
              onAdd={canCreateBoard ? () => openModal({ type: "createBoard", workspaceId: activeWorkspaceId }) : undefined}
              addTooltip="New board"
            />
            <SItem icon={<Kanban className="w-3.5 h-3.5" />} label="All boards"
              collapsible expanded={expandedFolders["w1-Boards"] ?? true}
              onClick={() => toggleFolder("w1-Boards")} />
            <AnimatePresence initial={false}>
              {(expandedFolders["w1-Boards"] ?? true) && (
                <motion.div key="boards-folder" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                  {wsBoards.map((b) => (
                    <SItem key={b.id} icon={<span className="text-xs">{b.emoji}</span>} label={b.name}
                      depth={1} active={pathname.includes(b.id)}
                      onClick={() => router.push(`/workspace/${b.workspaceId}/board/${b.id}`)}
                      menuItems={boardMenuItems(b.id, b.name)} />
                  ))}
                  {canCreateBoard && (
                    <SItem icon={<Plus className="w-3 h-3" />} label="New board" depth={1}
                      onClick={() => openModal({ type: "createBoard", workspaceId: activeWorkspaceId })} />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom */}
        <div className="px-1 py-1 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 bg-gray-100/50 dark:bg-gray-800/50 rounded-lg px-2 py-1.5">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="flex items-center gap-2 flex-1 min-w-0 px-1.5 py-1 rounded-lg hover:bg-gray-200/60 dark:hover:bg-gray-700/60 transition-colors text-left">
                  <UserAvatar user={user} size={26} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate text-gray-900 dark:text-white">{user.name}</div>
                    <div className="text-[10px] text-gray-500 truncate">{user.email}</div>
                  </div>
                  <ChevronUp className="w-3 h-3 text-gray-400 flex-shrink-0" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-1 w-52 z-50" sideOffset={4} align="start">
                  {[
                    { label: "Profile settings", icon: <Settings className="w-3.5 h-3.5" />, href: "/settings" },
                    { label: "Members", icon: <Users className="w-3.5 h-3.5" />, href: "/settings/members" },
                    { label: "Billing", icon: <FileText className="w-3.5 h-3.5" />, href: "/settings/billing" },
                  ].map((item) => (
                    <DropdownMenu.Item key={item.label} onSelect={() => router.push(item.href)}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer outline-none text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                      {item.icon} {item.label}
                    </DropdownMenu.Item>
                  ))}
                  <DropdownMenu.Separator className="my-1 h-px bg-gray-100 dark:bg-gray-800" />
                  <DropdownMenu.Item onSelect={() => { logout(); router.push("/login"); }}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer outline-none text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950">
                    <LogOut className="w-3.5 h-3.5" /> Sign out
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <TooltipWrap label={resolvedTheme === "light" ? "Dark mode" : "Light mode"}>
              <button onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-200/60 dark:hover:bg-gray-700/60 text-gray-500 flex-shrink-0 transition-colors">
                {resolvedTheme === "light" ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              </button>
            </TooltipWrap>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
