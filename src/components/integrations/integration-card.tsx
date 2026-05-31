"use client";
import { useState } from "react";
import { Check, Settings, X, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCan, useCurrentRole } from "@/lib/use-can";
import type { Integration } from "@/data/dummy-integrations";

interface Props {
  integration: Integration;
  onToggle: () => void;
  onConfigure: () => void;
}

export function IntegrationCard({ integration, onToggle, onConfigure: _onConfigure }: Props) {
  const role = useCurrentRole();
  const canConnect = useCan("integration.connect");
  const canDisconnect = useCan("integration.disconnect");
  const canConfigure = useCan("integration.configure");
  const [showSettings, setShowSettings] = useState(false);
  const toggleCan = integration.connected ? canDisconnect : canConnect;
  const toggleReason = integration.connected
    ? `Your role (${role}) can't disconnect integrations`
    : `Your role (${role}) can't connect integrations`;
  const configureReason = `Your role (${role}) can't configure integrations`;

  return (
    <div className="rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700 transition-all overflow-hidden flex flex-col">
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start gap-3 mb-2.5">
          <div
            className="w-10 h-10 rounded-md flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: integration.color + "22" }}
          >
            {integration.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[14px] font-semibold text-gray-900 dark:text-white truncate">
                {integration.name}
              </span>
              {integration.popular && (
                <span className="text-[9.5px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-300">
                  Popular
                </span>
              )}
              {integration.recommended && (
                <span className="text-[9.5px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950/40 text-sky-600 dark:text-sky-300">
                  Recommended
                </span>
              )}
            </div>
            <div className="text-[10.5px] uppercase tracking-widest text-gray-400 font-medium mt-0.5">
              {integration.vendor} · {integration.category}
            </div>
          </div>
        </div>

        <p className="text-[12.5px] text-gray-600 dark:text-gray-400 leading-relaxed mb-3 line-clamp-2">
          {integration.short}
        </p>

        <ul className="space-y-1 mb-4 flex-1">
          {integration.features.slice(0, 3).map((f) => (
            <li key={f} className="text-[11.5px] text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 mt-auto">
          <button
            onClick={onToggle}
            disabled={!toggleCan}
            title={toggleCan ? (integration.connected ? "Disconnect" : "Connect") : toggleReason}
            className={cn(
              "flex-1 inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded text-[12px] font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
              integration.connected
                ? "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                : "bg-orange-500 hover:bg-orange-600 text-white",
            )}
          >
            {integration.connected ? (
              <>
                <X className="w-3 h-3" /> Disconnect
              </>
            ) : (
              <>+ Connect</>
            )}
          </button>
          {integration.connected && (
            <button
              onClick={() => canConfigure && setShowSettings((v) => !v)}
              disabled={!canConfigure}
              title={canConfigure ? "Configure" : configureReason}
              className={cn(
                "h-8 w-8 inline-flex items-center justify-center rounded border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                showSettings && "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600",
              )}
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {integration.connected && integration.connectedAt && (
          <div className="text-[10.5px] text-emerald-500 mt-2 inline-flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Connected since {integration.connectedAt}
          </div>
        )}
      </div>

      {showSettings && integration.connected && (
        <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-3 bg-gray-50 dark:bg-gray-950/60">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Settings</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-gray-600 dark:text-gray-400">Webhook notifications</span>
              <span className="text-[11px] text-emerald-500 font-medium">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-gray-600 dark:text-gray-400">Workspace</span>
              <span className="text-[11px] text-gray-500 font-medium">haxon-team</span>
            </div>
          </div>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="mt-3 inline-flex items-center gap-1 text-[11.5px] text-orange-500 hover:text-orange-600 font-medium transition-colors"
          >
            Open in Settings <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      )}
    </div>
  );
}

export function handleToggle(integration: Integration): boolean {
  return !integration.connected;
}
