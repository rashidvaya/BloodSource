import { z } from "zod";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// Database table definition
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  fullName: text("full_name").notNull(),
  phone: text("phone").notNull(),
  division: text("division").notNull(),
  district: text("district").notNull(),
  mainPoint: text("main_point").notNull(),
  bloodGroup: text("blood_group", { enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] }).notNull(),
  gender: text("gender", { enum: ["Men", "Women", "Transgender"] }).notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  idType: text("id_type", { enum: ["Birth Certificate", "NID"] }).notNull(),
  idNumber: text("id_number").notNull(),
  password: text("password").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  role: text("role", { enum: ["super_admin", "regional_moderator", "volunteer_coordinator", "user"] }).notNull().default("user"),
  permissions: text("permissions", { mode: "json" }).notNull().default("[]"),
});

// Invitation codes table
export const invitationCodes = sqliteTable("invitation_codes", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  maxUses: integer("max_uses").notNull().default(1),
  currentUses: integer("current_uses").notNull().default(0),
  createdBy: text("created_by").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
});

// Database insert/select schemas
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertInvitationCodeSchema = createInsertSchema(invitationCodes);
export const selectInvitationCodeSchema = createSelectSchema(invitationCodes);

// User schema for potential future use
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string().min(1),
  fullName: z.string().min(1),
  phone: z.string().min(10),
  division: z.string().min(1),
  district: z.string().min(1),
  mainPoint: z.string().min(1),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  gender: z.enum(["Men", "Women", "Transgender"]),
  dateOfBirth: z.string().min(1),
  idType: z.enum(["Birth Certificate", "NID"]),
  idNumber: z.string().min(1),
  password: z.string().min(6, "Password must be at least 6 characters"),
  createdAt: z.date(),
  role: z.enum(["super_admin", "regional_moderator", "volunteer_coordinator", "user"]),
  permissions: z.union([
    z.array(z.string()),
    z.record(z.string(), z.any())
  ]),
});

export type User = z.infer<typeof userSchema>;

// User response type (without password for API responses)
export const userResponseSchema = userSchema.omit({ password: true });
export type UserResponse = z.infer<typeof userResponseSchema>;

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
  user: userResponseSchema.optional(),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;

// Signup schema - updated to match frontend form
export const signupSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  invitation: z.string()
    .min(6, "Invitation code must be 6 digits")
    .max(6, "Invitation code must be exactly 6 digits")
    .regex(/^\d{6}$/, "Invitation code must be exactly 6 digits"),
  division: z.string().min(1, "Division is required"),
  district: z.string().min(1, "District is required"),
  mainPoint: z.string().min(1, "Main Point is required"),
  bloodGroup: z.enum([
    "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"
  ], { required_error: "Blood group is required" }),
  gender: z.enum(["Men", "Women", "Transgender"], { required_error: "Gender is required" }),
  dateOfBirth: z.string().min(1, "Date of Birth is required"),
  idType: z.enum(["Birth Certificate", "NID"], { required_error: "ID Type is required" }),
  idNumber: z.string().min(1, "ID Number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  verify: z.string().min(6, "Please verify your password"),
}).refine((data) => data.password === data.verify, {
  message: "Passwords do not match",
  path: ["verify"],
}).superRefine((data, ctx) => {
  if (data.idType === "NID") {
    if (!/^\d+$/.test(data.idNumber)) {
      ctx.addIssue({
        path: ["idNumber"],
        code: z.ZodIssueCode.custom,
        message: "NID must be numeric (numbers only)",
      });
    }
  } else if (data.idType === "Birth Certificate") {
    if (!/^\d{17}$/.test(data.idNumber)) {
      ctx.addIssue({
        path: ["idNumber"],
        code: z.ZodIssueCode.custom,
        message: "Birth Certificate must be numeric and exactly 17 digits",
      });
    }
  }
});

export type SignupRequest = z.infer<typeof signupSchema>;

export const signupResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  user: userResponseSchema.optional(),
});

export type SignupResponse = z.infer<typeof signupResponseSchema>;

// Invitation code verification schema
export const invitationCodeSchema = z.object({
  code: z.string()
    .min(6, "Invitation code must be 6 digits")
    .max(6, "Invitation code must be exactly 6 digits")
    .regex(/^\d{6}$/, "Invitation code must be exactly 6 digits"),
});

export type InvitationCodeRequest = z.infer<typeof invitationCodeSchema>;

export const invitationCodeResponseSchema = z.object({
  valid: z.boolean(),
  message: z.string(),
});

export type InvitationCodeResponse = z.infer<typeof invitationCodeResponseSchema>;

// Invitation code management schemas
export const invitationCodeCreateSchema = z.object({
  code: z.string()
    .min(6, "Invitation code must be 6 digits")
    .max(6, "Invitation code must be exactly 6 digits")
    .regex(/^\d{6}$/, "Invitation code must be exactly 6 digits"),
  maxUses: z.number().min(1, "Max uses must be at least 1").default(1),
  expiresAt: z.date().optional(),
});

export type InvitationCodeCreateRequest = z.infer<typeof invitationCodeCreateSchema>;

export const invitationCodeCreateResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  code: z.string().optional(),
});

export type InvitationCodeCreateResponse = z.infer<typeof invitationCodeCreateResponseSchema>;
