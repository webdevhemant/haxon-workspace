"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { X, Plus } from "lucide-react";
import { SettingsLayout, SettingSection } from "./settings-layout";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useAppStore } from "@/store/app-store";
import { CURRENT_USER } from "@/data/dummy-users";
import { ChangePasswordDialog } from "./security/change-password-dialog";
import { Enable2faDialog } from "./security/enable-2fa-dialog";
import { ManageSessionsDialog } from "./security/manage-sessions-dialog";

type SecurityFlow = "password" | "twofa" | "sessions" | null;

export default function ProfileSettings() {
  const { user, profiles, updateProfile, addProfileSkill, removeProfileSkill, addProfileLink, removeProfileLink } = useAppStore();
  const myProfile = profiles.find((p) => p.userId === CURRENT_USER.id);

  const [name, setName] = useState(user.name);
  const [title, setTitle] = useState(myProfile?.title ?? "");
  const [team, setTeam] = useState(myProfile?.team ?? "");
  const [location, setLocation] = useState(myProfile?.location ?? "");
  const [timezone, setTimezone] = useState(myProfile?.timezone ?? "");
  const [hours, setHours] = useState(myProfile?.workingHours ?? "");
  const [pronouns, setPronouns] = useState(myProfile?.pronouns ?? "");
  const [bio, setBio] = useState(myProfile?.bio ?? "");
  const [skillInput, setSkillInput] = useState("");
  const [linkLabel, setLinkLabel] = useState("");
  const [linkHref, setLinkHref] = useState("");
  const [securityFlow, setSecurityFlow] = useState<SecurityFlow>(null);

  useEffect(() => {
    setTitle(myProfile?.title ?? "");
    setTeam(myProfile?.team ?? "");
    setLocation(myProfile?.location ?? "");
    setTimezone(myProfile?.timezone ?? "");
    setHours(myProfile?.workingHours ?? "");
    setPronouns(myProfile?.pronouns ?? "");
    setBio(myProfile?.bio ?? "");
  }, [myProfile]);

  const save = () => {
    updateProfile(CURRENT_USER.id, {
      title, team, location, timezone, workingHours: hours, pronouns, bio,
    });
    toast.success("Profile saved");
  };

  const handleAddSkill = () => {
    const s = skillInput.trim();
    if (!s) return;
    addProfileSkill(CURRENT_USER.id, s);
    setSkillInput("");
  };

  const handleAddLink = () => {
    if (!linkLabel.trim() || !linkHref.trim()) return;
    addProfileLink(CURRENT_USER.id, linkLabel.trim(), linkHref.trim());
    setLinkLabel("");
    setLinkHref("");
  };

  return (
    <SettingsLayout title="Profile">
      <SettingSection title="Personal info" desc="This is how others will see you on Haxon.">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-shrink-0">
            <UserAvatar user={user} size={72} hoverCard={false} />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="font-semibold text-sm text-gray-900 dark:text-white">{user.name}</div>
            <div className="text-xs text-gray-400">{user.email}</div>
            <button className="mt-1 px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors self-start">
              Change avatar
            </button>
            <div className="text-xs text-gray-400">JPG, PNG up to 1MB</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Field label="Name" value={name} onChange={setName} />
          <Field label="Email" value={user.email} disabled />
          <Field label="Title" value={title} onChange={setTitle} placeholder="e.g. Staff Engineer" />
          <Field label="Team" value={team} onChange={setTeam} placeholder="e.g. Engineering" />
          <Field label="Pronouns" value={pronouns} onChange={setPronouns} placeholder="e.g. she/her" />
          <Field label="Location" value={location} onChange={setLocation} placeholder="City, Country" />
          <Field label="Timezone" value={timezone} onChange={setTimezone} placeholder="e.g. CET (UTC+2)" />
          <Field label="Working hours" value={hours} onChange={setHours} placeholder="e.g. 09:00 – 17:30" />
        </div>
        <Field label="Bio" value={bio} onChange={setBio} multiline />
        <div className="flex justify-end mt-3">
          <button
            onClick={save}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm shadow-orange-500/20"
          >
            Save changes
          </button>
        </div>
      </SettingSection>

      <SettingSection title="Skills" desc="What you're known for. These show up on your profile.">
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          {(myProfile?.skills ?? []).map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1 px-2 py-0.5 text-[12px] font-medium rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              {s}
              <button
                onClick={() => removeProfileSkill(CURRENT_USER.id, s)}
                className="text-gray-400 hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {(myProfile?.skills ?? []).length === 0 && (
            <span className="text-[11px] text-gray-400">No skills yet</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddSkill(); } }}
            placeholder="Add a skill…"
            className="flex-1 px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-colors"
          />
          <button
            onClick={handleAddSkill}
            className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Add
          </button>
        </div>
      </SettingSection>

      <SettingSection title="Links" desc="Personal site, social profiles, GitHub — whatever you'd like to share.">
        <div className="space-y-1.5 mb-3">
          {(myProfile?.links ?? []).map((l) => (
            <div key={l.href} className="flex items-center gap-2 text-[12.5px]">
              <span className="font-medium text-gray-700 dark:text-gray-300 w-24 truncate">{l.label}</span>
              <span className="text-blue-600 dark:text-blue-400 truncate flex-1">{l.href}</span>
              <button
                onClick={() => removeProfileLink(CURRENT_USER.id, l.href)}
                className="text-gray-400 hover:text-red-500"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {(myProfile?.links ?? []).length === 0 && (
            <span className="text-[11px] text-gray-400">No links yet</span>
          )}
        </div>
        <div className="grid grid-cols-[140px_1fr_auto] gap-2 items-center">
          <input
            value={linkLabel}
            onChange={(e) => setLinkLabel(e.target.value)}
            placeholder="Label"
            className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-colors"
          />
          <input
            value={linkHref}
            onChange={(e) => setLinkHref(e.target.value)}
            placeholder="https://"
            className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-colors"
          />
          <button
            onClick={handleAddLink}
            disabled={!linkLabel.trim() || !linkHref.trim()}
            className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
      </SettingSection>

      <SettingSection title="Security" desc="Manage your password and two-factor authentication.">
        {[
          { label: "Password", desc: "Last changed 3 months ago", cta: "Change", flow: "password" as const },
          { label: "Two-factor authentication", desc: "Add an extra layer of security", cta: "Enable", flow: "twofa" as const },
          { label: "Active sessions", desc: "2 active devices — see what's signed in", cta: "Manage", flow: "sessions" as const },
        ].map((item, i) => (
          <div key={item.label}>
            {i > 0 && <div className="h-px bg-gray-100 dark:bg-gray-800 my-3" />}
            <div className="flex justify-between items-center py-1">
              <div>
                <div className="text-sm font-medium">{item.label}</div>
                <div className="text-xs text-gray-400">{item.desc}</div>
              </div>
              <button
                onClick={() => setSecurityFlow(item.flow)}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm shadow-orange-500/20"
              >
                {item.cta}
              </button>
            </div>
          </div>
        ))}
      </SettingSection>

      <ChangePasswordDialog
        open={securityFlow === "password"}
        onOpenChange={(v) => setSecurityFlow(v ? "password" : null)}
      />
      <Enable2faDialog
        open={securityFlow === "twofa"}
        onOpenChange={(v) => setSecurityFlow(v ? "twofa" : null)}
      />
      <ManageSessionsDialog
        open={securityFlow === "sessions"}
        onOpenChange={(v) => setSecurityFlow(v ? "sessions" : null)}
      />
    </SettingsLayout>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  multiline?: boolean;
}

function Field({ label, value, onChange, placeholder, disabled, multiline }: FieldProps) {
  const className = "w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-colors disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed";
  return (
    <div className={multiline ? "col-span-2" : ""}>
      <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={className + " resize-y min-h-[72px]"}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={className}
        />
      )}
    </div>
  );
}
