"use client";
import { use, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Share2, Sparkles, MoreHorizontal, X, ArrowUp, RefreshCw, Check, Bold, Italic, Underline, Strikethrough, Code, Link, Heading1, Heading2, Heading3, List, ListOrdered, Quote as QuoteIcon, MessageSquare, Send } from "lucide-react";
import { Topbar, Breadcrumb, IconBtn } from "@/components/layout/topbar";
import { UserAvatar, AvatarGroup } from "@/components/ui/user-avatar";
import { useAppStore } from "@/store/app-store";
import { USERS, CURRENT_USER } from "@/data/dummy-users";
import { cn } from "@/lib/utils";
import type { DocBlock } from "@/types";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

// Floating toolbar on text select
function FloatingToolbar() {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onUp = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) { setShow(false); return; }
      const r = sel.getRangeAt(0).getBoundingClientRect();
      if (r.width === 0) { setShow(false); return; }
      setPos({ x: r.left + r.width / 2, y: r.top });
      setShow(true);
    };
    document.addEventListener("mouseup", onUp);
    return () => document.removeEventListener("mouseup", onUp);
  }, []);

  if (!show) return null;
  const tools = [Bold, Italic, Underline, Strikethrough, Code, Link, null, Heading1, Heading2, Heading3, null, List, ListOrdered, QuoteIcon];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9, y: 4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
      className="fixed z-50 flex items-center gap-0.5 p-1 bg-gray-900 rounded-lg shadow-2xl"
      style={{ left: pos.x, top: pos.y - 50, transform: "translateX(-50%)" }}>
      {tools.map((Icon, i) => Icon === null
        ? <div key={i} className="w-px h-5 bg-white/20 mx-1" />
        : <button key={i} className="w-7 h-7 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors">
            <Icon className="w-3.5 h-3.5" />
          </button>
      )}
    </motion.div>
  );
}

