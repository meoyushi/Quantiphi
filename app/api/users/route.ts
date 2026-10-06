import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProjectMembers } from "@/lib/services/user-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId") || "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";

    const supabase = await createClient();
    const members = await getProjectMembers(supabase, projectId);

    return NextResponse.json({ data: members }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/users error:", error);
    return NextResponse.json({ error: "Failed to fetch project members" }, { status: 500 });
  }
}
