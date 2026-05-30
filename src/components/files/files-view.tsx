"use client";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Search, Upload, Star, Download, MoreHorizontal, LayoutGrid, List } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Topbar, Breadcrumb } from "@/components/layout/topbar";
import { useAppStore } from "@/store/app-store";
import { UserAvatar } from "@/components/ui/user-avatar";
import { USERS } from "@/data/dummy-users";
import { FILES, FILE_KIND_LABEL, type FileAsset, type FileKind } from "@/data/dummy-files";
import { cn } from "@/lib/utils";
import { FileThumb } from "./file-thumb";

type View = "grid" | "list";

export default function FilesView() {
  const { workspaces, activeWorkspaceId } = useAppStore();
  const ws = workspaces.find((w) => w.id === activeWorkspaceId);
  const [files, setFiles] = useState<FileAsset[]>(FILES);
  const [view, setView] = useState<View>("grid");
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState<"all" | FileKind | "starred">("all");

  const kinds = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const f of files) counts[f.kind] = (counts[f.kind] ?? 0) + 1;
    return counts;
  }, [files]);

  const starredCount = files.filter((f) => f.starred).length;

  const filtered = files.filter((f) => {
    if (kind === "starred") {
      if (!f.starred) return false;
    } else if (kind !== "all" && f.kind !== kind) return false;
    if (search) {
      const hay = `${f.name} ${f.source} ${f.tags.join(" ")}`.toLowerCase();
      if (!hay.includes(search.toLowerCase())) return false;
    }
    return true;
  });

  const toggleStar = (id: string) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, starred: !f.starred } : f)));
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-white dark:bg-gray-950">
      <Topbar
        left={<Breadcrumb items={[{ label: ws?.name ?? "" }, { label: "Files" }]} />}
        right={
          <button
            onClick={() => toast.info("Choose a file to upload…")}
            className="flex items-center gap-1.5 h-7 px-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <Upload className="w-3 h-3" /> Upload
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto">
        <div className="px-6 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Files</h1>
            <span className="text-[12px] text-gray-400 tabular-nums">
              {files.length} total · {(files.reduce((sum, f) => sum + parseFloat(f.size), 0)).toFixed(1)} MB used
            </span>
            <div className="flex-1" />
            <div className="flex items-center gap-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
              <ViewBtn active={view === "grid"} onClick={() => setView("grid")}>
                <LayoutGrid className="w-3.5 h-3.5" /> Grid
              </ViewBtn>
              <ViewBtn active={view === "list"} onClick={() => setView("list")}>
                <List className="w-3.5 h-3.5" /> List
              </ViewBtn>
            </div>
          </div>

          <div className="flex items-center gap-1.5 h-9 px-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg max-w-md">
            <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search files…"
              className="flex-1 outline-none bg-transparent text-[13px] text-gray-700 dark:text-gray-300 placeholder-gray-400"
            />
          </div>
        </div>

        <div className="px-6 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center gap-1.5 overflow-x-auto">
          <KindChip active={kind === "all"} onClick={() => setKind("all")}>All <span className="text-gray-400 tabular-nums">{files.length}</span></KindChip>
          <KindChip active={kind === "starred"} onClick={() => setKind("starred")}>
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> Starred <span className="text-gray-400 tabular-nums">{starredCount}</span>
          </KindChip>
          {(Object.keys(FILE_KIND_LABEL) as FileKind[]).map((k) => {
            const c = kinds[k] ?? 0;
            if (c === 0) return null;
            return (
              <KindChip key={k} active={kind === k} onClick={() => setKind(k)}>
                {FILE_KIND_LABEL[k]} <span className="text-gray-400 tabular-nums">{c}</span>
              </KindChip>
            );
          })}
        </div>

        <section className="px-6 py-5">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-sm text-gray-400">No files match.</div>
          ) : view === "grid" ? (
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filtered.map((f) => (
                <FileCard key={f.id} file={f} onStar={() => toggleStar(f.id)} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              {filtered.map((f, i) => (
                <FileRow key={f.id} file={f} onStar={() => toggleStar(f.id)} first={i === 0} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function FileCard({ file, onStar }: { file: FileAsset; onStar: () => void }) {
  const owner = USERS.find((u) => u.id === file.uploadedById);
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 hover:border-gray-300 dark:hover:border-gray-700 transition-all cursor-pointer group">
      <div className="flex items-start justify-between mb-2.5">
        <FileThumb kind={file.kind} color={file.thumbColor} size={40} />
        <button
          onClick={(e) => { e.stopPropagation(); onStar(); }}
          className="w-6 h-6 flex items-center justify-center rounded text-gray-300 hover:text-amber-500 transition-colors"
          title={file.starred ? "Unstar" : "Star"}
        >
          <Star className={cn("w-3.5 h-3.5", file.starred && "text-amber-500 fill-amber-500")} />
        </button>
      </div>
      <div className="text-[12.5px] font-semibold text-gray-900 dark:text-white truncate mb-0.5" title={file.name}>
        {file.name}
      </div>
      <div className="text-[10.5px] text-gray-400 tabular-nums">{file.size} · {file.source}</div>
      <div className="mt-2 flex items-center justify-between">
        {owner && <UserAvatar user={owner} size={18} />}
        <span className="text-[10px] text-gray-400">{file.uploadedAt}</span>
      </div>
    </div>
  );
}

function FileRow({ file, onStar, first }: { file: FileAsset; onStar: () => void; first: boolean }) {
  const owner = USERS.find((u) => u.id === file.uploadedById);
  return (
    <div className={cn(
      "flex items-center gap-3 px-3 py-2 hover:bg-gray-50/60 dark:hover:bg-gray-900/40 transition-colors cursor-pointer",
      !first && "border-t border-gray-100 dark:border-gray-800",
    )}>
      <FileThumb kind={file.kind} color={file.thumbColor} size={28} />
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-gray-900 dark:text-white truncate">{file.name}</div>
        <div className="text-[11px] text-gray-400">{file.source} · {file.size} · {file.uploadedAt}</div>
      </div>
      <div className="hidden md:flex items-center gap-1.5">
        {file.tags.slice(0, 2).map((t) => (
          <span key={t} className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded">
            {t}
          </span>
        ))}
      </div>
      {owner && <UserAvatar user={owner} size={22} />}
      <button
        onClick={(e) => { e.stopPropagation(); onStar(); }}
        className="w-7 h-7 flex items-center justify-center rounded text-gray-300 hover:text-amber-500 transition-colors"
      >
        <Star className={cn("w-3.5 h-3.5", file.starred && "text-amber-500 fill-amber-500")} />
      </button>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={(e) => e.stopPropagation()}>
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content align="end" sideOffset={4} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-1 w-40 z-50">
            <DropdownMenu.Item onSelect={() => toast.success(`${file.name} downloaded`)} className="flex items-center gap-2 px-2 py-1.5 text-sm rounded cursor-pointer outline-none text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              <Download className="w-3.5 h-3.5" /> Download
            </DropdownMenu.Item>
            <DropdownMenu.Item onSelect={() => {
              if (typeof navigator !== "undefined" && navigator.clipboard) navigator.clipboard.writeText(`https://haxon.app/files/${file.id}`).catch(() => undefined);
              toast.success("Link copied");
            }} className="px-2 py-1.5 text-sm rounded cursor-pointer outline-none text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
              Copy link
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}

function KindChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
        active
          ? "bg-orange-500 text-white"
          : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
      }`}
    >
      {children}
    </button>
  );
}

function ViewBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[11.5px] font-medium transition-colors cursor-pointer ${
        active
          ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
          : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
      }`}
    >
      {children}
    </button>
  );
}
