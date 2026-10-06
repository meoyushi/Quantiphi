import { Workload } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { getProjectMembers } from "./user-service";
import { DEMO_TASKS } from "./task-service";

/**
 * Server-side business rule:
 * A user is considered overloaded if they have MORE THAN 5 tasks currently in 'IN_PROGRESS'.
 *
 * Threshold: inProgressCount > 5 => overloaded: true
 */
export const OVERLOAD_THRESHOLD = 5;

export async function getProjectWorkload(
  supabase: SupabaseClient,
  projectId: string
): Promise<Workload[]> {
  try {
    // 1. Fetch all members of this project
    const members = await getProjectMembers(supabase, projectId);

    // 2. Fetch IN_PROGRESS tasks grouped by assignee
    const { data: taskCounts, error } = await supabase
      .from("tasks")
      .select("assignee_id")
      .eq("project_id", projectId)
      .eq("status", "IN_PROGRESS");

    // Compute in-progress counts per assignee
    const countMap: Record<string, number> = {};

    if (!error && taskCounts) {
      taskCounts.forEach((row: any) => {
        if (row.assignee_id) {
          countMap[row.assignee_id] = (countMap[row.assignee_id] || 0) + 1;
        }
      });
    } else {
      // Fallback in-memory count from DEMO_TASKS
      DEMO_TASKS.filter(
        (t) => (t.projectId === projectId || !projectId) && t.status === "IN_PROGRESS" && t.assigneeId
      ).forEach((t) => {
        if (t.assigneeId) {
          countMap[t.assigneeId] = (countMap[t.assigneeId] || 0) + 1;
        }
      });
    }

    // 3. Construct workload array with server-calculated overload flag
    return members.map((member) => {
      const inProgressCount = countMap[member.id] || 0;
      return {
        userId: member.id,
        name: member.fullName,
        inProgressCount,
        overloaded: inProgressCount > OVERLOAD_THRESHOLD,
      };
    });
  } catch {
    // Graceful fallback for demo
    const members = await getProjectMembers(supabase, projectId);
    const countMap: Record<string, number> = {};
    DEMO_TASKS.filter(
      (t) => (t.projectId === projectId || !projectId) && t.status === "IN_PROGRESS" && t.assigneeId
    ).forEach((t) => {
      if (t.assigneeId) {
        countMap[t.assigneeId] = (countMap[t.assigneeId] || 0) + 1;
      }
    });

    return members.map((member) => {
      const inProgressCount = countMap[member.id] || 0;
      return {
        userId: member.id,
        name: member.fullName,
        inProgressCount,
        overloaded: inProgressCount > OVERLOAD_THRESHOLD,
      };
    });
  }
}
