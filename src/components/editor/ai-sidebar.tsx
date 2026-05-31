"use client";
import { useState, useEffect, useRef } from "react";
import { Sparkles, X, ArrowUp } from "lucide-react";
import { IconBtn } from "@/components/layout/topbar";
import { UserAvatar } from "@/components/ui/user-avatar";
import { CURRENT_USER } from "@/data/dummy-users";
import { cn } from "@/lib/utils";
import { AI_SUGGESTIONS, generateAiResponse } from "./constants";

export function AISidebar({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState([{ role: "ai", text: "Hi Maya — I've indexed everything in this workspace. What can I help you find or draft?" }]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [streaming, setStreaming] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      const response = generateAiResponse(text);
      let i = 0;
      setStreaming("");
      const tick = () => {
        if (i <= response.length) { setStreaming(response.slice(0, i)); i += 2; setTimeout(tick, 12); }
        else { setMessages((m) => [...m, { role: "ai", text: response }]); setStreaming(""); }
      };
      tick();
    }, 600);
  };

  useEffect(() => { scrollRef.current?.scrollTo({ top: 9e9, behavior: "smooth" }); }, [messages, streaming]);

  return (
    <div className="w-[360px] flex-shrink-0 border-l border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold">Haxon AI</div>
          <div className="text-xs text-gray-400">Knows this workspace</div>
        </div>
        <IconBtn icon={<X className="w-3.5 h-3.5" />} onClick={onClose} />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {messages.map((m, i) => (
          <div key={i} className="flex gap-2.5 items-start">
            {m.role === "ai"
              ? <div className="w-6 h-6 rounded-md bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white flex-shrink-0"><Sparkles className="w-3 h-3" /></div>
              : <UserAvatar user={CURRENT_USER} size={24} />
            }
            <div className={cn("flex-1 text-sm leading-relaxed whitespace-pre-wrap",
              m.role === "user" ? "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg px-2.5 py-2 text-gray-700 dark:text-gray-300" : "text-gray-600 dark:text-gray-400")}>
              {m.text}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex gap-2.5 items-center">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white flex-shrink-0"><Sparkles className="w-3 h-3" /></div>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => <span key={i} className="w-1.5 h-1.5 rounded-full bg-orange-500 pulse-soft" style={{ animationDelay: `${i * 0.2}s` }} />)}
            </div>
          </div>
        )}
        {streaming && (
          <div className="flex gap-2.5 items-start">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white flex-shrink-0"><Sparkles className="w-3 h-3" /></div>
            <div className="flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
              {streaming}<span className="blink">▍</span>
            </div>
          </div>
        )}
        {messages.length === 1 && (
          <div className="mt-4">
            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Suggested</div>
            <div className="space-y-1.5">
              {AI_SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)}
                  className="flex items-center gap-2 w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-400 text-left hover:border-orange-300 dark:hover:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors">
                  <span className="text-orange-500 text-xs">↵</span> {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-200 dark:border-gray-800">
        <form onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-3 focus-within:border-orange-400 transition-colors">
          <input value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about this workspace..."
            className="w-full text-sm outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-400 mb-2" />
          <div className="flex items-center justify-end">
            <button type="submit" className="w-7 h-7 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center justify-center transition-colors">
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
