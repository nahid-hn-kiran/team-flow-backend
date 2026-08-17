# TeamFlow Backend

A production-oriented REST API for **TeamFlow**, a collaborative workspace and project management platform.

The backend provides the complete foundation for workspace-based collaboration, including authentication, role-based access control, projects, tasks, comments, activity tracking, user management, and administrative operations.

---

## Overview

TeamFlow is designed around a workspace-centric architecture.

Users can belong to workspaces, collaborate with other members, create projects, manage tasks, communicate through comments, and track changes through an activity history.

The backend follows a modular architecture so each major domain is isolated and can evolve independently.

### Core domains

- Authentication
- Users and profiles
- Workspaces
- Workspace members
- Projects
- Tasks
- Comments
- Activities
- Admin management
- Super Admin management

---

## Technology Stack

- **Node.js**
- **Express.js**
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL**
- **Better Auth**
- **Zod**
- **HTTP Status**
- RESTful API architecture

---

## Architecture

The project follows a modular service-oriented structure:

```text
src/
├── app/
│   ├── config/
│   ├── errorHelpers/
│   ├── interfaces/
│   ├── middleware/
│   ├── modules/
│   │   ├── activity/
│   │   ├── auth/
│   │   ├── comment/
│   │   ├── project/
│   │   ├── task/
│   │   ├── user/
│   │   └── workspace/
│   └── shared/
│
├── lib/
│   ├── auth/
│   └── prisma/
│
└── server.ts
```

Each module generally contains:

```text
module/
├── module.controller.ts
├── module.interface.ts
├── module.route.ts
├── module.service.ts
└── module.validation.ts
```

This keeps routing, validation, business logic, and HTTP handling separated.

---

# API Structure

All API endpoints are versioned under:

```text
/api/v1
```

Example:

```text
/api/v1/workspaces
/api/v1/projects
/api/v1/tasks
```

---

# Authentication

Authentication is handled through Better Auth.

The authentication system supports:

- User registration
- Login
- Session management
- Password change
- Password reset
- Role-aware authentication
- Protected API access
- Forced password change for newly created administrative accounts

Administrative accounts are not created through the public registration flow.

Admins and Super Admins are created through controlled administrative operations.

---

# Roles

TeamFlow currently supports four primary roles:

```text
USER
ADMIN
SUPER_ADMIN
DOCTOR / PATIENT
```

The TeamFlow workspace system primarily operates around:

```text
USER
ADMIN
SUPER_ADMIN
```

Authorization is enforced through middleware and service-level permission checks.

### Administrative hierarchy

```text
SUPER_ADMIN
    │
    └── ADMIN
          │
          └── USER
```

Super Admins have the highest system-level authority.

Admins have administrative capabilities but cannot perform operations reserved for Super Admins.

Regular users operate within their workspace memberships.

---

# Workspace System

Workspaces are the foundation of TeamFlow collaboration.

A workspace can contain:

- Members
- Projects
- Tasks
- Comments
- Activities

Workspace membership is explicitly stored and associated with a role.

### Workspace roles

```text
OWNER
ADMIN
MEMBER
```

The workspace owner has the highest authority within a workspace.

Workspace administrators can manage operational resources such as projects and tasks.

Regular members can participate in the workspace according to their permissions.

---

# Workspace Members

Members can be managed through workspace-specific operations.

The system supports:

- Adding members
- Removing members
- Updating workspace roles
- Viewing workspace members
- Membership validation
- Permission checks

Membership is also used as an authorization boundary.

A user cannot access workspace resources simply by knowing their IDs.

---

# Projects

Projects belong to a specific workspace.

Supported operations include:

```text
Create project
Get workspace projects
Get project by ID
Update project
Delete project
```

Projects are isolated by workspace.

The backend prevents duplicate active project names within the same workspace.

Projects use soft deletion rather than immediately removing records from the database.

---

# Tasks

Tasks belong to projects and therefore inherit the workspace boundary through the project relationship.

