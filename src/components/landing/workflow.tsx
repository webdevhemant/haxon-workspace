"use client";
import { FileText, Kanban, Layers } from "lucide-react";
import { Reveal } from "./reveal";

const STEPS = [
  {
    icon: FileText,
    title: "Draft in Docs",
    desc: "Spin up structured notes with slash commands. AI fills in scaffolds, summaries, and action items as you go.",
    step: 1,
  },
  {
    icon: Kanban,
    title: "Plan on Boards",
    desc: "Convert any list of headings to a kanban column. Drag, group by owner, and surface what's blocked instantly.",
    step: 2,
  },
  {
    icon: Layers,
    title: "Track in Grids",
    desc: "Same data, spreadsheet view. Filter, sort, group, bulk-edit — without leaving your workspace.",
    step: 3,
  },
];

export function Workflow() {
  return (
    <section className="py-28 px-6 md:px-8 bg-gray-50 dark:bg-gray-900/40 border-y border-gray-200 dark:border-gray-800">
      <div className="max-w-5xl mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <div className="text-[11px] font-semibold text-orange-500 uppercase tracking-widest mb-3">
              How it works
            </div>
            <h2
              className="font-bold tracking-tight text-gray-900 dark:text-white"
              style={{ fontSize: "clamp(32px, 4.5vw, 52px)" }}
            >
              From thought to ship,
              <br />
              in three views.
            </h2>
          </div>
        </Reveal>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          <div
            className="absolute hidden md:block top-11 left-[22%] right-[22%] h-0 border-t-2 border-dashed border-gray-200 dark:border-gray-700"
            style={{ zIndex: 0 }}
          />
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.12}>
              <div className="text-center relative z-10">
                <div className="relative w-20 h-20 rounded-md bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 mx-auto mb-5 flex items-center justify-center shadow-sm">
                  <s.icon className="w-8 h-8 text-gray-700 dark:text-gray-300" strokeWidth={1.4} />
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {s.step}
                  </span>
                </div>
                <div className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                  {s.title}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 max-w-56 mx-auto leading-relaxed">
                  {s.desc}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
