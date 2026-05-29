"use client";
import { useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { USERS } from "@/data/dummy-users";
import type { CardComment } from "@/types";

export function CardDetailComments({
  comments,
  onAdd,
}: {
  comments: CardComment[];
  onAdd: (text: string) => void;
}) {
  const [commentInput, setCommentInput] = useState("");

  const handleAddComment = () => {
    if (commentInput.trim()) {
      onAdd(commentInput.trim());
      setCommentInput("");
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Activity</span>
      </div>

      {comments.length > 0 && (
        <div className="flex flex-col gap-2 mb-3">
          {comments.map((cm) => {
            const commenter = USERS.find((u) => u.id === cm.userId);
            return (
              <div key={cm.id} className="flex gap-2.5">
                <UserAvatar user={commenter} size={24} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {commenter?.name ?? "Unknown"}
                    </span>
                    <span className="text-[10px] text-gray-400">{cm.at}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{cm.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex gap-2.5 items-start">
        <UserAvatar user={USERS[0]} size={24} />
        <div className="flex-1 flex flex-col gap-1.5">
          <textarea
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAddComment(); }
            }}
            placeholder="Add a comment…"
            rows={1}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 rounded-lg text-sm resize-none outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-500/15 placeholder-gray-400 transition-colors"
            style={{ minHeight: 36 }}
          />
          {commentInput.trim() && (
            <div className="flex justify-end">
              <button
                onClick={handleAddComment}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                <Send className="w-3 h-3" /> Post
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
