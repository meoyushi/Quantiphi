import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createProject, getProjects } from "@/lib/services/project-service";
import { getCurrentUser } from "@/lib/services/user-service";

export async function GET() {
  try {
    const supabase = await createClient();
    const currentUser = await getCurrentUser(supabase);
    const projects = await getProjects(supabase, currentUser?.id);

    return NextResponse.json({ data: projects }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body || !body.name || typeof body.name !== "string" || body.name.trim().length === 0) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const currentUser = await getCurrentUser(supabase);
    const userId = currentUser?.id || "11111111-1111-1111-1111-111111111111";

    const project = await createProject(supabase, userId, {
      name: body.name.trim(),
      description: body.description ? body.description.trim() : null,
    });

    return NextResponse.json({ data: project }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
