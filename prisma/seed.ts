import "dotenv/config";
import { auth } from "../src/lib/auth";
import { prisma } from "../src/lib/prisma";
import {
  ActivityAction,
  ActivityEntity,
  ProjectStatus,
  Role,
  TaskPriority,
  TaskStatus,
  UserStatus,
  WorkspaceRole,
} from "../src/generated/prisma/enums";

const DEMO_PASSWORD = "TeamFlow-Demo-2026!";

const demoUsers = [
  {
    key: "maya",
    name: "Maya Chen",
    email: "maya.chen@demo.teamflow.dev",
    image: "https://i.pravatar.cc/160?img=47",
  },
  {
    key: "jonah",
    name: "Jonah Brooks",
    email: "jonah.brooks@demo.teamflow.dev",
    image: "https://i.pravatar.cc/160?img=12",
  },
  {
    key: "elena",
    name: "Elena Rossi",
    email: "elena.rossi@demo.teamflow.dev",
    image: "https://i.pravatar.cc/160?img=32",
  },
  {
    key: "samir",
    name: "Samir Patel",
    email: "samir.patel@demo.teamflow.dev",
    image: "https://i.pravatar.cc/160?img=68",
  },
  {
    key: "tessa",
    name: "Tessa Morgan",
    email: "tessa.morgan@demo.teamflow.dev",
    image: "https://i.pravatar.cc/160?img=49",
  },
  {
    key: "noah",
    name: "Noah Williams",
    email: "noah.williams@demo.teamflow.dev",
    image: "https://i.pravatar.cc/160?img=11",
  },
  {
    key: "priya",
    name: "Priya Nair",
    email: "priya.nair@demo.teamflow.dev",
    image: "https://i.pravatar.cc/160?img=44",
  },
] as const;

const workspaces = [
  {
    id: "demo-workspace-product-lab",
    name: "Product Lab",
    description:
      "The cross-functional team building TeamFlow's collaboration experience.",
  },
  {
    id: "demo-workspace-growth-platform",
    name: "Growth Platform",
    description:
      "Experiments and platform work that make customer onboarding measurable.",
  },
] as const;

const projects = [
  {
    id: "demo-project-design-system",
    workspaceId: workspaces[0].id,
    name: "Design System Refresh",
    description:
      "Unify the component library and document accessible interaction patterns.",
    status: ProjectStatus.ACTIVE,
  },
  {
    id: "demo-project-usage-analytics",
    workspaceId: workspaces[0].id,
    name: "Usage Analytics",
    description:
      "Give workspace owners a clear view of adoption, retention, and team activity.",
    status: ProjectStatus.ACTIVE,
  },
  {
    id: "demo-project-sso",
    workspaceId: workspaces[0].id,
    name: "OAuth and SSO",
    description:
      "Ship secure sign-in options for larger teams without disrupting existing accounts.",
    status: ProjectStatus.PLANNING,
  },
  {
    id: "demo-project-onboarding",
    workspaceId: workspaces[1].id,
    name: "Customer Onboarding",
    description:
      "Reduce time to first project with a guided setup and thoughtful defaults.",
    status: ProjectStatus.ACTIVE,
  },
  {
    id: "demo-project-performance",
    workspaceId: workspaces[1].id,
    name: "Mobile Performance",
    description:
      "Improve perceived speed on slower networks and smaller screens.",
    status: ProjectStatus.COMPLETED,
  },
] as const;

