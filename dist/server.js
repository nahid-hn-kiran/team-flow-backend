// src/app.ts
import express from "express";

// src/app/routes/index.ts
import { Router as Router9 } from "express";

// src/app/modules/auth/auth.route.ts
import { Router } from "express";

// src/app/shared/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
var catchAsync_default = catchAsync;

// src/app/modules/auth/auth.service.ts
import status2 from "http-status";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// src/generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// src/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.9.1",
  "engineVersion": "e922089b7d7502aff4249d5da3420f6fa55fc6ad",
  "activeProvider": "postgresql",
  "inlineSchema": 'model Activity {\n  id         String         @id @default(uuid(7))\n  action     ActivityAction\n  entityType ActivityEntity\n  entityId   String\n\n  workspaceId String\n  projectId   String?\n  taskId      String?\n\n  performedBy String\n\n  description String\n  metadata    Json?\n\n  createdAt DateTime @default(now())\n\n  workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)\n  performer User      @relation("ActivityPerformer", fields: [performedBy], references: [id])\n\n  project Project? @relation(fields: [projectId], references: [id], onDelete: Cascade)\n  task    Task?    @relation(fields: [taskId], references: [id], onDelete: Cascade)\n\n  @@index([workspaceId])\n  @@index([projectId])\n  @@index([taskId])\n  @@index([performedBy])\n  @@index([createdAt])\n  @@map("activity")\n}\n\nmodel Admin {\n  id            String    @id @default(uuid(7))\n  name          String\n  email         String    @unique\n  profilePhoto  String?\n  contactNumber String?\n  isDeleted     Boolean   @default(false)\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  deletedAt     DateTime?\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([email])\n  @@index([isDeleted])\n  @@map("admins")\n}\n\nmodel User {\n  id            String     @id\n  name          String\n  email         String\n  emailVerified Boolean    @default(false)\n  role          Role       @default(USER)\n  status        UserStatus @default(ACTIVE)\n  image         String?\n  createdAt     DateTime   @default(now())\n  updatedAt     DateTime   @updatedAt\n  sessions      Session[]\n  accounts      Account[]\n\n  workspaceMemberships WorkspaceMember[]\n  comments             Comment[]\n  tasksCreated         Task[]            @relation("TaskCreator")\n  tasksAssigned        Task[]            @relation("TaskAssignee")\n  activitiesPerformed  Activity[]        @relation("ActivityPerformer")\n  admin                Admin?\n\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Comment {\n  id        String    @id @default(uuid(7))\n  content   String\n  taskId    String\n  authorId  String\n  task      Task      @relation(fields: [taskId], references: [id], onDelete: Cascade)\n  author    User      @relation(fields: [authorId], references: [id])\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n\n  @@map("comment")\n}\n\nenum Role {\n  SUPER_ADMIN\n  ADMIN\n  USER\n}\n\nenum UserStatus {\n  ACTIVE\n  BLOCKED\n  DELETED\n}\n\nenum WorkspaceRole {\n  OWNER\n  ADMIN\n  MEMBER\n}\n\nenum ProjectStatus {\n  ACTIVE\n  PLANNING\n  COMPLETED\n}\n\nenum TaskStatus {\n  TODO\n  IN_PROGRESS\n  IN_REVIEW\n  DONE\n}\n\nenum TaskPriority {\n  LOW\n  MEDIUM\n  HIGH\n}\n\nenum ActivityAction {\n  CREATED\n  UPDATED\n  DELETED\n  ASSIGNED\n  UNASSIGNED\n  STATUS_CHANGED\n  PRIORITY_CHANGED\n  DEADLINE_CHANGED\n  MEMBER_ADDED\n  MEMBER_REMOVED\n  COMMENT_ADDED\n  COMMENT_UPDATED\n  COMMENT_DELETED\n}\n\nenum ActivityEntity {\n  WORKSPACE\n  PROJECT\n  TASK\n  COMMENT\n  MEMBER\n}\n\nmodel Project {\n  id          String        @id @default(uuid(7))\n  name        String\n  description String?\n  workspaceId String\n  status      ProjectStatus @default(PLANNING)\n  createdAt   DateTime      @default(now())\n  updatedAt   DateTime      @updatedAt\n  isDeleted   Boolean       @default(false)\n  deletedAt   DateTime?\n\n  workspace  Workspace  @relation(fields: [workspaceId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n  tasks      Task[]\n  activities Activity[]\n\n  @@map("project")\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Task {\n  id          String       @id @default(uuid(7))\n  title       String\n  description String?\n  status      TaskStatus   @default(TODO)\n  projectId   String\n  priority    TaskPriority @default(MEDIUM)\n  dueDate     DateTime?\n  assignedTo  String?\n  createdBy   String\n  createdAt   DateTime     @default(now())\n  updatedAt   DateTime     @updatedAt\n  isDeleted   Boolean      @default(false)\n  deletedAt   DateTime?\n\n  project  Project @relation(fields: [projectId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n  creator  User    @relation("TaskCreator", fields: [createdBy], references: [id])\n  assignee User?   @relation("TaskAssignee", fields: [assignedTo], references: [id])\n\n  comments   Comment[]\n  activities Activity[]\n\n  @@map("task")\n}\n\nmodel Workspace {\n  id          String    @id @default(uuid(7))\n  name        String\n  description String?\n  createdAt   DateTime  @default(now())\n  updatedAt   DateTime  @updatedAt\n  isDeleted   Boolean   @default(false)\n  deletedAt   DateTime?\n\n  projects   Project[]\n  members    WorkspaceMember[]\n  activities Activity[]\n\n  @@map("workspace")\n}\n\nmodel WorkspaceMember {\n  id          String        @id @default(uuid(7))\n  workspaceId String\n  userId      String\n  role        WorkspaceRole\n  createdAt   DateTime      @default(now())\n  updatedAt   DateTime      @updatedAt\n\n  workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n  user      User      @relation(fields: [userId], references: [id])\n\n  @@unique([workspaceId, userId])\n  @@index([userId])\n  @@map("workspace_member")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Activity":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"action","kind":"enum","type":"ActivityAction"},{"name":"entityType","kind":"enum","type":"ActivityEntity"},{"name":"entityId","kind":"scalar","type":"String"},{"name":"workspaceId","kind":"scalar","type":"String"},{"name":"projectId","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"performedBy","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"metadata","kind":"scalar","type":"Json"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"workspace","kind":"object","type":"Workspace","relationName":"ActivityToWorkspace"},{"name":"performer","kind":"object","type":"User","relationName":"ActivityPerformer"},{"name":"project","kind":"object","type":"Project","relationName":"ActivityToProject"},{"name":"task","kind":"object","type":"Task","relationName":"ActivityToTask"}],"dbName":"activity"},"Admin":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"contactNumber","kind":"scalar","type":"String"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AdminToUser"}],"dbName":"admins"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"workspaceMemberships","kind":"object","type":"WorkspaceMember","relationName":"UserToWorkspaceMember"},{"name":"comments","kind":"object","type":"Comment","relationName":"CommentToUser"},{"name":"tasksCreated","kind":"object","type":"Task","relationName":"TaskCreator"},{"name":"tasksAssigned","kind":"object","type":"Task","relationName":"TaskAssignee"},{"name":"activitiesPerformed","kind":"object","type":"Activity","relationName":"ActivityPerformer"},{"name":"admin","kind":"object","type":"Admin","relationName":"AdminToUser"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Comment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"content","kind":"scalar","type":"String"},{"name":"taskId","kind":"scalar","type":"String"},{"name":"authorId","kind":"scalar","type":"String"},{"name":"task","kind":"object","type":"Task","relationName":"CommentToTask"},{"name":"author","kind":"object","type":"User","relationName":"CommentToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"}],"dbName":"comment"},"Project":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"workspaceId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ProjectStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"workspace","kind":"object","type":"Workspace","relationName":"ProjectToWorkspace"},{"name":"tasks","kind":"object","type":"Task","relationName":"ProjectToTask"},{"name":"activities","kind":"object","type":"Activity","relationName":"ActivityToProject"}],"dbName":"project"},"Task":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"TaskStatus"},{"name":"projectId","kind":"scalar","type":"String"},{"name":"priority","kind":"enum","type":"TaskPriority"},{"name":"dueDate","kind":"scalar","type":"DateTime"},{"name":"assignedTo","kind":"scalar","type":"String"},{"name":"createdBy","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"project","kind":"object","type":"Project","relationName":"ProjectToTask"},{"name":"creator","kind":"object","type":"User","relationName":"TaskCreator"},{"name":"assignee","kind":"object","type":"User","relationName":"TaskAssignee"},{"name":"comments","kind":"object","type":"Comment","relationName":"CommentToTask"},{"name":"activities","kind":"object","type":"Activity","relationName":"ActivityToTask"}],"dbName":"task"},"Workspace":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"projects","kind":"object","type":"Project","relationName":"ProjectToWorkspace"},{"name":"members","kind":"object","type":"WorkspaceMember","relationName":"WorkspaceToWorkspaceMember"},{"name":"activities","kind":"object","type":"Activity","relationName":"ActivityToWorkspace"}],"dbName":"workspace"},"WorkspaceMember":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"workspaceId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"WorkspaceRole"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"workspace","kind":"object","type":"Workspace","relationName":"WorkspaceToWorkspaceMember"},{"name":"user","kind":"object","type":"User","relationName":"UserToWorkspaceMember"}],"dbName":"workspace_member"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","workspace","project","user","sessions","accounts","workspaceMemberships","task","author","comments","tasksCreated","tasksAssigned","activitiesPerformed","admin","_count","creator","assignee","activities","tasks","projects","members","performer","Activity.findUnique","Activity.findUniqueOrThrow","Activity.findFirst","Activity.findFirstOrThrow","Activity.findMany","data","Activity.createOne","Activity.createMany","Activity.createManyAndReturn","Activity.updateOne","Activity.updateMany","Activity.updateManyAndReturn","create","update","Activity.upsertOne","Activity.deleteOne","Activity.deleteMany","having","_min","_max","Activity.groupBy","Activity.aggregate","Admin.findUnique","Admin.findUniqueOrThrow","Admin.findFirst","Admin.findFirstOrThrow","Admin.findMany","Admin.createOne","Admin.createMany","Admin.createManyAndReturn","Admin.updateOne","Admin.updateMany","Admin.updateManyAndReturn","Admin.upsertOne","Admin.deleteOne","Admin.deleteMany","Admin.groupBy","Admin.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Comment.findUnique","Comment.findUniqueOrThrow","Comment.findFirst","Comment.findFirstOrThrow","Comment.findMany","Comment.createOne","Comment.createMany","Comment.createManyAndReturn","Comment.updateOne","Comment.updateMany","Comment.updateManyAndReturn","Comment.upsertOne","Comment.deleteOne","Comment.deleteMany","Comment.groupBy","Comment.aggregate","Project.findUnique","Project.findUniqueOrThrow","Project.findFirst","Project.findFirstOrThrow","Project.findMany","Project.createOne","Project.createMany","Project.createManyAndReturn","Project.updateOne","Project.updateMany","Project.updateManyAndReturn","Project.upsertOne","Project.deleteOne","Project.deleteMany","Project.groupBy","Project.aggregate","Task.findUnique","Task.findUniqueOrThrow","Task.findFirst","Task.findFirstOrThrow","Task.findMany","Task.createOne","Task.createMany","Task.createManyAndReturn","Task.updateOne","Task.updateMany","Task.updateManyAndReturn","Task.upsertOne","Task.deleteOne","Task.deleteMany","Task.groupBy","Task.aggregate","Workspace.findUnique","Workspace.findUniqueOrThrow","Workspace.findFirst","Workspace.findFirstOrThrow","Workspace.findMany","Workspace.createOne","Workspace.createMany","Workspace.createManyAndReturn","Workspace.updateOne","Workspace.updateMany","Workspace.updateManyAndReturn","Workspace.upsertOne","Workspace.deleteOne","Workspace.deleteMany","Workspace.groupBy","Workspace.aggregate","WorkspaceMember.findUnique","WorkspaceMember.findUniqueOrThrow","WorkspaceMember.findFirst","WorkspaceMember.findFirstOrThrow","WorkspaceMember.findMany","WorkspaceMember.createOne","WorkspaceMember.createMany","WorkspaceMember.createManyAndReturn","WorkspaceMember.updateOne","WorkspaceMember.updateMany","WorkspaceMember.updateManyAndReturn","WorkspaceMember.upsertOne","WorkspaceMember.deleteOne","WorkspaceMember.deleteMany","WorkspaceMember.groupBy","WorkspaceMember.aggregate","AND","OR","NOT","id","workspaceId","userId","WorkspaceRole","role","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","name","description","isDeleted","deletedAt","every","some","none","title","TaskStatus","status","projectId","TaskPriority","priority","dueDate","assignedTo","createdBy","ProjectStatus","content","taskId","authorId","identifier","value","expiresAt","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","email","emailVerified","Role","UserStatus","image","profilePhoto","contactNumber","ActivityAction","action","ActivityEntity","entityType","entityId","performedBy","metadata","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","workspaceId_userId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany"]'),
  graph: "gAZdsAESAwAAiAMAIAQAAIkDACAJAACKAwAgFwAA-gIAIM4BAACEAwAwzwEAAB0AENABAACEAwAw0QEBAAAAAdIBAQDRAgAh1gFAANMCACHkAQEA0QIAIe0BAQDSAgAh9QEBANICACGOAgAAhQOOAiKQAgAAhgOQAiKRAgEA0QIAIZICAQDRAgAhkwIAAIcDACABAAAAAQAgDwMAAIgDACATAADYAgAgFAAA9gIAIM4BAACXAwAwzwEAAAMAENABAACXAwAw0QEBANECACHSAQEA0QIAIdYBQADTAgAh1wFAANMCACHjAQEA0QIAIeQBAQDSAgAh5QEgANQCACHmAUAA1QIAIewBAACYA_QBIgUDAAClBQAgEwAAmwQAIBQAAJoFACDkAQAAowMAIOYBAACjAwAgDwMAAIgDACATAADYAgAgFAAA9gIAIM4BAACXAwAwzwEAAAMAENABAACXAwAw0QEBAAAAAdIBAQDRAgAh1gFAANMCACHXAUAA0wIAIeMBAQDRAgAh5AEBANICACHlASAA1AIAIeYBQADVAgAh7AEAAJgD9AEiAwAAAAMAIAEAAAQAMAIAAAUAIBUEAACVAwAgCwAA9QIAIBEAAPoCACASAACWAwAgEwAA2AIAIM4BAACSAwAwzwEAAAcAENABAACSAwAw0QEBANECACHWAUAA0wIAIdcBQADTAgAh5AEBANICACHlASAA1AIAIeYBQADVAgAh6gEBANECACHsAQAAkwPsASLtAQEA0QIAIe8BAACUA-8BIvABQADVAgAh8QEBANICACHyAQEA0QIAIQkEAACmBQAgCwAAmQUAIBEAAKEFACASAAChBQAgEwAAmwQAIOQBAACjAwAg5gEAAKMDACDwAQAAowMAIPEBAACjAwAgFQQAAJUDACALAAD1AgAgEQAA-gIAIBIAAJYDACATAADYAgAgzgEAAJIDADDPAQAABwAQ0AEAAJIDADDRAQEAAAAB1gFAANMCACHXAUAA0wIAIeQBAQDSAgAh5QEgANQCACHmAUAA1QIAIeoBAQDRAgAh7AEAAJMD7AEi7QEBANECACHvAQAAlAPvASLwAUAA1QIAIfEBAQDSAgAh8gEBANECACEDAAAABwAgAQAACAAwAgAACQAgDAUAAPoCACDOAQAAkQMAMM8BAAALABDQAQAAkQMAMNEBAQDRAgAh0wEBANECACHWAUAA0wIAIdcBQADTAgAh-QFAANMCACGDAgEA0QIAIYQCAQDSAgAhhQIBANICACEDBQAAoQUAIIQCAACjAwAghQIAAKMDACAMBQAA-gIAIM4BAACRAwAwzwEAAAsAENABAACRAwAw0QEBAAAAAdMBAQDRAgAh1gFAANMCACHXAUAA0wIAIfkBQADTAgAhgwIBAAAAAYQCAQDSAgAhhQIBANICACEDAAAACwAgAQAADAAwAgAADQAgEQUAAPoCACDOAQAAkAMAMM8BAAAPABDQAQAAkAMAMNEBAQDRAgAh0wEBANECACHWAUAA0wIAIdcBQADTAgAh-gEBANECACH7AQEA0QIAIfwBAQDSAgAh_QEBANICACH-AQEA0gIAIf8BQADVAgAhgAJAANUCACGBAgEA0gIAIYICAQDSAgAhCAUAAKEFACD8AQAAowMAIP0BAACjAwAg_gEAAKMDACD_AQAAowMAIIACAACjAwAggQIAAKMDACCCAgAAowMAIBEFAAD6AgAgzgEAAJADADDPAQAADwAQ0AEAAJADADDRAQEAAAAB0wEBANECACHWAUAA0wIAIdcBQADTAgAh-gEBANECACH7AQEA0QIAIfwBAQDSAgAh_QEBANICACH-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_ADABHQAAPwAwAQAAAAMAIAEAAAAHACAPAwAA4wMAIAQAALsDACAJAAC8AwAgFwAAugMAINEBAQCcAwAh0gEBAJwDACHWAUAAngMAIeQBAQCcAwAh7QEBAKcDACH1AQEApwMAIY4CAAC3A44CIpACAAC4A5ACIpECAQCcAwAhkgIBAJwDACGTAoAAAAABAgAAAAEAIB0AAEQAIAvRAQEAnAMAIdIBAQCcAwAh1gFAAJ4DACHkAQEAnAMAIe0BAQCnAwAh9QEBAKcDACGOAgAAtwOOAiKQAgAAuAOQAiKRAgEAnAMAIZICAQCcAwAhkwKAAAAAAQIAAAAdACAdAABGACACAAAAHQAgHQAARgAgAQAAAAMAIAEAAAAHACADAAAAAQAgJAAAPQAgJQAARAAgAQAAAAEAIAEAAAAdACAGEAAAogUAICoAAKQFACArAACjBQAg7QEAAKMDACD1AQAAowMAIJMCAACjAwAgDs4BAAD7AgAwzwEAAE8AENABAAD7AgAw0QEBALsCACHSAQEAuwIAIdYBQAC9AgAh5AEBALsCACHtAQEAxgIAIfUBAQDGAgAhjgIAAPwCjgIikAIAAP0CkAIikQIBALsCACGSAgEAuwIAIZMCAAD-AgAgAwAAAB0AIAEAAE4AMCkAAE8AIAMAAAAdACABAAAeADACAAABACAOBQAA-gIAIM4BAAD5AgAwzwEAACAAENABAAD5AgAw0QEBAAAAAdMBAQAAAAHWAUAA0wIAIdcBQADTAgAh4wEBANECACHlASAA1AIAIeYBQADVAgAhhgIBAAAAAYsCAQDSAgAhjAIBANICACEBAAAAUgAgAQAAAFIAIAQFAAChBQAg5gEAAKMDACCLAgAAowMAIIwCAACjAwAgAwAAACAAIAEAAFUAMAIAAFIAIAMAAAAgACABAABVADACAABSACADAAAAIAAgAQAAVQAwAgAAUgAgCwUAAKAFACDRAQEAAAAB0wEBAAAAAdYBQAAAAAHXAUAAAAAB4wEBAAAAAeUBIAAAAAHmAUAAAAABhgIBAAAAAYsCAQAAAAGMAgEAAAABAR0AAFkAIArRAQEAAAAB0wEBAAAAAdYBQAAAAAHXAUAAAAAB4wEBAAAAAeUBIAAAAAHmAUAAAAABhgIBAAAAAYsCAQAAAAGMAgEAAAABAR0AAFsAMAEdAABbADALBQAAnwUAINEBAQCcAwAh0wEBAJwDACHWAUAAngMAIdcBQACeAwAh4wEBAJwDACHlASAAqAMAIeYBQACpAwAhhgIBAJwDACGLAgEApwMAIYwCAQCnAwAhAgAAAFIAIB0AAF4AIArRAQEAnAMAIdMBAQCcAwAh1gFAAJ4DACHXAUAAngMAIeMBAQCcAwAh5QEgAKgDACHmAUAAqQMAIYYCAQCcAwAhiwIBAKcDACGMAgEApwMAIQIAAAAgACAdAABgACACAAAAIAAgHQAAYAAgAwAAAFIAICQAAFkAICUAAF4AIAEAAABSACABAAAAIAAgBhAAAJwFACAqAACeBQAgKwAAnQUAIOYBAACjAwAgiwIAAKMDACCMAgAAowMAIA3OAQAA-AIAMM8BAABnABDQAQAA-AIAMNEBAQC7AgAh0wEBALsCACHWAUAAvQIAIdcBQAC9AgAh4wEBALsCACHlASAAxwIAIeYBQADIAgAhhgIBALsCACGLAgEAxgIAIYwCAQDGAgAhAwAAACAAIAEAAGYAMCkAAGcAIAMAAAAgACABAABVADACAABSACAWBgAA8wIAIAcAAPQCACAIAADXAgAgCwAA9QIAIAwAAPYCACANAAD2AgAgDgAA2AIAIA8AAPcCACDOAQAA8AIAMM8BAAApABDQAQAA8AIAMNEBAQAAAAHVAQAA8QKJAiLWAUAA0wIAIdcBQADTAgAh4wEBANECACHlASAA1AIAIeYBQADVAgAh7AEAAPICigIihgIBAAAAAYcCIADUAgAhigIBANICACEBAAAAagAgAQAAAGoAIAoGAACXBQAgBwAAmAUAIAgAAJoEACALAACZBQAgDAAAmgUAIA0AAJoFACAOAACbBAAgDwAAmwUAIOYBAACjAwAgigIAAKMDACADAAAAKQAgAQAAbQAwAgAAagAgAwAAACkAIAEAAG0AMAIAAGoAIAMAAAApACABAABtADACAABqACATBgAAjwUAIAcAAJAFACAIAACRBQAgCwAAkgUAIAwAAJMFACANAACUBQAgDgAAlQUAIA8AAJYFACDRAQEAAAAB1QEAAACJAgLWAUAAAAAB1wFAAAAAAeMBAQAAAAHlASAAAAAB5gFAAAAAAewBAAAAigIChgIBAAAAAYcCIAAAAAGKAgEAAAABAR0AAHEAIAvRAQEAAAAB1QEAAACJAgLWAUAAAAAB1wFAAAAAAeMBAQAAAAHlASAAAAAB5gFAAAAAAewBAAAAigIChgIBAAAAAYcCIAAAAAGKAgEAAAABAR0AAHMAMAEdAABzADATBgAAvQQAIAcAAL4EACAIAAC_BAAgCwAAwAQAIAwAAMEEACANAADCBAAgDgAAwwQAIA8AAMQEACDRAQEAnAMAIdUBAAC7BIkCItYBQACeAwAh1wFAAJ4DACHjAQEAnAMAIeUBIACoAwAh5gFAAKkDACHsAQAAvASKAiKGAgEAnAMAIYcCIACoAwAhigIBAKcDACECAAAAagAgHQAAdgAgC9EBAQCcAwAh1QEAALsEiQIi1gFAAJ4DACHXAUAAngMAIeMBAQCcAwAh5QEgAKgDACHmAUAAqQMAIewBAAC8BIoCIoYCAQCcAwAhhwIgAKgDACGKAgEApwMAIQIAAAApACAdAAB4ACACAAAAKQAgHQAAeAAgAwAAAGoAICQAAHEAICUAAHYAIAEAAABqACABAAAAKQAgBRAAALgEACAqAAC6BAAgKwAAuQQAIOYBAACjAwAgigIAAKMDACAOzgEAAOkCADDPAQAAfwAQ0AEAAOkCADDRAQEAuwIAIdUBAADqAokCItYBQAC9AgAh1wFAAL0CACHjAQEAuwIAIeUBIADHAgAh5gFAAMgCACHsAQAA6wKKAiKGAgEAuwIAIYcCIADHAgAhigIBAMYCACEDAAAAKQAgAQAAfgAwKQAAfwAgAwAAACkAIAEAAG0AMAIAAGoAIAEAAAANACABAAAADQAgAwAAAAsAIAEAAAwAMAIAAA0AIAMAAAALACABAAAMADACAAANACADAAAACwAgAQAADAAwAgAADQAgCQUAALcEACDRAQEAAAAB0wEBAAAAAdYBQAAAAAHXAUAAAAAB-QFAAAAAAYMCAQAAAAGEAgEAAAABhQIBAAAAAQEdAACHAQAgCNEBAQAAAAHTAQEAAAAB1gFAAAAAAdcBQAAAAAH5AUAAAAABgwIBAAAAAYQCAQAAAAGFAgEAAAABAR0AAIkBADABHQAAiQEAMAkFAAC2BAAg0QEBAJwDACHTAQEAnAMAIdYBQACeAwAh1wFAAJ4DACH5AUAAngMAIYMCAQCcAwAhhAIBAKcDACGFAgEApwMAIQIAAAANACAdAACMAQAgCNEBAQCcAwAh0wEBAJwDACHWAUAAngMAIdcBQACeAwAh-QFAAJ4DACGDAgEAnAMAIYQCAQCnAwAhhQIBAKcDACECAAAACwAgHQAAjgEAIAIAAAALACAdAACOAQAgAwAAAA0AICQAAIcBACAlAACMAQAgAQAAAA0AIAEAAAALACAFEAAAswQAICoAALUEACArAAC0BAAghAIAAKMDACCFAgAAowMAIAvOAQAA6AIAMM8BAACVAQAQ0AEAAOgCADDRAQEAuwIAIdMBAQC7AgAh1gFAAL0CACHXAUAAvQIAIfkBQAC9AgAhgwIBALsCACGEAgEAxgIAIYUCAQDGAgAhAwAAAAsAIAEAAJQBADApAACVAQAgAwAAAAsAIAEAAAwAMAIAAA0AIAEAAAARACABAAAAEQAgAwAAAA8AIAEAABAAMAIAABEAIAMAAAAPACABAAAQADACAAARACADAAAADwAgAQAAEAAwAgAAEQAgDgUAALIEACDRAQEAAAAB0wEBAAAAAdYBQAAAAAHXAUAAAAAB-gEBAAAAAfsBAQAAAAH8AQEAAAAB_QEBAAAAAf4BAQAAAAH_AUAAAAABgAJAAAAAAYECAQAAAAGCAgEAAAABAR0AAJ0BACAN0QEBAAAAAdMBAQAAAAHWAUAAAAAB1wFAAAAAAfoBAQAAAAH7AQEAAAAB_AEBAAAAAf0BAQAAAAH-AQEAAAAB_wFAAAAAAYACQAAAAAGBAgEAAAABggIBAAAAAQEdAACfAQAwAR0AAJ8BADAOBQAAsQQAINEBAQCcAwAh0wEBAJwDACHWAUAAngMAIdcBQACeAwAh-gEBAJwDACH7AQEAnAMAIfwBAQCnAwAh_QEBAKcDACH-AQEApwMAIf8BQACpAwAhgAJAAKkDACGBAgEApwMAIYICAQCnAwAhAgAAABEAIB0AAKIBACAN0QEBAJwDACHTAQEAnAMAIdYBQACeAwAh1wFAAJ4DACH6AQEAnAMAIfsBAQCcAwAh_AEBAKcDACH9AQEApwMAIf4BAQCnAwAh_wFAAKkDACGAAkAAqQMAIYECAQCnAwAhggIBAKcDACECAAAADwAgHQAApAEAIAIAAAAPACAdAACkAQAgAwAAABEAICQAAJ0BACAlAACiAQAgAQAAABEAIAEAAAAPACAKEAAArgQAICoAALAEACArAACvBAAg_AEAAKMDACD9AQAAowMAIP4BAACjAwAg_wEAAKMDACCAAgAAowMAIIECAACjAwAgggIAAKMDACAQzgEAAOcCADDPAQAAqwEAENABAADnAgAw0QEBALsCACHTAQEAuwIAIdYBQAC9AgAh1wFAAL0CACH6AQEAuwIAIfsBAQC7AgAh_AEBAMYCACH9AQEAxgIAIf4BAQDGAgAh_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_QBIgIAAAADACAdAADpAQAgAgAAAAMAIB0AAOkBACADAAAABQAgJAAA4gEAICUAAOcBACABAAAABQAgAQAAAAMAIAUQAAChBAAgKgAAowQAICsAAKIEACDkAQAAowMAIOYBAACjAwAgDM4BAADgAgAwzwEAAPABABDQAQAA4AIAMNEBAQC7AgAh0gEBALsCACHWAUAAvQIAIdcBQAC9AgAh4wEBALsCACHkAQEAxgIAIeUBIADHAgAh5gFAAMgCACHsAQAA4QL0ASIDAAAAAwAgAQAA7wEAMCkAAPABACADAAAAAwAgAQAABAAwAgAABQAgAQAAAAkAIAEAAAAJACADAAAABwAgAQAACAAwAgAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIAMAAAAHACABAAAIADACAAAJACASBAAAoAQAIAsAAJEEACARAACPBAAgEgAAkAQAIBMAAJIEACDRAQEAAAAB1gFAAAAAAdcBQAAAAAHkAQEAAAAB5QEgAAAAAeYBQAAAAAHqAQEAAAAB7AEAAADsAQLtAQEAAAAB7wEAAADvAQLwAUAAAAAB8QEBAAAAAfIBAQAAAAEBHQAA-AEAIA3RAQEAAAAB1gFAAAAAAdcBQAAAAAHkAQEAAAAB5QEgAAAAAeYBQAAAAAHqAQEAAAAB7AEAAADsAQLtAQEAAAAB7wEAAADvAQLwAUAAAAAB8QEBAAAAAfIBAQAAAAEBHQAA-gEAMAEdAAD6AQAwAQAAACkAIBIEAACfBAAgCwAA9QMAIBEAAPMDACASAAD0AwAgEwAA9gMAINEBAQCcAwAh1gFAAJ4DACHXAUAAngMAIeQBAQCnAwAh5QEgAKgDACHmAUAAqQMAIeoBAQCcAwAh7AEAAPAD7AEi7QEBAJwDACHvAQAA8QPvASLwAUAAqQMAIfEBAQCnAwAh8gEBAJwDACECAAAACQAgHQAA_gEAIA3RAQEAnAMAIdYBQACeAwAh1wFAAJ4DACHkAQEApwMAIeUBIACoAwAh5gFAAKkDACHqAQEAnAMAIewBAADwA-wBIu0BAQCcAwAh7wEAAPED7wEi8AFAAKkDACHxAQEApwMAIfIBAQCcAwAhAgAAAAcAIB0AAIACACACAAAABwAgHQAAgAIAIAEAAAApACADAAAACQAgJAAA-AEAICUAAP4BACABAAAACQAgAQAAAAcAIAcQAACcBAAgKgAAngQAICsAAJ0EACDkAQAAowMAIOYBAACjAwAg8AEAAKMDACDxAQAAowMAIBDOAQAA2QIAMM8BAACIAgAQ0AEAANkCADDRAQEAuwIAIdYBQAC9AgAh1wFAAL0CACHkAQEAxgIAIeUBIADHAgAh5gFAAMgCACHqAQEAuwIAIewBAADaAuwBIu0BAQC7AgAh7wEAANsC7wEi8AFAAMgCACHxAQEAxgIAIfIBAQC7AgAhAwAAAAcAIAEAAIcCADApAACIAgAgAwAAAAcAIAEAAAgAMAIAAAkAIA0TAADYAgAgFQAA1gIAIBYAANcCACDOAQAA0AIAMM8BAACOAgAQ0AEAANACADDRAQEAAAAB1gFAANMCACHXAUAA0wIAIeMBAQDRAgAh5AEBANICACHlASAA1AIAIeYBQADVAgAhAQAAAIsCACABAAAAiwIAIA0TAADYAgAgFQAA1gIAIBYAANcCACDOAQAA0AIAMM8BAACOAgAQ0AEAANACADDRAQEA0QIAIdYBQADTAgAh1wFAANMCACHjAQEA0QIAIeQBAQDSAgAh5QEgANQCACHmAUAA1QIAIQUTAACbBAAgFQAAmQQAIBYAAJoEACDkAQAAowMAIOYBAACjAwAgAwAAAI4CACABAACPAgAwAgAAiwIAIAMAAACOAgAgAQAAjwIAMAIAAIsCACADAAAAjgIAIAEAAI8CADACAACLAgAgChMAAJgEACAVAACWBAAgFgAAlwQAINEBAQAAAAHWAUAAAAAB1wFAAAAAAeMBAQAAAAHkAQEAAAAB5QEgAAAAAeYBQAAAAAEBHQAAkwIAIAfRAQEAAAAB1gFAAAAAAdcBQAAAAAHjAQEAAAAB5AEBAAAAAeUBIAAAAAHmAUAAAAABAR0AAJUCADABHQAAlQIAMAoTAACsAwAgFQAAqgMAIBYAAKsDACDRAQEAnAMAIdYBQACeAwAh1wFAAJ4DACHjAQEAnAMAIeQBAQCnAwAh5QEgAKgDACHmAUAAqQMAIQIAAACLAgAgHQAAmAIAIAfRAQEAnAMAIdYBQACeAwAh1wFAAJ4DACHjAQEAnAMAIeQBAQCnAwAh5QEgAKgDACHmAUAAqQMAIQIAAACOAgAgHQAAmgIAIAIAAACOAgAgHQAAmgIAIAMAAACLAgAgJAAAkwIAICUAAJgCACABAAAAiwIAIAEAAACOAgAgBRAAAKQDACAqAACmAwAgKwAApQMAIOQBAACjAwAg5gEAAKMDACAKzgEAAMUCADDPAQAAoQIAENABAADFAgAw0QEBALsCACHWAUAAvQIAIdcBQAC9AgAh4wEBALsCACHkAQEAxgIAIeUBIADHAgAh5gFAAMgCACEDAAAAjgIAIAEAAKACADApAAChAgAgAwAAAI4CACABAACPAgAwAgAAiwIAIAEAAAAVACABAAAAFQAgAwAAABMAIAEAABQAMAIAABUAIAMAAAATACABAAAUADACAAAVACADAAAAEwAgAQAAFAAwAgAAFQAgCAMAAKEDACAFAACiAwAg0QEBAAAAAdIBAQAAAAHTAQEAAAAB1QEAAADVAQLWAUAAAAAB1wFAAAAAAQEdAACpAgAgBtEBAQAAAAHSAQEAAAAB0wEBAAAAAdUBAAAA1QEC1gFAAAAAAdcBQAAAAAEBHQAAqwIAMAEdAACrAgAwCAMAAJ8DACAFAACgAwAg0QEBAJwDACHSAQEAnAMAIdMBAQCcAwAh1QEAAJ0D1QEi1gFAAJ4DACHXAUAAngMAIQIAAAAVACAdAACuAgAgBtEBAQCcAwAh0gEBAJwDACHTAQEAnAMAIdUBAACdA9UBItYBQACeAwAh1wFAAJ4DACECAAAAEwAgHQAAsAIAIAIAAAATACAdAACwAgAgAwAAABUAICQAAKkCACAlAACuAgAgAQAAABUAIAEAAAATACADEAAAmQMAICoAAJsDACArAACaAwAgCc4BAAC6AgAwzwEAALcCABDQAQAAugIAMNEBAQC7AgAh0gEBALsCACHTAQEAuwIAIdUBAAC8AtUBItYBQAC9AgAh1wFAAL0CACEDAAAAEwAgAQAAtgIAMCkAALcCACADAAAAEwAgAQAAFAAwAgAAFQAgCc4BAAC6AgAwzwEAALcCABDQAQAAugIAMNEBAQC7AgAh0gEBALsCACHTAQEAuwIAIdUBAAC8AtUBItYBQAC9AgAh1wFAAL0CACEOEAAAvwIAICoAAMQCACArAADEAgAg2AEBAAAAAdkBAQAAAATaAQEAAAAE2wEBAAAAAdwBAQAAAAHdAQEAAAAB3gEBAAAAAd8BAQDDAgAh4AEBAAAAAeEBAQAAAAHiAQEAAAABBxAAAL8CACAqAADCAgAgKwAAwgIAINgBAAAA1QEC2QEAAADVAQjaAQAAANUBCN8BAADBAtUBIgsQAAC_AgAgKgAAwAIAICsAAMACACDYAUAAAAAB2QFAAAAABNoBQAAAAATbAUAAAAAB3AFAAAAAAd0BQAAAAAHeAUAAAAAB3wFAAL4CACELEAAAvwIAICoAAMACACArAADAAgAg2AFAAAAAAdkBQAAAAATaAUAAAAAE2wFAAAAAAdwBQAAAAAHdAUAAAAAB3gFAAAAAAd8BQAC-AgAhCNgBAgAAAAHZAQIAAAAE2gECAAAABNsBAgAAAAHcAQIAAAAB3QECAAAAAd4BAgAAAAHfAQIAvwIAIQjYAUAAAAAB2QFAAAAABNoBQAAAAATbAUAAAAAB3AFAAAAAAd0BQAAAAAHeAUAAAAAB3wFAAMACACEHEAAAvwIAICoAAMICACArAADCAgAg2AEAAADVAQLZAQAAANUBCNoBAAAA1QEI3wEAAMEC1QEiBNgBAAAA1QEC2QEAAADVAQjaAQAAANUBCN8BAADCAtUBIg4QAAC_AgAgKgAAxAIAICsAAMQCACDYAQEAAAAB2QEBAAAABNoBAQAAAATbAQEAAAAB3AEBAAAAAd0BAQAAAAHeAQEAAAAB3wEBAMMCACHgAQEAAAAB4QEBAAAAAeIBAQAAAAEL2AEBAAAAAdkBAQAAAATaAQEAAAAE2wEBAAAAAdwBAQAAAAHdAQEAAAAB3gEBAAAAAd8BAQDEAgAh4AEBAAAAAeEBAQAAAAHiAQEAAAABCs4BAADFAgAwzwEAAKECABDQAQAAxQIAMNEBAQC7AgAh1gFAAL0CACHXAUAAvQIAIeMBAQC7AgAh5AEBAMYCACHlASAAxwIAIeYBQADIAgAhDhAAAMoCACAqAADPAgAgKwAAzwIAINgBAQAAAAHZAQEAAAAF2gEBAAAABdsBAQAAAAHcAQEAAAAB3QEBAAAAAd4BAQAAAAHfAQEAzgIAIeABAQAAAAHhAQEAAAAB4gEBAAAAAQUQAAC_AgAgKgAAzQIAICsAAM0CACDYASAAAAAB3wEgAMwCACELEAAAygIAICoAAMsCACArAADLAgAg2AFAAAAAAdkBQAAAAAXaAUAAAAAF2wFAAAAAAdwBQAAAAAHdAUAAAAAB3gFAAAAAAd8BQADJAgAhCxAAAMoCACAqAADLAgAgKwAAywIAINgBQAAAAAHZAUAAAAAF2gFAAAAABdsBQAAAAAHcAUAAAAAB3QFAAAAAAd4BQAAAAAHfAUAAyQIAIQjYAQIAAAAB2QECAAAABdoBAgAAAAXbAQIAAAAB3AECAAAAAd0BAgAAAAHeAQIAAAAB3wECAMoCACEI2AFAAAAAAdkBQAAAAAXaAUAAAAAF2wFAAAAAAdwBQAAAAAHdAUAAAAAB3gFAAAAAAd8BQADLAgAhBRAAAL8CACAqAADNAgAgKwAAzQIAINgBIAAAAAHfASAAzAIAIQLYASAAAAAB3wEgAM0CACEOEAAAygIAICoAAM8CACArAADPAgAg2AEBAAAAAdkBAQAAAAXaAQEAAAAF2wEBAAAAAdwBAQAAAAHdAQEAAAAB3gEBAAAAAd8BAQDOAgAh4AEBAAAAAeEBAQAAAAHiAQEAAAABC9gBAQAAAAHZAQEAAAAF2gEBAAAABdsBAQAAAAHcAQEAAAAB3QEBAAAAAd4BAQAAAAHfAQEAzwIAIeABAQAAAAHhAQEAAAAB4gEBAAAAAQ0TAADYAgAgFQAA1gIAIBYAANcCACDOAQAA0AIAMM8BAACOAgAQ0AEAANACADDRAQEA0QIAIdYBQADTAgAh1wFAANMCACHjAQEA0QIAIeQBAQDSAgAh5QEgANQCACHmAUAA1QIAIQvYAQEAAAAB2QEBAAAABNoBAQAAAATbAQEAAAAB3AEBAAAAAd0BAQAAAAHeAQEAAAAB3wEBAMQCACHgAQEAAAAB4QEBAAAAAeIBAQAAAAEL2AEBAAAAAdkBAQAAAAXaAQEAAAAF2wEBAAAAAdwBAQAAAAHdAQEAAAAB3gEBAAAAAd8BAQDPAgAh4AEBAAAAAeEBAQAAAAHiAQEAAAABCNgBQAAAAAHZAUAAAAAE2gFAAAAABNsBQAAAAAHcAUAAAAAB3QFAAAAAAd4BQAAAAAHfAUAAwAIAIQLYASAAAAAB3wEgAM0CACEI2AFAAAAAAdkBQAAAAAXaAUAAAAAF2wFAAAAAAdwBQAAAAAHdAUAAAAAB3gFAAAAAAd8BQADLAgAhA-cBAAADACDoAQAAAwAg6QEAAAMAIAPnAQAAEwAg6AEAABMAIOkBAAATACAD5wEAAB0AIOgBAAAdACDpAQAAHQAgEM4BAADZAgAwzwEAAIgCABDQAQAA2QIAMNEBAQC7AgAh1gFAAL0CACHXAUAAvQIAIeQBAQDGAgAh5QEgAMcCACHmAUAAyAIAIeoBAQC7AgAh7AEAANoC7AEi7QEBALsCACHvAQAA2wLvASLwAUAAyAIAIfEBAQDGAgAh8gEBALsCACEHEAAAvwIAICoAAN8CACArAADfAgAg2AEAAADsAQLZAQAAAOwBCNoBAAAA7AEI3wEAAN4C7AEiBxAAAL8CACAqAADdAgAgKwAA3QIAINgBAAAA7wEC2QEAAADvAQjaAQAAAO8BCN8BAADcAu8BIgcQAAC_AgAgKgAA3QIAICsAAN0CACDYAQAAAO8BAtkBAAAA7wEI2gEAAADvAQjfAQAA3ALvASIE2AEAAADvAQLZAQAAAO8BCNoBAAAA7wEI3wEAAN0C7wEiBxAAAL8CACAqAADfAgAgKwAA3wIAINgBAAAA7AEC2QEAAADsAQjaAQAAAOwBCN8BAADeAuwBIgTYAQAAAOwBAtkBAAAA7AEI2gEAAADsAQjfAQAA3wLsASIMzgEAAOACADDPAQAA8AEAENABAADgAgAw0QEBALsCACHSAQEAuwIAIdYBQAC9AgAh1wFAAL0CACHjAQEAuwIAIeQBAQDGAgAh5QEgAMcCACHmAUAAyAIAIewBAADhAvQBIgcQAAC_AgAgKgAA4wIAICsAAOMCACDYAQAAAPQBAtkBAAAA9AEI2gEAAAD0AQjfAQAA4gL0ASIHEAAAvwIAICoAAOMCACArAADjAgAg2AEAAAD0AQLZAQAAAPQBCNoBAAAA9AEI3wEAAOIC9AEiBNgBAAAA9AEC2QEAAAD0AQjaAQAAAPQBCN8BAADjAvQBIgvOAQAA5AIAMM8BAADaAQAQ0AEAAOQCADDRAQEAuwIAIdYBQAC9AgAh1wFAAL0CACHlASAAxwIAIeYBQADIAgAh9AEBALsCACH1AQEAuwIAIfYBAQC7AgAhCc4BAADlAgAwzwEAAMQBABDQAQAA5QIAMNEBAQC7AgAh1gFAAL0CACHXAUAAvQIAIfcBAQC7AgAh-AEBALsCACH5AUAAvQIAIQnOAQAA5gIAMM8BAACxAQAQ0AEAAOYCADDRAQEA0QIAIdYBQADTAgAh1wFAANMCACH3AQEA0QIAIfgBAQDRAgAh-QFAANMCACEQzgEAAOcCADDPAQAAqwEAENABAADnAgAw0QEBALsCACHTAQEAuwIAIdYBQAC9AgAh1wFAAL0CACH6AQEAuwIAIfsBAQC7AgAh_AEBAMYCACH9AQEAxgIAIf4BAQDGAgAh_wFAAMgCACGAAkAAyAIAIYECAQDGAgAhggIBAMYCACELzgEAAOgCADDPAQAAlQEAENABAADoAgAw0QEBALsCACHTAQEAuwIAIdYBQAC9AgAh1wFAAL0CACH5AUAAvQIAIYMCAQC7AgAhhAIBAMYCACGFAgEAxgIAIQ7OAQAA6QIAMM8BAAB_ABDQAQAA6QIAMNEBAQC7AgAh1QEAAOoCiQIi1gFAAL0CACHXAUAAvQIAIeMBAQC7AgAh5QEgAMcCACHmAUAAyAIAIewBAADrAooCIoYCAQC7AgAhhwIgAMcCACGKAgEAxgIAIQcQAAC_AgAgKgAA7wIAICsAAO8CACDYAQAAAIkCAtkBAAAAiQII2gEAAACJAgjfAQAA7gKJAiIHEAAAvwIAICoAAO0CACArAADtAgAg2AEAAACKAgLZAQAAAIoCCNoBAAAAigII3wEAAOwCigIiBxAAAL8CACAqAADtAgAgKwAA7QIAINgBAAAAigIC2QEAAACKAgjaAQAAAIoCCN8BAADsAooCIgTYAQAAAIoCAtkBAAAAigII2gEAAACKAgjfAQAA7QKKAiIHEAAAvwIAICoAAO8CACArAADvAgAg2AEAAACJAgLZAQAAAIkCCNoBAAAAiQII3wEAAO4CiQIiBNgBAAAAiQIC2QEAAACJAgjaAQAAAIkCCN8BAADvAokCIhYGAADzAgAgBwAA9AIAIAgAANcCACALAAD1AgAgDAAA9gIAIA0AAPYCACAOAADYAgAgDwAA9wIAIM4BAADwAgAwzwEAACkAENABAADwAgAw0QEBANECACHVAQAA8QKJAiLWAUAA0wIAIdcBQADTAgAh4wEBANECACHlASAA1AIAIeYBQADVAgAh7AEAAPICigIihgIBANECACGHAiAA1AIAIYoCAQDSAgAhBNgBAAAAiQIC2QEAAACJAgjaAQAAAIkCCN8BAADvAokCIgTYAQAAAIoCAtkBAAAAigII2gEAAACKAgjfAQAA7QKKAiID5wEAAAsAIOgBAAALACDpAQAACwAgA-cBAAAPACDoAQAADwAg6QEAAA8AIAPnAQAAFwAg6AEAABcAIOkBAAAXACAD5wEAAAcAIOgBAAAHACDpAQAABwAgEAUAAPoCACDOAQAA-QIAMM8BAAAgABDQAQAA-QIAMNEBAQDRAgAh0wEBANECACHWAUAA0wIAIdcBQADTAgAh4wEBANECACHlASAA1AIAIeYBQADVAgAhhgIBANECACGLAgEA0gIAIYwCAQDSAgAhmwIAACAAIJwCAAAgACANzgEAAPgCADDPAQAAZwAQ0AEAAPgCADDRAQEAuwIAIdMBAQC7AgAh1gFAAL0CACHXAUAAvQIAIeMBAQC7AgAh5QEgAMcCACHmAUAAyAIAIYYCAQC7AgAhiwIBAMYCACGMAgEAxgIAIQ4FAAD6AgAgzgEAAPkCADDPAQAAIAAQ0AEAAPkCADDRAQEA0QIAIdMBAQDRAgAh1gFAANMCACHXAUAA0wIAIeMBAQDRAgAh5QEgANQCACHmAUAA1QIAIYYCAQDRAgAhiwIBANICACGMAgEA0gIAIRgGAADzAgAgBwAA9AIAIAgAANcCACALAAD1AgAgDAAA9gIAIA0AAPYCACAOAADYAgAgDwAA9wIAIM4BAADwAgAwzwEAACkAENABAADwAgAw0QEBANECACHVAQAA8QKJAiLWAUAA0wIAIdcBQADTAgAh4wEBANECACHlASAA1AIAIeYBQADVAgAh7AEAAPICigIihgIBANECACGHAiAA1AIAIYoCAQDSAgAhmwIAACkAIJwCAAApACAOzgEAAPsCADDPAQAATwAQ0AEAAPsCADDRAQEAuwIAIdIBAQC7AgAh1gFAAL0CACHkAQEAuwIAIe0BAQDGAgAh9QEBAMYCACGOAgAA_AKOAiKQAgAA_QKQAiKRAgEAuwIAIZICAQC7AgAhkwIAAP4CACAHEAAAvwIAICoAAIMDACArAACDAwAg2AEAAACOAgLZAQAAAI4CCNoBAAAAjgII3wEAAIIDjgIiBxAAAL8CACAqAACBAwAgKwAAgQMAINgBAAAAkAIC2QEAAACQAgjaAQAAAJACCN8BAACAA5ACIg8QAADKAgAgKgAA_wIAICsAAP8CACDYAYAAAAAB2wGAAAAAAdwBgAAAAAHdAYAAAAAB3gGAAAAAAd8BgAAAAAGUAgEAAAABlQIBAAAAAZYCAQAAAAGXAoAAAAABmAKAAAAAAZkCgAAAAAEM2AGAAAAAAdsBgAAAAAHcAYAAAAAB3QGAAAAAAd4BgAAAAAHfAYAAAAABlAIBAAAAAZUCAQAAAAGWAgEAAAABlwKAAAAAAZgCgAAAAAGZAoAAAAABBxAAAL8CACAqAACBAwAgKwAAgQMAINgBAAAAkAIC2QEAAACQAgjaAQAAAJACCN8BAACAA5ACIgTYAQAAAJACAtkBAAAAkAII2gEAAACQAgjfAQAAgQOQAiIHEAAAvwIAICoAAIMDACArAACDAwAg2AEAAACOAgLZAQAAAI4CCNoBAAAAjgII3wEAAIIDjgIiBNgBAAAAjgIC2QEAAACOAgjaAQAAAI4CCN8BAACDA44CIhIDAACIAwAgBAAAiQMAIAkAAIoDACAXAAD6AgAgzgEAAIQDADDPAQAAHQAQ0AEAAIQDADDRAQEA0QIAIdIBAQDRAgAh1gFAANMCACHkAQEA0QIAIe0BAQDSAgAh9QEBANICACGOAgAAhQOOAiKQAgAAhgOQAiKRAgEA0QIAIZICAQDRAgAhkwIAAIcDACAE2AEAAACOAgLZAQAAAI4CCNoBAAAAjgII3wEAAIMDjgIiBNgBAAAAkAIC2QEAAACQAgjaAQAAAJACCN8BAACBA5ACIgzYAYAAAAAB2wGAAAAAAdwBgAAAAAHdAYAAAAAB3gGAAAAAAd8BgAAAAAGUAgEAAAABlQIBAAAAAZYCAQAAAAGXAoAAAAABmAKAAAAAAZkCgAAAAAEPEwAA2AIAIBUAANYCACAWAADXAgAgzgEAANACADDPAQAAjgIAENABAADQAgAw0QEBANECACHWAUAA0wIAIdcBQADTAgAh4wEBANECACHkAQEA0gIAIeUBIADUAgAh5gFAANUCACGbAgAAjgIAIJwCAACOAgAgEQMAAIgDACATAADYAgAgFAAA9gIAIM4BAACXAwAwzwEAAAMAENABAACXAwAw0QEBANECACHSAQEA0QIAIdYBQADTAgAh1wFAANMCACHjAQEA0QIAIeQBAQDSAgAh5QEgANQCACHmAUAA1QIAIewBAACYA_QBIpsCAAADACCcAgAAAwAgFwQAAJUDACALAAD1AgAgEQAA-gIAIBIAAJYDACATAADYAgAgzgEAAJIDADDPAQAABwAQ0AEAAJIDADDRAQEA0QIAIdYBQADTAgAh1wFAANMCACHkAQEA0gIAIeUBIADUAgAh5gFAANUCACHqAQEA0QIAIewBAACTA-wBIu0BAQDRAgAh7wEAAJQD7wEi8AFAANUCACHxAQEA0gIAIfIBAQDRAgAhmwIAAAcAIJwCAAAHACANCQAAjAMAIAoAAPoCACDOAQAAiwMAMM8BAAAXABDQAQAAiwMAMNEBAQDRAgAh1gFAANMCACHXAUAA0wIAIeUBIADUAgAh5gFAANUCACH0AQEA0QIAIfUBAQDRAgAh9gEBANECACEXBAAAlQMAIAsAAPUCACARAAD6AgAgEgAAlgMAIBMAANgCACDOAQAAkgMAMM8BAAAHABDQAQAAkgMAMNEBAQDRAgAh1gFAANMCACHXAUAA0wIAIeQBAQDSAgAh5QEgANQCACHmAUAA1QIAIeoBAQDRAgAh7AEAAJMD7AEi7QEBANECACHvAQAAlAPvASLwAUAA1QIAIfEBAQDSAgAh8gEBANECACGbAgAABwAgnAIAAAcAIALSAQEAAAAB0wEBAAAAAQsDAACIAwAgBQAA-gIAIM4BAACOAwAwzwEAABMAENABAACOAwAw0QEBANECACHSAQEA0QIAIdMBAQDRAgAh1QEAAI8D1QEi1gFAANMCACHXAUAA0wIAIQTYAQAAANUBAtkBAAAA1QEI2gEAAADVAQjfAQAAwgLVASIRBQAA-gIAIM4BAACQAwAwzwEAAA8AENABAACQAwAw0QEBANECACHTAQEA0QIAIdYBQADTAgAh1wFAANMCACH6AQEA0QIAIfsBAQDRAgAh_AEBANICACH9AQEA0gIAIf4BAQDSAgAh_wFAANUCACGAAkAA1QIAIYECAQDSAgAhggIBANICACEMBQAA-gIAIM4BAACRAwAwzwEAAAsAENABAACRAwAw0QEBANECACHTAQEA0QIAIdYBQADTAgAh1wFAANMCACH5AUAA0wIAIYMCAQDRAgAhhAIBANICACGFAgEA0gIAIRUEAACVAwAgCwAA9QIAIBEAAPoCACASAACWAwAgEwAA2AIAIM4BAACSAwAwzwEAAAcAENABAACSAwAw0QEBANECACHWAUAA0wIAIdcBQADTAgAh5AEBANICACHlASAA1AIAIeYBQADVAgAh6gEBANECACHsAQAAkwPsASLtAQEA0QIAIe8BAACUA-8BIvABQADVAgAh8QEBANICACHyAQEA0QIAIQTYAQAAAOwBAtkBAAAA7AEI2gEAAADsAQjfAQAA3wLsASIE2AEAAADvAQLZAQAAAO8BCNoBAAAA7wEI3wEAAN0C7wEiEQMAAIgDACATAADYAgAgFAAA9gIAIM4BAACXAwAwzwEAAAMAENABAACXAwAw0QEBANECACHSAQEA0QIAIdYBQADTAgAh1wFAANMCACHjAQEA0QIAIeQBAQDSAgAh5QEgANQCACHmAUAA1QIAIewBAACYA_QBIpsCAAADACCcAgAAAwAgGAYAAPMCACAHAAD0AgAgCAAA1wIAIAsAAPUCACAMAAD2AgAgDQAA9gIAIA4AANgCACAPAAD3AgAgzgEAAPACADDPAQAAKQAQ0AEAAPACADDRAQEA0QIAIdUBAADxAokCItYBQADTAgAh1wFAANMCACHjAQEA0QIAIeUBIADUAgAh5gFAANUCACHsAQAA8gKKAiKGAgEA0QIAIYcCIADUAgAhigIBANICACGbAgAAKQAgnAIAACkAIA8DAACIAwAgEwAA2AIAIBQAAPYCACDOAQAAlwMAMM8BAAADABDQAQAAlwMAMNEBAQDRAgAh0gEBANECACHWAUAA0wIAIdcBQADTAgAh4wEBANECACHkAQEA0gIAIeUBIADUAgAh5gFAANUCACHsAQAAmAP0ASIE2AEAAAD0AQLZAQAAAPQBCNoBAAAA9AEI3wEAAOMC9AEiAAAAAaACAQAAAAEBoAIAAADVAQIBoAJAAAAAAQUkAAD5BQAgJQAA_wUAIJ0CAAD6BQAgngIAAP4FACCjAgAAiwIAIAUkAAD3BQAgJQAA_AUAIJ0CAAD4BQAgngIAAPsFACCjAgAAagAgAyQAAPkFACCdAgAA-gUAIKMCAACLAgAgAyQAAPcFACCdAgAA-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_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-wBIu8BAADxA-8BIvABQACpAwAh8QEBAKcDACHyAQEAnAMAIQGgAgAAAOwBAgGgAgAAAO8BAhALAAD1AwAgEQAA8wMAIBIAAPQDACATAAD2AwAg0QEBAJwDACHWAUAAngMAIdcBQACeAwAh5AEBAKcDACHlASAAqAMAIeYBQACpAwAh6gEBAJwDACHsAQAA8APsASLvAQAA8QPvASLwAUAAqQMAIfEBAQCnAwAh8gEBAJwDACEFJAAAzwUAICUAANwFACCdAgAA0AUAIJ4CAADbBQAgowIAAGoAIAckAADNBQAgJQAA2QUAIJ0CAADOBQAgngIAANgFACChAgAAKQAgogIAACkAIKMCAABqACALJAAAgAQAMCUAAIUEADCdAgAAgQQAMJ4CAACCBAAwnwIAAIMEACCgAgAAhAQAMKECAACEBAAwogIAAIQEADCjAgAAhAQAMKQCAACGBAAwpQIAAIcEADALJAAA9wMAMCUAAPsDADCdAgAA-AMAMJ4CAAD5AwAwnwIAAPoDACCgAgAAsQMAMKECAACxAwAwogIAALEDADCjAgAAsQMAMKQCAAD8AwAwpQIAALQDADANAwAA5QMAIAQAAL8DACAXAAC-AwAg0QEBAAAAAdIBAQAAAAHWAUAAAAAB5AEBAAAAAe0BAQAAAAGOAgAAAI4CApACAAAAkAICkQIBAAAAAZICAQAAAAGTAoAAAAABAgAAAAEAICQAAP8DACADAAAAAQAgJAAA_wMAICUAAP4DACABHQAA1wUAMAIAAAABACAdAAD-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-BQAgJQAAwQUAIJ0CAAC_BQAgngIAAMAFACCjAgAACQAgAyQAAL4FACCdAgAAvwUAIKMCAAAJACAAAAAAAAAFJAAAuQUAICUAALwFACCdAgAAugUAIJ4CAAC7BQAgowIAAGoAIAMkAAC5BQAgnQIAALoFACCjAgAAagAgAAAABSQAALQFACAlAAC3BQAgnQIAALUFACCeAgAAtgUAIKMCAABqACADJAAAtAUAIJ0CAAC1BQAgowIAAGoAIAAAAAGgAgAAAIkCAgGgAgAAAIoCAgskAACDBQAwJQAAiAUAMJ0CAACEBQAwngIAAIUFADCfAgAAhgUAIKACAACHBQAwoQIAAIcFADCiAgAAhwUAMKMCAACHBQAwpAIAAIkFADClAgAAigUAMAskAAD3BAAwJQAA_AQAMJ0CAAD4BAAwngIAAPkEADCfAgAA-gQAIKACAAD7BAAwoQIAAPsEADCiAgAA-wQAMKMCAAD7BAAwpAIAAP0EADClAgAA_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_AEBAAAAAf0BAQAAAAH-AQEAAAAB_wFAAAAAAYACQAAAAAGBAgEAAAABggIBAAAAAQIAAAARACAkAACCBQAgAwAAABEAICQAAIIFACAlAACBBQAgAR0AAK4FADARBQAA-gIAIM4BAACQAwAwzwEAAA8AENABAACQAwAw0QEBAAAAAdMBAQDRAgAh1gFAANMCACHXAUAA0wIAIfoBAQDRAgAh-wEBANECACH8AQEA0gIAIf0BAQDSAgAh_gEBANICACH_AUAA1QIAIYACQADVAgAhgQIBANICACGCAgEA0gIAIQIAAAARACAdAACBBQAgAgAAAP8EACAdAACABQAgEM4BAAD-BAAwzwEAAP8EABDQAQAA_gQAMNEBAQDRAgAh0wEBANECACHWAUAA0wIAIdcBQADTAgAh-gEBANECACH7AQEA0QIAIfwBAQDSAgAh_QEBANICACH-AQEA0gIAIf8BQADVAgAhgAJAANUCACGBAgEA0gIAIYICAQDSAgAhEM4BAAD-BAAwzwEAAP8EABDQAQAA_gQAMNEBAQDRAgAh0wEBANECACHWAUAA0wIAIdcBQADTAgAh-gEBANECACH7AQEA0QIAIfwBAQDSAgAh_QEBANICACH-AQEA0gIAIf8BQADVAgAhgAJAANUCACGBAgEA0gIAIYICAQDSAgAhDNEBAQCcAwAh1gFAAJ4DACHXAUAAngMAIfoBAQCcAwAh-wEBAJwDACH8AQEApwMAIf0BAQCnAwAh_gEBAKcDACH_AUAAqQMAIYACQACpAwAhgQIBAKcDACGCAgEApwMAIQzRAQEAnAMAIdYBQACeAwAh1wFAAJ4DACH6AQEAnAMAIfsBAQCcAwAh_AEBAKcDACH9AQEApwMAIf4BAQCnAwAh_wFAAKkDACGAAkAAqQMAIYECAQCnAwAhggIBAKcDACEM0QEBAAAAAdYBQAAAAAHXAUAAAAAB-gEBAAAAAfsBAQAAAAH8AQEAAAAB_QEBAAAAAf4BAQAAAAH_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-gEBAAAAAfsBAQAAAAH8AQEAAAAB_QEBAAAAAf4BAQAAAAH_AUAAAAABgAJAAAAAAYECAQAAAAGCAgEAAAABBdEBAQAAAAHSAQEAAAAB1QEAAADVAQLWAUAAAAAB1wFAAAAAAQfRAQEAAAAB1gFAAAAAAdcBQAAAAAHlASAAAAAB5gFAAAAAAfQBAQAAAAH1AQEAAAABDNEBAQAAAAHWAUAAAAAB1wFAAAAAAeQBAQAAAAHlASAAAAAB5gFAAAAAAeoBAQAAAAHsAQAAAOwBAu0BAQAAAAHvAQAAAO8BAvABQAAAAAHxAQEAAAABDNEBAQAAAAHWAUAAAAAB1wFAAAAAAeQBAQAAAAHlASAAAAAB5gFAAAAAAeoBAQAAAAHsAQAAAOwBAu0BAQAAAAHvAQAAAO8BAvABQAAAAAHyAQEAAAABCtEBAQAAAAHSAQEAAAAB1gFAAAAAAeQBAQAAAAHtAQEAAAAB9QEBAAAAAY4CAAAAjgICkAIAAACQAgKRAgEAAAABkwKAAAAAARIHAACQBQAgCAAAkQUAIAsAAJIFACAMAACTBQAgDQAAlAUAIA4AAJUFACAPAACWBQAg0QEBAAAAAdUBAAAAiQIC1gFAAAAAAdcBQAAAAAHjAQEAAAAB5QEgAAAAAeYBQAAAAAHsAQAAAIoCAoYCAQAAAAGHAiAAAAABigIBAAAAAQIAAABqACAkAAC0BQAgAwAAACkAICQAALQFACAlAAC4BQAgFAAAACkAIAcAAL4EACAIAAC_BAAgCwAAwAQAIAwAAMEEACANAADCBAAgDgAAwwQAIA8AAMQEACAdAAC4BQAg0QEBAJwDACHVAQAAuwSJAiLWAUAAngMAIdcBQACeAwAh4wEBAJwDACHlASAAqAMAIeYBQACpAwAh7AEAALwEigIihgIBAJwDACGHAiAAqAMAIYoCAQCnAwAhEgcAAL4EACAIAAC_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_QBIhIGAACPBQAgBwAAkAUAIAgAAJEFACALAACSBQAgDAAAkwUAIA4AAJUFACAPAACWBQAg0QEBAAAAAdUBAAAAiQIC1gFAAAAAAdcBQAAAAAHjAQEAAAAB5QEgAAAAAeYBQAAAAAHsAQAAAIoCAoYCAQAAAAGHAiAAAAABigIBAAAAAQIAAABqACAkAADNBQAgEgYAAI8FACAHAACQBQAgCAAAkQUAIAsAAJIFACANAACUBQAgDgAAlQUAIA8AAJYFACDRAQEAAAAB1QEAAACJAgLWAUAAAAAB1wFAAAAAAeMBAQAAAAHlASAAAAAB5gFAAAAAAewBAAAAigIChgIBAAAAAYcCIAAAAAGKAgEAAAABAgAAAGoAICQAAM8FACASBgAAjwUAIAcAAJAFACAIAACRBQAgDAAAkwUAIA0AAJQFACAOAACVBQAgDwAAlgUAINEBAQAAAAHVAQAAAIkCAtYBQAAAAAHXAUAAAAAB4wEBAAAAAeUBIAAAAAHmAUAAAAAB7AEAAACKAgKGAgEAAAABhwIgAAAAAYoCAQAAAAECAAAAagAgJAAA0QUAIAMAAAApACAkAADRBQAgJQAA1QUAIBQAAAApACAGAAC9BAAgBwAAvgQAIAgAAL8EACAMAADBBAAgDQAAwgQAIA4AAMMEACAPAADEBAAgHQAA1QUAINEBAQCcAwAh1QEAALsEiQIi1gFAAJ4DACHXAUAAngMAIeMBAQCcAwAh5QEgAKgDACHmAUAAqQMAIewBAAC8BIoCIoYCAQCcAwAhhwIgAKgDACGKAgEApwMAIRIGAAC9BAAgBwAAvgQAIAgAAL8EACAMAADBBAAgDQAAwgQAIA4AAMMEACAPAADEBAAg0QEBAJwDACHVAQAAuwSJAiLWAUAAngMAIdcBQACeAwAh4wEBAJwDACHlASAAqAMAIeYBQACpAwAh7AEAALwEigIihgIBAJwDACGHAiAAqAMAIYoCAQCnAwAhB9EBAQAAAAHWAUAAAAAB1wFAAAAAAeUBIAAAAAHmAUAAAAAB9AEBAAAAAfYBAQAAAAEK0QEBAAAAAdIBAQAAAAHWAUAAAAAB5AEBAAAAAe0BAQAAAAGOAgAAAI4CApACAAAAkAICkQIBAAAAAZICAQAAAAGTAoAAAAABAwAAACkAICQAAM0FACAlAADaBQAgFAAAACkAIAYAAL0EACAHAAC-BAAgCAAAvwQAIAsAAMAEACAMAADBBAAgDgAAwwQAIA8AAMQEACAdAADaBQAg0QEBAJwDACHVAQAAuwSJAiLWAUAAngMAIdcBQACeAwAh4wEBAJwDACHlASAAqAMAIeYBQACpAwAh7AEAALwEigIihgIBAJwDACGHAiAAqAMAIYoCAQCnAwAhEgYAAL0EACAHAAC-BAAgCAAAvwQAIAsAAMAEACAMAADBBAAgDgAAwwQAIA8AAMQEACDRAQEAnAMAIdUBAAC7BIkCItYBQACeAwAh1wFAAJ4DACHjAQEAnAMAIeUBIACoAwAh5gFAAKkDACHsAQAAvASKAiKGAgEAnAMAIYcCIACoAwAhigIBAKcDACEDAAAAKQAgJAAAzwUAICUAAN0FACAUAAAAKQAgBgAAvQQAIAcAAL4EACAIAAC_BAAgCwAAwAQAIA0AAMIEACAOAADDBAAgDwAAxAQAIB0AAN0FACDRAQEAnAMAIdUBAAC7BIkCItYBQACeAwAh1wFAAJ4DACHjAQEAnAMAIeUBIACoAwAh5gFAAKkDACHsAQAAvASKAiKGAgEAnAMAIYcCIACoAwAhigIBAKcDACESBgAAvQQAIAcAAL4EACAIAAC_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_QBIgMAAAApACAkAADrBQAgJQAA9QUAIBQAAAApACAGAAC9BAAgBwAAvgQAIAgAAL8EACALAADABAAgDAAAwQQAIA0AAMIEACAPAADEBAAgHQAA9QUAINEBAQCcAwAh1QEAALsEiQIi1gFAAJ4DACHXAUAAngMAIeMBAQCcAwAh5QEgAKgDACHmAUAAqQMAIewBAAC8BIoCIoYCAQCcAwAhhwIgAKgDACGKAgEApwMAIRIGAAC9BAAgBwAAvgQAIAgAAL8EACALAADABAAgDAAAwQQAIA0AAMIEACAPAADEBAAg0QEBAJwDACHVAQAAuwSJAiLWAUAAngMAIdcBQACeAwAh4wEBAJwDACHlASAAqAMAIeYBQACpAwAh7AEAALwEigIihgIBAJwDACGHAiAAqAMAIYoCAQCnAwAhCtEBAQAAAAHWAUAAAAAB5AEBAAAAAe0BAQAAAAH1AQEAAAABjgIAAACOAgKQAgAAAJACApECAQAAAAGSAgEAAAABkwKAAAAAARIGAACPBQAgBwAAkAUAIAsAAJIFACAMAACTBQAgDQAAlAUAIA4AAJUFACAPAACWBQAg0QEBAAAAAdUBAAAAiQIC1gFAAAAAAdcBQAAAAAHjAQEAAAAB5QEgAAAAAeYBQAAAAAHsAQAAAIoCAoYCAQAAAAGHAiAAAAABigIBAAAAAQIAAABqACAkAAD3BQAgCRMAAJgEACAVAACWBAAg0QEBAAAAAdYBQAAAAAHXAUAAAAAB4wEBAAAAAeQBAQAAAAHlASAAAAAB5gFAAAAAAQIAAACLAgAgJAAA-QUAIAMAAAApACAkAAD3BQAgJQAA_QUAIBQAAAApACAGAAC9BAAgBwAAvgQAIAsAAMAEACAMAADBBAAgDQAAwgQAIA4AAMMEACAPAADEBAAgHQAA_QUAINEBAQCcAwAh1QEAALsEiQIi1gFAAJ4DACHXAUAAngMAIeMBAQCcAwAh5QEgAKgDACHmAUAAqQMAIewBAAC8BIoCIoYCAQCcAwAhhwIgAKgDACGKAgEApwMAIRIGAAC9BAAgBwAAvgQAIAsAAMAEACAMAADBBAAgDQAAwgQAIA4AAMMEACAPAADEBAAg0QEBAJwDACHVAQAAuwSJAiLWAUAAngMAIdcBQACeAwAh4wEBAJwDACHlASAAqAMAIeYBQACpAwAh7AEAALwEigIihgIBAJwDACGHAiAAqAMAIYoCAQCnAwAhAwAAAI4CACAkAAD5BQAgJQAAgAYAIAsAAACOAgAgEwAArAMAIBUAAKoDACAdAACABgAg0QEBAJwDACHWAUAAngMAIdcBQACeAwAh4wEBAJwDACHkAQEApwMAIeUBIACoAwAh5gFAAKkDACEJEwAArAMAIBUAAKoDACDRAQEAnAMAIdYBQACeAwAh1wFAAJ4DACHjAQEAnAMAIeQBAQCnAwAh5QEgAKgDACHmAUAAqQMAIQQDAAIENwMJOAQXAAUEEAAOEzMBFQYDFjIIBAMAAhAADRMvARQKBAYEAAMLKwkQAAwRAAUSKgUTLAEJBg4GBxIHCBYICxoJDBsEDRwEDh8BDyEKEAALAQUABQEFAAUCAwACBQAFAgkABAoABQEFAAUHBiIAByMACCQACyUADCYADScADigAAgstABMuAAITMQAUMAADEzYAFTQAFjUAAAQDAAIEQgMJQwQXAAUEAwACBEkDCUoEFwAFAxAAEyoAFCsAFQAAAAMQABMqABQrABUBBQAFAQUABQMQABoqABsrABwAAAADEAAaKgAbKwAcAAADEAAhKgAiKwAjAAAAAxAAISoAIisAIwEFAAUBBQAFAxAAKCoAKSsAKgAAAAMQACgqACkrACoBBQAFAQUABQMQAC8qADArADEAAAADEAAvKgAwKwAxAAAAAxAANyoAOCsAOQAAAAMQADcqADgrADkCCQAECgAFAgkABAoABQMQAD4qAD8rAEAAAAADEAA-KgA_KwBAAQMAAgEDAAIDEABFKgBGKwBHAAAAAxAARSoARisARwMEAAMRAAUS_QEFAwQAAxEABRKDAgUDEABMKgBNKwBOAAAAAxAATCoATSsATgAAAxAAUyoAVCsAVQAAAAMQAFMqAFQrAFUCAwACBQAFAgMAAgUABQMQAFoqAFsrAFwAAAADEABaKgBbKwBcGAIBGTkBGjoBGzsBHDwBHj4BH0APIEEQIUUBIkcPI0gRJksBJ0wBKE0PLFASLVEWLlMKL1QKMFYKMVcKMlgKM1oKNFwPNV0XNl8KN2EPOGIYOWMKOmQKO2UPPGgZPWkdPmsFP2wFQG4FQW8FQnAFQ3IFRHQPRXUeRncFR3kPSHofSXsFSnwFS30PTIABIE2BASROggEGT4MBBlCEAQZRhQEGUoYBBlOIAQZUigEPVYsBJVaNAQZXjwEPWJABJlmRAQZakgEGW5MBD1yWASddlwErXpgBB1-ZAQdgmgEHYZsBB2KcAQdjngEHZKABD2WhASxmowEHZ6UBD2imAS1ppwEHaqgBB2upAQ9srAEuba0BMm6vATNvsAEzcLMBM3G0ATNytQEzc7cBM3S5AQ91ugE0drwBM3e-AQ94vwE1ecABM3rBATN7wgEPfMUBNn3GATp-xwEJf8gBCYAByQEJgQHKAQmCAcsBCYMBzQEJhAHPAQ-FAdABO4YB0gEJhwHUAQ-IAdUBPIkB1gEJigHXAQmLAdgBD4wB2wE9jQHcAUGOAd0BA48B3gEDkAHfAQORAeABA5IB4QEDkwHjAQOUAeUBD5UB5gFClgHoAQOXAeoBD5gB6wFDmQHsAQOaAe0BA5sB7gEPnAHxAUSdAfIBSJ4B8wEEnwH0AQSgAfUBBKEB9gEEogH3AQSjAfkBBKQB-wEPpQH8AUmmAf8BBKcBgQIPqAGCAkqpAYQCBKoBhQIEqwGGAg-sAYkCS60BigJPrgGMAgKvAY0CArABkAICsQGRAgKyAZICArMBlAICtAGWAg-1AZcCULYBmQICtwGbAg-4AZwCUbkBnQICugGeAgK7AZ8CD7wBogJSvQGjAla-AaQCCL8BpQIIwAGmAgjBAacCCMIBqAIIwwGqAgjEAawCD8UBrQJXxgGvAgjHAbECD8gBsgJYyQGzAgjKAbQCCMsBtQIPzAG4AlnNAbkCXQ"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/enums.ts
