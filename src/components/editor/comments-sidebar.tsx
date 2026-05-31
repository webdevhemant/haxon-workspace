"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { X, MessageSquare, Send } from "lucide-react";
import { IconBtn } from "@/components/layout/topbar";
import { UserAvatar } from "@/components/ui/user-avatar";
import { USERS, CURRENT_USER } from "@/data/dummy-users";
import type { DocComment } from "./constants";
import { SEED_COMMENTS } from "./constants";

export function CommentsSidebar({ onClose }: { onClose: () => void }) {
  const [comments, setComments] = useState<DocComment[]>(SEED_COMMENTS);
  const [newText, setNewText] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const addComment = () => {
    if (!newText.trim()) return;
    setComments((cs) => [...cs, { id: `c${Date.now()}`, userId: "u1", text: newText.trim(), at: "just now", replies: [] }]);
    setNewText("");
  };

  const addReply = (commentId: string) => {
    if (!replyText.trim()) return;
    setComments((cs) => cs.map((c) =>
      c.id !== commentId ? c : { ...c, replies: [...c.replies, { id: `r${Date.now()}`, userId: "u1", text: replyText.trim(), at: "just now" }] }
    ));
    setReplyText("");
    setReplyTo(null);
  };

  return (
    <div className="w-[320px] flex-shrink-0 border-l border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <div className="flex-1 text-sm font-semibold text-gray-900 dark:text-white">Comments</div>
        <span className="text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-1.5 py-0.5 rounded-full">{comments.length}</span>
        <IconBtn icon={<X className="w-3.5 h-3.5" />} onClick={onClose} />
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {comments.length === 0 ? (
          <div className="text-center py-10">
            <MessageSquare className="w-8 h-8 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
            <div className="text-sm text-gray-400">No comments yet</div>
            <div className="text-xs text-gray-300 dark:text-gray-600 mt-1">Add the first comment below</div>
          </div>
        ) : comments.map((comment) => {
          const user = USERS.find((u) => u.id === comment.userId);
          return (
            <motion.div key={comment.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-md p-3">
              <div className="flex items-start gap-2.5">
                {user && <UserAvatar user={user} size={24} />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-xs font-semibold text-gray-900 dark:text-white">{user?.name ?? "User"}</span>
                    <span className="text-[10px] text-gray-400">{comment.at}</span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{comment.text}</div>
                </div>
              </div>

              {comment.replies.length > 0 && (
                <div className="mt-2.5 pl-8 space-y-2 border-l-2 border-gray-100 dark:border-gray-700 ml-3">
                  {comment.replies.map((reply) => {
                    const ru = USERS.find((u) => u.id === reply.userId);
                    return (
                      <div key={reply.id} className="flex items-start gap-2 pl-2">
                        {ru && <UserAvatar user={ru} size={18} />}
                        <div className="flex-1">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[11px] font-semibold text-gray-900 dark:text-white">{ru?.name ?? "User"}</span>
                            <span className="text-[10px] text-gray-400">{reply.at}</span>
                          </div>
                          <div className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">{reply.text}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {replyTo === comment.id ? (
                <div className="mt-2.5 flex gap-2 pl-3">
                  <input autoFocus value={replyText} onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); addReply(comment.id); }
                      if (e.key === "Escape") { setReplyTo(null); setReplyText(""); }
                    }}
                    placeholder="Reply…"
                    className="flex-1 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-2.5 py-1.5 outline-none focus:border-orange-400 text-gray-900 dark:text-white placeholder-gray-400 transition-colors" />
                  <button onClick={() => addReply(comment.id)}
                    className="w-7 h-7 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center justify-center transition-colors flex-shrink-0">
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button onClick={() => { setReplyTo(comment.id); setReplyText(""); }}
                  className="mt-2 ml-3 text-[10px] text-gray-400 hover:text-orange-500 font-medium transition-colors">
                  ↩ Reply
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="p-3 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-start gap-2">
          <UserAvatar user={CURRENT_USER} size={24} />
          <div className="flex-1">
            <textarea value={newText} onChange={(e) => setNewText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); addComment(); } }}
              placeholder="Add a comment… (Enter to send)"
              rows={2}
              className="w-full text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-2 outline-none focus:border-orange-400 resize-none text-gray-900 dark:text-white placeholder-gray-400 transition-colors" />
            <div className="flex justify-end mt-1.5">
              <button onClick={addComment}
                className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5">
                <Send className="w-3 h-3" /> Comment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
