"use client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowUpRight, LinkIcon, ImageIcon } from "lucide-react";
import type { ChatAttachment } from "@/types";
import { useAppStore } from "@/store/app-store";

export function ChatAttachmentCard({ attachment }: { attachment: ChatAttachment }) {
  const router = useRouter();
  const { docs, boards, activeWorkspaceId } = useAppStore();
  const isLink = attachment.kind === "link";
  const isImage = attachment.kind === "image";
  const icon = attachment.emoji
    ? <span className="text-base leading-none">{attachment.emoji}</span>
    : isLink
      ? <LinkIcon className="w-3.5 h-3.5 text-gray-400" />
      : isImage
        ? <ImageIcon className="w-3.5 h-3.5 text-gray-400" />
        : <span className="text-base leading-none">📄</span>;

  const open = () => {
    if (attachment.href) {
      if (typeof window !== "undefined") window.open(attachment.href, "_blank");
      return;
    }
    if (attachment.kind === "doc") {
      const doc = docs.find((d) => d.title === attachment.title)
        ?? docs.find((d) => d.workspaceId === activeWorkspaceId);
      if (doc) {
        router.push(`/workspace/${doc.workspaceId}/doc/${doc.id}`);
        return;
      }
    }
    if (attachment.kind === "board") {
      const board = boards.find((b) => b.name === attachment.title)
        ?? boards.find((b) => b.workspaceId === activeWorkspaceId);
      if (board) {
        router.push(`/workspace/${board.workspaceId}/board/${board.id}`);
        return;
      }
    }
    toast.info(`Opening ${attachment.title}…`);
  };

  return (
    <button
      onClick={open}
      className="group/att mt-1.5 w-full max-w-md flex items-center gap-2.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-orange-200 dark:hover:border-orange-800/60 hover:bg-orange-50/40 dark:hover:bg-orange-950/10 transition-colors text-left"
    >
      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-md bg-gray-50 dark:bg-gray-800">
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[12.5px] font-medium text-gray-800 dark:text-gray-200 truncate">
          {attachment.title}
        </div>
        {attachment.subtitle && (
          <div className="text-[10.5px] text-gray-400 dark:text-gray-500 truncate">
            {attachment.subtitle}
          </div>
        )}
      </div>
      <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover/att:text-orange-500 transition-colors flex-shrink-0" />
    </button>
  );
}
