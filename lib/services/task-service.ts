import { Priority, Profile, Task, TaskStatus } from "@/types";
import { CreateTaskInput, UpdateTaskInput } from "@/lib/validations/task-validation";
import { SupabaseClient } from "@supabase/supabase-js";
import { DEMO_PROFILES } from "./user-service";

// In-memory fallback tasks store initialized with realistic assessment seed data
export let DEMO_TASKS: Task[] = [
  // Aayushi Rajesh: 2 TODO, 6 IN_PROGRESS (Triggering >5 overload), 2 DONE
  {
    id: "t-001",
    title: "Implement auth middleware",
    description: "Secure Next.js route handlers with session verification and token refresh",
    status: "TODO",
    priority: "HIGH",
    dueDate: "2026-10-15",
    projectId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    assigneeId: "11111111-1111-1111-1111-111111111111",
    createdBy: "11111111-1111-1111-1111-111111111111",
    createdAt: "2026-10-01T10:00:00.000Z",
    updatedAt: "2026-10-01T10:00:00.000Z",
    assignee: DEMO_PROFILES[0],
  },
  {
    id: "t-002",
    title: "Design project overview UI",
    description: "Create responsive header, project switcher, and breadcrumb navigation",
    status: "TODO",
    priority: "MEDIUM",
    dueDate: "2026-10-18",
    projectId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    assigneeId: "11111111-1111-1111-1111-111111111111",
    createdBy: "11111111-1111-1111-1111-111111111111",
    createdAt: "2026-10-01T11:00:00.000Z",
    updatedAt: "2026-10-01T11:00:00.000Z",
    assignee: DEMO_PROFILES[0],
  },
  {
    id: "t-003",
    title: "Fix task filtering logic",
    description: "Ensure server-side priority and assignee query params work properly",
    status: "IN_PROGRESS",
    priority: "HIGH",
    dueDate: "2026-10-08",
    projectId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    assigneeId: "11111111-1111-1111-1111-111111111111",
    createdBy: "11111111-1111-1111-1111-111111111111",
    createdAt: "2026-10-02T09:00:00.000Z",
    updatedAt: "2026-10-02T09:00:00.000Z",
    assignee: DEMO_PROFILES[0],
  },
  {
    id: "t-004",
    title: "Add due date validation",
    description: "Validate ISO date string formats in task-validation schema",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    dueDate: "2026-10-09",
    projectId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    assigneeId: "11111111-1111-1111-1111-111111111111",
    createdBy: "11111111-1111-1111-1111-111111111111",
    createdAt: "2026-10-02T10:00:00.000Z",
    updatedAt: "2026-10-02T10:00:00.000Z",
    assignee: DEMO_PROFILES[0],
  },
  {
    id: "t-005",
    title: "Improve drag and drop animations",
    description: "Integrate @dnd-kit sensor drop transitions smoothly without jitter",
    status: "IN_PROGRESS",
    priority: "HIGH",
    dueDate: "2026-10-10",
    projectId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    assigneeId: "11111111-1111-1111-1111-111111111111",
    createdBy: "11111111-1111-1111-1111-111111111111",
    createdAt: "2026-10-03T08:00:00.000Z",
    updatedAt: "2026-10-03T08:00:00.000Z",
    assignee: DEMO_PROFILES[0],
  },
  {
    id: "t-006",
    title: "Create workload calculation endpoint",
    description: "Compute overload flag server-side via in_progress count aggregate",
    status: "IN_PROGRESS",
    priority: "HIGH",
    dueDate: "2026-10-11",
    projectId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    assigneeId: "11111111-1111-1111-1111-111111111111",
    createdBy: "11111111-1111-1111-1111-111111111111",
    createdAt: "2026-10-03T09:30:00.000Z",
    updatedAt: "2026-10-03T09:30:00.000Z",
    assignee: DEMO_PROFILES[0],
  },
  {
    id: "t-007",
    title: "Review database foreign key constraints",
    description: "Verify cascade delete on project removal and nullify on assignee deletion",
    status: "IN_PROGRESS",
    priority: "LOW",
    dueDate: "2026-10-12",
    projectId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    assigneeId: "11111111-1111-1111-1111-111111111111",
    createdBy: "11111111-1111-1111-1111-111111111111",
    createdAt: "2026-10-03T11:00:00.000Z",
    updatedAt: "2026-10-03T11:00:00.000Z",
    assignee: DEMO_PROFILES[0],
  },
  {
    id: "t-008",
    title: "Benchmark database index performance",
    description: "Check EXPLAIN output on tasks table status and assignee queries",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    dueDate: "2026-10-14",
    projectId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    assigneeId: "11111111-1111-1111-1111-111111111111",
    createdBy: "11111111-1111-1111-1111-111111111111",
    createdAt: "2026-10-04T14:00:00.000Z",
    updatedAt: "2026-10-04T14:00:00.000Z",
    assignee: DEMO_PROFILES[0],
  },
  {
    id: "t-009",
    title: "Initialize repository scaffolding",
    description: "Setup Next.js, Tailwind CSS and TypeScript configuration",
    status: "DONE",
    priority: "HIGH",
    dueDate: "2026-10-01",
    projectId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    assigneeId: "11111111-1111-1111-1111-111111111111",
    createdBy: "11111111-1111-1111-1111-111111111111",
    createdAt: "2026-09-28T09:00:00.000Z",
    updatedAt: "2026-10-01T12:00:00.000Z",
    assignee: DEMO_PROFILES[0],
  },
  {
    id: "t-010",
    title: "Draft schema documentation",
    description: "Document profiles, projects, members and tasks entity relations",
    status: "DONE",
    priority: "LOW",
    dueDate: "2026-10-02",
    projectId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    assigneeId: "11111111-1111-1111-1111-111111111111",
    createdBy: "11111111-1111-1111-1111-111111111111",
    createdAt: "2026-09-29T10:00:00.000Z",
    updatedAt: "2026-10-02T16:00:00.000Z",
    assignee: DEMO_PROFILES[0],
  },

  // Rahul Sharma
  {
    id: "t-011",
    title: "Optimize bundle payload",
    description: "Analyze dynamic imports for modal and drag-drop dependencies",
    status: "TODO",
    priority: "LOW",
    dueDate: "2026-10-20",
    projectId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    assigneeId: "22222222-2222-2222-2222-222222222222",
    createdBy: "11111111-1111-1111-1111-111111111111",
    createdAt: "2026-10-02T15:00:00.000Z",
    updatedAt: "2026-10-02T15:00:00.000Z",
    assignee: DEMO_PROFILES[1],
  },
  {
    id: "t-012",
    title: "Configure automated test suite",
    description: "Setup integration tests for task CRUD operations and role checks",
    status: "TODO",
    priority: "MEDIUM",
    dueDate: "2026-10-22",
    projectId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    assigneeId: "22222222-2222-2222-2222-222222222222",
    createdBy: "11111111-1111-1111-1111-111111111111",
    createdAt: "2026-10-03T16:00:00.000Z",
    updatedAt: "2026-10-03T16:00:00.000Z",
    assignee: DEMO_PROFILES[1],
  },
  {
    id: "t-013",
    title: "Implement responsive sidebar",
    description: "Ensure sidebar collapses gracefully on tablet/laptop screens",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    dueDate: "2026-10-12",
    projectId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    assigneeId: "22222222-2222-2222-2222-222222222222",
    createdBy: "11111111-1111-1111-1111-111111111111",
    createdAt: "2026-10-04T11:00:00.000Z",
    updatedAt: "2026-10-04T11:00:00.000Z",
    assignee: DEMO_PROFILES[1],
  },
  {
    id: "t-014",
    title: "Setup Tailwind color tokens",
    description: "Define subtle border, background and badge color variables",
    status: "DONE",
    priority: "LOW",
    dueDate: "2026-10-03",
    projectId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    assigneeId: "22222222-2222-2222-2222-222222222222",
    createdBy: "11111111-1111-1111-1111-111111111111",
    createdAt: "2026-09-30T14:00:00.000Z",
    updatedAt: "2026-10-03T18:00:00.000Z",
    assignee: DEMO_PROFILES[1],
  },

  // Priya Mehta
  {
    id: "t-015",
    title: "Write API error response handler",
    description: "Standardize JSON error output format across route handlers",
    status: "TODO",
    priority: "MEDIUM",
    dueDate: "2026-10-16",
    projectId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    assigneeId: "33333333-3333-3333-3333-333333333333",
    createdBy: "11111111-1111-1111-1111-111111111111",
    createdAt: "2026-10-04T09:00:00.000Z",
    updatedAt: "2026-10-04T09:00:00.000Z",
    assignee: DEMO_PROFILES[2],
  },
  {
    id: "t-016",
    title: "Build Team Workload widget",
    description: "Display team members with active task count and overload state",
    status: "IN_PROGRESS",
    priority: "HIGH",
    dueDate: "2026-10-09",
    projectId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    assigneeId: "33333333-3333-3333-3333-333333333333",
    createdBy: "11111111-1111-1111-1111-111111111111",
    createdAt: "2026-10-04T10:00:00.000Z",
    updatedAt: "2026-10-04T10:00:00.000Z",
    assignee: DEMO_PROFILES[2],
  },
  {
    id: "t-017",
    title: "Validate assignee membership",
    description: "Prevent assigning tasks to non-project members in backend validator",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    dueDate: "2026-10-11",
    projectId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    assigneeId: "33333333-3333-3333-3333-333333333333",
    createdBy: "11111111-1111-1111-1111-111111111111",
    createdAt: "2026-10-04T12:00:00.000Z",
    updatedAt: "2026-10-04T12:00:00.000Z",
    assignee: DEMO_PROFILES[2],
  },
  {
    id: "t-018",
    title: "Design Task Modal form",
    description: "Create clean dialog for creating and editing tasks with instant validation",
    status: "DONE",
    priority: "MEDIUM",
    dueDate: "2026-10-04",
    projectId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    assigneeId: "33333333-3333-3333-3333-333333333333",
    createdBy: "11111111-1111-1111-1111-111111111111",
    createdAt: "2026-10-01T15:00:00.000Z",
    updatedAt: "2026-10-04T16:00:00.000Z",
    assignee: DEMO_PROFILES[2],
  },
];