var Role = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  USER: "USER"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
  DELETED: "DELETED"
};
var WorkspaceRole = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  MEMBER: "MEMBER"
};
var TaskStatus = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  IN_REVIEW: "IN_REVIEW",
  DONE: "DONE"
};
var TaskPriority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH"
};
var ActivityAction = {
  CREATED: "CREATED",
  UPDATED: "UPDATED",
  DELETED: "DELETED",
  ASSIGNED: "ASSIGNED",
  UNASSIGNED: "UNASSIGNED",
  STATUS_CHANGED: "STATUS_CHANGED",
  PRIORITY_CHANGED: "PRIORITY_CHANGED",
  DEADLINE_CHANGED: "DEADLINE_CHANGED",
  MEMBER_ADDED: "MEMBER_ADDED",
  MEMBER_REMOVED: "MEMBER_REMOVED",
  COMMENT_ADDED: "COMMENT_ADDED",
  COMMENT_UPDATED: "COMMENT_UPDATED",
  COMMENT_DELETED: "COMMENT_DELETED"
};
var ActivityEntity = {
  WORKSPACE: "WORKSPACE",
  PROJECT: "PROJECT",
  TASK: "TASK",
  COMMENT: "COMMENT",
  MEMBER: "MEMBER"
};

// src/generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/app/config/env.ts
import dotenv from "dotenv";
dotenv.config();
var loadEnvVars = () => {
  const requiredEnvVars = [
    "NODE_ENV",
    "PORT",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRES_IN",
    "REFRESH_TOKEN_EXPIRES_IN",
    "BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN",
    "BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE",
    "EMAIL_SENDER_SMTP_USER",
    "EMAIL_SENDER_SMTP_PASS",
    "EMAIL_SENDER_SMTP_HOST",
    "EMAIL_SENDER_SMTP_PORT",
    "EMAIL_SENDER_SMTP_FROM",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CALLBACK_URL",
    "FRONTEND_URL"
  ];
  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      throw new Error(`Missing required environment variable: ${varName}`);
    }
  });
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: parseInt(process.env.PORT, 10),
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
    BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: process.env.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN,
    BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE: process.env.BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE,
    email: {
      EMAIL_SENDER_SMTP_USER: process.env.EMAIL_SENDER_SMTP_USER,
      EMAIL_SENDER_SMTP_PASS: process.env.EMAIL_SENDER_SMTP_PASS,
      EMAIL_SENDER_SMTP_HOST: process.env.EMAIL_SENDER_SMTP_HOST,
      EMAIL_SENDER_SMTP_PORT: process.env.EMAIL_SENDER_SMTP_PORT,
      EMAIL_SENDER_SMTP_FROM: process.env.EMAIL_SENDER_SMTP_FROM
    },
    google: {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
      GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
      FRONTEND_URL: process.env.FRONTEND_URL
    }
  };
};
var envVars = loadEnvVars();

