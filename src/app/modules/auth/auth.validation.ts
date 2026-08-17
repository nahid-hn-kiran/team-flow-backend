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

export const forgotPasswordSchema = z.object({
  email: z.email({
    message: "Please provide a valid email address",
  }),
});

export const updateMyProfileZodSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long.")
    .max(100, "Name cannot exceed 100 characters.")
    .optional(),

  image: z.string().url("Image must be a valid URL.").optional(),

  contactNumber: z
    .string()
    .min(6, "Contact number is too short.")
    .max(20, "Contact number is too long.")
    .optional(),
});

export const changePasswordZodSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),

    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters long.")
      .max(100, "New password cannot exceed 100 characters."),

    confirmPassword: z.string().min(1, "Please confirm your new password."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password.",
    path: ["newPassword"],
  });