function extractProfile(raw: any): Profile | null {
  if (!raw) return null;
  const p = Array.isArray(raw) ? raw[0] : raw;
  if (!p || !p.id) return null;
  return {
    id: p.id,
    fullName: p.full_name,
    email: p.email,
    avatarUrl: p.avatar_url,
  };
}

export async function getTasks(
  supabase: SupabaseClient,
  filters: {
    projectId: string;
    status?: string;
    priority?: string;
    assigneeId?: string;
  }
): Promise<Task[]> {
  try {
    let query = supabase
      .from("tasks")
      .select(`
        id,
        title,
        description,
        status,
        priority,
        due_date,
        project_id,
        assignee_id,
        created_by,
        created_at,
        updated_at,
        profiles:assignee_id (
          id,
          full_name,
          email,
          avatar_url
        )
      `)
      .eq("project_id", filters.projectId)
      .order("created_at", { ascending: true });

    if (filters.status) {
      query = query.eq("status", filters.status);
    }
    if (filters.priority) {
      query = query.eq("priority", filters.priority);
    }
    if (filters.assigneeId) {
      query = query.eq("assignee_id", filters.assigneeId);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      // Return filtered demo tasks
      return filterDemoTasks(filters);
    }

    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      status: item.status as TaskStatus,
      priority: item.priority as Priority,
      dueDate: item.due_date,
      projectId: item.project_id,
      assigneeId: item.assignee_id,
      createdBy: item.created_by,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      assignee: extractProfile(item.profiles),
    }));
  } catch {
    return filterDemoTasks(filters);
  }
}

