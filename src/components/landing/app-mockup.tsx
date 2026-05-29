"use client";
import { useEffect, useState } from "react";
import { Check, FileText, Sparkles } from "lucide-react";

const SIDEBAR_ITEMS = [
  { label: "Q3 Strategy", active: true },
  { label: "Eng RFC", active: false },
  { label: "Onboarding", active: false },
  { label: "Brand Guide", active: false },
];

const OBJECTIVES = [
  { label: "Ship AI pricing model", done: true },
  { label: "Recruit 5 design partners", done: true },
  { label: "Launch self-serve onboarding", done: false },
];

const MEMBER_COLORS = ["#F97316", "#3B82F6", "#8B5CF6", "#10B981"];

const AI_FULL_TEXT =
  "Based on the bets above, the highest-leverage actions this week are locking AI pricing and recruiting 5 design partners…";

export function AppMockup() {
  const [aiText, setAiText] = useState("");

  useEffect(() => {
    let i = 0;
    const tick = () => {
      if (i <= AI_FULL_TEXT.length) {
        setAiText(AI_FULL_TEXT.slice(0, i));
        i++;
        setTimeout(tick, 38);
      }
    };
    const timer = setTimeout(tick, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/5 shadow-2xl shadow-black/10"
      style={{ maxWidth: "896px", margin: "0 auto" }}
    >
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-0.5 text-xs text-gray-400 min-w-40 text-center">
            haxon.app/northwind/q3-strategy
          </div>
        </div>
        <div className="w-16" />
      </div>

      <div className="grid min-h-[380px]" style={{ gridTemplateColumns: "164px 1fr 256px" }}>
        <MockupSidebar />
        <MockupEditor />
        <MockupAIPanel aiText={aiText} />
      </div>
    </div>
  );
}

function MockupSidebar() {
  return (
    <div className="border-r border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900 p-3 flex flex-col gap-0.5">
      <div className="px-2 pt-1 pb-2.5">
        <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
          Northwind
        </div>
      </div>

      {SIDEBAR_ITEMS.map((item) => (
        <div
          key={item.label}
          className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px] cursor-default ${
            item.active
              ? "bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-medium"
              : "text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          <FileText className="w-3 h-3 flex-shrink-0 opacity-70" />
          {item.label}
        </div>
      ))}

      <div className="mt-3 px-2 pb-1">
        <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Members
        </div>
        <div className="flex -space-x-1">
          {MEMBER_COLORS.map((c, i) => (
            <div
              key={i}
              className="w-5 h-5 rounded-full border-2 border-white dark:border-gray-900"
              style={{ background: c }}
            />
          ))}
          <div className="w-5 h-5 rounded-full border-2 border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[8px] text-gray-500">
            +3
          </div>
        </div>
      </div>
    </div>
  );
}

function MockupEditor() {
  return (
    <div className="p-6 overflow-hidden">
      <h2 className="text-base font-bold tracking-tight text-gray-900 dark:text-white mb-1">
        Q3 Product Strategy
      </h2>
      <div className="flex items-center gap-3 mb-4 text-[11px] text-gray-400">
        <div className="flex items-center gap-1">
          <div className="w-3.5 h-3.5 rounded-full bg-orange-400 flex items-center justify-center text-white text-[8px] font-bold">M</div>
          <span>Maya Chen</span>
        </div>
        <span>·</span>
        <span>Updated 2h ago</span>
        <span>·</span>
        <div className="flex items-center gap-1 text-green-500">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-soft inline-block" />
          <span>3 live</span>
        </div>
      </div>

      <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
        Haxon shipped its v2 doc engine last quarter, doubling editor performance
        and unlocking real-time multiplayer. Adoption is up 38% MoM, with design
        partners reporting 3× faster planning cycles.
      </p>

      <div className="mb-3">
        <div className="text-[10px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
          Key objectives
        </div>
        <div className="space-y-1">
          {OBJECTIVES.map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-[11px]">
              <div
                className={`w-3 h-3 rounded flex-shrink-0 flex items-center justify-center ${
                  item.done
                    ? "bg-orange-500 text-white"
                    : "border border-gray-300 dark:border-gray-600"
                }`}
              >
                {item.done && <Check className="w-2 h-2" />}
              </div>
              <span
                className={
                  item.done ? "line-through text-gray-400" : "text-gray-600 dark:text-gray-300"
                }
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/50 rounded-lg p-2.5 flex gap-2 items-start">
        <Sparkles className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0" />
        <div>
          <div className="text-[9px] font-bold text-orange-500 uppercase tracking-wider mb-0.5">
            Haxon AI
          </div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">
            Suggested: Add OKR alignment section based on your company goals doc.
          </div>
        </div>
      </div>
    </div>
  );
}

function MockupAIPanel({ aiText }: { aiText: string }) {
  return (
    <div className="border-l border-gray-100 dark:border-gray-800 bg-gray-50/40 dark:bg-gray-900 flex flex-col">
      <div className="px-3.5 py-2.5 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-orange-500" />
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          AI Assistant
        </span>
        <div className="ml-auto w-2 h-2 rounded-full bg-green-400 pulse-soft" />
      </div>

      <div className="flex-1 p-3 space-y-2 overflow-hidden">
        <div className="flex justify-end">
          <div className="bg-orange-500 text-white text-[10px] rounded-xl rounded-tr-sm px-2.5 py-1.5 max-w-[80%] leading-relaxed">
            Summarize our Q3 strategy and next actions
          </div>
        </div>
        <div className="flex gap-2 items-start">
          <div className="w-4 h-4 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Sparkles className="w-2.5 h-2.5 text-orange-500" />
          </div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[10px] text-gray-600 dark:text-gray-400 rounded-xl rounded-tl-sm px-2.5 py-2 leading-relaxed max-w-[88%]">
            {aiText}
            <span className="blink">|</span>
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-gray-100 dark:border-gray-800">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
          <span className="text-[10px] text-gray-400 flex-1">
            Ask about this doc…
          </span>
          <span className="font-mono text-[9px] text-gray-300 dark:text-gray-600 bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">
            ⌘K
          </span>
        </div>
      </div>
    </div>
  );
}
