"use client";
import { useState } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { SettingsLayout, SettingSection } from "./settings-layout";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useAppStore } from "@/store/app-store";

export default function ProfileSettings() {
  const { user } = useAppStore();
  const { resolvedTheme, setTheme } = useTheme();
  const [name, setName] = useState(user.name);

  return (
    <SettingsLayout title="Profile">
      <SettingSection title="Personal info" desc="This is how others will see you on Haxon.">
        <div className="flex items-center gap-5 mb-5">
          <UserAvatar user={user} size={72} />
          <div>
            <button className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Change avatar</button>
            <div className="text-xs text-gray-400 mt-1">JPG, PNG up to 1MB</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-colors" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Email</label>
            <input value={user.email} disabled
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-400 cursor-not-allowed" />
          </div>
        </div>
        <div className="flex justify-end">
          <button onClick={() => toast.success("Profile saved")}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors">
            Save changes
          </button>
        </div>
      </SettingSection>

      <SettingSection title="Appearance" desc="Customize how Haxon looks for you.">
        <div className="text-sm font-medium mb-3">Theme</div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { key: "light", label: "Light", icon: Sun, preview: ["#FFFFFF", "#F5F5F4", "#0C0A09"] },
            { key: "dark", label: "Dark", icon: Moon, preview: ["#0A0A0A", "#1C1C1C", "#FAFAF9"] },
            { key: "system", label: "System", icon: Monitor, preview: ["#FFFFFF", "#1C1C1C", "#F97316"] },
          ].map((t) => {
            const active = resolvedTheme === t.key || (t.key === "system" && !["light", "dark"].includes(resolvedTheme ?? ""));
            return (
              <button key={t.key} onClick={() => setTheme(t.key)}
                className={`p-3 rounded-xl text-left border-2 transition-all ${active ? "border-orange-500" : "border-gray-100 dark:border-gray-800"}`}>
                <div className="flex h-14 rounded-lg overflow-hidden mb-2.5 border border-gray-100 dark:border-gray-700">
                  {t.preview.map((c, i) => <div key={i} className="flex-1" style={{ background: c }} />)}
                </div>
                <div className="flex items-center gap-2">
                  <t.icon className="w-3.5 h-3.5" />
                  <span className="text-sm font-medium">{t.label}</span>
                  {active && <Check className="w-3.5 h-3.5 text-orange-500 ml-auto" />}
                </div>
              </button>
            );
          })}
        </div>
      </SettingSection>

      <SettingSection title="Security" desc="Manage your password and two-factor authentication.">
        {[
          { label: "Password", desc: "Last changed 3 months ago" },
          { label: "Two-factor authentication", desc: "Add an extra layer of security" },
        ].map((item, i) => (
          <div key={item.label}>
            {i > 0 && <div className="h-px bg-gray-100 dark:bg-gray-800 my-3" />}
            <div className="flex justify-between items-center py-1">
              <div>
                <div className="text-sm font-medium">{item.label}</div>
                <div className="text-xs text-gray-400">{item.desc}</div>
              </div>
              <button className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                {i === 0 ? "Change" : "Enable"}
              </button>
            </div>
          </div>
        ))}
      </SettingSection>
    </SettingsLayout>
  );
}