function filterDemoTasks(filters: { projectId: string; status?: string; priority?: string; assigneeId?: string }): Task[] {
  let list = DEMO_TASKS.filter((t) => t.projectId === filters.projectId || !filters.projectId);
  if (filters.status) {
    list = list.filter((t) => t.status === filters.status);
  }
  if (filters.priority && filters.priority !== "ALL") {
    list = list.filter((t) => t.priority === filters.priority);
  }
  if (filters.assigneeId) {
    list = list.filter((t) => t.assigneeId === filters.assigneeId);
  }
  return list;
}

export async function getTaskById(supabase: SupabaseClient, taskId: string): Promise<Task | null> {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .select(`
        id,
        title,
        description,
        status,
        priority,
        due_date,
        project_id,
        assignee_id,
        created_by,
        created_at,
        updated_at,
        profiles:assignee_id (
          id,
          full_name,
          email,
          avatar_url
        )
      `)
      .eq("id", taskId)
      .single();

    if (error || !data) {
      return DEMO_TASKS.find((t) => t.id === taskId) || null;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status as TaskStatus,
      priority: data.priority as Priority,
      dueDate: data.due_date,
      projectId: data.project_id,
      assigneeId: data.assignee_id,
      createdBy: data.created_by,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      assignee: extractProfile(data.profiles),
    };
  } catch {
    return DEMO_TASKS.find((t) => t.id === taskId) || null;
  }
}

