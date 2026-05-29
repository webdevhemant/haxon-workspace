"use client";

export function ChatDateDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 px-4 my-2 select-none">
      <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
      <span className="text-[10.5px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider bg-white dark:bg-gray-950 px-2 py-0.5 rounded-full border border-gray-100 dark:border-gray-800">
        {label}
      </span>
      <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
    </div>
  );
}

export function ChatUnreadDivider({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-2 px-4 my-1 select-none">
      <div className="flex-1 h-px bg-orange-300 dark:bg-orange-700" />
      <span className="text-[10px] font-bold text-orange-600 dark:text-orange-300 uppercase tracking-wider">
        New · {count}
      </span>
      <div className="w-6 h-px bg-orange-300 dark:bg-orange-700" />
    </div>
  );
}
