"use client";
import { ArrowRight } from "lucide-react";
import { AUTOMATION_TEMPLATES } from "@/data/dummy-automations";
import { useCan, useCurrentRole } from "@/lib/use-can";

interface Props {
  onUse: (templateId: string) => void;
}

export function AutomationTemplates({ onUse }: Props) {
  const role = useCurrentRole();
  const canCreate = useCan("automation.create");
  return (
    <div>
      <h2 className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2.5">
        Start from a template
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {AUTOMATION_TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => onUse(t.id)}
            disabled={!canCreate}
            title={canCreate ? "Use template" : `Your role (${role}) can't create automations`}
            className="text-left rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 hover:border-orange-200 dark:hover:border-orange-800/60 hover:bg-orange-50/40 dark:hover:bg-orange-950/10 transition-colors cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 dark:disabled:hover:border-gray-800 disabled:hover:bg-white dark:disabled:hover:bg-gray-900"
          >
            <div className="flex items-start gap-2 mb-2">
              <span className="text-base leading-none">{t.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-gray-900 dark:text-white truncate">
                  {t.name}
                </div>
                <div className="text-[10.5px] font-medium uppercase tracking-widest text-gray-400">
                  {t.category}
                </div>
              </div>
            </div>
            <p className="text-[11.5px] text-gray-600 dark:text-gray-400 leading-relaxed mb-3 line-clamp-2">
              {t.desc}
            </p>
            <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">{t.trigger}</span>
              <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-orange-500 transition-colors flex-shrink-0" />
              <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded truncate">{t.action}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
