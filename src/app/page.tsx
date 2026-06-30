"use client";

import { useMemo } from "react";
import {
  ClipboardList,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Loader2,
} from "lucide-react";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { Task } from "@/types/task";

// ───────────────────────────────────────────────
// Stat card shown in the summary strip
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
// Skeleton cards rendered while hydrating
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
// Empty state — shown when no tasks exist
// ───────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 py-24 text-center">
      {/* Decorative gradient blob behind the icon */}
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
        className="focus-ring group inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-violet-600/20 transition-all hover:bg-violet-500 hover:shadow-violet-500/30 active:scale-[0.97]"
      >
        <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
        Add your first task
      </button>
    </div>
  );
}

// ───────────────────────────────────────────────
// Page root
// ───────────────────────────────────────────────
export default function HomePage() {
  const [tasks, , hydrated] = useLocalStorage<Task[]>("taskflow-tasks", []);

  const stats = useMemo(() => {
    const open = tasks.filter((t) => t.status === "open").length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    const highPriority = tasks.filter(
      (t) => t.priority === "high" && t.status === "open",
    ).length;
    return { total: tasks.length, open, completed, highPriority };
  }, [tasks]);

  const isEmpty = hydrated && tasks.length === 0;

  return (
    <main className="flex flex-1 flex-col">
      {/* ── Header ─────────────────────────────── */}
      <header className="border-b border-white/[0.06] bg-white/[0.02] backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-violet-600 p-2 shadow-lg shadow-violet-600/25">
              <ClipboardList className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
              TaskFlow
            </h1>
          </div>

          {hydrated && tasks.length > 0 && (
            <button
              id="header-add-task"
              className="focus-ring group inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-violet-600/20 transition-all hover:bg-violet-500 hover:shadow-violet-500/30 active:scale-[0.97]"
            >
              <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
              <span className="hidden sm:inline">New Task</span>
            </button>
          )}
        </div>
      </header>

      {/* ── Content ────────────────────────────── */}
      <section className="flex-1 py-8 sm:py-12">
        {/* Loading skeleton while hydrating */}
        {!hydrated && (
          <div className="flex flex-col items-center gap-8">
            <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
            <SkeletonCards />
          </div>
        )}

        {/* Empty state */}
        {isEmpty && <EmptyState />}

        {/* Task list + stats (when tasks exist) */}
        {hydrated && tasks.length > 0 && (
          <div className="mx-auto max-w-5xl space-y-8 px-4 sm:px-6">
            {/* Stats strip */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={ClipboardList}
                label="Total Tasks"
                value={stats.total}
                accent="bg-slate-700/60 text-slate-300"
              />
              <StatCard
                icon={Clock}
                label="Open"
                value={stats.open}
                accent="bg-sky-900/50 text-sky-400"
              />
              <StatCard
                icon={CheckCircle2}
                label="Completed"
                value={stats.completed}
                accent="bg-emerald-900/50 text-emerald-400"
              />
              <StatCard
                icon={AlertTriangle}
                label="High Priority"
                value={stats.highPriority}
                accent="bg-amber-900/50 text-amber-400"
              />
            </div>

            {/* ── Task cards placeholder ──
                 Replace this section with your <TaskCard /> list or
                 a filterable <TaskBoard /> component. */}
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
              <p className="text-sm text-slate-400">
                {stats.total} task{stats.total !== 1 && "s"} loaded from
                localStorage. Render your task list here.
              </p>
            </div>
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
