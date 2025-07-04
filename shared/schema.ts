import { z } from "zod";

// User schema for potential future use
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string().min(1),
  createdAt: z.date(),
});

export type User = z.infer<typeof userSchema>;

// Login schema
export const loginSchema = z.object({
  username: z.string().min(1, "Email address or phone number is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginRequest = z.infer<typeof loginSchema>;

// Response schemas
export const loginResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  user: userSchema.optional(),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;
