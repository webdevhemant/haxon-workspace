"use client";
import { Reply, Pin, MoreHorizontal } from "lucide-react";
import { QUICK_EMOJI } from "./constants";

interface Props {
  onReact: (emoji: string) => void;
  onOpenThread: () => void;
}

export function ChatMessageToolbar({ onReact, onOpenThread }: Props) {
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
        <ToolbarBtn title="Pin">
          <Pin className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn title="More">
          <MoreHorizontal className="w-3.5 h-3.5" />
        </ToolbarBtn>
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
