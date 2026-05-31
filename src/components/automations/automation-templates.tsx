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
      <h2 className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-3">
        Start from a template
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 rounded-md overflow-hidden">
        {AUTOMATION_TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => onUse(t.id)}
            disabled={!canCreate}
            title={canCreate ? "Use template" : `Your role (${role}) can't create automations`}
            className="text-left bg-white dark:bg-gray-950 p-3.5 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-gray-950"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm leading-none">{t.emoji}</span>
              <span className="text-[13px] font-medium text-gray-900 dark:text-white truncate">
                {t.name}
              </span>
              <span className="ml-auto text-[10px] text-gray-400">{t.category}</span>
            </div>
            <p className="text-[11.5px] text-gray-500 dark:text-gray-400 leading-relaxed mb-3 line-clamp-2">
              {t.desc}
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
              <span className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300">{t.trigger}</span>
              <ArrowRight className="w-3 h-3 flex-shrink-0" />
              <span className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300 truncate">{t.action}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
