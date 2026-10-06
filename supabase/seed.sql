-- ==========================================================
-- Demo Seed Data for TaskFlow Kanban Application
-- Run this in Supabase SQL Editor AFTER running schema.sql
-- ==========================================================

-- 1. Create Demo Auth Users (Password for all accounts is 'password123')
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  role,
  aud
)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'aayushi@example.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Aayushi Rajesh"}',
    NOW(),
    NOW(),
    'authenticated',
    'authenticated'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '00000000-0000-0000-0000-000000000000',
    'rahul@example.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Rahul Sharma"}',
    NOW(),
    NOW(),
    'authenticated',
    'authenticated'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    '00000000-0000-0000-0000-000000000000',
    'priya@example.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Priya Mehta"}',
    NOW(),
    NOW(),
    'authenticated',
    'authenticated'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    '00000000-0000-0000-0000-000000000000',
    'arjun@example.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Arjun Patel"}',
    NOW(),
    NOW(),
    'authenticated',
    'authenticated'
  )
ON CONFLICT (id) DO NOTHING;

-- 2. Ensure Profiles Exist (Synced with auth.users)
INSERT INTO public.profiles (id, full_name, email, avatar_url)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Aayushi Rajesh', 'aayushi@example.com', NULL),
  ('22222222-2222-2222-2222-222222222222', 'Rahul Sharma', 'rahul@example.com', NULL),
  ('33333333-3333-3333-3333-333333333333', 'Priya Mehta', 'priya@example.com', NULL),
  ('44444444-4444-4444-4444-444444444444', 'Arjun Patel', 'arjun@example.com', NULL)
ON CONFLICT (id) DO UPDATE
SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;

-- 3. Seed Project
INSERT INTO public.projects (id, name, description, created_by)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Product Launch', 'Q4 Product release roadmap and launch deliverables', '11111111-1111-1111-1111-111111111111')
ON CONFLICT (id) DO NOTHING;

-- 4. Seed Project Members
INSERT INTO public.project_members (project_id, user_id, role)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'OWNER'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'MEMBER'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'MEMBER'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 'MEMBER')
ON CONFLICT (project_id, user_id) DO NOTHING;

-- 5. Seed Tasks
-- NOTE: Aayushi Rajesh has 6 tasks in IN_PROGRESS to demonstrate the server-side Workload Balancing warning (>5 tasks)
INSERT INTO public.tasks (project_id, title, description, status, priority, due_date, assignee_id, created_by)
VALUES
  -- Aayushi Rajesh (TODO: 2, IN_PROGRESS: 6, DONE: 2) -> OVERLOADED (6 in progress > 5)
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Implement auth middleware', 'Secure Next.js route handlers with session verification', 'TODO', 'HIGH', '2026-10-15', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Design project overview UI', 'Create responsive header and project switcher component', 'TODO', 'MEDIUM', '2026-10-18', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Fix task filtering logic', 'Ensure server-side priority and assignee query params work properly', 'IN_PROGRESS', 'HIGH', '2026-10-08', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Add due date validation', 'Validate ISO date string formats in task-validation schema', 'IN_PROGRESS', 'MEDIUM', '2026-10-09', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Improve drag and drop animations', 'Integrate @dnd-kit sensor drop transitions smoothly', 'IN_PROGRESS', 'HIGH', '2026-10-10', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Create workload calculation endpoint', 'Compute overload flag server-side via in_progress count aggregate', 'IN_PROGRESS', 'HIGH', '2026-10-11', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Review database foreign key constraints', 'Verify cascade delete on project removal', 'IN_PROGRESS', 'LOW', '2026-10-12', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Benchmark database index performance', 'Check EXPLAIN output on tasks table status queries', 'IN_PROGRESS', 'MEDIUM', '2026-10-14', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Initialize repository scaffolding', 'Setup Next.js, Tailwind CSS and TypeScript configuration', 'DONE', 'HIGH', '2026-10-01', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Draft schema documentation', 'Document profiles, projects, members and tasks entity relations', 'DONE', 'LOW', '2026-10-02', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111'),

  -- Rahul Sharma (TODO: 2, IN_PROGRESS: 1, DONE: 1)
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Optimize bundle payload', 'Analyze dynamic imports for modal and drag-drop dependencies', 'TODO', 'LOW', '2026-10-20', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Configure automated test suite', 'Setup integration tests for task CRUD operations', 'TODO', 'MEDIUM', '2026-10-22', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Implement responsive sidebar', 'Ensure sidebar collapses gracefully on tablet/laptop screens', 'IN_PROGRESS', 'MEDIUM', '2026-10-12', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Setup Tailwind color tokens', 'Define subtle border, background and badge color variables', 'DONE', 'LOW', '2026-10-03', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111'),

  -- Priya Mehta (TODO: 2, IN_PROGRESS: 2, DONE: 3)
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Write API error response handler', 'Standardize JSON error output format across route handlers', 'TODO', 'MEDIUM', '2026-10-16', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Implement task card keyboard shortcuts', 'Allow quick navigation and enter key to edit task', 'TODO', 'LOW', '2026-10-25', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Build Team Workload widget', 'Display team members with active task count and overload state', 'IN_PROGRESS', 'HIGH', '2026-10-09', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Validate assignee membership', 'Prevent assigning tasks to non-project members', 'IN_PROGRESS', 'MEDIUM', '2026-10-11', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Design empty column placeholder', 'Show clean helper text and quick add task action', 'DONE', 'LOW', '2026-10-04', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Design Task Modal form', 'Create clean dialog for creating and editing tasks', 'DONE', 'MEDIUM', '2026-10-04', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Configure CORS and security headers', 'Add CSP and frame protection headers to next.config', 'DONE', 'HIGH', '2026-10-05', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111');
