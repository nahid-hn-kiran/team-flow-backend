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
  email: z.email({
    message: "Please provide a valid email address.",
  }),

  role: z.enum(["ADMIN", "MEMBER"]).default("MEMBER"),
});

export const updateWorkspaceMemberZodSchema = z.object({
  role: z.enum(["ADMIN", "MEMBER"]),
});
