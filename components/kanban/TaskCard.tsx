"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/types";
import { PriorityBadge } from "@/components/ui/Badge";
import { formatDate, getInitials } from "@/lib/utils";
import { Calendar, GripVertical } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  isDraggingOverlay?: boolean;
}

export function TaskCard({ task, onClick, isDraggingOverlay }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const formattedDueDate = formatDate(task.dueDate);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-white rounded-md border text-left p-3.5 shadow-2xs transition-all select-none ${
        isDragging
          ? "opacity-30 border-dashed border-neutral-400 bg-neutral-50 shadow-none"
          : "border-neutral-200/90 hover:border-neutral-300 hover:shadow-xs"
      } ${isDraggingOverlay ? "shadow-lg border-neutral-400 rotate-1 cursor-grabbing" : "cursor-pointer"}`}
      onClick={onClick}
    >
      {/* Top row: Drag Handle & Title */}
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-xs font-semibold text-neutral-900 leading-snug break-words flex-1">
          {task.title}
        </h4>
        <button
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="text-neutral-300 group-hover:text-neutral-500 hover:bg-neutral-100 p-0.5 rounded cursor-grab active:cursor-grabbing -mr-1 -mt-0.5 transition-colors"
          title="Drag to move"
          aria-label="Drag task"
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Description preview */}
      {task.description && (
        <p className="mt-1.5 text-[11px] text-neutral-500 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Footer Meta: Priority, Due Date, Assignee Avatar */}
      <div className="mt-3 pt-2.5 border-t border-neutral-100/90 flex items-center justify-between text-[11px] text-neutral-500">
        <div className="flex items-center gap-2">
          <PriorityBadge priority={task.priority} />
          {formattedDueDate && (
            <div className="flex items-center gap-1 text-[10px] text-neutral-500 font-medium">
              <Calendar className="h-3 w-3 text-neutral-400" />
              <span>{formattedDueDate}</span>
            </div>
          )}
        </div>

        {/* Assignee initials avatar */}
        {task.assignee ? (
          <div
            className="h-5 w-5 rounded-full bg-neutral-800 text-white flex items-center justify-center text-[9px] font-bold shrink-0"
            title={task.assignee.fullName}
          >
            {getInitials(task.assignee.fullName)}
          </div>
        ) : (
          <div
            className="h-5 w-5 rounded-full border border-dashed border-neutral-300 text-neutral-400 flex items-center justify-center text-[9px]"
            title="Unassigned"
          >
            -
          </div>
        )}
      </div>
    </div>
  );
}