Tasks support:

- Creation
- Retrieval
- Updating
- Assignment
- Status changes
- Priority
- Due dates
- Soft deletion
- Comments
- Activity tracking

### Task permissions

Workspace owners and administrators can manage tasks.

Regular members can see workspace tasks but have restricted modification permissions.

A regular member can only update tasks assigned to them.

This distinction is enforced on the server rather than relying on frontend restrictions.

---

# Task Status

Tasks support status-based workflows suitable for a Kanban-style interface.

A typical workflow is:

```text
TODO
    ↓
IN_PROGRESS
    ↓
COMPLETED
```

Status changes are recorded through the activity system.

---

# Task Assignment

Tasks can be assigned to workspace members.

Before assignment, the backend verifies that the target user belongs to the relevant workspace.

This prevents assigning tasks to arbitrary users outside the workspace.

---

# Comments

Comments belong to tasks and provide task-level collaboration.

Supported operations include:

```text
Create comment
Get task comments
Get comment by ID
Update comment
Delete comment
```

Comment permissions follow workspace membership and ownership rules.

Users can modify their own comments.

Workspace owners and administrators have additional moderation capabilities.

Comments use soft deletion.

---

# Activity System

TeamFlow includes an activity/audit system to track important changes.

Activities can be associated with:

```text
Workspace
Project
Task
Comment
User
```

Each activity records information such as:

- Action
- Entity type
- Entity ID
- Workspace
- Project
- Task
- Performing user
- Description
- Metadata
- Timestamp

Example activity:

```text
Task "Build authentication" status changed from TODO to IN_PROGRESS.
```

The activity system provides the foundation for the TeamFlow activity feed.

---

# Transactions

Database transactions are used where multiple related operations must succeed or fail together.

For example, creating a workspace involves:

```text
Create workspace
       ↓
Create workspace owner membership
```

Both operations should succeed together.

Similarly, administrative account creation involves creating the authentication user and the corresponding administrative profile.

Transaction handling helps maintain database consistency.

---

# Soft Deletion

Important resources use soft deletion rather than immediate database removal.

Models can contain fields such as:

```text
isDeleted
deletedAt
```

This allows the system to preserve historical data while preventing deleted resources from appearing in normal queries.

Soft deletion is implemented across resources such as:

- Workspaces
- Projects
- Tasks
- Comments
- Administrative profiles

---

# Validation

Incoming request bodies are validated using Zod.

The typical request pipeline is:

```text
Request
   ↓
Authentication
   ↓
Authorization
   ↓
Validation
   ↓
Controller
   ↓
Service
   ↓
Prisma
   ↓
Database
```

Invalid payloads are rejected before reaching business logic.

---

# Authorization

Authorization is handled at multiple levels.

### Route-level authorization

Protected routes use authentication middleware:

```ts
checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN);
```

### Service-level authorization

Business rules are also enforced inside services.

For example:

```text
Is the user a workspace member?
        ↓
What is their workspace role?
        ↓
Does that role permit this operation?
        ↓
Does the requested resource belong to the workspace?
```

This prevents authorization from depending solely on frontend behavior.

---

# Data Isolation

TeamFlow follows strict workspace isolation.

A request involving:

```text
workspaceId
projectId
taskId
commentId
```

is validated against the relevant relationships.

For example:

```text
Workspace
   │
   └── Project
         │
         └── Task
               │
               └── Comment
```

A valid task ID alone is not sufficient to access a task through an unrelated workspace.

---

# User Profiles

Users can manage their own profile information.

Supported operations include:

```text
Get current profile
Update current profile
Change password
```

Administrative profiles use the existing `Admin` model for both:

```text
ADMIN
SUPER_ADMIN
```

The user's `role` determines their administrative authority.

There is intentionally no separate `SuperAdmin` profile model.

---

# Administrative Management

Administrative accounts are created through controlled backend operations.

The system supports creating:

