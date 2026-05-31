"use client";
import { useState, useEffect } from "react";
import { HaxonLogo } from "@/components/ui/haxon-logo";
import { RefreshCw } from "lucide-react";

function Countdown() {
  const [secs, setSecs] = useState(45 * 60);
  useEffect(() => {
    const t = setInterval(() => setSecs((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return (
    <div className="flex items-center gap-4 justify-center">
      {[{ val: m, label: "min" }, { val: s, label: "sec" }].map(({ val, label }) => (
        <div key={label} className="text-center">
          <div className="text-4xl font-black tracking-tight tabular-nums">{String(val).padStart(2, "0")}</div>
          <div className="text-xs text-gray-400 uppercase tracking-widest">{label}</div>
        </div>
      ))}
    </div>
  );
}

export default function MaintenancePage() {
  const [checking, setChecking] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col items-center justify-center px-8 text-center">
      <div className="mb-10">
        <HaxonLogo size={26} />
      </div>

      <div className="text-6xl mb-6 animate-bounce">🔧</div>

      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-50 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-900 rounded-full text-xs font-semibold text-orange-600 mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 pulse-soft" />
        Scheduled maintenance in progress
      </div>

      <h1 className="text-3xl font-bold tracking-tight mb-4">We&apos;re tuning things up</h1>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mb-10 leading-relaxed">
        Haxon is undergoing scheduled maintenance to make your workspace faster and more reliable.
        We&apos;ll be back shortly — sit tight.
      </p>

      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md p-8 mb-10 w-full max-w-xs">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Estimated time remaining</div>
        <Countdown />
      </div>

      <div className="grid grid-cols-3 gap-4 text-center mb-10 max-w-sm w-full">
        {[
          { label: "Uptime (30d)", value: "99.97%" },
          { label: "Incidents", value: "0 open" },
          { label: "Est. recovery", value: "~45 min" },
        ].map((s) => (
          <div key={s.label} className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-md p-3">
            <div className="font-bold text-lg">{s.value}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <button
        onClick={() => { setChecking(true); setTimeout(() => { window.location.reload(); }, 1500); }}
        disabled={checking}
        className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-semibold rounded-md transition-colors"
      >
        <RefreshCw className={`w-4 h-4 ${checking ? "spin-slow" : ""}`} />
        {checking ? "Checking…" : "Check again"}
      </button>

      <p className="text-xs text-gray-400 mt-6">
        Follow{" "}
        <a href="#" className="text-orange-500 hover:underline">@haxonapp</a>{" "}
        for live updates
      </p>
    </div>
  );
}
