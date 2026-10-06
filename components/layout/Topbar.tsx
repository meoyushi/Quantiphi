"use client";

import React from "react";
import { Plus, ChevronDown, Folder } from "lucide-react";
import { Project } from "@/types";
import { Button } from "@/components/ui/Button";

interface TopbarProps {
  projects: Project[];
  selectedProjectId: string;
  onSelectProject: (projectId: string) => void;
  onOpenCreateTask: () => void;
  onOpenCreateProject?: () => void;
}

export function Topbar({
  projects,
  selectedProjectId,
  onSelectProject,
  onOpenCreateTask,
  onOpenCreateProject,
}: TopbarProps) {
  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  return (
    <header className="h-14 border-b border-neutral-200/80 bg-white px-6 flex items-center justify-between shrink-0">
      {/* Project Selector */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-neutral-200 bg-neutral-50/70 hover:bg-neutral-100 transition-colors">
          <Folder className="h-4 w-4 text-neutral-500 shrink-0" />
          <select
            value={selectedProjectId}
            onChange={(e) => {
              if (e.target.value === "__NEW_PROJECT__") {
                onOpenCreateProject?.();
              } else {
                onSelectProject(e.target.value);
              }
            }}
            className="bg-transparent text-xs font-semibold text-neutral-900 focus:outline-none cursor-pointer pr-1"
          >
            {projects.map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.name}
              </option>
            ))}
            <option value="__NEW_PROJECT__">+ Create New Project...</option>
          </select>
        </div>
        {currentProject?.description && (
          <span className="hidden md:inline-block text-xs text-neutral-400 border-l border-neutral-200 pl-3">
            {currentProject.description}
          </span>
        )}
      </div>

      {/* Action CTA */}
      <div className="flex items-center gap-2">
        <Button onClick={onOpenCreateTask} size="sm" variant="primary">
          <Plus className="h-3.5 w-3.5" />
          Create Task
        </Button>
      </div>
    </header>
  );
}
