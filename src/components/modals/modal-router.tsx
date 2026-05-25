"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Copy, Pencil, UserPlus, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useAppStore } from "@/store/app-store";

function ModalShell({ title, children, onClose }: { title: React.ReactNode; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", damping: 30, stiffness: 500 }}
        className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="font-bold text-base">{title}</div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </motion.div>
    </div>
  );
}

export function ModalRouter() {
  const { modal, closeModal, deleteDoc, renameDoc, duplicateDoc, addWorkspace } = useAppStore();
  const [renameVal, setRenameVal] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [wsName, setWsName] = useState("");
  const [wsEmoji, setWsEmoji] = useState("🌊");

  useEffect(() => {
    if (modal?.type === "rename") setRenameVal(modal.current);
    if (modal?.type === "createWorkspace") { setWsName(""); setWsEmoji("🌊"); }
  }, [modal]);

  if (!modal) return null;

  const handleDelete = () => {
    if (modal.type === "delete" && modal.id) deleteDoc(modal.id);
    toast.success("Deleted successfully");
    closeModal();
  };

  return (
    <AnimatePresence>
      {modal.type === "delete" && (
        <ModalShell title={<span className="text-red-500 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Delete {modal.kind}?</span>} onClose={closeModal}>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            This action cannot be undone. <strong className="text-gray-900 dark:text-white">{modal.name}</strong> and all its content will be permanently deleted.
          </p>
          <div className="flex gap-2 justify-end">
            <button onClick={closeModal} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
            <button onClick={handleDelete} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-colors">Delete</button>
          </div>
        </ModalShell>
      )}
      {modal.type === "duplicate" && (
        <ModalShell title={<span className="flex items-center gap-2"><Copy className="w-4 h-4" /> Duplicate {modal.kind}?</span>} onClose={closeModal}>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            A copy of <strong className="text-gray-900 dark:text-white">{modal.name}</strong> will be created in the same location.
          </p>
          <div className="flex gap-2 justify-end">
            <button onClick={closeModal} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
            <button onClick={() => { if (modal.id) duplicateDoc(modal.id); toast.success("Duplicated successfully"); closeModal(); }}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors">Duplicate</button>
          </div>
        </ModalShell>
      )}
      {modal.type === "rename" && (
        <ModalShell title={<span className="flex items-center gap-2"><Pencil className="w-4 h-4" /> Rename {modal.kind}</span>} onClose={closeModal}>
          <input
            defaultValue={modal.current}
            onChange={(e) => setRenameVal(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 mb-4 transition-colors"
            autoFocus
          />
          <div className="flex gap-2 justify-end">
            <button onClick={closeModal} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
            <button onClick={() => { if (renameVal.trim()) renameDoc(modal.id, renameVal.trim()); toast.success("Renamed"); closeModal(); }}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors">Save</button>
          </div>
        </ModalShell>
      )}
      {modal.type === "invite" && (
        <ModalShell title={<span className="flex items-center gap-2"><UserPlus className="w-4 h-4" /> Invite member</span>} onClose={closeModal}>
          <div className="space-y-3 mb-5">
            <input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="colleague@company.com"
              className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-colors" />
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={closeModal} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
            <button onClick={() => { toast.success(`Invite sent to ${inviteEmail}`); closeModal(); }}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors">Send invite</button>
          </div>
        </ModalShell>
      )}
      {modal.type === "share" && (
        <ModalShell title={<span className="flex items-center gap-2"><Share2 className="w-4 h-4" /> Share {modal.name}</span>} onClose={closeModal}>
          <div className="mb-4">
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Share link</label>
            <div className="flex gap-2">
              <input readOnly value={`https://haxon.app/share/${Math.random().toString(36).slice(2, 10)}`}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500" />
              <button onClick={() => toast.success("Link copied!")} className="px-3 py-2 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-colors">Copy</button>
            </div>
          </div>
          <button onClick={closeModal} className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Done</button>
        </ModalShell>
      )}
      {modal.type === "createWorkspace" && (
        <ModalShell title="Create workspace" onClose={closeModal}>
          <div className="space-y-4 mb-5">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">Workspace name</label>
              <input value={wsName} onChange={(e) => setWsName(e.target.value)} placeholder="Acme Corp"
                className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-colors" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-2 block">Icon</label>
              <div className="flex gap-2">
                {["🌊", "💡", "🏠", "🚀", "🎯", "⚡"].map((e) => (
                  <button key={e} onClick={() => setWsEmoji(e)}
                    className={`w-9 h-9 text-lg rounded-lg border-2 transition-colors ${wsEmoji === e ? "border-orange-500 bg-orange-50 dark:bg-orange-950" : "border-gray-100 dark:border-gray-700 hover:border-gray-300"}`}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={closeModal} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
            <button onClick={() => {
              if (!wsName.trim()) { toast.error("Enter a workspace name"); return; }
              addWorkspace(wsName.trim(), wsEmoji);
              toast.success(`Workspace "${wsName}" created!`);
              closeModal();
            }}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors">Create</button>
          </div>
        </ModalShell>
      )}
    </AnimatePresence>
  );
}
