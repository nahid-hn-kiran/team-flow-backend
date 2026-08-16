import z from "zod";

export const createCommentZodSchema = z.object({
  content: z
    .string("Comment content is required")
    .trim()
    .min(1, "Comment cannot be empty")
    .max(2000, "Comment cannot exceed 2000 characters"),
});

export const updateCommentZodSchema = z.object({
  content: z
    .string("Comment content is required")
    .trim()
    .min(1, "Comment cannot be empty")
    .max(2000, "Comment cannot exceed 2000 characters"),
});
