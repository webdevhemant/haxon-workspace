"use client";
import { Download } from "lucide-react";
import { SettingsLayout, SettingSection } from "./settings-layout";

export default function BillingSettings() {
  return (
    <SettingsLayout title="Billing">
      <SettingSection title="Current plan">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold flex items-center gap-2">
              Pro
              <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-950 text-orange-600 text-xs font-bold rounded-full">Active</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">$12 per seat per month · billed monthly · 12 seats</div>
          </div>
          <button className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Manage plan</button>
        </div>
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          {[
            { label: "Docs", used: 248, total: "Unlimited", pct: 0.32 },
            { label: "Members", used: 12, total: 50, pct: 0.24 },
            { label: "Storage", used: "4.2 GB", total: "100 GB", pct: 0.04 },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-xs text-gray-400 mb-1.5">{s.label}</div>
              <div className="text-lg font-semibold mb-1.5">
                {s.used} <span className="text-sm text-gray-400 font-normal">/ {s.total}</span>
              </div>
              <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: `${s.pct * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </SettingSection>

      <SettingSection title="Invoices">
        <div className="-mx-4">
          {[
            { date: "Aug 1, 2026", amount: "$144.00", invoice: "INV-2026-0008" },
            { date: "Jul 1, 2026", amount: "$144.00", invoice: "INV-2026-0007" },
            { date: "Jun 1, 2026", amount: "$132.00", invoice: "INV-2026-0006" },
            { date: "May 1, 2026", amount: "$108.00", invoice: "INV-2026-0005" },
          ].map((inv, i) => (
            <div key={inv.invoice} className={`flex items-center px-4 py-3 text-sm ${i > 0 ? "border-t border-gray-100 dark:border-gray-800" : ""}`}>
              <div className="w-32 text-gray-600 dark:text-gray-400">{inv.date}</div>
              <div className="w-24 font-medium">{inv.amount}</div>
              <div className="flex-1">
                <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 text-xs font-semibold rounded-full">Paid</span>
              </div>
              <div className="text-gray-400 text-xs mr-3">{inv.invoice}</div>
              <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors">
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </SettingSection>
    </SettingsLayout>
  );
}
