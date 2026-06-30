"use client";

import { Search, X, ListFilter } from "lucide-react";
import type { StatusFilter } from "@/hooks/useTaskManager";

// ─── Types ───────────────────────────────────────
interface ControlBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  counts: {
    all: number;
    open: number;
    completed: number;
  };
}

const STATUS_TABS: { label: string; value: StatusFilter; dotColor: string }[] = [
  { label: "All",       value: "all",       dotColor: "bg-slate-400" },
  { label: "Open",      value: "open",      dotColor: "bg-sky-400" },
  { label: "Completed", value: "completed", dotColor: "bg-emerald-400" },
];

// ─── Component ───────────────────────────────────
export function ControlBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  counts,
}: ControlBarProps) {
  const countMap: Record<StatusFilter, number> = {
    all: counts.all,
    open: counts.open,
    completed: counts.completed,
  };

  return (
    <div className="glass-card animate-fade-in flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
      {/* ── Search input ────────────────────────── */}
      <div className="relative flex-1 sm:max-w-xs">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          id="search-tasks"
          type="text"
          placeholder="Search by title…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="focus-ring w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-2.5 pl-10 pr-9 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all focus:border-violet-500/40 focus:bg-white/[0.05]"
        />
        {searchQuery && (
          <button
            id="clear-search"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-slate-500 transition-colors hover:text-slate-300"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* ── Status filter pills ─────────────────── */}
      <div className="flex items-center gap-2">
        <ListFilter className="hidden h-4 w-4 text-slate-600 sm:block" />
        <div className="inline-flex rounded-xl border border-white/[0.06] bg-white/[0.02] p-1">
          {STATUS_TABS.map((tab) => {
            const isActive = statusFilter === tab.value;
            const count = countMap[tab.value];

            return (
              <button
                key={tab.value}
                id={`filter-${tab.value}`}
                onClick={() => onStatusChange(tab.value)}
                className={`focus-ring relative flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/25"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                }`}
              >
                {/* Status dot */}
                {!isActive && (
                  <span className={`h-1.5 w-1.5 rounded-full ${tab.dotColor}`} />
                )}

                {tab.label}

                {/* Count badge */}
                <span
                  className={`inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold tabular-nums ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-white/[0.06] text-slate-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
