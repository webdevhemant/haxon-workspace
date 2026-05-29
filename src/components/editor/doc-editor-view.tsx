"use client";
import { use, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/app-store";
import { USERS } from "@/data/dummy-users";
import type { DocBlock } from "@/types";
import { BLOCK_TEMPLATES } from "./constants";
import { DocEditorTopbar } from "./doc-editor-topbar";
import { BlockRenderer } from "./block-renderer";
import { FloatingToolbar } from "./floating-toolbar";
import { SlashMenu } from "./slash-menu";
import { CommentsSidebar } from "./comments-sidebar";
import { AISidebar } from "./ai-sidebar";

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
    const newBlock: DocBlock = BLOCK_TEMPLATES[kind] ?? { type: "p", text: "" };
    setBlocks((b) => [...b, newBlock]);
    setSlashOpen(false);
  };

  if (!doc) return <div className="flex-1 flex items-center justify-center text-gray-400">Document not found</div>;
  const isFav = favorites.includes(doc.id);
  const author = USERS.find((u) => u.id === doc.lastEditedBy);

  return (
    <div className="flex flex-col h-full min-h-0">
      <DocEditorTopbar
        doc={doc}
        workspace={ws}
        isFav={isFav}
        aiPanelOpen={aiPanelOpen}
        commentsPanelOpen={commentsPanelOpen}
        onToggleFavorite={() => toggleFavorite(doc.id)}
        onToggleAi={toggleAiPanel}
        onToggleComments={() => setCommentsPanelOpen((v) => !v)}
        openModal={openModal}
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
