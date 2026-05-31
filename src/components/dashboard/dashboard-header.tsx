"use client";
import { useState, useEffect } from "react";
import { greet, formatDate } from "@/lib/utils";

export function DashboardHeader({ userName }: { userName: string }) {
  const [greeting, setGreeting] = useState("");
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    setGreeting(greet());
    setDateStr(formatDate());
  }, []);

  return (
    <div className="mb-4">
      <div className="text-[10px] text-gray-400 font-semibold mb-1 uppercase tracking-widest">
        {dateStr}
      </div>
      <h1 className="text-[15px] font-semibold">
        {greeting ? `${greeting}, ${userName.split(" ")[0]}.` : `Hi, ${userName.split(" ")[0]}.`}
      </h1>
    </div>
  );
}
