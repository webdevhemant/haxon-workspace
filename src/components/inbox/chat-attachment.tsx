"use client";
import { ArrowUpRight, LinkIcon, ImageIcon } from "lucide-react";
import type { ChatAttachment } from "@/types";

export function ChatAttachmentCard({ attachment }: { attachment: ChatAttachment }) {
  const isLink = attachment.kind === "link";
  const isImage = attachment.kind === "image";
  const icon = attachment.emoji
    ? <span className="text-base leading-none">{attachment.emoji}</span>
    : isLink
      ? <LinkIcon className="w-3.5 h-3.5 text-gray-400" />
      : isImage
        ? <ImageIcon className="w-3.5 h-3.5 text-gray-400" />
        : <span className="text-base leading-none">📄</span>;

  return (
    <a
      href={attachment.href ?? "#"}
      onClick={(e) => e.preventDefault()}
      className="group/att mt-1.5 flex items-center gap-2.5 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-orange-200 dark:hover:border-orange-800/60 hover:bg-orange-50/40 dark:hover:bg-orange-950/10 transition-colors max-w-md"
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
    </a>
  );
}
