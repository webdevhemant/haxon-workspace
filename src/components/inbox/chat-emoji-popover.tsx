"use client";
import dynamic from "next/dynamic";
import type { EmojiClickData, Theme } from "emoji-picker-react";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

interface Props {
  onPick: (emoji: string) => void;
  onClose: () => void;
}

export function ChatEmojiPopover({ onPick, onClose }: Props) {
  const handleClick = (data: EmojiClickData) => {
    onPick(data.emoji);
    onClose();
  };

  return (
    <div className="absolute bottom-full mb-1 left-2 z-30">
      <EmojiPicker
        onEmojiClick={handleClick}
        theme={"auto" as Theme}
        lazyLoadEmojis
        searchPlaceholder="Search emoji…"
        height={380}
        width={320}
        previewConfig={{ showPreview: false }}
      />
    </div>
  );
}
