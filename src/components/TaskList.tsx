"use client";

import { Search, Inbox, Plus } from "lucide-react";
import type { Task } from "@/types/task";
import { TaskCard } from "@/components/TaskCard";

// ─── Types ───────────────────────────────────────
interface TaskListProps {
  tasks: Task[];
  hasAnyTasks: boolean;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onClearFilters: () => void;
  onAddFirst: () => void;
}

// ─── Empty state: brand new user ─────────────────
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="animate-fade-in mx-auto flex max-w-sm flex-col items-center gap-6 py-20 text-center">
      {/* Floating illustration */}
      <div className="relative">
        {/* Outer glow */}
        <div className="absolute -inset-8 rounded-full bg-violet-500/[0.07] blur-3xl" />
        <div className="absolute -inset-4 rounded-full bg-violet-500/[0.05] blur-xl" />

        {/* Icon card */}
        <div className="relative rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-7 shadow-2xl shadow-violet-500/[0.06] backdrop-blur-sm">
          <Inbox className="h-14 w-14 text-violet-400" strokeWidth={1.2} />
        </div>

        {/* Decorative floating dots */}
        <div className="absolute -right-3 -top-2 h-2 w-2 rounded-full bg-violet-500/40 animate-pulse" />
        <div className="absolute -bottom-1 -left-3 h-1.5 w-1.5 rounded-full bg-sky-500/40 animate-pulse [animation-delay:0.5s]" />
      </div>

      <div className="space-y-2.5">
        <h2 className="text-lg font-semibold tracking-tight text-slate-100">
          Your workspace is empty
        </h2>
        <p className="text-sm leading-relaxed text-slate-500">
          Create your first task and start tracking
          <br />
          your work with clarity and focus.
        </p>
      </div>

      <button
        id="empty-state-add-task"
        onClick={onAdd}
        className="focus-ring group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-violet-600/20 transition-all hover:shadow-violet-500/30 active:scale-[0.97]"
      >
        <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
        Create First Task
      </button>
    </div>
  );
}

// ─── No results state: filters matched nothing ───
function NoResults({ onClear }: { onClear: () => void }) {
  return (
    <div className="animate-fade-in flex flex-col items-center gap-5 py-16 text-center">
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
        <Search className="h-10 w-10 text-slate-600" strokeWidth={1.3} />
      </div>
      <div className="space-y-1.5">
        <p className="text-sm font-semibold text-slate-300">
          No tasks match your filters
        </p>
        <p className="text-xs text-slate-500">
          Try adjusting your search query or status filter.
        </p>
      </div>
      <button
        id="clear-all-filters"
        onClick={onClear}
        className="focus-ring rounded-lg border border-white/[0.08] px-4 py-1.5 text-xs font-medium text-violet-400 transition-all hover:border-violet-500/30 hover:bg-violet-500/[0.06] hover:text-violet-300"
      >
        Clear all filters
      </button>
    </div>
  );
}

// ─── Main component ──────────────────────────────
export function TaskList({
  tasks,
  hasAnyTasks,
  onToggle,
  onEdit,
  onDelete,
  onClearFilters,
  onAddFirst,
}: TaskListProps) {
  // No tasks at all → first-run empty state
  if (!hasAnyTasks) {
    return <EmptyState onAdd={onAddFirst} />;
  }

  // Has tasks but filters matched nothing
  if (tasks.length === 0) {
    return <NoResults onClear={onClearFilters} />;
  }

  // Task list
  return (
    <div className="space-y-2.5">
      {/* List header */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-medium text-slate-500">
          Showing{" "}
          <span className="tabular-nums text-slate-400">{tasks.length}</span>{" "}
          task{tasks.length !== 1 && "s"}
        </p>
      </div>

      {/* Cards */}
      <div className="space-y-2">
        {tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            index={index}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
