import { z } from "zod";

export const roleEnum = z.enum(["ADMIN", "USER"]);

export const userSchema = z.object({
  id: z.cuid(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username may only contain letters, numbers, and underscores",
    )
    .trim(),

  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .trim(),
  email: z.email().min(1),

  role: roleEnum,
  lastLoginAt: z.iso.datetime(),

  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const createUserSchema = userSchema
  .omit({
    id: true,
    createdAt: true,
    lastLoginAt: true,
    updatedAt: true,
  })
  .extend({
    password: z.string().min(3).max(100),
  });

export const updateUserSchema = userSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    lastLoginAt: true,
  })
  .extend({
    oldPassword: z
      .string()
      .min(3, "Old password minimal 3 karakter")
      .optional(),
    newPassword: z
      .string()
      .min(3, "New password minimal 3 karakter")
      .optional(),
  })
  .partial();

export type User = z.infer<typeof userSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
