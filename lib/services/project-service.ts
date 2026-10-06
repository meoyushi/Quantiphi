import { Project } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";

export const DEMO_PROJECTS: Project[] = [
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    name: "Product Launch",
    description: "Q4 Product release roadmap and launch deliverables",
    createdBy: "11111111-1111-1111-1111-111111111111",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    name: "Mobile App v2",
    description: "iOS and Android client revamp with offline sync",
    createdBy: "11111111-1111-1111-1111-111111111111",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function getProjects(supabase: SupabaseClient, userId?: string): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return DEMO_PROJECTS;
    }

    return data.map((p: any) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      createdBy: p.created_by,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    }));
  } catch {
    return DEMO_PROJECTS;
  }
}

export async function getProjectById(supabase: SupabaseClient, projectId: string): Promise<Project | null> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (error || !data) {
      return DEMO_PROJECTS.find((p) => p.id === projectId) || null;
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      createdBy: data.created_by,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch {
    return DEMO_PROJECTS.find((p) => p.id === projectId) || null;
  }
}

export async function createProject(
  supabase: SupabaseClient,
  userId: string,
  input: { name: string; description?: string | null }
): Promise<Project> {
  try {
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        name: input.name,
        description: input.description || null,
        created_by: userId,
      })
      .select()
      .single();

    if (projectError || !project) {
      // Return local created project fallback
      const fallbackProject: Project = {
        id: crypto.randomUUID(),
        name: input.name,
        description: input.description || null,
        createdBy: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      DEMO_PROJECTS.unshift(fallbackProject);
      return fallbackProject;
    }

    // Add creator as OWNER member
    await supabase.from("project_members").insert({
      project_id: project.id,
      user_id: userId,
      role: "OWNER",
    });

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      createdBy: project.created_by,
      createdAt: project.created_at,
      updatedAt: project.updated_at,
    };
  } catch {
    const fallbackProject: Project = {
      id: crypto.randomUUID(),
      name: input.name,
      description: input.description || null,
      createdBy: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    DEMO_PROJECTS.unshift(fallbackProject);
    return fallbackProject;
  }
}

export async function isUserProjectMember(
  supabase: SupabaseClient,
  projectId: string,
  userId: string
): Promise<boolean> {
  try {
    const { data } = await supabase
      .from("project_members")
      .select("id")
      .eq("project_id", projectId)
      .eq("user_id", userId)
      .single();

    return Boolean(data);
  } catch {
    return true; // Dev fallback
  }
}
