"use client";

import {
  CheckCircle2,
  Circle,
  Pencil,
  Trash2,
  CalendarDays,
  Clock3,
} from "lucide-react";

import type { Task, TaskPriority } from "@/types/task";

// ─── Priority styling ────────────────────────────
const PRIORITY_CONFIG: Record<
  TaskPriority,
  { badge: string; indicator: string }
> = {
  high: {
    badge: "bg-rose-500/15 text-rose-400 ring-rose-500/25",
    indicator: "bg-rose-500",
  },
  medium: {
    badge: "bg-amber-500/15 text-amber-400 ring-amber-500/25",
    indicator: "bg-amber-500",
  },
  low: {
    badge: "bg-sky-500/15 text-sky-400 ring-sky-500/25",
    indicator: "bg-sky-500",
  },
};

// ─── Relative time formatter ─────────────────────
function formatRelativeTime(isoDate: string): string {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const diffMs = now - then;

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks}w ago`;
  }

  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// ─── Types ───────────────────────────────────────
interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  index: number;
}

// ─── Component ───────────────────────────────────
export function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
  index,
}: TaskCardProps) {
  const isCompleted = task.status === "completed";
  const isOverdue =
    !isCompleted && task.dueDate && new Date(task.dueDate) < new Date();
  const priority = PRIORITY_CONFIG[task.priority];

  return (
    <div
      className="animate-fade-in"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div
        className={`glass-card glass-card-hover group relative overflow-hidden p-4 sm:p-5 transition-all ${
          isCompleted ? "opacity-55" : ""
        }`}
      >
        {/* Left priority indicator bar */}
        <div
          className={`absolute left-0 top-0 h-full w-[3px] rounded-l-[14px] transition-opacity ${
            priority.indicator
          } ${isCompleted ? "opacity-30" : "opacity-80"}`}
        />

        <div className="flex items-start gap-3.5 pl-2">
          {/* ── Toggle checkbox ───────────────────── */}
          <button
            id={`toggle-${task.id}`}
            onClick={() => onToggle(task.id)}
            className="focus-ring mt-0.5 shrink-0 rounded-full p-0.5 transition-all hover:scale-110"
            aria-label={isCompleted ? "Mark as open" : "Mark as completed"}
          >
            {isCompleted ? (
              <CheckCircle2 className="h-[22px] w-[22px] text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.3)]" />
            ) : (
              <Circle className="h-[22px] w-[22px] text-slate-600 transition-colors group-hover:text-slate-400" />
            )}
          </button>

          {/* ── Content ──────────────────────────── */}
          <div className="min-w-0 flex-1 space-y-2">
            {/* Title row */}
            <div className="flex items-center gap-2.5">
              <h3
                className={`text-sm font-semibold leading-snug transition-colors ${
                  isCompleted
                    ? "text-slate-500 line-through decoration-slate-600"
                    : "text-slate-100"
                }`}
              >
                {task.title}
              </h3>
              <span
                className={`inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${priority.badge}`}
              >
                {task.priority}
              </span>
            </div>

            {/* Description */}
            {task.description && (
              <p
                className={`line-clamp-2 text-[13px] leading-relaxed ${
                  isCompleted ? "text-slate-600" : "text-slate-400"
                }`}
              >
                {task.description}
              </p>
            )}

            {/* Meta row: due date + created time */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              {task.dueDate && (
                <div
                  className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${
                    isOverdue
                      ? "text-rose-400"
                      : isCompleted
                        ? "text-slate-600"
                        : "text-slate-500"
                  }`}
                >
                  <CalendarDays className="h-3 w-3" />
                  {isOverdue && (
                    <span className="rounded bg-rose-500/15 px-1 py-px text-[10px] font-bold uppercase text-rose-400">
                      Overdue
                    </span>
                  )}
                  {new Date(task.dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              )}

              <div
                className={`inline-flex items-center gap-1 text-[11px] ${
                  isCompleted ? "text-slate-600" : "text-slate-600"
                }`}
              >
                <Clock3 className="h-3 w-3" />
                {formatRelativeTime(task.createdAt)}
              </div>
            </div>
          </div>

          {/* ── Action buttons (hover reveal) ────── */}
          <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-all group-hover:opacity-100">
            <button
              id={`edit-${task.id}`}
              onClick={() => onEdit(task)}
              className="focus-ring rounded-lg p-2 text-slate-500 transition-all hover:bg-violet-500/10 hover:text-violet-400"
              aria-label="Edit task"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              id={`delete-${task.id}`}
              onClick={() => onDelete(task.id)}
              className="focus-ring rounded-lg p-2 text-slate-500 transition-all hover:bg-rose-500/10 hover:text-rose-400"
              aria-label="Delete task"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
