import { Router } from "express";
import { z } from "zod";
import { IStorage } from "./storage";
import { loginSchema, loginResponseSchema, signupSchema, signupResponseSchema } from "@shared/schema";

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

  return router;
}