// src/lib/prisma.ts
var connectionString = `${envVars.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
import { bearer, emailOTP } from "better-auth/plugins";

// src/app/utils/email.ts
import nodemailer from "nodemailer";
import status from "http-status";
import path2 from "path";
import ejs from "ejs";

// src/app/errorHelpers/appError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var appError_default = AppError;

// src/app/utils/email.ts
var transporter = nodemailer.createTransport({
  host: envVars.email.EMAIL_SENDER_SMTP_HOST,
  secure: true,
  auth: {
    user: envVars.email.EMAIL_SENDER_SMTP_USER,
    pass: envVars.email.EMAIL_SENDER_SMTP_PASS
  },
  port: Number(envVars.email.EMAIL_SENDER_SMTP_PORT)
});
var sendEmail = async ({
  subject,
  templateData,
  templateName,
  to,
  attachments
}) => {
  try {
    const templatePath = path2.resolve(
      process.cwd(),
      `src/app/templates/${templateName}.ejs`
    );
    const html = await ejs.renderFile(templatePath, templateData);
    const info = await transporter.sendMail({
      from: envVars.email.EMAIL_SENDER_SMTP_FROM,
      to,
      subject,
      html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType
      }))
    });
    console.log(`Email sent to ${to} : ${info.messageId}`);
  } catch (error) {
    console.log("Email Sending Error", error.message);
    throw new appError_default(status.INTERNAL_SERVER_ERROR, "Failed to send email");
  }
};

// src/lib/auth.ts
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
    // or "mysql", "postgresql", ...etc
  }),
  baseUrl: envVars.BETTER_AUTH_URL,
  secret: envVars.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: Role.USER
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE,
        input: false
      },
      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false,
        input: false
      },
      deletedAt: {
        type: "date",
        required: false,
        defaultValue: null,
        input: false
      }
    }
  },
  plugins: [
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "forget-password") {
          const user = await prisma.user.findUnique({
            where: {
              email
            }
          });
          if (user) {
            sendEmail({
              to: email,
              subject: "Password reset otp",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp
              }
            });
          }
        }
      },
      expiresIn: 2 * 60,
      otpLength: 6
    })
  ]
});

// src/app/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, { expiresIn }) => {
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
};
var verifyToken = (token, secret) => {
  const decoded = jwt.verify(token, secret);
  return {
    success: true,
    data: decoded
  };
};
var decodeToken = (token) => {
  const decoded = jwt.decode(token);
  return decoded;
};
var jwtUtils = {
  createToken,
  verifyToken,
  decodeToken
};

// src/app/utils/cookie.ts
var setCookie = (res, key, value, options) => {
  res.cookie(key, value, options);
};
var getCookie = (req, key) => {
  return req.cookies[key];
};
var clearCookie = (res, key, options) => {
  res.clearCookie(key, options);
};
var cookieUtils = {
  setCookie,
  getCookie,
  clearCookie
};

// src/app/utils/token.ts
var getAccessToken = (payload) => {
  const accessToken = jwtUtils.createToken(
    payload,
    envVars.ACCESS_TOKEN_SECRET,
    { expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN }
  );
  return accessToken;
};
var getRefreshToken = (payload) => {
  const refreshToken = jwtUtils.createToken(
    payload,
    envVars.REFRESH_TOKEN_SECRET,
    { expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN }
  );
  return refreshToken;
};
var setAccessTokenCookie = (res, token) => {
  cookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 24 * 60 * 60 * 1e3
  });
};
var setRefreshTokenCookie = (res, token) => {
  cookieUtils.setCookie(res, "refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1e3
  });
};
var setBetterAuthSessionCookie = (res, token) => {
  cookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 24 * 60 * 60 * 1e3
  });
};
var tokenUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBetterAuthSessionCookie
};

// src/app/modules/auth/auth.service.ts
var registerUser = async (payload) => {
  const { name, email, password } = payload;
  const isUserExists = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (isUserExists) {
    throw new appError_default(status2.CONFLICT, "User already exists");
  }
  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password
    }
  });
  if (!data) {
    throw new appError_default(
      status2.INTERNAL_SERVER_ERROR,
      "Failed to register user."
    );
  }
  const accessToken = tokenUtils.getAccessToken({
    id: data.user.id,
    name: data.user.name,
    email: data.user.email,
    role: data.user.role,
    status: data.user.status,
    isDeleted: data.user.isDeleted
  });
  const refreshToken = tokenUtils.getRefreshToken({
    id: data.user.id,
    email: data.user.email,
    role: data.user.role,
    status: data.user.status,
    isDeleted: data.user.isDeleted
  });
  return { accessToken, refreshToken, ...data };
};
var loginUser = async (payload) => {
  const { email, password } = payload;
  const isUserExists = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExists) {
    throw new appError_default(status2.NOT_FOUND, "No user exists with the email.");
  }
  const data = await auth.api.signInEmail({
    body: {
      email,
      password
    }
  });
  if (!data) {
    throw new appError_default(status2.INTERNAL_SERVER_ERROR, "Failed to login.");
  }
  const accessToken = tokenUtils.getAccessToken({
    id: data.user.id,
    name: data.user.name,
    email: data.user.email,
    role: data.user.role,
    status: data.user.status,
    isDeleted: data.user.isDeleted
  });
  const refreshToken = tokenUtils.getRefreshToken({
    id: data.user.id,
    email: data.user.email,
    role: data.user.role,
    status: data.user.status,
    isDeleted: data.user.isDeleted
  });
  return { accessToken, refreshToken, ...data };
};
var getNewToken = async (refreshToken, sessionToken) => {
  const isSessionTokenExists = await prisma.session.findUnique({
    where: {
      token: sessionToken
    },
    include: {
      user: true
    }
  });
  if (!isSessionTokenExists) {
    throw new appError_default(status2.UNAUTHORIZED, "Invalid session token");
  }
  const verifiedRefreshToken = jwtUtils.verifyToken(
    refreshToken,
    envVars.REFRESH_TOKEN_SECRET
  );
  if (!verifiedRefreshToken.success) {
    throw new appError_default(status2.UNAUTHORIZED, "Invalid refresh token");
  }
  const { data } = verifiedRefreshToken;
  const newAccessToken = tokenUtils.getAccessToken({
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role,
    status: data.status,
    isDeleted: data.isDeleted
  });
  const newRefreshToken = tokenUtils.getRefreshToken({
    id: data.id,
    email: data.email,
    role: data.role,
    status: data.status,
    isDeleted: data.isDeleted
  });
  const { token } = await prisma.session.update({
    where: {
      token: sessionToken
    },
    data: {
      token: sessionToken,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1e3),
      updatedAt: /* @__PURE__ */ new Date()
    }
  });
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    sessionToken: token
  };
};
var logoutUser = async (sessionToken) => {
  const result = await auth.api.signOut({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  return result;
};
var changePassword = async (payload, sessionToken) => {
  const session = await auth.api.getSession({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  if (!session) {
    throw new appError_default(status2.UNAUTHORIZED, "Invalid session token");
  }
  const { oldPassword, newPassword } = payload;
  const result = await auth.api.changePassword({
    body: {
      currentPassword: oldPassword,
      newPassword,
      revokeOtherSessions: true
    },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  const accessToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified
  });
  return {
    ...result,
    accessToken,
    refreshToken
  };
};
var forgetPassword = async (email) => {
  await auth.api.requestPasswordResetEmailOTP({
    body: {
      email
    }
  });
};
var resetPassword = async (email, otp, newPassword) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExist) {
    throw new appError_default(status2.NOT_FOUND, "User not found");
  }
  if (isUserExist.isDeleted || isUserExist.status === UserStatus.DELETED) {
    throw new appError_default(status2.NOT_FOUND, "User not found");
  }
  await auth.api.resetPasswordEmailOTP({
    body: {
      email,
      otp,
      password: newPassword
    }
  });
  await prisma.session.deleteMany({
    where: {
      userId: isUserExist.id
    }
  });
};
var getMyProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      admin: {
        select: {
          id: true,
          contactNumber: true,
          profilePhoto: true
        }
      }
    }
  });
  if (!user) {
    throw new appError_default(status2.NOT_FOUND, "User not found.");
  }
  return user;
};
var udpateMyProfile = async (user, payload) => {
  const userExists = await prisma.user.findUnique({
    where: {
      id: user.userId
    },
    include: {
      admin: true
    }
  });
  if (!userExists) {
    throw new appError_default(status2.NOT_FOUND, "User not found.");
  }
  console.log(userExists);
  if (userExists.isDeleted) {
    throw new appError_default(status2.NOT_FOUND, "User not found.");
  }
  const result = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: {
        id: user.userId
      },
      data: {
        ...payload.name !== void 0 && {
          name: payload.name
        },
        ...payload.image !== void 0 && {
          image: payload.image
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });
    if (payload.contactNumber !== void 0 && userExists.admin) {
      await tx.admin.update({
        where: {
          id: userExists.admin.id
        },
        data: {
          contactNumber: payload.contactNumber
        }
      });
    }
    return updatedUser;
  });
  return result;
};
var authService = {
  registerUser,
  loginUser,
  getNewToken,
  logoutUser,
  changePassword,
  forgetPassword,
  resetPassword,
  getMyProfile,
  udpateMyProfile
};

// src/app/shared/sendResponse.ts
var sendResponse = (res, responseData) => {
  const { httpStatusCode, success, message, data } = responseData;
  res.status(httpStatusCode).json({
    success,
    message,
    data
  });
};

// src/app/modules/auth/auth.controller.ts
import status3 from "http-status";
var registerUser2 = catchAsync_default(async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  const result = await authService.registerUser({ name, email, password });
  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status3.CREATED,
    success: true,
    message: "Registration successfull",
    data: {
      accessToken,
      refreshToken,
      token,
      ...rest
    }
  });
});
var loginUser2 = catchAsync_default(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser({ email, password });
  const { accessToken, refreshToken, token, ...rest } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: status3.OK,
    success: true,
    message: "Login successfull",
    data: {
      accessToken,
      refreshToken,
      token,
      ...rest
    }
  });
});
var getNewToken2 = catchAsync_default(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];
  if (!refreshToken) {
    throw new appError_default(status3.UNAUTHORIZED, "Refresh token is missing");
  }
  const result = await authService.getNewToken(
    refreshToken,
    betterAuthSessionToken
  );
  const { accessToken, refreshToken: newRefreshToken, sessionToken } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, sessionToken);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "New tokens generated successfully",
    data: {
      accessToken,
      refreshToken: newRefreshToken,
      sessionToken
    }
  });
});
var logoutUser2 = catchAsync_default(async (req, res) => {
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];
  const result = await authService.logoutUser(betterAuthSessionToken);
  cookieUtils.clearCookie(res, "accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  cookieUtils.clearCookie(res, "refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  cookieUtils.clearCookie(res, "better-auth.session_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Logout successfully",
    data: result
  });
});
var changePassword2 = catchAsync_default(async (req, res) => {
  const payload = req.body;
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];
  const result = await authService.changePassword(
    payload,
    betterAuthSessionToken
  );
  const { accessToken, refreshToken, token } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Password changed successfully",
    data: result
  });
});
var forgetPassword2 = catchAsync_default(async (req, res) => {
  const { email } = req.body;
  await authService.forgetPassword(email);
  sendResponse(res, {
    httpStatusCode: status3.OK,
    success: true,
    message: "If an account exists for this email, a password reset link has been sent."
  });
});
var resetPassword2 = catchAsync_default(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  await authService.resetPassword(email, otp, newPassword);
  sendResponse(res, {
    httpStatusCode: status3.OK,
    success: true,
    message: "Password reset successfully"
  });
});
var getMyProfile2 = catchAsync_default(async (req, res) => {
  const result = await authService.getMyProfile(req.user.userId);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Profile retrived successfully",
    data: result
  });
});
var updateMyProfile = catchAsync_default(async (req, res) => {
  const result = await authService.udpateMyProfile(req.user, req.body);
  sendResponse(res, {
    httpStatusCode: status3.OK,
    success: true,
    message: "Profile updated successfully.",
    data: result
  });
});
var authController = {
  registerUser: registerUser2,
  loginUser: loginUser2,
  getNewToken: getNewToken2,
  logoutUser: logoutUser2,
  changePassword: changePassword2,
  forgetPassword: forgetPassword2,
  resetPassword: resetPassword2,
  getMyProfile: getMyProfile2,
  updateMyProfile
};

// src/app/middleware/validateRequest.ts
var validateRequest = (zodSchema) => {
  return (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    const parsedResult = zodSchema.safeParse(req.body);
    if (!parsedResult.success) {
      next(parsedResult.error);
    }
    req.body = parsedResult.data;
    next();
  };
};

// src/app/modules/auth/auth.validation.ts
import z from "zod";
var userRegisterZodSchema = z.object({
  name: z.string("Name is required"),
  email: z.email({
    message: "Please provide a valid email address"
  }),
  password: z.string("Password is required").min(6, {
    message: "Password must be at least 6 characters long"
  })
});
var userLoginZodSchema = z.object({
  email: z.email({
    message: "Please provide a valid email address"
  }),
  password: z.string("Password is required").min(6, {
    message: "Password must be at least 6 characters long"
  })
});
var forgotPasswordSchema = z.object({
  email: z.email({
    message: "Please provide a valid email address"
  })
});
var updateMyProfileZodSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long.").max(100, "Name cannot exceed 100 characters.").optional(),
  image: z.string().url("Image must be a valid URL.").optional(),
  contactNumber: z.string().min(6, "Contact number is too short.").max(20, "Contact number is too long.").optional()
});
var changePasswordZodSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required."),
  newPassword: z.string().min(8, "New password must be at least 8 characters long.").max(100, "New password cannot exceed 100 characters."),
  confirmPassword: z.string().min(1, "Please confirm your new password.")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"]
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "New password must be different from current password.",
  path: ["newPassword"]
});

// src/app/middleware/checkAuth.ts
import status4 from "http-status";
var checkAuth = (...authRoles) => async (req, res, next) => {
  try {
    const sessionToken = cookieUtils.getCookie(
      req,
      "better-auth.session_token"
    );
    if (!sessionToken) {
      throw new appError_default(status4.UNAUTHORIZED, "No valid session found!");
    }
    if (sessionToken) {
      const sessionExists = await prisma.session.findFirst({
        where: {
          token: sessionToken,
          expiresAt: {
            gt: /* @__PURE__ */ new Date()
          }
        },
        include: {
          user: true
        }
      });
      if (!sessionExists || !sessionExists.user) {
        throw new appError_default(status4.UNAUTHORIZED, "Invalid or expired session");
      }
      if (sessionExists && sessionExists.user) {
        const user = sessionExists.user;
        const now = /* @__PURE__ */ new Date();
        const expiresAt = new Date(sessionExists.expiresAt);
        const createdAt = new Date(sessionExists.createdAt);
        const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
        const timeRemaining = expiresAt.getTime() - now.getTime();
        const percentageRemaining = timeRemaining / sessionLifeTime * 100;
        if (percentageRemaining < 20) {
          res.setHeader("X-Session-Refresh", "true");
          res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
          res.setHeader("X-Time-Remaining", timeRemaining.toString());
          console.log("Session Expiring soon.");
        }
        if (authRoles.length > 0 && !authRoles.includes(user.role)) {
          throw new appError_default(
            status4.FORBIDDEN,
            "Forbidden access! You do not have permission to access this resoure."
          );
        }
      }
    }
    const token = cookieUtils.getCookie(req, "accessToken");
    const verifyToken2 = jwtUtils.verifyToken(
      token,
      envVars.ACCESS_TOKEN_SECRET
    );
    if (!verifyToken2.success) {
      throw new appError_default(status4.UNAUTHORIZED, "Unauthorized access!");
    }
    if (verifyToken2.data.status !== UserStatus.ACTIVE) {
      throw new appError_default(status4.UNAUTHORIZED, "Unauthorized access!");
    }
    if (verifyToken2.data.isDeleted) {
      throw new appError_default(status4.UNAUTHORIZED, "Unauthorized access!");
    }
    if (authRoles.length > 0 && !authRoles.includes(verifyToken2.data.role)) {
      throw new appError_default(
        status4.FORBIDDEN,
        "Forbidden access! You do not have permission to access this resoure."
      );
    }
    req.user = {
      userId: verifyToken2.data.id,
      role: verifyToken2.data.role,
      email: verifyToken2.data.email
    };
    next();
  } catch (error) {
    next(error);
  }
};

// src/app/modules/auth/auth.route.ts
var router = Router();
router.post(
  "/register",
  validateRequest(userRegisterZodSchema),
  authController.registerUser
);
router.post(
  "/login",
  validateRequest(userLoginZodSchema),
  authController.loginUser
);
router.get(
  "/my-profile",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  authController.getMyProfile
);
router.patch(
  "/update-my-profile",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  authController.updateMyProfile
);
router.post("/refresh-token", authController.getNewToken);
router.post("/logout", authController.logoutUser);
router.post(
  "/change-password",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  authController.changePassword
);
router.post(
  "/forget-password",
  validateRequest(forgotPasswordSchema),
  authController.forgetPassword
);
router.post("/reset-password", authController.resetPassword);
var authRoutes = router;

// src/app/modules/workspace/workspace.route.ts
import { Router as Router2 } from "express";

// src/app/modules/workspace/workspace.controller.ts
import status6 from "http-status";

// src/app/modules/workspace/workspace.service.ts
import status5 from "http-status";
var createWorkspace = async (payload, userId) => {
  const { name, description } = payload;
  const existingWorkspace = await prisma.workspace.findFirst({
    where: {
      name,
      isDeleted: false,
      members: {
        some: {
          userId
        }
      }
    }
  });
  if (existingWorkspace) {
    throw new appError_default(
      status5.CONFLICT,
      "You already have a workspace with this name."
    );
  }
  const result = await prisma.$transaction(async (tx) => {
    const workspace = await tx.workspace.create({
      data: {
        name,
        description
      }
    });
    await tx.workspaceMember.create({
      data: {
        workspaceId: workspace.id,
        userId,
        role: WorkspaceRole.OWNER
      }
    });
    await tx.activity.create({
      data: {
        action: ActivityAction.CREATED,
        entityType: ActivityEntity.WORKSPACE,
        entityId: workspace.id,
        workspaceId: workspace.id,
        performedBy: userId,
        description: `Workspace "${workspace.name}" was created.`
      }
    });
    return workspace;
  });
  return result;
};
var getMyWorkspaces = async (userId) => {
  const result = await prisma.workspaceMember.findMany({
    where: {
      userId,
      workspace: {
        isDeleted: false
      }
    },
    include: {
      workspace: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return result;
};
var getWorkspaceById = async (workspaceId, userId) => {
  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId
      }
    },
    include: {
      workspace: true
    }
  });
  if (!membership || membership.workspace.isDeleted) {
    throw new appError_default(status5.NOT_FOUND, "Workspace not found");
  }
  return {
    ...membership.workspace
  };
};
var updateWorkspace = async (workspaceId, userId, payload) => {
  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId
      }
    }
  });
  if (!membership) {
    throw new appError_default(status5.NOT_FOUND, "Workspace not found");
  }
  if (membership.role !== WorkspaceRole.OWNER && membership.role !== WorkspaceRole.ADMIN) {
    throw new appError_default(
      status5.FORBIDDEN,
      "You do not have permission to update this workspace."
    );
  }
  const workspace = await prisma.workspace.findFirst({
    where: {
      id: workspaceId,
      isDeleted: false
    }
  });
  if (!workspace) {
    throw new appError_default(status5.NOT_FOUND, "Workspace not found.");
  }
  if (payload.name && payload.name !== workspace.name) {
    const duplicateWorkspace = await prisma.workspace.findFirst({
      where: {
        name: payload.name,
        isDeleted: false,
        members: {
          some: {
            userId
          }
        },
        NOT: {
          id: workspaceId
        }
      }
    });
    if (duplicateWorkspace) {
      throw new appError_default(
        status5.CONFLICT,
        "You already have a workspace with this name."
      );
    }
  }
  const result = await prisma.$transaction(async (tx) => {
    const updatedWorkspace = await tx.workspace.update({
      where: {
        id: workspaceId
      },
      data: payload
    });
    await tx.activity.create({
      data: {
        action: ActivityAction.UPDATED,
        entityType: ActivityEntity.WORKSPACE,
        entityId: workspaceId,
        workspaceId,
        performedBy: userId,
        description: `Workspace "${updatedWorkspace.name}" was updated.`,
        metadata: {
          oldName: workspace.name,
          newName: updatedWorkspace.name
        }
      }
    });
    return updatedWorkspace;
  });
  return result;
};
var deleteWorkspace = async (workspaceId, userId) => {
  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId
      }
    }
  });
  if (!membership) {
    throw new appError_default(status5.NOT_FOUND, "Workspace not found.");
  }
  if (membership.role !== WorkspaceRole.OWNER) {
    throw new appError_default(
      status5.FORBIDDEN,
      "Only the workspace owner can delete the workspace."
    );
  }
  const workspace = await prisma.workspace.findFirst({
    where: {
      id: workspaceId,
      isDeleted: false
    }
  });
  if (!workspace) {
    throw new appError_default(status5.NOT_FOUND, "Workspace not found.");
  }
  await prisma.$transaction(async (tx) => {
    await tx.workspace.update({
      where: {
        id: workspaceId
      },
      data: {
        isDeleted: true,
        deletedAt: /* @__PURE__ */ new Date()
      }
    });
    await tx.activity.create({
      data: {
        action: ActivityAction.DELETED,
        entityType: ActivityEntity.WORKSPACE,
        entityId: workspaceId,
        workspaceId,
        performedBy: userId,
        description: `Workspace "${workspace.name}" was deleted.`
      }
    });
  });
  return null;
};
var addMember = async (workspaceId, requesterId, payload) => {
  const { email, role = WorkspaceRole.MEMBER } = payload;
  const requester = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId: requesterId
      }
    }
  });
  if (!requester) {
    throw new appError_default(status5.NOT_FOUND, "Workspace not found");
  }
  if (requester.role !== WorkspaceRole.OWNER && requester.role !== WorkspaceRole.ADMIN) {
    throw new appError_default(
      status5.FORBIDDEN,
      "You do not have permission to add members"
    );
  }
  const workspace = await prisma.workspace.findFirst({
    where: {
      id: workspaceId,
      isDeleted: false
    }
  });
  if (!workspace) {
    throw new appError_default(status5.NOT_FOUND, "Workspace not found.");
  }
  const user = await prisma.user.findFirst({
    where: {
      email,
      isDeleted: false,
      status: UserStatus.ACTIVE
    }
  });
  if (!user) {
    throw new appError_default(status5.NOT_FOUND, "No user found with this email");
  }
  const existingMember = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId: user.id
      }
    }
  });
  if (existingMember) {
    throw new appError_default(
      status5.CONFLICT,
      "User is already a member of this workspace"
    );
  }
  if (requester.role === WorkspaceRole.ADMIN && role === WorkspaceRole.ADMIN) {
    throw new appError_default(
      status5.FORBIDDEN,
      "Only the workspace owner can assign the ADMIN role."
    );
  }
  const result = await prisma.$transaction(async (tx) => {
    const member = await tx.workspaceMember.create({
      data: {
        workspaceId,
        userId: user.id,
        role
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            status: true
          }
        }
      }
    });
    await tx.activity.create({
      data: {
        action: ActivityAction.MEMBER_ADDED,
        entityType: ActivityEntity.MEMBER,
        entityId: member.id,
        workspaceId,
        performedBy: requesterId,
        description: `${member.user.name} was added to the workspace.`,
        metadata: {
          userId: member.user.id,
          role: member.role
        }
      }
    });
    return member;
  });
  return result;
};
var getWorkspaceMembers = async (workspaceId, requesterId) => {
  const requester = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId: requesterId
      }
    }
  });
  if (!requester) {
    throw new appError_default(status5.NOT_FOUND, "Workspace not found.");
  }
  const workspace = await prisma.workspace.findFirst({
    where: {
      id: workspaceId,
      isDeleted: false
    }
  });
  if (!workspace) {
    throw new appError_default(status5.NOT_FOUND, "Workspace not found.");
  }
  const members = await prisma.workspaceMember.findMany({
    where: {
      workspaceId
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          status: true
        }
      }
    },
    orderBy: {
      createdAt: "asc"
    }
  });
  return members;
};
var getWorkspaceMember = async (workspaceId, requesterId, memberId) => {
  const requester = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId: requesterId
      }
    }
  });
  if (!requester) {
    throw new appError_default(status5.NOT_FOUND, "Workspace not found.");
  }
  const member = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId: memberId
      }
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          status: true
        }
      }
    }
  });
  if (!member) {
    throw new appError_default(status5.NOT_FOUND, "Member not found.");
  }
  return member;
};
var updateMemberRole = async (workspaceId, requesterId, memberId, payload) => {
  const requester = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId: requesterId
      }
    }
  });
  if (!requester) {
    throw new appError_default(status5.NOT_FOUND, "Workspace not found.");
  }
  if (requester.role !== WorkspaceRole.OWNER) {
    throw new appError_default(
      status5.FORBIDDEN,
      "Only the workspace owner can change member roles."
    );
  }
  const member = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId: memberId
      }
    }
  });
  if (!member) {
    throw new appError_default(status5.NOT_FOUND, "Member not found.");
  }
  if (member.role === WorkspaceRole.OWNER) {
    throw new appError_default(
      status5.FORBIDDEN,
      "The workspace owner's role cannot be changed."
    );
  }
  const result = await prisma.$transaction(async (tx) => {
    const updatedMember = await tx.workspaceMember.update({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: memberId
        }
      },
      data: {
        role: payload.role
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            status: true
          }
        }
      }
    });
    await tx.activity.create({
      data: {
        action: ActivityAction.UPDATED,
        entityType: ActivityEntity.MEMBER,
        entityId: updatedMember.id,
        workspaceId,
        performedBy: requesterId,
        description: `${updatedMember.user.name}'s workspace role was changed from ${member.role} to ${updatedMember.role}.`,
        metadata: {
          userId: updatedMember.user.id,
          oldRole: member.role,
          newRole: updatedMember.role
        }
      }
    });
    return updatedMember;
  });
  return result;
};
var removeMember = async (workspaceId, requesterId, memberId) => {
  const requester = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId: requesterId
      }
    }
  });
  if (!requester) {
    throw new appError_default(status5.NOT_FOUND, "Workspace not found.");
  }
  if (requester.role !== WorkspaceRole.OWNER && requester.role !== WorkspaceRole.ADMIN) {
    throw new appError_default(
      status5.FORBIDDEN,
      "You do not have permission to remove members."
    );
  }
  const member = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId: memberId
      }
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
  if (!member) {
    throw new appError_default(status5.NOT_FOUND, "Member not found.");
  }
  if (member.role === WorkspaceRole.OWNER) {
    throw new appError_default(
      status5.FORBIDDEN,
      "The workspace owner cannot be removed."
    );
  }
  if (requester.role === WorkspaceRole.ADMIN && member.role === WorkspaceRole.ADMIN) {
    throw new appError_default(
      status5.FORBIDDEN,
      "An admin cannot remove another admin."
    );
  }
  await prisma.$transaction(async (tx) => {
    await tx.workspaceMember.delete({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: memberId
        }
      }
    });
    await tx.activity.create({
      data: {
        action: ActivityAction.MEMBER_REMOVED,
        entityType: ActivityEntity.MEMBER,
        entityId: member.id,
        workspaceId,
        performedBy: requesterId,
        description: `${member.user.name} was removed from the workspace.`,
        metadata: {
          userId: member.user.id,
          role: member.role
        }
      }
    });
  });
  return null;
};
var workspaceService = {
  createWorkspace,
  getMyWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  // Member
  addMember,
  getWorkspaceMembers,
  getWorkspaceMember,
  updateMemberRole,
  removeMember
};

