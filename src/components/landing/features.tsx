"use client";
import { motion } from "framer-motion";
import { Sparkles, FileText, Kanban, Users, Zap, Layers } from "lucide-react";
import { FEATURES } from "@/data/dummy-users";
import { Reveal } from "./reveal";

const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles, FileText, Kanban, Users, Zap, Layers,
};

export function Features() {
  return (
    <section className="py-28 px-6 md:px-8">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <div className="text-[11px] font-semibold text-orange-500 uppercase tracking-widest mb-3">
              What&apos;s inside
            </div>
            <h2
              className="font-bold tracking-tight text-gray-900 dark:text-white"
              style={{ fontSize: "clamp(32px, 4.5vw, 52px)" }}
            >
              Every tool your team needs.
              <br />
              <span className="text-gray-400 dark:text-gray-500">One workspace.</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map((f, i) => {
            const Icon = ICON_MAP[f.icon] || Sparkles;
            return (
              <Reveal key={f.title} delay={i * 0.07}>
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="group bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 rounded-xl p-6 h-full hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="border-l-2 border-orange-500 pl-3 flex-shrink-0">
                      <Icon className="w-8 h-8 text-orange-500 dark:text-orange-400" strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white mb-1.5 text-base">
                        {f.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                        {f.desc}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
