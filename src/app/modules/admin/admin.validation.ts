import z from "zod";
import { TaskPriority, TaskStatus } from "../../../generated/prisma/enums";

export const createTaskZodSchema = z.object({
  title: z
    .string("Task title is required")
    .min(2, "Task title must be at least 2 characters")
    .max(200, "Task title cannot exceed 200 characters"),

  description: z
    .string()
    .max(2000, "Description cannot exceed 2000 characters")
    .optional(),

  priority: z.enum(TaskPriority).optional(),

  dueDate: z.iso
    .datetime({ message: "Due date must be a valid datetime" })
    .optional(),

  assignedTo: z.string().optional(),
});

export const updateTaskZodSchema = z.object({
  title: z.string().min(2).max(200).optional(),

  description: z.string().max(2000).optional(),

  priority: z.enum(TaskPriority).optional(),

  dueDate: z.iso.datetime().nullable().optional(),

  assignedTo: z.string().nullable().optional(),

  status: z.enum(TaskStatus).optional(),
});

export const updateTaskStatusZodSchema = z.object({
  status: z.enum(TaskStatus),
});

export const assignTaskZodSchema = z.object({
  assignedTo: z.string().nullable(),
});
