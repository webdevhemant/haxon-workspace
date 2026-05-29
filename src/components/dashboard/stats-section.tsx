"use client";
import { FileText, Kanban, Users, Grid3X3 } from "lucide-react";
import { StatCard } from "./stat-card";

export function StatsSection() {
  return (
    <>
      <div className="font-bold text-base tracking-tight mb-3">This week</div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <StatCard label="Docs" value="48" delta="+12" icon={<FileText className="w-3.5 h-3.5" />} color="#3B82F6" />
        <StatCard label="Active boards" value="6" delta="+1" icon={<Kanban className="w-3.5 h-3.5" />} color="#F97316" />
        <StatCard label="Team members" value="12" delta="+2" icon={<Users className="w-3.5 h-3.5" />} color="#8B5CF6" />
        <StatCard label="Storage" value="4.2 GB" icon={<Grid3X3 className="w-3.5 h-3.5" />} color="#10B981" />
      </div>
    </>
  );
}
