export type FileKind = "image" | "video" | "doc" | "design" | "data" | "audio" | "other";

export interface FileAsset {
  id: string;
  name: string;
  kind: FileKind;
  size: string;
  source: "Haxon" | "Google Drive" | "Figma" | "Loom" | "GitHub";
  uploadedById: string;
  uploadedAt: string;
  tags: string[];
  starred?: boolean;
  thumbColor: string;
}

export const FILES: FileAsset[] = [
  { id: "f1", name: "Q3-positioning-final.pdf", kind: "doc", size: "1.4 MB", source: "Haxon", uploadedById: "u2", uploadedAt: "10m ago", tags: ["product", "positioning"], thumbColor: "#3B82F6" },
  { id: "f2", name: "empty-state-frame-4.png", kind: "image", size: "412 KB", source: "Figma", uploadedById: "u5", uploadedAt: "1h ago", tags: ["design", "editor"], starred: true, thumbColor: "#F97316" },
  { id: "f3", name: "sync-engine-architecture.png", kind: "image", size: "2.1 MB", source: "Haxon", uploadedById: "u3", uploadedAt: "Yesterday", tags: ["engineering"], thumbColor: "#8B5CF6" },
  { id: "f4", name: "partial-response-demo.mp4", kind: "video", size: "18 MB", source: "Loom", uploadedById: "u1", uploadedAt: "Yesterday", tags: ["ai", "product"], starred: true, thumbColor: "#10B981" },
  { id: "f5", name: "active-workspaces.csv", kind: "data", size: "248 KB", source: "Haxon", uploadedById: "u1", uploadedAt: "2d ago", tags: ["analytics"], thumbColor: "#14B8A6" },
  { id: "f6", name: "all-hands-recording.mp4", kind: "video", size: "112 MB", source: "Loom", uploadedById: "u4", uploadedAt: "2d ago", tags: ["company"], thumbColor: "#F43F5E" },
  { id: "f7", name: "brand-voice-v3.pdf", kind: "doc", size: "856 KB", source: "Google Drive", uploadedById: "u5", uploadedAt: "3d ago", tags: ["brand"], thumbColor: "#EC4899" },
  { id: "f8", name: "haxon-logo-mark.svg", kind: "image", size: "12 KB", source: "Figma", uploadedById: "u5", uploadedAt: "3d ago", tags: ["brand", "design"], thumbColor: "#F59E0B" },
  { id: "f9", name: "pricing-matrix.xlsx", kind: "data", size: "94 KB", source: "Google Drive", uploadedById: "u2", uploadedAt: "4d ago", tags: ["product", "pricing"], thumbColor: "#0EA5E9" },
  { id: "f10", name: "onboarding-flow.fig", kind: "design", size: "8.2 MB", source: "Figma", uploadedById: "u5", uploadedAt: "5d ago", tags: ["design", "onboarding"], thumbColor: "#A855F7" },
  { id: "f11", name: "incident-postmortem.pdf", kind: "doc", size: "320 KB", source: "Haxon", uploadedById: "u3", uploadedAt: "1w ago", tags: ["engineering"], thumbColor: "#EF4444" },
  { id: "f12", name: "podcast-cut.wav", kind: "audio", size: "9.4 MB", source: "Haxon", uploadedById: "u5", uploadedAt: "1w ago", tags: ["marketing"], thumbColor: "#84CC16" },
];

export const FILE_KIND_LABEL: Record<FileKind, string> = {
  image: "Images",
  video: "Videos",
  doc: "Docs",
  design: "Design",
  data: "Data",
  audio: "Audio",
  other: "Other",
};

export const FILE_KIND_EMOJI: Record<FileKind, string> = {
  image: "🖼",
  video: "🎬",
  doc: "📄",
  design: "🎨",
  data: "📊",
  audio: "🎧",
  other: "📦",
};
