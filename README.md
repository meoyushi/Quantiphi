# TaskFlow — Kanban & Team Workload Management

A modern, developer-built task management application with Kanban-style organization and server-side workload balancing to prevent team burnout.

---

## 1. Overview

TaskFlow is a high-performance, monolithic Next.js SaaS application engineered for team task orchestration. It models the core engineering workflow:

$$\text{Project} \longrightarrow \text{Tasks} \longrightarrow \text{Assigned Team Members} \longrightarrow \text{Workflow Status (TO-DO } \to \text{IN PROGRESS } \to \text{DONE)}$$

The key differentiator is **Workload Balancing**: the backend continuously computes active in-progress task counts per engineer and flags overloaded team members (>5 in-progress tasks) with visual pulse burnout indicators.

---

## 2. Features

- **Kanban Board**: 3 focused workflow columns (`TO-DO`, `IN PROGRESS`, `DONE`) with live task counters.
- **Drag-and-Drop Workflow**: Smooth, accessible drag-and-drop state transitions built on `@dnd-kit/core` and `@dnd-kit/sortable`.
- **Full Task CRUD**: Create, read, edit, delete tasks with title, description, status, priority, due date, and assignee.
- **Priority Filtering**: Filter board views by `ALL`, `LOW`, `MEDIUM`, and `HIGH` with server-side query parameter support (`?priority=HIGH`).
- **Team Workload Balancing**: Real-time capacity widget displaying team members, their exact in-progress count, and a pulsing red burnout warning for overloaded members.
- **Project Switching & Creation**: Multi-project management and seamless workspace switching.
- **Authentication**: Supabase Auth email/password signup, login, session persistence, and profile binding.
- **Persistent Storage & Security**: PostgreSQL schema with foreign keys, checks, indexes, and Row Level Security (RLS) policies.

---

## 3. Tech Stack

- **Framework**: Next.js 15 (App Router, Route Handlers)
- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Drag & Drop**: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- **Database & Auth**: Supabase PostgreSQL + Supabase Auth via `@supabase/supabase-js` and `@supabase/ssr`
- **Icons**: Lucide React

---

## 4. Architecture

```text
Browser (React Client UI)
   │
   ▼
Next.js REST API Route Handlers (/app/api/*)
   │
   ▼
Validation Layer (lib/validations/task-validation.ts)
   │
   ▼
Service Layer (lib/services/task-service.ts, workload-service.ts, project-service.ts, user-service.ts)
   │
   ▼
Supabase Client (lib/supabase/server.ts)
   │
   ▼
PostgreSQL Database (Row Level Security + Indexes)
```

### Layer Responsibilities
1. **UI Layer (`app/`, `components/`)**: Handles rendering, local drag states, forms, and user feedback.
2. **API Layer (`app/api/`)**: Standardizes HTTP status codes (`200`, `201`, `400`, `404`, `500`), extracts query params, and handles session context.
3. **Validation Layer (`lib/validations/`)**: Authoritative input sanitization, title length limits, ISO date checks, and enum validation.
4. **Service Layer (`lib/services/`)**: Business logic execution, aggregate workload calculations, and database interaction.

---

## 5. Database Schema

The database consists of 4 relational tables in Supabase PostgreSQL:

1. **`profiles`**: Extends `auth.users` with `id`, `full_name`, `email`, and `avatar_url`. Automatically populated via a PostgreSQL trigger on user signup.
2. **`projects`**: Stores workspace initiatives (`id`, `name`, `description`, `created_by`, timestamps).
3. **`project_members`**: Join table enforcing workspace membership (`project_id`, `user_id`, `role`), with `UNIQUE(project_id, user_id)`.
4. **`tasks`**: Work items (`id`, `project_id`, `title`, `description`, `status`, `priority`, `due_date`, `assignee_id`, `created_by`, timestamps).
   - `status CHECK (status IN ('TODO', 'IN_PROGRESS', 'DONE'))`
   - `priority CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH'))`

### Database Indexes
- `idx_tasks_project_id` on `tasks(project_id)`
- `idx_tasks_assignee_id` on `tasks(assignee_id)`
- `idx_tasks_status` on `tasks(status)`
- `idx_tasks_priority` on `tasks(priority)`
- `idx_tasks_project_status` on `tasks(project_id, status)`
- `idx_project_members_project_id` on `project_members(project_id)`
- `idx_project_members_user_id` on `project_members(user_id)`

---

## 6. Workload Balancing Business Rule

> **Authoritative Server-Side Rule**:
> A user is considered **overloaded** when they have **more than 5 tasks** currently in `IN_PROGRESS`.

### Backend Query Concept
```sql
SELECT
    assignee_id,
    COUNT(*) AS in_progress_count
FROM tasks
WHERE
    project_id = $1
    AND status = 'IN_PROGRESS'
GROUP BY assignee_id;
```

Mapped on the server:
- `inProgressCount > 5` $\implies$ `overloaded = true`
- `inProgressCount <= 5` $\implies$ `overloaded = false`

The client receives:
```json
[
  {
    "userId": "11111111-1111-1111-1111-111111111111",
    "name": "Aayushi Rajesh",
    "inProgressCount": 6,
    "overloaded": true
  }
]
```

When `overloaded: true`, the UI applies a glowing red pulsing avatar (`animate-pulse-subtle`) and an "Overloaded" status badge.

---

## 7. Environment Variables

Create `.env.local` based on `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## 8. Local Setup & Execution

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Open browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

4. **Supabase Database Migration (Optional for live DB)**:
   - Run `supabase/schema.sql` in the Supabase SQL Editor.
   - Run `supabase/seed.sql` to populate demo data (with Aayushi having 6 in-progress tasks).

---

## 9. Viva & Technical Evaluation Guide

- **Why Next.js App Router?** Provides a unified full-stack architecture with collocated API route handlers, server-side caching, and seamless TypeScript integration.
- **Why REST API over GraphQL/RPC?** REST is straightforward, cacheable, aligns with standard HTTP methods (`GET`, `POST`, `PATCH`, `DELETE`), and keeps the stack lightweight for assessment review.
- **Why calculate workload on the server?** Business rules belong in the backend. Performing overload calculations on the server guarantees data consistency across multiple clients and prevents frontend tampering.
- **How does Drag & Drop persist?** When a card is dropped, `@dnd-kit` fires `onDragEnd`. The frontend applies an optimistic state update, triggers `PATCH /api/tasks/[id]` with the new status, and re-fetches the server-calculated workload to update burnout indicators. If the API fails, the UI rolls back automatically.
- **How is authorization handled?** Supabase RLS policies and backend service checks ensure users only read and mutate tasks within projects where they are registered members.