```text
ADMIN
SUPER_ADMIN
```

Both use the same `Admin` Prisma model.

The difference is stored on the related `User` record:

```text
User.role = ADMIN
```

or:

```text
User.role = SUPER_ADMIN
```

New administrative accounts can be created with:

```text
needPasswordChange = true
```

so the account can require an initial password update.

---

# Error Handling

The backend uses centralized application error handling with consistent HTTP status codes.

Common responses include:

```text
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
500 Internal Server Error
```

Business-level errors are represented using the application's `AppError` abstraction.

---

# API Response Structure

Responses follow a consistent structure through the shared response utility.

Example:

```json
{
  "success": true,
  "message": "Workspace created successfully.",
  "data": {}
}
```

This keeps frontend API consumption predictable.

---

# API Modules

Current major API modules include:

```text
/auth
/users
/workspaces
/projects
/tasks
/comments
/activities
```

All routes are exposed under:

```text
/api/v1
```

---

# Development

Install dependencies:

```bash
npm install
```

Generate Prisma client:

```bash
npx prisma generate
```

Run database migrations:

```bash
npx prisma migrate dev
```

Start development server:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

Start production build:

```bash
npm start
```

---

# Environment Variables

Create a `.env` file containing the required environment configuration.

Typical configuration includes:

```env
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
PORT=
NODE_ENV=
```

Additional variables may be required depending on the configured authentication and deployment environment.

Do not commit `.env` files or production secrets to source control.

---

# Database

TeamFlow uses Prisma as the database access layer.

The database schema contains relationships between:

```text
User
Admin
Workspace
WorkspaceMember
Project
Task
Comment
Activity
```

The relational structure is designed to maintain ownership, membership, and resource boundaries throughout the application.

---

# Testing

The API has been manually tested using Postman.

Testing covered:

- Authentication
- Workspace creation
- Workspace membership
- Project CRUD
- Task CRUD
- Task assignment
- Task status changes
- Comments
- Activity generation
- User profile operations
- Admin operations
- Super Admin operations
- Authorization restrictions
- Invalid requests
- Resource isolation
- Soft-deleted resources

The backend has been tested against both successful and restricted operations.

---

# Design Principles

The backend follows several important principles:

### Modular architecture

Business domains are separated into independent modules.

### Server-side authorization

Permissions are always verified on the backend.

### Workspace isolation

Resources are scoped to their workspace relationships.

### Transactional consistency

Related database operations use transactions where necessary.

### Soft deletion

Important records are preserved rather than immediately destroyed.

### Validation at the boundary

Invalid request data is rejected before reaching business logic.

### Thin controllers

Controllers handle HTTP concerns while services contain business logic.

### Reusable services

Shared operations such as activity creation are isolated into dedicated services.

---

# Project Status

The TeamFlow backend currently provides the core functionality required by the application.

```text
Authentication             Complete
User/Profile               Complete
Workspace Management       Complete
Workspace Members          Complete
Project Management         Complete
Task Management            Complete
Task Assignment            Complete
Comments                   Complete
Activity Tracking          Complete
Admin Management           Complete
Super Admin Management     Complete
Authorization              Complete
Validation                 Complete
Soft Deletion              Complete
Transaction Handling       Complete
API Testing                Complete
Security Review            Complete
```

The backend is now considered **feature-complete for the initial TeamFlow release**.

Future backend changes will primarily be driven by frontend integration requirements, production hardening, performance improvements, and new product requirements.

---

# TeamFlow

TeamFlow is being developed as a full-stack collaborative project management platform.

The backend provides the foundation for the application while the frontend will consume these APIs to provide the workspace, project, task, collaboration, and administrative interfaces.

```text
TeamFlow
│
├── Authentication
├── Workspaces
│   ├── Members
│   ├── Projects
│   │   └── Tasks
│   │       └── Comments
│   └── Activities
│
├── User Profiles
│
└── Administration
    ├── Admin
    └── Super Admin
```
