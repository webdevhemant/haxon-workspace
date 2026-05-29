import type { Board, Card } from "@/types";

export type FlatCard = Card & { colId: string; colName: string; colColor: string };

export function flattenBoard(board: Board): FlatCard[] {
  return board.columns.flatMap((col) =>
    col.cards.map((card) => ({ ...card, colId: col.id, colName: col.name, colColor: col.color })),
  );
}
