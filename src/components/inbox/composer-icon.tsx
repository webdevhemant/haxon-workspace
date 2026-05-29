"use client";

interface Props {
  title: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export function ComposerIcon({ title, children, onClick }: Props) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      {children}
    </button>
  );
}
