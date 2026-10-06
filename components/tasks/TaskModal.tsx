"use client";

import React from "react";
import { Profile, Task, TaskStatus } from "@/types";
import { Modal } from "@/components/ui/Modal";
import { TaskForm, TaskFormData } from "./TaskForm";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTask?: Task | null;
  defaultStatus?: TaskStatus;
  members: Profile[];
  isLoading?: boolean;
  onSubmit: (data: TaskFormData) => void;
  onDelete?: () => void;
}

export function TaskModal({
  isOpen,
  onClose,
  initialTask,
  defaultStatus,
  members,
  isLoading,
  onSubmit,
  onDelete,
}: TaskModalProps) {
  const isEditing = Boolean(initialTask);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Task" : "Create New Task"}
      description={
        isEditing
          ? "Update task status, priority, due date or assignment."
          : "Add a new work item to the project board."
      }
    >
      <TaskForm
        key={initialTask?.id || "new"}
        initialTask={initialTask}
        defaultStatus={defaultStatus}
        members={members}
        isLoading={isLoading}
        onSubmit={onSubmit}
        onCancel={onClose}
        onDelete={onDelete}
      />
    </Modal>
  );
}
