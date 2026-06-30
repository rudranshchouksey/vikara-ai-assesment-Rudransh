"use client";

import { useState, useMemo, useCallback } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type {
  Task,
  TaskStatus,
  TaskPriority,
  CreateTaskInput,
  UpdateTaskInput,
} from "@/types/task";

// ─── Filter types ────────────────────────────────
export type StatusFilter = "all" | TaskStatus;

// ─── Form state ──────────────────────────────────
export interface TaskFormState {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
}

export interface TaskFormErrors {
  title?: string;
}

const INITIAL_FORM: TaskFormState = {
  title: "",
  description: "",
  priority: "medium",
  dueDate: "",
};

// ─── Validation ──────────────────────────────────
function validateForm(form: TaskFormState): TaskFormErrors {
  const errors: TaskFormErrors = {};

  const trimmed = form.title.trim();
  if (!trimmed) {
    errors.title = "Title is required.";
  } else if (trimmed.length < 2) {
    errors.title = "Title must be at least 2 characters.";
  } else if (trimmed.length > 120) {
    errors.title = "Title must be 120 characters or fewer.";
  }

  return errors;
}

// ─── Hook ────────────────────────────────────────
export function useTaskManager() {
  // ── Persisted task state ──
  const [tasks, setTasks, hydrated] = useLocalStorage<Task[]>(
    "taskflow-tasks",
    [],
  );

  // ── Search & filter state ──
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // ── Form state ──
  const [formState, setFormState] = useState<TaskFormState>(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState<TaskFormErrors>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // ─────────────────────────────────────────────
  // Computed: reactive filtered + searched tasks
  // ─────────────────────────────────────────────
  const filteredTasks = useMemo(() => {
    let result = tasks;

    // 1. Status filter
    if (statusFilter !== "all") {
      result = result.filter((t) => t.status === statusFilter);
    }

    // 2. Search by title (case-insensitive)
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter((t) =>
        t.title.toLowerCase().includes(q),
      );
    }

    // 3. Sort: open tasks first, then by createdAt descending (newest on top)
    return [...result].sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === "open" ? -1 : 1;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [tasks, statusFilter, searchQuery]);

  // ─────────────────────────────────────────────
  // Stats (derived from *all* tasks, not filtered)
  // ─────────────────────────────────────────────
  const stats = useMemo(() => {
    const open = tasks.filter((t) => t.status === "open").length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    const highPriority = tasks.filter(
      (t) => t.priority === "high" && t.status === "open",
    ).length;
    return { total: tasks.length, open, completed, highPriority };
  }, [tasks]);

  // ─────────────────────────────────────────────
  // Form helpers
  // ─────────────────────────────────────────────
  const updateFormField = useCallback(
    <K extends keyof TaskFormState>(field: K, value: TaskFormState[K]) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
      // Clear field-level error on change
      if (field === "title") {
        setFormErrors((prev) => ({ ...prev, title: undefined }));
      }
    },
    [],
  );

  const resetForm = useCallback(() => {
    setFormState(INITIAL_FORM);
    setFormErrors({});
    setEditingTaskId(null);
    setIsFormOpen(false);
  }, []);

  const openCreateForm = useCallback(() => {
    setFormState(INITIAL_FORM);
    setFormErrors({});
    setEditingTaskId(null);
    setIsFormOpen(true);
  }, []);

  const openEditForm = useCallback(
    (task: Task) => {
      setFormState({
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate ?? "",
      });
      setFormErrors({});
      setEditingTaskId(task.id);
      setIsFormOpen(true);
    },
    [],
  );

  // ─────────────────────────────────────────────
  // CRUD operations
  // ─────────────────────────────────────────────

  /**
   * Validates the form and creates a new task.
   * Returns `true` on success so the caller can close the modal / form.
   */
  const handleCreateTask = useCallback((): boolean => {
    const errors = validateForm(formState);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return false;
    }

    const now = new Date().toISOString();

    const input: CreateTaskInput = {
      title: formState.title.trim(),
      description: formState.description.trim(),
      priority: formState.priority,
      dueDate: formState.dueDate || null,
    };

    const newTask: Task = {
      ...input,
      id: crypto.randomUUID(),
      status: "open",
      createdAt: now,
      updatedAt: now,
    };

    setTasks((prev) => [newTask, ...prev]);
    resetForm();
    return true;
  }, [formState, setTasks, resetForm]);

  /**
   * Toggles a task between "open" ↔ "completed".
   */
  const handleToggleComplete = useCallback(
    (taskId: string) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                status: t.status === "open" ? "completed" : "open",
                updatedAt: new Date().toISOString(),
              }
            : t,
        ),
      );
    },
    [setTasks],
  );

  /**
   * Validates the form and applies the edit to the task identified by
   * `editingTaskId`. Returns `true` on success.
   */
  const handleEditTask = useCallback((): boolean => {
    if (!editingTaskId) return false;

    const errors = validateForm(formState);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return false;
    }

    const updates: UpdateTaskInput = {
      title: formState.title.trim(),
      description: formState.description.trim(),
      priority: formState.priority,
      dueDate: formState.dueDate || null,
    };

    setTasks((prev) =>
      prev.map((t) =>
        t.id === editingTaskId
          ? { ...t, ...updates, updatedAt: new Date().toISOString() }
          : t,
      ),
    );
    resetForm();
    return true;
  }, [editingTaskId, formState, setTasks, resetForm]);

  /**
   * Permanently removes a task by id.
   */
  const handleDeleteTask = useCallback(
    (taskId: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      // If we were editing the deleted task, close the form
      if (editingTaskId === taskId) {
        resetForm();
      }
    },
    [setTasks, editingTaskId, resetForm],
  );

  // ─────────────────────────────────────────────
  // Public API
  // ─────────────────────────────────────────────
  return {
    // State
    tasks,
    filteredTasks,
    stats,
    hydrated,

    // Search & filter
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,

    // Form
    formState,
    formErrors,
    isFormOpen,
    editingTaskId,
    updateFormField,
    resetForm,
    openCreateForm,
    openEditForm,

    // CRUD
    handleCreateTask,
    handleToggleComplete,
    handleEditTask,
    handleDeleteTask,
  } as const;
}
