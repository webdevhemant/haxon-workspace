import { Kanban, List, Grid3X3, Table2, BarChart3 } from "lucide-react";
import type { ViewType } from "@/types";

export const PRIORITY_CONFIG: Record<string, { color: string; label: string }> = {
  Urgent: { color: "#EF4444", label: "Urgent" },
  High:   { color: "#F97316", label: "High" },
  Medium: { color: "#EAB308", label: "Medium" },
  Low:    { color: "#3B82F6", label: "Low" },
  None:   { color: "#9CA3AF", label: "None" },
};

export const PRIORITY_OPTIONS = ["Urgent", "High", "Medium", "Low", "None"] as const;

export const VIEWS: { key: ViewType; icon: React.ReactNode; label: string }[] = [
  { key: "board", icon: <Kanban className="w-3.5 h-3.5" />, label: "Board" },
  { key: "list", icon: <List className="w-3.5 h-3.5" />, label: "List" },
  { key: "grid", icon: <Grid3X3 className="w-3.5 h-3.5" />, label: "Grid" },
  { key: "table", icon: <Table2 className="w-3.5 h-3.5" />, label: "Table" },
  { key: "workload", icon: <BarChart3 className="w-3.5 h-3.5" />, label: "Workload" },
];
