import { Router } from "express";
import { z } from "zod";
import { IStorage } from "./storage";
import { loginSchema, loginResponseSchema, signupSchema, signupResponseSchema, invitationCodeSchema, invitationCodeResponseSchema } from "@shared/schema";

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

// Extend session interface
declare module "express-session" {
  interface SessionData {
    userId?: string;
    username?: string;
    email?: string;
  }
}

// Authentication middleware
function requireAuth(req: any, res: any, next: any) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }
  next();
}

// Check if user is authenticated
function isAuthenticated(req: any, res: any, next: any) {
  if (req.session && req.session.userId) {
    return res.status(200).json({
      success: true,
      message: "User is authenticated",
      user: { id: req.session.userId },
    });
  }
  return res.status(401).json({
    success: false,
    message: "User is not authenticated",
  });
}

export function createRoutes(storage: IStorage) {
  const router = Router();

  // Login endpoint
  router.post("/api/login", async (req, res) => {
    try {
      const credentials = loginSchema.parse(req.body);
      const result = await storage.validateLogin(credentials);
      
      if (result.success && result.user) {
        // Set session data
        req.session.userId = result.user.id;
        req.session.username = result.user.username;
        req.session.email = result.user.email;
        
        // Save session
        req.session.save((err: any) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: "Session creation failed",
            });
          }
          
          res.json({
            ...result,
            sessionId: req.sessionID,
          });
        });
      } else {
        res.json(result);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Invalid request data",
          errors: error.errors,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }
    }
  });

  // Logout endpoint
  router.post("/api/logout", (req, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Logout failed",
        });
      }
      
      res.json({
        success: true,
        message: "Logged out successfully",
      });
    });
  });

  // Check authentication status
  router.get("/api/auth/status", isAuthenticated);

  // Signup endpoint
  router.post("/api/signup", async (req, res) => {
    try {
      const userData = signupSchema.parse(req.body);
      const result = await storage.registerUser(userData);
      
      if (result.success && result.user) {
        // Set session data for newly registered user
        req.session.userId = result.user.id;
        req.session.username = result.user.username;
        req.session.email = result.user.email;
        
        // Save session
        req.session.save((err: any) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: "Session creation failed",
            });
          }
          
          res.json({
            ...result,
            sessionId: req.sessionID,
          });
        });
      } else {
        res.json(result);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Invalid request data",
          errors: error.errors,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }
    }
  });

  // Health check endpoint
  router.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Invitation code verification endpoint
  router.post("/api/verify-invitation", async (req, res) => {
    try {
      const { code } = invitationCodeSchema.parse(req.body);
      const result = await storage.verifyInvitationCode(code);
      res.json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          valid: false,
          message: "Invalid request data",
        });
      } else {
        res.status(500).json({
          valid: false,
          message: "Internal server error",
        });
      }
    }
  });

  // Username verification endpoint
  router.post("/api/verify-username", async (req, res) => {
    try {
      const { username } = req.body;
      if (typeof username !== 'string' || username.length < 3) {
        return res.status(400).json({ valid: false, message: "Invalid username" });
      }
      if (username === 'rashidvaya') {
        return res.json({ valid: true, message: "Username is available" });
      }
      const user = await storage.getUserByUsername(username);
      if (user) {
        return res.json({ valid: false, message: "Username is taken" });
      }
      return res.json({ valid: true, message: "Username is available" });
    } catch (error) {
      return res.status(500).json({ valid: false, message: "Internal server error" });
    }
  });

  // Staff code verification endpoint
  router.post("/api/verify-staff-code", async (req, res) => {
    try {
      const { code } = req.body;
      // Simulate real check: allow '1234', '5678', and '0000' as valid codes
      if (typeof code === 'string' && (code === '1234' || code === '5678' || code === '0000')) {
        return res.json({ valid: true });
      }
      res.json({ valid: false });
    } catch (error) {
      res.status(500).json({ valid: false, message: "Internal server error" });
    }
  });

  // Project Staff Registration endpoint
  router.post("/api/register-staff", async (req, res) => {
    // Simple validation for required fields
    const staffSchema = z.object({
      verifyCode: z.string().min(4, "Code required"),
      username: z.string().min(3, "Username required"),
      name: z.string().min(1, "Name required"),
      email: z.string().email("Valid email required"),
      phone: z.string().min(6, "Phone required"),
      password: z.string().min(6, "Password required"),
      role: z.string().min(1, "Role required"),
    });
    try {
      const staffData = staffSchema.parse(req.body);
      console.log("[register-staff] Incoming staffData:", staffData);
      // Check if username or email already exists
      const existingUser = await storage.getUserByUsername(staffData.username) || await storage.getUserByEmail(staffData.email);
      if (existingUser) {
        console.log("[register-staff] Username or email already exists:", staffData.username, staffData.email);
        return res.status(400).json({ success: false, message: "Username or email already exists" });
      }
      // Optionally: verify staff code here if needed
      // Create the staff user
      const newUser = await storage.registerStaff(staffData);
      console.log("[register-staff] New user created:", newUser);
      if (!newUser) {
        return res.status(500).json({ success: false, message: "Failed to create staff user (storage returned null)" });
      }
      res.json({ success: true, message: "Staff registered successfully", user: newUser });
    } catch (error) {
      console.error("[register-staff] Error:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid data", errors: error.errors });
      } else if (error instanceof Error) {
        res.status(500).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: "Internal server error" });
      }
    }
  });

  // Protected route example
  router.get("/api/profile", requireAuth, async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }
      
      const user = await storage.getUserById(req.session.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.json({
        success: true,
        user: userWithoutPassword,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  });

  return router;
}
