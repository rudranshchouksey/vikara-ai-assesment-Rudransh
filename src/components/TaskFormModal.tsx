"use client";

import { useRef, useEffect } from "react";
import {
  X,
  Sparkles,
  ChevronDown,
  AlertCircle,
  CalendarDays,
  Flag,
  Type,
  AlignLeft,
} from "lucide-react";
import type { TaskPriority } from "@/types/task";
import type { TaskFormState, TaskFormErrors } from "@/hooks/useTaskManager";

// ─── Types ───────────────────────────────────────
interface TaskFormModalProps {
  isOpen: boolean;
  formState: TaskFormState;
  formErrors: TaskFormErrors;
  editingTaskId: string | null;
  onFieldChange: <K extends keyof TaskFormState>(
    field: K,
    value: TaskFormState[K],
  ) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

// ─── Priority option config ─────────────────────
const PRIORITY_OPTIONS: {
  value: TaskPriority;
  label: string;
  color: string;
}[] = [
  { value: "low",    label: "Low",    color: "text-sky-400" },
  { value: "medium", label: "Medium", color: "text-amber-400" },
  { value: "high",   label: "High",   color: "text-rose-400" },
];

// ─── Component ───────────────────────────────────
export function TaskFormModal({
  isOpen,
  formState,
  formErrors,
  editingTaskId,
  onFieldChange,
  onSubmit,
  onCancel,
}: TaskFormModalProps) {
  const titleRef = useRef<HTMLInputElement>(null);
  const isEditing = editingTaskId !== null;

  // Auto-focus title input when modal opens
  useEffect(() => {
    if (isOpen) {
      // Small delay to let animation start
      const t = setTimeout(() => titleRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    /* ── Backdrop ──────────────────────────────── */
    <div
      className="animate-backdrop fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm sm:pt-[15vh]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      {/* ── Modal card ──────────────────────────── */}
      <div className="animate-modal w-full max-w-lg">
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-slate-900/95 to-slate-950/95 shadow-2xl shadow-black/40 backdrop-blur-xl"
        >
          {/* ── Header ───────────────────────────── */}
          <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
            <div className="flex items-center gap-2.5">
              <div className="rounded-lg bg-violet-600/20 p-1.5">
                <Sparkles className="h-4 w-4 text-violet-400" />
              </div>
              <h2 className="text-sm font-semibold tracking-tight text-slate-100">
                {isEditing ? "Edit Task" : "Create New Task"}
              </h2>
            </div>
            <button
              type="button"
              onClick={onCancel}
              className="focus-ring rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-white/[0.06] hover:text-slate-300"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* ── Body ─────────────────────────────── */}
          <div className="space-y-5 px-6 py-5">
            {/* Title field */}
            <div>
              <label
                htmlFor="task-title"
                className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-400"
              >
                <Type className="h-3 w-3" />
                Title
                <span className="text-rose-400">*</span>
              </label>
              <input
                ref={titleRef}
                id="task-title"
                type="text"
                placeholder="What needs to be done?"
                value={formState.title}
                onChange={(e) => onFieldChange("title", e.target.value)}
                className={`focus-ring w-full rounded-xl border bg-white/[0.03] px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all ${
                  formErrors.title
                    ? "border-rose-500/50 bg-rose-500/[0.04]"
                    : "border-white/[0.08] focus:border-violet-500/40 focus:bg-white/[0.05]"
                }`}
              />
              {formErrors.title && (
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-400">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {formErrors.title}
                </div>
              )}
            </div>

            {/* Description field */}
            <div>
              <label
                htmlFor="task-description"
                className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-400"
              >
                <AlignLeft className="h-3 w-3" />
                Description
              </label>
              <textarea
                id="task-description"
                rows={3}
                placeholder="Add any extra details or context…"
                value={formState.description}
                onChange={(e) => onFieldChange("description", e.target.value)}
                className="focus-ring w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all focus:border-violet-500/40 focus:bg-white/[0.05]"
              />
            </div>

            {/* Priority + Due Date row */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Priority */}
              <div>
                <label
                  htmlFor="task-priority"
                  className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-400"
                >
                  <Flag className="h-3 w-3" />
                  Priority
                </label>
                <div className="relative">
                  <select
                    id="task-priority"
                    value={formState.priority}
                    onChange={(e) =>
                      onFieldChange("priority", e.target.value as TaskPriority)
                    }
                    className="focus-ring w-full appearance-none rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 pr-9 text-sm text-slate-100 outline-none transition-all focus:border-violet-500/40 focus:bg-white/[0.05]"
                  >
                    {PRIORITY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label
                  htmlFor="task-duedate"
                  className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-400"
                >
                  <CalendarDays className="h-3 w-3" />
                  Due Date
                </label>
                <input
                  id="task-duedate"
                  type="date"
                  value={formState.dueDate}
                  onChange={(e) => onFieldChange("dueDate", e.target.value)}
                  className="focus-ring w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-slate-100 outline-none transition-all focus:border-violet-500/40 focus:bg-white/[0.05]"
                />
              </div>
            </div>
          </div>

          {/* ── Footer ───────────────────────────── */}
          <div className="flex items-center justify-end gap-3 border-t border-white/[0.06] bg-white/[0.01] px-6 py-4">
            <button
              type="button"
              onClick={onCancel}
              className="focus-ring rounded-xl px-4 py-2 text-xs font-medium text-slate-400 transition-colors hover:bg-white/[0.04] hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              id="submit-task"
              type="submit"
              className="focus-ring group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-violet-600/20 transition-all hover:shadow-violet-500/30 active:scale-[0.97]"
            >
              <Sparkles className="h-3.5 w-3.5 transition-transform group-hover:rotate-12" />
              {isEditing ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
