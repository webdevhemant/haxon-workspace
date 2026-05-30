"use client";
import { FileText, Image as ImageIcon, Music, Database, Film, Palette, Package } from "lucide-react";
import type { FileKind } from "@/data/dummy-files";

const ICON: Record<FileKind, React.ElementType> = {
  image: ImageIcon,
  video: Film,
  doc: FileText,
  design: Palette,
  data: Database,
  audio: Music,
  other: Package,
};

export function FileThumb({ kind, color, size = 36 }: { kind: FileKind; color: string; size?: number }) {
  const Icon = ICON[kind];
  return (
    <div
      className="rounded-lg flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size, background: color + "22", color }}
    >
      <Icon className="w-1/2 h-1/2" />
    </div>
  );
}
