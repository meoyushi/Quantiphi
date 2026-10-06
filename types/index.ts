export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type Priority = "LOW" | "MEDIUM" | "HIGH";

export interface Profile {
  id: string;
  fullName: string;
  email: string | null;
  avatarUrl: string | null;
  createdAt?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMember {
  id: string;
  projectId: string;
  userId: string;
  role: string;
  createdAt: string;
  profile?: Profile;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  dueDate: string | null;
  projectId: string;
  assigneeId: string | null;
  createdBy?: string | null;
  createdAt?: string;
  updatedAt?: string;
  assignee?: Profile | null;
}

export interface Workload {
  userId: string;
  name: string;
  inProgressCount: number;
  overloaded: boolean;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
}

export type PriorityFilterType = "ALL" | Priority;
