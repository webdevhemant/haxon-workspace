"use client";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import type { Automation, TriggerKind, ActionKind } from "@/data/dummy-automations";
import { USERS } from "@/data/dummy-users";

const TRIGGERS: { kind: TriggerKind; label: string }[] = [
  { kind: "card.moved",      label: "Card moved to a column" },
  { kind: "card.created",    label: "Card created" },
  { kind: "card.due",        label: "Card due date approaching" },
  { kind: "doc.published",   label: "Doc published" },
  { kind: "doc.commented",   label: "Doc commented" },
  { kind: "mention",         label: "Someone is @mentioned" },
  { kind: "schedule.daily",  label: "Daily schedule (09:00)" },
];

const ACTIONS: { kind: ActionKind; label: string }[] = [
  { kind: "post.channel",  label: "Post message to channel" },
  { kind: "send.dm",       label: "Send DM to assignee" },
  { kind: "set.priority",  label: "Set card priority" },
  { kind: "assign.to",     label: "Assign card to member" },
  { kind: "add.label",     label: "Add label to card" },
  { kind: "create.task",   label: "Create task in board" },
  { kind: "ai.summarize",  label: "AI summarize and post" },
];

const EMOJIS = ["⚡", "🔔", "📬", "🤖", "🔄", "📌", "🎯", "🛠", "✅", "📢"];

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (automation: Automation) => void;
}

export function CreateAutomationModal({ open, onClose, onCreate }: Props) {
  const [emoji, setEmoji]       = useState("⚡");
  const [name, setName]         = useState("");
  const [desc, setDesc]         = useState("");
  const [triggerKind, setTrig]  = useState<TriggerKind>("card.moved");
  const [actionKind, setAction] = useState<ActionKind>("post.channel");
  const [enabled, setEnabled]   = useState(true);

  const reset = () => {
    setEmoji("⚡"); setName(""); setDesc("");
    setTrig("card.moved"); setAction("post.channel"); setEnabled(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const trigger = TRIGGERS.find((t) => t.kind === triggerKind)!;
    const action  = ACTIONS.find((a) => a.kind === actionKind)!;
    const newAuto: Automation = {
      id: `auto-${Date.now()}`,
      emoji,
      name: name.trim(),
      description: desc.trim() || `${trigger.label} → ${action.label}`,
      enabled,
      trigger: { kind: trigger.kind, label: trigger.label },
      actions: [{ kind: action.kind, label: action.label }],
      runsThisWeek: 0,
      ownerId: "u1",
    };
    onCreate(newAuto);
    reset();
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={(v) => { if (!v) { reset(); onClose(); } }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-2xl focus:outline-none">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <Dialog.Title className="text-[14px] font-semibold text-gray-900 dark:text-white">New automation</Dialog.Title>
            <Dialog.Close className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
              <X className="w-4 h-4" />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Icon</label>
              <div className="flex flex-wrap gap-1">
                {EMOJIS.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => setEmoji(e)}
                    className={`w-8 h-8 flex items-center justify-center rounded text-lg transition-colors cursor-pointer ${
                      emoji === e ? "bg-orange-100 dark:bg-orange-950 ring-1 ring-orange-400" : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Name</label>
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Notify team on card move"
                className="w-full px-3 py-2 text-[13px] border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-orange-400 transition-colors placeholder-gray-400"
              />
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1.5">When (trigger)</label>
                <select
                  value={triggerKind}
                  onChange={(e) => setTrig(e.target.value as TriggerKind)}
                  className="w-full px-3 py-2 text-[13px] border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-orange-400 transition-colors cursor-pointer"
                >
                  {TRIGGERS.map((t) => <option key={t.kind} value={t.kind}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Then (action)</label>
                <select
                  value={actionKind}
                  onChange={(e) => setAction(e.target.value as ActionKind)}
                  className="w-full px-3 py-2 text-[13px] border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-orange-400 transition-colors cursor-pointer"
                >
                  {ACTIONS.map((a) => <option key={a.kind} value={a.kind}>{a.label}</option>)}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch checked={enabled} onCheckedChange={setEnabled} />
              <span className="text-[13px] text-gray-700 dark:text-gray-300">Enable immediately</span>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => { reset(); onClose(); }} className="px-3.5 py-2 text-[13px] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors cursor-pointer">
                Cancel
              </button>
              <button
                type="submit"
                disabled={!name.trim()}
                className="px-3.5 py-2 text-[13px] font-semibold bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded transition-colors cursor-pointer"
              >
                Create automation
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
