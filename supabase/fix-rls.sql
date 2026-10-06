-- ==========================================================
-- TaskFlow RLS Policy Fix for Seamless API Access
-- Run this in Supabase SQL Editor to allow API route handlers
-- and local development clients to read/write all tables.
-- ==========================================================

-- 1. Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- 2. Drop any restrictive existing policies
DROP POLICY IF EXISTS "Public profiles are viewable by authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles accessible by all" ON public.profiles;

DROP POLICY IF EXISTS "Users can view projects they are a member of" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can create projects" ON public.projects;
DROP POLICY IF EXISTS "Project creators and members can update projects" ON public.projects;
DROP POLICY IF EXISTS "Project creators can delete projects" ON public.projects;
DROP POLICY IF EXISTS "Projects accessible by all" ON public.projects;

DROP POLICY IF EXISTS "Users can view members of their projects" ON public.project_members;
DROP POLICY IF EXISTS "Project creators/members can add members" ON public.project_members;
DROP POLICY IF EXISTS "Project members accessible by all" ON public.project_members;

DROP POLICY IF EXISTS "Users can view tasks of projects they belong to" ON public.tasks;
DROP POLICY IF EXISTS "Users can create tasks in projects they belong to" ON public.tasks;
DROP POLICY IF EXISTS "Users can update tasks in projects they belong to" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete tasks in projects they belong to" ON public.tasks;
DROP POLICY IF EXISTS "Tasks accessible by all" ON public.tasks;

-- 3. Create permissive public/anon/authenticated policies
CREATE POLICY "Profiles accessible by all"
  ON public.profiles FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Projects accessible by all"
  ON public.projects FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Project members accessible by all"
  ON public.project_members FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Tasks accessible by all"
  ON public.tasks FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);
