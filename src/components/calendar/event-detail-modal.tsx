"use client";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { format, parseISO, differenceInMinutes } from "date-fns";
import {
  X, Clock, MapPin, Video, Repeat, Calendar as CalendarIcon, ExternalLink, Check, MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/ui/user-avatar";
import { UserHoverCard } from "@/components/ui/user-hover-card";
import { USERS } from "@/data/dummy-users";
import { useCan, useCurrentRole } from "@/lib/use-can";
import type { CalendarEvent, CalendarEventAttendee } from "@/types";
import { EVENT_TYPE_COLOR, EVENT_TYPE_LABEL } from "./event-style";

interface Props {
  event: CalendarEvent | null;
  open: boolean;
  onClose: () => void;
}

type RSVP = CalendarEventAttendee["rsvp"];

const RSVP_OPTIONS: { key: RSVP; label: string }[] = [
  { key: "yes", label: "Yes" },
  { key: "maybe", label: "Maybe" },
  { key: "no", label: "No" },
];

function durationLabel(event: CalendarEvent): string {
  if (event.allDay) return "All day";
  const mins = differenceInMinutes(parseISO(event.endISO), parseISO(event.startISO));
  if (mins < 60) return `${mins} min`;
  if (mins % 60 === 0) return `${mins / 60}h`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

export function EventDetailModal({ event, open, onClose }: Props) {
  const role = useCurrentRole();
  const canRsvp = useCan("calendar.event.rsvp");
  const canEdit = useCan("calendar.event.edit");
  const [myRsvp, setMyRsvp] = useState<RSVP>("yes");
  if (!event) return null;

  const color = EVENT_TYPE_COLOR[event.type];
  const start = parseISO(event.startISO);
  const end = parseISO(event.endISO);
  const owner = USERS.find((u) => u.id === event.ownerId);

  const yes = event.attendees.filter((a) => a.rsvp === "yes").length;
  const maybe = event.attendees.filter((a) => a.rsvp === "maybe").length;
  const pending = event.attendees.filter((a) => a.rsvp === "pending").length;

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-950 rounded-md shadow-2xl z-50 flex flex-col overflow-hidden"
          style={{ width: "min(560px, 96vw)", maxHeight: "90vh" }}
        >
          <div className={cn("relative h-2", color.bg)} />
          <div className="flex items-start justify-between px-5 pt-4 pb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full", color.bg, color.text)}>
                  <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: color.dot }} />
                  {EVENT_TYPE_LABEL[event.type]}
                </span>
                {event.recurring && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    <Repeat className="w-2.5 h-2.5" /> {event.recurring}
                  </span>
                )}
                {event.priority && event.priority !== "None" && (
                  <span className="text-[10px] font-semibold text-rose-600">{event.priority}</span>
                )}
              </div>
              <h2 className="text-[18px] font-bold tracking-tight text-gray-900 dark:text-white truncate">
                {event.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors -mt-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-5">
            <div className="space-y-1.5 text-[13px]">
              <Row icon={<CalendarIcon className="w-3.5 h-3.5" />}>
                {format(start, "EEEE, MMM d, yyyy")}
              </Row>
              <Row icon={<Clock className="w-3.5 h-3.5" />}>
                {event.allDay
                  ? "All day"
                  : `${format(start, "HH:mm")} – ${format(end, "HH:mm")}`} · {durationLabel(event)}
              </Row>
              {event.location && (
                <Row icon={<MapPin className="w-3.5 h-3.5" />}>{event.location}</Row>
              )}
              {event.videoLink && (
                <Row icon={<Video className="w-3.5 h-3.5" />}>
                  <button
                    onClick={() => toast.success("Joining call…")}
                    className="text-blue-600 dark:text-blue-400 hover:underline truncate"
                  >
                    {event.videoLink.replace(/^https?:\/\//, "")}
                  </button>
                  <button
                    onClick={() => {
                      if (typeof navigator !== "undefined" && navigator.clipboard) {
                        navigator.clipboard.writeText(event.videoLink!).catch(() => undefined);
                      }
                      toast.success("Link copied");
                    }}
                    className="ml-2 text-[10.5px] uppercase tracking-wider text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Copy
                  </button>
                </Row>
              )}
            </div>

            {event.description && (
              <Section title="Description">
                <p className="text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </Section>
            )}

            {event.agenda && event.agenda.length > 0 && (
              <Section title="Agenda">
                <ol className="space-y-1">
                  {event.agenda.map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-[12.5px] text-gray-700 dark:text-gray-300">
                      <span className="text-gray-300 dark:text-gray-600 tabular-nums w-4">
                        {i + 1}.
                      </span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ol>
              </Section>
            )}

            <Section title={`Attendees · ${event.attendees.length}`}>
              <div className="flex items-center gap-3 text-[11px] text-gray-500 mb-2">
                <span><strong className="text-emerald-600">{yes}</strong> yes</span>
                <span><strong className="text-amber-600">{maybe}</strong> maybe</span>
                <span><strong className="text-gray-500">{pending}</strong> pending</span>
              </div>
              <div className="space-y-1">
                {event.attendees.map((a) => {
                  const u = USERS.find((x) => x.id === a.userId);
                  if (!u) return null;
                  return (
                    <div key={a.userId} className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900">
                      <UserAvatar user={u} size={24} />
                      <div className="flex-1 min-w-0">
                        <UserHoverCard user={u}>
                          <div className="text-[12.5px] font-medium text-gray-900 dark:text-white truncate cursor-pointer hover:underline">
                            {u.name}
                            {u.id === event.ownerId && (
                              <span className="ml-1.5 text-[10px] font-medium text-gray-400">Organizer</span>
                            )}
                          </div>
                        </UserHoverCard>
                      </div>
                      <RsvpChip rsvp={a.rsvp} />
                    </div>
                  );
                })}
              </div>
            </Section>

            {event.attachments && event.attachments.length > 0 && (
              <Section title="Linked">
                <div className="space-y-1">
                  {event.attachments.map((att, i) => (
                    <button
                      key={i}
                      onClick={() => toast.info(`Opening ${att.title}…`)}
                      className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer text-left"
                    >
                      <span>{att.emoji ?? "📄"}</span>
                      <span className="flex-1 text-[12.5px] font-medium text-gray-800 dark:text-gray-200 truncate">
                        {att.title}
                      </span>
                      <ExternalLink className="w-3 h-3 text-gray-300 dark:text-gray-600" />
                    </button>
                  ))}
                </div>
              </Section>
            )}
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 px-5 py-3 flex items-center gap-2 bg-gray-50 dark:bg-gray-900/40">
            <span className="text-[11px] text-gray-500 mr-auto">
              {canRsvp ? "Your response" : `Your role (${role}) can't RSVP`}
            </span>
            <div className="flex items-center gap-0.5 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-0.5">
              {RSVP_OPTIONS.map((o) => (
                <button
                  key={o.key}
                  onClick={() => setMyRsvp(o.key)}
                  disabled={!canRsvp}
                  title={canRsvp ? o.label : `Your role (${role}) can't RSVP`}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-[11.5px] font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
                    myRsvp === o.key && canRsvp
                      ? "bg-orange-500 text-white"
                      : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200",
                  )}
                >
                  {myRsvp === o.key && <Check className="inline w-3 h-3 mr-0.5 -mt-0.5" />}
                  {o.label}
                </button>
              ))}
            </div>
            <button
              disabled={!canEdit}
              title={canEdit ? "Open chat" : `Your role (${role}) can't edit events`}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11.5px] font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <MessageSquare className="w-3 h-3" /> Chat
            </button>
            {owner && <UserAvatar user={owner} size={22} />}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Row({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
      <span className="text-gray-400 flex-shrink-0">{icon}</span>
      <span className="min-w-0 truncate">{children}</span>
    </div>
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

function RsvpChip({ rsvp }: { rsvp: RSVP }) {
  const styles: Record<RSVP, string> = {
    yes: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300",
    maybe: "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300",
    no: "bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300",
    pending: "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400",
  };
  const label: Record<RSVP, string> = {
    yes: "Going", maybe: "Maybe", no: "Declined", pending: "Pending",
  };
  return (
    <span className={cn("text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full", styles[rsvp])}>
      {label[rsvp]}
    </span>
  );
}
