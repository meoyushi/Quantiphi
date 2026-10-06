import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { deleteTask, getTaskById, updateTask } from "@/lib/services/task-service";
import { validateUpdateTaskInput } from "@/lib/validations/task-validation";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const task = await getTaskById(supabase, id);

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ data: task }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/tasks/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const validation = validateUpdateTaskInput(body);

    if (!validation.isValid || !validation.data) {
      return NextResponse.json({ error: validation.error || "Invalid input" }, { status: 400 });
    }

    const supabase = await createClient();
    const updated = await updateTask(supabase, id, validation.data);

    if (!updated) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ data: updated }, { status: 200 });
  } catch (error: any) {
    console.error("PATCH /api/tasks/[id] error:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const success = await deleteTask(supabase, id);

    if (!success) {
      return NextResponse.json({ error: "Task not found or could not be deleted" }, { status: 404 });
    }

    return NextResponse.json({ data: { success: true } }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE /api/tasks/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