const taskTemplates = [
  [
    "Audit color contrast across navigation states",
    "Document failing combinations and propose token-level fixes for the new navigation states.",
    TaskStatus.DONE,
    TaskPriority.HIGH,
    "maya",
    "elena",
    "2026-08-28",
  ],
  [
    "Replace one-off spacing values with layout tokens",
    "Map the most common spacing values in the dashboard and update the shared primitives.",
    TaskStatus.IN_REVIEW,
    TaskPriority.MEDIUM,
    "maya",
    "samir",
    "2026-09-12",
  ],
  [
    "Add keyboard focus treatment to data tables",
    "Make row actions and sortable headers easy to navigate without a pointer.",
    TaskStatus.IN_PROGRESS,
    TaskPriority.HIGH,
    "elena",
    "noah",
    "2026-09-15",
  ],
  [
    "Publish component usage examples",
    "Add concise examples for empty, loading, error, and populated states to the component docs.",
    TaskStatus.TODO,
    TaskPriority.LOW,
    "maya",
    "tessa",
    "2026-09-20",
  ],
  [
    "Review notification and toast hierarchy",
    "Align success, warning, and destructive feedback with the new visual language.",
    TaskStatus.DONE,
    TaskPriority.MEDIUM,
    "tessa",
    "elena",
    "2026-08-25",
  ],
  [
    "Instrument workspace activation events",
    "Capture the first project, first task, and first invited member milestones.",
    TaskStatus.IN_PROGRESS,
    TaskPriority.HIGH,
    "jonah",
    "samir",
    "2026-09-10",
  ],
  [
    "Build weekly active workspace query",
    "Create the backend aggregation used by the adoption summary without exposing raw event data.",
    TaskStatus.IN_REVIEW,
    TaskPriority.HIGH,
    "jonah",
    "priya",
    "2026-09-11",
  ],
  [
    "Add empty-state analytics coverage",
    "Verify that empty projects and task lists do not produce misleading conversion events.",
    TaskStatus.TODO,
    TaskPriority.MEDIUM,
    "priya",
    "noah",
    "2026-09-18",
  ],
  [
    "Define retention cohort boundaries",
    "Agree on account, workspace, and member-level retention definitions with product.",
    TaskStatus.DONE,
    TaskPriority.MEDIUM,
    "jonah",
    "maya",
    "2026-08-22",
  ],
  [
    "Draft SSO tenant configuration model",
    "Document the minimum provider metadata needed before adding a database migration.",
    TaskStatus.TODO,
    TaskPriority.HIGH,
    "maya",
    "priya",
    "2026-09-24",
  ],
  [
    "Create OAuth callback threat model",
    "Review redirect handling, state validation, and account-linking edge cases.",
    TaskStatus.IN_PROGRESS,
    TaskPriority.HIGH,
    "elena",
    "priya",
    "2026-09-19",
  ],
  [
    "Prepare customer-facing SSO rollout notes",
    "Write the migration and support notes for teams moving from password login.",
    TaskStatus.TODO,
    TaskPriority.LOW,
    "maya",
    "tessa",
    "2026-09-29",
  ],
  [
    "Map first-run workspace setup",
    "Turn the current empty state into a short sequence of setup decisions for new owners.",
    TaskStatus.DONE,
    TaskPriority.HIGH,
    "priya",
    "maya",
    "2026-08-30",
  ],
  [
    "Prototype suggested project templates",
    "Compare templates for product discovery, delivery, and customer operations.",
    TaskStatus.IN_PROGRESS,
    TaskPriority.MEDIUM,
    "priya",
    "tessa",
    "2026-09-14",
  ],
  [
    "Add invite reminder copy",
    "Provide clear language for pending invitations and the next action available to owners.",
    TaskStatus.IN_REVIEW,
    TaskPriority.LOW,
    "tessa",
    "elena",
    "2026-09-13",
  ],
  [
    "Measure onboarding completion funnel",
    "Define events and dashboard slices for setup, invite, project, and first-task completion.",
    TaskStatus.TODO,
    TaskPriority.MEDIUM,
    "jonah",
    "samir",
    "2026-09-21",
  ],
  [
    "Profile initial dashboard render",
    "Capture a repeatable baseline on a mid-range mobile device and identify the largest blocking assets.",
    TaskStatus.DONE,
    TaskPriority.HIGH,
    "noah",
    "noah",
    "2026-08-18",
  ],
  [
    "Defer non-critical project list work",
    "Keep the first dashboard paint independent from secondary project metadata requests.",
    TaskStatus.DONE,
    TaskPriority.HIGH,
    "noah",
    "noah",
    "2026-08-20",
  ],
  [
    "Reduce avatar and icon request overhead",
    "Confirm the fallback behavior and cache headers for member images.",
    TaskStatus.IN_REVIEW,
    TaskPriority.MEDIUM,
    "noah",
    "samir",
    "2026-09-09",
  ],
  [
    "Test task detail on 3G throttling",
    "Check comments, activity, and assignment controls under constrained network conditions.",
    TaskStatus.IN_PROGRESS,
    TaskPriority.HIGH,
    "noah",
    "elena",
    "2026-09-16",
  ],
  [
    "Document performance budget",
    "Set practical limits for JavaScript, images, and API response timing on the mobile surface.",
    TaskStatus.TODO,
    TaskPriority.LOW,
    "noah",
    "priya",
    "2026-09-22",
  ],
  [
    "Review completed-project archive behavior",
    "Confirm the completed project remains readable while excluded from active planning views.",
    TaskStatus.DONE,
    TaskPriority.LOW,
    "priya",
    "maya",
    "2026-08-27",
  ],
  [
    "Add project status transition copy",
    "Make planning, active, and completed transitions understandable in the project controls.",
    TaskStatus.TODO,
    TaskPriority.MEDIUM,
    "tessa",
    "elena",
    "2026-09-17",
  ],
  [
    "Verify task activity ordering",
    "Ensure status changes and comments appear newest-first in the task activity panel.",
    TaskStatus.DONE,
    TaskPriority.MEDIUM,
    "samir",
    "samir",
    "2026-08-29",
  ],
  [
    "Clean up stale demo workspace records",
    "Identify old local fixtures before the portfolio dataset is introduced.",
    TaskStatus.DONE,
    TaskPriority.LOW,
    "maya",
    "maya",
    "2026-08-15",
  ],
  [
    "Review API error copy with support",
    "Make permission and missing-resource responses actionable for workspace members.",
    TaskStatus.IN_PROGRESS,
    TaskPriority.MEDIUM,
    "elena",
    "tessa",
    "2026-09-23",
  ],
] as const;

