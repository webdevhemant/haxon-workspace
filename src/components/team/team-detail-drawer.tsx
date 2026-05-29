"use client";
import { X, MapPin, Clock, Briefcase, Calendar, Mail, MessageSquare, ExternalLink } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { UserAvatar } from "@/components/ui/user-avatar";
import { PresenceDot } from "@/components/ui/presence-dot";
import { presenceFor, PRESENCE_LABEL } from "@/data/dummy-presence";
import type { TeamMemberProfile, User } from "@/types";

interface Props {
  user: User | null;
  profile?: TeamMemberProfile;
  open: boolean;
  onClose: () => void;
  onMessage: () => void;
}

export function TeamDetailDrawer({ user, profile, open, onClose, onMessage }: Props) {
  if (!user) return null;
  const presence = presenceFor(user.id);

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
        <Dialog.Content
          className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-white dark:bg-gray-950 shadow-2xl z-50 flex flex-col"
        >

          <div
            className="h-24 relative flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${user.color}33, ${user.color}05)` }}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg bg-white/70 dark:bg-gray-900/70 backdrop-blur text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-6 -mt-10 flex-shrink-0">
            <div className="flex items-end gap-3">
              <div className="relative">
                <div className="rounded-full ring-4 ring-white dark:ring-gray-950">
                  <UserAvatar user={user} size={72} />
                </div>
                <PresenceDot
                  presence={presence}
                  size={16}
                  className="absolute bottom-1 right-1"
                />
              </div>
              <div className="flex-1 min-w-0 pb-1">
                <div className="text-[18px] font-bold text-gray-900 dark:text-white truncate">
                  {user.name}
                  {profile?.pronouns && (
                    <span className="ml-1.5 text-[11px] font-normal text-gray-400">
                      ({profile.pronouns})
                    </span>
                  )}
                </div>
                <div className="text-[12.5px] text-gray-500 dark:text-gray-400 truncate">
                  {profile?.title ?? user.role}
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={onMessage}
                className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-[13px] font-semibold transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Send a message
              </button>
              <button
                className="h-9 px-3 inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                title="Email"
              >
                <Mail className="w-3.5 h-3.5" /> Email
              </button>
            </div>
          </div>


          <div className="flex-1 overflow-y-auto px-6 pt-5 pb-6 space-y-6">
            {profile?.bio && (
              <Section title="About">
                <p className="text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed">
                  {profile.bio}
                </p>
              </Section>
            )}

            <Section title="At a glance">
              <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
                <Glance icon={<Briefcase className="w-3.5 h-3.5" />} label="Team" value={profile?.team ?? "—"} />
                <Glance icon={<MapPin className="w-3.5 h-3.5" />} label="Location" value={profile?.location ?? "—"} />
                <Glance icon={<Clock className="w-3.5 h-3.5" />} label="Timezone" value={profile?.timezone ?? "—"} />
                <Glance icon={<Clock className="w-3.5 h-3.5" />} label="Working hours" value={profile?.workingHours ?? "—"} />
                <Glance icon={<Calendar className="w-3.5 h-3.5" />} label="Status" value={PRESENCE_LABEL[presence]} />
                <Glance icon={<Calendar className="w-3.5 h-3.5" />} label="Started" value={profile?.startedAt ?? "—"} />
              </div>
            </Section>

            {profile?.skills && profile.skills.length > 0 && (
              <Section title="Skills">
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 text-[11.5px] font-medium rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {profile?.projects && profile.projects.length > 0 && (
              <Section title="Working on">
                <div className="space-y-1">
                  {profile.projects.map((p) => (
                    <div
                      key={p.name}
                      className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer"
                    >
                      <span className="text-base leading-none">{p.emoji}</span>
                      <span className="text-[12.5px] font-medium text-gray-800 dark:text-gray-200 flex-1 truncate">
                        {p.name}
                      </span>
                      <ExternalLink className="w-3 h-3 text-gray-300 dark:text-gray-600" />
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {profile?.recentActivity && profile.recentActivity.length > 0 && (
              <Section title="Recent activity">
                <div className="space-y-2">
                  {profile.recentActivity.map((a, i) => (
                    <div key={i} className="flex items-start gap-2 text-[12.5px]">
                      <span className="text-gray-400 dark:text-gray-500 tabular-nums w-20 flex-shrink-0">
                        {a.at}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {a.verb}{" "}
                        <span className="font-medium text-gray-900 dark:text-white">
                          {a.target}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {profile?.links && profile.links.length > 0 && (
              <Section title="Links">
                <div className="flex flex-wrap gap-1.5">
                  {profile.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      onClick={(e) => e.preventDefault()}
                      className="inline-flex items-center gap-1 text-[12px] font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {l.label}
                    </a>
                  ))}
                </div>
              </Section>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Glance({
  icon, label, value,
}: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1 text-[10.5px] text-gray-400 uppercase tracking-widest">
        {icon} {label}
      </div>
      <div className="text-[12.5px] text-gray-800 dark:text-gray-200 mt-0.5">{value}</div>
    </div>
  );
}
