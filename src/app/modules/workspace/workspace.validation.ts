import z from "zod";

export const workspaceCreateZodSchema = z.object({
  name: z.string("Name is required"),
  description: z.string().optional(),
});
