import { Router } from "express";
import { z } from "zod";
import { IStorage } from "./storage";
import { loginSchema, loginResponseSchema, signupSchema, signupResponseSchema, invitationCodeSchema, invitationCodeResponseSchema } from "@shared/schema";

export function createRoutes(storage: IStorage) {
  const router = Router();

  // Login endpoint
  router.post("/api/login", async (req, res) => {
    try {
      const credentials = loginSchema.parse(req.body);
      const result = await storage.validateLogin(credentials);
      
      res.json(result);
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

  // Signup endpoint
  router.post("/api/signup", async (req, res) => {
    try {
      const userData = signupSchema.parse(req.body);
      const result = await storage.registerUser(userData);
      
      res.json(result);
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

  return router;
}