// Slash command menu
function SlashMenu({ onPick, onClose }: { onPick: (kind: string) => void; onClose: () => void }) {
  const items = [
    { kind: "h1", label: "Heading 1", desc: "Big section heading" },
    { kind: "h2", label: "Heading 2", desc: "Medium section heading" },
    { kind: "h3", label: "Heading 3", desc: "Small section heading" },
    { kind: "p", label: "Text", desc: "Plain paragraph" },
    { kind: "list", label: "Bullet list", desc: "Simple bullet list" },
    { kind: "callout", label: "Callout", desc: "Highlight a key point" },
    { kind: "divider", label: "Divider", desc: "Horizontal rule" },
    { kind: "ai", label: "AI block", desc: "Ask AI to write or summarize", featured: true },
  ];
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const filtered = items.filter((i) => i.label.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); }
      if (e.key === "ArrowDown") { e.preventDefault(); setIdx((i) => Math.min(filtered.length - 1, i + 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setIdx((i) => Math.max(0, i - 1)); }
      if (e.key === "Enter") { e.preventDefault(); if (filtered[idx]) onPick(filtered[idx].kind); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [filtered, idx, onClose, onPick]);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95, y: -8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
      className="fixed left-1/2 top-52 -translate-x-1/2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl w-80 p-1.5 z-50">
      <div className="px-2.5 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
        <input autoFocus value={q} onChange={(e) => { setQ(e.target.value); setIdx(0); }}
          placeholder="Filter commands..." className="w-full text-sm outline-none bg-transparent text-gray-900 dark:text-white" />
      </div>
      <div className="max-h-72 overflow-y-auto">
        {filtered.map((item, i) => (
          <button key={item.kind} onClick={() => onPick(item.kind)} onMouseEnter={() => setIdx(i)}
            className={cn("flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-left transition-colors",
              i === idx ? "bg-gray-100 dark:bg-gray-800" : "hover:bg-gray-50 dark:hover:bg-gray-800/50")}>
            <span className={cn("w-8 h-8 rounded-md border border-gray-200 dark:border-gray-700 flex items-center justify-center text-xs font-bold",
              item.featured ? "bg-orange-50 dark:bg-orange-950 text-orange-500 border-orange-100 dark:border-orange-900" : "bg-gray-50 dark:bg-gray-800 text-gray-500")}>
              {item.kind === "ai" ? "✦" : item.label.slice(0, 2)}
            </span>
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</div>
              <div className="text-xs text-gray-400">{item.desc}</div>
            </div>
            {item.featured && <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 bg-orange-500 text-white rounded">AI</span>}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// AI sidebar
function AISidebar({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState([{ role: "ai", text: "Hi Maya — I've indexed everything in this workspace. What can I help you find or draft?" }]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [streaming, setStreaming] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestions = ["Summarize Q3 Strategy", "What's blocked this sprint?", "Draft a release note", "Who's on the AI team?"];

  const generateResponse = (q: string) => {
    const l = q.toLowerCase();
    if (l.includes("summar")) return "The Q3 Product Strategy commits to three bets: ship AI assistant to GA, launch Grid view with shared schema, and move to usage-based pricing for AI features.";
    if (l.includes("block")) return "Two cards are flagged: 'AI assistant — streaming improvements' (Jordan, High) and 'Doc → Board converter' (Maya, High). Both tracking late.";
    if (l.includes("release")) return "Draft v2.4 note:\n• AI streaming improvements\n• Grid view live\n• Slack threading v2\n• Faster workspace switcher with ⌘+number";
    return "Based on this workspace, I can help with drafting docs, summarizing pages, surfacing blocked work, and finding people or files.";
  };

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      const response = generateResponse(text);
      let i = 0;
      setStreaming("");
      const tick = () => {
        if (i <= response.length) { setStreaming(response.slice(0, i)); i += 2; setTimeout(tick, 12); }
        else { setMessages((m) => [...m, { role: "ai", text: response }]); setStreaming(""); }
      };
      tick();
    }, 600);
  };

  useEffect(() => { scrollRef.current?.scrollTo({ top: 9e9, behavior: "smooth" }); }, [messages, streaming]);

  return (
    <div className="w-[360px] flex-shrink-0 border-l border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold">Haxon AI</div>
          <div className="text-xs text-gray-400">Knows this workspace</div>
        </div>
        <IconBtn icon={<X className="w-3.5 h-3.5" />} onClick={onClose} />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {messages.map((m, i) => (
          <div key={i} className="flex gap-2.5 items-start">
            {m.role === "ai"
              ? <div className="w-6 h-6 rounded-md bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white flex-shrink-0"><Sparkles className="w-3 h-3" /></div>
              : <UserAvatar user={CURRENT_USER} size={24} />
            }
            <div className={cn("flex-1 text-sm leading-relaxed whitespace-pre-wrap",
              m.role === "user" ? "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg px-2.5 py-2 text-gray-700 dark:text-gray-300" : "text-gray-600 dark:text-gray-400")}>
              {m.text}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex gap-2.5 items-center">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white flex-shrink-0"><Sparkles className="w-3 h-3" /></div>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => <span key={i} className="w-1.5 h-1.5 rounded-full bg-orange-500 pulse-soft" style={{ animationDelay: `${i * 0.2}s` }} />)}
            </div>
          </div>
        )}
        {streaming && (
          <div className="flex gap-2.5 items-start">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white flex-shrink-0"><Sparkles className="w-3 h-3" /></div>
            <div className="flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
              {streaming}<span className="blink">▍</span>
            </div>
          </div>
        )}
        {messages.length === 1 && (
          <div className="mt-4">
            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Suggested</div>
            <div className="space-y-1.5">
              {suggestions.map((s) => (
                <button key={s} onClick={() => send(s)}
                  className="flex items-center gap-2 w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-400 text-left hover:border-orange-300 dark:hover:border-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors">
                  <span className="text-orange-500 text-xs">↵</span> {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-200 dark:border-gray-800">
        <form onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 focus-within:border-orange-400 transition-colors">
          <input value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about this workspace..."
            className="w-full text-sm outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-400 mb-2" />
          <div className="flex items-center justify-end">
            <button type="submit" className="w-7 h-7 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center justify-center transition-colors">
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Comments sidebar
interface DocComment {
  id: string;
  userId: string;
  text: string;
  at: string;
  replies: { id: string; userId: string; text: string; at: string }[];
}

const SEED_COMMENTS: DocComment[] = [
  {
    id: "c1", userId: "u2",
    text: "We should clarify the positioning section before publishing this.",
    at: "2h ago",
    replies: [{ id: "r1", userId: "u1", text: "Good point — I'll revise the second paragraph.", at: "1h ago" }],
  },
  {
    id: "c2", userId: "u3",
    text: "Can we add a section on competitive analysis?",
    at: "Yesterday",
    replies: [],
  },
];

function CommentsSidebar({ onClose }: { onClose: () => void }) {
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
              className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-3">
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

// Block renderer
function BlockRenderer({ block, onChange }: { block: DocBlock; onChange: (b: DocBlock) => void }) {
  if (block.type === "h1") return <h1 contentEditable suppressContentEditableWarning className="text-4xl font-bold tracking-tight mt-6 mb-3 outline-none" onBlur={(e) => onChange({ ...block, text: e.currentTarget.textContent ?? "" })}>{block.text}</h1>;
  if (block.type === "h2") return <h2 contentEditable suppressContentEditableWarning className="text-2xl font-semibold tracking-tight mt-5 mb-2 outline-none" onBlur={(e) => onChange({ ...block, text: e.currentTarget.textContent ?? "" })}>{block.text}</h2>;
  if (block.type === "h3") return <h3 contentEditable suppressContentEditableWarning className="text-xl font-semibold mt-4 mb-1 outline-none" onBlur={(e) => onChange({ ...block, text: e.currentTarget.textContent ?? "" })}>{block.text}</h3>;
  if (block.type === "p") return <p contentEditable suppressContentEditableWarning className="text-gray-600 dark:text-gray-400 leading-relaxed mb-2 outline-none" onBlur={(e) => onChange({ ...block, text: e.currentTarget.textContent ?? "" })}>{block.text}</p>;
  if (block.type === "list") return (
    <ul className="list-disc pl-6 my-2 space-y-1 text-gray-600 dark:text-gray-400 leading-relaxed">
      {block.items?.map((item, i) => <li key={i} contentEditable suppressContentEditableWarning className="outline-none">{item}</li>)}
    </ul>
  );
  if (block.type === "callout") return (
    <div className="flex gap-3 items-start bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 my-3">
      <span className="text-xl flex-shrink-0">💡</span>
      <div contentEditable suppressContentEditableWarning className="flex-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed outline-none" onBlur={(e) => onChange({ ...block, text: e.currentTarget.textContent ?? "" })}>{block.text}</div>
    </div>
  );
  if (block.type === "ai") return (
    <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900 rounded-xl p-4 my-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-3.5 h-3.5 text-orange-500" />
        <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">Haxon AI</span>
        <div className="flex-1" />
        <button className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded"><RefreshCw className="w-3 h-3" /></button>
        <button className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-green-500 rounded"><Check className="w-3 h-3" /></button>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{block.text}</div>
    </div>
  );
  if (block.type === "divider") return <hr className="my-5 border-gray-200 dark:border-gray-700" />;
  return null;
}

export default function DocEditorView({ params }: { params: Promise<{ workspaceId: string; docId: string }> }) {
  const { workspaceId, docId } = use(params);
  const { docs, favorites, aiPanelOpen, workspaces, toggleFavorite, toggleAiPanel, openModal } = useAppStore();
  const doc = docs.find((d) => d.id === docId) ?? docs[0];
  const ws = workspaces.find((w) => w.id === (doc?.workspaceId ?? workspaceId));
  const [blocks, setBlocks] = useState<DocBlock[]>(doc?.content ?? [{ type: "h1", text: doc?.title ?? "Untitled" }, { type: "p", text: "Start writing, or press / for commands…" }]);
  const [slashOpen, setSlashOpen] = useState(false);
  const [commentsPanelOpen, setCommentsPanelOpen] = useState(false);

  useEffect(() => {
    setBlocks(doc?.content ?? [{ type: "h1", text: doc?.title ?? "Untitled" }, { type: "p", text: "Start writing…" }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc?.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !slashOpen && document.activeElement?.tagName !== "INPUT") {
        const sel = window.getSelection();
        if (sel && !sel.isCollapsed) return;
        const active = document.activeElement;
        if (active && (active as HTMLElement).contentEditable === "true") {
          e.preventDefault(); setSlashOpen(true);
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [slashOpen]);

  const insertBlock = (kind: string) => {
    const newBlock: DocBlock = ({
      h1: { type: "h1", text: "New heading" },
      h2: { type: "h2", text: "New subheading" },
      h3: { type: "h3", text: "New section" },
      p: { type: "p", text: "" },
      list: { type: "list", items: ["First item", "Second item"] },
      callout: { type: "callout", text: "Important note…" },
      divider: { type: "divider" },
      ai: { type: "ai", text: "Drafted by Haxon AI based on your workspace context. This is a working summary — feel free to edit or regenerate." },
    } as Record<string, DocBlock>)[kind] ?? { type: "p", text: "" };
    setBlocks((b) => [...b, newBlock]);
    setSlashOpen(false);
  };

  if (!doc) return <div className="flex-1 flex items-center justify-center text-gray-400">Document not found</div>;
  const isFav = favorites.includes(doc.id);
  const author = USERS.find((u) => u.id === doc.lastEditedBy);

  return (
    <div className="flex flex-col h-full min-h-0">
      <Topbar
        left={<Breadcrumb items={[{ label: ws?.name ?? "", href: "/dashboard" }, { label: doc.folder }, { label: doc.title }]} />}
        right={
          <>
            <div className="flex items-center gap-1.5 mr-2 text-xs text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-soft" />
              Synced
            </div>
            <AvatarGroup users={USERS.slice(0, 3)} size={22} max={3} />
            <IconBtn icon={<Star className={cn("w-3.5 h-3.5", isFav && "fill-orange-500 text-orange-500")} />} tooltip={isFav ? "Unfavorite" : "Favorite"} active={isFav} onClick={() => toggleFavorite(doc.id)} />
            <IconBtn icon={<Share2 className="w-3.5 h-3.5" />} tooltip="Share" onClick={() => openModal({ type: "share", name: doc.title })} />
            <IconBtn icon={<MessageSquare className="w-3.5 h-3.5" />} tooltip={commentsPanelOpen ? "Hide comments" : "Comments"} active={commentsPanelOpen} onClick={() => setCommentsPanelOpen((v) => !v)} />
            <IconBtn icon={<Sparkles className="w-3.5 h-3.5" />} tooltip={aiPanelOpen ? "Hide AI" : "Open AI"} active={aiPanelOpen} onClick={toggleAiPanel} />
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-1 w-48 z-50" sideOffset={4}>
                  {[
                    { label: "Rename", onClick: () => openModal({ type: "rename", id: doc.id, kind: "doc", current: doc.title }) },
                    { label: "Duplicate", onClick: () => openModal({ type: "duplicate", id: doc.id, kind: "doc", name: doc.title }) },
                  ].map((item) => (
                    <DropdownMenu.Item key={item.label} onSelect={item.onClick}
                      className="px-2.5 py-2 text-sm rounded-lg cursor-pointer outline-none text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">{item.label}</DropdownMenu.Item>
                  ))}
                  <DropdownMenu.Separator className="my-1 h-px bg-gray-100 dark:bg-gray-700" />
                  <DropdownMenu.Item onSelect={() => openModal({ type: "delete", id: doc.id, kind: "doc", name: doc.title })}
                    className="px-2.5 py-2 text-sm rounded-lg cursor-pointer outline-none text-red-500 hover:bg-red-50 dark:hover:bg-red-950">Delete</DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
            <button className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors">Publish</button>
          </>
        }
      />

      <div className="flex-1 flex min-h-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[680px] mx-auto px-12 pt-12 pb-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-4xl cursor-pointer select-none">
                {doc.emoji}
              </div>
              <div>
                <div className="text-xs text-gray-400">
                  Last edited by {author?.name} · {doc.lastEditedAt}
                </div>
              </div>
            </div>

            <div className="space-y-0.5">
              {blocks.map((block, i) => (
                <BlockRenderer key={i} block={block} onChange={(nb) => setBlocks((arr) => arr.map((x, j) => j === i ? nb : x))} />
              ))}
            </div>

            <div className="mt-8 text-sm text-gray-300 dark:text-gray-600 italic">Press / for commands…</div>
          </div>
        </div>

        <AnimatePresence>
          {commentsPanelOpen && (
            <motion.div key="comments" initial={{ width: 0, opacity: 0 }} animate={{ width: 320, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden flex-shrink-0">
              <CommentsSidebar onClose={() => setCommentsPanelOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {aiPanelOpen && (
            <motion.div key="ai" initial={{ width: 0, opacity: 0 }} animate={{ width: 360, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
              <AISidebar onClose={toggleAiPanel} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <FloatingToolbar />
      <AnimatePresence>
        {slashOpen && <SlashMenu onPick={insertBlock} onClose={() => setSlashOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}
