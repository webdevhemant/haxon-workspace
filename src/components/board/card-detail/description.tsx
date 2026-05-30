"use client";
import { useEffect, useState } from "react";

export function CardDetailTitleAndDescription({
  cardId,
  initialTitle,
  initialDescription,
  onCommitTitle,
  onCommitDescription,
  canEdit,
}: {
  cardId: string;
  initialTitle: string;
  initialDescription: string;
  onCommitTitle: (v: string) => void;
  onCommitDescription: (v: string) => void;
  canEdit: boolean;
}) {
  const [titleVal, setTitleVal] = useState(initialTitle);
  const [descVal, setDescVal] = useState(initialDescription);

  useEffect(() => {
    setTitleVal(initialTitle);
    setDescVal(initialDescription);
  }, [cardId, initialTitle, initialDescription]);

  if (!canEdit) {
    return (
      <>
        <h2 className="w-full text-xl font-bold tracking-tight text-gray-900 dark:text-white">
          {initialTitle || "Untitled"}
        </h2>
        <div>
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</div>
          <div className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap min-h-[60px]">
            {initialDescription || <span className="text-gray-400">No description.</span>}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <input
        value={titleVal}
        onChange={(e) => setTitleVal(e.target.value)}
        onBlur={() => onCommitTitle(titleVal)}
        className="w-full text-xl font-bold tracking-tight bg-transparent border-0 outline-none text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 focus:ring-0"
        placeholder="Card title…"
      />

      <div>
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</div>
        <textarea
          value={descVal}
          onChange={(e) => setDescVal(e.target.value)}
          onBlur={() => onCommitDescription(descVal)}
          placeholder="Add a description…"
          rows={3}
          className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 rounded-lg text-sm resize-none outline-none focus:border-orange-400 dark:focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15 text-gray-700 dark:text-gray-300 placeholder-gray-400 transition-colors"
        />
      </div>
    </>
  );
}
