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

// Signup schema
export const signupSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SignupRequest = z.infer<typeof signupSchema>;

export const signupResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  user: userSchema.optional(),
});

export type SignupResponse = z.infer<typeof signupResponseSchema>;

// Invitation code verification schema
export const invitationCodeSchema = z.object({
  code: z.string().min(6, "Invitation code is required"),
});

export type InvitationCodeRequest = z.infer<typeof invitationCodeSchema>;

export const invitationCodeResponseSchema = z.object({
  valid: z.boolean(),
  message: z.string(),
});

export type InvitationCodeResponse = z.infer<typeof invitationCodeResponseSchema>;
