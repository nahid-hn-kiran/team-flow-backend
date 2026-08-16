import z from "zod";

export const workspaceCreateZodSchema = z.object({
  name: z
    .string("Workspace name is required")
    .trim()
    .min(2, "Workspace name must be at least 2 characters long")
    .max(100, "Workspace name cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(500, "Workspace description cannot exceed 500 characters")
    .optional(),
});

export const workspaceUpdateZodSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Workspace name must be at least 2 characters long")
      .max(100, "Workspace name cannot exceed 100 characters")
      .optional(),

    description: z
      .string()
      .trim()
      .max(500, "Workspace description cannot exceed 500 characters")
      .optional(),
  })
  .refine((data) => data.name !== undefined || data.description !== undefined, {
    message: "At least one field is required to update workspace.",
  });

export const addWorkspaceMemberZodSchema = z.object({
  userId: z.string().min(1, "User ID is required"),

  role: z.enum(["ADMIN", "MEMBER"]).default("MEMBER"),
});

export const updateWorkspaceMemberRoleZodSchema = z.object({
  role: z.enum(["ADMIN", "MEMBER"]),
});
