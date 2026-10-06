"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PriorityFilterType, Profile, Project, Task, TaskStatus, Workload } from "@/types";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { PageHeader } from "@/components/layout/PageHeader";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { PriorityFilter } from "@/components/tasks/PriorityFilter";
import { TeamList } from "@/components/team/TeamList";
import { TaskModal } from "@/components/tasks/TaskModal";
import { TaskFormData } from "@/components/tasks/TaskForm";
import { ProjectModal } from "@/components/projects/ProjectModal";
import { AlertCircle, CheckCircle2, FolderKanban, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function DashboardPage() {
  const router = useRouter();

  // Navigation and user state
  const [activeTab, setActiveTab] = useState<string>("board");
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);

  // Projects state
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  // Tasks, team and workload state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Profile[]>([]);
  const [workload, setWorkload] = useState<Workload[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilterType>("ALL");

  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultTaskStatus, setDefaultTaskStatus] = useState<TaskStatus>("TODO");
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Loading & Feedback status
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isLoadingWorkload, setIsLoadingWorkload] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 3000);
  };

  // 1. Initial Load: Projects & Current User
  useEffect(() => {
    async function init() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          setCurrentUser({
            id: user.id,
            fullName: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
            email: user.email || null,
            avatarUrl: null,
          });
        } else {
          // Demo fallback user
          setCurrentUser({
            id: "11111111-1111-1111-1111-111111111111",
            fullName: "Aayushi Rajesh",
            email: "aayushi@example.com",
            avatarUrl: null,
          });
        }

        // Fetch projects
        const res = await fetch("/api/projects");
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          setProjects(json.data);
          setSelectedProjectId(json.data[0].id);
        }
      } catch (err) {
        console.error("Initialization error:", err);
      }
    }
    init();
  }, []);

  // 2. Fetch Tasks when project or priority filter changes
  const loadTasks = useCallback(async () => {
    if (!selectedProjectId) return;
    setIsLoadingTasks(true);
    setErrorMessage(null);

    try {
      let url = `/api/tasks?projectId=${selectedProjectId}`;
      if (priorityFilter !== "ALL") {
        url += `&priority=${priorityFilter}`;
      }
      const res = await fetch(url);
      const json = await res.json();
      if (json.data) {
        setTasks(json.data);
      } else if (json.error) {
        setErrorMessage(json.error);
      }
    } catch {
      setErrorMessage("Unable to fetch tasks from server");
    } finally {
      setIsLoadingTasks(false);
    }
  }, [selectedProjectId, priorityFilter]);

  // 3. Fetch Team Members & Server-Calculated Workload
  const loadTeamAndWorkload = useCallback(async () => {
    if (!selectedProjectId) return;
    setIsLoadingWorkload(true);

    try {
      const [membersRes, workloadRes] = await Promise.all([
        fetch(`/api/users?projectId=${selectedProjectId}`),
        fetch(`/api/workload?projectId=${selectedProjectId}`),
      ]);

      const membersJson = await membersRes.json();
      if (membersJson.data) {
        setMembers(membersJson.data);
      }

      const workloadJson = await workloadRes.json();
      if (workloadJson.data) {
        setWorkload(workloadJson.data);
      }
    } catch {
      console.error("Failed to load team and workload data");
    } finally {
      setIsLoadingWorkload(false);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    loadTasks();
    loadTeamAndWorkload();
  }, [loadTasks, loadTeamAndWorkload]);

  // 4. Task Modal Handlers
  const handleOpenCreateTask = (status: TaskStatus = "TODO") => {
    setEditingTask(null);
    setDefaultTaskStatus(status);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleTaskSubmit = async (formData: TaskFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (editingTask) {
        // PATCH existing task
        const res = await fetch(`/api/tasks/${editingTask.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description || null,
            priority: formData.priority,
            status: formData.status,
            dueDate: formData.dueDate || null,
            assigneeId: formData.assigneeId || null,
          }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to update task");

        showToast("Task updated successfully");
      } else {
        // POST new task
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description || null,
            priority: formData.priority,
            status: formData.status,
            dueDate: formData.dueDate || null,
            projectId: selectedProjectId,
            assigneeId: formData.assigneeId || null,
          }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to create task");

        showToast("Task created successfully");
      }

      setIsTaskModalOpen(false);
      await Promise.all([loadTasks(), loadTeamAndWorkload()]);
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTaskDelete = async () => {
    if (!editingTask) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/tasks/${editingTask.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to delete task");

      showToast("Task deleted");
      setIsTaskModalOpen(false);
      await Promise.all([loadTasks(), loadTeamAndWorkload()]);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to delete task");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Drag-and-Drop Status Update with Optimistic UI & Server Calculation
  const handleUpdateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    const previousTasks = [...tasks];

    // Optimistically update task in UI
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to persist status change");
      }

      // Re-fetch authoritative workload to update server-side overload state
      await loadTeamAndWorkload();
    } catch (err: any) {
      // Revert optimistic update
      setTasks(previousTasks);
      setErrorMessage(err.message || "Failed to move task");
    }
  };

  // 6. Create Project Handler
  const handleCreateProject = async (data: { name: string; description: string }) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to create project");

      const newProj = json.data;
      setProjects((prev) => [newProj, ...prev]);
      setSelectedProjectId(newProj.id);
      setIsProjectModalOpen(false);
      showToast(`Project "${newProj.name}" created`);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 7. Logout Handler
  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignored
    }
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-neutral-50/40 overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar
        currentUser={currentUser}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Topbar */}
        <Topbar
          projects={projects}
          selectedProjectId={selectedProjectId}
          onSelectProject={setSelectedProjectId}
          onOpenCreateTask={() => handleOpenCreateTask("TODO")}
          onOpenCreateProject={() => setIsProjectModalOpen(true)}
        />

        {/* Global Toast / Feedback */}
        {successToast && (
          <div className="mx-6 mt-4 flex items-center gap-2 p-2.5 rounded-md bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 shadow-2xs">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mx-6 mt-4 flex items-center justify-between p-2.5 rounded-md bg-red-50 border border-red-200 text-xs font-semibold text-red-800 shadow-2xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-500 hover:text-red-800 text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tab 1: Kanban Board */}
        {activeTab === "board" && (
          <>
            <PageHeader
              title="Project Board"
              description="Organize work and keep the team balanced."
            >
              <PriorityFilter
                activePriority={priorityFilter}
                onChange={setPriorityFilter}
              />
            </PageHeader>

            <main className="p-6 space-y-6">
              {/* Kanban Board Container */}
              {isLoadingTasks && tasks.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-xs text-neutral-400 font-medium">
                  Loading tasks...
                </div>
              ) : (
                <KanbanBoard
                  tasks={tasks}
                  onTaskClick={handleOpenEditTask}
                  onAddTask={handleOpenCreateTask}
                  onUpdateTaskStatus={handleUpdateTaskStatus}
                />
              )}

              {/* Team Workload Section */}
              <div className="pt-2">
                <TeamList
                  workload={workload}
                  isLoading={isLoadingWorkload}
                />
              </div>
            </main>
          </>
        )}

        {/* Tab 2: Projects Overview */}
        {activeTab === "projects" && (
          <>
            <PageHeader
              title="Projects"
              description="Manage workspace projects and roadmap initiatives."
            >
              <Button size="sm" onClick={() => setIsProjectModalOpen(true)}>
                <Plus className="h-3.5 w-3.5" />
                New Project
              </Button>
            </PageHeader>

            <main className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((proj) => {
                  const isCurrent = proj.id === selectedProjectId;
                  return (
                    <div
                      key={proj.id}
                      className={`p-4 rounded-lg border bg-white shadow-2xs transition-all ${
                        isCurrent ? "border-neutral-900 ring-1 ring-neutral-900" : "border-neutral-200"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <FolderKanban className="h-4 w-4 text-neutral-600" />
                          <h3 className="text-sm font-bold text-neutral-900">{proj.name}</h3>
                        </div>
                        {isCurrent && (
                          <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-neutral-900 text-white">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-500 mt-2 min-h-[36px]">
                        {proj.description || "No description provided."}
                      </p>
                      <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                        <span className="text-[11px] text-neutral-400">
                          {new Date(proj.createdAt).toLocaleDateString()}
                        </span>
                        {!isCurrent && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedProjectId(proj.id);
                              setActiveTab("board");
                            }}
                          >
                            Switch to Board
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </main>
          </>
        )}

        {/* Tab 3: Team Workload Dedicated View */}
        {activeTab === "team" && (
          <>
            <PageHeader
              title="Team Workload"
              description="Real-time capacity tracking and burnout prevention."
            />
            <main className="p-6 space-y-6">
              <TeamList workload={workload} isLoading={isLoadingWorkload} />
              
              <div className="bg-white border border-neutral-200/80 rounded-lg p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                  Workload Balancing Policy
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed max-w-2xl">
                  To prevent engineer burnout and context-switching bottlenecks, our server-side rule triggers a workload warning whenever any team member has <strong>more than 5 tasks</strong> concurrently in the <strong>IN_PROGRESS</strong> state. When triggered, their avatar pulses red across the board and team metrics.
                </p>
              </div>
            </main>
          </>
        )}
      </div>

      {/* Task Create / Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        initialTask={editingTask}
        defaultStatus={defaultTaskStatus}
        members={members}
        isLoading={isSubmitting}
        onSubmit={handleTaskSubmit}
        onDelete={editingTask ? handleTaskDelete : undefined}
      />

      {/* Project Create Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSubmit={handleCreateProject}
        isLoading={isSubmitting}
      />
    </div>
  );
}
