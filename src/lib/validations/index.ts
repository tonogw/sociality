import { z } from "zod";

// ==========================================
// 1. BASE OBJECT FOR AUTH / USER
// ==========================================
export const baseUserObject = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 digits" }),
});

// ==========================================
// 2. REGISTER SCHEMA (With Password Matching)
// ==========================================
export const registerSchema = baseUserObject
  .extend({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ==========================================
// 3. LOGIN SCHEMA
// ==========================================
export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

// ==========================================
// 4. UPDATE PROFILE SCHEMA (Social Media Version)
// ==========================================
// Digunakan saat user edit profil (ganti nama, username, phone, atau bio/avatar jika ada)
export const updateProfileSchema = baseUserObject.extend({
  bio: z
    .string()
    .max(160, { message: "Bio cannot exceed 160 characters" })
    .optional(),
  avatarUrl: z.string().url().optional().or(z.literal("")),
});

export type RegisterUser = z.infer<typeof registerSchema>;
export type LoginInputs = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateProfileSchema>;