const commentTemplates = [
  [
    0,
    "I found two contrast failures in the secondary action state. I have attached the token values in the design review notes.",
    "elena",
  ],
  [
    1,
    "The token mapping looks good. Can we keep the table density unchanged on the project detail view?",
    "tessa",
  ],
  [
    2,
    "The focus ring is now visible against both the canvas and the muted table rows in my local check.",
    "noah",
  ],
  [
    5,
    "I added the activation events to the tracking matrix. The first-project event is the one we should use for the headline metric.",
    "samir",
  ],
  [
    6,
    "The query is returning workspace-level counts correctly. I am checking the date boundary around Monday UTC.",
    "priya",
  ],
  [
    7,
    "The empty state should stay quiet here; it is not an activation event by itself.",
    "noah",
  ],
  [
    9,
    "I will include the provider metadata assumptions in the architecture note before we decide on the migration shape.",
    "priya",
  ],
  [
    10,
    "State validation is the main risk. I would like a second pass from someone who has worked on the callback route.",
    "elena",
  ],
  [
    12,
    "The shorter setup flow tested better in the walkthrough. Owners understood the next action without extra explanation.",
    "maya",
  ],
  [
    13,
    "The delivery template needs a review step by default; discovery should probably keep it optional.",
    "tessa",
  ],
  [
    14,
    "I tightened the copy and removed the implication that an invite expires immediately.",
    "elena",
  ],
  [
    16,
    "The first render is down by roughly 300ms after deferring the project metadata request.",
    "noah",
  ],
  [
    17,
    "This also removes a burst of requests on the workspace route. The fallback initials remain stable.",
    "samir",
  ],
  [
    18,
    "On throttled 3G, comments appear after the task shell but before the activity panel. That feels acceptable.",
    "elena",
  ],
  [
    19,
    "I will add the budget numbers to the release checklist so they are checked during future UI work.",
    "priya",
  ],
  [
    21,
    "The completed project still opens correctly from the workspace overview, so the archive behavior is safe for this release.",
    "maya",
  ],
  [
    22,
    "The copy should distinguish a project that is planned from one that is actively being delivered.",
    "elena",
  ],
  [
    23,
    "The ordering is now deterministic in the API response and matches the UI expectation.",
    "samir",
  ],
  [
    24,
    "I confirmed these are local-only fixtures and not referenced by the deployed environment.",
    "maya",
  ],
  [
    25,
    "Support will need an example for members who can update an assigned task but cannot reassign it.",
    "tessa",
  ],
  [
    3,
    "The examples make the component states much easier to review during implementation.",
    "maya",
  ],
  [
    4,
    "The destructive state now has enough separation from the neutral notification to avoid accidental scanning.",
    "elena",
  ],
  [
    8,
    "The cohort definition is ready for the metrics review. I used workspace creation as the starting event.",
    "jonah",
  ],
  [
    15,
    "The funnel should report invited members separately from members who have actually accepted access.",
    "samir",
  ],
] as const;

