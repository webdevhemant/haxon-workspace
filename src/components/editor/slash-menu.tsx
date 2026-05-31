"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SLASH_MENU_ITEMS } from "./constants";

export function SlashMenu({ onPick, onClose }: { onPick: (kind: string) => void; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const filtered = SLASH_MENU_ITEMS.filter((i) => i.label.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); }
      if (e.key === "ArrowDown") { e.preventDefault(); setIdx((i) => Math.min(filtered.length - 1, i + 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setIdx((i) => Math.max(0, i - 1)); }
      if (e.key === "Enter") { e.preventDefault(); if (filtered[idx]) onPick(filtered[idx].kind); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [filtered, idx, onClose, onPick]);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95, y: -8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
      className="fixed left-1/2 top-52 -translate-x-1/2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-2xl w-80 p-1.5 z-50">
      <div className="px-2.5 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
        <input autoFocus value={q} onChange={(e) => { setQ(e.target.value); setIdx(0); }}
          placeholder="Filter commands..." className="w-full text-sm outline-none bg-transparent text-gray-900 dark:text-white" />
      </div>
      <div className="max-h-72 overflow-y-auto">
        {filtered.map((item, i) => (
          <button key={item.kind} onClick={() => onPick(item.kind)} onMouseEnter={() => setIdx(i)}
            className={cn("flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-left transition-colors",
              i === idx ? "bg-gray-100 dark:bg-gray-800" : "hover:bg-gray-50 dark:hover:bg-gray-800/50")}>
            <span className={cn("w-8 h-8 rounded-md border border-gray-200 dark:border-gray-700 flex items-center justify-center text-xs font-bold",
              item.featured ? "bg-orange-50 dark:bg-orange-950 text-orange-500 border-orange-100 dark:border-orange-900" : "bg-gray-50 dark:bg-gray-800 text-gray-500")}>
              {item.kind === "ai" ? "✦" : item.label.slice(0, 2)}
            </span>
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</div>
              <div className="text-xs text-gray-400">{item.desc}</div>
            </div>
            {item.featured && <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 bg-orange-500 text-white rounded">AI</span>}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
