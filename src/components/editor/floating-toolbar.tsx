"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bold, Italic, Underline, Strikethrough, Code, Link, Heading1, Heading2, Heading3, List, ListOrdered, Quote as QuoteIcon } from "lucide-react";

export function FloatingToolbar() {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onUp = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) { setShow(false); return; }
      const r = sel.getRangeAt(0).getBoundingClientRect();
      if (r.width === 0) { setShow(false); return; }
      setPos({ x: r.left + r.width / 2, y: r.top });
      setShow(true);
    };
    document.addEventListener("mouseup", onUp);
    return () => document.removeEventListener("mouseup", onUp);
  }, []);

  if (!show) return null;
  const tools = [Bold, Italic, Underline, Strikethrough, Code, Link, null, Heading1, Heading2, Heading3, null, List, ListOrdered, QuoteIcon];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9, y: 4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
      className="fixed z-50 flex items-center gap-0.5 p-1 bg-gray-900 rounded-lg shadow-2xl"
      style={{ left: pos.x, top: pos.y - 50, transform: "translateX(-50%)" }}>
      {tools.map((Icon, i) => Icon === null
        ? <div key={i} className="w-px h-5 bg-white/20 mx-1" />
        : <button key={i} className="w-7 h-7 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors">
            <Icon className="w-3.5 h-3.5" />
          </button>
      )}
    </motion.div>
  );
}
