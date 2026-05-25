"use client";
import { useEffect } from "react";
import { useAppStore } from "@/store/app-store";
import { Sidebar } from "./sidebar";
import { CommandPalette } from "./command-palette";
import { ModalRouter } from "@/components/modals/modal-router";

export default function ProductShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, login } = useAppStore();

  useEffect(() => {
    if (!isAuthenticated) {
      login("maya@haxon.app");
    }
  }, [isAuthenticated, login]);

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-[#030712]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </div>
      <ModalRouter />
      <CommandPalette />
    </div>
  );
}
