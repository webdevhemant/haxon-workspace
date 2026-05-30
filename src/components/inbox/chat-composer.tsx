"use client";
import { useState, useRef, useEffect } from "react";
import { Paperclip, AtSign, Smile, Send, Hash, Lock } from "lucide-react";
import { ComposerIcon } from "./composer-icon";
import { ChatEmojiPopover } from "./chat-emoji-popover";
import { ChatAttachPopover } from "./chat-attach-popover";
import { ChatMentionPopover, getMentionItems, type MentionTrigger } from "./chat-mention-popover";
import { ChatSchedulePopover, type ScheduleChoice } from "./chat-schedule-popover";

interface Props {
  placeholder: string;
  onSend: (text: string) => void;
  onSchedule?: (text: string, choice: ScheduleChoice) => void;
  autoFocus?: boolean;
  small?: boolean;
  canMessage?: boolean;
  role?: string;
}

interface MentionState {
  trigger: MentionTrigger;
  from: number;
  query: string;
}

export function ChatComposer({ placeholder, onSend, onSchedule, autoFocus, small, canMessage = true, role }: Props) {
  if (!canMessage) {
    return (
      <div className={small ? "px-3 pb-3" : "px-4 pb-4"}>
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-[12.5px] text-gray-500 dark:text-gray-400">
          <Lock className="w-3.5 h-3.5 flex-shrink-0" />
          <span>
            You can't post in this channel — your role{role ? ` (${role})` : ""} is read-only.
          </span>
        </div>
      </div>
    );
  }

  const [value, setValue] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [attachOpen, setAttachOpen] = useState(false);
  const [mention, setMention] = useState<MentionState | null>(null);
  const [mentionIndex, setMentionIndex] = useState(0);
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [value]);

  const detectMention = (nextValue: string, caret: number) => {
    const upto = nextValue.slice(0, caret);
    const match = upto.match(/(?:^|\s)([@#])([\w]*)$/);
    if (!match) {
      setMention(null);
      return;
    }
    setMention({
      trigger: match[1] as MentionTrigger,
      from: caret - match[2].length - 1,
      query: match[2],
    });
    setMentionIndex(0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value;
    setValue(next);
    requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      detectMention(next, el.selectionStart ?? next.length);
    });
  };

  const insertAtCursor = (snippet: string) => {
    const el = ref.current;
    if (!el) {
      setValue((v) => v + snippet);
      return;
    }
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    const next = value.slice(0, start) + snippet + value.slice(end);
    setValue(next);
    requestAnimationFrame(() => {
      el.focus();
      const caret = start + snippet.length;
      el.setSelectionRange(caret, caret);
      detectMention(next, caret);
    });
  };

  const replaceMentionWith = (token: string) => {
    if (!mention) return;
    const el = ref.current;
    const caret = el?.selectionEnd ?? value.length;
    const next = value.slice(0, mention.from) + token + value.slice(caret);
    setValue(next);
    setMention(null);
    requestAnimationFrame(() => {
      const el2 = ref.current;
      if (!el2) return;
      el2.focus();
      const newCaret = mention.from + token.length;
      el2.setSelectionRange(newCaret, newCaret);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (mention) {
      const items = getMentionItems(mention.trigger, mention.query);
      if (items.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setMentionIndex((i) => (i + 1) % items.length);
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setMentionIndex((i) => (i - 1 + items.length) % items.length);
          return;
        }
        if (e.key === "Enter" || e.key === "Tab") {
          e.preventDefault();
          replaceMentionWith(items[mentionIndex].label + " ");
          return;
        }
        if (e.key === "Escape") {
          e.preventDefault();
          setMention(null);
          return;
        }
      }
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
    setMention(null);
  };

  const closeAll = () => { setEmojiOpen(false); setAttachOpen(false); };

  return (
    <div className={small ? "px-3 pb-3" : "px-4 pb-4"}>
      <div className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl focus-within:border-orange-400 dark:focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/15 transition-colors shadow-sm">
        <textarea
          ref={ref}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onSelect={(e) => detectMention(value, (e.target as HTMLTextAreaElement).selectionStart)}
          placeholder={placeholder}
          rows={1}
          className="w-full resize-none bg-transparent outline-none px-3.5 pt-3 pb-1 text-[13.5px] leading-relaxed text-gray-800 dark:text-gray-200 placeholder-gray-400"
        />
        <div className="relative flex items-center gap-0.5 px-2 pb-2">
          <ComposerIcon
            title="Attach"
            onClick={() => { setAttachOpen((v) => !v); setEmojiOpen(false); }}
          >
            <Paperclip className="w-3.5 h-3.5" />
          </ComposerIcon>
          <ComposerIcon title="Mention someone" onClick={() => insertAtCursor("@")}>
            <AtSign className="w-3.5 h-3.5" />
          </ComposerIcon>
          <ComposerIcon title="Reference channel" onClick={() => insertAtCursor("#")}>
            <Hash className="w-3.5 h-3.5" />
          </ComposerIcon>
          <ComposerIcon
            title="Emoji"
            onClick={() => { setEmojiOpen((v) => !v); setAttachOpen(false); }}
          >
            <Smile className="w-3.5 h-3.5" />
          </ComposerIcon>

          {mention && (
            <ChatMentionPopover
              trigger={mention.trigger}
              query={mention.query}
              activeIndex={mentionIndex}
              setActiveIndex={setMentionIndex}
              onPick={(token) => replaceMentionWith(token)}
            />
          )}

          {emojiOpen && !mention && (
            <ChatEmojiPopover onPick={insertAtCursor} onClose={closeAll} />
          )}

          {attachOpen && !mention && (
            <ChatAttachPopover onPick={insertAtCursor} onClose={closeAll} />
          )}

          <div className="flex-1" />
          <span className="hidden md:inline text-[10px] text-gray-400 dark:text-gray-500 mr-2 select-none">
            <kbd className="font-sans">Enter</kbd> to send · <kbd className="font-sans">Shift+Enter</kbd> new line
          </span>
          {onSchedule && (
            <ChatSchedulePopover
              disabled={!value.trim()}
              onPick={(choice) => {
                const trimmed = value.trim();
                if (!trimmed) return;
                onSchedule(trimmed, choice);
                setValue("");
                setMention(null);
              }}
            />
          )}
          <button
            onClick={submit}
            disabled={!value.trim()}
            className="flex items-center gap-1.5 h-7 px-3 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold transition-colors"
          >
            <Send className="w-3 h-3" /> Send
          </button>
        </div>
      </div>
    </div>
  );
}