// src/app/modules/workspace/workspace.controller.ts
var createWorkspace2 = catchAsync_default(async (req, res) => {
  const { userId } = req.user;
  const result = await workspaceService.createWorkspace(req.body, userId);
  sendResponse(res, {
    httpStatusCode: status6.CREATED,
    success: true,
    message: "Workspace created successfully.",
    data: result
  });
});
var getMyWorkspaces2 = catchAsync_default(async (req, res) => {
  const { userId } = req.user;
  const result = await workspaceService.getMyWorkspaces(userId);
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "Workspaces retrived successfully.",
    data: result
  });
});
var getWorkspaceById2 = catchAsync_default(async (req, res) => {
  const { userId } = req.user;
  const { workspaceId } = req.params;
  console.log(workspaceId);
  const result = await workspaceService.getWorkspaceById(
    workspaceId,
    userId
  );
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "Workspace retrived successfully.",
    data: result
  });
});
var updateWorkspace2 = catchAsync_default(async (req, res) => {
  const { userId } = req.user;
  const { workspaceId } = req.params;
  const result = await workspaceService.updateWorkspace(
    workspaceId,
    userId,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "Workspace updated successfully.",
    data: result
  });
});
var deleteWorkspace2 = catchAsync_default(async (req, res) => {
  const { userId } = req.user;
  const { workspaceId } = req.params;
  const result = await workspaceService.deleteWorkspace(
    workspaceId,
    userId
  );
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "Workspace deleted successfully.",
    data: result
  });
});
var addMember2 = catchAsync_default(async (req, res) => {
  const { userId } = req.user;
  const { workspaceId } = req.params;
  const result = await workspaceService.addMember(
    workspaceId,
    userId,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "Member added successfully.",
    data: result
  });
});
var getWorkspaceMembers2 = catchAsync_default(async (req, res) => {
  const { userId } = req.user;
  const { workspaceId } = req.params;
  const result = await workspaceService.getWorkspaceMembers(
    workspaceId,
    userId
  );
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "Members retrived successfully.",
    data: result
  });
});
var getWorkspaceMember2 = catchAsync_default(async (req, res) => {
  const { userId } = req.user;
  const { workspaceId } = req.params;
  const { memberId } = req.params;
  const result = await workspaceService.getWorkspaceMember(
    workspaceId,
    userId,
    memberId
  );
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "Member retrived successfully.",
    data: result
  });
});
var updateMemberRole2 = catchAsync_default(async (req, res) => {
  const { userId } = req.user;
  const { workspaceId } = req.params;
  const { memberId } = req.params;
  const result = await workspaceService.updateMemberRole(
    workspaceId,
    userId,
    memberId,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "Member role updated successfully.",
    data: result
  });
});
var removeMember2 = catchAsync_default(async (req, res) => {
  const { userId } = req.user;
  const { workspaceId } = req.params;
  const { memberId } = req.params;
  await workspaceService.removeMember(
    workspaceId,
    userId,
    memberId
  );
  sendResponse(res, {
    httpStatusCode: status6.OK,
    success: true,
    message: "Member removed successfully.",
    data: null
  });
});
var workspaceController = {
  createWorkspace: createWorkspace2,
  getMyWorkspaces: getMyWorkspaces2,
  getWorkspaceById: getWorkspaceById2,
  updateWorkspace: updateWorkspace2,
  deleteWorkspace: deleteWorkspace2,
  addMember: addMember2,
  getWorkspaceMembers: getWorkspaceMembers2,
  getWorkspaceMember: getWorkspaceMember2,
  updateMemberRole: updateMemberRole2,
  removeMember: removeMember2
};

