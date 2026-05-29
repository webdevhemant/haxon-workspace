"use client";
import { Globe, GitBranch, ExternalLink } from "lucide-react";
import { HaxonLogo } from "@/components/ui/haxon-logo";

const COLUMNS = [
  { title: "Product", links: ["Docs", "Boards", "Grids", "AI Assistant", "Changelog"] },
  { title: "Company", links: ["About", "Customers", "Careers", "Press", "Brand"] },
  { title: "Resources", links: ["Help center", "API", "Integrations", "Templates", "Security"] },
  { title: "Legal", links: ["Privacy", "Terms", "DPA", "Cookies", "GDPR"] },
];

const SOCIALS = [
  { Icon: Globe, label: "Website" },
  { Icon: GitBranch, label: "GitHub" },
  { Icon: ExternalLink, label: "More" },
];

export function Footer() {
  return (
    <footer className="px-6 md:px-8 pt-16 pb-8 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-[1.5fr_repeat(4,1fr)] gap-8 md:gap-12 mb-12">
          <div className="col-span-2 md:col-span-1">
            <HaxonLogo size={22} />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3.5 max-w-52 leading-relaxed">
              The workspace for teams who think for a living.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {SOCIALS.map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600 transition-all"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div className="text-xs font-semibold mb-3.5 text-gray-900 dark:text-white uppercase tracking-wide">
                {col.title}
              </div>
              {col.links.map((l) => (
                <a
                  key={l}
                  href="#"
                  className="block text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white py-1 transition-colors"
                >
                  {l}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-gray-100 dark:border-gray-800 pt-6 text-xs text-gray-400">
          <div>© 2026 Haxon, Inc. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Status</a>
            <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
