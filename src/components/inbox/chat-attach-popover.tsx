"use client";
import { toast } from "sonner";
import { Upload, FileText, Kanban, LinkIcon, Sparkles } from "lucide-react";

interface Props {
  onPick: (token: string) => void;
  onClose: () => void;
}

const OPTIONS = [
  { key: "upload", label: "Upload file", desc: "Image, PDF, CSV — up to 50 MB", icon: <Upload className="w-3.5 h-3.5" /> },
  { key: "doc", label: "Embed a doc", desc: "Pick a Haxon doc to attach", icon: <FileText className="w-3.5 h-3.5" /> },
  { key: "board", label: "Embed a board", desc: "Drop in a Kanban board reference", icon: <Kanban className="w-3.5 h-3.5" /> },
  { key: "link", label: "Add link", desc: "Paste a URL to render as a card", icon: <LinkIcon className="w-3.5 h-3.5" /> },
  { key: "ai", label: "Compose with AI", desc: "Draft a reply with Haxon AI", icon: <Sparkles className="w-3.5 h-3.5" /> },
];

export function ChatAttachPopover({ onPick, onClose }: Props) {
  const handle = (key: string) => {
    if (key === "link") {
      onPick("https://");
      onClose();
      return;
    }
    if (key === "doc") {
      onPick("[doc: Q3 Product Strategy] ");
      onClose();
      return;
    }
    if (key === "board") {
      onPick("[board: Q3 Roadmap] ");
      onClose();
      return;
    }
    if (key === "ai") {
      toast.info("AI compose coming soon");
      onClose();
      return;
    }
    toast.info("Pick a file from your device…");
    onClose();
  };

  return (
    <div className="absolute bottom-full mb-1 left-2 w-[280px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20 overflow-hidden p-1">
      {OPTIONS.map((o) => (
        <button
          key={o.key}
          onClick={() => handle(o.key)}
          className="w-full flex items-start gap-2.5 px-2.5 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 text-left transition-colors"
        >
          <span className="w-7 h-7 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 flex-shrink-0">
            {o.icon}
          </span>
          <span className="flex-1 min-w-0">
            <span className="block text-[12.5px] font-semibold text-gray-900 dark:text-white">
              {o.label}
            </span>
            <span className="block text-[10.5px] text-gray-500 dark:text-gray-400">
              {o.desc}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}