// src/app/modules/workspace/workspace.validation.ts
import z2 from "zod";
var workspaceCreateZodSchema = z2.object({
  name: z2.string("Workspace name is required").trim().min(2, "Workspace name must be at least 2 characters long").max(100, "Workspace name cannot exceed 100 characters"),
  description: z2.string().trim().max(500, "Workspace description cannot exceed 500 characters").optional()
});
var workspaceUpdateZodSchema = z2.object({
  name: z2.string().trim().min(2, "Workspace name must be at least 2 characters long").max(100, "Workspace name cannot exceed 100 characters").optional(),
  description: z2.string().trim().max(500, "Workspace description cannot exceed 500 characters").optional()
}).refine((data) => data.name !== void 0 || data.description !== void 0, {
  message: "At least one field is required to update workspace."
});
var addWorkspaceMemberZodSchema = z2.object({
  email: z2.email({
    message: "Please provide a valid email address."
  }),
  role: z2.enum(["ADMIN", "MEMBER"]).default("MEMBER")
});
var updateWorkspaceMemberZodSchema = z2.object({
  role: z2.enum(["ADMIN", "MEMBER"])
});

// src/app/modules/workspace/workspace.route.ts
var router2 = Router2();
router2.get("/", checkAuth(Role.USER), workspaceController.getMyWorkspaces);
router2.get(
  "/:workspaceId",
  checkAuth(Role.USER),
  workspaceController.getWorkspaceById
);
router2.patch(
  "/:workspaceId",
  validateRequest(workspaceUpdateZodSchema),
  checkAuth(Role.USER),
  workspaceController.updateWorkspace
);
router2.patch(
  "/delete/:workspaceId",
  checkAuth(Role.USER),
  workspaceController.deleteWorkspace
);
router2.post(
  "/",
  validateRequest(workspaceCreateZodSchema),
  checkAuth(Role.USER),
  workspaceController.createWorkspace
);
router2.get(
  "/:workspaceId/members",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  workspaceController.getWorkspaceMembers
);
router2.get(
  "/:workspaceId/members/:memberId",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  workspaceController.getWorkspaceMember
);
router2.patch(
  "/:workspaceId/members",
  validateRequest(addWorkspaceMemberZodSchema),
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  workspaceController.addMember
);
router2.patch(
  "/:workspaceId/members/:memberId",
  validateRequest(updateWorkspaceMemberZodSchema),
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  workspaceController.updateMemberRole
);
router2.delete(
  "/:workspaceId/members/:memberId",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  workspaceController.removeMember
);
var workspaceRoutes = router2;