const activityDescriptions = [
  [
    ActivityAction.CREATED,
    ActivityEntity.WORKSPACE,
    "Product Lab was created for the core product team.",
  ],
  [
    ActivityAction.CREATED,
    ActivityEntity.WORKSPACE,
    "Growth Platform was created for onboarding and performance work.",
  ],
  [
    ActivityAction.CREATED,
    ActivityEntity.PROJECT,
    "Design System Refresh was created.",
  ],
  [
    ActivityAction.CREATED,
    ActivityEntity.PROJECT,
    "Usage Analytics was created.",
  ],
  [
    ActivityAction.CREATED,
    ActivityEntity.PROJECT,
    "OAuth and SSO was created.",
  ],
  [
    ActivityAction.CREATED,
    ActivityEntity.PROJECT,
    "Customer Onboarding was created.",
  ],
  [
    ActivityAction.CREATED,
    ActivityEntity.PROJECT,
    "Mobile Performance was created.",
  ],
  [
    ActivityAction.MEMBER_ADDED,
    ActivityEntity.MEMBER,
    "Jonah Brooks joined Product Lab as an admin.",
  ],
  [
    ActivityAction.MEMBER_ADDED,
    ActivityEntity.MEMBER,
    "Elena Rossi joined Product Lab as a member.",
  ],
  [
    ActivityAction.MEMBER_ADDED,
    ActivityEntity.MEMBER,
    "Samir Patel joined Product Lab as a member.",
  ],
  [
    ActivityAction.MEMBER_ADDED,
    ActivityEntity.MEMBER,
    "Tessa Morgan joined Product Lab as a member.",
  ],
  [
    ActivityAction.MEMBER_ADDED,
    ActivityEntity.MEMBER,
    "Noah Williams joined Product Lab as a member.",
  ],
  [
    ActivityAction.MEMBER_ADDED,
    ActivityEntity.MEMBER,
    "Priya Nair joined Growth Platform as an owner.",
  ],
  [
    ActivityAction.MEMBER_ADDED,
    ActivityEntity.MEMBER,
    "Noah Williams joined Growth Platform as a member.",
  ],
  [
    ActivityAction.MEMBER_ADDED,
    ActivityEntity.MEMBER,
    "Tessa Morgan joined Growth Platform as a member.",
  ],
  [
    ActivityAction.CREATED,
    ActivityEntity.TASK,
    "Audit color contrast across navigation states was created.",
  ],
  [
    ActivityAction.ASSIGNED,
    ActivityEntity.TASK,
    "Audit color contrast across navigation states was assigned to Elena Rossi.",
  ],
  [
    ActivityAction.STATUS_CHANGED,
    ActivityEntity.TASK,
    "Audit color contrast across navigation states moved from In progress to Done.",
  ],
  [
    ActivityAction.CREATED,
    ActivityEntity.TASK,
    "Instrument workspace activation events was created.",
  ],
  [
    ActivityAction.ASSIGNED,
    ActivityEntity.TASK,
    "Instrument workspace activation events was assigned to Samir Patel.",
  ],
  [
    ActivityAction.STATUS_CHANGED,
    ActivityEntity.TASK,
    "Instrument workspace activation events moved from To do to In progress.",
  ],
  [
    ActivityAction.CREATED,
    ActivityEntity.TASK,
    "Create OAuth callback threat model was created.",
  ],
  [
    ActivityAction.ASSIGNED,
    ActivityEntity.TASK,
    "Create OAuth callback threat model was assigned to Priya Nair.",
  ],
  [
    ActivityAction.STATUS_CHANGED,
    ActivityEntity.TASK,
    "Create OAuth callback threat model moved from To do to In progress.",
  ],
  [
    ActivityAction.CREATED,
    ActivityEntity.TASK,
    "Map first-run workspace setup was created.",
  ],
  [
    ActivityAction.STATUS_CHANGED,
    ActivityEntity.TASK,
    "Map first-run workspace setup moved from In progress to Done.",
  ],
  [
    ActivityAction.CREATED,
    ActivityEntity.TASK,
    "Profile initial dashboard render was created.",
  ],
  [
    ActivityAction.STATUS_CHANGED,
    ActivityEntity.TASK,
    "Profile initial dashboard render moved from In progress to Done.",
  ],
  [
    ActivityAction.CREATED,
    ActivityEntity.TASK,
    "Test task detail on 3G throttling was created.",
  ],
  [
    ActivityAction.ASSIGNED,
    ActivityEntity.TASK,
    "Test task detail on 3G throttling was assigned to Elena Rossi.",
  ],
  [
    ActivityAction.PRIORITY_CHANGED,
    ActivityEntity.TASK,
    "Test task detail on 3G throttling was raised to high priority.",
  ],
  [
    ActivityAction.DEADLINE_CHANGED,
    ActivityEntity.TASK,
    "The deadline for Test task detail on 3G throttling was updated.",
  ],
  [
    ActivityAction.COMMENT_ADDED,
    ActivityEntity.COMMENT,
    "A comment was added about contrast tokens.",
  ],
  [
    ActivityAction.COMMENT_ADDED,
    ActivityEntity.COMMENT,
    "A comment was added about the analytics query boundary.",
  ],
  [
    ActivityAction.COMMENT_ADDED,
    ActivityEntity.COMMENT,
    "A comment was added about the SSO callback threat model.",
  ],
  [
    ActivityAction.COMMENT_ADDED,
    ActivityEntity.COMMENT,
    "A comment was added about the mobile performance budget.",
  ],
  [
    ActivityAction.UPDATED,
    ActivityEntity.PROJECT,
    "Usage Analytics was updated with the adoption reporting scope.",
  ],
  [
    ActivityAction.UPDATED,
    ActivityEntity.PROJECT,
    "Customer Onboarding was updated with the first-run setup direction.",
  ],
  [
    ActivityAction.UPDATED,
    ActivityEntity.TASK,
    "Review notification and toast hierarchy was updated.",
  ],
  [
    ActivityAction.UPDATED,
    ActivityEntity.TASK,
    "Review API error copy with support was updated.",
  ],
  [
    ActivityAction.STATUS_CHANGED,
    ActivityEntity.TASK,
    "Build weekly active workspace query moved into review.",
  ],
  [
    ActivityAction.STATUS_CHANGED,
    ActivityEntity.TASK,
    "Add invite reminder copy moved into review.",
  ],
  [
    ActivityAction.STATUS_CHANGED,
    ActivityEntity.TASK,
    "Reduce avatar and icon request overhead moved into review.",
  ],
  [
    ActivityAction.ASSIGNED,
    ActivityEntity.TASK,
    "Prototype suggested project templates was assigned to Tessa Morgan.",
  ],
  [
    ActivityAction.ASSIGNED,
    ActivityEntity.TASK,
    "Review API error copy with support was assigned to Tessa Morgan.",
  ],
  [
    ActivityAction.DEADLINE_CHANGED,
    ActivityEntity.TASK,
    "The deadline for Instrument workspace activation events was updated.",
  ],
  [
    ActivityAction.PRIORITY_CHANGED,
    ActivityEntity.TASK,
    "The priority for Build weekly active workspace query was raised to high.",
  ],
  [
    ActivityAction.CREATED,
    ActivityEntity.TASK,
    "Add project status transition copy was created.",
  ],
  [
    ActivityAction.CREATED,
    ActivityEntity.TASK,
    "Verify task activity ordering was created.",
  ],
  [
    ActivityAction.STATUS_CHANGED,
    ActivityEntity.TASK,
    "Verify task activity ordering moved from In review to Done.",
  ],
  [
    ActivityAction.CREATED,
    ActivityEntity.TASK,
    "Reduce avatar and icon request overhead was created.",
  ],
  [
    ActivityAction.CREATED,
    ActivityEntity.TASK,
    "Document performance budget was created.",
  ],
  [
    ActivityAction.COMMENT_ADDED,
    ActivityEntity.COMMENT,
    "A comment was added about onboarding funnel definitions.",
  ],
  [
    ActivityAction.COMMENT_ADDED,
    ActivityEntity.COMMENT,
    "A comment was added about project template defaults.",
  ],
  [
    ActivityAction.UPDATED,
    ActivityEntity.WORKSPACE,
    "Product Lab was updated with its current team focus.",
  ],
  [
    ActivityAction.UPDATED,
    ActivityEntity.WORKSPACE,
    "Growth Platform was updated with its current delivery focus.",
  ],
  [
    ActivityAction.STATUS_CHANGED,
    ActivityEntity.TASK,
    "Defer non-critical project list work moved from In progress to Done.",
  ],
  [
    ActivityAction.STATUS_CHANGED,
    ActivityEntity.TASK,
    "Completed-project archive behavior was verified.",
  ],
  [
    ActivityAction.COMMENT_ADDED,
    ActivityEntity.COMMENT,
    "A comment was added about support-facing permission copy.",
  ],
  [
    ActivityAction.UPDATED,
    ActivityEntity.TASK,
    "Add empty-state analytics coverage was updated.",
  ],
  [
    ActivityAction.UPDATED,
    ActivityEntity.TASK,
    "Document performance budget was updated with mobile targets.",
  ],
] as const;

