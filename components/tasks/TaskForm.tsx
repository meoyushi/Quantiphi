"use client";

import React, { useState } from "react";
import { Priority, Profile, Task, TaskStatus } from "@/types";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

export interface TaskFormData {
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  dueDate: string;
  assigneeId: string;
}

interface TaskFormProps {
  initialTask?: Task | null;
  members: Profile[];
  defaultStatus?: TaskStatus;
  isLoading?: boolean;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export function TaskForm({
  initialTask,
  members,
  defaultStatus = "TODO",
  isLoading,
  onSubmit,
  onCancel,
  onDelete,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialTask?.title || "");
  const [description, setDescription] = useState(initialTask?.description || "");
  const [priority, setPriority] = useState<Priority>(initialTask?.priority || "MEDIUM");
  const [status, setStatus] = useState<TaskStatus>(initialTask?.status || defaultStatus);
  const [dueDate, setDueDate] = useState(initialTask?.dueDate || "");
  const [assigneeId, setAssigneeId] = useState(initialTask?.assigneeId || (members[0]?.id || ""));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = Boolean(initialTask);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = "Task title is required";
    } else if (title.trim().length > 150) {
      newErrors.title = "Title cannot exceed 150 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      dueDate: dueDate || "",
      assigneeId: assigneeId || "",
    });
  };

  const memberOptions = [
    { value: "", label: "Unassigned" },
    ...members.map((m) => ({ value: m.id, label: m.fullName })),
  ];

  const priorityOptions = [
    { value: "LOW", label: "Low Priority" },
    { value: "MEDIUM", label: "Medium Priority" },
    { value: "HIGH", label: "High Priority" },
  ];

  const statusOptions = [
    { value: "TODO", label: "To Do" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "DONE", label: "Done" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <Input
        label="Task Title *"
        placeholder="e.g. Implement auth middleware"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
        }}
        error={errors.title}
        autoFocus
      />

      {/* Description */}
      <div>
        <label className="block text-xs font-medium text-neutral-700 mb-1.5">
          Description
        </label>
        <textarea
          rows={3}
          placeholder="Add more details, technical notes, or acceptance criteria..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-xs focus-visible:outline-none focus-visible:ring-1.5 focus-visible:ring-neutral-900 placeholder:text-neutral-400"
        />
      </div>

      {/* Two-column layout for Status & Priority */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
          options={statusOptions}
        />
        <Select
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          options={priorityOptions}
        />
      </div>

      {/* Two-column layout for Assignee & Due Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Select
          label="Assignee"
          value={assigneeId}
          onChange={(e) => setAssigneeId(e.target.value)}
          options={memberOptions}
        />
        <Input
          type="date"
          label="Due Date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
        <div>
          {isEditing && onDelete && (
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={onDelete}
              isLoading={isLoading}
            >
              Delete
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isLoading}>
            {isEditing ? "Save Changes" : "Create Task"}
          </Button>
        </div>
      </div>
    </form>
  );
}