export async function createTask(
  supabase: SupabaseClient,
  userId: string,
  input: CreateTaskInput
): Promise<Task> {
  const newTaskData = {
    project_id: input.projectId,
    title: input.title,
    description: input.description || null,
    status: input.status || "TODO",
    priority: input.priority || "MEDIUM",
    due_date: input.dueDate || null,
    assignee_id: input.assigneeId || null,
    created_by: userId,
  };

  try {
    const { data, error } = await supabase
      .from("tasks")
      .insert(newTaskData)
      .select(`
        id,
        title,
        description,
        status,
        priority,
        due_date,
        project_id,
        assignee_id,
        created_by,
        created_at,
        updated_at,
        profiles:assignee_id (
          id,
          full_name,
          email,
          avatar_url
        )
      `)
      .single();

    if (error || !data) {
      const fallbackTask: Task = {
        id: `t-${Date.now()}`,
        title: input.title,
        description: input.description || null,
        status: input.status || "TODO",
        priority: input.priority || "MEDIUM",
        dueDate: input.dueDate || null,
        projectId: input.projectId,
        assigneeId: input.assigneeId || null,
        createdBy: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        assignee: input.assigneeId ? DEMO_PROFILES.find((p) => p.id === input.assigneeId) || null : null,
      };
      DEMO_TASKS.push(fallbackTask);
      return fallbackTask;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status as TaskStatus,
      priority: data.priority as Priority,
      dueDate: data.due_date,
      projectId: data.project_id,
      assigneeId: data.assignee_id,
      createdBy: data.created_by,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      assignee: extractProfile(data.profiles),
    };
  } catch {
    const fallbackTask: Task = {
      id: `t-${Date.now()}`,
      title: input.title,
      description: input.description || null,
      status: input.status || "TODO",
      priority: input.priority || "MEDIUM",
      dueDate: input.dueDate || null,
      projectId: input.projectId,
      assigneeId: input.assigneeId || null,
      createdBy: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignee: input.assigneeId ? DEMO_PROFILES.find((p) => p.id === input.assigneeId) || null : null,
    };
    DEMO_TASKS.push(fallbackTask);
    return fallbackTask;
  }
}

