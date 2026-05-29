"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft, ExternalLink, MessageSquare, Mail, MapPin, Clock,
  Briefcase, Calendar, UserCircle, Pencil,
} from "lucide-react";
import { Topbar, Breadcrumb } from "@/components/layout/topbar";
import { UserAvatar } from "@/components/ui/user-avatar";
import { PresenceDot } from "@/components/ui/presence-dot";
import { USERS, CURRENT_USER } from "@/data/dummy-users";
import { presenceFor, PRESENCE_LABEL } from "@/data/dummy-presence";
import { useAppStore } from "@/store/app-store";

interface Props {
  userId: string;
}

export default function TeamMemberDetail({ userId }: Props) {
  const router = useRouter();
  const user = USERS.find((u) => u.id === userId);
  const profiles = useAppStore((s) => s.profiles);
  const profile = profiles.find((p) => p.userId === userId);
  const workspaces = useAppStore((s) => s.workspaces);
  const activeWorkspaceId = useAppStore((s) => s.activeWorkspaceId);
  const ws = workspaces.find((w) => w.id === activeWorkspaceId);

  if (!user) {
    return (
      <div className="flex flex-col h-full min-h-0">
        <Topbar left={<Breadcrumb items={[{ label: "Team", href: "/team" }, { label: "Not found" }]} />} />
        <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
          Team member not found
        </div>
      </div>
    );
  }

  const presence = presenceFor(user.id);
  const manager = profile?.manager ? USERS.find((u) => u.id === profile.manager) : undefined;
  const reports = USERS.filter((u) => {
    const p = profiles.find((x) => x.userId === u.id);
    return p?.manager === user.id;
  });
  const isMe = user.id === CURRENT_USER.id;

  return (
    <div className="flex flex-col h-full min-h-0 bg-white dark:bg-gray-950">
      <Topbar
        left={
          <Breadcrumb
            items={[
              { label: ws?.name ?? "" },
              { label: "Team", href: "/team" },
              { label: user.name },
            ]}
          />
        }
        right={
          isMe ? (
            <Link
              href="/settings"
              className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold transition-colors"
            >
              <Pencil className="w-3 h-3" /> Edit profile
            </Link>
          ) : (
            <button
              onClick={() => toast.info(`Opening DM with ${user.name.split(" ")[0]}…`)}
              className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold transition-colors"
            >
              <MessageSquare className="w-3 h-3" /> Message
            </button>
          )
        }
      />

      <div className="flex-1 overflow-y-auto">
        <button
          onClick={() => router.back()}
          className="ml-6 mt-4 inline-flex items-center gap-1 text-[12px] text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>

        <header className="px-6 pt-3 pb-6">
          <div
            className="h-24 rounded-2xl relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${user.color}33, ${user.color}05)` }}
          />
          <div className="-mt-8 flex items-end gap-4 px-2">
            <div className="relative">
              <div className="rounded-full ring-4 ring-white dark:ring-gray-950">
                <UserAvatar user={user} size={84} hoverCard={false} />
              </div>
              <PresenceDot
                presence={presence}
                size={16}
                className="absolute bottom-1 right-1"
              />
            </div>
            <div className="flex-1 min-w-0 pb-2">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {user.name}
                {profile?.pronouns && (
                  <span className="ml-2 text-[12px] font-normal text-gray-400">
                    ({profile.pronouns})
                  </span>
                )}
              </h1>
              <div className="text-[13px] text-gray-500 dark:text-gray-400">
                {profile?.title ?? user.role}
                {profile?.team ? ` · ${profile.team}` : ""}
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 px-6 pb-12">
          <main className="space-y-8">
            {profile?.bio && (
              <Section title="About">
                <p className="text-[13.5px] leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {profile.bio}
                </p>
              </Section>
            )}

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
                <div className="space-y-1.5">
                  {profile.projects.map((p) => (
                    <button
                      key={p.name}
                      onClick={() => toast.info(`Opening ${p.name}…`)}
                      className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    >
                      <span className="text-base leading-none">{p.emoji}</span>
                      <span className="flex-1 text-[13px] font-medium text-gray-800 dark:text-gray-200 truncate">
                        {p.name}
                      </span>
                      <ExternalLink className="w-3 h-3 text-gray-300 dark:text-gray-600" />
                    </button>
                  ))}
                </div>
              </Section>
            )}

            {profile?.recentActivity && profile.recentActivity.length > 0 && (
              <Section title="Recent activity">
                <ol className="relative border-l border-gray-100 dark:border-gray-800 ml-2 space-y-3 pl-4">
                  {profile.recentActivity.map((a, i) => (
                    <li key={i} className="text-[12.5px]">
                      <span className="absolute -left-[5px] mt-1.5 w-2.5 h-2.5 rounded-full bg-orange-400 ring-4 ring-white dark:ring-gray-950" />
                      <div className="text-gray-400">{a.at}</div>
                      <div className="text-gray-700 dark:text-gray-300">
                        {a.verb}{" "}
                        <span className="font-medium text-gray-900 dark:text-white">
                          {a.target}
                        </span>
                      </div>
                    </li>
                  ))}
                </ol>
              </Section>
            )}
          </main>

          <aside className="space-y-6">
            <Section title="At a glance">
              <div className="space-y-2.5">
                <Glance icon={<Briefcase className="w-3.5 h-3.5" />} label="Team" value={profile?.team ?? "—"} />
                <Glance icon={<MapPin className="w-3.5 h-3.5" />} label="Location" value={profile?.location ?? "—"} />
                <Glance icon={<Clock className="w-3.5 h-3.5" />} label="Timezone" value={profile?.timezone ?? "—"} />
                <Glance icon={<Clock className="w-3.5 h-3.5" />} label="Working hours" value={profile?.workingHours ?? "—"} />
                <Glance icon={<Calendar className="w-3.5 h-3.5" />} label="Started" value={profile?.startedAt ?? "—"} />
                <Glance icon={<UserCircle className="w-3.5 h-3.5" />} label="Status" value={PRESENCE_LABEL[presence]} />
                <Glance icon={<Mail className="w-3.5 h-3.5" />} label="Email" value={user.email} />
                <Glance icon={<Briefcase className="w-3.5 h-3.5" />} label="Role" value={user.role} />
              </div>
            </Section>

            {(manager || reports.length > 0) && (
              <Section title="Reporting">
                {manager && (
                  <div className="mb-3">
                    <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                      Manager
                    </div>
                    <PersonChip user={manager} />
                  </div>
                )}
                {reports.length > 0 && (
                  <div>
                    <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                      Reports ({reports.length})
                    </div>
                    <div className="space-y-1.5">
                      {reports.map((r) => <PersonChip key={r.id} user={r} />)}
                    </div>
                  </div>
                )}
              </Section>
            )}

            {profile?.links && profile.links.length > 0 && (
              <Section title="Links">
                <div className="space-y-1.5">
                  {profile.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      onClick={(e) => e.preventDefault()}
                      className="inline-flex items-center gap-1 text-[12.5px] font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {l.label}
                    </a>
                  ))}
                </div>
              </Section>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2.5">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Glance({
  icon, label, value,
}: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-[12px]">
      <span className="text-gray-400 flex-shrink-0">{icon}</span>
      <span className="text-gray-400 w-24 flex-shrink-0">{label}</span>
      <span className="flex-1 min-w-0 text-gray-800 dark:text-gray-200 truncate">{value}</span>
    </div>
  );
}

function PersonChip({ user }: { user: typeof USERS[number] }) {
  return (
    <Link
      href={`/team/${user.id}`}
      className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
    >
      <UserAvatar user={user} size={24} hoverCard={false} />
      <span className="text-[12.5px] font-medium text-gray-900 dark:text-white truncate">
        {user.name}
      </span>
    </Link>
  );
}
