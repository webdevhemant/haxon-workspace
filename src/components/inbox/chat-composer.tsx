"use client";
import { useState, useRef, useEffect } from "react";
import { Paperclip, AtSign, Smile, Send, Hash } from "lucide-react";
import { ComposerIcon } from "./composer-icon";

interface Props {
  placeholder: string;
  onSend: (text: string) => void;
  autoFocus?: boolean;
  small?: boolean;
}

export function ChatComposer({ placeholder, onSend, autoFocus, small }: Props) {
  const [value, setValue] = useState("");
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

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
  };

  return (
    <div className={small ? "px-3 pb-3" : "px-4 pb-4"}>
      <div className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl focus-within:border-orange-400 dark:focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/15 transition-colors shadow-sm">
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder={placeholder}
          rows={1}
          className="w-full resize-none bg-transparent outline-none px-3.5 pt-3 pb-1 text-[13.5px] leading-relaxed text-gray-800 dark:text-gray-200 placeholder-gray-400"
        />
        <div className="flex items-center gap-0.5 px-2 pb-2">
          <ComposerIcon title="Attach"><Paperclip className="w-3.5 h-3.5" /></ComposerIcon>
          <ComposerIcon title="Mention"><AtSign className="w-3.5 h-3.5" /></ComposerIcon>
          <ComposerIcon title="Channel"><Hash className="w-3.5 h-3.5" /></ComposerIcon>
          <ComposerIcon title="Emoji"><Smile className="w-3.5 h-3.5" /></ComposerIcon>
          <div className="flex-1" />
          <span className="hidden md:inline text-[10px] text-gray-400 dark:text-gray-500 mr-2 select-none">
            <kbd className="font-sans">Enter</kbd> to send · <kbd className="font-sans">Shift+Enter</kbd> new line
          </span>
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
