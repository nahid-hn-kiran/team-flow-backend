import z from "zod";

export const createProjectZodSchema = z.object({
  name: z
    .string("Project name is required")
    .trim()
    .min(2, "Project name must be at least 2 characters long")
    .max(100, "Project name cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .max(500, "Project description cannot exceed 500 characters")
    .optional(),
});

export const updateProjectZodSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Project name must be at least 2 characters long")
      .max(100, "Project name cannot exceed 100 characters")
      .optional(),

    description: z
      .string()
      .trim()
      .max(500, "Project description cannot exceed 500 characters")
      .optional(),
  })
  .refine((data) => data.name !== undefined || data.description !== undefined, {
    message: "At least one field is required.",
  });
