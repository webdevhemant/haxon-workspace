"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Hash, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatChannel } from "@/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channel: ChatChannel;
  onSave: (patch: Partial<ChatChannel>) => void;
}

export function ChannelSettingsDialog({ open, onOpenChange, channel, onSave }: Props) {
  const [name, setName] = useState(channel.name);
  const [topic, setTopic] = useState(channel.topic ?? "");
  const [isPrivate, setIsPrivate] = useState(Boolean(channel.isPrivate));

  useEffect(() => {
    if (open) {
      setName(channel.name);
      setTopic(channel.topic ?? "");
      setIsPrivate(Boolean(channel.isPrivate));
    }
  }, [open, channel]);

  const save = () => {
    onSave({ name: name.trim() || channel.name, topic: topic.trim(), isPrivate });
    toast.success("Channel updated");
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-950 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          style={{ width: "min(440px, 96vw)", maxHeight: "90vh" }}
        >
          <div className="px-5 pt-4 pb-3 flex items-start justify-between border-b border-gray-100 dark:border-gray-800">
            <div>
              <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white">
                Channel settings
              </h2>
              <p className="text-[11.5px] text-gray-500 mt-0.5">
                Edit how this channel looks and who can join.
              </p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-5 py-4 space-y-4 overflow-y-auto">
            <Field label="Name">
              <div className="flex items-center gap-1.5 h-9 px-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus-within:border-orange-400">
                <Hash className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 text-sm bg-transparent outline-none text-gray-700 dark:text-gray-300"
                />
              </div>
            </Field>
            <Field label="Topic">
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={2}
                placeholder="What is this channel for?"
                className="w-full px-2.5 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-orange-400 resize-y min-h-[60px]"
              />
            </Field>
            <Field label="Privacy">
              <button
                onClick={() => setIsPrivate((v) => !v)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-colors cursor-pointer",
                  isPrivate
                    ? "border-orange-300 dark:border-orange-700 bg-orange-50/40 dark:bg-orange-950/20"
                    : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50",
                )}
              >
                {isPrivate ? (
                  <Lock className="w-4 h-4 text-orange-500 flex-shrink-0" />
                ) : (
                  <Hash className="w-4 h-4 text-gray-400 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="text-[12.5px] font-semibold">
                    {isPrivate ? "Private" : "Public"}
                  </div>
                  <div className="text-[10.5px] text-gray-500">
                    {isPrivate
                      ? "Only invited members can join or see history"
                      : "Anyone in the workspace can join"}
                  </div>
                </div>
              </button>
            </Field>
          </div>

          <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-2 bg-gray-50/60 dark:bg-gray-900/40">
            <button
              onClick={() => onOpenChange(false)}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={save}
              className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
            >
              Save changes
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10.5px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
        {label}
      </div>
      {children}
    </div>
  );
}
