"use client";

import {
  ClipboardList,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Loader2,
  Search,
  X,
  Pencil,
  Trash2,
  Circle,
  ChevronDown,
  CalendarDays,
} from "lucide-react";

import { useTaskManager, type StatusFilter } from "@/hooks/useTaskManager";
import type { Task, TaskPriority } from "@/types/task";

// ─── Priority badge config ───────────────────────
const PRIORITY_STYLES: Record<TaskPriority, string> = {
  high: "bg-rose-500/15 text-rose-400 ring-rose-500/20",
  medium: "bg-amber-500/15 text-amber-400 ring-amber-500/20",
  low: "bg-sky-500/15 text-sky-400 ring-sky-500/20",
};

const STATUS_TABS: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Open", value: "open" },
  { label: "Completed", value: "completed" },
];

// ───────────────────────────────────────────────
// Stat card
// ───────────────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-5 py-4 backdrop-blur-sm transition-colors hover:bg-white/[0.05]">
      <div className={`rounded-lg p-2 ${accent}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        <p className="text-xs text-slate-400">{label}</p>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────
// Skeleton cards (hydration loading)
// ───────────────────────────────────────────────
function SkeletonCards() {
  return (
    <div className="mx-auto grid w-full max-w-5xl gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="skeleton h-32 rounded-xl border border-white/[0.04]"
        />
      ))}
    </div>
  );
}

// ───────────────────────────────────────────────
// Empty state
// ───────────────────────────────────────────────
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 py-24 text-center">
      <div className="relative">
        <div className="absolute -inset-6 rounded-full bg-violet-500/10 blur-2xl" />
        <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur">
          <ClipboardList className="h-12 w-12 text-violet-400" strokeWidth={1.5} />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight text-slate-100">
          No tasks yet
        </h2>
        <p className="text-sm leading-relaxed text-slate-400">
          Get started by creating your first task.
          <br />
          Stay organised, hit deadlines, ship faster.
        </p>
      </div>

      <button
        id="empty-state-add-task"
        onClick={onAdd}
        className="focus-ring group inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-violet-600/20 transition-all hover:bg-violet-500 hover:shadow-violet-500/30 active:scale-[0.97]"
      >
        <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
        Add your first task
      </button>
    </div>
  );
}

// ───────────────────────────────────────────────
// No-results state (filters matched nothing)
// ───────────────────────────────────────────────
function NoResults({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <Search className="h-10 w-10 text-slate-600" strokeWidth={1.5} />
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-300">No matching tasks</p>
        <p className="text-xs text-slate-500">Try a different search or filter.</p>
      </div>
      <button
        onClick={onClear}
        className="focus-ring text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors"
      >
        Clear filters
      </button>
    </div>
  );
}

// ───────────────────────────────────────────────
// Task card
// ───────────────────────────────────────────────
function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
}: {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}) {
  const isCompleted = task.status === "completed";
  const isOverdue =
    !isCompleted &&
    task.dueDate &&
    new Date(task.dueDate) < new Date();

  return (
    <div
      className={`group rounded-xl border bg-white/[0.02] p-4 backdrop-blur-sm transition-all hover:bg-white/[0.04] ${
        isCompleted
          ? "border-white/[0.04] opacity-60"
          : "border-white/[0.06]"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Toggle button */}
        <button
          id={`toggle-${task.id}`}
          onClick={() => onToggle(task.id)}
          className="focus-ring mt-0.5 shrink-0 rounded-md p-0.5 transition-colors hover:bg-white/[0.06]"
          aria-label={isCompleted ? "Mark as open" : "Mark as completed"}
        >
          {isCompleted ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          ) : (
            <Circle className="h-5 w-5 text-slate-500 group-hover:text-slate-400" />
          )}
        </button>

        {/* Content */}
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <h3
              className={`truncate text-sm font-medium ${
                isCompleted
                  ? "text-slate-500 line-through"
                  : "text-slate-100"
              }`}
            >
              {task.title}
            </h3>
            <span
              className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ring-inset ${PRIORITY_STYLES[task.priority]}`}
            >
              {task.priority}
            </span>
          </div>

          {task.description && (
            <p className="line-clamp-2 text-xs leading-relaxed text-slate-400">
              {task.description}
            </p>
          )}

          {task.dueDate && (
            <div
              className={`inline-flex items-center gap-1 text-[11px] ${
                isOverdue ? "text-rose-400" : "text-slate-500"
              }`}
            >
              <CalendarDays className="h-3 w-3" />
              {isOverdue && "Overdue · "}
              {new Date(task.dueDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          )}
        </div>

        {/* Actions (visible on hover) */}
        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            id={`edit-${task.id}`}
            onClick={() => onEdit(task)}
            className="focus-ring rounded-md p-1.5 text-slate-500 transition-colors hover:bg-white/[0.06] hover:text-slate-300"
            aria-label="Edit task"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            id={`delete-${task.id}`}
            onClick={() => onDelete(task.id)}
            className="focus-ring rounded-md p-1.5 text-slate-500 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
            aria-label="Delete task"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────
// Task form (create / edit)
// ───────────────────────────────────────────────
function TaskForm({
  formState,
  formErrors,
  editingTaskId,
  onFieldChange,
  onSubmit,
  onCancel,
}: {
  formState: ReturnType<typeof useTaskManager>["formState"];
  formErrors: ReturnType<typeof useTaskManager>["formErrors"];
  editingTaskId: string | null;
  onFieldChange: ReturnType<typeof useTaskManager>["updateFormField"];
  onSubmit: () => void;
  onCancel: () => void;
}) {
  const isEditing = editingTaskId !== null;

  return (
    <div className="rounded-xl border border-violet-500/20 bg-violet-500/[0.04] p-5 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">
          {isEditing ? "Edit Task" : "New Task"}
        </h3>
        <button
          onClick={onCancel}
          className="focus-ring rounded-md p-1 text-slate-500 transition-colors hover:text-slate-300"
          aria-label="Close form"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="task-title" className="mb-1 block text-xs font-medium text-slate-400">
            Title <span className="text-rose-400">*</span>
          </label>
          <input
            id="task-title"
            type="text"
            placeholder="What needs to be done?"
            value={formState.title}
            onChange={(e) => onFieldChange("title", e.target.value)}
            className={`focus-ring w-full rounded-lg border bg-white/[0.04] px-3 py-2 text-sm text-slate-100 placeholder-slate-600 outline-none transition-colors ${
              formErrors.title
                ? "border-rose-500/50"
                : "border-white/[0.08] focus:border-violet-500/40"
            }`}
          />
          {formErrors.title && (
            <p className="mt-1 text-xs text-rose-400">{formErrors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="task-description" className="mb-1 block text-xs font-medium text-slate-400">
            Description
          </label>
          <textarea
            id="task-description"
            rows={2}
            placeholder="Add details…"
            value={formState.description}
            onChange={(e) => onFieldChange("description", e.target.value)}
            className="focus-ring w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-slate-100 placeholder-slate-600 outline-none transition-colors focus:border-violet-500/40 resize-none"
          />
        </div>

        {/* Priority + Due Date row */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="task-priority" className="mb-1 block text-xs font-medium text-slate-400">
              Priority
            </label>
            <div className="relative">
              <select
                id="task-priority"
                value={formState.priority}
                onChange={(e) =>
                  onFieldChange("priority", e.target.value as TaskPriority)
                }
                className="focus-ring w-full appearance-none rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 pr-8 text-sm text-slate-100 outline-none transition-colors focus:border-violet-500/40"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
            </div>
          </div>

          <div>
            <label htmlFor="task-duedate" className="mb-1 block text-xs font-medium text-slate-400">
              Due Date
            </label>
            <input
              id="task-duedate"
              type="date"
              value={formState.dueDate}
              onChange={(e) => onFieldChange("dueDate", e.target.value)}
              className="focus-ring w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-slate-100 outline-none transition-colors focus:border-violet-500/40"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            onClick={onCancel}
            className="focus-ring rounded-lg px-4 py-2 text-xs font-medium text-slate-400 transition-colors hover:text-slate-200"
          >
            Cancel
          </button>
          <button
            id="submit-task"
            onClick={onSubmit}
            className="focus-ring inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-5 py-2 text-xs font-medium text-white shadow-md shadow-violet-600/20 transition-all hover:bg-violet-500 active:scale-[0.97]"
          >
            {isEditing ? "Save Changes" : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────
// Page root
// ───────────────────────────────────────────────
export default function HomePage() {
  const tm = useTaskManager();

  const isEmpty = tm.hydrated && tm.tasks.length === 0;
  const hasFiltered = tm.hydrated && tm.tasks.length > 0;

  return (
    <main className="flex flex-1 flex-col">
      {/* ── Header ─────────────────────────────── */}
      <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-violet-600 p-2 shadow-lg shadow-violet-600/25">
              <ClipboardList className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
              TaskFlow
            </h1>
          </div>

          {hasFiltered && (
            <button
              id="header-add-task"
              onClick={tm.openCreateForm}
              className="focus-ring group inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-violet-600/20 transition-all hover:bg-violet-500 hover:shadow-violet-500/30 active:scale-[0.97]"
            >
              <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
              <span className="hidden sm:inline">New Task</span>
            </button>
          )}
        </div>
      </header>

      {/* ── Content ────────────────────────────── */}
      <section className="flex-1 py-8 sm:py-10">
        {/* Loading skeleton */}
        {!tm.hydrated && (
          <div className="flex flex-col items-center gap-8">
            <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
            <SkeletonCards />
          </div>
        )}

        {/* Empty state */}
        {isEmpty && <EmptyState onAdd={tm.openCreateForm} />}

        {/* Active workspace */}
        {hasFiltered && (
          <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6">
            {/* Stats strip */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={ClipboardList}
                label="Total Tasks"
                value={tm.stats.total}
                accent="bg-slate-700/60 text-slate-300"
              />
              <StatCard
                icon={Clock}
                label="Open"
                value={tm.stats.open}
                accent="bg-sky-900/50 text-sky-400"
              />
              <StatCard
                icon={CheckCircle2}
                label="Completed"
                value={tm.stats.completed}
                accent="bg-emerald-900/50 text-emerald-400"
              />
              <StatCard
                icon={AlertTriangle}
                label="High Priority"
                value={tm.stats.highPriority}
                accent="bg-amber-900/50 text-amber-400"
              />
            </div>

            {/* Search + Status filter bar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* Search */}
              <div className="relative max-w-xs flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="search-tasks"
                  type="text"
                  placeholder="Search tasks…"
                  value={tm.searchQuery}
                  onChange={(e) => tm.setSearchQuery(e.target.value)}
                  className="focus-ring w-full rounded-lg border border-white/[0.08] bg-white/[0.04] py-2 pl-9 pr-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition-colors focus:border-violet-500/40"
                />
                {tm.searchQuery && (
                  <button
                    onClick={() => tm.setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-500 hover:text-slate-300"
                    aria-label="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Status tabs */}
              <div className="inline-flex rounded-lg border border-white/[0.08] bg-white/[0.02] p-0.5">
                {STATUS_TABS.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => tm.setStatusFilter(tab.value)}
                    className={`focus-ring rounded-md px-3.5 py-1.5 text-xs font-medium transition-all ${
                      tm.statusFilter === tab.value
                        ? "bg-violet-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Inline create / edit form */}
            {tm.isFormOpen && (
              <TaskForm
                formState={tm.formState}
                formErrors={tm.formErrors}
                editingTaskId={tm.editingTaskId}
                onFieldChange={tm.updateFormField}
                onSubmit={
                  tm.editingTaskId ? tm.handleEditTask : tm.handleCreateTask
                }
                onCancel={tm.resetForm}
              />
            )}

            {/* Task list */}
            {tm.filteredTasks.length > 0 ? (
              <div className="space-y-2">
                {tm.filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={tm.handleToggleComplete}
                    onEdit={tm.openEditForm}
                    onDelete={tm.handleDeleteTask}
                  />
                ))}
              </div>
            ) : (
              <NoResults
                onClear={() => {
                  tm.setSearchQuery("");
                  tm.setStatusFilter("all");
                }}
              />
            )}
          </div>
        )}
      </section>

      {/* ── Footer ─────────────────────────────── */}
      <footer className="border-t border-white/[0.06] bg-white/[0.02]">
        <div className="mx-auto max-w-5xl px-4 py-4 text-center text-xs text-slate-500 sm:px-6">
          TaskFlow &middot; Data stored locally in your browser
        </div>
      </footer>
    </main>
  );
}
