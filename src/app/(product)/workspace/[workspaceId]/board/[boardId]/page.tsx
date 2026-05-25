import BoardView from "@/components/board/board-view";
export default function BoardPage({ params }: { params: Promise<{ workspaceId: string; boardId: string }> }) {
  return <BoardView params={params} />;
}
