import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProjectWorkload } from "@/lib/services/workload-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId") || "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";

    const supabase = await createClient();
    const workload = await getProjectWorkload(supabase, projectId);

    return NextResponse.json({ data: workload }, { status: 200 });
  } catch (error: any) {
    console.error("GET /api/workload error:", error);
    return NextResponse.json({ error: "Failed to fetch team workload" }, { status: 500 });
  }
}
