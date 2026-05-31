"use client";
import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Kanban, Grid3X3, Home, Settings, Users, CreditCard, Search, ArrowRight } from "lucide-react";
import { useAppStore } from "@/store/app-store";

export function CommandPalette() {
  const router = useRouter();
  const { commandOpen, closeCommand, docs, boards, activeWorkspaceId } = useAppStore();

  const wsDocs = docs.filter((d) => d.workspaceId === activeWorkspaceId);
  const wsBoards = boards.filter((b) => b.workspaceId === activeWorkspaceId);

  const run = useCallback((fn: () => void) => {
    fn();
    closeCommand();
  }, [closeCommand]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        useAppStore.getState().commandOpen
          ? closeCommand()
          : useAppStore.getState().openCommand();
      }
      if (e.key === "Escape" && commandOpen) closeCommand();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [commandOpen, closeCommand]);

  return (
    <AnimatePresence>
      {commandOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeCommand}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ type: "spring", damping: 30, stiffness: 500 }}
            className="relative w-full max-w-xl"
          >
            <Command
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-2xl overflow-hidden"
              loop
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <Command.Input
                  placeholder="Search anything — docs, boards, people…"
                  className="flex-1 text-sm outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-400"
                />
                <kbd className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">ESC</kbd>
              </div>
              <Command.List className="max-h-[400px] overflow-y-auto p-1.5">
                <Command.Empty className="py-10 text-center text-sm text-gray-400">
                  No results found.
                </Command.Empty>

                <Command.Group heading="Navigate" className="[&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-gray-400 [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5">
                  {[
                    { icon: <Home className="w-3.5 h-3.5" />, label: "Dashboard", href: "/dashboard" },
                    { icon: <Settings className="w-3.5 h-3.5" />, label: "Settings", href: "/settings" },
                    { icon: <Users className="w-3.5 h-3.5" />, label: "Members", href: "/settings/members" },
                    { icon: <CreditCard className="w-3.5 h-3.5" />, label: "Billing", href: "/settings/billing" },
                  ].map((item) => (
                    <Command.Item
                      key={item.href}
                      onSelect={() => run(() => router.push(item.href))}
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm cursor-pointer text-gray-700 dark:text-gray-300 aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800 outline-none"
                    >
                      <span className="w-7 h-7 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 flex-shrink-0">
                        {item.icon}
                      </span>
                      {item.label}
                      <ArrowRight className="w-3 h-3 text-gray-300 ml-auto" />
                    </Command.Item>
                  ))}
                </Command.Group>

                {wsDocs.length > 0 && (
                  <Command.Group heading="Docs" className="[&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-gray-400 [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5">
                    {wsDocs.slice(0, 6).map((doc) => (
                      <Command.Item
                        key={doc.id}
                        value={doc.title}
                        onSelect={() => run(() => router.push(`/workspace/${doc.workspaceId}/doc/${doc.id}`))}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm cursor-pointer text-gray-700 dark:text-gray-300 aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800 outline-none"
                      >
                        <span className="w-7 h-7 rounded-md bg-blue-50 dark:bg-blue-950 flex items-center justify-center flex-shrink-0 text-base">
                          {doc.emoji}
                        </span>
                        <span className="flex-1 truncate">{doc.title}</span>
                        <span className="text-[10px] text-gray-400 flex-shrink-0">{doc.folder}</span>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                {wsBoards.length > 0 && (
                  <Command.Group heading="Boards" className="[&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-gray-400 [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5">
                    {wsBoards.map((board) => (
                      <Command.Item
                        key={board.id}
                        value={board.name}
                        onSelect={() => run(() => router.push(`/workspace/${board.workspaceId}/board/${board.id}`))}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm cursor-pointer text-gray-700 dark:text-gray-300 aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800 outline-none"
                      >
                        <span className="w-7 h-7 rounded-md bg-orange-50 dark:bg-orange-950 flex items-center justify-center flex-shrink-0 text-base">
                          {board.emoji}
                        </span>
                        <span className="flex-1 truncate">{board.name}</span>
                        <Kanban className="w-3 h-3 text-gray-300 flex-shrink-0" />
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                <Command.Group heading="Quick actions" className="[&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-gray-400 [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5">
                  {[
                    { icon: <FileText className="w-3.5 h-3.5" />, label: "New doc", color: "#3B82F6", href: `/workspace/${activeWorkspaceId}/doc/d1`, shortcut: "⌘N" },
                    { icon: <Kanban className="w-3.5 h-3.5" />, label: "New board", color: "#F97316", href: `/workspace/${activeWorkspaceId}/board/b1`, shortcut: "⌘B" },
                    { icon: <Grid3X3 className="w-3.5 h-3.5" />, label: "New grid", color: "#10B981", href: `/workspace/${activeWorkspaceId}/grid/sprint` },
                  ].map((action) => (
                    <Command.Item
                      key={action.label}
                      value={action.label}
                      onSelect={() => run(() => router.push(action.href))}
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm cursor-pointer text-gray-700 dark:text-gray-300 aria-selected:bg-gray-100 dark:aria-selected:bg-gray-800 outline-none"
                    >
                      <span className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: action.color + "20", color: action.color }}>
                        {action.icon}
                      </span>
                      {action.label}
                      {"shortcut" in action && action.shortcut && (
                        <kbd className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono ml-auto">{action.shortcut}</kbd>
                      )}
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
