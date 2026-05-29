"use client";
import { X } from "lucide-react";
import type { Column } from "@/types";

export function CardDetailHeader({
  currentCol,
  cardId,
  onClose,
}: {
  currentCol: Column | undefined;
  cardId: string;
  onClose: () => void;
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
      {currentCol && (
        <div
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold"
          style={{ background: currentCol.color + "18", color: currentCol.color }}
        >
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: currentCol.color }} />
          {currentCol.name}
        </div>
      )}
      <div className="flex-1" />
      <span className="text-[11px] text-gray-400 font-mono">{cardId}</span>
      <button
        onClick={onClose}
        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