// src/app/modules/project/project.route.ts
import { Router as Router3 } from "express";

// src/app/modules/project/project.controller.ts
import status8 from "http-status";

// src/app/modules/project/project.service.ts
import status7 from "http-status";
var createProject = async (workspaceId, userId, payload) => {
  const { name, description } = payload;
  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId
      }
    }
  });
  if (!membership) {
    throw new appError_default(status7.NOT_FOUND, "Workspace not found.");
  }
  if (membership.role !== WorkspaceRole.OWNER && membership.role !== WorkspaceRole.ADMIN) {
    throw new appError_default(
      status7.FORBIDDEN,
      "You do not have permission to create a project."
    );
  }
  const workspace = await prisma.workspace.findFirst({
    where: {
      id: workspaceId,
      isDeleted: false
    }
  });
  if (!workspace) {
    throw new appError_default(status7.NOT_FOUND, "Workspace not found.");
  }
  const existingProject = await prisma.project.findFirst({
    where: {
      workspaceId,
      name,
      isDeleted: false
    }
  });
  if (existingProject) {
    throw new appError_default(
      status7.CONFLICT,
      "A project with this name already exists in this workspace."
    );
  }
  const result = await prisma.$transaction(async (tx) => {
    const project = await tx.project.create({
      data: {
        name,
        description,
        workspaceId
      }
    });
    await tx.activity.create({
      data: {
        action: ActivityAction.CREATED,
        entityType: ActivityEntity.PROJECT,
        entityId: project.id,
        workspaceId,
        projectId: project.id,
        performedBy: userId,
        description: `Project "${project.name}" was created.`
      }
    });
    return project;
  });
  return result;
};
var getWorkspaceProjects = async (workspaceId, userId) => {
  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId
      }
    }
  });
  if (!membership) {
    throw new appError_default(status7.NOT_FOUND, "Workspace not found.");
  }
  const workspace = await prisma.workspace.findFirst({
    where: {
      id: workspaceId,
      isDeleted: false
    }
  });
  if (!workspace) {
    throw new appError_default(status7.NOT_FOUND, "Workspace not found.");
  }
  const projects = await prisma.project.findMany({
    where: {
      workspaceId,
      isDeleted: false
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return projects;
};
var getProjectById = async (workspaceId, projectId, userId) => {
  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId
      }
    }
  });
  if (!membership) {
    throw new appError_default(status7.NOT_FOUND, "Workspace not found.");
  }
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      workspaceId,
      isDeleted: false
    },
    include: {
      _count: {
        select: {
          tasks: true
        }
      }
    }
  });
  if (!project) {
    throw new appError_default(status7.NOT_FOUND, "Project not found.");
  }
  return project;
};
var updateProject = async (workspaceId, projectId, userId, payload) => {
  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId
      }
    }
  });
  if (!membership) {
    throw new appError_default(status7.NOT_FOUND, "Workspace not found.");
  }
  if (membership.role !== WorkspaceRole.OWNER && membership.role !== WorkspaceRole.ADMIN) {
    throw new appError_default(
      status7.FORBIDDEN,
      "You do not have permission to update projects."
    );
  }
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      workspaceId,
      isDeleted: false
    }
  });
  if (!project) {
    throw new appError_default(status7.NOT_FOUND, "Project not found.");
  }
  if (payload.name && payload.name !== project.name) {
    const duplicateProject = await prisma.project.findFirst({
      where: {
        workspaceId,
        name: payload.name,
        isDeleted: false,
        NOT: {
          id: projectId
        }
      }
    });
    if (duplicateProject) {
      throw new appError_default(
        status7.CONFLICT,
        "A project with this name already exists in this workspace."
      );
    }
  }
  const result = await prisma.$transaction(async (tx) => {
    const updatedProject = await tx.project.update({
      where: {
        id: projectId
      },
      data: payload
    });
    await tx.activity.create({
      data: {
        action: ActivityAction.UPDATED,
        entityType: ActivityEntity.PROJECT,
        entityId: projectId,
        workspaceId,
        projectId,
        performedBy: userId,
        description: `Project "${updatedProject.name}" was updated.`,
        metadata: {
          oldName: project.name,
          newName: updatedProject.name
        }
      }
    });
    return updatedProject;
  });
  return result;
};
var deleteProject = async (workspaceId, projectId, userId) => {
  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId
      }
    }
  });
  if (!membership) {
    throw new appError_default(status7.NOT_FOUND, "Workspace not found.");
  }
  if (membership.role !== WorkspaceRole.OWNER) {
    throw new appError_default(
      status7.FORBIDDEN,
      "Only the workspace owner can delete a project."
    );
  }
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      workspaceId,
      isDeleted: false
    }
  });
  if (!project) {
    throw new appError_default(status7.NOT_FOUND, "Project not found.");
  }
  await prisma.$transaction(async (tx) => {
    await tx.project.update({
      where: {
        id: projectId
      },
      data: {
        isDeleted: true,
        deletedAt: /* @__PURE__ */ new Date()
      }
    });
    await tx.activity.create({
      data: {
        action: ActivityAction.DELETED,
        entityType: ActivityEntity.PROJECT,
        entityId: projectId,
        workspaceId,
        projectId,
        performedBy: userId,
        description: `Project "${project.name}" was deleted.`
      }
    });
  });
  return null;
};
var projectService = {
  createProject,
  getWorkspaceProjects,
  getProjectById,
  updateProject,
  deleteProject
};

// src/app/modules/project/project.controller.ts
var createProject2 = catchAsync_default(async (req, res) => {
  const { userId } = req.user;
  const result = await projectService.createProject(
    req.params.workspaceId,
    userId,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: status8.CREATED,
    success: true,
    message: "Project created successfully.",
    data: result
  });
});
var getWorkspaceProjects2 = catchAsync_default(async (req, res) => {
  const { userId } = req.user;
  const result = await projectService.getWorkspaceProjects(
    req.params.workspaceId,
    userId
  );
  sendResponse(res, {
    httpStatusCode: status8.OK,
    success: true,
    message: "Projects retrieved successfully.",
    data: result
  });
});
var getProjectById2 = catchAsync_default(async (req, res) => {
  const { userId } = req.user;
  const result = await projectService.getProjectById(
    req.params.workspaceId,
    req.params.projectId,
    userId
  );
  sendResponse(res, {
    httpStatusCode: status8.OK,
    success: true,
    message: "Project retrieved successfully.",
    data: result
  });
});
var updateProject2 = catchAsync_default(async (req, res) => {
  const { userId } = req.user;
  const result = await projectService.updateProject(
    req.params.workspaceId,
    req.params.projectId,
    userId,
    req.body
  );
  sendResponse(res, {
    httpStatusCode: status8.OK,
    success: true,
    message: "Project updated successfully.",
    data: result
  });
});
var deleteProject2 = catchAsync_default(async (req, res) => {
  const { userId } = req.user;
  await projectService.deleteProject(
    req.params.workspaceId,
    req.params.projectId,
    userId
  );
  sendResponse(res, {
    httpStatusCode: status8.OK,
    success: true,
    message: "Project deleted successfully.",
    data: null
  });
});
var projectController = {
  createProject: createProject2,
  getWorkspaceProjects: getWorkspaceProjects2,
  getProjectById: getProjectById2,
  updateProject: updateProject2,
  deleteProject: deleteProject2
};

