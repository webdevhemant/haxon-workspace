"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { useAppStore } from "@/store/app-store";
import { useCan, useCurrentRole } from "@/lib/use-can";
import type { Card } from "@/types";
import { CardDetailHeader } from "./card-detail/header";
import { CardDetailTitleAndDescription } from "./card-detail/description";
import { CardDetailSubtasks } from "./card-detail/subtasks";
import { CardDetailComments } from "./card-detail/comments";
import { CardDetailSidebar } from "./card-detail/sidebar";

export function CardDetailModal({
  card, colId, boardId, open, onClose,
}: { card: Card; colId: string; boardId: string; open: boolean; onClose: () => void }) {
  const {
    updateCard, moveCardByStatus,
    addSubtask, toggleSubtask, deleteSubtask,
    addComment, toggleFollower,
    boards,
  } = useAppStore();
  const role = useCurrentRole();
  const canEdit = useCan("board.edit");
  const canComment = useCan("comment.add");

  const board = boards.find((b) => b.id === boardId);
  const currentCol = board?.columns.find((c) => c.id === colId);

  const subtasks = card.subtasks ?? [];
  const comments = card.comments ?? [];
  const labels = card.labels ?? [];

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          style={{ width: "min(860px, 96vw)", maxHeight: "90vh" }}
        >
          <CardDetailHeader currentCol={currentCol} cardId={card.id} onClose={onClose} />

          <div className="flex-1 overflow-hidden flex min-h-0">
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              <CardDetailTitleAndDescription
                cardId={card.id}
                initialTitle={card.title}
                initialDescription={card.description ?? ""}
                onCommitTitle={(v) => updateCard(boardId, colId, card.id, { title: v })}
                onCommitDescription={(v) => updateCard(boardId, colId, card.id, { description: v })}
                canEdit={canEdit}
              />

              <CardDetailSubtasks
                subtasks={subtasks}
                onToggle={(stId) => toggleSubtask(boardId, colId, card.id, stId)}
                onDelete={(stId) => deleteSubtask(boardId, colId, card.id, stId)}
                onAdd={(title) => addSubtask(boardId, colId, card.id, title)}
                canEdit={canEdit}
              />

              <CardDetailComments
                comments={comments}
                onAdd={(text) => addComment(boardId, colId, card.id, text)}
                canComment={canComment}
                role={role}
              />
            </div>

            <CardDetailSidebar
              card={card}
              colId={colId}
              board={board}
              currentCol={currentCol}
              onMoveStatus={(name) => moveCardByStatus(boardId, card.id, name)}
              onUpdatePriority={(priority) => updateCard(boardId, colId, card.id, { priority })}
              onUpdateAssignee={(assigneeId) => updateCard(boardId, colId, card.id, { assigneeId })}
              onUpdateStartDate={(iso) => updateCard(boardId, colId, card.id, { startDate: iso })}
              onUpdateDueDate={(iso) => updateCard(boardId, colId, card.id, { dueDate: iso ?? "—" })}
              onAddLabel={(label) => updateCard(boardId, colId, card.id, { labels: [...labels, label] })}
              onRemoveLabel={(label) => updateCard(boardId, colId, card.id, { labels: labels.filter((l) => l !== label) })}
              onToggleFollower={(userId) => toggleFollower(boardId, colId, card.id, userId)}
              canEdit={canEdit}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
