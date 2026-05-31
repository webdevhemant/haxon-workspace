"use client";
import { Star } from "lucide-react";
import { TESTIMONIALS } from "@/data/dummy-users";
import { Reveal } from "./reveal";

export function Testimonials() {
  return (
    <section className="py-28 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 md:px-8 mb-14">
        <Reveal>
          <div className="text-center">
            <div className="text-[11px] font-semibold text-orange-500 uppercase tracking-widest mb-3">
              Loved by builders
            </div>
            <h2
              className="font-bold tracking-tight text-gray-900 dark:text-white"
              style={{ fontSize: "clamp(32px, 4.5vw, 52px)" }}
            >
              What teams are saying
            </h2>
          </div>
        </Reveal>
      </div>

      <div
        className="flex gap-4 overflow-x-auto px-6 md:px-8 pb-8 landing-scroll-area"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {TESTIMONIALS.map((t, i) => (
          <div
            key={i}
            className="flex-none w-[320px] md:w-[360px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
            style={{ scrollSnapAlign: "start" }}
          >
            <StarRating />
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 mb-5">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                style={{ background: t.color }}
              >
                {t.initials}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {t.name}
                </div>
                <div className="text-xs text-gray-400">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function StarRating() {
  return (
    <div className="flex items-center gap-0.5 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
      ))}
    </div>
  );
}