// src/app/modules/project/project.validation.ts
import z3 from "zod";
var createProjectZodSchema = z3.object({
  name: z3.string("Project name is required").trim().min(2, "Project name must be at least 2 characters long").max(100, "Project name cannot exceed 100 characters"),
  description: z3.string().trim().max(500, "Project description cannot exceed 500 characters").optional()
});
var updateProjectZodSchema = z3.object({
  name: z3.string().trim().min(2, "Project name must be at least 2 characters long").max(100, "Project name cannot exceed 100 characters").optional(),
  description: z3.string().trim().max(500, "Project description cannot exceed 500 characters").optional()
}).refine((data) => data.name !== void 0 || data.description !== void 0, {
  message: "At least one field is required."
});

// src/app/modules/project/project.route.ts
var router3 = Router3();
router3.post(
  "/:workspaceId/projects",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createProjectZodSchema),
  projectController.createProject
);
router3.get(
  "/:workspaceId/projects",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  projectController.getWorkspaceProjects
);
router3.get(
  "/:workspaceId/projects/:projectId",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  projectController.getProjectById
);
router3.patch(
  "/:workspaceId/projects/:projectId",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateProjectZodSchema),
  projectController.updateProject
);
router3.patch(
  "/:workspaceId/projects/:projectId/delete",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  projectController.deleteProject
);
var projectRoutes = router3;

// src/app/modules/task/task.route.ts
import { Router as Router4 } from "express";

// src/app/modules/task/task.controller.ts
import status10 from "http-status";

// src/app/modules/task/task.service.ts
import status9 from "http-status";
var getWorkspaceMembership = async (workspaceId, userId) => {
  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId
      }
    }
  });
  if (!membership) {
    throw new appError_default(
      status9.FORBIDDEN,
      "You are not a member of this workspace."
    );
  }
  return membership;
};
var getProject = async (workspaceId, projectId) => {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      workspaceId,
      isDeleted: false
    }
  });
  if (!project) {
    throw new appError_default(
      status9.NOT_FOUND,
      "Project not found in this workspace."
    );
  }
  return project;
};
var createTask = async (workspaceId, projectId, payload, userId) => {
  const membership = await getWorkspaceMembership(workspaceId, userId);
  if (membership.role !== WorkspaceRole.OWNER && membership.role !== WorkspaceRole.ADMIN) {
    throw new appError_default(
      status9.FORBIDDEN,
      "Only workspace owner or admin can create tasks."
    );
  }
  await getProject(workspaceId, projectId);
  if (payload.assignedTo) {
    const assignee = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: payload.assignedTo
        }
      }
    });
    if (!assignee) {
      throw new appError_default(
        status9.BAD_REQUEST,
        "The assigned user is not a member of this workspace."
      );
    }
  }
  const task = await prisma.$transaction(async (tx) => {
    const createdTask = await tx.task.create({
      data: {
        title: payload.title,
        description: payload.description,
        priority: payload.priority,
        dueDate: payload.dueDate ? new Date(payload.dueDate) : void 0,
        assignedTo: payload.assignedTo,
        createdBy: userId,
        projectId
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    await tx.activity.create({
      data: {
        action: ActivityAction.CREATED,
        entityType: ActivityEntity.TASK,
        entityId: createdTask.id,
        workspaceId,
        projectId: createdTask.projectId,
        taskId: createdTask.id,
        performedBy: userId,
        description: `Task "${createdTask.title}" was created.`
      }
    });
    return createdTask;
  });
  return task;
};
var getProjectTasks = async (workspaceId, projectId, userId) => {
  await getWorkspaceMembership(workspaceId, userId);
  await getProject(workspaceId, projectId);
  const tasks = await prisma.task.findMany({
    where: {
      projectId,
      isDeleted: false
    },
    orderBy: {
      createdAt: "desc"
    },
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      creator: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      _count: {
        select: {
          comments: true
        }
      }
    }
  });
  return tasks;
};
var getTaskById = async (workspaceId, projectId, taskId, userId) => {
  await getWorkspaceMembership(workspaceId, userId);
  await getProject(workspaceId, projectId);
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      projectId,
      isDeleted: false
    },
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      creator: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      comments: {
        where: {
          isDeleted: false
        },
        orderBy: {
          createdAt: "asc"
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }
    }
  });
  if (!task) {
    throw new appError_default(status9.NOT_FOUND, "Task not found.");
  }
  return task;
};
var updateTask = async (workspaceId, projectId, taskId, payload, userId) => {
  const membership = await getWorkspaceMembership(workspaceId, userId);
  await getProject(workspaceId, projectId);
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      projectId,
      isDeleted: false
    }
  });
  if (!task) {
    throw new appError_default(status9.NOT_FOUND, "Task not found.");
  }
  const isManager = membership.role === WorkspaceRole.OWNER || membership.role === WorkspaceRole.ADMIN;
  if (!isManager) {
    if (task.assignedTo !== userId) {
      throw new appError_default(
        status9.FORBIDDEN,
        "You can only update tasks assigned to you."
      );
    }
    const forbiddenFields = payload.title !== void 0 || payload.priority !== void 0 || payload.dueDate !== void 0 || payload.assignedTo !== void 0;
    if (forbiddenFields) {
      throw new appError_default(
        status9.FORBIDDEN,
        "You can only update the description and status of your assigned task."
      );
    }
  }
  if (payload.assignedTo) {
    const assignee = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: payload.assignedTo
        }
      }
    });
    if (!assignee) {
      throw new appError_default(
        status9.BAD_REQUEST,
        "The assigned user is not a member of this workspace."
      );
    }
  }
  const updatedTask = await prisma.$transaction(async (tx) => {
    const updatedTask2 = await tx.task.update({
      where: {
        id: taskId
      },
      data: {
        ...payload.title !== void 0 && {
          title: payload.title
        },
        ...payload.description !== void 0 && {
          description: payload.description
        },
        ...payload.priority !== void 0 && {
          priority: payload.priority
        },
        ...payload.status !== void 0 && {
          status: payload.status
        },
        ...payload.dueDate !== void 0 && {
          dueDate: payload.dueDate ? new Date(payload.dueDate) : null
        },
        ...payload.assignedTo !== void 0 && {
          assignedTo: payload.assignedTo
        }
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    await tx.activity.create({
      data: {
        action: ActivityAction.UPDATED,
        entityType: ActivityEntity.TASK,
        entityId: updatedTask2.id,
        workspaceId,
        projectId: updatedTask2.projectId,
        taskId: updatedTask2.id,
        performedBy: userId,
        description: `Task "${updatedTask2.title}" was updated.`
      }
    });
    return updatedTask2;
  });
  return updatedTask;
};
var updateTaskStatus = async (workspaceId, projectId, taskId, payload, userId) => {
  const membership = await getWorkspaceMembership(workspaceId, userId);
  await getProject(workspaceId, projectId);
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      projectId,
      isDeleted: false
    }
  });
  if (!task) {
    throw new appError_default(status9.NOT_FOUND, "Task not found.");
  }
  const oldStatus = task.status;
  const newStatus = payload.status;
  const isManager = membership.role === WorkspaceRole.OWNER || membership.role === WorkspaceRole.ADMIN;
  if (!isManager && task.assignedTo !== userId) {
    throw new appError_default(
      status9.FORBIDDEN,
      "You can only update the status of tasks assigned to you."
    );
  }
  const result = await prisma.$transaction(async (tx) => {
    const updatedTask = await tx.task.update({
      where: {
        id: taskId
      },
      data: {
        status: newStatus
      }
    });
    await tx.activity.create({
      data: {
        action: ActivityAction.STATUS_CHANGED,
        entityType: ActivityEntity.TASK,
        entityId: task.id,
        workspaceId,
        projectId: task.projectId,
        taskId: task.id,
        performedBy: userId,
        description: `Task "${task.title}" status changed from ${oldStatus} to ${newStatus}.`,
        metadata: {
          oldStatus,
          newStatus
        }
      }
    });
    return updatedTask;
  });
  return result;
};
var assignTask = async (workspaceId, projectId, taskId, payload, userId) => {
  const membership = await getWorkspaceMembership(workspaceId, userId);
  if (membership.role !== WorkspaceRole.OWNER && membership.role !== WorkspaceRole.ADMIN) {
    throw new appError_default(
      status9.FORBIDDEN,
      "Only workspace owner or admin can assign tasks."
    );
  }
  await getProject(workspaceId, projectId);
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      projectId,
      isDeleted: false
    }
  });
  if (!task) {
    throw new appError_default(status9.NOT_FOUND, "Task not found.");
  }
  if (payload.assignedTo) {
    const assignee = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: payload.assignedTo
        }
      }
    });
    if (!assignee) {
      throw new appError_default(
        status9.BAD_REQUEST,
        "The assigned user is not a member of this workspace."
      );
    }
  }
  const result = await prisma.$transaction(async (tx) => {
    const updatedTask = await tx.task.update({
      where: {
        id: taskId
      },
      data: {
        assignedTo: payload.assignedTo
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    await tx.activity.create({
      data: {
        action: ActivityAction.ASSIGNED,
        entityType: ActivityEntity.TASK,
        entityId: task.id,
        workspaceId,
        projectId: task.projectId,
        taskId: task.id,
        performedBy: userId,
        description: payload.assignedTo ? `Task "${task.title}" was assigned to ${updatedTask.assignee?.name}.` : `Task "${task.title}" was unassigned.`,
        metadata: {
          previousAssigneeId: task.assignedTo,
          newAssigneeId: payload.assignedTo ?? null
        }
      }
    });
    return updatedTask;
  });
  return result;
};
var deleteTask = async (workspaceId, projectId, taskId, userId) => {
  const membership = await getWorkspaceMembership(workspaceId, userId);
  if (membership.role !== WorkspaceRole.OWNER && membership.role !== WorkspaceRole.ADMIN) {
    throw new appError_default(
      status9.FORBIDDEN,
      "Only workspace owner or admin can delete tasks."
    );
  }
  await getProject(workspaceId, projectId);
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      projectId,
      isDeleted: false
    }
  });
  if (!task) {
    throw new appError_default(status9.NOT_FOUND, "Task not found.");
  }
  await prisma.$transaction(async (tx) => {
    await tx.task.update({
      where: {
        id: taskId
      },
      data: {
        isDeleted: true,
        deletedAt: /* @__PURE__ */ new Date()
      }
    });
    await tx.activity.create({
      data: {
        action: ActivityAction.DELETED,
        entityType: ActivityEntity.TASK,
        entityId: task.id,
        workspaceId,
        projectId: task.projectId,
        taskId: task.id,
        performedBy: userId,
        description: `Task "${task.title}" was deleted.`
      }
    });
  });
  return null;
};
var taskService = {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  assignTask,
  deleteTask
};

// src/app/modules/task/task.controller.ts
var createTask2 = catchAsync_default(async (req, res) => {
  const { workspaceId, projectId } = req.params;
  const { userId } = req.user;
  const result = await taskService.createTask(
    workspaceId,
    projectId,
    req.body,
    userId
  );
  sendResponse(res, {
    httpStatusCode: status10.CREATED,
    success: true,
    message: "Task created successfully.",
    data: result
  });
});
var getProjectTasks2 = catchAsync_default(async (req, res) => {
  const { workspaceId, projectId } = req.params;
  const { userId } = req.user;
  const result = await taskService.getProjectTasks(
    workspaceId,
    projectId,
    userId
  );
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "Tasks retrieved successfully.",
    data: result
  });
});
var getTaskById2 = catchAsync_default(async (req, res) => {
  const { workspaceId, projectId, taskId } = req.params;
  const { userId } = req.user;
  const result = await taskService.getTaskById(
    workspaceId,
    projectId,
    taskId,
    userId
  );
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "Task retrieved successfully.",
    data: result
  });
});
var updateTask2 = catchAsync_default(async (req, res) => {
  const { workspaceId, projectId, taskId } = req.params;
  const { userId } = req.user;
  const result = await taskService.updateTask(
    workspaceId,
    projectId,
    taskId,
    req.body,
    userId
  );
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "Task updated successfully.",
    data: result
  });
});
var updateTaskStatus2 = catchAsync_default(async (req, res) => {
  const { workspaceId, projectId, taskId } = req.params;
  const { userId } = req.user;
  const result = await taskService.updateTaskStatus(
    workspaceId,
    projectId,
    taskId,
    req.body,
    userId
  );
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "Task status updated successfully.",
    data: result
  });
});
var assignTask2 = catchAsync_default(async (req, res) => {
  const { workspaceId, projectId, taskId } = req.params;
  const { userId } = req.user;
  const result = await taskService.assignTask(
    workspaceId,
    projectId,
    taskId,
    req.body,
    userId
  );
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "Task assigned successfully.",
    data: result
  });
});
var deleteTask2 = catchAsync_default(async (req, res) => {
  const { workspaceId, projectId, taskId } = req.params;
  const { userId } = req.user;
  const result = await taskService.deleteTask(
    workspaceId,
    projectId,
    taskId,
    userId
  );
  sendResponse(res, {
    httpStatusCode: status10.OK,
    success: true,
    message: "Task deleted successfully.",
    data: result
  });
});
var taskController = {
  createTask: createTask2,
  getProjectTasks: getProjectTasks2,
  getTaskById: getTaskById2,
  updateTask: updateTask2,
  updateTaskStatus: updateTaskStatus2,
  assignTask: assignTask2,
  deleteTask: deleteTask2
};

// src/app/modules/task/task.validation.ts
import z4 from "zod";
var createTaskZodSchema = z4.object({
  title: z4.string("Task title is required").min(2, "Task title must be at least 2 characters").max(200, "Task title cannot exceed 200 characters"),
  description: z4.string().max(2e3, "Description cannot exceed 2000 characters").optional(),
  priority: z4.enum(TaskPriority).optional(),
  dueDate: z4.iso.datetime({ message: "Due date must be a valid datetime" }).optional(),
  assignedTo: z4.string().optional()
});
var updateTaskZodSchema = z4.object({
  title: z4.string().min(2).max(200).optional(),
  description: z4.string().max(2e3).optional(),
  priority: z4.enum(TaskPriority).optional(),
  dueDate: z4.iso.datetime().nullable().optional(),
  assignedTo: z4.string().nullable().optional(),
  status: z4.enum(TaskStatus).optional()
});
var updateTaskStatusZodSchema = z4.object({
  status: z4.enum(TaskStatus)
});
var assignTaskZodSchema = z4.object({
  assignedTo: z4.string().nullable()
});

// src/app/modules/task/task.route.ts
var router4 = Router4();
var allowedRoles = [Role.USER, Role.ADMIN, Role.SUPER_ADMIN];
router4.post(
  "/:workspaceId/projects/:projectId/tasks",
  checkAuth(...allowedRoles),
  validateRequest(createTaskZodSchema),
  taskController.createTask
);
router4.get(
  "/:workspaceId/projects/:projectId/tasks",
  checkAuth(...allowedRoles),
  taskController.getProjectTasks
);
router4.get(
  "/:workspaceId/projects/:projectId/tasks/:taskId",
  checkAuth(...allowedRoles),
  taskController.getTaskById
);
router4.patch(
  "/:workspaceId/projects/:projectId/tasks/:taskId",
  checkAuth(...allowedRoles),
  validateRequest(updateTaskZodSchema),
  taskController.updateTask
);
router4.patch(
  "/:workspaceId/projects/:projectId/tasks/:taskId/status",
  checkAuth(...allowedRoles),
  validateRequest(updateTaskStatusZodSchema),
  taskController.updateTaskStatus
);
router4.patch(
  "/:workspaceId/projects/:projectId/tasks/:taskId/assign",
  checkAuth(...allowedRoles),
  validateRequest(assignTaskZodSchema),
  taskController.assignTask
);
router4.patch(
  "/:workspaceId/projects/:projectId/tasks/:taskId/delete",
  checkAuth(...allowedRoles),
  taskController.deleteTask
);
var taskRoutes = router4;

// src/app/modules/comment/comment.route.ts
import { Router as Router5 } from "express";

// src/app/modules/comment/comment.controller.ts
import status13 from "http-status";

// src/app/modules/comment/comment.service.ts
import status12 from "http-status";

