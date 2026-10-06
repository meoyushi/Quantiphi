import { Priority, TaskStatus } from "@/types";

export interface CreateTaskInput {
  title: string;
  description?: string | null;
  priority?: Priority;
  status?: TaskStatus;
  dueDate?: string | null;
  projectId: string;
  assigneeId?: string | null;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  priority?: Priority;
  status?: TaskStatus;
  dueDate?: string | null;
  assigneeId?: string | null;
}

export function validateTaskInput(input: any): { isValid: boolean; error?: string; data?: CreateTaskInput } {
  if (!input || typeof input !== "object") {
    return { isValid: false, error: "Invalid request payload" };
  }

  if (!input.title || typeof input.title !== "string" || input.title.trim().length === 0) {
    return { isValid: false, error: "Task title is required" };
  }

  if (input.title.trim().length > 150) {
    return { isValid: false, error: "Task title cannot exceed 150 characters" };
  }

  if (!input.projectId || typeof input.projectId !== "string") {
    return { isValid: false, error: "Project ID is required" };
  }

  const validStatuses: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];
  const status: TaskStatus = input.status ? input.status : "TODO";
  if (!validStatuses.includes(status)) {
    return { isValid: false, error: "Status must be TODO, IN_PROGRESS, or DONE" };
  }

  const validPriorities: Priority[] = ["LOW", "MEDIUM", "HIGH"];
  const priority: Priority = input.priority ? input.priority : "MEDIUM";
  if (!validPriorities.includes(priority)) {
    return { isValid: false, error: "Priority must be LOW, MEDIUM, or HIGH" };
  }

  let dueDate: string | null = null;
  if (input.dueDate) {
    if (typeof input.dueDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(input.dueDate)) {
      return { isValid: false, error: "Due date must be in YYYY-MM-DD format" };
    }
    const d = new Date(input.dueDate);
    if (isNaN(d.getTime())) {
      return { isValid: false, error: "Invalid due date" };
    }
    dueDate = input.dueDate;
  }

  return {
    isValid: true,
    data: {
      title: input.title.trim(),
      description: typeof input.description === "string" ? input.description.trim() : null,
      priority,
      status,
      dueDate,
      projectId: input.projectId,
      assigneeId: input.assigneeId || null,
    },
  };
}

export function validateUpdateTaskInput(input: any): { isValid: boolean; error?: string; data?: UpdateTaskInput } {
  if (!input || typeof input !== "object") {
    return { isValid: false, error: "Invalid request payload" };
  }

  const data: UpdateTaskInput = {};

  if (input.title !== undefined) {
    if (typeof input.title !== "string" || input.title.trim().length === 0) {
      return { isValid: false, error: "Task title cannot be empty" };
    }
    if (input.title.trim().length > 150) {
      return { isValid: false, error: "Task title cannot exceed 150 characters" };
    }
    data.title = input.title.trim();
  }

  if (input.description !== undefined) {
    data.description = typeof input.description === "string" ? input.description.trim() : null;
  }

  if (input.status !== undefined) {
    const validStatuses: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];
    if (!validStatuses.includes(input.status)) {
      return { isValid: false, error: "Status must be TODO, IN_PROGRESS, or DONE" };
    }
    data.status = input.status;
  }

  if (input.priority !== undefined) {
    const validPriorities: Priority[] = ["LOW", "MEDIUM", "HIGH"];
    if (!validPriorities.includes(input.priority)) {
      return { isValid: false, error: "Priority must be LOW, MEDIUM, or HIGH" };
    }
    data.priority = input.priority;
  }

  if (input.dueDate !== undefined) {
    if (input.dueDate === null || input.dueDate === "") {
      data.dueDate = null;
    } else {
      if (typeof input.dueDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(input.dueDate)) {
        return { isValid: false, error: "Due date must be in YYYY-MM-DD format" };
      }
      const d = new Date(input.dueDate);
      if (isNaN(d.getTime())) {
        return { isValid: false, error: "Invalid due date" };
      }
      data.dueDate = input.dueDate;
    }
  }

  if (input.assigneeId !== undefined) {
    data.assigneeId = input.assigneeId || null;
  }

  return { isValid: true, data };
}
