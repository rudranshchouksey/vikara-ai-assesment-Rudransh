"use client";

import {
  ClipboardList,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Loader2,
} from "lucide-react";

import { useTaskManager } from "@/hooks/useTaskManager";
import { ControlBar } from "@/components/ControlBar";
import { TaskFormModal } from "@/components/TaskFormModal";
import { TaskList } from "@/components/TaskList";

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
    <div className="glass-card glass-card-hover flex items-center gap-3.5 px-5 py-4">
      <div className={`rounded-xl p-2.5 ${accent}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-bold tracking-tight tabular-nums">
          {value}
        </p>
        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
          {label}
        </p>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────
// Skeleton loader (pre-hydration)
// ───────────────────────────────────────────────
function SkeletonView() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6">
      {/* Stat skeletons */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="skeleton h-[76px] rounded-[14px] border border-white/[0.04]"
          />
        ))}
      </div>
      {/* Control bar skeleton */}
      <div className="skeleton h-14 rounded-[14px] border border-white/[0.04]" />
      {/* Card skeletons */}
      <div className="space-y-2.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="skeleton h-24 rounded-[14px] border border-white/[0.04]"
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────
// Page root
// ───────────────────────────────────────────────
export default function HomePage() {
  const tm = useTaskManager();
  const hasAnyTasks = tm.tasks.length > 0;

  return (
    <>
      <main className="flex flex-1 flex-col">
        {/* ── Sticky Header ─────────────────────── */}
        <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#06060e]/80 backdrop-blur-2xl">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-violet-600 to-violet-500 p-2 shadow-lg shadow-violet-600/25">
                <ClipboardList className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight sm:text-xl">
                  TaskFlow
                </h1>
                <p className="hidden text-[11px] text-slate-500 sm:block">
                  Mini Task Tracker
                </p>
              </div>
            </div>

            {/* Add button (when hydrated) */}
            {tm.hydrated && (
              <button
                id="header-add-task"
                onClick={tm.openCreateForm}
                className="focus-ring group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition-all hover:shadow-violet-500/30 active:scale-[0.97]"
              >
                <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                <span className="hidden sm:inline">New Task</span>
              </button>
            )}
          </div>
        </header>

        {/* ── Content ───────────────────────────── */}
        <section className="flex-1 py-8 sm:py-10">
          {/* Loading state */}
          {!tm.hydrated && (
            <div className="flex flex-col items-center gap-8">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin text-violet-400" />
                Loading your tasks…
              </div>
              <SkeletonView />
            </div>
          )}

          {/* Hydrated content */}
          {tm.hydrated && (
            <div className="mx-auto max-w-5xl space-y-6 px-4 sm:px-6">
              {/* Stats strip (only when tasks exist) */}
              {hasAnyTasks && (
                <div className="animate-fade-in grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <StatCard
                    icon={ClipboardList}
                    label="Total"
                    value={tm.stats.total}
                    accent="bg-slate-800/80 text-slate-300"
                  />
                  <StatCard
                    icon={Clock}
                    label="Open"
                    value={tm.stats.open}
                    accent="bg-sky-950/60 text-sky-400"
                  />
                  <StatCard
                    icon={CheckCircle2}
                    label="Done"
                    value={tm.stats.completed}
                    accent="bg-emerald-950/60 text-emerald-400"
                  />
                  <StatCard
                    icon={AlertTriangle}
                    label="Urgent"
                    value={tm.stats.highPriority}
                    accent="bg-amber-950/60 text-amber-400"
                  />
                </div>
              )}

              {/* Control bar (only when tasks exist) */}
              {hasAnyTasks && (
                <ControlBar
                  searchQuery={tm.searchQuery}
                  onSearchChange={tm.setSearchQuery}
                  statusFilter={tm.statusFilter}
                  onStatusChange={tm.setStatusFilter}
                  counts={{
                    all: tm.stats.total,
                    open: tm.stats.open,
                    completed: tm.stats.completed,
                  }}
                />
              )}

              {/* Task list / empty states */}
              <TaskList
                tasks={tm.filteredTasks}
                hasAnyTasks={hasAnyTasks}
                onToggle={tm.handleToggleComplete}
                onEdit={tm.openEditForm}
                onDelete={tm.handleDeleteTask}
                onClearFilters={() => {
                  tm.setSearchQuery("");
                  tm.setStatusFilter("all");
                }}
                onAddFirst={tm.openCreateForm}
              />
            </div>
          )}
        </section>

        {/* ── Footer ────────────────────────────── */}
        <footer className="border-t border-white/[0.06] bg-white/[0.01]">
          <div className="mx-auto max-w-5xl px-4 py-4 text-center text-[11px] text-slate-600 sm:px-6">
            TaskFlow &middot; Data stored locally in your browser &middot; Built
            with Next.js
          </div>
        </footer>
      </main>

      {/* ── Modal (renders in portal-like overlay) ── */}
      <TaskFormModal
        isOpen={tm.isFormOpen}
        formState={tm.formState}
        formErrors={tm.formErrors}
        editingTaskId={tm.editingTaskId}
        onFieldChange={tm.updateFormField}
        onSubmit={
          tm.editingTaskId ? tm.handleEditTask : tm.handleCreateTask
        }
        onCancel={tm.resetForm}
      />
    </>
  );
}
