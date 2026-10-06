import { Profile } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";

// Mock profiles for development fallback
export const DEMO_PROFILES: Profile[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    fullName: "Aayushi Rajesh",
    email: "aayushi@example.com",
    avatarUrl: null,
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    fullName: "Rahul Sharma",
    email: "rahul@example.com",
    avatarUrl: null,
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    fullName: "Priya Mehta",
    email: "priya@example.com",
    avatarUrl: null,
  },
  {
    id: "44444444-4444-4444-4444-444444444444",
    fullName: "Arjun Patel",
    email: "arjun@example.com",
    avatarUrl: null,
  },
];

export async function getCurrentUser(supabase: SupabaseClient): Promise<Profile | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      // In dev fallback return default profile
      return DEMO_PROFILES[0];
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profile) {
      return {
        id: profile.id,
        fullName: profile.full_name,
        email: profile.email,
        avatarUrl: profile.avatar_url,
        createdAt: profile.created_at,
      };
    }

    return {
      id: user.id,
      fullName: user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
      email: user.email || null,
      avatarUrl: null,
    };
  } catch {
    return DEMO_PROFILES[0];
  }
}

export async function getProjectMembers(supabase: SupabaseClient, projectId: string): Promise<Profile[]> {
  try {
    const { data, error } = await supabase
      .from("project_members")
      .select(`
        user_id,
        profiles (
          id,
          full_name,
          email,
          avatar_url
        )
      `)
      .eq("project_id", projectId);

    if (error || !data || data.length === 0) {
      return DEMO_PROFILES;
    }

    return data
      .map((item: any) => {
        const p = item.profiles;
        if (!p) return null;
        return {
          id: p.id,
          fullName: p.full_name,
          email: p.email,
          avatarUrl: p.avatar_url,
        };
      })
      .filter(Boolean) as Profile[];
  } catch {
    return DEMO_PROFILES;
  }
}

export async function getProfile(supabase: SupabaseClient, userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !data) {
      return DEMO_PROFILES.find((p) => p.id === userId) || null;
    }

    return {
      id: data.id,
      fullName: data.full_name,
      email: data.email,
      avatarUrl: data.avatar_url,
      createdAt: data.created_at,
    };
  } catch {
    return DEMO_PROFILES.find((p) => p.id === userId) || null;
  }
}
