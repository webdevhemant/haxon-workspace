"use client";
import { toast } from "sonner";
import { Reply, Pin, MoreHorizontal, Copy, BookmarkPlus, Trash2 } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";
import { QUICK_EMOJI } from "./constants";

interface Props {
  onReact: (emoji: string) => void;
  onOpenThread: () => void;
  onPin?: () => void;
  onCopy?: () => void;
}

export function ChatMessageToolbar({ onReact, onOpenThread, onPin, onCopy }: Props) {
  return (
    <div className="absolute right-4 -top-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
      <div className="flex items-center gap-0.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-0.5">
        {QUICK_EMOJI.slice(0, 3).map((e) => (
          <button
            key={e}
            onClick={() => onReact(e)}
            className="w-6 h-6 flex items-center justify-center rounded text-[14px] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={`React ${e}`}
          >
            {e}
          </button>
        ))}
        <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-0.5" />
        <ToolbarBtn title="Reply in thread" onClick={onOpenThread}>
          <Reply className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="Pin" onClick={() => { onPin?.(); toast.success("Pinned"); }}>
          <Pin className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <MessageMoreMenu onCopy={onCopy} />
      </div>
    </div>
  );
}

function ToolbarBtn({
  children, title, onClick,
}: { children: React.ReactNode; title: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-6 h-6 flex items-center justify-center rounded text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      {children}
    </button>
  );
}

function MessageMoreMenu({ onCopy }: { onCopy?: () => void }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          title="More"
          className="w-6 h-6 flex items-center justify-center rounded text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-1 w-44 z-50"
        >
          <MenuItem
            label="Copy text"
            icon={<Copy className="w-3.5 h-3.5" />}
            onSelect={() => { onCopy?.(); toast.success("Copied"); }}
          />
          <MenuItem
            label="Save for later"
            icon={<BookmarkPlus className="w-3.5 h-3.5" />}
            onSelect={() => toast.success("Saved")}
          />
          <DropdownMenu.Separator className="my-1 h-px bg-gray-100 dark:bg-gray-800" />
          <MenuItem
            label="Delete"
            icon={<Trash2 className="w-3.5 h-3.5" />}
            onSelect={() => toast.error("Message deleted")}
            danger
          />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function MenuItem({
  label, icon, onSelect, danger,
}: { label: string; icon: React.ReactNode; onSelect: () => void; danger?: boolean }) {
  return (
    <DropdownMenu.Item
      onSelect={onSelect}
      className={cn(
        "flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer outline-none",
        danger
          ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
      )}
    >
      {icon} {label}
    </DropdownMenu.Item>
  );
}
