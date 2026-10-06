-- ==========================================================
-- Supabase PostgreSQL Schema for TaskFlow Kanban Application
-- ==========================================================

-- 1. PROFILES TABLE (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROJECT_MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'MEMBER',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_project_member UNIQUE(project_id, user_id)
);

-- 4. TASKS TABLE
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'TODO' CHECK (status IN ('TODO', 'IN_PROGRESS', 'DONE')),
  priority TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
  due_date DATE NULL,
  assignee_id UUID NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_by UUID NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- INDEXES
-- ==========================================================
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_id ON public.tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON public.tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_project_status ON public.tasks(project_id, status);
CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON public.project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_members_user_id ON public.project_members(user_id);

-- ==========================================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Projects policies
CREATE POLICY "Users can view projects they are a member of"
  ON public.projects FOR SELECT
  TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.project_members
      WHERE project_members.project_id = projects.id
      AND project_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create projects"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Project creators and members can update projects"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.project_members
      WHERE project_members.project_id = projects.id
      AND project_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Project creators can delete projects"
  ON public.projects FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- Project Members policies
CREATE POLICY "Users can view members of their projects"
  ON public.project_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.project_members pm
      WHERE pm.project_id = project_members.project_id
      AND pm.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_members.project_id
      AND p.created_by = auth.uid()
    )
  );

CREATE POLICY "Project creators/members can add members"
  ON public.project_members FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_members.project_id
      AND (p.created_by = auth.uid() OR EXISTS (
        SELECT 1 FROM public.project_members pm
        WHERE pm.project_id = project_members.project_id AND pm.user_id = auth.uid()
      ))
    )
  );

-- Tasks policies
CREATE POLICY "Users can view tasks of projects they belong to"
  ON public.tasks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.project_members pm
      WHERE pm.project_id = tasks.project_id
      AND pm.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = tasks.project_id
      AND p.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can create tasks in projects they belong to"
  ON public.tasks FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.project_members pm
      WHERE pm.project_id = tasks.project_id
      AND pm.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = tasks.project_id
      AND p.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can update tasks in projects they belong to"
  ON public.tasks FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.project_members pm
      WHERE pm.project_id = tasks.project_id
      AND pm.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = tasks.project_id
      AND p.created_by = auth.uid()
    )
  );

CREATE POLICY "Users can delete tasks in projects they belong to"
  ON public.tasks FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.project_members pm
      WHERE pm.project_id = tasks.project_id
      AND pm.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = tasks.project_id
      AND p.created_by = auth.uid()
    )
  );

-- ==========================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON AUTH.USERS
-- ==========================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
