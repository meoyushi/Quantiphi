"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Task, TaskStatus } from "@/types";
import { TaskCard } from "./TaskCard";
import { Plus } from "lucide-react";

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (status: TaskStatus) => void;
}

export function KanbanColumn({
  id,
  title,
  tasks,
  onTaskClick,
  onAddTask,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: "Column",
      status: id,
    },
  });

  const taskIds = tasks.map((t) => t.id);

  // Subtle header color accents
  const statusAccent = {
    TODO: "bg-neutral-500",
    IN_PROGRESS: "bg-blue-500",
    DONE: "bg-emerald-500",
  }[id];

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-lg bg-neutral-50/70 border transition-colors min-h-[500px] ${
        isOver
          ? "border-neutral-400 bg-neutral-100/70 ring-2 ring-neutral-900/5"
          : "border-neutral-200/80"
      }`}
    >
      {/* Column Header */}
      <div className="p-3 border-b border-neutral-200/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${statusAccent}`} />
          <h3 className="text-xs font-bold text-neutral-800 tracking-wide uppercase">
            {title}
          </h3>
          <span className="ml-1 text-[11px] font-semibold text-neutral-500 bg-neutral-200/70 px-1.5 py-0.2 rounded-full">
            {tasks.length}
          </span>
        </div>

        <button
          onClick={() => onAddTask(id)}
          className="p-1 rounded text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 transition-colors"
          title={`Add task to ${title}`}
          aria-label={`Add task to ${title}`}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Task List / Drop Zone */}
      <div className="p-2.5 flex-1 flex flex-col gap-2.5 overflow-y-auto">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
            />
          ))}
        </SortableContext>

        {/* Empty State */}
        {tasks.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-neutral-200/80 rounded-md bg-white/40 my-2">
            <p className="text-xs text-neutral-400 font-medium">No tasks here</p>
            <button
              onClick={() => onAddTask(id)}
              className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-neutral-700 hover:text-neutral-950 hover:underline"
            >
              <Plus className="h-3 w-3" />
              Add task
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
