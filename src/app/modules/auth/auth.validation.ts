import z from "zod";

export const userRegisterZodSchema = z.object({
  name: z.string("Name is required"),
  email: z.email({
    message: "Please provide a valid email address",
  }),
  password: z.string("Password is required").min(6, {
    message: "Password must be at least 6 characters long",
  }),
});

export const userLoginZodSchema = z.object({
  email: z.email({
    message: "Please provide a valid email address",
  }),
  password: z.string("Password is required").min(6, {
    message: "Password must be at least 6 characters long",
  }),
});
