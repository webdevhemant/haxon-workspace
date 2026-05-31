"use client";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { USERS } from "@/data/dummy-users";
import { STATUS_LABEL } from "@/data/dummy-goals";
import type { Goal, GoalStatus } from "@/data/dummy-goals";

const PERIODS = ["Q1 2026", "Q2 2026", "Q3 2026", "Q4 2026", "Q1 2027"];
const STATUSES: GoalStatus[] = ["on-track", "at-risk", "off-track", "complete"];
const EMOJIS = ["🎯", "🚀", "📈", "💡", "🔑", "⚡", "🏆", "🌟", "📊", "🔥"];

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (goal: Goal) => void;
}

export function CreateGoalModal({ open, onClose, onCreate }: Props) {
  const [emoji, setEmoji]       = useState("🎯");
  const [title, setTitle]       = useState("");
  const [desc, setDesc]         = useState("");
  const [period, setPeriod]     = useState("Q3 2026");
  const [status, setStatus]     = useState<GoalStatus>("on-track");
  const [ownerId, setOwner]     = useState("u1");

  const reset = () => {
    setEmoji("🎯"); setTitle(""); setDesc(""); setPeriod("Q3 2026");
    setStatus("on-track"); setOwner("u1");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newGoal: Goal = {
      id: `g${Date.now()}`,
      emoji,
      title: title.trim(),
      description: desc.trim(),
      period,
      status,
      ownerId,
      contributorIds: [],
      keyResults: [],
    };
    onCreate(newGoal);
    reset();
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={(v) => { if (!v) { reset(); onClose(); } }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-2xl focus:outline-none">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <Dialog.Title className="text-[14px] font-semibold text-gray-900 dark:text-white">New goal</Dialog.Title>
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
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Title</label>
              <input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Ship sync engine to GA"
                className="w-full px-3 py-2 text-[13px] border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-orange-400 transition-colors placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Description <span className="normal-case font-normal text-gray-400">(optional)</span></label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="What does success look like?"
                rows={2}
                className="w-full px-3 py-2 text-[13px] border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-orange-400 transition-colors placeholder-gray-400 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Period</label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full px-3 py-2 text-[13px] border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-orange-400 transition-colors cursor-pointer"
                >
                  {PERIODS.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as GoalStatus)}
                  className="w-full px-3 py-2 text-[13px] border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-orange-400 transition-colors cursor-pointer"
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Owner</label>
              <select
                value={ownerId}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full px-3 py-2 text-[13px] border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:border-orange-400 transition-colors cursor-pointer"
              >
                {USERS.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => { reset(); onClose(); }} className="px-3.5 py-2 text-[13px] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors cursor-pointer">
                Cancel
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="px-3.5 py-2 text-[13px] font-semibold bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded transition-colors cursor-pointer"
              >
                Create goal
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
