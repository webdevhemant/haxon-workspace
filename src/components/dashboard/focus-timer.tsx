"use client";
import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Coffee, Sparkles } from "lucide-react";
import { toast } from "sonner";

const POMODORO_SECONDS = 25 * 60;

interface Session {
  id: string;
  startedAt: number;
  finishedAt: number;
  label: string;
}

function pad(n: number) { return n.toString().padStart(2, "0"); }
function formatHM(ms: number) {
  const d = new Date(ms);
  let h = d.getHours();
  const m = d.getMinutes();
  const am = h < 12;
  h = h % 12 || 12;
  return `${h}:${pad(m)} ${am ? "AM" : "PM"}`;
}

export function FocusTimer() {
  const [remaining, setRemaining] = useState(POMODORO_SECONDS);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const startedAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(id);
          const now = Date.now();
          const started = startedAtRef.current ?? now - POMODORO_SECONDS * 1000;
          startedAtRef.current = null;
          setRunning(false);
          setSessions((s) => [
            ...s,
            { id: `s-${now}`, startedAt: started, finishedAt: now, label: "Focus block" },
          ]);
          toast.success("Pomodoro complete — take a 5-minute break", { icon: <Coffee className="w-4 h-4" /> });
          return POMODORO_SECONDS;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const handleStart = () => {
    if (!running) {
      if (remaining === POMODORO_SECONDS) startedAtRef.current = Date.now();
      setRunning(true);
    } else {
      setRunning(false);
    }
  };

  const handleReset = () => {
    setRunning(false);
    setRemaining(POMODORO_SECONDS);
    startedAtRef.current = null;
  };

  const pct = 1 - remaining / POMODORO_SECONDS;
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-gray-50 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">Focus Timer</span>
          <span className="text-[10px] font-semibold text-orange-600 bg-orange-50 dark:bg-orange-950 px-1.5 py-0.5 rounded-full">
            Pomodoro · 25m
          </span>
        </div>
        <span className="text-[10px] font-semibold text-gray-400 tabular-nums">
          {sessions.length} done today
        </span>
      </div>
      <div className="px-3.5 py-4 flex items-center gap-5">
        <div className="relative w-[112px] h-[112px] flex-shrink-0">
          <svg width="112" height="112" viewBox="0 0 112 112">
            <circle
              cx="56" cy="56" r={radius}
              stroke="currentColor"
              className="text-gray-100 dark:text-gray-800"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="56" cy="56" r={radius}
              stroke="#F97316"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 56 56)"
              style={{ transition: "stroke-dashoffset 0.6s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold tabular-nums text-gray-900 dark:text-white">
              {pad(mins)}:{pad(secs)}
            </span>
            <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest mt-0.5">
              {running ? "Focusing" : remaining === POMODORO_SECONDS ? "Ready" : "Paused"}
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-3">
            <button
              onClick={handleStart}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              {running
                ? <><Pause className="w-3 h-3" /> Pause</>
                : <><Play className="w-3 h-3" /> {remaining === POMODORO_SECONDS ? "Start" : "Resume"}</>
              }
            </button>
            <button
              onClick={handleReset}
              title="Reset timer"
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-1.5 max-h-[64px] overflow-y-auto pr-1">
            {sessions.length === 0 ? (
              <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                <Sparkles className="w-3 h-3" />
                Complete your first session today
              </div>
            ) : (
              sessions.slice(-3).reverse().map((s) => (
                <div key={s.id} className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">{s.label}</span>
                  <span className="text-gray-400 tabular-nums">
                    {formatHM(s.startedAt)} → {formatHM(s.finishedAt)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