export async function updateTask(
  supabase: SupabaseClient,
  taskId: string,
  input: UpdateTaskInput
): Promise<Task | null> {
  const updatePayload: any = {
    updated_at: new Date().toISOString(),
  };

  if (input.title !== undefined) updatePayload.title = input.title;
  if (input.description !== undefined) updatePayload.description = input.description;
  if (input.status !== undefined) updatePayload.status = input.status;
  if (input.priority !== undefined) updatePayload.priority = input.priority;
  if (input.dueDate !== undefined) updatePayload.due_date = input.dueDate;
  if (input.assigneeId !== undefined) updatePayload.assignee_id = input.assigneeId;

  try {
    const { data, error } = await supabase
      .from("tasks")
      .update(updatePayload)
      .eq("id", taskId)
      .select(`
        id,
        title,
        description,
        status,
        priority,
        due_date,
        project_id,
        assignee_id,
        created_by,
        created_at,
        updated_at,
        profiles:assignee_id (
          id,
          full_name,
          email,
          avatar_url
        )
      `)
      .single();

    if (error || !data) {
      // Update in demo store
      const taskIndex = DEMO_TASKS.findIndex((t) => t.id === taskId);
      if (taskIndex === -1) return null;
      const existing = DEMO_TASKS[taskIndex];
      const updated: Task = {
        ...existing,
        title: input.title !== undefined ? input.title : existing.title,
        description: input.description !== undefined ? input.description : existing.description,
        status: input.status !== undefined ? input.status : existing.status,
        priority: input.priority !== undefined ? input.priority : existing.priority,
        dueDate: input.dueDate !== undefined ? input.dueDate : existing.dueDate,
        assigneeId: input.assigneeId !== undefined ? input.assigneeId : existing.assigneeId,
        assignee: input.assigneeId !== undefined
          ? DEMO_PROFILES.find((p) => p.id === input.assigneeId) || null
          : existing.assignee,
        updatedAt: new Date().toISOString(),
      };
      DEMO_TASKS[taskIndex] = updated;
      return updated;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status as TaskStatus,
      priority: data.priority as Priority,
      dueDate: data.due_date,
      projectId: data.project_id,
      assigneeId: data.assignee_id,
      createdBy: data.created_by,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      assignee: extractProfile(data.profiles),
    };
  } catch {
    const taskIndex = DEMO_TASKS.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) return null;
    const existing = DEMO_TASKS[taskIndex];
    const updated: Task = {
      ...existing,
      title: input.title !== undefined ? input.title : existing.title,
      description: input.description !== undefined ? input.description : existing.description,
      status: input.status !== undefined ? input.status : existing.status,
      priority: input.priority !== undefined ? input.priority : existing.priority,
      dueDate: input.dueDate !== undefined ? input.dueDate : existing.dueDate,
      assigneeId: input.assigneeId !== undefined ? input.assigneeId : existing.assigneeId,
      assignee: input.assigneeId !== undefined
        ? DEMO_PROFILES.find((p) => p.id === input.assigneeId) || null
        : existing.assignee,
      updatedAt: new Date().toISOString(),
    };
    DEMO_TASKS[taskIndex] = updated;
    return updated;
  }
}

export async function deleteTask(
  supabase: SupabaseClient,
  taskId: string
): Promise<boolean> {
  try {
    const { error } = await supabase.from("tasks").delete().eq("id", taskId);
    if (error) {
      const idx = DEMO_TASKS.findIndex((t) => t.id === taskId);
      if (idx !== -1) {
        DEMO_TASKS.splice(idx, 1);
        return true;
      }
      return false;
    }
    const idx = DEMO_TASKS.findIndex((t) => t.id === taskId);
    if (idx !== -1) {
      DEMO_TASKS.splice(idx, 1);
    }
    return true;
  } catch {
    const idx = DEMO_TASKS.findIndex((t) => t.id === taskId);
    if (idx !== -1) {
      DEMO_TASKS.splice(idx, 1);
      return true;
    }
    return false;
  }
}
