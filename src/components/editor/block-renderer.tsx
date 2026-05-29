"use client";
import { Sparkles, RefreshCw, Check } from "lucide-react";
import type { DocBlock } from "@/types";

export function BlockRenderer({ block, onChange }: { block: DocBlock; onChange: (b: DocBlock) => void }) {
  if (block.type === "h1") return <h1 contentEditable suppressContentEditableWarning className="text-4xl font-bold tracking-tight mt-6 mb-3 outline-none" onBlur={(e) => onChange({ ...block, text: e.currentTarget.textContent ?? "" })}>{block.text}</h1>;
  if (block.type === "h2") return <h2 contentEditable suppressContentEditableWarning className="text-2xl font-semibold tracking-tight mt-5 mb-2 outline-none" onBlur={(e) => onChange({ ...block, text: e.currentTarget.textContent ?? "" })}>{block.text}</h2>;
  if (block.type === "h3") return <h3 contentEditable suppressContentEditableWarning className="text-xl font-semibold mt-4 mb-1 outline-none" onBlur={(e) => onChange({ ...block, text: e.currentTarget.textContent ?? "" })}>{block.text}</h3>;
  if (block.type === "p") return <p contentEditable suppressContentEditableWarning className="text-gray-600 dark:text-gray-400 leading-relaxed mb-2 outline-none" onBlur={(e) => onChange({ ...block, text: e.currentTarget.textContent ?? "" })}>{block.text}</p>;
  if (block.type === "list") return (
    <ul className="list-disc pl-6 my-2 space-y-1 text-gray-600 dark:text-gray-400 leading-relaxed">
      {block.items?.map((item, i) => <li key={i} contentEditable suppressContentEditableWarning className="outline-none">{item}</li>)}
    </ul>
  );
  if (block.type === "callout") return (
    <div className="flex gap-3 items-start bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 my-3">
      <span className="text-xl flex-shrink-0">💡</span>
      <div contentEditable suppressContentEditableWarning className="flex-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed outline-none" onBlur={(e) => onChange({ ...block, text: e.currentTarget.textContent ?? "" })}>{block.text}</div>
    </div>
  );
  if (block.type === "ai") return (
    <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900 rounded-xl p-4 my-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-3.5 h-3.5 text-orange-500" />
        <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">Haxon AI</span>
        <div className="flex-1" />
        <button className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded"><RefreshCw className="w-3 h-3" /></button>
        <button className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-green-500 rounded"><Check className="w-3 h-3" /></button>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{block.text}</div>
    </div>
  );
  if (block.type === "divider") return <hr className="my-5 border-gray-200 dark:border-gray-700" />;
  return null;
}
