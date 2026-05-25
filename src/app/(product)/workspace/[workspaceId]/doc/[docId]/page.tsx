import DocEditorView from "@/components/editor/doc-editor-view";
export default function DocPage({ params }: { params: Promise<{ workspaceId: string; docId: string }> }) {
  return <DocEditorView params={params} />;
}
