import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createTask, getTasks } from "@/lib/services/task-service";
import { getCurrentUser } from "@/lib/services/user-service";
import { validateTaskInput } from "@/lib/validations/task-validation";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId") || "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";
    const status = searchParams.get("status") || undefined;
    const priority = searchParams.get("priority") || undefined;
    const assigneeId = searchParams.get("assigneeId") || undefined;

    const supabase = await createClient();
    const tasks = await getTasks(supabase, {
      projectId,
      status,
      priority,
      assigneeId,
    });

    return NextResponse.json({ data: tasks }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/tasks error:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateTaskInput(body);

    if (!validation.isValid || !validation.data) {
      return NextResponse.json({ error: validation.error || "Invalid input" }, { status: 400 });
    }

    const supabase = await createClient();
    const currentUser = await getCurrentUser(supabase);
    const userId = currentUser?.id || "11111111-1111-1111-1111-111111111111";

    const newTask = await createTask(supabase, userId, validation.data);

    return NextResponse.json({ data: newTask }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/tasks error:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
