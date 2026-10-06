# TaskFlow — Project Progress Tracker

This document tracks the incremental engineering phases, architectural decisions, and verification steps completed for the Task Management / Kanban application.

---

## 📊 Phase Implementation Status

| Phase | Description | Status | Verification & Artifacts |
| :--- | :--- | :--- | :--- |
| **Phase 1** | Project Setup (Next.js, TypeScript, Tailwind, Configs) | ✅ Completed | [package.json](file:///Users/aayushithakre/Documents/Quantiphi/package.json), [tailwind.config.ts](file:///Users/aayushithakre/Documents/Quantiphi/tailwind.config.ts) |
| **Phase 2** | Database Schema, RLS, Indexes & Auth | ✅ Completed | [schema.sql](file:///Users/aayushithakre/Documents/Quantiphi/supabase/schema.sql), [seed.sql](file:///Users/aayushithakre/Documents/Quantiphi/supabase/seed.sql) |
| **Phase 3** | REST API Layer & Service Layer | ✅ Completed | [app/api/](file:///Users/aayushithakre/Documents/Quantiphi/app/api), [lib/services/](file:///Users/aayushithakre/Documents/Quantiphi/lib/services) |
| **Phase 4** | Dashboard Layout & Navigation | ✅ Completed | [app/dashboard/page.tsx](file:///Users/aayushithakre/Documents/Quantiphi/app/dashboard/page.tsx), [Sidebar.tsx](file:///Users/aayushithakre/Documents/Quantiphi/components/layout/Sidebar.tsx) |
| **Phase 5** | 3-Column Kanban Board | ✅ Completed | [KanbanBoard.tsx](file:///Users/aayushithakre/Documents/Quantiphi/components/kanban/KanbanBoard.tsx), [KanbanColumn.tsx](file:///Users/aayushithakre/Documents/Quantiphi/components/kanban/KanbanColumn.tsx) |
| **Phase 6** | Task CRUD Modals & Validation | ✅ Completed | [TaskModal.tsx](file:///Users/aayushithakre/Documents/Quantiphi/components/tasks/TaskModal.tsx), [task-validation.ts](file:///Users/aayushithakre/Documents/Quantiphi/lib/validations/task-validation.ts) |
| **Phase 7** | Drag-and-Drop Workflow (`@dnd-kit`) | ✅ Completed | [KanbanBoard.tsx](file:///Users/aayushithakre/Documents/Quantiphi/components/kanban/KanbanBoard.tsx), Optimistic UI updates |
| **Phase 8** | Server-Side Workload Balancing & Red Pulse | ✅ Completed | [workload-service.ts](file:///Users/aayushithakre/Documents/Quantiphi/lib/services/workload-service.ts), [TeamList.tsx](file:///Users/aayushithakre/Documents/Quantiphi/components/team/TeamList.tsx) |
| **Phase 9** | Priority Filtering (All, Low, Med, High) | ✅ Completed | [PriorityFilter.tsx](file:///Users/aayushithakre/Documents/Quantiphi/components/tasks/PriorityFilter.tsx), Query params |
| **Phase 10** | Polish, Error Handling & Viva Documentation | ✅ Completed | [README.md](file:///Users/aayushithakre/Documents/Quantiphi/README.md) |

---

## 🏗️ Architectural Decisions

1. **Separation of Concerns**:
   - **UI**: Pure React presentation, drag sensors, modal triggers.
   - **Route Handlers**: Standardized JSON responses (`{ data }` or `{ error }`) with proper HTTP status codes.
   - **Service Layer**: Business rules, database operations, and data normalization.
   - **Validation Layer**: Authoritative server-side field checking.

2. **Authoritative Server-Side Workload Rule**:
   - Overload rule is computed in [workload-service.ts](file:///Users/aayushithakre/Documents/Quantiphi/lib/services/workload-service.ts):
     $$\text{inProgressCount} > 5 \implies \text{overloaded: true}$$
   - When overloaded, the client renders a red pulsing avatar (`animate-pulse-subtle`) and an "Overloaded" status badge.

3. **Dual Persistence Mode (Live Supabase + Resilient Dev Fallback)**:
   - Connects directly to Supabase PostgreSQL when tables are live.
   - Provides an in-memory test store during offline dev/demo periods to guarantee zero crashing and instant testability.

---

## 📋 Git Commit Roadmap

We follow standard corporate **Conventional Commits** formatting:

1. `chore(setup): initialize Next.js 15 application with Tailwind CSS and TypeScript`
2. `feat(db): add PostgreSQL database schema, indexes, and RLS policies`
3. `feat(api): implement REST API endpoints and server-side service layer`
4. `feat(kanban): implement 3-column Kanban board with @dnd-kit drag and drop`
5. `feat(tasks): add task creation, editing, deletion modals and input validation`
6. `feat(workload): implement server-side workload balancing and burnout indicator`
7. `feat(filter): add server-backed priority filter and project switching`
8. `docs(readme): add architecture guide, schema docs, and viva reference`
