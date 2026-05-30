"use client";
import { MonitorUp, Square } from "lucide-react";

interface Props {
  onStop: () => void;
}

export function ScreenShareStage({ onStop }: Props) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3">
      <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden border border-white/10 bg-gradient-to-br from-slate-800 via-slate-900 to-black">
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-8 gap-px opacity-30">
          {Array.from({ length: 12 * 8 }).map((_, i) => (
            <div key={i} className="bg-white/[0.02]" />
          ))}
        </div>
        <div className="absolute top-3 left-3 right-3 flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
          <div className="flex-1 ml-2 h-4 rounded bg-white/5" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/70">
          <MonitorUp className="w-7 h-7" />
          <div className="text-[12px] font-semibold tracking-wide">Sharing your screen</div>
          <div className="text-[10.5px] text-white/40">Window · Haxon Workspace</div>
        </div>
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 text-[10px] font-semibold bg-rose-500/90 text-white px-1.5 py-0.5 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          LIVE
        </span>
      </div>

      <button
        onClick={onStop}
        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-white/10 hover:bg-white/15 text-white text-[12px] font-semibold transition-colors"
      >
        <Square className="w-3 h-3" /> Stop sharing
      </button>
    </div>
  );
}