const dates = Array.from(
  { length: 70 },
  (_, index) =>
    new Date(Date.UTC(2026, 6, 12 + index, 9 + (index % 8), index % 60)),
);

async function getOrCreateDemoUser(user: (typeof demoUsers)[number]) {
  const existing = await prisma.user.findUnique({
    where: { email: user.email },
  });
  if (existing) {
    if (existing.name !== user.name)
      throw new Error(
        `Reserved demo email already belongs to another user: ${user.email}`,
      );
    return existing;
  }
  const result = await auth.api.signUpEmail({
    body: {
      name: user.name,
      email: user.email,
      password: DEMO_PASSWORD,
      role: Role.USER,
    },
  });
  if (!result?.user)
    throw new Error(`Unable to create demo user: ${user.email}`);
  return prisma.user.update({
    where: { id: result.user.id },
    data: { image: user.image, status: UserStatus.ACTIVE, isDeleted: false },
  });
}

async function main() {
  const users = Object.fromEntries(
    await Promise.all(
      demoUsers.map(
        async (user) => [user.key, await getOrCreateDemoUser(user)] as const,
      ),
    ),
  ) as Record<
    (typeof demoUsers)[number]["key"],
    Awaited<ReturnType<typeof getOrCreateDemoUser>>
  >;
  const workspaceRows = await Promise.all(
    workspaces.map((workspace) =>
      prisma.workspace.upsert({
        where: { id: workspace.id },
        create: workspace,
        update: {
          name: workspace.name,
          description: workspace.description,
          isDeleted: false,
          deletedAt: null,
        },
      }),
    ),
  );
  const workspaceById = Object.fromEntries(
    workspaceRows.map((workspace) => [workspace.id, workspace]),
  );

  const membershipDefinitions = [
    [workspaces[0].id, "maya", WorkspaceRole.OWNER],
    [workspaces[0].id, "jonah", WorkspaceRole.ADMIN],
    [workspaces[0].id, "elena", WorkspaceRole.MEMBER],
    [workspaces[0].id, "samir", WorkspaceRole.MEMBER],
    [workspaces[0].id, "tessa", WorkspaceRole.MEMBER],
    [workspaces[0].id, "noah", WorkspaceRole.MEMBER],
    [workspaces[1].id, "priya", WorkspaceRole.OWNER],
    [workspaces[1].id, "maya", WorkspaceRole.ADMIN],
    [workspaces[1].id, "noah", WorkspaceRole.MEMBER],
    [workspaces[1].id, "tessa", WorkspaceRole.MEMBER],
    [workspaces[1].id, "samir", WorkspaceRole.MEMBER],
  ] as const;
  const memberships = await Promise.all(
    membershipDefinitions.map(([workspaceId, userKey, role]) =>
      prisma.workspaceMember.upsert({
        where: {
          workspaceId_userId: { workspaceId, userId: users[userKey].id },
        },
        create: { workspaceId, userId: users[userKey].id, role },
        update: { role },
      }),
    ),
  );
  const projectRows = await Promise.all(
    projects.map((project) =>
      prisma.project.upsert({
        where: { id: project.id },
        create: project,
        update: {
          name: project.name,
          description: project.description,
          workspaceId: project.workspaceId,
          status: project.status,
          isDeleted: false,
          deletedAt: null,
        },
      }),
    ),
  );
  const taskRows = await Promise.all(
    taskTemplates.map(
      (
        [
          title,
          description,
          status,
          priority,
          creatorKey,
          assigneeKey,
          dueDate,
        ],
        index,
      ) => {
        const project = projectRows[index % projectRows.length];
        const id = `demo-task-${String(index + 1).padStart(2, "0")}`;
        const data = {
          title,
          description,
          status,
          priority,
          dueDate: new Date(`${dueDate}T17:00:00.000Z`),
          projectId: project.id,
          createdBy: users[creatorKey].id,
          assignedTo: users[assigneeKey].id,
        };
        return prisma.task.upsert({
          where: { id },
          create: { id, ...data },
          update: { ...data, isDeleted: false, deletedAt: null },
        });
      },
    ),
  );
  const commentRows = await Promise.all(
    commentTemplates.map(([taskIndex, content, authorKey], index) => {
      const task = taskRows[taskIndex];
      const id = `demo-comment-${String(index + 1).padStart(2, "0")}`;
      return prisma.comment.upsert({
        where: { id },
        create: {
          id,
          content,
          taskId: task.id,
          authorId: users[authorKey].id,
          createdAt: dates[index + 12],
        },
        update: {
          content,
          taskId: task.id,
          authorId: users[authorKey].id,
          isDeleted: false,
          deletedAt: null,
        },
      });
    }),
  );

  const activityRows = await Promise.all(
    activityDescriptions.map(([action, entityType, description], index) => {
      const task = taskRows[index % taskRows.length];
      const project = projectRows[index % projectRows.length];
      const workspace = workspaceById[project.workspaceId];
      const performer =
        users[
          (Object.keys(users) as (typeof demoUsers)[number]["key"][])[index % 7]
        ];
      const comment = commentRows[index % commentRows.length];
      const id = `demo-activity-${String(index + 1).padStart(2, "0")}`;
      const entityId =
        entityType === ActivityEntity.COMMENT
          ? comment.id
          : entityType === ActivityEntity.PROJECT
            ? project.id
            : entityType === ActivityEntity.WORKSPACE
              ? workspace.id
              : entityType === ActivityEntity.MEMBER
                ? memberships[index % memberships.length].id
                : task.id;
      const data = {
        action,
        entityType,
        entityId,
        workspaceId: workspace.id,
        projectId:
          entityType === ActivityEntity.WORKSPACE ||
          entityType === ActivityEntity.MEMBER
            ? null
            : project.id,
        taskId:
          entityType === ActivityEntity.TASK ||
          entityType === ActivityEntity.COMMENT
            ? task.id
            : null,
        performedBy: performer.id,
        description,
        metadata: { demo: true },
        createdAt: dates[index],
      };
      return prisma.activity.upsert({
        where: { id },
        create: { id, ...data },
        update: data,
      });
    }),
  );

  console.log(
    JSON.stringify(
      {
        users: Object.keys(users).length,
        workspaces: workspaceRows.length,
        memberships: memberships.length,
        projects: projectRows.length,
        tasks: taskRows.length,
        comments: commentRows.length,
        activities: activityRows.length,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
