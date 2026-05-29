"use client";
import { Star, Share2, Sparkles, MoreHorizontal, MessageSquare } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Topbar, Breadcrumb, IconBtn } from "@/components/layout/topbar";
import { AvatarGroup } from "@/components/ui/user-avatar";
import { USERS } from "@/data/dummy-users";
import { cn } from "@/lib/utils";
import type { Doc, Workspace, ModalConfig } from "@/types";

interface Props {
  doc: Doc;
  workspace?: Workspace;
  isFav: boolean;
  aiPanelOpen: boolean;
  commentsPanelOpen: boolean;
  onToggleFavorite: () => void;
  onToggleAi: () => void;
  onToggleComments: () => void;
  openModal: (m: ModalConfig) => void;
}

export function DocEditorTopbar({ doc, workspace, isFav, aiPanelOpen, commentsPanelOpen, onToggleFavorite, onToggleAi, onToggleComments, openModal }: Props) {
  return (
    <Topbar
      left={<Breadcrumb items={[{ label: workspace?.name ?? "", href: "/dashboard" }, { label: doc.folder }, { label: doc.title }]} />}
      right={
        <>
          <div className="flex items-center gap-1.5 mr-2 text-xs text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-soft" />
            Synced
          </div>
          <AvatarGroup users={USERS.slice(0, 3)} size={22} max={3} />
          <IconBtn icon={<Star className={cn("w-3.5 h-3.5", isFav && "fill-orange-500 text-orange-500")} />} tooltip={isFav ? "Unfavorite" : "Favorite"} active={isFav} onClick={onToggleFavorite} />
          <IconBtn icon={<Share2 className="w-3.5 h-3.5" />} tooltip="Share" onClick={() => openModal({ type: "share", name: doc.title })} />
          <IconBtn icon={<MessageSquare className="w-3.5 h-3.5" />} tooltip={commentsPanelOpen ? "Hide comments" : "Comments"} active={commentsPanelOpen} onClick={onToggleComments} />
          <IconBtn icon={<Sparkles className="w-3.5 h-3.5" />} tooltip={aiPanelOpen ? "Hide AI" : "Open AI"} active={aiPanelOpen} onClick={onToggleAi} />
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-1 w-48 z-50" sideOffset={4}>
                {[
                  { label: "Rename", onClick: () => openModal({ type: "rename", id: doc.id, kind: "doc", current: doc.title }) },
                  { label: "Duplicate", onClick: () => openModal({ type: "duplicate", id: doc.id, kind: "doc", name: doc.title }) },
                ].map((item) => (
                  <DropdownMenu.Item key={item.label} onSelect={item.onClick}
                    className="px-2.5 py-2 text-sm rounded-lg cursor-pointer outline-none text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">{item.label}</DropdownMenu.Item>
                ))}
                <DropdownMenu.Separator className="my-1 h-px bg-gray-100 dark:bg-gray-700" />
                <DropdownMenu.Item onSelect={() => openModal({ type: "delete", id: doc.id, kind: "doc", name: doc.title })}
                  className="px-2.5 py-2 text-sm rounded-lg cursor-pointer outline-none text-red-500 hover:bg-red-50 dark:hover:bg-red-950">Delete</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
          <button className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors">Publish</button>
        </>
      }
    />
  );
}