// src/app/modules/activity/activity.service.ts
import status11 from "http-status";
var createActivity = async (payload, tx) => {
  const db = tx ?? prisma;
  const activity = await db.activity.create({
    data: {
      action: payload.action,
      entityType: payload.entityType,
      entityId: payload.entityId,
      workspaceId: payload.workspaceId,
      projectId: payload.projectId,
      taskId: payload.taskId,
      performedBy: payload.performedBy,
      description: payload.description,
      metadata: payload.metadata
    }
  });
  return activity;
};
var getWorkspaceActivities = async (workspaceId, userId) => {
  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId
      }
    }
  });
  if (!membership) {
    throw new appError_default(
      status11.FORBIDDEN,
      "You are not a member of this workspace."
    );
  }
  const activities = await prisma.activity.findMany({
    where: {
      workspaceId
    },
    include: {
      performer: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      },
      project: {
        select: {
          id: true,
          name: true
        }
      },
      task: {
        select: {
          id: true,
          title: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return activities;
};
var getTaskActivities = async (workspaceId, taskId, userId) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      isDeleted: false,
      project: {
        workspaceId,
        isDeleted: false
      }
    }
  });
  if (!task) {
    throw new appError_default(status11.NOT_FOUND, "Task not found.");
  }
  const membership = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId
      }
    }
  });
  if (!membership) {
    throw new appError_default(
      status11.FORBIDDEN,
      "You are not a member of this workspace."
    );
  }
  const activities = await prisma.activity.findMany({
    where: {
      workspaceId,
      taskId
    },
    include: {
      performer: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return activities;
};
var activityService = {
  createActivity,
  getWorkspaceActivities,
  getTaskActivities
};

// src/app/modules/comment/comment.service.ts
var checkTaskAccess = async (workspaceId, taskId, userId) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      isDeleted: false,
      project: {
        workspaceId,
        isDeleted: false,
        workspace: {
          isDeleted: false
        }
      }
    },
    include: {
      project: {
        include: {
          workspace: {
            include: {
              members: {
                where: {
                  userId
                }
              }
            }
          }
        }
      }
    }
  });
  if (!task) {
    throw new appError_default(status12.NOT_FOUND, "Task not found");
  }
  const membership = task.project.workspace.members[0];
  if (!membership) {
    throw new appError_default(
      status12.FORBIDDEN,
      "You are not a member of this workspace."
    );
  }
  return {
    task,
    membership
  };
};
var getTaskComments = async (workspaceId, taskId, userId) => {
  await checkTaskAccess(workspaceId, taskId, userId);
  const comments = await prisma.comment.findMany({
    where: {
      taskId,
      isDeleted: false
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      }
    },
    orderBy: {
      createdAt: "asc"
    }
  });
  return comments;
};
var getCommentById = async (workspaceId, taskId, commentId, userId) => {
  await checkTaskAccess(workspaceId, taskId, userId);
  const comment = await prisma.comment.findFirst({
    where: {
      id: commentId,
      taskId,
      isDeleted: false
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      }
    }
  });
  if (!comment) {
    throw new appError_default(status12.NOT_FOUND, "Comment not found");
  }
  return comment;
};
var createComment = async (workspaceId, taskId, payload, userId) => {
  const { task } = await checkTaskAccess(workspaceId, taskId, userId);
  const result = await prisma.$transaction(async (tx) => {
    const comment = await tx.comment.create({
      data: {
        content: payload.content,
        taskId,
        authorId: userId
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    });
    await activityService.createActivity(
      {
        action: ActivityAction.COMMENT_ADDED,
        entityType: ActivityEntity.COMMENT,
        entityId: comment.id,
        workspaceId,
        projectId: task.projectId,
        taskId: task.id,
        performedBy: userId,
        description: `A comment was added to task "${task.title}".`
      },
      tx
    );
    return comment;
  });
  return result;
};
var updateComment = async (workspaceId, taskId, commentId, payload, userId) => {
  const { task } = await checkTaskAccess(workspaceId, taskId, userId);
  const { membership } = await checkTaskAccess(workspaceId, taskId, userId);
  const comment = await prisma.comment.findFirst({
    where: {
      id: commentId,
      taskId,
      isDeleted: false
    }
  });
  if (!comment) {
    throw new appError_default(status12.NOT_FOUND, "Comment not found");
  }
  const isOwner = comment.authorId === userId;
  const isWorkspaceAuthority = membership.role === WorkspaceRole.OWNER || membership.role === WorkspaceRole.ADMIN;
  if (!isOwner && !isWorkspaceAuthority) {
    throw new appError_default(
      status12.FORBIDDEN,
      "You can only update your own comments."
    );
  }
  const result = await prisma.$transaction(async (tx) => {
    const updatedComment = await tx.comment.update({
      where: {
        id: commentId
      },
      data: {
        content: payload.content
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    });
    await activityService.createActivity(
      {
        action: ActivityAction.COMMENT_UPDATED,
        entityType: ActivityEntity.COMMENT,
        entityId: commentId,
        workspaceId,
        projectId: task.projectId,
        taskId,
        performedBy: userId,
        description: `A comment on task "${task.title}" was updated.`
      },
      tx
    );
    return updatedComment;
  });
  return result;
};
var deleteComment = async (workspaceId, taskId, commentId, userId) => {
  const { task, membership } = await checkTaskAccess(
    workspaceId,
    taskId,
    userId
  );
  const comment = await prisma.comment.findFirst({
    where: {
      id: commentId,
      taskId,
      isDeleted: false
    }
  });
  if (!comment) {
    throw new appError_default(status12.NOT_FOUND, "Comment not found");
  }
  const isOwner = comment.authorId === userId;
  const isWorkspaceAuthority = membership.role === WorkspaceRole.OWNER || membership.role === WorkspaceRole.ADMIN;
  if (!isOwner && !isWorkspaceAuthority) {
    throw new appError_default(
      status12.FORBIDDEN,
      "You can only delete your own comments."
    );
  }
  const result = await prisma.$transaction(async (tx) => {
    const deletedComment = await tx.comment.update({
      where: {
        id: commentId
      },
      data: {
        isDeleted: true,
        deletedAt: /* @__PURE__ */ new Date()
      }
    });
    await activityService.createActivity(
      {
        action: ActivityAction.COMMENT_DELETED,
        entityType: ActivityEntity.COMMENT,
        entityId: comment.id,
        workspaceId,
        projectId: task.projectId,
        taskId: task.id,
        performedBy: userId,
        description: `A comment was deleted from task "${task.title}".`
      },
      tx
    );
    return deletedComment;
  });
  return result;
};
var commentService = {
  getTaskComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment
};

// src/app/modules/comment/comment.controller.ts
var getTaskComments2 = catchAsync_default(async (req, res) => {
  const { workspaceId, taskId } = req.params;
  const { userId } = req.user;
  const result = await commentService.getTaskComments(
    workspaceId,
    taskId,
    userId
  );
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "Comments retrieved successfully.",
    data: result
  });
});
var getCommentById2 = catchAsync_default(async (req, res) => {
  const { workspaceId, taskId, commentId } = req.params;
  const { userId } = req.user;
  const result = await commentService.getCommentById(
    workspaceId,
    taskId,
    commentId,
    userId
  );
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "Comment retrieved successfully.",
    data: result
  });
});
var createComment2 = catchAsync_default(async (req, res) => {
  const { workspaceId, taskId } = req.params;
  const { userId } = req.user;
  const result = await commentService.createComment(
    workspaceId,
    taskId,
    req.body,
    userId
  );
  sendResponse(res, {
    httpStatusCode: status13.CREATED,
    success: true,
    message: "Comment created successfully.",
    data: result
  });
});
var updateComment2 = catchAsync_default(async (req, res) => {
  const { workspaceId, taskId, commentId } = req.params;
  const { userId } = req.user;
  const result = await commentService.updateComment(
    workspaceId,
    taskId,
    commentId,
    req.body,
    userId
  );
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "Comment updated successfully.",
    data: result
  });
});
var deleteComment2 = catchAsync_default(async (req, res) => {
  const { workspaceId, taskId, commentId } = req.params;
  const { userId } = req.user;
  const result = await commentService.deleteComment(
    workspaceId,
    taskId,
    commentId,
    userId
  );
  sendResponse(res, {
    httpStatusCode: status13.OK,
    success: true,
    message: "Comment deleted successfully.",
    data: result
  });
});
var commentController = {
  getTaskComments: getTaskComments2,
  getCommentById: getCommentById2,
  createComment: createComment2,
  updateComment: updateComment2,
  deleteComment: deleteComment2
};

// src/app/modules/comment/comment.validation.ts
import z5 from "zod";
var createCommentZodSchema = z5.object({
  content: z5.string("Comment content is required").trim().min(1, "Comment cannot be empty").max(2e3, "Comment cannot exceed 2000 characters")
});
var updateCommentZodSchema = z5.object({
  content: z5.string("Comment content is required").trim().min(1, "Comment cannot be empty").max(2e3, "Comment cannot exceed 2000 characters")
});

// src/app/modules/comment/comment.route.ts
var router5 = Router5();
router5.post(
  "/workspaces/:workspaceId/projects/:projectId/tasks/:taskId/comments",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createCommentZodSchema),
  commentController.createComment
);
router5.get(
  "/workspaces/:workspaceId/projects/:projectId/tasks/:taskId/comments",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  commentController.getTaskComments
);
router5.get(
  "/workspaces/:workspaceId/projects/:projectId/tasks/:taskId/comments/:commentId",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  commentController.getCommentById
);
router5.patch(
  "/workspaces/:workspaceId/projects/:projectId/tasks/:taskId/comments/:commentId",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateCommentZodSchema),
  commentController.updateComment
);
router5.patch(
  "/workspaces/:workspaceId/projects/:projectId/tasks/:taskId/comments/:commentId/delete",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  commentController.deleteComment
);
var commentRoutes = router5;

// src/app/modules/activity/activity.route.ts
import { Router as Router6 } from "express";

// src/app/modules/activity/activity.controller.ts
import status14 from "http-status";
var getWorkspaceActivities2 = catchAsync_default(
  async (req, res) => {
    const { workspaceId } = req.params;
    const { userId } = req.user;
    const result = await activityService.getWorkspaceActivities(
      workspaceId,
      userId
    );
    sendResponse(res, {
      httpStatusCode: status14.OK,
      success: true,
      message: "Workspace activities retrieved successfully.",
      data: result
    });
  }
);
var getTaskActivities2 = catchAsync_default(async (req, res) => {
  const { workspaceId, taskId } = req.params;
  const { userId } = req.user;
  const result = await activityService.getTaskActivities(
    workspaceId,
    taskId,
    userId
  );
  sendResponse(res, {
    httpStatusCode: status14.OK,
    success: true,
    message: "Task activities retrieved successfully.",
    data: result
  });
});
var activityController = {
  getWorkspaceActivities: getWorkspaceActivities2,
  getTaskActivities: getTaskActivities2
};

// src/app/modules/activity/activity.route.ts
var router6 = Router6();
router6.get(
  "/:workspaceId",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  activityController.getWorkspaceActivities
);
router6.get(
  "/:workspaceId/tasks/:taskId",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  activityController.getTaskActivities
);
var activityRoutes = router6;

// src/app/modules/user/user.route.ts
import { Router as Router7 } from "express";

// src/app/modules/user/user.validation.ts
import z6 from "zod";
var createAdminZodSchema = z6.object({
  password: z6.string("Password is required").min(6, "Password must be at least 6 characters").max(20, "Password must be at most 20 characters"),
  admin: z6.object({
    name: z6.string("Name is required and must be string").min(5, "Name must be at least 5 characters").max(30, "Name must be at most 30 characters"),
    email: z6.email("Invalid email address"),
    contactNumber: z6.string("Contact number is required").min(11, "Contact number must be at least 11 characters").max(14, "Contact number must be at most 15 characters").optional(),
    profilePhoto: z6.url("Profile photo must be a valid URL").optional()
  })
});

// src/app/modules/user/user.service.ts
var createAdmin = async (payload) => {
  const userExists = await prisma.user.findUnique({
    where: {
      email: payload.admin.email
    }
  });
  if (userExists) {
    throw new Error(
      `User already exists with the email ${payload.admin.email}`
    );
  }
  const userData = await auth.api.signUpEmail({
    body: {
      email: payload.admin.email,
      password: payload.password,
      role: Role.ADMIN,
      name: payload.admin.name
    }
  });
  try {
    const result = await prisma.$transaction(async (tx) => {
      const admin = await tx.admin.create({
        data: {
          userId: userData.user.id,
          ...payload.admin
        }
      });
      const createdAdmin = await tx.admin.findUnique({
        where: { id: admin.id },
        select: {
          id: true,
          name: true,
          email: true,
          profilePhoto: true,
          contactNumber: true,
          isDeleted: true,
          createdAt: true,
          updatedAt: true,
          user: true
        }
      });
      return createdAdmin;
    });
    return result;
  } catch (error) {
    console.log("Transaction error : ", error);
    await prisma.user.delete({
      where: {
        id: userData.user.id
      }
    });
    throw error;
  }
};
var createSuperAdmin = async (payload) => {
  const userExists = await prisma.user.findUnique({
    where: {
      email: payload.admin.email
    }
  });
  if (userExists) {
    throw new Error(
      `User already exists with the email ${payload.admin.email}`
    );
  }
  const userData = await auth.api.signUpEmail({
    body: {
      email: payload.admin.email,
      password: payload.password,
      role: Role.SUPER_ADMIN,
      name: payload.admin.name
    }
  });
  try {
    const result = await prisma.$transaction(async (tx) => {
      const superadmin = await tx.admin.create({
        data: {
          userId: userData.user.id,
          ...payload.admin
        }
      });
      const createdSuperAdmin = await tx.admin.findUnique({
        where: { id: superadmin.id },
        select: {
          id: true,
          name: true,
          email: true,
          profilePhoto: true,
          contactNumber: true,
          isDeleted: true,
          createdAt: true,
          updatedAt: true,
          user: true
        }
      });
      return createdSuperAdmin;
    });
    return result;
  } catch (error) {
    console.log("Transaction error : ", error);
    await prisma.user.delete({
      where: {
        id: userData.user.id
      }
    });
    throw error;
  }
};
var userService = {
  createAdmin,
  createSuperAdmin
};

// src/app/modules/user/user.controller.ts
import status15 from "http-status";
var createAdmin2 = catchAsync_default(async (req, res) => {
  const payload = req.body;
  const result = await userService.createAdmin(payload);
  sendResponse(res, {
    httpStatusCode: status15.OK,
    success: true,
    message: "Admin registered successfully",
    data: result
  });
});
var createSuperAdmin2 = catchAsync_default(async (req, res) => {
  const payload = req.body;
  const result = await userService.createSuperAdmin(payload);
  sendResponse(res, {
    httpStatusCode: status15.OK,
    success: true,
    message: "Super Admin registered successfully",
    data: result
  });
});
var userController = {
  createAdmin: createAdmin2,
  createSuperAdmin: createSuperAdmin2
};

// src/app/modules/user/user.route.ts
var router7 = Router7();
router7.post(
  "/create-admin",
  validateRequest(createAdminZodSchema),
  checkAuth(Role.SUPER_ADMIN),
  userController.createAdmin
);
router7.post(
  "/create-super-admin",
  validateRequest(createAdminZodSchema),
  checkAuth(Role.SUPER_ADMIN),
  userController.createSuperAdmin
);
var userRoutes = router7;

// src/app/modules/admin/admin.route.ts
import { Router as Router8 } from "express";

// src/app/modules/admin/admin.controller.ts
import status17 from "http-status";

// src/app/modules/admin/admin.service.ts
import status16 from "http-status";
var getAllUsers = async () => {
  const user = await prisma.user.findMany();
  return user;
};
var getUserById = async (id) => {
  const admin = await prisma.user.findUnique({
    where: {
      id
    }
  });
  return admin;
};
var getAllAdmins = async () => {
  const admins = await prisma.admin.findMany({
    include: {
      user: true
    }
  });
  return admins;
};
var getAdminById = async (id) => {
  const admin = await prisma.admin.findUnique({
    where: {
      id
    },
    include: {
      user: true
    }
  });
  return admin;
};
var updateAdmin = async (id, payload) => {
  const isAdminExist = await prisma.admin.findUnique({
    where: {
      id
    }
  });
  if (!isAdminExist) {
    throw new appError_default(status16.NOT_FOUND, "Admin Or Super Admin not found");
  }
  const { admin } = payload;
  const updatedAdmin = await prisma.admin.update({
    where: {
      id
    },
    data: {
      ...admin
    }
  });
  return updatedAdmin;
};
var deleteAdmin = async (id, user) => {
  const isAdminExist = await prisma.admin.findUnique({
    where: {
      id
    }
  });
  if (!isAdminExist) {
    throw new appError_default(status16.NOT_FOUND, "Admin Or Super Admin not found");
  }
  if (isAdminExist.id === user.userId) {
    throw new appError_default(status16.BAD_REQUEST, "You cannot delete yourself");
  }
  const result = await prisma.$transaction(async (tx) => {
    await tx.admin.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: /* @__PURE__ */ new Date()
      }
    });
    await tx.user.update({
      where: { id: isAdminExist.userId },
      data: {
        isDeleted: true,
        deletedAt: /* @__PURE__ */ new Date(),
        status: UserStatus.DELETED
      }
    });
    await tx.session.deleteMany({
      where: { userId: isAdminExist.userId }
    });
    await tx.account.deleteMany({
      where: { userId: isAdminExist.userId }
    });
    const admin = await getAdminById(id);
    return admin;
  });
  return result;
};
var AdminService = {
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  getAllUsers,
  getUserById
};

// src/app/modules/admin/admin.controller.ts
var getAllUsers2 = catchAsync_default(async (req, res) => {
  const result = await AdminService.getAllUsers();
  console.log(result);
  sendResponse(res, {
    httpStatusCode: status17.OK,
    success: true,
    message: "Users fetched successfully",
    data: result
  });
});
var getUserById2 = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const user = await AdminService.getUserById(id);
  sendResponse(res, {
    httpStatusCode: status17.OK,
    success: true,
    message: "User fetched successfully",
    data: user
  });
});
var getAllAdmins2 = catchAsync_default(async (req, res) => {
  const result = await AdminService.getAllAdmins();
  sendResponse(res, {
    httpStatusCode: status17.OK,
    success: true,
    message: "Admins fetched successfully",
    data: result
  });
});
var getAdminById2 = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const admin = await AdminService.getAdminById(id);
  sendResponse(res, {
    httpStatusCode: status17.OK,
    success: true,
    message: "Admin fetched successfully",
    data: admin
  });
});
var updateAdmin2 = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const updatedAdmin = await AdminService.updateAdmin(id, payload);
  sendResponse(res, {
    httpStatusCode: status17.OK,
    success: true,
    message: "Admin updated successfully",
    data: updatedAdmin
  });
});
var deleteAdmin2 = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const result = await AdminService.deleteAdmin(id, user);
  sendResponse(res, {
    httpStatusCode: status17.OK,
    success: true,
    message: "Admin deleted successfully",
    data: result
  });
});
var AdminController = {
  getAllUsers: getAllUsers2,
  getUserById: getUserById2,
  getAllAdmins: getAllAdmins2,
  updateAdmin: updateAdmin2,
  deleteAdmin: deleteAdmin2,
  getAdminById: getAdminById2
};

// src/app/modules/admin/admin.validation.ts
import z7 from "zod";
var updateAdminZodSchema = z7.object({
  admin: z7.object({
    name: z7.string("Name must be a string").optional(),
    profilePhoto: z7.url("Profile photo must be a valid URL").optional(),
    contactNumber: z7.string("Contact number must be a string").min(11, "Contact number must be at least 11 characters").max(14, "Contact number must be at most 15 characters").optional()
  }).optional()
});

// src/app/modules/admin/admin.route.ts
var router8 = Router8();
router8.get(
  "/users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  AdminController.getAllUsers
);
router8.get(
  "/users/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  AdminController.getUserById
);
router8.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  AdminController.getAllAdmins
);
router8.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  AdminController.getAdminById
);
router8.patch(
  "/:id",
  checkAuth(Role.SUPER_ADMIN),
  validateRequest(updateAdminZodSchema),
  AdminController.updateAdmin
);
router8.delete("/:id", checkAuth(Role.SUPER_ADMIN), AdminController.deleteAdmin);
var AdminRoutes = router8;

// src/app/routes/index.ts
var router9 = Router9();
router9.use("/auth", authRoutes);
router9.use("/workspaces", workspaceRoutes);
router9.use("/projects", projectRoutes);
router9.use("/tasks", taskRoutes);
router9.use("/comments", commentRoutes);
router9.use("/activities", activityRoutes);
router9.use("/admins", AdminRoutes);
router9.use("/users", userRoutes);
var indexRoutes = router9;

// src/app.ts
import { toNodeHandler } from "better-auth/node";

// src/app/middleware/notFound.ts
import status18 from "http-status";
var notFound = (req, res) => {
  res.status(status18.NOT_FOUND).json({
    success: false,
    message: "Route not found"
  });
};

// src/app/middleware/globalErrorHandler.ts
import status20 from "http-status";
import z8 from "zod";

// src/app/errorHelpers/handleZodError.ts
import status19 from "http-status";
var handleZodError = (err) => {
  const statusCode = status19.BAD_REQUEST;
  const message = "Zod validation error";
  const errorSource = [];
  err.issues.forEach((issue) => {
    errorSource.push({
      path: issue.path.join(".") || "unknown",
      message: issue.message
    });
  });
  return {
    statusCode,
    success: false,
    message,
    errorSource
  };
};

// src/app/middleware/globalErrorHandler.ts
var globalErrorHandler = async (err, req, res, next) => {
  if (envVars.NODE_ENV === "development") {
    console.log("Error from Global Error Handler ", err);
  }
  let errorSource = [];
  let statusCode = status20.INTERNAL_SERVER_ERROR;
  let message = "Internal server error";
  let stack = void 0;
  if (err instanceof z8.ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSource.push(...simplifiedError.errorSource);
    stack = err.stack;
  } else if (err instanceof appError_default) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSource = [
      {
        path: "",
        message: err.message
      }
    ];
  } else if (err instanceof Error) {
    statusCode = status20.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
    errorSource = [
      {
        path: "",
        message: err.message
      }
    ];
  }
  const errorResponse = {
    success: false,
    message,
    errorSource,
    error: envVars.NODE_ENV === "development" ? err : void 0,
    stack: envVars.NODE_ENV === "development" ? stack : void 0
  };
  res.status(statusCode).json(errorResponse);
};

// src/app.ts
import cookieParser from "cookie-parser";
import cors from "cors";
var app = express();
app.use(
  cors({
    origin: [
      envVars.google.FRONTEND_URL,
      envVars.BETTER_AUTH_URL,
      "http://localhost:3000",
      "http://localhost:5000"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", toNodeHandler(auth));
app.use("/api/v1", indexRoutes);
app.get("/", (req, res) => {
  res.send("Hello, TypeScript + Express!");
});
app.use(notFound);
app.use(globalErrorHandler);
var app_default = app;

// src/server.ts
var server;
var bootstrap = async () => {
  try {
    server = app_default.listen(envVars.PORT, () => {
      console.log(`Server is running on http://localhost:${envVars.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received. Shutting down server...");
  if (server) {
    server.close(() => {
      console.log("Server closed gracefully.");
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("SIGINT", () => {
  console.log("SIGINT signal received. Shutting down server...");
  if (server) {
    server.close(() => {
      console.log("Server closed gracefully.");
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("uncaughtException", (error) => {
  console.log("Uncaught Exception Detected... Shutting down server", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("unhandledRejection", (error) => {
  console.log("Unhandled Rejection Detected... Shutting down server", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
bootstrap();
